import type { Session } from '@supabase/supabase-js'
import { isSupabaseConfigured, supabase } from './supabase'
import type { AuthSession } from './admin-types'

const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000
const LEGACY_SESSION_KEYS = ['hn_admin_session_v2', 'hn_admin_session_v1']

type AuthListener = (session: AuthSession | null) => void
const listeners: Set<AuthListener> = new Set()

function notify(session: AuthSession | null) {
  listeners.forEach((listener) => listener(session))
}

function clearLegacySessions() {
  try {
    for (const key of LEGACY_SESSION_KEYS) {
      if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(key)
      if (typeof localStorage !== 'undefined') localStorage.removeItem(key)
    }
  } catch (error) {
    console.warn('[AUTH SÉCURITÉ] Impossible de supprimer une ancienne session locale:', error)
  }
}

async function revokeSupabaseSession() {
  if (!supabase) return
  const { error } = await supabase.auth.signOut()
  if (error) console.error('[AUTH SÉCURITÉ] Impossible de révoquer la session Supabase:', error)
}

async function createAdminSession(
  session: Session,
): Promise<{ session: AuthSession | null; error?: string }> {
  if (!supabase) return { session: null, error: 'Supabase Auth n’est pas configuré.' }

  const { data: adminRow, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id, full_name, email')
    .eq('user_id', session.user.id)
    .maybeSingle()

  if (adminError || !adminRow) {
    if (adminError) {
      console.error('[AUTH SÉCURITÉ] Vérification de la liste admin_users impossible:', adminError)
    }
    await revokeSupabaseSession()
    return {
      session: null,
      error: adminError
        ? 'Impossible de vérifier les droits administrateur. Réessayez.'
        : 'Accès refusé : ce compte Supabase n’est pas enregistré dans admin_users.',
    }
  }

  return {
    session: {
      user: {
        id: session.user.id,
        email: session.user.email ?? adminRow.email,
        fullName: adminRow.full_name ?? 'Hervé Nanfang',
        role: 'admin',
      },
      mode: 'supabase',
      expiresAt: session.expires_at
        ? new Date(session.expires_at * 1000).toISOString()
        : new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString(),
      accessToken: session.access_token,
    },
  }
}

export const adminAuth = {
  subscribe(listener: AuthListener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  async getSession(): Promise<AuthSession | null> {
    clearLegacySessions()
    if (!isSupabaseConfigured || !supabase) return null

    try {
      const { data, error } = await supabase.auth.getSession()
      if (error) {
        console.error('[AUTH SÉCURITÉ] Erreur lors de la lecture de la session Supabase:', error)
        return null
      }
      if (!data.session) return null

      const result = await createAdminSession(data.session)
      if (!result.session) return null
      return result.session
    } catch (error) {
      console.error('[AUTH SÉCURITÉ] Erreur lors de la vérification de session Supabase:', error)
      return null
    }
  },

  async signIn(
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    clearLegacySessions()
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        error: 'Supabase Auth n’est pas configuré. La connexion administrateur est indisponible.',
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      if (error) return { success: false, error: `Échec d’authentification : ${error.message}` }
      if (!data.session) {
        return { success: false, error: 'Supabase Auth n’a retourné aucune session.' }
      }

      const result = await createAdminSession(data.session)
      if (!result.session) return { success: false, error: result.error }

      notify(result.session)
      return { success: true, session: result.session }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur de communication avec Supabase Auth.',
      }
    }
  },

  async signOut(): Promise<void> {
    clearLegacySessions()
    if (supabase) {
      try {
        const { error } = await supabase.auth.signOut()
        if (error) console.error('[AUTH SÉCURITÉ] Erreur lors de la déconnexion Supabase:', error)
      } catch (error) {
        console.error('[AUTH SÉCURITÉ] Erreur lors de la déconnexion Supabase:', error)
      }
    }
    notify(null)
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return {
        success: false,
        message: 'La réinitialisation par email nécessite une configuration active de Supabase Auth.',
      }
    }

    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      })

      if (error) return { success: false, message: error.message }
      return {
        success: true,
        message: 'Un lien sécurisé de réinitialisation a été envoyé à cette adresse.',
      }
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur lors de la réinitialisation.',
      }
    }
  },
}
