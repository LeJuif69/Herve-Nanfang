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
    "id": "piano-bar-lounge-prestige",
    "title": "Ambiance Piano-Bar Feutrée pour Hôtels & Palaces",
    "slug": "piano-bar-lounge-prestige",
    "youtubeId": "31YI4NAD5hw",
    "category": "Hôtels",
    "description": "Une présence sonore subtile et continue au piano acoustique. Idéal pour les salons de grands hôtels (Hilton, Mont Fébé, Djeuga Palace), dîners diplomatiques et espaces lounge.",
    "originalArtist": "Répertoire Varié & International",
    "performedBy": "Hervé Nanfang (Le Pianobariste™)",
    "orientation": "horizontal",
    "thumbnail": "https://i.ytimg.com/vi/31YI4NAD5hw/hqdefault.jpg",
    "publishedAt": "2026-11-01T00:00:00Z",
    "summary": "Standards internationaux, chanson française et mélodies intemporelles au piano solo.",
    "tags": [
      "Piano-Bar",
      "Hôtel",
      "Lounge",
      "Solo Prestige",
      "Yaoundé"
    ],
    "priority": 1,
    "featured": true,
    "cta": {
      "label": "Réserver la formule Hôtel & Lounge →",
      "link": "/reservation?type=booking&formula=lounge"
    }
  },
  {
    "id": "duo-signature-mariages",
    "title": "Duo Piano & Voix — Célébrations de Mariage & Cocktails",
    "slug": "duo-signature-mariages",
    "youtubeId": "31YI4NAD5hw",
    "category": "Mariages",
    "description": "L’alchimie complice de Flavie (voix chaleureuse) et d’Hervé Nanfang (piano virtuose). Le duo accompagne les moments clés de vos noces, du cocktail au dîner d’exception.",
    "summary": "Ballades soul, pop acoustique, rumba romantique et classiques gospel sur mesure.",
    "originalArtist": "Hervé & Flavie",
    "performedBy": "Duo Hervé & Flavie",
    "orientation": "horizontal",
    "thumbnail": "https://i.ytimg.com/vi/31YI4NAD5hw/hqdefault.jpg",
    "publishedAt": "2026-11-03T00:00:00Z",
    "tags": [
      "Mariage",
      "Cocktail",
      "Duo Piano-Voix",
      "Hervé & Flavie",
      "Événementiel"
    ],
    "priority": 2,
    "featured": true,
    "cta": {
      "label": "Réserver la formule Mariage →",
      "link": "/reservation?type=booking&formula=prestige"
    }
  },
  {
    "id": "soirees-galas-entreprises",
    "title": "Prestations Corporate & Galas d’Entreprises",
    "slug": "soirees-galas-entreprises",
    "youtubeId": "31YI4NAD5hw",
    "category": "Entreprises",
    "description": "Une direction musicale adaptée aux exigences protocolaires des réceptions officielles, clôtures d’assemblées générales, remises de prix et galas institutionnels.",
    "summary": "Accompagnement sonore d’événements corporate avec transition fluide entre les temps forts.",
    "originalArtist": "Créations & Standards",
    "performedBy": "Hervé Nanfang & Ensembles Scéniques",
    "orientation": "horizontal",
    "thumbnail": "https://i.ytimg.com/vi/31YI4NAD5hw/hqdefault.jpg",
    "publishedAt": "2026-11-05T00:00:00Z",
    "tags": [
      "Corporate",
      "Gala",
      "Entreprises",
      "Protocole",
      "Cameroun"
    ],
    "priority": 3,
    "featured": true,
    "cta": {
      "label": "Demander un devis Corporate →",
      "link": "/reservation?type=booking&formula=corporate"
    }
  },
  {
    "id": "pyromane-ferre-gola",
    "title": "Pyromane — Ferre Gola | Cover live par Hervé Nanfang",
    "slug": "pyromane-ferre-gola",
    "youtubeId": "31YI4NAD5hw",
    "category": "Concerts",
    "description": "Redécouvrez « Pyromane », le titre emblématique de Ferre Gola, revisité au piano-bar par Hervé Nanfang (Le Pianobariste™). Entre sensibilité vocale, accompagnement acoustique et partage d’émotions.",
    "summary": "Rumba congolaise et polyrythmies revisitées au piano-bar acoustique.",
    "originalArtist": "Ferre Gola",
    "performedBy": "Hervé Nanfang",
    "orientation": "horizontal",
    "thumbnail": "https://i.ytimg.com/vi/31YI4NAD5hw/hqdefault.jpg",
    "publishedAt": "2026-11-07T00:00:00Z",
    "tags": [
      "Ferre Gola",
      "Pyromane",
      "Concert",
      "Rumba Congolaise",
      "Festival"
    ],
    "priority": 4,
    "featured": true,
    "cta": {
      "label": "Programmer en Concert / Festival →",
      "link": "/reservation?type=booking&formula=liveband"
    }
  },
  {
    "id": "masterclass-permis-de-jouer",
    "title": "Masterclass Pédagogique & Méthode Permis de Jouer™",
    "slug": "masterclass-permis-de-jouer",
    "youtubeId": "31YI4NAD5hw",
    "category": "Formation",
    "description": "Démonstration pratique de la pédagogie Permis de Jouer™ (paliers N1 à N4). Enseignement à l’ISMA, ESAS et A Laiz Academy axé sur l’écoute harmonique et le déchiffrage scénique.",
    "summary": "Transmission musicale structurée pour étudiants, conservatoires et écoles de musique.",
    "originalArtist": "A Laiz Academy",
    "performedBy": "Hervé Nanfang (Pédagogue & Formateur)",
    "orientation": "horizontal",
    "thumbnail": "https://i.ytimg.com/vi/31YI4NAD5hw/hqdefault.jpg",
    "publishedAt": "2026-11-09T00:00:00Z",
    "tags": [
      "Pédagogie",
      "Permis de Jouer",
      "Masterclass",
      "Formation",
      "RMA"
    ],
    "priority": 5,
    "featured": true,
    "cta": {
      "label": "Organiser une Masterclass / Formation →",
      "link": "/reservation?type=formation"
    }
  }
]
