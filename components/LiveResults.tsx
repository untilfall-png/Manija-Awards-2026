'use client'

import { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getCategories } from '@/lib/voting'
import { Vote, Category } from '@/lib/types'
import { Trophy, TrendingUp, Users, Award, Download } from 'lucide-react'
import { useDiplomaGenerator } from '@/hooks/useDiplomaGenerator'

// Carga diferida: el canvas del diploma solo se renderiza al hacer hover
const DiplomaDigital = dynamic(
  () => import('@/components/DiplomaDigital').then(m => ({ default: m.DiplomaDigital })),
  { ssr: false, loading: () => null }
)

interface CategoryResults {
  category: Category
  results: Array<{
    nomineeId: string
    nomineeName: string
    votes: number
    percentage: number
  }>
  totalVotes: number
}

export function LiveResults() {
  const [categoryResults, setCategoryResults] = useState<CategoryResults[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categoryLoadError, setCategoryLoadError] = useState<string | null>(null)
  const [totalVoters, setTotalVoters] = useState(0)
  const [totalVotes, setTotalVotes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [showDiplomaFor, setShowDiplomaFor] = useState<{categoryId: string, nomineeId: string} | null>(null)

  const { generateDiplomaPDF } = useDiplomaGenerator()

  const handleDownloadDiploma = useCallback(async (categoryName: string, nomineeName: string, votes: number, date: string) => {
    await generateDiplomaPDF(nomineeName, categoryName, votes, date)
  }, [generateDiplomaPDF])

  useEffect(() => {
    let isMounted = true

    getCategories()
      .then((fetched) => {
        if (!isMounted) return
        setCategories(fetched)
      })
      .catch((err) => {
        console.error('Error loading categories:', err)
        setCategoryLoadError('No se pudieron cargar las categorías')
      })
      .finally(() => {
        if (isMounted) setLoadingCategories(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'votes'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const votes: Vote[] = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            voterId: data.voterId,
            categoryId: data.categoryId,
            nomineeId: data.nomineeId,
            createdAt: data.createdAt?.toDate() || new Date(),
          }
        })

        // Get unique voters
        const uniqueVoters = new Set(votes.map(vote => vote.voterId))
        setTotalVoters(uniqueVoters.size)
        setTotalVotes(votes.length)

        // Calculate results for each category
        const results: CategoryResults[] = categories.map(category => {
          const categoryVotes = votes.filter(vote => vote.categoryId === category.id)
          const voteCount: { [key: string]: number } = {}

          categoryVotes.forEach(vote => {
            voteCount[vote.nomineeId] = (voteCount[vote.nomineeId] || 0) + 1
          })

          const totalCategoryVotes = categoryVotes.length
          const resultsArray = category.nominees.map(nominee => ({
            nomineeId: nominee.id,
            nomineeName: nominee.name,
            votes: voteCount[nominee.id] || 0,
            percentage: totalCategoryVotes > 0 ? ((voteCount[nominee.id] || 0) / totalCategoryVotes) * 100 : 0,
          })).sort((a, b) => b.votes - a.votes)

          return {
            category,
            results: resultsArray,
            totalVotes: totalCategoryVotes,
          }
        })

        setCategoryResults(results)
        setIsLoading(false)
      },
      (error) => {
        console.error('Error listening to votes:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  if (isLoading || loadingCategories) {
    return (
      <section className="section-padding mx-auto max-w-6xl">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin"></div>
            <span className="text-neon-pink font-semibold">Cargando resultados...</span>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="px-4 sm:px-6 py-10 sm:py-16 mx-auto max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <div className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/30">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-neon-purple" />
          </div>
          <span className="text-xs sm:text-sm uppercase tracking-[0.2em] sm:tracking-[0.3em] text-neon-purple font-bold">
            RESULTADOS EN TIEMPO REAL
          </span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
          Votación Live
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-xs sm:max-w-2xl mx-auto">
          <div className="glass-card p-4 text-center">
            <Users className="h-6 w-6 text-neon-cyan mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-neon-cyan">{totalVoters}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Votantes</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Award className="h-6 w-6 text-neon-pink mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-neon-pink">{totalVotes}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Total Votos</div>
          </div>
          <div className="glass-card p-4 text-center">
            <Trophy className="h-6 w-6 text-neon-orange mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-neon-orange">{categories.length}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Categorías</div>
          </div>
          <div className="glass-card p-4 text-center">
            <TrendingUp className="h-6 w-6 text-neon-green mx-auto mb-2" />
            <div className="text-2xl font-display font-bold text-neon-green">
              {totalVotes > 0 ? Math.round((totalVotes / (totalVoters * categories.length)) * 100) : 0}%
            </div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Participación</div>
          </div>
        </div>
      </motion.div>

      {/* Category Results */}
      <div className="grid gap-5 sm:gap-8 grid-cols-1 sm:grid-cols-2">
        {categoryResults.map((categoryResult, index) => (
          <motion.div
            key={categoryResult.category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="neon-card p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-white mb-1">
                  {categoryResult.category.name}
                </h3>
                <p className="text-white/70 text-sm">
                  {categoryResult.totalVotes} votos • Categoría {categoryResult.category.order}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-display font-bold text-neon-pink">
                  #{categoryResult.category.order}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {categoryResult.results.map((result, resultIndex) => (
                <motion.div
                  key={result.nomineeId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: resultIndex * 0.1 }}
                  className="relative"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {resultIndex === 0 && result.votes > 0 && (
                        <Trophy className="h-5 w-5 text-neon-orange" />
                      )}
                      <span className="font-semibold text-white">
                        {result.nomineeName}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neon-cyan">{result.votes}</span>
                      <span className="text-white/60 text-sm ml-1">
                        ({result.percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-black/30 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${result.percentage}%` }}
                      transition={{ duration: 1, delay: 0.5 + resultIndex * 0.1 }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            {categoryResult.totalVotes === 0 && (
              <div className="text-center py-8 text-white/50">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Aún no hay votos en esta categoría</p>
              </div>
             )}
          </motion.div>
        ))}
      </div>

      {/* Winner Diplomas Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
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
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Ganadores por Categoría
          </h3>
          <p className="text-white/70 text-xs sm:text-sm mt-1 sm:mt-2">
            Descarga el diploma oficial de cada categoría
          </p>
        </div>

        <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categoryResults.map((categoryResult, index) => {
            const winner = categoryResult.results[0]
            if (!winner || winner.votes === 0) {
              return (
                <motion.div
                  key={categoryResult.category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 + index * 0.05 }}
                  className="neon-card p-6 text-center opacity-50"
                >
                  <Trophy className="h-12 w-12 mx-auto mb-4 text-white/30" />
                  <h4 className="text-lg font-semibold text-white/60 mb-2">
                    {categoryResult.category.name}
                  </h4>
                  <p className="text-white/40 text-sm">Sin votos aún</p>
                </motion.div>
              )
            }
            return (
              <motion.div
                key={categoryResult.category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.3 + index * 0.05 }}
                className="neon-card p-6 text-center group hover:scale-[1.02] transition-all duration-300"
                onMouseEnter={() => setShowDiplomaFor({categoryId: categoryResult.category.id, nomineeId: winner.nomineeId})}
                onMouseLeave={() => setShowDiplomaFor(null)}
              >
                <div className="relative min-h-[180px] mb-4">
                  {showDiplomaFor?.categoryId === categoryResult.category.id && showDiplomaFor?.nomineeId === winner.nomineeId ? (
                    <div className="absolute inset-0 -top-8 -left-4 -right-4 transform scale-75 origin-top">
                      <DiplomaDigital
                        winnerName={winner.nomineeName}
                        categoryName={categoryResult.category.name}
                        votes={winner.votes}
                        date={new Date().toLocaleDateString('es-ES')}
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-5xl mb-3">🏆</div>
                      <p className="font-semibold text-white truncate">{winner.nomineeName}</p>
                      <p className="text-white/60 text-sm mb-2">{categoryResult.category.name}</p>
                      <div className="flex items-center justify-center gap-2 text-neon-cyan">
                        <span className="text-2xl font-bold">{winner.votes}</span>
                        <span className="text-sm">votos</span>
                      </div>
                    </>
                  )}
                </div>
                <button
                  onClick={() => handleDownloadDiploma(
                    categoryResult.category.name,
                    winner.nomineeName,
                    winner.votes,
                    new Date().toLocaleDateString('es-ES')
                  )}
                  className="w-full px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-yellow-500/30"
                >
                  <Download className="h-4 w-4" />
                  Descargar Diploma
                </button>
              </motion.div>
            )
          })}
        </div>
      </motion.div>
    </section>
  )
}