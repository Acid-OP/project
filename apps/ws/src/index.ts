import WebSocket, { WebSocketServer } from 'ws';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PORT) throw new Error('PORT is not defined in .env');

const port = parseInt(process.env.PORT, 10);
const wss = new WebSocketServer({ port });

wss.on('connection', (ws: WebSocket) => {
  ws.send('Hello from server!');

  ws.on('message', (message: WebSocket.Data) => {
    ws.send(`Server got: ${message}`);
  });
});
