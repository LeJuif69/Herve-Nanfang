import { sha256 } from './sha256'

export type ContentStatus = 'Publié' | 'En cours' | 'Planifié' | 'Brouillon' | 'Archivé'

export interface ArticleBodySection {
  heading: string
  paragraphs: string[]
}

/**
 * Cadrage d'usage d'une image — stocké AU NIVEAU DU CONTENU, jamais
 * en détruisant le fichier original (MEDIA).
 * positionX/positionY : 0-100 → object-position CSS.
 * zoom : 1-3 → transform scale pour resserrer sans recréer de fichier.
 * focalX/focalY : point cliqué (visage/sujet), recopie auto vers position.
 */
export interface ImageUsage {
  url: string
  positionX?: number
  positionY?: number
  zoom?: number
  focalX?: number
  focalY?: number
  preset?: string
  alt?: string
}

export function imagePositionCss(usage: Pick<ImageUsage, 'positionX' | 'positionY'> | undefined, fallback = '50% 50%'): string {
  if (!usage) return fallback
  const x = typeof usage.positionX === 'number' ? Math.min(100, Math.max(0, usage.positionX)) : 50
  const y = typeof usage.positionY === 'number' ? Math.min(100, Math.max(0, usage.positionY)) : 50
  return `${x}% ${y}%`
}

export const IMAGE_PRESETS = [
  { id: 'original', label: 'Original', aspect: 'aspect-[4/3]' },
  { id: 'carre', label: 'Carré 1:1', aspect: 'aspect-square' },
  { id: 'portrait', label: 'Portrait 4:5', aspect: 'aspect-[4/5]' },
  { id: 'paysage', label: 'Paysage 4:3', aspect: 'aspect-[4/3]' },
  { id: 'large', label: 'Paysage 16:9', aspect: 'aspect-video' },
  { id: 'banniere', label: 'Bannière', aspect: 'aspect-[21/9]' },
  { id: 'hero', label: 'Hero', aspect: 'aspect-[21/9]' },
] as const

export interface AdminArticle {
  id: string
  slug: string
  num: string
  category: string
  title: string
  excerpt: string
  readingTime: string
  status: ContentStatus
  audience: string
  outline: string[]
  body?: ArticleBodySection[]
  keywords: string[]
  coverImage?: string
  coverPositionX?: number
  coverPositionY?: number
  coverZoom?: number
  coverFocalX?: number
  coverFocalY?: number
  coverPreset?: string
  coverAlt?: string
  linkedConcept: { label: string; to: string }
  seoTitle: string
  seoDescription: string
  publishedAt?: string
  updatedAt: string
}

export interface AdminProject {
  id: string
  slug: string
  family: string
  familyLabel: string
  title: string
  volume: string
  description: string
  points: string[]
  to?: string
  status: 'Actif' | 'En développement' | 'Signature' | 'Archivé'
  mark?: '®' | '™' | ''
  position: number
  coverImage?: string
  coverPositionX?: number
  coverPositionY?: number
  coverZoom?: number
  coverFocalX?: number
  coverFocalY?: number
  coverPreset?: string
  coverAlt?: string
  externalUrl?: string
  updatedAt: string
}

export interface AdminService {
  id: string
  title: string
  text: string
  tags: string[]
  to: string
  status: 'Actif' | 'Brouillon'
  position: number
  coverImage?: string
  coverPositionX?: number
  coverPositionY?: number
  coverZoom?: number
  coverFocalX?: number
  coverFocalY?: number
  coverPreset?: string
  coverAlt?: string
  updatedAt: string
}

export interface AdminTalk {
  id: string
  theme: string
  title: string
  pitch: string
  audience: string
  formats: string[]
  status: ContentStatus
  coverImage?: string
  coverPositionX?: number
  coverPositionY?: number
  coverZoom?: number
  coverFocalX?: number
  coverFocalY?: number
  coverPreset?: string
  coverAlt?: string
  updatedAt: string
}

export interface AdminTrack {
  id: string
  title: string
  artist: string
  album?: string
  category: string
  duration?: string
  audioUrl?: string
  coverImage?: string
  coverPositionX?: number
  coverPositionY?: number
  coverZoom?: number
  coverFocalX?: number
  coverFocalY?: number
  coverPreset?: string
  coverAlt?: string
  streaming?: Record<string, string>
  status: 'Actif' | 'Brouillon'
  updatedAt: string
}

export interface AdminMedia {
  id: string
  bucket: string
  path: string
  url: string
  filename: string
  altText: string
  caption?: string
  title?: string
  description?: string
  credit?: string
  tags: string[]
  mimeType: string
  sizeBytes: number
  width?: number
  height?: number
  focalX?: number
  focalY?: number
  defaultPositionX?: number
  defaultPositionY?: number
  createdAt: string
}

export interface AdminMessage {
  id: string
  name: string
  email: string
  organization?: string
  phone?: string
  route: 'booking' | 'formation' | 'conference' | 'collaboration' | 'presse' | 'conseil' | string
  eventDate?: string
  place?: string
  body: string
  status: 'nouveau' | 'en_cours' | 'traite' | 'archive'
  internalNotes?: string
  createdAt: string
}

// -------------------------------------------------------------
// CALENDRIER ÉDITORIAL & CROISSANCE ORGANIQUE — MODE MASTER
// -------------------------------------------------------------

export type EditorialPillar = 'decouverte' | 'autorite' | 'communaute' | 'conversion'

export type SocialPlatform =
  | 'linkedin'
  | 'facebook'
  | 'instagram'
  | 'whatsapp'
  | 'youtube'
  | 'tiktok'
  | 'site'

