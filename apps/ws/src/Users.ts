import { WebSocket } from "ws";
import { IncomingMessage, SUBSCRIBE } from "./types/Users";

export class Users{
    private id:string;
    private ws: WebSocket;

    constructor(id:string , ws:WebSocket) {
        this.id = id;
        this.ws = ws;
        this.Listners();
    }
    private Listners(){
        this.ws.on("message" , (message:string) => {
            const response : IncomingMessage = JSON.parse(message);
            if(response.method === SUBSCRIBE){

            }

            if(response.method === SUBSCRIBE) {

            }    
        });
    }

}