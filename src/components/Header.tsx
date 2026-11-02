import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { NAV_PRIMARY, NAV_SECONDARY, SITE } from '../data/site'
import { useCommandMenu } from '../lib/command-menu-context'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [musicDropdownOpen, setMusicDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [readingProgress, setReadingProgress] = useState(0)
  const { openCommandMenu } = useCommandMenu()
  const location = useLocation()

  // Fermer le menu compact lors d'un changement d'URL
  useEffect(() => {
    setOpen(false)
    setMusicDropdownOpen(false)
  }, [location.pathname])

  // Détecter le défilement pour adapter l'en-tête et calculer la progression
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY
          setScrolled(y > 32)

          const docHeight = document.documentElement.scrollHeight - window.innerHeight
          if (docHeight > 0) {
            setReadingProgress(Math.min(100, Math.max(0, (y / docHeight) * 100)))
          } else {
            setReadingProgress(0)
          }
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Échap pour fermer le menu
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Bloquer le défilement de fond quand le menu est ouvert
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Barre de progression de lecture au sommet absolu */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
      >
        <div
          className="h-full bg-gradient-to-r from-gold-3 via-gold to-gold-2 shadow-[0_0_8px_rgba(198,161,91,0.5)] transition-transform duration-75 ease-out"
          style={{
            transform: `scaleX(${readingProgress / 100})`,
            transformOrigin: 'left',
            opacity: scrolled ? 1 : 0,
          }}
        />
      </div>

      {/* Barre supérieure — escamotable au scroll */}
      <div
        className={`hidden border-b border-white/5 bg-ink transition-all duration-500 lg:block ${
          scrolled ? 'max-h-0 overflow-hidden border-transparent py-0 opacity-0' : 'max-h-12 opacity-100'
        }`}
      >
        <div className="mx-auto flex max-w-[86rem] items-center justify-between px-10 py-2.5 lg:px-14">
          <p className="eyebrow text-[0.6rem] text-ivory/45">
            Musicologue · Artiste-musicien · Pédagogue · Ingénieur du son · Concepteur de programmes
          </p>
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
            ? 'border-gold/20 bg-ink/95 py-3 shadow-[0_10px_35px_rgba(0,0,0,0.85)] backdrop-blur-xl'
            : 'border-white/5 bg-gradient-to-b from-ink/85 to-ink/40 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-6 px-6 py-4 md:px-10 lg:px-14">
          {/* Logo marque */}
          <Link
            to="/"
            className="group flex items-center gap-3.5"
            aria-label="Hervé Nanfang — accueil"
          >
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

          {/* Navigation desktop avec sous-menu pour Musique & Scène */}
          <nav aria-label="Navigation principale" className="hidden items-center gap-6 xl:flex">
            {NAV_PRIMARY.slice(1, 8).map((item) => {
              if (item.children && item.children.length > 0) {
                const isChildActive = location.pathname === item.to || item.children.some(c => location.pathname === c.to)

                return (
                  <div
                    key={item.label}
                    className="relative group py-2"
                    onMouseEnter={() => setMusicDropdownOpen(true)}
                    onMouseLeave={() => setMusicDropdownOpen(false)}
                  >
                    <NavLink
                      to={item.to}
                      className={() =>
                        `relative flex items-center gap-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                          isChildActive
                            ? 'text-gold after:absolute after:-bottom-[18px] after:left-0 after:right-0 after:h-px after:bg-gold/60'
                            : 'text-ivory/70 hover:text-ivory'
                        }`
                      }
                    >
                      <span>{item.label}</span>
                      <svg
                        className={`h-3 w-3 text-gold/70 transition-transform duration-200 ${
                          musicDropdownOpen ? 'rotate-180 text-gold' : ''
                        }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </NavLink>

                    {/* Menu déroulant / sous-branche */}
                    <div
                      className={`absolute top-full left-0 mt-1 w-64 rounded-xl border border-gold/30 bg-ink-2/95 p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 ${
                        musicDropdownOpen
                          ? 'opacity-100 visible translate-y-0 pointer-events-auto'
                          : 'opacity-0 invisible -translate-y-2 pointer-events-none'
                      }`}
                    >
                      {item.children.map((sub) => {
                        const isSubActive = location.pathname === sub.to
                        return (
                          <Link
                            key={sub.label}
                            to={sub.to}
                            onClick={() => setMusicDropdownOpen(false)}
                            className={`flex flex-col rounded-lg p-2.5 transition-colors ${
                              isSubActive
                                ? 'bg-gold/15 text-gold'
                                : 'text-ivory/80 hover:bg-white/5 hover:text-gold'
                            }`}
                          >
                            <span className="text-xs font-semibold tracking-wide flex items-center justify-between">
                              {sub.label}
                              {isSubActive && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                            </span>
                            {sub.desc && (
                              <span className="text-[0.65rem] text-ivory/50 mt-0.5">
                                {sub.desc}
                              </span>
                            )}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              }

              return (
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
              )
            })}
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

      {/* Menu compact pour mobile */}
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
                  {/* Si l'item a des sous-branches, les afficher discrètement en dessous */}
                  {item.children && (
                    <div className="pb-3 pl-2 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          to={child.to}
                          className={`block text-xs transition-colors ${
                            location.pathname === child.to
                              ? 'text-gold font-medium'
                              : 'text-ivory/60 hover:text-gold'
                          }`}
                        >
                          ↳ {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
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
            <p className="mt-2 text-xs uppercase tracking-[0.16em] text-ivory/40">
              {SITE.city}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
