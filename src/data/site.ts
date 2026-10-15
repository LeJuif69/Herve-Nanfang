/**
 * Configuration centrale du site — SOURCE CANONIQUE
 * Toutes les plateformes et marques dérivées doivent pointer vers ce domaine.
 *
 * Coordonnées confirmées. L’adresse générale / booking utilise l’email RMA
 * activement utilisé pour la réception des demandes et les parcours de contact.
 */

import { IDENTITY, MASTER_IDENTITY } from './identity'

export const SITE = {
  name: 'Hervé Nanfang',
  url: 'https://hervenanfang.vercel.app',
  tagline: 'Créer. Transmettre. Augmenter. Développer.',
  signatureLong: IDENTITY.positioningLine,
  /** Description de référence — identique sur toutes les plateformes. */
  referenceDescription: IDENTITY.referenceDescription,
  /** Rôles officiels — source : Master Identity. */
  roles: IDENTITY.roles,
  rolesShort: IDENTITY.rolesLine,
  city: IDENTITY.city,
  emailContact: 'racinesmusicalesacademy@gmail.com',
  emailRma: 'racinesmusicalesacademy@gmail.com',
  phones: [
    { display: '+237 694 72 34 92', tel: '+237694723492', whatsapp: '237694723492' },
    { display: '+237 682 18 02 66', tel: '+237682180266', whatsapp: '237682180266' },
  ],
  /**
   * Réseaux officiels. Les entrées sans URL vérifiée ne sont pas publiées en
   * tant que lien actif (voir `liensOfficiels` dans identity.ts).
   */
  socials: MASTER_IDENTITY.liensOfficiels
    .filter((link) => link.verifie && link.href && link.plateforme !== 'Site')
    .map((link) => ({ label: link.plateforme, href: link.href })),
  /** Marques et concepts — source : Master Identity. */
  marks: MASTER_IDENTITY.marques.map((m) => m.nom),
} as const

/* ------------------------------------------------------------------ */
/* Navigation                                                          */
/* ------------------------------------------------------------------ */

export type NavItem = { label: string; to: string }

export const NAV_PRIMARY: NavItem[] = [
  { label: 'Accueil', to: '/' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'Musique', to: '/musique' },
  { label: 'Pédagogie', to: '/pedagogie' },
  { label: 'Services', to: '/services' },
  { label: 'RMA', to: '/rma' },
  { label: 'IA & Technologie', to: '/ia-technologie' },
  { label: 'Projets', to: '/projets' },
  { label: 'Journal', to: '/journal' },
  { label: 'Conférences', to: '/conferences' },
  { label: 'Contact', to: '/contact' },
]

export const NAV_SECONDARY: NavItem[] = [
  { label: 'Formations', to: '/pedagogie#formations' },
  { label: 'Publications', to: '/pedagogie#publications' },
  { label: 'Presse & EPK', to: '/presse' },
  { label: 'Booking', to: '/contact#booking' },
]

/* ------------------------------------------------------------------ */
/* Les quatre dimensions (Master Prompt)                               */
/* ------------------------------------------------------------------ */

export type Pillar = {
  index: string
  verb: string
  keywords: string
  text: string
  to: string
}

export const PILLARS: Pillar[] = [
  {
    index: '01',
    verb: 'Créer',
    keywords: 'Musique · Son · Live',
    text: "De la scène à la production musicale, transformer les idées en œuvres sonores.",
    to: '/musique',
  },
  {
    index: '02',
    verb: 'Transmettre',
    keywords: 'Pédagogie · Recherche · Culture',
    text: "Rendre le savoir musical transmissible par l'enseignement, l'analyse et la recherche.",
    to: '/pedagogie',
  },
  {
    index: '03',
    verb: 'Augmenter',
    keywords: 'IA · Technologie · Innovation',
    text: "Mettre l'intelligence artificielle et la technologie au service du musicien, sans le remplacer.",
    to: '/ia-technologie',
  },
  {
    index: '04',
    verb: 'Développer',
    keywords: 'Digital & Entrepreneuriat',
    text: "Construire des stratégies digitales, des projets structurés et des marques culturelles durables.",
    to: '/projets',
  },
]

/* ------------------------------------------------------------------ */
/* Contacts — parcours différenciés (page Contact)                     */
/* ------------------------------------------------------------------ */

export type ContactRoute = {
  id: string
  label: string
  detail: string
  text: string
}

export const CONTACT_ROUTES: ContactRoute[] = [
  {
    id: 'booking',
    label: 'Booking',
    detail: 'Concert · Piano-Bar · Événement',
    text: 'Réserver une prestation live — solo piano, formation, événement privé ou institutionnel.',
  },
  {
    id: 'formation',
    label: 'Formation',
    detail: 'Cours · Masterclass · Formation professionnelle',
    text: 'Structurer un parcours d’apprentissage, une masterclass ou une formation pour votre structure.',
  },
  {
    id: 'conference',
    label: 'Conférence',
    detail: 'IA · Musique · Pédagogie · Culture',
    text: 'Inviter une intervention sur le musicien augmenté, la transformation numérique ou la pédagogie.',
  },
  {
    id: 'collaboration',
    label: 'Collaboration',
    detail: 'Projet artistique · culturel · numérique',
    text: 'Construire un projet à plusieurs — création, patrimoine, édition, technologie.',
  },
  {
    id: 'presse',
    label: 'Presse',
    detail: 'Interview · article · podcast',
    text: 'Obtenir un éclairage, une citation, une interview ou des éléments biographiques vérifiés.',
  },
  {
    id: 'conseil',
    label: 'Conseil',
    detail: 'IA · musique · digital · culture',
    text: 'Accompagner une organisation dans l’adoption des outils numériques et de l’IA.',
  },
]
