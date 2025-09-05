import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const CREATE_ORDER = "CREATE_ORDER";
export const orderRouter: Router = Router();

orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    console.log("📩 [API] Incoming order request:", { market, price, quantity, side, userId });
    const response = await RedisManager.getInstance().sendAndAwait({
        type: CREATE_ORDER,
        data: {
            market,
            price,
            quantity,
            side,
            userId
        }
    });
    console.log("📤 [API] Sending response back to client:", response);
    res.json(response.payload);
});