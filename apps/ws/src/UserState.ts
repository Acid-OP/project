import { Broker } from "./Broker";
import { User } from "./User";
import { WebSocket } from "ws";

export class UserState {
    private static instance: UserState;
    private users: Map<string, User> = new Map();
    
    private constructor() {
        console.log("[UserState] Initialized");
    }
    
    public static getInstance(){
        if(!this.instance) {
            this.instance = new UserState();
        }
        return this.instance;
    }
    
    public addUser(ws: WebSocket) {
        const id = this.getRandomId();
        console.log(`[UserState] Adding user ${id}`);
        // @ts-ignore
        const user = new User(id, ws);
        this.users.set(id, user);
        console.log(`[UserState] Total users: ${this.users.size}`);
        this.registerOnClose(ws, id);
        return user;
    }
    
    public getUser(id: string) {
        console.log(`[UserState] Getting user ${id}`);
        return this.users.get(id);
    }
    
    private getRandomId() {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
    
    private registerOnClose(ws: WebSocket, id: string) {
        ws.on("close", () => {
            console.log(`[UserState] User ${id} disconnected, removing from state`);
            this.users.delete(id);
            console.log(`[UserState] Total users: ${this.users.size}`);
            Broker.getInstance().userLeft(id);
        });
    }
}