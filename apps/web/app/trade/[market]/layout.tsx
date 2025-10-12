import Navbar from "../../../components/Navbar/Navbar";

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen relative">  {/* Changed h-screen to min-h-screen, removed overflow-hidden */}
      <div 
        className="w-full bg-[#0f0f14] flex flex-col"  
      >
        <Navbar /> 
        {children}  
      </div>
    </div>
  );
}