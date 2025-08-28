import WebSocket from 'ws';
import { createClient } from 'redis';

const symbols = ['ethusdt', 'btcusdt', 'solusdt'];
const binanceUrl = `wss://stream.binance.com:9443/stream?streams=${symbols.map(s => `${s}@trade`).join('/')}`;
const redis = createClient();

redis.connect().then(() => {
  console.log('✅ Connected to Redis');
}).catch((error) => {
  console.error('❌ Redis connection failed:', error);
});

const ws = new WebSocket(binanceUrl);

ws.on('open', () => {
  console.log('✅ Connected to Binance WebSocket');
});

ws.on('message', (raw) => {
  try {
    const message = JSON.parse(raw.toString());
    const trade = {
      symbol: message.data.s,
      price: parseFloat(message.data.p),
      qty: parseFloat(message.data.q),
      ts: message.data.T
    };
    redis.publish('trades', JSON.stringify(trade));
  } catch (error) {
    console.error('❌ Parse error:', error);
  }
});

ws.on('error', (error) => {
  console.error('❌ WebSocket error:', error);
});

const activeBuckets = new Map();
const intervals: Record<string, number> = {
  '1m': 60000,
  '5m': 300000,
  '15m': 900000,
  '1h': 3600000,
  '4h': 14400000
};

function getBucketKey(symbol: string, ts: number, interval: string): string {
  const intervalMs = intervals[interval];
  if (!intervalMs) return '';
  const bucketStart = Math.floor(ts / intervalMs) * intervalMs;
  return `${symbol}:${interval}:${bucketStart}`;
}

function createNewBucket(trade: any, interval: string) {
  const intervalMs = intervals[interval];
  if (!intervalMs) return null;
  const bucketStart = Math.floor(trade.ts / intervalMs) * intervalMs;
  return {
    symbol: trade.symbol,
    interval: interval,
    open: trade.price,
    high: trade.price,
    low: trade.price,
    close: trade.price,
    volume: trade.qty,
    startTime: bucketStart,
    endTime: bucketStart + intervalMs,
    tradeCount: 1
  };
}

function updateBucket(bucket: any, trade: any) {
  bucket.high = Math.max(bucket.high, trade.price);
  bucket.low = Math.min(bucket.low, trade.price);
  bucket.close = trade.price;
  bucket.volume += trade.qty;
  bucket.tradeCount += 1;
}

function publishCompletedBucket(bucket: any) {
  const candle = {
    symbol: bucket.symbol,
    interval: bucket.interval,
    openTime: bucket.startTime,
    closeTime: bucket.endTime - 1,
    open: bucket.open,
    high: bucket.high,
    low: bucket.low,
    close: bucket.close,
    volume: bucket.volume,
    trades: bucket.tradeCount
  };
  redis.publish('new_candles', JSON.stringify(candle));
  console.log(`📊 ${candle.interval} ${candle.symbol}: ${candle.close}`);
}

setInterval(() => {
  const now = Date.now();
  const keysToRemove: string[] = [];
  activeBuckets.forEach((bucket, key) => {
    if (now >= bucket.endTime) {
      publishCompletedBucket(bucket);
      keysToRemove.push(key);
    }
  });
  keysToRemove.forEach(key => activeBuckets.delete(key));
}, 1000);

redis.subscribe('trades', (message) => {
  try {
    const trade = JSON.parse(message);
    Object.keys(intervals).forEach(interval => {
      const bucketKey = getBucketKey(trade.symbol, trade.ts, interval);
      if (!bucketKey) return;
      
      if (activeBuckets.has(bucketKey)) {
        updateBucket(activeBuckets.get(bucketKey), trade);
      } else {
        const newBucket = createNewBucket(trade, interval);
        if (newBucket) {
          activeBuckets.set(bucketKey, newBucket);
        }
      }
    });
  } catch (error) {
    console.error('❌ OHLCV error:', error);
  }
});

process.on('SIGINT', () => {
  ws.close();
  redis.quit();
  process.exit(0);
});

console.log('📈 Multi-interval OHLCV Builder started');
