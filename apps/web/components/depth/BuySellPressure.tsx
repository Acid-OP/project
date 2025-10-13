import React from 'react';

interface BuySellPressureProps {
  buyPercentage: number;
}

export function BuySellPressure({ buyPercentage }: BuySellPressureProps) {
  return (
    <div className="border-t border-gray-800 px-1 py-2">
      <div className="flex h-7 overflow-hidden relative gap-[2px]">
        {/* Buy side */}
        <div
          className="bg-[#11312a] transition-all duration-500 ease-out flex items-center justify-center"
          style={{
            width: `${buyPercentage}%`,
            clipPath: 'polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%)'
          }}
        >
          <span className="text-xs font-medium text-emerald-500">
            {Math.round(buyPercentage)}%
          </span>
        </div>

        {/* Sell side */}
        <div
          className="bg-[#3a1e24] transition-all duration-500 ease-out flex items-center justify-center"
          style={{
            width: `${100 - buyPercentage}%`,
            clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)'
          }}
        >
          <span className="text-xs font-medium text-red-500">
            {Math.round(100 - buyPercentage)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export default BuySellPressure;
