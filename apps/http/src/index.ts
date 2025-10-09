import express from "express";
import { createClient } from "redis";
import dotenv from "dotenv";
import "./Engine/dequeue";
import { Manager } from "./RedisClient";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.HTTP_PORT || 3000;

app.post("/order", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    console.log("sent order from API");
    try {
      await Manager.getInstance().Enqueue(req.body);
      res.status(200).send({ message: "Order queued" });
    } catch (err) {
      res.status(500).send({ error: "Failed to queue order" });
    }
  });

app.listen(PORT, () => {
    console.log(`🚀 HTTP server running on port ${PORT}`);
});
