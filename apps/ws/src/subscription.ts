import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class Subscription {
    private static instance: Subscription;
    private userSubscriptions: Map<string, string[]> = new Map();
    private topicSubscribers: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;
    private isReady: boolean = false;

    constructor() {
        this.redisClient = createClient();
        this.initRedis();
    }

    private async initRedis() {
        try {
            await this.redisClient.connect();
            this.isReady = true;
            console.log('Redis connected successfully');
        } catch (error) {
            console.error('Redis connection failed:', error);
        }

        this.redisClient.on('error', (err) => {
            console.error('Redis Client Error:', err);
            this.isReady = false;
        });

        this.redisClient.on('ready', () => {
            this.isReady = true;
        });
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Subscription();
        }
        return this.instance;
    }

    public subscribe(userId: string, subscription: string) {
        if (!this.isReady) {
            console.error('Redis not ready, cannot subscribe');
            return;
        }

        if (!this.isValidSubscription(subscription)) {
            console.warn(`Invalid subscription format: ${subscription}`);
            return;
        }

        if (this.userSubscriptions.get(userId)?.includes(subscription)) {
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
            this.redisClient.subscribe(subscription, this.Callback);
            console.log(`Subscribed to Redis channel: ${subscription}`);
        }
    }

    private Callback = (message: string, channel: string) => {
        try {
            const parsedMessage = JSON.parse(message);
            const subscribers = this.topicSubscribers.get(channel);
            
            if (!subscribers) return;

            subscribers.forEach(userId => {
                const user = UserManager.getInstance().getUser(userId);
                if (user) {
                    user.emit(parsedMessage);
                }
            });
        } catch (error) {
            console.error('Error processing Redis message:', error);
        }
    }

    public unsubscribe(userId: string, subscription: string) {
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
                this.redisClient.unsubscribe(subscription);
                this.topicSubscribers.delete(subscription);
                console.log(`Unsubscribed from Redis channel: ${subscription}`);
            } else {
                this.topicSubscribers.set(subscription, newSubscribers);
            }
        }
    }

    public userLeft(userId: string) {
        const subscriptions = this.userSubscriptions.get(userId);
        if (subscriptions) {
            subscriptions.forEach(sub => this.unsubscribe(userId, sub));
        }
    }

    private isValidSubscription(sub: string): boolean {
        const pattern = /^[A-Z0-9]+@(ticker|depth|trade|kline)$/;
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
            console.log('Redis connection closed');
        } catch (error) {
            console.error('Error closing Redis connection:', error);
        }
    }
}