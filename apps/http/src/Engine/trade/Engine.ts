import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_TICKER } from "../../types/orders";
import { RedisManager } from "../RedisManager";
import { DepthData, ResponseFromHTTP, TickerData, TradeData } from "../types/responses";
import { BASE_CURRENCY, Fill, Order, UserBalance, userId } from "../types/UserTypes";
import { OrderBook } from "./OrderBook";
export class Engine {
    private orderBooks:OrderBook[] = [];
    private balances: Map<userId , UserBalance> = new Map();
    constructor() {
        console.log('[Engine] Initializing Engine with orderbooks');
        this.orderBooks = [
            new OrderBook("CR7_USD", [] , [] , 0 , 50000),
            new OrderBook("ELON_USD", [] , [] , 0 , 50000)
        ];
        console.log('[Engine] Engine initialized with markets:', this.orderBooks.map(ob => ob.getMarketPair()));
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
        console.log(`[Engine] Balance update complete for user ${userId}`);
    }

    private createOrder(market: string,price: number,quantity: number,side: "buy" | "sell",userId: string ) {
        console.log(`[Engine] Creating order: ${side} ${quantity} @ ${price} on ${market} for user ${userId}`);
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if(!orderbook){
            console.error(`[Engine] Orderbook not found for market ${market}`);
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
        console.log(`[Engine] Order created with ID: ${order.orderId}`);
        const orderListed = orderbook.addOrder(order);
        const {executedQty , fills} = orderListed;
        console.log(`[Engine] Order executed - executedQty: ${executedQty}, fills: ${fills.length}`);

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
        console.log(`[Engine] Publishing ${fills.length} trades for ${market}`);
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
            console.log(`[Engine] Latest ticker updated for ${market}: ${lastFill.price}`);
        }
    }
    
    private defaultBalances(userId:string) {
        if(!userId) {
            return
        }
        if (!this.balances.has(userId)) {
            console.log(`[Engine] Initializing default balance for user ${userId}`);
        const defaultBalance = {
            [BASE_CURRENCY]: { available: 100000, locked: 0 }, // Increased to 100k
            "CR7": { available: 1000, locked: 0 },
            "ELON": { available: 1000, locked: 0 }
        };
            this.balances.set(userId, defaultBalance);
            console.log(`[Engine] Default balance set: ${BASE_CURRENCY}: 10000`);
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
        console.log(`[Engine] Checking and locking funds for ${side} order: ${quantity} @ ${price}`);
        const userBalance = this.balances.get(userId);

        if(!userBalance) {
             console.error(`[Engine] User ${userId} has no balance initialized`);
             throw new Error(`User ${userId} has no balance initialized`);
        }

        if(side === "buy") {
            if (!userBalance[quoteAsset]) {
                console.error(`[Engine] User ${userId} has no ${quoteAsset} balance`);
                throw new Error(`User ${userId} has no ${quoteAsset} balance. Cannot buy.`);
            }  
            const required = price*quantity;
            if (userBalance[quoteAsset].available < required) {
                console.error(`[Engine] Insufficient ${quoteAsset}. Required: ${required}, Available: ${userBalance[quoteAsset].available}`);
                throw new Error(
                    `Insufficient ${quoteAsset}. Required: ${required}, Available: ${userBalance[quoteAsset].available}`
                );
            }
            userBalance[quoteAsset].available -= required;
            userBalance[quoteAsset].locked += required;
            console.log(`[Engine] Locked ${required} ${quoteAsset} for buy order`);
            return;
        }
        if (side === "sell") {
            const available = userBalance[baseAsset]?.available || 0;
            if (available < quantity) {
                console.error(`[Engine] Insufficient ${baseAsset}. Required: ${quantity}, Available: ${available}`);
                throw new Error("Insufficient base asset");
            }
            if(userBalance[baseAsset]){
            userBalance[baseAsset].available -= quantity;
            userBalance[baseAsset].locked += quantity;
            console.log(`[Engine] Locked ${quantity} ${baseAsset} for sell order`);
        }}

    }
    private UpdatedDepth(price:string , market:string) {
        console.log(`[Engine] Updating depth for ${market} at price ${price}`);
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if(!orderbook){
            console.error(`[Engine] Orderbook not found for ${market}`);
            return
        }
        const depth = orderbook.getDepth();
        if(!depth) {
            console.error(`[Engine] Depth not available for ${market}`);
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
        console.log(`[Engine] Depth published for ${market}`);
    }
    async process({message , clientId}: {message:ResponseFromHTTP , clientId:string}) {
        console.log(`[Engine] Processing message type: ${message.type} from client: ${clientId}`);
        switch(message.type) {
            case CREATE_ORDER:
                console.log(`[Engine] CREATE_ORDER received:`, message.data);
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
                    console.log(`[Engine] ORDER_PLACED response - orderId: ${orderId}, executedQty: ${executedQty}, fills: ${fills.length}`);
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "ORDER_PLACED",
                        payload: { orderId, executedQty, fills }
                    });
                } catch(e) {
                    console.error("[Engine] Error during CREATE_ORDER:", e);
                    if (lockedAsset && message.data) {
                        const userBalance = this.balances.get(message.data.userId);
                        const assetBalance = userBalance?.[lockedAsset];
                        
                        if (assetBalance) {
                            assetBalance.available += lockedAmount;
                            assetBalance.locked -= lockedAmount;
                            console.log(`[Engine] Rolled back ${lockedAmount} ${lockedAsset}`);
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
                console.log(`[Engine] CANCEL_ORDER received:`, message.data);
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
                        console.log(`[Engine] Unlocked ${leftQuantity} ${quoteAsset} for cancelled buy order`);

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
                        console.log(`[Engine] Unlocked ${leftQuantity} ${baseAsset} for cancelled sell order`);

                        if (price) {
                            this.UpdatedDepth(price.toString(), cancelMarket);
                        }
                    }
                    console.log(`[Engine] ORDER_CANCELLED response - orderId: ${orderId}`);
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
                console.log(`[Engine] GET_DEPTH received for market:`, message.data.market);
                try{
                    const market = message.data.market;
                    const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
                    if (!orderbook) {
                        throw new Error("No orderbook found");
                    }
                    const depth = orderbook.getDepth()
                    console.log(`[Engine] DEPTH response - bids: ${depth?.aggregatedBids?.length}, asks: ${depth?.aggregatedAsks?.length}`);
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "DEPTH",
                        payload : depth
                    });
                } catch(e) {
                    console.error("[Engine] Error during GET_DEPTH:", e);
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
                console.log(`[Engine] GET_TICKER received for market:`, message.data.market);
                try {
                    const market = message.data.market;
                    const lastTicker = this.latestTickers?.[market];
                    if (!lastTicker) {
                        throw new Error(`No ticker found for ${market}`);
                    }
                    console.log(`[Engine] TICKER response - price: ${lastTicker.price}, quantity: ${lastTicker.quantity}`);
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "TICKER",
                        payload: lastTicker
                    });
                } catch (e) {
                    console.error("[Engine] Error during GET_TICKER:", e);
                    const fallbackTicker: TickerData = {
                        event: "ticker",
                        symbol: message.data.market,
                        price: "0",
                        quantity: "0",
                        side: "buy",
                        timestamp: Date.now()
                    };
                    console.log(`[Engine] Sending fallback ticker for ${message.data.market}`);
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