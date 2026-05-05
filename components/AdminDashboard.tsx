'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { LogOut, Lock, BarChart3, Settings, Users, Trophy } from 'lucide-react'
import { AdminLogin } from './AdminLogin'
import { AdminResults } from './AdminResults'
import { AdminCategories } from './AdminCategories'
import { AdminCharts } from './AdminCharts'
import { AdminVoters } from './AdminVoters'

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
        <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neon-pink/20 border border-neon-pink/30">
              <Lock className="h-6 w-6 text-neon-pink" />
            </div>
            <h1 className="text-2xl font-display font-bold text-white">
              Panel Admin - Manija Awards 2026
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="h-5 w-5" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl">
        {/* Navigation Tabs */}
        <div className="border-b border-neon-pink/20 bg-black/50 backdrop-blur-xl sticky top-16 z-30">
          <div className="flex overflow-x-auto px-6 py-3 gap-2">
            {[
              { id: 'dashboard' as AdminTab, label: 'Panel de Control', icon: BarChart3 },
              { id: 'categories' as AdminTab, label: 'Categorías', icon: Trophy },
              { id: 'results' as AdminTab, label: 'Resultados', icon: BarChart3 },
              { id: 'voters' as AdminTab, label: 'Votantes', icon: Users },
              { id: 'charts' as AdminTab, label: 'Gráficos', icon: BarChart3 },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === id
                    ? 'bg-neon-pink text-black shadow-neon-pink'
                    : 'bg-black/30 text-white/70 border border-white/10 hover:border-neon-pink/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'dashboard' && <AdminDashboardContent />}
            {activeTab === 'categories' && <AdminCategories />}
            {activeTab === 'results' && <AdminResults />}
            {activeTab === 'voters' && <AdminVoters />}
            {activeTab === 'charts' && <AdminCharts />}
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
