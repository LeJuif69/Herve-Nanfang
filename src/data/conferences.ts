/**
 * Conférences & Masterclass — Données et fiches d'interventions officielles
 * Hervé Nanfang · Musicologue, Créateur du Musicien Augmenté™ & Fondateur RMA
 */

export interface Conference {
  id: string
  theme: string
  title: string
  pitch: string
  audience: string
  formats: string[]
  duration: string
  objectives: string[]
  deliverables: string[]
  techRequirements: string
}

export const CONFERENCES: Conference[] = [
  {
    id: 'musicien-augmente',
    theme: 'Musique & Intelligence Artificielle',
    title: 'Le musicien augmenté : créer à l’ère des modèles génératifs',
    pitch:
      "Comment un musicien professionnel peut intégrer l'intelligence artificielle dans sa pratique sans perdre sa voix, son identité et sa valeur artistique. De la peur du remplacement à l'hybridation féconde.",
    audience: 'Écoles de musique, conservatoires, festivals, universités & institutions culturelles',
    formats: ['Conférence plénière (45–60 min)', 'Masterclass interactive (2–3 h)', 'Atelier pratique / Hackathon'],
    duration: '45 min à 3 heures',
    objectives: [
      'Démystifier les modèles génératifs musicaux (Suno, Udio, Magenta, modèles d’analyse) et comprendre leurs limites réelles.',
      'Identifier les zones de valeur irremplaçables : décision esthétique, interprétation scénique, réactivité live et intention humaine.',
      'Maîtriser une méthode concrète d’hybridation : prompting musical, post-traitement, ré-harmonisation acoustique et droits d’auteur.',
    ],
    deliverables: [
      'Guide méthodologique synthétique « Le Musicien Augmenté » (PDF remis aux participants).',
      'Matrice d’évaluation artistique : quand utiliser l’IA et quand s’en passer.',
      'Grille de lecture juridique sur le droit d’auteur et la protection des œuvres.',
    ],
    techRequirements: 'Vidéoprojecteur HD / Écran HDMI, sonorisation stéréo haute fidélité, micro HF (ou micro cravate), connexion Internet stable, clavier de scène ou piano acoustique si masterclass.',
  },
  {
    id: 'mao-vers-ia',
    theme: 'Transformation numérique & Industrie',
    title: 'De la MAO à l’IA : les leçons de l’histoire technologique',
    pitch:
      'Ce que la révolution du home-studio et de la MAO dans les années 90–2000 a appris au monde musical — et ce que la révolution de l’IA va exiger de lui, en compétences, en organisation et en lucidité économique.',
    audience: 'Entreprises créatives, syndicats professionnels, institutions, agences audiovisuelles & étudiants',
    formats: ['Conférence plénière', 'Table ronde / Keynote d’ouverture', 'Séminaire stratégique'],
    duration: '60 à 90 minutes',
    objectives: [
      'Analyser les cycles d’adoption technologique en musique : synthétiseurs, échantillonneurs, home-studio et IA générative.',
      'Comprendre la mutation de la chaîne de valeur : pourquoi le mastering et l’arrangement automatisés ne remplacent pas la direction artistique.',
      'Anticiper les modèles économiques émergents pour les compositeurs, éditeurs et producteurs de musique.',
    ],
    deliverables: [
      'Fiche d’analyse prospective sur l’économie de la production musicale 2026–2030.',
      'Repères chronologiques des ruptures technologiques dans la musique.',
    ],
    techRequirements: 'Vidéoprojecteur HDMI, sonorisation de salle, micro sans fil, pupitre ou espace scénique libre.',
  },
  {
    id: 'pedagogie-ia',
    theme: 'Pédagogie & Transmission',
    title: 'Enseigner la musique à l’ère des intelligences artificielles',
    pitch:
      "Repenser les programmes, les évaluations et la place de l'élève quand les outils savent générer des partitions, analyser des fautes et produire des grilles en un clic. Le rôle du professeur devient plus décisif que jamais.",
    audience: 'Directions pédagogiques, professeurs de conservatoire, formateurs, ministères de la Culture & de l’Éducation',
    formats: ['Conférence magistrale', 'Journée pédagogique', 'Formation de formateurs'],
    duration: '1 h 30 à 1 journée',
    objectives: [
      'Redéfinir le rôle de l’enseignant : de transmetteur d’informations vers architecte de discernement et d’écoute.',
      'Adapter les épreuves d’évaluation : privilégier l’oralité, le toucher instrumental, l’improvisation vivante et l’explication critique.',
      'Intégrer les outils numériques dans la classe comme amplificateurs d’oreille et de curiosité.',
    ],
    deliverables: [
      'Fascicule pédagogique « Pédagogie musicale augmentée » avec exercices types.',
      'Grilles d’évaluation renouvelées tenant compte de l’accès aux outils numériques.',
      'Bibliographie et corpus de ressources vérifiées pour enseignants.',
    ],
    techRequirements: 'Vidéoprojecteur, sonorisation, paperboard ou tableau blanc, piano ou clavier 88 touches recommandé.',
  },
  {
    id: 'carriere-digitale',
    theme: 'Carrière & Entrepreneuriat artistique',
    title: 'Construire sa carrière musicale à l’ère digitale',
    pitch:
      "Compétences clés, positionnement, diversification des revenus, présence en ligne et gestion de réseau : les fondations d'une carrière musicale solide et durable dans un écosystème transformé.",
    audience: 'Étudiants en fin de cycle, artistes émergents, incubateurs culturels, managers & indépendants',
    formats: ['Conférence (60 min)', 'Atelier interactif (2 h)', 'Programme d’accompagnement sur mesure'],
    duration: '1 h à 3 heures',
    objectives: [
      'Structurer un modèle économique viable à trois piliers : scène live, production studio et transmission pédagogique.',
      'Sortir de la dépendance aux algorithmes de streaming grâce à la captation directe de valeur (communauté, événements, enseignement).',
      'Gérer son temps, sa formation continue et sa santé vocale/instrumentale dans la durée.',
    ],
    deliverables: [
      'Modèle de Business Plan artistique pour musicien indépendant.',
      'Checklist de déploiement de projet : du pitch à la régie de spectacle.',
    ],
    techRequirements: 'Vidéoprojecteur / Écran, système son stéréo, micro sans fil.',
  },
  {
    id: 'musicien-marque',
    theme: 'Communication & Valeur de marque',
    title: 'Le musicien comme marque : authenticité, récit et autorité',
    pitch:
      "Un musicien professionnel n'est pas seulement un exécutant : c'est une signature, une promesse, une proposition de valeur. Comment bâtir une marque artistique forte sans sacrifier sa sincérité ni son éthique.",
    audience: 'Artistes confirmés, collectifs, agences de booking, directeurs de festivals, écoles de commerce culturel',
    formats: ['Conférence (45–60 min)', 'Masterclass Branding & Pitch', 'Coaching intensif'],
    duration: '1 h à 2 heures',
    objectives: [
      'Définir sa signature artistique unique : ce qui fait qu’on vous appelle vous plutôt qu’un autre.',
      'Construire une narration authentique (storytelling) appuyée sur votre trajectoire réelle.',
      'Développer des supports de communication professionnels (dossier de presse, captations ciblées, site d’autorité).',
    ],
    deliverables: [
      'Cahier d’exercices « Architecture de marque musicale ».',
      'Structure type d’un dossier de presse d’artiste haut de gamme.',
      'Passerelle d’application : passer à l’action via notre offre d’accompagnement Conseil & Marque (/services#strategie-digitale).',
    ],
    techRequirements: 'Vidéoprojecteur HDMI, sonorisation, micro sans fil.',
  },
  {
    id: 'musique-image-cinema',
    theme: 'Musique à l’image & Cinéma',
    title: 'Musique, image et narration : composer pour l’audiovisuel et le cinéma en Afrique',
    pitch:
      'De la lecture du scénario au mixage stéréo/5.1 : méthode d’analyse dramaturgique, synchronisation temporelle, écriture thématique et intégration des sonorités patrimoniales africaines dans le cinéma contemporain.',
    audience:
      'Écoles de cinéma et audiovisuel (ESAS, ISMA, IBA...), réalisateurs, producteurs, compositeurs de film & monteurs',
    formats: [
      'Conférence magistrale (1 h 30)',
      'Masterclass sur station DAW / table de montage (2–3 h)',
      'Atelier pratique de scoring live sur extrait filmique',
    ],
    duration: '1 h 30 à 1 journée',
    objectives: [
      'Analyser la dramaturgie d’une séquence : fonction diégétique vs extradiégétique, thèmes conducteurs (leitmotivs) et silences expressifs.',
      'Adapter le timing musical aux contraintes du montage : timecode SMPTE, hit points et respirations narratives.',
      'Intégrer les instruments et polyrythmies patrimoniales sans tomber dans le pastiche hollywoodien ni le folklore figé.',
      'Gérer la chaîne technique son/image : livraison de stems, mixage musique vs dialogues/bruitages et cadre contractuel de cession de droits audiovisuels.',
    ],
    deliverables: [
      'Fiche technique et méthodologique « Scoring pour le cinéma africain » (PDF).',
      'Session DAW commentée avec pistes séparées (stems) pour étude de cas.',
      'Grille contractuelle type de cession de droits pour œuvres audiovisuelles.',
    ],
    techRequirements:
      'Vidéoprojecteur grand écran ou écran LED HDMI avec restitution vidéo fluide, système d’écoute stéréo monitoring professionnel de haute précision, micro HF, clavier de commande MIDI ou piano acoustique.',
  },
]

export const CONFERENCE_AUDIENCES = [
  'Universités & Grandes Écoles',
  'Conservatoires & Écoles de musique',
  'Institutions culturelles & Ministères',
  'Festivals & Forums professionnels',
  'Entreprises créatives & Studios',
  'Organisations professionnelles & Médias',
]

export const INTERVENTION_FORMATS = [
  { id: 'keynote', label: 'Conférence plénière / Keynote', duration: '45–60 min' },
  { id: 'masterclass', label: 'Masterclass avec démonstrations live au piano', duration: '2–3 heures' },
  { id: 'atelier', label: 'Atelier pratique / Travaux dirigés', duration: 'Demi-journée (3–4 h)' },
  { id: 'seminaire', label: 'Séminaire institutionnel / Journée d’étude', duration: 'Journée complète' },
]
