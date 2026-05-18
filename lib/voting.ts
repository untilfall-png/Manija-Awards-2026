// lib/voting.ts — Supabase edition
import { supabase, isSupabaseConfigured } from './supabase'
import { Voter, Vote, Category, VoterSession } from './types'

// ── Error wrapper ────────────────────────────────────────────────────────────
async function dbOp<T>(fn: () => Promise<T>, name: string): Promise<T> {
  try {
    if (!isSupabaseConfigured) throw new Error('Supabase no configurado')
    return await fn()
  } catch (err: any) {
    console.error(`Supabase [${name}]:`, err?.message || err)
    throw new Error(err?.message || 'Error de base de datos')
  }
}

// ── System Config ─────────────────────────────────────────────────────────────
export interface SystemConfig {
  votingEnabled: boolean
  updatedAt: Date
  updatedBy?: string
}

export async function getSystemConfig(): Promise<SystemConfig | null> {
  try {
    const { data, error } = await supabase
      .from('system_config')
      .select('*')
      .eq('id', 'system_config')
      .single()

    if (error || !data) {
      // Crear config por defecto si no existe
      await supabase.from('system_config').upsert({ id: 'system_config', voting_enabled: true })
      return { votingEnabled: true, updatedAt: new Date() }
    }
    return {
      votingEnabled: data.voting_enabled,
      updatedAt:     new Date(data.updated_at),
      updatedBy:     data.updated_by ?? undefined,
    }
  } catch (err) {
    console.error('getSystemConfig:', err)
    return null
  }
}

export async function setVotingEnabled(enabled: boolean, adminId?: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('system_config')
      .upsert({ id: 'system_config', voting_enabled: enabled, updated_at: new Date().toISOString(), updated_by: adminId })
    if (error) throw error
    return true
  } catch (err) {
    console.error('setVotingEnabled:', err)
    return false
  }
}

