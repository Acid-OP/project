import React, { useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Tabs } from './Tabs';
import { ViewToggle } from './ViewToggle';
import { OrderbookHeader } from './OrderbookHeader';
import { DUMMY_DATA } from '../../utils/Dummydata';
import BuySellPressure from './BuySellPressure';
import BidOrders from './BidOrders';
import CurrentPrice from './CurrentPrice';
import AskOrders from './AskOrders';

interface OrderbookProps {
  baseAsset: string;
  quoteAsset: string;
}

const Orderbook: React.FC<OrderbookProps> = ({ baseAsset, quoteAsset }) => {
  const [activeTab, setActiveTab] = React.useState<"book" | "trades">("book");
  const [buyPercentage, setBuyPercentage] = useState(52);
  const data = DUMMY_DATA;
  const [viewMode, setViewMode] = useState<'both' | 'buy' | 'sell'>('both');

  const currentPrice = 185.46;
  const priceChange = -0.86;

  React.useEffect(() => {
    const interval = setInterval(() => {
      setBuyPercentage(prev => {
        const change = (Math.random() - 0.5) * 5;
        const newValue = prev + change;
        return Math.max(20, Math.min(80, newValue));
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const calculateBarWidth = (total: string, maxTotal: number): number => {
    return (parseFloat(total) / maxTotal) * 100;
  };

  const calculateSizeBarWidth = (size: string, maxTotal: number): number => {
    return (parseFloat(size) / maxTotal) * 100;
  };

  const maxTotal: number = Math.max(
    ...data.asks.map(a => parseFloat(a.total)),
    ...data.bids.map(b => parseFloat(b.total))
  );

  return (
    <div className="flex flex-col h-full text-gray-100 text-sm pt-2">
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
        <OrderbookHeader baseAsset={baseAsset} quoteAsset={quoteAsset} />
        <AskOrders
            asks={data.asks}
            maxTotal={maxTotal}
            calculateBarWidth={calculateBarWidth}
            calculateSizeBarWidth={calculateSizeBarWidth}
        />
        <CurrentPrice
            currentPrice={currentPrice}
            priceChange={priceChange}
        />
        <BidOrders
            bids={data.bids}
            maxTotal={maxTotal}
            calculateBarWidth={calculateBarWidth}
            calculateSizeBarWidth={calculateSizeBarWidth}
        />
        <BuySellPressure buyPercentage={buyPercentage} />
    </div>
  );
};

export default Orderbook;