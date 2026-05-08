'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface DiplomaProps {
  winnerName: string
  categoryName: string
  votes: number
  date: string
  onDownload?: () => void
}

export function DiplomaDigital({ winnerName, categoryName, votes, date, onDownload }: DiplomaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = 800
    canvas.height = 560

    let frame = 0
    let logoImg: HTMLImageElement | null = null

    // Cargar logo
    const logo = new window.Image()
    logo.src = '/logo.jpeg'
    logo.onload  = () => { logoImg = logo; setReady(true) }
    logo.onerror = () => { logoImg = null; setReady(true) }

    const draw = () => {
      frame++

      // ── Fondo ──
      const bg = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      bg.addColorStop(0, '#0a0a0f')
      bg.addColorStop(0.5, '#1a0a2e')
      bg.addColorStop(1, '#0f0c29')
      ctx.fillStyle = bg
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // ── Rayos neon animados ──
      for (let i = 0; i < 4; i++) {
        const x = Math.sin(frame * 0.04 + i * 1.4) * 180 + 400
        const y = Math.cos(frame * 0.025 + i * 1.1) * 120 + 280
        const r = Math.sin(frame * 0.08 + i) * 45 + 90
        const g = ctx.createRadialGradient(x, y, 0, x, y, r)
        g.addColorStop(0, `rgba(255,0,255,${0.22 - i * 0.04})`)
        g.addColorStop(0.5, `rgba(0,200,255,${0.08 - i * 0.01})`)
        g.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = g
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
      }

      // ── Marco exterior neon ──
      ctx.strokeStyle = 'rgba(255,46,219,0.5)'
      ctx.lineWidth = 2
      ctx.strokeRect(14, 14, canvas.width - 28, canvas.height - 28)
      ctx.strokeStyle = 'rgba(34,211,238,0.2)'
      ctx.lineWidth = 1
      ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

      // ── Esquinas HUD ──
      const drawCorner = (x: number, y: number, dx: number, dy: number, color: string) => {
        ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.beginPath()
        ctx.moveTo(x, y + dy * 28); ctx.lineTo(x, y); ctx.lineTo(x + dx * 28, y)
        ctx.stroke()
      }
      drawCorner(24, 24, 1, 1, '#ff2edb')
      drawCorner(canvas.width - 24, 24, -1, 1, '#ff2edb')
      drawCorner(24, canvas.height - 24, 1, -1, '#22d3ee')
      drawCorner(canvas.width - 24, canvas.height - 24, -1, -1, '#22d3ee')

      // ── TOP LEFT ──
      ctx.fillStyle = '#cc00ff'; ctx.font = 'bold 11px Arial'
      ctx.textAlign = 'left'
      ctx.fillText('SANTIAGO DE CHILE', 48, 44)
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '7px Arial'
      ctx.fillText('ANIVERSARIO MANIJA 2026', 48, 58)

      // ── TOP RIGHT: fecha ──
      ctx.textAlign = 'right'
      ctx.fillStyle = '#ff2edb'; ctx.font = 'bold 24px Arial'
      ctx.fillText(date.split('/')[0] || '21', canvas.width - 48, 46)
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '8px Arial'
      ctx.fillText(date.split('/')[1] || 'MAYO', canvas.width - 48, 58)
      ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '10px Arial'
      ctx.fillText(date.split('/')[2] || '2026', canvas.width - 48, 70)

      // ── Logo centrado arriba ──
      ctx.save()
      ctx.beginPath()
      ctx.arc(canvas.width / 2, 56, 36, 0, Math.PI * 2)
      ctx.clip()
      if (logoImg) {
        ctx.drawImage(logoImg, canvas.width / 2 - 36, 20, 72, 72)
      } else {
        ctx.fillStyle = 'rgba(170,0,255,0.3)'; ctx.fill()
        ctx.fillStyle = '#fff'; ctx.font = '26px Arial'; ctx.textAlign = 'center'
        ctx.fillText('M', canvas.width / 2, 64)
      }
      ctx.restore()
      // Borde del logo
      const pulseGlow = Math.sin(frame * 0.08) * 0.4 + 0.6
      ctx.strokeStyle = `rgba(255,46,219,${pulseGlow})`
      ctx.lineWidth = 2.5
      ctx.beginPath(); ctx.arc(canvas.width / 2, 56, 36, 0, Math.PI * 2); ctx.stroke()

      // ── MANIJA AWARDS ──
      ctx.textAlign = 'center'
      ctx.shadowColor = 'rgba(200,100,255,0.8)'; ctx.shadowBlur = 18
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 62px Arial'
      ctx.fillText('MANIJA', canvas.width / 2, 162)
      ctx.shadowColor = 'rgba(255,46,219,0.9)'; ctx.shadowBlur = 14
      ctx.fillStyle = '#ff2edb'; ctx.font = 'bold 44px Arial'
      ctx.fillText('AWARDS', canvas.width / 2, 210)
      ctx.shadowBlur = 0
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '13px Arial'
      ctx.fillText('2  0  2  6', canvas.width / 2, 232)

      // ── Separator ──
      const sep = ctx.createLinearGradient(60, 0, canvas.width - 60, 0)
      sep.addColorStop(0, 'transparent'); sep.addColorStop(0.3, '#ff2edb')
      sep.addColorStop(0.5, '#a855f7');  sep.addColorStop(0.7, '#22d3ee')
      sep.addColorStop(1, 'transparent')
      ctx.strokeStyle = sep; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.moveTo(60, 246); ctx.lineTo(canvas.width - 60, 246); ctx.stroke()

      // ── OTORGADO A ──
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '7.5px Arial'
      ctx.fillText('ESTE DIPLOMA SE OTORGA A:', canvas.width / 2, 266)

      // ── WINNER NAME ──
      ctx.shadowColor = 'rgba(255,255,255,0.5)'; ctx.shadowBlur = 12
      ctx.fillStyle = '#ffffff'; ctx.font = 'bold 32px Arial'
      ctx.fillText(winnerName.toUpperCase(), canvas.width / 2, 304)
      ctx.shadowBlur = 0

      // ── CATEGORIA ──
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = '7px Arial'
      ctx.fillText('POR HABER SIDO RECONOCIDO EN LA CATEGORÍA:', canvas.width / 2, 328)

      // Category pill
      const pillW = Math.min(ctx.measureText(categoryName.toUpperCase()).width + 80, 500)
      const pillX = canvas.width / 2 - pillW / 2
      ctx.strokeStyle = '#ff2edb'; ctx.lineWidth = 1.5
      ctx.fillStyle = 'rgba(255,46,219,0.10)'
      ctx.beginPath(); ctx.rect(pillX, 336, pillW, 38); ctx.fill(); ctx.stroke()
      ctx.shadowColor = 'rgba(255,46,219,0.8)'; ctx.shadowBlur = 8
      ctx.fillStyle = '#ff2edb'; ctx.font = 'bold 18px Arial'
      ctx.fillText(categoryName.toUpperCase(), canvas.width / 2, 361)
      ctx.shadowBlur = 0

      // ── Votos ──
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '7px Arial'
      ctx.fillText('POR SU ENERGÍA INAGOTABLE Y SU VERDADERO ESPÍRITU MANIJA', canvas.width / 2, 395)

      // ── Bottom line ──
      const bl = ctx.createLinearGradient(60, 0, canvas.width - 60, 0)
      bl.addColorStop(0, 'transparent'); bl.addColorStop(0.3, 'rgba(255,46,219,0.35)')
      bl.addColorStop(0.7, 'rgba(34,211,238,0.25)'); bl.addColorStop(1, 'transparent')
      ctx.strokeStyle = bl; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(60, 415); ctx.lineTo(canvas.width - 60, 415); ctx.stroke()

      // ── BOTTOM: firma centrada ──
      ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.font = 'italic 11px Arial'
      ctx.fillText('Club los Manijas', canvas.width / 2, 448)
      ctx.strokeStyle = 'rgba(255,255,255,0.18)'; ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(canvas.width / 2 - 80, 456); ctx.lineTo(canvas.width / 2 + 80, 456); ctx.stroke()
      ctx.fillStyle = 'rgba(255,255,255,0.38)'; ctx.font = '7px Arial'
      ctx.fillText('CLUB LOS MANIJAS 2026', canvas.width / 2, 470)
      ctx.fillStyle = 'rgba(255,46,219,0.4)'; ctx.font = '7px Arial'
      ctx.fillText(`${votes} votos · ${date}`, canvas.width / 2, 484)

      // ── Badge círculo derecha ──
      ctx.strokeStyle = 'rgba(170,0,255,0.55)'; ctx.lineWidth = 1.5
      ctx.beginPath(); ctx.arc(canvas.width - 75, 462, 36, 0, Math.PI * 2); ctx.stroke()
      ctx.fillStyle = 'rgba(170,0,255,0.10)'; ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '6px Arial'
      ctx.fillText('CLUB LOS', canvas.width - 75, 453)
      ctx.fillStyle = '#a855f7'; ctx.font = '14px Arial'
      ctx.fillText('⊞', canvas.width - 75, 467)
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '6px Arial'
      ctx.fillText('MANIJAS 2026', canvas.width - 75, 479)

      // ── Waveform bottom ──
      ctx.fillStyle = 'rgba(255,46,219,0.2)'; ctx.font = '7px Arial'
      ctx.fillText('▌▍▎▏▎▍▌▍▎▏▎▍▌ ▌▍▎▏▎▍▌▍▎▏▎▍▌', canvas.width / 2, 526)

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => cancelAnimationFrame(rafRef.current)
  }, [winnerName, categoryName, votes, date])

  return (
    <div className="relative rounded-xl overflow-hidden border border-neon-pink/30 shadow-2xl shadow-neon-pink/20 bg-black">
      <canvas
        ref={canvasRef}
        className="w-full h-auto"
        style={{ display: 'block' }}
      />
      {onDownload && (
        <div className="absolute bottom-3 right-3">
          <button
            onClick={onDownload}
            className="px-3 py-1.5 bg-gradient-to-r from-neon-pink to-neon-purple text-white text-xs font-bold rounded-lg hover:opacity-90 transition-all shadow-lg"
          >
            Descargar PDF
          </button>
        </div>
      )}
    </div>
  )
}
