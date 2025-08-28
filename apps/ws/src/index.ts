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

ws.on('message', raw => {
  try {
    const m = JSON.parse(raw.toString());
    pubRedis.publish('trades', JSON.stringify({
      symbol: m.data.s,
      price: Number(m.data.p),
      qty:   Number(m.data.q),
      ts:    m.data.T,
    }),
  );
} catch (err) {
    // silent-fail 
  }
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
  '1m':  60_000,
  '5m':  300_000,
  '15m': 900_000,
  '1h':  3_600_000,
  '4h':  14_400_000,
};

const active = new Map<string, Bucket>();
const batch: any[] = [];
const BATCH_SIZE    = 50;
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
    symbol: t.symbol,
    interval: i,
    open: t.price,
    high: t.price,
    low:  t.price,
    close: t.price,
    volume: t.qty,
    startTime: start,
    endTime: start + ms,
    tradeCount: 1,
  };
};

const update = (b: Bucket, t: any) => {
  b.high        = Math.max(b.high, t.price);
  b.low         = Math.min(b.low, t.price);
  b.close       = t.price;
  b.volume     += t.qty;
  b.tradeCount += 1;
};

async function flushBatch() {
  if (!batch.length) return;
  const current = batch.splice(0, batch.length);
  try {
    await prismaClient.$transaction(tx =>
      Promise.all(
        current.map(c =>
          tx.ohlcvCandle.upsert({
            where: {
              symbol_interval_openTime: {
                symbol:   c.symbol,
                interval: c.interval,
                openTime: BigInt(c.openTime),
              },
            },
            update: {
              closeTime: BigInt(c.closeTime),
              high:     new Prisma.Decimal(c.high.toString()),
              low:      new Prisma.Decimal(c.low.toString()),
              close:    new Prisma.Decimal(c.close.toString()),
              volume:   new Prisma.Decimal(c.volume.toString()),
              trades:   c.trades,
            },
            create: {
              symbol:   c.symbol,
              interval: c.interval,
              openTime:  BigInt(c.openTime),
              closeTime: BigInt(c.closeTime),
              open:    new Prisma.Decimal(c.open.toString()),
              high:    new Prisma.Decimal(c.high.toString()),
              low:     new Prisma.Decimal(c.low.toString()),
              close:   new Prisma.Decimal(c.close.toString()),
              volume:  new Prisma.Decimal(c.volume.toString()),
              trades:  c.trades,
            },
          }),
        ),
      ),
    );
  } catch {
    batch.unshift(...current);   
  }
}

const commit = (c: any) => {
  batch.push(c);
  if (batch.length >= BATCH_SIZE) void flushBatch();
};

setInterval(() => {
  const now = Date.now();
  const expired: string[] = [];
  active.forEach((b, k) => {
    if (now >= b.endTime) {
      pubRedis.publish('new_candles', JSON.stringify({
        symbol: b.symbol,
        interval: b.interval,
        openTime: b.startTime,
        closeTime: b.endTime - 1,
        open: b.open,
        high: b.high,
        low:  b.low,
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

setInterval(() => { if (batch.length) void flushBatch(); }, BATCH_TIMEOUT);

await subRedis.subscribe('trades', payload => {
  try {
    const t = JSON.parse(payload);
    for (const i of Object.keys(intervals)) {
      const k = key(t.symbol, t.ts, i);
      if (!k) continue;
      active.has(k)
        ? update(active.get(k)!, t)
        : (newBucket(t, i) && active.set(k, newBucket(t, i)!));
    }
  } catch {}
});

process.on('SIGINT', async () => {
  if (batch.length) await flushBatch();
  ws.close();
  await Promise.all([subRedis.quit(), pubRedis.quit(), prismaClient.$disconnect()]);
  process.exit(0);
});
