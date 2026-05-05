'use client'

import { useEffect, useState } from 'react'
import { Hero } from '@/components/Hero'
import { Login } from '@/components/Login'
import { Voting } from '@/components/Voting'
import { LiveResults } from '@/components/LiveResults'
import { Sponsors } from '@/components/Sponsors'
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
            <div className="bg-black/50 backdrop-blur-xl border-b border-neon-pink/20 px-6 py-4">
              <div className="mx-auto max-w-6xl flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center">
                    <span className="text-neon-pink font-bold text-lg">
                      {session.voter.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{session.voter.name}</p>
                    <p className="text-white/60 text-sm">{session.voter.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg border border-white/20 text-white/70 hover:border-red-500/50 hover:text-red-400 transition-all duration-300 text-sm"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>

            {/* Voting Section */}
            <Voting session={session} />

            {/* Results Section */}
            <LiveResults />
          </>
        ) : (
          <Login onAuthenticated={handleAuthenticated} />
        )}

        {/* Sponsors - Always visible at bottom */}
        <Sponsors />
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