import assert from 'node:assert/strict'
import webhookRelay from '../api/webhook-relay.js'

const originalFetch = globalThis.fetch
const originalEnv = {
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey: process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
}

process.env.SUPABASE_URL = 'https://project.example.supabase.co'
process.env.VITE_SUPABASE_PUBLISHABLE_KEY = 'test-publishable-key'

function createResponse() {
  return {
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
    end(body) {
      this.body = body
      return this
    },
  }
}

function createRequest(adminAuth) {
  return {
    method: 'POST',
    body: {
      targetUrl: 'https://webhook.example/test',
      adminAuth,
      payload: {
        event: 'publication.approved',
        isTest: true,
        post: { id: 'security-test', title: 'Security test' },
      },
    },
  }
}

try {
  const unauthenticatedCalls = []
  globalThis.fetch = async (url) => {
    unauthenticatedCalls.push(String(url))
    return { ok: true, status: 200, statusText: 'OK', text: async () => '' }
  }

  const forgedResponse = createResponse()
  await webhookRelay(
    createRequest({
      email: 'nanfang.herve@gmail.com',
      expiresAt: new Date(Date.now() + 60_000).toISOString(),
      mode: 'supabase',
    }),
    forgedResponse,
  )

  assert.equal(forgedResponse.statusCode, 401, 'client-supplied identity claims must not authorize webhook calls')
  assert.equal(unauthenticatedCalls.length, 0, 'unauthenticated calls must not reach the webhook target')

  const calls = []
  globalThis.fetch = async (url, options = {}) => {
    const parsedUrl = new URL(String(url))
    calls.push({ url: parsedUrl, options })

    if (parsedUrl.pathname === '/auth/v1/user') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 'admin-user-id', email: 'nanfang.herve@gmail.com' }),
      }
    }
    if (parsedUrl.pathname === '/rest/v1/admin_users') {
      return {
        ok: true,
        status: 200,
        json: async () => [{ user_id: 'admin-user-id' }],
      }
    }
    return { ok: true, status: 200, statusText: 'OK', text: async () => '' }
  }

  const validResponse = createResponse()
  await webhookRelay(createRequest({ mode: 'supabase', accessToken: 'test-access-token' }), validResponse)

  assert.equal(validResponse.statusCode, 200, 'a verified Supabase admin should be allowed')
  assert.deepEqual(
    calls.map(({ url }) => url.pathname),
    ['/auth/v1/user', '/rest/v1/admin_users', '/test'],
    'the relay must verify the access token and admin_users membership before forwarding',
  )
  assert.equal(calls[0].options.headers.Authorization, 'Bearer test-access-token')

  const nonAdminCalls = []
  globalThis.fetch = async (url) => {
    const parsedUrl = new URL(String(url))
    nonAdminCalls.push(parsedUrl.pathname)
    if (parsedUrl.pathname === '/auth/v1/user') {
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 'regular-user-id', email: 'nanfang.herve@gmail.com' }),
      }
    }
    return { ok: true, status: 200, json: async () => [] }
  }

  const nonAdminResponse = createResponse()
  await webhookRelay(
    createRequest({ mode: 'supabase', accessToken: 'valid-user-token' }),
    nonAdminResponse,
  )

  assert.equal(nonAdminResponse.statusCode, 403, 'a valid Supabase user without an admin_users row must be denied')
  assert.deepEqual(nonAdminCalls, ['/auth/v1/user', '/rest/v1/admin_users'])

  const invalidTokenCalls = []
  globalThis.fetch = async (url) => {
    invalidTokenCalls.push(new URL(String(url)).pathname)
    return { ok: false, status: 401 }
  }

  const invalidTokenResponse = createResponse()
  await webhookRelay(
    createRequest({ accessToken: 'invalid-access-token' }),
    invalidTokenResponse,
  )

  assert.equal(invalidTokenResponse.statusCode, 401, 'Supabase must reject invalid or expired access tokens')
  assert.deepEqual(invalidTokenCalls, ['/auth/v1/user'], 'invalid tokens must not trigger membership or webhook requests')

  console.log('Admin webhook authentication tests passed.')
} finally {
  globalThis.fetch = originalFetch
  if (originalEnv.supabaseUrl === undefined) delete process.env.SUPABASE_URL
  else process.env.SUPABASE_URL = originalEnv.supabaseUrl
  if (originalEnv.supabaseKey === undefined) delete process.env.VITE_SUPABASE_PUBLISHABLE_KEY
  else process.env.VITE_SUPABASE_PUBLISHABLE_KEY = originalEnv.supabaseKey
}
