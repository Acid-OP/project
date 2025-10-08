import axios from "axios";
import { Depth, KLine, Ticker, Trade } from "./type";

// Use your Next.js API proxy instead of direct Backpack API calls
const BASE_URL = "http://localhost:3003/api/v1";

export async function getTicker(market: string): Promise<Ticker> {
    const response = await axios.get(`${BASE_URL}?endpoint=/ticker&symbol=${market}`);
    return response.data;
}

export async function getTickers(): Promise<Ticker[]> {
    // Get all tickers (24hr statistics for all market symbols)
    const response = await axios.get(`${BASE_URL}?endpoint=/tickers`);
    return response.data;
}

export async function getDepth(market: string): Promise<Depth> {
    // Get order book depth for a given market symbol
    const response = await axios.get(`${BASE_URL}?endpoint=/depth&symbol=${market}`);
    return response.data;
}

export async function getTrades(market: string): Promise<Trade[]> {
    // Get recent trades for a symbol (max 1000 trades available)
    const response = await axios.get(`${BASE_URL}?endpoint=/trades&symbol=${market}&limit=100`);
    return response.data;
}

export async function getKlines(market: string, interval: string, startTime: number, endTime: number): Promise<KLine[]> {

    const response = await axios.get(`${BASE_URL}?endpoint=/klines&symbol=${market}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`);
    
    const data: KLine[] = response.data;
    return data.sort((x, y) => (Number(x.end) < Number(y.end) ? -1 : 1));
}