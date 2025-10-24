"use client"
import { useParams } from "next/navigation";
import { MarketBar } from "../../../components/Ticker/MarketBar";
import { SwapUI } from "../../../components/SwapUI/SwapUI";
import Orderbook from "../../../components/depth/Depth.";
// import { DUMMY_KLINE_DATA, getPriceDataFromKlines } from "../../../components/K-Line/dummy";
import CurrentPrice from "../../../components/depth/CurrentPrice";
// import KLineChart from "../../../components/K-Line/chart";

export default function Home() {
    const { market } = useParams();
    const [baseAsset, quoteAsset] = (market?.toString() || "BTC-USDT").split("_");
    const base = baseAsset as string;
    const quote = quoteAsset as string;
    // const { currentPrice, priceChange, priceChangePercent } = getPriceDataFromKlines(DUMMY_KLINE_DATA);
    
    return <div className="flex flex-row min-h-screen bg-[#0f0f14] gap-2 p-4 pt-0">
        <div className="flex flex-col flex-1 min-h-0 overflow-hidden gap-2">
            <div className="shrink-0">
                <MarketBar market={market as string} />
            </div>
            <div className="flex flex-row flex-1 min-h-0 overflow-hidden gap-2">
                <div className="flex-1 flex flex-col gap-2 min-h-0 overflow-hidden">
                    {/* K-Line Chart */}
                    <div className="flex-1 min-h-0">
                        {/* <KLineChart data={DUMMY_KLINE_DATA} height={350} /> */}
                    </div>
                    {/* Current Price */}
                    <div className="shrink-0">
                        {/* <CurrentPrice
                            currentPrice={currentPrice}
                            priceChange={priceChange}
                        /> */}
                    </div>
                </div>
                <div className="w-[300px] bg-[#14151b] rounded-lg">
                    <Orderbook baseAsset={base} quoteAsset={quote} />
                </div>
            </div>
        </div>
        <div className="shrink-0 overflow-hidden">
            <div className="flex flex-col w-[340px] h-full bg-[#14151b] rounded-lg">
                <SwapUI market={market as string}/>
            </div>
        </div>
    </div>
}