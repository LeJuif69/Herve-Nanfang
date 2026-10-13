import { isSupabaseConfigured, supabase } from './supabase'
import type { AuthSession } from './admin-types'

const LOCAL_SESSION_KEY = 'hn_admin_session_v1'
const LOCAL_ADMIN_EMAIL = 'hervenanfang@gmail.com'
const LOCAL_ADMIN_PASSWORD_HASH = 'admin' // Mot de passe local initial : admin

const memoryStorage = new Map<string, string>()

function getStoredItem(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key) || sessionStorage.getItem(key)
    }
  } catch {
    // fallback
  }
  return memoryStorage.get(key) ?? null
}

function setStoredItem(key: string, value: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
      return
    }
  } catch {
    // fallback
  }
  memoryStorage.set(key, value)
}

function removeStoredItem(key: string): void {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
    }
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key)
    }
  } catch {
    // fallback
  }
  memoryStorage.delete(key)
}

type AuthListener = (session: AuthSession | null) => void
const listeners: Set<AuthListener> = new Set()

function notify(session: AuthSession | null) {
  listeners.forEach((fn) => fn(session))
}

export const adminAuth = {
  subscribe(listener: AuthListener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  async getSession(): Promise<AuthSession | null> {
    // 1. Supabase Auth if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          const { data } = await supabase
            .from('admin_users')
            .select('user_id, full_name, email')
            .eq('user_id', session.user.id)
            .maybeSingle()

          if (data) {
            return {
              user: {
                id: session.user.id,
                email: session.user.email ?? data.email,
                fullName: data.full_name ?? 'Hervé Nanfang',
                role: 'admin',
              },
              mode: 'supabase',
            }
          }
        }
      } catch (err) {
        console.warn('Supabase auth check fallback to local session', err)
      }
    }

    // 2. Local session fallback
    try {
      const stored = getStoredItem(LOCAL_SESSION_KEY)
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored)
        return parsed
      }
    } catch {
      // ignore
    }

    return null
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const trimmedEmail = email.trim().toLowerCase()

    // 1. If Supabase configured, attempt Supabase Auth
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        })

        if (error) {
          return { success: false, error: error.message }
        }

        if (data.session) {
          const { data: adminRow, error: adminErr } = await supabase
            .from('admin_users')
            .select('user_id, full_name, email')
            .eq('user_id', data.session.user.id)
            .maybeSingle()

          if (adminErr || !adminRow) {
            await supabase.auth.signOut()
            return {
              success: false,
              error: 'Ce compte existe dans Supabase mais ne figure pas dans la table admin_users.',
            }
          }

          const session: AuthSession = {
            user: {
              id: data.session.user.id,
              email: data.session.user.email ?? adminRow.email,
              fullName: adminRow.full_name ?? 'Hervé Nanfang',
              role: 'admin',
            },
            mode: 'supabase',
          }
          notify(session)
          return { success: true, session }
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Erreur de connexion Supabase',
        }
      }
    }

    // 2. Local fallback authentication
    const acceptedEmails = [LOCAL_ADMIN_EMAIL, 'admin@hervenanfang.com', 'racinesmusicalesacademy@gmail.com', 'contact@hervenanfang.com', 'admin']
    const isEmailValid = acceptedEmails.includes(trimmedEmail)
    const isPasswordValid = password === LOCAL_ADMIN_PASSWORD_HASH || password === 'HerveNanfang2026!'

    if (isEmailValid && isPasswordValid) {
      const session: AuthSession = {
        user: {
          id: 'admin-local-01',
          email: trimmedEmail.includes('@') ? trimmedEmail : LOCAL_ADMIN_EMAIL,
          fullName: 'Hervé Nanfang (Admin)',
          role: 'admin',
        },
        mode: 'local',
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      }
      setStoredItem(LOCAL_SESSION_KEY, JSON.stringify(session))
      notify(session)
      return { success: true, session }
    }

    return {
      success: false,
      error: 'Identifiants invalides. Utilisez votre email admin et votre mot de passe.',
    }
  },

  async signOut(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut()
      } catch {
        // ignore
      }
    }
    removeStoredItem(LOCAL_SESSION_KEY)
    notify(null)
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const trimmedEmail = email.trim().toLowerCase()

    if (isSupabaseConfigured && supabase) {
      try {
        const redirectTo = typeof window !== 'undefined'
          ? `${window.location.origin}/admin`
          : undefined

        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
          redirectTo,
        })

        if (error) {
          return {
            success: false,
            message: error.message || 'Impossible d’envoyer l’email de réinitialisation.',
          }
        }

        return {
          success: true,
          message: `Un lien sécurisé de réinitialisation Supabase a été expédié à l’adresse ${trimmedEmail}.`,
        }
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Erreur lors de la demande de réinitialisation.',
        }
      }
    }

    // Local mode instructions - ne pas révéler de secret dans l'UI
    return {
      success: true,
      message: `En mode local, connectez-vous avec votre email administrateur (${LOCAL_ADMIN_EMAIL}) et votre mot de passe local. Dès que Supabase est relié dans .env.local, l'email de réinitialisation Supabase sera délivré automatiquement.`,
    }
  },
}
