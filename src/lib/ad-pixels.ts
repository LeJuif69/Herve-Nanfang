/**
 * Module de suivi publicitaire & pixels de conversion
 * Supporte : Meta Pixel (Facebook & Instagram Ads) et Google Ads / Google Tag
 */

import { adminStore } from './admin-store'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let metaPixelInitialized = false
let googleAdsInitialized = false

/**
 * Initialise les pixels publicitaires déclarés (soit dans adminSettings, soit dans les envs).
 */
export function initAdPixels(): void {
  if (typeof window === 'undefined') return

  try {
    const settings = adminStore.getState().settings

    // 1. Meta Pixel (Facebook / Instagram Ads)
    const metaPixelId =
      settings.metaPixelId?.trim() ||
      (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim()

    if (metaPixelId && !metaPixelInitialized) {
      injectMetaPixel(metaPixelId)
      metaPixelInitialized = true
    }

    // 2. Google Ads / Tag
    const googleAdsId =
      settings.googleAdsId?.trim() ||
      settings.googleAnalyticsId?.trim() ||
      (import.meta.env.VITE_GOOGLE_ADS_ID as string | undefined)?.trim()

    if (googleAdsId && !googleAdsInitialized) {
      injectGoogleTag(googleAdsId)
      googleAdsInitialized = true
    }
  } catch (err) {
    console.warn('Erreur initialisation pixels publicitaires:', err)
  }
}

function injectMetaPixel(pixelId: string): void {
  if (window.fbq) return

  /* eslint-disable */
  const n = (window.fbq = function (...args: unknown[]) {
    // @ts-ignore
    n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args)
  }) as any
  if (!window._fbq) window._fbq = n
  n.push = n
  n.loaded = true
  n.version = '2.0'
  n.queue = []
  /* eslint-enable */

  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)

  window.fbq('init', pixelId)
  window.fbq('track', 'PageView')
  console.log(`[AdPixels] Meta Pixel ${pixelId} initialisé avec succès.`)
}

function injectGoogleTag(tagId: string): void {
  if (window.gtag) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer?.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', tagId, { send_page_view: true })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(tagId)}`
  document.head.appendChild(script)

  console.log(`[AdPixels] Google Tag ${tagId} initialisé avec succès.`)
}

/**
 * Déclenche un événement de conversion personnalisé ou standard
 */
export function trackAdEvent(eventName: string, params: Record<string, unknown> = {}): void {
  if (typeof window === 'undefined') return

  try {
    // Meta Pixel
    if (typeof window.fbq === 'function') {
      window.fbq('track', eventName, params)
    }

    // Google Tag
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params)
    }

    console.log(`[AdPixels Event] ${eventName}`, params)
  } catch (err) {
    console.warn(`[AdPixels] Erreur envoi événement ${eventName}:`, err)
  }
}

/**
 * Enregistre une conversion prospect (Lead) — très important pour Meta & Google Ads
 */
export function trackLeadConversion(
  source: 'contact' | 'rma_audition' | 'whatsapp' | 'newsletter_signup' | 'lead_magnet',
  details: {
    category?: string
    route?: string
    value?: number
    interest?: string
    [key: string]: unknown
  } = {},
): void {
  trackAdEvent('Lead', {
    content_category: details.category || source,
    content_name: details.route || details.interest || source,
    currency: 'XAF',
    value: details.value || 0,
    source,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Enregistre la consultation d'un contenu clé (ex: Pianobariste, RMA)
 */
export function trackContentView(contentName: string, category: string = 'Service'): void {
  trackAdEvent('ViewContent', {
    content_name: contentName,
    content_category: category,
  })
}
