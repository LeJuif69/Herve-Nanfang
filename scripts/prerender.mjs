import { PassThrough } from 'node:stream'
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import React from 'react'
import { renderToPipeableStream } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server.js'
import { createServer } from 'vite'

const root = process.cwd()
const dist = resolve(root, 'dist')
// Charge .env.local / .env pour le pré-rendu local (sur Vercel, les variables
// projet sont déjà dans process.env et ont priorité — on n'écrase jamais).
for (const file of ['.env.local', '.env']) {
  try {
    const raw = await readFile(resolve(root, file), 'utf8')
    for (const line of raw.split('\n')) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
    }
  } catch { /* fichier absent : rien à charger */ }
}
const startMarker = '<meta name="prerender-head-start" content="true" />'
const endMarker = '<meta name="prerender-head-end" content="true" />'
const staticRoutes = [
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

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[char])
}

function pageHead(seo, site) {
  const canonical = `${site.url}${seo.path === '/' ? '/' : seo.path}`
  const image = seo.image.startsWith('http') ? seo.image : `${site.url}${seo.image}`
  const tags = [
    `<title>${escapeHtml(seo.title)}</title>`,
    `<meta name="description" content="${escapeHtml(seo.description)}">`,
    `<meta name="robots" content="${escapeHtml(seo.robots)}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    `<meta property="og:type" content="${escapeHtml(seo.type)}">`,
    `<meta property="og:site_name" content="${escapeHtml(site.name)}">`,
    '<meta property="og:locale" content="fr_FR">',
    `<meta property="og:title" content="${escapeHtml(seo.title)}">`,
    `<meta property="og:description" content="${escapeHtml(seo.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    '<meta property="og:image:width" content="1200">',
    '<meta property="og:image:height" content="630">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(seo.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(seo.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
  ]
  // Vérifications Search Console / Bing Webmaster Tools (pré-rendues si définies au build).
  if (process.env.VITE_GOOGLE_SITE_VERIFICATION) {
    tags.push(`<meta name="google-site-verification" content="${escapeHtml(process.env.VITE_GOOGLE_SITE_VERIFICATION.trim())}">`)
  }
  if (process.env.VITE_BING_SITE_VERIFICATION) {
    tags.push(`<meta name="msvalidate.01" content="${escapeHtml(process.env.VITE_BING_SITE_VERIFICATION.trim())}">`)
  }
  const schemas = seo.jsonLd ? (Array.isArray(seo.jsonLd) ? seo.jsonLd : [seo.jsonLd]) : []
  for (const schema of schemas) {
    const json = JSON.stringify(schema).replace(/</g, '\\u003c')
    tags.push(`<script type="application/ld+json" data-page-ld="true">${json}</script>`)
  }
  return tags.join('\n    ')
}

function injectHead(template, head) {
  const start = template.indexOf(startMarker)
  const end = template.indexOf(endMarker)
  if (start < 0 || end < start) {
    throw new Error('Prerender head markers are missing from dist/index.html')
  }
  return `${template.slice(0, start)}${head}${template.slice(end + endMarker.length)}`
}

function renderRoute(App, SeoContext, route) {
  return new Promise((resolveRender, rejectRender) => {
    let markup = ''
    let seo
    let stream
    const tree = React.createElement(
      StaticRouter,
      { location: route },
      React.createElement(
        SeoContext.Provider,
        { value: (input) => { seo = input } },
        React.createElement(App),
      ),
    )
    stream = renderToPipeableStream(tree, {
      onAllReady() {
        const output = new PassThrough()
        output.on('data', (chunk) => { markup += chunk.toString() })
        output.on('end', () => {
          if (!seo) {
            rejectRender(new Error(`No SEO metadata captured for ${route}`))
            return
          }
          resolveRender({ markup, seo })
        })
        stream.pipe(output)
      },
      onShellError: rejectRender,
      onError(error) {
        console.error(`Prerender error at ${route}:`, error)
      },
    })
  })
}

function outputPath(route) {
  return route === '/' ? resolve(dist, 'index.html') : resolve(dist, route.slice(1), 'index.html')
}

