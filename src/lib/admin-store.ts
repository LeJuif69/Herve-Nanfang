import { isSupabaseConfigured, supabase } from './supabase'
import { ARTICLES, Article } from '../data/articles'
import { PROJECT_FAMILIES } from '../data/projects'
import { CONFERENCES } from '../data/conferences'
import { MUSIC_SECTIONS } from '../data/music'
import { SITE } from '../data/site'
import { MASTER_IDENTITY } from '../data/identity'
import type {
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
} from './admin-types'

const LOCAL_STORE_KEY = 'hn_admin_store_v1'

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
]

function getInitialArticles(): AdminArticle[] {
  return ARTICLES.map((a: Article, index: number) => ({
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
    publishedAt: a.status === 'Publié' ? '2026-03-01T10:00:00Z' : undefined,
    updatedAt: new Date(Date.now() - (index * 86400000)).toISOString(),
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
    {
      id: 'med-about-portrait',
      bucket: 'public-media',
      path: 'about-portrait-yaounde.webp',
      url: '/images/about-portrait-yaounde.webp',
      filename: 'about-portrait-yaounde.webp',
      altText: 'Portrait officiel de Hervé Nanfang en extérieur à Yaoundé',
      caption: 'Portrait éditorial officiel (Page À propos & Presse)',
      tags: ['Portrait', 'À propos', 'Presse', 'Identité'],
      mimeType: 'image/webp',
      sizeBytes: 640850,
      width: 760,
      height: 1353,
      defaultPositionX: 50,
      defaultPositionY: 28,
      focalX: 50,
      focalY: 28,
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
      width: 1400,
      height: 900,
      defaultPositionX: 50,
      defaultPositionY: 45,
      focalX: 50,
      focalY: 45,
      createdAt: '2026-03-05T00:00:00Z',
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
      width: 1600,
      height: 1067,
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
      width: 800,
      height: 800,
      defaultPositionX: 50,
      defaultPositionY: 35,
      focalX: 50,
      focalY: 35,
      createdAt: '2026-03-01T00:00:00Z',
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
      width: 1600,
      height: 900,
      defaultPositionX: 50,
      defaultPositionY: 50,
      focalX: 50,
      focalY: 50,
      createdAt: '2026-03-03T00:00:00Z',
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
      id: 'med-og',
      bucket: 'public-media',
      path: 'og-image.jpg',
      url: '/og-image.jpg',
      filename: 'og-image.jpg',
      altText: 'Bannière Open Graph officielle Hervé Nanfang',
      caption: 'Visuel de partage réseaux sociaux',
      tags: ['SEO', 'OpenGraph'],
      mimeType: 'image/jpeg',
      sizeBytes: 95000,
      width: 1200,
      height: 630,
      createdAt: '2026-03-06T00:00:00Z',
    },
  ]
}

function getInitialMessages(): AdminMessage[] {
  return [
    {
      id: 'msg-1',
      name: 'Direction Culturelle Hilton Yaoundé',
      email: 'events@hiltonyaounde.example',
      organization: 'Hilton Yaoundé',
      phone: '+237 699 00 11 22',
      route: 'booking',
      eventDate: '2026-11-20',
      place: 'Yaoundé · Salle panoramique',
      body: 'Bonjour Maître Nanfang, nous souhaitons planifier une série de soirées Piano-Bar Signature pour le lancement de notre nouvelle programmation artistique.',
      status: 'nouveau',
      internalNotes: 'Demande prioritaire — recontacter par WhatsApp.',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'msg-2',
      name: 'Conservatoire National des Arts',
      email: 'pedagogie@cna-arts.example',
      organization: 'Conservatoire Régional',
      phone: '+33 6 12 34 56 78',
      route: 'formation',
      eventDate: '2026-12-05',
      place: 'Paris / Visio',
      body: 'Proposition de masterclass de 3h sur l’approche « Musicien Augmenté™ » et l’intégration de l’IA dans les programmes de MAO.',
      status: 'en_cours',
      internalNotes: 'Programme envoyé par email.',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'msg-3',
      name: 'Revue Cultures & Médias Africains',
      email: 'redaction@cma-journal.example',
      organization: 'Magazine Électronique',
      route: 'presse',
      body: 'Demande d’interview approfondie sur la transition MAO -> IA et les enjeux de la souveraineté culturelle musicale.',
      status: 'traite',
      internalNotes: 'Interview calée pour fin octobre.',
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ]
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

  const media = (state.media || []).map((m) => {
    if (m.url && m.url.startsWith('blob:')) {
      hasChanges = true
      return {
        ...m,
        url: resolveValidMediaUrl(m.url, m.filename || m.path),
      }
    }
    return m
  })

  const articles = (state.articles || []).map((a) => {
    if (a.coverImage && a.coverImage.startsWith('blob:')) {
      hasChanges = true
      return { ...a, coverImage: resolveValidMediaUrl(a.coverImage) }
    }
    return a
  })

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

  const sanitized = { ...state, media, articles, projects, services }
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
    settings: getInitialSettings(),
    lastSyncAt: new Date().toISOString(),
  }
}

let currentState: AdminState = (() => {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed.articles && parsed.projects) {
          return sanitizeLoadedState(parsed)
        }
      }
    }
  } catch {
    // ignore
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
      const [artRes, prjRes, msgRes, medRes, setRes] = await Promise.all([
        supabase.from('articles').select('*').order('pillar_number', { ascending: true }),
        supabase.from('projects').select('*').order('position', { ascending: true }),
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('media').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*'),
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
          updatedAt: row.updated_at || new Date().toISOString(),
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
          updatedAt: row.updated_at || new Date().toISOString(),
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
          next.settings = { ...next.settings, ...generalSetting.value }
          updated = true
        }
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
        published_at: a.publishedAt || (a.status === 'Publié' ? new Date().toISOString() : null),
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

      return {
        success: true,
        count: articlesRows.length + projectsRows.length,
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
  async addIncomingMessage(msg: Omit<AdminMessage, 'id' | 'status' | 'createdAt'>): Promise<AdminMessage> {
    const newMsg: AdminMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      status: 'nouveau',
      createdAt: new Date().toISOString(),
    }

    const nextMessages = [newMsg, ...currentState.messages]
    persistAndBroadcast({ ...currentState, messages: nextMessages })

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('messages').insert({
          route: newMsg.route,
          name: newMsg.name,
          email: newMsg.email,
          organization: newMsg.organization,
          phone: newMsg.phone,
          event_date: newMsg.eventDate || null,
          place: newMsg.place,
          body: newMsg.body,
          status: 'nouveau',
        })
      } catch (err) {
        console.warn('Supabase message insert error:', err)
      }
    }

    return newMsg
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
