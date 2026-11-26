import type { Article } from './articles'
import { ARTICLE_CURATION } from './article-curation'

export type ArticleSummary = Pick<
  Article,
  'slug' | 'num' | 'category' | 'title' | 'excerpt' | 'readingTime' | 'status' | 'linkedConcept' | 'publishedAt'
> & Pick<Article, 'relatedSlugs'>

const ARTICLE_SUMMARY_DATA: Omit<ArticleSummary, 'relatedSlugs'>[] = [
  {
    "slug": "apres-la-mao-lia",
    "num": "01",
    "category": "IA",
    "title": "Après la MAO, l’IA : comment les musiciens peuvent évoluer sans perdre leur identité",
    "excerpt": "La MAO n’a pas supprimé le musicien : elle a redistribué les compétences. L’IA ouvre une nouvelle étape où la machine ne se contente plus d’exécuter, mais formule des propositions esthétiques. Analyse, retours d’expérience en studio à Yaoundé et méthode d’auteur pour adopter la technologie sans diluer sa signature culturelle.",
    "readingTime": "12 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  },
  {
    "slug": "ia-va-t-elle-remplacer-les-musiciens",
    "num": "02",
    "category": "IA",
    "title": "L’IA va-t-elle remplacer les musiciens ?",
    "excerpt": "L’IA peut automatiser certaines tâches et fragiliser des revenus, mais elle ne transforme pas tous les métiers musicaux de la même manière. Pour comprendre le risque, il faut regarder le travail réel, pas répondre par un slogan.",
    "readingTime": "7 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Les sept thèses du manifeste",
      "to": "/ia-technologie#manifeste"
    }
  },
  {
    "slug": "musicien-augmente-definition",
    "num": "03",
    "category": "Réflexions",
    "title": "Musicien augmenté : définition, enjeux et perspectives",
    "excerpt": "Musicien Augmenté™ ne désigne ni un logiciel miracle ni une promesse de productivité industrielle. C’est un cadre doctrinal et professionnel formalisé par Hervé Nanfang pour utiliser l’IA afin d’étendre les capacités du créateur sans lui retirer son jugement esthétique, sa responsabilité d’auteur ni son ancrage culturel.",
    "readingTime": "14 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Le manifeste Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  },
  {
    "slug": "ia-et-musique-live",
    "num": "04",
    "category": "Musique",
    "title": "IA et musique live : ce que la technologie ne doit jamais remplacer",
    "excerpt": "Le live n’est pas une scène sans technologie : c’est une situation où les choix doivent rester adaptés au lieu, au moment et aux personnes présentes. Où placer la limite quand l’IA entre dans le jeu ?",
    "readingTime": "7 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Le Pianobariste™",
      "to": "/musique#pianobariste"
    }
  },
  {
    "slug": "5-facons-ia-carriere-musicien",
    "num": "05",
    "category": "Entrepreneuriat",
    "title": "5 façons dont un musicien peut utiliser l’IA dans sa carrière",
    "excerpt": "Des usages concrets, immédiatement applicables : création, communication, organisation, facturation, veille. Sans gadget, sans dépendance.",
    "readingTime": "8 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Formats de formation",
      "to": "/ia-technologie#formats"
    }
  },
  {
    "slug": "ia-mao-creation-musicale",
    "num": "06",
    "category": "MAO",
    "title": "IA, MAO et création musicale : vers une nouvelle génération de musiciens",
    "excerpt": "Deux vagues technologiques, un même mouvement : l’outil se rapproche de la décision créative. Ce que cela exige des musiciens qui arrivent maintenant.",
    "readingTime": "7 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Formations & MAO",
      "to": "/pedagogie#formations"
    }
  },
  {
    "slug": "musiciens-africains-et-ia",
    "num": "07",
    "category": "Culture",
    "title": "Pourquoi les musiciens africains doivent comprendre l’intelligence artificielle",
    "excerpt": "Ne pas comprendre l'IA, c'est accepter que d'autres modélisent et monétisent nos cultures. Une question de souveraineté autant que de technique.",
    "readingTime": "7 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Culture & Recherche",
      "to": "/culture-recherche"
    }
  },
  {
    "slug": "fela-kuti-afrobeat-revolution-musicale-politique",
    "num": "08",
    "category": "Culture",
    "title": "Fela Kuti et l’Afrobeat : une révolution musicale et politique en Afrique",
    "excerpt": "Né sous l’impulsion de Fela Kuti et de Tony Allen dans le Nigeria des années 1970, l’Afrobeat transcende le genre musical : analyse technique de ses polyrythmies, puissance subversive de ses textes et portée politique.",
    "readingTime": "12 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Culture & Recherche",
      "to": "/culture-recherche"
    }
  },
  {
    "slug": "musique-a-l-image-cinema-africain",
    "num": "09",
    "category": "Musique",
    "title": "Musique à l’image : composer, narrer et transmettre dans le cinéma africain",
    "excerpt": "La musique de film ne comble pas le silence : elle structure la narration, guide le regard et révèle l’invisible. Analyse des fonctions musicales de l’écran, de la dramaturgie de Harry Potter aux codes du cinéma africain contemporain.",
    "readingTime": "8 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Culture & Recherche",
      "to": "/culture-recherche"
    }
  },
  {
    "slug": "methode-permis-de-jouer-pedagogie-musicale",
    "num": "10",
    "category": "Pédagogie",
    "title": "La méthode Permis de Jouer™ : réinventer l’apprentissage musical",
    "excerpt": "Pourquoi tant d’élèves abandonnent-ils le piano après deux ans de solfège déconnecté ? Retour sur les fondements du Permis de Jouer™ et la pédagogie RMA : pulsation corporelle, compétences réelles et paliers N1 à N4.",
    "readingTime": "7 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "A Laiz Academy",
      "to": "/rma"
    }
  },
  {
    "slug": "musicien-marque-recit",
    "num": "11",
    "category": "Communication digitale",
    "title": "Le musicien et sa marque : pourquoi le récit précède le logo",
    "excerpt": "Avant l’identité visuelle, les shootings photo et les logos, il y a une proposition de valeur artistique. Comment bâtir une marque musicale d’autorité, authentique et durable, ancrée dans une trajectoire réelle.",
    "readingTime": "7 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Conseil & Stratégie de marque",
      "to": "/services#strategie-digitale"
    }
  },
  {
    "slug": "ia-droits-auteur-musique-africaine",
    "num": "12",
    "category": "Technologies & IA",
    "title": "L’IA apprend de notre musique. Qui rémunère les créateurs ?",
    "excerpt": "Droits d’auteur, mémoire algorithmique, données musicales et souveraineté culturelle africaine : tribune de fond par Hervé Nanfang sur les leçons de GEMA c. Suno, la Loi camerounaise 2000/011 et l’économie des archives sonores.",
    "readingTime": "12 min",
    "status": "Publié",
    "publishedAt": "2026-11-04",
    "linkedConcept": {
      "label": "Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  },
  {
    "slug": "le-bikutsi-au-dela-de-la-mesure",
    "num": "13",
    "category": "Musicologie & Patrimoine",
    "title": "Le bikutsi au-delà de la mesure : pulsation, mouvement et organisation du rythme",
    "excerpt": "Le bikutsi est trop souvent réduit à une cadence binaire effrénée. Analyse ethnomusicologique de sa véritable pulsation ternaire 12/8 asymétrique, de la transposition du balafon Beti à la guitare moderne et de la corporéité du rythme.",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Musicologie africaine",
      "to": "/culture-recherche"
    }
  },
  {
    "slug": "documenter-les-traditions-musicales-orales",
    "num": "14",
    "category": "Musicologie & Patrimoine",
    "title": "Documenter les traditions musicales orales : méthode, contexte et responsabilité du chercheur",
    "excerpt": "Comment enregistrer et archiver le patrimoine musical oral sans le dénaturer ni déposséder ses dépositaires ? Guide méthodologique d’enquête de terrain, de captation acoustique et d’éthique documentaire en Afrique centrale.",
    "readingTime": "16 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Recherche & Patrimoine",
      "to": "/culture-recherche"
    }
  },
  {
    "slug": "apprendre-accompagner-chanson-clavier",
    "num": "15",
    "category": "Pédagogie & Formation",
    "title": "Apprendre à accompagner une chanson au clavier : de l’écoute aux premiers accords",
    "excerpt": "Comment libérer l’apprenti pianiste de la peur de la fausse note grâce à l’analyse aurale, au chiffrage américain vivant et à la méthode du Permis de Jouer™ développée à la Racines Musicales Academy®.",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Le Permis de Jouer™",
      "to": "/pedagogie#permis-de-jouer"
    }
  },
  {
    "slug": "enseigner-la-musique-sans-enfermer-eleve",
    "num": "16",
    "category": "Pédagogie & Formation",
    "title": "Enseigner la musique sans enfermer l’élève dans une seule méthode",
    "excerpt": "Pourquoi opposer le solfège académique à l’apprentissage d’oreille est un faux débat : analyse des principes d’une formation musicale hybride et humaniste fondée sur le projet artistique de l’élève.",
    "readingTime": "16 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "A Laiz Academy (ex-RMA)",
      "to": "/rma"
    }
  },
  {
    "slug": "piano-bar-construire-progression-musicale",
    "num": "17",
    "category": "Le Pianobariste & Live",
    "title": "Piano-bar : comment construire la progression musicale d’une soirée",
    "excerpt": "Retour d’expérience sur plus de 15 années de résidences dans les grands hôtels et salons feutrés : les trois temps d’une soirée, le contrôle du volume acoustique et la psychologie du public.",
    "readingTime": "16 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Le Pianobariste",
      "to": "/services#pianobariste"
    }
  },
  {
    "slug": "duo-piano-voix-arrangements-tessitures-dialogue",
    "num": "18",
    "category": "Le Pianobariste & Live",
    "title": "Construire un duo piano-voix : arrangements, tessitures et dialogue scénique",
    "excerpt": "Retour d’expérience sur la complicité de scène du duo Hervé Nanfang & Flavie : gestion de l’espace fréquentiel, adaptation des tonalités, rubato partagé et dramaturgie des répertoires.",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Duo Scénique",
      "to": "/services#pianobariste"
    }
  },
  {
    "slug": "balance-sonore-concert-gains-retours-larsen",
    "num": "19",
    "category": "Ingénierie du son & Studio",
    "title": "La balance sonore d’un concert : comprendre les gains, les retours et les risques de larsen",
    "excerpt": "Guide technique d’ingénierie live en Afrique centrale : optimiser le rapport signal/bruit, caler les retours (wedges et IEM), éliminer le larsen avant qu’il ne naisse et préserver la santé auditive.",
    "readingTime": "16 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Ingénierie du son",
      "to": "/services#production"
    }
  },
  {
    "slug": "amenager-home-studio-moyens-limites-acoustique",
    "num": "20",
    "category": "Ingénierie du son & Studio",
    "title": "Aménager un home studio avec des moyens limités : ce qu’il faut traiter en premier",
    "excerpt": "Traitement acoustique vs isolation phonique, placement des moniteurs (règle des 38 %), fabrication de bass traps en laine minérale et calibration : la méthode pour un son professionnel à coût maîtrisé.",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Studio & Production",
      "to": "/services#production"
    }
  },
  {
    "slug": "travail-invisible-musicien-facturation-valeur",
    "num": "21",
    "category": "Entrepreneuriat culturel",
    "title": "Le travail invisible du musicien : pourquoi facturer au-delà du temps passé sur scène",
    "excerpt": "Démystifier le coût réel d’une prestation artistique en Afrique : calcul du taux journalier moyen (TJM), rédaction de devis inattaquables, négociation de contrat et respect des normes professionnelles.",
    "readingTime": "17 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Entrepreneuriat & Devis",
      "to": "/services"
    }
  },
  {
    "slug": "construire-marque-artistique-singuliere-ere-streaming",
    "num": "22",
    "category": "Marque & Stratégie",
    "title": "Construire une identité musicale singulière à l’ère des plateformes de streaming",
    "excerpt": "Devenir son propre média : analyse stratégique de l’univers créatif A Laiz Ô Pays, de l’importance du site web propriétaire, des relations directes avec son public et de la signature « Créer · Transmettre · Augmenter · Développer ».",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Manifeste Artistique",
      "to": "/a-propos"
    }
  },
  {
    "slug": "composer-pour-l-image-dramaturgie-cinema-africain",
    "num": "23",
    "category": "Composition & B.O.",
    "title": "Composer pour l’image : dramaturgie sonore et identité musicale dans le cinéma africain",
    "excerpt": "De la dramaturgie des silences à l’intégration organique des instruments traditionnels (mvet, balafon, sanza) dans l’orchestration contemporaine : retour d’expérience d’écriture pour l’écran.",
    "readingTime": "16 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Composition & B.O.",
      "to": "/services#production"
    }
  },
  {
    "slug": "droit-auteur-ia-musique-cameroun-oapi",
    "num": "24",
    "category": "Technologies & IA",
    "title": "Droit d’auteur, IA générative et création musicale au Cameroun : le cadre OAPI et la Loi 2000/011",
    "excerpt": "Étude doctrinale et pratique pour artistes et producteurs : statut des prompts, titularité des droits patrimoniaux et moraux, pillage des patrimoines oraux et souveraineté juridique du créateur africain.",
    "readingTime": "18 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  },
  {
    "slug": "traduire-tradition-orale-au-clavier-rythmes-camerounais",
    "num": "25",
    "category": "Musicologie & Patrimoine",
    "title": "Traduire la tradition orale au clavier : rythmes camerounais, langues tonales et transmission",
    "excerpt": "La culture musicale africaine n’est ni un décor folklorique ni une simple boucle de percussions : c’est une architecture sonore et linguistique de haute précision. Méthode musicologique et pratique pianistique pour aborder les polyrythmies camerounaises (Bikutsi), comprendre l’impact des langues tonales (comme le Tswefap de Batoufam) et transmettre au clavier sans trahir l’esprit de la tradition orale.",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Culture & Recherche",
      "to": "/culture-recherche"
    }
  },
  {
    "slug": "economie-du-musicien-afrique-modele-hybride",
    "num": "26",
    "category": "Entrepreneuriat culturel",
    "title": "L’économie du musicien en Afrique francophone : sortir de la précarité par un modèle hybride",
    "excerpt": "Crise endémique des sociétés de gestion collective au Cameroun, cachets aléatoires de bar et streaming dérisoire : pourquoi le musicien africain ne peut pas vivre de promesses institutionnelles. Méthode concrète pour bâtir une souveraineté économique pérenne en 4 piliers directs (scène de prestige, pédagogie certifiée, studio et conseil).",
    "readingTime": "15 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Prestations & Services",
      "to": "/services"
    }
  },
  {
    "slug": "ai-music-evaluation-human-listening",
    "num": "27",
    "category": "Technologies & IA",
    "title": "Human-in-the-Loop Audio Evaluation: Why Musicologists and Sound Engineers Still Matter",
    "excerpt": "Automated metrics cannot capture every nuance of music. A structured framework combining critical listening, musicology, audio engineering, and empirical human-in-the-loop validation for generative AI audio.",
    "readingTime": "12 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  },
  {
    "slug": "interfaces-audio-sans-souffle-home-studio",
    "num": "28",
    "category": "Ingénierie du son & Studio",
    "title": "Carte son qui souffle ou qui grésille : le guide pratique de l’ingénieur du son",
    "excerpt": "Un souffle dans le casque, un ronflement ou un grésillement USB ? Méthode d’ingénieur du son pour identifier le type de bruit, isoler la chaîne par élimination et assainir vos prises de voix.",
    "readingTime": "13 min",
    "status": "Publié",
    "linkedConcept": {
      "label": "Services Studio & Ingénierie",
      "to": "/services#production"
    }
  },
  {
    "slug": "souverainete-musicale-africaine-ia",
    "num": "29",
    "category": "Musicologie & Innovation",
    "title": "Intelligence artificielle et souveraineté musicale africaine : qui possède la valeur de la création à l’ère des algorithmes ?",
    "excerpt": "Droits d’auteur, patrimoine sonore, économie créative et gouvernance technologique : tribune de fond par Hervé Nanfang sur la place de l’Afrique dans la nouvelle économie musicale mondiale et les perspectives du SIMA 2026 à Cotonou.",
    "readingTime": "16 min",
    "status": "Publié",
    "publishedAt": "2026-11-10",
    "linkedConcept": {
      "label": "Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  },
  {
    "slug": "sonorisation-piano-bar-equilibre-voix-clavier",
    "num": "30",
    "category": "Ingénierie du son & Studio",
    "title": "Sonorisation Piano-Bar et scène intime : équilibrer clavier et voix sans larsen",
    "excerpt": "Un piano-bar ne demande pas du volume : il exige de l’intimité, de la lisibilité et une marge de sécurité. Méthode de terrain pour équilibrer piano et voix sans larsen avec les Yamaha PSR-SX, une console MG16XU et un processeur dbx DriveRack.",
    "readingTime": "12 min",
    "status": "Publié",
    "publishedAt": "2026-11-14",
    "linkedConcept": {
      "label": "Le Pianobariste™ & Scène",
      "to": "/services#pianobariste"
    }
  },
  {
    "slug": "suno-visuals-deezer-musiciens-africains",
    "num": "31",
    "category": "Technologies & IA",
    "title": "Suno Visuals et Deezer : ce que les musiciens africains doivent en retenir",
    "excerpt": "Suno Visuals, musique générée par IA et transparence sur Deezer : analyse pratique des changements et des décisions à prendre pour les musiciens africains.",
    "readingTime": "9 min",
    "status": "Publié",
    "publishedAt": "2026-11-22",
    "linkedConcept": {
      "label": "Musicien Augmenté™",
      "to": "/ia-technologie#musicien-augmente"
    }
  }
]

export const ARTICLE_SUMMARIES: ArticleSummary[] = ARTICLE_SUMMARY_DATA.map((article) => {
  const curation = ARTICLE_CURATION[article.slug]
  return {
    ...article,
    relatedSlugs: curation?.relatedSlugs ?? [],
  }
})

export const JOURNAL_SERIES = [
  {
    "num": "01",
    "title": "Le Pianobariste",
    "text": "Scène, présence, répertoire professionnel et performance live depuis 2007."
  },
  {
    "num": "02",
    "title": "Musicologie africaine",
    "text": "Analyse des rythmes camerounais, oralité, organologie et ethnomusicologie."
  },
  {
    "num": "03",
    "title": "Pédagogie & Permis de Jouer™",
    "text": "Apprentissage du clavier, accompagnement du chant et transmission au sein de A Laiz Academy."
  },
  {
    "num": "04",
    "title": "Ingénierie du son & Acoustique",
    "text": "Prise de son, mixage, sonorisation de concert et traitement de studio."
  },
  {
    "num": "05",
    "title": "Composition & Musique à l’image",
    "text": "Écriture orchestrale, dramaturgie sonore et bandes originales de films."
  },
  {
    "num": "06",
    "title": "Entrepreneuriat culturel",
    "text": "Économie du live, tarification, devis, contrats et droits d’auteur."
  },
  {
    "num": "07",
    "title": "Marque & Communication",
    "text": "Positionnement d’artiste, portfolio d’autorité et stratégie de diffusion."
  },
  {
    "num": "08",
    "title": "MAO & Musicien Augmenté™",
    "text": "Production numérique, expérimentation avec l’IA et souveraineté créative."
  }
]
