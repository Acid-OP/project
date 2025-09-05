import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { orderRouter } from "./routes/orderRouter";
import "./engine/src/index";
const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.use("/api/v1/order", orderRouter);
const PORT = process.env.HTTP_PORT;
app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port ${PORT}`)})