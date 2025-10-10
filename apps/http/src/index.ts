import express from "express";
import dotenv from "dotenv";
import "./Engine/main/dequeue";
import { Manager } from "./RedisClient";
import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH} from "./types/orders";
dotenv.config();
const app = express();
app.use(express.json());
const PORT = process.env.HTTP_PORT;

  app.post("/order", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    try {
      const data = {
        type: CREATE_ORDER,
        data: {
          market,
          price,
          quantity,
          side,
          userId
        }
      }
      const response = await Manager.getInstance().Enqueue(data);
      res.json(response.payload);
    } catch (err) {
      res.status(500).send({ error: "Failed to queue order" });
    }
  });

  app.delete("/order" , async(req,res) => {
    const {orderId , market} = req.body;
    try{
      const response = await Manager.getInstance().Enqueue({
        type: CANCEL_ORDER,
        data: {
          orderId,
          market
        }
      })
      res.json(response.payload);
    }catch(e){
      console.log(e);
    }
  })

  app.get("/depth" , async(req,res) => {
    const {symbol} = req.query;
    try{
      const response = await Manager.getInstance().Enqueue({
        type: GET_DEPTH,
        data: {
          market : symbol as string
        }
      })
      res.json(response.payload)
    }catch(e){
      console.log(e);
    }
  })
  
app.listen(PORT, () => {
    console.log(`🚀 HTTP server running on port ${PORT}`);
});
