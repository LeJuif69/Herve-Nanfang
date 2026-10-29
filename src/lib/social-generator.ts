import {
  AdminArticle,
  DecisionLog,
  EditorialPillar,
  PublicationStatus,
  SocialPlatform,
  SocialPost,
} from './admin-types'
import { SITE } from '../data/site'
import { EDITORIAL_CALENDAR_90D } from '../data/editorial-calendar-90d'

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
    label: 'Découverte (40 %)',
    shortLabel: 'Découverte',
    targetPercent: 40,
    description: 'Performances live, piano-bar, répertoire universel, immersion acoustique et extraits percutants',
    badgeClass: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    borderColor: 'border-sky-500',
    bgColor: 'bg-sky-500/10',
    textColor: 'text-sky-400',
  },
  autorite: {
    id: 'autorite',
    label: 'Autorité & Expertise (35 %)',
    shortLabel: 'Autorité',
    targetPercent: 35,
    description: 'Musicologie de terrain, direction musicale, orchestration, son, IA éthique et droit d’auteur',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    borderColor: 'border-purple-500',
    bgColor: 'bg-purple-500/10',
    textColor: 'text-purple-400',
  },
  communaute: {
    id: 'communaute',
    label: 'Communauté & Coulisses (15 %)',
    shortLabel: 'Communauté',
    targetPercent: 15,
    description: 'Duo avec Flavie, transmission RMA, préparation scénique et réflexions de trajectoire',
    badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
  },
  conversion: {
    id: 'conversion',
    label: 'Conversion (10 %)',
    shortLabel: 'Conversion',
    targetPercent: 10,
    description: 'Prestations de piano-bar prestige, admissions RMA, conférences d’entreprise et conseil Hervé Nanfang',
    badgeClass: 'bg-gold/20 text-gold border-gold/40',
    borderColor: 'border-gold',
    bgColor: 'bg-gold/10',
    textColor: 'text-gold',
  },
}

/**
 * Séries éditoriales récurrentes pour structurer les formats (couvrant les 12 niches)
 */
export const EDITORIAL_SERIES: { id: string; label: string; pillar: EditorialPillar }[] = [
  { id: 'pianobariste-live', label: 'Le Pianobariste™ Live (Piano solo & lounge)', pillar: 'decouverte' },
  { id: 'duo-flavie-live', label: 'Duo Live & Harmonies (Hervé & Flavie)', pillar: 'communaute' },
  { id: 'pedagogie-permis-jouer', label: 'Pédagogie & Méthode Permis de Jouer™', pillar: 'autorite' },
  { id: 'musicologie-patrimoine', label: 'Musicologie & Polyrythmies Africaines', pillar: 'autorite' },
  { id: 'direction-musicale', label: 'Direction Musicale & Conduite d’Ensemble', pillar: 'autorite' },
  { id: 'orchestration-harmonie', label: 'Orchestration & Écriture Vocale/Instrumentale', pillar: 'autorite' },
  { id: 'ingenierie-acoustique', label: 'Ingénierie du Son & Traitement Acoustique', pillar: 'autorite' },
  { id: 'musique-image', label: 'Musique à l’Image & Narration Audiovisuelle', pillar: 'autorite' },
  { id: 'musicien-augmente-ia', label: 'Le Musicien Augmenté™ & Éthique de l’IA', pillar: 'autorite' },
  { id: 'droit-auteur-oapi', label: 'Propriété Intellectuelle, OAPI & Contrats', pillar: 'autorite' },
  { id: 'economie-culturelle', label: 'Entrepreneuriat Culturel & Modèles Africains', pillar: 'autorite' },
  { id: 'rma-academie', label: 'Racines Musicales Academy® (Transmission)', pillar: 'communaute' },
  { id: 'coulisses-trajectoire', label: 'Coulisses de Scène & 19 Ans de Piano-bar', pillar: 'communaute' },
  { id: 'booking-prestige', label: 'Prestations Événements de Prestige (Booking)', pillar: 'conversion' },
  { id: 'conferences-masterclass', label: 'Keynotes & Masterclasses d’Entreprise', pillar: 'conversion' },
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
  newsletter: {
    name: 'Newsletter (Email)',
    color: '#F59E0B',
    bgColor: 'bg-amber-500/15',
    borderColor: 'border-amber-500/40',
    badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    maxChars: 15000,
    iconPath:
      'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z',
  },
  medium: {
    name: 'Medium (Syndication)',
    color: '#00AB6C',
    bgColor: 'bg-[#00AB6C]/15',
    borderColor: 'border-[#00AB6C]/40',
    badgeClass: 'bg-[#00AB6C]/20 text-[#6ee7b7] border-[#00AB6C]/40',
    maxChars: 25000,
    iconPath:
      'M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z',
  },
  press: {
    name: 'Presse & Médias (Tribune)',
    color: '#8B5CF6',
    bgColor: 'bg-purple-500/15',
    borderColor: 'border-purple-500/40',
    badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    maxChars: 10000,
    iconPath:
      'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
  },
}

