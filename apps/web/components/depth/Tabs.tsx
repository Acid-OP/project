import React from 'react';

interface TabsProps {
  activeTab: 'book' | 'trades';
  setActiveTab: (tab: 'book' | 'trades') => void;
}

export function Tabs({ activeTab, setActiveTab }: TabsProps) {
  return (
    <div className="flex gap-2 p-2 px-4">
      <button
        onClick={() => setActiveTab('book')}
        className={`px-3 py-1 font-medium rounded-lg cursor-pointer transition-colors ${
          activeTab === 'book' ? 'text-white bg-[#202127]' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        Book
      </button>
      <button
        onClick={() => setActiveTab('trades')}
        className={`px-3 py-1 font-medium rounded-lg cursor-pointer transition-colors ${
          activeTab === 'trades' ? 'text-white bg-[#202127]' : 'text-gray-500 hover:text-gray-300'
        }`}
      >
        Trades
      </button>
    </div>
  );
}
