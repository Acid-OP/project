import { Router } from "express";

export const orderRouter: Router = Router();

orderRouter.post("/", async(req,res) => {
    const {market,price,quanitiy,side,userId} = req.body;
} )