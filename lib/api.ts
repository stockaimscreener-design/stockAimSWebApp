// ==========================================
// FILE: lib/api.ts (FIX INITIALIZATION)
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

// IMPORTANT: Initialize Supabase client ONLY if config is valid
// This prevents using placeholder values
function createSupabaseClient() {
  console.log('🔧 Creating Supabase client...');
  console.log('URL:', config.supabase.url);
  console.log('Key exists:', !!config.supabase.anonKey);
  console.log('Is valid:', isConfigValid());
  
  if (!isConfigValid()) {
    console.error('❌ Invalid Supabase configuration!');
    throw new Error(
      'Supabase configuration is invalid. ' +
      'Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY'
    );
  }
  
  return createClient(config.supabase.url, config.supabase.anonKey);
}

// Initialize client - will throw error if config is invalid
export const supabase = createSupabaseClient();

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