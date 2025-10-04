export interface IncomingMessage {
    method: "SUBSCRIBE" | "UNSUBSCRIBE";
    params: string[];
}