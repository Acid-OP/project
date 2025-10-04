export type response = DepthUpdate ;

export type DepthUpdate = {
    stream: string,
    data: {
        asks?:[string,string][],
        bids?:[string,string][],
        event:"depth"
    }
}