export type VideoCategory =
  | 'PIANO-BAR LIVE'
  | 'REPRISES LIVE'
  | 'LIVE SESSIONS'
  | 'DUO HERVÉ & FLAVIE'
  | 'SCÈNES & ÉVÉNEMENTS'

export interface Video {
  id: string
  title: string
  slug: string
  youtubeId: string
  category: VideoCategory
  description: string
  originalArtist: string
  performedBy: string
  orientation: 'vertical' | 'horizontal'
  tags?: string[]
  priority?: number
  thumbnail?: string
  publishedAt?: string
  featured?: boolean
}

export const videos: Video[] = [
  {
    id: 'pyromane-ferre-gola',
    title: 'Pyromane — Ferre Gola | Cover live par Hervé Nanfang',
    slug: 'pyromane-ferre-gola',
    youtubeId: '31YI4NAD5hw',
    category: 'REPRISES LIVE',
    description:
      'Redécouvrez « Pyromane », le titre emblématique de Ferre Gola, revisité au piano-bar par Hervé Nanfang (Le Pianobariste™). Entre sensibilité vocale, accompagnement acoustique et partage d’émotions.',
    originalArtist: 'Ferre Gola',
    performedBy: 'Hervé Nanfang',
    orientation: 'horizontal',
    thumbnail: 'https://i.ytimg.com/vi/31YI4NAD5hw/hqdefault.jpg',
    tags: [
      'Ferre Gola',
      'Pyromane',
      'cover',
      'reprise live',
      'musique africaine',
      'Piano-Bar',
      'Hervé Nanfang',
      'Rumba Congolaise',
      'Le Pianobariste',
    ],
    priority: 1,
    featured: true,
    publishedAt: '2026-11-07T00:00:00Z',
  },
]
