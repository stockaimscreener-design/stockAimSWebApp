// ==========================================
// FILE 1: next.config.js (REPLACE ENTIRE FILE)
// ==========================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    NEXT_PUBLIC_STOCK_API_URL: process.env.NEXT_PUBLIC_STOCK_API_URL || 'https://stock-api-x35p.vercel.app',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig