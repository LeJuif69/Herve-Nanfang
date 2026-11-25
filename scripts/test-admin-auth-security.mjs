import assert from 'node:assert/strict'

const adminEmail = 'nanfang.herve@gmail.com'
const expiresAt = new Date(Date.now() + 60_000).toISOString()

globalThis.sessionStorage = {
  getItem(key) {
    return key === 'hn_admin_session_v2'
      ? JSON.stringify({
          user: { id: 'forged-local-id', email: adminEmail, role: 'admin' },
          mode: 'local',
          expiresAt,
        })
      : null
  },
  setItem() {},
  removeItem() {},
}

const { adminAuth } = await import('../src/lib/admin-auth.ts')

const login = await adminAuth.signIn(adminEmail, 'test-only-unrecognized-password')
assert.equal(login.success, false, 'login must fail when Supabase Auth is unavailable')

const session = await adminAuth.getSession()
assert.equal(session, null, 'a locally stored session must not authenticate the admin')

console.log('Admin auth denies login without Supabase and rejects locally stored sessions.')
