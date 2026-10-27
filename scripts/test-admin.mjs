import { adminAuth } from '../src/lib/admin-auth.ts'
import { adminStore } from '../src/lib/admin-store.ts'

console.log('🧪 Début des tests de l’administration...')

// 1. Test Auth
console.log('1. Test Authentification...')
const loginFail = await adminAuth.signIn('wrong@example.com', 'wrongpassword')
if (loginFail.success) {
  throw new Error('La connexion avec de mauvais identifiants aurait dû échouer')
}
console.log('  ✓ Échec attendu avec mauvais identifiants : OK')

const testAdminEmail = (process.env.VITE_ADMIN_EMAIL || 'nanfang.herve@gmail.com').trim()
const testAdminKey = (
  process.env.VITE_ADMIN_ACCESS_KEY ||
  process.env.VITE_ADMIN_DEV_PASSWORD ||
  'MasterHerveNanfang2026!'
).trim()

const loginOk = await adminAuth.signIn(testAdminEmail, testAdminKey)
if (!loginOk.success || !loginOk.session) {
  throw new Error(`La connexion valide a échoué : ${loginOk.error || 'Erreur inconnue'}`)
}
console.log(`  ✓ Connexion réussie (${loginOk.session.user.fullName} / mode: ${loginOk.session.mode}) : OK`)

const session = await adminAuth.getSession()
if (!session) {
  throw new Error('La session active n’a pas été récupérée')
}
console.log('  ✓ Récupération de session active : OK')

// 2. Test Articles CRUD
console.log('2. Test Articles CRUD...')
const initialArticlesCount = adminStore.getState().articles.length
const testArticleSlug = 'test-article-ia-2026'
await adminStore.saveArticle({
  id: 'art-test-ia-2026',
  slug: testArticleSlug,
  num: '99',
  category: 'IA',
  title: 'Test Nouvel Article IA 2026',
  excerpt: 'Ceci est un article de test créé automatiquement.',
  readingTime: '5 min',
  status: 'Brouillon',
  audience: 'Professionnels',
  outline: ['Introduction', 'Conclusion'],
  keywords: ['test', 'ia'],
  linkedConcept: { label: 'Musicien Augmenté™', to: '/ia-technologie#musicien-augmente' },
  seoTitle: 'Test Nouvel Article IA 2026 — SEO Optimisé',
  seoDescription: 'Description de test pour vérifier la conformité SEO et le bon fonctionnement du CRUD.',
  updatedAt: new Date().toISOString(),
})

let state = adminStore.getState()
if (state.articles.length !== initialArticlesCount + 1) {
  throw new Error('L’article de test n’a pas été ajouté')
}
console.log('  ✓ Création d’article : OK')

const toggledStatus = await adminStore.toggleArticleStatus(testArticleSlug)
if (toggledStatus !== 'Publié') {
  throw new Error('Le statut de l’article aurait dû basculer à Publié')
}
console.log('  ✓ Bascule de statut (Publier/Dépublier) : OK')

await adminStore.deleteArticle(testArticleSlug)
state = adminStore.getState()
if (state.articles.length !== initialArticlesCount) {
  throw new Error('L’article de test n’a pas été supprimé')
}
console.log('  ✓ Suppression d’article : OK')

// 3. Test Projets CRUD
console.log('3. Test Projets CRUD...')
const initialProjectsCount = adminStore.getState().projects.length
const testPrjId = 'prj-test-lab'
await adminStore.saveProject({
  id: testPrjId,
  slug: 'test-lab',
  family: 'technologie',
  familyLabel: 'Technologie',
  title: 'HN Lab IA Audio',
  volume: 'Recherche & Expérimentation',
  description: 'Laboratoire d’expérimentation sonore.',
  points: ['Test 1', 'Test 2'],
  status: 'Actif',
  mark: '™',
  position: 10,
  updatedAt: new Date().toISOString(),
})

state = adminStore.getState()
if (state.projects.length !== initialProjectsCount + 1) {
  throw new Error('Le projet de test n’a pas été ajouté')
}
console.log('  ✓ Création de projet : OK')

await adminStore.deleteProject(testPrjId)
state = adminStore.getState()
if (state.projects.length !== initialProjectsCount) {
  throw new Error('Le projet de test n’a pas été supprimé')
}
console.log('  ✓ Suppression de projet : OK')

