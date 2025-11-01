export type SIDE = "buy" | "sell";

export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const GET_DEPTH = "GET_DEPTH";
export const GET_TICKER = "GET_TICKER";
export const GET_KLINE = "GET_KLINE";
export type ResponseToHTTP =
  | {
      type: "ORDER_PLACED";
      payload: {
        orderId: string;
        executedQty: number;
        fills: {
          price: string;
          qty: number;
          tradeId: number;
        }[];
      };
    }
  | {
      type: "ORDER_CANCELLED";
      payload: {
        orderId: string;
        executedQty: number;
        remainingQty: number;
      };
    };
