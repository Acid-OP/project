import { WebSocket } from "ws";
import { IncomingMessage, OutgoingMessage, SUBSCRIBE, UNSUBSCRIBE } from "./types/Users";
import { Subscription } from "./subscription";

export class Users{
    private id:string;
    private ws: WebSocket;

    constructor(id:string , ws:WebSocket) {
        this.id = id;
        this.ws = ws;
        this.Listners();
    }
    emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
    }
    private Listners(){
        this.ws.on("message" , (message:string) => {
            const response : IncomingMessage = JSON.parse(message);
            if(response.method === SUBSCRIBE){
                response.params.forEach(s => Subscription.getInstance().subscribe(this.id, s));
            }
            if(response.method === UNSUBSCRIBE) {

            }    
        });
    }

}