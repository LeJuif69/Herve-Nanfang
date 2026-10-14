/**
 * Univers musical — contenus de la page MUSIQUE & LE PIANOBARISTE™
 */

export type MusicSection = {
  title: string
  text: string
}

export const MUSIC_SECTIONS: MusicSection[] = [
  {
    title: 'Le Pianobariste (performance live)',
    text: "Activité signature depuis 2007 : une présence musicale continue, capable de tenir une salle, une soirée, un lieu de prestige — sans jamais devenir un simple fond sonore.",
  },
  {
    title: 'Composition & Arrangement',
    text: "Écrire, structurer, orchestrer : donner à une idée musicale une forme qui lui permette d'exister pleinement, que ce soit pour le spectacle vivant ou la musique à l'image.",
  },
  {
    title: 'Ingénierie du son & Production',
    text: 'Prise de son, mixage, traitement et direction artistique : accompagner un projet de l’intention jusqu’au master avec une exigence acoustique absolue.',
  },
]

export interface StageFormat {
  id: string
  num: string
  title: string
  subtitle: string
  audience: string
  description: string
  highlights: string[]
}

export const STAGE_FORMATS: StageFormat[] = [
  {
    id: 'solo-prestige',
    num: '01',
    title: 'Format Solo Prestige',
    subtitle: 'Piano Solo & Ambiance Feutrée',
    audience: 'Palaces, lounges d’hôtels, dîners de gala diplomatiques, vernissages.',
    description:
      'Une virtuosité discrète et continue. Le piano habite l’espace architectural avec élégance, pose le climat sans saturer la conversation, et installe une mémoire sonore du lieu.',
    highlights: [
      'Toucher acoustique subtil et dynamique maîtrisée',
      'Grandes mélodies intemporelles et standards revisités',
      'Présence continue sans rupture d’atmosphère',
    ],
  },
  {
    id: 'duo-signature',
    num: '02',
    title: 'Format Duo Signature',
    subtitle: 'Piano & Voix — Hervé & Flavie',
    audience: 'Cocktails de mariage, soirées corporate d’exception, réceptions privées.',
    description:
      'Le format scénique emblématique réunissant la virtuosité pianistique d’Hervé Nanfang et la voix de Flavie. Un dialogue complice qui captive l’attention et crée une intensité émotionnelle rare.',
    highlights: [
      'Alchimie harmonique et interprétation vocale haute fidélité',
      'Large spectre : soul, variété internationale et classiques africains',
      'Interaction raffinée et naturelle avec l’assistance',
    ],
  },
  {
    id: 'live-band',
    num: '03',
    title: 'Format Formation Élargie',
    subtitle: 'Live Band — Trio / Quartet',
    audience: 'Grandes célébrations, soirées de clôture, shows privés, festivals.',
    description:
      'Une formule augmentée avec section rythmique (basse, percussions traditionnelles et batterie). Une montée progressive en pulsation pour faire danser et vibrer les assemblées exigeantes.',
    highlights: [
      'Pulsation rythmique vivante et arrangements puissants',
      'Grooves camerounais, afro-jazz et pop festive',
      'Énergie de scène fédératrice et festive',
    ],
  },
]

export interface RepertoireUniverse {
  category: string
  description: string
  references: string[]
}

export const REPERTOIRE_UNIVERSES: RepertoireUniverse[] = [
  {
    category: 'Patrimoine & Racines Africaines',
    description:
      'Relectures acoustiques et pianistiques des trésors musicaux camerounais et panafricains. Les polyrythmies et mélodies emblématiques sublimées au clavier.',
    references: ['Manu Dibango', 'Eboa Lotin', 'Francis Bebey', 'Richard Bona', 'Rythmes Makossa & Bikutsi'],
  },
  {
    category: 'Great American Songbook & Blues',
    description:
      'L’âge d’or du jazz de Broadway et la profondeur du blues. Des harmonies soignées et une pulsation swing qui installent une atmosphère feutrée.',
    references: ['Duke Ellington', 'Ray Charles', 'Nina Simone', 'George Gershwin', 'Miles Davis'],
  },
  {
    category: 'Soul & Pop Internationale',
    description:
      'Les chefs-d’œuvre de la soul et de la pop mondiale des années 70 à aujourd’hui, portés par des arrangements chaleureux.',
    references: ['Stevie Wonder', 'Elton John', 'Bill Withers', 'Donny Hathaway', 'Néo-soul & Motown'],
  },
  {
    category: 'Chanson Poétique Francophone',
    description:
      'L’éloquence des grands auteurs-compositeurs francophones, où chaque accord sert le sens et l’émotion du texte.',
    references: ['Charles Aznavour', 'Jacques Brel', 'Henri Salvador', 'Michel Jonasz', 'Serge Gainsbourg'],
  },
]

