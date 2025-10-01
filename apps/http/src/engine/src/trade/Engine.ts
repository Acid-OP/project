import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, MessageFromApi } from "../types/market";
import { Fill, Order, OrderBook } from "./OrderBook";

interface UserBalance {
    [key: string]: {
        available: number;
        locked: number;
    }
}
export const BASE_CURRENCY = "USD";
export class Engine {
  private orderbooks: OrderBook[] = [];
  private balances: Map<string, UserBalance> = new Map();

  constructor() {
    this.orderbooks = [
    new OrderBook("BTC_USD", [], [], 0, 45000),    
    new OrderBook("ETH_USD", [], [], 0, 3000),
    new OrderBook("ETH_BTC", [], [], 0, 0.067)
    ];
  }

  private defaultBalance(userId: string) {
    if (!this.balances.has(userId)) {     
      const defaultBalance: UserBalance = {
        [BASE_CURRENCY]: {  
          available: 100000,   
          locked: 0
        },
        "BTC": {
          available: 2,       
          locked: 0
        },
        "ETH": {
          available: 50,     
          locked: 0
        }
      };
      
      this.balances.set(userId, defaultBalance);
      console.log(`💰 [Engine] Created default balance for ${userId}:`, defaultBalance);
    } else {
      console.log(`💰 [Engine] User ${userId} already has balance:`, this.balances.get(userId));
    }
  }
  
  private checkAndLockFunds(userId: string, side: "buy" | "sell",quoteAsset:string, baseAsset: string, price: number, quantity: number) {
    
    const userBalance = this.balances.get(userId);
    
    if (side === "buy") {
      const required = price * quantity;
      
      if (userBalance && userBalance[quoteAsset]) {
        if (userBalance[quoteAsset].available >= required) {
          userBalance[quoteAsset].available -= required;
          userBalance[quoteAsset].locked += required;
        } else {
          throw new Error("Insufficient funds for buy order");
        }
      }
    }

    if (side === "sell") {
      
      if (userBalance && userBalance[baseAsset]) {
        if (userBalance[baseAsset].available >= quantity) {
          userBalance[baseAsset].available -= quantity;
          userBalance[baseAsset].locked += quantity;
        } else {
          console.log(`❌ [Engine] Insufficient ${baseAsset}. Available: ${userBalance[baseAsset].available}, Required: ${quantity}`);
          throw new Error("Insufficient funds for sell order");
        }
      }
    }
  }

  private updateBalancesAfterTrade(
    userId: string, 
    fills: Fill[], 
    side: "buy" | "sell", 
    baseAsset: string, 
    quoteAsset: string
  ) {
    const userBalance = this.balances.get(userId);
    if (!userBalance) {
      return null;
    }

    fills.forEach((fill) => {  
      const tradeValue = fill.qty * Number(fill.price);

      const otherUserId = fill.otherUserId;
      const otherUserBalance = this.balances.get(otherUserId);
      if (!otherUserBalance) {
        return null;
      }

      if (side === "buy") {
        // Update buyer (current user)
        if (
          userBalance[baseAsset] && 
          userBalance[quoteAsset] && 
          otherUserBalance[quoteAsset] && 
          otherUserBalance[baseAsset]
        ) {
          // Buyer receives base asset
          userBalance[baseAsset].available += fill.qty;
          userBalance[quoteAsset].locked -= tradeValue;

          // Update seller (other user)
          otherUserBalance[quoteAsset].available += tradeValue;
          otherUserBalance[baseAsset].locked -= fill.qty;
        }
      } else if (side === "sell") {
        // Update seller (current user)
        if (
          userBalance[baseAsset] && 
          userBalance[quoteAsset] && 
          otherUserBalance[quoteAsset] && 
          otherUserBalance[baseAsset]
        ) {
          // Seller receives quote asset
          userBalance[quoteAsset].available += tradeValue;
          userBalance[baseAsset].locked -= fill.qty;

          // Update buyer (other user)
          otherUserBalance[baseAsset].available += fill.qty;
          otherUserBalance[quoteAsset].locked -= tradeValue;
        }
      }
    });
  }

