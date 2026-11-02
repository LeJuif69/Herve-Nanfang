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
    title: 'PYROMANE — Ferre Gola | Reprise Live par Hervé Nanfang',
    slug: 'pyromane-ferre-gola',
    youtubeId: 'YwXm05hJYCg',
    category: 'REPRISES LIVE',
    description:
      'Reprise live au piano-bar du titre emblématique « Pyromane » de Ferre Gola par Hervé Nanfang. Une nouvelle lecture, une même émotion.',
    originalArtist: 'Ferre Gola',
    performedBy: 'Hervé Nanfang',
    orientation: 'vertical',
    thumbnail: '/images/pyromane-reprise-live-herve-nanfang.jpg',
    tags: [
      'Ferre Gola',
      'Pyromane',
      'cover',
      'reprise live',
      'musique africaine',
      'Piano-Bar',
      'Hervé Nanfang',
    ],
    priority: 1,
    featured: true,
    publishedAt: '2026-03-01T12:00:00Z',
  },
]
