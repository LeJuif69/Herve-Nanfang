/**
 * Index de recherche unifié pour la Palette de Commande (⌘K / Ctrl+K)
 * Regroupe les pages, les morceaux audio, les projets, les conférences et les articles.
 */

import { ARTICLES } from './articles'
import { AUDIO_PLAYLIST, type AudioTrack } from './audio'
import { CONFERENCES } from './conferences'
import { ALL_REPERTOIRE_SONGS, REPERTOIRE_CATEGORIES } from './repertoire'
import { NAV_PRIMARY, PILLARS } from './site'

export type SearchCategory =
  | 'navigation'
  | 'audio'
  | 'repertoire'
  | 'pedagogie'
  | 'conference'
  | 'article'
  | 'projet'

export interface SearchItem {
  id: string
  title: string
  subtitle: string
  category: SearchCategory
  categoryLabel: string
  to?: string
  track?: AudioTrack
  keywords: string[]
}

export function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // 1. Pages et Piliers majeurs
  NAV_PRIMARY.forEach((nav) => {
    items.push({
      id: `nav-${nav.to}`,
      title: nav.label,
      subtitle: 'Page principale',
      category: 'navigation',
      categoryLabel: 'Navigation',
      to: nav.to,
      keywords: [nav.label.toLowerCase(), 'page', 'rubrique'],
    })
  })

  PILLARS.forEach((pillar) => {
    items.push({
      id: `pillar-${pillar.verb.toLowerCase()}`,
      title: `${pillar.index} · ${pillar.verb}`,
      subtitle: pillar.keywords,
      category: 'navigation',
      categoryLabel: 'Piliers fondamentaux',
      to: pillar.to,
      keywords: [
        pillar.verb.toLowerCase(),
        pillar.keywords.toLowerCase(),
        'socle',
        'dimension',
      ],
    })
  })

  // 2. Extraits musicaux
  AUDIO_PLAYLIST.forEach((track) => {
    items.push({
      id: `audio-${track.id}`,
      title: track.title,
      subtitle: track.category,
      category: 'audio',
      categoryLabel: 'Extraits musicaux ♫',
      track,
      keywords: [
        track.title.toLowerCase(),
        track.category.toLowerCase(),
        'musique',
        'morceau',
        'audio',
        'piano',
        'live',
      ],
    })
  })

  // 2b. Univers du Répertoire du PianoBariste (441 titres)
  REPERTOIRE_CATEGORIES.forEach((cat) => {
    items.push({
      id: `rep-cat-${cat.id}`,
      title: `${cat.label} (${cat.count} titres)`,
      subtitle: `Répertoire Le PianoBariste™ · ${cat.description}`,
      category: 'repertoire',
      categoryLabel: 'Répertoire Live ♫',
      to: '/musique#catalogue-complet',
      keywords: [
        cat.label.toLowerCase(),
        cat.description.toLowerCase(),
        'repertoire',
        'chanson',
        'musique',
        'titres',
        'pianobariste',
      ],
    })
  })

  // 2c. Chansons du Répertoire consignées
  ALL_REPERTOIRE_SONGS.forEach((song) => {
    items.push({
      id: `rep-song-${song.id}`,
      title: `${song.title}${song.key ? ` (${song.key})` : ''}`,
      subtitle: song.artist ? `${song.artist} · ${song.categoryLabel}` : `Arrangement Piano · ${song.categoryLabel}`,
      category: 'repertoire',
      categoryLabel: 'Répertoire Live ♫',
      to: '/musique#catalogue-complet',
      keywords: [
        song.title.toLowerCase(),
        song.artist?.toLowerCase() || '',
        song.categoryLabel.toLowerCase(),
        song.key?.toLowerCase() || '',
        'repertoire',
        'chanson',
        'live',
      ],
    })
  })

  // 3. Conférences & Masterclasses
  CONFERENCES.forEach((conf, idx) => {
    items.push({
      id: `conf-${idx}`,
      title: conf.title,
      subtitle: `${conf.theme} · ${conf.audience}`,
      category: 'conference',
      categoryLabel: 'Conférences & Masterclasses',
      to: '/conferences',
      keywords: [
        conf.title.toLowerCase(),
        conf.theme.toLowerCase(),
        conf.pitch.toLowerCase(),
        'conférence',
        'masterclass',
      ],
    })
  })

  // 4. Articles du Journal du Musicien Augmenté
  ARTICLES.forEach((art) => {
    items.push({
      id: `art-${art.slug}`,
      title: art.title,
      subtitle: `${art.category} · Lecture ${art.readingTime}`,
      category: 'article',
      categoryLabel: 'Journal du Musicien Augmenté',
      to: `/journal/${art.slug}`,
      keywords: [
        art.title.toLowerCase(),
        art.category.toLowerCase(),
        art.excerpt.toLowerCase(),
        ...art.keywords.map((k) => k.toLowerCase()),
      ],
    })
  })

  // 5. Projets et Marques
  items.push(
    {
      id: 'proj-rma',
      title: 'RMA — Racines Musicales Academy®',
      subtitle: 'Formation musicale d’excellence & Pédagogie',
      category: 'pedagogie',
      categoryLabel: 'Projets & Marques',
      to: '/rma',
      keywords: ['rma', 'académie', 'racines musicales', 'cours', 'formation', 'piano'],
    },
    {
      id: 'brand-pianobariste',
      title: 'Le Pianobariste™ — Prestations Piano-Bar Live',
      subtitle: 'Solo piano-voix, duo prestige, live band & ambiance événementielle',
      category: 'projet',
      categoryLabel: 'Prestations & Live',
      to: '/musique',
      keywords: [
        'pianobariste',
        'piano bar',
        'piano-bar',
        'music live',
        'musique live',
        'live',
        'concert',
        'animation',
        'evenementiel',
        'cocktail',
        'hotel',
        'soiree',
        'piano voix',
        'pianiste',
      ],
    },
    {
      id: 'proj-musicien-augmente',
      title: 'Musicien Augmenté™',
      subtitle: 'L’IA appliquée à la musique et à la création',
      category: 'projet',
      categoryLabel: 'Projets & Marques',
      to: '/ia-technologie',
      keywords: ['musicien augmenté', 'ia', 'intelligence artificielle', 'technologie'],
    },
    {
      id: 'proj-booking',
      title: 'Booking & Contact Le Pianobariste',
      subtitle: 'Demande de prestation événementielle ou privée',
      category: 'navigation',
      categoryLabel: 'Contact & Booking',
      to: '/contact#booking',
      keywords: [
        'booking',
        'contact',
        'réservation',
        'devis',
        'prestation',
        'concert',
        'pianobariste',
        'piano bar',
        'music live',
        'musique live',
      ],
    },
  )

  return items
}

