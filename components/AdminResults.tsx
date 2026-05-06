'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Download, Filter, Eye, RefreshCcw, Trophy } from 'lucide-react'
import { getAllVotesWithVoters, getCategories, deleteAllVotes } from '@/lib/voting'
import { Category } from '@/lib/types'
import { useDiplomaGenerator } from '@/hooks/useDiplomaGenerator'

export function AdminResults() {
  const [votes, setVotes] = useState<any[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [filterVoter, setFilterVoter] = useState('')

  const { generateDiplomaPDF, generateAllDiplomas } = useDiplomaGenerator()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [votesData, categoriesData] = await Promise.all([
        getAllVotesWithVoters(),
        getCategories(),
      ])
      setVotes(votesData)
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResetVotes = async () => {
    if (!window.confirm('¿Estás seguro de que deseas borrar todos los votos? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      setLoading(true)
      await deleteAllVotes()
      await loadData()
      setFilterCategory(null)
      setFilterVoter('')
      alert('Votaciones reiniciadas correctamente.')
    } catch (error) {
      console.error('Error al reiniciar votaciones:', error)
      alert('No se pudo reiniciar las votaciones. Revisa la consola para más detalles.')
    } finally {
      setLoading(false)
    }
  }

  const filteredVotes = votes.filter(vote => {
    const matchesCategory = !filterCategory || vote.categoryId === filterCategory
    const matchesVoter = !filterVoter || 
      vote.voterName.toLowerCase().includes(filterVoter.toLowerCase()) ||
      vote.voterEmail.toLowerCase().includes(filterVoter.toLowerCase())
    return matchesCategory && matchesVoter
  })

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || categoryId
  }

  const getNomineeName = (categoryId: string, nomineeId: string) => {
    const category = categories.find(c => c.id === categoryId)
    const nominee = category?.nominees?.find(n => n.id === nomineeId)
    return nominee?.name || nomineeId
  }

  // Calculate winners for each category
  const getWinners = () => {
    const winnerMap = new Map<string, {
      categoryName: string
      nomineeName: string
      votes: number
    }>()
    
    categories.forEach(category => {
      const categoryVotes = votes.filter(v => v.categoryId === category.id)
      if (categoryVotes.length === 0) return
      
      const voteCount: Record<string, number> = {}
      categoryVotes.forEach(vote => {
        voteCount[vote.nomineeId] = (voteCount[vote.nomineeId] || 0) + 1
      })
      
      let topNomineeId = ''
      let maxVotes = 0
      for (const [nomineeId, count] of Object.entries(voteCount)) {
        if (count > maxVotes) {
          maxVotes = count
          topNomineeId = nomineeId
        }
      }
      
      if (maxVotes > 0) {
        winnerMap.set(category.id, {
          categoryName: category.name,
          nomineeName: getNomineeName(category.id, topNomineeId),
          votes: maxVotes
        })
      }
    })
    
    return winnerMap
  }

  const handleGenerateAllDiplomas = async () => {
    const winners = getWinners()
    if (winners.size === 0) {
      alert('No hay ganadores para generar diplomas')
      return
    }
    
    if (!window.confirm(`¿Generar diplomas para ${winners.size} categoría(es)?`)) {
      return
    }
    
    const results = Array.from(winners.values())
    await generateAllDiplomas(results.map(r => ({
      categoryName: r.categoryName,
      winnerName: r.nomineeName,
      votes: r.votes,
      date: new Date().toLocaleDateString('es-ES')
    })))
  }

  const downloadCSV = () => {
    const headers = ['ID de Voto', 'Votante', 'Email', 'Categoría', 'Nominado', 'Fecha']
    const rows = filteredVotes.map(vote => [
      vote.voteId,
      vote.voterName,
      vote.voterEmail,
      getCategoryName(vote.categoryId),
      getNomineeName(vote.categoryId, vote.nomineeId),
      new Date(vote.createdAt).toLocaleString(),
    ])

    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'resultados-votacion.csv'
    a.click()
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink">Cargando resultados...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-3xl font-display font-bold text-white">Resultados Detallados</h2>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={downloadCSV}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-cyan/20 text-neon-cyan hover:bg-neon-cyan/30 transition-all font-semibold text-sm"
          >
            <Download className="h-5 w-5" />
            Descargar CSV
          </button>
          <button
            onClick={handleGenerateAllDiplomas}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all font-semibold text-sm"
          >
            <Trophy className="h-5 w-5" />
            Diplomas
          </button>
          <button
            onClick={handleResetVotes}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30 transition-all font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className="h-5 w-5" />
            Resetear Votos
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="neon-card p-6 space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-neon-pink" />
          <span className="font-semibold text-white">Filtros</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-2">Categoría</label>
            <select
              value={filterCategory || ''}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className="neon-input w-full px-4 py-3 rounded-lg"
            >
              <option value="">Todas las categorías</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-neon-cyan mb-2">Buscar Votante</label>
            <input
              type="text"
              value={filterVoter}
              onChange={(e) => setFilterVoter(e.target.value)}
              placeholder="Nombre o email"
              className="neon-input w-full px-4 py-3 rounded-lg"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="neon-card p-6 text-center">
          <div className="text-3xl font-display font-bold text-neon-pink mb-2">{filteredVotes.length}</div>
          <div className="text-white/70 text-sm">Votos en Resultados</div>
        </div>
        <div className="neon-card p-6 text-center">
          <div className="text-3xl font-display font-bold text-neon-cyan mb-2">
            {new Set(filteredVotes.map(v => v.voterId)).size}
          </div>
          <div className="text-white/70 text-sm">Votantes Únicos</div>
        </div>
        <div className="neon-card p-6 text-center">
          <div className="text-3xl font-display font-bold text-neon-purple mb-2">
            {filteredVotes.length > 0 ? (filteredVotes.length / new Set(filteredVotes.map(v => v.voterId)).size).toFixed(1) : 0}
          </div>
          <div className="text-white/70 text-sm">Promedio de Votos</div>
        </div>
      </div>

      {/* Votes Table */}
      <div className="neon-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-black/50">
                <th className="px-6 py-4 text-left font-semibold text-neon-cyan">Votante</th>
                <th className="px-6 py-4 text-left font-semibold text-neon-cyan">Email</th>
                <th className="px-6 py-4 text-left font-semibold text-neon-cyan">Categoría</th>
                <th className="px-6 py-4 text-left font-semibold text-neon-cyan">Nominado</th>
                <th className="px-6 py-4 text-left font-semibold text-neon-cyan">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredVotes.map((vote, index) => (
                <motion.tr
                  key={vote.voteId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-white font-semibold">{vote.voterName}</td>
                  <td className="px-6 py-4 text-white/70 text-xs">{vote.voterEmail}</td>
                  <td className="px-6 py-4 text-white/80">{getCategoryName(vote.categoryId)}</td>
                  <td className="px-6 py-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-neon-pink/20 text-neon-pink text-xs font-semibold">
                      {getNomineeName(vote.categoryId, vote.nomineeId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {new Date(vote.createdAt).toLocaleString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVotes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/70">No hay votos que cumplan los filtros</p>
          </div>
        )}
      </div>
    </div>
  )
}
