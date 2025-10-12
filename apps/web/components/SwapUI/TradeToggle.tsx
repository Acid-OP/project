import { useState } from "react";

type TradeToggleProps = {
  onChange?: (side: "buy" | "sell") => void;
  initialSide?: "buy" | "sell";
  width?: string; 
};

const TradeToggle: React.FC<TradeToggleProps> = ({onChange, initialSide = "buy", width = "w-80",}) => {
  const [side, setSide] = useState<"buy" | "sell">(initialSide);

  const handleClick = (newSide: "buy" | "sell") => {
    setSide(newSide);
    if (onChange) onChange(newSide);
  };

  return (
    <div className="flex justify-center mb-4">
      <div className={`flex gap-0 bg-[#202127] rounded-xl p-1 relative ${width}`}>
        <div
          className={`absolute inset-0 w-1/2 rounded-xl transition-all duration-300 ease-in-out ${
            side === "buy" ? "left-0 bg-[#1d2d2d]" : "left-1/2 bg-[#3a1e24]"
          }`}
        />
        <button
          onClick={() => handleClick("buy")}
          className={`flex-1 py-2.5 text-sm rounded-xl font-medium transition-colors relative z-10 cursor-pointer ${
            side === "buy" ? "text-[#00D395]" : "text-gray-400 hover:text-[#00D395]"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => handleClick("sell")}
          className={`flex-1 py-2.5 text-sm rounded-xl font-medium transition-colors relative z-10 cursor-pointer ${
            side === "sell" ? "text-[#dc4044]" : "text-gray-400 hover:text-[#dc4044]"
          }`}
        >
          Sell
        </button>
      </div>
    </div>
  );
};

export default TradeToggle;
