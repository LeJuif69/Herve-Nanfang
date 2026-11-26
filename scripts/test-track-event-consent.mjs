import assert from 'node:assert/strict'
import trackEvent from '../api/track-event.js'

const originalFetch = globalThis.fetch
const originalMeasurementId = process.env.VITE_GA4_MEASUREMENT_ID
const originalApiSecret = process.env.GA4_API_SECRET

process.env.VITE_GA4_MEASUREMENT_ID = 'G-TEST123456'
process.env.GA4_API_SECRET = 'test-secret'

function createResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    set(headers) {
      Object.assign(this.headers, headers)
      return this
    },
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
    end() {
      return this
    },
  }
}

try {
  const calls = []
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options })
    return { ok: true, status: 204 }
  }

  const deniedResponse = createResponse()
  await trackEvent(
    {
      method: 'POST',
      headers: { origin: 'https://hervenanfang.art' },
      body: { event: 'newsletter_signup', analyticsConsent: false },
    },
    deniedResponse,
  )

  assert.equal(deniedResponse.statusCode, 200)
  assert.equal(deniedResponse.body.success, false)
  assert.equal(calls.length, 0, 'the server must not send GA4 events without explicit consent')

  const consentedResponse = createResponse()
  await trackEvent(
    {
      method: 'POST',
      headers: { origin: 'https://hervenanfang.art' },
      body: {
        event: 'newsletter_signup',
        params: { source: 'test' },
        analyticsConsent: true,
      },
    },
    consentedResponse,
  )

  assert.equal(consentedResponse.statusCode, 200)
  assert.equal(consentedResponse.body.success, true)
  assert.equal(calls.length, 1, 'a consented event should be sent once')

  console.log('GA4 Measurement Protocol only forwards events when consent is explicit.')
} finally {
  globalThis.fetch = originalFetch
  if (originalMeasurementId === undefined) delete process.env.VITE_GA4_MEASUREMENT_ID
  else process.env.VITE_GA4_MEASUREMENT_ID = originalMeasurementId
  if (originalApiSecret === undefined) delete process.env.GA4_API_SECRET
  else process.env.GA4_API_SECRET = originalApiSecret
}
