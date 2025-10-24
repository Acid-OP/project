import { WebSocketServer, WebSocket } from "ws";
import { Users } from "./Users";
import { Subscription } from "./subscription";

export class UserManager {
    private static instance: UserManager;
    private users: Map<string, Users> = new Map();

    constructor() {}

    public static getInstance() {
        if (!this.instance) {
            this.instance = new UserManager();
        }
        return this.instance;
    }

    public addUsers(ws: WebSocket) {
        const id = this.getRandomId();
        const user = new Users(id, ws);
        this.users.set(id, user);
        console.log(`🟢 User connected: ${id}`);
        this.registerOnClose(ws, id);
        return user;
    }

    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.users.delete(id);
            console.log(`🔴 User disconnected: ${id}`);
            Subscription.getInstance().userLeft(id);
        });
    }

    public getUser(id: string) {
        return this.users.get(id);
    }

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
}
