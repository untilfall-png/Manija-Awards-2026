'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { getCategories } from '@/lib/voting'
import { Vote, Category } from '@/lib/types'
import { Trophy, TrendingUp, Users, Award, Download } from 'lucide-react'
import { useDiplomaGenerator } from '@/hooks/useDiplomaGenerator'

// Carga diferida — solo se renderiza al hacer hover
const DiplomaDigital = dynamic(
  () => import('@/components/DiplomaDigital').then(m => ({ default: m.DiplomaDigital })),
  { ssr: false, loading: () => null }
)

interface CategoryResults {
  category: Category
  results: Array<{ nomineeId: string; nomineeName: string; votes: number; percentage: number }>
  totalVotes: number
}

/* ── Contador animado ── */
function AnimNum({ value, className = '' }: { value: number; className?: string }) {
  const prev  = useRef(value)
  const [disp, setDisp] = useState(value)

  useEffect(() => {
    if (value === prev.current) return
    const diff  = value - prev.current
    const steps = Math.min(Math.abs(diff), 24)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisp(Math.round(prev.current + (diff * i) / steps))
      if (i >= steps) { clearInterval(id); prev.current = value }
    }, 35)
    return () => clearInterval(id)
  }, [value])

  return <span className={className}>{disp}</span>
}

