import React from 'react';

interface CurrentPriceProps {
  currentPrice: number;
  priceChange: number;
}

export function CurrentPrice({ currentPrice, priceChange }: CurrentPriceProps) {
  return (
    <div className="px-4 py-1">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`text-lg font-light ${priceChange >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
            {currentPrice.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}

export default CurrentPrice;