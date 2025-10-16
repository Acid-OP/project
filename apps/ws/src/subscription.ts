import { createClient, RedisClientType } from "redis";
import { UserManager } from "./UserManager";

export class Subscription{
    private static instance: Subscription;
    private userSubscriptions: Map<string, string[]> = new Map();
    private topicSubscribers: Map<string, string[]> = new Map();
    private redisClient: RedisClientType;

    constructor() {
        this.redisClient = createClient();
        this.redisClient.connect();
    }

    public static getInstance() {
        if (!this.instance)  {
            this.instance = new Subscription();
        }
        return this.instance;
    }

    public subscribe(userId:string , subscription:string) {
        if (this.userSubscriptions.get(userId)?.includes(subscription)) {
            return
        }
        this.userSubscriptions.set(userId ,(this.userSubscriptions.get(userId) || []).concat(subscription));
        this.topicSubscribers.set(subscription , (this.topicSubscribers.get(subscription) || []).concat(userId));
        if (this.topicSubscribers.get(subscription)?.length === 1) {
            this.redisClient.subscribe(subscription, this.Callback);
        }
    }

    private Callback = (message: string, channel: string) => {
        const parsedMessage = JSON.parse(message);
        this.topicSubscribers.get(channel)?.forEach(s => UserManager.getInstance().getUser(s)?.emit(parsedMessage));
    }    

    public userLeft(userId: string) {
        this.userSubscriptions.get(userId)?.forEach(s => this.unsubscribe(userId, s));
    
    }
    public unsubscribe(userId: string, subscription: string) {
    }
}