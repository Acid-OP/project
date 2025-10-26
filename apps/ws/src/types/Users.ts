export const SUBSCRIBE = "SUBSCRIBE";
export const UNSUBSCRIBE = "UNSUBSCRIBE";

export type SubscribeMessage = {
    method: typeof SUBSCRIBE,
    params: string[]
}

export type UnsubscribeMessage = {
    method: typeof UNSUBSCRIBE,
    params: string[]
}

export type IncomingMessage = SubscribeMessage | UnsubscribeMessage;

export type TickerUpdateMessage = {
    type: "ticker",
    data: {
        event: "ticker",
        symbol: string,                    
        price: string,                    
        quantity: string,                 
        side: "buy" | "sell",             
        priceChange: string,              
        priceChangePercent: string,      
        high24h: string,                  
        low24h: string,                    
        volume24h: string,               
        quoteVolume24h: string,       
        timestamp: number              
    }
}

export type DepthUpdateMessage = {
    type: "depth",
    data: {
        event: "depth",
        symbol: string,                   
        bids: [string, string][],        
        asks: [string, string][],         
        timestamp: number               
    }
}

export type TradeUpdateMessage = {
    type: "trade",
    data: {
        event: "trade",
        tradeId: number,
        symbol: string,
        price: string,
        quantity: string,
        side: "buy" | "sell",
        timestamp: number
    }
}

export type OutgoingMessage = TickerUpdateMessage | DepthUpdateMessage | TradeUpdateMessage;