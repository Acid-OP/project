import { WebSocketServer } from "ws";
import dotenv from "dotenv"
import { UserManager } from "./UserManager";
dotenv.config()
const PORT = Number(process.env.WS_PORT);

const wss = new WebSocketServer({port: PORT});
wss.on("connection" , (ws) => {
    UserManager.getInstance().addUsers(ws);
});
console.log(`WebSocket server running on port ${PORT}`);