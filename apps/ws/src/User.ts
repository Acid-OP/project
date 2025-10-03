export class User{
    private id: string;
    private ws : WebSocket;
    public constructor(id:string , ws:WebSocket){
        this.id = id;
        this.ws = ws;
    }
}