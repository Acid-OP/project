import React, { useState } from 'react';
import TradeToggle from './TradeToggle';
import OrderTabs from './OrderTypeTabs';
import TradeForm from './TradeForm';

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
      <TradeToggle initialSide="buy"  onChange={(side) => console.log("Selected side:", side)} />
      <OrderTabs initialType="market" balance="-" onOrderTypeChange={(type) => console.log("Selected type:", type)}
      />
      <TradeForm
        price={price}
        setPrice={setPrice}
        quantity={quantity}
        setQuantity={setQuantity}
        percentage={percentage}
        handlePercentageChange={handlePercentageChange}
        orderValue={orderValue}
        setOrderValue={setOrderValue}
      />


      {/* Market Reputation */}
      <div className="mt-4 pt-4 border-t border-[#2a2b35]">
        <span className="text-sm text-gray-400">Market Reputation</span>
        
      </div>
    </div>
  );
}