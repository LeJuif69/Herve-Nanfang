/**
 * ============================================================================
 * MASTER IDENTITY — HERVÉ NANFANG
 * Source unique de vérité de l'identité, du positionnement et des contenus.
 * ----------------------------------------------------------------------------
 * Règle de gouvernance : AUCUN texte identitaire n'est écrit ailleurs.
 * Toute page, tout titre SEO, toute biographie, toute donnée Schema.org est
 * importée depuis ce fichier. Une modification ici se propage à tout le site,
 * au sitemap, aux données structurées et au kit presse.
 *
 * Règle de vérité : l'objet `aConfirmer` recense les informations vérifiables
 * NON ENCORE TRANSMISES. Elles ne sont jamais devinées ni comblées par des
 * formulations vagues — l'audit (`npm run audit`) les affiche à chaque passage.
 * ============================================================================
 */

/* -------------------------------------------------------------------------- */
/* Typages                                                                     */
/* -------------------------------------------------------------------------- */

export type EtapeTrajectoire = {
  etape: string
  resume: string
  apport: string
  to: string
}

export type Preuve = {
  type: 'institution' | 'lieu' | 'publication' | 'oeuvre' | 'evenement'
  intitule: string
  detail: string
  annee?: string
  lien?: string
}

export type LienOfficiel = {
  plateforme: string
  href: string
  /** true = URL réelle fournie par Hervé Nanfang ; false = emplacement réservé */
  verifie: boolean
}

/* -------------------------------------------------------------------------- */
/* MASTER IDENTITY                                                             */
/* -------------------------------------------------------------------------- */

