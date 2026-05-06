'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Users, FileVideo, Download, Play, Pause, RefreshCw } from 'lucide-react'
import { useDiplomaGenerator } from '@/hooks/useDiplomaGenerator'

interface Ganador {
  categoria: string
  ganador: string
  votos: number
}

interface ConclusionData {
  ganadores: Ganador[]
  totalVotantes: number
  totalVotos: number
  masVotado: {
    nombre: string
    votos: number
    categoria: string
  }
}

export function AdminConclusionVideo() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [conclusionData, setConclusionData] = useState<ConclusionData | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const { generateDiplomaPDF, generateAllDiplomas } = useDiplomaGenerator()

  // Simula obtener datos de Firestore
  const cargarDatosConclusion = useCallback(async () => {
    // En producción, esto vendría de Firestore
    const data: ConclusionData = {
      ganadores: [
        { categoria: 'Mejor Director', ganador: 'Director A', votos: 342 },
        { categoria: 'Mejor Actor', ganador: 'Actor X', votos: 289 },
        { categoria: 'Mejor Actriz', ganador: 'Actriz M', votos: 356 },
        { categoria: 'Mejor Película', ganador: 'Accion Total', votos: 423 }
      ],
      totalVotantes: 156,
      totalVotos: 1245,
      masVotado: {
        nombre: 'Accion Total',
        votos: 423,
        categoria: 'Mejor Película'
      }
    }
    setConclusionData(data)
  }, [])

  useEffect(() => {
    cargarDatosConclusion()
  }, [cargarDatosConclusion])

  // Animación del video
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isPlaying && conclusionData) {
      interval = setInterval(() => {
        setCurrentFrame(prev => {
          if (prev >= 299) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 33) // ~30fps
    }
    return () => clearInterval(interval)
  }, [isPlaying, conclusionData])

  const generarVideo = async () => {
    setIsGenerating(true)
    await cargarDatosConclusion()
    setIsGenerating(false)
    setCurrentFrame(0)
    setIsPlaying(true)
  }

  const descargarVideo = async () => {
    // En producción, llamaría a API para renderizar con hyperframes
    alert('En producción: Renderizando video con Hyperframes...\n\nFormato: MP4 1920x1080 30fps\nDuración: 10 segundos\nEstilo: Neón épico con láseres')
  }

  const descargarDiplomas = async () => {
    if (!conclusionData) return
    await generateAllDiplomas(
      conclusionData.ganadores.map(g => ({
        categoryName: g.categoria,
        winnerName: g.ganador,
        votes: g.votos,
        date: new Date().toLocaleDateString('es-ES')
      }))
    )
  }

  const reiniciarVotacion = async () => {
    if (!window.confirm('⚠️ REINICIO NUCLEAR\n\n¿Estás seguro de reiniciar TODO?\n- Votos\n- Votantes\n- Categorías\n\nEsto es IRREVERSIBLE.')) {
      return
    }
    if (!window.confirm('Confirma escribiendo "BORRAR TODO"')) {
      return
    }
    alert('Función de reinicio nuclear activada (ver AdminMaintenance)')
  }

  if (!conclusionData) {
    return (
      <div className="neon-card p-8 text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink font-semibold">Cargando datos...</span>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Controles */}
      <div className="neon-card p-6 border-2 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <FileVideo className="h-8 w-8 text-yellow-400" />
            <div>
              <h3 className="text-xl font-display font-bold text-yellow-400">Video de Conclusión</h3>
              <p className="text-yellow-400/70 text-sm">Presentación épica de resultados</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={generarVideo}
              disabled={isGenerating}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <><RefreshCw className="h-4 w-4 animate-spin" />Generando...</>
              ) : (
                <><Play className="h-4 w-4" />Generar Video</>
              )}
            </button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              disabled={!conclusionData}
              className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-all disabled:opacity-30"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>
            <button
              onClick={descargarVideo}
              className="p-2 rounded-lg bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/30 transition-all"
              title="Descargar MP4 (requiere hyperframes)"
            >
              <Download className="h-5 w-5" />
            </button>
            <button
              onClick={descargarDiplomas}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold hover:from-pink-400 hover:to-purple-400 transition-all flex items-center gap-2"
            >
              <Trophy className="h-4 w-4" />
              Diplomas
            </button>
          </div>
        </div>
      </div>

      {/* Preview del Video */}
      <div className="neon-card overflow-hidden">
        <div className="bg-black rounded-lg overflow-hidden" style={{ width: '100%', aspectRatio: '16/9', maxHeight: '540px' }}>
          <div className="relative w-full h-full" style={{ background: 'radial-gradient(ellipse at center, #1a0a2e 0%, #000000 100%)' }}>
            {/* Efectos láser */}
            <motion.div
              className="absolute top-0 w-1 h-full"
              style={{ background: 'linear-gradient(to bottom, transparent, #ff00ff, #00ffff, transparent)', boxShadow: '0 0 20px #ff00ff' }}
              animate={{ x: [(currentFrame * 3) % 100, ((currentFrame + 1) * 3) % 100] }}
              transition={{ duration: 0.033 }}
            />
            <motion.div
              className="absolute top-0 right-0 w-1 h-full"
              style={{ background: 'linear-gradient(to bottom, transparent, #00ff88, #ff00ff, transparent)', boxShadow: '0 0 15px #00ff88' }}
              animate={{ x: [-(currentFrame * 2) % 100, -((currentFrame + 1) * 2) % 100] }}
              transition={{ duration: 0.033 }}
            />

            <AnimatePresence mode="wait">
              {/* Título Principal (frames 0-60) */}
              {currentFrame < 60 && (
                <motion.div
                  key="title"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: currentFrame / 30, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <motion.h1
                    className="text-4xl md:text-6xl font-bold mb-4"
                    style={{
                      background: 'linear-gradient(90deg, #ff00ff, #00ffff, #ffff00)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      color: 'transparent',
                      textShadow: '0 0 40px rgba(255,0,255,0.8)'
                    }}
                  >
                    🏆 MANIJA AWARDS 2026 🏆
                  </motion.h1>
                  <p className="text-xl md:text-2xl text-white/90">
                    🌟 CONCLUSIÓN DE LA VOTACIÓN 🌟
                  </p>
                </motion.div>
              )}

              {/* Campeón Absoluto (frames 60-150) */}
              {currentFrame >= 60 && currentFrame < 150 && (
                <motion.div
                  key="champion"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-6xl mb-4"
                  >
                    ⚡
                  </motion.div>
                  <h2 className="text-2xl md:text-4xl text-yellow-400 mb-4" style={{ textShadow: '0 0 30px #ffff00' }}>
                    GANADOR ABSOLUTO
                  </h2>
                  <h3 className="text-3xl md:text-5xl font-bold text-white mb-2" style={{ textShadow: '0 0 40px #ff00ff' }}>
                    {conclusionData.masVotado.nombre}
                  </h3>
                  <p className="text-lg md:text-xl text-cyan-400 mb-2">
                    {conclusionData.masVotado.categoria}
                  </p>
                  <div className="text-xl md:text-2xl text-pink-400 font-bold">
                    ⚡ {conclusionData.masVotado.votos} VOTOS ⚡
                  </div>
                </motion.div>
              )}

              {/* Indicadores Principales (frames 150-210) */}
              {currentFrame >= 150 && currentFrame < 210 && (
                <motion.div
                  key="stats"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 p-8"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full items-center">
                    <div className="text-center p-4 rounded-xl bg-pink-500/20 border border-pink-500/30">
                      <div className="text-4xl mb-2">👥</div>
                      <div className="text-2xl font-bold text-white">{conclusionData.totalVotantes}</div>
                      <div className="text-sm text-white/60">PARTICIPANTES</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
                      <div className="text-4xl mb-2">🗳️</div>
                      <div className="text-2xl font-bold text-white">{conclusionData.totalVotos.toLocaleString()}</div>
                      <div className="text-sm text-white/60">VOTOS TOTALES</div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
                      <div className="text-4xl mb-2">🏆</div>
                      <div className="text-xl font-bold text-white">4 CATEGORÍAS</div>
                      <div className="text-sm text-white/60">PREMIADAS</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Todos los Ganadores (frames 210-270) */}
              {currentFrame >= 210 && currentFrame < 270 && (
                <motion.div
                  key="winners"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 p-4 md:p-8"
                >
                  <h3 className="text-lg md:text-2xl text-white text-center mb-4 md:mb-6">
                    🎉 FELICITACIONES A LOS GANADORES 🎉
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {conclusionData.ganadores.map((g, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 rounded-lg border-2 text-center"
                        style={{ borderColor: '#ff00ff', background: 'rgba(255,255,255,0.1)' }}
                      >
                        <div className="text-2xl mb-1">🎬</div>
                        <div className="text-sm text-pink-400 mb-1">{g.categoria}</div>
                        <div className="text-lg font-bold text-cyan-400">{g.ganador}</div>
                        <div className="text-sm text-yellow-400">⚡ {g.votos} votos</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Mensaje Final (frames 270-299) */}
              {currentFrame >= 270 && (
                <motion.div
                  key="final"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center p-8"
                >
                  <p className="text-xl md:text-3xl text-green-400 mb-2" style={{ textShadow: '0 0 20px #00ff88', animation: 'glow 2s infinite alternate' }}>
                    🌟 LA NOCHE ES NUESTRA 🌟
                  </p>
                  <p className="text-lg md:text-xl text-white/80">
                    ¡¡¡HASTA EL PRÓXIMO AÑO!!! ⚡🎉
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/60">
              Frame: {currentFrame} / 299
            </span>
            <span className="text-sm text-white/60">
              {Math.round((currentFrame / 299) * 100)}% | {(currentFrame / 30).toFixed(1)}s
            </span>
          </div>
          <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-pink-500 via-cyan-400 to-yellow-400"
              initial={{ width: 0 }}
              animate={{ width: `${(currentFrame / 299) * 100}%` }}
              transition={{ duration: 0.033 }}
            />
          </div>
        </div>
      </div>

      {/* Botón de reinicio nuclear */}
      <div className="neon-card p-6 border-2 border-red-500/50 bg-red-500/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-red-500/30 border border-red-500/50">
            <RefreshCw className="h-6 w-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-red-400">REINICIO NUCLEAR</h4>
            <p className="text-red-400/70 text-sm">ELIMINAR TODO (votos, votantes, categorías)</p>
          </div>
        </div>
        <button
          onClick={reiniciarVotacion}
          className="w-full px-4 py-3 rounded-lg border-2 border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all font-semibold tracking-wide"
        >
          ⚠️ REINICIAR TODO ⚠️
        </button>
      </div>

      <style jsx>{`
        @keyframes glow {
          from { filter: drop-shadow(0 0 20px currentColor); }
          to { filter: drop-shadow(0 0 40px currentColor); }
        }
      `}</style>
    </motion.div>
  )
}
