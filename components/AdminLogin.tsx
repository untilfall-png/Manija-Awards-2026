'use client'

import { useState, type FormEvent } from 'react'
import { motion } from 'framer-motion'
import { Lock, LogIn } from 'lucide-react'

interface AdminLoginProps {
  onLogin: (token: string) => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Simple password check - In production, use proper authentication
      const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ManijAdmin2026'

      if (password === ADMIN_PASSWORD) {
        const token = Buffer.from(`admin:${Date.now()}`).toString('base64')
        onLogin(token)
      } else {
        setError('Contraseña incorrecta')
      }
    } catch (err) {
      setError('Error al autenticar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#090417] to-black flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="neon-card p-10 space-y-6">
          {/* Logo */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neon-pink/20 border border-neon-pink/30">
              <Lock className="h-10 w-10 text-neon-pink" />
            </div>
            <h1 className="text-3xl font-display font-bold text-white">Admin Panel</h1>
            <p className="text-white/70">Acceso restringido - Manija Awards 2026</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-neon-cyan mb-2 uppercase tracking-wider">
                Contraseña de Admin
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa la contraseña"
                className="neon-input w-full text-lg py-4 px-6 rounded-2xl border-2 focus:border-neon-pink transition-all"
                required
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 text-sm font-semibold"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-neon w-full text-lg py-4 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="inline-flex items-center justify-center gap-2">
                  <LogIn className="h-6 w-6" />
                  Acceder al Panel
                </span>
              )}
            </button>
          </form>

          <div className="text-center text-white/60 text-xs">
            <p>Acceso exclusivo para administradores</p>
          </div>
        </div>
      </motion.div>
    </main>
  )
}
