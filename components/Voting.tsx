'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface VoteData {
  [key: string]: string
}

const categories = [
  {
    id: 'q1',
    title: '🔥 El más manija del año',
    description: 'El alma del carrete más legendario.',
    options: ['Elias', 'Edu sin polera', 'Ayleen', 'Vale Biesler']
  },
  {
    id: 'q2',
    title: '🎉 Mejor After del Año',
    description: 'El cierre que dejó a todos hablando.',
    options: ['Creamfields', 'Maceo Plex Viña', 'Cumple Liss y Roberto', 'Adam Beyer Viña', 'After Viña Enero 2025']
  },
  {
    id: 'q3',
    title: '💃 Leyenda del Dancefloor',
    description: 'La persona que encendió la pista.',
    options: ['Roberto', 'Freddy', 'Kari']
  },
  {
    id: 'q4',
    title: '🎧 DJ invisible',
    description: 'Quien hizo vibrar sin que nadie lo viera.',
    options: ['Juan Rodolfo', 'Dani Cid', 'Criss Mizon', 'Edu sin polera']
  },
  {
    id: 'q5',
    title: '🚀 Revival del Año',
    description: 'El momento vintage más épico.',
    options: ['El Bomba', 'Retro Party', 'Old School Night']
  },
  {
    id: 'q6',
    title: '🤝 Dupla Dinámica',
    description: 'La pareja con mejor química en escena.',
    options: ['Feli y Criss Forné', 'Elías y Liss', 'Anita y Fer']
  },
  {
    id: 'q7',
    title: '🧢 Mejor Outfit Raver',
    description: 'El look más explosivo de la noche.',
    options: ['Bianca', 'Francys', 'Seba', 'Bomba']
  },
  {
    id: 'q8',
    title: '😂 Mejor Sticker',
    description: 'La frase viral que no para de reír.',
    options: ['Ayleen pico pico pico', 'Roberto durmiendo en el clóset', 'Bianka poseída', 'Patrick y memi']
  },
  {
    id: 'q9',
    title: '🎭 Mejor Actuación',
    description: 'Momento más memorable en escena o backstage.',
    options: ['Presentación sorpresa', 'Sketch viral', 'Monólogo épico']
  },
  {
    id: 'q10',
    title: '🎵 Mejor Track del Año',
    description: 'La canción que prendió la pista.',
    options: ['Tema 1', 'Tema 2', 'Tema 3']
  },
  {
    id: 'q11',
    title: '📸 Mejor Fotografía',
    description: 'La imagen que resume la experiencia.',
    options: ['Foto 1', 'Foto 2', 'Foto 3']
  },
  {
    id: 'q12',
    title: '🎬 Mejor Video',
    description: 'El clip con más impacto visual.',
    options: ['Video 1', 'Video 2', 'Video 3']
  },
  {
    id: 'q13',
    title: '🌟 Descubrimiento del Año',
    description: 'El nuevo talento que explotó.',
    options: ['Nuevo 1', 'Nuevo 2', 'Nuevo 3']
  },
  {
    id: 'q14',
    title: '🏆 Premio Especial Comunidad',
    description: 'El reconocimiento que entrega la gente.',
    options: ['Comunidad 1', 'Comunidad 2', 'Comunidad 3']
  }
]

interface VotingProps {
  user: string
}

export function Voting({ user }: VotingProps) {
  const [votes, setVotes] = useState<VoteData>({})
  const [activeIndex, setActiveIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    const voted = window.localStorage.getItem('manija_voted')
    if (voted) {
      setHasVoted(true)
    }
  }, [])

  const currentCategory = categories[activeIndex]

  const handleOptionSelect = (option: string) => {
    setSelectedOption(option)
    setError(null)
  }

  const handleNext = async () => {
    if (!selectedOption) {
      setError('Debes elegir una opción para continuar.')
      return
    }

    const nextVotes = {
      ...votes,
      [currentCategory.id]: selectedOption,
      user
    }

    if (activeIndex === categories.length - 1) {
      setIsSubmitting(true)
      setError(null)

      try {
        await addDoc(collection(db, 'votos'), {
          ...nextVotes,
          createdAt: serverTimestamp()
        })
        window.localStorage.setItem('manija_voted', 'true')
        setHasVoted(true)
        setFinished(true)
      } catch (err) {
        console.error('Error submitting vote:', err)
        setError('Error al enviar tu voto. Intenta nuevamente.')
      } finally {
        setIsSubmitting(false)
      }

      return
    }

    setVotes(nextVotes)
    setSelectedOption('')
    setActiveIndex((index) => index + 1)
  }

  if (hasVoted) {
    return (
      <section className="section-padding mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neon-card border-[#ff6a00]/40 p-12 text-center"
        >
          <div className="mb-6 text-[#ff6a00]">🎉</div>
          <h2 className="text-4xl font-bold text-white mb-4">Tu sesión está completa</h2>
          <p className="max-w-2xl mx-auto text-lg text-[#d3d3ff]">
            Gracias por votar. Tu voto fue registrado y la experiencia se cerró para evitar dobles participaciones.
          </p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="section-padding mx-auto max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="rounded-[32px] border border-[#7c3aed]/30 bg-[#090417]/80 p-8 shadow-[0_0_50px_rgba(124,58,237,0.18)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#a49fff]">Sesión segura</p>
              <h2 className="mt-3 text-4xl font-bold text-white">
                Vota categoría a categoría
              </h2>
              <p className="mt-3 max-w-2xl text-base text-[#c8c8ffcc]">
                Avanza solo cuando elijas tu favorito. Cada categoría se desbloquea una vez que confirmas tu selección.
              </p>
            </div>
            <div className="rounded-3xl border border-[#ff2edf]/30 bg-[#120718] px-5 py-4 text-right shadow-[0_0_30px_rgba(255,45,219,0.12)]">
              <p className="text-sm uppercase tracking-[0.2em] text-[#ffb3ff]">Progreso</p>
              <p className="mt-2 text-3xl font-semibold text-white">{activeIndex + 1} / {categories.length}</p>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="neon-card border-[#ff2edf]/30 p-10"
        >
          <div className="mb-8 space-y-4">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#ff6a00]/30 bg-[#ffffff0f] px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#ff6a00]">
              Categoría actual
            </div>
            <h3 className="text-3xl font-bold text-white">{currentCategory.title}</h3>
            <p className="max-w-3xl text-lg leading-8 text-[#d6d6ffcc]">{currentCategory.description}</p>
          </div>

          <div className="grid gap-4">
            {currentCategory.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleOptionSelect(option)}
                className={`w-full rounded-3xl border px-6 py-5 text-left text-lg font-medium transition ${
                  selectedOption === option
                    ? 'border-[#ff2edf] bg-[#ff2edf]/10 text-white shadow-[0_0_30px_rgba(255,45,219,0.18)]'
                    : 'border-[#7c3aed]/30 bg-[#0b0410] text-[#d3d3ff] hover:border-[#ff6a00]/50 hover:bg-[#ff6a00]/5'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {error && <p className="mt-4 text-sm text-[#ff6a6a]">{error}</p>}

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-[#b6b0ff]">
              Selecciona tu favorito y presiona continuar para guardar tu voto por categoría.
            </div>
            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="btn-neon btn-neon-pink w-full sm:w-auto text-xl"
            >
              {activeIndex === categories.length - 1 ? 'Enviar voto final' : 'Continuar a la siguiente'}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}