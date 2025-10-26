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

    console.log('🔧 [Orderbook] Subscribing to market:', market);
    manager.subscribe(market);

    // Register depth callback
    manager.registerCallback('depth', (depth: DepthUpdate) => {
      console.log('📦 [Orderbook] Depth callback triggered:', depth);
      
      if (depth.symbol !== market) {
        console.log('⚠️ [Orderbook] Symbol mismatch:', depth.symbol, 'vs', market);
        return;
      }
      
      console.log('✅ [Orderbook] Processing depth for', market);
      console.log('   Bids:', depth.bids);
      console.log('   Asks:', depth.asks);
      
      const validBids = depth.bids.filter(([price, size]) => parseFloat(size) > 0);
      const validAsks = depth.asks.filter(([price, size]) => parseFloat(size) > 0);
      
      console.log('✅ [Orderbook] Valid orders - Bids:', validBids.length, 'Asks:', validAsks.length);
      
      // Calculate cumulative totals for bids
      let bidRunningTotal = 0;
      const transformedBids: Order[] = validBids.map(([price, size]) => {
        bidRunningTotal += parseFloat(size);
        return {
          price,
          size,
          total: bidRunningTotal.toFixed(8)
        };
      });

      // Calculate cumulative totals for asks
      let askRunningTotal = 0;
      const transformedAsks: Order[] = validAsks.map(([price, size]) => {
        askRunningTotal += parseFloat(size);
        return {
          price,
          size,
          total: askRunningTotal.toFixed(8)
        };
      });

      console.log('📊 [Orderbook] Transformed - Bids:', transformedBids, 'Asks:', transformedAsks);

      setBids(transformedBids);
      setAsks(transformedAsks);
      
      // Calculate buy/sell pressure
      const totalBidVolume = bidRunningTotal;
      const totalAskVolume = askRunningTotal;
      const totalVolume = totalBidVolume + totalAskVolume;
      
      if (totalVolume > 0) {
        const newBuyPercentage = (totalBidVolume / totalVolume) * 100;
        console.log('📊 [Orderbook] Buy percentage:', newBuyPercentage.toFixed(2) + '%');
        setBuyPercentage(newBuyPercentage);
      }
    }, depthCallbackId);

    // Register ticker callback
    manager.registerCallback('ticker', (ticker) => {
      console.log('🎫 [Orderbook] Ticker callback triggered:', ticker);
      
      if (ticker.symbol !== market) {
        console.log('⚠️ [Orderbook] Ticker symbol mismatch:', ticker.symbol, 'vs', market);
        return;
      }
      
      console.log('✅ [Orderbook] Setting price:', ticker.lastPrice, 'change:', ticker.priceChange);
      setCurrentPrice(parseFloat(ticker.lastPrice));
      setPriceChange(parseFloat(ticker.priceChange));
    }, tickerCallbackId);

    console.log('✅ [Orderbook] Callbacks registered');

    return () => {
      console.log('🧹 [Orderbook] Cleaning up for', market);
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

  console.log('🎨 [Orderbook] Rendering - Bids:', bids.length, 'Asks:', asks.length);

  if (asks.length === 0 && bids.length === 0) {
    return (
      <div className="flex flex-col h-full text-gray-100 text-sm pt-2">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <OrderbookHeader baseAsset={baseAsset} quoteAsset={quoteAsset} />
        <div className="text-gray-400 text-center py-8">
          Loading order book for {market}...
        </div>
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