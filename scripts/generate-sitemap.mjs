/**
 * Génère public/sitemap.xml depuis les routes statiques + les articles Publiés.
 * Usage : npm run generate:sitemap
 * Le build (`npm run build`) régénère aussi dist/sitemap.xml via scripts/prerender.mjs
 * avec la même règle : seuls les articles au statut « Publié » sont inclus.
 */
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const SITE_URL = 'https://hervenanfang.vercel.app'

const STATIC_URLS = [
  '/',
  '/a-propos',
  '/musique',
  '/ia-technologie',
  '/pedagogie',
  '/services',
  '/rma',
  '/culture-recherche',
  '/projets',
  '/journal',
  '/conferences',
  '/presse',
  '/contact',
  '/mentions-legales',
  '/confidentialite',
]

async function publishedSlugs() {
  const src = await readFile(resolve(root, 'src/data/articles.ts'), 'utf8')
  const slugs = []
  // Chaque article déclare `slug:` puis, quelques lignes plus bas, `status:`.
  const re = /slug:\s*['"]([^'"]+)['"][\s\S]{0,1200}?status:\s*['"]([^'"]+)['"]/g
  let m
  while ((m = re.exec(src)) !== null) {
    if (m[2] === 'Publié') slugs.push(m[1])
  }
  return slugs
}

const today = new Date().toISOString().split('T')[0]

function entry(loc) {
  return `  <url>\n    <loc>${SITE_URL}${loc}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`
}

const slugs = await publishedSlugs()
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...STATIC_URLS.map((u) => entry(u)),
  ...slugs.map((s) => entry(`/journal/${s}`)),
  '</urlset>',
  '',
]
await writeFile(resolve(root, 'public/sitemap.xml'), `${lines.join('\n')}`, 'utf8')
console.log(`Sitemap écrit : ${STATIC_URLS.length} pages + ${slugs.length} article(s) publié(s) (${slugs.join(', ') || 'aucun'}).`)
