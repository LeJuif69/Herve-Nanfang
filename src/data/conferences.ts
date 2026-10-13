/**
 * Conférences & Masterclass — page commerciale (section 13 du master)
 */

export type Conference = {
  theme: string
  title: string
  pitch: string
  audience: string
  formats: string[]
}

export const CONFERENCES: Conference[] = [
  {
    theme: 'Musique & IA',
    title: 'Le musicien augmenté',
    pitch:
      "Comment un musicien professionnel peut intégrer l'intelligence artificielle dans sa pratique sans perdre sa voix, son identité et sa valeur artistique.",
    audience: 'Écoles de musique, conservatoires, festivals, institutions culturelles',
    formats: ['Conférence 45–60 min', 'Masterclass 2–3 h', 'Atelier pratique'],
  },
  {
    theme: 'Transformation numérique',
    title: 'De la MAO à l’IA',
    pitch:
      'Ce que la révolution de la MAO a appris au monde musical — et ce que la révolution de l’IA va exiger de lui, en compétences, en organisation et en lucidité.',
    audience: 'Entreprises créatives, institutions, associations professionnelles',
    formats: ['Conférence', 'Table ronde', 'Séminaire'],
  },
  {
    theme: 'Pédagogie',
    title: 'Enseigner la musique à l’ère de l’intelligence artificielle',
    pitch:
      "Repenser les programmes, les évaluations et la place de l'élève quand les outils savent produire, analyser et corriger. Le rôle du professeur devient plus décisif que jamais.",
    audience: 'Enseignants, directions pédagogiques, ministères, centres de formation',
    formats: ['Conférence', 'Formation d’enseignants', 'Journée pédagogique'],
  },
  {
    theme: 'Carrière',
    title: 'Construire sa carrière musicale à l’ère digitale',
    pitch:
      "Compétences, positionnement, revenus, présence en ligne : les fondations d'une carrière musicale structurée dans un écosystème transformé par le numérique.",
    audience: 'Étudiants en musique, artistes émergents, incubateurs culturels',
    formats: ['Conférence', 'Atelier', 'Programme d’accompagnement'],
  },
  {
    theme: 'Communication',
    title: 'Le musicien comme marque',
    pitch:
      "Un musicien professionnel n'est pas seulement un interprète : c'est une marque, un récit, une proposition de valeur. Méthode pour la construire sans se trahir.",
    audience: 'Artistes, collectifs, agences, écoles de musique',
    formats: ['Conférence', 'Atelier branding', 'Coaching de groupe'],
  },
]

export const CONFERENCE_AUDIENCES = [
  'Écoles et conservatoires',
  'Universités',
  'Institutions culturelles',
  'Festivals et événements',
  'Entreprises et organisations',
  'Médias',
]
