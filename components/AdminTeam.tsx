'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Users, X, Play, Sparkles } from 'lucide-react'

interface AdminTeamProps {
  onOpenModal?: () => void
}

export function AdminTeam({ onOpenModal }: AdminTeamProps) {
  const [showModal, setShowModal] = useState(false)

  const handleOpenModal = () => {
    setShowModal(true)
    if (onOpenModal) onOpenModal()
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Equipo Manija Awards 2026</h2>
        <p className="text-white/70">Conoce a las personas detrás de este evento</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="neon-card p-6 text-center group"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-pink/30 to-neon-purple/30 border-2 border-neon-pink/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-10 w-10 text-neon-pink" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-green/50 border-2 border-neon-green flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neon-green"></div>
            </div>
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-1">Director General</h3>
          <p className="text-white/70 text-sm mb-4">Organización & Producción</p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-neon-pink/20 text-neon-pink text-xs font-semibold">Líder</span>
            <span className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple text-xs font-semibold">Estratega</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="neon-card p-6 text-center group"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-cyan/30 to-neon-blue/30 border-2 border-neon-cyan/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-10 w-10 text-neon-cyan" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-green/50 border-2 border-neon-green flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neon-green"></div>
            </div>
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-1">Coordinador Técnico</h3>
          <p className="text-white/70 text-sm mb-4">Plataforma & Votaciones</p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-neon-cyan/20 text-neon-cyan text-xs font-semibold">Tech</span>
            <span className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-semibold">Dev</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="neon-card p-6 text-center group"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon-orange/30 to-neon-yellow/30 border-2 border-neon-orange/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Users className="h-10 w-10 text-neon-orange" />
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-neon-green/50 border-2 border-neon-green flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-neon-green"></div>
            </div>
          </div>
          <h3 className="text-xl font-display font-bold text-white mb-1">Diseñador Visual</h3>
          <p className="text-white/70 text-sm mb-4">UI/UX & Branding</p>
          <div className="flex justify-center gap-2">
            <span className="px-3 py-1 rounded-full bg-neon-orange/20 text-neon-orange text-xs font-semibold">Design</span>
            <span className="px-3 py-1 rounded-full bg-neon-yellow/20 text-neon-yellow text-xs font-semibold">Arte</span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-12 text-center"
      >
        <h3 className="text-2xl font-display font-bold text-white mb-6">Logo del Equipo</h3>
        <div className="max-w-md mx-auto">
          <div className="neon-card p-4 relative overflow-hidden group cursor-pointer" onClick={handleOpenModal}>
            <div className="absolute inset-0 border-2 border-neon-purple/50 rounded-2xl animate-spin-slow group-hover:border-neon-pink transition-colors duration-500"></div>
            <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-neon-cyan"></div>
            <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-cyan"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-neon-cyan"></div>
            <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-neon-cyan"></div>
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-neon-pink rounded-full animate-float"></div>
            <div className="absolute top-1/3 right-1/3 w-1.5 h-1.5 bg-neon-cyan rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-neon-purple rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
            <div className="relative z-10">
              <img src="/logo-descripcion.jpeg" alt="Logo equipo Manija Awards 2026" className="w-full h-auto rounded-lg" onError={(e) => { e.currentTarget.style.display = 'none' }} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl flex items-center justify-center">
              <div className="inline-flex items-center gap-2 text-neon-pink font-semibold">
                <Play className="h-6 w-6" />
                <span>Ampliar</span>
              </div>
            </div>
          </div>
          <p className="text-white/60 text-sm mt-4">Haz clic en la imagen para verla en tamaño completo</p>
        </div>
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative z-10 max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="neon-card p-6 relative overflow-hidden">
                <div className="absolute inset-0 border-4 border-transparent rounded-3xl animate-spin-slower">
                  <div className="absolute inset-0 rounded-3xl p-[4px] bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan blur-md"></div>
                </div>
                <div className="absolute -top-3 -left-3 w-6 h-6 border-t-4 border-l-4 border-neon-cyan rounded-tl-2xl"></div>
                <div className="absolute -top-3 -right-3 w-6 h-6 border-t-4 border-r-4 border-neon-cyan rounded-tr-2xl"></div>
                <div className="absolute -bottom-3 -left-3 w-6 h-6 border-b-4 border-l-4 border-neon-cyan rounded-bl-2xl"></div>
                <div className="absolute -bottom-3 -right-3 w-6 h-6 border-b-4 border-r-4 border-neon-cyan rounded-br-2xl"></div>
                <div className="absolute top-10 left-10 w-3 h-3 bg-neon-pink rounded-full animate-float"></div>
                <div className="absolute top-20 right-16 w-2 h-2 bg-neon-cyan rounded-full animate-float" style={{ animationDelay: '0.3s' }}></div>
                <div className="absolute bottom-20 left-16 w-2.5 h-2.5 bg-neon-purple rounded-full animate-float" style={{ animationDelay: '0.7s' }}></div>
                <div className="absolute top-32 right-24 w-1.5 h-1.5 bg-neon-orange rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-32 right-20 w-2 h-2 bg-neon-green rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
                <button onClick={handleCloseModal} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white/80 hover:text-white transition-all" aria-label="Cerrar">
                  <X className="h-6 w-6" />
                </button>
                <div className="relative z-10 text-center">
                  <h3 className="text-2xl font-display font-bold text-white mb-4 flex items-center justify-center gap-2">
                    <Sparkles className="h-6 w-6 text-neon-pink animate-pulse" />
                    Logo del Equipo - Manija Awards 2026
                    <Sparkles className="h-6 w-6 text-neon-pink animate-pulse" />
                  </h3>
                  <div className="max-w-2xl mx-auto">
                    <img src="/logo-descripcion.jpeg" alt="Logo equipo Manija Awards 2026" className="w-full h-auto rounded-2xl shadow-2xl shadow-neon-purple/30" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                  </div>
                  <p className="text-white/70 text-sm mt-4 max-w-md mx-auto">Presentación oficial del equipo detrás de los Manija Awards 2026. Un equipo comprometido con la excelencia y la innovación.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}