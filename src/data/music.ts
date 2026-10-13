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
