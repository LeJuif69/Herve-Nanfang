import { isSupabaseConfigured, supabase } from './supabase'
import { ARTICLES, Article } from '../data/articles'
import { PROJECT_FAMILIES } from '../data/projects'
import { CONFERENCES } from '../data/conferences'
import { MUSIC_SECTIONS } from '../data/music'
import { SITE } from '../data/site'
import { MASTER_IDENTITY } from '../data/identity'
import {
  AdminArticle,
  AdminMedia,
  AdminMessage,
  AdminProject,
  AdminService,
  AdminSettings,
  AdminState,
  AdminTalk,
  AdminTrack,
  ContentStatus,
  SocialPost,
} from './admin-types'
import generatedUploadsMedia from './generated-uploads-media.json'
import { INITIAL_PUBLICATIONS, exportPublicationsToIcs } from './social-generator'
import { computeSocialPostHash, DecisionLog, PublicationMetrics } from './admin-types'

const LOCAL_STORE_KEY = 'hn_admin_store_v4'

const INITIAL_SERVICES: AdminService[] = [
  {
    id: 'srv-1',
    title: 'Prestations live & piano-bar',
    text: 'Concert solo, piano-bar, ambiance de lieu, accueil de soirée et accompagnement de projets culturels. Un cadre musical lisible, adaptable à chaque espace et public.',
    tags: ['Le Pianobariste™', 'Événement privé', 'Lieu hôtelier'],
    to: '/musique#pianobariste',
    status: 'Actif',
    position: 1,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-2',
    title: 'Formation & pédagogie',
    text: 'Curricula, masterclasses, accompagnement d’enseignants, parcours de progression et dispositifs de transmission pour écoles, centres de formation et institutions.',
    tags: ['RMA', 'Permis de Jouer™', 'Pédagogie'],
    to: '/rma',
    status: 'Actif',
    position: 2,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-3',
    title: 'Conférences & conseil',
    text: 'Interventions sur l’IA dans la musique, la transformation numérique, la création et les métiers culturels. Diagnostic, cadrage, accompagnement de structures.',
    tags: ['IA & musique', 'Conseil', 'Conférence'],
    to: '/conferences',
    status: 'Actif',
    position: 3,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-4',
    title: 'Création & collaborations',
    text: 'Projets artistiques, contenus numériques, direction musicale, mise en scène et pilotage de collaborations entre création, patrimoine et technologies.',
    tags: ['Création', 'Collaboration', 'Projet culturel'],
    to: '/projets',
    status: 'Actif',
    position: 4,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'srv-5',
    title: 'Conseil & Stratégie de marque culturelle',
    text: 'Accompagnement d’artistes et d’institutions : diagnostic d’autorité, storytelling de trajectoire, conception de dossiers de presse d’élite et workflows de contenu assistés par IA.',
    tags: ['Stratégie de marque', 'Storytelling', 'Communication digitale'],
    to: '/services#strategie-digitale',
    status: 'Actif',
    position: 5,
    updatedAt: new Date().toISOString(),
  },
]

function getInitialArticles(): AdminArticle[] {
  return ARTICLES.map((a: Article) => ({
    id: `art-${a.slug}`,
    slug: a.slug,
    num: a.num,
    category: a.category,
    title: a.title,
    excerpt: a.excerpt,
    readingTime: a.readingTime,
    status: a.status as ContentStatus,
    audience: a.audience,
    outline: a.outline,
    body: a.body,
    keywords: a.keywords,
    linkedConcept: a.linkedConcept,
    seoTitle: a.seoTitle,
    seoDescription: a.seoDescription,
    coverImage: '/og-image.jpg',
    publishedAt: a.publishedAt,
    updatedAt: a.updatedAt ?? '',
  }))
}

function getInitialProjects(): AdminProject[] {
  const projects: AdminProject[] = []
  let pos = 1
  for (const family of PROJECT_FAMILIES) {
    for (const p of family.projects) {
      const slug = p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      projects.push({
        id: `prj-${slug}`,
        slug,
        family: family.id,
        familyLabel: family.label,
        title: p.title,
        volume: p.volume,
        description: p.description,
        points: p.points,
        to: p.to,
        status: p.status,
        mark: p.mark,
        position: pos++,
        coverImage: '/images/hero-duo-live.webp',
        updatedAt: new Date().toISOString(),
      })
    }
  }
  return projects
}

function getInitialTalks(): AdminTalk[] {
  return CONFERENCES.map((c, i) => ({
    id: `talk-${i + 1}`,
    theme: c.theme,
    title: c.title,
    pitch: c.pitch,
    audience: c.audience,
    formats: c.formats,
    status: 'Publié' as ContentStatus,
    updatedAt: new Date().toISOString(),
  }))
}

function getInitialTracks(): AdminTrack[] {
  return [
    {
      id: 'trk-1',
      title: 'Le Pianobariste Live Session',
      artist: 'Hervé Nanfang',
      category: 'Live Piano-Bar',
      duration: '4:15',
      coverImage: '/hn-initials-mark.png',
      streaming: { youtube: 'https://www.youtube.com/@hervenanfang' },
      status: 'Actif',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'trk-2',
      title: 'Batoufam Heritage Harmonies',
      artist: 'Hervé Nanfang & Ensemble',
      category: 'Culture & Recherche',
      duration: '5:32',
      coverImage: '/hn-initials-mark.png',
      streaming: { youtube: 'https://www.youtube.com/@hervenanfang' },
      status: 'Actif',
      updatedAt: new Date().toISOString(),
    },
    ...MUSIC_SECTIONS.map((m, i) => ({
      id: `trk-sec-${i + 1}`,
      title: m.title,
      artist: 'Hervé Nanfang',
      category: 'Production',
      duration: '—',
      status: 'Actif' as const,
      updatedAt: new Date().toISOString(),
    })),
  ]
}

