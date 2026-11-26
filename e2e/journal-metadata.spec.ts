import { expect, test } from '@playwright/test'

test('shows a verified date and renders its visible FAQ as structured data', async ({ page }) => {
  await page.goto('/journal/ia-droits-auteur-musique-africaine')
  await page.getByRole('dialog', { name: 'Gestion des cookies' })
    .getByRole('button', { name: 'Tout refuser' })
    .click()

  await expect(page.locator('time[datetime="2026-11-04"]')).toBeVisible()
  await expect(page.getByTestId('article-faq')).toBeVisible()

  const faqSchemas = await page.locator('script[data-page-ld]').evaluateAll((scripts) =>
    scripts
      .map((script) => JSON.parse(script.textContent ?? '{}'))
      .filter((schema) => schema['@type'] === 'FAQPage'),
  )
  expect(faqSchemas).toHaveLength(1)
  expect(faqSchemas[0].mainEntity).toHaveLength(3)
})
