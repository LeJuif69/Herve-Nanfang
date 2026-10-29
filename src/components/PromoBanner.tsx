import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { adminStore } from '../lib/admin-store'
import { trackAdEvent } from '../lib/ad-pixels'

const DISMISS_STORAGE_KEY = 'hn_promo_banner_dismissed_v1'

export default function PromoBanner() {
  const [dismissed, setDismissed] = useState(true)
  const [state, setState] = useState(() => adminStore.getState())
  const location = useLocation()

  useEffect(() => {
    // Vérifier si la bannière a déjà été masquée pour cette session
    try {
      const isDismissed = sessionStorage.getItem(DISMISS_STORAGE_KEY) === 'true'
      setDismissed(isDismissed)
    } catch {
      setDismissed(false)
    }

    const unsub = adminStore.subscribe((next) => setState(next))
    return unsub
  }, [])

  // Masquer sur les pages d'administration
  if (location.pathname.startsWith('/admin')) return null

  const settings = state.settings
  const isEnabled = settings.promoBannerEnabled ?? false

  if (!isEnabled || dismissed) return null

  const campaign = settings.promoBannerCampaign || 'rma'

  // Définition des campagnes
  let badge = 'OFFRE SPÉCIALE'
  let text = 'Sessions d’Audition & Diagnostic — Racines Musicales Academy® (RMA)'
  let ctaText = 'Réserver mon audition'
  let ctaLink = '/rma?utm_source=site&utm_medium=promo_banner&utm_campaign=audition_rma#audition'
  let promoImg = '/images/cours-isma-synthese-1241.webp'

  if (campaign === 'pianobariste') {
    badge = 'SAISON 2026'
    text = 'Le Pianobariste™ — Réservations ouvertes pour vos cocktails, réceptions et dîners de gala'
    ctaText = 'Simuler mon événement'
    ctaLink = '/musique?utm_source=site&utm_medium=promo_banner&utm_campaign=pianobariste_2026#pianobariste'
    promoImg = '/images/affiche-pianobariste.webp'
  } else if (campaign === 'custom' && settings.promoBannerCustomText) {
    badge = 'ACTUALITÉ'
    text = settings.promoBannerCustomText
    ctaText = settings.promoBannerCustomCta || 'En savoir plus'
    ctaLink = settings.promoBannerCustomUrl || '/contact'
    promoImg = ''
  }

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDismissed(true)
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, 'true')
    } catch {
      // ignore
    }
  }

  const handleCtaClick = () => {
    trackAdEvent('PromoBannerClick', {
      campaign,
      target: ctaLink,
    })
  }

  return (
    <div
      role="region"
      aria-label="Annonce promotionnelle"
      className="relative z-50 border-b border-gold/30 bg-gradient-to-r from-ink via-gold/15 to-ink text-ivory text-xs px-4 py-2 transition-all duration-300"
    >
      <div className="mx-auto flex max-w-[86rem] items-center justify-between gap-3 px-2 md:px-6">
        {/* Contenu principal */}
        <div className="flex flex-1 items-center justify-center gap-2 sm:gap-3.5 overflow-hidden text-center sm:text-left">
          {promoImg && (
            <img
              src={promoImg}
              alt={badge}
              className="hidden sm:inline-block h-6 w-6 rounded-full object-cover border border-gold/60 shadow-sm shrink-0"
              loading="lazy"
            />
          )}
          <span className="hidden sm:inline-flex items-center rounded-full border border-gold/40 bg-gold/20 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-gold shrink-0">
            {badge}
          </span>
          <p className="truncate text-xs font-medium text-ivory/90 sm:text-sm">
            {text}
          </p>
          <Link
            to={ctaLink}
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-gold px-3 py-1 text-[11px] font-semibold text-ink uppercase tracking-wider hover:bg-gold-light hover:shadow-[0_0_12px_rgba(198,161,91,0.5)] transition shrink-0"
          >
            <span>{ctaText}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Bouton fermeture */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Fermer l'annonce"
          className="rounded p-1 text-ivory/50 hover:text-ivory hover:bg-white/10 transition shrink-0"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  )
}
