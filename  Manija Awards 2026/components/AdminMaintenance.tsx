'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Database, RefreshCw, AlertTriangle, Trophy, Plus, Edit, Save, X } from 'lucide-react'
import { deleteAllVotes, deleteAllVoters, deleteAllCategories, deleteAllData, resetAllVotes, saveCategory, deleteCategory } from '@/lib/voting'
import { Category, Nominee } from '@/lib/types'

export function AdminMaintenance() {
  const [loading, setLoading] = useState<string | null>(null)
  const [result, setResult] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategory, setNewCategory] = useState<Omit<Category, 'id'> | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const { getCategories } = await import('@/lib/voting')
      const cats = await getCategories()
      setCategories(cats)
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const handleResetVotes = async () => {
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR TODOS los votos? Esta acción es irreversible.')) return
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
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR TODOS los votantes? Esta acción es irreversible.')) return
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
    if (!window.confirm('¿Estás seguro de que deseas ELIMINAR TODAS las categorías? Esta acción es irreversible.')) return
    setLoading('categories')
    setResult(null)
    try {
      await deleteAllCategories()
      await loadCategories()
      setResult({ type: 'success', message: 'Se eliminaron todas las categorías exitosamente' })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al eliminar categorías' })
    } finally {
      setLoading(null)
    }
  }

  const handleNuclearReset = async () => {
    if (!window.confirm('⚠️ OPCIÓN NUCLEAR ⚠️\n\n¿Estás ABSOLUTAMENTE seguro de que deseas ELIMINAR TODO?\n\n- Todos los votos\n- Todos los votantes\n- Todas las categorías\n\nEsta acción es IRREVERSIBLE.')) return
    if (!window.confirm('Por favor, confirma nuevamente escribiendo "BORRAR TODO"')) return
    setLoading('nuclear')
    setResult(null)
    try {
      const counts = await deleteAllData()
      await loadCategories()
      setResult({ type: 'success', message: `Reinicio completo: ${counts.voters} votantes, ${counts.votes} votos, ${counts.categories} categorías eliminados` })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al reiniciar todo' })
    } finally {
      setLoading(null)
    }
  }

  const handleSaveCategory = async () => {
    if (!editingCategory && !newCategory) return
    setLoading('save')
    try {
      const cat = editingCategory || newCategory!
      await saveCategory({
        ...cat,
        nominees: cat.nominees || []
      } as Category)
      await loadCategories()
      setResult({ type: 'success', message: `Categoría "${cat.name}" guardada exitosamente` })
      setEditingCategory(null)
      setNewCategory(null)
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al guardar categoría' })
    } finally {
      setLoading(null)
    }
  }

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!window.confirm(`¿Eliminar categoría "${name}"? Esta acción eliminará todos sus votos.`)) return
    try {
      await deleteCategory(id)
      await loadCategories()
      setResult({ type: 'success', message: `Categoría "${name}" eliminada` })
    } catch (error: any) {
      setResult({ type: 'error', message: error.message || 'Error al eliminar categoría' })
    }
  }

  const startNewCategory = () => {
    setNewCategory({
      id: 'cat_' + Date.now(),
      name: '',
      description: '',
      order: categories.length + 1,
      nominees: []
    })
    setEditingCategory(null)
  }

  const addNominee = (cat: Category | Omit<Category, 'id'>) => {
    const nominee: Nominee = {
      id: 'nom_' + Date.now(),
      name: '',
      description: '',
      imageUrl: ''
    }
    if ('id' in cat) {
      setEditingCategory({ ...cat, nominees: [...cat.nominees, nominee] })
    } else {
      setNewCategory({ ...cat, nominees: [...cat.nominees, nominee] })
    }
  }

  const updateNominee = (cat: Category | Omit<Category, 'id'>, nomIdx: number, field: keyof Nominee, value: string) => {
    const nominees = [...cat.nominees]
    nominees[nomIdx] = { ...nominees[nomIdx], [field]: value }
    if ('id' in cat) {
      setEditingCategory({ ...cat, nominees })
    } else {
      setNewCategory({ ...cat, nominees })
    }
  }

  const removeNominee = (cat: Category | Omit<Category, 'id'>, nomIdx: number) => {
    const nominees = cat.nominees.filter((_, i) => i !== nomIdx)
    if ('id' in cat) {
      setEditingCategory({ ...cat, nominees })
    } else {
      setNewCategory({ ...cat, nominees })
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="neon-card p-6 border border-red-500/30 bg-red-500/5">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400" />
          <h3 className="text-xl font-display font-bold text-red-400">ZONA DE MANTENIMIENTO</h3>
        </div>
        <p className="text-white/70 text-sm">Estas acciones afectan la base de datos. Úsalas con precaución.</p>
      </div>

      {/* CRUD: Crear Categoría */}
      <div className="neon-card p-6 border-2 border-green-500/30 bg-green-500/5">
        <div className="flex items-center gap-3 mb-4">
          <Plus className="h-6 w-6 text-green-400" />
          <h4 className="text-lg font-display font-bold text-green-400">Crear Nueva Categoría</h4>
        </div>
        {newCategory ? (
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Nombre de la categoría"
              value={newCategory.name}
              onChange={e => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
            />
            <input
              type="text"
              placeholder="Descripción"
              value={newCategory.description}
              onChange={e => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white"
            />
            <div>
              <label className="text-white/70 text-sm">Nominados</label>
              {newCategory.nominees.map((nom, idx) => (
                <div key={idx} className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={nom.name}
                    onChange={e => updateNominee(newCategory, idx, 'name', e.target.value)}
                    className="flex-1 px-3 py-1 rounded bg-black/30 border border-white/10 text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Descripción"
                    value={nom.description}
                    onChange={e => updateNominee(newCategory, idx, 'description', e.target.value)}
                    className="flex-1 px-3 py-1 rounded bg-black/30 border border-white/10 text-white text-sm"
                  />
                  <button onClick={() => removeNominee(newCategory, idx)} className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button onClick={() => addNominee(newCategory)} className="mt-2 text-sm text-cyan-400 hover:text-cyan-300">
                + Agregar nominado
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={handleSaveCategory} disabled={loading === 'save' || !newCategory.name}
                className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 flex items-center gap-2 disabled:opacity-50">
                {loading === 'save' ? <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" /> : <Save className="h-4 w-4" />}
                Guardar
              </button>
              <button onClick={() => setNewCategory(null)} className="px-4 py-2 rounded-lg bg-black/30 border border-white/10 text-white/70 hover:bg-black/50">
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <button onClick={startNewCategory} className="px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30 flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Crear Categoría
          </button>
        )}
      </div>

      {/* CRUD: Lista y Edición de Categorías */}
      <div className="neon-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Database className="h-6 w-6 text-cyan-400" />
          <h4 className="text-lg font-display font-bold text-cyan-400">Categorías Existentes</h4>
        </div>
        <div className="space-y-3">
          {categories.map(cat => (
            <div key={cat.id} className="p-4 rounded-lg bg-black/20 border border-white/10">
              {editingCategory?.id === cat.id ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="w-full px-3 py-1 rounded bg-black/30 border border-white/10 text-white"
                  />
                  <input
                    type="text"
                    value={editingCategory.description}
                    onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                    placeholder="Descripción"
                    className="w-full px-3 py-1 rounded bg-black/30 border border-white/10 text-white/70"
                  />
                  <div>
                    <label className="text-white/70 text-sm">Nominados</label>
                    {editingCategory.nominees.map((nom, idx) => (
                      <div key={idx} className="flex gap-2 mt-2">
                        <input
                          type="text"
                          value={nom.name}
                          onChange={e => updateNominee(editingCategory, idx, 'name', e.target.value)}
                          placeholder="Nombre"
                          className="flex-1 px-3 py-1 rounded bg-black/30 border border-white/10 text-white text-sm"
                        />
                        <input
                          type="text"
                          value={nom.description}
                          onChange={e => updateNominee(editingCategory, idx, 'description', e.target.value)}
                          placeholder="Descripción"
                          className="flex-1 px-3 py-1 rounded bg-black/30 border border-white/10 text-white text-sm"
                        />
                        <button onClick={() => removeNominee(editingCategory, idx)} className="p-2 text-red-400 hover:bg-red-500/20 rounded">
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addNominee(editingCategory)} className="mt-2 text-sm text-cyan-400 hover:text-cyan-300">
                      + Agregar nominado
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={handleSaveCategory} disabled={loading === 'save'}
                      className="px-3 py-1 rounded bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 text-sm flex items-center gap-1 disabled:opacity-50">
                      {loading === 'save' ? <div className="w-3 h-3 border border-cyan-400 border-t-transparent rounded-full animate-spin" /> : <Save className="h-3 w-3" />}
                      Guardar
                    </button>
                    <button onClick={() => setEditingCategory(null)} className="px-3 py-1 rounded bg-black/30 border border-white/10 text-white/70 text-sm hover:bg-black/50">
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-white">{cat.name}</h5>
                    <p className="text-white/60 text-sm">{cat.description}</p>
                    <p className="text-white/40 text-xs mt-1">{cat.nominees?.length || 0} nominados</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingCategory(cat)} className="p-2 text-cyan-400 hover:bg-cyan-500/20 rounded" title="Editar">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="p-2 text-red-400 hover:bg-red-500/20 rounded" title="Eliminar">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resetear Votos */}
      <div className="neon-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <RefreshCw className="h-6 w-6 text-blue-400" />
          <div>
            <h4 className="text-lg font-display font-bold text-white">Resetear Votos</h4>
            <p className="text-white/60 text-sm">Eliminar todos los votos de todas las categorías</p>
          </div>
        </div>
        <button onClick={handleResetVotes} disabled={loading === 'votes'}
          className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:bg-blue-500/30 transition-all disabled:opacity-50 flex items-center gap-2">
          {loading === 'votes' ? <><div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />Procesando...</> : 'Resetear Todos los Votos'}
        </button>
      </div>

      {/* Eliminar Votantes */}
      <div className="neon-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <Database className="h-6 w-6 text-orange-400" />
          <div>
            <h4 className="text-lg font-display font-bold text-white">Eliminar Votantes</h4>
            <p className="text-white/60 text-sm">Eliminar todos los votantes registrados</p>
          </div>
        </div>
        <button onClick={handleDeleteVoters} disabled={loading === 'voters'}
          className="px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-400 hover:bg-orange-500/30 transition-all disabled:opacity-50 flex items-center gap-2">
          {loading === 'voters' ? <><div className="w-4 h-4 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />Procesando...</> : 'Eliminar Todos los Votantes'}
        </button>
      </div>

      {/* Generar Diplomas */}
      <div className="neon-card p-6 border-2 border-yellow-500/30 bg-yellow-500/5">
        <div className="flex items-center gap-4 mb-4">
          <Trophy className="h-6 w-6 text-yellow-400" />
          <div>
            <h4 className="text-lg font-display font-bold text-white">Generar Diplomas</h4>
            <p className="text-white/60 text-sm">Generar diplomas PDF para todos los ganadores</p>
          </div>
        </div>
        <a href="/admin/results" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-semibold hover:from-yellow-400 hover:to-yellow-500 transition-all shadow-lg shadow-yellow-500/30">
          <Trophy className="h-5 w-5" />
          Ir a Generar Diplomas
        </a>
      </div>

      {/* Reinicio Nuclear */}
      <div className="neon-card p-6 border-2 border-red-500/50 bg-red-500/10">
        <div className="flex items-center gap-4 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-400 animate-pulse" />
          <div>
            <h4 className="text-lg font-display font-bold text-red-400">REINICIO NUCLEAR</h4>
            <p className="text-red-400/70 text-sm">ELIMINAR TODO (votos, votantes, categorías)</p>
          </div>
        </div>
        <button onClick={handleNuclearReset} disabled={loading === 'nuclear'}
          className="w-full px-4 py-3 rounded-lg border-2 border-red-500/50 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50 font-semibold tracking-wide">
          {loading === 'nuclear' ? <><div className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin inline-block mr-2" />REINICIANDO...</> : '⚠️ REINICIAR TODO ⚠️'}
        </button>
      </div>

      {/* Resultado */}
      {result && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl ${result.type === 'success' ? 'bg-green-500/10 border border-green-500/30' : 'bg-red-500/10 border border-red-500/30'}`}>
          <p className={`font-semibold ${result.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
            {result.type === 'success' ? '✅ Éxito' : '❌ Error'}
          </p>
          <p className="text-white/80 text-sm mt-1">{result.message}</p>
        </motion.div>
      )}
    </motion.div>
  )
}
