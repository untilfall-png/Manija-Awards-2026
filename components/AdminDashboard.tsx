'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Lock, BarChart3, Settings, Users, Trophy, QrCode, Monitor, Sparkles, Loader2, CheckCircle, ExternalLink, Maximize2 } from 'lucide-react'
import { AdminLogin } from './AdminLogin.tsx'
import { getSystemConfig, setVotingEnabled } from '@/lib/voting'
import { getVotingResults, type VotingStats } from '@/lib/results'
import { AdminTeam } from './AdminTeam'

// Lazy load heavy components
const AdminResults     = lazy(() => import('./AdminResults').then(mod => ({ default: mod.AdminResults })))
const AdminCategories  = lazy(() => import('./AdminCategories').then(mod => ({ default: mod.AdminCategories })))
const AdminCharts      = lazy(() => import('./AdminCharts').then(mod => ({ default: mod.AdminCharts })))
const AdminVoters      = lazy(() => import('./AdminVoters').then(mod => ({ default: mod.AdminVoters })))
const AdminMaintenance = lazy(() => import('./AdminMaintenance').then(mod => ({ default: mod.AdminMaintenance })))
const AdminConclusionVideo = lazy(() => import('./AdminConclusionVideo').then(mod => ({ default: mod.AdminConclusionVideo })))
const AdminDiplomasVideo   = lazy(() => import('./AdminDiplomasVideo').then(mod => ({ default: mod.AdminDiplomasVideo })))

