import { NextRequest, NextResponse } from 'next/server';

const BACKPACK_BASE_URL = 'https://api.backpack.exchange/api/v1';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint parameter required' }, { status: 400 });
    }

    try {
        // Forward all query parameters except 'endpoint'
        const forwardParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
            if (key !== 'endpoint') {
                forwardParams.append(key, value);
            }
        });
        
        const url = `${BACKPACK_BASE_URL}${endpoint}${forwardParams.toString() ? '?' + forwardParams.toString() : ''}`;
        
        console.log('Fetching:', url); // For debugging
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
        
    } catch (error) {
        console.error('Proxy error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch data from Backpack Exchange' }, 
            { status: 500 }
        );
    }
}