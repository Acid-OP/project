import React from 'react';

interface Order {
  price: string;
  size: string;
  total: string;
}

interface AskOrdersProps {
  asks: Order[];
  maxTotal: number;
  calculateBarWidth: (total: string, maxTotal: number) => number;
  calculateSizeBarWidth: (size: string, maxTotal: number) => number;
}

export function AskOrders({ asks, maxTotal, calculateBarWidth, calculateSizeBarWidth }: AskOrdersProps) {
  return (
    <div className="flex-shrink-0 space-y-[3.5px]">
      {asks.slice().reverse().map((ask, idx) => (
        <div
          key={`ask-${idx}`}
          className="relative grid grid-cols-3 px-4 py-0.5 hover:bg-gray-900 cursor-pointer"
        >
          <div
            className="absolute right-0 top-0 bottom-0 bg-[#3a1e24]"
            style={{ width: `${calculateBarWidth(ask.total, maxTotal)}%` }}
          ></div>
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
  );
}

export default AskOrders;