import { supabase } from './supabase'
import { getCategories } from './voting'

export interface CategoryResult {
  categoryId: string
  categoryName: string
  categoryDescription: string
  winnerId: string
  winnerName: string
  winnerDescription: string
  votes: number
  totalVotes: number
  isSpecial?: boolean
  directWinner?: string
}

export interface VotingStats {
  results: CategoryResult[]
  totalVoters: number
  totalVotes: number
  topCategory: CategoryResult | null
}

export async function getVotingResults(): Promise<VotingStats> {
  const [categories, { data: votesData }, { count: votersCount }] = await Promise.all([
    getCategories(),
    supabase.from('votes').select('voter_id, category_id, nominee_id'),
    supabase.from('voters').select('*', { count: 'exact', head: true }),
  ])

  const votes = votesData || []

  // Conteo de votos por nominado por categoría
  const voteCount: Record<string, Record<string, number>> = {}
  const totalPerCategory: Record<string, number> = {}

  votes.forEach((v: any) => {
    const cid = v.category_id
    const nid = v.nominee_id
    if (!voteCount[cid]) voteCount[cid] = {}
    if (!totalPerCategory[cid]) totalPerCategory[cid] = 0
    voteCount[cid][nid] = (voteCount[cid][nid] || 0) + 1
    totalPerCategory[cid]++
  })

  const results: CategoryResult[] = categories.map(cat => {
    if (cat.isSpecial) {
      return {
        categoryId:          cat.id,
        categoryName:        cat.name,
        categoryDescription: cat.description,
        winnerId:            'direct',
        winnerName:          cat.directWinner || 'Por Definir',
        winnerDescription:   '',
        votes:               0,
        totalVotes:          0,
        isSpecial:           true,
        directWinner:        cat.directWinner || '',
      }
    }

    const catVotes  = voteCount[cat.id] || {}
    const totalVotes = totalPerCategory[cat.id] || 0

    let winnerId   = ''
    let winnerVotes = 0
    Object.entries(catVotes).forEach(([nid, v]) => {
      if (v > winnerVotes) { winnerVotes = v; winnerId = nid }
    })

    const winner = cat.nominees.find(n => n.id === winnerId) || cat.nominees[0]

    return {
      categoryId:          cat.id,
      categoryName:        cat.name,
      categoryDescription: cat.description,
      winnerId:            winner?.id || '',
      winnerName:          winner?.name || 'Por Definir',
      winnerDescription:   winner?.description || '',
      votes:               winnerVotes,
      totalVotes,
      isSpecial:           false,
    }
  })

  const topCategory = results.reduce<CategoryResult | null>(
    (top, r) => (!top || r.votes > top.votes ? r : top), null
  )

  return {
    results,
    totalVoters: votersCount || 0,
    totalVotes:  votes.length,
    topCategory,
  }
}
