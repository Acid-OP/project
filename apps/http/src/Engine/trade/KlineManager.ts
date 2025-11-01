interface Kline {
    openTime: number;
    closeTime: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    trades: number;
    interval: string;
    market: string;
    isClosed: boolean;
}

export class KlineManager {
    private currentKlines: Map<string, Kline> = new Map();

    private getKey(market: string, interval: string): string {
        return `${market}@${interval}`;
    }

    private getWindowStart(timestamp: number, interval: string): number {
        const ms = this.intervalToMs(interval);
        return Math.floor(timestamp / ms) * ms;
    }

    private intervalToMs(interval: string): number {
        const value = parseInt(interval.slice(0, -1));
        const unit = interval.slice(-1);
        
        const multipliers: Record<string, number> = {
            'm': 60 * 1000,
            'h': 60 * 60 * 1000,
            'd': 24 * 60 * 60 * 1000,
        };
        
        return value * (multipliers[unit] || 60000); 
    }

    private isNewWindow(currentKline: Kline | undefined, timestamp: number, interval: string): boolean {
        if (!currentKline) return true;
        const windowStart = this.getWindowStart(timestamp, interval);
        return windowStart !== currentKline.openTime;
    }

    public updateKline(
        market: string, 
        interval: string, 
        price: number, 
        quantity: number, 
        timestamp: number
    ): { kline: Kline, newCandleInitiated: boolean } {
        const key = this.getKey(market, interval);
        let currentKline = this.currentKlines.get(key);
        let newCandleInitiated = false;
        
        if (this.isNewWindow(currentKline, timestamp, interval)) {
            newCandleInitiated = true;
            
            if (currentKline) {
                currentKline.isClosed = true;
                console.log(`[KlineManager] Candle closed for ${market}@${interval} - Close: ${currentKline.close}`);
            }

            const windowStart = this.getWindowStart(timestamp, interval);
            currentKline = {
                openTime: windowStart,
                closeTime: windowStart + this.intervalToMs(interval),
                open: price,
                high: price,
                low: price,
                close: price,
                volume: quantity,
                trades: 1,
                interval: interval,
                market: market,
                isClosed: false
            };
            
            this.currentKlines.set(key, currentKline);
            console.log(`[KlineManager] New candle started for ${market}@${interval} - Open: ${price}`);
        } else {
            if (currentKline) {
                currentKline.high = Math.max(currentKline.high, price);
                currentKline.low = Math.min(currentKline.low, price);
                currentKline.close = price;
                currentKline.volume += quantity;
                currentKline.trades += 1;
                console.log(`[KlineManager] Candle updated for ${market}@${interval} - Close: ${price}`);
            }
        }
        
        return { kline: currentKline!, newCandleInitiated };
    }

    public getCurrentKline(market: string, interval: string): Kline | undefined {
        const key = this.getKey(market, interval);
        return this.currentKlines.get(key);
    }

    public getAllCurrentKlines(): Kline[] {
        return Array.from(this.currentKlines.values());
    }
}