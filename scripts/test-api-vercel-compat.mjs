import assert from 'node:assert/strict'
import leadMagnet from '../api/lead-magnet.js'
import trackEvent from '../api/track-event.js'

function createVercelResponse() {
  return {
    statusCode: 200,
    headers: {},
    body: undefined,
    setHeader(name, value) {
      this.headers[name] = value
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

const request = {
  method: 'GET',
  headers: { origin: 'https://hervenanfang.art' },
}

for (const [name, handler] of [
  ['lead-magnet', leadMagnet],
  ['track-event', trackEvent],
]) {
  const response = createVercelResponse()
  await handler(request, response)
  assert.equal(response.statusCode, 405, `${name} GET should return 405`)
  assert.deepEqual(response.body, { error: 'Method Not Allowed' })
  assert.equal(response.headers['Access-Control-Allow-Origin'], request.headers.origin)
}

const originalFetch = globalThis.fetch
const leadEnvironmentKeys = [
  'BREVO_API_KEY',
  'RESEND_API_KEY',
  'SUPABASE_URL',
  'VITE_SUPABASE_URL',
  'SUPABASE_SERVICE_KEY',
]
const originalLeadEnvironment = Object.fromEntries(
  leadEnvironmentKeys.map((key) => [key, process.env[key]]),
)

try {
  for (const key of leadEnvironmentKeys) delete process.env[key]
  globalThis.fetch = async () => {
    throw new Error('No upstream request should run without configured persistence')
  }

  const unavailableResponse = createVercelResponse()
  await leadMagnet(
    {
      method: 'POST',
      headers: request.headers,
      body: { email: 'test@example.com', name: 'Test User' },
    },
    unavailableResponse,
  )
  assert.equal(unavailableResponse.statusCode, 503)

  process.env.SUPABASE_URL = 'https://supabase.invalid'
  process.env.SUPABASE_SERVICE_KEY = 'test-service-key'
  globalThis.fetch = async () => ({
    ok: false,
    status: 503,
    text: async () => 'temporary upstream failure',
  })
  const failedStorageResponse = createVercelResponse()
  await leadMagnet(
    {
      method: 'POST',
      headers: request.headers,
      body: { email: 'test@example.com', name: 'Test User' },
    },
    failedStorageResponse,
  )
  assert.equal(failedStorageResponse.statusCode, 503)

  process.env.BREVO_API_KEY = 'test-brevo-key'
  let failedSubscriptionCalls = 0
  globalThis.fetch = async () => {
    failedSubscriptionCalls += 1
    return { ok: false, status: 503, text: async () => 'temporary upstream failure' }
  }
  const failedSubscriptionResponse = createVercelResponse()
  await leadMagnet(
    {
      method: 'POST',
      headers: request.headers,
      body: { email: 'test@example.com', name: 'Test User' },
    },
    failedSubscriptionResponse,
  )
  assert.equal(failedSubscriptionResponse.statusCode, 503)
  assert.equal(failedSubscriptionCalls, 2)

  delete process.env.SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_KEY
  let upstreamCalls = 0
  globalThis.fetch = async () => {
    upstreamCalls += 1
    return { ok: true, status: 201 }
  }

  const response = createVercelResponse()
  await leadMagnet(
    {
      method: 'POST',
      headers: request.headers,
      body: { email: 'test@example.com', name: 'Test User' },
    },
    response,
  )

  assert.equal(response.statusCode, 200)
  assert.equal(response.body.success, true)
  assert.equal(upstreamCalls, 2, 'a successful lead should subscribe and receive its delivery email')

  let failedDeliveryCalls = 0
  globalThis.fetch = async () => {
    failedDeliveryCalls += 1
    return failedDeliveryCalls === 1
      ? { ok: true, status: 201 }
      : { ok: false, status: 503, text: async () => 'temporary upstream failure' }
  }
  const failedDeliveryResponse = createVercelResponse()
  await leadMagnet(
    {
      method: 'POST',
      headers: request.headers,
      body: { email: 'test@example.com', name: 'Test User' },
    },
    failedDeliveryResponse,
  )
  assert.equal(failedDeliveryResponse.statusCode, 502)
  assert.equal(failedDeliveryCalls, 2)
} finally {
  globalThis.fetch = originalFetch
  for (const [key, value] of Object.entries(originalLeadEnvironment)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
}

console.log('Lead and tracking endpoints use the Vercel response API for requests.')