function getInitialMedia(): AdminMedia[] {
  return [
    ...(generatedUploadsMedia as unknown as AdminMedia[]),
    {
      id: 'med-01-portrait',
      bucket: 'public-media',
      path: '01-portrait-principal.png',
      url: '/images/01-portrait-principal.png',
      filename: '01-portrait-principal.png',
      altText: 'Portrait principal officiel de Hervé Nanfang en studio',
      caption: 'Portrait officiel studio de face — Identité maîtresse',
      tags: ['Portrait', 'Studio', 'Principal', 'Identité', 'Presse'],
      mimeType: 'image/png',
      sizeBytes: 2022724,
      width: 1024,
      height: 1536,
      defaultPositionX: 50,
      defaultPositionY: 30,
      focalX: 50,
      focalY: 30,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'med-02-eleves',
      bucket: 'public-media',
      path: '02-eleves-musique.jpg',
      url: '/images/02-eleves-musique.jpg',
      filename: '02-eleves-musique.jpg',
      altText: 'Hervé Nanfang en atelier pédagogique et transmission musicale',
      caption: 'Masterclass et transmission auprès des jeunes musiciens',
      tags: ['Pédagogie', 'Formation', 'Élèves', 'Transmission'],
      mimeType: 'image/jpeg',
      sizeBytes: 87361,
      width: 720,
      height: 804,
      defaultPositionX: 50,
      defaultPositionY: 45,
      focalX: 50,
      focalY: 45,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'med-03-hero-banner',
      bucket: 'public-media',
      path: '03-hero-banner.webp',
      url: '/images/03-hero-banner.webp',
      filename: '03-hero-banner.webp',
      altText: 'Performance live au piano et voix sur scène',
      caption: 'Bannière de scène live — Ambiance concert et lumière feutrée',
      tags: ['Live', 'Hero', 'Scène', 'Concert'],
      mimeType: 'image/webp',
      sizeBytes: 53334,
      width: 1248,
      height: 832,
      defaultPositionX: 50,
      defaultPositionY: 45,
      focalX: 50,
      focalY: 45,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'med-04-piano-bar',
      bucket: 'public-media',
      path: '04-piano-bar-live.jpeg',
      url: '/images/04-piano-bar-live.jpeg',
      filename: '04-piano-bar-live.jpeg',
      altText: 'Hervé Nanfang en session live Le Pianobariste',
      caption: 'Prestation acoustique feutrée Piano-Bar en direct',
      tags: ['Piano-Bar', 'Live', 'Concert', 'Prestation'],
      mimeType: 'image/jpeg',
      sizeBytes: 155390,
      width: 1080,
      height: 1080,
      defaultPositionX: 50,
      defaultPositionY: 18,
      focalX: 50,
      focalY: 18,
      createdAt: '2026-03-02T00:00:00Z',
    },
    {
      id: 'med-05-studio-mao',
      bucket: 'public-media',
      path: '05-studio-mao.png',
      url: '/images/05-studio-mao.png',
      filename: '05-studio-mao.png',
      altText: 'Studio MAO et composition numérique assistée par ordinateur',
      caption: 'Environnement de production musicale numérique et IA',
      tags: ['Studio', 'MAO', 'Production', 'IA', 'Musicien Augmenté'],
      mimeType: 'image/png',
      sizeBytes: 1422540,
      width: 1344,
      height: 768,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-02T00:00:00Z',
    },
    {
      id: 'med-06-portrait-editorial',
      bucket: 'public-media',
      path: '06-portrait-editorial.jpg',
      url: '/images/06-portrait-editorial.jpg',
      filename: '06-portrait-editorial.jpg',
      altText: 'Portrait éditorial de Hervé Nanfang de profil',
      caption: 'Portrait éditorial presse et réflexion artistique',
      tags: ['Portrait', 'Presse', 'Éditorial'],
      mimeType: 'image/jpeg',
      sizeBytes: 34802,
      width: 540,
      height: 960,
      defaultPositionX: 50,
      defaultPositionY: 16,
      focalX: 50,
      focalY: 16,
      createdAt: '2026-03-03T00:00:00Z',
    },
    {
      id: 'med-07-portrait-yaounde-hd',
      bucket: 'public-media',
      path: '07-portrait-yaounde.jpg',
      url: '/images/07-portrait-yaounde.jpg',
      filename: '07-portrait-yaounde.jpg',
      altText: 'Portrait officiel haute résolution à Yaoundé (Fichier Master 4K)',
      caption: 'Photographie officielle haute définition Yaoundé',
      tags: ['Portrait', 'Presse', 'Yaoundé', 'HD'],
      mimeType: 'image/jpeg',
      sizeBytes: 3991168,
      width: 2160,
      height: 3840,
      defaultPositionX: 50,
      defaultPositionY: 18,
      focalX: 50,
      focalY: 18,
      createdAt: '2026-03-03T00:00:00Z',
    },
    {
      id: 'med-08-artiste-tradi-moderne',
      bucket: 'public-media',
      path: '08-artiste-tradi-moderne.jpg',
      url: '/images/08-artiste-tradi-moderne.jpg',
      filename: '08-artiste-tradi-moderne.jpg',
      altText: 'Hervé Nanfang explorant les harmonies traditionnelles et modernes',
      caption: 'Dialogue entre racines bamiléké et écriture pianistique contemporaine',
      tags: ['Culture', 'Tradition', 'Recherche', 'Batoufam'],
      mimeType: 'image/jpeg',
      sizeBytes: 236796,
      width: 768,
      height: 576,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-03T00:00:00Z',
    },
    {
      id: 'med-09-fond-bureau',
      bucket: 'public-media',
      path: '09-fond-bureau.png',
      url: '/images/09-fond-bureau.png',
      filename: '09-fond-bureau.png',
      altText: 'Espace de recherche artistique et bureau de production ALAIZ Creative Systems',
      caption: 'Espace de travail et direction générale ALAIZ Creative Systems',
      tags: ['Production', 'Direction', 'Studio'],
      mimeType: 'image/png',
      sizeBytes: 577186,
      width: 716,
      height: 502,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-04T00:00:00Z',
    },
    {
      id: 'med-10-archive-portrait',
      bucket: 'public-media',
      path: '10-archive-portrait.jpg',
      url: '/images/10-archive-portrait.jpg',
      filename: '10-archive-portrait.jpg',
      altText: 'Archive patrimoniale issue du fonds de recherche culturelle',
      caption: 'Document patrimonial de référence historique',
      tags: ['Archives', 'Patrimoine', 'Recherche', 'Histoire'],
      mimeType: 'image/jpeg',
      sizeBytes: 2593488,
      width: 832,
      height: 1248,
      defaultPositionX: 50,
      defaultPositionY: 16,
      focalX: 50,
      focalY: 16,
      createdAt: '2026-03-04T00:00:00Z',
    },
    {
      id: 'med-11-archive-1950s',
      bucket: 'public-media',
      path: '11-archive-1950s.jpg',
      url: '/images/11-archive-1950s.jpg',
      filename: '11-archive-1950s.jpg',
      altText: 'Archive photographique musicale des pionniers (Années 1950)',
      caption: 'Période 1950s — Origines des musiques urbaines camerounaises',
      tags: ['Archives', 'Histoire', '1950s', 'Patrimoine'],
      mimeType: 'image/jpeg',
      sizeBytes: 1987050,
      width: 864,
      height: 1184,
      defaultPositionX: 50,
      defaultPositionY: 15,
      focalX: 50,
      focalY: 15,
      createdAt: '2026-03-04T00:00:00Z',
    },
    {
      id: 'med-12-archive-1970s',
      bucket: 'public-media',
      path: '12-archive-1970s.jpg',
      url: '/images/12-archive-1970s.jpg',
      filename: '12-archive-1970s.jpg',
      altText: 'Archive photographique de l’âge d’or des orchestres (Années 1970)',
      caption: 'Période 1970s — Foisonnement des cabarets et orchestres',
      tags: ['Archives', 'Histoire', '1970s', 'Patrimoine'],
      mimeType: 'image/jpeg',
      sizeBytes: 2752840,
      width: 864,
      height: 1184,
      defaultPositionX: 50,
      defaultPositionY: 15,
      focalX: 50,
      focalY: 15,
      createdAt: '2026-03-04T00:00:00Z',
    },
    {
      id: 'med-13-siac-2025',
      bucket: 'public-media',
      path: '13-siac-2025.jpg',
      url: '/images/13-siac-2025.jpg',
      filename: '13-siac-2025.jpg',
      altText: 'Conférence internationale et masterclass au CIARC 2025',
      caption: 'Intervention CIARC 2025 — Économie créative et musique',
      tags: ['Conférence', 'CIARC', '2025', 'Masterclass', 'Événement'],
      mimeType: 'image/jpeg',
      sizeBytes: 84518,
      width: 1000,
      height: 750,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-05T00:00:00Z',
    },
    {
      id: 'med-cours-isma',
      bucket: 'public-media',
      path: 'Cours ISMA_October 02, 2025 - 1_13PM.png',
      url: '/images/Cours%20ISMA_October%2002,%202025%20-%201_13PM.png',
      filename: 'Cours ISMA_October 02, 2025 - 1_13PM.png',
      altText: 'Cours de Musicologie et MAO à l’ISMA avec Hervé Nanfang',
      caption: 'Session de formation spécialisée ISMA (Musicologie & MAO)',
      tags: ['Pédagogie', 'ISMA', 'Musicologie', 'Formation'],
      mimeType: 'image/png',
      sizeBytes: 1895575,
      width: 1344,
      height: 768,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-05T00:00:00Z',
    },
    {
      id: 'med-about-portrait',
      bucket: 'public-media',
      path: 'shooting-pro-officiel.webp',
      url: '/images/shooting-pro-officiel.webp',
      filename: 'shooting-pro-officiel.webp',
      altText: 'Portrait officiel d’Hervé Nanfang en costume d’apparat et chemise dorée',
      caption: 'Portrait éditorial officiel de prestige (Page À propos & Presse)',
      tags: ['Portrait', 'À propos', 'Presse', 'Identité'],
      mimeType: 'image/webp',
      sizeBytes: 137906,
      width: 1280,
      height: 853,
      defaultPositionX: 50,
      defaultPositionY: 30,
      focalX: 50,
      focalY: 30,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'med-pianobariste-affiche',
      bucket: 'public-media',
      path: 'affiche-pianobariste.webp',
      url: '/images/affiche-pianobariste.webp',
      filename: 'affiche-pianobariste.webp',
      altText: 'Affiche officielle du concept Le Pianobariste',
      caption: 'Visuel signature Le Pianobariste (Accueil, Musique, Services)',
      tags: ['Affiche', 'Signature', 'Piano-Bar', 'Concert'],
      mimeType: 'image/webp',
      sizeBytes: 113058,
      width: 1024,
      height: 1536,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-04T00:00:00Z',
    },
    {
      id: 'med-hero-duo',
      bucket: 'public-media',
      path: 'hero-duo-live.webp',
      url: '/images/hero-duo-live.webp',
      filename: 'hero-duo-live.webp',
      altText: 'Duo musical live en prestation piano et voix',
      caption: 'Duo musical live (Hero Accueil)',
      tags: ['Live', 'Hero', 'Accueil', 'Piano-Voix'],
      mimeType: 'image/webp',
      sizeBytes: 53334,
      width: 1248,
      height: 832,
      defaultPositionX: 50,
      defaultPositionY: 45,
      focalX: 50,
      focalY: 45,
      createdAt: '2026-03-05T00:00:00Z',
    },
    {
      id: 'med-live-band',
      bucket: 'public-media',
      path: 'live-band.webp',
      url: '/images/live-band.webp',
      filename: 'live-band.webp',
      altText: 'Live Band en formation quartet jazz',
      caption: 'Formation quartet live jazz & afropop',
      tags: ['Live', 'Band', 'Quartet', 'Presse'],
      mimeType: 'image/webp',
      sizeBytes: 32666,
      width: 1400,
      height: 783,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-03T00:00:00Z',
    },
    {
      id: 'med-live-piano',
      bucket: 'public-media',
      path: 'live-scene-piano.jpeg',
      url: '/images/live-scene-piano.jpeg',
      filename: 'live-scene-piano.jpeg',
      altText: 'Hervé Nanfang sur scène en concert live au piano',
      caption: 'Concert live Piano-Bar (Page Musique & Presse)',
      tags: ['Live', 'Piano', 'Concert', 'Scène'],
      mimeType: 'image/jpeg',
      sizeBytes: 155390,
      width: 1080,
      height: 1080,
      defaultPositionX: 50,
      defaultPositionY: 40,
      focalX: 50,
      focalY: 40,
      createdAt: '2026-03-02T00:00:00Z',
    },
    {
      id: 'med-portrait',
      bucket: 'public-media',
      path: 'portrait.webp',
      url: '/images/portrait.webp',
      filename: 'portrait.webp',
      altText: 'Portrait studio officiel de Hervé Nanfang',
      caption: 'Portrait studio noir et blanc de face',
      tags: ['Portrait', 'Studio', 'Trombinoscope', 'Presse'],
      mimeType: 'image/webp',
      sizeBytes: 137202,
      width: 760,
      height: 1353,
      defaultPositionX: 50,
      defaultPositionY: 35,
      focalX: 50,
      focalY: 35,
      createdAt: '2026-03-01T00:00:00Z',
    },
    {
      id: 'med-logo-official',
      bucket: 'public-media',
      path: 'hn-initials-mark.png',
      url: '/hn-initials-mark.png',
      filename: 'hn-initials-mark.png',
      altText: 'Monogramme officiel HN en or brossé, clavier et étoile',
      caption: 'Monogramme officiel HN (Identité de marque)',
      tags: ['Logo', 'Identité', 'Monogramme', 'Or'],
      mimeType: 'image/png',
      sizeBytes: 457925,
      width: 1024,
      height: 1024,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-10-18T00:00:00Z',
    },
    {
      id: 'med-logo-master',
      bucket: 'public-media',
      path: 'hn-logo-master.png',
      url: '/hn-logo-master.png',
      filename: 'hn-logo-master.png',
      altText: 'Logo Maître HD officiel Hervé Nanfang',
      caption: 'Logo officiel maître haute résolution',
      tags: ['Logo', 'Master', 'Identité', 'HD'],
      mimeType: 'image/png',
      sizeBytes: 457925,
      width: 1024,
      height: 1024,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-10-18T00:00:00Z',
    },
    {
      id: 'med-og',
      bucket: 'public-media',
      path: 'og-image.jpg',
      url: '/og-image.jpg',
      filename: 'og-image.jpg',
      altText: 'Bannière Open Graph officielle Hervé Nanfang',
      caption: 'Visuel de partage réseaux sociaux',
      tags: ['SEO', 'OpenGraph'],
      mimeType: 'image/jpeg',
      sizeBytes: 128382,
      width: 1200,
      height: 630,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-06T00:00:00Z',
    },
  ]
}

