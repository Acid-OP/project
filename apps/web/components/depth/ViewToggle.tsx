import React from 'react';

type ViewMode = 'both' | 'buy' | 'sell';

interface ViewToggleProps {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export function ViewToggle({ viewMode, setViewMode }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2 px-4 py-1 border-gray-800">
      <button
        onClick={() => setViewMode('both')}
        className={`px-2 py-1.5 hover:bg-[#202127] rounded transition-colors cursor-pointer ${
          viewMode === 'both' ? 'bg-[#202127]' : ''
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-3 h-0.5 bg-emerald-500"></div>
          <div className="w-3 h-0.5 bg-emerald-500"></div>
          <div className="w-3 h-0.5 bg-red-500"></div>
          <div className="w-3 h-0.5 bg-red-500"></div>
        </div>
      </button>

      <button
        onClick={() => setViewMode('sell')}
        className={`px-2 py-1.5 hover:bg-[#202127] rounded transition-colors cursor-pointer ${
          viewMode === 'sell' ? 'bg-[#202127]' : ''
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-3 h-0.5 bg-red-500"></div>
          <div className="w-3 h-0.5 bg-red-500"></div>
          <div className="w-3 h-0.5 bg-red-500"></div>
          <div className="w-3 h-0.5 bg-red-500"></div>
        </div>
      </button>

      <button
        onClick={() => setViewMode('buy')}
        className={`px-2 py-1.5 hover:bg-[#202127] rounded transition-colors cursor-pointer ${
          viewMode === 'buy' ? 'bg-[#202127]' : ''
        }`}
      >
        <div className="flex flex-col gap-0.5">
          <div className="w-3 h-0.5 bg-emerald-500"></div>
          <div className="w-3 h-0.5 bg-emerald-500"></div>
          <div className="w-3 h-0.5 bg-emerald-500"></div>
          <div className="w-3 h-0.5 bg-emerald-500"></div>
        </div>
      </button>
    </div>
  );
}
