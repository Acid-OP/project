import React, { useState } from 'react';

interface TradeFormProps {
  price: string;
  setPrice: (value: string) => void;
  quantity: string;
  setQuantity: (value: string) => void;
  percentage: number;
  handlePercentageChange: (value: number) => void;
  orderValue: string;
  setOrderValue: (value: string) => void;
}

const TradeForm: React.FC<TradeFormProps> = ({ price, setPrice, quantity, setQuantity, percentage, handlePercentageChange, orderValue, setOrderValue }) => {
    const [postOnly, setPostOnly] = useState(false);
    const [ioc, setIoc] = useState(false);
    return (
    <div className="flex flex-col h-full">
      {/* Price Input */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Price</span>
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
            className="w-full bg-[#202127] text-white text-xl font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-sm font-medium">$</span>
          </button>
        </div>
      </div>

      {/* Quantity Input */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-gray-400">Quantity</span>
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
            className="w-full bg-[#202127] text-white text-xl font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
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
          <span className="text-xs text-gray-400">Order Value</span>
        </div>
        <div className="relative">
          <input
            type="text"
            value={orderValue}
            onChange={(e) => setOrderValue(e.target.value)}
            className="w-full bg-[#202127] text-white text-xl font-medium px-4 py-3 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center transition-colors">
            <span className="text-white text-sm font-medium">$</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 mt-auto">
        <button className="w-full py-3 bg-white text-black cursor-pointer font-medium rounded-lg hover:bg-gray-100 transition-colors">
          Sign up to trade
        </button>
        <button className="w-full py-3 bg-[#202127] text-white cursor-pointer font-medium rounded-lg hover:bg-[#1a1b23] transition-colors">
          Sign in to trade
        </button>
      </div>

      {/* Checkboxes */}
    <div className="flex gap-4 mt-4">
        {/* Post Only */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
            onClick={() => setPostOnly(!postOnly)}
            className="w-4 h-4 bg-[#0e0f14] border border-gray-600 rounded flex items-center justify-center"
            >
            {postOnly && (
                <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
            </div>
            <span className="text-sm text-gray-400 ml-1">Post Only</span>
        </label>

        {/* IOC */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
            <div
            onClick={() => setIoc(!ioc)}
            className="w-4 h-4 bg-[#0e0f14] border border-gray-600 rounded flex items-center justify-center"
            >
            {ioc && (
                <svg
                className="w-3 h-3 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                viewBox="0 0 24 24"
                >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            )}
            </div>
            <span className="text-sm text-gray-400 ml-1">IOC</span>
        </label>
        </div>
    </div>
  );
};

export default TradeForm;
