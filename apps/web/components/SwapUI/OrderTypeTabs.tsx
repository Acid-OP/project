import React, { useState } from "react";

type OrderType = "limit" | "market" | "conditional";

type OrderTabsProps = {
  initialType?: OrderType;
  balance?: string;
  onOrderTypeChange?: (type: OrderType) => void;
};

const OrderTabs: React.FC<OrderTabsProps> = ({
  initialType = "limit",
  balance = "-",
  onOrderTypeChange,
}) => {
  const [orderType, setOrderType] = useState<OrderType>(initialType);

  const handleClick = (type: OrderType) => {
    setOrderType(type);
    if (onOrderTypeChange) onOrderTypeChange(type);
  };

  return (
    <div>
      {/* Order Type Tabs */}
      <div className="flex mb-4 gap-2">
        <button
          onClick={() => handleClick("limit")}
          className={`px-3 py-1.5 font-medium cursor-pointer text-sm transition-colors rounded-lg ${
            orderType === "limit"
              ? "text-white bg-[#202127]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Limit
        </button>
        <button
          onClick={() => handleClick("market")}
          className={`px-3 py-1.5 font-medium text-sm cursor-pointer transition-colors rounded-lg ${
            orderType === "market"
              ? "text-white bg-[#202127]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Market
        </button>
        <button
          onClick={() => handleClick("conditional")}
          className={`px-3 py-1.5 font-medium text-sm transition-colors cursor-pointer rounded-lg flex items-center gap-1 ${
            orderType === "conditional"
              ? "text-white bg-[#202127]"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Conditional
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Balance */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-gray-400 border-b border-dashed border-gray-700">
          Balance
        </span>
        <span className="text-xs text-white">{balance}</span>
      </div>
    </div>
  );
};

export default OrderTabs;
