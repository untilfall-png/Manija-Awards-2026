'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Vote, Clock, Trophy, Sparkles, AlertCircle } from 'lucide-react'
import { createVote } from '@/lib/voting'
import { categories } from '@/lib/voting'
import { VoterSession, Category, Vote as VoteType } from '@/lib/types'

interface VotingProps {
  session: VoterSession
  onVoteSubmitted?: () => void
}

export function Voting({ session, onVoteSubmitted }: VotingProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0)
  const [selectedNominee, setSelectedNominee] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completedCategories, setCompletedCategories] = useState<Set<string>>(new Set())

  // Sort categories by order
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order)

  useEffect(() => {
    // Mark categories already voted as completed
    const votedCategoryIds = new Set(session.votes.map(vote => vote.categoryId))
    setCompletedCategories(votedCategoryIds)

    // Find first unvoted category
    const firstUnvotedIndex = sortedCategories.findIndex(cat => !votedCategoryIds.has(cat.id))
    if (firstUnvotedIndex !== -1) {
      setActiveCategoryIndex(firstUnvotedIndex)
    }
  }, [session.votes])

  const activeCategory = sortedCategories[activeCategoryIndex]
  const hasVotedForActiveCategory = session.hasVotedForCategory(activeCategory?.id || '')
  const progress = ((activeCategoryIndex + (hasVotedForActiveCategory ? 1 : 0)) / sortedCategories.length) * 100

  const handleVote = async () => {
    if (!selectedNominee || !activeCategory || hasVotedForActiveCategory) return

    setLoading(true)
    setError(null)

    try {
      await createVote({
        voterId: session.voter.id,
        categoryId: activeCategory.id,
        nomineeId: selectedNominee,
      })

      // Update local session
      const newVote: VoteType = {
        id: `temp-${Date.now()}`,
        voterId: session.voter.id,
        categoryId: activeCategory.id,
        nomineeId: selectedNominee,
        createdAt: new Date(),
      }

      session.votes.push(newVote)
      setCompletedCategories(prev => new Set([...prev, activeCategory.id]))

      // Move to next category or stay on current if it's the last
      const nextIndex = activeCategoryIndex + 1
      if (nextIndex < sortedCategories.length) {
        setActiveCategoryIndex(nextIndex)
        setSelectedNominee(null)
      }

      onVoteSubmitted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al enviar el voto')
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryChange = (index: number) => {
    setActiveCategoryIndex(index)
    setSelectedNominee(null)
    setError(null)
  }

  if (!activeCategory) {
    return (
      <section className="section-padding mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="neon-card p-12"
        >
          <Trophy className="h-24 w-24 text-neon-pink mx-auto mb-6" />
          <h2 className="text-4xl font-display font-bold text-white mb-4">
            ¡VOTACIÓN COMPLETADA!
          </h2>
          <p className="text-xl text-white/80">
            Has votado en todas las categorías disponibles. ¡Gracias por participar!
          </p>
        </motion.div>
      </section>
    )
  }

  return (
    <section className="section-padding mx-auto max-w-6xl">
      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-display font-bold text-white">
            Progreso de Votación
          </h2>
          <span className="text-neon-cyan font-semibold">
            {completedCategories.size} / {sortedCategories.length} categorías
          </span>
        </div>
        <div className="w-full bg-black/50 rounded-full h-3 border border-neon-pink/30">
          <motion.div
            className="bg-gradient-neon h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>

      {/* Category Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2"
      >
        {sortedCategories.map((category, index) => {
          const isCompleted = completedCategories.has(category.id)
          const isActive = index === activeCategoryIndex

          return (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(index)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                isActive
                  ? 'bg-neon-pink text-black shadow-neon-pink'
                  : isCompleted
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-black/50 text-white/70 border border-white/20 hover:border-neon-pink/50'
              }`}
            >
              {isCompleted && <CheckCircle className="inline h-4 w-4 mr-1" />}
              {category.name}
            </button>
          )
        })}
      </motion.div>

      {/* Main Voting Card */}
      <motion.div
        key={activeCategory.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="neon-card p-8 md:p-12"
      >
        {/* Category Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-3 mb-4"
          >
            <div className="p-3 rounded-2xl bg-neon-pink/20 border border-neon-pink/30">
              <Vote className="h-8 w-8 text-neon-pink" />
            </div>
            <span className="text-sm uppercase tracking-[0.3em] text-neon-pink font-bold">
              CATEGORÍA {activeCategory.order}
            </span>
          </motion.div>

          <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            {activeCategory.name}
          </h3>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {activeCategory.description}
          </p>
        </div>

        {/* Voting Status */}
        {hasVotedForActiveCategory ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
            <h4 className="text-2xl font-display font-bold text-white mb-2">
              ¡Ya votaste en esta categoría!
            </h4>
            <p className="text-white/70">
              Cada votante puede votar solo una vez por categoría.
            </p>
          </motion.div>
        ) : (
          <>
            {/* Nominees */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
              {activeCategory.nominees.map((nominee) => (
                <motion.button
                  key={nominee.id}
                  onClick={() => setSelectedNominee(nominee.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    selectedNominee === nominee.id
                      ? 'border-neon-pink bg-neon-pink/10 shadow-neon-pink'
                      : 'border-white/20 bg-black/30 hover:border-neon-pink/50'
                  }`}
                >
                  <h4 className="text-xl font-display font-bold text-white mb-2">
                    {nominee.name}
                  </h4>
                  {nominee.description && (
                    <p className="text-white/70 text-sm">
                      {nominee.description}
                    </p>
                  )}
                  {selectedNominee === nominee.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="mt-3 flex items-center gap-2 text-neon-pink"
                    >
                      <CheckCircle className="h-5 w-5" />
                      <span className="font-semibold">Seleccionado</span>
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/20 border border-red-500/30 mb-6"
              >
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                <p className="text-red-400 font-semibold">{error}</p>
              </motion.div>
            )}

            {/* Vote Button */}
            <div className="text-center">
              <button
                onClick={handleVote}
                disabled={!selectedNominee || loading}
                className="btn-neon text-xl py-5 px-12 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ENVIANDO VOTO...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <Vote className="h-6 w-6 group-hover:animate-bounce" />
                    CONFIRMAR VOTO
                    <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                  </span>
                )}
              </button>

              {!selectedNominee && (
                <p className="mt-4 text-white/60 text-sm">
                  Selecciona un nominado para continuar
                </p>
              )}
            </div>
          </>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 pt-8 border-t border-white/10">
          <button
            onClick={() => handleCategoryChange(Math.max(0, activeCategoryIndex - 1))}
            disabled={activeCategoryIndex === 0}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Anterior
          </button>

          <div className="flex items-center gap-2 text-white/60">
            <Clock className="h-4 w-4" />
            <span className="text-sm">
              {activeCategoryIndex + 1} de {sortedCategories.length}
            </span>
          </div>

          <button
            onClick={() => handleCategoryChange(Math.min(sortedCategories.length - 1, activeCategoryIndex + 1))}
            disabled={activeCategoryIndex === sortedCategories.length - 1}
            className="px-6 py-3 rounded-xl border border-white/20 text-white/70 hover:border-neon-cyan hover:text-neon-cyan transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente →
          </button>
        </div>
      </motion.div>
    </section>
  )
}
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