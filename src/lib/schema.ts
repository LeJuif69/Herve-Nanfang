import { SITE } from '../data/site'
import { MASTER_IDENTITY, SAME_AS } from '../data/identity'

/**
 * Données structurées Schema.org (section 16 du master).
 * La Person est la racine : toutes les œuvres y sont rattachées par @id.
 */

export const PERSON_ID = `${SITE.url}/#person`
export const ORG_ID = `${SITE.url}/#alaizopays`
export const SITE_ID = `${SITE.url}/#website`

export const personSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': PERSON_ID,
  name: SITE.name,
  alternateName: [...MASTER_IDENTITY.identite.variantes],
  disambiguatingDescription: MASTER_IDENTITY.positionnement.desambiguisation,
  jobTitle: MASTER_IDENTITY.schemaOrg.jobTitle,
  description: SITE.signatureLong,
  url: SITE.url,
  image: [
    `${SITE.url}/images/herve-nanfang-portrait-officiel.webp`,
    `${SITE.url}/images/herve-nanfang-piano-bar-live.jpeg`,
    `${SITE.url}/images/herve-nanfang-studio-transmission-isma.webp`,
    `${SITE.url}/og-image.jpg`,
  ],
  knowsAbout: MASTER_IDENTITY.schemaOrg.knowsAbout,
  knowsLanguage: MASTER_IDENTITY.schemaOrg.knowsLanguage,
  nationality: { '@type': 'Country', name: MASTER_IDENTITY.schemaOrg.nationality },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yaoundé',
    addressCountry: 'CM',
  },
  alumniOf: [
    {
      '@type': 'CollegeOrUniversity',
      name: 'Université de Dschang',
      description: 'Licence Arts du Spectacle & Management Culturel',
    },
  ],
  hasOccupation: [
    {
      '@type': 'Occupation',
      name: 'Artiste-Musicien & Pianiste Live',
      description: 'Prestations de piano-bar live de prestige, répertoires internationaux et jazz.',
    },
    {
      '@type': 'Occupation',
      name: 'Musicologue & Chercheur',
      description: 'Recherches sur les traditions musicales orales et les polyrythmies du Cameroun.',
    },
    {
      '@type': 'Occupation',
      name: 'Pédagogue & Directeur d’Académie',
      description: 'Fondateur de A Laiz Academy (ex-Racines Musicales Academy) et concepteur du Permis de Jouer™.',
    },
    {
      '@type': 'Occupation',
      name: 'Ingénieur du Son & Producteur MAO',
      description: 'Prise de son acoustique, mixage audio, composition assistée par ordinateur.',
    },
    {
      '@type': 'Occupation',
      name: 'Spécialiste IA & Musicien Augmenté™',
      description: 'Intégration éthique de l’intelligence artificielle générative dans les filières culturelles.',
    },
  ],
  brand: { '@id': ORG_ID },
  affiliation: [
    {
      '@type': 'EducationalOrganization',
      name: 'A Laiz Academy',
      alternateName: ['Racines Musicales Academy', 'RMA'],
      url: `${SITE.url}/rma`,
    },
  ],
  // sameAs : uniquement les liens officiels vérifiés (une URL erronée nuit
  // plus qu'une absence de lien). Voir `liensOfficiels` dans identity.ts.
  sameAs: SAME_AS,
  mainEntityOfPage: { '@id': SITE_ID },
}

export const organizationSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Brand',
  '@id': ORG_ID,
  name: 'A Laiz Ô Pays',
  description:
    'A Laiz Ô Pays est le concept artistique et culturel fondateur de Hervé Nanfang. Il fédère son univers créatif et les projets qui s’y rattachent, de la musique à la transmission, en passant par la production et l’exploration des technologies.',
  url: SITE.url,
  sameAs: ['https://www.threads.com/@alaizopays'],
}

export const websiteSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': SITE_ID,
  url: SITE.url,
  name: SITE.name,
  inLanguage: 'fr-FR',
  description: SITE.signatureLong,
  publisher: { '@id': PERSON_ID },
  about: { '@id': PERSON_ID },
}

export const serviceSchema = (
  name: string,
  description: string,
  area: string,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  serviceType: area,
  provider: { '@id': PERSON_ID },
  areaServed: [
    { '@type': 'Country', name: 'Cameroun' },
    { '@type': 'Place', name: 'International' },
  ],
})

export const courseSchema = (
  name: string,
  description: string,
  provider = 'A Laiz Academy',
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  description,
  inLanguage: 'fr',
  provider: {
    '@type': 'EducationalOrganization',
    name: provider,
    alternateName: ['Racines Musicales Academy', 'RMA'],
    founder: { '@id': PERSON_ID },
  },
  hasCourseInstance: {
    '@type': 'CourseInstance',
    courseMode: ['onsite', 'online'],
    location: { '@type': 'Place', name: 'Yaoundé, Cameroun' },
  },
})

export const eventSchema = (
  name: string,
  description: string,
  startDate?: string,
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Event',
  name,
  description,
  ...(startDate ? { startDate } : {}),
  performer: { '@id': PERSON_ID },
  eventStatus: 'https://schema.org/EventScheduled',
  location: { '@type': 'Place', name: 'Cameroun' },
})

