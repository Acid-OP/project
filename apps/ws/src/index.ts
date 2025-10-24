import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { UserManager } from "./UserManager";

dotenv.config();
const PORT = Number(process.env.WS_PORT);

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws) => {
    console.log("🟢 New WebSocket connection established");
    UserManager.getInstance().addUsers(ws);
});

wss.on("error", (err) => {
    console.error("❌ WebSocket server error:", err);
});

console.log(`🚀 WebSocket server running on port ${PORT}`);