function getInitialMessages(): AdminMessage[] {
  return []
}

function getInitialSettings(): AdminSettings {
  return {
    siteName: SITE.name,
    tagline: SITE.tagline,
    city: SITE.city,
    emailContact: SITE.emailContact,
    emailRma: SITE.emailRma,
    phonePrimary: SITE.phones[0]?.display ?? '+237 694 72 34 92',
    phoneSecondary: SITE.phones[1]?.display ?? '+237 682 18 02 66',
    referenceDescription: MASTER_IDENTITY.positionnement.descriptionReference,
    positioningLine: MASTER_IDENTITY.positionnement.propositionValeur,
    seoTitle: MASTER_IDENTITY.positionnement.seoTitle,
    metaDescription: MASTER_IDENTITY.positionnement.metaDescription,
    socialLinks: MASTER_IDENTITY.liensOfficiels.map((l) => ({
      platform: l.plateforme,
      href: l.href,
      verified: l.verifie,
    })),
    promoBannerEnabled: false,
    promoBannerLegacyMigrated: true,
    promoBannerCampaign: 'rma',
    googleAdsId: 'G-DMHQK0ELNX',
    webhookUrl: 'https://hervenanfang.app.n8n.cloud/webhook/publication-approved',
    updatedAt: new Date().toISOString(),
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve) => {
    if (typeof FileReader === 'undefined') {
      resolve(`/images/${encodeURIComponent(file.name)}`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => resolve(`/images/${encodeURIComponent(file.name)}`)
    reader.readAsDataURL(file)
  })
}

function resolveValidMediaUrl(url: string | undefined, filename?: string): string {
  if (!url) return '/images/portrait.webp'
  if (url.startsWith('blob:')) {
    if (filename) return `/images/${encodeURIComponent(filename)}`
    return '/images/portrait.webp'
  }
  return url
}

function sanitizeLoadedState(state: AdminState): AdminState {
  if (!state) return state
  let hasChanges = false

  const initialMedia = getInitialMedia()
  const existingMediaMap = new Map<string, AdminMedia>()
  const existingUrls = new Set<string>()
  const existingPaths = new Set<string>()

  for (const m of (state.media || [])) {
    existingMediaMap.set(m.id, m)
    if (m.url) existingUrls.add(decodeURIComponent(m.url).toLowerCase())
    if (m.filename) existingPaths.add(m.filename.toLowerCase())
    if (m.path) existingPaths.add(m.path.toLowerCase())
  }

  const media = (state.media || []).map((m) => {
    if (m.id === 'med-about-portrait' && m.url && m.url.includes('about-portrait-yaounde')) {
      hasChanges = true
      return {
        ...m,
        url: '/images/shooting-pro-officiel.webp',
        path: 'shooting-pro-officiel.webp',
        filename: 'shooting-pro-officiel.webp',
        altText: 'Portrait officiel d’Hervé Nanfang en costume d’apparat et chemise dorée',
      }
    }
    if (m.url && m.url.startsWith('blob:')) {
      hasChanges = true
      return {
        ...m,
        url: resolveValidMediaUrl(m.url, m.filename || m.path),
      }
    }
    return m
  })

  // Fusionner les nouveaux médias de référence s'ils manquent au cache local
  for (const initItem of initialMedia) {
    const normUrl = decodeURIComponent(initItem.url).toLowerCase()
    const normFile = (initItem.filename || '').toLowerCase()
    const normPath = (initItem.path || '').toLowerCase()

    const alreadyPresent =
      existingMediaMap.has(initItem.id) ||
      existingUrls.has(normUrl) ||
      existingPaths.has(normFile) ||
      existingPaths.has(normPath)

    if (!alreadyPresent) {
      media.push(initItem)
      existingMediaMap.set(initItem.id, initItem)
      existingUrls.add(normUrl)
      existingPaths.add(normFile)
      hasChanges = true
    }
  }

  const initialArticles = getInitialArticles()
  const initialArticlesMap = new Map(initialArticles.map((art) => [art.slug, art] as const))
  const existingArticleSlugs = new Set((state.articles || []).map((a) => a.slug))
  const articles = (state.articles || []).map((a) => {
    let art = a
    if (art.coverImage && art.coverImage.startsWith('blob:')) {
      hasChanges = true
      art = { ...art, coverImage: resolveValidMediaUrl(art.coverImage) }
    }
    const sourceArt = initialArticlesMap.get(art.slug)
    if (sourceArt && sourceArt.body) {
      const bodyDiffers = !art.body || art.body.length !== sourceArt.body.length
      if (bodyDiffers) {
        hasChanges = true
        art = {
          ...art,
          title: sourceArt.title,
          excerpt: sourceArt.excerpt,
          readingTime: sourceArt.readingTime,
          audience: sourceArt.audience,
          outline: sourceArt.outline,
          body: sourceArt.body,
          keywords: sourceArt.keywords,
          seoTitle: sourceArt.seoTitle,
          seoDescription: sourceArt.seoDescription,
        }
      }
    }
    return art
  })

  // Fusionner automatiquement tout nouvel article publié dans le code source
  for (const initArt of initialArticles) {
    if (!existingArticleSlugs.has(initArt.slug)) {
      articles.push(initArt)
      existingArticleSlugs.add(initArt.slug)
      hasChanges = true
    }
  }

  const projects = (state.projects || []).map((p) => {
    if (p.coverImage && p.coverImage.startsWith('blob:')) {
      hasChanges = true
      return { ...p, coverImage: resolveValidMediaUrl(p.coverImage) }
    }
    return p
  })

  const services = (state.services || []).map((s) => {
    if (s.coverImage && s.coverImage.startsWith('blob:')) {
      hasChanges = true
      return { ...s, coverImage: resolveValidMediaUrl(s.coverImage) }
    }
    return s
  })

  let publications: SocialPost[] = []
  if (
    !state.publications ||
    state.publications.length === 0 ||
    (state.publications.length <= 10 && state.publications.some((p: any) => p.id === 'pub-01-recit-marque'))
  ) {
    publications = INITIAL_PUBLICATIONS
    hasChanges = true
  } else {
    // Migration non destructive : préserver scrupuleusement les publications de l'utilisateur
    publications = state.publications.map((p: any) => {
      let changed = false
      const post = { ...p }

      // 1. Déduction intelligente du pilier manquant
      if (!post.pillar) {
        if (post.sourceType === 'service') {
          post.pillar = 'conversion'
        } else if (post.sourceType === 'musique' || post.sourceType === 'projet') {
          post.pillar = 'decouverte'
        } else {
          post.pillar = 'autorite'
        }
        changed = true
      }

      // 2. Correction du slug historique si rencontré
      if (post.sourceSlug === 'musicien-et-sa-marque-recit-precede-logo') {
        post.sourceSlug = 'musicien-marque-recit'
        if (post.linkUrl && post.linkUrl.includes('musicien-et-sa-marque-recit-precede-logo')) {
          post.linkUrl = post.linkUrl.replace('musicien-et-sa-marque-recit-precede-logo', 'musicien-marque-recit')
        }
        changed = true
      }

      // 3. Initialisation des tableaux requis
      if (!Array.isArray(post.decisionHistory)) {
        post.decisionHistory = []
        changed = true
      }

      if (changed) hasChanges = true
      return post as SocialPost
    })
  }

  // 4. Nettoyage automatique des messages de démonstration
  const messages = (state.messages || []).filter(
    (m: AdminMessage) => m.id !== 'msg-1' && m.id !== 'msg-2' && m.id !== 'msg-3' && !m.email.endsWith('.example')
  )
  if (messages.length !== (state.messages || []).length) {
    hasChanges = true
  }

  // 5. Initialisation du Webhook n8n et de Google Analytics 4 si non définis
  const currentWebhook = state.settings?.webhookUrl?.trim()
  const rawGoogleTag = state.settings?.googleAdsId?.trim()
  const currentGoogleTag = (!rawGoogleTag || rawGoogleTag === 'G-DNH9G3SF7F') ? 'G-DMHQK0ELNX' : rawGoogleTag
  const settings = {
    ...getInitialSettings(),
    ...(state.settings || {}),
    promoBannerEnabled: state.settings?.promoBannerLegacyMigrated ? Boolean(state.settings?.promoBannerEnabled) : false,
    promoBannerLegacyMigrated: true,
    googleAdsId: currentGoogleTag,
    webhookUrl: currentWebhook || 'https://hervenanfang.app.n8n.cloud/webhook/publication-approved',
  }
  if (!currentWebhook || rawGoogleTag !== currentGoogleTag || !state.settings?.promoBannerLegacyMigrated) {
    hasChanges = true
  }

  const sanitized = { ...state, media, articles, projects, services, publications, messages, settings }
  if (hasChanges && typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(sanitized))
    } catch {
      // ignore
    }
  }
  return sanitized
}

