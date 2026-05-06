'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { QrCode, ShieldCheck, Sparkles, Zap } from 'lucide-react'

const QR_CODE = 'MANIJA-QR-2026'
const QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(QR_CODE)}`

interface AuthProps {
  onAuthenticated: (name: string) => void
}

export function Auth({ onAuthenticated }: AuthProps) {
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    const savedUser = window.localStorage.getItem('manija_user')
    if (savedUser) {
      setRegistered(true)
      onAuthenticated(savedUser)
    }
  }, [onAuthenticated])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (code.trim().toUpperCase() !== QR_CODE) {
      setError('Código inválido. Escanea el QR y escribe el valor exacto.')
      return
    }

    const user = `fan-${Math.random().toString(36).slice(2, 10)}`
    window.localStorage.setItem('manija_user', user)
    window.localStorage.setItem('manija_registered', 'true')
    setRegistered(true)
    setError(null)
    onAuthenticated(user)
  }

  if (registered) {
    return null // Tutorial will be shown by parent component
  }

  return (
    <section className="section-padding mx-auto max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="neon-card p-12"
      >
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full border border-neon-pink/50 bg-black/50 backdrop-blur-xl px-6 py-3 text-sm uppercase tracking-[0.3em] text-neon-pink font-bold shadow-neon-pink mb-6"
          >
            <QrCode className="h-5 w-5 animate-pulse" />
            REGISTRO QR OBLIGATORIO
            <ShieldCheck className="h-5 w-5 animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-5xl md:text-6xl font-display font-bold text-white mb-6 neon-text"
          >
            ESCANEA EL QR Y REGISTRA TU ACCESO VIP
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-white/80 max-w-3xl mx-auto leading-relaxed"
          >
            Para votar en el Manija Awards 2026 debes activar tu acceso usando el código QR único.
            Luego podrás avanzar categoría por categoría en una experiencia premium.
          </motion.p>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative"
          >
            <div className="relative mx-auto w-fit">
              {/* Animated border */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-neon p-1 animate-pulse-neon">
                <div className="w-full h-full rounded-3xl bg-black"></div>
              </div>

              <div className="relative rounded-3xl border border-neon-pink/30 bg-black/90 p-8 backdrop-blur-xl">
                <img
                  src={QR_IMAGE}
                  alt="QR de registro Manija Awards"
                  className="w-72 h-72 mx-auto rounded-2xl border border-neon-purple/30 bg-white p-4"
                />

                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-neon-pink/20 border border-neon-pink/30 px-4 py-2">
                    <Sparkles className="h-4 w-4 text-neon-pink" />
                    <span className="text-sm font-mono font-bold text-neon-pink uppercase tracking-wider">
                      {QR_CODE}
                    </span>
                    <Zap className="h-4 w-4 text-neon-orange" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="space-y-8"
          >
            <div className="text-center lg:text-left">
              <h3 className="text-3xl font-display font-bold text-white mb-4">
                Ingresa el código QR
              </h3>
              <p className="text-white/70 leading-relaxed">
                Escanea el código QR con tu teléfono y copia el código que aparece.
                Luego pégalo en el campo de abajo para activar tu acceso.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wider">
                  Código QR
                </label>
                <input
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  placeholder="Ingresa aquí el código que aparece en el QR"
                  className="neon-input w-full text-lg py-4 px-6 rounded-2xl border-2 focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300"
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-3 text-sm text-red-400 font-semibold"
                  >
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                className="btn-neon w-full text-xl py-5 group"
              >
                <span className="flex items-center justify-center gap-3">
                  <ShieldCheck className="h-6 w-6 group-hover:animate-bounce" />
                  ACTIVAR ACCESO VIP
                  <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                </span>
              </button>
            </form>

            <div className="text-center text-white/60 text-sm">
              <p>Tu código es único y personal. No lo compartas con nadie.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
