'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Sparkles, Zap } from 'lucide-react'
import Image from 'next/image'

export function WaitingRoom({ closed = false }: { closed?: boolean }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(true)
  const send = (msg: string) => iframeRef.current?.contentWindow?.postMessage(msg, '*')

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center px-4 sm:px-6 py-16 overflow-hidden">
      {/* Glow bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-neon-purple/20 rounded-full blur-3xl animate-pulse-neon" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-neon-pink/20 rounded-full blur-3xl animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-2xl mx-auto space-y-8 text-center"
      >
        {/* Badge */}
        <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-bold tracking-widest uppercase ${
          closed
            ? 'border-red-500/50 bg-red-500/10 text-red-400'
            : 'border-neon-purple/50 bg-neon-purple/10 text-neon-purple'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${closed ? 'bg-red-400' : 'bg-neon-purple'}`} />
          {closed ? 'Votación cerrada' : 'La votación abrirá pronto'}
          <Sparkles className="h-4 w-4 animate-pulse" />
        </div>

        {/* Título */}
        <div>
          <h2 className="text-4xl sm:text-6xl font-display font-bold text-white mb-2">MANIJA AWARDS</h2>
          <span className="text-5xl sm:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan">2026</span>
        </div>

        {/* Video logo reveal */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-2xl blur opacity-50 animate-pulse-neon pointer-events-none" />
          <div className="relative rounded-2xl overflow-hidden border border-neon-pink/40 bg-black" style={{ aspectRatio: '16/9' }}>
            {/* HUD corners */}
            <div className="absolute top-2 left-2 w-5 h-5 border-t-2 border-l-2 border-neon-pink/70 z-10 pointer-events-none" />
            <div className="absolute top-2 right-2 w-5 h-5 border-t-2 border-r-2 border-neon-pink/70 z-10 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-5 h-5 border-b-2 border-l-2 border-neon-cyan/70 z-10 pointer-events-none" />
            <div className="absolute bottom-2 right-2 w-5 h-5 border-b-2 border-r-2 border-neon-cyan/70 z-10 pointer-events-none" />
            <iframe
              ref={iframeRef}
              src="/hyperframes/logo-reveal.html"
              className="w-full h-full border-0"
              title="Manija Awards 2026 – Logo Reveal"
              allow="fullscreen"
            />
          </div>
        </div>

        {/* Controles */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => { send('restart'); setPlaying(true) }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 transition-all text-sm font-bold"
          >
            <RotateCcw className="h-4 w-4" /> Reiniciar
          </button>
          {playing ? (
            <button onClick={() => { send('pause'); setPlaying(false) }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all text-sm">
              <Pause className="h-4 w-4" /> Pausar
            </button>
          ) : (
            <button onClick={() => { send('play'); setPlaying(true) }}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all text-sm">
              <Play className="h-4 w-4" /> Reproducir
            </button>
          )}
        </div>

        <p className="text-white/40 text-xs tracking-widest uppercase">
          <Zap className="inline h-3 w-3 mr-1" />
          El administrador habilitará la votación en breve
        </p>
      </motion.div>
    </section>
  )
}
