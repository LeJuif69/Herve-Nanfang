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

  // 2. La Scène Sonore (Pistes audio)
  AUDIO_PLAYLIST.forEach((track) => {
    items.push({
      id: `audio-${track.id}`,
      title: track.title,
      subtitle: track.category,
      category: 'audio',
      categoryLabel: 'La Scène Sonore ♫',
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
      keywords: ['booking', 'contact', 'réservation', 'devis', 'prestation', 'concert'],
    },
  )

  return items
}

/**
 * Recherche insensible aux accents et à la casse
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

  return items
    .filter((item) => {
      const matchTitle = clean(item.title).includes(normalizedQuery)
      const matchSubtitle = clean(item.subtitle).includes(normalizedQuery)
      const matchKeywords = item.keywords.some((k) => clean(k).includes(normalizedQuery))
      return matchTitle || matchSubtitle || matchKeywords
    })
    .slice(0, 8)
}