    UpdatedDepth(price: string, market: string) {
        const orderbook = this.orderbooks.find(x => x.getMarketPair() === market);
        if (!orderbook) {
            return;
        }
        const depth = orderbook.getDepth();
        const updatedBids = depth?.bids.filter(x => x[0] === price);
        const updatedAsks = depth?.asks.filter(x => x[0] === price);
        
        RedisManager.getInstance().publishMessage(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
                asks: updatedAsks.length ? updatedAsks : [[price, "0"]],
                bids: updatedBids.length ? updatedBids : [[price, "0"]],
                event: "depth"
            }
        });
    }
  private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string) {
    
    const orderbook = this.orderbooks.find(o => o.getMarketPair() === market);
    if (!orderbook) {
      throw new Error("No orderbook found");
    }
    
    const numPrice = Number(price);
    const numQuantity = Number(quantity);
  
    if (isNaN(numPrice) || numPrice <= 0) {
      throw new Error("Invalid price");
    }
  
    if (isNaN(numQuantity) || numQuantity <= 0) {
      throw new Error("Invalid quantity");
    }

    const order: Order = {
      price: numPrice,
      quantity: numQuantity,
      orderId: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      filled: 0,
      side,
      userId,
    };
    const { fills, executedQty } = orderbook.addOrder(order);

    const baseAsset = market.split("_")[0];  
    const quoteAsset = market.split("_")[1];
    
    if(baseAsset && quoteAsset){
      this.updateBalancesAfterTrade(userId, fills, side, baseAsset, quoteAsset);
    }
    fills.forEach(fill => {
      this.UpdatedDepth(fill.price, market);
    });

    if (executedQty < order.quantity) {
        this.UpdatedDepth(order.price.toString(), market);
    }

    const result = { executedQty, fills, orderId: order.orderId };
    return result;
  }

  public async process({message,clientId,}: {message: MessageFromApi; clientId: string;}) {
    switch (message.type) {
      case CREATE_ORDER:
        let fundsLocked = false;
        let orderExecuted = false;  
        try {  
            this.defaultBalance(message.data.userId);
            const baseAsset = message.data.market.split("_")[0];
            const quoteAsset = message.data.market.split("_")[1];
            const numPrice = Number(message.data.price);
            const numQuantity = Number(message.data.quantity);
        
            if (baseAsset && quoteAsset) {
                this.checkAndLockFunds(
                    message.data.userId,  
                    message.data.side,  
                    quoteAsset,    
                    baseAsset,              
                    numPrice,               
                    numQuantity             
                );
                fundsLocked = true;
            }
            
            const { executedQty, fills, orderId } = this.createOrder(
                message.data.market,
                message.data.price,
                message.data.quantity,
                message.data.side,
                message.data.userId
            );
            
            orderExecuted = true; 
            
            if (executedQty < numQuantity && baseAsset && quoteAsset) {
                const userBalance = this.balances.get(message.data.userId);
                if (userBalance) {
                    const remaining = numQuantity - executedQty;
                    
                    if (message.data.side === "buy" && userBalance[quoteAsset]) {
                        const refund = remaining * numPrice;
                        userBalance[quoteAsset].available += refund;
                        userBalance[quoteAsset].locked -= refund;
                    } else if (userBalance[baseAsset]) {
                        userBalance[baseAsset].available += remaining;
                        userBalance[baseAsset].locked -= remaining;
                    }
                }
            }
            
            RedisManager.getInstance().sendToApi(clientId, {
                type: "ORDER_PLACED",
                payload: { orderId, executedQty, fills }
            });
            
        } catch (e) {
            console.error("Order creation failed:", e);
            
            if (fundsLocked && !orderExecuted && message.data) {
                const baseAsset = message.data.market.split("_")[0];
                const quoteAsset = message.data.market.split("_")[1];
                const numPrice = Number(message.data.price);
                const numQuantity = Number(message.data.quantity);
                const userBalance = this.balances.get(message.data.userId);
                
                if (userBalance && baseAsset && quoteAsset) {
                    if (message.data.side === "buy" && userBalance[quoteAsset]) {
                        const amount = numQuantity * numPrice;
                        userBalance[quoteAsset].available += amount;
                        userBalance[quoteAsset].locked -= amount;
                    } else if (userBalance[baseAsset]) {
                        userBalance[baseAsset].available += numQuantity;
                        userBalance[baseAsset].locked -= numQuantity;
                    }
                }
            }
            RedisManager.getInstance().sendToApi(clientId, {
                type: "ORDER_CANCELLED",
                payload: { orderId: "", executedQty: 0, remainingQty: 0 }
            });
          }
          break;
        case CANCEL_ORDER:
          try {
            const orderId = message.data.orderId;
            const cancelMarket = message.data.market;
            const cancelOrderbook = this.orderbooks.find(o => o.getMarketPair() === cancelMarket);
            const quoteAsset = cancelMarket.split("_")[1];
            if (!cancelOrderbook) {
              throw new Error("No orderbook found");
            }
            const order = cancelOrderbook.asks.find(o => o.orderId === orderId) || cancelOrderbook.bids.find(o => o.orderId === orderId);
            if (!order) {
              throw new Error("No order found");
            }
            if (order.side === "buy" && quoteAsset) {
              const price = cancelOrderbook.cancelBid(order);
              const userBalance = this.balances.get(order.userId);
              if (!userBalance || !userBalance[quoteAsset]) {
                  throw new Error("User balance not found");
              }
              const leftQuantity = (order.quantity - order.filled) * order.price;
              userBalance[quoteAsset].available += leftQuantity;  
              userBalance[quoteAsset].locked -= leftQuantity;
              if(price){
                // return depth
              }
            } else {
              const baseAsset = cancelMarket.split("_")[0];
              if(baseAsset){
              const price = cancelOrderbook.cancelAsk(order);
              const userBalance = this.balances.get(order.userId);
              if (!userBalance || !userBalance[baseAsset]) {
                  throw new Error("User balance not found");
              }
              const leftQuantity = (order.quantity - order.filled);
              userBalance[baseAsset].available += leftQuantity;  
              userBalance[baseAsset].locked -= leftQuantity;
              if(price){
                // return depth
              }}}
                RedisManager.getInstance().sendToApi(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId,
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });
            
          } catch (e) {
            console.error("Error during CANCEL_ORDER:", e);
          }
          break;
        case GET_DEPTH:
              try{
                 const market = message.data.market;
                 const orderbook = this.orderbooks.find(x => x.getMarketPair() === market);
                 if(!orderbook){
                  return null;
                 }
                 RedisManager.getInstance().sendToApi(clientId,{
                  type:"DEPTH", 
                  payload: orderbook.getDepth()
                });
                } catch(e){
                  RedisManager.getInstance().sendToApi(clientId, {
                    type: "DEPTH",
                    payload: {
                      bids: [],
                      asks: []
                    }
                  });
                }
                break;
        default:
          console.warn("⚠️ Unknown message type:");
      }
    }

  public getBalance(userId: string) {
    const balance = this.balances.get(userId);
    return balance || null;
  }

  public getOrderbookState(market: string) {
    const orderbook = this.orderbooks.find(o => o.getMarketPair() === market);
    if (!orderbook) {
      return null;
    }
    const state = {
      market: orderbook.getMarketPair(),
      bidsCount: orderbook.bids.length,
      asksCount: orderbook.asks.length,
      bids: orderbook.bids,
      asks: orderbook.asks
    };
    return state;
  }

  public getAllMarkets() {
    const markets = this.orderbooks.map(ob => ({
      market: ob.getMarketPair(),
      bidsCount: ob.bids.length,
      asksCount: ob.asks.length
    }));
    return markets;
  }
}