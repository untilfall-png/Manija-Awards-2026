// lib/voting.ts
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Voter, Vote, Category, VoterSession } from './types'

// Voter functions
export async function createVoter(voterData: Omit<Voter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Voter> {
  const voterRef = doc(collection(db, 'voters'))
  const voter: Voter = {
    id: voterRef.id,
    ...voterData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await setDoc(voterRef, {
    ...voter,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return voter
}

export async function getVoterByEmail(email: string): Promise<Voter | null> {
  const q = query(collection(db, 'voters'), where('email', '==', email))
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) return null

  const doc = querySnapshot.docs[0]
  const data = doc.data()

  return {
    id: doc.id,
    email: data.email,
    name: data.name,
    phone: data.phone,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  }
}

export async function updateVoter(voterId: string, updates: Partial<Voter>): Promise<void> {
  const voterRef = doc(db, 'voters', voterId)
  await updateDoc(voterRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

// Vote functions
export async function createVote(voteData: Omit<Vote, 'id' | 'createdAt'>): Promise<Vote> {
  // Check if voter already voted for this category
  const existingVote = await getVoteByVoterAndCategory(voteData.voterId, voteData.categoryId)
  if (existingVote) {
    throw new Error('Ya has votado en esta categoría')
  }

  const voteRef = await addDoc(collection(db, 'votes'), {
    ...voteData,
    createdAt: serverTimestamp(),
  })

  return {
    id: voteRef.id,
    ...voteData,
    createdAt: new Date(),
  }
}

export async function getVoteByVoterAndCategory(voterId: string, categoryId: string): Promise<Vote | null> {
  const q = query(
    collection(db, 'votes'),
    where('voterId', '==', voterId),
    where('categoryId', '==', categoryId)
  )
  const querySnapshot = await getDocs(q)

  if (querySnapshot.empty) return null

  const doc = querySnapshot.docs[0]
  const data = doc.data()

  return {
    id: doc.id,
    voterId: data.voterId,
    categoryId: data.categoryId,
    nomineeId: data.nomineeId,
    createdAt: data.createdAt?.toDate() || new Date(),
  }
}

export async function getVotesByVoter(voterId: string): Promise<Vote[]> {
  const q = query(collection(db, 'votes'), where('voterId', '==', voterId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      voterId: data.voterId,
      categoryId: data.categoryId,
      nomineeId: data.nomineeId,
      createdAt: data.createdAt?.toDate() || new Date(),
    }
  })
}

export async function getVotesByCategory(categoryId: string): Promise<Vote[]> {
  const q = query(collection(db, 'votes'), where('categoryId', '==', categoryId))
  const querySnapshot = await getDocs(q)

  return querySnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      voterId: data.voterId,
      categoryId: data.categoryId,
      nomineeId: data.nomineeId,
      createdAt: data.createdAt?.toDate() || new Date(),
    }
  })
}

// Session management
export async function createVoterSession(email: string, name: string, phone?: string): Promise<VoterSession> {
  let voter = await getVoterByEmail(email)

  if (!voter) {
    voter = await createVoter({ email, name, phone })
  } else {
    // Update voter info if changed
    await updateVoter(voter.id, { name, phone })
  }

  const votes = await getVotesByVoter(voter.id)

  return {
    voter,
    votes,
    hasVotedForCategory: (categoryId: string) => {
      return votes.some(vote => vote.categoryId === categoryId)
    }
  }
}

// Categories data (could be moved to Firestore later)
export const categories: Category[] = [
  {
    id: 'best-director',
    name: 'Mejor Director',
    description: 'Premio al mejor director de cine',
    order: 1,
    nominees: [
      { id: 'dir-1', name: 'Director A', description: 'Película: Acción Total' },
      { id: 'dir-2', name: 'Director B', description: 'Película: Drama Nocturno' },
      { id: 'dir-3', name: 'Director C', description: 'Película: Comedia Salvaje' },
    ]
  },
  {
    id: 'best-actor',
    name: 'Mejor Actor',
    description: 'Premio al mejor actor principal',
    order: 2,
    nominees: [
      { id: 'act-1', name: 'Actor X', description: 'Rol: Héroe de Acción' },
      { id: 'act-2', name: 'Actor Y', description: 'Rol: Detective Misterioso' },
      { id: 'act-3', name: 'Actor Z', description: 'Rol: Comediante Carismático' },
    ]
  },
  {
    id: 'best-actress',
    name: 'Mejor Actriz',
    description: 'Premio a la mejor actriz principal',
    order: 3,
    nominees: [
      { id: 'actr-1', name: 'Actriz M', description: 'Rol: Mujer Fuerte' },
      { id: 'actr-2', name: 'Actriz N', description: 'Rol: Personaje Complejo' },
      { id: 'actr-3', name: 'Actriz O', description: 'Rol: Comedia Ligera' },
    ]
  },
  {
    id: 'best-movie',
    name: 'Mejor Película',
    description: 'Premio a la mejor película del año',
    order: 4,
    nominees: [
      { id: 'mov-1', name: 'Acción Total', description: 'Género: Acción' },
      { id: 'mov-2', name: 'Drama Nocturno', description: 'Género: Drama' },
      { id: 'mov-3', name: 'Comedia Salvaje', description: 'Género: Comedia' },
    ]
  },
]