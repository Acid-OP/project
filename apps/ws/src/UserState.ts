import { Broker } from "./Broker";
import { User } from "./User";
import { WebSocket } from "ws";

export class UserState {
    private static instance: UserState;
    private users: Map<string, User> = new Map();
    private constructor() {
    }

    public static getInstance(){
        if(!this.instance) {
            this.instance = new UserState();
        }
        return this.instance;
    }

    public addUser(ws: WebSocket) {
        const id = this.getRandomId();
        // @ts-ignore
        const user = new User(id, ws);
        this.users.set(id, user);
        this.registerOnClose(ws, id);
        return user;
    }
    
    public getUser(id: string) {
        return this.users.get(id);
    }

    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            this.users.delete(id);
            Broker.getInstance().userLeft(id);

        });
    }
}