export * from './campaign-distribution'

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

/**
 * Décale une date YYYY-MM-DD d'un certain nombre de jours de manière sûre
 */
export function addDaysToDateStr(baseDateStr: string, days: number): string {
  try {
    const parts = baseDateStr.split('-').map(Number)
    if (parts.length === 3 && parts[0] && parts[1] && parts[2]) {
      const d = new Date(parts[0], parts[1] - 1, parts[2])
      d.setDate(d.getDate() + days)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    }
  } catch {
    // fallback
  }
  return baseDateStr
}

/**
 * Recyclage automatique de contenu en 5 formats complémentaires (Étape 4 de la croissance) :
 * 1. J+0 : LinkedIn — Analyse de fond, déconstruction d'idées reçues et débat d'autorité
 * 2. J+1 : Facebook — Résumé concret, leçons de terrain et partage communautaire
 * 3. J+2 : Instagram / Threads — Carrousel pédagogique découpé en 5 diapositives prêtes à monter
 * 4. J+3 : TikTok / Shorts / Reels — Script vidéo vertical minuté de 60s (Hook 0-3s, Démo 3-20s, Révélation 20-45s, CTA 45-60s)
 * 5. J+4 : WhatsApp — Note d'atelier intime & relance conversationnelle directe
 */
export function generateArticleRepurposingPack(
  article: AdminArticle,
  startDateStr?: string,
): SocialPost[] {
  const baseDate = startDateStr || new Date().toISOString().slice(0, 10)
  const fullUrl = siteUrl(`/journal/${article.slug}`)
  const outlinePoints = (article.outline && article.outline.length > 0)
    ? article.outline.slice(0, 4)
    : [
        'Le diagnostic : ce qui échoue dans les approches habituelles',
        'La méthode de terrain développée à Yaoundé',
        'Ce qu’il faut mettre en place dès aujourd’hui',
      ]

  const firstSectionHeading = article.body?.[0]?.heading || 'Le constat de départ'
  const firstSectionExcerpt = article.body?.[0]?.paragraphs?.[0] || article.excerpt
  const secondSectionHeading = article.body?.[1]?.heading || 'La démarche concrète'
  const secondSectionExcerpt = article.body?.[1]?.paragraphs?.[0] || ''

  const baseTags = (article.keywords && article.keywords.length > 0)
    ? article.keywords.slice(0, 4).map((k) => `#${k.replace(/[^a-zA-Z0-9À-ÿ]/g, '')}`)
    : ['#Musique', '#Innovation', '#Pedagogie']

  const commonDecisionLog = (formatName: string): DecisionLog => ({
    id: `log-pack-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    action: 'creation',
    timestamp: new Date().toISOString(),
    author: 'Assistant Croissance (Pack Recyclage)',
    reason: `Génération automatique du format ${formatName} depuis l'article « ${article.title} »`,
  })

  // -------------------------------------------------------------
  // FORMAT 1 (J+0) : LINKEDIN — Analyse de fond & Débat d'Autorité
  // -------------------------------------------------------------
  const dateJ0 = addDaysToDateStr(baseDate, 0)
  const utmLinkedIn = `${fullUrl}?utm_source=linkedin&utm_medium=social&utm_campaign=journal-repurpose`
  const linkedinHook = `Pourquoi la majorité des créateurs et institutions contournent-ils encore ce problème fondamental ?`
  const linkedinBody = `${linkedinHook}

Dans mon article approfondi sur ${article.category ? `la ${article.category.toLowerCase()}` : 'le secteur musical'} :
« ${article.title} »

${article.excerpt}

Trois constats émergent de la pratique de terrain :
${outlinePoints.map((pt, i) => `${i + 1}. ${pt}`).join('\n')}

L'expertise ne réside pas dans l'empilement d'outils, mais dans la clarté du geste et la souveraineté du créateur.

👉 Retrouvez l’analyse complète et la méthodologie détaillée sur le Journal :
${utmLinkedIn}

Quelle est votre expérience sur ce point précis ? Partagez vos observations en commentaire.`

  const postLinkedIn: SocialPost = {
    id: `repurpose-${article.slug}-linkedin-${Date.now()}`,
    title: `[Campagne J+0 · LinkedIn] ${article.title}`,
    pillar: 'autorite',
    series: 'Le Journal du Musicien Augmenté™',
    sourceType: 'article',
    sourceSlug: article.slug,
    sourceTitle: article.title,
    scheduledDate: dateJ0,
    scheduledTime: '08:30',
    status: 'a_valider',
    platforms: ['linkedin'],
    hookVariants: [
      linkedinHook,
      `« ${article.title} » — Ce que la réalité du terrain impose de clarifier :`,
      `Pourquoi tant de démarches échouent avant même d'avoir été comprises ?`,
    ],
    contentByPlatform: {
      linkedin: {
        text: linkedinBody,
        hashtags: ['#Musicologie', '#CreationAfricaine', '#HerveNanfang', ...baseTags],
        charCount: linkedinBody.length,
      },
    },
    mediaUrl: article.coverImage || '/images/shooting-pro-officiel.webp',
    linkUrl: utmLinkedIn,
    ctaLabel: 'Lire l’article complet',
    targetAudience: article.audience || 'Professionnels, chercheurs, créateurs et porteurs de projets culturels',
    decisionHistory: [commonDecisionLog('LinkedIn Analyse')],
    notes: 'Format 1/5 du Pack Recyclage. Ciblé réseau professionnel, discussion et autorité de marque.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // -------------------------------------------------------------
  // FORMAT 2 (J+1) : FACEBOOK — Vulgarisation pratique & Communauté
  // -------------------------------------------------------------
  const dateJ1 = addDaysToDateStr(baseDate, 1)
  const utmFacebook = `${fullUrl}?utm_source=facebook&utm_medium=social&utm_campaign=journal-repurpose`
  const fbHook = `🎵 « ${article.title} » : ce qu'il faut en retenir sans jargon.`
  const fbBody = `${fbHook}

${article.excerpt}

Si vous créez, composez ou enseignez la musique, voici 3 leçons directes issues de la pratique à Yaoundé :

✅ 1. ${outlinePoints[0] || 'Clarifier l’intention avant la technologie'}
✅ 2. ${outlinePoints[1] || 'Construire sur des bases solides et vérifiées'}
✅ 3. ${outlinePoints[2] || 'Rester maître de sa voix et de son patrimoine'}

Le guide complet (${article.readingTime || '5 min'} de lecture) est accessible en libre accès :
🔗 ${utmFacebook}

N’hésitez pas à taguer un ami musicien ou arrangeur que ce sujet concerne !`

  const postFacebook: SocialPost = {
    id: `repurpose-${article.slug}-facebook-${Date.now() + 1}`,
    title: `[Campagne J+1 · Facebook] ${article.title}`,
    pillar: 'autorite',
    series: 'Le Journal du Musicien Augmenté™',
    sourceType: 'article',
    sourceSlug: article.slug,
    sourceTitle: article.title,
    scheduledDate: dateJ1,
    scheduledTime: '12:30',
    status: 'a_valider',
    platforms: ['facebook'],
    hookVariants: [
      fbHook,
      `Vous êtes créateur ou passionné ? Ce sujet vous concerne directement :`,
      `Ce que personne ne vous dit clairement sur « ${article.title} »`,
    ],
    contentByPlatform: {
      facebook: {
        text: fbBody,
        hashtags: ['#HerveNanfang', '#MusiqueCameroun', '#Culture', ...baseTags.slice(0, 2)],
        charCount: fbBody.length,
      },
    },
    mediaUrl: article.coverImage || '/images/shooting-pro-officiel.webp',
    linkUrl: utmFacebook,
    ctaLabel: 'Lire l’article',
    targetAudience: 'Mélomanes, élèves, musiciens locaux et diaspora',
    decisionHistory: [commonDecisionLog('Facebook Synthèse')],
    notes: 'Format 2/5 du Pack Recyclage. Style pédagogique direct, favorisant le partage.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // -------------------------------------------------------------
  // FORMAT 3 (J+2) : INSTAGRAM & THREADS — Carrousel Pédagogique 5 Slides
  // -------------------------------------------------------------
  const dateJ2 = addDaysToDateStr(baseDate, 2)
  const utmInstagram = `${fullUrl}?utm_source=instagram&utm_medium=social&utm_campaign=journal-repurpose`
  const carouselBody = `[CARROUSEL PÉDAGOGIQUE 5 SLIDES — À EXPORTER VIA CANVA / FIGMA]

👉 SLIDE 1 (Couverture / Titre Choc) :
« ${article.title} »
Sous-titre : Ce que 20 ans d'expérience musicale et technique m'ont appris.
Visuel : Hervé Nanfang en studio / portrait avec titre contrasté.

👉 SLIDE 2 (Le problème souvent ignoré) :
« ${firstSectionHeading} »
${firstSectionExcerpt ? firstSectionExcerpt.slice(0, 220) + '…' : article.excerpt.slice(0, 220) + '…'}

👉 SLIDE 3 (La réalité du terrain) :
« ${secondSectionHeading} »
${secondSectionExcerpt ? secondSectionExcerpt.slice(0, 220) + '…' : 'Pourquoi les recettes préfabriquées ne résistent pas à la réalité de nos répertoires.'}

👉 SLIDE 4 (Les 3 règles d’or) :
1. ${outlinePoints[0] || 'L’intention artistique précède l’outil'}
2. ${outlinePoints[1] || 'La rigueur d’écoute avant la quantité'}
3. ${outlinePoints[2] || 'La préservation de la souveraineté créative'}

👉 SLIDE 5 (Appel à l'action & Réflexion) :
« Enregistrez ce post pour y revenir plus tard. »
Lien vers l'analyse intégrale dans la bio :
${utmInstagram}

---
Légende Instagram :
Savez-vous vraiment ce qui se joue derrière « ${article.title} » ?
Balayez vers la gauche pour découvrir les 5 clés décortiquées ⏩
Commentez « GUIDE » ou cliquez sur le lien en bio pour lire l'article complet.`

  const postInstagram: SocialPost = {
    id: `repurpose-${article.slug}-carousel-${Date.now() + 2}`,
    title: `[Campagne J+2 · Carrousel 5 Slides] ${article.title}`,
    pillar: 'autorite',
    series: 'Le Journal du Musicien Augmenté™',
    sourceType: 'article',
    sourceSlug: article.slug,
    sourceTitle: article.title,
    scheduledDate: dateJ2,
    scheduledTime: '17:45',
    status: 'a_valider',
    platforms: ['instagram'],
    hookVariants: [
      `Balayez pour comprendre ce qui change tout dans : « ${article.title} »`,
      `5 diapositives pour maîtriser ce que la plupart ignorent :`,
      `Ne faites plus cette erreur avant d’avoir lu ces 5 slides :`,
    ],
    contentByPlatform: {
      instagram: {
        text: carouselBody,
        hashtags: ['#CarrouselPédagogique', '#HerveNanfang', '#MusiqueYaounde', ...baseTags],
        charCount: carouselBody.length,
      },
    },
    mediaUrl: article.coverImage || '/images/shooting-pro-officiel.webp',
    linkUrl: utmInstagram,
    ctaLabel: 'Enregistrer le carrousel',
    targetAudience: 'Créateurs visuels, jeunes artistes, communauté Instagram',
    decisionHistory: [commonDecisionLog('Carrousel Instagram 5 Slides')],
    notes: 'Format 3/5 du Pack Recyclage. Conçu pour maximiser les enregistrements (saves) et le temps passé par diapositive.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // -------------------------------------------------------------
  // FORMAT 4 (J+3) : TIKTOK / SHORTS / REELS — Script Vidéo 60 Secondes
  // -------------------------------------------------------------
  const dateJ3 = addDaysToDateStr(baseDate, 3)
  const utmShorts = `${fullUrl}?utm_source=youtube&utm_medium=social&utm_campaign=journal-repurpose`
  const videoScript = `[SCRIPT VIDÉO VERTICALE 60 SECONDES — FACE CAMÉRA / PIANO / ÉCRAN MAO]

⏱️ 00:00 – 00:03 | L'ACCROCHE (ARRÊT DE SCROLL) :
(Face caméra, regard direct ou main posée sur un clavier éteint)
« Si vous pensez que ${article.title.toLowerCase().slice(0, 40)}… est juste une question technique, vous passez à côté de l'essentiel. Écoutez bien ça. »

⏱️ 00:03 – 00:20 | LA DÉMONSTRATION / LE CONTRASTE :
(Plan serré sur le clavier ou l'ordinateur)
« Regardez la différence entre ce que tout le monde fait machinalement... (jouer ou montrer une courte manipulation)
Et ce qui se passe quand on applique la méthode juste : (jouer ou montrer le résultat sonore propre). »

⏱️ 00:20 – 00:45 | LA RÉVÉLATION CONTRE-INTUITIVE :
« Pourquoi cette différence ? Parce que :
1. ${outlinePoints[0] || 'L’intention doit être tranchée dès la première seconde.'}
2. ${outlinePoints[1] || 'La technique est au service du récit, jamais l’inverse.'}
C’est ce que j’ai résumé dans mon guide complet de cette semaine. »

⏱️ 00:45 – 01:00 | L'APPEL À L'ACTION (CTA) :
« Ne perdez plus des mois sur de fausses pistes. Le lien complet est sur hervenanfang.vercel.app dans le Journal.
Abonnez-vous pour la prochaine démonstration au piano ! »`

  const postVideo: SocialPost = {
    id: `repurpose-${article.slug}-video-${Date.now() + 3}`,
    title: `[Campagne J+3 · Vidéo 60s] ${article.title}`,
    pillar: 'decouverte',
    series: 'Démonstrations MAO & Sound Design',
    sourceType: 'article',
    sourceSlug: article.slug,
    sourceTitle: article.title,
    scheduledDate: dateJ3,
    scheduledTime: '18:15',
    status: 'a_valider',
    platforms: ['tiktok', 'youtube', 'instagram'],
    hookVariants: [
      `Si vous pensez que c'est juste un détail technique, écoutez bien ça.`,
      `Regardez ce qui arrive quand on ignore cette règle fondamentale :`,
      `L'erreur que 9 musiciens sur 10 commettent encore sans le savoir :`,
    ],
    contentByPlatform: {
      tiktok: { text: videoScript, hashtags: ['#MusicTok', '#PianoCameroun', '#HerveNanfang'], charCount: videoScript.length },
      youtube: { text: videoScript, hashtags: ['#Shorts', '#Pedagogie', '#HerveNanfang'], charCount: videoScript.length },
      instagram: { text: videoScript, hashtags: ['#Reels', '#PianoLife', '#HerveNanfang'], charCount: videoScript.length },
    },
    mediaUrl: article.coverImage || '/images/shooting-pro-officiel.webp',
    linkUrl: utmShorts,
    ctaLabel: 'Voir la démonstration',
    targetAudience: 'Utilisateurs de formats courts, apprentis musiciens, curieux',
    decisionHistory: [commonDecisionLog('Vidéo Verticale 60s')],
    notes: 'Format 4/5 du Pack Recyclage. Script minuté 60s pour capturer de la découverte organique (pilier 70%).',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // -------------------------------------------------------------
  // FORMAT 5 (J+4) : WHATSAPP — Statut & Note d'Atelier (Relance Intime)
  // -------------------------------------------------------------
  const dateJ4 = addDaysToDateStr(baseDate, 4)
  const utmWhatsApp = `${fullUrl}?utm_source=whatsapp&utm_medium=social&utm_campaign=journal-repurpose`
  const whatsappBody = `*Hervé Nanfang | Note d'atelier & retour d'expérience*

En publiant cette semaine sur :
« *${article.title}* »
plusieurs confrères et élèves m'ont posé cette question :
_« Par quoi commencer concrètement quand on n'a ni grand studio ni budget publicitaire ? »_

Ma réponse reste la même depuis 20 ans :
1️⃣ Travailler son intention avant de chercher la visibilité.
2️⃣ Construire un contenu solide qui fait référence.
3️⃣ Rester accessible et rigoureux dans ses échanges.

L'analyse intégrale est en ligne sur mon Journal :
👉 ${utmWhatsApp}

Et vous, comment abordez-vous cette question dans vos créations ?
Répondez directement à ce statut pour échanger.`

  const postWhatsApp: SocialPost = {
    id: `repurpose-${article.slug}-whatsapp-${Date.now() + 4}`,
    title: `[Campagne J+4 · WhatsApp Échange] ${article.title}`,
    pillar: 'autorite',
    series: 'Le Journal du Musicien Augmenté™',
    sourceType: 'article',
    sourceSlug: article.slug,
    sourceTitle: article.title,
    scheduledDate: dateJ4,
    scheduledTime: '10:00',
    status: 'a_valider',
    platforms: ['whatsapp'],
    hookVariants: [
      `Une note d'atelier personnelle sur « ${article.title} »`,
      `Ce que plusieurs retours m'ont poussé à clarifier :`,
      `La question que tout le monde pose en privé :`,
    ],
    contentByPlatform: {
      whatsapp: {
        text: whatsappBody,
        hashtags: [],
        charCount: whatsappBody.length,
      },
    },
    mediaUrl: article.coverImage || '/images/shooting-pro-officiel.webp',
    linkUrl: utmWhatsApp,
    ctaLabel: 'Échanger sur WhatsApp',
    targetAudience: 'Contacts directs, élèves RMA, clients réguliers, partenaires de Yaoundé et Douala',
    decisionHistory: [commonDecisionLog('WhatsApp Statut & Broadcast')],
    notes: 'Format 5/5 du Pack Recyclage. Relance conversationnelle intime à J+4 pour déclencher des messages entrants.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  return [postLinkedIn, postFacebook, postInstagram, postVideo, postWhatsApp]
}

/**
 * Calendrier initial vérifié (Master NANHÉ) — 90 jours réels
 * Ratios stratégiques : 40 % Découverte · 35 % Autorité · 15 % Communauté · 10 % Conversion
 * Couvre l'intégralité des 12 piliers et des 6 disciplines expertes
 */
export const INITIAL_PUBLICATIONS: SocialPost[] = EDITORIAL_CALENDAR_90D

export function exportPublicationsToIcs(posts: SocialPost[]): string {
  const pad = (n: number) => String(n).padStart(2, '0')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Herve Nanfang//NANHE Growth System//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Hervé Nanfang - Calendrier de Publication',
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
