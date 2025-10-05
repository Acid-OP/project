import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import { UserState } from "./UserState";

dotenv.config();

const portEnv = process.env.WS_PORT;

if (!portEnv) {
  throw new Error("WS_PORT is not defined in .env");
}

const port = Number(portEnv);

const wss = new WebSocketServer({ port });

console.log(`🌐 [WebSocket] Server starting on port ${port}`);

wss.on("connection", (ws) => {
  console.log(`🔌 [WebSocket] New client connected`);
  UserState.getInstance().addUser(ws);
});

wss.on("listening", () => {
  console.log(`✅ [WebSocket] Server listening on port ${port}`);
});

wss.on("error", (error) => {
  console.error("❌ [WebSocket] Server error:", error);
});