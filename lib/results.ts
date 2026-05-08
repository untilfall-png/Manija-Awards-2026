import { getDocs, collection } from 'firebase/firestore'
import { db } from './firebase'
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
  const [categories, votesSnapshot, votersSnapshot] = await Promise.all([
    getCategories(),
    getDocs(collection(db, 'votes')),
    getDocs(collection(db, 'voters')),
  ])

  // Tally votes per nominee per category
  const voteCount: Record<string, Record<string, number>> = {}
  const totalPerCategory: Record<string, number> = {}

  votesSnapshot.docs.forEach(doc => {
    const { categoryId, nomineeId } = doc.data()
    if (!voteCount[categoryId]) voteCount[categoryId] = {}
    if (!totalPerCategory[categoryId]) totalPerCategory[categoryId] = 0
    voteCount[categoryId][nomineeId] = (voteCount[categoryId][nomineeId] || 0) + 1
    totalPerCategory[categoryId]++
  })

  const results: CategoryResult[] = categories.map(cat => {
    // Categoría especial: ganador directo, sin conteo de votos
    if (cat.isSpecial) {
      return {
        categoryId: cat.id,
        categoryName: cat.name,
        categoryDescription: cat.description,
        winnerId: 'direct',
        winnerName: cat.directWinner || 'Por Definir',
        winnerDescription: '',
        votes: 0,
        totalVotes: 0,
        isSpecial: true,
        directWinner: cat.directWinner || '',
      }
    }

    const catVotes = voteCount[cat.id] || {}
    const totalVotes = totalPerCategory[cat.id] || 0

    let winnerId = ''
    let winnerVotes = 0
    Object.entries(catVotes).forEach(([nomineeId, votes]) => {
      if (votes > winnerVotes) {
        winnerVotes = votes
        winnerId = nomineeId
      }
    })

    const winner = cat.nominees.find(n => n.id === winnerId) || cat.nominees[0]

    return {
      categoryId: cat.id,
      categoryName: cat.name,
      categoryDescription: cat.description,
      winnerId: winner?.id || '',
      winnerName: winner?.name || 'Por Definir',
      winnerDescription: winner?.description || '',
      votes: winnerVotes,
      totalVotes,
      isSpecial: false,
    }
  })

  const topCategory = results.reduce<CategoryResult | null>((top, r) =>
    !top || r.votes > top.votes ? r : top, null)

  return {
    results,
    totalVoters: votersSnapshot.size,
    totalVotes: votesSnapshot.size,
    topCategory,
  }
}
