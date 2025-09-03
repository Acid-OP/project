"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { AskTable } from "./AskTable";
import { BidTable } from "./Bidtable";
import { SignalingManager } from "../../utils/SignallingManager";

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>([]);
    const [asks, setAsks] = useState<[string, string][]>([]);
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            if (!data || (!data.bids && !data.asks)) return;
            
            if (data.bids && data.bids.length > 0) {
                setBids((originalBids) => {
                    const updatedBids = [...originalBids];
                    data.bids.forEach(([updatePrice, updateQuantity]: [string, string]) => {
                        const priceFloat = parseFloat(updatePrice);
                        const quantityFloat = parseFloat(updateQuantity);
                        
                        // Find existing price level
                        const existingIndex = updatedBids.findIndex(([price]) => 
                            parseFloat(price) === priceFloat
                        );
                        
                        if (quantityFloat === 0) {
                            // Remove price level if quantity is 0
                            if (existingIndex !== -1) {
                                updatedBids.splice(existingIndex, 1);
                            }
                        } else {
                            // Update or add price level
                            if (existingIndex !== -1) {
                                updatedBids[existingIndex] = [updatePrice, updateQuantity];
                            } else {
                                updatedBids.push([updatePrice, updateQuantity]);
                            }
                        }
                    });
                    
                    // Sort bids by price (highest first)
                    return updatedBids.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
                });
            }

            if (data.asks && data.asks.length > 0) {
                setAsks((originalAsks) => {
                    const updatedAsks = [...originalAsks];
                    
                    // Apply each ask update
                    data.asks.forEach(([updatePrice, updateQuantity]: [string, string]) => {
                        const priceFloat = parseFloat(updatePrice);
                        const quantityFloat = parseFloat(updateQuantity);
                        
                        // Find existing price level
                        const existingIndex = updatedAsks.findIndex(([price]) => 
                            parseFloat(price) === priceFloat
                        );
                        
                        if (quantityFloat === 0) {
                            // Remove price level if quantity is 0
                            if (existingIndex !== -1) {
                                updatedAsks.splice(existingIndex, 1);
                            }
                        } else {
                            // Update or add price level
                            if (existingIndex !== -1) {
                                updatedAsks[existingIndex] = [updatePrice, updateQuantity];
                            } else {
                                updatedAsks.push([updatePrice, updateQuantity]);
                            }
                        }
                    });
                    
                    // Sort asks by price (lowest first)
                    return updatedAsks.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
                });
            }
        }, `DEPTH-${market}`);
        
        SignalingManager.getInstance().sendMessage({
            "method": "SUBSCRIBE",
            "params": [`depth.200ms.${market}`]
        });

        // Initialize order book with snapshot
        getDepth(market).then(d => {    
            setBids(d.bids.sort((a: [string, string], b: [string, string]) => 
                parseFloat(b[0]) - parseFloat(a[0])
            ));
            setAsks(d.asks.sort((a: [string, string], b: [string, string]) => 
                parseFloat(a[0]) - parseFloat(b[0])
            ));
        }).catch(error => {
            console.error("Error fetching depth:", error);
        });

        getTicker(market).then(t => setPrice(t.lastPrice)).catch(error => {
            console.error("Error fetching ticker:", error);
        });

        return () => {
            SignalingManager.getInstance().sendMessage({
                "method": "UNSUBSCRIBE",
                "params": [`depth.200ms.${market}`]
            });
            SignalingManager.getInstance().deRegisterCallback("depth", `DEPTH-${market}`);
        }
    }, [market])
    
    return (
        <div>
            <TableHeader />
            {asks.length > 0 && <AskTable asks={asks} />}
            {price && <div className="text-white">{price}</div>}
            {bids.length > 0 && <BidTable bids={bids} />}
        </div>
    );
}

function TableHeader() {
    return (
        <div className="flex justify-between text-xs">
            <div className="text-white">Price</div>
            <div className="text-slate-500">Size</div>
            <div className="text-slate-500">Total</div>
        </div>
    );
}