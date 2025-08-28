"use client"
import React, { useEffect, useRef, useState } from 'react';

interface CandleChartProps {
  symbol?: string;
  interval?: string;
  limit?: number;
}

const CandleChart: React.FC<CandleChartProps> = ({ 
  symbol: propSymbol = 'ETCUSDT', 
  interval: propInterval = '1m', 
  limit = 1000 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [symbol, setSymbol] = useState(propSymbol);
  const [interval, setInterval] = useState(propInterval);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [chartLib, setChartLib] = useState<any>(null);

  const symbols = ['ETCUSDT', 'ETHUSDT', 'BTCUSDT', 'SOLUSDT'];
  const intervals = ['1m', '5m', '15m', '1h', '4h'];

  // Load chart library
  useEffect(() => {
    const loadChart = async () => {
      try {
        const { createChart } = await import('lightweight-charts');
        setChartLib({ createChart });
      } catch (err) {
        console.error('Failed to load lightweight-charts:', err);
        setError('Failed to load chart library');
      }
    };
    loadChart();
  }, []);

  // Fetch candle data
  const fetchCandles = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL!}/api/candles/${symbol.toLowerCase()}/${interval}?limit=${limit}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const apiData = await response.json();
      
      if (apiData.s === "no_data") {
        setError("No data available for this symbol/interval");
        return;
      }
      
      if (apiData.s === "error") {
        setError(apiData.errmsg || "Error fetching data");
        return;
      }

      setData(apiData);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching candles:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
      setLoading(false);
    }
  };

  // Create chart when both library and data are ready
  useEffect(() => {
    if (!chartLib || !data || !chartContainerRef.current) return;
    
    try {
      const container = chartContainerRef.current;
      const chart = chartLib.createChart(container, {
        width: 800,
        height: 400,
        layout: {
          background: { color: '#1a1a1a' },
          textColor: '#ffffff',
        },
        grid: {
          vertLines: { color: '#374151' },
          horzLines: { color: '#374151' },
        },
        crosshair: { mode: 1 },
        rightPriceScale: { borderColor: '#485563' },
        timeScale: {
          borderColor: '#485563',
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 10,
          barSpacing: 10,
          fixLeftEdge: false,
          lockVisibleTimeRangeOnResize: true,
        },
        handleScroll: { mouseWheel: true, pressedMouseMove: true },
        handleScale: { axisPressedMouseMove: true, mouseWheel: true, pinch: true },
      });

      const candlestickSeries = chart.addCandlestickSeries({
        upColor: '#10b981',
        downColor: '#ef4444',
        borderDownColor: '#ef4444',
        borderUpColor: '#10b981',
        wickDownColor: '#ef4444',
        wickUpColor: '#10b981',
      });

      const candleData = data.t.map((timestamp: number, index: number) => ({
        time: timestamp,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
      }));

      candlestickSeries.setData(candleData);
      chart.timeScale().fitContent();

      return () => {
        chart.remove();
      };
    } catch (err) {
      console.error('Error creating chart:', err);
      setError('Failed to create chart: ' + (err as Error).message);
    }
  }, [chartLib, data]);

  useEffect(() => {
    fetchCandles();
  }, [symbol, interval]);

  return (
    <div className="p-4 bg-gray-900 min-h-screen text-white">
      <h1 className="text-2xl font-bold mb-4">ETC Trading Chart</h1>
      
      {/* Controls */}
      <div className="mb-4 flex gap-4 flex-wrap">
        <select
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded"
        >
          {symbols.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        
        <select
          value={interval}
          onChange={(e) => setInterval(e.target.value)}
          className="bg-gray-700 text-white px-3 py-2 rounded"
        >
          {intervals.map(i => (
            <option key={i} value={i}>{i}</option>
          ))}
        </select>
      </div>

      {/* Debug Info */}
      <div className="mb-4 p-3 bg-gray-800 rounded">
        <h3 className="text-lg font-bold mb-2">Debug Info:</h3>
        <p>Chart Library Loaded: {chartLib ? '✅ Yes' : '❌ No'}</p>
        <p>Loading: {loading ? '⏳ Yes' : '✅ No'}</p>
        <p>Error: {error ? `❌ ${error}` : '✅ None'}</p>
        <p>Data Points: {data ? `📊 ${data.t?.length || 0} candles` : '❌ No data'}</p>
        <p>Time Range: {data?.t ? `${new Date(data.t[0] * 1000).toLocaleString()} - ${new Date(data.t[data.t.length-1] * 1000).toLocaleString()}` : 'N/A'}</p>
        <p>Price Range: {data?.h && data?.l ? `${Math.min(...data.l).toFixed(2)} - ${Math.max(...data.h).toFixed(2)}` : 'N/A'}</p>
      </div>

      {/* Raw Data Display */}
      {data && (
        <div className="mb-4 p-3 bg-gray-800 rounded">
          <h3 className="text-lg font-bold mb-2">Sample Data:</h3>
          <pre className="text-xs overflow-x-auto">
            {JSON.stringify({
              symbol: data.s,
              firstTime: data.t?.[0],
              firstOpen: data.o?.[0],
              firstHigh: data.h?.[0],
              firstLow: data.l?.[0],
              firstClose: data.c?.[0],
              totalCandles: data.t?.length
            }, null, 2)}
          </pre>
        </div>
      )}

      {/* Chart Container */}
      <div className="bg-gray-800 p-4 rounded">
        <h3 className="text-lg font-bold mb-2">Chart:</h3>
        {error ? (
          <div className="text-red-400 p-4 border border-red-400 rounded">
            Error: {error}
          </div>
        ) : loading ? (
          <div className="text-blue-400 p-4 border border-blue-400 rounded">
            Loading chart data...
          </div>
        ) : !chartLib ? (
          <div className="text-yellow-400 p-4 border border-yellow-400 rounded">
            Loading chart library...
          </div>
        ) : (
          <div 
            ref={chartContainerRef}
            className="border border-gray-600 bg-gray-900"
            style={{ width: '800px', height: '400px' }}
          />
        )}
      </div>
    </div>
  );
};

export default CandleChart;
