'use client'

import { motion } from 'framer-motion'

const sponsors = [
  { name: 'Creamfields', logo: '🎪', tier: 'gold' },
  { name: 'Viña del Mar', logo: '🏖️', tier: 'gold' },
  { name: 'Maceo Plex', logo: '🎧', tier: 'silver' },
  { name: 'Adam Beyer', logo: '🎵', tier: 'silver' },
  { name: 'El Bomba', logo: '💣', tier: 'bronze' },
  { name: 'After Events', logo: '🌙', tier: 'bronze' }
]

export function Sponsors() {
  return (
    <section className="section-padding bg-black">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Nuestros <span className="text-pink-400">Patrocinadores</span>
          </h2>
          <p className="text-xl text-gray-300">
            Gracias a quienes hacen posible esta noche mágica
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {sponsors.map((sponsor, index) => (
            <motion.div
              key={sponsor.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.1 }}
              className={`bg-gradient-to-br ${
                sponsor.tier === 'gold'
                  ? 'from-yellow-400/20 to-yellow-600/20 border-yellow-400/50'
                  : sponsor.tier === 'silver'
                  ? 'from-gray-400/20 to-gray-600/20 border-gray-400/50'
                  : 'from-orange-400/20 to-orange-600/20 border-orange-400/50'
              } border rounded-xl p-6 text-center hover:shadow-lg transition-all duration-300`}
            >
              <div className="text-4xl mb-3">{sponsor.logo}</div>
              <h3 className="text-white font-semibold text-sm">{sponsor.name}</h3>
              <div className={`text-xs mt-2 px-2 py-1 rounded-full ${
                sponsor.tier === 'gold'
                  ? 'bg-yellow-400/20 text-yellow-300'
                  : sponsor.tier === 'silver'
                  ? 'bg-gray-400/20 text-gray-300'
                  : 'bg-orange-400/20 text-orange-300'
              }`}>
                {sponsor.tier.toUpperCase()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}