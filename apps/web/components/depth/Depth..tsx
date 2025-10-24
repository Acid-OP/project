import React, { useState, useEffect } from 'react';
import { Tabs } from './Tabs';
import { ViewToggle } from './ViewToggle';
import { OrderbookHeader } from './OrderbookHeader';
import BuySellPressure from './BuySellPressure';
import BidOrders from './BidOrders';
import CurrentPrice from './CurrentPrice';
import AskOrders from './AskOrders';
import { SignalingManager, DepthUpdate } from '../../utils/Manager';

interface Order {
  price: string;
  size: string;
  total: string;
}

interface OrderbookProps {
  market: string;
  baseAsset: string;
  quoteAsset: string;
}

const Orderbook: React.FC<OrderbookProps> = ({ market, baseAsset, quoteAsset }) => {
  const [activeTab, setActiveTab] = useState<"book" | "trades">("book");
  const [viewMode, setViewMode] = useState<'both' | 'buy' | 'sell'>('both');
  const [bids, setBids] = useState<Order[]>([]);
  const [asks, setAsks] = useState<Order[]>([]);
  const [buyPercentage, setBuyPercentage] = useState(50);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);

  useEffect(() => {
    const manager = SignalingManager.getInstance();
    const depthCallbackId = `orderbook-depth-${market}`;
    const tickerCallbackId = `orderbook-ticker-${market}`;

    manager.subscribe(market);

    manager.registerCallback('depth', (depth: DepthUpdate) => {
      if (depth.symbol === market) {
        // Just transform array format to object format - NO calculations
        const transformedBids: Order[] = depth.bids.map(([price, size, total]) => ({
          price,
          size,
          total
        }));

        const transformedAsks: Order[] = depth.asks.map(([price, size, total]) => ({
          price,
          size,
          total
        }));

        setBids(transformedBids);
        setAsks(transformedAsks);
        
        // Backend will send buyPercentage
        if (depth.buyPercentage !== undefined) {
          setBuyPercentage(depth.buyPercentage);
        }
      }
    }, depthCallbackId);

    manager.registerCallback('ticker', (ticker) => {
      if (ticker.symbol === market) {
        setCurrentPrice(parseFloat(ticker.lastPrice));
        setPriceChange(parseFloat(ticker.priceChange));
      }
    }, tickerCallbackId);

    return () => {
      manager.deRegisterCallback('depth', depthCallbackId);
      manager.deRegisterCallback('ticker', tickerCallbackId);
      manager.unsubscribe(market);
    };
  }, [market]);

  const calculateBarWidth = (total: string, maxTotal: number): number => {
    if (maxTotal === 0) return 0;
    return (parseFloat(total) / maxTotal) * 100;
  };

  const calculateSizeBarWidth = (size: string, maxTotal: number): number => {
    if (maxTotal === 0) return 0;
    return (parseFloat(size) / maxTotal) * 100;
  };

  const maxTotal: number = Math.max(
    ...asks.map(a => parseFloat(a.total)),
    ...bids.map(b => parseFloat(b.total)),
    1
  );

  if (asks.length === 0 && bids.length === 0) {
    return (
      <div className="flex flex-col h-full text-gray-100 text-sm pt-2">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <OrderbookHeader baseAsset={baseAsset} quoteAsset={quoteAsset} />
        <div className="text-gray-400 text-center py-8">Loading order book...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full text-gray-100 text-sm pt-2">
      <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
      <OrderbookHeader baseAsset={baseAsset} quoteAsset={quoteAsset} />
      
      <AskOrders
        asks={asks}
        maxTotal={maxTotal}
        calculateBarWidth={calculateBarWidth}
        calculateSizeBarWidth={calculateSizeBarWidth}
      />
      
      <CurrentPrice
        currentPrice={currentPrice}
        priceChange={priceChange}
      />
      
      <BidOrders
        bids={bids}
        maxTotal={maxTotal}
        calculateBarWidth={calculateBarWidth}
        calculateSizeBarWidth={calculateSizeBarWidth}
      />
      
      <BuySellPressure buyPercentage={buyPercentage} />
    </div>
  );
};

export default Orderbook;