export default function SearchBar() {
  return (
    <div className="w-72 ml-24">
      <div className="relative">
        <input
          type="text"
          placeholder="Search markets"
          className="w-full bg-[#1a1a1f] text-white placeholder:text-[#6b7280] rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-gray-700 transition-all"
        />
        <svg className="w-4 h-4 text-[#6b7280] absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}