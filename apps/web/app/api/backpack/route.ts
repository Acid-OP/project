import { NextRequest, NextResponse } from 'next/server';

const YOUR_BACKEND_URL = 'http://localhost:3003/api/v1';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');
    
    if (!endpoint) {
        return NextResponse.json({ error: 'Endpoint parameter required' }, { status: 400 });
    }

    try {
        const forwardParams = new URLSearchParams();
        searchParams.forEach((value, key) => {
            if (key !== 'endpoint') {
                forwardParams.append(key, value);
            }
        });
        
        const url = `${YOUR_BACKEND_URL}${endpoint}${forwardParams.toString() ? '?' + forwardParams.toString() : ''}`;
        
        console.log('Fetching:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('Backend API error:', data);
            return NextResponse.json({ error: 'Backend API error', details: data }, { status: response.status });
        }

        return NextResponse.json(data);
        
    } catch (error: any) {
        console.error('Proxy error:', error.message);
        return NextResponse.json({ error: 'Failed to fetch data', details: error.message }, { status: 500 });
    }
}