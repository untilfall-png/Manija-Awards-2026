// lib/voting.ts
import {
  collection,
  doc,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  writeBatch,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  updateDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Voter, Vote, Category, VoterSession } from './types'

const SYSTEM_CONFIG_ID = 'system_config'

// System config functions
export interface SystemConfig {
  votingEnabled: boolean;
  updatedAt: Date;
  updatedBy?: string;
}

export async function getSystemConfig(): Promise<SystemConfig | null> {
  try {
    const configRef = doc(db, 'system_config', SYSTEM_CONFIG_ID);
    const configDoc = await getDoc(configRef);
    
    if (!configDoc.exists()) {
      // Create default config if it doesn't exist
      const defaultConfig: SystemConfig = {
        votingEnabled: true,
        updatedAt: new Date(),
      };
      await setDoc(configRef, {
        votingEnabled: true,
        updatedAt: serverTimestamp(),
      });
      return defaultConfig;
    }
    
    const data = configDoc.data();
    return {
      votingEnabled: data.votingEnabled || true,
      updatedAt: data.updatedAt?.toDate() || new Date(),
      updatedBy: data.updatedBy,
    };
  } catch (error) {
    console.error('Error getting system config:', error);
    return null;
  }
}

export async function setVotingEnabled(enabled: boolean, adminId?: string): Promise<boolean> {
  try {
    const configRef = doc(db, 'system_config', SYSTEM_CONFIG_ID);
    await updateDoc(configRef, {
      votingEnabled: enabled,
      updatedAt: serverTimestamp(),
      updatedBy: adminId,
    });
    return true;
  } catch (error) {
    console.error('Error updating voting status:', error);
    return false;
  }
}

// Voter functions
export async function createVoter(voterData: Omit<Voter, 'id' | 'createdAt' | 'updatedAt'>): Promise<Voter> {
  const voterRef = doc(collection(db, 'voters'))
  const voter: Voter = {
    id: voterRef.id,
    ...voterData,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Filter out undefined phone to avoid Firebase issues
  const dataToSave: any = {
    email: voterData.email,
    name: voterData.name,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }
  
  // Only include phone if it's provided and not empty
  if (voterData.phone && voterData.phone.trim()) {
    dataToSave.phone = voterData.phone.trim()
  }

  await setDoc(voterRef, dataToSave)

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
  
  // Filter out undefined phone and build update object
  const updateData: any = {
    updatedAt: serverTimestamp(),
  }
  
  // Only include fields that are provided and not undefined
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.email !== undefined) updateData.email = updates.email
  if (updates.phone !== undefined && updates.phone.trim()) {
    updateData.phone = updates.phone.trim()
  }
  
  await updateDoc(voterRef, updateData)
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

export async function getCategories(): Promise<Category[]> {
  const categoriesQuery = query(collection(db, 'categories'), orderBy('order', 'asc'))
  const querySnapshot = await getDocs(categoriesQuery)

  if (querySnapshot.empty) {
    return categories
  }

  return querySnapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      order: data.order,
      nominees: (data.nominees || []).map((nominee: any) => ({
        id: nominee.id,
        name: nominee.name,
        description: nominee.description,
        imageUrl: nominee.imageUrl,
      })),
    }
  })
}

export async function saveCategory(category: Category): Promise<void> {
  try {
    const categoryRef = doc(db, 'categories', category.id)
    await setDoc(categoryRef, {
      name: category.name,
      description: category.description,
      order: category.order,
      nominees: category.nominees || [],
    })
  } catch (error) {
    console.error('Error saving category:', error)
    throw error
  }
}

export async function deleteCategory(categoryId: string): Promise<void> {
  try {
    const categoryRef = doc(db, 'categories', categoryId)

    const deleteVoteBatch = async (): Promise<boolean> => {
      const votesQuery = query(collection(db, 'votes'), where('categoryId', '==', categoryId), limit(500))
      const votesSnapshot = await getDocs(votesQuery)
      if (votesSnapshot.empty) return false

      const batch = writeBatch(db)
      votesSnapshot.docs.forEach((voteDoc) => batch.delete(voteDoc.ref))
      await batch.commit()
      return votesSnapshot.docs.length === 500
    }

    while (await deleteVoteBatch()) {
      // Continue deleting votes in batches of 500 until none remain
    }

    await deleteDoc(categoryRef)
  } catch (error) {
    console.error('Error deleting category:', error)
    throw error
  }
}

export async function deleteAllVotes(): Promise<void> {
  const batchSize = 500

  const deleteBatch = async () => {
    const votesQuery = query(collection(db, 'votes'), limit(batchSize))
    const votesSnapshot = await getDocs(votesQuery)
    if (votesSnapshot.empty) return false

    const batch = writeBatch(db)
    votesSnapshot.docs.forEach((voteDoc) => batch.delete(voteDoc.ref))
    await batch.commit()
    return votesSnapshot.docs.length === batchSize
  }

  while (await deleteBatch()) {
    // Continue deleting in batches until no votes remain
  }
}

export async function getAllVotesWithVoters(): Promise<Array<{
  voteId: string
  voterId: string
  voterName: string
  voterEmail: string
  categoryId: string
  nomineeId: string
  createdAt: Date
}>> {
  const [votesSnapshot, votersSnapshot] = await Promise.all([
    getDocs(collection(db, 'votes')),
    getDocs(collection(db, 'voters')),
  ])

  const votersMap = new Map<string, { name: string; email: string }>()
  votersSnapshot.docs.forEach((doc) => {
    const data = doc.data()
    votersMap.set(doc.id, {
      name: data.name,
      email: data.email,
    })
  })

  return votesSnapshot.docs.map((doc) => {
    const data = doc.data()
    const voter = votersMap.get(data.voterId) || { name: 'Anónimo', email: '---' }
    return {
      voteId: doc.id,
      voterId: data.voterId,
      voterName: voter.name,
      voterEmail: voter.email,
      categoryId: data.categoryId,
      nomineeId: data.nomineeId,
      createdAt: data.createdAt?.toDate() || new Date(),
    }
  })
}

// Session management
export async function createVoterSession(email: string, name: string, phone?: string): Promise<VoterSession> {
  try {
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
  } catch (error) {
    console.error('Error creating voter session:', error)
    throw new Error('Error al conectar con Firebase. Verifica que las credenciales estén configuradas en .env.local')
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