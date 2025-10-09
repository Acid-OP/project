import { createClient, RedisClientType } from "redis";
import { ResponseToHTTP } from "./types/responses";

export class RedisManager {
    private client:RedisClientType;
    private static instance:RedisManager;
    constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public static getInstance(){
        if(!this.instance){
            this.instance = new RedisManager()
        }
        return this.instance;
    }
    public ResponseToHTTP(clientId:string ,message:ResponseToHTTP){
        this.client.publish(clientId, JSON.stringify(message))
    }
}