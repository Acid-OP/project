import { WebSocketServer, WebSocket } from "ws";

export class Users{
    private id:string;
    private ws: WebSocket;

    constructor(id:string , ws:WebSocket) {
        this.id = id;
        this.ws = ws;
        this.Listners();
    }
    private Listners(){
        this.ws.on("message" , (ws) => {

        })
    }

}