export const REPERTOIRE = [
  'Jazz & Blues',
  'Musiques africaines',
  'Soul & Motown',
  'Standards francophones',
  'Pop internationale',
  'Musiques de film',
  'Variété contemporaine',
]

export const TECHNICAL_STANDARDS = [
  {
    title: 'Clavier de scène 88 touches',
    text: 'Mécanique à marteaux et toucher lourd professionnel reproduisant le répondant d’un piano acoustique de concert.',
  },
  {
    title: 'Système son haute fidélité',
    text: 'Diffusion colonne acoustique autonome, calibrée pour une dispersion sonore homogène sans agression auditive.',
  },
  {
    title: 'Captation voix de studio',
    text: 'Micros de chant haute précision et traitement dynamique assurant clarté et chaleur du timbre vocal.',
  },
  {
    title: 'Rigueur et autonomie régie',
    text: 'Installation silencieuse et rapide, balance discrète avant l’arrivée des invités et maîtrise du protocole.',
  },
]

export const PIANO_BAR_FEATURES = [
  {
    title: 'Live solo & formations',
    text: 'Piano solo, duo signature ou live band selon l’envergure du lieu et la dynamique souhaitée.',
  },
  {
    title: 'Répertoire sur mesure',
    text: 'Programmation architecturée en amont selon l’identité de l’événement et les attentes du public.',
  },
  {
    title: 'Installation autonome',
    text: 'Clavier professionnel et régie autonome intégrée, adaptée aux salles et espaces les plus exigeants.',
  },
  {
    title: 'Cadre institutionnel & privé',
    text: 'Hôtels 5 étoiles, lounges, réceptions diplomatiques, dîners de prestige et cérémonies privées.',
  },
]

export type LiveCategoryType = 'all' | 'piano-bar' | 'jazz' | 'duo' | 'scene'

export interface LivePerformance {
  id: string
  title: string
  category: string
  categoryType: LiveCategoryType
  subtitle: string
  duration: string
  location: string
  description: string
  tags: string[]
  youtubeUrl: string
  youtubeLabel: string
  musicians: string
  format: string
  thumbnailKey: 'affiche' | 'liveScene' | 'liveBand' | 'portrait'
  setlist: { time: string; label: string }[]
}

