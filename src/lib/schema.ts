import { SITE } from '../data/site'
import { MASTER_IDENTITY, SAME_AS } from '../data/identity'

/**
 * Données structurées Schema.org (section 16 du master).
 * La Person est la racine : toutes les œuvres y sont rattachées par @id.
 */

export const PERSON_ID = `${SITE.url}/#person`
export const ORG_ID = `${SITE.url}/#organization`
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
  image: `${SITE.url}/og-image.jpg`,
  knowsAbout: MASTER_IDENTITY.schemaOrg.knowsAbout,
  knowsLanguage: MASTER_IDENTITY.schemaOrg.knowsLanguage,
  nationality: { '@type': 'Country', name: MASTER_IDENTITY.schemaOrg.nationality },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Yaoundé',
    addressCountry: 'CM',
  },
  worksFor: { '@id': ORG_ID },
  affiliation: MASTER_IDENTITY.marques
    .filter((m) => m.nom.startsWith('A LAIZ') || m.nom.startsWith('Racines'))
    .map((m) => ({ '@type': 'Organization', name: m.nom })),
  // sameAs : uniquement les liens officiels vérifiés (une URL erronée nuit
  // plus qu'une absence de lien). Voir `liensOfficiels` dans identity.ts.
  sameAs: SAME_AS,
  mainEntityOfPage: { '@id': SITE_ID },
}

export const organizationSchema: Record<string, unknown> = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORG_ID,
  name: 'Alaiz Creative Systems',
  description:
    'Structure de production artistique et culturelle fondée par Hervé Nanfang : production musicale, événementiel, conseil en technologies créatives.',
  url: SITE.url,
  founder: { '@id': PERSON_ID },
  location: { '@type': 'Place', name: 'Yaoundé, Cameroun' },
  knowsAbout: ['Production musicale', 'Événementiel culturel', 'IA et industries culturelles'],
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
  provider = 'Racines Musicales Academy®',
): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Course',
  name,
  description,
  inLanguage: 'fr',
  provider: { '@type': 'Organization', name: provider, founder: { '@id': PERSON_ID } },
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
}): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: input.title,
  description: input.description,
  articleSection: input.section,
  inLanguage: 'fr',
  url: `${SITE.url}/journal/${input.slug}`,
  mainEntityOfPage: `${SITE.url}/journal/${input.slug}`,
  author: { '@id': PERSON_ID },
  publisher: { '@id': PERSON_ID },
  ...(input.status === 'Publié'
    ? { datePublished: '2026-01-01' }
    : { creativeWorkStatus: input.status }),
})

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
