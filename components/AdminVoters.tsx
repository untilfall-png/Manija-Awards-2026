'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Mail, Phone, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Voter } from '@/lib/types'

export function AdminVoters() {
  const [voters, setVoters] = useState<Voter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadVoters()
  }, [])

  const loadVoters = async () => {
    try {
      const { data, error } = await supabase
        .from('voters')
        .select('*')
        .order('created_at', { ascending: false })
      if (error) throw error
      const votersData: Voter[] = (data || []).map((row: any) => ({
        id: row.id,
        email: row.email,
        name: row.name,
        phone: row.phone ?? undefined,
        createdAt: new Date(row.created_at),
        updatedAt: new Date(row.updated_at),
      }))
      setVoters(votersData)
    } catch (error) {
      console.error('Error loading voters:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredVoters = voters.filter(voter =>
    voter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    voter.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center gap-2">
          <div className="w-6 h-6 border-2 border-neon-pink/30 border-t-neon-pink rounded-full animate-spin" />
          <span className="text-neon-pink">Cargando votantes...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-display font-bold text-white">Votantes Registrados</h2>
        <div className="neon-card p-3 flex items-center gap-2">
          <Users className="h-6 w-6 text-neon-cyan" />
          <span className="text-xl font-bold text-white">{voters.length}</span>
        </div>
      </div>

      {/* Search */}
      <div className="neon-card p-6">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar por nombre o email..."
          className="neon-input w-full px-4 py-3 rounded-lg"
        />
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="neon-card p-6 text-center">
          <div className="text-3xl font-display font-bold text-neon-pink mb-2">{voters.length}</div>
          <div className="text-white/70 text-sm">Total de Votantes</div>
        </div>
        <div className="neon-card p-6 text-center">
          <div className="text-3xl font-display font-bold text-neon-cyan mb-2">
            {voters.filter(v => v.phone).length}
          </div>
          <div className="text-white/70 text-sm">Con Teléfono</div>
        </div>
        <div className="neon-card p-6 text-center">
          <div className="text-3xl font-display font-bold text-neon-purple mb-2">
            {voters.length > 0 ? Math.round((voters.filter(v => v.phone).length / voters.length) * 100) : 0}%
          </div>
          <div className="text-white/70 text-sm">Completitud</div>
        </div>
      </div>

      {/* Voters List */}
      <div className="space-y-3">
        {filteredVoters.map((voter, index) => (
          <motion.div
            key={voter.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="neon-card p-6 hover:border-neon-pink/50 transition-all"
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-neon-pink/20 border border-neon-pink/30 flex items-center justify-center flex-shrink-0">
                  <span className="text-neon-pink font-bold">{voter.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{voter.name}</p>
                  <p className="text-xs text-white/50">ID: {voter.id.slice(0, 8)}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-neon-cyan flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/60">Email</p>
                  <p className="font-mono text-sm text-white">{voter.email}</p>
                </div>
              </div>

              {voter.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-neon-purple flex-shrink-0" />
                  <div>
                    <p className="text-xs text-white/60">Teléfono</p>
                    <p className="font-mono text-sm text-white">{voter.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-neon-orange flex-shrink-0" />
                <div>
                  <p className="text-xs text-white/60">Registrado</p>
                  <p className="text-sm text-white">{new Date(voter.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredVoters.length === 0 && (
        <div className="neon-card p-12 text-center">
          <p className="text-white/70">No se encontraron votantes</p>
        </div>
      )}
    </div>
  )
}
