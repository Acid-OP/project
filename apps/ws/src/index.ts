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

wss.on("connection", (ws) => {
  UserState.getInstance().addUser(ws);
});