// ==========================================
// FILE: frontend/app/layout.tsx (UPDATED)
// ==========================================
import './globals.css'
import { Inter } from 'next/font/google'
import Navigation from '@/components/Navigation'
import { validateConfig } from '@/lib/config'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StockAimScreener - Advanced Stock Screening Tool',
  description: 'Professional stock screening tool for NASDAQ and NYSE markets with real-time data and advanced filters.',
}

// Validate configuration on app start (only in development)
if (process.env.NODE_ENV === 'development') {
  try {
    validateConfig()
    console.log('✅ Configuration validated')
  } catch (error) {
    console.error('❌ Configuration error:', error)
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="pb-20">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