function sitemapXml(site, paths) {
  const today = new Date().toISOString().split('T')[0]
  const priorities = {
    '/': { p: '1.0', f: 'weekly' },
    '/conferences': { p: '0.9', f: 'weekly' },
    '/rma': { p: '0.9', f: 'weekly' },
    '/pedagogie': { p: '0.9', f: 'weekly' },
    '/a-propos': { p: '0.9', f: 'weekly' },
    '/musique': { p: '0.9', f: 'weekly' },
    '/ia-technologie': { p: '0.9', f: 'weekly' },
    '/projets': { p: '0.9', f: 'monthly' },
    '/services': { p: '0.9', f: 'monthly' },
    '/culture-recherche': { p: '0.8', f: 'monthly' },
    '/journal': { p: '0.9', f: 'weekly' },
    '/contact': { p: '0.8', f: 'monthly' },
    '/mentions-legales': { p: '0.3', f: 'yearly' },
    '/confidentialite': { p: '0.3', f: 'yearly' },
  }

  const entries = paths.map((path) => {
    const url = `${site.url}${path === '/' ? '/' : path}`
    const meta = priorities[path] || {
      p: path.startsWith('/journal/') ? '0.8' : '0.7',
      f: path.startsWith('/journal/') ? 'monthly' : 'monthly',
    }
    return `  <url>\n    <loc>${escapeHtml(url)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${meta.f}</changefreq>\n    <priority>${meta.p}</priority>\n  </url>`
  })
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`
}

const server = await createServer({
  configFile: resolve(root, 'vite.config.ts'),
  server: { middlewareMode: true },
  appType: 'custom',
})

try {
  const [{ default: App }, { SeoContext }, { ARTICLES }, { SITE }] = await Promise.all([
    server.ssrLoadModule('/src/App.tsx'),
    server.ssrLoadModule('/src/lib/seo.ts'),
    server.ssrLoadModule('/src/data/articles.ts'),
    server.ssrLoadModule('/src/data/site.ts'),
  ])
  const template = await readFile(resolve(dist, 'index.html'), 'utf8')
  const articleRoutes = ARTICLES.map((article) => `/journal/${article.slug}`)
  const routes = [...staticRoutes, ...articleRoutes]

  // Correspondance des imports d'actifs de dev (/src/assets/...) vers les fichiers hashés de prod (/assets/...)
  const assetMap = {}
  try {
    const manifestRaw = await readFile(resolve(dist, '.vite', 'manifest.json'), 'utf8')
    const manifest = JSON.parse(manifestRaw)
    for (const [key, val] of Object.entries(manifest)) {
      if (val.file) {
        assetMap[`/${key}`] = `/${val.file}`
      }
    }
  } catch (err) {
    console.warn('Vite manifest not loaded:', err.message)
  }

  // Copie de sécurité absolue : garantit que /src/assets/* renvoie toujours 200 en prod statique
  try {
    await cp(resolve(root, 'src', 'assets'), resolve(dist, 'src', 'assets'), { recursive: true })
  } catch (err) {
    console.warn('Could not copy src/assets to dist/src/assets:', err.message)
  }

  function rewriteAssetUrls(str) {
    let result = str
    for (const [srcUrl, distUrl] of Object.entries(assetMap)) {
      result = result.replaceAll(srcUrl, distUrl)
    }
    return result
  }

  for (const route of routes) {
    const { markup, seo } = await renderRoute(App, SeoContext, route)
    const processedMarkup = rewriteAssetUrls(markup)
    const html = injectHead(template, pageHead(seo, SITE)).replace(
      '<div id="root"></div>',
      `<div id="root">${processedMarkup}</div>`,
    )
    const destination = outputPath(route)
    await mkdir(dirname(destination), { recursive: true })
    await writeFile(destination, html, 'utf8')
  }

  const notFound = await renderRoute(App, SeoContext, '/not-found')
  const notFoundMarkup = rewriteAssetUrls(notFound.markup)
  const notFoundHtml = injectHead(template, pageHead(notFound.seo, SITE)).replace(
    '<div id="root"></div>',
    `<div id="root">${notFoundMarkup}</div>`,
  )
  await writeFile(resolve(dist, '404.html'), notFoundHtml, 'utf8')

  const publishedRoutes = ARTICLES
    .filter((article) => article.status === 'Publié')
    .map((article) => `/journal/${article.slug}`)
  await writeFile(
    resolve(dist, 'sitemap.xml'),
    sitemapXml(SITE, [...staticRoutes, ...publishedRoutes]),
    'utf8',
  )

  console.log(`Prerendered ${routes.length} routes and 404.html; sitemap contains ${staticRoutes.length + publishedRoutes.length} URLs.`)
} finally {
  await server.close()
}