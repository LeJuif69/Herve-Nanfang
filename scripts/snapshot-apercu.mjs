/**
 * APERÇU STATIQUE AUTONOME — Hervé Nanfang
 * ============================================================================
 * Produit un fichier HTML unique et autonome (images, polices et styles inclus
 * en base64) de la page d'accueil. Aucun serveur, aucune connexion réseau
 * nécessaire : le fichier s'ouvre dans n'importe quel navigateur, y compris
 * dans l'aperçu de fichiers de l'espace de travail.
 *
 * Usage (Playwright requis) :
 *     node scripts/snapshot-apercu.mjs            # serveur de dev sur :5173
 *     node scripts/snapshot-apercu.mjs 4173       # autre port
 *
 * Sortie : apercu-site.html à la racine du projet
 */
import { chromium } from 'playwright'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PORT = process.argv[2] || '5173'
const CIBLE = `http://localhost:${PORT}/`
const CHEMIN_SORTIE = fileURLToPath(new URL('../apercu-site.html', import.meta.url))

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

await page.goto(CIBLE, { waitUntil: 'networkidle', timeout: 60000 })
// Laisser les polices se charger avant de figer le rendu
await page.evaluate(() => document.fonts.ready)
await page.waitForTimeout(2500)

const resultat = await page.evaluate(async () => {
  /* --- 1. Rassembler toutes les règles CSS --------------------------------- */
  let css = ''
  for (const feuille of Array.from(document.styleSheets)) {
    try {
      for (const regle of Array.from(feuille.cssRules)) css += regle.cssText + '\n'
    } catch {
      /* feuille inaccessible : ignorée */
    }
  }

  const versBase64 = async (url, mimeParDefaut) => {
    const reponse = await fetch(url)
    const buffer = new Uint8Array(await reponse.arrayBuffer())
    let binaire = ''
    const bloc = 0x8000 // évite de saturer la pile d'appels
    for (let i = 0; i < buffer.length; i += bloc) {
      binaire += String.fromCharCode.apply(null, buffer.subarray(i, i + bloc))
    }
    const extension = url.split('?')[0].split('.').pop().toLowerCase()
    const mime =
      { woff2: 'font/woff2', woff: 'font/woff', ttf: 'font/ttf' }[extension] ||
      { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', svg: 'image/svg+xml' }[
        extension
      ] ||
      mimeParDefaut
    // Encodage base64 obligatoire : sans btoa(), les octets bruts corrompent le data URI.
    return `data:${mime};base64,${btoa(binaire)}`
  }

  /* --- 2. Incorporer les polices référencées dans le CSS ------------------- */
  const urlPolices = Array.from(new Set(Array.from(css.matchAll(/url\((["']?)([^)"']+)\1\)/g)).map((m) => m[2])))
  for (const u of urlPolices) {
    if (u.startsWith('data:')) continue
    try {
      const absolue = new URL(u, location.href).href
      const donnee = await versBase64(absolue, 'application/octet-stream')
      css = css.split(u).join(donnee)
    } catch {
      /* police indisponible : ignorée */
    }
  }

  /* --- 3. Incorporer les images ------------------------------------------- */
  for (const img of Array.from(document.images)) {
    if (!img.src.startsWith('http')) continue
    try {
      img.src = await versBase64(img.src, 'image/jpeg')
    } catch {
      /* image indisponible : ignorée */
    }
  }

  /* --- 4. Reconstruire un document autonome ------------------------------- */
  const corps = document.body.cloneNode(true)
  corps.querySelectorAll('script').forEach((s) => s.remove())

  const titre = document.title
  const description =
    document.querySelector('meta[name="description"]')?.getAttribute('content') || ''

  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${titre}</title>
<meta name="description" content="${description}">
<style>
${css}
/* Aperçu statique : le défilement fluide est désactivé */
html { scroll-behavior: auto; }
</style>
</head>
<body>${corps.innerHTML}</body>
</html>`

  return { html, polices: urlPolices.length, images: document.images.length }
})

/* La vérification du fichier produit se fait séparément (voir README) :
   ouvrir apercu-site.html et compter les images décodées. */

await browser.close()

writeFileSync(CHEMIN_SORTIE, resultat.html, 'utf8')
const taille = (Buffer.byteLength(resultat.html) / 1024 / 1024).toFixed(2)
console.log(`Aperçu écrit : apercu-site.html (${taille} Mo)`)
console.log(`  polices incorporées : ${resultat.polices} | images incorporées : ${resultat.images}`)
