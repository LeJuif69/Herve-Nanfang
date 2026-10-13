import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '../../lib/supabase'
import { adminAuth } from '../../lib/admin-auth'

interface AdminLoginProps {
  onSignIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSignIn }) => {
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [email, setEmail] = useState('hervenanfang@gmail.com')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setBusy(true)

    try {
      if (mode === 'login') {
        const res = await onSignIn(email, password)
        if (!res.success) {
          setError(res.error || 'Connexion impossible. Vérifiez vos identifiants.')
        }
      } else {
        const res = await adminAuth.resetPassword(email)
        if (res.success) {
          setSuccessMsg(res.message)
        } else {
          setError(res.message)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col justify-center bg-ink px-6 py-12 text-ivory sm:px-10 lg:px-14">
      <div className="mx-auto w-full max-w-md">
        {/* Brand mark */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-3">
            <img src="/hn-initials-mark.png" alt="" className="h-12 w-12 object-contain" />
          </Link>
          <p className="eyebrow mt-4 text-gold">Espace privé sécurisé</p>
          <h1 className="mt-2 font-display text-4xl text-ivory">Administration</h1>
          <p className="mt-2 text-xs text-ivory/60">
            Plateforme éditoriale et gestion commerciale de Hervé Nanfang
          </p>
        </div>

        {/* Auth Form Card */}
        <div className="mt-8 border border-white/10 bg-ink-2 p-8 shadow-2xl">
          <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-3">
            <span className="eyebrow text-gold">
              {mode === 'login' ? 'Connexion' : 'Réinitialisation'}
            </span>
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'forgot' : 'login')
                setError('')
                setSuccessMsg('')
              }}
              className="text-xs text-gold/80 hover:text-gold hover:underline"
            >
              {mode === 'login' ? 'Mot de passe oublié ?' : '← Retour à la connexion'}
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                Adresse e-mail administrateur
                <input
                  required
                  type="email"
                  autoComplete="username email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hervenanfang@gmail.com"
                  className="mt-2 w-full border border-white/20 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            {mode === 'login' && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70">
                    Mot de passe
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[0.65rem] text-gold hover:underline"
                  >
                    {showPassword ? 'Masquer' : 'Afficher'}
                  </button>
                </div>
                <input
                  required
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="mt-2 w-full border border-white/20 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </div>
            )}

            {error && (
              <div className="border border-crimson/40 bg-crimson/10 p-3 text-xs text-crimson-2">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="border border-emerald-500/40 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                {successMsg}
              </div>
            )}

            <button
              disabled={busy}
              type="submit"
              className="btn btn-gold w-full justify-center text-xs disabled:opacity-60"
            >
              {busy
                ? 'Traitement en cours…'
                : mode === 'login'
                ? 'Accéder au Dashboard'
                : 'Envoyer le lien de réinitialisation'}
            </button>
          </form>

          {/* Connection Mode Helper */}
          <div className="mt-6 border-t border-white/10 pt-4 text-center">
            <p className="text-[0.68rem] text-ivory/45">
              Statut serveur :{' '}
              <span className={isSupabaseConfigured ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                {isSupabaseConfigured ? 'Supabase Auth Cloud actif' : 'Session Locale Sécurisée active'}
              </span>
            </p>
          </div>
        </div>

        {/* Back to site */}
        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs uppercase tracking-widest text-ivory/50 transition-colors hover:text-gold"
          >
            ← Retour au site public
          </Link>
        </div>
      </div>
    </div>
  )
}
