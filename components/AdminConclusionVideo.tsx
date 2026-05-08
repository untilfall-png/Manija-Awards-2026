'use client'

import { useRef, useState, useEffect } from 'react'
import { Play, Pause, RotateCcw, Maximize2 } from 'lucide-react'
import type { VotingStats } from '@/lib/results'

interface AdminConclusionVideoProps {
  stats?: VotingStats | null
}

export function AdminConclusionVideo({ stats }: AdminConclusionVideoProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(true)
  const [sent, setSent] = useState(false)

  const send = (msg: unknown) => iframeRef.current?.contentWindow?.postMessage(msg, '*')

  useEffect(() => {
    if (!stats || sent) return
    const t = setTimeout(() => {
      send({
        type:        'data',
        totalVoters: stats.totalVoters,
        totalVotes:  stats.totalVotes,
        results:     stats.results,
        topCategory: stats.topCategory,
      })
      setSent(true)
    }, 1200)
    return () => clearTimeout(t)
  }, [stats, sent])

  useEffect(() => { setSent(false) }, [stats])

  const handlePlay       = () => { send('play');    setPlaying(true)  }
  const handlePause      = () => { send('pause');   setPlaying(false) }
  const handleRestart    = () => { send('restart'); setPlaying(true)  }
  const handleFullscreen = () => iframeRef.current?.requestFullscreen()

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h4 className="text-xl font-display font-bold text-white mb-1">📊 Resumen de Votación</h4>
        <p className="text-white/50 text-xs">
          {stats
            ? `${stats.totalVoters} votantes · ${stats.totalVotes} votos · datos reales`
            : 'Mostrando datos de ejemplo'}
        </p>
      </div>

      <div
        className="relative w-full rounded-2xl overflow-hidden border border-neon-pink/30 shadow-lg shadow-neon-pink/10 bg-black"
        style={{ aspectRatio: '16/9' }}
      >
        <iframe
          ref={iframeRef}
          src="/hyperframes/conclusion.html"
          className="w-full h-full border-0"
          title="Conclusión Manija Awards 2026"
          allow="fullscreen"
        />
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
          <button onClick={handlePause} className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all shadow-neon-pink">
            <Pause className="h-4 w-4" /> Pausar
          </button>
        ) : (
          <button onClick={handlePlay} className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all shadow-neon-pink">
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
