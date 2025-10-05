export type response = DepthUpdate | TradeUpdate ;

interface DepthUpdate {
    stream: string;
    data: {
        a?: [string, string][]; 
        b?: [string, string][]; 
        e: "depth";             
    }
}

interface TradeUpdate {
    stream: string;
    data: {
        e: "trade";             // event type for trade
        t: number;              // trade ID
        p: string;              // price
        q: string;              // quantity
        s: string;              // symbol/market
        side: "buy" | "sell";   // order side
        T: number;              // timestamp
    }
}