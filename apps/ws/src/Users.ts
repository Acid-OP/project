import { WebSocket } from "ws";
import { IncomingMessage, OutgoingMessage, SUBSCRIBE, UNSUBSCRIBE } from "./types/Users";
import { Subscription } from "./subscription";

export class Users {
    private id: string;
    private ws: WebSocket;

    constructor(id: string, ws: WebSocket) {
        this.id = id;
        this.ws = ws;
        console.log(`🟢 User instance created: ${id}`);
        this.Listners();
    }

    emit(message: OutgoingMessage) {
        this.ws.send(JSON.stringify(message));
        console.log(`📨 Sent message to user ${this.id}:`, message);
    }

   private Listners() {
    this.ws.on("message", async (message: string) => {
        console.log(`📥 Received message from user ${this.id}:`, message.toString());
        try {
            const response: IncomingMessage = JSON.parse(message.toString());

            if (response.method === SUBSCRIBE) {
                console.log(`🔔 Subscribing user ${this.id} to:`, response.params);
                for (const sub of response.params) {
                    const [symbol, type] = sub.split('@');
                    const engineFormat = `${type}@${symbol}`;
                    
                    await Subscription.getInstance().subscribe(this.id, engineFormat);
                    console.log(`🟢 User ${this.id} subscribed to ${engineFormat} (from ${sub})`);
                }
            }

            if (response.method === UNSUBSCRIBE) {
                console.log(`🔕 Unsubscribing user ${this.id} from:`, response.params);
                for (const sub of response.params) {
                    const [symbol, type] = sub.split('@');
                    const engineFormat = `${type}@${symbol}`;
                    
                    await Subscription.getInstance().unsubscribe(this.id, engineFormat);
                    console.log(`🔴 User ${this.id} unsubscribed from ${engineFormat}`);
                }
            }
        } catch (error) {
            console.error(`❌ Error processing message from user ${this.id}:`, error);
        }
    });

    this.ws.on('error', (error) => {
        console.error(`❌ WebSocket error for user ${this.id}:`, error);
    });

    this.ws.on('close', () => {
        console.log(`🔴 WebSocket closed for user ${this.id}`);
    });
}
}