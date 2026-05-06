import os

path = '/Kimi/Manija Awards 2026/lib/voting.ts'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.rstrip()
if content.endswith(']'):
    content = content[:-1].rstrip()
    if content.endswith(','):
        content = content[:-1].rstrip()

extra = '''
  }
]

// Funciones de limpieza masiva admin

export async function deleteAllVotes(): Promise<void> {
  const batchSize = 500
  const deleteBatch = async (): Promise<boolean> => {
    const votesQuery = query(collection(db, 'votes'), limit(batchSize))
    const votesSnapshot = await getDocs(votesQuery)
    if (votesSnapshot.empty) return false
    const batch = writeBatch(db)
    votesSnapshot.docs.forEach((voteDoc) => batch.delete(voteDoc.ref))
    await batch.commit()
    return votesSnapshot.docs.length === batchSize
  }
  while (await deleteBatch()) {}
}

export async function deleteAllVoters(): Promise<void> {
  const batchSize = 500
  const deleteBatch = async (): Promise<boolean> => {
    const votersQuery = query(collection(db, 'voters'), limit(batchSize))
    const votersSnapshot = await getDocs(votersQuery)
    if (votersSnapshot.empty) return false
    const batch = writeBatch(db)
    votersSnapshot.docs.forEach((voterDoc) => batch.delete(voterDoc.ref))
    await batch.commit()
    return votersSnapshot.docs.length === batchSize
  }
  while (await deleteBatch()) {}
}

export async function deleteAllCategories(): Promise<void> {
  const q = query(collection(db, 'categories'))
  const snapshot = await getDocs(q)
  const batch = writeBatch(db)
  snapshot.docs.forEach((doc) => batch.delete(doc.ref))
  await batch.commit()
}

export async function deleteAllData(): Promise<{ voters: number; votes: number; categories: number }> {
  const [votersSnap, votesSnap, catsSnap] = await Promise.all([
    getDocs(collection(db, 'voters')),
    getDocs(collection(db, 'votes')),
    getDocs(collection(db, 'categories'))
  ])
  const counts = { voters: votersSnap.size, votes: votesSnap.size, categories: catsSnap.size }
  await Promise.all([deleteAllVoters(), deleteAllVotes(), deleteAllCategories()])
  return counts
}

export async function resetAllVotes(): Promise<number> {
  let totalDeleted = 0
  const deleteBatch = async (): Promise<number> => {
    const votesQuery = query(collection(db, 'votes'), limit(500))
    const votesSnapshot = await getDocs(votesQuery)
    if (votesSnapshot.empty) return 0
    const batch = writeBatch(db)
    votesSnapshot.docs.forEach((voteDoc) => batch.delete(voteDoc.ref))
    await batch.commit()
    return votesSnapshot.docs.length
  }
  while (true) {
    const deleted = await deleteBatch()
    totalDeleted += deleted
    if (deleted === 0) break
  }
  return totalDeleted
}
'''

with open(path, 'w', encoding='utf-8') as f:
    f.write(content.rstrip() + '\n' + extra)

print('OK - Funciones agregadas')
