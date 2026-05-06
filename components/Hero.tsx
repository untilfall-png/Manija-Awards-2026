'use client'

import { motion } from 'framer-motion'
import { Trophy, User, Sparkles, Zap, Star, QrCode, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24 sm:px-10">
      {/* Animated background gradients */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#090417] to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-pink/20 rounded-full blur-3xl animate-pulse-neon"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] bg-gradient-neon/10 rounded-full blur-3xl animate-pulse-neon"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full border border-neon-pink/50 bg-black/50 backdrop-blur-xl px-6 py-3 text-sm uppercase tracking-[0.3em] text-neon-pink font-bold shadow-neon-pink"
          >
            <Sparkles className="h-5 w-5 animate-pulse" />
            REGISTRO RÁPIDO Y SIMPLE
            <Zap className="h-5 w-5 animate-pulse" />
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4"
          >
            <h1 className="heading-neon text-center">
              MANIJA AWARDS
            </h1>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent flex-1"></div>
              <span className="text-4xl md:text-6xl font-display font-bold text-neon-orange neon-text-orange">
                2026
              </span>
              <div className="h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent flex-1"></div>
            </div>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="subheading-neon max-w-4xl mx-auto text-center leading-relaxed"
          >
            Registro simple con tus datos básicos y votación centrada en cada categoría.
            Una experiencia de alto impacto, con brillos eléctricos y ritmo competitivo.
          </motion.p>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="grid gap-6 md:grid-cols-3 mt-16"
          >
            <div className="neon-card group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-neon-pink/20 border border-neon-pink/30">
                  <User className="h-8 w-8 text-neon-pink" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">REGISTRO SIMPLE</h3>
                  <p className="text-white/70 text-sm">Nombre, email y teléfono (opcional)</p>
                </div>
              </div>
            </div>

            <div className="neon-card group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/30">
                  <Trophy className="h-8 w-8 text-neon-purple" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">VOTACIÓN SECUENCIAL</h3>
                  <p className="text-white/70 text-sm">Una categoría a la vez</p>
                </div>
              </div>
            </div>

            <div className="neon-card group hover:scale-105 transition-transform duration-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-neon-orange/20 border border-neon-orange/30">
                  <Star className="h-8 w-8 text-neon-orange" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-xl text-white">DISEÑO NEON MAX PRO</h3>
                  <p className="text-white/70 text-sm">Estilo eléctrico premium</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Section - Dual Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-16"
          >
            <div className="grid gap-6 max-w-3xl mx-auto md:grid-cols-2">
              {/* Direct Registration Option */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-8 rounded-2xl border border-neon-purple/30 hover:border-neon-purple/60 transition-all"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-neon-purple/20 border border-neon-purple/30">
                    <User className="h-8 w-8 text-neon-purple" />
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-3">
                  REGISTRARSE AQUÍ
                </h3>

                <p className="text-white/70 text-sm mb-6">
                  Acceso directo sin QR requerido
                </p>

                <Link href="#registro" scroll={true} className="w-full btn-neon-secondary inline-flex items-center justify-center gap-2 bg-neon-purple/20 border border-neon-purple/50 hover:bg-neon-purple/30 text-white">
                  <ArrowRight className="h-5 w-5" />
                  <span>Comenzar votación</span>
                </Link>
              </motion.div>

              {/* QR Registration Option */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="glass-card p-8 rounded-2xl border border-neon-pink/30 hover:border-neon-pink/60 transition-all"
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 rounded-2xl bg-neon-pink/20 border border-neon-pink/30">
                    <QrCode className="h-8 w-8 text-neon-pink" />
                  </div>
                </div>

                <h3 className="text-xl font-display font-bold text-white mb-3">
                  ESCANEAR QR
                </h3>

                <p className="text-white/70 text-sm mb-6">
                  Solo si deseas usar el código QR. No es obligatorio.
                </p>

                <button className="w-full btn-neon inline-flex items-center justify-center gap-2">
                  <QrCode className="h-5 w-5" />
                  <span>Abrir escáner</span>
                </button>
              </motion.div>
            </div>

            {/* Info Message */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-8 text-center"
            >
              <p className="text-white/60 text-sm">
                El teléfono es completamente opcional. Ambas opciones son válidas para votar.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-neon-pink rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </section>
  )
}