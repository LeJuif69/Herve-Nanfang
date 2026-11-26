import { expect, test } from '@playwright/test'

test('admin route hydrates without React mismatch errors', async ({ page }) => {
  const pageErrors: string[] = []
  page.on('pageerror', (error) => pageErrors.push(error.message))
  await page.route('**/admin', (route) => route.fulfill({ path: 'dist/admin/index.html' }))
  await page.route('https://aqivpxuckcuktwyorjhf.supabase.co/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: '[]' }),
  )

  await page.goto('/admin')
  const cookieDialog = page.getByRole('dialog', { name: 'Gestion des cookies' })
  if (await cookieDialog.count()) {
    await cookieDialog.getByRole('button', { name: 'Tout refuser' }).click()
  }
  await expect(page.getByRole('heading', { name: 'Administration — Hervé Nanfang' })).toBeVisible()
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex.*nofollow/)
  await page.waitForTimeout(100)

  expect(pageErrors.filter((message) => message.includes('#418') || message.includes('#422'))).toEqual([])
})
