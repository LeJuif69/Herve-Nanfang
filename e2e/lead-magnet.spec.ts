import { test, expect, type Page } from '@playwright/test'

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
async function fillAndSubmitForm(page: Page, name = 'Test User', email = 'test@hervenanfang.art') {
  await page.fill('[data-testid="lm-name"]', name)
  await page.fill('[data-testid="lm-email"]', email)
  await page.click('[data-testid="lm-submit"]')
}

// ─────────────────────────────────────────────
// Suite 1 : Lead Magnet Form — UI
// ─────────────────────────────────────────────
test.describe('Lead Magnet Form', () => {
  test.beforeEach(async ({ page }) => {
    // La section lead-magnet est sur la page d'accueil
    await page.goto('/')
    await page.getByRole('dialog', { name: 'Gestion des cookies' })
      .getByRole('button', { name: 'Tout refuser' })
      .click()
    await page.waitForSelector('[data-testid="lead-magnet-form"]')
  })

  test('affiche le formulaire sur la page d\'accueil', async ({ page }) => {
    await expect(page.locator('[data-testid="lead-magnet-form"]')).toBeVisible()
    await expect(page.locator('[data-testid="lm-name"]')).toBeVisible()
    await expect(page.locator('[data-testid="lm-email"]')).toBeVisible()
    await expect(page.locator('[data-testid="lm-submit"]')).toBeVisible()
  })

  test('valide les champs requis', async ({ page }) => {
    await page.click('[data-testid="lm-submit"]')
    // le navigateur empêche la soumission (validation HTML5)
    // => on vérifie que l'URL n'a pas changé
    await expect(page).toHaveURL('/')
  })

  test('affiche un indicateur de chargement pendant l\'envoi', async ({ page }) => {
    // Intercepter la requête pour la ralentir
    await page.route('/api/lead-magnet', async (route) => {
      await new Promise((r) => setTimeout(r, 300))
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
    })
    await fillAndSubmitForm(page)
    // pendant le délai on vérifie le texte "En cours"
    await expect(page.locator('[data-testid="lm-submit"]')).toHaveText(/cours/)
  })

  test('redirige vers /thank-you après une soumission réussie', async ({ page }) => {
    // Mock l'API
    await page.route('/api/lead-magnet', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
    )
    const trackedEvents: string[] = []
    await page.route('/api/track-event', async (route) => {
      trackedEvents.push(route.request().postDataJSON()?.event ?? '')
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
    })
    await fillAndSubmitForm(page)
    await page.waitForURL('**/thank-you', { timeout: 3000 })
    await expect(page).toHaveURL(/\/thank-you/)
    expect(trackedEvents).toEqual([])
  })

  test('sends the GA4 lead conversion after analytics consent', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('hvnf_consent', JSON.stringify({ ga4: true, ads: false }))
    })
    await page.route('https://www.googletagmanager.com/**', (route) =>
      route.fulfill({ status: 200, body: '' }),
    )
    await page.route('/api/lead-magnet', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) }),
    )

    const trackedEvents: string[] = []
    await page.route('/api/track-event', async (route) => {
      trackedEvents.push(route.request().postDataJSON()?.event ?? '')
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
    })

    await page.reload()
    await fillAndSubmitForm(page)
    await expect.poll(() => trackedEvents).toEqual(['generate_lead'])

    const clientEventSent = await page.evaluate(() => {
      const dataLayer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? []
      return dataLayer.some((call) => call[0] === 'event' && call[1] === 'generate_lead')
    })
    expect(clientEventSent).toBe(true)
  })

  test('affiche un message d\'erreur si l\'API échoue', async ({ page }) => {
    await page.route('/api/lead-magnet', (route) =>
      route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'Server error' }) })
    )
    await fillAndSubmitForm(page)
    await expect(page.locator('[role="alert"]')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Poursuivre par WhatsApp' }))
      .toHaveAttribute('href', /^https:\/\/wa\.me\/\d+\?text=/)
  })
})

