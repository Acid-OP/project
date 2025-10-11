import Navbar from "../../../components/Navbar/Navbar";

export default function TradeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen bg-[#0f0f14] flex flex-col overflow-hidden">
      <Navbar /> 
      {children}  
    </div>
  );
}