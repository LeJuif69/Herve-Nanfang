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
  { loc: '/', changefreq: 'weekly', priority: '1.0' },
  { loc: '/a-propos', changefreq: 'monthly', priority: '0.9' },
  { loc: '/musique', changefreq: 'monthly', priority: '0.9' },
  { loc: '/ia-technologie', changefreq: 'weekly', priority: '0.9' },
  { loc: '/pedagogie', changefreq: 'monthly', priority: '0.8' },
  { loc: '/services', changefreq: 'monthly', priority: '0.9' },
  { loc: '/rma', changefreq: 'monthly', priority: '0.8' },
  { loc: '/culture-recherche', changefreq: 'monthly', priority: '0.8' },
  { loc: '/projets', changefreq: 'monthly', priority: '0.9' },
  { loc: '/journal', changefreq: 'weekly', priority: '0.9' },
  { loc: '/conferences', changefreq: 'monthly', priority: '0.9' },
  { loc: '/contact', changefreq: 'yearly', priority: '0.8' },
  { loc: '/mentions-legales', priority: '0.3' },
  { loc: '/confidentialite', priority: '0.3' },
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

function entry(loc, changefreq, priority) {
  let xml = `  <url><loc>${SITE_URL}${loc}</loc>`
  if (changefreq) xml += `<changefreq>${changefreq}</changefreq>`
  if (priority) xml += `<priority>${priority}</priority>`
  return `${xml}</url>`
}

const slugs = await publishedSlugs()
const lines = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...STATIC_URLS.map((u) => entry(u.loc, u.changefreq, u.priority)),
  ...slugs.map((s) => entry(`/journal/${s}`, undefined, '0.8')),
  '</urlset>',
  '',
]
await writeFile(resolve(root, 'public/sitemap.xml'), `${lines.join('\n')}`, 'utf8')
console.log(`Sitemap écrit : ${STATIC_URLS.length} pages + ${slugs.length} article(s) publié(s) (${slugs.join(', ') || 'aucun'}).`)
