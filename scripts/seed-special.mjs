// scripts/seed-special.mjs
// Crea categorías especiales de ejemplo en Firestore
// Uso: node scripts/seed-special.mjs

import { initializeApp } from 'firebase/app'
import { getFirestore, doc, setDoc } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            'AIzaSyCbQ7XIqVmVGaeHC0DMiHJzJT4HAxvYj8A',
  authDomain:        'manija-awards-2026.firebaseapp.com',
  projectId:         'manija-awards-2026',
  storageBucket:     'manija-awards-2026.firebasestorage.app',
  messagingSenderId: '96184198576',
  appId:             '1:96184198576:web:333e59372729fa14e5e275',
}

const app = initializeApp(firebaseConfig)
const db  = getFirestore(app)

// ── Categorías especiales a crear ──────────────────────────────────────
// Editá los nombres aquí antes de correr el script si querés personalizarlos
const specials = [
  {
    id:           'especial-trayectoria',
    name:         'Premio a la Trayectoria',
    description:  'Reconocimiento especial por años de manijeo ininterrumpido.',
    order:        100,
    nominees:     [],
    isSpecial:    true,
    directWinner: 'Nombre del Ganador',
  },
  {
    id:           'especial-revelacion',
    name:         'Revelación del Año',
    description:  'El nuevo integrante que llegó para quedarse y ya es uno más.',
    order:        101,
    nominees:     [],
    isSpecial:    true,
    directWinner: 'Nombre del Ganador',
  },
]

for (const cat of specials) {
  const ref = doc(db, 'categories', cat.id)
  await setDoc(ref, {
    name:         cat.name,
    description:  cat.description,
    order:        cat.order,
    nominees:     cat.nominees,
    isSpecial:    cat.isSpecial,
    directWinner: cat.directWinner,
  })
  console.log(`✅  Guardado: ${cat.name}  →  Ganador: ${cat.directWinner}`)
}

console.log('\n🎉  Categorías especiales creadas. Recargá el admin para verlas.')
process.exit(0)
