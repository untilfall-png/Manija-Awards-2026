'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react'
import type { VotingStats } from '@/lib/results'

interface AdminDiplomasVideoProps {
  stats: VotingStats | null
}

export function AdminDiplomasVideo({ stats }: AdminDiplomasVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(true)
  const [sent, setSent] = useState(false)

  const send = (msg: unknown) => iframeRef.current?.contentWindow?.postMessage(msg, '*')

  // Send real data once iframe is ready and stats are available
  useEffect(() => {
    if (!stats || sent) return
    const tryPost = () => {
      send({
        type: 'data',
        categories: stats.results.filter(r => !r.isSpecial).map(r => ({
          categoryName:        r.categoryName,
          winnerName:          r.winnerName,
          winnerDescription:   r.winnerDescription,
          votes:               r.votes,
        })),
        specialCategories: stats.results.filter(r => r.isSpecial).map(r => ({
          categoryName: r.categoryName,
          winnerName:   r.winnerName,
          isSpecial:    true,
        })),
      })
      setSent(true)
    }
    // Give the iframe a moment to load before posting
    const t = setTimeout(tryPost, 1200)
    return () => clearTimeout(t)
  }, [stats, sent])

  // Re-send if stats change (e.g., refreshed)
  useEffect(() => { setSent(false) }, [stats])

  const handlePlay    = () => { send('play');    setPlaying(true)  }
  const handlePause   = () => { send('pause');   setPlaying(false) }
  const handleRestart = () => { send('restart'); setPlaying(true)  }
  const handleFullscreen = () => iframeRef.current?.requestFullscreen()

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-xl font-display font-bold text-white mb-1">🏆 Diplomas por Categoría</h4>
        <p className="text-white/50 text-xs">
          {stats
            ? `${stats.results.length} categorías · datos reales cargados`
            : 'Esperando datos de Firebase...'}
        </p>
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden border border-neon-purple/30 shadow-lg shadow-neon-purple/10 bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        <iframe
          ref={iframeRef}
          src="/hyperframes/diplomas.html"
          className="w-full h-full border-0"
          title="Diplomas Manija Awards 2026"
          allow="fullscreen"
          onLoad={() => { if (stats && !sent) setSent(false) }}
        />
        {!stats && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="text-center">
              <div className="w-10 h-10 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin mx-auto mb-3" />
              <p className="text-neon-pink text-sm font-semibold">Cargando resultados...</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-3">
        <button
          onClick={handleRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 transition-all text-sm font-semibold"
        >
          <RotateCcw className="h-4 w-4" />
          Reiniciar
        </button>
        {playing ? (
          <button onClick={handlePause} className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-neon-purple text-white font-bold hover:bg-neon-purple/80 transition-all">
            <Pause className="h-4 w-4" /> Pausar
          </button>
        ) : (
          <button onClick={handlePlay} className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-neon-purple text-white font-bold hover:bg-neon-purple/80 transition-all">
            <Play className="h-4 w-4" /> Reproducir
          </button>
        )}
        <button
          onClick={handleFullscreen}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-all text-sm font-semibold"
        >
          <Maximize2 className="h-4 w-4" /> Pantalla completa
        </button>
      </div>
    </div>
  )
}
