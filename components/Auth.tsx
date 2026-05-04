'use client'

import { useEffect, useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { QrCode, ShieldCheck } from 'lucide-react'

const QR_CODE = 'MANIJA-QR-2026'
const QR_IMAGE = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(QR_CODE)}`

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
    <section className="section-padding mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card border-[#ff2edf]/40 p-10"
      >
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#ff2edf]/40 bg-[#ffffff0d] px-4 py-2 text-sm uppercase tracking-[0.2em] text-[#ff2edf]">
              <QrCode className="h-5 w-5" /> Registro QR obligatorio
            </div>
            <h2 className="text-5xl font-extrabold tracking-tight text-white">
              Escanea el QR y registra tu acceso VIP
            </h2>
            <p className="text-lg text-[#d3d3ff] leading-relaxed">
              Para votar en el Manija Awards 2026 debes activar tu acceso usando el código QR único. Luego podrás avanzar categoría por categoría.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block text-sm font-semibold text-[#c8c8ff]">Código QR</label>
              <input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="Ingresa aquí el código que aparece en el QR"
                className="w-full rounded-3xl border border-[#7c3aed]/40 bg-[#0d0520] px-5 py-4 text-white outline-none transition focus:border-[#ff2edf]"
              />
              {error && <p className="text-sm text-[#ff6a6a]">{error}</p>}
              <button type="submit" className="btn-neon btn-neon-pink w-full text-lg">
                Activar acceso
              </button>
            </form>
          </div>
          <div className="relative mx-auto grid place-items-center rounded-[40px] border border-[#ff2edf]/20 bg-[#0b0315] p-6 shadow-[0_0_80px_rgba(255,45,219,0.16)]">
            <img src={QR_IMAGE} alt="QR de registro Manija Awards" className="h-64 w-64 rounded-3xl border border-[#ff2edf]/30 bg-[#0b0315] object-contain" />
            <div className="absolute inset-x-0 bottom-0 mx-auto mb-4 rounded-full bg-[#0b0315]/90 px-4 py-2 text-center text-sm text-[#c8c8ff] shadow-[0_0_24px_rgba(124,58,237,0.25)]">
              Código QR oficial: <span className="font-semibold text-white">{QR_CODE}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
