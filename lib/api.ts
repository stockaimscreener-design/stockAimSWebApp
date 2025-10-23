// ==========================================
// FILE 3: lib/api.ts (REPLACE ENTIRE FILE)
// ==========================================
import { createClient } from '@supabase/supabase-js'
import { config, isConfigValid } from './config'

export type QuoteResult = {
  symbol: string
  name: string | null
  price: number | null
  change_percent: number | null
  volume: number | null
  market_cap: number | null
  shares_float: number | null
  relative_volume: number | null
}

// Initialize Supabase client with config - safe initialization
export const supabase = isConfigValid()
  ? createClient(config.supabase.url, config.supabase.anonKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export type UpdateStocksResponse = {
  success: boolean
  mode?: string
  requested?: number
  updated?: number
  failed?: number
  duration_ms?: number
  error?: string
}

/**
 * Call Supabase Edge Function to update stock prices
 */
export async function updateStocks(symbols: string[]): Promise<UpdateStocksResponse> {
  if (!isConfigValid()) {
    throw new Error('Supabase configuration is invalid. Please check environment variables.');
  }
  
  const url = config.functions.updateStocks;
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.supabase.anonKey}`
    },
    body: JSON.stringify({ symbols })
  })

  const data: UpdateStocksResponse = await res.json()
  if (!res.ok) throw new Error(data.error || 'Failed to update stocks')

  return data
}

/**
 * Fetch stocks from Supabase using ANON key (RLS enforced)
 */
export async function fetchStocks(symbols: string[]): Promise<QuoteResult[]> {
  if (!isConfigValid()) {
    throw new Error('Supabase configuration is invalid. Please check environment variables.');
  }
  
  const { data, error } = await supabase
    .from('stocks')
    .select('*')
    .in('symbol', symbols)

  if (error) throw error
  return data || []
}

/**
 * Fetch quotes from Stock API
 */
export async function fetchQuotesFromStockAPI(symbols: string[]): Promise<any> {
  const symbolString = symbols.join(',');
  const url = `${config.stockApi.baseUrl}${config.stockApi.endpoints.quote}?symbols=${encodeURIComponent(symbolString)}`;
  
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
    }
  });
  
  if (!res.ok) {
    throw new Error(`Stock API error: ${res.statusText}`);
  }
  
  return res.json();
}