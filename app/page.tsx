'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Hero } from '@/components/Hero'
import { VoterSession } from '@/lib/types'

// Carga diferida de todo lo que está bajo el fold
const Login = dynamic(() => import('@/components/Login').then(m => ({ default: m.Login })), {
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
    </div>
  ),
  ssr: false,
})

const Voting = dynamic(() => import('@/components/Voting').then(m => ({ default: m.Voting })), {
  loading: () => (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 border-2 border-neon-purple/30 border-t-neon-purple rounded-full animate-spin" />
    </div>
  ),
  ssr: false,
})

const LiveResults = dynamic(() => import('@/components/LiveResults').then(m => ({ default: m.LiveResults })), {
  loading: () => null,
  ssr: false,
})

// Partículas con posiciones fijas (evita Math.random en render y problemas de hidratación)
const PARTICLES = [
  { left: '8%',  top: '12%', delay: '0s',    dur: '2.4s' },
  { left: '23%', top: '78%', delay: '0.4s',  dur: '3.1s' },
  { left: '41%', top: '34%', delay: '0.7s',  dur: '2.8s' },
  { left: '67%', top: '55%', delay: '1.1s',  dur: '3.4s' },
  { left: '82%', top: '19%', delay: '0.2s',  dur: '2.1s' },
  { left: '55%', top: '89%', delay: '1.5s',  dur: '2.7s' },
  { left: '15%', top: '46%', delay: '0.9s',  dur: '3.0s' },
  { left: '74%', top: '72%', delay: '0.3s',  dur: '3.6s' },
  { left: '33%', top: '8%',  delay: '1.2s',  dur: '2.5s' },
  { left: '90%', top: '41%', delay: '0.6s',  dur: '2.9s' },
  { left: '48%', top: '63%', delay: '1.8s',  dur: '3.3s' },
  { left: '6%',  top: '91%', delay: '0.1s',  dur: '2.2s' },
]

export default function Home() {
  const [session, setSession] = useState<VoterSession | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedSession = window.localStorage.getItem('voter_session')
    if (savedSession) {
      try {
        const p = JSON.parse(savedSession)
        p.voter.createdAt = new Date(p.voter.createdAt)
        p.voter.updatedAt = new Date(p.voter.updatedAt)
        p.votes = p.votes.map((v: any) => ({ ...v, createdAt: new Date(v.createdAt) }))
        p.hasVotedForCategory = (categoryId: string) => p.votes.some((v: any) => v.categoryId === categoryId)
        setSession(p)
      } catch {
        window.localStorage.removeItem('voter_session')
      }
    }
  }, [])

  const handleAuthenticated = (newSession: VoterSession) => setSession(newSession)

  const handleVoteSubmitted = () => {
    if (!session) return
    window.localStorage.setItem('voter_session', JSON.stringify({
      voter: session.voter,
      votes: session.votes,
    }))
  }

  const handleLogout = () => {
    window.localStorage.removeItem('voter_session')
    setSession(null)
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Hero — siempre visible, carga inmediata */}
      <Hero />

      {/* Contenido principal — lazy */}
      <div className="relative z-10">
        {!mounted ? null : session ? (
          <>
            {/* Barra de usuario */}
            <div className="bg-black/50 backdrop-blur-xl border-b border-neon-pink/20 px-4 sm:px-6 py-3 sm:py-4">
              <div className="mx-auto max-w-6xl flex flex-wrap gap-3 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-neon-pink font-bold text-base sm:text-lg">
                      {session.voter.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base truncate max-w-[140px] sm:max-w-xs">{session.voter.name}</p>
                    <p className="text-white/60 text-xs sm:text-sm truncate max-w-[140px] sm:max-w-xs">{session.voter.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-400 transition-all text-xs sm:text-sm flex-shrink-0"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            <Voting session={session} onVoteSubmitted={handleVoteSubmitted} />
            <LiveResults />
          </>
        ) : (
          <Login onAuthenticated={handleAuthenticated} />
        )}
      </div>

      {/* Botón admin */}
      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/70 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/80 hover:border-neon-pink hover:text-white transition-all backdrop-blur-sm"
        >
          Módulo Admin
        </a>
      </div>

      {/* Partículas decorativas — posiciones fijas, sin Math.random */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-pink rounded-full animate-pulse-neon"
            style={{ left: p.left, top: p.top, animationDelay: p.delay, animationDuration: p.dur }}
          />
        ))}
      </div>
    </main>
  )
}
