import { expect, test } from '@playwright/test'

test('persists custom preferences and applies revocation', async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem('hvnf_consent'))
  await page.route('https://www.googletagmanager.com/**', (route) =>
    route.fulfill({ status: 200, body: '' }),
  )
  await page.route('https://pagead2.googlesyndication.com/**', (route) =>
    route.fulfill({ status: 200, body: '' }),
  )

  await page.goto('/')
  const dialog = page.getByRole('dialog', { name: 'Gestion des cookies' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: 'Personnaliser' }).click()
  await page.getByLabel('Mesure d’audience (Google Analytics 4)').check()
  await dialog.getByRole('button', { name: 'Enregistrer mes choix' }).click()
  await expect(dialog).toHaveCount(0)

  await page.getByRole('button', { name: 'Gérer les cookies' }).click()
  await expect(dialog).toBeVisible()
  await expect(page.getByLabel('Mesure d’audience (Google Analytics 4)')).toBeChecked()
  await expect(page.getByLabel('Publicité et conversions (Google Ads, AdSense et Meta)')).not.toBeChecked()

  await page.getByLabel('Mesure d’audience (Google Analytics 4)').uncheck()
  await dialog.getByRole('button', { name: 'Enregistrer mes choix' }).click()
  await expect(dialog).toHaveCount(0)

  await page.getByRole('button', { name: 'Gérer les cookies' }).click()
  await page.getByLabel('Publicité et conversions (Google Ads, AdSense et Meta)').check()
  await dialog.getByRole('button', { name: 'Enregistrer mes choix' }).click()
  await expect(page.locator('script[src*="adsbygoogle.js"]')).toHaveCount(1)

  await page.getByRole('button', { name: 'Gérer les cookies' }).click()
  await page.getByLabel('Publicité et conversions (Google Ads, AdSense et Meta)').uncheck()
  await dialog.getByRole('button', { name: 'Enregistrer mes choix' }).click()

  const revoked = await page.evaluate(() => {
    const dataLayer = (window as Window & { dataLayer?: IArguments[] }).dataLayer ?? []
    return dataLayer.some((call) => {
      const consent = call[2] as Record<string, string> | undefined
      return call[0] === 'consent' &&
        call[1] === 'update' &&
        consent?.analytics_storage === 'denied' &&
        consent.ad_storage === 'denied'
    })
  })
  expect(revoked).toBe(true)
})
