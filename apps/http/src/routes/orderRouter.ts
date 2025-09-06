import { Router } from "express";
import { RedisManager } from "../RedisManager";

export const CREATE_ORDER = "CREATE_ORDER";
export const orderRouter: Router = Router();

orderRouter.post("/", async (req, res) => {
    const { market, price, quantity, side, userId } = req.body;
    if (!market || !price || !quantity || !side || !userId) {
        return res.status(400).json({ 
            error: "Missing required fields" 
        });
    }
    if (typeof market !== 'string' || typeof price !== 'string' || 
        typeof quantity !== 'string' || typeof userId !== 'string') {
            return res.status(400).json({ 
              error: "Invalid data types" 
            });
        }
    if (side !== 'buy' && side !== 'sell') {
        return res.status(400).json({ 
            error: "Side must be 'buy' or 'sell'" 
        });
    }

    const numPrice = Number(price);
    const numQuantity = Number(quantity);

        if (isNaN(numPrice) || numPrice <= 0) {
        return res.status(400).json({ 
            error: "Price must be a positive number" 
        });
    }
    
    if (isNaN(numQuantity) || numQuantity <= 0) {
        return res.status(400).json({ 
            error: "Quantity must be a positive number" 
        });
    }
    
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