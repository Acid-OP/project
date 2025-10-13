import React from 'react';

interface Order {
  price: string;
  size: string;
  total: string;
}

interface BidOrdersProps {
  bids: Order[];
  maxTotal: number;
  calculateBarWidth: (total: string, maxTotal: number) => number;
  calculateSizeBarWidth: (size: string, maxTotal: number) => number;
}

export function BidOrders({ bids, maxTotal, calculateBarWidth, calculateSizeBarWidth }: BidOrdersProps) {
  return (
    <div className="flex-shrink-0 space-y-[3.5px]">
      {bids.map((bid, idx) => (
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
  );
}

export default BidOrders;