export function LiveResults() {
  const [categoryResults, setCategoryResults]   = useState<CategoryResults[]>([])
  const [categories, setCategories]             = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [totalVoters, setTotalVoters]           = useState(0)
  const [totalVotes, setTotalVotes]             = useState(0)
  const [isLoading, setIsLoading]               = useState(true)
  const [showDiplomaFor, setShowDiplomaFor]     = useState<{ categoryId: string; nomineeId: string } | null>(null)
  const categoriesRef = useRef<Category[]>([])

  const { generateDiplomaPDF, generateSpecialDiplomaPDF } = useDiplomaGenerator()

  const handleDownloadDiploma = useCallback(async (
    categoryName: string, nomineeName: string, votes: number, date: string
  ) => generateDiplomaPDF(nomineeName, categoryName, votes, date), [generateDiplomaPDF])

  const handleDownloadSpecialDiploma = useCallback(async (
    categoryName: string, winnerName: string, date: string
  ) => generateSpecialDiplomaPDF(winnerName, categoryName, date), [generateSpecialDiplomaPDF])

  /* ── Cargar categorías ── */
  useEffect(() => {
    let mounted = true
    getCategories()
      .then(f => {
        if (!mounted) return
        setCategories(f)
        categoriesRef.current = f
        setLoadingCategories(false)
      })
      .catch(err => {
        console.error(err)
        if (mounted) setLoadingCategories(false)
      })
    return () => { mounted = false }
  }, [])

  /* ── Listener votos — FIX race condition ──
     Carga inicial + realtime; categories se lee de la ref para evitar
     recrear el canal cuando cambian las categorías. */
  useEffect(() => {
    const buildResults = (votes: Vote[], cats: Category[]): CategoryResults[] =>
      cats.map(cat => {
        const catVotes = votes.filter(v => v.categoryId === cat.id)
        const counts: Record<string, number> = {}
        catVotes.forEach(v => { counts[v.nomineeId] = (counts[v.nomineeId] || 0) + 1 })
        const total = catVotes.length
        return {
          category: cat,
          totalVotes: total,
          results: cat.nominees
            .map(n => ({
              nomineeId: n.id,
              nomineeName: n.name,
              votes: counts[n.id] || 0,
              percentage: total > 0 ? ((counts[n.id] || 0) / total) * 100 : 0,
            }))
            .sort((a, b) => b.votes - a.votes),
        }
      })

    const rowToVote = (row: any): Vote => ({
      id: row.id,
      voterId: row.voter_id,
      categoryId: row.category_id,
      nomineeId: row.nominee_id,
      createdAt: new Date(row.created_at),
    })

    let lastVotes: Vote[] = []

    const refresh = () => {
      setTotalVoters(new Set(lastVotes.map(v => v.voterId)).size)
      setTotalVotes(lastVotes.length)
      if (categoriesRef.current.length > 0) {
        setCategoryResults(buildResults(lastVotes, categoriesRef.current))
      }
    }

    // Carga inicial
    void supabase.from('votes').select('id, voter_id, category_id, nominee_id, created_at')
      .then(({ data, error }) => {
        if (error) { console.error(error); setIsLoading(false); return }
        lastVotes = (data || []).map(rowToVote)
        refresh()
        setIsLoading(false)
      })

    // Realtime
    const ch = supabase.channel('liveresults-votes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votes' },
        payload => { lastVotes = [...lastVotes, rowToVote(payload.new as any)]; refresh() })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'votes' },
        payload => { lastVotes = lastVotes.filter(v => v.id !== (payload.old as any).id); refresh() })
      .subscribe()

    return () => { supabase.removeChannel(ch) }
  }, [])

  /* Cuando categorías cargan, recalcular con los últimos votos — sin crear listener nuevo */
  useEffect(() => {
    categoriesRef.current = categories
  }, [categories])

  /* ── Loading ── */
  if (isLoading || loadingCategories) {
    return (
      <section className="px-4 sm:px-6 py-10 sm:py-16 mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
            <span className="text-neon-pink font-semibold">Cargando resultados...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 mx-auto max-w-6xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/30">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-neon-purple" />
          </div>
          <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neon-purple font-bold">
            RESULTADOS EN TIEMPO REAL
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">Votación Live</h2>

        {/* Stats con AnimNum */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xs sm:max-w-2xl mx-auto">
          {[
            { icon: Users, val: totalVoters, label: 'Votantes',    color: 'text-neon-cyan' },
            { icon: Award, val: totalVotes,  label: 'Total Votos', color: 'text-neon-pink' },
            { icon: Trophy, val: categories.length, label: 'Categorías', color: 'text-neon-orange' },
            {
              icon: TrendingUp,
              val: totalVotes > 0 ? Math.round((totalVotes / (totalVoters * Math.max(categories.length, 1))) * 100) : 0,
              label: 'Participación', color: 'text-neon-green', suffix: '%',
            },
          ].map(({ icon: Icon, val, label, color, suffix = '' }) => (
            <div key={label} className="glass-card p-3 sm:p-4 text-center">
              <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color} mx-auto mb-1 sm:mb-2`} />
              <div className={`text-xl sm:text-2xl font-display font-bold ${color}`}>
                <AnimNum value={val} />{suffix}
              </div>
              <div className="text-[10px] sm:text-xs text-white/70 uppercase tracking-wider">{label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Resultados por categoría — solo categorías normales */}
      <div className="grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-2">
        {categoryResults.filter(cr => !cr.category.isSpecial).map((cr, idx) => (
          <motion.div
            key={cr.category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08, duration: 0.5 }}
            className="neon-card p-5 sm:p-6"
          >
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <div>
                <h3 className="text-lg sm:text-xl font-display font-bold text-white mb-0.5">{cr.category.name}</h3>
                <p className="text-white/70 text-xs sm:text-sm">
                  <AnimNum value={cr.totalVotes} /> votos · Categoría {cr.category.order}
                </p>
              </div>
              <span className="text-xl sm:text-2xl font-display font-bold text-neon-pink">#{cr.category.order}</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {cr.results.map((r, ri) => (
                <div key={r.nomineeId}>
                  <div className="flex items-center justify-between mb-1.5 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {ri === 0 && r.votes > 0 && <Trophy className="h-4 w-4 text-neon-orange flex-shrink-0" />}
                      <span className="font-semibold text-white text-sm sm:text-base truncate">{r.nomineeName}</span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <AnimNum value={r.votes} className="font-bold text-neon-cyan text-sm sm:text-base" />
                      <span className="text-white/60 text-xs ml-1">({r.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full"
                      animate={{ width: `${r.percentage}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {cr.totalVotes === 0 && (
              <div className="text-center py-6 sm:py-8 text-white/50">
                <Award className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="text-sm sm:text-base">Aún no hay votos</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* ── Categorías Especiales ── */}
      {categoryResults.some(cr => cr.category.isSpecial) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="mt-10 sm:mt-16"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 mb-4">
              <div className="p-2 sm:p-3 rounded-2xl bg-yellow-500/20 border border-yellow-500/30">
                <span className="text-yellow-400 text-xl sm:text-2xl leading-none">★</span>
              </div>
              <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-yellow-400 font-bold">
                CATEGORÍAS ESPECIALES
              </span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-display font-bold"
              style={{ background: 'linear-gradient(90deg,#FFD700,#FFC107,#FF8C00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Premiación Directa
            </h3>
            <p className="text-white/50 text-xs sm:text-sm mt-1">Reconocimientos especiales otorgados por la organización</p>
          </div>

          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {categoryResults.filter(cr => cr.category.isSpecial).map((cr, idx) => (
              <motion.div
                key={cr.category.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + idx * 0.1, duration: 0.5 }}
                className="relative rounded-2xl border border-yellow-500/40 bg-gradient-to-br from-yellow-950/40 via-amber-900/20 to-yellow-950/40 p-5 sm:p-6 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent" />
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'radial-gradient(ellipse at 50% 0%,rgba(255,215,0,0.07) 0%,transparent 70%)' }} />
                <div className="relative z-10">
                  <p className="text-[10px] text-yellow-500/60 uppercase tracking-[0.2em] font-bold mb-2">🏅 Reconocimiento Especial</p>
                  <h4 className="text-lg sm:text-xl font-display font-bold text-yellow-400 mb-4">{cr.category.name}</h4>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/20 mb-4">
                    <span className="text-2xl">🏆</span>
                    <div>
                      <p className="font-bold text-white text-base">{cr.category.directWinner || 'Por definir'}</p>
                      <p className="text-yellow-400/60 text-xs">Ganador/a</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownloadSpecialDiploma(cr.category.name, cr.category.directWinner || '', new Date().toLocaleDateString('es-ES'))}
                    disabled={!cr.category.directWinner}
                    className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-amber-600 text-black font-bold text-xs flex items-center justify-center gap-1.5 hover:from-yellow-400 hover:to-amber-500 transition-all shadow-lg shadow-yellow-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Descargar Diploma Especial
                  </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-600/40 to-transparent" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Diplomas section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="mt-10 sm:mt-16"
      >
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="p-2 sm:p-3 rounded-2xl bg-neon-orange/20 border border-neon-orange/30">
              <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-neon-orange" />
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neon-orange font-bold">
              GANADORES & DIPLOMAS
            </span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">Ganadores por Categoría</h3>
          <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2">Descarga el diploma oficial</p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categoryResults.filter(cr => !cr.category.isSpecial).map((cr, idx) => {
            const winner = cr.results[0]
            const hasVotes = winner && winner.votes > 0
            return (
              <motion.div
                key={cr.category.id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + idx * 0.05, duration: 0.4 }}
                className={`neon-card p-5 sm:p-6 text-center group transition-all duration-300 ${hasVotes ? 'hover:scale-[1.02] cursor-default' : 'opacity-50'}`}
                onMouseEnter={() => hasVotes && setShowDiplomaFor({ categoryId: cr.category.id, nomineeId: winner.nomineeId })}
                onMouseLeave={() => setShowDiplomaFor(null)}
              >
                {!hasVotes ? (
                  <>
                    <Trophy className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-white/30" />
                    <h4 className="text-base sm:text-lg font-semibold text-white/60 mb-1 sm:mb-2">{cr.category.name}</h4>
                    <p className="text-white/40 text-xs sm:text-sm">Sin votos aún</p>
                  </>
                ) : (
                  <>
                    <div className="relative min-h-[160px] sm:min-h-[180px] mb-3 sm:mb-4">
                      {showDiplomaFor?.categoryId === cr.category.id ? (
                        <div className="absolute inset-0 -top-8 -left-4 -right-4 transform scale-75 origin-top">
                          <DiplomaDigital
                            winnerName={winner.nomineeName}
                            categoryName={cr.category.name}
                            votes={winner.votes}
                            date={new Date().toLocaleDateString('es-ES')}
                          />
                        </div>
                      ) : (
                        <>
                          <div className="text-4xl sm:text-5xl mb-2 sm:mb-3">🏆</div>
                          <p className="font-semibold text-white text-sm sm:text-base truncate">{winner.nomineeName}</p>
                          <p className="text-white/60 text-xs sm:text-sm mb-1 sm:mb-2">{cr.category.name}</p>
                          <div className="flex items-center justify-center gap-1.5 text-neon-cyan">
                            <AnimNum value={winner.votes} className="text-xl sm:text-2xl font-bold" />
                            <span className="text-xs sm:text-sm">votos</span>
                          </div>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => handleDownloadDiploma(cr.category.name, winner.nomineeName, winner.votes, new Date().toLocaleDateString('es-ES'))}
                      className="w-full px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-yellow-500/30 text-xs sm:text-sm"
                    >
                      <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Descargar Diploma
                    </button>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}
