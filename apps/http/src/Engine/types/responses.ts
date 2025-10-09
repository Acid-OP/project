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

export type ResponseToHTTP = {
  type: "ORDER_PLACED",
  payload: {
    orderId: string,
    executedQty: number,
    fills: {
      price: string,
      qty: number,
      tradeId: number
    }[]
  }
} | {
  type: "ORDER_CANCELLED",
  payload: {
    orderId: string,
    executedQty: number,
    remainingQty: number
  }
}
