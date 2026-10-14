import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Commandes de navigation flottantes universelles :
 * - Bouton « Retour arrière » (avec historique ou repli vers l'accueil)
 * - Bouton « Haut de page » (défilement fluide avec repère visuel)
 */
export default function FloatingNavControls() {
  const location = useLocation()
  const navigate = useNavigate()

  const [showScrollTop, setShowScrollTop] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Le bouton retour s'affiche dès que l'utilisateur est sur une page interne
  const canGoBack = location.pathname !== '/'

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setShowScrollTop(scrollY > 300)

      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      if (docHeight > 0) {
        setScrollProgress(Math.min(100, Math.round((scrollY / docHeight) * 100)))
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBack = () => {
    // Si un historique de navigation existe dans la session, on recule, sinon retour à l'accueil
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Si on est sur l'accueil et qu'on n'a pas défilé, ne rien afficher
  if (!canGoBack && !showScrollTop) {
    return null
  }

  return (
    <aside
      aria-label="Commandes rapides de navigation"
      className="fixed bottom-4 left-4 z-40 flex items-center gap-2 select-none sm:bottom-6 sm:left-6 print:hidden"
    >
      {/* 1. Bouton Retour Arrière */}
      {canGoBack && (
        <button
          type="button"
          onClick={handleBack}
          aria-label="Retourner à la page précédente"
          title="Retourner à la page précédente"
          className="group flex items-center gap-2 rounded-full border border-gold/40 bg-ink-2/95 px-3.5 py-2 text-ivory/85 shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider">
            Retour
          </span>
        </button>
      )}

      {/* 2. Bouton Haut de Page */}
      {showScrollTop && (
        <button
          type="button"
          onClick={handleScrollToTop}
          aria-label="Remonter tout en haut de la page"
          title={`Remonter en haut de page (${scrollProgress}% parcouru)`}
          className="group relative flex items-center gap-2 rounded-full border border-gold/40 bg-ink-2/95 px-3.5 py-2 text-gold shadow-[0_10px_30px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-300 hover:border-gold hover:bg-gold hover:text-ink active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <svg
            className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="12" y1="19" x2="12" y2="5" />
            <polyline points="5 12 12 5 19 12" />
          </svg>
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider">
            Haut
          </span>
          {scrollProgress > 0 && (
            <span className="hidden font-mono text-[0.62rem] opacity-70 sm:inline">
              {scrollProgress}%
            </span>
          )}
        </button>
      )}
    </aside>
  )
}
