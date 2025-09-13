import { createClient, } from "redis";
import { Engine } from "./trade/Engine";
import { RedisManager } from "./RedisManager";
import { Order } from "./trade/OrderBook";

async function main() {
    const engine = new Engine(); 
    const redisClient = createClient();
    await redisClient.connect();
    console.log("connected to redis");

    while (true) {
        const response = await redisClient.rPop("messages" as string)
        if (!response) {
        }  else {
            console.log("📥 [Engine] Popped message from Redis:", response);
            engine.process(JSON.parse(response));
        }        
    }

}

main();