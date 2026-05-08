'use client'

import { useEffect, useState } from 'react'
import { Hero } from '@/components/Hero'
import { Login } from '@/components/Login'
import { Voting } from '@/components/Voting'
import { LiveResults } from '@/components/LiveResults'
import { VoterSession } from '@/lib/types'

export default function Home() {
  const [session, setSession] = useState<VoterSession | null>(null)

  useEffect(() => {
    // Check for existing session
    const savedSession = window.localStorage.getItem('voter_session')
    if (savedSession) {
      try {
        const parsedSession = JSON.parse(savedSession)
        // Convert dates back to Date objects
        parsedSession.voter.createdAt = new Date(parsedSession.voter.createdAt)
        parsedSession.voter.updatedAt = new Date(parsedSession.voter.updatedAt)
        parsedSession.votes = parsedSession.votes.map((vote: any) => ({
          ...vote,
          createdAt: new Date(vote.createdAt)
        }))

        // Add hasVotedForCategory method
        parsedSession.hasVotedForCategory = (categoryId: string) => {
          return parsedSession.votes.some((vote: any) => vote.categoryId === categoryId)
        }

        setSession(parsedSession)
      } catch (error) {
        console.error('Error loading session:', error)
        window.localStorage.removeItem('voter_session')
      }
    }
  }, [])

  const handleAuthenticated = (newSession: VoterSession) => {
    setSession(newSession)
  }

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
      {/* Hero Section - Always visible */}
      <Hero />

      {/* Main Content Flow */}
      <div className="relative z-10">
        {session ? (
          <>
            {/* User Info Bar */}
            <div className="bg-black/50 backdrop-blur-xl border-b border-neon-pink/20 px-4 sm:px-6 py-3 sm:py-4">
              <div className="mx-auto max-w-6xl flex flex-wrap gap-3 justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-neon-pink font-bold text-base sm:text-lg">
                      {session.voter.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-white font-semibold text-sm sm:text-base truncate max-w-[140px] sm:max-w-none">{session.voter.name}</p>
                    <p className="text-white/60 text-xs sm:text-sm truncate max-w-[140px] sm:max-w-none">{session.voter.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg border border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 text-xs sm:text-sm flex-shrink-0"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Voting Section */}
            <Voting session={session} onVoteSubmitted={handleVoteSubmitted} />

            {/* Results Section */}
            <LiveResults />
          </>
        ) : (
          <Login onAuthenticated={handleAuthenticated} />
        )}
      </div>

      <div className="absolute top-4 sm:top-6 right-4 sm:right-6 z-20">
        <a
          href="/admin"
          className="inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-white/20 bg-black/70 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm text-white/80 transition hover:border-neon-pink hover:text-white backdrop-blur-sm"
        >
          Módulo Admin
        </a>
      </div>

      {/* Floating particles effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-neon-pink rounded-full animate-pulse-neon"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </main>
  )
}