'use client'

import { useEffect, useRef, useState } from 'react'
import { Trophy, Sparkles, Zap, Star } from 'lucide-react'

interface DiplomaProps {
  winnerName: string
  categoryName: string
  votes: number
  date: string
  onDownload?: () => void
}

export function DiplomaDigital({ winnerName, categoryName, votes, date, onDownload }: DiplomaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [animating, setAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 800
    canvas.height = 600

    // Cargar template font.jpeg
    const bgImage = new Image()
    bgImage.src = '/font.jpeg'
    
    bgImage.onload = () => {
      ctx.drawImage(bgImage, 0, 0, canvas.width, canvas.height)
      iniciarAnimacionNeon(ctx, canvas)
    }

    bgImage.onerror = () => {
      // Si no hay font.jpeg, crear fondo elegante por defecto
      crearFondoElegante(ctx, canvas)
      iniciarAnimacionNeon(ctx, canvas)
    }

    const animacion = setTimeout(() => setAnimating(false), 5000)
    return () => clearTimeout(animacion)
  }, [winnerName, categoryName])

  function crearFondoElegante(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    // Gradiente dramático
    const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
    gradiente.addColorStop(0, '#0a0a0f')
    gradiente.addColorStop(0.5, '#1a0a2e')
    gradiente.addColorStop(1, '#0f0c29')
    ctx.fillStyle = gradiente
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Borde decorativo
    ctx.strokeStyle = '#ff00ff'
    ctx.lineWidth = 4
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)
  }

  function iniciarAnimacionNeon(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    let frame = 0
    const animar = () => {
      frame++

      // Rayos neon desde los bordes hacia el centro
      for (let i = 0; i < 5; i++) {
        const x = Math.sin(frame * 0.05 + i) * 200 + 400
        const y = Math.cos(frame * 0.03 + i) * 150 + 300
        const radio = Math.sin(frame * 0.1 + i) * 50 + 100

        const gradiente = ctx.createRadialGradient(x, y, 0, x, y, radio)
        gradiente.addColorStop(0, `rgba(255, 0, 255, ${0.3 - i * 0.05})`)
        gradiente.addColorStop(0.5, `rgba(0, 255, 255, ${0.1 - i * 0.02})`)
        gradiente.addColorStop(1, 'rgba(255, 255, 0, 0)')

        ctx.fillStyle = gradiente
        ctx.beginPath()
        ctx.arc(x, y, radio, 0, Math.PI * 2)
        ctx.fill()
      }

      // Dibujar texto
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 40px Arial'
      ctx.textAlign = 'center'
      ctx.fillText('MANIJA AWARDS 2026', canvas.width / 2, 120)

      ctx.fillStyle = '#ffd700'
      ctx.font = 'bold 32px Arial'
      ctx.fillText(categoryName.toUpperCase(), canvas.width / 2, 180)

      // Destello estelar
      const estrellaAlpha = Math.sin(frame * 0.1) * 0.5 + 0.5
      ctx.fillStyle = `rgba(255, 215, 0, ${estrellaAlpha})`
      ctx.font = 'bold 24px Arial'
      ctx.fillText('★ GANADOR ABSOLUTO ★', canvas.width / 2, 240)

      // Nombre del ganador - Efecto glow
      ctx.shadowColor = '#ff00ff'
      ctx.shadowBlur = 20
      ctx.fillStyle = '#fff'
      ctx.font = 'bold 48px Arial'
      ctx.fillText(winnerName, canvas.width / 2, 330)
      ctx.shadowBlur = 0

      // Detalles
      ctx.fillStyle = '#ccc'
      ctx.font = '20px Arial'
      ctx.fillText(`Votos obtenidos: ${votes}`, canvas.width / 2, 390)
      ctx.fillText(`Fecha: ${date}`, canvas.width / 2, 430)

      // Decoración con estrellas parpadeantes
      if (frame % 20 < 10) {
        ctx.fillStyle = '#fff'
        ctx.font = '30px Arial'
        ctx.fillText('⭐', 100, 500)
        ctx.fillText('⭐', canvas.width - 100, 500)
        ctx.fillText('⭐', canvas.width / 2, 520)
      }

      if (animating) {
        requestAnimationFrame(animar)
      }
    }
    animar()
  }

  return (
    <div className="diploma-container relative bg-black rounded-2xl overflow-hidden border-2 border-pink-500/50 shadow-2xl shadow-pink-500/30">
      {/* Efecto de rayos neon */}
      {animating && (
        <>
          <div className="absolute top-0 left-0 w-full h-full animate-neon-rays opacity-50" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,255,0.1),transparent_70%)] animate-pulse" />
        </>
      )}

      {/* Canvas del diploma */}
      <canvas
        ref={canvasRef}
        className="w-full h-auto max-w-full"
        style={{ maxHeight: '600px' }}
      />

      {/* Overlay de confetti digital cuando termina */}
      {!animating && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                color: ['#ff00ff', '#00ffff', '#ffff00', '#ff0080'][Math.floor(Math.random() * 4)]
              }}
            >
              ★
            </div>
          ))}
        </div>
      )}

      {/* Botón descargar */}
      <div className="absolute bottom-4 right-4">
        <button
          onClick={onDownload}
          className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-lg hover:from-pink-500 hover:to-purple-500 transition-all shadow-lg shadow-pink-500/50 flex items-center gap-2"
        >
          <Trophy className="h-4 w-4" />
          Descargar PDF
        </button>
      </div>

      <style jsx>{`
        @keyframes neon-rays {
          0%, 100% { opacity: 0.3; transform: rotate(0deg); }
          50% { opacity: 0.8; transform: rotate(180deg); }
        }
        .animate-neon-rays {
          animation: neon-rays 3s ease-in-out infinite;
          background: conic-gradient(from 0deg, transparent, rgba(255,0,255,0.3), transparent, rgba(0,255,255,0.3), transparent);
        }
        @keyframes confetti-fall {
          0% { transform: translateY(-100vh) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .animate-confetti-fall {
          animation: confetti-fall 3s ease-in forwards;
        }
      `}</style>
    </div>
  )
}
