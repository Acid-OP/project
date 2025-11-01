import { CANCEL_ORDER, CREATE_ORDER, GET_DEPTH, GET_KLINE, GET_TICKER } from "../../types/orders";
import { RedisManager } from "../RedisManager";
import { DepthData, MarketStats, ResponseFromHTTP, TickerData, TradeData, TradeHistoryEntry } from "../types/responses";
import { BASE_CURRENCY, Fill, Order, UserBalance, userId } from "../types/trading";
import { KlineManager } from "./KlineManager";
import { OrderBook } from "./OrderBook";

export class Engine {
    private orderBooks:OrderBook[] = [];
    private balances: Map<userId , UserBalance> = new Map();
    private tradeHistory: Map<string, TradeHistoryEntry[]> = new Map();
    private marketStats: Map<string, MarketStats> = new Map();
    private klineManager: KlineManager;
    private latestTickers: Record<string, any> = {};
    constructor() {
        console.log('[Engine] Initializing Engine with orderbooks');
        this.orderBooks = [
            new OrderBook("CR7_USD", [] , [] , 0 , 50000),
            new OrderBook("ELON_USD", [] , [] , 0 , 50000)
        ];
        this.initializeMarketStats();
        this.klineManager = new KlineManager();
        console.log('[Engine] Engine initialized with markets:', this.orderBooks.map(ob => ob.getMarketPair()));
    }
    
    private initializeMarketStats() {
        console.log('[Engine] Initializing market stats');
        const markets = this.orderBooks.map(ob => ob.getMarketPair());
        
        markets.forEach(market => {
            this.tradeHistory.set(market, []);
            this.marketStats.set(market, {
                open24h: 0,
                high24h: 0,
                low24h: 0,
                volume24h: 0,
                quoteVolume24h: 0,
                lastPrice: 0
            });
        });
    }

    private cleanOldTrades(market: string): void {
        const history = this.tradeHistory.get(market);
        if (!history) return;
        
        const twentyFourHoursAgo = Date.now() - (24 * 60 * 60 * 1000);
        const filteredHistory = history.filter(trade => trade.timestamp > twentyFourHoursAgo);
        
        this.tradeHistory.set(market, filteredHistory);
        console.log(`[Engine] Cleaned old trades for ${market}. Remaining: ${filteredHistory.length}`);
    }

    private calculate24hStats(market: string): MarketStats {
        const history = this.tradeHistory.get(market) || [];
        const currentStats = this.marketStats.get(market);
        
        if (history.length === 0) {
            return currentStats || {
                open24h: 0,
                high24h: 0,
                low24h: 0,
                volume24h: 0,
                quoteVolume24h: 0,
                lastPrice: 0
            };
        }
        
        const open24h = currentStats?.open24h && currentStats.open24h !== 0 
            ? currentStats.open24h 
            : 0; 
        
        const high24h = Math.max(...history.map(t => t.price));
        const low24h = Math.min(...history.map(t => t.price));
        const volume24h = history.reduce((sum, t) => sum + t.quantity, 0);
        const quoteVolume24h = history.reduce((sum, t) => sum + (t.price * t.quantity), 0);
        const lastPrice = history[history.length - 1]?.price || 0;
        
        const updatedStats = {
            open24h,
            high24h,
            low24h,
            volume24h,
            quoteVolume24h,
            lastPrice
        };
        
        this.marketStats.set(market, updatedStats);
        
        return updatedStats;
    }

    private updateMarketStats(market: string, fills: Fill[]): void {
        const history = this.tradeHistory.get(market) || [];
        
        fills.forEach(fill => {
            const price = Number(fill.price);
            const quantity = fill.qty;
            
            history.push({
                price,
                quantity,
                timestamp: Date.now()
            });
        });
        
        this.tradeHistory.set(market, history);
        if (history.length % 100 === 0) {
            this.cleanOldTrades(market);
        }
        
        const stats = this.calculate24hStats(market);
        this.marketStats.set(market, stats);
        
        console.log(`[Engine] Updated stats for ${market} - Last: ${stats.lastPrice}, High: ${stats.high24h}, Low: ${stats.low24h}`);
    }

