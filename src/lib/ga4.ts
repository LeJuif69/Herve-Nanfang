type Gtag = (command: 'event', eventName: string, params: Record<string, unknown>) => void
type WindowWithGtag = Window & { gtag?: Gtag }

export function hasAnalyticsConsent(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const stored = window.localStorage.getItem('hvnf_consent')
    return JSON.parse(stored || 'null')?.ga4 === true
  } catch {
    return false
  }
}

export function hasAdsConsent(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const stored = window.localStorage.getItem('hvnf_consent')
    return JSON.parse(stored || 'null')?.ads === true
  } catch {
    return false
  }
}

export function trackGA4(eventName: string, params: Record<string, unknown>) {
  if (!hasAnalyticsConsent()) return

  const gtag = (window as WindowWithGtag).gtag
  if (typeof gtag === 'function') gtag('event', eventName, params)
}
