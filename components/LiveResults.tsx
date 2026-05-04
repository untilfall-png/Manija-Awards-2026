'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { collection, onSnapshot, QuerySnapshot, DocumentData } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface VoteResult {
  name: string
  votes: number
}

export function LiveResults() {
  const [results, setResults] = useState<VoteResult[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'votos'),
      (snapshot: QuerySnapshot<DocumentData>) => {
        const voteCount: { [key: string]: number } = {}

        snapshot.forEach((doc) => {
          const data = doc.data()
          Object.keys(data).forEach((key) => {
            if (key.startsWith('q') && data[key]) {
              const nominee = data[key] as string
              voteCount[nominee] = (voteCount[nominee] || 0) + 1
            }
          })
        })

        const sortedResults: VoteResult[] = Object.entries(voteCount)
          .map(([name, votes]) => ({ name, votes }))
          .sort((a, b) => b.votes - a.votes)

        setResults(sortedResults)
        setTotalVotes(snapshot.size)
        setIsLoading(false)
      },
      (error) => {
        console.error('Error listening to votes:', error)
        setIsLoading(false)
      }
    )

    return () => unsubscribe()
  }, [])

  const maxVotes = results.length > 0 ? results[0].votes : 1

  return (
    <section className="section-padding mx-auto max-w-6xl">
      <div className="rounded-[32px] border border-[#7c3aed]/30 bg-[#090417]/90 p-10 shadow-[0_0_80px_rgba(124,58,237,0.2)]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Resultados en <span className="text-[#ff2edf]">Vivo</span>
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:items-center text-xl text-[#b8b5ff]">
            <span>Total de votos: <strong className="text-[#ff2edf]">{totalVotes}</strong></span>
            <span className="text-sm uppercase tracking-[0.22em] text-[#a79cff]">Actualizado en tiempo real</span>
          </div>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#ff2edf]" />
            <p className="mt-4 text-[#c8c8ff]">Cargando resultados...</p>
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#c8c8ff] text-xl">Aún no hay votos registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, index) => {
              const percentage = (result.votes / maxVotes) * 100
              const barWidth = Math.max(percentage, 8)

              return (
                <motion.div
                  key={result.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[28px] border border-[#7c3aed]/20 bg-[#0b0412] p-5 shadow-[0_0_30px_rgba(124,58,237,0.16)]"
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅'}</span>
                      <span className="text-white text-lg font-semibold">{result.name}</span>
                    </div>
                    <span className="text-sm text-[#c8c8ff]">{result.votes} votos</span>
                  </div>
                  <div className="h-4 w-full overflow-hidden rounded-full bg-[#1f1136]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-[#ff2edf] via-[#7c3aed] to-[#ff6a00]"
                    />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-10 text-center text-sm text-[#9a94ff]"
        >
          <p>Los resultados se actualizan en tiempo real • Última actualización: {new Date().toLocaleTimeString()}</p>
        </motion.div>
      </div>
    </section>
  )
}