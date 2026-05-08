'use client'

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  alpha: number; size: number
  color: string
  shape: 'circle' | 'rect' | 'star'
  rotation: number; rotationSpeed: number
}

const COLORS = [
  '#FF2EDB', '#A855F7', '#22D3EE', '#F97316',
  '#4ADE80', '#FACC15', '#F472B6', '#818CF8',
]

function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number) {
  ctx.beginPath()
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2
    i === 0 ? ctx.moveTo(x + r * Math.cos(angle), y + r * Math.sin(angle))
             : ctx.lineTo(x + r * Math.cos(angle), y + r * Math.sin(angle))
  }
  ctx.closePath()
}

function createParticles(count: number, cx: number, cy: number): Particle[] {
  return Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = 4 + Math.random() * 8
    return {
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 4,
      alpha: 1,
      size: 4 + Math.random() * 8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: (['circle', 'rect', 'star'] as const)[Math.floor(Math.random() * 3)],
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
    }
  })
}

interface VoteCelebrationProps {
  active: boolean
  onDone: () => void
}

export function VoteCelebration({ active, onDone }: VoteCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    if (!active) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width  = window.innerWidth
    canvas.height = window.innerHeight

    const cx = canvas.width / 2
    const cy = canvas.height / 2
    let particles = createParticles(120, cx, cy)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x  += p.vx
        p.y  += p.vy
        p.vy += 0.25       // gravity
        p.vx *= 0.98       // friction
        p.alpha -= 0.013
        p.rotation += p.rotationSpeed

        if (p.alpha <= 0) return

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.fillStyle   = p.color
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)

        if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else {
          drawStar(ctx, 0, 0, p.size / 2)
          ctx.fill()
        }
        ctx.restore()
      })

      particles = particles.filter(p => p.alpha > 0)
      if (particles.length > 0) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        onDone()
      }
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, onDone])

  return (
    <AnimatePresence>
      {active && (
        <>
          {/* Canvas confetti */}
          <canvas
            ref={canvasRef}
            className="fixed inset-0 z-50 pointer-events-none"
            aria-hidden="true"
          />

          {/* Overlay mensaje */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.15, 1, 0.8] }}
            transition={{ duration: 2.2, times: [0, 0.2, 0.7, 1] }}
          >
            <div className="text-center">
              <div className="inline-flex items-center gap-3 px-8 py-5 rounded-3xl bg-black/70 backdrop-blur-xl border-2 border-neon-pink shadow-2xl shadow-neon-pink/40">
                <Sparkles className="h-8 w-8 text-neon-pink animate-pulse" />
                <span className="text-3xl sm:text-4xl font-display font-bold text-white">
                  ¡VOTO REGISTRADO!
                </span>
                <Sparkles className="h-8 w-8 text-neon-purple animate-pulse" />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
