import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

const portEnv = process.env.WS_PORT;

if (!portEnv) {
  throw new Error("WS_PORT is not defined in .env");
}

const port = Number(portEnv);

const wss = new WebSocketServer({ port });

wss.on("connection", (ws) => {
  console.log("Client connected");
});