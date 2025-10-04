export class Broker {
    public static instance:Broker;
    private subscriptions: Map<string, Set<string>> = new Map(); 
    private constructor() {

    }
    public static getInstance(){
        if(!this.instance) {
            return this.instance = new Broker();
        }
        return this.instance;
    }

    public subscribe(userId: string, subscription: string) {
        const userSubs = this.subscriptions.get(userId) || new Set();
        userSubs.add(subscription);
        this.subscriptions.set(userId, userSubs);
    }
}