import { useParams } from "next/navigation";
import { SwapUI } from "../components/SwapUI";
import { Depth } from "../components/depth/Depth.";
import { TradeView } from "../components/TradeView";
import { MarketBar } from "../components/MarketBar";

export default function Home() {
const market = "SOL_USDC";
    return <div className="flex flex-row h-screen max-h-screen overflow-hidden">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
            <div className="shrink-0">
                <MarketBar market={market as string} />
            </div>
            <div className="flex flex-row flex-1 min-h-0 border-y border-slate-800 overflow-hidden">
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                    <TradeView market={market as string} />
                </div>
                <div className="flex flex-col w-[250px] min-h-0 overflow-hidden">
                    <Depth market={market as string} /> 
                </div>
            </div>
        </div>
        <div className="w-[10px] flex-col border-slate-800 border-l shrink-0"></div>
        <div className="shrink-0 overflow-hidden">
            <div className="flex flex-col w-[250px] h-screen max-h-screen overflow-hidden">
                <SwapUI market={market as string} />
            </div>
        </div>
    </div>
}