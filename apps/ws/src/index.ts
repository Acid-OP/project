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
