'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Vote, Clock, Trophy, Sparkles, AlertCircle } from 'lucide-react'
import { createVote, getCategories } from '@/lib/voting'
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
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryError, setCategoryError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    getCategories()
      .then((fetched) => {
        if (!mounted) return
        setCategories(fetched)
      })
      .catch((err) => {
        console.error('Error loading categories:', err)
        setCategoryError('No se pudieron cargar las categorías')
      })
      .finally(() => {
        if (mounted) setLoadingCategories(false)
      })

    return () => {
      mounted = false
    }
  }, [])

  const sortedCategories = useMemo(() => [...categories].sort((a, b) => a.order - b.order), [categories])

  useEffect(() => {
    if (loadingCategories) return

    const votedCategoryIds = new Set(session.votes.map(vote => vote.categoryId))
    setCompletedCategories(votedCategoryIds)

    const firstUnvotedIndex = sortedCategories.findIndex(cat => !votedCategoryIds.has(cat.id))
    if (firstUnvotedIndex !== -1) {
      setActiveCategoryIndex(firstUnvotedIndex)
    }
  }, [session.votes, sortedCategories, loadingCategories])

  const activeCategory = sortedCategories[activeCategoryIndex]
  const hasVotedForActiveCategory = session.hasVotedForCategory(activeCategory?.id || '')
  const progress = ((activeCategoryIndex + (hasVotedForActiveCategory ? 1 : 0)) / Math.max(sortedCategories.length, 1)) * 100

  if (loadingCategories) {
    return (
      <section className="section-padding mx-auto max-w-6xl">
        <div className="text-center py-24">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
            <span className="text-neon-pink font-semibold">Cargando categorías...</span>
          </div>
        </div>
      </section>
    )
  }

  if (categoryError) {
    return (
      <section className="section-padding mx-auto max-w-6xl">
        <div className="neon-card p-10 text-center">
          <p className="text-neon-pink font-semibold">{categoryError}</p>
        </div>
      </section>
    )
  }

  if (!activeCategory) {
    return (
      <section className="section-padding mx-auto max-w-6xl text-center">
        <div className="neon-card p-12">
          <Trophy className="h-20 w-20 text-neon-pink mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-white mb-3">Sin categorías disponibles</h2>
          <p className="text-white/70">El administrador debe crear categorías para empezar la votación.</p>
        </div>
      </section>
    )
  }

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