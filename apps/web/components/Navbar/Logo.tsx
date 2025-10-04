import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z" />
        </svg>
      </div>
      <span className="text-white font-semibold text-lg">Backpack</span>
    </Link>
  );
}
