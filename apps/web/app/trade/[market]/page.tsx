"use client"
import { useParams } from "next/navigation";
import { MarketBar } from "../../../components/MarketBar";

export default function Home() {
    const { market } = useParams();
    return <div className="flex flex-row h-screen max-h-screen overflow-hidden bg-[#0f0f14] gap-2 p-4 pt-0">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-2">
            <div className="shrink-0">
                <MarketBar market={market as string} />
            </div>
            <div className="flex flex-row flex-1 min-h-0 overflow-hidden gap-2">
                <div className="flex-1 bg-[#0d0d0d] rounded-lg">
                    {/* TradeView will go here */}
                </div>
                <div className="w-[250px] bg-[#0d0d0d] rounded-lg">
                    {/* Depth will go here */}
                </div>
            </div>
        </div>
        <div className="shrink-0 overflow-hidden">
            <div className="flex flex-col w-[250px] h-full bg-[#0d0d0d] rounded-lg">
                {/* SwapUI will go here */}
            </div>
        </div>
    </div>
}