import {
  DecisionLog,
  EditorialPillar,
  PublicationStatus,
  SocialPlatform,
  SocialPost,
} from './admin-types'
import { SITE } from '../data/site'

/**
 * Piliers directeurs du Système de Croissance Organique NANHÉ
 * 70 % Découverte · 20 % Autorité · 10 % Conversion
 */
export const EDITORIAL_PILLARS: Record<
  EditorialPillar,
  {
    id: EditorialPillar
    label: string
    shortLabel: string
    targetPercent: number
    description: string
    badgeClass: string
    borderColor: string
    bgColor: string
    textColor: string
  }
> = {
  decouverte: {
    id: 'decouverte',
    label: 'Découverte (70 %)',
    shortLabel: 'Découverte',
    targetPercent: 70,
    description: 'Performances, défis musicaux, transformations sonores et contenus participatifs',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    borderColor: 'border-sky-500',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-400',
  },
  autorite: {
    id: 'autorite',
    label: 'Autorité (20 %)',
    shortLabel: 'Autorité',
    targetPercent: 20,
    description: 'Musicologie, pédagogie, MAO, IA et innovation culturelle',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
  },
  conversion: {
    id: 'conversion',
    label: 'Conversion (10 %)',
    shortLabel: 'Conversion',
    targetPercent: 10,
    description: 'Prestations de piano-bar, ingénierie sonore, formations, conférences et collaborations',
    badgeClass: 'bg-gold/20 text-gold border-gold/40',
    borderColor: 'border-gold',
    bgColor: 'bg-gold/10',
    textColor: 'text-gold',
  },
}

/**
 * Séries éditoriales récurrentes pour structurer les formats
 */
export const EDITORIAL_SERIES: { id: string; label: string; pillar: EditorialPillar }[] = [
  { id: 'pianobariste-live', label: 'Le Pianobariste™ Live (Piano solo & ambiance)', pillar: 'decouverte' },
  { id: 'defis-claviers', label: 'Défis Claviers & Comparaisons de styles', pillar: 'decouverte' },
  { id: 'demonstrations-mao', label: 'Démonstrations MAO & Sound Design', pillar: 'decouverte' },
  { id: 'journal-musicien-augmente', label: 'Le Journal du Musicien Augmenté™', pillar: 'autorite' },
  { id: 'pedagogie-rma', label: 'Pédagogie & Méthode Permis de Jouer™', pillar: 'autorite' },
  { id: 'ia-patrimoine', label: 'IA, Algorithmes & Souveraineté Africaine', pillar: 'autorite' },
  { id: 'conseil-marque', label: 'Conseil en Stratégie de Marque Culturelle', pillar: 'conversion' },
  { id: 'prestations-prestige', label: 'Prestations Événements de Prestige', pillar: 'conversion' },
  { id: 'masterclasses-pro', label: 'Masterclasses & Conférences Pro', pillar: 'conversion' },
]

/**
 * Statuts et colonnes du Kanban éditorial
 */
