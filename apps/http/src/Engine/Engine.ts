import { OrderBook } from "./OrderBook";

export const BASE_CURRENCY = "USD";

export class Engine {
    private orderBooks:OrderBook[] = [];
    constructor() {
        this.orderBooks = [
            new OrderBook("CR7_USD", [] , [] , 0 , 50000),
            new OrderBook("ELON_USD", [] , [] , 0 , 50000)
        ];
    }
}