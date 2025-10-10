import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_TICKER } from "../../types/orders";
import { RedisManager } from "../RedisManager";
import { DepthData, ResponseFromHTTP, TickerData, TradeData } from "../types/responses";
import { BASE_CURRENCY, Fill, Order, UserBalance, userId } from "../types/UserTypes";
import { OrderBook } from "./OrderBook";
export class Engine {
    private orderBooks:OrderBook[] = [];
    private balances: Map<userId , UserBalance> = new Map();
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

        const affectedPrices = new Set(fills.map(f => f.price));
        affectedPrices.forEach(price => {
            this.UpdatedDepth(price, market);
        });

        if (executedQty < order.quantity) {
            this.UpdatedDepth(order.price.toString(), market);
        }
        if (fills.length > 0) {
            this.publishTrades(fills, market,side);
        }
         
        return { executedQty, fills, orderId: order.orderId };
    }
    private latestTickers: Record<string, any> = {};
    private publishTrades(fills: Fill[], market: string, side: "buy" | "sell") {
        fills.forEach(fill => {
            const tradeData: TradeData = {
                event: "trade",
                tradeId: fill.tradeId,
                price: fill.price,
                quantity: fill.qty.toString(),
                symbol: market,
                side: side,
                timestamp: Date.now()
            };

            RedisManager.getInstance().Publish(`trade@${market}`, {
                stream: `trade@${market}`,
                data: tradeData
            });
        });
        
        const priceGroups = new Map<string, number>();
        fills.forEach(fill => {
            const currentQty = priceGroups.get(fill.price) || 0;
            priceGroups.set(fill.price, currentQty + fill.qty);
        });
        
        priceGroups.forEach((totalQty, price) => {
            const tickerData: TickerData = {
                event: "ticker",
                symbol: market,
                price: price,
                quantity: totalQty.toString(),
                side: side,
                timestamp: Date.now()
            };
            
            RedisManager.getInstance().Publish(`ticker@${market}`, {
                stream: `ticker@${market}`,
                data: tickerData
            });
        });
        
        if (fills.length > 0) {
            const lastFill = fills[fills.length - 1];
            if(!lastFill){
                return;
            }
            const lastPriceQty = priceGroups.get(lastFill.price) || 0;
            
            this.latestTickers[market] = {
                event: "ticker",
                symbol: market,
                price: lastFill.price,
                quantity: lastPriceQty.toString(),
                side: side,
                timestamp: Date.now()
            };
        }
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

        const depthData: DepthData = {
            event: "depth",
            symbol: market,
            asks: updatedAsks.length ? updatedAsks : [[price, "0"]],
            bids: updatedBids.length ? updatedBids : [[price, "0"]],
            timestamp: Date.now(),
        };
        RedisManager.getInstance().Publish(`depth@${market}`, {
            stream: `depth@${market}`,
            data: depthData
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
                    } else {
                        if(!userBalance[baseAsset]){
                            throw new Error(`User balance for ${baseAsset} not found`);
                        }

                        const price = cancelOrderbook.cancelAsk(order);
                        const leftQuantity = order.quantity - order.filled;

                        userBalance[baseAsset].available += leftQuantity;
                        userBalance[baseAsset].locked -= leftQuantity;

                        if (price) {
                            this.UpdatedDepth(price.toString(), cancelMarket);
                        }
                    }
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId,
                            executedQty: 0,
                            remainingQty: 0
                        }
                    });
                }  catch (e) {
                    console.error("[Engine] Error during CANCEL_ORDER:", e);
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "ORDER_CANCELLED",
                        payload: {
                            orderId: message.data.orderId,
                            executedQty: 0,
                            remainingQty: 0,
                        }
                    });
                }
                break;
            case GET_DEPTH:
                try{
                    const market = message.data.market;
                    const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
                    if (!orderbook) {
                        throw new Error("No orderbook found");
                    }
                    const depth = orderbook.getDepth()
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "DEPTH",
                        payload : depth
                    });
                } catch(e) {
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "DEPTH",
                        payload: {
                            aggregatedAsks : [],
                            aggregatedBids : []
                        }
                    });
                }
                break;
            case GET_TICKER:
                try {
                    const market = message.data.market;
                    const lastTicker = this.latestTickers?.[market];
                    if (!lastTicker) {
                        throw new Error(`No ticker found for ${market}`);
                    }
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "TICKER",
                        payload: lastTicker
                    });
                } catch (e) {
                    const fallbackTicker: TickerData = {
                        event: "ticker",
                        symbol: message.data.market,
                        price: "0",
                        quantity: "0",
                        side: "buy",
                        timestamp: Date.now()
                    };
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "TICKER",
                        payload: fallbackTicker
                    });
                }
                break;

            default:
                console.warn(`[Engine] Unknown message type: ${(message as any).type}`);
        }
    }
}