export type PublicationStatus =
  | 'idees'
  | 'brouillon'
  | 'a_valider'
  | 'valide'
  | 'programme'
  | 'publie'
  | 'refuse'
  | 'erreur'
  | 'archive'

export interface PlatformContent {
  text: string
  hashtags: string[]
  charCount?: number
}

export interface DecisionLog {
  id: string
  action:
    | 'creation'
    | 'modification'
    | 'soumission'
    | 'approbation'
    | 'refus'
    | 'programmation'
    | 'publication'
    | 'invalidation'
    | 'erreur'
  timestamp: string
  author: string
  reason?: string
  contentHash?: string
}

export interface ValidationSignature {
  approvedBy: string
  approvedAt: string
  contentHash: string
  isRevoked?: boolean
  revokedAt?: string
  revocationReason?: string
}

export interface PublicationMetrics {
  views?: number
  reach?: number
  /** % de spectateurs ayant choisi de regarder plutôt que de swiper (YouTube Shorts / Reels) */
  viewVsSwipeRatio?: number
  /** Durée moyenne de visionnage en secondes */
  averageViewDurationSec?: number
  /** Pourcentage moyen de la vidéo regardé */
  averagePercentageViewed?: number
  likes?: number
  comments?: number
  shares?: number
  saves?: number
  subscribersGained?: number
  siteClicks?: number
  contactInquiries?: number
  lastUpdated?: string
}

export interface ConnectorStatus {
  provider: 'manuel' | 'webhook' | 'metricool'
  status: 'idle' | 'pending' | 'success' | 'failed'
  externalId?: string
  lastSyncAt?: string
  errorMessage?: string
}

export interface SocialPost {
  id: string
  title: string
  pillar: EditorialPillar
  series?: string
  niche?: string
  format?: 'reel' | 'short' | 'carousel' | 'article' | 'video' | 'story'
  campaign?: string
  sourceType: 'article' | 'service' | 'projet' | 'citation' | 'musique' | 'masterclass' | 'libre'
  sourceSlug?: string
  sourceTitle?: string
  isOriginalCreation?: boolean
  rightsCleared?: boolean
  factChecked?: boolean
  scheduledDate: string // YYYY-MM-DD
  scheduledTime: string // HH:mm
  status: PublicationStatus
  platforms: SocialPlatform[]
  contentByPlatform: Partial<Record<SocialPlatform, PlatformContent>>
  hookVariants?: string[]
  mediaUrl?: string
  linkUrl?: string
  ctaLabel?: string
  targetAudience?: string
  validationSignature?: ValidationSignature
  decisionHistory?: DecisionLog[]
  rejectionReason?: string
  metrics?: PublicationMetrics
  connectorStatus?: ConnectorStatus
  validatedAt?: string
  publishedAt?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

/**
 * Calcule une empreinte d'intégrité SHA-256 déterministe pour le contenu de la publication.
 * Si un élément substantiel (titre, date, heure, plateformes, textes, médias, lien) change,
 * l'empreinte SHA-256 change immédiatement, ce qui invalide l'approbation précédente.
 *
 * NOTE AUDIT : Cette empreinte assure la détection des altérations et la traçabilité.
 * Elle ne constitue pas une signature cryptographique asymétrique à clé privée.
 */
export function computeSocialPostHash(post: Pick<SocialPost, 'title' | 'scheduledDate' | 'scheduledTime' | 'platforms' | 'contentByPlatform' | 'mediaUrl' | 'linkUrl'>): string {
  const norm = {
    title: (post.title || '').trim(),
    date: post.scheduledDate,
    time: post.scheduledTime || '09:00',
    platforms: [...(post.platforms || [])].sort(),
    media: (post.mediaUrl || '').trim(),
    link: (post.linkUrl || '').trim(),
    texts: Object.keys(post.contentByPlatform || {})
      .sort()
      .map((k) => `${k}:${(post.contentByPlatform[k as SocialPlatform]?.text || '').trim()};tags:${(post.contentByPlatform[k as SocialPlatform]?.hashtags || []).join(',')}`),
  }
  const str = JSON.stringify(norm)
  return 'sha256:' + sha256(str)
}

export interface AdminSettings {
  siteName: string
  tagline: string
  city: string
  emailContact: string
  emailRma: string
  phonePrimary: string
  phoneSecondary: string
  referenceDescription: string
  positioningLine: string
  seoTitle: string
  metaDescription: string
  socialLinks: { platform: string; href: string; verified: boolean }[]
  webhookUrl?: string
  webhookSecret?: string
  autoWebhookOnValidation?: boolean
  // Publicité & Pixels
  promoBannerEnabled?: boolean
  promoBannerCampaign?: 'rma' | 'pianobariste' | 'custom'
  promoBannerCustomText?: string
  promoBannerCustomCta?: string
  promoBannerCustomUrl?: string
  metaPixelId?: string
  googleAdsId?: string
  googleAnalyticsId?: string
  updatedAt: string
}

export interface AdminState {
  articles: AdminArticle[]
  projects: AdminProject[]
  services: AdminService[]
  talks: AdminTalk[]
  tracks: AdminTrack[]
  media: AdminMedia[]
  messages: AdminMessage[]
  publications: SocialPost[]
  settings: AdminSettings
  lastSyncAt?: string
}

export interface AuthSession {
  user: {
    id: string
    email: string
    fullName?: string
    role: 'admin'
  }
  mode: 'supabase' | 'local' | 'emergency'
  expiresAt: string
  sessionToken?: string
}

