'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Lock, BarChart3, Settings, Users, Trophy } from 'lucide-react'
import { AdminLogin } from './AdminLogin'

// Lazy load heavy components
const AdminResults = lazy(() => import('./AdminResults').then(mod => ({ default: mod.AdminResults })))
const AdminCategories = lazy(() => import('./AdminCategories').then(mod => ({ default: mod.AdminCategories })))
const AdminCharts = lazy(() => import('./AdminCharts').then(mod => ({ default: mod.AdminCharts })))
const AdminVoters = lazy(() => import('./AdminVoters').then(mod => ({ default: mod.AdminVoters })))

type AdminTab = 'dashboard' | 'categories' | 'results' | 'voters' | 'charts'

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for admin authentication
    const adminToken = window.localStorage.getItem('admin_token')
    if (adminToken) {
      setIsAuthenticated(true)
    }
    setLoading(false)
  }, [])

  const handleLogin = (token: string) => {
    window.localStorage.setItem('admin_token', token)
    setIsAuthenticated(true)
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
        {/* Navigation Tabs */}
        <div className="border-b border-neon-pink/20 bg-black/50 backdrop-blur-xl sticky top-16 z-30 overflow-x-auto">
          <div className="flex px-4 sm:px-6 py-2 sm:py-3 gap-1 sm:gap-2 min-w-min">
            {[
              { id: 'dashboard' as AdminTab, label: 'Panel', shortLabel: 'Panel', icon: BarChart3 },
              { id: 'categories' as AdminTab, label: 'Categorías', shortLabel: 'Cat', icon: Trophy },
              { id: 'results' as AdminTab, label: 'Resultados', shortLabel: 'Result', icon: BarChart3 },
              { id: 'voters' as AdminTab, label: 'Votantes', shortLabel: 'Vot', icon: Users },
              { id: 'charts' as AdminTab, label: 'Gráficos', shortLabel: 'Grá', icon: BarChart3 },
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

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simulated stats - In production, fetch from Firestore
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
            <li>• <span className="font-semibold">Categorías:</span> Crear, editar o eliminar categorías de votación</li>
            <li>• <span className="font-semibold">Resultados:</span> Ver resultados detallados y transparencia de votos</li>
            <li>• <span className="font-semibold">Votantes:</span> Revisar todos los votantes registrados</li>
            <li>• <span className="font-semibold">Gráficos:</span> Visualizar datos con gráficos dinámicos</li>
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
