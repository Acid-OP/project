import { CREATE_ORDER } from "../../types/orders";
import { RedisManager } from "../RedisManager";
import { ResponseFromHTTP } from "../types/responses";
import { BASE_CURRENCY, Fill, Order, UserBalance, userIdd } from "../types/UserTypes";
import { OrderBook } from "./OrderBook";
export const CANCEL_ORDER = "CANCEL_ORDER";
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

    private createOrder(market: string,price: number,quantity: number,side: "buy" | "sell",userId: string ) {
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if(!orderbook){
            return
        }

        const orderId = () => Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);

        const order: Order = {
            price: price,
            quantity: quantity,
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
        if (!this.balances.has(userId)) {
            const defaultBalance = {
                [BASE_CURRENCY]: { available: 10000, locked: 0 }
            };
            this.balances.set(userId, defaultBalance);
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
        if (side === "sell") {
            const available = userBalance[baseAsset]?.available || 0;
            if (available < quantity) throw new Error("Insufficient base asset");
            if(userBalance[baseAsset]){
            userBalance[baseAsset].available -= quantity;
            userBalance[baseAsset].locked += quantity;
        }}

    }
    private UpdatedDepth(price:string , market:string) {
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if(!orderbook){
            return
        }
        const depth = orderbook.getDepth();
        if(!depth) {
            return;
        }
        const aggregatedBids = depth?.aggregatedBids ?? [];
        const aggregatedAsks = depth?.aggregatedAsks ?? [];

        const updatedBids = aggregatedBids.filter(x => x[0] === price);
        const updatedAsks = aggregatedAsks.filter(x => x[0] === price);

        RedisManager.getInstance().Publish(`depth@${market}`, {
            stream: `depth@${market}`,
            data: {
                a:updatedAsks.length ? updatedAsks : [[price, "0"]],
                b:updatedBids.length ? updatedBids : [[price, "0"]],
                e: "depth"
            }
        });
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

                    if (isNaN(numprice) || numprice <= 0) throw new Error("Invalid price");
                    if (isNaN(numquantity) || numquantity <= 0) throw new Error("Invalid quantity");
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
                        numprice,
                        numquantity,
                        message.data.side,
                        message.data.userId
                    )
                    if (!createorder) {
                        throw new Error("Order creation failed — market not found");
                    }
                    const { executedQty, fills, orderId } = createorder;
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "ORDER_PLACED",
                        payload: { orderId, executedQty, fills }
                    });
                } catch(e) {
                    if (lockedAsset && message.data) {
                        const userBalance = this.balances.get(message.data.userId);
                        const assetBalance = userBalance?.[lockedAsset];
                        
                        if (assetBalance) {
                            assetBalance.available += lockedAmount;
                            assetBalance.locked -= lockedAmount;
                        } else {
                            console.error(`[Engine] Could not rollback funds - balance not found`);
                        }
                  }
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: { 
                            orderId: "", 
                            executedQty: 0, 
                            remainingQty: 0,
                        }
                    });
                }
                break;
            case CANCEL_ORDER:
                try{
                    const orderId = message.data.orderId;
                    const cancelMarket = message.data.market;
                    const baseAsset = cancelMarket.split("_")[0];
                    const quoteAsset = cancelMarket.split("_")[1];
                    const cancelOrderbook = this.orderBooks.find(x => x.getMarketPair() === cancelMarket);

                    if (!cancelOrderbook) {
                        throw new Error("No orderbook found");
                    }
                    
                    if (!baseAsset || !quoteAsset) {
                        throw new Error("Invalid market format");
                    }
                    const order = cancelOrderbook.asks.find(x => x.orderId === orderId) ||
                                  cancelOrderbook.bids.find(x => x.orderId === orderId);                 
                    if (!order) {
                        throw new Error("No order found");
                    }

                    const userBalance = this.balances.get(order.userId);
                    if (!userBalance) {
                        throw new Error("User balance not found");
                    }

                    if(order.side === "buy") {
                        if (!userBalance[quoteAsset]) {
                            throw new Error(`User balance for ${quoteAsset} not found`);
                        }
                        const price = cancelOrderbook.cancelBid(order);
                        const leftQuantity = (order.quantity - order.filled) * order.price;
                        
                        userBalance[quoteAsset].available += leftQuantity;
                        userBalance[quoteAsset].locked -= leftQuantity;

                       if (price) {
                            this.UpdatedDepth(price.toString(), cancelMarket);
                        }
                    }
                } catch(e){

                }
        }
    }
}