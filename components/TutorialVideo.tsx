'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { QrCode, Vote, CheckCircle, BarChart3, UserPlus } from 'lucide-react'

const steps = [
  {
    id: 1,
    title: 'Registro con QR',
    description: 'Escanea el código QR oficial para activar tu acceso VIP al sistema de votación.',
    icon: UserPlus,
    color: '#ff2edf'
  },
  {
    id: 2,
    title: 'Votación por Categoría',
    description: 'Cada categoría se desbloquea con su propio código QR. Elige tu favorito en cada una.',
    icon: QrCode,
    color: '#7c3aed'
  },
  {
    id: 3,
    title: 'Completa Todas las Categorías',
    description: 'Avanza secuencialmente hasta votar en las 14 categorías. No puedes saltar ni repetir.',
    icon: Vote,
    color: '#ff6a00'
  },
  {
    id: 4,
    title: 'Resultados en Tiempo Real',
    description: 'Una vez completado, ve los resultados actualizados al instante en vivo.',
    icon: BarChart3,
    color: '#00d4ff'
  }
]

interface TutorialVideoProps {
  onComplete: () => void
}

export function TutorialVideo({ onComplete }: TutorialVideoProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)

  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsPlaying(false)
        setTimeout(onComplete, 2000) // Auto-complete after last step
      }
    }, 3000) // 3 seconds per step

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, onComplete])

  const currentStepData = steps[currentStep]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
    >
      <div className="mx-auto max-w-4xl p-8">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="neon-card p-12 text-center"
        >
          <motion.h2
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mb-8 text-4xl font-bold text-white"
          >
            ¡Bienvenido al Sistema de Votación!
          </motion.h2>

          <div className="mb-12 flex justify-center space-x-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ scale: 0 }}
                animate={{
                  scale: index <= currentStep ? 1 : 0.8,
                  backgroundColor: index === currentStep ? step.color : 'rgba(255, 255, 255, 0.1)'
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20"
              >
                <step.icon className="h-6 w-6 text-white" />
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <motion.div
                animate={{
                  color: currentStepData.color,
                  textShadow: `0 0 20px ${currentStepData.color}`
                }}
                className="text-6xl"
              >
                <currentStepData.icon />
              </motion.div>

              <h3 className="text-3xl font-bold text-white">{currentStepData.title}</h3>
              <p className="max-w-2xl mx-auto text-lg text-[#d3d3ff] leading-relaxed">
                {currentStepData.description}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12"
          >
            <div className="flex justify-center space-x-2">
              {steps.map((_, index) => (
                <motion.div
                  key={index}
                  animate={{
                    scale: index === currentStep ? 1.2 : 1,
                    backgroundColor: index === currentStep ? currentStepData.color : '#666'
                  }}
                  className="h-2 w-2 rounded-full"
                />
              ))}
            </div>
          </motion.div>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            onClick={() => {
              setIsPlaying(false)
              onComplete()
            }}
            className="btn-neon btn-neon-pink mt-8 text-lg"
          >
            Entendido, ¡empezar a votar!
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  )
}