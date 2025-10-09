import { CREATE_ORDER } from "../types/orders";
import { OrderBook } from "./OrderBook";
import { ResponseFromHTTP } from "./types/responses";
import { userIdd , UserBalance, BASE_CURRENCY, Order, Fill } from "./types/UserTypes";

export class Engine {
    private orderBooks:OrderBook[] = [];
    private balances: Map<userIdd , UserBalance> = new Map();
    constructor() {
        this.orderBooks = [
            new OrderBook("CR7_USD", [] , [] , 0 , 50000),
            new OrderBook("ELON_USD", [] , [] , 0 , 50000)
        ];
    }
    
    private updateBalancesAfterTrade(
        userId: string, 
        fills: Fill[], 
        side: "buy" | "sell", 
        baseAsset: string, 
        quoteAsset: string
    ) {
        console.log(`[Engine] Updating balances for ${fills.length} fills (${side})`);
        const userBalance = this.balances.get(userId);
        
        if (!userBalance) {
            console.error(`[Engine] User ${userId} balance not found`);
            return;
        }

        fills.forEach((fill) => {  
            const tradeValue = fill.qty * Number(fill.price);
            const otherUserId = fill.otherUserId;
            const otherUserBalance = this.balances.get(otherUserId);
            
            if (!otherUserBalance) {
                console.error(`[Engine] Other user ${otherUserId} balance not found`);
                return;
            }
            
            if (!userBalance[baseAsset] || !userBalance[quoteAsset] ||
                !otherUserBalance[baseAsset] || !otherUserBalance[quoteAsset]) {
                console.error(`[Engine] Missing asset balances for trade`);
                return;
            }

            if (side === "buy") {
                // Buyer (taker) receives base asset, releases locked quote asset
                userBalance[baseAsset].available += fill.qty;
                userBalance[quoteAsset].locked -= tradeValue;

                // Seller (maker) receives quote asset, releases locked base asset
                otherUserBalance[quoteAsset].available += tradeValue;
                otherUserBalance[baseAsset].locked -= fill.qty;
            } else {
                // Seller (taker) receives quote asset, releases locked base asset
                userBalance[quoteAsset].available += tradeValue;
                userBalance[baseAsset].locked -= fill.qty;
                
                // Buyer (maker) receives base asset, releases locked quote asset
                otherUserBalance[baseAsset].available += fill.qty;
                otherUserBalance[quoteAsset].locked -= tradeValue;
            }
        });
    }

    private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string ) {
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if(!orderbook){
            return
        }
         const numprice = Number(price);
         const numquantity = Number(quantity);

        if (isNaN(numprice) || numprice <= 0) {
            throw new Error("Invalid price");
        }
        
        if (isNaN(numquantity) || numquantity <= 0) {
            throw new Error("Invalid quantity");
        }

        const orderId = () => Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);

        const order: Order = {
            price: numprice,
            quantity: numquantity,
            orderId: orderId(),
            filled: 0,
            side,
            userId
        };
        const orderListed = orderbook.addOrder(order);
        const {executedQty , fills} = orderListed;

        const baseAsset = market.split("_")[0];  
        const quoteAsset = market.split("_")[1];

        if(baseAsset && quoteAsset) {
            this.updateBalancesAfterTrade(userId, fills, side, baseAsset, quoteAsset);
        }
        
        return { executedQty, fills, orderId: order.orderId };
    }
    private defaultBalances(userId:string) {
        if(!userId) {
            return
        }
        if (this.balances.has(userId)) {
            const userbalances = this.balances.get(userId);
            if(!userbalances) {
                const defaultBalance = {
                    [BASE_CURRENCY]: {
                        available : 10000,
                        locked: 0
                    }
                }
                this.balances.set(userId , defaultBalance)
            }

        }
    }

    private checkAndLockFunds(
        userId: string, 
        side: "buy" | "sell",
        quoteAsset: string, 
        baseAsset: string, 
        price: number, 
        quantity: number
    ) {
        const userBalance = this.balances.get(userId);

        if(!userBalance) {
             throw new Error(`User ${userId} has no balance initialized`);
        }

        if(side === "buy") {
            if (!userBalance[quoteAsset]) {
                throw new Error(`User ${userId} has no ${quoteAsset} balance. Cannot buy.`);
            }  
            const required = price*quantity;
            if (userBalance[quoteAsset].available < required) {
                throw new Error(
                    `Insufficient ${quoteAsset}. Required: ${required}, Available: ${userBalance[quoteAsset].available}`
                );
            }
            userBalance[quoteAsset].available -= required;
            userBalance[quoteAsset].locked += required;
            return;
        }
    }
    async process({message , clientId}: {message:ResponseFromHTTP , clientId:string}) {
        switch(message.type) {
            case CREATE_ORDER:
                let lockedAmount = 0;
                let lockedAsset = "";
                try{
                    this.defaultBalances(message.data.userId);
                    const baseAsset = message.data.market.split("_")[0];
                    const quoteAsset = message.data.market.split("_")[1];
                    const numprice = Number(message.data.price);
                    const numquantity = Number(message.data.quantity);

                    if (!baseAsset || !quoteAsset) {
                        throw new Error("Invalid market format");
                    }

                    if(message.data.side === "buy"){
                        lockedAmount = numprice*numquantity;
                        lockedAsset = quoteAsset;
                    } else {
                        lockedAmount = numquantity;
                        lockedAsset = baseAsset;
                    }

                    this.checkAndLockFunds(message.data.userId , message.data.side ,quoteAsset , baseAsset , numprice , numquantity)
                    const createorder = this.createOrder(
                        message.data.market,
                        message.data.price,
                        message.data.quantity,
                        message.data.side,
                        message.data.userId
                    )
                    if (!createorder) {
                        throw new Error("Order creation failed — market not found");
                    }
                    const { executedQty, fills, orderId } = createorder;
                } catch(e) {

                }
        }
    }
}