import assert from 'node:assert/strict'
import { createServer } from 'node:http'

const adminUser = {
  id: 'test-admin-user-id',
  aud: 'authenticated',
  role: 'authenticated',
  email: 'admin@example.test',
  app_metadata: { provider: 'email', providers: ['email'] },
  user_metadata: {},
  created_at: '2026-01-01T00:00:00.000Z',
}
const accessToken = 'test-supabase-access-token'
const publishableKey = 'test-supabase-publishable-key'
const originalEnv = {
  supabaseUrl: process.env.VITE_SUPABASE_URL,
  publishableKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  anonKey: process.env.VITE_SUPABASE_ANON_KEY,
  serverUrl: process.env.SUPABASE_URL,
  serverKey: process.env.SUPABASE_PUBLISHABLE_KEY,
}
const originalFetch = globalThis.fetch

const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost')
  const send = (status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(data))
  }

  if (url.pathname === '/auth/v1/token' && req.method === 'POST') {
    return send(200, {
      access_token: accessToken,
      token_type: 'bearer',
      expires_in: 3600,
      expires_at: Math.floor(Date.now() / 1000) + 3600,
      refresh_token: 'test-refresh-token',
      user: adminUser,
    })
  }
  if (url.pathname === '/auth/v1/user') {
    return req.headers.authorization === `Bearer ${accessToken}`
      ? send(200, adminUser)
      : send(401, { message: 'Invalid token' })
  }
  if (url.pathname === '/rest/v1/admin_users') {
    return req.headers.authorization === `Bearer ${accessToken}`
      ? send(200, [{ user_id: adminUser.id, email: adminUser.email, full_name: 'Test Admin' }])
      : send(401, { message: 'Invalid token' })
  }
  return send(404, { message: 'Not found' })
})

await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve))
const { port } = server.address()
const localSupabaseUrl = `http://127.0.0.1:${port}`
let authenticatedAdmin

process.env.VITE_SUPABASE_URL = localSupabaseUrl
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = publishableKey
process.env.SUPABASE_URL = localSupabaseUrl
process.env.SUPABASE_PUBLISHABLE_KEY = publishableKey
globalThis.fetch = async (input, init) => {
  const url = new URL(String(input))
  if (url.hostname === 'webhook.example.test') {
    return new Response(JSON.stringify({ forwarded: true }), { status: 200 })
  }
  return originalFetch(input, init)
}

try {
  const { adminAuth } = await import('../src/lib/admin-auth.ts')
  authenticatedAdmin = adminAuth
  const login = await adminAuth.signIn(adminUser.email, 'test-password')
  assert.equal(login.success, true, `mock Supabase admin login should succeed: ${login.error || ''}`)
  assert.equal(login.session?.mode, 'supabase')
  assert.equal(login.session?.accessToken, accessToken)
  assert.equal(login.session?.user.id, adminUser.id)

  const { default: webhookRelay } = await import('../api/webhook-relay.js')
  const response = {
    statusCode: 200,
    body: undefined,
    setHeader() {},
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

  await webhookRelay(
    {
      method: 'POST',
      body: {
        targetUrl: 'https://webhook.example.test/receive',
        adminAuth: { accessToken },
        payload: {
          event: 'publication.approved',
          isTest: true,
          post: { id: 'auth-positive-test', title: 'Authorization test' },
        },
      },
    },
    response,
  )

  assert.equal(response.statusCode, 200)
  assert.equal(response.body?.success, true)
  assert.equal(response.body?.status, 200)

  console.log('Positive Supabase admin login and webhook relay test passed against a local Supabase API stub.')
} finally {
  if (authenticatedAdmin) await authenticatedAdmin.signOut()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  globalThis.fetch = originalFetch
  for (const [name, value] of Object.entries({
    VITE_SUPABASE_URL: originalEnv.supabaseUrl,
    VITE_SUPABASE_PUBLISHABLE_KEY: originalEnv.publishableKey,
    VITE_SUPABASE_ANON_KEY: originalEnv.anonKey,
    SUPABASE_URL: originalEnv.serverUrl,
    SUPABASE_PUBLISHABLE_KEY: originalEnv.serverKey,
  })) {
    if (value === undefined) delete process.env[name]
    else process.env[name] = value
  }
}
