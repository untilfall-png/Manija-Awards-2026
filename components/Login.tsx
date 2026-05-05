'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { User, Mail, Phone, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react'
import { createVoterSession } from '@/lib/voting'
import { VoterSession } from '@/lib/types'

interface LoginProps {
  onAuthenticated: (session: VoterSession) => void
}

export function Login({ onAuthenticated }: LoginProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Basic validation
      if (!formData.name.trim() || !formData.email.trim()) {
        throw new Error('Nombre y email son obligatorios')
      }

      if (!formData.email.includes('@')) {
        throw new Error('Ingresa un email válido')
      }

      // Create voter session with timeout
      const sessionPromise = createVoterSession(
        formData.email.trim().toLowerCase(),
        formData.name.trim(),
        formData.phone.trim() || undefined
      )

      // Add 45 second timeout
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Conexión a la base de datos lenta. Por favor intenta de nuevo.')), 45000)
      )

      const session = await Promise.race([sessionPromise, timeoutPromise]) as VoterSession

      // Store session in localStorage
      window.localStorage.setItem('voter_session', JSON.stringify({
        voter: session.voter,
        votes: session.votes,
      }))

      onAuthenticated(session)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) setError(null) // Clear error when user starts typing
  }

  return (
    <section id="registro" className="section-padding mx-auto max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="neon-card p-8 md:p-12"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-3 rounded-full border border-neon-pink/50 bg-black/50 backdrop-blur-xl px-6 py-3 text-sm uppercase tracking-[0.3em] text-neon-pink font-bold shadow-neon-pink mb-6"
          >
            <User className="h-5 w-5 animate-pulse" />
            REGISTRO DE VOTANTE
            <ShieldCheck className="h-5 w-5 animate-pulse" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-4xl md:text-5xl font-display font-bold text-white mb-4 neon-text"
          >
            ACCEDE A LA VOTACIÓN
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-white/80 leading-relaxed"
          >
            Regístrate con tus datos básicos para participar en la votación.
            Cada votante puede votar una vez por categoría.
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wider">
              Nombre Completo *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ingresa tu nombre completo"
                className="neon-input w-full text-lg py-4 px-6 rounded-2xl border-2 focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300 pl-12"
                required
              />
              <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neon-pink" />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wider">
              Correo Electrónico *
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="tu@email.com"
                className="neon-input w-full text-lg py-4 px-6 rounded-2xl border-2 focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300 pl-12"
                required
              />
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neon-pink" />
            </div>
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-3 uppercase tracking-wider">
              Teléfono (Opcional)
            </label>
            <div className="relative">
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="+56 9 1234 5678"
                className="neon-input w-full text-lg py-4 px-6 rounded-2xl border-2 focus:border-neon-pink focus:shadow-neon-pink transition-all duration-300 pl-12"
              />
              <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neon-pink" />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/20 border border-red-500/30"
            >
              <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 font-semibold">{error}</p>
            </motion.div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full text-xl py-5 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                REGISTRANDO...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <ShieldCheck className="h-6 w-6 group-hover:animate-bounce" />
                ACCEDER A LA VOTACIÓN
                <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
              </span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-white/60 text-sm">
          <p>Tu información se mantendrá privada y segura.</p>
          <p className="mt-2">Cada votante puede votar una vez por categoría.</p>
        </div>
      </motion.div>
    </section>
  )
}