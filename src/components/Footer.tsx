import { useState } from 'react'
import { Link } from 'react-router-dom'
import { NAV_PRIMARY, NAV_SECONDARY, SITE } from '../data/site'
import { IDENTITY } from '../data/identity'
import { Container, Eyebrow, Rule } from './ui'
import SocialButtons from './SocialButtons'

const DERIVED_MARKS = [
  { name: 'Le Pianobariste™', role: 'Format piano-bar live' },
  { name: 'ALAIZ Creative Systems', role: 'Production artistique, culturelle & technologique' },
  { name: 'Alaiz Music', role: 'Création & production musicale' },
  { name: 'Racines Musicales Academy®', role: 'Formation & curricula' },
  { name: 'Permis de Jouer™', role: 'Progression & certification' },
  { name: 'Musicien Augmenté™', role: 'IA × musique' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <footer className="relative border-t border-white/10 bg-ink pb-10 pt-20">
      <Container>
        {/* Lettre d'information */}
        <div className="grid gap-10 border-b border-white/8 pb-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <Eyebrow>Le Journal du Musicien Augmenté</Eyebrow>
            <h2 className="mt-5 font-display text-3xl leading-tight text-ivory md:text-4xl">
              Une lettre occasionnelle sur la musique, l’IA et la transmission.
            </h2>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-ivory/55">
              Analyses, méthodes et retours d’expérience — sans rythme forcé, sans remplissage.
            </p>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault()
              const message = `Je souhaite m’inscrire à la lettre du Journal du Musicien Augmenté. Mon adresse email : ${email}`
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
              className="w-full border border-white/15 bg-transparent px-5 py-4 text-sm text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none"
            />
            <button type="submit" className="btn btn-gold shrink-0">
              S’inscrire via WhatsApp
            </button>
          </form>
          {sent && (
            <p className="text-xs text-gold lg:col-start-2">
              WhatsApp s’ouvre avec votre demande préremplie. Relisez puis envoyez le message pour vous inscrire.
            </p>
          )}
        </div>

        {/* Colonnes */}
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-ink-2 via-black to-ink p-1.5 shadow-[0_0_15px_rgba(198,161,91,0.2)] ring-1 ring-gold/20 transition-all duration-300 hover:border-gold hover:shadow-[0_0_25px_rgba(198,161,91,0.4)]">
                <img
                  src="/hn-initials-mark.png"
                  alt=""
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
            <p className="eyebrow text-ivory/40">Navigation</p>
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
            <p className="eyebrow text-ivory/40">Ressources</p>
            <ul className="mt-5 space-y-2.5">
              {NAV_SECONDARY.map((item) => (
                <li key={item.label}>
                  <Link to={item.to} className="text-sm text-ivory/65 transition-colors hover:text-gold">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-9 text-ivory/40">Marques & projets</p>
            <ul className="mt-5 space-y-2.5">
              {DERIVED_MARKS.slice(0, 3).map((m) => (
                <li key={m.name} className="text-sm text-ivory/50">
                  {m.name}
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="eyebrow text-ivory/40">Contact</p>
            <ul className="mt-5 space-y-3 text-sm text-ivory/65">
              <li>
                <span className="block text-ivory/40">Racines Musicales Academy</span>
                <a href={`mailto:${SITE.emailRma}`} className="transition-colors hover:text-gold">
                  {SITE.emailRma}
                </a>
              </li>
              {SITE.phones.map((phone) => (
                <li key={phone.tel}>
                  <a href={`tel:${phone.tel}`} className="transition-colors hover:text-gold">
                    {phone.display}
                  </a>
                </li>
              ))}
              <li className="text-ivory/45">{SITE.city}</li>
            </ul>
            <p className="eyebrow mt-9 text-ivory/40">Presse</p>
            <p className="mt-4 text-sm text-ivory/55">
              Biographies, portrait et éléments de référence disponibles sur la page Contact.
            </p>
            <Link
              to="/contact#presse"
              className="mt-3 inline-block text-[0.68rem] uppercase tracking-[0.18em] text-gold hover:text-gold-2"
            >
              Kit presse →
            </Link>

            <p className="eyebrow mt-9 text-ivory/40">Suivre</p>
            <div className="mt-5">
              <SocialButtons />
            </div>
          </div>
        </div>

        {/* Marques dérivées */}
        <div className="border-t border-white/8 pt-10">
          <p className="eyebrow text-ivory/35">Écosystème — un projet de Hervé Nanfang</p>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DERIVED_MARKS.map((m) => (
              <li
                key={m.name}
                className="border border-white/8 px-4 py-3 transition-colors duration-300 hover:border-gold/40"
              >
                <p className="text-sm text-ivory/80">{m.name}</p>
                <p className="mt-1 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/35">{m.role}</p>
              </li>
            ))}
          </ul>
        </div>

        <Rule className="mt-14" />

        <p className="pt-6 text-xs leading-relaxed text-ivory/35">{IDENTITY.desambiguisation}</p>
        <div className="flex flex-col gap-4 pt-4 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/35 md:flex-row md:items-center md:justify-between">
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
            <span className="text-ivory/25">Site canonique : hervenanfang.vercel.app</span>
          </div>
        </div>
      </Container>
    </footer>
  )
}
