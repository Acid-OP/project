import Link from 'next/link';

export default function NavLinks() {
  return (
    <div className="flex items-center space-x-12 ml-16">
      <Link href="/spot" className="text-[#63728a] hover:text-white transition-colors">Spot</Link>
      <Link href="/futures" className="text-[#63728a] hover:text-white transition-colors">Futures</Link>
      <Link href="/lend" className="text-[#63728a] hover:text-white transition-colors">Lend</Link>
      <div className="relative group">
        <button className="text-[#63728a] hover:text-white transition-colors flex items-center space-x-1">
          <span>More</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
