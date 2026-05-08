'use client'

import { useState, useEffect, useRef } from 'react'
import { collection, onSnapshot, QuerySnapshot, DocumentData, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getCategories } from '@/lib/voting'
import { Category, Vote } from '@/lib/types'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, Zap, Sparkles } from 'lucide-react'

interface NomineeResult {
  nomineeId: string
  nomineeName: string
  nomineeDesc?: string
  votes: number
  pct: number
  isLeader: boolean
}

interface CatResult {
  category: Category
  results: NomineeResult[]
  totalVotes: number
}

/* ── Componente contador animado ── */
function AnimNum({ value, className = '' }: { value: number; className?: string }) {
  const prev = useRef(value)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    if (value === prev.current) return
    const diff = value - prev.current
    const steps = Math.min(Math.abs(diff), 20)
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplay(Math.round(prev.current + (diff * i) / steps))
      if (i >= steps) { clearInterval(id); prev.current = value }
    }, 40)
    return () => clearInterval(id)
  }, [value])

  return <span className={className}>{display}</span>
}

export default function LivePage() {
  const [catResults, setCatResults]   = useState<CatResult[]>([])
  const [categories, setCategories]   = useState<Category[]>([])
  const [totalVoters, setTotalVoters] = useState(0)
  const [totalVotes, setTotalVotes]   = useState(0)
  const [votingOpen, setVotingOpen]   = useState(true)
  const [now, setNow]                 = useState(new Date())

  // Reloj
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  // Cargar categorías
  useEffect(() => {
    getCategories().then(setCategories).catch(console.error)
  }, [])

  // Listener votación abierta/cerrada
  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'system_config', 'system_config'), snap => {
      if (snap.exists()) setVotingOpen(snap.data().votingEnabled ?? true)
    }, console.error)
    return unsub
  }, [])

  // Listener votos en tiempo real
  useEffect(() => {
    if (!categories.length) return
    const unsub = onSnapshot(collection(db, 'votes'), (snap: QuerySnapshot<DocumentData>) => {
      const votes: Vote[] = snap.docs.map(d => ({
        id: d.id,
        voterId: d.data().voterId,
        categoryId: d.data().categoryId,
        nomineeId: d.data().nomineeId,
        createdAt: d.data().createdAt?.toDate() || new Date(),
      }))

      setTotalVoters(new Set(votes.map(v => v.voterId)).size)
      setTotalVotes(votes.length)

      const results: CatResult[] = categories.map(cat => {
        const catVotes = votes.filter(v => v.categoryId === cat.id)
        const total    = catVotes.length
        const counts: Record<string, number> = {}
        catVotes.forEach(v => { counts[v.nomineeId] = (counts[v.nomineeId] || 0) + 1 })

        const sorted = cat.nominees
          .map(n => ({
            nomineeId: n.id,
            nomineeName: n.name,
            nomineeDesc: n.description,
            votes: counts[n.id] || 0,
            pct: total > 0 ? ((counts[n.id] || 0) / total) * 100 : 0,
            isLeader: false,
          }))
          .sort((a, b) => b.votes - a.votes)

        if (sorted[0]?.votes > 0) sorted[0].isLeader = true
        return { category: cat, results: sorted, totalVotes: total }
      })

      setCatResults(results)
    }, console.error)
    return unsub
  }, [categories])

  const timeStr = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  const dateStr = now.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Fondo animado */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#090417] to-black" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-neon-purple/8 rounded-full blur-3xl animate-pulse-neon" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-pink/8 rounded-full blur-3xl animate-float" />
      </div>

      {/* ── HEADER ── */}
      <header className="relative z-10 border-b border-neon-pink/20 bg-black/70 backdrop-blur-xl px-6 lg:px-12 py-4">
        <div className="max-w-[1800px] mx-auto flex items-center justify-between gap-4">
          {/* Logo + título */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-neon-pink/30 rounded-full blur-md animate-pulse-neon" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpeg" alt="Manija" className="relative w-12 h-12 lg:w-16 lg:h-16 rounded-full border-2 border-neon-purple/60 object-contain bg-black" />
            </div>
            <div>
              <p className="text-[10px] sm:text-xs text-neon-pink font-bold tracking-[0.3em] uppercase">EN VIVO</p>
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-display font-bold text-white leading-none">
                MANIJA AWARDS <span className="text-neon-pink">2026</span>
              </h1>
            </div>
          </div>

          {/* Stats centro */}
          <div className="hidden md:flex items-center gap-6">
            <div className="text-center">
              <AnimNum value={totalVoters} className="text-3xl lg:text-4xl font-display font-bold text-neon-cyan" />
              <p className="text-xs text-white/50 uppercase tracking-wider mt-0.5">Votantes</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <AnimNum value={totalVotes} className="text-3xl lg:text-4xl font-display font-bold text-neon-pink" />
              <p className="text-xs text-white/50 uppercase tracking-wider mt-0.5">Votos</p>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <span className="text-3xl lg:text-4xl font-display font-bold text-neon-purple">{catResults.length}</span>
              <p className="text-xs text-white/50 uppercase tracking-wider mt-0.5">Categorías</p>
            </div>
          </div>

          {/* Reloj + estado */}
          <div className="text-right">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold tracking-widest uppercase mb-1 ${
              votingOpen
                ? 'border-green-500/40 bg-green-500/10 text-green-400'
                : 'border-red-500/40 bg-red-500/10 text-red-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${votingOpen ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              {votingOpen ? 'Votación abierta' : 'Votación cerrada'}
            </div>
            <p className="text-2xl lg:text-3xl font-mono font-bold text-white/80">{timeStr}</p>
            <p className="text-white/30 text-xs capitalize">{dateStr}</p>
          </div>
        </div>
      </header>

      {/* ── CATEGORÍAS ── */}
      <main className="relative z-10 max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-10">
        {catResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin mb-6" />
            <p className="text-white/50 text-lg">Cargando resultados en tiempo real...</p>
          </div>
        ) : (
          <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {catResults.map((cr, ci) => (
              <motion.div
                key={cr.category.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: ci * 0.06, duration: 0.5 }}
                className="relative rounded-2xl border border-white/10 bg-white/3 backdrop-blur-sm overflow-hidden"
              >
                {/* Accent line top */}
                <div className="h-px bg-gradient-to-r from-transparent via-neon-pink/60 to-transparent" />

                <div className="p-4 lg:p-5">
                  {/* Cabecera categoría */}
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div>
                      <p className="text-[10px] text-neon-pink font-bold tracking-[0.25em] uppercase">
                        Categoría {cr.category.order}
                      </p>
                      <h2 className="text-base lg:text-lg font-display font-bold text-white leading-tight">
                        {cr.category.name}
                      </h2>
                    </div>
                    <span className="text-xs text-white/40 whitespace-nowrap mt-1">
                      {cr.totalVotes} {cr.totalVotes === 1 ? 'voto' : 'votos'}
                    </span>
                  </div>

                  {/* Nominados */}
                  <div className="space-y-3">
                    {cr.results.map((r, ri) => (
                      <div key={r.nomineeId}>
                        <div className="flex items-center justify-between mb-1 gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {r.isLeader && cr.totalVotes > 0 && (
                              <Trophy className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
                            )}
                            <span className={`text-sm font-semibold truncate ${r.isLeader && cr.totalVotes > 0 ? 'text-white' : 'text-white/70'}`}>
                              {r.nomineeName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <AnimNum value={r.votes} className={`text-sm font-bold ${r.isLeader && cr.totalVotes > 0 ? 'text-neon-cyan' : 'text-white/50'}`} />
                            <span className="text-white/30 text-xs">({r.pct.toFixed(0)}%)</span>
                          </div>
                        </div>

                        {/* Barra */}
                        <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${r.isLeader && cr.totalVotes > 0
                              ? 'bg-gradient-to-r from-neon-pink to-neon-purple shadow-[0_0_8px_rgba(255,46,219,0.6)]'
                              : 'bg-white/20'}`}
                            animate={{ width: `${r.pct}%` }}
                            transition={{ duration: 0.7, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    ))}

                    {cr.totalVotes === 0 && (
                      <p className="text-white/30 text-xs text-center py-2">Sin votos aún</p>
                    )}
                  </div>

                  {/* Winner badge */}
                  <AnimatePresence>
                    {cr.results[0]?.isLeader && cr.totalVotes > 0 && (
                      <motion.div
                        key="winner"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-yellow-500/10 border border-yellow-500/30"
                      >
                        <Trophy className="h-3.5 w-3.5 text-yellow-400 flex-shrink-0" />
                        <span className="text-yellow-300 text-xs font-bold truncate">
                          Va ganando: {cr.results[0].nomineeName}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Accent line bottom */}
                <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* ── FOOTER LIVE ── */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-4 text-center">
        <p className="text-white/20 text-xs tracking-widest uppercase">
          <Sparkles className="inline h-3 w-3 mr-1" />
          manija awards 2026 · resultados en tiempo real
          <Sparkles className="inline h-3 w-3 ml-1" />
        </p>
      </footer>

      {/* Partículas decorativas fijas */}
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
        {[['5%','15%'],['92%','8%'],['15%','85%'],['88%','78%'],['50%','5%'],['3%','50%'],['97%','45%'],['45%','95%']].map(([l,t],i) => (
          <div key={i} className="absolute w-1 h-1 bg-neon-pink/40 rounded-full animate-pulse-neon"
            style={{ left: l, top: t, animationDelay: `${i * 0.3}s` }} />
        ))}
      </div>
    </div>
  )
}
