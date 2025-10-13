export interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quoteVolume: string;
  start: string;
  trades: string;
  volume: string;
}

// Generate more realistic dummy data (100 candles)
export const DUMMY_KLINE_DATA: KLine[] = generateDummyKlineData(100);

export function generateDummyKlineData(count: number = 100): KLine[] {
  const data: KLine[] = [];
  let currentPrice = 185;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const volatility = 0.02;
    const trend = (Math.random() - 0.48) * 2;
    
    const open = currentPrice;
    const change = currentPrice * volatility * trend;
    const close = open + change;
    
    const high = Math.max(open, close) + Math.abs(change) * Math.random();
    const low = Math.min(open, close) - Math.abs(change) * Math.random();
    
    const volume = 5000 + Math.random() * 5000;
    const quoteVolume = volume * ((high + low) / 2);
    
    data.push({
      open: open.toFixed(2),
      close: close.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      start: String(now - (count - i) * 3600000),
      end: String(now - (count - i - 1) * 3600000),
      volume: volume.toFixed(0),
      quoteVolume: quoteVolume.toFixed(0),
      trades: String(Math.floor(500 + Math.random() * 500))
    });
    
    currentPrice = close;
  }
  
  return data;
}

export function getPriceDataFromKlines(klines: KLine[]): {
  currentPrice: number;
  priceChange: number;
  priceChangePercent: number;
} {
  if (!klines || klines.length === 0) {
    return { currentPrice: 0, priceChange: 0, priceChangePercent: 0 };
  }

  const latestCandle = klines[klines.length - 1]!;
  const previousCandle = klines.length > 1 ? klines[klines.length - 2]! : undefined;

  const currentPrice = parseFloat(latestCandle.close);
  const previousPrice = previousCandle
    ? parseFloat(previousCandle.close)
    : parseFloat(latestCandle.open);

  const priceChange = currentPrice - previousPrice;
  const priceChangePercent = (priceChange / previousPrice) * 100;

  return { currentPrice, priceChange, priceChangePercent };
}