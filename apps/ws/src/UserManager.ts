import { WebSocketServer, WebSocket } from "ws";
import { Users } from "./Users";
export class UserManager {
    private users:Map<string , Users> = new Map();
    constructor() {

    }
    static connect() {
      return new UserManager();
    }
    public addUsers(ws:WebSocket) {
        const id = this.getRandomId();
        const user = new Users(id,ws);
    }

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}