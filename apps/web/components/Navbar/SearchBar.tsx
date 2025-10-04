export default function SearchBar() {
  return (
    <div className="w-80 ml-24">
      <div className="relative">
        <input
          type="text"
          placeholder="Search markets"
          className="w-full bg-[#202026] text-[#4d4f5b] placeholder:text-[#4d4f5b] rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-gray-700"
        />
        <svg className="w-5 h-5 text-[#4d4f5b] absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  );
}
