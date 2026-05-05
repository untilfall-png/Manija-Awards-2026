'use client'

import { useEffect, useState } from 'react'
import { Hero } from '@/components/Hero'
import { Auth } from '@/components/Auth'
import { Voting } from '@/components/Voting'
import { LiveResults } from '@/components/LiveResults'
import { Sponsors } from '@/components/Sponsors'
import { TutorialVideo } from '@/components/TutorialVideo'

export default function Home() {
  const [user, setUser] = useState<string | null>(null)
  const [tutorialCompleted, setTutorialCompleted] = useState(false)

  useEffect(() => {
    const savedUser = window.localStorage.getItem('manija_user')
    const savedTutorial = window.localStorage.getItem('manija_tutorial_completed')
    if (savedUser) {
      setUser(savedUser)
    }
    if (savedTutorial) {
      setTutorialCompleted(true)
    }
  }, [])

  const handleTutorialComplete = () => {
    setTutorialCompleted(true)
    window.localStorage.setItem('manija_tutorial_completed', 'true')
  }

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      {/* Hero Section - Always visible */}
      <Hero />

      {/* Main Content Flow */}
      <div className="relative z-10">
        {user ? (
          tutorialCompleted ? (
            <>
              <Voting user={user} />
              <LiveResults />
            </>
          ) : (
            <TutorialVideo onComplete={handleTutorialComplete} />
          )
        ) : (
          <Auth onAuthenticated={setUser} />
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