export type SIDE = "buy" | "sell";
export type CREATE_ORDER = "CREATE_ORDER"
export type CANCEL_ORDER = "CANCEL_ORDER"
export type GET_DEPTH = "GET_DEPTH"
export type GET_TICKER = "GET_TICKER"
export type GET_KLINE = "GET_KLINE";
export type ResponseFromHTTP = {
    type: CREATE_ORDER;
    data: {
        market: string;
        price: string;
        quantity: string;
        side: SIDE;
        userId: string;
    };
  } | {
    type: CANCEL_ORDER,
    data: {
        orderId: string,
        market: string,
    }
  } | {
    type: GET_DEPTH,
    data: {
      market : string
    }
  } | {
    type: GET_TICKER,
    data: {
      market : string
    }
  } | {
    type: GET_KLINE,
    data: {
      market: string,
      interval?: string, 
      limit?: number     
  }
}

export type ResponseToHTTP = {
    type: "ORDER_PLACED",
    payload: {
      orderId: string,
      executedQty: number,
      fills: {
        price: string,
        qty: number,
        tradeId: number
      }[]
    }
  } | {
    type: "ORDER_CANCELLED",
    payload: {
      orderId: string,
      executedQty: number,
      remainingQty: number
    }
  } | {
    type: "DEPTH",
    payload: DepthData 
  } | {
    type: "TICKER",
    payload: TickerData
  } | {
    type: "KLINE",          
    payload: KlineData     
}
export type TradeData = {
    event: "trade";
    tradeId: number;
    price: string;
    quantity: string;
    symbol: string;
    side: "buy" | "sell";
    timestamp: number;
};

export type TickerData = {
    event: "ticker";
    symbol: string;    
    price: string;         
    quantity: string;    
    side: "buy" | "sell";  
    priceChange: string;           
    priceChangePercent: string; 
    high24h: string;              
    low24h: string;                
    volume24h: string;          
    quoteVolume24h: string;       
    timestamp: number;     
};
export type DepthData = {
    event: "depth";
    symbol: string;
    asks: [string, string][];
    bids: [string, string][];
    timestamp: number;
};

export interface TradeHistoryEntry {
    price: number;
    quantity: number;
    timestamp: number;
}

export interface MarketStats {
    open24h: number;
    high24h: number;
    low24h: number;
    volume24h: number;
    quoteVolume24h: number;
    lastPrice: number;
}

export interface KlineCandle {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface KlineData {
    symbol: string;
    interval: string;
    candles: KlineCandle[];
}  