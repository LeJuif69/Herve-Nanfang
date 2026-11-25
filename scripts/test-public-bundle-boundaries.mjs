import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const dist = resolve(process.cwd(), 'dist')
const manifest = JSON.parse(await readFile(resolve(dist, '.vite/manifest.json'), 'utf8'))
const homepage = await readFile(resolve(dist, 'index.html'), 'utf8')
const entry = manifest['index.html']

if (!entry?.isEntry) {
  throw new Error('Production Vite manifest has no index.html entry.')
}

const forbiddenChunks = new Set(['articles', 'articles-data', 'admin-store', 'vendor-supabase', 'Admin', 'public-message'])
const eagerDependencies = (entry.imports || [])
  .map((key) => manifest[key]?.name || key)
  .filter((name) => forbiddenChunks.has(name))

const preloadedForbiddenChunks = Object.values(manifest)
  .filter((chunk) => forbiddenChunks.has(chunk.name) && homepage.includes(chunk.file))
  .map((chunk) => chunk.name)

const violations = [...new Set([...eagerDependencies, ...preloadedForbiddenChunks])]
if (violations.length) {
  throw new Error(`Homepage eagerly loads route-only chunks: ${violations.join(', ')}`)
}

if (!(entry.dynamicImports || []).includes('src/pages/Admin.tsx')) {
  violations.push('Admin route is not dynamically loaded')
}

const pageEntries = Object.entries(manifest).filter(([, chunk]) => chunk.src?.startsWith('src/pages/'))
for (const [key, page] of pageEntries) {
  const routeChunks = [...(page.imports || []), ...(page.dynamicImports || [])]
    .map((dependency) => manifest[dependency]?.name || dependency)
  const isArticleDataRoute = ['Journal', 'ArticleDetail', 'Admin'].includes(page.name)

  if (!isArticleDataRoute && routeChunks.some((name) => ['articles', 'articles-data'].includes(name))) {
    violations.push(`${page.name || key} loads full article data`)
  }
  if (page.name !== 'Admin' && routeChunks.includes('admin-store')) {
    violations.push(`${page.name || key} loads the admin store`)
  }
}

if (violations.length) {
  throw new Error(`Public route bundle boundaries violated: ${[...new Set(violations)].join(', ')}`)
}

console.log('Homepage does not preload article, admin, or Supabase chunks.')
