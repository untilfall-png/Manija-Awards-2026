'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { CheckCircle, Vote, Clock, Sparkles, AlertCircle } from 'lucide-react'
import { createVote, getCategories } from '@/lib/voting'
import { VoterSession, Category, Vote as VoteType } from '@/lib/types'
import { VoteCelebration } from '@/components/VoteCelebration'
import { WaitingRoom } from '@/components/WaitingRoom'

interface VotingProps {
  session: VoterSession
  onVoteSubmitted?: () => void
  onCelebration?: () => void
}

export function Voting({ session, onVoteSubmitted }: VotingProps) {
  const [activeCategoryIndex, setActiveCategoryIndex]   = useState(0)
  const [selectedNominee, setSelectedNominee]           = useState<string | null>(null)
  const [loading, setLoading]                           = useState(false)
  const [error, setError]                               = useState<string | null>(null)
  const [completedCategories, setCompletedCategories]   = useState<Set<string>>(new Set())
  const [categories, setCategories]                     = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories]       = useState(true)
  const [categoryError, setCategoryError]               = useState<string | null>(null)
  const [votingDisabled, setVotingDisabled]             = useState(false)
  const [celebrating, setCelebrating]                   = useState(false)

  /* ── Cargar categorías una sola vez ── */
  useEffect(() => {
    let mounted = true
    getCategories()
      .then(f  => { if (mounted) setCategories(f) })
      .catch(() => { if (mounted) setCategoryError('No se pudieron cargar las categorías') })
      .finally(() => { if (mounted) setLoadingCategories(false) })
    return () => { mounted = false }
  }, [])

  /* ── Real-time: votación abierta/cerrada ── */
  useEffect(() => {
    supabase.from('system_config').select('voting_enabled').eq('id', 'system_config').single()
      .then(({ data }) => { if (data) setVotingDisabled(!(data.voting_enabled ?? true)) })
    const ch = supabase.channel('voting-system-config')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'system_config' },
        payload => { const d = payload.new as any; if (d) setVotingDisabled(!(d.voting_enabled ?? true)) })
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  // Las categorías especiales no participan del flujo de votación pública
  const sortedCategories = useMemo(
    () => [...categories].filter(c => !c.isSpecial).sort((a, b) => a.order - b.order),
    [categories]
  )

  useEffect(() => {
    if (loadingCategories) return
    const votedIds = new Set(session.votes.map(v => v.categoryId))
    setCompletedCategories(votedIds)
    const first = sortedCategories.findIndex(c => !votedIds.has(c.id))
    if (first !== -1) setActiveCategoryIndex(first)
  }, [session.votes, sortedCategories, loadingCategories])

  const activeCategory          = sortedCategories[activeCategoryIndex]
  const hasVotedForActiveCategory = session.hasVotedForCategory(activeCategory?.id || '')
  const progress = ((activeCategoryIndex + (hasVotedForActiveCategory ? 1 : 0)) / Math.max(sortedCategories.length, 1)) * 100

  /* ── Loading / Error / Cerrada ── */
  if (loadingCategories) return (
    <section className="px-4 sm:px-6 py-16 mx-auto max-w-6xl">
      <div className="text-center">
        <div className="inline-flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink font-semibold">Cargando categorías...</span>
        </div>
      </div>
    </section>
  )

  if (categoryError) return (
    <section className="px-4 sm:px-6 py-16 mx-auto max-w-6xl">
      <div className="neon-card p-10 text-center">
        <p className="text-neon-pink font-semibold">{categoryError}</p>
      </div>
    </section>
  )

  /* Votación cerrada → WaitingRoom */
  if (votingDisabled) return (
    <section className="px-4 sm:px-6 mx-auto max-w-6xl">
      <WaitingRoom closed />
    </section>
  )

  if (!activeCategory) return (
    <section className="px-4 sm:px-6 py-16 mx-auto max-w-6xl text-center">
      <div className="neon-card p-12">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-4xl font-display font-bold text-white mb-4">¡VOTACIÓN COMPLETADA!</h2>
        <p className="text-xl text-white/80">Has votado en todas las categorías. ¡Gracias por participar!</p>
      </div>
    </section>
  )

  const handleVote = async () => {
    if (!selectedNominee || !activeCategory || hasVotedForActiveCategory || votingDisabled) return
    setLoading(true)
    setError(null)

    try {
      await createVote({ voterId: session.voter.id, categoryId: activeCategory.id, nomineeId: selectedNominee })

      const newVote: VoteType = {
        id: `temp-${Date.now()}`,
        voterId: session.voter.id,
        categoryId: activeCategory.id,
        nomineeId: selectedNominee,
        createdAt: new Date(),
      }

      session.votes.push(newVote)
      setCompletedCategories(prev => new Set([...prev, activeCategory!.id]))
      setCelebrating(true)

      const next = activeCategoryIndex + 1
      if (next < sortedCategories.length) {
        setTimeout(() => {
          setActiveCategoryIndex(next)
          setSelectedNominee(null)
        }, 800)
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

  return (
    <>
      {/* Celebración de voto */}
      <VoteCelebration active={celebrating} onDone={() => setCelebrating(false)} />

      <section className="px-4 sm:px-6 py-10 sm:py-16 mx-auto max-w-6xl">
        {/* Barra de progreso */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4 flex-wrap gap-2">
            <h2 className="text-lg sm:text-2xl font-display font-bold text-white">Progreso de Votación</h2>
            <span className="text-neon-cyan font-semibold text-sm sm:text-base">
              {completedCategories.size} / {sortedCategories.length} categorías
            </span>
          </div>
          <div className="w-full bg-black/50 rounded-full h-2.5 sm:h-3 border border-neon-pink/30 overflow-hidden">
            <motion.div
              className="bg-gradient-neon h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Navegación de categorías */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-1.5 sm:gap-2 mb-6 sm:mb-8"
        >
          {sortedCategories.map((cat, idx) => {
            const done   = completedCategories.has(cat.id)
            const active = idx === activeCategoryIndex
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(idx)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active ? 'bg-neon-pink text-black shadow-neon-pink'
                  : done ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : 'bg-black/50 text-white/70 border border-white/20 hover:border-neon-pink/50'
                }`}
              >
                {done && <CheckCircle className="inline h-3.5 w-3.5 mr-1" />}
                {cat.name}
              </button>
            )
          })}
        </motion.div>

        {/* Card principal */}
        <motion.div
          key={activeCategory.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="neon-card p-5 sm:p-8 md:p-12"
        >
          {/* Cabecera categoría */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="inline-flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="p-2 sm:p-3 rounded-2xl bg-neon-pink/20 border border-neon-pink/30">
                <Vote className="h-6 w-6 sm:h-8 sm:w-8 text-neon-pink" />
              </div>
              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neon-pink font-bold">
                CATEGORÍA {activeCategory.order}
              </span>
            </motion.div>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-white mb-3 sm:mb-4">{activeCategory.name}</h3>
            <p className="text-base sm:text-xl text-white/80 max-w-2xl mx-auto">{activeCategory.description}</p>
          </div>

          {/* Ya votó */}
          {hasVotedForActiveCategory ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h4 className="text-2xl font-display font-bold text-white mb-2">¡Ya votaste en esta categoría!</h4>
              <p className="text-white/70">Cada votante puede votar solo una vez por categoría.</p>
            </motion.div>
          ) : (
            <>
              {/* Nominados */}
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6 sm:mb-8">
                {activeCategory.nominees.map(nominee => (
                  <motion.button
                    key={nominee.id}
                    onClick={() => setSelectedNominee(nominee.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 sm:p-6 rounded-2xl border-2 transition-all text-left ${
                      selectedNominee === nominee.id
                        ? 'border-neon-pink bg-neon-pink/10 shadow-neon-pink'
                        : 'border-white/20 bg-black/30 hover:border-neon-pink/50'
                    }`}
                  >
                    <h4 className="text-base sm:text-xl font-display font-bold text-white mb-1 sm:mb-2">{nominee.name}</h4>
                    {nominee.description && <p className="text-white/70 text-xs sm:text-sm">{nominee.description}</p>}
                    {selectedNominee === nominee.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-2 flex items-center gap-2 text-neon-pink">
                        <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-semibold text-sm">Seleccionado</span>
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>

              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl bg-red-500/20 border border-red-500/30 mb-6"
                >
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 font-semibold text-sm sm:text-base">{error}</p>
                </motion.div>
              )}

              {/* Botón votar */}
              <div className="text-center">
                <button
                  onClick={handleVote}
                  disabled={!selectedNominee || loading}
                  className="btn-neon text-base sm:text-xl py-4 sm:py-5 px-10 sm:px-12 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ENVIANDO...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 sm:gap-3">
                      <Vote className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-bounce" />
                      CONFIRMAR VOTO
                      <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 group-hover:animate-pulse" />
                    </span>
                  )}
                </button>
                {!selectedNominee && <p className="mt-3 text-white/60 text-sm">Selecciona un nominado para continuar</p>}
              </div>
            </>
          )}

          {/* Navegación anterior/siguiente */}
          <div className="flex justify-between items-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-white/10 gap-2">
            <button
              onClick={() => handleCategoryChange(Math.max(0, activeCategoryIndex - 1))}
              disabled={activeCategoryIndex === 0}
              className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20 text-white/70 hover:border-neon-cyan hover:text-neon-cyan transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Anterior
            </button>
            <div className="flex items-center gap-1.5 sm:gap-2 text-white/60">
              <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="text-xs sm:text-sm">{activeCategoryIndex + 1} de {sortedCategories.length}</span>
            </div>
            <button
              onClick={() => handleCategoryChange(Math.min(sortedCategories.length - 1, activeCategoryIndex + 1))}
              disabled={activeCategoryIndex === sortedCategories.length - 1}
              className="px-3 sm:px-6 py-2 sm:py-3 rounded-xl border border-white/20 text-white/70 hover:border-neon-cyan hover:text-neon-cyan transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Siguiente →
            </button>
          </div>
        </motion.div>
      </section>
    </>
  )
}
