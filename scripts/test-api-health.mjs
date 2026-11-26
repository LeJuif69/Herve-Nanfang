import assert from 'node:assert/strict'
import health from '../api/health.js'

function createResponse() {
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

const envKeys = ['HEALTHCHECK_TOKEN', 'SUPABASE_URL', 'VITE_SUPABASE_URL', 'SUPABASE_SERVICE_KEY']
const originalEnvironment = Object.fromEntries(envKeys.map((key) => [key, process.env[key]]))
const originalFetch = globalThis.fetch
const testToken = 'healthcheck-test-token-with-at-least-32-characters'

try {
  for (const key of envKeys) delete process.env[key]

  let fetchCalls = 0
  globalThis.fetch = async () => {
    fetchCalls += 1
    throw new Error('Unexpected upstream request')
  }

  const methodResponse = createResponse()
  await health({ method: 'POST', headers: {} }, methodResponse)
  assert.equal(methodResponse.statusCode, 405)
  assert.deepEqual(methodResponse.body, { error: 'Method Not Allowed' })
  assert.equal(fetchCalls, 0)

  const missingConfigResponse = createResponse()
  await health({ method: 'GET', headers: {} }, missingConfigResponse)
  assert.equal(missingConfigResponse.statusCode, 503)
  assert.deepEqual(missingConfigResponse.body, { status: 'unavailable' })

  process.env.HEALTHCHECK_TOKEN = testToken
  process.env.SUPABASE_URL = 'https://project.supabase.co'
  process.env.SUPABASE_SERVICE_KEY = 'test-service-key'

  const unauthorizedResponse = createResponse()
  await health(
    { method: 'GET', headers: { authorization: 'Bearer wrong-token' } },
    unauthorizedResponse,
  )
  assert.equal(unauthorizedResponse.statusCode, 401)
  assert.equal(fetchCalls, 0)

  let requestUrl
  let requestOptions
  globalThis.fetch = async (url, options) => {
    requestUrl = new URL(url)
    requestOptions = options
    return { ok: true, status: 200 }
  }

  const successResponse = createResponse()
  await health(
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${testToken}`,
        origin: 'https://hervenanfang.art',
      },
    },
    successResponse,
  )

  assert.equal(successResponse.statusCode, 200)
  assert.deepEqual(successResponse.body, { status: 'ok' })
  assert.equal(successResponse.headers['Cache-Control'], 'no-store')
  assert.equal(successResponse.headers['Access-Control-Allow-Origin'], 'https://hervenanfang.art')
  assert.equal(requestUrl.pathname, '/rest/v1/leads')
  assert.equal(requestUrl.searchParams.get('select'), 'id')
  assert.equal(requestUrl.searchParams.get('limit'), '1')
  assert.equal(requestOptions.method, 'HEAD')
  assert.equal(requestOptions.headers.apikey, 'test-service-key')
  assert.equal(requestOptions.headers.Authorization, 'Bearer test-service-key')
  assert.equal(JSON.stringify(successResponse.body).includes(testToken), false)
  assert.equal(JSON.stringify(successResponse.body).includes('test-service-key'), false)

  globalThis.fetch = async () => ({ ok: false, status: 403 })
  const upstreamFailureResponse = createResponse()
  await health(
    { method: 'GET', headers: { authorization: `Bearer ${testToken}` } },
    upstreamFailureResponse,
  )
  assert.equal(upstreamFailureResponse.statusCode, 503)
  assert.deepEqual(upstreamFailureResponse.body, { status: 'unavailable' })

  console.log('Health endpoint protects credentials and probes Supabase read-only.')
} finally {
  globalThis.fetch = originalFetch
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
}
