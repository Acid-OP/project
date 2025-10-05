import { createClient, type RedisClientType } from "redis";
import { UserState } from "./UserState";
import type { OutgoingMessage } from "./types/types";

export class Broker {
    public static instance: Broker;
    private subscriptions: Map<string, string[]> = new Map(); 
    private channelUsers: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;

    private constructor() {
        console.log("[Broker] Initializing");
        this.redisClient = createClient();
        this.redisClient.connect();
        console.log("[Broker] Connected to Redis");
    }

    public static getInstance() {
        if (!this.instance) {
            this.instance = new Broker();
        }
        return this.instance;
    }

    private addSubscription(userId: string, subscription: string) {
        let userSubs = this.subscriptions.get(userId) || [];
        if (!userSubs.includes(subscription)) {
            userSubs = userSubs.concat(subscription);
            console.log(`[Broker] Added subscription ${subscription} for user ${userId}`);
        }
        this.subscriptions.set(userId, userSubs);
    }

    private addUserToChannel(subscription: string, userId: string) {
        let users = this.channelUsers.get(subscription) || [];
        if (!users.includes(userId)) {
            users = users.concat(userId);
            console.log(`[Broker] Added user ${userId} to channel ${subscription}`);
        }
        this.channelUsers.set(subscription, users);
        console.log(`[Broker] Channel ${subscription} now has ${users.length} subscribers`);
    }

    private notifySubscribers(channel: string, parsedMessage: OutgoingMessage) {
        const subscribers = this.channelUsers.get(channel);
        if (!subscribers) return;
        console.log(`[Broker] Notifying ${subscribers.length} subscribers on channel ${channel}`);
        for (const userId of subscribers) {
            const user = UserState.getInstance().getUser(userId);
            if (user) {
                user.emit(parsedMessage);
            }
        }
    }

    private redisCallbackHandler = (message: string, channel: string) => {
        console.log(`[Broker] Received message on channel ${channel}`);
        const parsedMessage = JSON.parse(message);
        this.notifySubscribers(channel, parsedMessage);
    }

    public subscribe(userId: string, subscription: string) {
        console.log(`[Broker] Subscribe request: user ${userId} to ${subscription}`);
        if (this.subscriptions.get(userId)?.includes(subscription)) {
            console.log(`[Broker] User ${userId} already subscribed to ${subscription}`);
            return;
        }
        this.addSubscription(userId, subscription);
        this.addUserToChannel(subscription, userId);
        const subscribers = this.channelUsers.get(subscription);
        if (subscribers && subscribers.length === 1) {
            console.log(`[Broker] First subscriber to ${subscription}, subscribing to Redis`);
            this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }
    }

    private removeSubscriptionFromUser(userId: string, subscription: string) {
        let userSubs = this.subscriptions.get(userId) || [];
        userSubs = userSubs.filter(s => s !== subscription);
        if (userSubs.length > 0) {
            this.subscriptions.set(userId, userSubs);
        } else {
            this.subscriptions.delete(userId);
        }
        console.log(`[Broker] Removed subscription ${subscription} from user ${userId}`);
    }

    private removeUserFromChannel(subscription: string, userId: string) {
        let users = this.channelUsers.get(subscription) || [];
        users = users.filter(id => id !== userId);
        if (users.length > 0) {
            this.channelUsers.set(subscription, users);
            console.log(`[Broker] Channel ${subscription} now has ${users.length} subscribers`);
        } else {
            this.channelUsers.delete(subscription);
            console.log(`[Broker] No more subscribers on ${subscription}, unsubscribing from Redis`);
            this.redisClient.unsubscribe(subscription);
        }
    }

    public unsubscribe(userId: string, subscription: string) {
        console.log(`[Broker] Unsubscribe request: user ${userId} from ${subscription}`);
        this.removeSubscriptionFromUser(userId, subscription);
        this.removeUserFromChannel(subscription, userId);
    }

    private unsubscribeAllForUser(userId: string) {
        const userSubscriptions = this.subscriptions.get(userId);
        if (!userSubscriptions) return;
        console.log(`[Broker] Unsubscribing user ${userId} from ${userSubscriptions.length} channels`);
        for (const subscription of userSubscriptions) {
            this.unsubscribe(userId, subscription);
        }
    }

    public userLeft(userId: string) {
        console.log(`[Broker] User ${userId} left, cleaning up subscriptions`);
        this.unsubscribeAllForUser(userId);
    }
}