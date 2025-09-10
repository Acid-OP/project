import { RedisManager } from "../RedisManager";
import { Fill, Order, OrderBook } from "./OrderBook";

export const CREATE_ORDER = "CREATE_ORDER"
type MessageFromApi = {
    type: typeof CREATE_ORDER,
    data: {
        market: string,
        price: string,
        quantity: string,
        side: "buy" | "sell",
        userId: string
    }
}
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
    if (!userBalance) return;

    fills.forEach(fill => {
      const tradeValue = fill.qty * Number(fill.price);

      const otherUserId = fill.otherUserId;
      const otherUserBalance = this.balances.get(otherUserId);
      if (!otherUserBalance) return;

      if (side === "buy") {
        // Update buyer (current user)
        if (
          userBalance[baseAsset] && 
          userBalance[quoteAsset] && 
          otherUserBalance[quoteAsset] && 
          otherUserBalance[baseAsset]
        ) {
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
          userBalance[quoteAsset].available += tradeValue;
          userBalance[baseAsset].locked -= fill.qty;

          // Update buyer (other user)
          otherUserBalance[baseAsset].available += fill.qty;
          otherUserBalance[quoteAsset].locked -= tradeValue;
        }
      }
    });
  }


  private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string) {
    
    const orderbook = this.orderbooks.find(o => o.getMarketPair() === market)

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
    return { executedQty, fills, orderId: order.orderId };
  }

  public async process({message,clientId,}: {message: MessageFromApi; clientId: string;}) {
    console.log("⚙️ [Engine] Processing message:", message);
    switch (message.type) {
      case CREATE_ORDER:
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
        }
          const { executedQty, fills, orderId } = this.createOrder(
            message.data.market,
            message.data.price,
            message.data.quantity,
            message.data.side,
            message.data.userId
          );
          console.log("📝 [Engine] Created order:", { orderId, executedQty, fills });

          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_PLACED",
            payload: { orderId, executedQty, fills },
          });
           console.log("📤 [Engine] Published ORDER_PLACED to channel:", clientId);
        } catch (e) {
          console.error("❌ Engine error:", e);
          RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_CANCELLED",
            payload: { orderId: "", executedQty: 0, remainingQty: 0 },
          });
        }
        break;

      default:
        console.warn("⚠️ Unknown message type:", message.type);
    }
  }
}