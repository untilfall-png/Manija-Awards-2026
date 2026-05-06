'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Database, RefreshCw, AlertTriangle, Trophy } from 'lucide-react'
import { deleteAllVotes, deleteAllVoters, deleteAllCategories, deleteAllData, resetAllVotes } from '@/lib/voting'

export function AdminMaintenance() {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)

  const handleResetVotes = async () => {
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR TODOS los votos? Esta acción es irreversible.')) {
      return
    }
    setLoading('votes')
    setResult(null)
    try {
      const count = await resetAllVotes()
      setResult({ type: 'success', message: `Se eliminaron ${count} votos exitosamente` })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al eliminar votos' })
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteVoters = async () => {
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR TODOS los votantes? Esta acción es irreversible.')) {
      return
    }
    setLoading('voters')
    setResult(null)
    try {
      await deleteAllVoters()
      setResult({ type: 'success', message: 'Se eliminaron todos los votantes exitosamente' })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al eliminar votantes' })
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteCategories = async () => {
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR TODAS las categorías? Esta acción es irreversible.')) {
      return
    }
    setLoading('categories')
    setResult(null)
    try {
      await deleteAllCategories()
      setResult({ type: 'success', message: 'Se eliminaron todas las categorías exitosamente' })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al eliminar categorías' })
    } finally {
      setLoading(null)
    }
  }

  const handleNuclearReset = async () => {
    if (!window.confirm('⚠️ OPCIÓN NUCLEAR ⚠️\\n\\n¿Estás ABSOLUTAMENTE seguro de que deseas ELIMINAR TODO?\\n\\n- Todos los votos\\n- Todos los votantes\\n- Todas las categorías\\n\\nEsta acción es IRREVERSIBLE.')) {
      return
    }
    if (!window.confirm('Por favor, confirma nuevamente escribiendo "BORRAR TODO"')) {
      return
    }
    setLoading('nuclear')
    setResult(null)
    try {
      const counts = await deleteAllData()
      setResult({ type: 'success', message: `Reinicio completo: ${counts.voters} votantes, ${counts.votes} votos, ${counts.categories} categorías eliminados` })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al reiniciar todo' })
    } finally {
      setLoading(null)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="neon-card p-6 border border-red-500/30 bg-red-500/5">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-display font-bold text-red-400">ZONA DE MANTENIMIENTO</h3>
        </div>
        <p className="text-white/70 text-sm">
          Estas acciones son irreversibles. Úsalas con precaución.
        </p>
      </div>

      {/* Resetear Votos */}
      <div className="neon-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-blue-500/20 border border-blue-500/30">
            <RefreshCw className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-white">Resetear Votos</h4>
            <p className="text-white/60 text-sm">Eliminar todos los votos de todas las categorías</p>
          </div>
        </div>
        <button
          onClick={handleResetVotes}
          disabled={loading === 'votes'}
          className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading === 'votes' ? (
            <><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />Procesando...</>
          ) : (
            'Resetear Todos los Votos'
          )}
        </button>
      </div>

      {/* Eliminar Votantes */}
      <div className="neon-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-orange-500/20 border border-orange-500/30">
            <Database className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-white">Eliminar Votantes</h4>
            <p className="text-white/60 text-sm">Eliminar todos los votantes registrados</p>
          </div>
        </div>
        <button
          onClick={handleDeleteVoters}
          disabled={loading === 'voters'}
          className="px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading === 'voters' ? (
            <><div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />Procesando...</>
          ) : (
            'Eliminar Todos los Votantes'
          )}
        </button>
      </div>

      {/* Eliminar Categorías */}
      <div className="neon-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
            <Trash2 className="h-6 w-6 text-purple-400" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-white">Eliminar Categorías</h4>
            <p className="text-white/60 text-sm">Eliminar todas las categorías existentes</p>
          </div>
        </div>
        <button
          onClick={handleDeleteCategories}
          disabled={loading === 'categories'}
          className="px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/30 text-purple-400 hover:bg-purple-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
        >
          {loading === 'categories' ? (
            <><div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />Procesando...</>
          ) : (
            'Eliminar Todas las Categorías'
          )}
        </button>
      </div>

      {/* Generar Diplomas */}
      <div className="neon-card p-6 border-2 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-yellow-500/20 border border-yellow-500/30">
            <Trophy className="h-6 w-6 text-yellow-400" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-white">Generar Diplomas</h4>
            <p className="text-white/60 text-sm">Generar diplomas PDF para todos los ganadores</p>
          </div>
        </div>
        <a
          href="/admin/results"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/30"
        >
          <Trophy className="h-5 w-5" />
          Ir a Generar Diplomas
        </a>
      </div>

      {/* Reinicio Nuclear */}
      <div className="neon-card p-6 border-2 border-red-500/50 bg-red-500/10">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-xl bg-red-500/30 border border-red-500/50">
            <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
          </div>
          <div>
            <h4 className="text-lg font-display font-bold text-red-400">REINICIO NUCLEAR</h4>
            <p className="text-red-400/70 text-sm">ELIMINAR TODO (votos, votantes, categorías)</p>
          </div>
        </div>
        <button
          onClick={handleNuclearReset}
          disabled={loading === 'nuclear'}
          className="w-full px-4 py-3 rounded-lg border-2 border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50 font-semibold tracking-wide"
        >
          {loading === 'nuclear' ? (
            <><div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block mr-2" />REINICIANDO...</>
          ) : (
            '⚠️ REINICIAR TODO ⚠️'
          )}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${result.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}
        >
          <p className={`font-semibold ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {result.type === 'success' ? '✅ Éxito' : '❌ Error'}
          </p>
          <p className="text-white/80 text-sm mt-1">{result.message}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
