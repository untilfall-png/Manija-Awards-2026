import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = process.env.NEXT_PUBLIC_SUPABASE_URL     || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.error('⚠️  Supabase no configurado. Define NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY en .env.local')
}

// Fallback placeholder evita que createClient lance durante el build
// cuando las env vars no están definidas en el servidor de CI/Render.
// En runtime las vars reales reemplazan los placeholders.
export const supabase = createClient(
  supabaseUrl  || 'https://placeholder-build.supabase.co',
  supabaseAnonKey || 'placeholder-build-key',
  { realtime: { params: { eventsPerSecond: 10 } } }
)
