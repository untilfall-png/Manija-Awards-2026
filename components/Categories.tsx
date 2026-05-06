'use client'

import { motion } from 'framer-motion'

const categories = [
  { name: 'El más manija del año', icon: '🔥', nominees: 4 },
  { name: 'Mejor After del Año', icon: '🎉', nominees: 5 },
  { name: 'Leyenda del Dancefloor', icon: '💃', nominees: 3 },
  { name: 'DJ invisible', icon: '🎧', nominees: 4 },
  { name: 'Revival del Año', icon: '🚀', nominees: 1 },
  { name: 'Dupla Dinámica', icon: '🤝', nominees: 3 },
  { name: 'Mejor Outfit Raver', icon: '🧢', nominees: 4 },
  { name: 'Mejor Sticker', icon: '😂', nominees: 4 },
  { name: 'Mejor Actor/Actriz', icon: '🎭', nominees: 3 },
  { name: 'Mejor Canción', icon: '🎵', nominees: 3 },
  { name: 'Mejor Fotografía', icon: '📸', nominees: 3 },
  { name: 'Mejor Video', icon: '🎬', nominees: 3 },
  { name: 'Descubrimiento del Año', icon: '🌟', nominees: 3 },
  { name: 'Premio Especial Comunidad', icon: '🏆', nominees: 3 }
]

export function Categories() {
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
            Categorías de los <span className="text-pink-400">Premios</span>
          </h2>
          <p className="text-xl text-gray-300">
            14 categorías que celebran lo mejor del entretenimiento
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl p-6 hover:border-pink-500/50 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{category.name}</h3>
              <p className="text-gray-400">
                {category.nominees} {category.nominees === 1 ? 'nominado' : 'nominados'}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}