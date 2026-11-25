/**
 * Vercel Serverless Function — /api/track-event (POST)
 * Stack: Vite + React SPA hosted on Vercel (not Next.js).
 *
 * Payload: { event: string, params?: Record<string, any> }
 * Forwards to GA4 Measurement Protocol.
 *
 * Required env vars:
 *   VITE_GA4_MEASUREMENT_ID  — GA4 Measurement ID (G-XXXXXXXXXX)
 *   GA4_API_SECRET           — GA4 Measurement Protocol API Secret
 */

const GA4_MP_URL = 'https://www.google-analytics.com/mp/collect'

function corsHeaders(req) {
  const origin = req.headers.origin || 'https://hervenanfang.art'
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
}

export default async function handler(req, res) {
  const headers = corsHeaders(req)

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).set(headers).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).set(headers).json({ error: 'Method Not Allowed' })
  }

  const { event, params, client_id } = req.body ?? {}
  if (!event || typeof event !== 'string') {
    return res.status(400).set(headers).json({ error: 'Missing event name' })
  }

  const measurementId = process.env.VITE_GA4_MEASUREMENT_ID
  const apiSecret = process.env.GA4_API_SECRET

  if (!measurementId || !apiSecret) {
    console.warn('[track-event] GA4 credentials not configured — event dropped:', event)
    // Return 200 to avoid breaking the client
    return res.status(200).set(headers).json({ success: false, reason: 'GA4 not configured' })
  }

  const payload = {
    client_id: client_id || `anon.${Date.now()}`,
    events: [
      {
        name: event,
        params: {
          engagement_time_msec: 100,
          ...(params ?? {}),
        },
      },
    ],
  }

  try {
    const url = `${GA4_MP_URL}?measurement_id=${measurementId}&api_secret=${apiSecret}`
    const gaRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!gaRes.ok) {
      const txt = await gaRes.text()
      console.error('[track-event] GA4 error:', txt)
      return res.status(502).set(headers).json({ error: 'GA4 upstream error' })
    }

    return res.status(200).set(headers).json({ success: true, event })
  } catch (err) {
    console.error('[track-event] Error:', err.message)
    return res.status(500).set(headers).json({ error: 'Internal Server Error' })
  }
}
