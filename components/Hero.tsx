'use client'

import { motion } from 'framer-motion'
import { Trophy, QrCode, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#04020a] px-6 py-24 sm:px-10 sm:py-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,45,219,0.22),_transparent_24%),radial-gradient(circle_at_bottom_right,_rgba(124,58,237,0.18),_transparent_28%)]" />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.9fr] items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-3 rounded-full border border-[#ff2edf]/30 bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.24em] text-[#ff2edf]">
              <QrCode className="h-5 w-5" /> Registro QR obligatorio
            </div>

            <div className="space-y-5">
              <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
                Manija Awards <span className="text-[#ff2edf]">2026</span>
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-[#d6d6ffcc] sm:text-xl">
                Registro con QR y votación centrada en cada categoría. Una experiencia de alto impacto, con brillos eléctricos y ritmo competitivo.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[28px] border border-[#ff2edf]/30 bg-[#100921] p-6 shadow-[0_0_40px_rgba(255,45,219,0.14)]">
                <p className="text-sm uppercase tracking-[0.2em] text-[#a3a2ff]">Modo</p>
                <p className="mt-3 text-xl font-semibold text-white">Votación por categoría</p>
              </div>
              <div className="rounded-[28px] border border-[#7c3aed]/30 bg-[#100921] p-6 shadow-[0_0_40px_rgba(124,58,237,0.14)]">
                <p className="text-sm uppercase tracking-[0.2em] text-[#a3a2ff]">Estilo</p>
                <p className="mt-3 text-xl font-semibold text-white">Neón fucsia, naranja y morado</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="neon-card border-[#ff2edf]/30 p-8"
          >
            <div className="mb-6 flex items-center gap-3 text-white/90">
              <Sparkles className="h-6 w-6 text-[#ff6a00]" />
              <span className="text-sm uppercase tracking-[0.2em] text-[#ff6a00]">Registro exclusivo</span>
            </div>
            <div className="rounded-[28px] border border-[#ff2edf]/20 bg-[#0c0512] p-6 text-center shadow-[0_0_60px_rgba(255,45,219,0.12)]">
              <div className="mx-auto mb-6 inline-flex h-28 w-28 items-center justify-center rounded-3xl bg-[#0b0313] text-[#ff2edf] shadow-[0_0_30px_rgba(255,45,219,0.2)]">
                <Trophy className="h-16 w-16" />
              </div>
              <p className="text-xl font-semibold text-white">Escanea el código QR para comenzar</p>
              <p className="mt-3 text-sm leading-6 text-[#c5c4ffbf]">
                El registro con QR desbloquea la votación. Cada categoría se abre de forma secuencial, asegurando una experiencia premium y directa.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}