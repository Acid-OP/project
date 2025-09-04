import { createClient } from "redis";

export interface Order {
  price: number;
  quantity: number;
  orderId: string;
  filled: number;
  side: "buy" | "sell";
  userId: string;
}

function createOrder(
  market: string,
  price: string,
  quantity: string,
  side: "buy" | "sell",
  userId: string
) {
  const orderbook = {
    addOrder: (order: Order) => {
      return {
        executedQty: Number(quantity),
        fills: [{ qty: Number(quantity), price: Number(price) }],
      };
    },
  };

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

  const { fills, executedQty } = orderbook.addOrder(order);
  return { executedQty, fills, orderId: order.orderId };
}

class Engine {
  process({ message, clientId }: { message: any; clientId: string }) {
    if (message.type === "CREATE_ORDER") {
      const { executedQty, fills, orderId } = createOrder(
        message.data.market,
        message.data.price,
        message.data.quantity,
        message.data.side,
        message.data.userId
      );

      console.log("✅ Order created:", { clientId, executedQty, fills, orderId });
    }
  }
}

async function main() {
  const engine = new Engine();
  const redisClient = createClient();
  await redisClient.connect();

  while (true) {
    const response = await redisClient.rPop("messages");
    if (!response) {
      continue;
    }
    engine.process(JSON.parse(response));
  }
}

main();