export const conferenceEducationEventSchema = (input: {
  title: string
  pitch: string
  duration: string
  audience: string
  objectives: string[]
  deliverables: string[]
  theme: string
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'EducationEvent',
  name: `Conférence — « ${input.title} »`,
  alternateName: input.theme,
  description: input.pitch,
  teaches: input.objectives,
  eventAttendanceMode: 'https://schema.org/MixedEventAttendanceMode',
  eventStatus: 'https://schema.org/EventScheduled',
  inLanguage: ['fr', 'en'],
  audience: {
    '@type': 'Audience',
    audienceType: input.audience,
  },
  performer: {
    '@id': PERSON_ID,
    '@type': 'Person',
    name: 'Hervé Nanfang',
    jobTitle: 'Artiste-Musicien, Musicologue & Spécialiste IA',
  },
  organizer: {
    '@id': PERSON_ID,
    '@type': 'Person',
    name: 'Hervé Nanfang',
  },
  offers: {
    '@type': 'Offer',
    category: 'Intervention sur mesure',
    availability: 'https://schema.org/InStock',
    url: `${SITE.url}/conferences`,
  },
  location: {
    '@type': 'Place',
    name: 'Cameroun & International (Présentiel ou Visioconférence)',
  },
})

export const permisDeJouerProgramSchema = (): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'EducationalOccupationalProgram',
  name: 'Permis de Jouer™ — Référentiel de Progression et d’Évaluation Pédagogique',
  description:
    'Méthode propriétaire structurée en 4 paliers (A: Blanc, B: Jaune, C: Orange, D: Rouge) développée par Hervé Nanfang au sein de A Laiz Academy (anciennement Racines Musicales Academy — RMA).',
  educationalCredentialAwarded: 'Attestation interne de compétences Permis de Jouer (Paliers A, B, C, D)',
  provider: {
    '@type': 'EducationalOrganization',
    name: 'A Laiz Academy',
    alternateName: ['Racines Musicales Academy', 'RMA'],
    url: `${SITE.url}/rma`,
    founder: { '@id': PERSON_ID },
  },
  hasCourse: [
    {
      '@type': 'Course',
      name: 'Permis A (Ceinture Blanche) — Fondations & Éveil',
      description: 'Posture, décontraction, lecture en clés de Sol et de Fa, pulsation et premières pièces de mémoire.',
      timeToComplete: 'P3M/P6M',
    },
    {
      '@type': 'Course',
      name: 'Permis B (Ceinture Jaune) — Autonomie & Méthode',
      description: 'Gammes, déchiffrage à vue, indépendance des mains, nuances et jeu collectif.',
      timeToComplete: 'P6M/P9M',
    },
    {
      '@type': 'Course',
      name: 'Permis C (Ceinture Orange) — Expression & Interprétation',
      description: 'Accords enrichis, polyrythmie africaine, improvisation modale et répertoire autonome sans partition.',
      timeToComplete: 'P9M/P12M',
    },
    {
      '@type': 'Course',
      name: 'Permis D (Ceinture Rouge) — Scène, Studio & Professionnalisation',
      description: 'Répertoire de scène transversal, arrangement, direction musicale et jury professionnel.',
      timeToComplete: 'P12M/P18M',
    },
  ],
})

export const musicGroupSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'MusicGroup',
  name: 'Le Pianobariste',
  alternateName: 'Hervé Nanfang',
  description:
    'Format de piano live créé par Hervé Nanfang : jazz, blues, variété, musiques africaines et standards, pour hôtels, lounges et événements.',
  member: { '@id': PERSON_ID },
  genre: ['Jazz', 'Blues', 'Musiques africaines', 'Variété'],
  foundingLocation: { '@type': 'Place', name: 'Cameroun' },
}

export const creativeWorkSchema = (
  name: string,
  description: string,
  type: 'CreativeWork' | 'Book' | 'SoftwareApplication' | 'Article' = 'CreativeWork',
  author = 'Hervé Nanfang',
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': type,
  name,
  description,
  author: { '@id': PERSON_ID },
  ...(author === 'Hervé Nanfang' ? {} : { creator: { '@type': 'Organization', name: author } }),
})

export const articleSchema = (input: {
  title: string
  description: string
  slug: string
  section: string
  status: string
  datePublished?: string
  dateModified?: string
  image?: string
  authorName?: string
}): Record<string, unknown> => {
  const pubDate = input.datePublished?.trim() || undefined
  const modDate = input.dateModified?.trim() || pubDate
  const imageUrl = input.image
    ? input.image.startsWith('http')
      ? input.image
      : `${SITE.url}${input.image.startsWith('/') ? input.image : `/${input.image}`}`
    : `${SITE.url}/images/shooting-pro-officiel.webp`

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    articleSection: input.section,
    inLanguage: 'fr-FR',
    url: `${SITE.url}/journal/${input.slug}`,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE.url}/journal/${input.slug}`,
    },
    image: imageUrl,
    author: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: input.authorName || 'Hervé Nanfang',
      url: SITE.url,
      jobTitle: 'Artiste-Pianiste, Musicologue & Ingénieur Sonore',
    },
    publisher: {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: 'Hervé Nanfang',
      url: SITE.url,
    },
    ...(pubDate ? { datePublished: pubDate } : {}),
    ...(modDate ? { dateModified: modDate } : {}),
    ...(input.status === 'Publié' ? {} : { creativeWorkStatus: input.status }),
  }
}

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: `${SITE.url}${item.path}`,
  })),
})

export const faqSchema = (items: { q: string; a: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: { '@type': 'Answer', text: item.a },
  })),
})
