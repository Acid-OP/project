import { createClient, RedisClientType } from "redis";
import { ResponseToHTTP } from "./types/responses";

export class RedisManager {
    private client:RedisClientType;
    constructor() {
        this.client = createClient();
        this.client.connect();
    }

    public ResponseToHTTP(clientId:string ,message:ResponseToHTTP){
        this.client.publish(clientId, JSON.stringify(message))
    }
}