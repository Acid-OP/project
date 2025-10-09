import { CREATE_ORDER } from "../types/orders";
import { OrderBook } from "./OrderBook";
import { ResponseFromHTTP } from "./types/responses";
import { userIdd , UserBalance, BASE_CURRENCY, Order } from "./types/UserTypes";

export class Engine {
    private orderBooks:OrderBook[] = [];
    private balances: Map<userIdd , UserBalance> = new Map();
    constructor() {
        this.orderBooks = [
            new OrderBook("CR7_USD", [] , [] , 0 , 50000),
            new OrderBook("ELON_USD", [] , [] , 0 , 50000)
        ];
    }

    private createOrder(market: string,price: string,quantity: string,side: "buy" | "sell",userId: string ) {
        const orderbook = this.orderBooks.find(x => x.getMarketPair() === market);
        if(!orderbook){
            return
        }
         const numprice = Number(price);
         const numquantity = Number(quantity);

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
    async process({message , clientId}: {message:ResponseFromHTTP , clientId:string}) {
        switch(message.type) {
            case CREATE_ORDER:
                try{
                    this.defaultBalances(message.data.userId);
                    const baseAsset = message.data.market.split("_")[0];
                    const quoteAsset = message.data.market.split("_")[1];
                    const numprice = Number(message.data.price);
                    const numquantity = Number(message.data.quantity);

                    const createOrder = this.createOrder(
                        message.data.market,
                        message.data.price,
                        message.data.quantity,
                        message.data.side,
                        message.data.userId
                    )
                } catch(e) {

                }
        }
    }
}