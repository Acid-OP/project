export default function AuthButtons() {
  return (
    <div className="flex items-center space-x-4 ml-auto">
      <button className="bg-[#4d4f5b] text-[#00bd63] hover:opacity-90 font-medium px-4 py-2 rounded-lg transition-colors">
        Sign up
      </button>
      <button className="bg-[#00bd63] text-[#3e7ee2] hover:opacity-90 px-4 py-2 rounded-lg font-medium transition-colors">
        Sign in
      </button>
    </div>
  );
}
