'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, PieChart } from 'lucide-react'
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getCategories } from '@/lib/voting'
import { Category, Vote } from '@/lib/types'

export function AdminCharts() {
  const [categories, setCategories] = useState<Category[]>([])
  const [votes, setVotes] = useState<Vote[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()
  }, [])

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'votes'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const votesData: Vote[] = snapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            voterId: data.voterId,
            categoryId: data.categoryId,
            nomineeId: data.nomineeId,
            createdAt: data.createdAt?.toDate() || new Date(),
          }
        })
        setVotes(votesData)
        setLoading(false)
      },
      (error) => {
        console.error('Error loading votes:', error)
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink">Cargando gráficos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-white">Gráficos Dinámicos</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => {
          const categoryVotes = votes.filter(v => v.categoryId === category.id)
          const votesByNominee: { [key: string]: number } = {}

          categoryVotes.forEach(vote => {
            votesByNominee[vote.nomineeId] = (votesByNominee[vote.nomineeId] || 0) + 1
          })

          const totalVotes = categoryVotes.length
          const nominees = category.nominees || []

          const chartData = nominees.map(nominee => ({
            name: nominee.name,
            votes: votesByNominee[nominee.id] || 0,
            percentage: totalVotes > 0 ? ((votesByNominee[nominee.id] || 0) / totalVotes) * 100 : 0,
          })).sort((a, b) => b.votes - a.votes)

          const maxVotes = Math.max(...chartData.map(d => d.votes), 1)

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="neon-card p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-neon-pink/20 border border-neon-pink/30">
                  <BarChart3 className="h-5 w-5 text-neon-pink" />
                </div>
                <h3 className="text-xl font-display font-bold text-white">
                  {category.name}
                </h3>
              </div>

              <div className="space-y-4">
                {chartData.map((data, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-white">{data.name}</span>
                      <div className="text-right">
                        <span className="font-bold text-neon-cyan">{data.votes}</span>
                        <span className="text-white/60 text-sm ml-2">({data.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>

                    <div className="w-full bg-black/30 rounded-full h-3 overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-neon-pink to-neon-purple rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${(data.votes / maxVotes) * 100}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </div>
                ))}

                <div className="mt-6 pt-4 border-t border-white/10">
                  <p className="text-white/70 text-sm text-center">
                    Total de votos en esta categoría: <span className="font-bold text-neon-pink">{totalVotes}</span>
                  </p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="neon-card p-8"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-neon-purple/20 border border-neon-purple/30">
            <TrendingUp className="h-5 w-5 text-neon-purple" />
          </div>
          <h3 className="text-xl font-display font-bold text-white">Resumen General</h3>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-pink mb-2">{categories.length}</div>
            <p className="text-white/70 text-sm">Categorías Activas</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-cyan mb-2">{votes.length}</div>
            <p className="text-white/70 text-sm">Total de Votos</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-display font-bold text-neon-orange mb-2">
              {new Set(votes.map(v => v.voterId)).size}
            </div>
            <p className="text-white/70 text-sm">Votantes Únicos</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
