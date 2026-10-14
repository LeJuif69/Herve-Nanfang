/**
 * Projets — architecture de la page PROJETS (section 10 du master)
 * Cinq familles : artistiques, pédagogiques, technologiques, culturels, entrepreneuriaux.
 */

export type Project = {
  title: string
  volume: string
  description: string
  points: string[]
  to?: string
  status: 'Actif' | 'En développement' | 'Signature'
  mark?: '®' | '™' | ''
}

export type ProjectFamily = {
  id: string
  label: string
  intro: string
  projects: Project[]
}

export const PROJECT_FAMILIES: ProjectFamily[] = [
  {
    id: 'art',
    label: 'Art',
    intro: 'La scène, le son et la production : le socle de la pratique.',
    projects: [
      {
        title: 'Le Pianobariste',
        volume: 'Piano-Bar Live · depuis 2007',
        description:
          "Un format de piano live qui ne se contente pas d'accompagner une soirée : il installe une atmosphère, une couleur, une mémoire sonore du lieu.",
        points: ['Hôtels · Lounges · Événements', 'Répertoire jazz, blues, variété, africain', 'Live piano · Live mood · Live experience'],
        status: 'Signature',
        mark: '™',
      },
      {
        title: 'A LAIZ Music',
        volume: 'Création & production',
        description:
          "Composition, arrangement et production musicale pour des projets d'artistes, des institutions et des contenus audiovisuels.",
        points: ['Composition', 'Arrangement', 'Direction de production'],
        status: 'Actif',
      },
      {
        title: 'Productions & scène',
        volume: 'Spectacle vivant',
        description:
          'Conception et production de formats scéniques, direction musicale et accompagnement de projets live.',
        points: ['Direction musicale', 'Formats scéniques', 'Accompagnement d’artistes'],
        status: 'Actif',
      },
    ],
  },
  {
    id: 'pedagogie',
    label: 'Pédagogie',
    intro: 'Des méthodes, des curricula, des systèmes de progression, des ouvrages.',
    projects: [
      {
        title: 'Racines Musicales Academy®',
        volume: 'RMA · Formation & Curricula',
        description:
          "Un projet de formation musicale qui relie les pratiques contemporaines et le patrimoine musical africain : socle RMA-01 (Pulsation & Body) et programme intensif « Vacances Utiles ».",
        points: ['Curricula en 5 disciplines', 'Programme Vacances Utiles (7 sem.)', 'Restitution collective Damas–Petits Génies'],
        status: 'Actif',
        mark: '®',
        to: '/rma',
      },
      {
        title: 'Permis de Jouer™',
        volume: 'Progression & certification',
        description:
          "Un système de progression et d'évaluation continue instrument-agnostique organisé en 4 niveaux (N1 à N4) pour rendre l'apprentissage lisible et mesurable.",
        points: ['Paliers N1 à N4', 'Validation par compétences', 'Instrument-agnostique'],
        status: 'Actif',
        mark: '™',
        to: '/rma#permis-de-jouer',
      },
      {
        title: 'LES ZIKOS®',
        volume: 'Manuel pédagogique · 68 pages',
        description:
          'Projet de manuel pédagogique complet en cours de restructuration éditoriale et graphique : progression par unités, lisibilité des notions et activités instrumentales.',
        points: ['Manuel de 68 pages', 'Progression méthodologique', 'Notions fondamentales & exercices'],
        status: 'En développement',
        mark: '®',
        to: '/pedagogie#publications',
      },
    ],
  },
  {
    id: 'technologie',
    label: 'Technologie',
    intro: "L'IA et le numérique appliqués à la musique, à la pédagogie et aux institutions culturelles.",
    projects: [
      {
        title: 'Musicien Augmenté™',
        volume: 'IA × Musique',
        description:
          "Une approche et un label pour penser l'intelligence artificielle comme amplification du musicien — jamais comme substitut.",
        points: ['Conférences & masterclass', 'Méthodologie d’adoption', 'Cadre éthique'],
        status: 'Signature',
        mark: '™',
        to: '/ia-technologie#musicien-augmente',
      },
      {
        title: 'Workflows IA & Son',
        volume: 'Production & création',
        description:
          "Conception de chaînes de travail intégrant l'IA à chaque étape de la création musicale : idéation, arrangement, analyse, production, post-production.",
        points: ['Idéation assistée', 'Analyse assistée', 'Documentation des choix'],
        status: 'Actif',
      },
      {
        title: 'Laboratoires & Ateliers',
        volume: 'Innovation & transmission',
        description:
          'Pôles de conception en musique à l’image, production sonore en MAO, documentation patrimoniale et médiation musicale.',
        points: ['Musique à l’image', 'MAO avancée', 'Médiation culturelle'],
        status: 'En développement',
        to: '/pedagogie#programmes-developpement',
      },
    ],
  },
  {
    id: 'culture',
    label: 'Culture',
    intro: 'Recherche, patrimoine, transmission orale et entrepreneuriat culturel.',
    projects: [
      {
        title: 'ALAIZ Creative Systems',
        volume: 'Structure mère de l’écosystème',
        description:
          "La structure mère qui articule la production musicale (A LAIZ PROD), l'action culturelle et patrimoniale (A LAIZ Ô PAYS) et la formation musicale (RMA).",
        points: ['Gouvernance d’écosystème', 'Production & culture', 'Coordination de marques'],
        status: 'Signature',
      },
      {
        title: 'A LAIZ Ô PAYS',
        volume: 'Marque culturelle & patrimoniale',
        description:
          'Pôle dédié à la valorisation des patrimoines oraux, aux projets territoriaux et à la circulation des expressions artistiques traditionnelles et contemporaines.',
        points: ['Territoires', 'Patrimoines oraux', 'Projets culturels'],
        status: 'Actif',
      },
      {
        title: 'Tswefap & Batoufam',
        volume: 'Documentation linguistique & patrimoniale',
        description:
          "Projet de système d'écriture et de documentation linguistique consacré au Batoufam : constitution de corpus, conventions graphiques et manuel de référence.",
        points: ['Système d’écriture', 'Corpus linguistique', 'Manuel de référence'],
        status: 'En développement',
        to: '/culture-recherche',
      },
      {
        title: 'Le Concert des Guérisseurs',
        volume: 'Création & musicologie',
        description:
          'Projet musicologique et concert pour percussions et piano inspiré des musiques thérapeutiques pygmées et de l’African Wizarding Music.',
        points: ['Piano & percussions', 'Musiques thérapeutiques', 'Médiation & vulgarisation'],
        status: 'Actif',
      },
      {
        title: 'Recherche & Musique à l’image',
        volume: 'Musicologie appliquée',
        description:
          'Communications scientifiques et analyses sur les bandes originales de films (Harry Potter, cinéma d’horreur africain, transmédiatisation).',
        points: ['Conférences', 'Analyses de BO', 'Publications'],
        status: 'Actif',
        to: '/conferences',
      },
    ],
  },
]
