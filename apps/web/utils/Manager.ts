// utils/SignalingManager.ts

export interface Ticker {
  symbol: string;
  lastPrice: string;
  priceChange: string;
  priceChangePercent: string;
  high24h: string;
  low24h: string;
  volume24h: string;
  quoteVolume24h: string;
  lastQuantity: string;
  lastSide: 'buy' | 'sell';
  timestamp: number;
}

export interface DepthUpdate {
  symbol: string;
  bids: [string, string][];
  asks: [string, string][];
  timestamp: number;
}

export interface Trade {
  tradeId: number;
  symbol: string;
  price: string;
  quantity: string;
  side: 'buy' | 'sell';
  timestamp: number;
}

type MessageType = 'ticker' | 'depth' | 'trade';

interface Callback {
  id: string;
  callback: (data: any) => void;
}

export class SignalingManager {
  private ws: WebSocket;
  private static instance: SignalingManager;
  private initialized: boolean = false;
  private callbacks: Record<MessageType, Callback[]> = {
    ticker: [],
    depth: [],
    trade: []
  };
  
  private depthCache: Record<string, DepthUpdate> = {};
  private tradeCache: Record<string, Trade[]> = {};
  private subscribedSymbols: Set<string> = new Set();
  private pendingSubscriptions: string[] = [];

  private constructor() {
    this.ws = new WebSocket('ws://localhost:8080');
    this.init();
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new SignalingManager();
    }
    return this.instance;
  }

  private init() {
    this.ws.onopen = () => {
      console.log('✅ WebSocket Connected');
      this.initialized = true;
      
      this.pendingSubscriptions.forEach(symbol => {
        this.sendSubscribe(symbol);
      });
      this.pendingSubscriptions = [];
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('📩 Message received:', message);
      
      const stream = message.stream;
      const data = message.data;
      
      if (!stream || !data) return;

      const [type, symbol] = stream.split('@') as [MessageType, string];

      switch (type) {
        case 'ticker':
          this.handleTickerUpdate(symbol, data);
          break;
        case 'depth':
          this.handleDepthUpdate(symbol, data);
          break;
        case 'trade':
          this.handleTradeUpdate(symbol, data);
          break;
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ WebSocket Error:', error);
    };

    this.ws.onclose = () => {
      console.log('🔴 WebSocket Disconnected');
      this.initialized = false;
    };
  }

  public subscribe(symbol: string) {
    if (this.subscribedSymbols.has(symbol)) {
      console.log(`Already subscribed to ${symbol}`);
      return;
    }

    this.subscribedSymbols.add(symbol);

    if (this.initialized) {
      this.sendSubscribe(symbol);
    } else {
      this.pendingSubscriptions.push(symbol);
      console.log(`Buffering subscription for ${symbol}`);
    }
  }

  private sendSubscribe(symbol: string) {
    const subscribeMessage = {
      method: "SUBSCRIBE",
      params: [
        `${symbol}@depth`,
        `${symbol}@trade`,
        `${symbol}@ticker`
      ]
    };
    
    this.ws.send(JSON.stringify(subscribeMessage));
    console.log('📤 Subscription sent:', subscribeMessage);
  }

  public unsubscribe(symbol: string) {
    if (!this.subscribedSymbols.has(symbol)) {
      return;
    }

    const unsubscribeMessage = {
      method: "UNSUBSCRIBE",
      params: [
        `${symbol}@depth`,
        `${symbol}@trade`,
        `${symbol}@ticker`
      ]
    };

    if (this.initialized) {
      this.ws.send(JSON.stringify(unsubscribeMessage));
      console.log('📤 Unsubscription sent:', unsubscribeMessage);
    }

    this.subscribedSymbols.delete(symbol);
  }

  private handleTickerUpdate(symbol: string, data: any) {
    // Just pass through what backend sends - no calculations
    const ticker: Ticker = {
      symbol: symbol,
      lastPrice: data.price,
      priceChange: data.priceChange || '0',
      priceChangePercent: data.priceChangePercent || '0',
      high24h: data.high24h || '0',
      low24h: data.low24h || '0',
      volume24h: data.volume24h || '0',
      quoteVolume24h: data.quoteVolume24h || '0',
      lastQuantity: data.quantity,
      lastSide: data.side,
      timestamp: data.timestamp
    };

    this.callbacks.ticker.forEach(({ callback }) => {
      callback(ticker);
    });
  }

  private handleDepthUpdate(symbol: string, data: any) {
    const depthUpdate: DepthUpdate = {
      symbol: symbol,
      bids: data.bids,
      asks: data.asks,
      timestamp: data.timestamp
    };

    this.depthCache[symbol] = depthUpdate;

    this.callbacks.depth.forEach(({ callback }) => {
      callback(depthUpdate);
    });
  }

  private handleTradeUpdate(symbol: string, data: any) {
    const trade: Trade = {
      tradeId: data.tradeId,
      symbol: symbol,
      price: data.price,
      quantity: data.quantity,
      side: data.side,
      timestamp: data.timestamp
    };

    if (!this.tradeCache[symbol]) {
      this.tradeCache[symbol] = [];
    }
    this.tradeCache[symbol] = [trade, ...this.tradeCache[symbol]].slice(0, 100);

    this.callbacks.trade.forEach(({ callback }) => {
      callback(trade);
    });
  }

  public registerCallback(type: MessageType, callback: (data: any) => void, id: string) {
    this.callbacks[type].push({ callback, id });
  }

  public deRegisterCallback(type: MessageType, id: string) {
    const index = this.callbacks[type].findIndex(cb => cb.id === id);
    if (index !== -1) {
      this.callbacks[type].splice(index, 1);
    }
  }

  public getCachedDepth(symbol: string): DepthUpdate | null {
    return this.depthCache[symbol] || null;
  }

  public getCachedTrades(symbol: string): Trade[] {
    return this.tradeCache[symbol] || [];
  }

  public isConnected(): boolean {
    return this.initialized && this.ws.readyState === WebSocket.OPEN;
  }
}