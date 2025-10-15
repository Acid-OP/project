export class Subscription{
    private userSubscriptions: Map<string, string[]> = new Map();
    private topicSubscribers: Map<string, string[]> = new Map();

    constructor() {
    }

    public subscribe(userId:string , subscription:string) {
        if (this.userSubscriptions.get(userId)?.includes(subscription)) {
            return
        }
        this.userSubscriptions.set(userId ,(this.userSubscriptions.get(userId) || []).concat(subscription));
        this.topicSubscribers.set(subscription , (this.topicSubscribers.get(subscription) || []).concat(userId));

    }
}