export const KANBAN_COLUMNS: {
  id: PublicationStatus
  title: string
  subtitle: string
  color: string
  badgeClass: string
}[] = [
  { id: 'idees', title: 'Idées', subtitle: 'Concepts & inspirations brutes', color: 'border-white/20', badgeClass: 'bg-white/10 text-ivory/60' },
  { id: 'brouillon', title: 'Brouillons', subtitle: 'Textes & formats en cours', color: 'border-white/30', badgeClass: 'bg-white/15 text-ivory/80' },
  { id: 'a_valider', title: 'En révision (Sas)', subtitle: 'Approbation humaine requise', color: 'border-amber-400', badgeClass: 'bg-amber-400/20 text-amber-300 border border-amber-400/40' },
  { id: 'valide', title: 'Approuvés', subtitle: 'Prêts pour diffusion', color: 'border-emerald-400', badgeClass: 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40' },
  { id: 'programme', title: 'Programmés', subtitle: 'Planifiés sur les réseaux', color: 'border-indigo-400', badgeClass: 'bg-indigo-400/20 text-indigo-300 border border-indigo-400/40' },
  { id: 'publie', title: 'Publiés', subtitle: 'Diffusés avec succès', color: 'border-blue-400', badgeClass: 'bg-blue-400/20 text-blue-300 border border-blue-400/40' },
  { id: 'refuse', title: 'À réviser / Refusés', subtitle: 'Révision demandée', color: 'border-rose-400', badgeClass: 'bg-rose-400/20 text-rose-300 border border-rose-400/40' },
  { id: 'erreur', title: 'Erreurs', subtitle: 'Échecs de synchronisation', color: 'border-crimson', badgeClass: 'bg-crimson/20 text-crimson-2 border border-crimson/40' },
]

/**
 * Plateformes et métadonnées d'affichage
 */
export const PLATFORM_CONFIG: Record<
  SocialPlatform,
  {
    name: string
    color: string
    bgColor: string
    borderColor: string
    badgeClass: string
    maxChars: number
    iconPath: string
  }
> = {
  tiktok: {
    name: 'TikTok',
    color: '#00F2FE',
    bgColor: 'bg-black/60',
    borderColor: 'border-white/30',
    badgeClass: 'bg-black/80 text-white border-white/30',
    maxChars: 2200,
    iconPath:
      'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 3.77.93V6.69z',
  },
  youtube: {
    name: 'YouTube Shorts',
    color: '#FF0000',
    bgColor: 'bg-[#FF0000]/15',
    borderColor: 'border-[#FF0000]/40',
    badgeClass: 'bg-[#FF0000]/20 text-[#fca5a5] border-[#FF0000]/40',
    maxChars: 5000,
    iconPath:
      'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  },
  instagram: {
    name: 'Instagram / Reels',
    color: '#E4405F',
    bgColor: 'bg-[#E4405F]/15',
    borderColor: 'border-[#E4405F]/40',
    badgeClass: 'bg-[#E4405F]/20 text-[#f472b6] border-[#E4405F]/40',
    maxChars: 2200,
    iconPath:
      'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  },
  facebook: {
    name: 'Facebook Reels & Post',
    color: '#1877F2',
    bgColor: 'bg-[#1877F2]/15',
    borderColor: 'border-[#1877F2]/40',
    badgeClass: 'bg-[#1877F2]/20 text-[#93c5fd] border-[#1877F2]/40',
    maxChars: 63206,
    iconPath:
      'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    bgColor: 'bg-[#0A66C2]/15',
    borderColor: 'border-[#0A66C2]/40',
    badgeClass: 'bg-[#0A66C2]/20 text-[#60a5fa] border-[#0A66C2]/40',
    maxChars: 3000,
    iconPath:
      'M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z',
  },
  whatsapp: {
    name: 'WhatsApp Broadcast',
    color: '#25D366',
    bgColor: 'bg-[#25D366]/15',
    borderColor: 'border-[#25D366]/40',
    badgeClass: 'bg-[#25D366]/20 text-[#86efac] border-[#25D366]/40',
    maxChars: 4096,
    iconPath:
      'M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z',
  },
  site: {
    name: 'Site Web / Blog',
    color: '#D4AF37',
    bgColor: 'bg-gold/15',
    borderColor: 'border-gold/40',
    badgeClass: 'bg-gold/20 text-gold border-gold/40',
    maxChars: 10000,
    iconPath:
      'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  },
}

/**
 * URL canonique : toujours dérivée de SITE.url (src/data/site.ts).
 */
export function siteUrl(path = '/'): string {
  if (path.startsWith('http')) return path
  return `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`
}

/**
 * Générateur de liens de partage directs (1-click share)
 */
export function getLinkedInShareUrl(url: string, _text?: string): string {
  const encUrl = encodeURIComponent(url)
  return `https://www.linkedin.com/sharing/share-offsite/?url=${encUrl}`
}

export function getFacebookShareUrl(url: string): string {
  const encUrl = encodeURIComponent(url)
  return `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`
}

export function getWhatsAppShareUrl(text: string): string {
  const encText = encodeURIComponent(text)
  return `https://api.whatsapp.com/send?text=${encText}`
}

/**
 * Générateur automatique de brouillons assisté par IA
 * Produit 3 variantes d'accroches (Hook A/B/C) et structure les formats courts.
 * Statut initial obligatoire : "a_valider" (Sas de révision humaine).
 */
export function generateSocialPostFromSource(
  sourceType: 'article' | 'service' | 'projet' | 'masterclass' | 'musique' | 'libre',
  data: {
    title: string
    slug?: string
    excerpt?: string
    description?: string
    tags?: string[]
    points?: string[]
    coverImage?: string
    url?: string
  },
  scheduledDate: string,
  scheduledTime = '09:00',
): SocialPost {
  const fullUrl = data.url ? siteUrl(data.url) : data.slug ? siteUrl(`/journal/${data.slug}`) : SITE.url
  const title = data.title
  const summary = data.excerpt || data.description || ''
  const points = (data.points || []).slice(0, 3)
  const mediaUrl = data.coverImage || undefined

  // Attribution du pilier directeur selon la source
  let pillar: EditorialPillar = 'autorite'
  let series = 'Le Journal du Musicien Augmenté™'
  if (sourceType === 'service') {
    pillar = 'conversion'
    series = 'Conseil en Stratégie de Marque Culturelle'
  } else if (sourceType === 'projet' || sourceType === 'musique') {
    pillar = 'decouverte'
    series = 'Le Pianobariste™ Live (Piano solo & ambiance)'
  }

  // 3 Variantes d'accroches pour tests A/B
  const hookA = `Pourquoi tant d'artistes négligent la cohérence de leur récit avant de promouvoir leur musique ?`
  const hookB = `Un logo ne sauvera jamais une intention musicale floue. Démonstration :`
  const hookC = `« ${title} » — Ce que 20 ans de pratique musicale et technologique m'ont enseigné :`

  const linkedinText = `${hookB}

${summary}

Points clés développés :
${points.map((p) => `• ${p}`).join('\n')}

Pour lire l'analyse complète :
👉 ${fullUrl}

Quelle est votre approche de la cohérence de marque dans vos projets ?`

  const facebookText = `🎵 ${title}

${summary}

Retrouvez le développement complet sur la plateforme officielle :
🔗 ${fullUrl}`

  const whatsappText = `*Hervé Nanfang | ${series}*

*${title}*

${summary}

👉 ${fullUrl}

Répondez directement à ce message pour réserver un créneau ou échanger.`

  const shortVideoScript = `[STRUCTURE VIDÉO COURTE — REEL / TIKTOK / SHORTS]
0–3s (Accroche) : ${hookB}
3–25s (Démonstration) : Démonstration au clavier / écran MAO
25–45s (Révélation) : L'erreur classique décortiquée en direct
45–60s (Fin & CTA) : Retrouvez la grille complète sur ${fullUrl}`

  const creationLog: DecisionLog = {
    id: `log-${Date.now()}-init`,
    action: 'creation',
    timestamp: new Date().toISOString(),
    author: 'Assistant IA (Génération)',
    reason: `Génération automatique depuis la source ${sourceType} (« ${title} »)`,
  }

  const postDraft: SocialPost = {
    id: `post-gen-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: `Diffusion : ${title}`,
    pillar,
    series,
    sourceType,
    sourceSlug: data.slug,
    sourceTitle: title,
    scheduledDate,
    scheduledTime,
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'instagram', 'youtube'],
    hookVariants: [hookA, hookB, hookC],
    contentByPlatform: {
      linkedin: { text: linkedinText, hashtags: ['#StrategieDeMarque', '#HerveNanfang'], charCount: linkedinText.length },
      facebook: { text: facebookText, hashtags: ['#HerveNanfang'], charCount: facebookText.length },
      whatsapp: { text: whatsappText, hashtags: [], charCount: whatsappText.length },
      instagram: { text: `${hookB}\n\n${summary}\n\nLien dans la bio.`, hashtags: ['#HerveNanfang', '#Musique'], charCount: summary.length },
      youtube: { text: shortVideoScript, hashtags: ['#Shorts', '#Piano', '#HerveNanfang'], charCount: shortVideoScript.length },
      tiktok: { text: shortVideoScript, hashtags: ['#MusicTok', '#Piano', '#HerveNanfang'], charCount: shortVideoScript.length },
    },
    mediaUrl,
    linkUrl: fullUrl,
    ctaLabel: sourceType === 'article' ? 'Lire l’article' : 'En savoir plus',
    targetAudience: 'Artistes, porteurs de projets culturels, mélomanes',
    decisionHistory: [creationLog],
    notes: 'Brouillon généré. Accroches alternatives prêtes à tester. Validation requise avant programmation.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return postDraft
}

const SEED_DATE = '2026-10-23T09:00:00Z'

/**
 * Calendrier initial vérifié (Mode Master) — 10 publications équilibrées
 * 70 % Découverte · 20 % Autorité · 10 % Conversion
 */
export const INITIAL_PUBLICATIONS: SocialPost[] = [
  // ---------------------------------------------------------------
  // 1. AUTORITÉ (20 %) — Article publié n°11 (slug vérifié : musicien-marque-recit)
  // ---------------------------------------------------------------
  {
    id: 'pub-01-recit-marque',
    title: 'Article · Le musicien et sa marque : pourquoi le récit précède le logo',
    pillar: 'autorite',
    series: 'Le Journal du Musicien Augmenté™',
    sourceType: 'article',
    sourceSlug: 'musicien-marque-recit',
    sourceTitle: 'Le musicien et sa marque : pourquoi le récit précède le logo',
    scheduledDate: '2026-10-26',
    scheduledTime: '08:30',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp', 'instagram'],
    hookVariants: [
      "Un logo n'a jamais convaincu un programmateur de programmer un artiste.",
      "Pourquoi 90 % des artistes commencent par le graphisme au lieu du récit ?",
      "Avant l'identité visuelle, il y a la proposition de valeur artistique.",
    ],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: siteUrl('/journal/musicien-marque-recit'),
    ctaLabel: 'Lire l’article',
    targetAudience: 'Artistes indépendants, musiciens de scène, porteurs de projets culturels',
    contentByPlatform: {
      linkedin: {
        text: `Un logo n'est qu'un marqueur de reconnaissance visuelle. Il n'a jamais convaincu un programmateur d'engager un artiste.

Avant l'identité visuelle, les shootings et les logos, il y a une proposition de valeur artistique.

Dans mon nouvel article, j'aborde :
• l'illusion du graphisme : le logo n'est pas la marque ;
• l'extraction du récit de trajectoire ;
• la méthode des biographies gigognes : 20, 50, 90 et 150 mots ;
• l'IA comme scribe discipliné, jamais comme auteur de votre voix.

👉 ${siteUrl('/journal/musicien-marque-recit')}

Par quoi avez-vous commencé : le logo ou le récit ?`,
        hashtags: ['#MarqueArtistique', '#Storytelling', '#HerveNanfang'],
      },
      facebook: {
        text: `Avant de dessiner un logo, savez-vous quelle histoire vous racontez ?

Un logo sert à identifier ce qui existe déjà. Si le propos artistique est flou, le plus beau design ne fera qu'emballer du vide avec élégance.

L'article complet :
🔗 ${siteUrl('/journal/musicien-marque-recit')}`,
        hashtags: ['#HerveNanfang', '#Musique'],
      },
      whatsapp: {
        text: `*Hervé Nanfang | Stratégie de marque artistique*

*Le musicien et sa marque : pourquoi le récit précède le logo*

Un logo, à lui seul, ne crée pas la fidélité. C'est la cohérence entre votre histoire, votre identité artistique et ce que vous apportez à votre public qui donne du sens à votre marque.

Découvrez l'article complet :
👉 ${siteUrl('/journal/musicien-marque-recit')}

Vous êtes artiste, entrepreneur culturel ou responsable d'une institution ?
Vous souhaitez clarifier votre positionnement, renforcer votre présence en ligne ou structurer votre récit de marque ?

Répondez directement à ce message pour échanger sur vos besoins.`,
        hashtags: [],
      },
      instagram: {
        text: `Le logo n'est pas la marque.

Avant l'image, il y a une proposition de valeur artistique et un récit de trajectoire.

Article complet : lien dans la bio.`,
        hashtags: ['#HerveNanfang', '#MarqueArtistique', '#Storytelling'],
      },
    },
    decisionHistory: [
      {
        id: 'log-01',
        action: 'creation',
        timestamp: SEED_DATE,
        author: 'Système Master',
        reason: 'Article source vérifié dans src/data/articles.ts',
      },
    ],
    notes: 'Source vérifiée : src/data/articles.ts (slug musicien-marque-recit). URL canonique testée.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 2. CONVERSION (10 %) — Offre conseil (src/data/services.ts)
  // ---------------------------------------------------------------
  {
    id: 'pub-02-offre-diagnostic',
    title: 'Offre · Conseil & stratégie de marque culturelle',
    pillar: 'conversion',
    series: 'Conseil en Stratégie de Marque Culturelle',
    sourceType: 'service',
    sourceSlug: 'strategie-digitale',
    sourceTitle: 'Conseil & Stratégie de marque culturelle',
    scheduledDate: '2026-10-28',
    scheduledTime: '11:00',
    status: 'a_valider',
    platforms: ['linkedin', 'whatsapp', 'facebook'],
    hookVariants: [
      'Comment aligner votre stature artistique réelle et votre présence digitale ?',
      'Trois formules d’accompagnement en stratégie de marque culturelle :',
    ],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: siteUrl('/services#strategie-digitale'),
    ctaLabel: 'Demander un accompagnement',
    targetAudience: 'Artistes, entrepreneurs culturels, institutions',
    contentByPlatform: {
      linkedin: {
        text: `Trois formules d'accompagnement en stratégie de marque culturelle :

• Diagnostic & Positionnement — 1 à 2 semaines
• Récit de Marque & Dossier d'Autorité — 2 à 3 semaines
• Accompagnement de Structure — mission mensuelle ou projet

Détails des formules :
👉 ${siteUrl('/services#strategie-digitale')}

Demande d'accompagnement :
👉 ${siteUrl('/contact#conseil')}`,
        hashtags: ['#StrategieDeMarque', '#HerveNanfang'],
      },
      whatsapp: {
        text: `*Hervé Nanfang | Conseil en stratégie de marque culturelle*

Trois formules :
• Diagnostic & Positionnement (1 à 2 semaines)
• Récit de Marque & Dossier d'Autorité (2 à 3 semaines)
• Accompagnement de Structure (mensuel ou projet)

👉 ${siteUrl('/services#strategie-digitale')}

Répondez à ce message pour échanger sur votre projet.`,
        hashtags: [],
      },
      facebook: {
        text: `Artistes, entrepreneurs culturels, institutions : clarifiez votre positionnement et structurez votre récit de marque.

Les formules d'accompagnement :
🔗 ${siteUrl('/services#strategie-digitale')}`,
        hashtags: ['#HerveNanfang'],
      },
    },
    decisionHistory: [
      { id: 'log-02', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Formules de src/data/services.ts' },
    ],
    notes: 'Offre vérifiée dans src/data/services.ts. Contact dirigé vers /contact#conseil.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 3. DÉCOUVERTE (70 %) — Performance filmée courte (piano-bar)
  // ---------------------------------------------------------------
  {
    id: 'pub-03-live-piano-reel',
    title: 'Vidéo courte · Défi piano : Réharmoniser un thème afropop en direct',
    pillar: 'decouverte',
    series: 'Défis Claviers & Comparaisons de styles',
    sourceType: 'musique',
    sourceSlug: 'pianobariste',
    sourceTitle: 'Performance piano filmée',
    isOriginalCreation: true,
    scheduledDate: '2026-10-30',
    scheduledTime: '17:30',
    status: 'brouillon',
    platforms: ['youtube', 'tiktok', 'instagram', 'facebook'],
    hookVariants: [
      'Ce qui se passe quand on applique l’harmonie jazz à un classique afropop :',
      '3 accords pour changer complètement l’ambiance d’un thème :',
      'Défi clavier : improviser sur une grille en 30 secondes chrono.',
    ],
    mediaUrl: '/images/hero-duo-live.webp',
    linkUrl: siteUrl('/musique#pianobariste'),
    ctaLabel: 'Écouter le répertoire',
    targetAudience: 'Mélomanes, musiciens, nouveaux publics curieux',
    contentByPlatform: {
      youtube: {
        text: `Ce qui se passe quand on applique l’harmonie jazz à un classique afropop au piano solo. 🎹✨

Accroche (0–3s) : phrase d’accord inattendue
Progression (3–25s) : substitution tritonique en direct
Résolution (25–45s) : retour sur le thème original
Fin (45–60s) : Le Pianobariste™ → ${siteUrl('/musique#pianobariste')}`,
        hashtags: ['#Shorts', '#Piano', '#Afropop', '#HerveNanfang'],
      },
      tiktok: {
        text: `Réharmonisation express au piano. Vous préférez la version originale ou réharmonisée ? Dis-le en commentaire ! 🎹`,
        hashtags: ['#PianoTok', '#Musicien', '#Harmonie', '#HerveNanfang'],
      },
      instagram: {
        text: `L'art du piano-bar : écouter la pièce et faire respirer le thème. 🎹

Répertoire live et piano solo disponible à Yaoundé et en tournée.
Lien dans la bio.`,
        hashtags: ['#Pianobariste', '#PianoSolo', '#LiveMusic', '#HerveNanfang'],
      },
      facebook: {
        text: `Un moment au piano : réharmonisation d'un classique au toucher feutré.

Découvrez l'univers live du Pianobariste™ :
🔗 ${siteUrl('/musique#pianobariste')}`,
        hashtags: ['#PianoBar', '#HerveNanfang', '#MusiqueVivante'],
      },
    },
    decisionHistory: [
      { id: 'log-03', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Format découverte court 70%' },
    ],
    notes: 'Création originale à tourner. Approbation requise sur le fichier vidéo final.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 4. AUTORITÉ (20 %) — Article publié n°01 (apres-la-mao-lia)
  // ---------------------------------------------------------------
  {
    id: 'pub-04-ia-musique-article',
    title: 'Article · Après la MAO, l’IA : comment évoluer sans perdre son identité',
    pillar: 'autorite',
    series: 'Le Journal du Musicien Augmenté™',
    sourceType: 'article',
    sourceSlug: 'apres-la-mao-lia',
    sourceTitle: 'Après la MAO, l’IA : comment les musiciens peuvent évoluer sans perdre leur identité',
    scheduledDate: '2026-11-02',
    scheduledTime: '08:45',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp'],
    hookVariants: [
      "La MAO n'a pas supprimé le musicien. L'IA ne le supprimera pas non plus.",
      "Pourquoi l'oreille musicale reste le seul garde-fou face à l'IA générative ?",
      "Comment collaborer avec les algorithmes sans leur abandonner sa voix ?",
    ],
    mediaUrl: '/images/02-eleves-musique.jpg',
    linkUrl: siteUrl('/journal/apres-la-mao-lia'),
    ctaLabel: 'Lire l’article',
    targetAudience: 'Musiciens professionnels, enseignants, étudiants avancés',
    contentByPlatform: {
      linkedin: {
        text: `La MAO n'a pas supprimé le musicien. Elle a transformé ce qu'il devait savoir faire.

L'IA ouvre une nouvelle étape : apprendre à collaborer avec la machine sans lui abandonner son jugement, sa culture et sa voix.

Au programme :
• la MAO comme précédent historique ;
• l'IA et le déplacement de la décision ;
• l'identité artistique comme boussole.

👉 ${siteUrl('/journal/apres-la-mao-lia')}`,
        hashtags: ['#MusiqueEtIA', '#MAO', '#HerveNanfang'],
      },
      facebook: {
        text: `La MAO n'a pas supprimé le musicien. L'IA ne le supprimera pas non plus — à condition qu'il garde son jugement, sa culture et sa voix.

🔗 ${siteUrl('/journal/apres-la-mao-lia')}`,
        hashtags: ['#HerveNanfang', '#IA'],
      },
      whatsapp: {
        text: `*Après la MAO, l'IA : comment les musiciens peuvent évoluer sans perdre leur identité*

👉 ${siteUrl('/journal/apres-la-mao-lia')}`,
        hashtags: [],
      },
    },
    decisionHistory: [
      { id: 'log-04', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Source vérifiée : slug apres-la-mao-lia' },
    ],
    notes: 'Source : src/data/articles.ts (slug apres-la-mao-lia).',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 5. CONVERSION (10 %) — Conférence catalogue
  // ---------------------------------------------------------------
  {
    id: 'pub-05-masterclass-ia',
    title: 'Conférence · Le musicien augmenté : créer à l’ère des modèles génératifs',
    pillar: 'conversion',
    series: 'Masterclasses, Formations & Conférences Pro',
    sourceType: 'masterclass',
    sourceSlug: 'conferences',
    sourceTitle: 'Le musicien augmenté : créer à l’ère des modèles génératifs',
    scheduledDate: '2026-11-05',
    scheduledTime: '10:00',
    status: 'a_valider',
    platforms: ['linkedin', 'whatsapp'],
    hookVariants: [
      "Comment préparer vos étudiants et enseignants à l'arrivée massive de l'IA musicale ?",
      "Conférence plénière & masterclass : Le musicien augmenté à l'ère générative.",
    ],
    mediaUrl: '/images/02-eleves-musique.jpg',
    linkUrl: siteUrl('/conferences'),
    ctaLabel: 'Demander une conférence',
    targetAudience: 'Écoles de musique, universités, centres culturels, festivals',
    contentByPlatform: {
      linkedin: {
        text: `Conférence : « Le musicien augmenté : créer à l'ère des modèles génératifs ».

Formats disponibles :
• Conférence plénière — 45 à 60 min
• Masterclass interactive — 2 à 3 h
• Atelier / journée d'étude — demi-journée à journée complète

Catalogue des interventions :
👉 ${siteUrl('/conferences')}

Demande d'intervention :
👉 ${siteUrl('/contact#conference')}`,
        hashtags: ['#Conference', '#MusiqueEtIA', '#HerveNanfang'],
      },
      whatsapp: {
        text: `*Conférence | Le musicien augmenté : créer à l'ère des modèles génératifs*

Plénière (45–60 min), masterclass (2–3 h) ou atelier.

👉 ${siteUrl('/conferences')}

Répondez à ce message pour étudier une date.`,
        hashtags: [],
      },
    },
    decisionHistory: [
      { id: 'log-05', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Catalogue conférences vérifié' },
    ],
    notes: 'Sources : src/data/conferences.ts et src/data/services.ts.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 6. DÉCOUVERTE (70 %) — Démonstration sonore MAO
  // ---------------------------------------------------------------
  {
    id: 'pub-06-demo-sound-design',
    title: 'Vidéo courte · MAO : Transformer un rythme traditionnel en boucle moderne',
    pillar: 'decouverte',
    series: 'Démonstrations MAO & Sound Design',
    sourceType: 'musique',
    sourceSlug: 'production',
    sourceTitle: 'Démonstration MAO & Production',
    isOriginalCreation: true,
    scheduledDate: '2026-11-07',
    scheduledTime: '18:00',
    status: 'brouillon',
    platforms: ['youtube', 'tiktok', 'instagram'],
    hookVariants: [
      'Du balafon traditionnel au synthé modulaire : la transformation sonore en 45 secondes.',
      'Comment sampler un motif ancestral sans lui faire perdre son âme ?',
    ],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: siteUrl('/ia-technologie'),
    ctaLabel: 'Découvrir la démarche',
    targetAudience: 'Beatmakers, producteurs, curieux de MAO et d’innovations sonores',
    contentByPlatform: {
      youtube: {
        text: `Du motif polyrythmique ancestral à la boucle de production moderne. 🎛️

Démonstration de sound design et de production hybride.
En savoir plus sur la démarche Musicien Augmenté™ : ${siteUrl('/ia-technologie')}`,
        hashtags: ['#Shorts', '#MAO', '#MusicProduction', '#SoundDesign'],
      },
      tiktok: {
        text: `Comment sampler une polyrythmie africaine proprement sur DAW. Tu aurais fait quoi différemment ? 🎛️`,
        hashtags: ['#ProducerTok', '#MAO', '#Beatmaking', '#HerveNanfang'],
      },
      instagram: {
        text: `La technologie au service de la racine, jamais l'inverse. 🎛️✨

Production & arrangements : ${siteUrl('/services#production')}`,
        hashtags: ['#MAO', '#StudioLife', '#HerveNanfang'],
      },
    },
    decisionHistory: [
      { id: 'log-06', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Format découverte MAO 70%' },
    ],
    notes: 'Vidéo courte de démonstration technique à enregistrer.',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 7. AUTORITÉ (20 %) — Article publié n°07 (musiciens-africains-et-ia)
  // ---------------------------------------------------------------
  {
    id: 'pub-07-rma-ia-afrique',
    title: 'Article · Pourquoi les musiciens africains doivent comprendre l’IA',
    pillar: 'autorite',
    series: 'IA, Algorithmes & Souveraineté Africaine',
    sourceType: 'article',
    sourceSlug: 'musiciens-africains-et-ia',
    sourceTitle: 'Pourquoi les musiciens africains doivent comprendre l’intelligence artificielle',
    scheduledDate: '2026-11-09',
    scheduledTime: '08:30',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp'],
    hookVariants: [
      'Qui entraîne les modèles d’IA musicale, et avec quelles musiques ?',
      'Pourquoi nos patrimoines musicaux risquent d’être absents des futures technologies ?',
    ],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: siteUrl('/journal/musiciens-africains-et-ia'),
    ctaLabel: 'Lire l’article',
    targetAudience: 'Institutions culturelles africaines, artistes, chercheurs',
    contentByPlatform: {
      linkedin: {
        text: `Les grands modèles d'IA musicale sont entraînés sur d'immenses corpus sonores. Ces corpus reflètent une asymétrie : les répertoires d'Afrique subsaharienne y sont largement sous-représentés.

Au programme :
• qui entraîne les modèles, avec quelles musiques ?
• représentation, biais et patrimoine absent ;
• opportunité : documenter, publier, protéger.

👉 ${siteUrl('/journal/musiciens-africains-et-ia')}`,
        hashtags: ['#MusiqueAfricaine', '#MusiqueEtIA', '#HerveNanfang'],
      },
      facebook: {
        text: `Qui entraîne les intelligences artificielles musicales, et avec quelles musiques ? Une question essentielle pour les musiciens africains.

🔗 ${siteUrl('/journal/musiciens-africains-et-ia')}`,
        hashtags: ['#HerveNanfang', '#Afrique'],
      },
      whatsapp: {
        text: `*Pourquoi les musiciens africains doivent comprendre l'intelligence artificielle*

👉 ${siteUrl('/journal/musiciens-africains-et-ia')}

À partager dans vos réseaux culturels.`,
        hashtags: [],
      },
    },
    decisionHistory: [
      { id: 'log-07', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Source vérifiée : slug musiciens-africains-et-ia' },
    ],
    notes: 'Source : src/data/articles.ts (slug musiciens-africains-et-ia).',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 8. AUTORITÉ (20 %) — Article publié n°10 (methode-permis-de-jouer-pedagogie-musicale)
  // ---------------------------------------------------------------
  {
    id: 'pub-08-permis-de-jouer',
    title: 'Article · La méthode Permis de Jouer™ : réinventer l’apprentissage',
    pillar: 'autorite',
    series: 'Pédagogie & Méthode Permis de Jouer™',
    sourceType: 'article',
    sourceSlug: 'methode-permis-de-jouer-pedagogie-musicale',
    sourceTitle: 'La méthode Permis de Jouer™ : réinventer l’apprentissage musical',
    scheduledDate: '2026-11-12',
    scheduledTime: '11:30',
    status: 'a_valider',
    platforms: ['facebook', 'whatsapp', 'instagram'],
    hookVariants: [
      'Pourquoi tant d’élèves abandonnent-ils le piano après deux ans de solfège déconnecté ?',
      'La pulsation corporelle avant l’abstraction graphique : les fondements du Permis de Jouer™.',
    ],
    mediaUrl: '/images/02-eleves-musique.jpg',
    linkUrl: siteUrl('/journal/methode-permis-de-jouer-pedagogie-musicale'),
    ctaLabel: 'Lire l’article',
    targetAudience: 'Parents, enseignants, musiciens autodidactes',
    contentByPlatform: {
      facebook: {
        text: `Pourquoi tant d'élèves abandonnent-ils le piano après deux ans de solfège déconnecté ?

Les fondements du Permis de Jouer™ : pulsation corporelle, compétences réelles et paliers N1 à N4.

🔗 ${siteUrl('/journal/methode-permis-de-jouer-pedagogie-musicale')}`,
        hashtags: ['#PermisDeJouer', '#HerveNanfang'],
      },
      whatsapp: {
        text: `*La méthode Permis de Jouer™ : réinventer l'apprentissage musical*

Pulsation corporelle, compétences réelles et paliers N1 à N4.

👉 ${siteUrl('/journal/methode-permis-de-jouer-pedagogie-musicale')}

Inscriptions & ateliers : ${SITE.phones[0]?.display ?? ''}`,
        hashtags: [],
      },
      instagram: {
        text: `La pulsation avant l'abstraction.

Permis de Jouer™ : des paliers N1 à N4 pour rendre le progrès mesurable.

Article complet : lien dans la bio.`,
        hashtags: ['#PermisDeJouer', '#Piano', '#HerveNanfang'],
      },
    },
    decisionHistory: [
      { id: 'log-08', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Source vérifiée : slug methode-permis-de-jouer-pedagogie-musicale' },
    ],
    notes: 'Source : src/data/articles.ts (slug methode-permis-de-jouer-pedagogie-musicale).',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 9. CONVERSION (10 %) — Offre live Le Pianobariste™
  // ---------------------------------------------------------------
  {
    id: 'pub-09-pianobariste-presence',
    title: 'Offre · Le Pianobariste™ : piano live pour lieux de prestige',
    pillar: 'conversion',
    series: 'Prestations Événements de Prestige',
    sourceType: 'service',
    sourceSlug: 'pianobariste',
    sourceTitle: 'Le Pianobariste™',
    scheduledDate: '2026-11-16',
    scheduledTime: '09:00',
    status: 'a_valider',
    platforms: ['linkedin', 'facebook', 'whatsapp'],
    hookVariants: [
      'Plus de 440 titres au répertoire : l’expérience piano live pour vos salons et événements.',
      'Pourquoi le son vivant transforme durablement l’atmosphère d’un lieu d’exception.',
    ],
    mediaUrl: '/images/hero-duo-live.webp',
    linkUrl: siteUrl('/services#pianobariste'),
    ctaLabel: 'Demander un devis live',
    targetAudience: 'Hôtels, lounges, organisateurs d’événements privés',
    contentByPlatform: {
      linkedin: {
        text: `Le Pianobariste™ : piano live pour hôtels, lounges et événements privés.

Plus de 440 titres — jazz, blues, bossa nova, variété francophone, afropop et standards internationaux. Depuis 2007 à Yaoundé et au Cameroun.

👉 ${siteUrl('/services#pianobariste')}`,
        hashtags: ['#PianoLive', '#Evenementiel', '#HerveNanfang'],
      },
      facebook: {
        text: `Piano live pour vos réceptions, cocktails et soirées : plus de 440 titres, du jazz à l'afropop.

🔗 ${siteUrl('/services#pianobariste')}`,
        hashtags: ['#HerveNanfang', '#PianoBar'],
      },
      whatsapp: {
        text: `*Le Pianobariste™ | Piano live*

Plus de 440 titres : jazz, blues, bossa nova, variété francophone, afropop, standards.

👉 ${siteUrl('/services#pianobariste')}

Répondez à ce message pour un devis.`,
        hashtags: [],
      },
    },
    decisionHistory: [
      { id: 'log-09', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Source vérifiée : id pianobariste' },
    ],
    notes: 'Faits repris de src/data/services.ts (id pianobariste).',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },

  // ---------------------------------------------------------------
  // 10. CONVERSION (10 %) — Booking fin d'année
  // ---------------------------------------------------------------
  {
    id: 'pub-10-booking-fin-annee',
    title: 'Booking · Réceptions et soirées de gala de fin d’année',
    pillar: 'conversion',
    series: 'Prestations Événements de Prestige',
    sourceType: 'service',
    sourceSlug: 'pianobariste',
    sourceTitle: 'Le Pianobariste™ — formules de fin d’année',
    scheduledDate: '2026-11-19',
    scheduledTime: '11:00',
    status: 'a_valider',
    platforms: ['whatsapp', 'facebook'],
    hookVariants: [
      'Clôtures annuelles, dîners d’entreprises et réceptions : les réservations sont ouvertes.',
      'Session Lounge, Soirée Prestige ou Programme Live Band pour vos célébrations.',
    ],
    mediaUrl: '/images/shooting-pro-officiel.webp',
    linkUrl: siteUrl('/contact#booking'),
    ctaLabel: 'Réserver une date',
    targetAudience: 'Entreprises, institutions, organisateurs de réceptions privées',
    contentByPlatform: {
      whatsapp: {
        text: `*Hervé Nanfang | Réservations de fin d'année*

Formules :
🎹 Session Lounge — 2 h
🎹 Soirée Prestige — 3 à 4 h
🎶 Programme Live Band — set de 45 à 90 min

Demande de date :
👉 ${siteUrl('/contact#booking')}

Téléphone : ${SITE.phones[0]?.display ?? ''}`,
        hashtags: [],
      },
      facebook: {
        text: `Les réservations pour les réceptions de fin d'année sont ouvertes : Session Lounge, Soirée Prestige ou Programme Live Band.

🔗 ${siteUrl('/contact#booking')}`,
        hashtags: ['#HerveNanfang', '#PianoLive'],
      },
    },
    decisionHistory: [
      { id: 'log-10', action: 'creation', timestamp: SEED_DATE, author: 'Système Master', reason: 'Formules officielles vérifiées' },
    ],
    notes: 'Formules et durées : src/data/services.ts (id pianobariste).',
    createdAt: SEED_DATE,
    updatedAt: SEED_DATE,
  },
]

/**
 * Générateur de fichier iCalendar (.ics) RFC 5545
 */
export function exportPublicationsToIcs(posts: SocialPost[]): string {
  const pad = (n: number) => String(n).padStart(2, '0')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Herve Nanfang//NANHE Growth System//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:HN Marque - Calendrier de Publication',
    'X-WR-TIMEZONE:Africa/Douala',
  ]

  for (const post of posts) {
    if (post.status === 'archive' || post.status === 'refuse') continue

    const [year, month, day] = post.scheduledDate.split('-').map(Number)
    const [hours, minutes] = (post.scheduledTime || '09:00').split(':').map(Number)

    if (!year || !month || !day) continue

    const dtStart = `${year}${pad(month)}${pad(day)}T${pad(hours || 9)}${pad(minutes || 0)}00`
    const endHour = (hours || 9) + 1
    const dtEnd = `${year}${pad(month)}${pad(day)}T${pad(endHour)}${pad(minutes || 0)}00`

    const platformCopy =
      post.contentByPlatform.linkedin?.text ||
      post.contentByPlatform.facebook?.text ||
      post.contentByPlatform.whatsapp?.text ||
      post.contentByPlatform.youtube?.text ||
      ''

    const escapedDesc = (
      `Statut: ${post.status.toUpperCase()}\\n` +
      `Pilier: ${(post.pillar || 'autorite').toUpperCase()}\\n` +
      `Série: ${post.series || 'Générale'}\\n` +
      `Plateformes: ${post.platforms.join(', ')}\\n` +
      `Lien: ${post.linkUrl || SITE.url}\\n\\n` +
      `--- CONTENU À DIFFUSER ---\\n` +
      platformCopy.replace(/\n/g, '\\n').replace(/,/g, '\\,')
    ).slice(0, 1500)

    const summary = `[${post.status === 'valide' ? 'APPROUVÉ' : post.status === 'publie' ? 'PUBLIÉ' : post.status === 'programme' ? 'PROGRAMMÉ' : 'À VALIDER'}] ${post.title.replace(/,/g, '\\,')}`

    lines.push(
      'BEGIN:VEVENT',
      `UID:${post.id}@hervenanfang.vercel.app`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').slice(0, 15)}Z`,
      `DTSTART:${dtStart}`,
      `DTEND:${dtEnd}`,
      `SUMMARY:${summary}`,
      `DESCRIPTION:${escapedDesc}`,
      `URL:${post.linkUrl || SITE.url}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      `DESCRIPTION:Rappel NANHÉ : ${post.title.replace(/,/g, '\\,')}`,
      'END:VALARM',
      'END:VEVENT',
    )
  }

  lines.push('END:VCALENDAR')
  return lines.join('\r\n')
}
