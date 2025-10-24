import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class Subscription {
    private static instance: Subscription;
    private userSubscriptions: Map<string, string[]> = new Map();
    private topicSubscribers: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;
    private isReady: boolean = false;
    private readyPromise: Promise<void>; // Add this

    constructor() {
        this.redisClient = createClient();
        this.readyPromise = this.initRedis(); // Store the promise
    }

    private async initRedis(): Promise<void> {
        try {
            await this.redisClient.connect();
            this.isReady = true;
            console.log('✅ Redis connected successfully');
        } catch (error) {
            console.error('❌ Redis connection failed:', error);
            throw error; // Re-throw to handle in caller
        }

        this.redisClient.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
            this.isReady = false;
        });

        this.redisClient.on('ready', () => {
            this.isReady = true;
            console.log('🔔 Redis ready');
        });
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Subscription();
        }
        return this.instance;
    }

    // Add method to ensure Redis is ready
    private async ensureReady() {
        if (!this.isReady) {
            await this.readyPromise; // Wait for connection
        }
    }

    public async subscribe(userId: string, subscription: string) {
        // Wait for Redis to be ready
        await this.ensureReady();

        if (!this.isValidSubscription(subscription)) {
            console.warn(`⚠️ Invalid subscription format: ${subscription}`);
            return;
        }

        if (this.userSubscriptions.get(userId)?.includes(subscription)) {
            console.log(`⚠️ User ${userId} already subscribed to ${subscription}`);
            return;
        }

        this.userSubscriptions.set(
            userId,
            (this.userSubscriptions.get(userId) || []).concat(subscription)
        );

        this.topicSubscribers.set(
            subscription,
            (this.topicSubscribers.get(subscription) || []).concat(userId)
        );

        if (this.topicSubscribers.get(subscription)?.length === 1) {
            await this.redisClient.subscribe(subscription, this.Callback);
            console.log(`🟢 Subscribed to Redis channel: ${subscription}`);
        } else {
            console.log(`🟢 User ${userId} added to existing subscription: ${subscription}`);
        }
    }

    private Callback = (message: string, channel: string) => {
        try {
            const parsedMessage = JSON.parse(message);
            const subscribers = this.topicSubscribers.get(channel);

            if (!subscribers) {
                console.warn(`⚠️ No subscribers for channel: ${channel}`);
                return;
            }

            console.log(`📡 Broadcasting to ${subscribers.length} subscribers on ${channel}`);
            subscribers.forEach(userId => {
                const user = UserManager.getInstance().getUser(userId);
                if (user) {
                    user.emit(parsedMessage);
                    console.log(`📨 Message sent to user ${userId} on ${channel}`);
                } else {
                    console.warn(`⚠️ User ${userId} not found in UserManager`);
                }
            });
        } catch (error) {
            console.error('❌ Error processing Redis message:', error);
        }
    }

    public async unsubscribe(userId: string, subscription: string) {
        await this.ensureReady();

        const userSubs = this.userSubscriptions.get(userId);
        if (userSubs) {
            const filtered = userSubs.filter(s => s !== subscription);
            if (filtered.length === 0) {
                this.userSubscriptions.delete(userId);
            } else {
                this.userSubscriptions.set(userId, filtered);
            }
        }

        const subscribers = this.topicSubscribers.get(subscription);
        if (subscribers) {
            const newSubscribers = subscribers.filter(s => s !== userId);

            if (newSubscribers.length === 0) {
                await this.redisClient.unsubscribe(subscription);
                this.topicSubscribers.delete(subscription);
                console.log(`🔴 Unsubscribed from Redis channel: ${subscription}`);
            } else {
                this.topicSubscribers.set(subscription, newSubscribers);
            }
        }
    }

    public async userLeft(userId: string) {
        const subscriptions = this.userSubscriptions.get(userId);
        if (subscriptions) {
            for (const sub of subscriptions) {
                await this.unsubscribe(userId, sub);
            }
            console.log(`🟠 User left: ${userId}`);
        }
    }

private isValidSubscription(sub: string): boolean {
    // Changed pattern to match depth@SYMBOL format from Engine
    const pattern = /^(ticker|depth|trade|kline)@[A-Z0-9_]+$/;
    return pattern.test(sub) && sub.length < 50;
}

    public getStats() {
        return {
            totalUsers: this.userSubscriptions.size,
            totalTopics: this.topicSubscribers.size,
            isRedisReady: this.isReady
        };
    }

    public async cleanup() {
        try {
            await this.redisClient.quit();
            console.log('🔒 Redis connection closed');
        } catch (error) {
            console.error('❌ Error closing Redis connection:', error);
        }
    }
}