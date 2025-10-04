export interface IncomingMessage {
    method: "SUBSCRIBE" | "UNSUBSCRIBE";
    params: string[];
}

export type TickerUpdateMessage = {
  type: "ticker",
  data: {
    c?: string,
    h?: string,
    l?: string,
    v?: string,
    V?: string,
    s?: string,
    id: number,
    e: "ticker"
  }
};

export type DepthUpdateMessage = {
  type: "depth",
  data: {
    b?: [string, string][],
    a?: [string, string][],
    id: number,
    e: "depth"
  }
};

export type KlineUpdateMessage = {
  type: "kline",
  data: {
    t: number,
    T: number,
    s: string,
    i: string,
    o: string,
    c: string,
    h: string,
    l: string,
    v: string,
    id: number,
    e: "kline"
  }
};

export type OutgoingMessage = TickerUpdateMessage | DepthUpdateMessage | KlineUpdateMessage;
