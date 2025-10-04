import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, MessageFromApi } from "../types/ApiMessages";
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
    console.log("[Engine] Initialized with markets:", this.orderbooks.map(ob => ob.getMarketPair()));
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
      console.log(`[Engine] Created default balance for ${userId}:`, defaultBalance);
    } else {
      console.log(`💰 [Engine] User ${userId} already has balance:`, this.balances.get(userId));
    }
  }
  
  private checkAndLockFunds(userId: string, side: "buy" | "sell",quoteAsset:string, baseAsset: string, price: number, quantity: number) {
    console.log(`[Engine] Checking funds for ${userId}: ${side} ${quantity} ${baseAsset} @ ${price}`);  
    const userBalance = this.balances.get(userId);
      if (!userBalance) {
        throw new Error(`User ${userId} has no balance initialized`);
      }    
      if (side === "buy") {
          if (!userBalance[quoteAsset]) {
              throw new Error(`User ${userId} has no ${quoteAsset} balance. Cannot buy.`);
          }  
          const required = price * quantity;
          if (userBalance[quoteAsset].available < required) {
              throw new Error(
                  `Insufficient ${quoteAsset}. Required: ${required}, Available: ${userBalance[quoteAsset].available}`
              );
          }
          userBalance[quoteAsset].available -= required;
          userBalance[quoteAsset].locked += required;
          console.log(`[Engine] Locked ${required} ${quoteAsset} for ${userId}`);
          return;
      }

      if (side === "sell") {
          if (!userBalance[baseAsset]) {
              throw new Error(`User ${userId} has no ${baseAsset} balance. Cannot sell.`);
          }
          if (userBalance[baseAsset].available < quantity) {
              throw new Error(
                  `Insufficient ${baseAsset}. Required: ${quantity}, Available: ${userBalance[baseAsset].available}`
              );
          }
          userBalance[baseAsset].available -= quantity;
          userBalance[baseAsset].locked += quantity;
          console.log(`[Engine] Locked ${quantity} ${baseAsset} for ${userId}`);
          return;
      }
    }

  private updateBalancesAfterTrade(
    userId: string, 
    fills: Fill[], 
    side: "buy" | "sell", 
    baseAsset: string, 
    quoteAsset: string
  ) {
    console.log(`[Engine] Updating balances for ${fills.length} fills (${side})`);
    const userBalance = this.balances.get(userId);
    if (!userBalance) {
      return null;
    }

    fills.forEach((fill) => {  
      const tradeValue = fill.qty * Number(fill.price);
      const otherUserId = fill.otherUserId;
      const otherUserBalance = this.balances.get(otherUserId);
      if (!otherUserBalance) {
        return;
      }

      if (side === "buy") {
        if (
          userBalance[baseAsset] && 
          userBalance[quoteAsset] && 
          otherUserBalance[quoteAsset] && 
          otherUserBalance[baseAsset]
        ) {
          userBalance[baseAsset].available += fill.qty;
          userBalance[quoteAsset].locked -= tradeValue;

          otherUserBalance[quoteAsset].available += tradeValue;
          otherUserBalance[baseAsset].locked -= fill.qty;
        }
      } else if (side === "sell") {
        if (
          userBalance[baseAsset] && 
          userBalance[quoteAsset] && 
          otherUserBalance[quoteAsset] && 
          otherUserBalance[baseAsset]
        ) {
          userBalance[quoteAsset].available += tradeValue;
          userBalance[baseAsset].locked -= fill.qty;
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
        console.log(`[Engine] Publishing depth update for ${market} at price ${price}`);
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
     console.log(`[Engine] Creating order: ${side} ${quantity} ${market} @ ${price} for user ${userId}`);
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
    console.log(`[Engine] Order matched: ${fills.length} fills, executed ${executedQty}/${numQuantity}`);

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
    console.log(`[Engine] Processing ${message.type} from client ${clientId}`);
    switch (message.type) {
      case CREATE_ORDER:
        let fundsLocked = false;
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
          
          console.log(`[Engine] Order placed successfully: ${orderId}`);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_PLACED",
            payload: { orderId, executedQty, fills }
          });
          
        } catch (e) {
          console.error("Order creation failed:", e);
          
          if (fundsLocked && message.data) {
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
                console.log(`[Engine] Unlocked ${amount} ${quoteAsset} due to error`);
              } else if (message.data.side === "sell" && userBalance[baseAsset]) {
                userBalance[baseAsset].available += numQuantity;
                userBalance[baseAsset].locked -= numQuantity;
                 console.log(`[Engine] Unlocked ${numQuantity} ${baseAsset} due to error`);
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
            console.log(`[Engine] Cancelling order ${message.data.orderId} in ${message.data.market}`);
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
              console.log(`[Engine] Unlocked ${leftQuantity} ${quoteAsset} after cancel`);
              if(price){
                this.UpdatedDepth(price.toString(), cancelMarket);
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
              console.log(`[Engine] Unlocked ${leftQuantity} ${baseAsset} after cancel`);
              if(price){
                this.UpdatedDepth(price.toString(), cancelMarket);
              }}}
              console.log(`[Engine] Order cancelled successfully: ${orderId}`);
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
              console.log(`[Engine] Getting depth for ${message.data.market}`);
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