export const MASTER_IDENTITY = {
  /* ------------------------------------------------------------------ */
  identite: {
    nom: 'Hervé Nanfang',
    variantes: ['Le Pianobariste', 'le Musicologue', 'le Musicien Augmenté'],
    signature: 'Créer. Transmettre. Augmenter. Développer.',
    structureMere: 'Alaiz Creative System',
    roles: [
      'Musicologue',
      'Artiste-musicien',
      'Pédagogue',
      'Ingénieur du son',
      'Concepteur de programmes artistiques & culturels',
      'IA & Innovation culturelle',
    ],
    rolesLine: 'Musicologue · Artiste-musicien · Pédagogue · Ingénieur du son · Concepteur de programmes',
    rolesAccueil: 'Musicologue · Artiste-musicien · Pédagogue',
    base: 'Yaoundé, Cameroun',
    rayonnement: 'Cameroun · Afrique centrale · International',
    langues: ['Français', 'Anglais'],
  },

  /* ------------------------------------------------------------------ */
  positionnement: {
    accrocheAccueil:
      'Pianiste live depuis 2007, je relie la scène au studio, la pédagogie musicale et les outils numériques — de la MAO à l’intelligence artificielle.',
    /**
     * Proposition de valeur de référence (identité figée — 4 octobre 2026).
     */
    propositionValeur:
      "Hervé Nanfang évolue à l'intersection de la musique, de la connaissance, de la pédagogie, des technologies numériques, de l'intelligence artificielle, de la communication digitale et de l'entrepreneuriat culturel.",

    /**
     * Thèse centrale : une seule trajectoire, pas des métiers juxtaposés.
     */
    these:
      "Un professionnel de la musique, de la transmission et de la transformation numérique qui construit des passerelles entre pratique artistique, pédagogie, technologie et innovation culturelle.",

    /** À ne jamais laisser croire : la lecture « catalogue de métiers ». */
    contreLecture:
      'Plusieurs métiers juxtaposés, une somme de compétences sans lien entre elles.',

    /** Titre SEO de référence — conforme au positionnement éditorial validé. */
    seoTitle: 'Hervé Nanfang | Musicien, Musicologue & Musicien Augmenté',
    seoTitleSecondaire: 'Hervé Nanfang | Musicien, Musicologue, Pédagogue & IA',

    /** Meta description — conforme au brief éditorial validé. */
    metaDescription:
      'Hervé Nanfang, artiste-musicien camerounais : Piano-Bar, composition, MAO, musicologie, pédagogie et intelligence artificielle au service de la création.',

    /**
     * DÉSAMBIGUÏSATION — affichée sur le site et exposée en Schema.org
     * (`disambiguatingDescription`). Le nom « Hervé Nanfang » est confondu
     * dans les moteurs avec Hervé Ntang, freestyler de football camerounais
     * (Nanga-Eboko, Jeux de la Francophonie 2023). Cette phrase fige la
     * distinction : musicien / musicologue / pédagogue / IA, jamais sportif.
     */
    desambiguisation:
      'Hervé Nanfang est artiste-musicien, musicologue, pédagogue et spécialiste de l’IA appliquée à la musique — à ne pas confondre avec Hervé Ntang, freestyler de football camerounais.',

    /**
     * DESCRIPTION DE RÉFÉRENCE — à reprendre telle quelle sur le site, YouTube,
     * LinkedIn, Facebook, Instagram et tous les dossiers de presse.
     */
    descriptionReference:
      "Hervé Nanfang, dit Le Pianobariste, le Musicologue, le Musicien Augmenté, est un artiste-musicien, musicologue, pianiste-chanteur, compositeur, arrangeur, ingénieur du son, pédagogue, formateur en MAO, spécialiste de l'intelligence artificielle appliquée à la création et aux métiers culturels, spécialiste de communication digitale et entrepreneur culturel camerounais. Il développe Musicien Augmenté™, une approche qui met l'IA au service du musicien — sans jamais remplacer l'humain, l'identité artistique ni la puissance du live.",
  },

  /* ------------------------------------------------------------------ */
  /**
   * TRAJECTOIRE INTELLECTUELLE UNIQUE
   * C'est la colonne vertébrale éditoriale du site : chaque étape découle de
   * la précédente. Les pages ne présentent pas des activités séparées, elles
   * déroulent cette chaîne.
   */
  trajectoire: [
    {
      etape: 'Musique',
      resume: 'La scène comme point de départ.',
      apport:
        "Depuis 2007, le piano-bar : un métier de présence, de répertoire et d'écoute du public. C'est là que tout se décide.",
      to: '/musique',
    },
    {
      etape: 'MAO & son',
      resume: "De l'interprétation à la fabrication.",
      apport:
        "Composer, arranger, enregistrer, mixer : comprendre la matière sonore au lieu de la subir.",
      to: '/musique',
    },
    {
      etape: 'Musicologie',
      resume: 'Comprendre ce que l’on pratique.',
      apport:
        'Histoire, analyse, cultures africaines, transmission orale : donner un cadre savant à une pratique de terrain.',
      to: '/culture-recherche',
    },
    {
      etape: 'Pédagogie',
      resume: 'Transformer la compréhension en parcours.',
      apport:
        'Curricula, méthodes, évaluation, formation d’enseignants : rendre le savoir transmissible et vérifiable.',
      to: '/pedagogie',
    },
    {
      etape: 'Communication digitale',
      resume: 'Faire circuler un propos.',
      apport:
        'Stratégie éditoriale, récit de marque, contenus : un savoir qui ne circule pas n’existe pas.',
      to: '/ia-technologie',
    },
    {
      etape: 'Intelligence artificielle',
      resume: 'Augmenter la pratique sans la remplacer.',
      apport:
        'Musicien Augmenté™ : méthode, cadre éthique et formation pour intégrer l’IA dans le métier réel.',
      to: '/ia-technologie',
    },
    {
      etape: 'Innovation culturelle',
      resume: 'Transformer les métiers et les structures.',
      apport:
        'Projets, marques, accompagnement d’institutions : porter le changement au-delà de sa propre pratique.',
      to: '/projets',
    },
  ] as EtapeTrajectoire[],

  /* ------------------------------------------------------------------ */
  biographie: {
    /** Présentation développée pour la page de référence À propos. */
    aPropos: [
      "Hervé Nanfang est artiste-musicien, musicologue, pédagogue et ingénieur du son. Basé à Yaoundé, au Cameroun, il relie création musicale, connaissance, transmission et technologies numériques. Son ancrage camerounais situe son point de vue sans réduire les musiques du Cameroun ou d’Afrique à une esthétique unique : leurs histoires, leurs contextes et leurs usages sont multiples.",
      "Depuis 2007, le piano-bar live constitue le socle de son parcours : présence, écoute, répertoire et adaptation au public. De la scène, sa pratique s’est étendue à la composition, à l’arrangement et à la production sonore, puis à la musicologie, à l’enseignement supérieur et à la conception de programmes pédagogiques.",
      "Aujourd’hui, il travaille à l’intersection de la musique, de la pédagogie, de l’intelligence artificielle et de la communication digitale. Il développe Musicien Augmenté™, une approche où l’IA prolonge les capacités du musicien sans se substituer à son jugement artistique, à son identité ni à sa relation avec le public.",
    ],

    /** ~20 mots — réseaux sociaux, pied de lettre, cartes de visite. */
    signature:
      "Musicien, musicologue, pédagogue et ingénieur du son. Spécialiste de l'IA appliquée à la musique. Créateur de Musicien Augmenté™.",

    /** ~50 mots — présentation d'intervenant, profil, page partenaire. */
    courte:
      "Hervé Nanfang est artiste-musicien, musicologue, pédagogue et ingénieur du son. Il conçoit des méthodes de formation, produit de la musique et explore l'intelligence artificielle appliquée à la création et à la transmission. Il développe Musicien Augmenté™, une approche de l'IA qui augmente les capacités du musicien sans remplacer l'humain.",

    /** ~90 mots — dossier de presse, programme de festival. */
    moyenne:
      "Hervé Nanfang est artiste-musicien, musicologue, pédagogue et ingénieur du son. Depuis 2007, la scène — d'abord le piano-bar — constitue le socle de sa pratique : musiques populaires internationales et africaines (rumba, afropop, variété, zouk), jazz, blues et standards, joués dans des lieux réels pour des publics réels. De cette pratique sont nées une exigence de production sonore, une activité d'enseignement supérieur et une réflexion musicologique sur les musiques africaines et leur transmission. Il explore aujourd'hui l'intelligence artificielle appliquée à la musique, à la pédagogie et aux industries culturelles, et en tire Musicien Augmenté™ : une approche professionnelle et un cadre éthique.",

    /** ~150 mots — presse écrite, podcast, dossier institutionnel. */
    longue:
      "Hervé Nanfang est artiste-musicien, musicologue, pédagogue et ingénieur du son. Depuis 2007, la scène — d'abord le piano-bar — constitue le socle de sa pratique : musiques populaires internationales et africaines (rumba, afropop, variété, zouk), jazz, blues et standards, joués dans des lieux réels pour des publics réels. De cette pratique sont nées une exigence de production sonore, une activité d'enseignement supérieur et une réflexion musicologique sur les musiques africaines et leur transmission. Son parcours l'a conduit de l'interprétation à la composition, de la scène à l'ingénierie du son, puis de l'enseignement à la conception de programmes pédagogiques et à la recherche. Il explore aujourd'hui l'intelligence artificielle appliquée à la musique, à la pédagogie et aux industries culturelles. Il en tire Musicien Augmenté™ : une approche professionnelle et un cadre éthique dans lesquels l'IA augmente le musicien sans jamais remplacer l'humain, l'identité artistique ni la puissance du live.",
  },

  /* ------------------------------------------------------------------ */
  expertises: [
    { domaine: 'Musique', items: ['Piano', 'Interprétation', 'Composition', 'Arrangement', 'Direction musicale', 'Piano-bar live'] },
    { domaine: 'Son & production', items: ['Ingénierie du son', 'Prise de son', 'Mixage', 'MAO', 'Production musicale', 'Musique à l’image'] },
    { domaine: 'Savoir', items: ['Musicologie', 'Recherche', 'Cultures africaines', 'Patrimoine', 'Transmission orale', 'Écriture'] },
    { domaine: 'Pédagogie', items: ['Conception de curricula', 'Ingénierie pédagogique', 'Évaluation', 'Formation d’enseignants', 'Manuels et méthodes'] },
    { domaine: 'Technologie', items: ['IA génératives', 'Workflows IA', 'Outils numériques', 'Automatisation', 'Données'] },
    { domaine: 'Communication digitale', items: ['Stratégie digitale', 'Création de contenu', 'Stratégie éditoriale', 'Récit de marque', 'IA générative', 'Personal branding', 'Automatisation et outils numériques'] },
  ],

  /* ------------------------------------------------------------------ */
  parcours: [
    { annee: '2007', titre: 'Début du concept Piano-Bar', detail: 'Création et développement du concept Le Pianobariste™ associant chant, piano et répertoires transversaux : musiques populaires internationales et africaines (rumba, afropop, variété, zouk), jazz et blues.' },
    { annee: '2007–2010', titre: 'Formation technique en son', detail: 'Technicien supérieur de son : prise de son, traitement audio, sonorisation et compréhension approfondie de la chaîne de production sonore.' },
    { annee: '2013', titre: 'Licence Arts & Management Culturel', detail: 'Obtention de la licence à l’Université de Dschang : gestion de projets, production et économie des écosystèmes culturels.' },
    { annee: '2015', titre: 'Holy Infant School', detail: 'Enseignement musical auprès des classes Form 5 et Form 3.' },
    { annee: '2018', titre: 'Millennium Business Developer', detail: 'Formation en développement commercial auprès de UVCDI, intégrant la dimension stratégique et entrepreneuriale à la démarche artistique.' },
    { annee: '2018–2019', titre: 'Arbre à Musique, Yaoundé', detail: 'Formation musicale, pratique instrumentale et notation assistée par ordinateur.' },
    { annee: '2020', titre: 'IBAF / Lybisin Fban', detail: 'Assistant départemental d’enseignement artistique : histoire de la musique et notation musicale assistée par ordinateur.' },
    { annee: '2020–2021', titre: 'IFCPA / CRTV', detail: 'Enseignant vacataire en audiofréquence auprès de formations MAO : prise et traitement du son, formes et genres musicaux, travaux dirigés.' },
    { annee: '2020–2022', titre: 'Le Concert des Guérisseurs', detail: 'Recherche et création percussions & piano inspiré des musiques thérapeutiques pygmées et de l’African Wizarding Music.' },
    { annee: '2021', titre: 'Collège / Lycée Jean-Tabi', detail: 'Éducation musicale et encadrement de chorale à Yaoundé.' },
    { annee: '2021', titre: 'ATMC (CFMIA)', detail: 'Professeur remplaçant d’enseignement artistique : culture musicale, histoire et analyse musicale.' },
    { annee: '2021–2022', titre: 'Institut des Beaux-Arts de Nkongsamba', detail: 'Enseignant remplaçant en musicologie : histoire de la musique, analyse d’œuvres, musiques de films, intermédiarité et politiques musicales.' },
    { annee: '2022–2023', titre: 'EFB Saint-Hubert, Cotonou', detail: 'Enseignement des arts plastiques et de l’histoire de l’art.' },
    { annee: '2022–2026', titre: 'ISMA (Bénin)', detail: 'Enseignant : contribution à la formation supérieure dans les métiers des arts et technologies du son.' },
    { annee: 'Depuis 2022', titre: 'ESAS de Lomé', detail: 'Enseignant à l’École Supérieure des Arts du Spectacle : MAO, musicologie appliquée aux médias visuels et technique de composition musicale.' },
    { annee: '2023', titre: 'Collège bilingue L’Excellence, Odza', detail: 'Éducation musicale en milieu scolaire.' },
    { annee: 'Master II', titre: 'Musicologie appliquée aux médias', detail: 'Université de Yaoundé I : spécialisation en MAO, analyse de bandes originales (Harry Potter, cinéma d’horreur africain) et convergence IA.' },
    { annee: '2026', titre: 'RMA « Vacances Utiles » & LES ZIKOS®', detail: 'Programme intensif en 5 disciplines (restitution Damas–Petits Génies, Yaoundé) et restructuration du manuel pédagogique (68 p.).' },
    { annee: 'Aujourd’hui', titre: 'Alaiz Creative System & Musicien Augmenté™', detail: 'Écosystème de marques et programmes : recherche patrimoniale (Tswefap), production musicale et créative (Alaiz Creative System) et intégration éthique de l’IA.' },
  ],

  /* ------------------------------------------------------------------ */
  marques: [
    { nom: 'Alaiz Creative System', role: 'Structure mère de l’écosystème & production créative', to: '/projets' },
    { nom: 'Le Pianobariste™', role: 'Format piano-bar live (depuis 2007)', to: '/musique#pianobariste' },
    { nom: 'Alaiz Music', role: 'Création & production musicale', to: '/musique' },
    { nom: 'Alaiz Patrimoine', role: 'Pôle culturel & valorisation patrimoniale', to: '/projets' },
    { nom: 'Racines Musicales Academy®', role: 'Formation musicale & curricula', to: '/rma' },
    { nom: 'Permis de Jouer™', role: 'Progression & certification (N1 à N4)', to: '/rma#permis' },
    { nom: 'LES ZIKOS®', role: 'Manuel pédagogique (68 pages)', to: '/pedagogie#publications' },
    { nom: 'Tswefap', role: 'Système d’écriture & documentation du Batoufam', to: '/culture-recherche' },
    { nom: 'Musicien Augmenté™', role: 'IA × musique & perfectionnement', to: '/ia-technologie#musicien-augmente' },
  ],

  /* ------------------------------------------------------------------ */
  concepts: {
    musicienAugmente: {
      name: 'Musicien Augmenté™',
      promesse:
        "Comment intégrer l'intelligence artificielle dans le métier de musicien sans perdre l'humain, l'identité artistique et la puissance du live.",
      principe:
        "L'intelligence artificielle ne doit pas remplacer le musicien. Elle doit l'augmenter.",
      definition:
        "Musicien Augmenté™ désigne une pratique professionnelle dans laquelle l'intelligence artificielle augmente les capacités du musicien — temps, analyse, exploration, diffusion — tandis que la décision artistique, la responsabilité et le rapport au public restent entièrement humains.",
      definitionCourte:
        "L'IA augmente les capacités du musicien. Elle ne signe pas, ne décide pas, ne remplace pas.",
    },
  },

  /* ------------------------------------------------------------------ */
  /**
   * PREUVES & RÉFÉRENCES CONSOLIDÉES
   * Données académiques, pédagogiques, artistiques et patrimoniales vérifiées.
   */
  preuves: {
    mode: 'affiche' as 'masque' | 'affiche',
    institutions: [
      {
        type: 'institution',
        intitule: 'ESAS — École Supérieure des Arts du Spectacle (Lomé)',
        detail: 'Enseignant titulaire depuis 2022 : MAO, musicologie appliquée aux médias visuels et technique de composition musicale.',
        annee: 'Depuis 2022',
      },
      {
        type: 'institution',
        intitule: 'ISMA — Institut Supérieur des Métiers des Arts (Bénin)',
        detail: 'Enseignant : contribution à la formation supérieure dans les métiers des arts et des technologies sonores.',
        annee: '2022–2026',
      },
      {
        type: 'institution',
        intitule: 'Institut des Beaux-Arts de Nkongsamba',
        detail: 'Enseignant remplaçant en musicologie : histoire de la musique, analyse d’œuvres, musiques de films, intermédiarité et politiques musicales.',
        annee: '2021–2022',
      },
      {
        type: 'institution',
        intitule: 'IFCPA / CRTV',
        detail: 'Enseignant vacataire en audiofréquence : MAO, prise et traitement du son, formes et genres musicaux.',
        annee: '2020–2021',
      },
      {
        type: 'institution',
        intitule: 'Université de Dschang',
        detail: 'Licence en Arts et Management Culturel (gestion et écosystèmes culturels).',
        annee: '2013',
      },
      {
        type: 'institution',
        intitule: 'Université de Yaoundé I',
        detail: 'Master II en Musicologie appliquée aux médias (MAO, médias audiovisuels et technologies créatives).',
        annee: '2024',
      },
    ] as Preuve[],
    lieux: [
      {
        type: 'lieu',
        intitule: 'Hôtel Hilton Yaoundé',
        detail: "Salons d'honneur, dîners de gala, cocktails diplomatiques et prestations acoustiques piano solo feutrées.",
        annee: 'Depuis 2007',
      },
      {
        type: 'lieu',
        intitule: 'Djeuga Palace Hôtel (Yaoundé)',
        detail: "Soirées piano-bar continues, ambiance lounge feutrée et événementiel privé de haut standing.",
        annee: 'Résidence live',
      },
      {
        type: 'lieu',
        intitule: 'Hôtel Mont Fébé (Yaoundé)',
        detail: "Réceptions diplomatiques, dîners d'État et célébrations consulaires avec direction d'ambiance protocolaire.",
        annee: 'Événements d’État',
      },
      {
        type: 'lieu',
        intitule: 'Akwa Palace (Douala)',
        detail: "Grands galas d'affaires, lancements corporate et soirées d'exception en solo et formation live band.",
        annee: 'Galas corporate',
      },
      {
        type: 'lieu',
        intitule: 'Espaces Balnéaires & Résidences privées (Kribi)',
        detail: "Célébrations de mariage d'exception, week-ends corporate et soirées privées en duo ou trio acoustique.",
        annee: 'Événements VIP',
      },
      {
        type: 'lieu',
        intitule: 'Espace Damas–Petits Génies (Yaoundé)',
        detail: 'Scène de restitution collective du programme intensif RMA Vacances Utiles 2026 (5 disciplines instrumentales & vocales).',
        annee: 'Août 2026',
      },
    ] as Preuve[],
    publications: [
      {
        type: 'publication',
        intitule: 'LES ZIKOS®',
        detail: 'Manuel pédagogique en restructuration éditoriale et graphique (68 pages) : progression, activités et notions fondamentales.',
        annee: '2026',
      },
      {
        type: 'publication',
        intitule: 'Permis de Jouer™ (Paliers N1 à N4)',
        detail: 'Dispositif pédagogique de progression musicale instrument-agnostique articulé à la pédagogie RMA.',
        annee: 'Méthode',
      },
      {
        type: 'publication',
        intitule: 'Tswefap — Système d’écriture du Batoufam',
        detail: 'Corpus, conventions d’écriture et manuel de référence pour la documentation patrimoniale et linguistique.',
        annee: 'En cours',
      },
      {
        type: 'publication',
        intitule: 'Recherches sur la musique et l’image',
        detail: 'Analyses musicologiques des BO (Harry Potter, cinéma d’horreur africain, transmédiatisation et musiques vocales).',
        annee: 'Recherche',
      },
      {
        type: 'publication',
        intitule: 'Music’Arts Thérapie',
        detail: 'Projet d’ouvrage scientifique et pédagogique en préparation.',
        annee: 'En préparation',
      },
    ] as Preuve[],
    oeuvres: [
      {
        type: 'oeuvre',
        intitule: 'Le Pianobariste™ — Répertoire Live',
        detail: 'Répertoire éclectique et sur mesure : musiques populaires internationales et africaines (rumba, afropop, zouk, variété), grands standards jazz & blues.',
        annee: 'Depuis 2007',
      },
      {
        type: 'oeuvre',
        intitule: 'Le Concert des Guérisseurs',
        detail: 'Création pour percussions et piano inspirée des musiques thérapeutiques pygmées et de l’African Wizarding Music.',
        annee: '2020–2022',
      },
      {
        type: 'oeuvre',
        intitule: 'Programme RMA « Vacances Utiles » 2026',
        detail: 'Cursus intensif sur 7 semaines en 5 disciplines (piano, guitare, basse, batterie, voix) avec restitution artistique collective.',
        annee: '2026',
      },
    ] as Preuve[],
  },

  /* ------------------------------------------------------------------ */
  enseignement: {
    etablissements: [
      'ESAS (Lomé)',
      'ISMA (Bénin)',
      'Institut des Beaux-Arts de Nkongsamba',
      'IFCPA / CRTV',
      'Université de Yaoundé I',
      'Université de Dschang',
    ],
    disciplines: [
      'Musicologie appliquée aux médias visuels',
      'Musique assistée par ordinateur (MAO)',
      'Technique de composition musicale',
      'Analyse d’œuvres & histoire de la musique',
      'Prise et traitement du son / Audiofréquence',
      'Conception de curricula & ingénierie pédagogique',
      'Pulsation, coordination & pratique collective',
    ],
    dispositifs: [
      'Racines Musicales Academy® (RMA)',
      'Permis de Jouer™ (N1 à N4)',
      'LES ZIKOS® (manuel de 68 pages)',
      'RMA-01 — Fondamentaux du Musicien (Pulsation & Body)',
      'Programme Vacances Utiles (7 semaines)',
    ],
  },

  /* ------------------------------------------------------------------ */
  /**
   * PROGRAMMES DE DÉVELOPPEMENT À STRUCTURER
   * Pôles de développement professionnel prolongeant les compétences du parcours.
   */
  programmesDeveloppement: [
    {
      titre: 'Laboratoire de musique à l’image',
      axe: 'Analyse & Création audiovisuelle',
      description: 'Analyse de bandes originales, fonctions narratives de la musique, initiation au sound design et exercices de composition appliquée à l’image.',
    },
    {
      titre: 'Atelier MAO et production musicale',
      axe: 'Studio & Fabrication sonore',
      description: 'Parcours pratique autour de la création de maquettes, de l’enregistrement, de l’édition audio, de l’arrangement et de la préparation de projets musicaux.',
    },
    {
      titre: 'Laboratoire de documentation musicale et patrimoniale',
      axe: 'Patrimoine & Recherche appliquée',
      description: 'Méthodes de collecte, de description, de catalogage et de transmission de ressources culturelles (en lien avec le projet Tswefap).',
    },
    {
      titre: 'Programme Musicien augmenté',
      axe: 'IA & Perfectionnement professionnel',
      description: 'Parcours portant sur les outils numériques, l’organisation du travail artistique, l’intelligence artificielle, la production de contenus et le développement de carrière.',
    },
    {
      titre: 'Ateliers d’écoute et de médiation musicale',
      axe: 'Culture & Sensibilisation',
      description: 'Séances consacrées à l’écoute guidée, à l’analyse d’œuvres, aux musiques de films et à la découverte contextualisée des patrimoines musicaux.',
    },
  ],

  ia: {
    seoTitle: 'IA & Technologie | Hervé Nanfang — Musicien Augmenté',
    seoDescription:
      "Musique, MAO, pédagogie et communication digitale : la position d’Hervé Nanfang sur l’IA au service du musicien, sans remplacer son jugement artistique.",
    trajectoire: {
      titre: 'De l’instrument à l’IA, le métier se déplace',
      introduction:
        'Cette trajectoire ne raconte ni la disparition d’un métier ni une marche obligatoire vers toujours plus de technologie. Elle montre comment les outils déplacent certaines tâches et font apparaître de nouvelles décisions.',
      precision:
        'Ici, « musicien traditionnel » désigne un modèle de métier organisé d’abord autour de l’instrument, du répertoire et de la scène. Il ne désigne pas les musiques traditionnelles du Cameroun ou d’Afrique.',
      etapes: [
        {
          titre: 'Le musicien traditionnel',
          axe: 'Instrument · répertoire · présence',
          detail:
            'Le musicien développe technique, oreille, répertoire et présence. L’interprétation s’ajuste au lieu, aux autres musiciens et au public. La valeur ne vient pas seulement du son produit, mais aussi de l’écoute et du choix en situation.',
        },
        {
          titre: 'Le musicien en MAO',
          axe: 'Enregistrer · éditer · produire',
          detail:
            'La MAO ouvre le travail à l’enregistrement, à l’édition, à l’arrangement, au mixage et à la production. Le jeu reste central, mais le musicien peut aussi façonner et documenter la matière sonore.',
        },
        {
          titre: 'Le musicien augmenté par l’IA',
          axe: 'Explorer · vérifier · décider',
          detail:
            'L’IA peut assister la recherche, l’analyse, l’exploration de variantes, la préparation pédagogique et la communication. Le musicien formule une intention, contrôle les propositions, choisit ce qu’il garde et assume le résultat.',
        },
      ],
      conclusion:
        'Le musicien augmenté n’est pas celui qui utilise le plus d’outils. C’est celui qui sait quoi leur confier, ce qu’il doit vérifier et ce qu’il garde sous sa responsabilité : le goût, la décision artistique, les droits et la relation au public.',
    },
    domaines: [
      'L’IA dans la création',
      'L’IA dans la transmission',
      'Workflows culturels',
      'IA & communication',
    ],
    formats: ['Conférence', 'Masterclass', 'Formation longue', 'Accompagnement de structure'],
  },

  communicationDigitale: {
    axes: ['Stratégie éditoriale', 'Récit de marque', 'Contenus', 'Personal branding'],
    principe: 'Un savoir qui ne circule pas n’existe pas.',
  },

  /* ------------------------------------------------------------------ */
  /**
   * LIENS OFFICIELS
   * Alimentent le `sameAs` de Schema.org — mécanisme qui permet aux moteurs de
   * comprendre qu'il s'agit d'une seule et même entité.
   */
  liensOfficiels: [
    { plateforme: 'Site', href: 'https://hervenanfang.vercel.app', verifie: true },
    { plateforme: 'Portfolio', href: 'https://canva.link/2l6atbuzkax2k6g', verifie: true },
    { plateforme: 'LinkedIn', href: 'https://www.linkedin.com/in/herve-nanfang', verifie: true },
    { plateforme: 'Facebook', href: 'https://www.facebook.com/herve.nanfang.officiel/', verifie: true },
    { plateforme: 'YouTube', href: 'https://www.youtube.com/@hervenanfang', verifie: true },
    { plateforme: 'Threads', href: 'https://www.threads.com/@alaizopays', verifie: true },
  ] as LienOfficiel[],

  /* ------------------------------------------------------------------ */
  schemaOrg: {
    jobTitle: [
      'Musicologue',
      'Artiste-musicien',
      'Pianiste-accompagnateur',
      'Chanteur et interprète live',
      'Compositeur et arrangeur',
      'Pédagogue et formateur',
      'Ingénieur du son',
      'Formateur en MAO',
      'Concepteur de programmes pédagogiques',
      'Directeur artistique',
      'Entrepreneur culturel',
      'Spécialiste de l’IA appliquée à la musique',
    ],
    knowsAbout: [
      'Musicologie',
      'Piano-bar & scène live',
      'Musique à l’image & bandes originales',
      'Production musicale & sonorisation',
      'Ingénierie du son & audiofréquence',
      'Musique assistée par ordinateur (MAO)',
      'Intelligence artificielle appliquée aux arts',
      'Musicien augmenté',
      'Pédagogie & ingénierie de formation',
      'Cultures africaines & traditions orales',
      'Documentation patrimoniale & linguistique',
      'Communication digitale & récits de marque',
      'Entrepreneuriat culturel & Alaiz Creative System',
    ],
    knowsLanguage: ['fr', 'en'],
    nationality: 'Cameroun',
    address: { locality: 'Yaoundé', country: 'CM' },
  },

  /* ------------------------------------------------------------------ */
  /**
   * ÉLÉMENTS DE CONTRÔLE ADMINISTRATIF
   * Formalités administratives résiduelles avant immatriculation finale.
   */
  aConfirmer: [
    {
      id: 'legal-rccm',
      question: 'Numéro de contribuable / RCCM officiel d’Alaiz Creative System pour mentions légales.',
      usedIn: 'Mentions légales · politique de confidentialité',
    },
  ],
}

