'use client'

import { motion } from 'framer-motion'
import { Trophy, Star } from 'lucide-react'

const winners = [
  { category: 'El más manija del año', winner: 'Por anunciar', icon: '🔥' },
  { category: 'Mejor After del Año', winner: 'Por anunciar', icon: '🎉' },
  { category: 'Leyenda del Dancefloor', winner: 'Por anunciar', icon: '💃' },
  { category: 'DJ invisible', winner: 'Por anunciar', icon: '🎧' },
  { category: 'Revival del Año', winner: 'Por anunciar', icon: '🚀' },
  { category: 'Dupla Dinámica', winner: 'Por anunciar', icon: '🤝' },
  { category: 'Mejor Outfit Raver', winner: 'Por anunciar', icon: '🧢' },
  { category: 'Mejor Sticker', winner: 'Por anunciar', icon: '😂' }
]

export function Winners() {
  return (
    <section className="section-padding bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="w-8 h-8 text-yellow-400" />
            <h2 className="text-4xl font-bold text-white">Ganadores 2026</h2>
            <Trophy className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-xl text-pink-100">
            Los premiados se anunciarán en la ceremonia del 15 de diciembre
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {winners.map((winner, index) => (
            <motion.div
              key={winner.category}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{winner.icon}</div>
              <h3 className="text-lg font-semibold text-white mb-2">{winner.category}</h3>
              <div className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" />
                <p className="text-yellow-200 font-medium">{winner.winner}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}