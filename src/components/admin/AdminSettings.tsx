import React, { useRef, useState } from 'react'
import { isSupabaseConfigured } from '../../lib/supabase'
import type { AdminSettings } from '../../lib/admin-types'

interface AdminSettingsProps {
  settings: AdminSettings
  onSaveSettings: (settings: Partial<AdminSettings>) => Promise<void>
  onSeedSupabase: () => Promise<void>
  onFetchSupabase: () => Promise<void>
  onExportBackup: () => void
  onImportBackup: (jsonStr: string) => Promise<boolean>
  onResetDefaults: () => void
}

export const AdminSettingsView: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onSeedSupabase,
  onFetchSupabase,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
}) => {
  const [form, setForm] = useState<AdminSettings>({ ...settings })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [syncBusy, setSyncBusy] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaveSuccess(false)
    try {
      await onSaveSettings(form)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleTriggerSeed = async () => {
    setSyncBusy(true)
    setSyncFeedback(null)
    try {
      await onSeedSupabase()
      setSyncFeedback('✓ Synchronisation vers Supabase réussie ! Toutes les tables sont à jour.')
    } catch (err) {
      setSyncFeedback(err instanceof Error ? err.message : 'Échec de la synchronisation Supabase.')
    } finally {
      setSyncBusy(false)
    }
  }

  const handleTriggerFetch = async () => {
    setSyncBusy(true)
    setSyncFeedback(null)
    try {
      await onFetchSupabase()
      setSyncFeedback('✓ Données rechargées avec succès depuis Supabase.')
    } catch (err) {
      setSyncFeedback(err instanceof Error ? err.message : 'Échec du rechargement Supabase.')
    } finally {
      setSyncBusy(false)
    }
  }

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = async (evt) => {
        const text = evt.target?.result as string
        if (text) {
          const ok = await onImportBackup(text)
          if (ok) {
            setSyncFeedback('✓ Sauvegarde JSON restaurée avec succès.')
          } else {
            setSyncFeedback('✕ Fichier JSON invalide.')
          }
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-gold">Configuration & Métadonnées</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">SEO & Réglages du site</h1>
          <p className="text-xs text-ivory/60">
            Source canonique d'identité, coordonnées de contact, audit SEO et synchronisation base de données.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Identité canonique */}
        <div className="border border-white/10 bg-ink-2 p-6">
          <p className="eyebrow text-gold">1. Identité canonique & Marque</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Nom de marque officiel
                <input
                  type="text"
                  value={form.siteName}
                  onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Signature / Slogan
                <input
                  type="text"
                  value={form.tagline}
                  onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ivory/70">
                Proposition de valeur
                <textarea
                  rows={2}
                  value={form.positioningLine}
                  onChange={(e) => setForm({ ...form, positioningLine: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs leading-relaxed text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-ivory/70">
                Description de référence (utilisée pour Schema.org, presse et annuaires)
                <textarea
                  rows={3}
                  value={form.referenceDescription}
                  onChange={(e) => setForm({ ...form, referenceDescription: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs leading-relaxed text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Coordonnées & Booking */}
        <div className="border border-white/10 bg-ink-2 p-6">
          <p className="eyebrow text-gold">2. Coordonnées officielles & Booking</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Email RMA / Booking principal
                <input
                  type="email"
                  value={form.emailRma}
                  onChange={(e) => setForm({ ...form, emailRma: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Email Contact
                <input
                  type="email"
                  value={form.emailContact}
                  onChange={(e) => setForm({ ...form, emailContact: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Téléphone & WhatsApp 1
                <input
                  type="text"
                  value={form.phonePrimary}
                  onChange={(e) => setForm({ ...form, phonePrimary: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Téléphone & WhatsApp 2
                <input
                  type="text"
                  value={form.phoneSecondary}
                  onChange={(e) => setForm({ ...form, phoneSecondary: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/70">
                Ville / Base de rayonnement
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Réseaux officiels */}
        <div className="border border-white/10 bg-ink-2 p-6">
          <p className="eyebrow text-gold">3. Réseaux officiels & sameAs (Schema.org)</p>
          <div className="mt-4 space-y-3">
            {form.socialLinks.map((social, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="w-24 text-xs font-semibold text-ivory/70">{social.platform}</span>
                <input
                  type="text"
                  value={social.href}
                  onChange={(e) => {
                    const next = [...form.socialLinks]
                    next[idx] = { ...next[idx], href: e.target.value }
                    setForm({ ...form, socialLinks: next })
                  }}
                  className="flex-1 border border-white/20 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                />
                <label className="flex items-center gap-1 text-xs text-ivory/60">
                  <input
                    type="checkbox"
                    checked={social.verified}
                    onChange={(e) => {
                      const next = [...form.socialLinks]
                      next[idx] = { ...next[idx], verified: e.target.checked }
                      setForm({ ...form, socialLinks: next })
                    }}
                    className="accent-[#c6a15b]"
                  />
                  Vérifié
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <div>
            {saveSuccess && <span className="text-xs font-bold text-emerald-400">✓ Réglages enregistrés !</span>}
          </div>
          <button
            disabled={saving}
            type="submit"
            className="btn btn-gold text-xs"
          >
            {saving ? 'Enregistrement…' : 'Enregistrer les réglages'}
          </button>
        </div>
      </form>

      {/* Cloud & Supabase Sync Section */}
      <div className="border border-white/10 bg-ink-2 p-6">
        <p className="eyebrow text-gold">4. Synchronisation Base de Données Cloud</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <p className="font-display text-xl text-ivory">Connexion Supabase</p>
            <p className="text-xs text-ivory/60">
              Statut :{' '}
              <strong className={isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}>
                {isSupabaseConfigured ? 'Supabase configuré et relié' : 'Mode local persistant (clés non renseignées dans .env.local)'}
              </strong>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {isSupabaseConfigured && (
              <>
                <button
                  type="button"
                  disabled={syncBusy}
                  onClick={handleTriggerSeed}
                  className="border border-gold/50 bg-gold/10 px-3 py-2 text-xs font-bold uppercase text-gold hover:bg-gold hover:text-ink disabled:opacity-50"
                >
                  {syncBusy ? 'Traitement…' : 'Seed / Sync vers Supabase'}
                </button>
                <button
                  type="button"
                  disabled={syncBusy}
                  onClick={handleTriggerFetch}
                  className="border border-white/20 bg-ink px-3 py-2 text-xs font-bold uppercase text-ivory/70 hover:border-gold hover:text-gold disabled:opacity-50"
                >
                  Recharger depuis Supabase
                </button>
              </>
            )}
          </div>
        </div>

        {syncFeedback && (
          <p className="mt-3 text-xs font-semibold text-gold">{syncFeedback}</p>
        )}
      </div>

      {/* Backup & Restore */}
      <div className="border border-white/10 bg-ink-2 p-6">
        <p className="eyebrow text-gold">5. Sauvegarde & Restauration Intégrale</p>
        <p className="mt-2 text-xs text-ivory/60">
          Téléchargez un instantané complet de toutes les données du site (articles, projets, services, messages, médias) sous forme de fichier JSON sécurisé.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileImport}
        />

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={onExportBackup}
            className="border border-white/20 bg-ink px-4 py-2 text-xs font-bold uppercase text-ivory hover:border-gold hover:text-gold"
          >
            Télécharger Sauvegarde JSON ↓
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="border border-white/20 bg-ink px-4 py-2 text-xs font-bold uppercase text-ivory hover:border-gold hover:text-gold"
          >
            Restaurer depuis un fichier JSON ↑
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Réinitialiser toutes les données aux valeurs canoniques initiales ?')) {
                onResetDefaults()
              }
            }}
            className="border border-crimson/40 bg-crimson/10 px-4 py-2 text-xs font-bold uppercase text-crimson-2 hover:bg-crimson hover:text-white"
          >
            Réinitialiser aux valeurs initiales
          </button>
        </div>
      </div>
    </div>
  )
}
