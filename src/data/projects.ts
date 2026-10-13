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
        volume: 'RMA',
        description:
          "Un projet de formation musicale qui relie les pratiques contemporaines et le patrimoine musical africain, avec une exigence de méthode et de suivi.",
        points: ['Curricula structurés', 'Formation d’enseignants', 'Ouverture patrimoniale'],
        status: 'En développement',
        mark: '®',
      },
      {
        title: 'Permis de Jouer™',
        volume: 'Progression & certification',
        description:
          "Un système de progression et de certification qui rend l'apprentissage musical lisible : objectifs, paliers, validation, autonomie de l'élève.",
        points: ['Paliers de progression', 'Certification', 'Instrument-agnostique'],
        status: 'En développement',
        mark: '™',
      },
      {
        title: 'Manuels & méthodes',
        volume: 'Publications pédagogiques',
        description:
          'Rédaction de manuels, méthodes et ressources pédagogiques destinés aux écoles, conservatoires, centres de formation et enseignants indépendants.',
        points: ['Manuels', 'Fiches et ressources', 'Supports numériques'],
        status: 'Actif',
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
        title: 'Workflows IA',
        volume: 'Production & création',
        description:
          "Conception de chaînes de travail intégrant l'IA à chaque étape de la création musicale : idéation, arrangement, analyse, production, post-production.",
        points: ['Idéation assistée', 'Analyse assistée', 'Documentation des choix'],
        status: 'Actif',
      },
      {
        title: 'Outils & plateformes numériques',
        volume: 'Digital',
        description:
          'Développement de solutions numériques pour la formation musicale, la gestion pédagogique et la diffusion culturelle.',
        points: ['Plateformes', 'Automatisation', 'Données'],
        status: 'En développement',
      },
    ],
  },
  {
    id: 'culture',
    label: 'Culture',
    intro: 'Recherche, patrimoine, transmission orale et entrepreneuriat culturel.',
    projects: [
      {
        title: 'A LAIZ PROD',
        volume: 'Structure mère de production',
        description:
          "La structure qui porte les projets artistiques et culturels : production, organisation, développement de partenariats et de contenus.",
        points: ['Production', 'Développement', 'Partenariats'],
        status: 'Actif',
      },
      {
        title: 'Tswefap & Batoufam',
        volume: 'Patrimoine & territoires',
        description:
          "Documenter et valoriser des pratiques musicales issues de la transmission orale, en lien avec le patrimoine des chefferies.",
        points: ['Collecte', 'Documentation', 'Valorisation'],
        status: 'En développement',
      },
      {
        title: 'Recherche & écriture',
        volume: 'Musicologie',
        description:
          'Articles, communications et travaux musicologiques sur les musiques africaines, leur transmission et leurs transformations contemporaines.',
        points: ['Articles', 'Communications', 'Publications'],
        status: 'Actif',
        to: '/culture-recherche',
      },
      {
        title: 'Conseil & stratégie',
        volume: 'IA · musique · digital · culture',
        description:
          "Accompagnement d'institutions culturelles, d'écoles de musique et d'organisations souhaitant intégrer les technologies numériques.",
        points: ['Diagnostic', 'Feuille de route', 'Formation d’équipes'],
        status: 'Actif',
        to: '/contact#conseil',
      },
    ],
  },
]
