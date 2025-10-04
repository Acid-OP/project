import Link from 'next/link';

export default function NavLinks() {
  return (
    <div className="flex items-center space-x-8 ml-16">
      <Link 
        href="/spot" 
        className="text-sm font-semibold text-[#9ca3af] hover:text-white/80 transition-all duration-200 cursor-pointer"
      >
        Spot
      </Link>
      <Link 
        href="/futures" 
        className="text-sm font-semibold text-[#9ca3af] hover:text-white/80 transition-all duration-200 cursor-pointer"
      >
        Futures
      </Link>
      <Link 
        href="/lend" 
        className="text-sm font-semibold text-[#9ca3af] hover:text-white/80 transition-all duration-200 cursor-pointer"
      >
        Lend
      </Link>
      <div className="relative group">
        <button className="text-sm font-semibold text-[#9ca3af] hover:text-white/80 transition-all duration-200 cursor-pointer flex items-center space-x-1">
          <span>More</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}