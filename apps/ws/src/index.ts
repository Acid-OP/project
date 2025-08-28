import WebSocket from 'ws';
import { createClient } from 'redis';
import { prismaClient, Prisma } from '@repo/db/client';

const subRedis = createClient();
const pubRedis = subRedis.duplicate();
await Promise.all([subRedis.connect(), pubRedis.connect()]);

const symbols = ['ethusdt', 'btcusdt', 'solusdt'];
const ws = new WebSocket(
  `wss://stream.binance.com:9443/stream?streams=${symbols
    .map(s => `${s}@trade`)
    .join('/')}`,
);

ws.on('open', () => {
  console.log('🔗 Connected to Binance WebSocket');
});

ws.on('message', raw => {
  try {
    const m = JSON.parse(raw.toString());
    const trade = {
      symbol: m.data.s, // This will be uppercase from Binance (ETHUSDT, BTCUSDT, etc.)
      price: Number(m.data.p),
      qty: Number(m.data.q),
      ts: m.data.T,
    };
    
    console.log(`📈 Trade: ${trade.symbol} @ $${trade.price}`);
    
    pubRedis.publish('trades', JSON.stringify(trade));
  } catch (err) {
    console.error('❌ Error processing trade:', err);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

type Bucket = {
  symbol: string;
  interval: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  startTime: number;
  endTime: number;
  tradeCount: number;
};

const intervals: Record<string, number> = {
  '1m': 60_000,
  '5m': 300_000,
  '15m': 900_000,
  '1h': 3_600_000,
  '4h': 14_400_000,
};

const active = new Map<string, Bucket>();
const batch: any[] = [];
const BATCH_SIZE = 50;
const BATCH_TIMEOUT = 30_000;

const key = (s: string, ts: number, i: string) => {
  const ms = intervals[i];
  return ms ? `${s}:${i}:${Math.floor(ts / ms) * ms}` : '';
};

const newBucket = (t: any, i: string): Bucket | null => {
  const ms = intervals[i];
  if (!ms) return null;
  const start = Math.floor(t.ts / ms) * ms;
  return {
    symbol: t.symbol, // Keep the symbol as received (uppercase)
    interval: i,
    open: t.price,
    high: t.price,
    low: t.price,
    close: t.price,
    volume: t.qty,
    startTime: start,
    endTime: start + ms,
    tradeCount: 1,
  };
};

const update = (b: Bucket, t: any) => {
  b.high = Math.max(b.high, t.price);
  b.low = Math.min(b.low, t.price);
  b.close = t.price;
  b.volume += t.qty;
  b.tradeCount += 1;
};

async function flushBatch() {
  if (!batch.length) return;
  const current = batch.splice(0, batch.length);
  
  console.log(`💾 Flushing ${current.length} candles to database`);
  
  try {
    await prismaClient.$transaction(tx =>
      Promise.all(
        current.map(c => {
          console.log(`📊 Upserting candle: ${c.symbol} ${c.interval} @ ${new Date(c.openTime)}`);
          return tx.ohlcvCandle.upsert({
            where: {
              symbol_interval_openTime: {
                symbol: c.symbol,
                interval: c.interval,
                openTime: BigInt(c.openTime),
              },
            },
            update: {
              closeTime: BigInt(c.closeTime),
              high: new Prisma.Decimal(c.high.toString()),
              low: new Prisma.Decimal(c.low.toString()),
              close: new Prisma.Decimal(c.close.toString()),
              volume: new Prisma.Decimal(c.volume.toString()),
              trades: c.trades,
            },
            create: {
              symbol: c.symbol,
              interval: c.interval,
              openTime: BigInt(c.openTime),
              closeTime: BigInt(c.closeTime),
              open: new Prisma.Decimal(c.open.toString()),
              high: new Prisma.Decimal(c.high.toString()),
              low: new Prisma.Decimal(c.low.toString()),
              close: new Prisma.Decimal(c.close.toString()),
              volume: new Prisma.Decimal(c.volume.toString()),
              trades: c.trades,
            },
          });
        }),
      ),
    );
    console.log(`✅ Successfully saved ${current.length} candles`);
  } catch (err) {
    console.error('❌ Error saving candles:', err);
    batch.unshift(...current);
  }
}

const commit = (bucket: Bucket) => {
  const candleData = {
    symbol: bucket.symbol,
    interval: bucket.interval,
    openTime: bucket.startTime,
    closeTime: bucket.endTime - 1,
    open: bucket.open,
    high: bucket.high,
    low: bucket.low,
    close: bucket.close,
    volume: bucket.volume,
    trades: bucket.tradeCount,
  };
  
  batch.push(candleData);
  console.log(`📦 Added candle to batch: ${bucket.symbol} ${bucket.interval} (batch size: ${batch.length})`);
  
  if (batch.length >= BATCH_SIZE) void flushBatch();
};

// Check for expired buckets every second
setInterval(() => {
  const now = Date.now();
  const expired: string[] = [];
  
  active.forEach((b, k) => {
    if (now >= b.endTime) {
      console.log(`⏰ Candle completed: ${b.symbol} ${b.interval} O:${b.open} H:${b.high} L:${b.low} C:${b.close}`);
      
      // Publish new candle
      pubRedis.publish('new_candles', JSON.stringify({
        symbol: b.symbol,
        interval: b.interval,
        openTime: b.startTime,
        closeTime: b.endTime - 1,
        open: b.open,
        high: b.high,
        low: b.low,
        close: b.close,
        volume: b.volume,
        trades: b.tradeCount,
      }));
      
      commit(b);
      expired.push(k);
    }
  });
  
  expired.forEach(k => active.delete(k));
}, 1_000);

// Flush batch periodically
setInterval(() => {
  if (batch.length) {
    console.log(`🔄 Periodic flush: ${batch.length} candles`);
    void flushBatch();
  }
}, BATCH_TIMEOUT);

// Process incoming trades
await subRedis.subscribe('trades', payload => {
  try {
    const t = JSON.parse(payload);
    
    for (const i of Object.keys(intervals)) {
      const k = key(t.symbol, t.ts, i);
      if (!k) continue;
      
      if (active.has(k)) {
        update(active.get(k)!, t);
      } else {
        const bucket = newBucket(t, i);
        if (bucket) {
          active.set(k, bucket);
          console.log(`🆕 New bucket: ${bucket.symbol} ${bucket.interval} @ ${new Date(bucket.startTime)}`);
        }
      }
    }
  } catch (err) {
    console.error('❌ Error processing trade for candles:', err);
  }
});

console.log('🚀 Candle processor started');

process.on('SIGINT', async () => {
  console.log('🛑 Shutting down...');
  if (batch.length) {
    console.log(`💾 Final flush: ${batch.length} candles`);
    await flushBatch();
  }
  ws.close();
  await Promise.all([subRedis.quit(), pubRedis.quit(), prismaClient.$disconnect()]);
  process.exit(0);
});