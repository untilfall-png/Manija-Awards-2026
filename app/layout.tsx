import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Montserrat } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
  preload: true,
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'Manija Awards 2026',
  description: 'Los premios más prestigiosos de la industria del entretenimiento — votación en tiempo real',
  keywords: 'Manija Awards, premios, entretenimiento, neon, votación, en vivo',
  authors: [{ name: 'Manija Awards Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'ManijAwards',
  },
}

// viewport como export separado (Next.js 14)
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ff2edf',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-body antialiased animated-bg min-h-screen">
        <div className="relative overflow-hidden">
          {/* Gradientes de fondo — solo 2 esferas (menos GPU en móvil) */}
          <div className="fixed inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/8 rounded-full blur-3xl animate-pulse-neon" />
            <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-purple/8 rounded-full blur-3xl animate-float" />
          </div>
          {children}
        </div>
      </body>
    </html>
  )
}
