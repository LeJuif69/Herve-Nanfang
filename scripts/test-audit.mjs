import { sha256 } from '../src/lib/sha256.js'
import {
  adminStore,
  buildWebhookPayload,
  N8N_LEGACY_WEBHOOK_URL,
  N8N_PRODUCTION_WEBHOOK_URL,
  resolveMigratedWebhookUrl,
} from '../src/lib/admin-store.ts'
import { adminAuth } from '../src/lib/admin-auth.ts'
import webhookRelayHandler from '../api/webhook-relay.js'

console.log('--- TEST 1: SHA-256 standard vectors ---')
// NIST test vectors
// empty string: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
// "abc": ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
const hashEmpty = sha256('')
const hashAbc = sha256('abc')
console.log('SHA-256(""):', hashEmpty)
console.log('Expected   : e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
if (hashEmpty !== 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855') {
  throw new Error('SHA-256("") mismatch!')
}

console.log('SHA-256("abc"):', hashAbc)
console.log('Expected      : ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
if (hashAbc !== 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad') {
  throw new Error('SHA-256("abc") mismatch!')
}
console.log('✓ SHA-256 standard test vectors PASSED')

console.log('\n--- TEST 2: Content alteration detection ---')
function computeHash(post) {
  const norm = {
    title: (post.title || '').trim(),
    pillar: post.pillar,
    series: post.series || '',
    scheduledDate: post.scheduledDate,
    scheduledTime: post.scheduledTime || '09:00',
    platforms: [...(post.platforms || [])].sort(),
    content: Object.keys(post.contentByPlatform || {})
      .sort()
      .map((k) => ({
        p: k,
        t: (post.contentByPlatform[k]?.text || '').trim(),
        tags: [...(post.contentByPlatform[k]?.hashtags || [])].sort(),
      })),
    mediaUrl: post.mediaUrl || '',
    linkUrl: post.linkUrl || '',
    ctaLabel: post.ctaLabel || '',
    targetAudience: post.targetAudience || '',
  }
  return `sha256:${sha256(JSON.stringify(norm))}`
}

const basePost = {
  id: 'pub-test-1',
  title: 'Le Pianobariste Live',
  pillar: 'decouverte',
  series: 'pianobariste-live',
  scheduledDate: '2026-10-25',
  scheduledTime: '09:00',
  platforms: ['linkedin', 'whatsapp'],
  contentByPlatform: {
    linkedin: { text: 'Découvrez la session live.', hashtags: ['#Live', '#Piano'] },
    whatsapp: { text: 'Session live disponible !', hashtags: [] },
  },
  mediaUrl: '/images/hero-duo-live.webp',
  linkUrl: 'https://hervenanfang.art/musique',
  ctaLabel: 'Écouter',
  targetAudience: 'Tout public',
}

const initialHash = computeHash(basePost)
console.log('Initial Hash:', initialHash)

// Test A: Modifying text
const modifiedTextPost = {
  ...basePost,
  contentByPlatform: {
    ...basePost.contentByPlatform,
    linkedin: { ...basePost.contentByPlatform.linkedin, text: 'Texte altéré sans approbation' },
  },
}
const modTextHash = computeHash(modifiedTextPost)
console.log('Modified text Hash:', modTextHash)
if (initialHash === modTextHash) throw new Error('Failed to detect text modification!')
console.log('✓ Text alteration correctly invalidates hash')

// Test B: Modifying scheduled date
const modifiedDatePost = {
  ...basePost,
  scheduledDate: '2026-10-30',
}
const modDateHash = computeHash(modifiedDatePost)
console.log('Modified date Hash:', modDateHash)
if (initialHash === modDateHash) throw new Error('Failed to detect date modification!')
console.log('✓ Scheduled date change correctly invalidates hash')

// Test C: Modifying scheduled time
const modifiedTimePost = {
  ...basePost,
  scheduledTime: '18:30',
}
const modTimeHash = computeHash(modifiedTimePost)
if (initialHash === modTimeHash) throw new Error('Failed to detect time modification!')
console.log('✓ Scheduled time change correctly invalidates hash')

// Test D: Modifying platforms
const modifiedPlatformPost = {
  ...basePost,
  platforms: ['linkedin', 'whatsapp', 'facebook'],
}
const modPlatHash = computeHash(modifiedPlatformPost)
if (initialHash === modPlatHash) throw new Error('Failed to detect platform modification!')
console.log('✓ Platform modification correctly invalidates hash')

console.log('\n--- TEST 3: n8n Webhook URL migration & custom URL preservation ---')
if (resolveMigratedWebhookUrl(N8N_LEGACY_WEBHOOK_URL) !== N8N_PRODUCTION_WEBHOOK_URL) {
  throw new Error('Legacy n8n webhook URL was not migrated to production UUID URL!')
}
if (resolveMigratedWebhookUrl(`${N8N_LEGACY_WEBHOOK_URL}/`) !== N8N_PRODUCTION_WEBHOOK_URL) {
  throw new Error('Legacy n8n webhook URL with trailing slash was not migrated!')
}
if (resolveMigratedWebhookUrl('') !== N8N_PRODUCTION_WEBHOOK_URL) {
  throw new Error('Empty webhook URL did not fallback to production UUID URL!')
}
const customMakeUrl = 'https://hook.eu1.make.com/custom-user-endpoint-999'
if (resolveMigratedWebhookUrl(customMakeUrl) !== customMakeUrl) {
  throw new Error('Custom user webhook URL was overwritten!')
}

// Verify importBackup / sanitizeLoadedState migrates legacy URL while preserving other settings
const snapshot = JSON.parse(adminStore.exportBackup())
const legacyBackup = {
  ...snapshot,
  settings: {
    ...snapshot.settings,
    tagline: 'Signature personnalisée test',
    webhookUrl: N8N_LEGACY_WEBHOOK_URL,
    webhookSecret: 'secret-preserve-123',
  },
}
adminStore.importBackup(JSON.stringify(legacyBackup))
const migratedState = adminStore.getState()
if (migratedState.settings.webhookUrl !== N8N_PRODUCTION_WEBHOOK_URL) {
  throw new Error(`Expected migrated URL ${N8N_PRODUCTION_WEBHOOK_URL}, got ${migratedState.settings.webhookUrl}`)
}
if (
  migratedState.settings.tagline !== 'Signature personnalisée test' ||
  migratedState.settings.webhookSecret !== 'secret-preserve-123'
) {
  throw new Error('Other settings were lost during webhook migration!')
}

// Restore snapshot
adminStore.importBackup(JSON.stringify(snapshot))
console.log('✓ Legacy webhook URL automatically migrated & custom settings preserved')

console.log('\n--- TEST 4: Unified Webhook JSON Contract & Idempotence ---')
const capturedRequests = []
const originalFetch = globalThis.fetch

try {
  // 4A. Test real approval payload contract & idempotence
  globalThis.fetch = async (url, options) => {
    capturedRequests.push({
      url,
      headers: options?.headers,
      body: JSON.parse(options?.body || '{}'),
    })
    return { ok: true, status: 200, statusText: 'OK' }
  }

  const testPostId = 'pub-webhook-contract-test'
  await adminStore.savePublication({
    id: testPostId,
    title: 'Test Contrat Webhook n8n',
    pillar: 'autorite',
    sourceType: 'article',
    sourceSlug: 'apres-la-mao-lia',
    scheduledDate: '2026-11-10',
    scheduledTime: '09:00',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook'],
    contentByPlatform: {
      linkedin: { text: 'Contenu LinkedIn de test', hashtags: ['#HerveNanfang'] },
      facebook: { text: 'Contenu Facebook de test', hashtags: ['#HerveNanfang'] },
    },
    linkUrl: 'https://hervenanfang.art/journal/apres-la-mao-lia',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })

  const approveRes1 = await adminStore.approvePublication(testPostId, 'Hervé Nanfang')
  if (!approveRes1.success || !approveRes1.triggeredWebhook) {
    throw new Error('First approval should succeed and trigger webhook!')
  }
  if (capturedRequests.length !== 1) {
    throw new Error(`Expected 1 webhook call, got ${capturedRequests.length}`)
  }

  const realPayload = capturedRequests[0].body
  if (
    realPayload.event !== 'publication.approved' ||
    realPayload.isTest !== false ||
    realPayload.environment !== 'production' ||
    realPayload.post?.id !== testPostId ||
    realPayload.publication?.id !== testPostId
  ) {
    throw new Error('Real approval payload does not match unified contract!')
  }

  // Second approval on already-sealed post should NOT re-trigger webhook
  const approveRes2 = await adminStore.approvePublication(testPostId, 'Hervé Nanfang')
  if (!approveRes2.success || approveRes2.triggeredWebhook !== false || capturedRequests.length !== 1) {
    throw new Error('Duplicate approval should be idempotent and not trigger a second webhook call!')
  }
  console.log('✓ Real approval contract & idempotence verified')

  // 4B. Test connection ping uses the exact same top-level schema
  const testPingRes = await adminStore.triggerWebhookTest(N8N_PRODUCTION_WEBHOOK_URL, 'my-secret')
  if (!testPingRes.success || capturedRequests.length !== 2) {
    throw new Error('Webhook test ping failed!')
  }
  const testPayload = capturedRequests[1].body
  if (
    testPayload.event !== 'publication.approved' ||
    testPayload.isTest !== true ||
    testPayload.environment !== 'test' ||
    !testPayload.post?.id ||
    !testPayload.publication?.id ||
    capturedRequests[1].headers['X-HN-Webhook-Secret'] !== 'my-secret'
  ) {
    throw new Error('Test webhook payload does not match unified contract!')
  }
  console.log('✓ Test connection uses identical JSON contract with isTest=true')

  // 4C. Test HTTP 500 & network error handling
  globalThis.fetch = async () => ({ ok: false, status: 500, statusText: 'Internal Server Error' })
  const failHttpRes = await adminStore.triggerWebhookTest(N8N_PRODUCTION_WEBHOOK_URL)
  if (failHttpRes.success || failHttpRes.status !== 500) {
    throw new Error('HTTP 500 error was not properly reported!')
  }

  globalThis.fetch = async () => {
    throw new Error('Failed to fetch')
  }
  const failNetRes = await adminStore.triggerWebhookTest(N8N_PRODUCTION_WEBHOOK_URL)
  if (failNetRes.success || !failNetRes.error?.includes('Failed to fetch')) {
    throw new Error('Network error was not properly caught!')
  }
  console.log('✓ HTTP and network errors handled cleanly')

  await adminStore.deletePublication(testPostId)
} finally {
  globalThis.fetch = originalFetch
}

console.log('\n--- TEST 5: Server-side Webhook Relay (/api/webhook-relay) ---')
function createMockRes() {
  return {
    statusCode: 200,
    headers: {},
    body: null,
    setHeader(k, v) {
      this.headers[k] = v
    },
    status(c) {
      this.statusCode = c
      return this
    },
    json(d) {
      this.body = d
      return this
    },
    end() {
      return this
    },
  }
}

try {
  // 5A. Reject GET method (405)
  const resGet = createMockRes()
  await webhookRelayHandler({ method: 'GET', body: {} }, resGet)
  if (resGet.statusCode !== 405 || resGet.body?.success !== false) {
    throw new Error('Relay should reject non-POST methods with HTTP 405!')
  }

  // 5B. Reject unauthenticated calls (401)
  const resUnauth = createMockRes()
  await webhookRelayHandler(
    {
      method: 'POST',
      body: {
        targetUrl: N8N_PRODUCTION_WEBHOOK_URL,
        adminAuth: { email: 'hacker@evil.com', expiresAt: '2099-01-01T00:00:00Z', sessionToken: 'bad' },
        payload: { event: 'publication.approved', isTest: true, post: { id: 'p1', title: 'T' } },
      },
    },
    resUnauth,
  )
  if (resUnauth.statusCode !== 401 || resUnauth.body?.success !== false) {
    throw new Error('Relay should reject unauthorized admin session with HTTP 401!')
  }

  // 5C. Authenticate valid admin session and test valid relay + deduplication
  const signInRes = await adminAuth.signIn('hello@hervenanfang.art', 'MasterHerveNanfang2026!')
  if (!signInRes.success || !signInRes.session) {
    throw new Error('Failed to sign in admin for relay test!')
  }
  const validAdminAuth = {
    email: signInRes.session.user.email,
    expiresAt: signInRes.session.expiresAt,
    sessionToken: signInRes.session.sessionToken,
    mode: signInRes.session.mode,
  }

  // Invalid payload check (400)
  const resBadPayload = createMockRes()
  await webhookRelayHandler(
    {
      method: 'POST',
      body: {
        targetUrl: N8N_PRODUCTION_WEBHOOK_URL,
        adminAuth: validAdminAuth,
        payload: { event: 'wrong.event' },
      },
    },
    resBadPayload,
  )
  if (resBadPayload.statusCode !== 400) {
    throw new Error('Relay should reject invalid payload with HTTP 400!')
  }

  // Mock upstream fetch for relay
  let upstreamCallCount = 0
  globalThis.fetch = async () => {
    upstreamCallCount++
    return {
      ok: true,
      status: 200,
      text: async () => JSON.stringify({ message: 'Workflow was started' }),
    }
  }

  const samplePost = {
    id: 'pub-relay-real-01',
    title: 'Article Relay Test',
    pillar: 'autorite',
    sourceType: 'article',
    scheduledDate: '2026-11-15',
    scheduledTime: '10:00',
    status: 'valide',
    platforms: ['linkedin'],
    contentByPlatform: { linkedin: { text: 'Texte', hashtags: [] } },
    validationSignature: {
      approvedBy: 'Hervé Nanfang',
      approvedAt: new Date().toISOString(),
      contentHash: 'sha256:relayhash123',
      isRevoked: false,
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  const validPayload = buildWebhookPayload(samplePost, { isTest: false })

  const resRelay1 = createMockRes()
  await webhookRelayHandler(
    {
      method: 'POST',
      body: {
        targetUrl: N8N_LEGACY_WEBHOOK_URL,
        adminAuth: validAdminAuth,
        payload: validPayload,
      },
    },
    resRelay1,
  )
  if (resRelay1.statusCode !== 200 || !resRelay1.body?.success || upstreamCallCount !== 1) {
    throw new Error('Relay failed to forward valid authenticated request!')
  }

  // Duplicate real approval within TTL should be deduplicated without calling upstream again
  const resRelay2 = createMockRes()
  await webhookRelayHandler(
    {
      method: 'POST',
      body: {
        targetUrl: N8N_PRODUCTION_WEBHOOK_URL,
        adminAuth: validAdminAuth,
        payload: validPayload,
      },
    },
    resRelay2,
  )
  if (!resRelay2.body?.success || !resRelay2.body?.deduplicated || upstreamCallCount !== 1) {
    throw new Error('Relay failed to deduplicate identical approval payload!')
  }

  // Test 404 inactive n8n workflow diagnostic message
  globalThis.fetch = async () => ({
    ok: false,
    status: 404,
    text: async () =>
      JSON.stringify({
        code: 404,
        message: 'The requested webhook "POST a680fa6e-49a8-48d6-ac29-585120113415" is not registered.',
      }),
  })
  const resRelay404 = createMockRes()
  await webhookRelayHandler(
    {
      method: 'POST',
      body: {
        targetUrl: N8N_PRODUCTION_WEBHOOK_URL,
        adminAuth: validAdminAuth,
        payload: buildWebhookPayload(samplePost, { isTest: true }),
      },
    },
    resRelay404,
  )
  if (resRelay404.body?.success !== false || resRelay404.body?.status !== 404 || !resRelay404.body?.error?.includes('INACTIF')) {
    throw new Error('Relay did not format 404 inactive n8n workflow diagnostic properly!')
  }

  await adminAuth.signOut()
  console.log('✓ Server-side Webhook Relay auth, validation, deduplication & 404 diagnostics PASSED')
} finally {
  globalThis.fetch = originalFetch
}

console.log('\n--- ALL INTEGRITY TESTS PASSED SUCCESSFULLY ---')