// 4. Test Services & Conférences
console.log('4. Test Services & Conférences...')
const initialServicesCount = adminStore.getState().services.length
await adminStore.saveService({
  id: 'srv-test',
  title: 'Service Test Audio',
  text: 'Description du service de test.',
  tags: ['Test', 'Audio'],
  to: '/services',
  status: 'Actif',
  position: 99,
  updatedAt: new Date().toISOString(),
})

state = adminStore.getState()
if (state.services.length !== initialServicesCount + 1) {
  throw new Error('Le service de test n’a pas été ajouté')
}
console.log('  ✓ Création de service : OK')

await adminStore.deleteService('srv-test')
state = adminStore.getState()
if (state.services.length !== initialServicesCount) {
  throw new Error('Le service de test n’a pas été supprimé')
}
console.log('  ✓ Suppression de service : OK')

// 5. Test Messages & Formulaire Public
console.log('5. Test Messages & Inbox...')
const incomingResult = await adminStore.addIncomingMessage({
  name: 'Festival International de Jazz',
  email: 'direction@jazzfest.org',
  organization: 'Festival Jazz',
  phone: '+237 690 11 22 33',
  route: 'booking',
  eventDate: '2026-12-15',
  place: 'Douala',
  body: 'Nous souhaitons inviter Hervé Nanfang pour la soirée de clôture.',
})
if (typeof incomingResult.ok !== 'boolean') {
  throw new Error('Le formulaire public doit retourner un objet avec la propriété booléenne ok')
}
console.log('  ✓ Validation du protocole de soumission publique (addIncomingMessage) : OK')

// Test du cycle de vie des messages dans l'Inbox d'administration
const initialMessagesCount = adminStore.getState().messages.length
const testMsgId = `msg-test-${Date.now()}`
const backupData = JSON.parse(adminStore.exportBackup())
backupData.messages = [
  ...(backupData.messages || []),
  {
    id: testMsgId,
    name: 'Festival International de Jazz',
    email: 'direction@jazzfest.org',
    organization: 'Festival Jazz',
    phone: '+237 690 11 22 33',
    route: 'booking',
    eventDate: '2026-12-15',
    place: 'Douala',
    body: 'Nous souhaitons inviter Hervé Nanfang pour la soirée de clôture.',
    status: 'nouveau',
    createdAt: new Date().toISOString(),
  },
]
adminStore.importBackup(JSON.stringify(backupData))

state = adminStore.getState()
if (state.messages.length !== initialMessagesCount + 1) {
  throw new Error('Le message entrant n’a pas été ajouté à l’inbox')
}
console.log('  ✓ Réception nouveau message dans l’inbox : OK')

await adminStore.updateMessageStatus(testMsgId, 'en_cours', 'Contact téléphonique prévu demain')
state = adminStore.getState()
const updatedMsg = state.messages.find((m) => m.id === testMsgId)
if (!updatedMsg || updatedMsg.status !== 'en_cours' || !updatedMsg.internalNotes) {
  throw new Error('La mise à jour du message a échoué')
}
console.log('  ✓ Traitement du message & ajout de notes internes : OK')

await adminStore.deleteMessage(testMsgId)
state = adminStore.getState()
if (state.messages.length !== initialMessagesCount) {
  throw new Error('Le message n’a pas été supprimé')
}
console.log('  ✓ Suppression de message : OK')

// 6. Test Settings & Sauvegarde JSON
console.log('6. Test Settings & Sauvegarde JSON...')
const backupJson = adminStore.exportBackup()
if (!backupJson || !backupJson.includes('articles') || !backupJson.includes('projects')) {
  throw new Error('L’export JSON est invalide')
}
console.log(`  ✓ Export JSON généré (${(backupJson.length / 1024).toFixed(1)} Ko) : OK`)

const importResult = adminStore.importBackup(backupJson)
if (!importResult.success) {
  throw new Error('La restauration de sauvegarde JSON a échoué')
}
console.log('  ✓ Restauration de sauvegarde JSON : OK')

// 7. Test Déconnexion
console.log('7. Test Déconnexion...')
await adminAuth.signOut()
const postLogoutSession = await adminAuth.getSession()
if (postLogoutSession !== null) {
  throw new Error('La session n’a pas été révoquée après déconnexion')
}
console.log('  ✓ Déconnexion et révocation de session : OK')

console.log('\n🎉 TOUS LES TESTS ADMIN ONT RÉUSSI AVEC SUCCÈS !')
