import React, { useState } from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Tabs } from './Tabs';
import { ViewToggle } from './ViewToggle';
import { OrderbookHeader } from './OrderbookHeader';
import { DUMMY_DATA } from '../../utils/Dummydata';

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

      {/* Asks (Sell Orders) */}
      <div className="flex-shrink-0 space-y-[3.5px]">
        {data.asks.map((ask, idx) => (
          <div
            key={`ask-${idx}`}
            className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-gray-900 cursor-pointer"
          >
            {/* Light shade - Cumulative Total */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#3a1e24]"
              style={{ width: `${calculateBarWidth(ask.total, maxTotal)}%` }}
            ></div>
            {/* Dark shade - Individual Size */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#792c31]"
              style={{ width: `${calculateSizeBarWidth(ask.size, maxTotal)}%` }}
            ></div>
            <div className="text-[#d74347] text-xs z-10">{ask.price}</div>
            <div className="text-right text-xs z-10">{ask.size}</div>
            <div className="text-right text-xs z-10">{ask.total}</div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="px-4 py-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`text-lg font-light ${priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
              {currentPrice.toFixed(2)}
            </span>
            {priceChange >= 0 ? (
              <TrendingUp className="w-4 h-4 text-emerald-500" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-500" />
            )}
          </div>
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-shrink-0 space-y-[3.5px]">
        {data.bids.map((bid, idx) => (
          <div
            key={`bid-${idx}`}
            className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-gray-900 cursor-pointer"
          >
            {/* Light shade - Cumulative Total */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#11312a]"
              style={{ width: `${calculateBarWidth(bid.total, maxTotal)}%` }}
            ></div>
            {/* Dark shade - Individual Size */}
            <div
              className="absolute right-0 top-0 bottom-0 bg-[#0c5f43]"
              style={{ width: `${calculateSizeBarWidth(bid.size, maxTotal)}%` }}
            ></div>
            <div className="text-[#03905c] text-sm z-10">{bid.price}</div>
            <div className="text-right text-xs z-10">{bid.size}</div>
            <div className="text-right text-xs z-10">{bid.total}</div>
          </div>
        ))}
      </div>

      {/* Buy/Sell Pressure Indicator */}
<div className="border-t border-gray-800 px-1 py-2">
  <div className="flex h-7 overflow-hidden relative gap-[2px]">
    <div 
      className="bg-[#11312a] transition-all duration-500 ease-out flex items-center justify-center"
      style={{ 
        width: `${buyPercentage}%`,
        clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
      }}
    >
      <span className="text-xs font-medium text-emerald-500">{Math.round(buyPercentage)}%</span>
    </div>
    <div 
      className="bg-[#3a1e24] transition-all duration-500 ease-out flex items-center justify-center"
      style={{ 
        width: `${100 - buyPercentage}%`,
        clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)'
      }}
    >
      <span className="text-xs font-medium text-red-500">{Math.round(100 - buyPercentage)}%</span>
    </div>
  </div>
</div>
    </div>
  );
};

export default Orderbook;