    private getEnhancedTicker(market: string, side: "buy" | "sell"): any {
        const stats = this.marketStats.get(market);
        
        if (!stats || stats.lastPrice === 0) {
            return {
                event: "ticker",
                symbol: market,
                price: "0",
                quantity: "0",
                side: side,
                priceChange: "0",
                priceChangePercent: "0.00",
                high24h: "0",
                low24h: "0",
                volume24h: "0",
                quoteVolume24h: "0",
                timestamp: Date.now()
            };
        }
        
        const priceChange = stats.lastPrice - stats.open24h;
        const priceChangePercent = (stats.open24h && stats.open24h !== 0)
            ? ((priceChange / stats.open24h) * 100).toFixed(2)
            : "0.00";
        
        return {
            event: "ticker",
            symbol: market,
            price: stats.lastPrice.toString(),
            quantity: "0",  
            side: side,
            priceChange: priceChange.toString(),
            priceChangePercent: priceChangePercent,
            high24h: stats.high24h.toString(),
            low24h: stats.low24h.toString(),
            volume24h: stats.volume24h.toString(),
            quoteVolume24h: stats.quoteVolume24h.toString(),
            timestamp: Date.now()
        };
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
        
        fills.forEach(fill => {
            const price = Number(fill.price);
            const quantity = fill.qty;
            const timestamp = Date.now();
            
            const intervals = ['1m', '5m', '15m', '1h', '4h', '1d'];
            
            intervals.forEach(interval => {
                try {
                    const { kline, newCandleInitiated } = this.klineManager.updateKline(
                        market,
                        interval,
                        price,
                        quantity,
                        timestamp
                    );
                    
                    const klineData = {
                        event: "kline",
                        symbol: market,
                        interval: interval,
                        kline: {
                            timestamp: kline.openTime,
                            open: kline.open,
                            high: kline.high,
                            low: kline.low,
                            close: kline.close,
                            volume: kline.volume,
                            trades: kline.trades,
                            isClosed: kline.isClosed,
                            newCandleInitiated: newCandleInitiated
                        }
                    };
                    
                    RedisManager.getInstance().Publish(`kline@${market}@${interval}`, {
                        stream: `kline@${market}@${interval}`,
                        data: klineData
                    });
                    
                    if (newCandleInitiated) {
                        console.log(`[Engine] 🕯️ NEW CANDLE started for ${market}@${interval}`);
                    }
                } catch (error) {
                    console.error(`[Engine] Error updating kline for ${market}@${interval}:`, error);
                }
            });
        });

        this.updateMarketStats(market, fills);
        
        const stats = this.marketStats.get(market);
        if (!stats) return;
        
        const priceGroups = new Map<string, number>();
        fills.forEach(fill => {
            const currentQty = priceGroups.get(fill.price) || 0;
            priceGroups.set(fill.price, currentQty + fill.qty);
        });
        
        priceGroups.forEach((totalQty, price) => {
            const priceChange = Number(price) - stats.open24h;
            const priceChangePercent = (stats.open24h && stats.open24h !== 0)
                ? ((priceChange / stats.open24h) * 100).toFixed(2)
                : "0.00";
            
            const enhancedTickerData = {
                event: "ticker",
                symbol: market,
                price: price,
                quantity: totalQty.toString(),
                side: side,
                priceChange: priceChange.toString(),
                priceChangePercent: priceChangePercent,
                high24h: stats.high24h.toString(),
                low24h: stats.low24h.toString(),
                volume24h: stats.volume24h.toString(),
                quoteVolume24h: stats.quoteVolume24h.toString(),
                timestamp: Date.now()
            };
            
            RedisManager.getInstance().Publish(`ticker@${market}`, {
                stream: `ticker@${market}`,
                data: enhancedTickerData
            });
        });
        
        if (fills.length > 0) {
            const lastFill = fills[fills.length - 1];
            if (!lastFill) return;
            
            const priceChange = Number(lastFill.price) - stats.open24h;
            const priceChangePercent = (stats.open24h && stats.open24h !== 0)
                ? ((priceChange / stats.open24h) * 100).toFixed(2)
                : "0.00";
            
            this.latestTickers[market] = {
                event: "ticker",
                symbol: market,
                price: lastFill.price,
                quantity: lastFill.qty.toString(),  
                side: side,
                priceChange: priceChange.toString(),
                priceChangePercent: priceChangePercent,
                high24h: stats.high24h.toString(),
                low24h: stats.low24h.toString(),
                volume24h: stats.volume24h.toString(),
                quoteVolume24h: stats.quoteVolume24h.toString(),
                timestamp: Date.now()
            };     
            console.log(`[Engine] Latest ticker updated for ${market}: price=${lastFill.price}, change=${priceChange}`);
        }
    }

