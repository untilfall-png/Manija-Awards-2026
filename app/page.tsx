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
    <main className="min-h-screen bg-[#04020a] text-white">
      <Hero />
      {user ? (
        tutorialCompleted ? (
          <Voting user={user} />
        ) : (
          <TutorialVideo onComplete={handleTutorialComplete} />
        )
      ) : (
        <Auth onAuthenticated={setUser} />
      )}
      <LiveResults />
      <Sponsors />
    </main>
  )
}