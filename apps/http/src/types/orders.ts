export type SIDE = "buy" | "sell";

export const CREATE_ORDER = "CREATE_ORDER";


// export interface CreateOrderMessage {
//     type: typeof CREATE_ORDER;
//     data: {
//         market: string;
//         price: string;
//         quantity: string;
//         side: SIDE;
//         userId: string;
//     };
// }

// export interface CancelOrderMessage {
//     type: typeof CANCEL_ORDER;
//     data: {
//         orderId: string;
//         userId: string;
//     };
// }

// Union type for all incoming API messages
// export type ResponseFromHTTP = CreateOrderMessage | CancelOrderMessage;

// Outgoing messages remain unchanged
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
