import { BASE_CURRENCY, Fill, Order } from "../types/UserTypes";


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
            if(ask.price<=order.price && executedQty<order.quantity) {
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

    matchAsk(order:Order) {
        this.sortBids();
        const fills:Fill[] = [];
        let executedQty = 0;

        for (let i=0 ; i<this.bids.length; i++) {
            const bid = this.bids[i];
            if(!bid) continue;
            if(bid.userId === order.userId) {
                continue
            }
            if(bid.price >= order.price && executedQty < order.quantity) {
                const amountRemaining = Math.min(order.quantity - executedQty, (bid.quantity - bid.filled));
                executedQty += amountRemaining;
                bid.filled += amountRemaining;

                fills.push({
                    price: bid.price.toString(),
                    qty: amountRemaining,
                    tradeId: this.lastTradeId++,
                    otherUserId: bid.userId,
                    markerOrderId: bid.orderId
                });
            }
            if (bid && bid.filled === bid.quantity) {
                this.bids.splice(i, 1);
                i--;
            }
        }
        return {executedQty , fills};
    }

    getDepth() {
        const aggregatedBids: [string , string][] = [];
        const aggregatedAsks: [string , string][] = [];

        const bidLevels: Record<string, number> = {};
        const askLevels: Record<string, number> = {};

        for(let i=0 ; i < this.bids.length; i++ ) {
            const order = this.bids[i];
            if(order && typeof order.price === "number") {
                const pricekey = order.price.toString();
                const availableQty = order.quantity - (order.filled || 0);
                bidLevels[pricekey] = (bidLevels[pricekey] ?? 0) + availableQty; 
            }
        }

        for(let i=0 ; i< this.asks.length ; i++) {
            const order = this.asks[i];
            if(order && typeof order.price === "number") {
                const pricekey = order.price.toString();
                const availableQty = order.quantity - (order.filled || 0);
                askLevels[pricekey] = (askLevels[pricekey] ?? 0) + availableQty;
            }
        }

        for (const price in bidLevels){
            if(bidLevels[price]){
                aggregatedBids.push([price,bidLevels[price].toString()]);
            }
        }

        for (const price in askLevels){
            if(askLevels[price]){
                aggregatedAsks.push([price,askLevels[price].toString()]);
            }
        }
        return {aggregatedBids , aggregatedAsks};

    }
    cancelBid (order:Order) {
        const index = this.bids.findIndex(g => g.orderId === order.orderId);
        if(index !== -1){
            if(this.bids && this.bids[index]){
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            console.log(`[OrderBook] Cancelled bid order ${order.orderId} at price ${price}`);
            return price;
            }
        }
        console.log(`[OrderBook] Bid order ${order.orderId} not found for cancellation`);
        return null;
    }

    addOrder(order:Order) {
        if(order.side === "buy") {
            const {executedQty , fills} = this.matchBid(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }
            if(order.quantity > 0){
                this.bids.push(order);
            }
            this.sortBids(); 
            return {
                executedQty,
                fills
            }

        } else {
            const {executedQty, fills} = this.matchAsk(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }
            if(order.quantity > 0){
                this.asks.push(order);
            }
            this.sortAsks();
            return{
                executedQty,
                fills
            }
        }
    }
}