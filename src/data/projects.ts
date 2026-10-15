/**
 * Projets — architecture de la page PROJETS (section 10 du master)
 * Cinq familles : artistiques, pédagogiques, technologiques, culturels, entrepreneuriaux.
 */

export type Project = {
  title: string
  volume: string
  description: string
  /** Points-clés ou livrables affichés en puces */
  points: string[]
  to?: string
  status: 'Actif' | 'En développement' | 'Signature'
  mark?: '®' | '™' | ''
  /** Synopsis long — affiché dans la carte étendue */
  synopsis?: string
  /** Discipline / axe principal du projet */
  discipline?: string
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
        synopsis:
          "Le Pianobariste™ est le format de piano live conçu par Hervé Nanfang depuis 2007. Avec un répertoire de plus de 440 titres couvrant le jazz, le blues, la bossa nova, la variété francophone, l'afropop et les standards internationaux, il s'adapte à chaque espace et chaque public : hôtels 5 étoiles, lounges diplomatiques, dîners de gala, réceptions privées et événements d'entreprise. La démarche est toujours la même : lire l'énergie du lieu, l'habiter musicalement et repartir en laissant une mémoire sonore.",
        points: ['Hôtels · Lounges · Événements', 'Répertoire jazz, blues, variété, africain (440+ titres)', 'Live piano · Live mood · Live experience'],
        status: 'Signature',
        mark: '™',
        discipline: 'Musique live',
      },
      {
        title: 'A LAIZ Music',
        volume: 'Création & production',
        description:
          "Composition, arrangement et production musicale pour des projets d'artistes, des institutions et des contenus audiovisuels.",
        points: ['Composition', 'Arrangement', 'Direction de production'],
        status: 'Actif',
        discipline: 'Production musicale',
      },
      {
        title: 'Le Concert des Guérisseurs',
        volume: 'Création musicale & Spectacle vivant',
        description:
          'Concert-spectacle immersif mêlant piano, percussions africaines et nappes vocales pour explorer la fonction curative et thérapeutique de la musique traditionnelle africaine.',
        synopsis:
          'Le Concert des Guérisseurs est un projet de spectacle vivant conçu par Hervé Nanfang autour de la fonction thérapeutique et spirituelle de la musique dans les sociétés africaines traditionnelles. S\'appuyant sur ses recherches en musicologie (African Wizarding Music, musiques pygmées et médecines musicales bantoues), il assemble des trames harmoniques apaisantes au piano, des polyrythmies sacrées aux percussions, des polyphonies chorales et des improvisations au sanzo/kalimba pour créer une expérience sensorielle totale. Le spectacle est accompagné d\'une conférence introductive sur les relations entre musique, médecine et rites de guérison.',
        points: ['Spectacle vivant piano & percussions africaines', 'Exploration de la musicothérapie traditionnelle', 'Conférence introductive sur la médecine musicale', 'Disponible en festival ou soirée thématique'],
        status: 'Actif',
        to: '/musique#concert-guerisseurs',
        discipline: 'Spectacle vivant & musicothérapie',
      },
      {
        title: 'Productions & scène',
        volume: 'Spectacle vivant',
        description:
          'Conception et production de formats scéniques, direction musicale et accompagnement de projets live.',
        points: ['Direction musicale', 'Formats scéniques', "Accompagnement d'artistes"],
        status: 'Actif',
        discipline: 'Production scénique',
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
        synopsis:
          "La RMA (Racines Musicales Academy®) est un dispositif de formation musicale fondé à Yaoundé par Hervé Nanfang. Elle propose des cursus individuels en piano, chant, guitare, basse, batterie et formation musicale, structurés selon la méthode Permis de Jouer™. Le programme intensif « Vacances Utiles » (7 semaines) accueille les enfants dès 6 ans et les adultes débutants. La RMA propose également des formations de formateurs pour les institutions souhaitant améliorer leurs curricula musicaux.",
        points: ['Curricula en 6 disciplines', "Programme Vacances Utiles (7 sem.)", 'Restitution collective Damas–Petits Génies', "Formation de formateurs institutionnels"],
        status: 'Actif',
        mark: '®',
        to: '/rma',
        discipline: 'Formation musicale',
      },
      {
        title: 'Permis de Jouer™',
        volume: 'Progression & certification',
        description:
          "Un système de progression et d'évaluation continue instrument-agnostique organisé en 4 niveaux (N1 à N4) pour rendre l'apprentissage lisible et mesurable.",
        synopsis:
          "Le Permis de Jouer™ est la méthode d'évaluation progressive mise au point par Hervé Nanfang pour la RMA. Structurée en 4 paliers (N1 Blanc — Fondations, N2 Jaune — Méthode, N3 Orange — Identité, N4 Rouge — Maîtrise & Scène), elle s'applique à tous les instruments enseignés à la RMA. Chaque palier est validé par une soutenance de compétences réelles (jeu en public, pièces de mémoire) plutôt que par des examens théoriques. L'objectif : former des musiciens autonomes, pas des copistes dépendants.",
        points: ['Paliers N1 à N4', 'Validation par compétences réelles', 'Instrument-agnostique'],
        status: 'Actif',
        mark: '™',
        to: '/rma#permis-de-jouer',
        discipline: 'Méthode pédagogique',
      },
      {
        title: 'LES ZIKOS®',
        volume: 'Manuel pédagogique · 68 pages',
        description:
          'Manuel pédagogique complet destiné aux débutants en musique : progression par unités thématiques, lisibilité des notions et exercices instrumentaux applicables dès le premier cours.',
        synopsis:
          "LES ZIKOS® est un ouvrage pédagogique de 68 pages conçu par Hervé Nanfang pour combler un vide éditorial dans la littérature musicale destinée aux publics francophones d'Afrique subsaharienne. Structuré en unités progressives, il part de la pulsation corporelle et de l'oreille musicale pour arriver à la lecture de partition et aux notions harmoniques fondamentales. Chaque unité comprend un plan de cours, des exercices pratiques, une grille d'évaluation et une bibliographie de référence. Le manuel est en cours de restructuration graphique et éditoriale pour une publication officielle.",
        points: ['Manuel de 68 pages', 'Progression méthodologique par unités thématiques', 'Notions fondamentales & exercices instrumentaux', 'En cours de restructuration graphique & éditoriale'],
        status: 'En développement',
        mark: '®',
        to: '/pedagogie#publications',
        discipline: 'Pédagogie éditoriale',
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
        points: ['Conférences & masterclass', "Méthodologie d'adoption", 'Cadre éthique'],
        status: 'Signature',
        mark: '™',
        to: '/ia-technologie#musicien-augmente',
        discipline: 'IA & création musicale',
      },
      {
        title: 'Workflows IA & Son',
        volume: 'Production & création',
        description:
          "Conception de chaînes de travail intégrant l'IA à chaque étape de la création musicale : idéation, arrangement, analyse, production, post-production.",
        points: ['Idéation assistée', 'Analyse assistée', 'Documentation des choix'],
        status: 'Actif',
        discipline: 'MAO & ingénierie sonore',
      },
      {
        title: 'Laboratoires & Ateliers',
        volume: 'Innovation & transmission',
        description:
          "Pôles de conception en musique à l'image, production sonore en MAO, documentation patrimoniale et médiation musicale.",
        points: ["Musique à l'image", 'MAO avancée', 'Médiation culturelle'],
        status: 'En développement',
        to: '/pedagogie#programmes-developpement',
        discipline: "Recherche appliquée",
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
        volume: "Structure mère de l'écosystème",
        description:
          "La structure mère qui articule la production musicale (A LAIZ PROD), l'action culturelle et patrimoniale (A LAIZ Ô PAYS) et la formation musicale (RMA).",
        points: ["Gouvernance d'écosystème", 'Production & culture', 'Coordination de marques'],
        status: 'Signature',
        discipline: 'Entrepreneuriat culturel',
      },
      {
        title: 'A LAIZ Ô PAYS',
        volume: 'Marque culturelle & patrimoniale',
        description:
          'Pôle dédié à la valorisation des patrimoines oraux, aux projets territoriaux et à la circulation des expressions artistiques traditionnelles et contemporaines.',
        points: ['Territoires', 'Patrimoines oraux', 'Projets culturels'],
        status: 'Actif',
        discipline: 'Culture & patrimoine',
      },
      {
        title: 'Tswefap & Batoufam',
        volume: 'Documentation linguistique & patrimoniale',
        description:
          "Projet de système d'écriture et de documentation linguistique consacré au Batoufam (Bamiléké, Cameroun) : corpus lexical, conventions graphiques, analyse phonologique et manuel de référence.",
        synopsis:
          "Le Tswefap est le système d'écriture original conçu par Hervé Nanfang pour transcrire et préserver la langue Batoufam. Le projet englobe la constitution d'un corpus lexical issu de sources orales, la définition de conventions graphiques stables, une analyse phonologique comparée et la rédaction d'un manuel accessible aux locuteurs natifs comme aux linguistes. Il s'inscrit dans la dynamique de revitalisation des langues bamilékées et vise à créer les conditions d'une littérature écrite autonome en Batoufam.",
        points: ["Système d'écriture original (Tswefap)", 'Corpus lexical & analyse phonologique', 'Manuel de référence pour locuteurs & linguistes', 'Revitalisation linguistique Batoufam-Bamiléké'],
        status: 'En développement',
        to: '/culture-recherche',
        discipline: 'Linguistique & patrimoine',
      },
      {
        title: "Recherche & Musique à l'image",
        volume: 'Musicologie appliquée',
        description:
          "Communications scientifiques et analyses sur les bandes originales de films (Harry Potter, cinéma d'horreur africain, transmédiatisation).",
        points: ['Conférences', 'Analyses de BO', 'Publications'],
        status: 'Actif',
        to: '/conferences',
        discipline: 'Musicologie appliquée',
      },
    ],
  },
]
