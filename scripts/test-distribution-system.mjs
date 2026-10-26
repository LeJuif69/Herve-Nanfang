import { ARTICLES } from '../src/data/articles.js'
import { generateArticleCampaignDistribution, buildUtmUrl } from '../src/lib/campaign-distribution.js'
import { normalizePublicationStatus } from '../src/lib/admin-types.js'

console.log('=== TEST SUITE : SYSTÈME DE DISTRIBUTION ÉDITORIALE MULTICANAL ===\n')

let passedTests = 0
let failedTests = 0

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ PASS: ${message}`)
    passedTests++
  } else {
    console.error(`  ❌ FAIL: ${message}`)
    failedTests++
  }
}

// -----------------------------------------------------------------------------
// TEST 1 : Vérification de la fonction buildUtmUrl
// -----------------------------------------------------------------------------
console.log('1. Test de la génération d’URLs avec paramètres UTM')
const testBaseUrl = 'https://hervenanfang.vercel.app/journal/apres-la-mao-lia'
const utmUrl = buildUtmUrl(testBaseUrl, {
  source: 'linkedin',
  medium: 'social',
  campaign: 'distribution_article',
  content: 'j0_analyse_fond',
})

assert(
  utmUrl.startsWith('https://hervenanfang.vercel.app/journal/apres-la-mao-lia?'),
  'La base canonique est préservée avant les paramètres de requête',
)
assert(utmUrl.includes('utm_source=linkedin'), 'utm_source est correctement encodé')
assert(utmUrl.includes('utm_medium=social'), 'utm_medium est correctement encodé')
assert(utmUrl.includes('utm_campaign=distribution_article'), 'utm_campaign est normalisé')
assert(utmUrl.includes('utm_content=j0_analyse_fond'), 'utm_content est présent')

// -----------------------------------------------------------------------------
// TEST 2 : Vérification sur le premier article du Journal
// -----------------------------------------------------------------------------
console.log('\n2. Test de génération du plan de distribution pour Pilier 01')
const firstArticle = ARTICLES[0]
const plan = generateArticleCampaignDistribution(firstArticle, '2026-10-26')

assert(plan.article.slug === 'apres-la-mao-lia', 'Article associé correctement')
assert(plan.baseDate === '2026-10-26', 'Date de départ J0 correcte')
assert(
  plan.canonicalUrl === 'https://hervenanfang.vercel.app/journal/apres-la-mao-lia',
  'URL canonique exacte sans paramètres parasites',
)
assert(plan.assets.length === 10, `Génération de 10 assets complets (obtenu: ${plan.assets.length})`)

// -----------------------------------------------------------------------------
// TEST 3 : Couverture des 9 formats demandés
// -----------------------------------------------------------------------------
console.log('\n3. Vérification des 9 formats et canaux requis')
const types = plan.assets.map((a) => a.type)

assert(types.includes('editorial_summary'), 'Format 1 : Résumé éditorial présent')
assert(types.includes('linkedin'), 'Format 2 : Publication LinkedIn présente')
assert(types.includes('facebook'), 'Format 3 : Publication Facebook présente')
assert(types.includes('whatsapp_status'), 'Format 4 : Séquence de statuts WhatsApp présente')
assert(types.includes('video_script'), 'Format 5 : Script vidéo 30-60s présent')
assert(types.includes('pedagogical_carousel'), 'Format 6 : Plan de carrousel pédagogique présent')
assert(types.includes('newsletter'), 'Format 7 : Brouillon de newsletter présent')
assert(types.includes('medium_syndication'), 'Format 8 : Proposition de republication Medium présente')
assert(types.includes('press_pitch'), 'Format 9 : Proposition de tribune média présente')

// -----------------------------------------------------------------------------
// TEST 4 : Calendrier d'échelonnement J0 à J14
// -----------------------------------------------------------------------------
console.log('\n4. Vérification de l’échelonnement temporel J0 -> J14')
const offsets = plan.assets.map((a) => a.dayOffset)
assert(offsets.includes(0), 'J0 (+0j) présent')
assert(offsets.includes(1), 'J1 (+1j) présent')
assert(offsets.includes(3), 'J3 (+3j) présent')
assert(offsets.includes(5), 'J5 (+5j) présent')
assert(offsets.includes(7), 'J7 (+7j) présent')
assert(offsets.includes(10), 'J10 (+10j) présent')
assert(offsets.includes(14), 'J14 (+14j) présent')

const mediumAsset = plan.assets.find((a) => a.type === 'medium_syndication')
assert(
  mediumAsset.content.includes('<link rel="canonical" href="https://hervenanfang.vercel.app/journal/apres-la-mao-lia" />'),
  'Medium asset contient la balise canonique explicite pointant vers le site',
)
assert(
  mediumAsset.content.includes('Cet article a été initialement publié en exclusivité sur le site officiel'),
  'Mention d’antériorité éditoriale présente pour Medium',
)

const pressAsset = plan.assets.find((a) => a.type === 'press_pitch')
assert(
  pressAsset.content.includes('hervenanfang@gmail.com'),
  'Pitch tribune presse contient l’email officiel vérifié',
)

// -----------------------------------------------------------------------------
// TEST 5 : Intégrité des SocialPost générés pour le calendrier
// -----------------------------------------------------------------------------
console.log('\n5. Vérification des posts pour le calendrier et du sas de validation')
assert(plan.posts.length === 9, `9 posts sociaux générés pour le calendrier (obtenu: ${plan.posts.length})`)

const allArePending = plan.posts.every((p) => p.status === 'a_valider')
assert(allArePending, 'Tous les posts générés ont le statut initial obligatoire "a_valider" (pending_review)')

const allHaveHash = plan.posts.every((p) => p.validationSignature && p.validationSignature.contentHash)
assert(allHaveHash, 'Tous les posts ont une empreinte SHA-256 de contrôle calculée')

const allHaveUtm = plan.posts.every((p) => p.linkUrl && p.linkUrl.includes('utm_source='))
assert(allHaveUtm, 'Tous les liens de partage portent des paramètres UTM conformes')

// -----------------------------------------------------------------------------
// TEST 6 : Normalisation des statuts
// -----------------------------------------------------------------------------
console.log('\n6. Test de la normalisation des statuts canoniques')
assert(normalizePublicationStatus('draft') === 'draft', 'draft -> draft')
assert(normalizePublicationStatus('brouillon') === 'draft', 'brouillon -> draft')
assert(normalizePublicationStatus('pending_review') === 'pending_review', 'pending_review -> pending_review')
assert(normalizePublicationStatus('a_valider') === 'pending_review', 'a_valider -> pending_review')
assert(normalizePublicationStatus('approved') === 'approved', 'approved -> approved')
assert(normalizePublicationStatus('valide') === 'approved', 'valide -> approved')
assert(normalizePublicationStatus('scheduled') === 'scheduled', 'scheduled -> scheduled')
assert(normalizePublicationStatus('programme') === 'scheduled', 'programme -> scheduled')
assert(normalizePublicationStatus('published') === 'published', 'published -> published')
assert(normalizePublicationStatus('publie') === 'published', 'publie -> published')
assert(normalizePublicationStatus('failed') === 'failed', 'failed -> failed')
assert(normalizePublicationStatus('erreur') === 'failed', 'erreur -> failed')

// -----------------------------------------------------------------------------
// TEST 7 : Test sur tous les 12 articles du Journal
// -----------------------------------------------------------------------------
console.log('\n7. Test de robustesse sur l’intégralité des 12 articles')
let allArticlesValid = true
for (const art of ARTICLES) {
  const p = generateArticleCampaignDistribution(art, '2026-11-01')
  if (p.assets.length !== 10 || p.posts.length !== 9) {
    allArticlesValid = false
    console.error(`Erreur sur l’article ${art.slug}`)
  }
}
assert(allArticlesValid, 'Les 12 articles du Journal génèrent avec succès leur campagne multicanal sans erreur')

console.log('\n-------------------------------------------------------------')
console.log(`RÉSULTAT DES TESTS : ${passedTests} réussis / ${failedTests} échoués`)
if (failedTests > 0) {
  process.exit(1)
} else {
  console.log('✅ Tous les tests sont validés avec succès !')
}
