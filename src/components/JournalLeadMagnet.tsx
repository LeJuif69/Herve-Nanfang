import React, { useState } from 'react'
import { adminStore } from '../lib/admin-store'
import { formatAttributionTag } from '../lib/utm-tracker'
import { trackLeadConversion } from '../lib/ad-pixels'
import { SITE } from '../data/site'

interface JournalLeadMagnetProps {
  sourceArticle?: string
  className?: string
}

const INTERESTS = [
  { id: 'pedagogie', label: 'Pédagogie & Méthode RMA (Permis de Jouer™)' },
  { id: 'pianobar', label: 'Piano-Bar & Prestations Live' },
  { id: 'studio', label: 'Studio, Son & Acoustique' },
  { id: 'ia_tech', label: 'IA Musicale & Entrepreneuriat' },
]

export const JournalLeadMagnet: React.FC<JournalLeadMagnetProps> = ({
  sourceArticle,
  className = '',
}) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [interest, setInterest] = useState('pedagogie')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError('')

    if (fullName.trim().length < 2) {
      setError('Veuillez renseigner votre prénom et nom.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Veuillez indiquer une adresse email valide.')
      return
    }

    setSubmitting(true)

    const tag = formatAttributionTag()
    const selectedInterestObj = INTERESTS.find((i) => i.id === interest)
    const interestLabel = selectedInterestObj ? selectedInterestObj.label : interest

    const bodyContent = [
      tag,
      '==================================================',
      'INSCRIPTION : LE JOURNAL PRIVÉ DU MUSICIEN AUGMENTÉ',
      '==================================================',
      `Nom complet : ${fullName.trim()}`,
      `Email : ${email.trim()}`,
      `Téléphone / WhatsApp : ${phone.trim() || 'Non renseigné'}`,
      `Centre d'intérêt : ${interestLabel}`,
      sourceArticle ? `Source d'inscription : ${sourceArticle}` : '',
      'Demande : Réception de l’extrait officiel du manuel LES ZIKOS® (Tomes 1 & 2) et de la lettre privée bimensuelle.',
    ]
      .filter(Boolean)
      .join('\n')

    try {
      const res = await adminStore.addIncomingMessage({
        name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        route: 'lead_journal',
        body: bodyContent,
      })

      if (res.ok) {
        trackLeadConversion('newsletter_signup', {
          interest: interestLabel,
          category: 'Lead Magnet Journal',
          source: sourceArticle || 'journal_page',
        })
        setSubmitted(true)
      } else {
        // En cas d'erreur réseau, on permet toujours la conversion via WhatsApp
        setSubmitted(true)
      }
    } catch (err) {
      console.warn('Erreur soumission lead magnet, bascule WhatsApp:', err)
      setSubmitted(true)
    } finally {
      setSubmitting(false)
    }
  }

  const primaryPhone = SITE.phones[0]
  const whatsappMsg = `Bonjour Hervé, je viens de m'inscrire au Journal Privé (${fullName || 'Musicien'}, ${email || 'email'}) et je souhaite recevoir l'extrait officiel du manuel LES ZIKOS® ainsi que vos prochaines lettres.`
  const whatsappUrl = `https://wa.me/${primaryPhone.whatsapp}?text=${encodeURIComponent(whatsappMsg)}`

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-ink-2 via-ink to-black p-8 shadow-[0_15px_50px_rgba(0,0,0,0.7)] ring-1 ring-gold/25 md:p-10 ${className}`}
    >
      {/* Rayonnement doré d'arrière-plan */}
      <div
        className="pointer-events-none absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-3 w-3 items-center justify-center rounded-full bg-gold/20">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Édition Privée · Accès Réservé
            </span>
          </div>
          <span className="rounded bg-white/5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-ivory/50">
            Gratuit · Sans engagement
          </span>
        </div>

        {!submitted ? (
          <div className="mt-6">
            <h3 className="font-display text-2xl font-semibold leading-tight text-ivory md:text-3xl">
              Rejoindre les Carnets Privés du Musicien Augmenté
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ivory/70 md:text-base">
              Recevez les analyses stratégiques d'Hervé Nanfang avant leur publication générale, ainsi que{' '}
              <strong className="text-gold font-medium">l'Extrait Officiel du Manuel LES ZIKOS®</strong>{' '}
              (Tomes 1 & 2 : Les Fondations du Permis de Jouer™ & Décodage des Grilles).
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              {error && (
                <div className="rounded border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                  {error}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lead-name" className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-1.5">
                    Prénom & Nom *
                  </label>
                  <input
                    id="lead-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ex. Jean-Paul Mbarga"
                    className="w-full rounded border border-white/15 bg-black/50 px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label htmlFor="lead-email" className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-1.5">
                    Adresse Email professionnelle *
                  </label>
                  <input
                    id="lead-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    className="w-full rounded border border-white/15 bg-black/50 px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="lead-phone" className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-1.5">
                    Numéro WhatsApp <span className="text-ivory/40 lowercase">(recommandé pour l'envoi immédiat)</span>
                  </label>
                  <input
                    id="lead-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 ... ou +33 ..."
                    className="w-full rounded border border-white/15 bg-black/50 px-4 py-3 text-sm text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  />
                </div>

                <div>
                  <label htmlFor="lead-interest" className="block text-xs font-mono uppercase tracking-wider text-ivory/60 mb-1.5">
                    Votre priorité / Centre d'intérêt
                  </label>
                  <select
                    id="lead-interest"
                    value={interest}
                    onChange={(e) => setInterest(e.target.value)}
                    className="w-full rounded border border-white/15 bg-black/70 px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                  >
                    {INTERESTS.map((item) => (
                      <option key={item.id} value={item.id} className="bg-ink text-ivory">
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-gold shadow-[0_0_20px_rgba(198,161,91,0.25)] hover:shadow-[0_0_30px_rgba(198,161,91,0.45)] disabled:opacity-50"
                >
                  {submitting ? 'Validation...' : 'Recevoir l’Extrait Officiel & Rejoindre la Liste'}
                </button>
                <span className="text-[11px] text-ivory/40">
                  Pas de spam. Désinscription libre en 1 clic à tout moment.
                </span>
              </div>
            </form>
          </div>
        ) : (
          <div className="mt-6 py-4 animate-fadeIn">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-gold mb-4">
              <span className="text-xl">✓</span>
            </div>
            <h4 className="font-display text-2xl font-semibold text-ivory">
              Bienvenue dans les Carnets Privés d’Hervé Nanfang !
            </h4>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/80">
              Votre demande a été enregistrée avec succès. Vous recevrez très prochainement l’extrait exclusif
              du manuel <strong>LES ZIKOS®</strong> par courriel ainsi que les futures analyses du Journal.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-950/60 px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-emerald-400 transition-all hover:border-emerald-400 hover:bg-emerald-900/60"
              >
                <span>Recevoir immédiatement sur WhatsApp</span>
                <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="text-xs text-ivory/40 underline hover:text-ivory/70"
              >
                Inscrire un autre contact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JournalLeadMagnet
