import { createClient, RedisClientType } from "redis";
import { MessageFromOrderbook } from "./types";

export class RedisManager{
    private client: RedisClientType;
    private publisher: RedisClientType;
    private static instance:RedisManager;

    private constructor(){
        this.client = createClient();
        this.client.connect();
        this.publisher = createClient();
        this.publisher.connect();
    }

    public static getInstance(){
        if (! this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }
    public getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    public sendAndAwait(message: any) {
        return new Promise<MessageFromOrderbook>((resolve) => {
            const id = this.getRandomClientId();
            console.log("🆔 [RedisManager] Generated clientId:", id);
            this.client.subscribe(id, (message) => {
                console.log("✅ [RedisManager] Got response on channel:", id, "Message:", message);
                this.client.unsubscribe(id);
                resolve(JSON.parse(message));
            });
            console.log("📤 [RedisManager] Pushing message to Redis queue:", message);
            this.publisher.lPush("messages", JSON.stringify({ clientId: id, message }));
        });
    }
}