import { WebSocket } from "ws";
import { Broker } from "./Broker";
import type { IncomingMessage, OutgoingMessage } from "./types/types";

export class User{
    private id: string;
    private ws : WebSocket;
    
    public constructor(id:string , ws:WebSocket){
        this.id = id;
        this.ws = ws;
        console.log(`[User] Created user ${id}`);
        this.eventListners();
    }

    public emit(message: OutgoingMessage) {
        console.log(`[User] Sending to ${this.id}:`, message);
        this.ws.send(JSON.stringify(message));
    }

    private eventListners() {
        this.ws.on("message", (message:string)=>{
            console.log(`[User] Message from ${this.id}:`, message);
            try{
                const response: IncomingMessage = JSON.parse(message);
                if(response.method === "SUBSCRIBE") {
                    console.log(`[User] ${this.id} subscribing to:`, response.params);
                    response.params.forEach(x => Broker.getInstance().subscribe(this.id, x));
                }
                if(response.method === "UNSUBSCRIBE") {
                    console.log(`[User] ${this.id} unsubscribing from:`, response.params);
                    response.params.forEach(x => Broker.getInstance().unsubscribe(this.id, x));
                }
            }catch(e){
                console.error(`[User] Invalid WS message from ${this.id}:`, e);
            }

        })
    }
}