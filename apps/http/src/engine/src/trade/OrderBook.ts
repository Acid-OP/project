import { BASE_CURRENCY } from "./Engine";

export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "buy" | "sell";
  userId: string;
}
export interface Fill {
    price: string;
    qty: number;
    tradeId: number;
    otherUserId: string;
    markerOrderId: string;
}
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

       console.log(`📊 [OrderBook] Created orderbook:`, {
        inputParam: baseAsset,
        parsedBase: this.baseAsset,
        parsedQuote: this.quoteAsset,
        finalPair: this.getMarketPair()
    });
    }

    getMarketPair() {
        return `${this.baseAsset}_${this.quoteAsset}`;
    }
    private sortBids() {
    this.bids.sort((a, b) => b.price - a.price);
    }

    private sortAsks() {
    this.asks.sort((a, b) => a.price - b.price);
    }

    cancelBid (order:Order) {
        const index = this.bids.findIndex(g => g.orderId === order.orderId);
        if(index !== -1){
            if(this.bids && this.bids[index]){
            const price = this.bids[index].price;
            this.bids.splice(index, 1);
            return price
            }
        }
        return null;
    }

    cancelAsk (order:Order) {
        const index = this.asks.findIndex(g => g.orderId === order.orderId);
        if(index !== -1){
            if(this.asks && this.asks[index]){
            const price = this.asks[index].price;
            this.asks.splice(index, 1);
            return price
                }
            }
    }

    matchBid(order:Order) {
        console.log(`🔄 [OrderBook] Matching BUY order:`, {
        orderId: order.orderId,
        price: order.price,
        quantity: order.quantity,
        userId: order.userId
    });

    console.log(`📊 [OrderBook] Current asks before matching:`, this.asks.length);
        this.sortAsks();
        const fills: Fill[] = [];
        let executedQty=0;
        
        for(let i = 0; i < this.asks.length; i++) {
            const ask = this.asks[i];
                   console.log(`🔍 [OrderBook] Checking ask ${i}:`, {
            askPrice: ask!.price,
            askQty: ask!.quantity,
            askUserId: ask!.userId,
            orderPrice: order.price
        });
            if (ask && ask.price <= order.price && executedQty < order.quantity) {
                if (ask.userId === order.userId) continue;
                const filledQty = Math.min((order.quantity - executedQty), ask.quantity);
            // remaining amount the buyer wants to buy And the total amount the seller has to sell
                executedQty += filledQty;
                ask.filled += filledQty;
                   console.log(`✅ [OrderBook] MATCH FOUND:`, {
                filledQty,
                executedQty,
                askFilled: ask.filled,
                askQuantity: ask.quantity
            });
                fills.push({
                    price: ask.price.toString(),
                    qty: filledQty,
                    tradeId: this.lastTradeId++,
                    otherUserId: ask.userId,
                    markerOrderId: ask.orderId
                });
            }
        }
        const beforeLength = this.asks.length;
        for (let i = 0; i < this.asks.length; i++) {
            const ask = this.asks[i];
            if (ask && ask.filled === ask.quantity) {
                console.log(`🗑️ [OrderBook] Removing filled ask:`, ask.orderId);
                this.asks.splice(i, 1);
                i--;
            }
        }
        console.log(`📊 [OrderBook] Asks removed: ${beforeLength - this.asks.length}`);
    
    console.log(`📈 [OrderBook] Match result:`, {
        totalFills: fills.length,
        totalExecutedQty: executedQty,
        remainingQty: order.quantity - executedQty
    });
        return {
            fills,
            executedQty
        };
    }
    public logOrderbook() {
    console.log(`📊 [OrderBook] Current state for ${this.getMarketPair()}:`);
    console.log(`🔼 BIDS (${this.bids.length} orders):`);
    this.bids.forEach((bid, index) => {
        console.log(`  ${index + 1}. OrderId: ${bid.orderId}, Price: ${bid.price}, Qty: ${bid.quantity}, Filled: ${bid.filled}, User: ${bid.userId}`);
    });
    console.log(`🔽 ASKS (${this.asks.length} orders):`);
    this.asks.forEach((ask, index) => {
        console.log(`  ${index + 1}. OrderId: ${ask.orderId}, Price: ${ask.price}, Qty: ${ask.quantity}, Filled: ${ask.filled}, User: ${ask.userId}`);
    });
}

    matchAsk(order:Order) {
        console.log(`🔄 [OrderBook] Matching SELL order:`, {
        orderId: order.orderId,
        price: order.price,
        quantity: order.quantity,
        userId: order.userId
    });
    console.log(`📊 [OrderBook] Current bids before matching:`, this.bids.length);
        const fills:Fill[] = [];
        let executedQty = 0;

        for(let i=0 ; i< this.bids.length ; i++) {
            const bid = this.bids[i];
            if(bid && bid.price >= order.price && executedQty < order.quantity) {
                           if (bid.userId === order.userId) {
                console.log(`⚠️ [OrderBook] Skipping self-trade for user ${order.userId}`);
                continue;
            }
                const amountRemaining = Math.min(order.quantity - executedQty, bid.quantity);
                executedQty += amountRemaining;
                bid.filled += amountRemaining;
                            console.log(`✅ [OrderBook] MATCH FOUND:`, {
                amountRemaining,
                executedQty,
                bidFilled: bid.filled,
                bidQuantity: bid.quantity
            });

                fills.push({
                    price: bid.price.toString(),
                    qty: amountRemaining,
                    tradeId: this.lastTradeId++,
                    otherUserId: bid.userId,
                    markerOrderId: bid.orderId
                });
            }
        }
        const beforeLength = this.bids.length;
        for (let i = 0; i < this.bids.length; i++) {
            const bid = this.bids[i];
            if (bid && bid.filled === bid.quantity) {
                console.log(`🗑️ [OrderBook] Removing filled bid:`, bid.orderId);
                this.bids.splice(i, 1);
                i--;
            }
        }
        console.log(`📊 [OrderBook] Bids removed: ${beforeLength - this.bids.length}`);
    
    console.log(`📈 [OrderBook] Match result:`, {
        totalFills: fills.length,
        totalExecutedQty: executedQty,
        remainingQty: order.quantity - executedQty
    });
        return {
            fills,
            executedQty
        };
    }
    getCurrentState() {
    return {
        market: this.getMarketPair(),
        bidsCount: this.bids.length,
        asksCount: this.asks.length,
        topBid: this.bids.length > 0 ? this.bids[0] : null,
        topAsk: this.asks.length > 0 ? this.asks[0] : null,
        lastTradeId: this.lastTradeId,
        currentPrice: this.currentPrice
    };
}

    addOrder(order:Order){
        if(order.side === "buy") {
            const {executedQty , fills} = this.matchBid(order);
            order.filled = executedQty;
            if (executedQty === order.quantity) {
                return {
                    executedQty,
                    fills
                }
            }
            this.bids.push(order);
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
            this.asks.push(order);
            this.sortAsks();
            return {
                executedQty,
                fills
            }
        }
    }
}