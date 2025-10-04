import { createClient, type RedisClientType } from "redis";
import { UserState } from "./UserState";
import type { OutgoingMessage } from "./types/types";

export class Broker {
    public static instance: Broker;
    private subscriptions: Map<string, string[]> = new Map(); 
    private channelUsers: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;

    private constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();

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
        }
        this.subscriptions.set(userId, userSubs);
    }

    private addUserToChannel(subscription: string, userId: string) {
        let users = this.channelUsers.get(subscription) || [];
        if (!users.includes(userId)) {
            users = users.concat(userId); 
        }
        this.channelUsers.set(subscription, users);
    }
    private notifySubscribers(channel: string, parsedMessage: OutgoingMessage) {
        const subscribers = this.channelUsers.get(channel);
        if (!subscribers) return;
        for (const userId of subscribers) {
            const user = UserState.getInstance().getUser(userId);
            if (user) {
                user.emit(parsedMessage);
            }
        }
    }

    private redisCallbackHandler = (message: string, channel: string) => {
        const parsedMessage = JSON.parse(message);
        this.notifySubscribers(channel, parsedMessage);


    }


    public subscribe(userId: string, subscription: string) {
        if (this.subscriptions.get(userId)?.includes(subscription)) {
            return;
        }
        this.addSubscription(userId, subscription);
        this.addUserToChannel(subscription, userId);
        const subscribers = this.channelUsers.get(subscription);
        if (subscribers && subscribers.length === 1) {
            this.redisClient.subscribe(subscription, this.redisCallbackHandler);
        }

    }
}
