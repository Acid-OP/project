import { RedisManager } from "../RedisManager";
import { CANCEL_ORDER, CREATE_ORDER, MessageFromApi } from "../types/market";
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
    console.log("🏭 [Engine] Engine initialized with orderbooks:", this.orderbooks.map(ob => ob.getMarketPair()));
  }

  private defaultBalance(userId: string) {
    console.log(`👤 [Engine] Setting default balance for user: ${userId}`);
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
    console.log(`🔐 [Engine] Checking funds for ${side} order:`, {
      userId, side, quoteAsset, baseAsset, price, quantity
    });
    
    const userBalance = this.balances.get(userId);
    console.log(`💰 [Engine] Current user balance:`, userBalance);
    
    if (side === "buy") {
      const required = price * quantity;
      console.log(`💵 [Engine] Buy order requires ${required} ${quoteAsset}`);
      
      if (userBalance && userBalance[quoteAsset]) {
        console.log(`💰 [Engine] Available ${quoteAsset}: ${userBalance[quoteAsset].available}`);
        if (userBalance[quoteAsset].available >= required) {
          userBalance[quoteAsset].available -= required;
          userBalance[quoteAsset].locked += required;
          console.log(`✅ [Engine] Locked ${required} ${quoteAsset}. New balance:`, {
            available: userBalance[quoteAsset].available,
            locked: userBalance[quoteAsset].locked
          });
        } else {
          console.log(`❌ [Engine] Insufficient ${quoteAsset}. Available: ${userBalance[quoteAsset].available}, Required: ${required}`);
          throw new Error("Insufficient funds for buy order");
        }
      }
    }

    if (side === "sell") {
      console.log(`🪙 [Engine] Sell order requires ${quantity} ${baseAsset}`);
      
      if (userBalance && userBalance[baseAsset]) {
        console.log(`💰 [Engine] Available ${baseAsset}: ${userBalance[baseAsset].available}`);
        if (userBalance[baseAsset].available >= quantity) {
          userBalance[baseAsset].available -= quantity;
          userBalance[baseAsset].locked += quantity;
          console.log(`✅ [Engine] Locked ${quantity} ${baseAsset}. New balance:`, {
            available: userBalance[baseAsset].available,
            locked: userBalance[baseAsset].locked
          });
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
    console.log(`💱 [Engine] Updating balances after trade:`, {
      userId, side, baseAsset, quoteAsset, fillsCount: fills.length
    });
    
    const userBalance = this.balances.get(userId);
    if (!userBalance) {
      console.log(`❌ [Engine] User balance not found for ${userId}`);
      return;
    }

    console.log(`💰 [Engine] User balance before trade updates:`, userBalance);

    fills.forEach((fill, index) => {
      console.log(`🔄 [Engine] Processing fill ${index + 1}/${fills.length}:`, {
        price: fill.price,
        qty: fill.qty,
        tradeId: fill.tradeId,
        otherUserId: fill.otherUserId
      });
      
      const tradeValue = fill.qty * Number(fill.price);
      console.log(`💵 [Engine] Trade value: ${fill.qty} * ${fill.price} = ${tradeValue}`);

      const otherUserId = fill.otherUserId;
      const otherUserBalance = this.balances.get(otherUserId);
      if (!otherUserBalance) {
        console.log(`❌ [Engine] Other user balance not found for ${otherUserId}`);
        return;
      }
      
      console.log(`💰 [Engine] Other user balance before:`, otherUserBalance);

      if (side === "buy") {
        console.log(`🛒 [Engine] Processing BUY trade updates...`);
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
          console.log(`📈 [Engine] Buyer (${userId}) received ${fill.qty} ${baseAsset}, unlocked ${tradeValue} ${quoteAsset}`);

          // Update seller (other user)
          otherUserBalance[quoteAsset].available += tradeValue;
          otherUserBalance[baseAsset].locked -= fill.qty;
          console.log(`📉 [Engine] Seller (${otherUserId}) received ${tradeValue} ${quoteAsset}, unlocked ${fill.qty} ${baseAsset}`);
        }
      } else if (side === "sell") {
        console.log(`🏪 [Engine] Processing SELL trade updates...`);
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
          console.log(`📈 [Engine] Seller (${userId}) received ${tradeValue} ${quoteAsset}, unlocked ${fill.qty} ${baseAsset}`);

          // Update buyer (other user)
          otherUserBalance[baseAsset].available += fill.qty;
          otherUserBalance[quoteAsset].locked -= tradeValue;
          console.log(`📉 [Engine] Buyer (${otherUserId}) received ${fill.qty} ${baseAsset}, unlocked ${tradeValue} ${quoteAsset}`);
        }
      }
      
      console.log(`💰 [Engine] User balance after fill ${index + 1}:`, userBalance);
      console.log(`💰 [Engine] Other user balance after fill ${index + 1}:`, otherUserBalance);
    });
  }


  private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string) {
    console.log(`🏭 [Engine] Creating order:`, { market, price, quantity, side, userId });
    
    const orderbook = this.orderbooks.find(o => o.getMarketPair() === market);
    console.log(`📋 [Engine] Available markets:`, this.orderbooks.map(ob => ob.getMarketPair()));

    if (!orderbook) {
      console.log(`❌ [Engine] No orderbook found for market: ${market}`);
      throw new Error("No orderbook found");
    }
    
    console.log(`📊 [Engine] Found orderbook for ${market}:`, {
      bidsCount: orderbook.bids.length,
      asksCount: orderbook.asks.length
    });
    
    const numPrice = Number(price);
    const numQuantity = Number(quantity);
  
    if (isNaN(numPrice) || numPrice <= 0) {
      console.log(`❌ [Engine] Invalid price: ${price}`);
      throw new Error("Invalid price");
    }
  
    if (isNaN(numQuantity) || numQuantity <= 0) {
      console.log(`❌ [Engine] Invalid quantity: ${quantity}`);
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
    
    console.log(`📝 [Engine] Generated order:`, order);
    console.log(`📊 [Engine] Orderbook before adding order - Bids: ${orderbook.bids.length}, Asks: ${orderbook.asks.length}`);
    orderbook.logOrderbook();
    const { fills, executedQty } = orderbook.addOrder(order);
    
    console.log(`🎯 [Engine] Order execution result:`, {
      orderId: order.orderId,
      requestedQty: order.quantity,
      executedQty,
      remainingQty: order.quantity - executedQty,
      fillsCount: fills.length,
      fills: fills.map(f => ({
        price: f.price,
        qty: f.qty,
        tradeId: f.tradeId,
        counterparty: f.otherUserId
      }))
    });
    
    console.log(`📊 [Engine] Orderbook after adding order - Bids: ${orderbook.bids.length}, Asks: ${orderbook.asks.length}`);
    orderbook.logOrderbook();
    const baseAsset = market.split("_")[0];  
    const quoteAsset = market.split("_")[1];
    console.log(`🔍 [Engine] Parsed market assets:`, { baseAsset, quoteAsset });
    
    if(baseAsset && quoteAsset){
      console.log(`💱 [Engine] Starting balance updates for trade...`);
      this.updateBalancesAfterTrade(userId, fills, side, baseAsset, quoteAsset);
      console.log(`✅ [Engine] Balance updates completed`);
    }
    
    const result = { executedQty, fills, orderId: order.orderId };
    console.log(`🎉 [Engine] Order creation completed:`, result);
    return result;
  }

  public async process({message,clientId,}: {message: MessageFromApi; clientId: string;}) {
    switch (message.type) {
      case CREATE_ORDER:
        try {
          console.log(`🚀 [Engine] Starting CREATE_ORDER process for user ${message.data.userId}`);
          
          this.defaultBalance(message.data.userId);
          
          const baseAsset = message.data.market.split("_")[0];
          const quoteAsset = message.data.market.split("_")[1];
          const numPrice = Number(message.data.price);
          const numQuantity = Number(message.data.quantity);
          
          console.log(`🔢 [Engine] Parsed values:`, {
            baseAsset, quoteAsset, numPrice, numQuantity
          });
          
          if (baseAsset && quoteAsset) {
            console.log(`🔐 [Engine] Starting fund check and lock...`);
            this.checkAndLockFunds(
              message.data.userId,  
              message.data.side,  
              quoteAsset,    
              baseAsset,              
              numPrice,               
              numQuantity             
            );
            console.log(`✅ [Engine] Funds successfully locked`);
          }
          
          console.log(`🏭 [Engine] Starting order creation...`);
          const { executedQty, fills, orderId } = this.createOrder(
            message.data.market,
            message.data.price,
            message.data.quantity,
            message.data.side,
            message.data.userId
          );
          console.log("📝 [Engine] Created order:", { orderId, executedQty, fills });

          const successResponse = {
            type: "ORDER_PLACED",
            payload: { orderId, executedQty, fills }
          };
          console.log("📤 [Engine] Sending success response:", successResponse);
          // @ts-ignore
          RedisManager.getInstance().sendToApi(clientId, successResponse);
          console.log("📤 [Engine] Published ORDER_PLACED to channel:", clientId);
          
          console.log(`🎉 [Engine] CREATE_ORDER completed successfully for order ${orderId}`);
          
        } catch (e) {
          console.error("❌ Engine error details:", {
            error: e,
            message: e instanceof Error ? e.message : 'Unknown error',
            stack: e instanceof Error ? e.stack : 'No stack trace',
            userId: message.data.userId,
            market: message.data.market
          });
          
          const errorResponse = {
            type: "ORDER_CANCELLED",
            payload: { orderId: "", executedQty: 0, remainingQty: 0 }
          };
          console.log("📤 [Engine] Sending error response:", errorResponse);
          // @ts-ignore
          RedisManager.getInstance().sendToApi(clientId, errorResponse);
          console.log("📤 [Engine] Published ORDER_CANCELLED to channel:", clientId);
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
              if(quoteAsset){
              const price = cancelOrderbook.cancelBid(order);
              const userBalance = this.balances.get(order.userId);
              if (!userBalance || !userBalance[quoteAsset]) {
                  throw new Error("User balance not found");
              }
              const leftQuantity = (order.quantity - order.filled);
              userBalance[quoteAsset].available += leftQuantity;  
              userBalance[quoteAsset].locked -= leftQuantity;
              if(price){
                // return depth
              }}
            }
          } catch (e) {
            console.error("❌ Error during CANCEL_ORDER:", e);
          }
          break;

        default:
          console.warn("⚠️ Unknown message type:");

      }
    }

  public getBalance(userId: string) {
    const balance = this.balances.get(userId);
    console.log(`[Engine] Getting balance for ${userId}:`, balance);
    return balance || null;
  }

  public getOrderbookState(market: string) {
    const orderbook = this.orderbooks.find(o => o.getMarketPair() === market);
    if (!orderbook) {
      console.log(`❌ [Engine] No orderbook found for market: ${market}`);
      return null;
    }
    const state = {
      market: orderbook.getMarketPair(),
      bidsCount: orderbook.bids.length,
      asksCount: orderbook.asks.length,
      bids: orderbook.bids,
      asks: orderbook.asks
    };
    console.log(`📊 [Engine] Orderbook state for ${market}:`, state);
    return state;
  }

  public getAllMarkets() {
    const markets = this.orderbooks.map(ob => ({
      market: ob.getMarketPair(),
      bidsCount: ob.bids.length,
      asksCount: ob.asks.length
    }));
    console.log(`📋 [Engine] All available markets:`, markets);
    return markets;
  }
}