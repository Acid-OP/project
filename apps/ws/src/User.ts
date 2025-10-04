import { WebSocket } from "ws";
import { Broker } from "./Broker";
import type { IncomingMessage, OutgoingMessage } from "./types/types";

export class User{
    private id: string;
    private ws : WebSocket;
    
    public constructor(id:string , ws:WebSocket){
        this.id = id;
        this.ws = ws;
        this.eventListners();
    }

    public emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
    }

    private eventListners() {
        this.ws.on("message", (message:string)=>{
            const response: IncomingMessage = JSON.parse(message);
            if(response.method === "SUBSCRIBE") {
                response.params.forEach(x => Broker.getInstance().subscribe(this.id, x));
            }

            if(response.method === "UNSUBSCRIBE") {
                
            }
        })
    }
}