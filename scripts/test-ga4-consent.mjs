import assert from 'node:assert/strict'

const originalWindow = globalThis.window
const { hasAdsConsent, trackGA4 } = await import('../src/lib/ga4.ts')

try {
  const events = []
  globalThis.window = {
    localStorage: { getItem: () => null },
    gtag: (...args) => events.push(args),
  }

  assert.doesNotThrow(() => trackGA4('newsletter_signup', { source: 'test' }))
  assert.equal(events.length, 0, 'GA4 must not receive events without explicit analytics consent')
  assert.equal(hasAdsConsent(), false, 'advertising consent must default to false')

  globalThis.window.localStorage.getItem = () => JSON.stringify({ ga4: true, ads: false })
  assert.equal(hasAdsConsent(), false, 'analytics consent does not imply advertising consent')
  delete globalThis.window.gtag
  assert.doesNotThrow(() => trackGA4('newsletter_signup', { source: 'test' }))

  globalThis.window.gtag = (...args) => events.push(args)
  trackGA4('newsletter_signup', { source: 'test' })
  assert.deepEqual(events, [['event', 'newsletter_signup', { source: 'test' }]])

  globalThis.window.localStorage.getItem = () => JSON.stringify({ ga4: true, ads: true })
  assert.equal(hasAdsConsent(), true, 'advertising consent is read independently')

  console.log('GA4 client tracking respects consent and safely handles a not-yet-loaded gtag.')
} finally {
  if (originalWindow === undefined) delete globalThis.window
  else globalThis.window = originalWindow
}
