import React from 'react';

interface OrderbookHeaderProps {
  baseAsset: string;
  quoteAsset: string;
}

export function OrderbookHeader({ baseAsset, quoteAsset }: OrderbookHeaderProps) {
  return (
    <div className="grid grid-cols-3 px-4 py-2 text-xs">
      <div className="text-left text-white font-medium">Price ({quoteAsset})</div>
      <div className="text-right text-gray-400">Size ({baseAsset})</div>
      <div className="text-right text-gray-400">Total ({baseAsset})</div>
    </div>
  );
}
