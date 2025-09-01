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
                    if (!originalBids) return data.bids;
                    const bidsAfterUpdate: [string, string][] = [...originalBids];

                    for (let i = 0; i < bidsAfterUpdate.length; i++) {
                        for (let j = 0; j < data.bids!.length; j++) {
                            if (bidsAfterUpdate[i]![0] === data.bids![j]![0]) {
                                bidsAfterUpdate[i]![1] = data.bids![j]![1];
                                 if (parseFloat(bidsAfterUpdate[i]![1]) === 0) {
                        bidsAfterUpdate.splice(i, 1);
                        i--; // adjust index after removal
                    }
                                break;
                            }
                        }
                    }
                    return bidsAfterUpdate; 
                });
            }

            if (data.asks) {
                setAsks((originalAsks) => {
                    if (!originalAsks) return data.asks;
                    const asksAfterUpdate: [string, string][] = [...originalAsks];

                    for (let i = 0; i < asksAfterUpdate.length; i++) {
                        for (let j = 0; j < data.asks!.length; j++) {
                            if (asksAfterUpdate[i]![0] === data.asks![j]![0]) {
                                asksAfterUpdate[i]![1] = data.asks![j]![1];
                                 if (parseFloat(asksAfterUpdate[i]![1]) === 0) {
                        asksAfterUpdate.splice(i, 1);
                        i--; // adjust index after removal
                    }
                                break;
                            }
                        }
                    }
                    return asksAfterUpdate; 
                });
            }
        }, `DEPTH-${market}`);
        
        SignalingManager.getInstance().sendMessage({
            "method": "SUBSCRIBE",
            "params": [`depth.200ms.${market}`]
        });

        getDepth(market).then(d => {    
            setBids(d.bids.reverse());
            setAsks(d.asks);
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
    }, [market]) // Added market to dependency array
    
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