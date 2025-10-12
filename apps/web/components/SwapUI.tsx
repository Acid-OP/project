import React, { useState } from 'react';

export function SwapUI({ market }: { market: string }) {
  const [side, setSide] = useState<'buy' | 'sell'>('buy');
  const [orderType, setOrderType] = useState<'limit' | 'market' | 'conditional'>('limit');
  const [price, setPrice] = useState('185.65');
  const [quantity, setQuantity] = useState('0');
  const [orderValue, setOrderValue] = useState('0');
  const [percentage, setPercentage] = useState(0);

  const [base, quote] = market.split('_');

  const handlePercentageChange = (value: number) => {
    setPercentage(value);
    // Calculate quantity based on percentage
  };

  return (
    <div className="flex flex-col h-full bg-[#14151b] p-4">
      {/* Buy/Sell Tabs */}
      <div className="flex gap-0 mb-4 bg-[#1a1b23] rounded-lg p-0.5 relative">
        <div 
          className={`absolute top-0.5 bottom-0.5 w-[calc(50%-2px)] rounded-lg transition-all duration-300 ease-in-out ${
            side === 'buy' ? 'left-0.5 bg-green-600' : 'left-[calc(50%+2px)] bg-red-600'
          }`}
        />
        <button
          onClick={() => setSide('buy')}
          className="flex-1 py-2.5 rounded-lg font-medium transition-colors relative z-10 cursor-pointer text-white"
        >
          Buy
        </button>
        <button
          onClick={() => setSide('sell')}
          className="flex-1 py-2.5 rounded-lg font-medium transition-colors relative z-10 cursor-pointer text-white"
        >
          Sell
        </button>
      </div>

      {/* Order Type Tabs */}
      <div className="flex gap-4 mb-4 border-b border-[#2a2b35]">
        <button
          onClick={() => setOrderType('limit')}
          className={`pb-2 px-1 font-medium text-sm transition-colors ${
            orderType === 'limit'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => setOrderType('market')}
          className={`pb-2 px-1 font-medium text-sm transition-colors ${
            orderType === 'market'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Market
        </button>
        <button
          onClick={() => setOrderType('conditional')}
          className={`pb-2 px-1 font-medium text-sm transition-colors flex items-center gap-1 ${
            orderType === 'conditional'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Conditional
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Balance */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-400">Balance</span>
        <span className="text-sm text-white">-</span>
      </div>

      {/* Price Input */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Price</span>
          <div className="flex gap-2">
            <button className="text-xs text-blue-500 hover:text-blue-400">Mid</button>
            <button className="text-xs text-blue-500 hover:text-blue-400">BBO</button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-[#1a1b23] text-white text-xl font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
            <span className="text-white text-lg font-bold">$</span>
          </button>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Quantity</span>
          <button className="p-1 hover:bg-[#1a1b23] rounded">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full bg-[#1a1b23] text-white text-xl font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Percentage Slider */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <input
            type="range"
            min="0"
            max="100"
            value={percentage}
            onChange={(e) => handlePercentageChange(Number(e.target.value))}
            className="flex-1 h-1 bg-[#1a1b23] rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #1a1b23 ${percentage}%, #1a1b23 100%)`
            }}
          />
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">0</span>
          <span className="text-xs text-white font-medium">{percentage}%</span>
        </div>
      </div>

      {/* Order Value */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-400">Order Value</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value)}
            className="w-full bg-[#1a1b23] text-white text-xl font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center hover:bg-green-700 transition-colors">
            <span className="text-white text-lg font-bold">$</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto">
        <button className="w-full py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Sign up to trade
        </button>
        <button className="w-full py-3 bg-transparent text-white font-medium rounded-lg border border-gray-600 hover:bg-[#1a1b23] transition-colors">
          Sign in to trade
        </button>
      </div>

      {/* Checkboxes */}
      <div className="flex gap-4 mt-4">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 bg-[#1a1b23] border border-gray-600 rounded" />
          <span className="text-sm text-gray-400">Post Only</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 bg-[#1a1b23] border border-gray-600 rounded" />
          <span className="text-sm text-gray-400">IOC</span>
        </label>
      </div>

      {/* Market Reputation */}
      <div className="mt-4 pt-4 border-t border-[#2a2b35]">
        <span className="text-sm text-gray-400">Market Reputation</span>
      </div>
    </div>
  );
}