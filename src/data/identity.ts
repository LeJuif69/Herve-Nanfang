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
    roles: [
      'Artiste',
      'Musicologue',
      'Pédagogue',
      'Ingénieur du son',
      'IA & Innovation culturelle',
    ],
    rolesLine: 'Artiste · Musicologue · Pédagogue · Ingénieur du son · IA & Innovation culturelle',
    rolesAccueil: 'Artiste-musicien · Musicologue · Pédagogue',
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
      "Hervé Nanfang est artiste-musicien, musicologue, pédagogue et ingénieur du son. Depuis 2007, la scène — d'abord le piano-bar — constitue le socle de sa pratique : jazz, blues, variété, musiques africaines et standards, joués dans des lieux réels pour des publics réels. De cette pratique sont nées une exigence de production sonore, une activité d'enseignement supérieur et une réflexion musicologique sur les musiques africaines et leur transmission. Il explore aujourd'hui l'intelligence artificielle appliquée à la musique, à la pédagogie et aux industries culturelles, et en tire Musicien Augmenté™ : une approche professionnelle et un cadre éthique.",

    /** ~150 mots — presse écrite, podcast, dossier institutionnel. */
    longue:
      "Hervé Nanfang est artiste-musicien, musicologue, pédagogue et ingénieur du son. Depuis 2007, la scène — d'abord le piano-bar — constitue le socle de sa pratique : jazz, blues, variété, musiques africaines et standards, joués dans des lieux réels pour des publics réels. De cette pratique sont nées une exigence de production sonore, une activité d'enseignement supérieur et une réflexion musicologique sur les musiques africaines et leur transmission. Son parcours l'a conduit de l'interprétation à la composition, de la scène à l'ingénierie du son, puis de l'enseignement à la conception de programmes pédagogiques et à la recherche. Il explore aujourd'hui l'intelligence artificielle appliquée à la musique, à la pédagogie et aux industries culturelles. Il en tire Musicien Augmenté™ : une approche professionnelle et un cadre éthique dans lesquels l'IA augmente le musicien sans jamais remplacer l'humain, l'identité artistique ni la puissance du live.",
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
    { annee: '2007', titre: 'Début du concept Piano-Bar', detail: 'Création et développement d’un concept de prestation Piano-Bar associant interprétation vocale, accompagnement au piano et adaptation du répertoire au contexte.' },
    { annee: '2007–2010', titre: 'Formation technique en son', detail: 'Technicien supérieur de son : prise de son, traitement audio, sonorisation et compréhension de la chaîne de production sonore.' },
    { annee: '2013', titre: 'Licence Arts & Management Culturel', detail: 'Obtention de la licence à l’Université de Dschang, avec une ouverture vers la gestion, la production et la compréhension des écosystèmes culturels.' },
    { annee: '2018', titre: 'Millennium Business Developer', detail: 'Formation en développement commercial auprès de UVCDI, complétant le profil artistique par une dimension entrepreneuriale et stratégique.' },
    { annee: '2022', titre: 'Enseignement supérieur', detail: 'Début de l’enseignement à l’École Supérieure des Arts du Spectacle de Lomé (ESAS), notamment en MAO, musicologie appliquée aux médias et composition musicale.' },
    { annee: 'Depuis 2022', titre: 'Transmission et pédagogie', detail: 'Développement d’activités d’enseignement et de formation dans les domaines de la musique, de la MAO, de la musicologie et de la pédagogie artistique.' },
    { annee: 'Master II', titre: 'Musicologie appliquée aux médias', detail: 'Spécialisation en MAO et convergence entre musique, technologie, création audiovisuelle et intelligence artificielle.' },
    { annee: 'Aujourd’hui', titre: 'Musicien augmenté', detail: 'Le parcours évolue à l’intersection de la musique, de la MAO, de la musicologie, de la pédagogie, de l’IA, de la communication digitale et de l’entrepreneuriat culturel.' },
  ],

  /* ------------------------------------------------------------------ */
  marques: [
    { nom: 'Le Pianobariste™', role: 'Format piano-bar live', to: '/musique#pianobariste' },
    { nom: 'A LAIZ PROD', role: 'Production artistique & culturelle', to: '/projets#entrepreneuriaux' },
    { nom: 'A LAIZ Music', role: 'Création & production musicale', to: '/projets#artistiques' },
    { nom: 'Racines Musicales Academy®', role: 'Formation & curricula', to: '/pedagogie#formations' },
    { nom: 'Permis de Jouer™', role: 'Progression & certification', to: '/pedagogie#formations' },
    { nom: 'Musicien Augmenté™', role: 'IA × musique', to: '/ia-technologie#musicien-augmente' },
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
   * PREUVES & RÉFÉRENCES
   * Aucune entrée n'est inventée. Tant que les listes sont vides, la section
   * publique reste masquée (mode: 'masque'). Dès qu'une preuve est vérifiée :
   * on l'ajoute ici et l'on passe en mode: 'affiche'.
   */
  preuves: {
    mode: 'masque' as 'masque' | 'affiche',
    institutions: [] as Preuve[],
    lieux: [] as Preuve[],
    publications: [] as Preuve[],
    oeuvres: [] as Preuve[],
  },

  /* ------------------------------------------------------------------ */
  enseignement: {
    etablissements: ['ESAS', 'ISMA'],
    disciplines: [
      'Musicologie',
      'MAO',
      'Composition',
      'Éducation musicale',
      'Conception pédagogique',
    ],
    dispositifs: ['Racines Musicales Academy®', 'Permis de Jouer™', 'Manuels & méthodes'],
  },

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
   * comprendre qu'il s'agit d'une seule et même entité. Laisser `verifie: false`
   * tant que l'URL réelle n'est pas fournie : une URL erronée nuit plus qu'une
   * absence de lien.
   */
  liensOfficiels: [
    { plateforme: 'Site', href: 'https://hervenanfang.vercel.app', verifie: true },
    { plateforme: 'Facebook', href: 'https://www.facebook.com/herve.nanfang.officiel/', verifie: true },
    { plateforme: 'YouTube', href: 'https://www.youtube.com/@hervenanfang', verifie: true },
    { plateforme: 'LinkedIn', href: 'https://www.linkedin.com/in/herv%C3%A9-nanfang-317bb2b1/', verifie: true },
    { plateforme: 'Threads', href: 'https://www.threads.com/@alaizopays', verifie: true },
  ] as LienOfficiel[],

  /* ------------------------------------------------------------------ */
  schemaOrg: {
    jobTitle: [
      'Artiste-musicien',
      'Pianiste',
      'Chanteur et interprète live',
      'Musicien et compositeur',
      'Musicologue',
      'Pédagogue',
      'Ingénieur du son',
      'Formateur MAO',
      'Directeur artistique',
      'Entrepreneur culturel',
      'Spécialiste de l’IA appliquée à la musique',
    ],
    knowsAbout: [
      'Musique',
      'Piano',
      'Jazz',
      'Piano-bar',
      'Musicologie',
      'Production musicale',
      'Ingénierie du son',
      'MAO',
      'Intelligence artificielle générative',
      'Musicien augmenté',
      'Pédagogie musicale',
      'Cultures africaines',
      'Transmission orale',
      'Communication digitale',
      'Entrepreneuriat culturel',
      'Innovation culturelle',
    ],
    knowsLanguage: ['fr', 'en'],
    nationality: 'Cameroun',
    address: { locality: 'Yaoundé', country: 'CM' },
  },

  /* ------------------------------------------------------------------ */
  /**
   * À CONFIRMER — ne jamais deviner.
   * Chaque entrée est reprise automatiquement dans docs/AUDIT.md (section 7)
   * et dans docs/IDENTITE-A-REMPLIR.md (dossier à compléter).
   */
  aConfirmer: [
    {
      id: 'dates-esas-isma',
      question: 'Années exactes d’enseignement à l’ESAS et à l’ISMA, et intitulés des cours dispensés.',
      usedIn: 'Page À propos · chronologie · page Pédagogie',
    },
    {
      id: 'etablissements-complets',
      question: 'Liste complète des établissements (universités, conservatoires, écoles) avec années.',
      usedIn: 'Pages À propos et Pédagogie · références institutionnelles',
    },
    {
      id: 'publications',
      question: 'Titres, éditeurs et années des manuels, méthodes et publications pédagogiques.',
      usedIn: 'Page Pédagogie · JSON-LD Book · kit presse',
    },
    {
      id: 'discographie',
      question: 'Œuvres enregistrées, albums, singles, collaborations, musiques de film ou de publicité.',
      usedIn: 'Page Musique · JSON-LD MusicGroup/CreativeWork · portfolio',
    },
    {
      id: 'dates-projets',
      question: 'Dates de création et état d’avancement réel de RMA®, Permis de Jouer™, Tswefap, A LAIZ PROD.',
      usedIn: 'Page Projets · statuts affichés',
    },
    {
      id: 'references-live',
      question: 'Hôtels, lounges, institutions et événements où Le Pianobariste™ se produit (noms citables).',
      usedIn: 'Page Musique · preuve commerciale · booking',
    },
    {
      id: 'credits-photos',
      question: 'Crédits et autorisations de diffusion des photographies professionnelles.',
      usedIn: 'Textes alternatifs · mentions légales · kit presse',
    },
    {
      id: 'legal',
      question: 'Forme juridique exacte, numéro de contribuable / RCCM, coordonnées de l’hébergeur.',
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
