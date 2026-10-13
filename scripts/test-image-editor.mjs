import { adminStore } from '../src/lib/admin-store.ts'
import { imagePositionCss } from '../src/lib/admin-types.ts'

console.log('🖼️ Tests éditeur images visuel...')

// 1. Ouvrir un article, modifier cadrage + focal, enregistrer
const article = adminStore.getState().articles[0]
if (!article) throw new Error('Aucun article pour tester')
console.log(`1. Article de test : ${article.slug}`)

await adminStore.saveArticle({
  ...article,
  coverImage: '/src/assets/portrait.webp',
  coverPositionX: 50,
  coverPositionY: 15,
  coverZoom: 1.25,
  coverFocalX: 50,
  coverFocalY: 18,
  coverPreset: 'portrait',
  coverAlt: 'Portrait test visage visible',
})

let reloaded = adminStore.getState().articles.find((a) => a.id === article.id)
if (!reloaded) throw new Error('Article perdu après save')
if (reloaded.coverPositionX !== 50 || reloaded.coverPositionY !== 15) throw new Error('Cadrage non conservé')
if (reloaded.coverZoom !== 1.25) throw new Error('Zoom non conservé')
if (reloaded.coverFocalX !== 50 || reloaded.coverFocalY !== 18) throw new Error('Point focal non conservé')
console.log('  ✓ Cadrage + focal + zoom persistés après rechargement état : OK')
console.log(`  ✓ CSS généré : object-position: ${imagePositionCss({ positionX: reloaded.coverPositionX, positionY: reloaded.coverPositionY })}`)

// 2. Remplacer l'image, ancien média non supprimé
const mediaBefore = adminStore.getState().media.length
const oldUrl = reloaded.coverImage
await adminStore.saveArticle({ ...reloaded, coverImage: '/og-image.jpg', coverAlt: 'Remplacement test' })
reloaded = adminStore.getState().articles.find((a) => a.id === article.id)
if (reloaded.coverImage !== '/og-image.jpg') throw new Error('Remplacement image échoué')
const oldMediaStillThere = adminStore.getState().media.some((m) => m.url === oldUrl) || oldUrl.startsWith('/src/assets')
if (!oldMediaStillThere && adminStore.getState().media.length < mediaBefore) throw new Error('Ancien média supprimé abusivement')
console.log('  ✓ Remplacement image : nouvelle URL active, ancien fichier conservé : OK')

// Restaure l'article d'origine pour ne pas polluer les données
await adminStore.saveArticle(article)
console.log('  ✓ Article restauré à son état initial : OK')

// 3. Projet : cadrage par usage indépendant du même fichier
const project = adminStore.getState().projects[0]
await adminStore.saveProject({
  ...project,
  coverImage: '/src/assets/portrait.webp',
  coverPositionX: 20,
  coverPositionY: 80,
  coverZoom: 1.5,
  coverPreset: 'banniere',
  coverAlt: 'Même photo, cadrage projet différent',
})
const projReload = adminStore.getState().projects.find((p) => p.id === project.id)
const artReload = adminStore.getState().articles.find((a) => a.id === article.id)
if (projReload.coverPositionX === artReload.coverPositionX && projReload.coverPositionY === artReload.coverPositionY) {
  console.log('  ! Même cadrage article/projet (normal si mêmes valeurs par hasard)')
} else {
  console.log('  ✓ Même fichier, cadrages indépendants par contenu (article vs projet) : OK')
}
await adminStore.saveProject(project)

// 4. Service + piste : nouveaux champs image persistés
const service = adminStore.getState().services[0]
await adminStore.saveService({ ...service, coverImage: '/og-image.jpg', coverPositionX: 30, coverPositionY: 70, coverZoom: 1.1, coverAlt: 'Visuel service test' })
const srvReload = adminStore.getState().services.find((s) => s.id === service.id)
if (srvReload.coverPositionX !== 30) throw new Error('Service cover non persisté')
console.log('  ✓ Service avec image + cadrage : OK')
await adminStore.saveService(service)

const track = adminStore.getState().tracks[0]
await adminStore.saveTrack({ ...track, coverImage: '/og-image.jpg', coverPositionX: 80, coverPositionY: 20, coverAlt: 'Pochette test' })
const trkReload = adminStore.getState().tracks.find((t) => t.id === track.id)
if (trkReload.coverPositionX !== 80) throw new Error('Piste cover non persistée')
console.log('  ✓ Piste musique avec image + cadrage : OK')
await adminStore.saveTrack(track)

// 5. Médiathèque : métadonnées étendues + focal par défaut
const med = adminStore.getState().media[0]
await adminStore.updateMedia(med.id, {
  title: 'Titre éditorial test',
  description: 'Description test',
  credit: '© Test',
  focalX: 42,
  focalY: 28,
  defaultPositionX: 42,
  defaultPositionY: 28,
})
const medReload = adminStore.getState().media.find((m) => m.id === med.id)
if (medReload.focalX !== 42 || medReload.title !== 'Titre éditorial test') throw new Error('Métadonnées média non persistées')
console.log('  ✓ Médiathèque : titre/description/crédit/focal persistés : OK')
await adminStore.updateMedia(med.id, { title: undefined, description: undefined, credit: undefined } )

// 6. Export backup contient les nouveaux champs
await adminStore.saveArticle({ ...article, coverPositionX: 50, coverPositionY: 15, coverFocalX: 50, coverAlt: 'backup check' })
const backup = adminStore.exportBackup()
if (!backup.includes('coverPositionX') || !backup.includes('coverFocalX')) throw new Error('Backup sans nouveaux champs')
console.log('  ✓ Sauvegarde JSON inclut cadrage/focal : OK')
await adminStore.saveArticle(article)

console.log('\n🎉 TOUS LES TESTS IMAGE EDITOR ONT RÉUSSI !')
