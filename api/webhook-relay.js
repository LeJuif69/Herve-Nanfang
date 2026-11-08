import crypto from 'node:crypto'

const N8N_PRODUCTION_WEBHOOK_URL =
  'https://hervenanfang.app.n8n.cloud/webhook/a680fa6e-49a8-48d6-ac29-585120113415'
const N8N_LEGACY_WEBHOOK_URL =
  'https://hervenanfang.app.n8n.cloud/webhook/publication-approved'

const ALLOWED_ADMIN_EMAILS = new Set([
  'nanfang.herve@gmail.com',
  'hello@hervenanfang.art',
  'contact@hervenanfang.art',
  'contact@hervenanfang.com',
  'racinesmusicalesacademy@gmail.com',
])

const recentIdempotencyCache = new Map()
const IDEMPOTENCY_TTL_MS = 60 * 1000 // 60 secondes anti-rebond serveur
const UPSTREAM_TIMEOUT_MS = 12000 // 12 secondes max

function sha256Hex(input) {
  return crypto.createHash('sha256').update(input, 'utf8').digest('hex')
}

function resolveMigratedWebhookUrl(rawUrl) {
  const trimmed = typeof rawUrl === 'string' ? rawUrl.trim() : ''
  if (!trimmed) return N8N_PRODUCTION_WEBHOOK_URL
  const normalized = trimmed.replace(/\/+$/, '')
  if (normalized === N8N_LEGACY_WEBHOOK_URL) {
    return N8N_PRODUCTION_WEBHOOK_URL
  }
  return trimmed
}

function isAllowedTargetUrl(urlStr) {
  try {
    const parsed = new URL(urlStr)
    if (parsed.protocol !== 'https:') return false
    const host = parsed.hostname.toLowerCase()
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === '0.0.0.0' ||
      host.startsWith('10.') ||
      host.startsWith('192.168.') ||
      host.endsWith('.local') ||
      host.endsWith('.internal')
    ) {
      return false
    }
    return true
  } catch {
    return false
  }
}

function verifyAdminSession(authPayload) {
  if (!authPayload || typeof authPayload !== 'object') {
    return { valid: false, reason: 'Session administrateur manquante.' }
  }

  const email = String(authPayload.email || '').trim().toLowerCase()
  const expiresAt = String(authPayload.expiresAt || '').trim()
  const sessionToken = String(authPayload.sessionToken || '').trim()
  const mode = String(authPayload.mode || 'local').trim()

  const envAdminEmail = String(process.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase()
  const isEmailAuthorized =
    ALLOWED_ADMIN_EMAILS.has(email) || (envAdminEmail && email === envAdminEmail)

  if (!isEmailAuthorized) {
    return { valid: false, reason: 'Adresse e-mail administrateur non autorisée.' }
  }

  const expTime = Date.parse(expiresAt)
  if (Number.isNaN(expTime) || expTime <= Date.now()) {
    return { valid: false, reason: 'Session administrateur expirée.' }
  }

  if (mode === 'supabase') {
    return { valid: true, email }
  }

  const effectiveKey = (
    process.env.VITE_ADMIN_ACCESS_KEY ||
    process.env.VITE_ADMIN_DEV_PASSWORD ||
    'MasterHerveNanfang2026!'
  ).trim()

  const expectedToken = sha256Hex(`session:${email}:${expiresAt}:${effectiveKey}`)
  if (!sessionToken || sessionToken !== expectedToken) {
    return { valid: false, reason: 'Jeton de session administrateur invalide.' }
  }

  return { valid: true, email }
}

function validateWebhookEventPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, reason: 'Payload JSON manquant ou invalide.' }
  }
  if (payload.event !== 'publication.approved') {
    return { valid: false, reason: `Événement non supporté : ${String(payload.event)}` }
  }
  if (typeof payload.isTest !== 'boolean') {
    return { valid: false, reason: 'Champ booléen isTest requis dans le contrat WebhookEventPayload.' }
  }
  const post = payload.post || payload.publication
  if (!post || typeof post !== 'object' || !post.id || !post.title) {
    return { valid: false, reason: 'Objet post / publication invalide dans le payload.' }
  }
  return { valid: true }
}

