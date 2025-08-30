"use client";
import React, { useEffect, useState } from "react";

const LiveCandleFeed: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // yaha apne backend WS ka URL daal
    const ws = new WebSocket("ws://localhost:8080"); 

    ws.onopen = () => {
      console.log("Connected to backend WS ✅");
    };

    ws.onmessage = (event) => {
      console.log("Message from backend:", event.data);
      setMessages((prev) => [...prev, event.data]);
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
      console.log("Connection closed ❌");
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">📊 Live Candle Feed</h2>
      <div className="mt-2 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="p-2 rounded bg-gray-800 text-white font-mono text-sm"
          >
            {msg}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveCandleFeed;
