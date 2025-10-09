export type SIDE = "buy" | "sell";
export type CREATE_ORDER = "CREATE_ORDER"

export interface ResponseFromHTTP {
    type: CREATE_ORDER;
    data: {
        market: string;
        price: string;
        quantity: string;
        side: SIDE;
        userId: string;
    };
}
