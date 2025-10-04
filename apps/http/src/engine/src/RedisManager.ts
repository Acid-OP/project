import { createClient, RedisClientType } from "redis";
import { MessageToApi } from "./types/ApiMessages";
import { response } from "./types/market";

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
    public publishMessage(channel: string, message: response) {
        this.client.publish(channel, JSON.stringify(message));
    }

    public sendToApi(clientId: string, message: MessageToApi) {
        console.log("📤 [RedisManager Engine] Publishing to clientId:", clientId, "Message:", message);
        this.client.publish(clientId, JSON.stringify(message));
    }
}