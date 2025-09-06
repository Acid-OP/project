import { RedisManager } from "../RedisManger";
import { Order } from "./OrderBook";

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
export const BASE_CURRENCY = "INR";
export class Engine {
  private orderbooks: Order[] = [];

  private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string) {
    const order: Order = {
      price: Number(price),
      quantity: Number(quantity),
      orderId:
        Math.random().toString(36).substring(2, 15) +
        Math.random().toString(36).substring(2, 15),
      filled: 0,
      side,
      userId,
    };
    const executedQty = Number(quantity);
    const fills = [{qty: Number(quantity),price: price, tradeId: Date.now() }];
    return { executedQty, fills, orderId: order.orderId };
  }

  public async process({message,clientId,}: {message: MessageFromApi; clientId: string;}) {
    console.log("⚙️ [Engine] Processing message:", message);
    switch (message.type) {
      case CREATE_ORDER:
        try {
          const { executedQty, fills, orderId } = this.createOrder(
            message.data.market,
            message.data.price,
            message.data.quantity,
            message.data.side,
            message.data.userId
          );
          console.log("📝 [Engine] Created order:", { orderId, executedQty, fills });

          await RedisManager.getInstance().sendToApi(clientId, {
            type: "ORDER_PLACED",
            payload: { orderId, executedQty, fills },
          });
           console.log("📤 [Engine] Published ORDER_PLACED to channel:", clientId);
        } catch (e) {
          console.error("❌ Engine error:", e);
          await RedisManager.getInstance().sendToApi(clientId, {
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
