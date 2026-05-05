'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getCategories } from '@/lib/voting'
import { Vote, Category } from '@/lib/types'
import { Trophy, TrendingUp, Users, Award } from 'lucide-react'

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
    <section className="section-padding mx-auto max-w-6xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/30">
            <TrendingUp className="h-8 w-8 text-neon-purple" />
          </div>
          <span className="text-sm uppercase tracking-[0.3em] text-neon-purple font-bold">
            RESULTADOS EN TIEMPO REAL
          </span>
        </div>

        <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">
          Votación Live
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
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
      <div className="grid gap-8 md:grid-cols-2">
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

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="text-center mt-12 text-white/60 text-sm"
      >
        <p>Los resultados se actualizan en tiempo real • Cada votante puede votar una vez por categoría</p>
      </motion.div>
    </section>
  )
}