import React from 'react';

export function MarketBar({ market }: { market: string }) {
  const [base, quote] = market.split('_');

  const marketData = {
    lastPrice: '185.46',
    change24h: '-35.83',
    changePercent: '-16.17%',
    high24h: '239.89',
    low24h: '161.00',
    volume24h: '85,999,534.36'
  };

  const isNegative = marketData.change24h.startsWith('-');

  return (
    <div className="flex items-center gap-8 px-6 py-4 bg-[#14151b] border-b border-[#1a1a1a] rounded-lg">
      <div className="flex items-center gap-3 bg-[#202127] px-3 py-2 rounded-xl min-w-[140px]">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {base?.charAt(0)}
        </div>
        <div className="flex items-center gap-0.5">
          <span className="text-white font-medium text-lg">{base}</span>
          <span className="text-[#7d8492] font-medium text-lg">/</span>
          <span className="text-[#7d8492] font-medium text-lg">{quote}</span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className={`text-xl font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          {marketData.lastPrice}
        </div>
        <div className="text-sm text-white">
          ${marketData.lastPrice}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-xs text-gray-400 mb-1">24H Change</div>
        <div className={`text-sm font-medium ${isNegative ? 'text-red-500' : 'text-green-500'}`}>
          {marketData.change24h} {marketData.changePercent}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-xs text-gray-400 mb-1">24H High</div>
        <div className="text-sm text-white font-medium">
          {marketData.high24h}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-xs text-gray-400 mb-1">24H Low</div>
        <div className="text-sm text-white font-medium">
          {marketData.low24h}
        </div>
      </div>

      <div className="flex flex-col">
        <div className="text-xs text-gray-400 mb-1">24H Volume ({quote})</div>
        <div className="text-sm text-white font-medium">
          {marketData.volume24h}
        </div>
      </div>
    </div>
  );
}