/**
 * Recherche insensible aux accents, à la casse et supportant le multi-mots
 */
export function searchItems(items: SearchItem[], query: string): SearchItem[] {
  const clean = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()

  const normalizedQuery = clean(query)
  if (!normalizedQuery) return items.slice(0, 10)

  const terms = normalizedQuery.split(/\s+/).filter(Boolean)

  return items
    .map((item) => {
      const cleanTitle = clean(item.title)
      const cleanSubtitle = clean(item.subtitle)
      const cleanKeywords = item.keywords.map(clean)

      let score = 0
      // Correspondance exacte de l'expression complète
      if (cleanTitle.includes(normalizedQuery)) score += 12
      if (cleanKeywords.some((k) => k === normalizedQuery)) score += 10
      if (cleanKeywords.some((k) => k.includes(normalizedQuery))) score += 8
      if (cleanSubtitle.includes(normalizedQuery)) score += 5

      // Correspondance de tous les mots saisis (ex: "piano" + "bar")
      const allTermsMatch = terms.every(
        (t) =>
          cleanTitle.includes(t) ||
          cleanSubtitle.includes(t) ||
          cleanKeywords.some((k) => k.includes(t)),
      )
      if (allTermsMatch) score += 6

      return { item, score }
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.item)
    .slice(0, 8)
}
