import express from "express";
import dotenv from "dotenv";
import "./Engine/main/dequeue";
import cors from "cors";
import { Manager } from "./RedisClient";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_TICKER } from "./types/orders";

dotenv.config();
const app = express();
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:3000',  
  credentials: true
}));
const PORT = process.env.HTTP_PORT;

app.post("/order", async (req, res) => {
  const { market, price, quantity, side, userId } = req.body;
  console.log("📩 POST /order:", { market, price, quantity, side, userId });
  try {
    const data = {
      type: CREATE_ORDER,
      data: {
        market,
        price,
        quantity,
        side,
        userId,
      },
    };
    const response = await Manager.getInstance().Enqueue(data);
    console.log("✅ Order response:", response.payload);
    res.json(response.payload);
  } catch (err) {
    console.error("❌ Failed to queue order:", err);
    res.status(500).send({ error: "Failed to queue order" });
  }
});

app.delete("/order", async (req, res) => {
  const { orderId, market } = req.body;
  console.log("🗑️ DELETE /order:", { orderId, market });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: CANCEL_ORDER,
      data: {
        orderId,
        market,
      },
    });
    console.log("✅ Cancel order response:", response.payload);
    res.json(response.payload);
  } catch (e) {
    console.error("❌ Error in /order DELETE:", e);
  }
});

app.get("/depth", async (req, res) => {
  const { symbol } = req.query;
  console.log("📊 GET /depth:", { symbol });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: GET_DEPTH,
      data: {
        market: symbol as string,
      },
    });
    console.log("✅ Depth response:", response.payload);
    res.json(response.payload);
  } catch (e) {
    console.error("❌ Error in /depth:", e);
  }
});

app.get("/tickers", async (req, res) => {
  const { symbol } = req.query;
  console.log("📈 GET /tickers:", { symbol });
  try {
    const response = await Manager.getInstance().Enqueue({
      type: GET_TICKER,
      data: {
        market: symbol as string,
      },
    });
    console.log("✅ Ticker response:", response.payload);
    res.json(response.payload);
  } catch (e) {
    console.error("❌ Error in /tickers:", e);
  }
});

app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`);
});