    private defaultBalances(userId:string) {
        if(!userId) {
            return
        }
        if (!this.balances.has(userId)) {
            console.log(`[Engine] Initializing default balance for user ${userId}`);
            const defaultBalance = {
                [BASE_CURRENCY]: { available: 100000, locked: 0 }, 
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

    private UpdatedDepth(price: string, market: string) {
        console.log(`[Engine] Updating depth for ${market} at price ${price}`);
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if (!orderbook) {
            console.error(`[Engine] Orderbook not found for ${market}`);
            return;
        }
        
        const depth = orderbook.getDepth();
        if (!depth) {
            console.error(`[Engine] Depth not available for ${market}`);
            return;
        }

        const depthData: DepthData = {
            event: "depth",
            symbol: market,
            bids: depth.aggregatedBids,  
            asks: depth.aggregatedAsks,  
            timestamp: Date.now(),
        };
        
        RedisManager.getInstance().Publish(`depth@${market}`, {
            stream: `depth@${market}`,
            data: depthData
        });
        
        console.log(`[Engine] Full depth published for ${market} - bids: ${depth.aggregatedBids.length}, asks: ${depth.aggregatedAsks.length}`);
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
                    const depth = orderbook.getDepth();
                    
                    const depthResponse: DepthData = {
                        event: "depth",
                        symbol: market,
                        bids: depth.aggregatedBids,
                        asks: depth.aggregatedAsks,
                        timestamp: Date.now()
                    };
                    
                    console.log(`[Engine] DEPTH response - symbol: ${market}, bids: ${depth?.aggregatedBids?.length}, asks: ${depth?.aggregatedAsks?.length}`);
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "DEPTH",
                        payload: depthResponse
                    });
                } catch(e) {
                    console.error("[Engine] Error during GET_DEPTH:", e);
                    RedisManager.getInstance().ResponseToHTTP(clientId, {
                        type: "DEPTH",
                        payload: {
                            event: "depth" as const,  
                            symbol: message.data.market,
                            bids: [],
                            asks: [],
                            timestamp: Date.now()
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
                            const enhancedTicker = this.getEnhancedTicker(market, "buy");
                            console.log(`[Engine] Generated new ticker for ${market}`);
                            RedisManager.getInstance().ResponseToHTTP(clientId, {
                                type: "TICKER",
                                payload: enhancedTicker
                            });
                        } else {
                            console.log(`[Engine] TICKER response - price: ${lastTicker.price}, priceChange: ${lastTicker.priceChange}`);
                            RedisManager.getInstance().ResponseToHTTP(clientId, {
                                type: "TICKER",
                                payload: lastTicker
                            });
                        }
                    } catch (e) {
                        console.error("[Engine] Error during GET_TICKER:", e);
                        const fallbackTicker = this.getEnhancedTicker(message.data.market, "buy");
                        RedisManager.getInstance().ResponseToHTTP(clientId, {
                            type: "TICKER",
                            payload: fallbackTicker
                        });
                    }
                break;
                case GET_KLINE:
                    console.log(`[Engine] GET_KLINE received for market:`, message.data.market);
                    try {
                        const market = message.data.market;
                        const interval = message.data.interval || "1m"; 
                        
                        const currentKline = this.klineManager.getCurrentKline(market, interval);
                        
                        if (!currentKline) {
                            console.log(`[Engine] No kline data for ${market}@${interval}`);
                            RedisManager.getInstance().ResponseToHTTP(clientId, {
                                type: "KLINE",
                                payload: {
                                    symbol: market,
                                    interval: interval,
                                    candles: []
                                }
                            });
                        } else {
                            const klineResponse = {
                                symbol: market,
                                interval: interval,
                                candles: [{
                                    timestamp: currentKline.openTime,
                                    closeTime: currentKline.closeTime,
                                    open: currentKline.open,
                                    high: currentKline.high,
                                    low: currentKline.low,
                                    close: currentKline.close,
                                    volume: currentKline.volume,
                                    trades: currentKline.trades,
                                    isClosed: currentKline.isClosed 
                                }]
                            };
                            
                            console.log(`[Engine] KLINE response - symbol: ${market}, interval: ${interval}, candles: 1`);
                            RedisManager.getInstance().ResponseToHTTP(clientId, {
                                type: "KLINE",
                                payload: klineResponse
                            });
                        }
                    } catch (e) {
                        console.error("[Engine] Error during GET_KLINE:", e);
                        RedisManager.getInstance().ResponseToHTTP(clientId, {
                            type: "KLINE",
                            payload: {
                                symbol: message.data.market,
                                interval: message.data.interval || "1m",
                                candles: []
                            }
                        });
                    }
                    break;

            default:
                console.warn(`[Engine] Unknown message type: ${(message as any).type}`);
        }
    }
}