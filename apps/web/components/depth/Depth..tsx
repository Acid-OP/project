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

    manager.registerCallback('depth', (depth: DepthUpdate) => {
      console.log('📦 [Orderbook] Depth callback triggered:', depth);
      
      if (depth.symbol !== market) {
        console.log('⚠️ [Orderbook] Symbol mismatch:', depth.symbol, 'vs', market);
        return;
      }
      
      const validBids = depth.bids.filter(([price, size]) => parseFloat(size) > 0);
      const validAsks = depth.asks.filter(([price, size]) => parseFloat(size) > 0);
      
      console.log('✅ [Orderbook] Valid orders - Bids:', validBids.length, 'Asks:', validAsks.length);
      
      let askRunningTotal = 0;
      const transformedAsks: Order[] = validAsks.map(([price, size]) => {
        askRunningTotal += parseFloat(size);
        return {
          price: parseFloat(price).toFixed(2),
          size: parseFloat(size).toFixed(2),
          total: askRunningTotal.toFixed(2)
        };
      });

      let bidRunningTotal = 0;
      const transformedBids: Order[] = validBids.map(([price, size]) => {
        bidRunningTotal += parseFloat(size);
        return {
          price: parseFloat(price).toFixed(2),
          size: parseFloat(size).toFixed(2),
          total: bidRunningTotal.toFixed(2)
        };
      });

      console.log('📊 [Orderbook] Transformed - Bids:', transformedBids, 'Asks:', transformedAsks);

      setBids(transformedBids);
      setAsks(transformedAsks);
      
      const totalBidVolume = bidRunningTotal;
      const totalAskVolume = askRunningTotal;
      const totalVolume = totalBidVolume + totalAskVolume;
      
      if (totalVolume > 0) {
        const newBuyPercentage = (totalBidVolume / totalVolume) * 100;
        console.log('📊 [Orderbook] Buy percentage:', newBuyPercentage.toFixed(2) + '%');
        setBuyPercentage(newBuyPercentage);
      }
    }, depthCallbackId);

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

  return (
    <div className="flex flex-col h-full text-gray-100 text-sm">
      <div className="flex-shrink-0">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <OrderbookHeader baseAsset={baseAsset} quoteAsset={quoteAsset} />
      </div>
      
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col justify-end overflow-hidden">
          <div className="overflow-y-auto flex flex-col-reverse">
            <AskOrders
              asks={asks}
              maxTotal={maxTotal}
              calculateBarWidth={calculateBarWidth}
              calculateSizeBarWidth={calculateSizeBarWidth}
            />
          </div>
        </div>
        
        <div className="flex-shrink-0">
          <CurrentPrice
            currentPrice={currentPrice}
            priceChange={priceChange}
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <div className="overflow-y-auto">
            <BidOrders
              bids={bids}
              maxTotal={maxTotal}
              calculateBarWidth={calculateBarWidth}
              calculateSizeBarWidth={calculateSizeBarWidth}
            />
          </div>
        </div>
      </div>

      <div className="flex-shrink-0">
        <BuySellPressure buyPercentage={buyPercentage} />
      </div>
    </div>
  );
};

export default Orderbook;