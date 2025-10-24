import { createClient, RedisClientType } from "redis";
import { ResponseToHTTP } from "./types/responses";

export class RedisManager {
    private client: RedisClientType;
    private static instance: RedisManager;

    private constructor() {
        this.client = createClient();
        this.client.connect()
            .then(() => console.log("🔗 RedisManager connected to Redis"))
            .catch((err) => console.error("❌ RedisManager connection error:", err));
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new RedisManager();
        }
        return this.instance;
    }

    public async Publish(channel: string, message: any) {
        try {
            console.log("📡 Publishing to channel:", channel);
            await this.client.publish(channel, JSON.stringify(message));
            console.log(`✅ Published successfully to ${channel}`);
        } catch (err) {
            console.error(`❌ Failed to publish to ${channel}:`, err);
            throw err;
        }
    }

    public async ResponseToHTTP(clientId: string, message: ResponseToHTTP) {
        try {
            console.log("📤 Sending ResponseToHTTP for clientId:", clientId);
            await this.client.publish(clientId, JSON.stringify(message));
            console.log(`✅ Response sent to clientId ${clientId}`);
        } catch (err) {
            console.error(`❌ Failed to send response to ${clientId}:`, err);
            throw err;
        }
    }

    public async cleanup() {
        await this.client.quit();
    }
}