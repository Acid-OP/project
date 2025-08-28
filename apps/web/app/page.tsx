// pages/index.tsx or wherever you want to use it
import CandleChart from "../components/CandleChart";

export default function Home() {
  return (
    <>
      <h1>API quick test</h1>
      <CandleChart 
        symbol="BTCUSDT" 
        interval="1h" 
        limit={100} 
      />
    </>
  );
}