type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts' | 'maintenance' | 'team' | 'conclusion' | 'qr'

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [loading, setLoading] = useState(true)
  const [votingEnabled, setVotingEnabledState] = useState(true)
  const [checkingVotingStatus, setCheckingVotingStatus] = useState(true)
  const [votingStats, setVotingStats] = useState<VotingStats | null>(null)
  const [generatingVideos, setGeneratingVideos] = useState(false)

  useEffect(() => {
    // Check for admin authentication
    const adminToken = window.localStorage.getItem('admin_token')
    if (adminToken) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  // Check voting status on auth
  useEffect(() => {
    if (isAuthenticated) {
      checkVotingStatus()
    }
  }, [isAuthenticated])

  const handleLogin = (token: string) => {
    window.localStorage.setItem('admin_token', token)
    setIsAuthenticated(true)
  }

  const checkVotingStatus = async () => {
    try {
      const config = await getSystemConfig()
      setVotingEnabledState(config?.votingEnabled ?? true)
    } catch (error) {
      console.error('Error checking voting status:', error)
    } finally {
      setCheckingVotingStatus(false)
    }
  }

  const [togglingVoting, setTogglingVoting] = useState(false)

  const handleToggleVoting = async () => {
    if (togglingVoting) return
    setTogglingVoting(true)
    const newState = !votingEnabled
    const success = await setVotingEnabled(newState, 'admin')
    if (!success) { setTogglingVoting(false); return }
    setVotingEnabledState(newState)

    // When closing voting, fetch real results and generate videos
    if (!newState) {
      setGeneratingVideos(true)
      try {
        const stats = await getVotingResults()
        setVotingStats(stats)
        setActiveTab('conclusion')
      } catch (err) {
        console.error('Error fetching voting results:', err)
      } finally {
        setGeneratingVideos(false)
      }
    }
    setTogglingVoting(false)
  }

  const handleLogout = () => {
    window.localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setActiveTab('dashboard')
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="inline-flex items-center gap-3">
          <div className="w-8 h-8 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink font-semibold">Cargando...</span>
        </div>
      </main>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-[#090417] to-black">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-neon-pink/20 bg-black/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center gap-4">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-neon-pink/20 border border-neon-pink/30 flex-shrink-0">
              <Lock className="h-5 sm:h-6 w-5 sm:w-6 text-neon-pink" />
            </div>
            <h1 className="text-lg sm:text-2xl font-display font-bold text-white truncate">
              Panel Admin
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm sm:text-base whitespace-nowrap flex-shrink-0"
          >
            <LogOut className="h-4 sm:h-5 w-4 sm:w-5" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
            <span className="sm:hidden">Salir</span>
          </button>
        </div>
      </header>

       <div className="mx-auto max-w-7xl">
        {/* Voting Status Toggle */}
        <div className="flex justify-center py-4">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-black/50 backdrop-blur-xl border border-neon-purple/30"
          >
            <span className={`flex items-center gap-2 text-sm font-semibold ${votingEnabled ? 'text-green-400' : 'text-red-400'}`}>
              <div className={`w-2 h-2 rounded-full ${votingEnabled ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              {votingEnabled ? 'Votación ABIERTA' : 'Votación CERRADA'}
            </span>
            <button
              onClick={handleToggleVoting}
              disabled={checkingVotingStatus}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                votingEnabled ? 'bg-green-500' : 'bg-red-500'
              } ${checkingVotingStatus ? 'opacity-50 cursor-wait' : 'cursor-pointer'}`}
              title={votingEnabled ? 'Cerrar votación' : 'Abrir votación'}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                  votingEnabled ? 'translate-x-8' : 'translate-x-1'
                }`}
              />
            </button>
            <span className="text-xs text-white/60">
              {checkingVotingStatus ? 'Cargando...' : 'Click para cambiar'}
            </span>
          </motion.div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-neon-pink/20 bg-black/50 backdrop-blur-xl sticky top-16 z-30 overflow-x-auto">
          <div className="flex px-4 sm:px-6 py-2 sm:py-3 gap-1 sm:gap-2 min-w-min">
            {[
              { id: 'dashboard' as AdminTab, label: 'Panel', shortLabel: 'Panel', icon: BarChart3 },
              { id: 'categories' as AdminTab, label: 'Categorías', shortLabel: 'Cat', icon: Trophy },
              { id: 'results' as AdminTab, label: 'Resultados', shortLabel: 'Result', icon: BarChart3 },
              { id: 'voters' as AdminTab, label: 'Votantes', shortLabel: 'Vot', icon: Users },
              { id: 'charts' as AdminTab, label: 'Gráficos', shortLabel: 'Grá', icon: BarChart3 },
              { id: 'maintenance' as AdminTab, label: 'Mantenimiento', shortLabel: 'Mant', icon: Settings },
              { id: 'conclusion' as AdminTab, label: 'Concl', shortLabel: 'Concl', icon: Trophy },
              { id: 'team' as AdminTab, label: 'Team', shortLabel: 'Team', icon: Users },
              { id: 'qr' as AdminTab, label: 'QR / Live', shortLabel: 'QR', icon: QrCode },
            ].map(({ id, label, shortLabel, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                title={label}
                className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === id
                    ? 'bg-neon-pink text-black shadow-neon-pink'
                    : 'bg-black/30 text-white/70 border border-white/10 hover:border-neon-pink/50'
                }`}
              >
                <Icon className="h-3 sm:h-4 w-3 sm:w-4" />
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">{shortLabel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <AdminDashboardContent />}
            {activeTab === 'categories' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminCategories />
              </Suspense>
            )}
            {activeTab === 'results' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminResults />
              </Suspense>
            )}
            {activeTab === 'voters' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminVoters />
              </Suspense>
            )}
            {activeTab === 'charts' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminCharts />
              </Suspense>
            )}
            {activeTab === 'maintenance' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminMaintenance />
              </Suspense>
            )}
            {activeTab === 'conclusion' && (
              <div className="space-y-10">
                {/* Generating banner */}
                <AnimatePresence>
                  {generatingVideos && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-neon-pink/10 border border-neon-pink/40"
                    >
                      <Loader2 className="h-5 w-5 text-neon-pink animate-spin" />
                      <span className="text-neon-pink font-semibold">Generando videos con datos reales...</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Stats badge when data is loaded */}
                {votingStats && !generatingVideos && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center justify-center gap-6 text-sm"
                  >
                    <span className="px-4 py-2 rounded-full bg-neon-pink/15 border border-neon-pink/30 text-neon-pink font-semibold">
                      ✅ Datos reales cargados
                    </span>
                    <span className="text-white/60">{votingStats.totalVoters} votantes · {votingStats.totalVotes} votos · {votingStats.results.length} categorías</span>
                  </motion.div>
                )}

                {/* Diplomas video */}
                <div className="neon-card p-6 rounded-2xl border border-neon-purple/30">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminDiplomasVideo stats={votingStats} />
                  </Suspense>
                </div>

                {/* Conclusion stats video */}
                <div className="neon-card p-6 rounded-2xl border border-neon-pink/30">
                  <Suspense fallback={<LoadingFallback />}>
                    <AdminConclusionVideo stats={votingStats} />
                  </Suspense>
                </div>
              </div>
            )}
            {activeTab === 'team' && (
              <Suspense fallback={<LoadingFallback />}>
                <AdminTeam />
              </Suspense>
            )}
            {activeTab === 'qr' && <AdminQRTab />}
          </motion.div>
        </div>
      </div>
    </main>
  )
}

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalVoters: 0,
    totalVotes: 0,
    totalCategories: 0,
    participationRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [votingEnabled, setVotingEnabledState] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const config = await getSystemConfig()
        setVotingEnabledState(config?.votingEnabled ?? true)
        setStats({
          totalVoters: 0,
          totalVotes: 0,
          totalCategories: 0,
          participationRate: 0,
        })
      } catch (error) {
        console.error('Error loading stats:', error)
      } finally {
        setLoading(false)
      }
    }
    loadStats()
  }, [])

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-white mb-2">Panel de Control</h2>
        <p className="text-white/70">Bienvenido al panel de administración de Manija Awards 2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[ 
          { label: 'Votantes Registrados', value: stats.totalVoters, icon: Users, color: 'neon-cyan' },
          { label: 'Total de Votos', value: stats.totalVotes, icon: Trophy, color: 'neon-pink' },
          { label: 'Categorías', value: stats.totalCategories, icon: Settings, color: 'neon-purple' },
          { label: 'Participación', value: `${stats.participationRate}%`, icon: BarChart3, color: 'neon-orange' },
          { label: votingEnabled ? 'Votación Activa' : 'Votación Cerrada', value: votingEnabled ? 'ABIERTA' : 'CERRADA', icon: votingEnabled ? CheckCircle : BarChart3, color: votingEnabled ? 'green-400' : 'red-400' },
        ].map(({ label, value, icon: Icon, color }, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="neon-card p-6 text-center"
          >
            <div className={`inline-block p-3 rounded-2xl bg-${color}/20 border border-${color}/30 mb-4`}>
              <Icon className={`h-8 w-8 text-${color}`} />
            </div>
            <div className="text-2xl font-display font-bold text-white">{value}</div>
            <div className="text-white/70 text-sm mt-1">{label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="neon-card p-6">
          <h3 className="text-xl font-display font-bold text-white mb-4">Guía Rápida</h3>
          <ul className="space-y-2 text-white/80 text-sm">
            <li>• <span className="font-semibold">Categorías:</span> Crear, editar o eliminar categorías</li>
            <li>• <span className="font-semibold">Resultados:</span> Ver resultados y transparencia</li>
            <li>• <span className="font-semibold">Votantes:</span> Revisar votantes registrados</li>
            <li>• <span className="font-semibold">Gráficos:</span> Visualizar datos dinámicos</li>
            <li>• <span className="font-semibold">Diplomas:</span> Generar diplomas digitales</li>
          </ul>
        </div>

        <div className="neon-card p-6">
          <h3 className="text-xl font-display font-bold text-white mb-4">Información del Sistema</h3>
          <div className="space-y-2 text-white/80 text-sm">
            <p><span className="text-neon-pink font-semibold">Evento:</span> Manija Awards 2026</p>
            <p><span className="text-neon-pink font-semibold">Base de Datos:</span> Firebase Firestore</p>
            <p><span className="text-neon-pink font-semibold">Almacenamiento:</span> Seguro en la nube</p>
            <p><span className="text-neon-pink font-semibold">Estado:</span> <span className="text-green-400">En vivo</span></p>
           </div>
        </div>
      </div>

      <div className="neon-card p-6 border-2 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-display font-bold text-yellow-400 mb-2">🏆 Diplomas Digitales</h3>
            <p className="text-white/70 text-sm">
              Los diplomas digitales se generan automáticamente. Cada ganador recibe un diploma oficial.
            </p>
          </div>
          <a
            href="/admin/results"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/30 flex items-center gap-2 whitespace-nowrap"
          >
            <Trophy className="h-5 w-5" />
            Generar Diplomas
          </a>
        </div>
      </div>
    </div>
  )
}

/* ── QR / Live Tab ── */
function AdminQRTab() {
  const votingUrl = typeof window !== 'undefined'
    ? window.location.origin
    : 'https://manija-awards-2026.vercel.app'
  const liveUrl = `${votingUrl}/live`

  const openLive = () => window.open(liveUrl, '_blank', 'noopener')
  const openLiveFullscreen = () => {
    const w = window.open(liveUrl, '_blank', 'noopener')
    w?.addEventListener('load', () => { w.document.documentElement.requestFullscreen?.() })
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="text-center">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-neon-pink/20 border border-neon-pink/30">
            <QrCode className="h-8 w-8 text-neon-pink" />
          </div>
          <h2 className="text-3xl font-display font-bold text-white">QR & Pantalla en Vivo</h2>
        </div>
        <p className="text-white/60 text-sm">Muestra el QR para que los asistentes voten, y proyecta los resultados en tiempo real.</p>
      </div>

      {/* QR Code */}
      <div className="neon-card p-8 text-center">
        <h3 className="text-xl font-display font-bold text-white mb-2">Código QR — Votación</h3>
        <p className="text-white/50 text-sm mb-6">Escanear para votar: <span className="text-neon-cyan font-mono">{votingUrl}</span></p>

        {/* QR grande generado via API pública */}
        <div className="inline-block p-4 bg-white rounded-2xl shadow-2xl shadow-neon-pink/20 mb-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(votingUrl)}&bgcolor=ffffff&color=000000&margin=4`}
            alt="QR Votación Manija Awards 2026"
            width={280}
            height={280}
            className="rounded-xl"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(votingUrl)}&bgcolor=ffffff&color=000000&margin=10`}
            download="qr-manija-awards-2026.png"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neon-pink text-black font-bold hover:bg-neon-pink/80 transition-all text-sm"
          >
            <QrCode className="h-4 w-4" />
            Descargar QR (600×600)
          </a>
          <a
            href={votingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-all text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir portal de votación
          </a>
        </div>
      </div>

      {/* Live screen */}
      <div className="neon-card p-8 text-center border-neon-purple/40">
        <div className="inline-flex items-center gap-2 mb-2">
          <Monitor className="h-6 w-6 text-neon-purple" />
          <h3 className="text-xl font-display font-bold text-white">Pantalla en Vivo — /live</h3>
        </div>
        <p className="text-white/50 text-sm mb-6">
          Proyecta esta pantalla en el evento para mostrar los resultados en tiempo real.
        </p>

        {/* Preview miniatura */}
        <div className="relative rounded-xl overflow-hidden border border-neon-purple/30 bg-black mb-6 aspect-video max-w-lg mx-auto">
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-gradient-to-br from-black via-[#090417] to-black">
            <Sparkles className="h-10 w-10 text-neon-pink animate-pulse" />
            <p className="text-white font-display font-bold text-lg">MANIJA AWARDS <span className="text-neon-pink">2026</span></p>
            <p className="text-white/40 text-xs uppercase tracking-widest">Resultados en tiempo real</p>
          </div>
          <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-green-500/20 border border-green-500/30 text-green-400 text-[10px] font-bold tracking-wider uppercase">
            EN VIVO
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={openLive}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-neon-purple text-white font-bold hover:bg-neon-purple/80 transition-all text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            Abrir /live
          </button>
          <button
            onClick={openLiveFullscreen}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-neon-purple/50 text-neon-purple hover:bg-neon-purple/10 transition-all text-sm"
          >
            <Maximize2 className="h-4 w-4" />
            Abrir en pantalla completa
          </button>
        </div>
        <p className="text-white/30 text-xs mt-3">
          URL: <span className="font-mono">{liveUrl}</span>
        </p>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="inline-flex items-center gap-4">
        <div className="w-8 h-8 border-3 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
        <span className="text-neon-pink font-semibold text-lg">Cargando contenido...</span>
      </div>
    </div>
  )
}