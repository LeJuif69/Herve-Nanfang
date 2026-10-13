import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const env = (typeof import.meta !== 'undefined' && import.meta.env)
  ? import.meta.env
  : ((globalThis as { process?: { env?: Record<string, string> } }).process?.env ?? {})
const url = (env.VITE_SUPABASE_URL as string | undefined)?.trim()
const key = ((env.VITE_SUPABASE_PUBLISHABLE_KEY ?? env.VITE_SUPABASE_ANON_KEY) as string | undefined)?.trim()

/** Le client n’est créé que lorsque les clés publiques sont présentes. */
export const isSupabaseConfigured = Boolean(url && key)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, key!, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null
