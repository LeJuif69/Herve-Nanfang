/**
 * Soumet les URL du sitemap à IndexNow (Bing, Yandex, Seznam, Naver).
 * 
 * Usage :
 *   1. Obtenir une clé IndexNow (ex: Bing Webmaster Tools > IndexNow > Générer une clé).
 *   2. Déposer la clé dans .env.local ou dans les variables d'environnement Vercel :
 *      INDEXNOW_KEY=<votre_cle>
 *   3. Exécution :
 *      npm run submit:indexnow
 *      (Le script écrit automatiquement le fichier de vérification <clé>.txt dans public/ et dist/).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const isAutoMode = process.argv.includes('--auto')

function parseArgKey() {
  const idx = process.argv.indexOf('--key')
  if (idx !== -1 && process.argv[idx + 1]) {
    return process.argv[idx + 1].trim()
  }
  return ''
}

const key = (process.env.INDEXNOW_KEY ?? parseArgKey()).trim()

if (!key) {
  if (isAutoMode) {
    console.log('ℹ️  [IndexNow] INDEXNOW_KEY non configuré — soumission automatique ignorée.')
    process.exit(0)
  }
  console.error('❌ INDEXNOW_KEY manquant. Définissez INDEXNOW_KEY dans .env.local ou sur Vercel.')
  console.error('👉 Pour générer une clé : https://www.bing.com/indexnow/getstarted')
  process.exit(1)
}

const host = 'hervenanfang.vercel.app'

// Auto-création du fichier de vérification <clé>.txt dans public/ et dist/
const keyFileName = `${key}.txt`
const publicTxtPath = resolve(root, 'public', keyFileName)
const distTxtPath = resolve(root, 'dist', keyFileName)

try {
  await writeFile(publicTxtPath, key, 'utf8')
  if (existsSync(resolve(root, 'dist'))) {
    await writeFile(distTxtPath, key, 'utf8')
  }
  console.log(`✅ Fichier de vérification IndexNow synchronisé : /${keyFileName}`)
} catch (err) {
  console.warn('⚠️  Impossible d’écrire le fichier de vérification :', err.message)
}

// Recherche du sitemap : priorité à dist/sitemap.xml (post-build), repli sur public/sitemap.xml
let sitemapPath = resolve(root, 'dist/sitemap.xml')
if (!existsSync(sitemapPath)) {
  sitemapPath = resolve(root, 'public/sitemap.xml')
}

if (!existsSync(sitemapPath)) {
  console.error('❌ Sitemap introuvable dans dist/ ou public/. Lancez d’abord npm run build.')
  process.exit(isAutoMode ? 0 : 1)
}

const sitemap = await readFile(sitemapPath, 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

if (urls.length === 0) {
  console.error('❌ Aucune URL trouvée dans le sitemap.')
  process.exit(isAutoMode ? 0 : 1)
}

const payload = JSON.stringify({
  host,
  key,
  keyLocation: `https://${host}/${keyFileName}`,
  urlList: urls,
})

try {
  console.log(`📡 Soumission de ${urls.length} URL à IndexNow (${host})...`)
  const res = await fetch('https://api.indexnow.org/IndexNow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: payload,
  })

  if (res.ok || res.status === 200 || res.status === 202) {
    console.log(`🚀 IndexNow succès : HTTP ${res.status} ${res.statusText} — ${urls.length} URL transmises aux moteurs de recherche.`)
  } else {
    console.warn(`⚠️  IndexNow a retourné : HTTP ${res.status} ${res.statusText}`)
    if (!isAutoMode) process.exit(1)
  }
} catch (err) {
  console.error('❌ Erreur de connexion au serveur IndexNow :', err.message)
  if (!isAutoMode) process.exit(1)
}