/* -------------------------------------------------------------------------- */
/* ACCESSEURS — le reste du site consomme ces vues dérivées                    */
/* Aucune duplication de texte : tout provient de MASTER_IDENTITY.             */
/* -------------------------------------------------------------------------- */

export const IDENTITY = {
  name: MASTER_IDENTITY.identite.nom,
  signature: MASTER_IDENTITY.identite.signature,
  roles: MASTER_IDENTITY.identite.roles,
  rolesLine: MASTER_IDENTITY.identite.rolesLine,
  city: MASTER_IDENTITY.identite.base,
  portfolioUrl: 'https://canva.link/2l6atbuzkax2k6g',

  seoTitle: MASTER_IDENTITY.positionnement.seoTitle,
  seoTitleSecondaire: MASTER_IDENTITY.positionnement.seoTitleSecondaire,
  metaDescription: MASTER_IDENTITY.positionnement.metaDescription,
  referenceDescription: MASTER_IDENTITY.positionnement.descriptionReference,
  positioningLine: MASTER_IDENTITY.positionnement.propositionValeur,
  these: MASTER_IDENTITY.positionnement.these,
  desambiguisation: MASTER_IDENTITY.positionnement.desambiguisation,

  concept: MASTER_IDENTITY.concepts.musicienAugmente,

  bios: {
    mini: MASTER_IDENTITY.biographie.signature,
    court: MASTER_IDENTITY.biographie.courte,
    moyenne: MASTER_IDENTITY.biographie.moyenne,
    long: MASTER_IDENTITY.biographie.longue,
  },
}

/** Liens officiels vérifiés — utilisés pour le `sameAs` de Schema.org (externes uniquement). */
export const SAME_AS = MASTER_IDENTITY.liensOfficiels
  .filter((l) => l.verifie && l.href.length > 0 && l.plateforme !== 'Site')
  .map((l) => l.href)

/** Conservé pour compatibilité : liste des informations à confirmer. */
export const TO_CONFIRM = MASTER_IDENTITY.aConfirmer
