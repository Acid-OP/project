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
      this.baseAsset = baseAsset;
      this.bids = bids;
      this.asks = asks;
      this.lastTradeId = lastTradeId || 0;
      this.currentPrice = currentPrice || 0;
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
    matchBid(order:Order) {
        const fills: Fill[] = [];
        let executedQty=0;
        
        for(let i = 0; i < this.asks.length; i++) {
            const ask = this.asks[i];
            if (ask && ask.price <= order.price && executedQty < order.quantity) {
                const filledQty = Math.min((order.quantity - executedQty), ask.quantity);
            // remaining amount the buyer wants to buy And the total amount the seller has to sell
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
        }
        for (let i = 0; i < this.asks.length; i++) {
            const ask = this.asks[i];
            if (ask && ask.filled === ask.quantity) {
                this.asks.splice(i, 1);
                i--;
            }
        }
        return {
            fills,
            executedQty
        };
    }
    matchAsk(order:Order) {
        const fills:Fill[] = [];
        let executedQty = 0;

        for(let i=0 ; i< this.bids.length ; i++) {
            const bid = this.bids[i];
            if(bid && bid.price >= order.price && executedQty < order.quantity) {
                const amountRemaining = Math.min(order.quantity - executedQty, bid.quantity);
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
        }
        for (let i = 0; i < this.bids.length; i++) {
            const bid = this.bids[i];
            if (bid && bid.filled === bid.quantity) {
                this.bids.splice(i, 1);
                i--;
            }
        }
        return {
            fills,
            executedQty
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