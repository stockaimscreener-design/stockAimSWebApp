// ==========================================
/**
 * Centralized configuration for all API endpoints
 */
export const config = {
  // Supabase
  supabase: {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  },
  
  // Stock API (Your Vercel Python API)
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
                  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-stocks`,
    screener: process.env.NEXT_PUBLIC_SCREENER_URL ||
              `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/screener`,
  },
} as const;

// Validation helper
export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file'
    );
  }
}