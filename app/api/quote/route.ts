// ==========================================
// FILE 4: app/api/quote/route.ts (REPLACE ENTIRE FILE)
// ==========================================
import { NextRequest, NextResponse } from 'next/server';
import { config } from '@/lib/config';

// Force dynamic rendering to avoid static generation issues
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Use the standard URL API to avoid nextUrl static-analysis issues
    const url = new URL(request.url);
    const searchParams = url.searchParams;
    const symbols = searchParams.get('symbols') || searchParams.get('symbol');

    if (!symbols) {
      return NextResponse.json(
        { error: 'Symbols parameter is required' },
        { status: 400 }
      );
    }

    // Use config instead of hardcoded URL
    const apiUrl = `${config.stockApi.baseUrl}${config.stockApi.endpoints.quote}?symbols=${encodeURIComponent(symbols)}`;
    
    const response = await fetch(apiUrl, {
      headers: {
        'User-Agent': 'NextJS-App/1.0',
        'Accept': 'application/json',
      },
      cache: 'no-store' // Changed from next.revalidate to cache: 'no-store'
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Stock API returned ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });

  } catch (error) {
    console.error('Quote API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}