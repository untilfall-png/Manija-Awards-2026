'use client'

import { Sparkles, Heart } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-neon-pink/10 bg-black/40 backdrop-blur-sm px-4 sm:px-6 py-6 sm:py-8 mt-10 sm:mt-16 text-center">
      <div className="mx-auto max-w-6xl space-y-3">
        {/* Logo text */}
        <p className="text-xl sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan">
          MANIJA AWARDS 2026
        </p>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3">
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-r from-transparent to-neon-pink/30" />
          <Sparkles className="h-4 w-4 text-neon-pink/60 animate-pulse" />
          <div className="h-px flex-1 max-w-[100px] bg-gradient-to-l from-transparent to-neon-pink/30" />
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 text-xs text-white/40 uppercase tracking-widest">
          <span>Votación en tiempo real</span>
          <span className="text-white/20">·</span>
          <span>Firebase Firestore</span>
          <span className="text-white/20">·</span>
          <span>Next.js 14</span>
        </div>

        <p className="text-white/20 text-xs">
          Hecho con <Heart className="inline h-3 w-3 text-neon-pink mx-0.5" /> para Manija Awards 2026
        </p>
      </div>
    </footer>
  )
}
