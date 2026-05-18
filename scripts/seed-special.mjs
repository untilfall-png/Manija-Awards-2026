// scripts/seed-special.mjs
// Crea categorías especiales de ejemplo en Supabase
// Uso: node scripts/seed-special.mjs

import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = 'https://siiykcbhciqisyuuufed.supabase.co'
const supabaseAnonKey = 'sb_publishable_wQIYm2tookdty-3mDkOOsg_XjNbRPZQ'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Categorías especiales a crear ──────────────────────────────────────
// Editá los nombres aquí antes de correr el script si querés personalizarlos
const specials = [
  {
    id:            'especial-trayectoria',
    name:          'Premio a la Trayectoria',
    description:   'Reconocimiento especial por años de manijeo ininterrumpido.',
    order:         100,
    nominees:      [],
    is_special:    true,
    direct_winner: 'Nombre del Ganador',
  },
  {
    id:            'especial-revelacion',
    name:          'Revelación del Año',
    description:   'El nuevo integrante que llegó para quedarse y ya es uno más.',
    order:         101,
    nominees:      [],
    is_special:    true,
    direct_winner: 'Nombre del Ganador',
  },
]

for (const cat of specials) {
  const { error } = await supabase.from('categories').upsert(cat)
  if (error) {
    console.error(`❌  Error al guardar ${cat.name}:`, error.message)
  } else {
    console.log(`✅  Guardado: ${cat.name}  →  Ganador: ${cat.direct_winner}`)
  }
}

console.log('\n🎉  Categorías especiales creadas. Recargá el admin para verlas.')
process.exit(0)
