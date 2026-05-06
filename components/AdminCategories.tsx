'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { getCategories, saveCategory, deleteCategory } from '@/lib/voting'
import { Category, Nominee } from '@/lib/types'

export function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Category> | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
      setLoading(false)
    } catch (error) {
      console.error('Error loading categories:', error)
      setCategories([])
      setLoading(false)
    }
  }

  const handleNew = () => {
    setFormData({
      id: `cat-${Date.now()}`,
      name: '',
      description: '',
      order: categories.length + 1,
      nominees: [],
    })
    setEditingId(null)
    setShowForm(true)
  }

  const handleEdit = (category: Category) => {
    setFormData({ ...category })
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleSave = async () => {
    if (!formData || !formData.name || !formData.id) return

    try {
      const categoryToSave: Category = {
        id: formData.id,
        name: formData.name,
        description: formData.description || '',
        order: formData.order || 1,
        nominees: formData.nominees || [],
      }

      await saveCategory(categoryToSave)
      await loadCategories()
      setShowForm(false)
      setFormData(null)
      setEditingId(null)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Error al guardar la categoría. Por favor, intente de nuevo.')
    }
  }

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta categoría?')) return

    try {
      await deleteCategory(categoryId)
      await loadCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Error al eliminar la categoría. Por favor, intente de nuevo.')
    }
  }

  const addNominee = () => {
    if (!formData) return
    const newNominee: Nominee = {
      id: `nom-${Date.now()}`,
      name: '',
      description: '',
    }
    setFormData({
      ...formData,
      nominees: [...(formData.nominees || []), newNominee],
    })
  }

  const removeNominee = (nomineeId: string) => {
    if (!formData) return
    setFormData({
      ...formData,
      nominees: (formData.nominees || []).filter(n => n.id !== nomineeId),
    })
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-bold text-white">Gestión de Categorías</h2>
        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-neon-pink text-black font-semibold hover:bg-neon-pink/90 transition-all"
        >
          <Plus className="h-5 w-5" />
          Nueva Categoría
        </button>
      </div>

      {/* Form Modal */}
      {showForm && formData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="neon-card w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display font-bold text-white">
                  {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormData(null)
                    setEditingId(null)
                  }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="h-6 w-6 text-white" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-neon-cyan mb-2">Nombre</label>
                  <input
                    type="text"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="neon-input w-full px-4 py-3 rounded-lg"
                    placeholder="Nombre de la categoría"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neon-cyan mb-2">Descripción</label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="neon-input w-full px-4 py-3 rounded-lg h-24"
                    placeholder="Descripción de la categoría"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neon-cyan mb-2">Orden</label>
                  <input
                    type="number"
                    value={formData.order || 1}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                    className="neon-input w-full px-4 py-3 rounded-lg"
                    min="1"
                  />
                </div>

                {/* Nominees */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-semibold text-neon-cyan">Nominados</label>
                    <button
                      onClick={addNominee}
                      className="text-xs px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-all"
                    >
                      Agregar Nominado
                    </button>
                  </div>

                  <div className="space-y-3 bg-black/30 p-4 rounded-lg max-h-48 overflow-y-auto">
                    {(formData.nominees || []).map((nominee, index) => (
                      <div key={nominee.id} className="space-y-2 p-3 border border-white/10 rounded-lg">
                        <input
                          type="text"
                          value={nominee.name || ''}
                          onChange={(e) => {
                            const updated = [...(formData.nominees || [])]
                            updated[index] = { ...nominee, name: e.target.value }
                            setFormData({ ...formData, nominees: updated })
                          }}
                          placeholder="Nombre del nominado"
                          className="neon-input w-full px-3 py-2 rounded text-sm"
                        />
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={nominee.description || ''}
                            onChange={(e) => {
                              const updated = [...(formData.nominees || [])]
                              updated[index] = { ...nominee, description: e.target.value }
                              setFormData({ ...formData, nominees: updated })
                            }}
                            placeholder="Descripción"
                            className="neon-input flex-1 px-3 py-2 rounded text-sm"
                          />
                          <button
                            onClick={() => removeNominee(nominee.id)}
                            className="p-2 text-red-400 hover:bg-red-500/20 rounded transition-all"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => {
                    setShowForm(false)
                    setFormData(null)
                    setEditingId(null)
                  }}
                  className="px-6 py-3 rounded-lg border border-white/20 text-white hover:border-neon-pink/50 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-pink text-black font-semibold hover:bg-neon-pink/90 transition-all"
                >
                  <Save className="h-5 w-5" />
                  Guardar
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="neon-card p-6 flex items-center justify-between group hover:border-neon-pink/50 transition-all"
          >
            <div className="flex-1">
              <h4 className="text-lg font-display font-bold text-white">
                {category.order}. {category.name}
              </h4>
              <p className="text-white/70 text-sm">{category.description}</p>
              <p className="text-white/50 text-xs mt-2">{category.nominees?.length || 0} nominados</p>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                onClick={() => handleEdit(category)}
                className="p-3 rounded-lg bg-neon-purple/20 text-neon-purple hover:bg-neon-purple/30 transition-all"
              >
                <Edit2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(category.id)}
                className="p-3 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {categories.length === 0 && (
        <div className="neon-card p-12 text-center">
          <p className="text-white/70 mb-4">No hay categorías creadas aún</p>
          <button
            onClick={handleNew}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-neon-pink text-black font-semibold"
          >
            <Plus className="h-5 w-5" />
            Crear Primera Categoría
          </button>
        </div>
      )}
    </div>
  )
}
