/**
 * Services & Tarification — Données des prestations officielles d'Hervé Nanfang
 * ===============================================================================
 * Quatre familles de services, avec formules, conditions et modalités de contact.
 */

export type ServiceTier = {
  label: string
  subtitle: string
  duration: string
  /** null = sur devis, string = indication tarifaire */
  price: string | null
  features: string[]
  highlight?: boolean
  cta?: string
}

export type CaseStudy = {
  title: string
  context: string
  deliverable: string
  to?: string
}

export type ServiceOffering = {
  id: string
  icon: string
  family: string
  title: string
  tagline: string
  description: string
  tiers: ServiceTier[]
  /** Conditions générales communes à la famille */
  conditions: string[]
  /** Réalisations ou études de cas vérifiables associées */
  cases?: CaseStudy[]
  contactLabel: string
  contactTo: string
}

export const SERVICE_OFFERINGS: ServiceOffering[] = [
  {
    id: "pianobariste",
    icon: "🎹",
    family: "Musique live",
    title: "Le Pianobariste™",
    tagline: "Piano live pour palaces, événements et lieux de prestige",
    description:
      "Piano live acoustique ou amplifié, couvrant plus de 440 titres de jazz, blues, bossa nova, variété francophone, afropop et standards internationaux. Depuis 2007 dans les hôtels, lounges et événements privés de Yaoundé et du Cameroun.",
    tiers: [
      {
        label: "Session Lounge",
        subtitle: "Ambiance feutrée · réception · cocktail",
        duration: "2 h",
        price: "Sur devis",
        features: [
          "Piano acoustique ou numérique haut de gamme",
          "Répertoire jazz & standards feutrés",
          "Adaptation au tempo de l'événement en temps réel",
          "Matériel de sonorisation léger si besoin",
        ],
      },
      {
        label: "Soirée Prestige",
        subtitle: "Dîner / Gala / Réception diplomatique",
        duration: "3–4 h",
        price: "Sur devis",
        highlight: true,
        features: [
          "Piano live continu avec pauses concertées",
          "Adaptation tonale aux discours & prises de parole",
          "Duo piano-voix disponible en option",
          "Playlist curatée et concertée en amont",
          "Équipement de scène professionnel fourni",
        ],
        cta: "Option la plus demandée",
      },
      {
        label: "Programme Live Band",
        subtitle: "Concert · Festival · Événement d'envergure",
        duration: "45–90 min de set",
        price: "Sur devis",
        features: [
          "Formation trio, quartet ou live band (selon projet)",
          "Direction musicale et réglage de balance de scène",
          "Répertoire original et reprises arrangées",
          "Fiche technique complète fournie",
          "Disponible Yaoundé et déplacement Afrique centrale",
        ],
      },
    ],
    conditions: [
      "Devis personnalisé selon lieu, durée, équipement disponible et date.",
      "Déplacement hors Yaoundé : frais de déplacement et logistique inclus dans le devis.",
      "Caution matériel exigée pour locations de piano de concert.",
      "Confirmation par contrat de prestation ou bon de commande institutionnel.",
    ],
    contactLabel: "Demander un devis live",
    contactTo: "/contact#live",
  },
  {
    id: "production",
    icon: "🎛️",
    family: "Studio & Ingénierie du son",
    title: "Production & Ingénierie sonore",
    tagline: "Composition, arrangement et post-production pour artistes & médias",
    description:
      "Composition originale, arrangement, direction de production, enregistrement studio, mixage et mastering. Pour artistes, maisons de disques, médias audiovisuels, institutions et jingles publicitaires.",
    tiers: [
      {
        label: "Arrangement & MAO",
        subtitle: "Habillage sonore · backing-track · arrangement",
        duration: "Par titre",
        price: "Sur devis",
        features: [
          "Arrangement complet d'un titre existant",
          "Production instrumentale (backing track scène ou studio)",
          "Export multi-format (WAV/MP3 stems séparés)",
          "Revue et validation en 2 cycles de révision inclus",
        ],
      },
      {
        label: "Production complète",
        subtitle: "Single / EP / Bande originale",
        duration: "Projet",
        price: "Sur devis",
        highlight: true,
        features: [
          "Composition, arrangement et direction artistique",
          "Enregistrement voix, instruments et overdubs",
          "Mixage stéréo et mastering haute fidélité",
          "Livraison des stems et masters finaux",
          "Conseil sur la stratégie de sortie (distribution)",
        ],
        cta: "Formule la plus demandée par les artistes",
      },
      {
        label: "Musique à l'image",
        subtitle: "Film · Publicité · Documentaire",
        duration: "Projet audiovisuel",
        price: "Sur devis",
        features: [
          "Score original synchronisé à l'image (timecode SMPTE)",
          "Composition thématique et leitmotivs",
          "Livraison stems QT / MXF pour montage",
          "Contrat de cession de droits audiovisuels inclus",
          "Collaboration possible à distance (DAW session)",
        ],
      },
    ],
    conditions: [
      "Acompte de 50 % à la commande, solde à la livraison finale.",
      "Droits d'auteur restent propriété de l'artiste commanditaire (cession totale sur demande).",
      "Délai de livraison indicatif : 1 à 3 semaines selon complexité.",
      "Les sessions de révision supplémentaires au-delà de 2 cycles sont facturées au temps.",
    ],
    contactLabel: "Demander une production",
    contactTo: "/contact#production",
  },
  {
    id: "conferences",
    icon: "🎙️",
    family: "Conférences & Conseil",
    title: "Conférences & Masterclass",
    tagline: "Interventions sur l'IA, la musique, la pédagogie et la création culturelle",
    description:
      "Six thèmes de conférences pour universités, écoles de musique, écoles de cinéma, institutions, festivals et entreprises créatives. Conférence plénière, masterclass interactive ou atelier pratique.",
    tiers: [
      {
        label: "Conférence Plénière",
        subtitle: "Keynote · Séminaire · Forum",
        duration: "45–60 min",
        price: "Sur devis",
        features: [
          "Exposé structuré avec démonstrations en direct",
          "Supports visuels et PDF remis aux participants",
          "Session de questions-réponses (15 min)",
          "Disponible en français, anglais ou bilingue",
        ],
      },
      {
        label: "Masterclass Interactive",
        subtitle: "Conservatoire · École · Université",
        duration: "2–3 h",
        price: "Sur devis",
        highlight: true,
        features: [
          "Exposé suivi d'exercices pratiques au piano",
          "Interaction directe avec les participants",
          "Guide méthodologique remis (PDF)",
          "Démonstrations IA / MAO en temps réel si disponible",
          "Rapport pédagogique post-intervention sur demande",
        ],
        cta: "Format le plus plébiscité par les établissements",
      },
      {
        label: "Atelier / Journée d'étude",
        subtitle: "Groupe restreint · Formation de formateurs",
        duration: "Demi-journée à journée complète",
        price: "Sur devis",
        features: [
          "Travail en groupes sur cas pratiques",
          "Conception de curricula ou évaluation de programmes existants",
          "Livrables opérationnels (grilles, fiches, plans)",
          "Suivi à distance possible après la journée",
        ],
      },
    ],
    conditions: [
      "Devis sur présentation du projet : public visé, date, lieu et objectifs pédagogiques.",
      "Frais de déplacement et logistique à la charge de l'organisateur.",
      "Conditions spéciales pour les institutions publiques et les établissements d'Afrique subsaharienne.",
      "Disponible en présentiel, hybride ou 100 % distanciel.",
    ],
    contactLabel: "Demander une conférence",
    contactTo: "/conferences#simulateur",
  },
  {
    id: "formation-rma",
    icon: "📚",
    family: "Formation RMA",
    title: "Formations & Cursus RMA",
    tagline: "Cours de musique, Permis de Jouer™ et accompagnement pédagogique",
    description:
      "Racines Musicales Academy® : cursus individuels hebdomadaires, ateliers collectifs, programme intensif « Vacances Utiles » (7 semaines) et formation de formateurs musicaux en école ou conservatoire.",
    tiers: [
      {
        label: "Cours individuel",
        subtitle: "Piano · Chant · Guitare · Batterie",
        duration: "45 min / sem.",
        price: "Sur devis",
        features: [
          "Cours hebdomadaire adapté au palier Permis de Jouer™",
          "Plan de progression personnalisé et suivi trimestriel",
          "Accès aux ressources pédagogiques RMA (fiches & méthodes)",
          "Studio RMA Yaoundé ou cours à distance (Zoom/WhatsApp)",
        ],
      },
      {
        label: "Vacances Utiles",
        subtitle: "Programme intensif 7 semaines",
        duration: "7 semaines · été / vacances",
        price: "Sur devis",
        highlight: true,
        features: [
          "Socle RMA-01 : Pulsation & Body (rythme corporel)",
          "Clavier, lecture de partition et théorie musicale appliquée",
          "Ateliers collectifs et restitution finale Damas–Petits Génies",
          "Livret de progression fourni à chaque participant",
          "Accessible dès 6 ans",
        ],
        cta: "Programme phare de la RMA",
      },
      {
        label: "Formation de formateurs",
        subtitle: "Institutions · Conservatoires · Écoles",
        duration: "Sur mesure",
        price: "Sur devis",
        features: [
          "Conception et révision de curricula musicaux",
          "Méthodes d'évaluation par compétences réelles",
          "Accompagnement de la direction pédagogique",
          "Livrables : fiches, grilles, plans de cours, outils",
          "Possible en présentiel ou en distanciel",
        ],
      },
    ],
    conditions: [
      "Inscription par formulaire de candidature ou par WhatsApp au +237 694 72 34 92.",
      "Séance d'évaluation diagnostique (audition) préalable pour les cours individuels.",
      "Réductions pour fratries ou groupes d'institutions publiques.",
      "Partenariats institutionnels (ministères, associations, ONG) sur convention.",
    ],
    contactLabel: "S'inscrire à la RMA",
    contactTo: "/rma#inscriptions",
  },
  {
    id: "strategie-digitale",
    icon: "🧭",
    family: "Stratégie & Communication",
    title: "Conseil & Stratégie de marque culturelle",
    tagline: "Architecture de marque, récit d'autorité et diffusion : « Un savoir qui ne circule pas n’existe pas »",
    description:
      "Accompagnement stratégique et opérationnel pour artistes, ensembles, institutions culturelles et créateurs. Définition du positionnement, extraction du récit authentique, conception du dossier de presse d'autorité et structuration de workflows de publication assistés par IA sans perte d'identité.",
    tiers: [
      {
        label: "Diagnostic & Positionnement",
        subtitle: "Artiste solo · Projet émergent · Rebranding",
        duration: "1 à 2 semaines",
        price: "Sur devis",
        features: [
          "Audit d'empreinte numérique et analyse de la perception actuelle",
          "Clarification de la proposition de valeur et signature artistique unique",
          "Identification des cibles prioritaires (programmateurs, institutions, public)",
          "Livrable : Feuille de route stratégique & axes de différenciation (PDF)",
        ],
      },
      {
        label: "Récit de Marque & Dossier d'Autorité",
        subtitle: "Artiste confirmé · Collectif · Sortie d'album",
        duration: "2 à 3 semaines",
        price: "Sur devis",
        highlight: true,
        features: [
          "Rédaction du récit fondateur (storytelling appuyé sur la trajectoire réelle)",
          "Biographies calibrées multi-formats (20, 50, 90, 150 mots)",
          "Dossier de presse haut de gamme (EPK textuel et structure visuelle)",
          "Ligne éditoriale et angles de prise de parole pour réseaux sociaux",
          "Prompts et modèles IA sur mesure pour vos rédactions futures",
        ],
        cta: "Recommandé pour sorties & tournées",
      },
      {
        label: "Accompagnement de Structure",
        subtitle: "École de musique · Festival · Label · Institution",
        duration: "Mission mensuelle ou projet",
        price: "Sur devis",
        features: [
          "Architecture de communication globale de l'écosystème culturel",
          "Stratégie de lancement et campagnes d'inscriptions ou de billetterie",
          "Formation de l'équipe aux outils numériques et à l'IA générative",
          "Mise en place d'un calendrier éditorial pérenne et autonome",
          "Livrable : Manuel de communication opérationnel sur mesure",
        ],
      },
    ],
    conditions: [
      "Entretien préalable de cadrage de 30 minutes offert pour valider vos objectifs.",
      "Devis personnalisé détaillé remis sous 48 heures ouvrées.",
      "Délai indicatif : 1 à 3 semaines selon formule ; calendrier arrêté contractuellement.",
      "Transmission de méthodes et modèles réutilisables garantissant votre autonomie.",
      "Disponible en distanciel (visio / partage d'outils) ou en présentiel (Yaoundé & Afrique centrale).",
    ],
    cases: [
      {
        title: "A Laiz Ô Pays — Architecture d'auteur & manifeste culturel",
        context: "Articulation lisible entre l'identité centrale de Hervé Nanfang, son manifeste fondateur A Laiz Ô Pays et ses trois signatures (Le Pianobariste, Racines Musicales Academy, Musicien Augmenté).",
        deliverable: "Plateforme de marque multi-entités, gouvernance éditoriale et charte de positionnement unifiée.",
        to: "/projets",
      },
      {
        title: "Racines Musicales Academy®",
        context: "Lancement d'une académie de musique enracinée dans le patrimoine africain et connectée aux pratiques contemporaines.",
        deliverable: "Récit de lancement, supports de rentrée, campagnes Vacances Utiles et kit de notoriété locale.",
        to: "/rma",
      },
      {
        title: "Musicien Augmenté™",
        context: "Création d'un territoire d'autorité combinant pratique instrumentale d'excellence et prospective technologique sur l'IA.",
        deliverable: "Manifeste d'autorité, série éditoriale du Journal et référencement naturel d'expert.",
        to: "/ia-technologie",
      },
    ],
    contactLabel: "Demander un accompagnement",
    contactTo: "/contact#conseil",
  },
]

/** Engagements transversaux à tous les services */
export const SERVICE_COMMITMENTS = [
  {
    icon: "✦",
    title: "Devis clair et délai tenu",
    text: "Chaque prestation est formalisée par un bon de commande ou un contrat. Le calendrier et les livrables sont fixés avant le début du travail.",
  },
  {
    icon: "◈",
    title: "Adaptation au contexte africain",
    text: "Les conditions tarifaires et logistiques tiennent compte du contexte économique et infrastructurel des porteurs de projets culturels d'Afrique subsaharienne.",
  },
  {
    icon: "⬡",
    title: "Confidentialité et droits",
    text: "Les droits d'auteur et les données des commanditaires sont traités avec rigueur. Un contrat de cession est systématiquement proposé pour les productions musicales.",
  },
  {
    icon: "⟡",
    title: "Suivi post-prestation",
    text: "Pour les formations et les conférences, une disponibilité est assurée après l'intervention pour les questions complémentaires et le suivi pédagogique.",
  },
]
