interface CryptoItemProps {
  logo: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  isPositive: boolean;
}

function CryptoItem({ logo, name, symbol, price, change, isPositive }: CryptoItemProps) {
  return (
    <div className="flex items-center py-2 hover:bg-[#1a1921] transition-colors cursor-pointer px-3 -mx-3">
      <div className="flex items-center space-x-2 w-32">
        <div className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-xs">
          {logo.slice(0, 2)}
        </div>
        <div className="text-white text-xs">{name}</div>
      </div>
      <div className="text-white text-sm flex-1 text-right pr-4">{price}</div>
      <div className={`text-sm font-medium w-16 text-right ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? '+' : '-'}{change}
      </div>
    </div>
  );
}

interface SectionProps {
  title: string;
  items: CryptoItemProps[];
}

function Section({ title, items }: SectionProps) {
  return (
    <div className="bg-[#15141b] rounded-xl px-3 py-3">
      <h3 className="text-white font-medium text-base mb-2">{title}</h3>
      <div>
        {items.map((item, index) => (
          <CryptoItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function ThreeSections() {
  const newItems: CryptoItemProps[] = [
    { logo: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: '$96,591.70', change: '2.43%', isPositive: true },
    { logo: 'ETH', name: 'Ethereum', symbol: 'ETH', price: '$4,473.92', change: '0.32%', isPositive: false },
    { logo: 'SOL', name: 'Solana', symbol: 'SOL', price: '$229.06', change: '1.07%', isPositive: false },
    { logo: 'XRP', name: 'Ripple', symbol: 'XRP', price: '$3.13', change: '4.47%', isPositive: false },
    { logo: 'ADA', name: 'Cardano', symbol: 'ADA', price: '$1.24', change: '3.21%', isPositive: true },
  ];

  const topGainersItems: CryptoItemProps[] = [
    { logo: 'SHFL', name: 'Shuffle', symbol: 'SHFL', price: '$0.2481', change: '8.15%', isPositive: true },
    { logo: 'WLD', name: 'Worldcoin', symbol: 'WLD', price: '$0.9347', change: '5.99%', isPositive: true },
    { logo: 'PENGU', name: 'Pengu', symbol: 'PENGU', price: '$0.01207', change: '5.69%', isPositive: true },
    { logo: 'DBR', name: 'Debiru', symbol: 'DBR', price: '$0.01647', change: '2.87%', isPositive: true },
    { logo: 'MATIC', name: 'Polygon', symbol: 'MATIC', price: '$0.8234', change: '6.43%', isPositive: true },
  ];

  const popularItems: CryptoItemProps[] = [
    { logo: 'BTC', name: 'Bitcoin', symbol: 'BTC', price: '$121,840.80', change: '1.45%', isPositive: true },
    { logo: 'SOL', name: 'Solana', symbol: 'SOL', price: '$229.06', change: '1.07%', isPositive: false },
    { logo: 'ETH', name: 'Ethereum', symbol: 'ETH', price: '$4,473.92', change: '0.32%', isPositive: false },
    { logo: 'USDT', name: 'Tether', symbol: 'USDT', price: '$1.00', change: '0.03%', isPositive: false },
    { logo: 'BNB', name: 'Binance', symbol: 'BNB', price: '$672.45', change: '2.18%', isPositive: true },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f14] pt-4 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Section title="New" items={newItems} />
          <Section title="Top Gainers" items={topGainersItems} />
          <Section title="Popular" items={popularItems} />
        </div>
      </div>
    </div>
  );
}