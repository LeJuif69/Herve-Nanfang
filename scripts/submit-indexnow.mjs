/**
 * Soumet les URL du sitemap à IndexNow (Bing + Yandex).
 * Usage :
 *   1. Bing Webmaster Tools > IndexNow > générer une clé.
 *   2. Déposer la clé dans .env.local / Vercel : INDEXNOW_KEY=<clé>
 *      et publier le fichier public/<clé>.txt contenant la clé
 *      (voir https://www.bing.com/indexnow/getstarted).
 *   3. npm run submit:indexnow
 */
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = process.cwd()
const key = (process.env.INDEXNOW_KEY ?? '').trim()
if (!key) {
  console.error('INDEXNOW_KEY manquant. Définissez-le dans .env.local ou Vercel avant de soumettre.')
  process.exit(1)
}

const host = 'hervenanfang.vercel.app'
const sitemap = await readFile(resolve(root, 'public/sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (urls.length === 0) {
  console.error('Aucune URL trouvée dans public/sitemap.xml.')
  process.exit(1)
}

const payload = JSON.stringify({
  host,
  key,
  keyLocation: `https://${host}/${key}.txt`,
  urlList: urls,
})

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: payload,
})
console.log(`IndexNow : ${res.status} ${res.statusText} — ${urls.length} URL soumises (${host}).`)
if (!res.ok) process.exit(1)
