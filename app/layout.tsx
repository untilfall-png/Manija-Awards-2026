import type { Metadata } from 'next'
import { Bebas_Neue, Montserrat } from 'next/font/google'
import './globals.css'

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: 'Manija Awards 2026 - Neon Max Pro',
  description: 'Los premios más prestigiosos de la industria del entretenimiento - Diseño Neon Max Pro',
  keywords: 'Manija Awards, premios, entretenimiento, neon, max pro, votación',
  authors: [{ name: 'Manija Awards Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${montserrat.variable}`}>
      <head>
        <meta name="theme-color" content="#ff2edf" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-body antialiased animated-bg min-h-screen">
        <div className="relative overflow-hidden">
          {/* Background effects */}
          <div className="fixed inset-0 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-3xl animate-pulse-neon"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-neon/5 rounded-full blur-3xl animate-pulse-neon"></div>
          </div>

          {children}
        </div>
      </body>
    </html>
  )
}