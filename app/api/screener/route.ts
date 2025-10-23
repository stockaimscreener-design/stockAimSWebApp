// ==========================================
// FILE 5: app/api/screener/route.ts (REPLACE ENTIRE FILE)
// ==========================================
import { NextRequest, NextResponse } from 'next/server'
import { config } from '@/lib/config'

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('Screener request:', body)
    
    const url = config.functions.screener
    console.log('Calling screener URL:', url)

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.supabase.anonKey}`,    
      },
      body: JSON.stringify(body),
      cache: 'no-store'
    })

    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Edge function error response:', errorText)
      
      return NextResponse.json(
        { 
          error: `Screener function error: ${response.status}`,
          details: errorText 
        },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Screener API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process screener request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}