function cleanupIdempotencyCache() {
  const now = Date.now()
  for (const [key, entry] of recentIdempotencyCache.entries()) {
    if (now - entry.timestamp > IDEMPOTENCY_TTL_MS) {
      recentIdempotencyCache.delete(key)
    }
  }
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store, max-age=0')

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-HN-Admin-Session')
    return res.status(204).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      status: 405,
      error: 'Méthode HTTP non autorisée. Utilisez POST.',
    })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({
        success: false,
        status: 400,
        error: 'Corps de requête JSON malformé.',
      })
    }
  }

  if (!body || typeof body !== 'object') {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'Requête vide ou invalide.',
    })
  }

  // 1. Vérification stricte de l'autorisation administrateur
  const authCheck = verifyAdminSession(body.adminAuth)
  if (!authCheck.valid) {
    return res.status(401).json({
      success: false,
      status: 401,
      error: `Non autorisé : ${authCheck.reason}`,
    })
  }

  // 2. Validation du contrat WebhookEventPayload
  const payload = body.payload
  const payloadCheck = validateWebhookEventPayload(payload)
  if (!payloadCheck.valid) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: payloadCheck.reason,
    })
  }

  // 3. Validation et migration de l'URL cible
  const targetUrl = resolveMigratedWebhookUrl(body.targetUrl)
  if (!isAllowedTargetUrl(targetUrl)) {
    return res.status(400).json({
      success: false,
      status: 400,
      error: 'URL Webhook cible invalide (HTTPS requis).',
    })
  }

  // 4. Protection contre les doublons (uniquement pour les approbations réelles isTest === false)
  cleanupIdempotencyCache()
  const contentHash = payload.post?.validationSignature?.contentHash || ''
  const dedupKey = !payload.isTest ? `${payload.post.id}:${contentHash}` : null
  if (dedupKey && recentIdempotencyCache.has(dedupKey)) {
    const cached = recentIdempotencyCache.get(dedupKey)
    return res.status(200).json({
      success: true,
      status: cached.status || 200,
      deduplicated: true,
      message: 'Événement déjà transmis récemment (protection anti-doublon active).',
    })
  }

  // 5. Appel serveur-à-serveur vers n8n (sans en-tête Origin navigateur -> aucun crash CORS 500)
  const effectiveSecret = (
    body.secret ||
    process.env.N8N_WEBHOOK_SECRET ||
    ''
  ).trim()

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS)

  try {
    const upstreamRes = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'HerveNanfang-AdminRelay/1.0 (+https://hervenanfang.art)',
        ...(effectiveSecret ? { 'X-HN-Webhook-Secret': effectiveSecret } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    const rawText = await upstreamRes.text()
    let parsedUpstream = null
    try {
      parsedUpstream = rawText ? JSON.parse(rawText) : null
    } catch {
      parsedUpstream = null
    }

    if (upstreamRes.ok) {
      if (dedupKey) {
        recentIdempotencyCache.set(dedupKey, {
          timestamp: Date.now(),
          status: upstreamRes.status,
        })
      }
      return res.status(200).json({
        success: true,
        status: upstreamRes.status,
        upstreamResponse: parsedUpstream || rawText.slice(0, 300),
      })
    }

    // Diagnostic précis pour n8n (ex: 404 workflow inactif ou méthode GET au lieu de POST)
    let diagnosticError = `Le serveur n8n a répondu HTTP ${upstreamRes.status}`
    if (upstreamRes.status === 404 && parsedUpstream?.message) {
      if (String(parsedUpstream.message).includes('not registered')) {
        diagnosticError =
          'Connexion réseau établie avec n8n Cloud (aucun blocage CORS), mais le workflow n8n est actuellement INACTIF (HTTP 404 : Webhook non enregistré). Activez le bouton "Active" en haut à droite dans n8n et vérifiez que le nœud Webhook est en méthode POST.'
      } else {
        diagnosticError = `n8n HTTP 404 : ${parsedUpstream.message}`
      }
    } else if (parsedUpstream?.message) {
      diagnosticError = `n8n HTTP ${upstreamRes.status} : ${parsedUpstream.message}`
    }

    return res.status(200).json({
      success: false,
      status: upstreamRes.status,
      error: diagnosticError,
      upstreamMessage: parsedUpstream?.message || undefined,
      upstreamHint: parsedUpstream?.hint || undefined,
    })
  } catch (err) {
    clearTimeout(timeoutId)
    const isTimeout = err && err.name === 'AbortError'
    return res.status(200).json({
      success: false,
      status: isTimeout ? 504 : 502,
      error: isTimeout
        ? 'Délai d’attente dépassé (12s) lors de la connexion à n8n Cloud.'
        : `Erreur réseau serveur vers n8n : ${err instanceof Error ? err.message : 'Inconnue'}`,
    })
  }
}

