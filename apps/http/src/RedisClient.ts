import { createClient, RedisClientType } from "redis";
import { ResponseFromOrderbook } from "./types/responses";

export class Manager {
    private client: RedisClientType;          // For queue operations (LPUSH)
    private pubSubClient: RedisClientType;    // For PubSub (SUBSCRIBE)
    private static instance: Manager;

    private constructor() {
        // Client for regular operations (LPUSH, RPOP, etc.)
        this.client = createClient();
        this.client.connect()
            .then(() => console.log("🔗 Redis client connected successfully"))
            .catch((err) => console.error("❌ Redis client connection failed:", err));

        // Separate client for PubSub operations
        this.pubSubClient = createClient();
        this.pubSubClient.connect()
            .then(() => console.log("🔗 Redis PubSub client connected successfully"))
            .catch((err) => console.error("❌ Redis PubSub client connection failed:", err));
    }

    static getInstance() {
        if (!this.instance) {
            this.instance = new Manager();
        }
        return this.instance;
    }

    getRandomClientId() {
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        console.log("🆔 Generated clientId:", id);
        return id;
    }

    public async Enqueue(message: any) {
        console.log("📤 Enqueue called with message:", message);
        return new Promise<ResponseFromOrderbook>((resolve, reject) => {
            const id = this.getRandomClientId();
            const dataToQueue = { clientId: id, message };

            this.pubSubClient.subscribe(id, (msg) => {
                console.log(`📥 Received message on channel ${id}:`, msg);
                this.pubSubClient.unsubscribe(id);
                try {
                    resolve(JSON.parse(msg));
                } catch (err) {
                    console.error("❌ Failed to parse response message:", err);
                    reject(err);
                }
            });

            this.client.lPush("body", JSON.stringify(dataToQueue))
                .then(() => console.log("🧾 Message pushed to queue:", dataToQueue))
                .catch((err) => {
                    console.error("❌ Failed to push to Redis queue:", err);
                    reject(err);
                });
        });
    }

    public async cleanup() {
        await this.client.quit();
        await this.pubSubClient.quit();
    }
}