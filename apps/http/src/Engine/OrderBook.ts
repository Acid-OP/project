import { BASE_CURRENCY, Fill } from "./types/UserTypes";
import { Order } from "./types/UserTypes";

export class OrderBook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;
    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
      const parts = baseAsset.split("_");
      this.baseAsset = parts[0] || baseAsset;     
      this.quoteAsset = parts[1] || "USD";
      this.bids = bids;
      this.asks = asks;
      this.lastTradeId = lastTradeId || 0;
      this.currentPrice = currentPrice || 0;
    }

    getMarketPair() {
        return `${this.baseAsset}_${this.quoteAsset}`
    }
    private sortAsks() {
        this.asks.sort((a, b) => a.price - b.price);
    }
    private sortBids() {
        this.bids.sort((a, b) => b.price - a.price);
    }
    private matchBid(order:Order) {
        this.sortAsks();
        const fills:Fill[] = [];
        let executedQty = 0;

        for(let i=0 ; i<this.asks.length ; i++) {
            const ask = this.asks[i];
            if(!ask) continue;
            if(ask.userId === order.userId){
                continue;
            }
            if(ask.price<order.price && executedQty<order.quantity) {
                const filledQty = Math.min((order.quantity - executedQty), (ask.quantity - ask.filled));
                executedQty += filledQty;
                ask.filled += filledQty;
                fills.push({
                    price: ask.price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: ask.userId,
                    markerOrderId: ask.orderId
                });
            }
            if (ask.filled === ask.quantity) {
                this.asks.splice(i, 1);
                i--; 
            }
        }
        return {fills , executedQty};
    }
    addOrder(order:Order) {
        if(order.side === "buy") {
            const {executedQty , fills} = this.matchBid(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                console.log(`[OrderBook] Order fully filled`);
                return {
                    executedQty,
                    fills
                }
            }
            this.bids.push(order);
            this.sortBids(); 
            console.log(`[OrderBook] Remaining ${order.quantity - executedQty} added to order book`);
            return {
                executedQty,
                fills
            }

        }
    }
}