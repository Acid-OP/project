import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
import "./Engine/dequeue";
dotenv.config();

const app = express();
app.use(express.json());

const client = createClient();
client.connect();

app.post("/order", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    console.log("sent order from API");
    try {
      await client.lPush("body", JSON.stringify(req.body)); 
      res.status(200).send({ message: "Order queued" });
    } catch (err) {
      res.status(500).send({ error: "Failed to queue order" });
    }
  });

  const PORT = process.env.HTTP_PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 HTTP server running on port ${PORT}`);
  });
