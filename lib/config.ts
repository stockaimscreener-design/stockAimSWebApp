// ==========================================
// FILE: lib/config.ts (SIMPLIFIED - NO FALLBACKS IN CLIENT)
// ==========================================
/**
 * Centralized configuration for all API endpoints
 */

export const config = {
  // Supabase - Use direct process.env access, no fallbacks
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  },
  
  // Stock API
  stockApi: {
    baseUrl: process.env.NEXT_PUBLIC_STOCK_API_URL || 'https://stock-api-x35p.vercel.app',
    endpoints: {
      quote: '/quote',
      health: '/health',
    }
  },
  
  // Supabase Edge Functions
  functions: {
    updateStocks: process.env.NEXT_PUBLIC_UPDATE_STOCKS_URL ||
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/functions/v1/update-stocks`,
    screener: process.env.NEXT_PUBLIC_SCREENER_URL ||
              `${process.env.NEXT_PUBLIC_SUPABASE_URL || ''}/functions/v1/screener`,
  },
} as const;

export function isConfigValid(): boolean {
  const hasUrl = !!(config.supabase.url && config.supabase.url.startsWith('http'));
  const hasKey = !!(config.supabase.anonKey && config.supabase.anonKey.length > 20);
  return hasUrl && hasKey;
}


export function validateConfig() {
  console.log('🔍 Config validation:');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  console.log('config.supabase.url:', config.supabase.url);
  console.log('config.supabase.anonKey exists:', !!config.supabase.anonKey);
  console.log('isConfigValid():', isConfigValid());
  
  if (!isConfigValid()) {
    throw new Error(
      'Invalid Supabase configuration. Please check environment variables.'
    );
  }
  
  return true;
}