function createInitialState(): AdminState {
  return {
    articles: getInitialArticles(),
    projects: getInitialProjects(),
    services: INITIAL_SERVICES,
    talks: getInitialTalks(),
    tracks: getInitialTracks(),
    media: getInitialMedia(),
    messages: getInitialMessages(),
    publications: INITIAL_PUBLICATIONS,
    settings: getInitialSettings(),
    lastSyncAt: new Date().toISOString(),
  }
}

let currentState: AdminState = (() => {
  try {
    if (typeof localStorage !== 'undefined') {
      // Sauvegarde défensive automatique avant toute migration de version
      const existingV2 = localStorage.getItem('hn_admin_store_v2')
      if (existingV2 && !localStorage.getItem('hn_admin_store_backup_v2')) {
        try {
          localStorage.setItem('hn_admin_store_backup_v2', existingV2)
          console.info('[PERSISTANCE SÉCURISÉE] Sauvegarde automatique de hn_admin_store_v2 effectuée.')
        } catch {
          // ignore
        }
      }

      const saved =
        localStorage.getItem(LOCAL_STORE_KEY) ||
        localStorage.getItem('hn_admin_store_v2') ||
        localStorage.getItem('hn_admin_store_v1')

      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.articles && parsed.projects) {
          const sanitized = sanitizeLoadedState(parsed)
          localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(sanitized))
          return sanitized
        }
      }
    }
  } catch (err) {
    console.warn('[ADMIN-STORE] Erreur lors de la lecture du stockage local:', err)
  }
  return createInitialState()
})()

type StoreListener = (state: AdminState) => void
const storeListeners: Set<StoreListener> = new Set()

function persistAndBroadcast(state: AdminState) {
  currentState = { ...state }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(LOCAL_STORE_KEY, JSON.stringify(currentState))
    }
  } catch (err) {
    console.warn('Could not persist to localStorage:', err)
  }
  storeListeners.forEach((fn) => fn(currentState))
}

