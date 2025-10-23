// ==========================================
// FILE 2: lib/config.ts (REPLACE ENTIRE FILE)
// ==========================================
/**
 * Centralized configuration for all API endpoints
 * With safe fallbacks to prevent build errors
 */

const getEnvVar = (key: string, fallback: string = ''): string => {
  if (typeof window !== 'undefined') {
    return (window as any).ENV?.[key] || process.env[key] || fallback;
  }
  return process.env[key] || fallback;
};

export const config = {
  // Supabase
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'placeholder-key'),
  },
  
  // Stock API (Your Vercel Python API)
  stockApi: {
    baseUrl: getEnvVar('NEXT_PUBLIC_STOCK_API_URL', 'https://stock-api-x35p.vercel.app'),
    endpoints: {
      quote: '/quote',
      health: '/health',
    }
  },
  
  // Supabase Edge Functions
  functions: {
    updateStocks: getEnvVar('NEXT_PUBLIC_UPDATE_STOCKS_URL') ||
                  `${getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co')}/functions/v1/update-stocks`,
    screener: getEnvVar('NEXT_PUBLIC_SCREENER_URL') ||
              `${getEnvVar('NEXT_PUBLIC_SUPABASE_URL', 'https://placeholder.supabase.co')}/functions/v1/screener`,
  },
} as const;

export function isConfigValid(): boolean {
  return config.supabase.url !== 'https://placeholder.supabase.co' &&
         config.supabase.anonKey !== 'placeholder-key';
}

export function validateConfig() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0 && process.env.NODE_ENV !== 'production') {
    console.warn(
      `⚠️ Missing environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file'
    );
  }
  
  return missing.length === 0;
}