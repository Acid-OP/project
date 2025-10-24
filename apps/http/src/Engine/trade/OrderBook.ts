import { BASE_CURRENCY, Fill, Order } from "../types/UserTypes";


export class OrderBook {
    bids: Order[];
    asks: Order[];
    baseAsset: string;
    quoteAsset: string = BASE_CURRENCY;
    lastTradeId: number;
    currentPrice: number;
    constructor(baseAsset: string, bids: Order[], asks: Order[], lastTradeId: number, currentPrice: number) {
      console.log(`[OrderBook] Initializing orderbook for ${baseAsset}`);
      const parts = baseAsset.split("_");
      this.baseAsset = parts[0] || baseAsset;     
      this.quoteAsset = parts[1] || "USD";
      this.bids = bids;
      this.asks = asks;
      this.lastTradeId = lastTradeId || 0;
      this.currentPrice = currentPrice || 0;
      console.log(`[OrderBook] ${this.getMarketPair()} initialized - lastTradeId: ${this.lastTradeId}, currentPrice: ${this.currentPrice}`);
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
        console.log(`[OrderBook] Matching bid order ${order.orderId} - price: ${order.price}, qty: ${order.quantity}`);
        this.sortAsks();
        const fills:Fill[] = [];
        let executedQty = 0;

        for(let i=0 ; i<this.asks.length ; i++) {
            const ask = this.asks[i];
            if(!ask) continue;
            if(ask.userId === order.userId){
                console.log(`[OrderBook] Skipping self-match with order ${ask.orderId}`);
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
                console.log(`[OrderBook] Filled ${filledQty} @ ${ask.price} - tradeId: ${this.lastTradeId - 1}`);
            }
            if (ask.filled === ask.quantity) {
                this.asks.splice(i, 1);
                i--; 
            }
        }
        console.log(`[OrderBook] Bid match complete - executedQty: ${executedQty}, fills: ${fills.length}`);
        return {fills , executedQty};
    }

    matchAsk(order:Order) {
        console.log(`[OrderBook] Matching ask order ${order.orderId} - price: ${order.price}, qty: ${order.quantity}`);
        this.sortBids();
        const fills:Fill[] = [];
        let executedQty = 0;

        for (let i=0 ; i<this.bids.length; i++) {
            const bid = this.bids[i];
            if(!bid) continue;
            if(bid.userId === order.userId) {
                console.log(`[OrderBook] Skipping self-match with order ${bid.orderId}`);
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
                console.log(`[OrderBook] Filled ${amountRemaining} @ ${bid.price} - tradeId: ${this.lastTradeId - 1}`);
            }
            if (bid && bid.filled === bid.quantity) {
                this.bids.splice(i, 1);
                i--;
            }
        }
        console.log(`[OrderBook] Ask match complete - executedQty: ${executedQty}, fills: ${fills.length}`);
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
        console.log(`[OrderBook] Depth calculated - bids: ${aggregatedBids.length} levels, asks: ${aggregatedAsks.length} levels`);
        return {aggregatedBids , aggregatedAsks};

    }
    cancelBid (order:Order) {
        console.log(`[OrderBook] Cancelling bid order ${order.orderId}`);
        const index = this.bids.findIndex(g => g.orderId === order.orderId);
        if(index !== -1){
            if(this.bids && this.bids[index]){
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            console.log(`[OrderBook] Bid cancelled at price ${price}`);
            return price;
            }
        }
        console.log(`[OrderBook] Bid order ${order.orderId} not found`);
        return null;
    }

    cancelAsk(order:Order) {
        console.log(`[OrderBook] Cancelling ask order ${order.orderId}`);
        const index = this.asks.findIndex(g => g.orderId === order.orderId);
        if(index !== -1){
            if(this.asks && this.asks[index]){
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            console.log(`[OrderBook] Ask cancelled at price ${price}`);
            return price;
            }
        }
        console.log(`[OrderBook] Ask order ${order.orderId} not found`);
        return null;
    }

    addOrder(order:Order) {
        console.log(`[OrderBook] Adding ${order.side} order ${order.orderId} - price: ${order.price}, qty: ${order.quantity}`);
        if(order.side === "buy") {
            const {executedQty , fills} = this.matchBid(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                console.log(`[OrderBook] Buy order fully filled`);
                return {
                    executedQty,
                    fills
                }
            }
            if(order.quantity > 0){
                this.bids.push(order);
                console.log(`[OrderBook] Buy order added to book - remaining: ${order.quantity - executedQty}`);
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
                console.log(`[OrderBook] Sell order fully filled`);
                return {
                    executedQty,
                    fills
                }
            }
            if(order.quantity > 0){
                this.asks.push(order);
                console.log(`[OrderBook] Sell order added to book - remaining: ${order.quantity - executedQty}`);
            }
            this.sortAsks();
            return{
                executedQty,
                fills
            }
        }
    }
}