// ── Voters ────────────────────────────────────────────────────────────────────
export async function createVoter(data: Omit<Voter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Voter> {
  return dbOp(async () => {
    const { data: row, error } = await supabase
      .from('voters')
      .insert({ email: data.email, name: data.name, phone: data.phone || null })
      .select()
      .single()
    if (error) throw error
    return rowToVoter(row)
  }, 'createVoter')
}

export async function getVoterByEmail(email: string): Promise<Voter | null> {
  const { data, error } = await supabase
    .from('voters')
    .select('*')
    .eq('email', email.toLowerCase().trim())
    .maybeSingle()
  if (error) { console.error('getVoterByEmail:', error); return null }
  return data ? rowToVoter(data) : null
}

export async function updateVoter(voterId: string, updates: Partial<Voter>): Promise<void> {
  const patch: any = { updated_at: new Date().toISOString() }
  if (updates.name  !== undefined) patch.name  = updates.name
  if (updates.email !== undefined) patch.email = updates.email.toLowerCase().trim()
  if (updates.phone !== undefined) patch.phone = updates.phone?.trim() || null
  const { error } = await supabase.from('voters').update(patch).eq('id', voterId)
  if (error) throw error
}

function rowToVoter(row: any): Voter {
  return {
    id:        row.id,
    email:     row.email,
    name:      row.name,
    phone:     row.phone ?? undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

// ── Votes ─────────────────────────────────────────────────────────────────────
export async function getVoteByVoterAndCategory(voterId: string, categoryId: string): Promise<Vote | null> {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('voter_id', voterId)
    .eq('category_id', categoryId)
    .maybeSingle()
  if (error) { console.error('getVoteByVoterAndCategory:', error); return null }
  return data ? rowToVote(data) : null
}

export async function getVotesByVoter(voterId: string): Promise<Vote[]> {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('voter_id', voterId)
  if (error) { console.error('getVotesByVoter:', error); return [] }
  return (data || []).map(rowToVote)
}

export async function getVotesByCategory(categoryId: string): Promise<Vote[]> {
  const { data, error } = await supabase
    .from('votes')
    .select('*')
    .eq('category_id', categoryId)
  if (error) { console.error('getVotesByCategory:', error); return [] }
  return (data || []).map(rowToVote)
}

export async function createVote(voteData: Omit<Vote, 'id' | 'createdAt'>): Promise<Vote> {
  return dbOp(async () => {
    const existing = await getVoteByVoterAndCategory(voteData.voterId, voteData.categoryId)
    if (existing) throw new Error('Ya has votado en esta categoría')

    const { data, error } = await supabase
      .from('votes')
      .insert({ voter_id: voteData.voterId, category_id: voteData.categoryId, nominee_id: voteData.nomineeId })
      .select()
      .single()
    if (error) throw error
    return rowToVote(data)
  }, 'createVote')
}

function rowToVote(row: any): Vote {
  return {
    id:         row.id,
    voterId:    row.voter_id,
    categoryId: row.category_id,
    nomineeId:  row.nominee_id,
    createdAt:  new Date(row.created_at),
  }
}

// ── Voter session ──────────────────────────────────────────────────────────────
export async function createVoterSession(email: string, name: string, phone?: string): Promise<VoterSession> {
  try {
    let voter = await getVoterByEmail(email)
    if (!voter) {
      voter = await createVoter({ email: email.toLowerCase().trim(), name, phone })
    } else {
      await updateVoter(voter.id, { name, phone })
    }
    const votes = await getVotesByVoter(voter.id)
    return {
      voter,
      votes,
      hasVotedForCategory: (categoryId: string) => votes.some(v => v.categoryId === categoryId),
    }
  } catch (err: any) {
    console.error('createVoterSession:', err)
    throw new Error('Error al conectar con la base de datos')
  }
}

// ── Categories ────────────────────────────────────────────────────────────────
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('order', { ascending: true })

  if (error) { console.error('getCategories:', error); return fallbackCategories }
  if (!data || data.length === 0) return fallbackCategories

  return data.map(rowToCategory)
}

export async function saveCategory(category: Category): Promise<void> {
  return dbOp(async () => {
    const nominees = (category.nominees || []).map(n => ({
      id:          n.id || '',
      name:        n.name || '',
      description: n.description || '',
      ...(n.imageUrl ? { imageUrl: n.imageUrl } : {}),
    }))

    const { error } = await supabase
      .from('categories')
      .upsert({
        id:           category.id,
        name:         category.name,
        description:  category.description || '',
        order:        category.order,
        nominees,
        is_special:   category.isSpecial ?? false,
        direct_winner: category.isSpecial ? (category.directWinner || '') : '',
      })
    if (error) throw error
  }, 'saveCategory')
}

export async function deleteCategory(categoryId: string): Promise<void> {
  return dbOp(async () => {
    // Votes se eliminan en cascada por FK ON DELETE CASCADE
    const { error } = await supabase.from('categories').delete().eq('id', categoryId)
    if (error) throw error
  }, 'deleteCategory')
}

function rowToCategory(row: any): Category {
  return {
    id:          row.id,
    name:        row.name,
    description: row.description || '',
    order:       row.order,
    nominees:    Array.isArray(row.nominees) ? row.nominees : [],
    isSpecial:   row.is_special ?? false,
    directWinner: row.direct_winner ?? '',
  }
}

// ── Bulk admin operations ─────────────────────────────────────────────────────
export async function deleteAllVotes(): Promise<void> {
  const { error } = await supabase.from('votes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}

export async function deleteAllVoters(): Promise<void> {
  // Votos se eliminan en cascada
  const { error } = await supabase.from('voters').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (error) throw error
}

export async function deleteAllCategories(): Promise<void> {
  const { error } = await supabase.from('categories').delete().neq('id', '')
  if (error) throw error
}

export async function deleteAllData(): Promise<{ voters: number; votes: number; categories: number }> {
  const [
    { count: votesCount },
    { count: votersCount },
    { count: catsCount },
  ] = await Promise.all([
    supabase.from('votes').select('*', { count: 'exact', head: true }),
    supabase.from('voters').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
  ])
  await Promise.all([deleteAllVotes(), deleteAllVoters(), deleteAllCategories()])
  return { voters: votersCount || 0, votes: votesCount || 0, categories: catsCount || 0 }
}

export async function resetAllVotes(): Promise<number> {
  const { count } = await supabase.from('votes').select('*', { count: 'exact', head: true })
  await deleteAllVotes()
  return count || 0
}

export async function getAllVotesWithVoters(): Promise<Array<{
  voteId: string; voterId: string; voterName: string; voterEmail: string
  categoryId: string; nomineeId: string; createdAt: Date
}>> {
  const { data, error } = await supabase
    .from('votes')
    .select('id, voter_id, category_id, nominee_id, created_at, voters(name, email)')
  if (error) { console.error('getAllVotesWithVoters:', error); return [] }
  return (data || []).map((row: any) => ({
    voteId:      row.id,
    voterId:     row.voter_id,
    voterName:   row.voters?.name  || 'Anónimo',
    voterEmail:  row.voters?.email || '---',
    categoryId:  row.category_id,
    nomineeId:   row.nominee_id,
    createdAt:   new Date(row.created_at),
  }))
}

// ── Fallback categories (si DB vacía) ─────────────────────────────────────────
export const fallbackCategories: Category[] = []

// Alias para compatibilidad
export const categories = fallbackCategories