export const LIVE_PERFORMANCES: LivePerformance[] = [
  {
    id: 'solo-lounge',
    title: 'Le Pianobariste™ — Session Solo Lounge & Standards',
    category: 'Piano-bar Solo',
    categoryType: 'piano-bar',
    subtitle: 'Standards de Jazz, Ballades feutrées & Improvisations',
    duration: '06:45',
    location: 'Lounge hôtelier & Réceptions d’État',
    description:
      'L’art de la nuance acoustique : le piano installe une mémoire sonore du lieu sans jamais écraser les conversations. Toucher dynamique et harmonisation subtile.',
    tags: ['Piano Solo', 'Standards Jazz', 'Piano-bar', 'Ambiance Feutrée'],
    youtubeUrl: 'https://www.youtube.com/@hervenanfang',
    youtubeLabel: 'Visionner la session live',
    musicians: 'Hervé Nanfang (Piano de concert)',
    format: 'Format Solo Prestige',
    thumbnailKey: 'affiche',
    setlist: [
      { time: '00:00', label: 'Ouverture feutrée — Ballade jazz' },
      { time: '02:15', label: 'Standard Gershwin revisité' },
      { time: '04:30', label: 'Improvisation nocturne' },
    ],
  },
  {
    id: 'jazz-standards-session',
    title: 'Nuit de Jazz & Blues — Club & Grand Répertoire',
    category: 'Jazz & Blues',
    categoryType: 'jazz',
    subtitle: 'Duke Ellington, Miles Davis, Ray Charles & Blues Feutré',
    duration: '05:30',
    location: 'Club de jazz & Salons d’Honneur',
    description:
      'Pulsation swing, harmonies denses et phrasé blues. Une immersion dans les grands classiques du jazz américain portés par un toucher acoustique percussif et délicat.',
    tags: ['Jazz & Blues', 'Swing', 'Great American Songbook', 'Ray Charles'],
    youtubeUrl: 'https://www.youtube.com/@hervenanfang',
    youtubeLabel: 'Visionner la session live',
    musicians: 'Hervé Nanfang (Piano 88 touches)',
    format: 'Session Jazz Club',
    thumbnailKey: 'portrait',
    setlist: [
      { time: '00:00', label: 'Intro Blues & Voicing Ellingtonien' },
      { time: '01:50', label: 'Thème Swing & Rythmique main gauche' },
      { time: '03:40', label: 'Climax harmonique & Accord diminué final' },
    ],
  },
  {
    id: 'duo-flavie',
    title: 'Duo Signature — Hervé & Flavie en Concert Privé',
    category: 'Duo Piano-Voix',
    categoryType: 'duo',
    subtitle: 'Soul, Musiques Africaines & Chanson Poétique',
    duration: '07:15',
    location: 'Événements privés de prestige & Galas diplomatiques',
    description:
      'Dialogue complice entre les harmonies du piano et la voix de Flavie. Un répertoire transversal réunissant soul internationale, chanson poétique et classiques africains.',
    tags: ['Duo Signature', 'Piano-Voix', 'Soul & Jazz', 'Patrimoine Africain'],
    youtubeUrl: 'https://www.youtube.com/@hervenanfang',
    youtubeLabel: 'Visionner la session live',
    musicians: 'Hervé Nanfang (Piano) & Flavie (Voix Lead)',
    format: 'Format Duo Signature',
    thumbnailKey: 'liveScene',
    setlist: [
      { time: '00:00', label: 'Prélude acoustique piano solo' },
      { time: '01:30', label: 'Entrée voix — Ballade Soul intimiste' },
      { time: '04:10', label: 'Mélodie africaine & Envolée lyrique' },
    ],
  },
  {
    id: 'live-band-groove',
    title: 'Formation Élargie — Trio / Quartet Live Band',
    category: 'Scène & Live Band',
    categoryType: 'scene',
    subtitle: 'Makossa Revisité, Afrobeat & Afro-Jazz',
    duration: '08:20',
    location: 'Festivals, Galas internationaux & Shows privés',
    description:
      'Pulsation rythmique vivante : clavier, basse, batterie et percussions traditionnelles africaines. Une montée en énergie festive sublimant les trésors rythmiques du Cameroun.',
    tags: ['Live Band', 'Makossa', 'Afrobeat', 'Rythmes Camerounais'],
    youtubeUrl: 'https://www.youtube.com/@hervenanfang',
    youtubeLabel: 'Visionner le concert live',
    musicians: 'Hervé Nanfang (Claviers), Basse, Batterie & Percussions',
    format: 'Format Formation Élargie',
    thumbnailKey: 'liveBand',
    setlist: [
      { time: '00:00', label: 'Pulsation rythmique d’introduction' },
      { time: '02:40', label: 'Thème Makossa & Solo de piano percussif' },
      { time: '05:50', label: 'Montée en puissance & Appel aux percussions' },
    ],
  },
  {
    id: 'patrimoine-cameroun-piano',
    title: 'Rhapsodie Camerounaise — Hommage à Eboa Lotin & Francis Bebey',
    category: 'Patrimoine Africain',
    categoryType: 'jazz',
    subtitle: 'Relecture pianistique des polyrythmies du littoral',
    duration: '06:10',
    location: 'Auditoriums & Célébrations Culturelles Internationales',
    description:
      'Transposition magistrale des guitares et percussions patrimoniales sur les marteaux du piano à queue. La mémoire musicale du Cameroun célébrée avec noblesse.',
    tags: ['Patrimoine', 'Eboa Lotin', 'Francis Bebey', 'Piano Solo'],
    youtubeUrl: 'https://www.youtube.com/@hervenanfang',
    youtubeLabel: 'Visionner le récital',
    musicians: 'Hervé Nanfang (Piano acoustique)',
    format: 'Récital Patrimonial',
    thumbnailKey: 'affiche',
    setlist: [
      { time: '00:00', label: 'Thème d’Eboa Lotin en accords feutrés' },
      { time: '02:30', label: 'Polyrythmie Bebey transposée aux marteaux' },
      { time: '04:45', label: 'Final en cascade harmonique' },
    ],
  },
  {
    id: 'gala-cloture-show',
    title: 'Grand Concert de Gala — Final Festif & Scénique',
    category: 'Scène & Événement',
    categoryType: 'scene',
    subtitle: 'Afro-Pop, Funk & Final Fédérateur',
    duration: '09:05',
    location: 'Soirées de clôture institutionnelles & Grands Galas',
    description:
      'Le paroxysme de la soirée : lorsque la musique soulève la salle. Une fusion communicative entre énergie live, communion du public et rigueur régie irréprochable.',
    tags: ['Grand Gala', 'Afro-Pop', 'Clôture Scénique', 'Ambiance Festive'],
    youtubeUrl: 'https://www.youtube.com/@hervenanfang',
    youtubeLabel: 'Visionner le show de gala',
    musicians: 'Hervé Nanfang & Full Live Band (5 musiciens)',
    format: 'Grand Show de Gala',
    thumbnailKey: 'liveBand',
    setlist: [
      { time: '00:00', label: 'Départ groove & interaction salle' },
      { time: '03:15', label: 'Medley festif international' },
      { time: '07:00', label: 'Final standing ovation' },
    ],
  },
]

