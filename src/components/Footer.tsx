import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_PRIMARY, NAV_SECONDARY, SITE } from '../data/site'
import { IDENTITY } from '../data/identity'
import { Container, Eyebrow, Rule } from './ui'
import SocialButtons from './SocialButtons'
import { trackFormSubmitSuccess, trackLeadConversion } from '../lib/ad-pixels'

const DERIVED_MARKS = [
  { name: 'A Laiz Ô Pays', role: 'Manifeste & philosophie culturelle fondatrice' },
  { name: 'Le Pianobariste', role: 'Signature scénique piano-bar live (depuis 2007)' },
  { name: 'A Laiz Academy', role: 'Académie de formation, pédagogie & Permis de Jouer' },
  { name: 'Musicien Augmenté', role: 'Approche méthodologique, recherche & conférences IA' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <footer className="relative border-t border-white/10 bg-ink pb-10 pt-16">
      <Container>
        {/* Colonnes principales */}
        <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-ink-2 via-black to-ink p-1.5 shadow-[0_0_15px_rgba(198,161,91,0.2)] ring-1 ring-gold/20 transition-all duration-300 hover:border-gold hover:shadow-[0_0_25px_rgba(198,161,91,0.4)]">
                <img
                  src="/hn-initials-mark.webp"
                  alt=""
                  width={40}
                  height={40}
                  loading="lazy"
                  decoding="async"
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="font-display text-2xl text-ivory">Hervé Nanfang</span>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-ivory/55">{IDENTITY.bios.court}</p>
            <p className="mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-gold/80">
              Créer. Transmettre. Augmenter. Développer.
            </p>
          </div>

          <nav aria-label="Plan du site">
            <p className="eyebrow text-ivory/60">Navigation</p>
            <ul className="mt-5 space-y-2.5">
              {NAV_PRIMARY.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-ivory/65 transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Navigation secondaire">
            <p className="eyebrow text-ivory/60">Accès direct aux offres</p>
            <ul className="mt-5 space-y-2.5">
              <li>
                <Link
                  to="/reservation?type=booking"
                  className="text-sm text-ivory/75 transition-colors hover:text-gold"
                >
                  Réserver une prestation musicale
                </Link>
              </li>
              <li>
                <Link
                  to="/reservation?type=formation"
                  className="text-sm text-ivory/75 transition-colors hover:text-gold"
                >
                  Organiser une formation
                </Link>
              </li>
              <li>
                <Link
                  to="/reservation?type=conference"
                  className="text-sm text-ivory/75 transition-colors hover:text-gold"
                >
                  Inviter en conférence
                </Link>
              </li>
              <li>
                <Link
                  to="/reservation?type=conseil"
                  className="text-sm text-ivory/75 transition-colors hover:text-gold"
                >
                  Demander un accompagnement
                </Link>
              </li>
            </ul>

            <p className="eyebrow mt-8 text-ivory/60">Ressources</p>
            <ul className="mt-4 space-y-2">
              {NAV_SECONDARY.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-ivory/65 transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-ivory/60">Contact direct</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/65">
              <li>
                <span className="block text-ivory/60">Booking, Conférences & Conseil</span>
                <a href={`mailto:${SITE.emailContact}`} className="transition-colors hover:text-gold">
                  {SITE.emailContact}
                </a>
              </li>
              <li>
                <span className="block text-ivory/60">Formations & A Laiz Academy</span>
                <a href={`mailto:${SITE.emailRma}`} className="transition-colors hover:text-gold">
                  {SITE.emailRma}
                </a>
              </li>
              {SITE.phones.map((phone) => (
                <li key={phone.tel} className="flex flex-wrap items-center gap-3">
                  <a href={`tel:${phone.tel}`} className="transition-colors hover:text-gold">
                    {phone.display}
                  </a>
                  <a
                    href={`https://wa.me/${phone.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    WhatsApp ↗
                  </a>
                </li>
              ))}
              <li className="text-ivory/60">{SITE.city}</li>
            </ul>
            <p className="eyebrow mt-8 text-ivory/60">Presse & Médias</p>
            <Link
              to="/contact?sujet=presse#presse"
              className="mt-3 inline-block text-[0.68rem] uppercase tracking-[0.18em] text-gold hover:text-gold-2"
            >
              Dossier de presse & contact média →
            </Link>

            <p className="eyebrow mt-8 text-ivory/60">Profils officiels</p>
            <div className="mt-4">
              <SocialButtons />
            </div>
          </div>
        </div>

        {/* Marques & Signatures rattachées */}
        <div className="border-t border-white/8 py-10">
          <p className="eyebrow text-ivory/60">Univers & signatures — Hervé Nanfang · A Laiz Ô Pays</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {DERIVED_MARKS.map((m) => (
              <li
                key={m.name}
                className="border border-white/8 px-4 py-3 transition-colors duration-300 hover:border-gold/40"
              >
                <p className="text-sm text-ivory/80">{m.name}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/60">{m.role}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Lettre d'information secondaire (fidélisation éditoriale sans concurrencer les CTA commerciaux) */}
        <div className="grid gap-6 border-t border-white/8 py-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <Eyebrow>Fidélisation éditoriale · Le Journal du Musicien Augmenté</Eyebrow>
            <p className="mt-2 font-display text-xl text-ivory">
              Recevoir occasionnellement les essais et notes de recherche (musique, pédagogie, IA).
            </p>
          </div>
          <form
            className="flex flex-col gap-2.5 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault()
              const cleanEmail = email.trim()
              if (!cleanEmail) return
              try {
                const { adminStore } = await import('../lib/admin-store')
                await adminStore.addIncomingMessage({
                  name: 'Abonné Lettre du Journal',
                  email: cleanEmail,
                  route: 'newsletter',
                  body: `Inscription à la lettre d'information du Journal du Musicien Augmenté (${cleanEmail}).`,
                })
                trackFormSubmitSuccess('newsletter_footer', 'newsletter')
                trackLeadConversion('newsletter_signup', { category: 'Newsletter' })
              } catch {
                // Fallback silencieux vers WhatsApp si hors-ligne
              }
              const message = `Je souhaite m’inscrire à la lettre du Journal du Musicien Augmenté. Mon adresse email : ${cleanEmail}`
              window.open(
                `https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent(message)}`,
                '_blank',
                'noopener,noreferrer',
              )
              setSent(true)
            }}
          >
            <label className="sr-only" htmlFor="newsletter-email">
              Adresse email
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              className="w-full border border-white/15 bg-transparent px-4 py-3 text-xs text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn btn-ghost shrink-0 !py-3 !px-4 !text-xs border-gold/40 text-gold hover:border-gold">
              S’abonner à la lettre
            </button>
          </form>
          {sent && (
            <p className="text-xs text-gold lg:col-start-2">
              Votre adresse e-mail a été enregistrée.
            </p>
          )}
        </div>

        <Rule className="mt-4" />

        <div className="flex flex-col gap-4 pt-4 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Hervé Nanfang — Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/mentions-legales" className="hover:text-gold">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="hover:text-gold">
              Confidentialité
            </Link>
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="inline-flex items-center gap-1 text-gold/80 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
              aria-label="Remonter en haut de la page"
              title="Remonter en haut de la page"
            >
              <span>Haut de page</span>
              <span aria-hidden>↑</span>
            </button>
          </div>
        </div>
      </Container>
    </footer>
  )
}
