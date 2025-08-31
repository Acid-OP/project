"use client";

import { useEffect, useState } from "react";
import { getDepth, getKlines, getTicker, getTrades } from "../../utils/httpClient";
import { AskTable } from "./AskTable";
import { BidTable } from "./Bidtable";
import { SignalingManager } from "../../utils/SignallingManager";

export function Depth({ market }: {market: string}) {
    const [bids, setBids] = useState<[string, string][]>();
    const [asks, setAsks] = useState<[string, string][]>();
    const [price, setPrice] = useState<string>();

    useEffect(() => {
        SignalingManager.getInstance().registerCallback("depth", (data: any) => {
            if (!data) return;
            
            if (data.bids) {
                setBids((originalBids) => {
                    if (!originalBids) return data.bids?.filter((bid: [string, string]) => parseFloat(bid[1]) > 0) || [];
                    let bidsAfterUpdate: [string, string][] = [...originalBids];

                    for (let j = 0; j < (data.bids?.length || 0); j++) {
                        const newBid = data.bids?.[j];
                        if (!newBid) continue;
                        
                        const price = newBid[0];
                        const size = newBid[1];
                        
                        // Find existing bid with same price
                        const existingIndex = bidsAfterUpdate.findIndex(bid => bid[0] === price);
                        
                        if (parseFloat(size) === 0) {
                            // Remove bid if size is 0
                            if (existingIndex !== -1) {
                                bidsAfterUpdate.splice(existingIndex, 1);
                            }
                        } else {
                            // Update existing bid or add new one
                            if (existingIndex !== -1 && bidsAfterUpdate[existingIndex]) {
                                bidsAfterUpdate[existingIndex]![1] = size;
                            } else {
                                bidsAfterUpdate.push([price, size]);
                            }
                        }
                    }
                    
                    // Sort bids in descending order (highest price first)
                    return bidsAfterUpdate.sort((a, b) => parseFloat(b[0]) - parseFloat(a[0]));
                });
            }

            if (data.asks) {
                setAsks((originalAsks) => {
                    if (!originalAsks) return data.asks?.filter((ask: [string, string]) => parseFloat(ask[1]) > 0) || [];
                    let asksAfterUpdate: [string, string][] = [...originalAsks];

                    for (let j = 0; j < (data.asks?.length || 0); j++) {
                        const newAsk = data.asks?.[j];
                        if (!newAsk) continue;
                        
                        const price = newAsk[0];
                        const size = newAsk[1];
                        
                        // Find existing ask with same price
                        const existingIndex = asksAfterUpdate.findIndex(ask => ask[0] === price);
                        
                        if (parseFloat(size) === 0) {
                            // Remove ask if size is 0
                            if (existingIndex !== -1) {
                                asksAfterUpdate.splice(existingIndex, 1);
                            }
                        } else {
                            // Update existing ask or add new one
                            if (existingIndex !== -1 && asksAfterUpdate[existingIndex]) {
                                asksAfterUpdate[existingIndex]![1] = size;
                            } else {
                                asksAfterUpdate.push([price, size]);
                            }
                        }
                    }
                    
                    // Sort asks in ascending order (lowest price first)
                    return asksAfterUpdate.sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]));
                });
            }

            // Update price from best bid/ask after updates
            if (data.bids && data.asks && data.bids.length > 0 && data.asks.length > 0) {
                // Filter out zero quantities before calculating price
                const validBids = data.bids.filter((bid: [string, string]) => parseFloat(bid[1]) > 0);
                const validAsks = data.asks.filter((ask: [string, string]) => parseFloat(ask[1]) > 0);
                
                if (validBids.length > 0 && validAsks.length > 0) {
                    const bestBid = parseFloat(validBids[0][0]);
                    const bestAsk = parseFloat(validAsks[0][0]);
                    const midPrice = ((bestBid + bestAsk) / 2).toFixed(2);
                    setPrice(midPrice);
                }
            }
        }, `DEPTH-${market}`);
        
        SignalingManager.getInstance().sendMessage({
            "method": "SUBSCRIBE",
            "params": [`depth.200ms.${market}`]
        });

        getDepth(market).then(d => {    
            // Filter out zero quantities from initial data
            setBids(d.bids?.filter((bid: [string, string]) => parseFloat(bid[1]) > 0).reverse() || []);
            setAsks(d.asks?.filter((ask: [string, string]) => parseFloat(ask[1]) > 0) || []);
        }).catch(error => {
            console.error("Error fetching depth:", error);
        });

        getTicker(market).then(t => setPrice(t.lastPrice)).catch(error => {
            console.error("Error fetching ticker:", error);
        });
        
        // @ts-ignore
        getTrades(market).then(t => setPrice(t[0].price)).catch(error => {
            console.error("Error fetching trades:", error);
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
            {asks && <AskTable asks={asks} />}
            {price && <div className="text-white">{price}</div>}
            {bids && <BidTable bids={bids} />}
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