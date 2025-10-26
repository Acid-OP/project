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

// ✅ FIXED: Using descriptive field names to match backend
export type TickerUpdateMessage = {
    type: "ticker",
    data: {
        event: "ticker",
        symbol: string,                    // Market pair (e.g., "CR7_USD")
        price: string,                     // Last trade price
        quantity: string,                  // Last trade quantity
        side: "buy" | "sell",             // Last trade side
        priceChange: string,               // Absolute price change from 24h open
        priceChangePercent: string,        // Percentage change (e.g., "4.00")
        high24h: string,                   // Highest price in 24h
        low24h: string,                    // Lowest price in 24h
        volume24h: string,                 // Total base asset volume in 24h
        quoteVolume24h: string,            // Total quote asset volume in 24h
        timestamp: number                  // Unix timestamp in milliseconds
    }
}

// ✅ FIXED: Using descriptive field names to match backend
export type DepthUpdateMessage = {
    type: "depth",
    data: {
        event: "depth",
        symbol: string,                    // Market pair
        bids: [string, string][],          // [[price, quantity], ...]
        asks: [string, string][],          // [[price, quantity], ...]
        timestamp: number                  // Unix timestamp
    }
}

// ✅ ADDED: Trade update message type
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