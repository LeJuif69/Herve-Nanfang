import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_PRIMARY, NAV_SECONDARY, SITE } from '../data/site'
import { useCommandMenu } from '../lib/command-menu-context'
import ScrollProgress from './ScrollProgress'

export default function Header() {
  const { openCommandMenu } = useCommandMenu()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname, location.hash])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <ScrollProgress />
      {/* Bandeau secondaire */}
      <div
        className={`hidden border-b border-white/5 bg-ink transition-all duration-500 lg:block ${
          scrolled ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-[86rem] items-center justify-between px-10 py-2.5 lg:px-14">
          <p className="eyebrow text-[0.6rem] text-ivory/45">{SITE.rolesShort}</p>
          <nav aria-label="Navigation secondaire" className="flex items-center gap-7">
            {NAV_SECONDARY.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-ivory/55 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Barre principale */}
      <div
        className={`border-b transition-all duration-500 ${
          scrolled
            ? 'border-white/10 bg-ink/92 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl'
            : 'border-white/5 bg-gradient-to-b from-ink/85 to-ink/40 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-14">
          <Link to="/" className="group flex items-center gap-3.5" aria-label="Hervé Nanfang — accueil">
            {/* Écrin du monogramme initiales HN */}
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-ink-2 via-black to-ink p-1.5 shadow-[0_0_15px_rgba(198,161,91,0.2)] ring-1 ring-gold/20 transition-all duration-300 group-hover:scale-105 group-hover:border-gold group-hover:shadow-[0_0_25px_rgba(198,161,91,0.4)]">
              <img
                src="/hn-initials-mark.png"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="leading-none">
              <span className="block font-display text-[1.35rem] tracking-[0.02em] text-ivory md:text-[1.55rem]">
                Hervé Nanfang
              </span>
              <span className="mt-1 block text-[0.55rem] font-semibold uppercase tracking-[0.34em] text-gold/80">
                Créer · Transmettre · Augmenter · Développer
              </span>
            </span>
          </Link>

          <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:flex">
            {NAV_PRIMARY.slice(1, 8).map((item) => (
              <NavLink
                key={item.label}
                to={item.to}
                className={({ isActive }) =>
                  `relative text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    isActive
                      ? 'text-gold after:absolute after:-bottom-[18px] after:left-0 after:right-0 after:h-px after:bg-gold/60'
                      : 'text-ivory/70 hover:text-ivory'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {/* Bouton Palette de commande ⌘K */}
            <button
              type="button"
              onClick={openCommandMenu}
              aria-label="Rechercher sur le site (Raccourci ⌘K ou Ctrl+K)"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-ivory/70 transition-all hover:border-gold/50 hover:bg-gold/10 hover:text-gold"
            >
              <svg
                className="h-3.5 w-3.5 text-gold/80"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <span className="hidden sm:inline text-[0.625rem] font-semibold uppercase tracking-wider">
                Recherche
              </span>
              <kbd className="hidden sm:inline rounded border border-white/10 bg-ink px-1.5 py-0.5 font-mono text-[0.55rem] text-gold/90">
                ⌘K
              </kbd>
            </button>

            <Link
              to="/contact"
              className="hidden border border-gold/60 px-5 py-3 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-ink md:inline-block"
            >
              Contact
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-controls="site-menu"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 border border-white/15 xl:hidden"
            >
              <span
                className={`block h-px w-5 bg-ivory transition-transform duration-300 ${
                  open ? 'translate-y-[3.5px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-px w-5 bg-ivory transition-transform duration-300 ${
                  open ? '-translate-y-[3.5px] -rotate-45' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Menu compact */}
      <button
        type="button"
        aria-label="Fermer le menu"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/65 transition-opacity duration-300 xl:hidden ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />
      <div
        id="site-menu"
        aria-hidden={!open}
        className={`fixed inset-y-0 right-0 z-40 h-dvh w-full max-w-[34rem] overflow-y-auto border-l border-white/10 bg-ink/98 shadow-2xl backdrop-blur-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] xl:hidden ${
          open ? 'visible translate-x-0' : 'invisible pointer-events-none translate-x-full'
        }`}
      >
        <div className="mx-auto max-w-xl px-6 pb-12 pt-28 sm:px-9">
          <div className="mb-7 flex items-end justify-between border-b border-white/10 pb-5">
            <div className="flex items-center gap-3.5">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/40 bg-gradient-to-br from-ink-2 via-black to-ink p-1.5 shadow-[0_0_15px_rgba(198,161,91,0.2)] ring-1 ring-gold/20">
                <img
                  src="/hn-initials-mark.png"
                  alt=""
                  aria-hidden="true"
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <p className="eyebrow text-gold">Hervé Nanfang</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">Navigation</h2>
              </div>
            </div>
            <span className="text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">
              {String(NAV_PRIMARY.length).padStart(2, '0')} rubriques
            </span>
          </div>

          <nav aria-label="Navigation principale">
            <ul className="grid grid-cols-2 gap-x-6 border-y border-white/10">
              {NAV_PRIMARY.map((item, i) => (
                <li key={item.label} className="border-b border-white/8">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `group flex min-h-[4.25rem] items-center justify-between gap-2 py-3 font-display text-xl leading-tight transition-colors sm:text-2xl ${
                    isActive ? 'text-gold' : 'text-ivory/85 hover:text-gold'
                  }`
                }
              >
                <span>{item.label}</span>
                <span className="shrink-0 font-sans text-[0.6rem] tracking-[0.16em] text-gold/55 transition-colors group-hover:text-gold">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <p className="eyebrow mt-8 text-ivory/40">Ressources & réservation</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">
            {NAV_SECONDARY.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-ivory/60 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {SITE.phones.map((phone) => (
                <a key={phone.tel} href={`tel:${phone.tel}`} className="font-display text-lg text-gold transition-colors hover:text-gold-2">
                  {phone.display}
                </a>
              ))}
            </div>
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ivory/40">{SITE.city}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
