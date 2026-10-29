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
  onTestWebhook?: (url: string, secret?: string) => Promise<{ success: boolean; status?: number; error?: string }>
}

export const AdminSettingsView: React.FC<AdminSettingsProps> = ({
  settings,
  onSaveSettings,
  onSeedSupabase,
  onFetchSupabase,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
  onTestWebhook,
}) => {
  const [form, setForm] = useState<AdminSettings>({ ...settings })
  const [saving, setSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [syncBusy, setSyncBusy] = useState(false)
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null)
  const [webhookTesting, setWebhookTesting] = useState(false)
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null)
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

        {/* Publicité & Pixels de Suivi */}
        <div className="border border-white/10 bg-ink-2 p-6 space-y-6">
          <div>
            <p className="eyebrow text-gold">4. Publicité, Bannière Promotionnelle & Pixels</p>
            <p className="text-xs text-ivory/60 mt-1">
              Gérez l’affichage du bandeau promotionnel du site et configurez vos identifiants publicitaires Meta (Facebook/Instagram) et Google.
            </p>
          </div>

          {/* Bandeau promo du site */}
          <div className="rounded border border-white/10 bg-ink p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-ivory cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.promoBannerEnabled ?? false}
                    onChange={(e) => setForm({ ...form, promoBannerEnabled: e.target.checked })}
                    className="h-4 w-4 accent-[#c6a15b]"
                  />
                  Activer la bannière promotionnelle en haut du site
                </label>
                <p className="text-xs text-ivory/50 mt-0.5 ml-6">
                  Affiche une annonce élégante et cliquable sur toutes les pages publiques du site.
                </p>
              </div>
            </div>

            {(form.promoBannerEnabled ?? false) && (
              <div className="space-y-4 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70 mb-1">
                    Campagne mise en avant
                  </label>
                  <select
                    value={form.promoBannerCampaign || 'rma'}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        promoBannerCampaign: e.target.value as 'rma' | 'pianobariste' | 'custom',
                      })
                    }
                    className="w-full border border-white/20 bg-ink-2 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  >
                    <option value="rma">🎓 15 Auditions Gratuites Diagnostic RMA (Pédagogie & Élèves)</option>
                    <option value="pianobariste">✨ Le Pianobariste™ — Réservations & Simulateur 2026 (Cocktails & Galas)</option>
                    <option value="custom">✍️ Annonce personnalisée sur mesure</option>
                  </select>
                </div>

                {form.promoBannerCampaign === 'custom' && (
                  <div className="grid gap-3 sm:grid-cols-3 bg-ink-2 p-3 rounded border border-white/5">
                    <div className="sm:col-span-3">
                      <label className="block text-[11px] font-semibold text-ivory/70 mb-1">
                        Texte de l'annonce *
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Masterclass exceptionnelle de piano à Douala"
                        value={form.promoBannerCustomText || ''}
                        onChange={(e) => setForm({ ...form, promoBannerCustomText: e.target.value })}
                        className="w-full border border-white/20 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-ivory/70 mb-1">
                        Texte du bouton CTA
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: S'inscrire"
                        value={form.promoBannerCustomCta || ''}
                        onChange={(e) => setForm({ ...form, promoBannerCustomCta: e.target.value })}
                        className="w-full border border-white/20 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-semibold text-ivory/70 mb-1">
                        Lien de redirection
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: /contact ou https://..."
                        value={form.promoBannerCustomUrl || ''}
                        onChange={(e) => setForm({ ...form, promoBannerCustomUrl: e.target.value })}
                        className="w-full border border-white/20 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Configuration des Pixels Publicitaires */}
          <div className="rounded border border-white/10 bg-ink p-4 space-y-4">
            <h4 className="text-sm font-semibold text-ivory">Pixels Publicitaires & Événements de Conversion</h4>
            <p className="text-xs text-ivory/50">
              Ces identifiants activent le suivi des conversions (visites, consultations d'offres et soumissions de formulaires) pour vos campagnes payantes.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Meta Pixel ID (Facebook & Instagram Ads)
                  <input
                    type="text"
                    placeholder="Ex: 123456789012345"
                    value={form.metaPixelId || ''}
                    onChange={(e) => setForm({ ...form, metaPixelId: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink-2 px-3 py-2 font-mono text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                  />
                </label>
                <p className="text-[11px] text-ivory/40 mt-1">
                  Disponible dans Meta Events Manager (Gestionnaire d'événements).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Google Ads / Google Tag ID
                  <input
                    type="text"
                    placeholder="Ex: AW-123456789 ou G-XXXXXXX"
                    value={form.googleAdsId || ''}
                    onChange={(e) => setForm({ ...form, googleAdsId: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink-2 px-3 py-2 font-mono text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                  />
                </label>
                <p className="text-[11px] text-ivory/40 mt-1">
                  Identifiant de balise Google Ads ou Google Analytics 4.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Automatisation Sociale & Webhook */}
        <div className="border border-white/10 bg-ink-2 p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <p className="eyebrow text-gold">5. Distribution Sociale & Webhook (n8n · Make · Metricool)</p>
              <p className="text-xs text-ivory/60 mt-1">
                Expédie automatiquement les 10 formats éditoriaux (LinkedIn, Facebook, Instagram, TikTok, WhatsApp...) dès qu’une publication est scellée (SHA-256) dans le calendrier.
              </p>
            </div>
            {form.webhookUrl?.includes('hervenanfang.app.n8n.cloud') && (
              <span className="self-start sm:self-auto inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 rounded">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                n8n Cloud Connecté
              </span>
            )}
          </div>

          <div className="rounded border border-white/10 bg-ink p-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ivory/80 mb-1">
                URL du Webhook de réception
              </label>
              <input
                type="url"
                value={form.webhookUrl || ''}
                onChange={(e) => setForm({ ...form, webhookUrl: e.target.value })}
                placeholder="https://hervenanfang.app.n8n.cloud/webhook/publication-approved"
                className="w-full border border-white/20 bg-ink-2 px-3 py-2 font-mono text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
              />
              <p className="text-[11px] text-ivory/50 mt-1 flex flex-wrap items-center gap-1">
                <span>Instance n8n Cloud officielle :</span>
                <a
                  href="https://hervenanfang.app.n8n.cloud"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold underline hover:text-gold/80"
                >
                  hervenanfang.app.n8n.cloud ↗
                </a>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ivory/80 mb-1">
                Clé secrète / Header X-HN-Webhook-Secret (Optionnel)
              </label>
              <input
                type="password"
                value={form.webhookSecret || ''}
                onChange={(e) => setForm({ ...form, webhookSecret: e.target.value })}
                placeholder="Jeton secret de signature..."
                className="w-full border border-white/20 bg-ink-2 px-3 py-2 font-mono text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
              />
            </div>

            {webhookTestResult && (
              <div
                className={`border p-3 text-xs font-medium ${
                  webhookTestResult.success
                    ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                    : 'border-crimson/40 bg-crimson/10 text-crimson-2'
                }`}
              >
                {webhookTestResult.message}
              </div>
            )}

            {onTestWebhook && (
              <div className="pt-2">
                <button
                  type="button"
                  disabled={webhookTesting || !form.webhookUrl}
                  onClick={async () => {
                    if (!form.webhookUrl) return
                    setWebhookTesting(true)
                    setWebhookTestResult(null)
                    try {
                      const res = await onTestWebhook(form.webhookUrl, form.webhookSecret)
                      if (res.success) {
                        setWebhookTestResult({
                          success: true,
                          message: `✓ Ping de test reçu avec succès (HTTP ${res.status || 200}). Votre n8n reçoit correctement les événements !`,
                        })
                      } else {
                        setWebhookTestResult({
                          success: false,
                          message: `✕ Erreur : ${res.error || 'Vérifiez que le workflow n8n est actif.'}`,
                        })
                      }
                    } finally {
                      setWebhookTesting(false)
                    }
                  }}
                  className="border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-ivory/80 hover:border-gold hover:text-gold disabled:opacity-40 transition-colors"
                >
                  {webhookTesting ? 'Test en cours…' : '🧪 Tester la connexion Webhook'}
                </button>
              </div>
            )}
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
        <p className="eyebrow text-gold">6. Synchronisation Base de Données Cloud</p>
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
        <p className="eyebrow text-gold">7. Sauvegarde & Restauration Intégrale</p>
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