export const adminStore = {
  getState(): AdminState {
    return currentState
  },

  subscribe(listener: StoreListener) {
    storeListeners.add(listener)
    listener(currentState)
    return () => {
      storeListeners.delete(listener)
    }
  },

  // -------------------------------------------------------------
  // SUPABASE SYNC & CLOUD HYDRATION
  // -------------------------------------------------------------
  async fetchFromSupabase(): Promise<boolean> {
    if (!isSupabaseConfigured || !supabase) return false

    try {
      const [artRes, prjRes, msgRes, medRes, setRes, pubRes] = await Promise.all([
        supabase.from('articles').select('*').order('pillar_number', { ascending: true }),
        supabase.from('projects').select('*').order('position', { ascending: true }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
        supabase.from('publications').select('*').order('scheduled_date', { ascending: false }),
      ])

      let updated = false
      const next = { ...currentState }

      if (artRes.data && artRes.data.length > 0) {
        next.articles = artRes.data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          num: String(row.pillar_number || '01').padStart(2, '0'),
          category: row.category || 'IA',
          title: row.title,
          excerpt: row.excerpt || '',
          readingTime: row.reading_time || '7 min',
          status: (row.status === 'publie' ? 'Publié' : row.status === 'archive' ? 'Archivé' : 'En cours') as ContentStatus,
          audience: row.audience || 'Musiciens et professionnels',
          outline: row.outline || [],
          keywords: row.keywords || [],
          linkedConcept: { label: 'Musicien Augmenté™', to: '/ia-technologie#musicien-augmente' },
          seoTitle: row.seo_title || row.title,
          seoDescription: row.seo_description || row.excerpt || '',
          coverImage: row.cover_image,
          coverPositionX: row.cover_position_x ?? 50,
          coverPositionY: row.cover_position_y ?? 50,
          coverZoom: row.cover_zoom ?? 1,
          coverFocalX: row.cover_focal_x,
          coverFocalY: row.cover_focal_y,
          coverPreset: row.cover_preset || 'original',
          coverAlt: row.cover_alt,
          publishedAt: row.published_at,
          updatedAt: row.updated_at || '',
        }))
        updated = true
      }

      if (prjRes.data && prjRes.data.length > 0) {
        next.projects = prjRes.data.map((row: any) => ({
          id: row.id,
          slug: row.slug,
          family: row.family,
          familyLabel: row.family,
          title: row.title,
          volume: row.volume || '',
          description: row.description || '',
          points: row.points || [],
          to: row.external_url,
          status: row.status || 'Actif',
          mark: row.mark || '',
          position: row.position || 0,
          coverImage: row.cover_image,
          coverPositionX: row.cover_position_x ?? 50,
          coverPositionY: row.cover_position_y ?? 50,
          coverZoom: row.cover_zoom ?? 1,
          coverFocalX: row.cover_focal_x,
          coverFocalY: row.cover_focal_y,
          coverPreset: row.cover_preset || 'original',
          coverAlt: row.cover_alt,
          updatedAt: row.updated_at || '',
        }))
        updated = true
      }

      if (msgRes.data && msgRes.data.length > 0) {
        next.messages = msgRes.data.map((row: any) => ({
          id: row.id,
          name: row.name,
          email: row.email,
          organization: row.organization,
          phone: row.phone,
          route: row.route,
          eventDate: row.event_date,
          place: row.place,
          body: row.body,
          status: row.status,
          internalNotes: row.internal_notes,
          createdAt: row.created_at,
        }))
        updated = true
      }

      if (medRes.data && medRes.data.length > 0) {
        next.media = medRes.data.map((row: any) => ({
          id: row.id,
          bucket: row.bucket,
          path: row.path,
          url: supabase!.storage.from(row.bucket).getPublicUrl(row.path).data.publicUrl,
          filename: row.path.split('/').pop() || row.path,
          altText: row.alt_text || '',
          caption: row.caption,
          title: row.title,
          description: row.description,
          credit: row.credit,
          tags: row.tags || [],
          mimeType: row.mime_type || 'image/jpeg',
          sizeBytes: Number(row.size_bytes) || 0,
          width: row.width,
          height: row.height,
          focalX: row.focal_x,
          focalY: row.focal_y,
          defaultPositionX: row.default_position_x ?? 50,
          defaultPositionY: row.default_position_y ?? 50,
          createdAt: row.created_at,
        }))
        updated = true
      }

      if (setRes.data && setRes.data.length > 0) {
        const generalSetting = setRes.data.find((row: any) => row.key === 'general')
        if (generalSetting && generalSetting.value) {
          next.settings = {
            ...next.settings,
            ...generalSetting.value,
            promoBannerEnabled: generalSetting.value.promoBannerLegacyMigrated
              ? Boolean(generalSetting.value.promoBannerEnabled)
              : false,
            promoBannerLegacyMigrated: true,
          }
          updated = true
        }
      }

      if (pubRes && pubRes.data && pubRes.data.length > 0) {
        const remotePubs: SocialPost[] = pubRes.data.map((row: any) => ({
          id: row.id,
          title: row.title,
          pillar: row.pillar,
          series: row.series,
          campaign: row.campaign,
          sourceType: row.source_type,
          sourceSlug: row.source_slug,
          sourceTitle: row.source_title,
          isOriginalCreation: row.is_original_creation,
          scheduledDate: row.scheduled_date,
          scheduledTime: row.scheduled_time || '09:00',
          status: row.status,
          platforms: row.platforms || [],
          contentByPlatform: row.content_by_platform || {},
          hookVariants: row.hook_variants || [],
          mediaUrl: row.media_url,
          linkUrl: row.link_url,
          ctaLabel: row.cta_label,
          targetAudience: row.target_audience,
          validationSignature: row.validation_signature,
          decisionHistory: row.decision_history || [],
          metrics: row.metrics || {},
          rejectionReason: row.rejection_reason,
          connectorStatus: row.connector_status || {},
          notes: row.notes,
          publishedAt: row.published_at,
          createdAt: row.created_at || row.updated_at || new Date().toISOString(),
          updatedAt: row.updated_at || '',
        }))

        // Merge non-destructif : remote prend la priorité, conservation des publications locales non encore envoyées
        const remoteIds = new Set(remotePubs.map((p) => p.id))
        const localOnly = (next.publications || []).filter((p) => !remoteIds.has(p.id))
        next.publications = [...remotePubs, ...localOnly]
        updated = true
      }

      next.lastSyncAt = new Date().toISOString()
      persistAndBroadcast(next)
      return updated
    } catch (err) {
      console.warn('Supabase fetch failed, keeping local state:', err)
      return false
    }
  },

  async seedToSupabase(): Promise<{ success: boolean; count: number; error?: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, count: 0, error: 'Supabase n’est pas configuré.' }
    }

    try {
      // 1. Articles (colonnes image-editor optionnelles : ignorées si migration non exécutée)
      const articlesRows = currentState.articles.map((a) => ({
        slug: a.slug,
        pillar_number: parseInt(a.num, 10) || 1,
        title: a.title,
        excerpt: a.excerpt,
        category: a.category,
        reading_time: a.readingTime,
        status: a.status === 'Publié' ? 'publie' : a.status === 'Archivé' ? 'archive' : 'brouillon',
        keywords: a.keywords,
        cover_image: a.coverImage,
        seo_title: a.seoTitle,
        seo_description: a.seoDescription,
        published_at: a.publishedAt || null,
      }))

      const { error: artErr } = await supabase.from('articles').upsert(articlesRows, { onConflict: 'slug' })
      if (artErr) console.warn('Articles upsert error:', artErr)

      // 1b. Cadrage image article (best-effort après migration)
      try {
        await supabase.from('articles').upsert(currentState.articles.map((a) => ({
          slug: a.slug,
          cover_position_x: a.coverPositionX ?? 50,
          cover_position_y: a.coverPositionY ?? 50,
          cover_zoom: a.coverZoom ?? 1,
          cover_focal_x: a.coverFocalX ?? null,
          cover_focal_y: a.coverFocalY ?? null,
          cover_preset: a.coverPreset || 'original',
          cover_alt: a.coverAlt || null,
        })), { onConflict: 'slug' })
      } catch (e) {
        console.warn('Articles cover meta sync skipped (migration à exécuter) :', e)
      }

      // 2. Projects
      const projectsRows = currentState.projects.map((p) => ({
        slug: p.slug,
        family: ['artistiques', 'pedagogiques', 'technologiques', 'culturels', 'entrepreneuriaux'].includes(p.family)
          ? p.family
          : p.family === 'art'
          ? 'artistiques'
          : p.family === 'pedagogie'
          ? 'pedagogiques'
          : p.family === 'technologie'
          ? 'technologiques'
          : 'culturels',
        title: p.title,
        volume: p.volume,
        description: p.description,
        points: p.points,
        status: p.status,
        mark: p.mark,
        external_url: p.to,
        position: p.position,
      }))

      const { error: prjErr } = await supabase.from('projects').upsert(projectsRows, { onConflict: 'slug' })
      if (prjErr) console.warn('Projects upsert error:', prjErr)

      try {
        await supabase.from('projects').upsert(currentState.projects.map((p) => ({
          slug: p.slug,
          cover_image: p.coverImage || null,
          cover_position_x: p.coverPositionX ?? 50,
          cover_position_y: p.coverPositionY ?? 50,
          cover_zoom: p.coverZoom ?? 1,
          cover_focal_x: p.coverFocalX ?? null,
          cover_focal_y: p.coverFocalY ?? null,
          cover_preset: p.coverPreset || 'original',
          cover_alt: p.coverAlt || null,
        })), { onConflict: 'slug' })
      } catch (e) {
        console.warn('Projects cover meta sync skipped (migration à exécuter) :', e)
      }

      // 3. Settings
      await supabase.from('site_settings').upsert({
        key: 'general',
        value: currentState.settings,
        updated_at: new Date().toISOString(),
      })

      // 4. Publications (calendrier & validation P0)
      let seededPublicationsCount = 0
      if (currentState.publications && currentState.publications.length > 0) {
        try {
          const pubRows = currentState.publications.map((p) => ({
            id: p.id,
            title: p.title,
            pillar: p.pillar,
            series: p.series,
            campaign: p.campaign,
            source_type: p.sourceType,
            source_slug: p.sourceSlug,
            source_title: p.sourceTitle,
            is_original_creation: Boolean(p.isOriginalCreation),
            scheduled_date: p.scheduledDate,
            scheduled_time: p.scheduledTime,
            status: p.status,
            platforms: p.platforms,
            content_by_platform: p.contentByPlatform,
            hook_variants: p.hookVariants || [],
            media_url: p.mediaUrl,
            link_url: p.linkUrl,
            cta_label: p.ctaLabel,
            target_audience: p.targetAudience,
            validation_signature: p.validationSignature,
            decision_history: p.decisionHistory,
            metrics: p.metrics,
            rejection_reason: p.rejectionReason,
            connector_status: p.connectorStatus,
            notes: p.notes,
            published_at: p.publishedAt,
            updated_at: p.updatedAt,
          }))

          const { error: pubErr } = await supabase.from('publications').upsert(pubRows, { onConflict: 'id' })
          if (pubErr) {
            console.warn('[ADMIN-STORE SUPABASE] Table publications non encore migrée ou erreur RLS :', pubErr)
          } else {
            seededPublicationsCount = pubRows.length
          }
        } catch (pubEx) {
          console.warn('[ADMIN-STORE SUPABASE] Skip publication seed :', pubEx)
        }
      }

      return {
        success: true,
        count: articlesRows.length + projectsRows.length + seededPublicationsCount,
      }
    } catch (err) {
      return {
        success: false,
        count: 0,
        error: err instanceof Error ? err.message : 'Erreur inconnue lors du seed Supabase',
      }
    }
  },

  // -------------------------------------------------------------
  // ARTICLES CRUD
  // -------------------------------------------------------------
  async saveArticle(article: AdminArticle): Promise<void> {
    const updated = {
      ...article,
      updatedAt: new Date().toISOString(),
      publishedAt: article.status === 'Publié' && !article.publishedAt ? new Date().toISOString() : article.publishedAt,
    }

    const index = currentState.articles.findIndex((a) => a.id === article.id || a.slug === article.slug)
    const nextArticles = [...currentState.articles]

    if (index >= 0) {
      nextArticles[index] = updated
    } else {
      nextArticles.unshift(updated)
    }

    persistAndBroadcast({ ...currentState, articles: nextArticles })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('articles').upsert({
          slug: updated.slug,
          pillar_number: parseInt(updated.num, 10) || 1,
          title: updated.title,
          excerpt: updated.excerpt,
          category: updated.category,
          reading_time: updated.readingTime,
          status: updated.status === 'Publié' ? 'publie' : updated.status === 'Archivé' ? 'archive' : 'brouillon',
          keywords: updated.keywords,
          cover_image: updated.coverImage,
          seo_title: updated.seoTitle,
          seo_description: updated.seoDescription,
          published_at: updated.publishedAt,
          updated_at: updated.updatedAt,
        }, { onConflict: 'slug' })
        try {
          await supabase.from('articles').upsert({
            slug: updated.slug,
            cover_position_x: updated.coverPositionX ?? 50,
            cover_position_y: updated.coverPositionY ?? 50,
            cover_zoom: updated.coverZoom ?? 1,
            cover_focal_x: updated.coverFocalX ?? null,
            cover_focal_y: updated.coverFocalY ?? null,
            cover_preset: updated.coverPreset || 'original',
            cover_alt: updated.coverAlt || null,
          }, { onConflict: 'slug' })
        } catch {
          // migration image-editor pas encore exécutée : local reste source de vérité
        }
      } catch (err) {
        console.warn('Supabase article sync error:', err)
      }
    }
  },

  async deleteArticle(idOrSlug: string): Promise<void> {
    const nextArticles = currentState.articles.filter((a) => a.id !== idOrSlug && a.slug !== idOrSlug)
    persistAndBroadcast({ ...currentState, articles: nextArticles })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('articles').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      } catch (err) {
        console.warn('Supabase article delete error:', err)
      }
    }
  },

  async toggleArticleStatus(idOrSlug: string): Promise<ContentStatus> {
    const article = currentState.articles.find((a) => a.id === idOrSlug || a.slug === idOrSlug)
    if (!article) return 'Brouillon'

    const newStatus: ContentStatus = article.status === 'Publié' ? 'Brouillon' : 'Publié'
    await this.saveArticle({ ...article, status: newStatus })
    return newStatus
  },

  // -------------------------------------------------------------
  // PROJECTS CRUD
  // -------------------------------------------------------------
  async saveProject(project: AdminProject): Promise<void> {
    const updated = { ...project, updatedAt: new Date().toISOString() }
    const index = currentState.projects.findIndex((p) => p.id === project.id || p.slug === project.slug)
    const nextProjects = [...currentState.projects]

    if (index >= 0) {
      nextProjects[index] = updated
    } else {
      nextProjects.push(updated)
    }

    persistAndBroadcast({ ...currentState, projects: nextProjects })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').upsert({
          slug: updated.slug,
          family: updated.family,
          title: updated.title,
          volume: updated.volume,
          description: updated.description,
          points: updated.points,
          status: updated.status,
          mark: updated.mark,
          external_url: updated.to,
          position: updated.position,
          updated_at: updated.updatedAt,
        }, { onConflict: 'slug' })
        try {
          await supabase.from('projects').upsert({
            slug: updated.slug,
            cover_image: updated.coverImage || null,
            cover_position_x: updated.coverPositionX ?? 50,
            cover_position_y: updated.coverPositionY ?? 50,
            cover_zoom: updated.coverZoom ?? 1,
            cover_focal_x: updated.coverFocalX ?? null,
            cover_focal_y: updated.coverFocalY ?? null,
            cover_preset: updated.coverPreset || 'original',
            cover_alt: updated.coverAlt || null,
          }, { onConflict: 'slug' })
        } catch {
          // migration image-editor pas encore exécutée
        }
      } catch (err) {
        console.warn('Supabase project sync error:', err)
      }
    }
  },

  async deleteProject(idOrSlug: string): Promise<void> {
    const nextProjects = currentState.projects.filter((p) => p.id !== idOrSlug && p.slug !== idOrSlug)
    persistAndBroadcast({ ...currentState, projects: nextProjects })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('projects').delete().or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
      } catch (err) {
        console.warn('Supabase project delete error:', err)
      }
    }
  },

  // -------------------------------------------------------------
  // SERVICES CRUD
  // -------------------------------------------------------------
  async saveService(service: AdminService): Promise<void> {
    const updated = { ...service, updatedAt: new Date().toISOString() }
    const index = currentState.services.findIndex((s) => s.id === service.id)
    const nextServices = [...currentState.services]

    if (index >= 0) {
      nextServices[index] = updated
    } else {
      nextServices.push(updated)
    }

    persistAndBroadcast({ ...currentState, services: nextServices })
  },

  async deleteService(id: string): Promise<void> {
    const nextServices = currentState.services.filter((s) => s.id !== id)
    persistAndBroadcast({ ...currentState, services: nextServices })
  },

  // -------------------------------------------------------------
  // TALKS & COURSES CRUD
  // -------------------------------------------------------------
  async saveTalk(talk: AdminTalk): Promise<void> {
    const updated = { ...talk, updatedAt: new Date().toISOString() }
    const index = currentState.talks.findIndex((t) => t.id === talk.id)
    const nextTalks = [...currentState.talks]

    if (index >= 0) {
      nextTalks[index] = updated
    } else {
      nextTalks.push(updated)
    }

    persistAndBroadcast({ ...currentState, talks: nextTalks })
  },

  async deleteTalk(id: string): Promise<void> {
    const nextTalks = currentState.talks.filter((t) => t.id !== id)
    persistAndBroadcast({ ...currentState, talks: nextTalks })
  },

  // -------------------------------------------------------------
  // TRACKS CRUD
  // -------------------------------------------------------------
  async saveTrack(track: AdminTrack): Promise<void> {
    const updated = { ...track, updatedAt: new Date().toISOString() }
    const index = currentState.tracks.findIndex((t) => t.id === track.id)
    const nextTracks = [...currentState.tracks]

    if (index >= 0) {
      nextTracks[index] = updated
    } else {
      nextTracks.push(updated)
    }

    persistAndBroadcast({ ...currentState, tracks: nextTracks })
  },

  async deleteTrack(id: string): Promise<void> {
    const nextTracks = currentState.tracks.filter((t) => t.id !== id)
    persistAndBroadcast({ ...currentState, tracks: nextTracks })
  },

  // -------------------------------------------------------------
  // MEDIA UPLOAD & MANAGEMENT
  // -------------------------------------------------------------
  async uploadMedia(
    file: File,
    metadata: { altText: string; caption?: string; tags?: string[] },
  ): Promise<AdminMedia> {
    const timestamp = new Date().toISOString().slice(0, 10)
    const sanitizedName = `${timestamp}-${file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-')}`
    const id = `med-${Date.now()}`

    let publicUrl = ''

    if (isSupabaseConfigured && supabase) {
      try {
        const { error: uploadError } = await supabase.storage
          .from('public-media')
          .upload(sanitizedName, file, { upsert: true })

        if (!uploadError) {
          const { data } = supabase.storage.from('public-media').getPublicUrl(sanitizedName)
          publicUrl = data.publicUrl

          await supabase.from('media').insert({
            bucket: 'public-media',
            path: sanitizedName,
            alt_text: metadata.altText,
            caption: metadata.caption,
            mime_type: file.type,
            size_bytes: file.size,
            tags: metadata.tags || [],
          })
        }
      } catch (err) {
        console.warn('Supabase media upload failed, fallback to local URL:', err)
      }
    }

    if (!publicUrl) {
      // Local fallback: stocker sous format Data URL pérenne (survit aux rafraîchissements de page)
      try {
        publicUrl = await readFileAsDataUrl(file)
      } catch {
        publicUrl = `/images/${encodeURIComponent(file.name)}`
      }
    }

    const newMedia: AdminMedia = {
      id,
      bucket: 'public-media',
      path: sanitizedName,
      url: publicUrl,
      filename: file.name,
      altText: metadata.altText || file.name,
      caption: metadata.caption,
      tags: metadata.tags || ['Général'],
      mimeType: file.type || 'image/jpeg',
      sizeBytes: file.size,
      createdAt: new Date().toISOString(),
    }

    const nextMedia = [newMedia, ...currentState.media]
    persistAndBroadcast({ ...currentState, media: nextMedia })
    return newMedia
  },

  async updateMedia(id: string, updates: Partial<AdminMedia>): Promise<void> {
    const index = currentState.media.findIndex((m) => m.id === id)
    if (index < 0) return

    const nextMedia = [...currentState.media]
    nextMedia[index] = { ...nextMedia[index], ...updates }
    persistAndBroadcast({ ...currentState, media: nextMedia })

    if (isSupabaseConfigured && supabase && nextMedia[index].path) {
      try {
        await supabase
          .from('media')
          .update({
            alt_text: updates.altText,
            caption: updates.caption,
            tags: updates.tags,
          })
          .eq('path', nextMedia[index].path)
        try {
          await supabase
            .from('media')
            .update({
              title: (updates as Partial<AdminMedia>).title,
              description: (updates as Partial<AdminMedia>).description,
              credit: (updates as Partial<AdminMedia>).credit,
              focal_x: (updates as Partial<AdminMedia>).focalX ?? null,
              focal_y: (updates as Partial<AdminMedia>).focalY ?? null,
              default_position_x: (updates as Partial<AdminMedia>).defaultPositionX ?? 50,
              default_position_y: (updates as Partial<AdminMedia>).defaultPositionY ?? 50,
            })
            .eq('path', nextMedia[index].path)
        } catch {
          // migration image-editor pas encore exécutée
        }
      } catch (err) {
        console.warn('Supabase media update error:', err)
      }
    }
  },

  async deleteMedia(id: string): Promise<void> {
    const item = currentState.media.find((m) => m.id === id)
    const nextMedia = currentState.media.filter((m) => m.id !== id)
    persistAndBroadcast({ ...currentState, media: nextMedia })

    if (isSupabaseConfigured && supabase && item?.path) {
      try {
        await supabase.storage.from('public-media').remove([item.path])
        await supabase.from('media').delete().eq('path', item.path)
      } catch (err) {
        console.warn('Supabase media delete error:', err)
      }
    }
  },

  // -------------------------------------------------------------
  // MESSAGES INBOX
  // -------------------------------------------------------------
  /**
   * Dépôt d'une demande publique (formulaires Contact et RMA).
   * Succès uniquement si Supabase confirme l'insertion : aucune confirmation
   * ne doit être affichée au visiteur sans réception effective côté admin.
   */
  async addIncomingMessage(
    msg: Omit<AdminMessage, 'id' | 'status' | 'createdAt'>,
  ): Promise<{ ok: true } | { ok: false; error: string }> {
    if (!isSupabaseConfigured || !supabase) {
      return { ok: false, error: 'Réception en ligne indisponible (base non configurée).' }
    }
    try {
      const { error } = await supabase.from('messages').insert({
        route: msg.route,
        name: msg.name.trim(),
        email: msg.email.trim(),
        organization: msg.organization || null,
        phone: msg.phone || null,
        event_date: msg.eventDate || null,
        place: msg.place || null,
        body: msg.body.trim(),
        status: 'nouveau',
      })
      if (error) {
        console.warn('Supabase message insert error:', error)
        return { ok: false, error: error.message }
      }
      return { ok: true }
    } catch (err) {
      console.warn('Supabase message insert error:', err)
      return { ok: false, error: err instanceof Error ? err.message : 'Erreur réseau.' }
    }
  },

  async updateMessageStatus(
    id: string,
    status: 'nouveau' | 'en_cours' | 'traite' | 'archive',
    internalNotes?: string,
  ): Promise<void> {
    const index = currentState.messages.findIndex((m) => m.id === id)
    if (index < 0) return

    const nextMessages = [...currentState.messages]
    nextMessages[index] = {
      ...nextMessages[index],
      status,
      internalNotes: internalNotes !== undefined ? internalNotes : nextMessages[index].internalNotes,
    }

    persistAndBroadcast({ ...currentState, messages: nextMessages })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').update({
          status,
          internal_notes: nextMessages[index].internalNotes,
        }).eq('id', id)
      } catch (err) {
        console.warn('Supabase message update error:', err)
      }
    }
  },

  async deleteMessage(id: string): Promise<void> {
    const nextMessages = currentState.messages.filter((m) => m.id !== id)
    persistAndBroadcast({ ...currentState, messages: nextMessages })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').delete().eq('id', id)
      } catch (err) {
        console.warn('Supabase message delete error:', err)
      }
    }
  },

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // CALENDRIER DE PUBLICATION & DIFFUSION MULTIPLATEFORMES — MODE MASTER
  // -------------------------------------------------------------
  async savePublication(post: SocialPost, authorName = 'Hervé Nanfang'): Promise<SocialPost> {
    const index = currentState.publications.findIndex((p) => p.id === post.id)
    const nextPublications = [...currentState.publications]
    const existingPost = index >= 0 ? currentState.publications[index] : null

    const currentHash = computeSocialPostHash(post)
    const nowIso = new Date().toISOString()

    let updatedPost: SocialPost = {
      ...post,
      updatedAt: nowIso,
    }

    // RÈGLE D'INVALIDATION STRICTE (AUDIT P0) :
    // Si la publication était déjà approuvée ('valide' ou 'programme') et qu'un élément
    // substantiel a été modifié (titre, date, heure, plateformes, textes, lien, média),
    // l'approbation précédente est AUTOMATIQUEMENT RÉVOQUÉE et le statut retombe à 'a_valider'.
    if (existingPost && (existingPost.status === 'valide' || existingPost.status === 'programme')) {
      const priorHash = existingPost.validationSignature?.contentHash
      if (priorHash && priorHash !== currentHash) {
        const invalidationLog: DecisionLog = {
          id: `log-${Date.now()}-inval`,
          action: 'invalidation',
          timestamp: nowIso,
          author: authorName,
          reason: 'Modification substantielle post-approbation : sceau révoqué, ré-approbation humaine requise.',
          contentHash: currentHash,
        }

        updatedPost.status = 'a_valider'
        updatedPost.validationSignature = {
          approvedBy: existingPost.validationSignature?.approvedBy || authorName,
          approvedAt: existingPost.validationSignature?.approvedAt || nowIso,
          contentHash: priorHash,
          isRevoked: true,
          revokedAt: nowIso,
          revocationReason: 'Contenu modifié après signature',
        }
        updatedPost.decisionHistory = [invalidationLog, ...(updatedPost.decisionHistory || [])]
      }
    } else if (existingPost && existingPost.status !== 'valide' && existingPost.status !== 'programme') {
      const modLog: DecisionLog = {
        id: `log-${Date.now()}-mod`,
        action: 'modification',
        timestamp: nowIso,
        author: authorName,
        reason: 'Mise à jour des contenus ou paramètres',
        contentHash: currentHash,
      }
      updatedPost.decisionHistory = [modLog, ...(updatedPost.decisionHistory || [])]
    }

    if (index >= 0) {
      nextPublications[index] = updatedPost
    } else {
      nextPublications.unshift(updatedPost)
    }

    persistAndBroadcast({ ...currentState, publications: nextPublications })

    // Persistance durable Supabase (P0)
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('publications').upsert({
          id: updatedPost.id,
          title: updatedPost.title,
          pillar: updatedPost.pillar,
          series: updatedPost.series,
          campaign: updatedPost.campaign,
          source_type: updatedPost.sourceType,
          source_slug: updatedPost.sourceSlug,
          source_title: updatedPost.sourceTitle,
          is_original_creation: Boolean(updatedPost.isOriginalCreation),
          scheduled_date: updatedPost.scheduledDate,
          scheduled_time: updatedPost.scheduledTime,
          status: updatedPost.status,
          platforms: updatedPost.platforms,
          content_by_platform: updatedPost.contentByPlatform,
          hook_variants: updatedPost.hookVariants || [],
          media_url: updatedPost.mediaUrl,
          link_url: updatedPost.linkUrl,
          cta_label: updatedPost.ctaLabel,
          target_audience: updatedPost.targetAudience,
          validation_signature: updatedPost.validationSignature,
          decision_history: updatedPost.decisionHistory,
          metrics: updatedPost.metrics,
          rejection_reason: updatedPost.rejectionReason,
          connector_status: updatedPost.connectorStatus,
          notes: updatedPost.notes,
          published_at: updatedPost.publishedAt,
          updated_at: updatedPost.updatedAt,
        })
      } catch (err) {
        console.warn('[ADMIN-STORE SUPABASE] Avertissement écriture publication :', err)
      }
    }

    return updatedPost
  },

  async approvePublication(
    id: string,
    approver = 'Hervé Nanfang',
    notes?: string,
  ): Promise<{ success: boolean; triggeredWebhook: boolean; error?: string }> {
    const post = currentState.publications.find((p) => p.id === id)
    if (!post) {
      return { success: false, triggeredWebhook: false, error: 'Publication introuvable.' }
    }

    const currentHash = computeSocialPostHash(post)
    const nowIso = new Date().toISOString()

    const approvalLog: DecisionLog = {
      id: `log-${Date.now()}-appr`,
      action: 'approbation',
      timestamp: nowIso,
      author: approver,
      reason: notes || 'Approbation explicite du contenu pour mise en ligne multiplateforme',
      contentHash: currentHash,
    }

    const approvedPost: SocialPost = {
      ...post,
      status: 'valide',
      validatedAt: nowIso,
      rejectionReason: undefined,
      validationSignature: {
        approvedBy: approver,
        approvedAt: nowIso,
        contentHash: currentHash,
        isRevoked: false,
      },
      decisionHistory: [approvalLog, ...(post.decisionHistory || [])],
      updatedAt: nowIso,
    }

    await this.savePublication(approvedPost, approver)

    // Déclenchement du Webhook d'automatisation si configuré
    let triggeredWebhook = false
    let webhookError: string | undefined = undefined

    const webhookUrl = currentState.settings.webhookUrl
    if (webhookUrl && webhookUrl.trim().startsWith('http')) {
      try {
        const response = await fetch(webhookUrl.trim(), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(currentState.settings.webhookSecret
              ? { 'X-HN-Webhook-Secret': currentState.settings.webhookSecret }
              : {}),
          },
          body: JSON.stringify({
            event: 'publication.approved',
            timestamp: nowIso,
            source: 'hervenanfang.vercel.app/admin',
            approvedBy: approver,
            post: approvedPost,
          }),
        })

        if (response.ok) {
          triggeredWebhook = true
        } else {
          webhookError = `Webhook a retourné le code HTTP ${response.status}`
        }
      } catch (err) {
        webhookError = err instanceof Error ? err.message : 'Échec d’appel réseau Webhook'
      }
    }

    return {
      success: true,
      triggeredWebhook,
      error: webhookError,
    }
  },

  async rejectPublication(
    id: string,
    reason: string,
    author = 'Hervé Nanfang',
  ): Promise<{ success: boolean; error?: string }> {
    const post = currentState.publications.find((p) => p.id === id)
    if (!post) return { success: false, error: 'Publication introuvable.' }

    const nowIso = new Date().toISOString()
    const rejectionLog: DecisionLog = {
      id: `log-${Date.now()}-rej`,
      action: 'refus',
      timestamp: nowIso,
      author,
      reason: reason || 'Révision demandée avant publication',
    }

    const rejectedPost: SocialPost = {
      ...post,
      status: 'refuse',
      rejectionReason: reason,
      validationSignature: post.validationSignature ? { ...post.validationSignature, isRevoked: true } : undefined,
      decisionHistory: [rejectionLog, ...(post.decisionHistory || [])],
      updatedAt: nowIso,
    }

    await this.savePublication(rejectedPost, author)
    return { success: true }
  },

  async schedulePublication(
    id: string,
    scheduledDate?: string,
    scheduledTime?: string,
    author = 'Hervé Nanfang',
  ): Promise<{ success: boolean; error?: string }> {
    const post = currentState.publications.find((p) => p.id === id)
    if (!post) return { success: false, error: 'Publication introuvable.' }

    const targetDate = scheduledDate || post.scheduledDate
    const targetTime = scheduledTime || post.scheduledTime
    const isSlotChanged = targetDate !== post.scheduledDate || targetTime !== post.scheduledTime

    // RÈGLE AUDIT CORRECTIF CRITIQUE (P0) :
    // Si le créneau change par rapport à l'approbation antérieure, celle-ci est caduque.
    // Le contenu repasse immédiatement en révision (a_valider).
    if (isSlotChanged) {
      const nowIso = new Date().toISOString()
      const invalidationLog: DecisionLog = {
        id: `log-${Date.now()}-slot-mod`,
        action: 'invalidation',
        timestamp: nowIso,
        author,
        reason: `Créneau modifié de (${post.scheduledDate} à ${post.scheduledTime}) vers (${targetDate} à ${targetTime}) : ré-approbation humaine exigée.`,
      }
      const reRevisionPost: SocialPost = {
        ...post,
        scheduledDate: targetDate,
        scheduledTime: targetTime,
        status: 'a_valider',
        validationSignature: post.validationSignature
          ? {
              ...post.validationSignature,
              isRevoked: true,
              revokedAt: nowIso,
              revocationReason: 'Créneau modifié post-approbation',
            }
          : undefined,
        decisionHistory: [invalidationLog, ...(post.decisionHistory || [])],
        updatedAt: nowIso,
      }

      await this.savePublication(reRevisionPost, author)
      return {
        success: false,
        error: `Le créneau a été modifié pour le ${targetDate} à ${targetTime}. Le contenu a été replacé dans le sas de révision pour validation.`,
      }
    }

    // Vérifier l'empreinte SHA-256 sur le contenu exact
    const currentHash = computeSocialPostHash(post)
    const sig = post.validationSignature

    if (!sig || sig.isRevoked || sig.contentHash !== currentHash) {
      return {
        success: false,
        error: 'Programmation impossible : l’empreinte SHA-256 ne correspond pas à une approbation scellée valide.',
      }
    }

    const nowIso = new Date().toISOString()
    const scheduleLog: DecisionLog = {
      id: `log-${Date.now()}-sched`,
      action: 'programmation',
      timestamp: nowIso,
      author,
      reason: `Programmation validée pour diffusion le ${post.scheduledDate} à ${post.scheduledTime}`,
      contentHash: currentHash,
    }

    const scheduledPost: SocialPost = {
      ...post,
      status: 'programme',
      decisionHistory: [scheduleLog, ...(post.decisionHistory || [])],
      updatedAt: nowIso,
    }

    await this.savePublication(scheduledPost, author)
    return { success: true }
  },

  async markPublicationAsPublished(
    id: string,
    author = 'Hervé Nanfang',
    mode: 'manuel' | 'webhook' = 'manuel',
    proof?: { proofUrl?: string; note?: string },
  ): Promise<{ success: boolean; error?: string }> {
    const post = currentState.publications.find((p) => p.id === id)
    if (!post) return { success: false, error: 'Publication introuvable.' }

    const currentHash = computeSocialPostHash(post)
    const sig = post.validationSignature

    // CONTRÔLE DE SÉCURITÉ ABSOLU :
    // Impossible de publier si l'empreinte SHA-256 ne correspond pas à l'approbation humaine enregistrée.
    if (!sig || sig.isRevoked || sig.contentHash !== currentHash) {
      return {
        success: false,
        error: 'Publication bloquée : contenu non scellé ou altéré par rapport à la version approuvée.',
      }
    }

    const nowIso = new Date().toISOString()
    const pubLog: DecisionLog = {
      id: `log-${Date.now()}-pub`,
      action: 'publication',
      timestamp: nowIso,
      author,
      reason:
        mode === 'webhook'
          ? 'Diffusion transmise au webhook automatisé'
          : `Partage certifié par l’administrateur${proof?.proofUrl ? ` (Preuve: ${proof.proofUrl})` : ''}`,
      contentHash: currentHash,
    }

    const publishedPost: SocialPost = {
      ...post,
      status: 'publie',
      publishedAt: nowIso,
      publicationProof: proof
        ? {
            proofUrl: proof.proofUrl,
            note: proof.note,
            publishedAt: nowIso,
            verifiedBy: author,
          }
        : post.publicationProof || {
            verifiedBy: author,
            publishedAt: nowIso,
            note: mode === 'webhook' ? 'Confirmation webhook certifiée' : 'Attestation manuelle par l’administrateur',
          },
      connectorStatus: {
        provider: mode,
        status: 'success',
        lastSyncAt: nowIso,
      },
      decisionHistory: [pubLog, ...(post.decisionHistory || [])],
      updatedAt: nowIso,
    }

    await this.savePublication(publishedPost, author)
    return { success: true }
  },

  async revokeApproval(
    id: string,
    reason = 'Annulation manuelle de l’approbation',
    author = 'Hervé Nanfang',
  ): Promise<{ success: boolean; error?: string }> {
    const post = currentState.publications.find((p) => p.id === id)
    if (!post) return { success: false, error: 'Publication introuvable.' }

    const nowIso = new Date().toISOString()
    const revLog: DecisionLog = {
      id: `log-${Date.now()}-rev`,
      action: 'invalidation',
      timestamp: nowIso,
      author,
      reason,
    }

    const revokedPost: SocialPost = {
      ...post,
      status: 'a_valider',
      validationSignature: post.validationSignature
        ? {
            ...post.validationSignature,
            isRevoked: true,
            revokedAt: nowIso,
            revocationReason: reason,
          }
        : undefined,
      decisionHistory: [revLog, ...(post.decisionHistory || [])],
      updatedAt: nowIso,
    }

    await this.savePublication(revokedPost, author)
    return { success: true }
  },

  async updatePublicationMetrics(id: string, metrics: PublicationMetrics): Promise<void> {
    const post = currentState.publications.find((p) => p.id === id)
    if (!post) return

    const updatedPost: SocialPost = {
      ...post,
      metrics: {
        ...(post.metrics || {}),
        ...metrics,
        lastUpdated: new Date().toISOString(),
      },
      updatedAt: new Date().toISOString(),
    }

    await this.savePublication(updatedPost)
  },

  async deletePublication(id: string): Promise<void> {
    const nextPublications = currentState.publications.filter((p) => p.id !== id)
    persistAndBroadcast({ ...currentState, publications: nextPublications })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('publications').delete().eq('id', id)
      } catch (err) {
        console.warn('Supabase publication delete error:', err)
      }
    }
  },

  exportCalendarIcs(): string {
    return exportPublicationsToIcs(currentState.publications)
  },
  async triggerWebhookTest(
    targetUrl: string,
    secret?: string,
  ): Promise<{ success: boolean; status?: number; error?: string }> {
    try {
      const samplePost = currentState.publications[0] || {
        id: 'test-sample',
        title: 'Publication de test Webhook',
        scheduledDate: new Date().toISOString().slice(0, 10),
        scheduledTime: '10:00',
        status: 'valide',
        platforms: ['linkedin', 'facebook', 'whatsapp'],
        contentByPlatform: {
          linkedin: {
            text: 'Test de transmission automatisée depuis la plateforme Hervé Nanfang.',
            hashtags: ['#Test', '#HerveNanfang'],
          },
        },
      }

      const res = await fetch(targetUrl.trim(), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(secret ? { 'X-HN-Webhook-Secret': secret } : {}),
        },
        body: JSON.stringify({
          event: 'test.ping',
          timestamp: new Date().toISOString(),
          environment: 'production',
          sender: 'Hervé Nanfang Admin Engine',
          samplePost,
        }),
      })

      if (res.ok) {
        return { success: true, status: res.status }
      }
      return { success: false, status: res.status, error: `Le serveur a répondu ${res.status} ${res.statusText}` }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Erreur de connexion (CORS ou réseau)',
      }
    }
  },

  // -------------------------------------------------------------
  // SETTINGS & BACKUP
  // -------------------------------------------------------------
  async updateSettings(settings: Partial<AdminSettings>): Promise<void> {
    const nextSettings = {
      ...currentState.settings,
      ...settings,
      updatedAt: new Date().toISOString(),
    }

    persistAndBroadcast({ ...currentState, settings: nextSettings })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('site_settings').upsert({
          key: 'general',
          value: nextSettings,
          updated_at: nextSettings.updatedAt,
        })
      } catch (err) {
        console.warn('Supabase settings update error:', err)
      }
    }
  },

  exportBackup(): string {
    return JSON.stringify(currentState, null, 2)
  },

  importBackup(jsonString: string): { success: boolean; error?: string } {
    try {
      const parsed = JSON.parse(jsonString)
      if (!parsed.articles || !parsed.projects) {
        return { success: false, error: 'Fichier de sauvegarde invalide.' }
      }
      persistAndBroadcast(parsed)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'JSON malformé.' }
    }
  },

  syncArticlesFromCode(): void {
    const freshArticles = getInitialArticles()
    persistAndBroadcast({ ...currentState, articles: freshArticles })
  },

  resetToDefaults(): void {
    const initial = createInitialState()
    persistAndBroadcast(initial)
  },
}
