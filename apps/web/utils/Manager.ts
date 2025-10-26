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
  buyPercentage?: number;
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
      
      const type = message.type as MessageType;
      const data = message.data;
      
      if (!type || !data) {
        console.warn('⚠️ Invalid message format:', message);
        return;
      }
  
    const symbol = data.symbol; 
    
    if (!symbol) {
      console.warn('⚠️ No symbol in message:', message);
      return;
    }
    console.log(`🎯 Processing ${type} for ${symbol}`);

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
      default:
        console.warn('⚠️ Unknown message type:', type);
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
    const ticker: Ticker = {
      symbol: data.symbol,
      lastPrice: data.price,
      priceChange: data.priceChange,
      priceChangePercent: data.priceChangePercent,
      high24h: data.high24h,
      low24h: data.low24h,
      volume24h: data.volume24h,
      quoteVolume24h: data.quoteVolume24h,
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
        bids: data.bids || [],  
        asks: data.asks || [],    
        timestamp: data.timestamp || Date.now()  
      };

      this.depthCache[symbol] = depthUpdate;

      this.callbacks.depth.forEach(({ callback }) => {
        callback(depthUpdate);
      });
  }

  private handleTradeUpdate(symbol: string, data: any) {
      const trade: Trade = {
        tradeId: data.t || 0,        
        symbol: symbol,
        price: data.p || '0',         
        quantity: data.q || '0',      
        side: data.side || 'buy',
        timestamp: data.T || Date.now()
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