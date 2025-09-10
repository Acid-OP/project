import { createClient, RedisClientType } from "redis";
type  MessageToApi = {
    type: "ORDER_PLACED",
    payload: {
        orderId: string,
        executedQty: number,
        fills: {
            price: string,
            qty: number,
            tradeId: number
        }[]
    }
}| {
    type: "ORDER_CANCELLED",
    payload: {
        orderId: string,
        executedQty: number,
        remainingQty: number
    }
}
export const CREATE_ORDER = "CREATE_ORDER"

export class RedisManager {
    private client: RedisClientType;
    private static instance: RedisManager;

    constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public sendToApi(clientId: string, message: MessageToApi) {
        console.log("📤 [RedisManager Engine] Publishing to clientId:", clientId, "Message:", message);
        this.client.publish(clientId, JSON.stringify(message));
    }
}