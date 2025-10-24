export type SIDE = "buy" | "sell";
export type CREATE_ORDER = "CREATE_ORDER"
export type CANCEL_ORDER = "CANCEL_ORDER"
export type GET_DEPTH = "GET_DEPTH"
export type GET_TICKER = "GET_TICKER"
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
    payload: {
      aggregatedBids: [string, string][];
      aggregatedAsks: [string, string][];
    }
  } | {
    type: "TICKER",
    payload: {
      event: "ticker",
      symbol: string,
      price: string,
      quantity: string,
      side: "buy" | "sell",
      timestamp: number
    }
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
    timestamp: number;     
};

export type DepthData = {
    event: "depth";
    symbol: string;
    asks: [string, string][];
    bids: [string, string][];
    timestamp: number;
};
