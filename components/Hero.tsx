'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Star, X, ZoomIn, Play, Pause, RotateCcw, Maximize2, User, Vote } from 'lucide-react'

/* ─────────────────────────────────────────────────────────────────────────────
   MODAL – Logo descripción (imagen + video hyperframes)
───────────────────────────────────────────────────────────────────────────── */
interface ModalProps {
  onClose: () => void
  defaultView?: 'video' | 'image'
}

function LogoDescripcionModal({ onClose, defaultView = 'image' }: ModalProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(true)
  const [view, setView] = useState<'video' | 'image'>(defaultView)

  const send = (msg: string) => iframeRef.current?.contentWindow?.postMessage(msg, '*')
  const handlePlay       = () => { send('play');    setPlaying(true)  }
  const handlePause      = () => { send('pause');   setPlaying(false) }
  const handleRestart    = () => { send('restart'); setPlaying(true)  }
  const handleFullscreen = () => iframeRef.current?.requestFullscreen()

  return (
    <AnimatePresence>
      <motion.div
        key="logo-modal-bg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4 md:p-6"
        onClick={onClose}
      >
        {/* Fondo */}
        <div className="absolute inset-0 bg-black/92 backdrop-blur-xl" />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-pink/15 rounded-full blur-3xl animate-pulse-neon" />
          <div className="absolute bottom-1/4 right-1/4 w-56 sm:w-80 h-56 sm:h-80 bg-neon-purple/15 rounded-full blur-3xl animate-float" />
        </div>

        {/* Panel */}
        <motion.div
          key="logo-modal-content"
          initial={{ opacity: 0, scale: 0.88, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 12 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col gap-3 sm:gap-4 w-full max-w-6xl max-h-[95dvh] overflow-y-auto"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 rounded-xl bg-neon-pink/20 border border-neon-pink/40">
                <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neon-pink" />
              </div>
              <div>
                <p className="text-[10px] sm:text-[11px] text-neon-pink font-bold tracking-[0.3em] uppercase">Identidad Visual</p>
                <h2 className="text-white font-display font-bold text-base sm:text-lg md:text-xl leading-tight">
                  MANIJA AWARDS <span className="text-neon-pink">2026</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Toggle video / imagen */}
              <div className="flex rounded-xl overflow-hidden border border-white/10">
                <button
                  onClick={() => setView('image')}
                  className={`px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-wider transition-all ${
                    view === 'image' ? 'bg-neon-pink text-black' : 'text-white/50 hover:text-white/80'
                  }`}
                >IMAGEN</button>
                <button
                  onClick={() => setView('video')}
                  className={`px-2.5 sm:px-3 py-1.5 text-[10px] sm:text-xs font-bold tracking-wider transition-all ${
                    view === 'video' ? 'bg-neon-pink text-black' : 'text-white/50 hover:text-white/80'
                  }`}
                >VIDEO</button>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 sm:p-2 rounded-xl border border-white/20 text-white/50 hover:text-white hover:border-neon-pink/50 hover:bg-neon-pink/10 transition-all"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>

          {/* Contenido */}
          {view === 'image' ? (
            <>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan rounded-2xl blur-md opacity-50 animate-pulse-neon pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-neon-pink/40 shadow-[0_0_60px_rgba(255,46,219,0.3)] bg-black">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />
                  <div className="absolute top-2 left-2 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-neon-pink/70 z-10" />
                  <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-neon-pink/70 z-10" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-neon-cyan/70 z-10" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-neon-cyan/70 z-10" />
                  <Image
                    src="/logo-descripcion.jpeg"
                    alt="Nuevo logo Equipo Manija"
                    width={1400}
                    height={933}
                    sizes="(max-width:768px) 95vw, 80vw"
                    className="w-full h-auto max-h-[70dvh] object-contain"
                    draggable={false}
                    priority
                  />
                </div>
              </div>
              <p className="text-white/40 text-[10px] sm:text-xs tracking-wider text-right">
                El nuevo logotipo oficial del equipo Manija · temporada 2026
              </p>
            </>
          ) : (
            <>
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-2xl blur-md opacity-50 animate-pulse-neon pointer-events-none" />
                <div className="relative rounded-2xl overflow-hidden border border-neon-pink/40 shadow-[0_0_60px_rgba(255,46,219,0.3)] bg-black" style={{ aspectRatio: '16/9' }}>
                  <div className="absolute top-2 left-2 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2 border-neon-pink/70 z-10 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2 border-neon-pink/70 z-10 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2 border-neon-cyan/70 z-10 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2 border-neon-cyan/70 z-10 pointer-events-none" />
                  <iframe
                    ref={iframeRef}
                    src="/hyperframes/logo-reveal.html"
                    className="w-full h-full border-0"
                    title="Logo Reveal – Manija Awards 2026"
                    allow="fullscreen"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-white/40 text-[10px] sm:text-xs tracking-wider">48s · 8 fases · 4 elementos del símbolo</p>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button onClick={handleRestart}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-neon-purple/40 text-neon-purple hover:bg-neon-purple/10 transition-all text-[10px] sm:text-xs font-bold">
                    <RotateCcw className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Reiniciar
                  </button>
                  {playing ? (
                    <button onClick={handlePause}
                      className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all text-[10px] sm:text-xs">
                      <Pause className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Pausar
                    </button>
                  ) : (
                    <button onClick={handlePlay}
                      className="inline-flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-1.5 rounded-lg bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all text-[10px] sm:text-xs">
                      <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Reproducir
                    </button>
                  )}
                  <button onClick={handleFullscreen}
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg border border-neon-cyan/40 text-neon-cyan hover:bg-neon-cyan/10 transition-all text-[10px] sm:text-xs font-bold">
                    <Maximize2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" /> Pantalla completa
                  </button>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

/* ─────────────────────────────────────────────────────────────────────────────
   HERO
───────────────────────────────────────────────────────────────────────────── */
export function Hero() {
  const [showModal, setShowModal] = useState(false)
  const [modalView, setModalView] = useState<'video' | 'image'>('image')

  const openModal = (view: 'video' | 'image' = 'image') => {
    setModalView(view)
    setShowModal(true)
  }

  return (
    <>
      {showModal && (
        <LogoDescripcionModal onClose={() => setShowModal(false)} defaultView={modalView} />
      )}

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 md:px-10 py-16 sm:py-20 md:py-24">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-[#090417] to-black" />
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse-neon" />
          <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[1200px] h-[600px] sm:h-[1200px] bg-gradient-neon/10 rounded-full blur-3xl animate-pulse-neon" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8 sm:space-y-10 md:space-y-12"
          >
            {/* ── Logo circular ── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex flex-col items-center gap-3 sm:gap-4"
            >
              <div className="relative">
                <div className="absolute inset-[-12px] sm:inset-[-20px] bg-gradient-to-r from-neon-cyan/30 via-neon-purple/30 to-neon-cyan/30 rounded-full blur-2xl animate-pulse-neon opacity-70" />
                <div className="absolute inset-[-8px] sm:inset-[-10px] border-2 border-neon-purple/30 rounded-full animate-spin-slow" />
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative w-28 h-28 sm:w-40 sm:h-40 md:w-52 md:h-52 rounded-full bg-gradient-to-br from-black via-[#090417] to-black border-4 border-neon-purple/50 flex items-center justify-center overflow-hidden cursor-pointer group"
                  onClick={() => openModal('image')}
                  title="Ver descripción del nuevo logo"
                >
                  <Image
                    src="/logo.jpeg"
                    alt="Manija Awards 2026"
                    fill
                    sizes="(max-width:640px) 112px, (max-width:768px) 160px, 208px"
                    className="object-contain rounded-full"
                    priority
                  />
                  <div className="absolute inset-0 bg-neon-pink/0 group-hover:bg-neon-pink/15 transition-colors rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-lg" />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* ── Título ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="space-y-2 sm:space-y-4"
            >
              <h1 className="heading-neon text-center text-4xl sm:text-6xl md:text-7xl lg:text-8xl">
                MANIJA AWARDS
              </h1>
              <div className="flex items-center justify-center gap-3 sm:gap-4">
                <div className="h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent flex-1 max-w-24 sm:max-w-none" />
                <span className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-300 to-slate-500 drop-shadow-[0_0_30px_rgba(148,163,184,0.5)]">
                  2026
                </span>
                <div className="h-px bg-gradient-to-r from-transparent via-neon-purple to-transparent flex-1 max-w-24 sm:max-w-none" />
              </div>
            </motion.div>

            {/* ── Imagen logo-descripcion DESTACADA ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="mx-auto w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl"
            >
              {/* Label */}
              <div className="flex items-center justify-center gap-2 mb-3 sm:mb-4">
                <div className="h-px bg-gradient-to-r from-transparent to-neon-pink/60 flex-1" />
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase text-neon-pink flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3" />
                  Nuevo Logo del Equipo
                  <Sparkles className="h-3 w-3" />
                </span>
                <div className="h-px bg-gradient-to-l from-transparent to-neon-pink/60 flex-1" />
              </div>

              {/* Card imagen */}
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => openModal('image')}
                className="relative cursor-pointer group"
              >
                {/* Glow exterior */}
                <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-neon-purple via-neon-pink to-neon-cyan rounded-2xl blur-sm sm:blur-md opacity-60 group-hover:opacity-90 animate-pulse-neon transition-opacity pointer-events-none" />

                <div className="relative rounded-2xl overflow-hidden border border-neon-pink/50 shadow-[0_0_40px_rgba(255,46,219,0.25)] group-hover:shadow-[0_0_70px_rgba(255,46,219,0.45)] transition-shadow bg-black">
                  {/* Scan line decorativa top */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-pink to-transparent z-10" />
                  {/* Esquinas HUD */}
                  <div className="absolute top-2 left-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-l-2 border-neon-pink/80 z-10 pointer-events-none" />
                  <div className="absolute top-2 right-2 w-4 h-4 sm:w-6 sm:h-6 border-t-2 border-r-2 border-neon-pink/80 z-10 pointer-events-none" />
                  <div className="absolute bottom-2 left-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-l-2 border-neon-cyan/80 z-10 pointer-events-none" />
                  <div className="absolute bottom-2 right-2 w-4 h-4 sm:w-6 sm:h-6 border-b-2 border-r-2 border-neon-cyan/80 z-10 pointer-events-none" />

                  <Image
                    src="/logo-descripcion.jpeg"
                    alt="Nuevo logo Equipo Manija – descripción completa"
                    width={900}
                    height={600}
                    sizes="(max-width:480px) 320px, (max-width:768px) 512px, (max-width:1024px) 768px, 900px"
                    className="w-full h-auto object-contain max-h-64 sm:max-h-80 md:max-h-[420px]"
                    draggable={false}
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center gap-2">
                      <div className="p-3 sm:p-4 rounded-full bg-neon-pink/20 border-2 border-neon-pink backdrop-blur-sm">
                        <ZoomIn className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                      </div>
                      <span className="text-white font-bold text-xs sm:text-sm tracking-widest uppercase bg-black/60 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm">
                        Ver en pantalla completa
                      </span>
                    </div>
                  </div>

                  {/* Scan line decorativa bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent z-10" />
                </div>
              </motion.div>

              {/* Hint + Video link */}
              <div className="flex items-center justify-between mt-2 sm:mt-3 flex-wrap gap-2">
                <p className="text-white/40 text-[10px] sm:text-xs tracking-wider">
                  Click para ampliar · identidad visual oficial
                </p>
                <button
                  onClick={() => openModal('video')}
                  className="inline-flex items-center gap-1 text-neon-purple/70 hover:text-neon-purple text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-colors"
                >
                  <Play className="h-3 w-3" />
                  Ver video reveal
                </button>
              </div>
            </motion.div>

            {/* ── Feature cards ── */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-3 mt-4"
            >
              <div className="neon-card group hover:scale-105 transition-transform duration-300 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-neon-cyan/20 border border-neon-cyan/30 flex-shrink-0">
                    <User className="h-6 w-6 sm:h-8 sm:w-8 text-neon-cyan" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-xl text-white">REGISTRO SIMPLE</h3>
                    <p className="text-white/70 text-xs sm:text-sm">Nombre, email y teléfono (opcional)</p>
                  </div>
                </div>
              </div>

              <div className="neon-card group hover:scale-105 transition-transform duration-300 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 flex-shrink-0">
                    <Vote className="h-6 w-6 sm:h-8 sm:w-8 text-neon-purple" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-xl text-white">VOTACIÓN SECUENCIAL</h3>
                    <p className="text-white/70 text-xs sm:text-sm">Una categoría a la vez</p>
                  </div>
                </div>
              </div>

              <div className="neon-card group hover:scale-105 transition-transform duration-300 p-4 sm:p-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 rounded-2xl bg-slate-600/30 border border-slate-500/30 flex-shrink-0">
                    <Star className="h-6 w-6 sm:h-8 sm:w-8 text-slate-400" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-base sm:text-xl text-white">DISEÑO NEON MAX PRO</h3>
                    <p className="text-white/70 text-xs sm:text-sm">Estilo eléctrico premium</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Scroll down hint ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
              className="flex flex-col items-center gap-2 pt-2"
            >
              <p className="text-white/40 text-xs sm:text-sm tracking-[0.3em] uppercase">Registrarse para votar</p>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-px h-6 sm:h-8 bg-gradient-to-b from-neon-pink/60 to-transparent"
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 bg-neon-cyan rounded-full"
              style={{ left: `${(i * 8.5) % 100}%`, top: `${(i * 13.7) % 100}%` }}
              animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
              transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </section>
    </>
  )
}
