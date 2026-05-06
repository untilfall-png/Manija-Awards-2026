'use client'

import { motion } from 'framer-motion'
import { Camera, Heart } from 'lucide-react'

const galleryItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    title: 'Creamfields 2025',
    likes: 245
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    title: 'After Viña del Mar',
    likes: 189
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&q=80',
    title: 'Maceo Plex Live',
    likes: 312
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
    title: 'Adam Beyer Set',
    likes: 198
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80',
    title: 'Fiesta Privada',
    likes: 267
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=80',
    title: 'Concierto Especial',
    likes: 156
  }
]

export function Gallery() {
  return (
    <section className="section-padding bg-gray-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Camera className="w-8 h-8 text-pink-400" />
            <h2 className="text-4xl font-bold text-white">Galería</h2>
          </div>
          <p className="text-xl text-gray-300">
            Momentos inolvidables de la temporada 2025
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="group relative overflow-hidden rounded-xl bg-gray-800"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-400" />
                  <span className="text-sm">{item.likes}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}