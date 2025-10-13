import React, { useEffect, useRef, useState } from 'react';

interface KLine {
  close: string;
  end: string;
  high: string;
  low: string;
  open: string;
  quoteVolume: string;
  start: string;
  trades: string;
  volume: string;
}

interface KLineChartProps {
  data: KLine[];
  height?: number;
}

export default function KLineChart({ data, height = 400 }: KLineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);
  const [candlesVisible, setCandlesVisible] = useState(50);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || !data.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const container = containerRef.current;
    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const padding = { top: 20, right: 60, bottom: 40, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.fillStyle = '#0f0f14';
    ctx.fillRect(0, 0, width, height);

    // Calculate visible range
    const startIdx = Math.max(0, Math.min(data.length - candlesVisible, offset));
    const endIdx = Math.min(data.length, startIdx + candlesVisible);
    const visibleData = data.slice(startIdx, endIdx);

    if (visibleData.length === 0) return;

    // Find price range for visible data
    const prices = visibleData.flatMap(k => [
      parseFloat(k.high),
      parseFloat(k.low),
      parseFloat(k.open),
      parseFloat(k.close)
    ]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    const priceBuffer = priceRange * 0.1;

    // Draw grid lines
    ctx.strokeStyle = '#1a1a1f';
    ctx.lineWidth = 1;
    const gridLines = 5;
    
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const price = maxPrice + priceBuffer - ((maxPrice - minPrice + 2 * priceBuffer) / gridLines) * i;
      ctx.fillStyle = '#666';
      ctx.font = '11px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(price.toFixed(2), width - padding.right + 5, y + 4);
    }

    const candleWidth = Math.max(2, (chartWidth / candlesVisible) - 2);
    const candleSpacing = chartWidth / candlesVisible;

    // Draw candles
    visibleData.forEach((kline, index) => {
      const open = parseFloat(kline.open);
      const close = parseFloat(kline.close);
      const high = parseFloat(kline.high);
      const low = parseFloat(kline.low);

      const isGreen = close >= open;
      const color = isGreen ? '#00ff88' : '#ff4444';

      const x = padding.left + index * candleSpacing + candleSpacing / 2;
      
      const scaleY = (price: number) => {
        return padding.top + chartHeight - ((price - (minPrice - priceBuffer)) / (maxPrice - minPrice + 2 * priceBuffer)) * chartHeight;
      };

      const highY = scaleY(high);
      const lowY = scaleY(low);
      const openY = scaleY(open);
      const closeY = scaleY(close);

      // Draw wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Draw body
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;
      
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // Draw time labels
    const timeLabels = Math.min(5, visibleData.length);
    ctx.fillStyle = '#666';
    ctx.font = '11px monospace';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < timeLabels; i++) {
      const index = Math.floor((visibleData.length - 1) * (i / (timeLabels - 1)));
      const kline = visibleData[index];
      if (!kline) continue;
      
      const x = padding.left + index * candleSpacing + candleSpacing / 2;
      const date = new Date(parseInt(kline.end));
      const timeStr = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
      
      ctx.fillText(timeStr, x, height - 15);
    }

  }, [data, height, offset, candlesVisible]);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const delta = e.deltaY > 0 ? 5 : -5;
      setCandlesVisible(prev => Math.max(20, Math.min(200, prev + delta)));
    } else {
      // Scroll
      const delta = e.deltaY > 0 ? 5 : -5;
      setOffset(prev => Math.max(0, Math.min(data.length - candlesVisible, prev + delta)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const delta = dragStart - e.clientX;
    const candlesDelta = Math.round(delta / 10);
    
    if (candlesDelta !== 0) {
      setOffset(prev => Math.max(0, Math.min(data.length - candlesVisible, prev + candlesDelta)));
      setDragStart(e.clientX);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  return (
    <div ref={containerRef} className="w-full bg-[#14151b] rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-medium">Price Chart</h3>
        <div className="flex gap-2 text-xs">
          <button className="px-3 py-1 bg-[#1a1a1f] text-white rounded hover:bg-[#222228]">1H</button>
          <button className="px-3 py-1 bg-[#1a1a1f] text-white rounded hover:bg-[#222228]">4H</button>
          <button className="px-3 py-1 bg-[#1a1a1f] text-white rounded hover:bg-[#222228]">1D</button>
          <button className="px-3 py-1 bg-[#1a1a1f] text-white rounded hover:bg-[#222228]">1W</button>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        className="w-full cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      />
      <div className="mt-2 text-xs text-gray-500 text-center">
        Scroll to pan • Ctrl+Scroll to zoom • Drag to pan
      </div>
    </div>
  );
}

// Generate more realistic dummy data
export function generateDummyKlineData(count: number = 100): KLine[] {
  const data: KLine[] = [];
  let currentPrice = 185;
  const now = Date.now();
  
  for (let i = 0; i < count; i++) {
    const volatility = 0.02;
    const trend = (Math.random() - 0.48) * 2;
    
    const open = currentPrice;
    const change = currentPrice * volatility * trend;
    const close = open + change;
    
    const high = Math.max(open, close) + Math.abs(change) * Math.random();
    const low = Math.min(open, close) - Math.abs(change) * Math.random();
    
    const volume = 5000 + Math.random() * 5000;
    const quoteVolume = volume * ((high + low) / 2);
    
    data.push({
      open: open.toFixed(2),
      close: close.toFixed(2),
      high: high.toFixed(2),
      low: low.toFixed(2),
      start: String(now - (count - i) * 3600000),
      end: String(now - (count - i - 1) * 3600000),
      volume: volume.toFixed(0),
      quoteVolume: quoteVolume.toFixed(0),
      trades: String(Math.floor(500 + Math.random() * 500))
    });
    
    currentPrice = close;
  }
  
  return data;
}