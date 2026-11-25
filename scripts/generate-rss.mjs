/**
 * Génère public/journal/rss.xml et public/rss.xml depuis les articles au statut « Publié ».
 * Usage : node scripts/generate-rss.mjs
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const SITE_URL = 'https://hervenanfang.art'

function escapeXml(unsafe) {
  if (!unsafe) return ''
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function getPublishedArticles() {
  const src = await readFile(resolve(root, 'src/data/articles.ts'), 'utf8')
  const articles = []

  // Extraction d'articles complets
  const articleBlockRegex = /\{[\s\S]*?slug:\s*['"]([^'"]+)['"][\s\S]*?\}/g
  let match
  while ((match = articleBlockRegex.exec(src)) !== null) {
    const block = match[0]
    const statusMatch = block.match(/status:\s*['"]([^'"]+)['"]/)
    if (statusMatch && statusMatch[1] === 'Publié') {
      const slugMatch = block.match(/slug:\s*['"]([^'"]+)['"]/)
      const titleMatch = block.match(/title:\s*['"]([^'"]+)['"]/)
      const excerptMatch = block.match(/excerpt:\s*['"]([^'"]+)['"]/)
      const categoryMatch = block.match(/category:\s*['"]([^'"]+)['"]/)
      const dateMatch = block.match(/publishedAt:\s*['"]([^'"]+)['"]/)

      if (slugMatch && titleMatch) {
        articles.push({
          slug: slugMatch[1],
          title: titleMatch[1],
          excerpt: excerptMatch ? excerptMatch[1] : '',
          category: categoryMatch ? categoryMatch[1] : 'Musique & Technologie',
          publishedAt: dateMatch ? dateMatch[1] : new Date().toISOString().split('T')[0],
        })
      }
    }
  }

  // Déduplication éventuelle par slug
  const unique = new Map()
  for (const a of articles) {
    if (!unique.has(a.slug)) unique.set(a.slug, a)
  }
  return Array.from(unique.values())
}

function buildRssXml(articles) {
  const lastBuildDate = new Date().toUTCString()

  const itemsXml = articles
    .map((a) => {
      const pubDate = new Date(a.publishedAt).toUTCString()
      const url = `${SITE_URL}/journal/${a.slug}`
      return `    <item>
      <title>${escapeXml(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>Hervé Nanfang</dc:creator>
      <category>${escapeXml(a.category)}</category>
      <description>${escapeXml(a.excerpt)}</description>
    </item>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Le Journal du Musicien Augmenté — Hervé Nanfang</title>
    <link>${SITE_URL}/journal</link>
    <description>Analyses, méthodes d'hybridation MAO &amp; IA, pédagogie musicale et réflexions culturelles par Hervé Nanfang.</description>
    <language>fr</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${SITE_URL}/journal/rss.xml" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`
}

async function run() {
  const articles = await getPublishedArticles()
  const xml = buildRssXml(articles)

  // 1. Écriture dans public/journal/rss.xml
  const publicJournalDir = resolve(root, 'public/journal')
  if (!existsSync(publicJournalDir)) {
    await mkdir(publicJournalDir, { recursive: true })
  }
  await writeFile(resolve(publicJournalDir, 'rss.xml'), xml, 'utf8')

  // 2. Écriture dans public/rss.xml (racine)
  await writeFile(resolve(root, 'public/rss.xml'), xml, 'utf8')

  // 3. Si dist existe (après build), écrire aussi dans dist/
  const distJournalDir = resolve(root, 'dist/journal')
  if (existsSync(distJournalDir)) {
    await writeFile(resolve(distJournalDir, 'rss.xml'), xml, 'utf8')
  }
  const distDir = resolve(root, 'dist')
  if (existsSync(distDir)) {
    await writeFile(resolve(distDir, 'rss.xml'), xml, 'utf8')
  }

  console.log(`✅ Flux RSS généré avec succès (${articles.length} articles publiés) :`)
  console.log(`   - public/journal/rss.xml`)
  console.log(`   - public/rss.xml`)
}

run().catch((err) => {
  console.error('❌ Erreur génération RSS:', err)
  process.exit(1)
})
