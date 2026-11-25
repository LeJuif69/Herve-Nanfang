const N8N_PRODUCTION_WEBHOOK_URL =
  'https://hervenanfang.app.n8n.cloud/webhook/a680fa6e-49a8-48d6-ac29-585120113415'
const N8N_LEGACY_WEBHOOK_URL =
  'https://hervenanfang.app.n8n.cloud/webhook/publication-approved'

const recentIdempotencyCache = new Map()
const IDEMPOTENCY_TTL_MS = 60 * 1000 // 60 secondes anti-rebond serveur
const UPSTREAM_TIMEOUT_MS = 12000 // 12 secondes max
const SUPABASE_AUTH_TIMEOUT_MS = 5000

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

async function fetchSupabaseWithToken(url, accessToken, publishableKey) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), SUPABASE_AUTH_TIMEOUT_MS)

  try {
    return await fetch(url, {
      headers: {
        apikey: publishableKey,
        Authorization: `Bearer ${accessToken}`,
      },
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeoutId)
  }
}

async function verifyAdminSession(authPayload) {
  if (!authPayload || typeof authPayload !== 'object') {
    return { valid: false, status: 401, reason: 'Session administrateur manquante.' }
  }

  const accessToken = String(authPayload.accessToken || '').trim()
  if (!accessToken) {
    return { valid: false, status: 401, reason: 'Jeton d’accès Supabase manquant.' }
  }

  const supabaseUrl = String(process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '')
    .trim()
    .replace(/\/+$/, '')
  const publishableKey = String(
    process.env.SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_ANON_KEY ||
      process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
      process.env.VITE_SUPABASE_ANON_KEY ||
      '',
  ).trim()

  if (!supabaseUrl || !publishableKey) {
    return {
      valid: false,
      status: 503,
      reason: 'La vérification Supabase serveur n’est pas configurée.',
    }
  }

  try {
    const userResponse = await fetchSupabaseWithToken(
      `${supabaseUrl}/auth/v1/user`,
      accessToken,
      publishableKey,
    )
    if (userResponse.status === 401 || userResponse.status === 403) {
      return { valid: false, status: 401, reason: 'Jeton Supabase invalide ou expiré.' }
    }
    if (!userResponse.ok) {
      return { valid: false, status: 502, reason: 'Supabase Auth n’a pas pu vérifier le jeton.' }
    }

    const user = await userResponse.json()
    if (!user || typeof user.id !== 'string' || !user.id) {
      return { valid: false, status: 401, reason: 'Supabase Auth a retourné un utilisateur invalide.' }
    }

    const adminResponse = await fetchSupabaseWithToken(
      `${supabaseUrl}/rest/v1/admin_users?select=user_id&user_id=eq.${encodeURIComponent(user.id)}&limit=1`,
      accessToken,
      publishableKey,
    )
    if (adminResponse.status === 401 || adminResponse.status === 403) {
      return { valid: false, status: 403, reason: 'Accès refusé : compte absent de admin_users.' }
    }
    if (!adminResponse.ok) {
      return { valid: false, status: 502, reason: 'Supabase n’a pas pu vérifier les droits administrateur.' }
    }

    const adminRows = await adminResponse.json()
    if (!Array.isArray(adminRows) || !adminRows.some((row) => row?.user_id === user.id)) {
      return { valid: false, status: 403, reason: 'Accès refusé : compte absent de admin_users.' }
    }

    return { valid: true, email: user.email }
  } catch (error) {
    console.error('[WEBHOOK RELAY] Échec de la vérification d’identité Supabase:', error)
    return {
      valid: false,
      status: 502,
      reason: 'Impossible de vérifier l’identité auprès de Supabase.',
    }
  }
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
  const authCheck = await verifyAdminSession(body.adminAuth)
  if (!authCheck.valid) {
    const status = authCheck.status || 401
    return res.status(status).json({
      success: false,
      status,
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

