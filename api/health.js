import { timingSafeEqual } from 'node:crypto'

const ALLOWED_ORIGIN = 'https://hervenanfang.art'
const PROBE_TIMEOUT_MS = 5000

function setHeaders(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('Content-Type', 'application/json')
  res.setHeader('Vary', 'Origin')

  if (req.headers.origin === ALLOWED_ORIGIN) {
    res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN)
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  }
}

function hasValidToken(req, expectedToken) {
  const authorization = req.headers.authorization
  if (typeof authorization !== 'string' || !authorization.startsWith('Bearer ')) {
    return false
  }

  const supplied = Buffer.from(authorization.slice(7))
  const expected = Buffer.from(expectedToken)

  return supplied.length === expected.length && timingSafeEqual(supplied, expected)
}

function unavailable(res) {
  return res.status(503).json({ status: 'unavailable' })
}

export default async function handler(req, res) {
  setHeaders(req, res)

  if (req.method === 'OPTIONS') {
    return res.status(204).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const healthToken = process.env.HEALTHCHECK_TOKEN
  if (!healthToken || Buffer.byteLength(healthToken, 'utf8') < 32) {
    return unavailable(res)
  }

  if (!hasValidToken(req, healthToken)) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!supabaseUrl || !serviceKey) {
    return unavailable(res)
  }

  let endpoint
  try {
    endpoint = new URL('/rest/v1/leads?select=id&limit=1', supabaseUrl)
    if (endpoint.protocol !== 'https:' || !endpoint.hostname.endsWith('.supabase.co')) {
      return unavailable(res)
    }
  } catch {
    return unavailable(res)
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

  try {
    const response = await fetch(endpoint, {
      method: 'HEAD',
      headers: {
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
      },
      signal: controller.signal,
    })

    if (!response.ok) {
      console.error('[health] Supabase probe failed with HTTP status', response.status)
      return unavailable(res)
    }

    return res.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('[health] Supabase probe failed:', error.name || 'Error')
    return unavailable(res)
  } finally {
    clearTimeout(timeout)
  }
}
