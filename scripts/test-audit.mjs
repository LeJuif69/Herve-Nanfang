import { sha256 } from '../src/lib/sha256.js'

console.log('--- TEST 1: SHA-256 standard vectors ---')
// NIST test vectors
// empty string: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
// "abc": ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
const hashEmpty = sha256('')
const hashAbc = sha256('abc')
console.log('SHA-256(""):', hashEmpty)
console.log('Expected   : e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
if (hashEmpty !== 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855') {
  throw new Error('SHA-256("") mismatch!')
}

console.log('SHA-256("abc"):', hashAbc)
console.log('Expected      : ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
if (hashAbc !== 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad') {
  throw new Error('SHA-256("abc") mismatch!')
}
console.log('✓ SHA-256 standard test vectors PASSED')

console.log('\n--- TEST 2: Content alteration detection ---')
function computeHash(post) {
  const norm = {
    title: (post.title || '').trim(),
    pillar: post.pillar,
    series: post.series || '',
    scheduledDate: post.scheduledDate,
    scheduledTime: post.scheduledTime || '09:00',
    platforms: [...(post.platforms || [])].sort(),
    content: Object.keys(post.contentByPlatform || {})
      .sort()
      .map((k) => ({
        p: k,
        t: (post.contentByPlatform[k]?.text || '').trim(),
        tags: [...(post.contentByPlatform[k]?.hashtags || [])].sort(),
      })),
    mediaUrl: post.mediaUrl || '',
    linkUrl: post.linkUrl || '',
    ctaLabel: post.ctaLabel || '',
    targetAudience: post.targetAudience || '',
  }
  return `sha256:${sha256(JSON.stringify(norm))}`
}

const basePost = {
  id: 'pub-test-1',
  title: 'Le Pianobariste Live',
  pillar: 'decouverte',
  series: 'pianobariste-live',
  scheduledDate: '2026-10-25',
  scheduledTime: '09:00',
  platforms: ['linkedin', 'whatsapp'],
  contentByPlatform: {
    linkedin: { text: 'Découvrez la session live.', hashtags: ['#Live', '#Piano'] },
    whatsapp: { text: 'Session live disponible !', hashtags: [] },
  },
  mediaUrl: '/images/hero-duo-live.webp',
  linkUrl: 'https://hervenanfang.vercel.app/musique',
  ctaLabel: 'Écouter',
  targetAudience: 'Tout public',
}

const initialHash = computeHash(basePost)
console.log('Initial Hash:', initialHash)

// Test A: Modifying text
const modifiedTextPost = {
  ...basePost,
  contentByPlatform: {
    ...basePost.contentByPlatform,
    linkedin: { ...basePost.contentByPlatform.linkedin, text: 'Texte altéré sans approbation' },
  },
}
const modTextHash = computeHash(modifiedTextPost)
console.log('Modified text Hash:', modTextHash)
if (initialHash === modTextHash) throw new Error('Failed to detect text modification!')
console.log('✓ Text alteration correctly invalidates hash')

// Test B: Modifying scheduled date
const modifiedDatePost = {
  ...basePost,
  scheduledDate: '2026-10-30',
}
const modDateHash = computeHash(modifiedDatePost)
console.log('Modified date Hash:', modDateHash)
if (initialHash === modDateHash) throw new Error('Failed to detect date modification!')
console.log('✓ Scheduled date change correctly invalidates hash')

// Test C: Modifying scheduled time
const modifiedTimePost = {
  ...basePost,
  scheduledTime: '18:30',
}
const modTimeHash = computeHash(modifiedTimePost)
if (initialHash === modTimeHash) throw new Error('Failed to detect time modification!')
console.log('✓ Scheduled time change correctly invalidates hash')

// Test D: Modifying platforms
const modifiedPlatformPost = {
  ...basePost,
  platforms: ['linkedin', 'whatsapp', 'facebook'],
}
const modPlatHash = computeHash(modifiedPlatformPost)
if (initialHash === modPlatHash) throw new Error('Failed to detect platform modification!')
console.log('✓ Platform modification correctly invalidates hash')

console.log('\n--- ALL INTEGRITY TESTS PASSED SUCCESSFULLY ---')