test('propose WhatsApp si l’inscription du Journal échoue', async ({ page }) => {
  await page.goto('/journal')
  await page.getByRole('dialog', { name: 'Gestion des cookies' })
    .getByRole('button', { name: 'Tout refuser' })
    .click()
  await page.route('/api/lead-magnet', (route) =>
    route.fulfill({
      status: 503,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Service unavailable' }),
    }),
  )

  await page.fill('#lead-name', 'Test User')
  await page.fill('#lead-email', 'test@example.com')
  await page.getByRole('button', { name: /Recevoir.*Extrait Officiel/ }).click()

  await expect(page.getByText('Inscription impossible pour le moment. Veuillez réessayer ou nous contacter par WhatsApp.'))
    .toBeVisible()
  await expect(page.getByRole('link', { name: 'Poursuivre la demande par WhatsApp' }))
    .toHaveAttribute('href', /^https:\/\/wa\.me\/\d+\?text=/)
})

// ─────────────────────────────────────────────
// Suite 2 : API /api/lead-magnet — Endpoint
// ─────────────────────────────────────────────
test.describe('API /api/lead-magnet', () => {
  test('retourne 400 si email manquant', async ({ request }) => {
    const res = await request.post('/api/lead-magnet', {
      data: { name: 'Test' },
    })
    expect(res.status()).toBe(400)
    const body = await res.json()
    expect(body).toHaveProperty('error')
  })

  test('retourne 400 si nom trop court', async ({ request }) => {
    const res = await request.post('/api/lead-magnet', {
      data: { name: 'A', email: 'test@test.com' },
    })
    expect(res.status()).toBe(400)
  })

  test('retourne 405 si méthode GET', async ({ request }) => {
    const res = await request.get('/api/lead-magnet')
    expect(res.status()).toBe(405)
  })

  test('retourne 200 avec un payload valide', async ({ request }) => {
    const res = await request.post('/api/lead-magnet', {
      data: { name: 'Test User', email: `test+${Date.now()}@hervenanfang.art` },
    })
    // 200 même si email non configuré (non-bloquant)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.success).toBe(true)
  })
})

// ─────────────────────────────────────────────
// Suite 3 : API /api/track-event — Endpoint
// ─────────────────────────────────────────────
test.describe('API /api/track-event', () => {
  test('retourne 400 si event manquant', async ({ request }) => {
    const res = await request.post('/api/track-event', { data: {} })
    expect(res.status()).toBe(400)
  })

  test('retourne 200 avec event valide', async ({ request }) => {
    const res = await request.post('/api/track-event', {
      data: { event: 'test_event', params: { source: 'playwright' } },
    })
    // 200 même si GA4 non configuré
    expect(res.status()).toBe(200)
  })
})

// ─────────────────────────────────────────────
// Suite 4 : Page /thank-you
// ─────────────────────────────────────────────
test.describe('Page Thank You', () => {
  test('affiche le bouton de téléchargement', async ({ page }) => {
    await page.goto('/thank-you')
    await expect(page.locator('a[href="/lead-magnet.pdf"]')).toBeVisible()
  })

  test('le bouton déclenche l\'event lead_magnet_download', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('hvnf_consent', JSON.stringify({ ga4: true, ads: false }))
    })
    const trackRequests: string[] = []
    await page.route('/api/track-event', async (route) => {
      const body = route.request().postDataJSON()
      trackRequests.push(body?.event ?? '')
      await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) })
    })
    // Intercepter la navigation PDF pour ne pas télécharger le fichier
    await page.route('**/lead-magnet.pdf', (route) => route.fulfill({ status: 200, body: 'PDF_MOCK' }))
    await page.goto('/thank-you')
    await page.click('a[href="/lead-magnet.pdf"]')
    await expect
      .poll(() => trackRequests.includes('lead_magnet_download'), { timeout: 2000 })
      .toBe(true)
  })
})
