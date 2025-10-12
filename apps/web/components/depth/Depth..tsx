import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

// Static dummy data to avoid hydration errors
const DUMMY_DATA = {
  asks: [
    { price: "185.82", size: "1.31", total: "103.61" },
    { price: "185.73", size: "0.75", total: "102.30" },
    { price: "185.70", size: "0.04", total: "101.55" },
    { price: "185.69", size: "41.89", total: "101.51" },
    { price: "185.60", size: "0.75", total: "59.62" },
    { price: "185.56", size: "20.56", total: "58.87" },
    { price: "185.55", size: "0.26", total: "38.31" },
    { price: "185.53", size: "0.38", total: "38.05" },
    { price: "185.52", size: "0.45", total: "37.67" },
    { price: "185.44", size: "37.22", total: "37.22" }
  ],
  bids: [
    { price: "185.46", size: "37.22", total: "37.22" },
    { price: "185.43", size: "0.05", total: "0.05" },
    { price: "185.41", size: "0.02", total: "0.07" },
    { price: "185.40", size: "0.02", total: "0.09" },
    { price: "185.39", size: "0.05", total: "0.14" },
    { price: "185.37", size: "0.02", total: "0.16" },
    { price: "185.34", size: "0.10", total: "0.26" },
    { price: "185.33", size: "0.92", total: "1.18" },
    { price: "185.32", size: "1.35", total: "2.53" },
    { price: "185.30", size: "2.15", total: "4.68" }
  ]
};

const Orderbook = () => {
  const [activeTab, setActiveTab] = useState('book');
  const [buyPercentage, setBuyPercentage] = useState(52);
  const data = DUMMY_DATA;

  const currentPrice = 185.46;
  const priceChange = -0.86;
  const priceChangePercent = -0.46;

  // Simulate real-time trade shifts
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

  const maxTotal: number = Math.max(
    ...data.asks.map(a => parseFloat(a.total)),
    ...data.bids.map(b => parseFloat(b.total))
  );

  return (
    <div className="flex flex-col h-full text-gray-300 font-mono text-sm">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          onClick={() => setActiveTab('book')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'book'
              ? 'text-white border-b-2 border-emerald-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Book
        </button>
        <button
          onClick={() => setActiveTab('trades')}
          className={`px-6 py-3 font-medium ${
            activeTab === 'trades'
              ? 'text-white border-b-2 border-emerald-500'
              : 'text-gray-500 hover:text-gray-300'
          }`}
        >
          Trades
        </button>
      </div>

      {/* View Toggle */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800">
        <div className="flex gap-1">
          <button className="p-1 hover:bg-gray-800 rounded">
            <div className="flex flex-col gap-0.5">
              <div className="w-4 h-0.5 bg-emerald-500"></div>
              <div className="w-4 h-0.5 bg-emerald-500"></div>
              <div className="w-4 h-0.5 bg-red-500"></div>
              <div className="w-4 h-0.5 bg-red-500"></div>
            </div>
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <div className="flex flex-col gap-0.5">
              <div className="w-4 h-0.5 bg-red-500"></div>
              <div className="w-4 h-0.5 bg-red-500"></div>
              <div className="w-4 h-0.5 bg-red-500"></div>
              <div className="w-4 h-0.5 bg-red-500"></div>
            </div>
          </button>
          <button className="p-1 hover:bg-gray-800 rounded">
            <div className="flex flex-col gap-0.5">
              <div className="w-4 h-0.5 bg-emerald-500"></div>
              <div className="w-4 h-0.5 bg-emerald-500"></div>
              <div className="w-4 h-0.5 bg-emerald-500"></div>
              <div className="w-4 h-0.5 bg-emerald-500"></div>
            </div>
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 px-4 py-2 text-xs text-gray-500 border-b border-gray-800">
        <div className="text-left">Price (USD)</div>
        <div className="text-right">Size (SOL)</div>
        <div className="text-right">Total (SOL)</div>
      </div>

      {/* Asks (Sell Orders) */}
      <div className="flex-shrink-0">
        {data.asks.map((ask, idx) => (
          <div
            key={`ask-${idx}`}
            className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-gray-900 cursor-pointer"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-red-900/10"
              style={{ width: `${calculateBarWidth(ask.total, maxTotal)}%` }}
            ></div>
            <div className="text-red-500 z-10">{ask.price}</div>
            <div className="text-right z-10">{ask.size}</div>
            <div className="text-right z-10">{ask.total}</div>
          </div>
        ))}
      </div>

      {/* Current Price */}
      <div className="px-4 py-3 bg-[#0d1117] border-y border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-red-500">
              {currentPrice.toFixed(2)}
            </span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-right">
            <div className="text-red-500 text-sm">
              {priceChange.toFixed(2)} ({priceChangePercent.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex-shrink-0">
        {data.bids.map((bid, idx) => (
          <div
            key={`bid-${idx}`}
            className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-gray-900 cursor-pointer"
          >
            <div
              className="absolute right-0 top-0 bottom-0 bg-emerald-900/10"
              style={{ width: `${calculateBarWidth(bid.total, maxTotal)}%` }}
            ></div>
            <div className="text-emerald-500 z-10">{bid.price}</div>
            <div className="text-right z-10">{bid.size}</div>
            <div className="text-right z-10">{bid.total}</div>
          </div>
        ))}
      </div>

      {/* Buy/Sell Pressure Indicator */}
      <div className="border-t border-gray-800 px-4 py-2">
        <div className="flex h-7 rounded-sm overflow-hidden">
          <div 
            className="bg-emerald-600 transition-all duration-500 ease-out flex items-center justify-center"
            style={{ width: `${buyPercentage}%` }}
          >
            <span className="text-xs font-medium text-white">{Math.round(buyPercentage)}%</span>
          </div>
          <div 
            className="bg-red-600 transition-all duration-500 ease-out flex items-center justify-center"
            style={{ width: `${100 - buyPercentage}%` }}
          >
            <span className="text-xs font-medium text-white">{Math.round(100 - buyPercentage)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Orderbook;