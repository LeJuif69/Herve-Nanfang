/**
 * Suivi des sources de trafic et paramètres UTM pour Hervé Nanfang
 * Stocke la provenance dans sessionStorage pour attribution automatique des conversions.
 */

export interface TrafficAttribution {
  utm_source?: string
  utm_medium?: string
  utm_campaign?: string
  utm_term?: string
  utm_content?: string
  ref?: string
  referrer?: string
  landing_page?: string
  timestamp?: string
}

const STORAGE_KEY = 'hn_traffic_attribution'

export function captureTrafficAttribution(): void {
  if (typeof window === 'undefined') return

  try {
    const params = new URLSearchParams(window.location.search)
    const utm_source = params.get('utm_source') || undefined
    const utm_medium = params.get('utm_medium') || undefined
    const utm_campaign = params.get('utm_campaign') || undefined
    const utm_term = params.get('utm_term') || undefined
    const utm_content = params.get('utm_content') || undefined
    const ref = params.get('ref') || undefined

    const hasUtm = utm_source || utm_medium || utm_campaign || ref

    // Si des paramètres UTM sont présents, on les enregistre (ou remplace)
    if (hasUtm) {
      const data: TrafficAttribution = {
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
        ref,
        landing_page: window.location.pathname,
        timestamp: new Date().toISOString(),
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
      return
    }

    // Sinon, si on n'a rien encore en session et qu'un referrer externe existe
    const existing = sessionStorage.getItem(STORAGE_KEY)
    if (!existing && document.referrer) {
      try {
        const refUrl = new URL(document.referrer)
        if (refUrl.hostname !== window.location.hostname) {
          const data: TrafficAttribution = {
            referrer: document.referrer,
            landing_page: window.location.pathname,
            timestamp: new Date().toISOString(),
          }
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        }
      } catch {
        // Ignorer les referrers invalides
      }
    }
  } catch (err) {
    console.warn('Erreur capture UTM:', err)
  }
}

export function getTrafficAttribution(): TrafficAttribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as TrafficAttribution) : null
  } catch {
    return null
  }
}

export function formatAttributionTag(): string {
  const attr = getTrafficAttribution()
  if (!attr) return ''

  const parts: string[] = []
  if (attr.utm_source) parts.push(`Source: ${attr.utm_source}`)
  if (attr.utm_medium) parts.push(`Medium: ${attr.utm_medium}`)
  if (attr.utm_campaign) parts.push(`Campagne: ${attr.utm_campaign}`)
  if (attr.ref) parts.push(`Ref: ${attr.ref}`)
  if (attr.referrer && !attr.utm_source) parts.push(`Referrer: ${attr.referrer}`)
  if (attr.landing_page) parts.push(`Entrée: ${attr.landing_page}`)

  if (parts.length === 0) return ''
  return `[Attribution: ${parts.join(' | ')}]`
}
