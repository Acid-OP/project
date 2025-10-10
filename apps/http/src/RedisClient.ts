import { createClient, RedisClientType } from "redis";
import { ResponseFromOrderbook } from "./types/responses";

export class Manager {
    private client: RedisClientType;
    private static instance:Manager;
    private constructor(){
        this.client = createClient(); 
        this.client.connect();
    }
    
    static getInstance(){
        if (!this.instance) {
            this.instance = new Manager();
        }
        return this.instance;
    } 

    getRandomClientId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    }

    public async Enqueue(message:any) {
        return new Promise<ResponseFromOrderbook>((resolve, reject) => {
            const id = this.getRandomClientId();
            const dataToQueue = { clientId: id, message };

            this.client.subscribe(id, (msg) => {
                this.client.unsubscribe(id);
                resolve(JSON.parse(msg));
            });
            this.client.lPush("body", JSON.stringify(dataToQueue)).catch(reject);
        });
    }

}