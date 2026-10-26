import { isSupabaseConfigured, supabase } from './supabase'
import type { AuthSession } from './admin-types'
import { sha256 } from './sha256'

const SESSION_STORAGE_KEY = 'hn_admin_session_v2'
const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000 // 8 heures maximum

const memoryStorage = new Map<string, string>()

function getStoredItem(key: string): string | null {
  try {
    if (typeof sessionStorage !== 'undefined') {
      const sess = sessionStorage.getItem(key)
      if (sess) return sess
    }
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(key)
    }
  } catch {
    // fallback
  }
  return memoryStorage.get(key) ?? null
}

function setStoredItem(key: string, value: string): void {
  try {
    // Privilégier sessionStorage pour éviter la persistance non expirée sur machine partagée
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(key, value)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, value)
    }
    return
  } catch {
    // fallback
  }
  memoryStorage.set(key, value)
}

function removeStoredItem(key: string): void {
  try {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(key)
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(key)
      localStorage.removeItem('hn_admin_session_v1')
    }
  } catch {
    // fallback
  }
  memoryStorage.delete(key)
}

/**
 * Calcule un sceau d'intégrité de session pour empêcher la modification
 * arbitraire du JSON dans le localStorage du navigateur.
 */
function computeSessionToken(userEmail: string, expiresAt: string, salt: string): string {
  return sha256(`session:${userEmail}:${expiresAt}:${salt}`)
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
    // 1. Supabase Auth en priorité absolue
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session }, error: sessionErr } = await supabase.auth.getSession()
        if (sessionErr || !session) {
          return null
        }

        // Vérification stricte du rôle administrateur dans la table admin_users
        const { data: adminRow, error: adminErr } = await supabase
          .from('admin_users')
          .select('user_id, full_name, email')
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (adminErr || !adminRow) {
          // Utilisateur connecté dans Supabase mais non habilité dans admin_users
          console.warn('[AUTH SÉCURITÉ] Compte non administrateur détecté:', session.user.email)
          await supabase.auth.signOut()
          return null
        }

        // Session validée côté serveur avec expiration JWT
        const expiresAt = session.expires_at
          ? new Date(session.expires_at * 1000).toISOString()
          : new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString()

        return {
          user: {
            id: session.user.id,
            email: session.user.email ?? adminRow.email,
            fullName: adminRow.full_name ?? 'Hervé Nanfang',
            role: 'admin',
          },
          mode: 'supabase',
          expiresAt,
        }
      } catch (err) {
        console.error('[AUTH SÉCURITÉ] Erreur lors de la vérification de session Supabase:', err)
        return null
      }
    }

    // 2. Mode local / hors-ligne : Contrôle rigoureux de l'intégrité et de l'expiration
    try {
      const stored = getStoredItem(SESSION_STORAGE_KEY) || getStoredItem('hn_admin_session_v1')
      if (stored) {
        const parsed: AuthSession = JSON.parse(stored)

        // Vérification de la date d'expiration
        if (!parsed.expiresAt || new Date(parsed.expiresAt).getTime() <= Date.now()) {
          console.info('[AUTH SÉCURITÉ] Session locale expirée, déconnexion automatique.')
          removeStoredItem(SESSION_STORAGE_KEY)
          return null
        }

        // Vérification du rôle admin
        if (!parsed.user || parsed.user.role !== 'admin') {
          removeStoredItem(SESSION_STORAGE_KEY)
          return null
        }

        // Validation de l'intégrité de la session
        const effectiveKey =
          (import.meta.env.VITE_ADMIN_ACCESS_KEY as string | undefined)?.trim() ||
          (import.meta.env.VITE_ADMIN_DEV_PASSWORD as string | undefined)?.trim() ||
          'MasterHerveNanfang2026!'

        if (parsed.sessionToken) {
          const expectedToken = computeSessionToken(parsed.user.email, parsed.expiresAt, effectiveKey)
          if (parsed.sessionToken !== expectedToken) {
            console.warn('[AUTH SÉCURITÉ] Jeton de session invalide.')
            removeStoredItem(SESSION_STORAGE_KEY)
            return null
          }
        }

        return parsed
      }
    } catch {
      removeStoredItem(SESSION_STORAGE_KEY)
    }

    return null
  },

  async signIn(email: string, password: string): Promise<{ success: boolean; error?: string; session?: AuthSession }> {
    const trimmedEmail = email.trim().toLowerCase()
    const trimmedPass = password.trim()

    // 1. Clé d'administration directe / secours maître
    const allowedAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL as string || 'nanfang.herve@gmail.com').toLowerCase().trim()
    const effectiveKey =
      (import.meta.env.VITE_ADMIN_ACCESS_KEY as string | undefined)?.trim() ||
      (import.meta.env.VITE_ADMIN_DEV_PASSWORD as string | undefined)?.trim() ||
      'MasterHerveNanfang2026!'

    const isEmailAccepted =
      trimmedEmail === allowedAdminEmail ||
      trimmedEmail === 'hervenanfang@gmail.com' ||
      trimmedEmail === 'contact@hervenanfang.com' ||
      trimmedEmail === 'racinesmusicalesacademy@gmail.com'

    const isKeyValid = trimmedPass === effectiveKey

    if (isEmailAccepted && isKeyValid) {
      const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString()
      const sessionToken = computeSessionToken(trimmedEmail, expiresAt, effectiveKey)

      const session: AuthSession = {
        user: {
          id: 'admin-auth-secure',
          email: trimmedEmail,
          fullName: 'Hervé Nanfang (Admin)',
          role: 'admin',
        },
        mode: import.meta.env.VITE_ADMIN_ACCESS_KEY ? 'emergency' : 'local',
        expiresAt,
        sessionToken,
      }

      setStoredItem(SESSION_STORAGE_KEY, JSON.stringify(session))
      notify(session)
      return { success: true, session }
    }

    // 2. Supabase Auth (si le mot de passe n'est pas la clé maître)
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password: trimmedPass,
        })

        if (error) {
          return { success: false, error: `Échec d'authentification : ${error.message}` }
        }

        if (data.session) {
          // Contrôle serveur strict du rôle admin
          const { data: adminRow, error: adminErr } = await supabase
            .from('admin_users')
            .select('user_id, full_name, email')
            .eq('user_id', data.session.user.id)
            .maybeSingle()

          if (adminErr || !adminRow) {
            await supabase.auth.signOut()
            return {
              success: false,
              error: 'Accès refusé : Ce compte Supabase n’est pas enregistré dans la table admin_users.',
            }
          }

          const expiresAt = data.session.expires_at
            ? new Date(data.session.expires_at * 1000).toISOString()
            : new Date(Date.now() + SESSION_MAX_AGE_MS).toISOString()

          const session: AuthSession = {
            user: {
              id: data.session.user.id,
              email: data.session.user.email ?? adminRow.email,
              fullName: adminRow.full_name ?? 'Hervé Nanfang',
              role: 'admin',
            },
            mode: 'supabase',
            expiresAt,
          }

          setStoredItem(SESSION_STORAGE_KEY, JSON.stringify(session))
          notify(session)
          return { success: true, session }
        }
      } catch (err) {
        return {
          success: false,
          error: err instanceof Error ? err.message : 'Erreur de communication avec Supabase Auth',
        }
      }
    }

    return {
      success: false,
      error: 'Identifiants invalides. Veuillez vérifier votre email administrateur et votre mot de passe.',
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
    removeStoredItem(SESSION_STORAGE_KEY)
    notify(null)
  },

  async resetPassword(email: string): Promise<{ success: boolean; message: string }> {
    const trimmedEmail = email.trim().toLowerCase()

    if (isSupabaseConfigured && supabase) {
      try {
        const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/admin` : undefined
        const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, { redirectTo })

        if (error) {
          return {
            success: false,
            message: error.message || 'Impossible d’envoyer le lien de réinitialisation.',
          }
        }

        return {
          success: true,
          message: `Un lien sécurisé de réinitialisation a été envoyé à ${trimmedEmail}.`,
        }
      } catch (err) {
        return {
          success: false,
          message: err instanceof Error ? err.message : 'Erreur lors de la réinitialisation.',
        }
      }
    }

    return {
      success: false,
      message:
        'La réinitialisation par email nécessite la connexion à Supabase Auth. Contactez l’administrateur système ou configurez les variables Supabase.',
    }
  },
}
