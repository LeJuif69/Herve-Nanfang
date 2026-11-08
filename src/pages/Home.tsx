import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import HomeFeaturedVideos from '../components/HomeFeaturedVideos'
import liveScene from '../assets/live-scene-piano.webp'
import SoundWaveCanvas from '../components/SoundWaveCanvas'
import { useAudio } from '../lib/audio-context'
import {
  ArrowLink,
  Body,
  Btn,
  Card,
  ChapterMark,
  Container,
  CtaBand,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Rule,
  Section,
  Stat,
  Tag,
} from '../components/ui'
import { SITE } from '../data/site'
import { IDENTITY, MASTER_IDENTITY } from '../data/identity'
import { CONFERENCES } from '../data/conferences'
import {
  courseSchema,
  musicGroupSchema,
  organizationSchema,
  personSchema,
  serviceSchema,
  websiteSchema,
} from '../lib/schema'
import { useSeo } from '../lib/seo'
import { useAdminState, useLiveMedia } from '../lib/useLiveContent'
import { trackContactMethodClick, trackCtaClick } from '../lib/ad-pixels'

type HomeArticleSummary = {
  slug: string
  category: string
  title: string
  excerpt: string
  readingTime: string
  coverImage?: string
}

const HOME_FEATURED_ARTICLES: HomeArticleSummary[] = [
  {
    slug: 'apres-la-mao-lia',
    category: 'IA',
    title: 'Après la MAO, l’IA : comment les musiciens peuvent évoluer sans perdre leur identité',
    excerpt:
      'La MAO n’a pas supprimé le musicien : elle a redistribué les compétences. L’IA ouvre une nouvelle étape où la machine ne se contente plus d’exécuter, mais formule des propositions esthétiques. Analyse, retours d’expérience en studio à Yaoundé et méthode d’auteur pour adopter la technologie sans diluer sa signature culturelle.',
    readingTime: '12 min',
  },
  {
    slug: 'ia-va-t-elle-remplacer-les-musiciens',
    category: 'IA',
    title: 'L’IA va-t-elle remplacer les musiciens ?',
    excerpt:
      'L’IA peut automatiser certaines tâches et fragiliser des revenus, mais elle ne transforme pas tous les métiers musicaux de la même manière. Pour comprendre le risque, il faut regarder le travail réel, pas répondre par un slogan.',
    readingTime: '7 min',
  },
  {
    slug: 'musicien-augmente-definition',
    category: 'Réflexions',
    title: 'Musicien augmenté : définition, enjeux et perspectives',
    excerpt:
      'Musicien Augmenté™ ne désigne ni un logiciel miracle ni une promesse de productivité industrielle. C’est un cadre doctrinal et professionnel formalisé par Hervé Nanfang pour utiliser l’IA afin d’étendre les capacités du créateur sans lui retirer son jugement esthétique, sa responsabilité d’auteur ni son ancrage culturel.',
    readingTime: '14 min',
  },
  {
    slug: 'ia-et-musique-live',
    category: 'Musique',
    title: 'IA et musique live : ce que la technologie ne doit jamais remplacer',
    excerpt:
      'Le live n’est pas une scène sans technologie : c’est une situation où les choix doivent rester adaptés au lieu, au moment et aux personnes présentes. Où placer la limite quand l’IA entre dans le jeu ?',
    readingTime: '7 min',
  },
  {
    slug: '5-facons-ia-carriere-musicien',
    category: 'Entrepreneuriat',
    title: '5 façons dont un musicien peut utiliser l’IA dans sa carrière',
    excerpt:
      'Des usages concrets, immédiatement applicables : création, communication, organisation, facturation, veille. Sans gadget, sans dépendance.',
    readingTime: '8 min',
  },
]

const THREE_UNIVERSES = [
  {
    num: '01',
    verb: 'CRÉER',
    brand: 'Le Pianobariste™',
    subtitle: 'Prestations musicales, piano-bar, concerts & créations sonores',
    description:
      'Depuis 2007, prestations live sur mesure (solo piano-voix, duo prestige, live band) pour hôtels 5 étoiles, réceptions diplomatiques, galas corporate et cérémonies, prolongées en studio par la composition et l’arrangement.',
    proof: 'Depuis 2007 · +440 titres au répertoire · Hilton, Mont Fébé, Djeuga Palace, Akwa Palace',
    exploreTo: '#le-pianobariste',
    explorePage: '/musique',
    exploreLabel: 'Découvrir l’univers musical',
    ctaLabel: 'Réserver une prestation',
    ctaTo: '/contact?sujet=booking#booking',
    ctaTrack: 'universe_booking',
  },
  {
    num: '02',
    verb: 'TRANSMETTRE',
    brand: 'A Laiz Academy',
    subtitle: 'Formation musicale, pédagogie structurée, piano & MAO',
    description:
      'Académie de formation musicale et technologique (ex-RMA), référentiel progressif Permis de Jouer™ (N1 à N4), manuel pédagogique LES ZIKOS® (68 p.) et enseignement supérieur dans 4 institutions d’Afrique centrale et de l’Ouest.',
    proof: 'Permis de Jouer™ N1–N4 · Manuel LES ZIKOS® · ESAS Lomé, ISMA Bénin, IBA, IFCPA/CRTV',
    exploreTo: '#a-laiz-academy',
    explorePage: '/pedagogie',
    exploreLabel: 'Explorer la pédagogie',
    ctaLabel: 'Organiser une formation',
    ctaTo: '/contact?sujet=formation#formation',
    ctaTrack: 'universe_formation',
  },
  {
    num: '03',
    verb: 'AUGMENTER',
    brand: 'Musicien Augmenté™',
    subtitle: 'Innovation musicale, intelligence artificielle, conférences & accompagnement',
    description:
      'Cadre méthodologique et éthique pour intégrer l’intelligence artificielle, la MAO et la stratégie digitale dans les métiers de la musique et de la culture sans jamais remplacer l’écoute, l’auteur ni le live.',
    proof: '6 conférences & masterclasses · Recherche Master II · Accompagnement d’artistes & structures',
    exploreTo: '#musicien-augmente',
    explorePage: '/ia-technologie',
    exploreLabel: 'Découvrir Musicien Augmenté™',
    ctaLabel: 'Demander un accompagnement',
    ctaTo: '/contact?sujet=conseil#conseil',
    ctaTrack: 'universe_conseil',
  },
]

const PIANOBAR_FORMATS = [
  {
    name: 'Formule Solo — Piano & Voix',
    tag: 'Signature Le Pianobariste™',
    desc: 'Présence acoustique feutrée et élégante pour hôtels 5 étoiles, dîners diplomatiques, lounges et réceptions privées.',
    to: '/contact?sujet=booking&formula=lounge#booking',
  },
  {
    name: 'Formule Duo — Piano & Chant',
    tag: 'Duo Prestige',
    desc: 'Dialogue scénique chaleureux (Hervé Nanfang & voix invitée) pour cocktails de gala, vernissages et cérémonies.',
    to: '/contact?sujet=booking&formula=prestige#booking',
  },
  {
    name: 'Formule Live Band — Orchestre',
    tag: 'Grand Format',
    desc: 'Formation complète avec section rythmique et cuivres pour grands événements institutionnels, festivals et soirées corporate.',
    to: '/contact?sujet=booking&formula=liveband#booking',
  },
]

const ACADEMY_TRACKS = [
  {
    level: 'N1 → N4',
    title: 'Le Permis de Jouer™',
    text: 'Référentiel progressif en 4 paliers privilégiant le jeu immédiat, les grilles harmoniques, l’écoute active et l’autonomie scénique.',
    link: '/pedagogie#permis-de-jouer',
    linkLabel: 'Voir le référentiel N1–N4',
  },
  {
    level: 'Piano · Chant · MAO',
    title: 'A Laiz Academy (ex-RMA)',
    text: 'Cours particuliers, ateliers collectifs et programme intensif « Vacances Utiles » (5 disciplines) à Yaoundé et à distance.',
    link: '/rma',
    linkLabel: 'Explorer les programmes',
  },
  {
    level: 'Manuel 68 pages',
    title: 'Collection LES ZIKOS®',
    text: 'Supports pédagogiques structurés et méthodes d’apprentissage ancrées dans les réalités rythmiques et harmoniques africaines et internationales.',
    link: '/pedagogie#publications',
    linkLabel: 'Découvrir les ouvrages',
  },
]

const IA_DOMAINS = [
  {
    title: 'IA pour la musique & la MAO',
    items: ['Composition & arrangement', 'Analyse harmonique', 'Production & mixage', 'Sound design & musique à l’image'],
  },
  {
    title: 'IA pour le pédagogue',
    items: ['Ingénierie de curricula', 'Supports interactifs', 'Évaluation & progression N1–N4', 'Formation de formateurs'],
  },
  {
    title: 'IA pour le professionnel',
    items: ['Workflows créatifs', 'Documentation & structuration', 'Productivité d’atelier', 'Veille méthodologique'],
  },
  {
    title: 'IA & communication culturelle',
    items: ['Positionnement d’artiste', 'Récit de marque culturelle', 'Stratégie éditoriale', 'Rayonnement & diffusion'],
  },
]

const RESEARCH_AND_PROJECTS = [
  {
    category: 'Patrimoine & Linguistique',
    title: 'Tswefap — Système d’écriture et documentation du Batoufam',
    detail:
      'Corpus, conventions d’écriture et manuel de référence dédiés à la sauvegarde linguistique et à la transmission patrimoniale au sein de l’univers A Laiz Ô Pays.',
    badge: 'Recherche en cours',
    to: '/culture-recherche',
    linkLabel: 'Explorer l’axe patrimonial',
  },
  {
    category: 'Musicologie appliquée aux médias',
    title: 'Musique à l’image, cinéma & convergence numérique',
    detail:
      'Travaux de Master II (Université de Yaoundé I) et enseignements supérieurs (ESAS Lomé) : analyse de bandes originales, cinéma d’horreur africain, intermédiarité et fonctions narratives du son.',
    badge: 'Master II & Enseignement supérieur',
    to: '/culture-recherche',
    linkLabel: 'Voir les travaux musicologiques',
  },
  {
    category: 'Création & Ethnomusicologie',
    title: 'Le Concert des Guérisseurs & Music’Arts Thérapie',
    detail:
      'Recherche-création pour percussions et piano inspirée des musiques thérapeutiques pygmées et de l’African Wizarding Music, prolongée par un projet d’ouvrage scientifique.',
    badge: 'Création & Recherche',
    to: '/projets',
    linkLabel: 'Voir la réalisation',
  },
  {
    category: 'Ingénierie pédagogique & Édition',
    title: 'LES ZIKOS® (68 p.) & Référentiel Permis de Jouer™',
    detail:
      'Formalisation de méthodes d’apprentissage musical, du module ALA-01 (Pulsation & coordination) et du cursus intensif A Laiz Academy « Vacances Utiles » restitué sur scène à Yaoundé.',
    badge: 'Dispositifs déployés',
    to: '/projets',
    linkLabel: 'Parcourir tous les projets',
  },
]

const COMMERCIAL_PATHWAYS = [
  {
    priority: 'Priorité 01 · Scène & Événementiel',
    title: 'Réserver une prestation musicale',
    subtitle: 'Le Pianobariste™ — Solo, Duo ou Live Band',
    desc: 'Hôtels de prestige, réceptions diplomatiques, galas corporate, mariages et soirées privées au Cameroun et à l’international.',
    cta: 'Demander un devis prestation',
    to: '/contact?sujet=booking#booking',
    whatsappText:
      'Bonjour Hervé Nanfang, je souhaite réserver une prestation musicale (Le Pianobariste™) et obtenir une proposition adaptée.',
    primary: true,
  },
  {
    priority: 'Priorité 02 · Pédagogie & Écoles',
    title: 'Organiser une formation',
    subtitle: 'A Laiz Academy — Piano, MAO, Permis de Jouer™',
    desc: 'Cours particuliers ou collectifs, ateliers MAO, formation de formateurs ou conception de curricula pour établissements et conservatoires.',
    cta: 'Structurer une formation',
    to: '/contact?sujet=formation#formation',
    whatsappText:
      'Bonjour Hervé Nanfang, je souhaite organiser une formation ou m’informer sur les cursus A Laiz Academy.',
    primary: false,
  },
  {
    priority: 'Priorité 03 · Institutions & Universités',
    title: 'Inviter en conférence ou masterclass',
    subtitle: '6 thématiques — IA, Musicologie & Création',
    desc: 'Keynotes, conférences avec démonstration live au piano et tables rondes pour universités, festivals, écoles supérieures et colloques.',
    cta: 'Inviter Hervé Nanfang',
    to: '/contact?sujet=conference#conference',
    whatsappText:
      'Bonjour Hervé Nanfang, nous souhaitons vous inviter pour une conférence ou masterclass au sein de notre institution.',
    primary: false,
  },
  {
    priority: 'Priorité 04 · Conseil & Studio',
    title: 'Demander un accompagnement professionnel',
    subtitle: 'Musicien Augmenté™ — IA, Son & Marque culturelle',
    desc: 'Accompagnement stratégique d’artistes et d’organisations culturelles : intégration éthique de l’IA, direction artistique, production sonore et positionnement.',
    cta: 'Solliciter un accompagnement',
    to: '/contact?sujet=conseil#conseil',
    whatsappText:
      'Bonjour Hervé Nanfang, je souhaite solliciter un accompagnement professionnel (Musicien Augmenté™ / Conseil / Production).',
    primary: false,
  },
]

/**
 * Résolution intelligente de l'image de couverture d'un article
 */
function getArticleCover(article: HomeArticleSummary): string {
  if (article.coverImage && article.coverImage !== '/og-image.jpg' && !article.coverImage.startsWith('blob:')) {
    return article.coverImage
  }
  const cat = (article.category || '').toLowerCase()
  if (cat.includes('ia') || cat.includes('techno') || cat.includes('mao')) {
    return '/images/concept-visuel-piano-futuriste-1.webp'
  }
  if (cat.includes('live') || cat.includes('piano')) {
    return '/images/04-piano-bar-live.jpeg'
  }
  if (cat.includes('pédagogie') || cat.includes('formation') || cat.includes('musicologie')) {
    return '/images/cours-isma-masterclass-1311.webp'
  }
  if (cat.includes('marque') || cat.includes('stratégie')) {
    return '/images/shooting-pro-officiel.webp'
  }
  return '/images/shooting-pro-officiel.webp'
}

const ROLES = [
  'Musicien & Artiste · Le Pianobariste™',
  'Musicologue & Chercheur indépendant',
  'Pédagogue · A Laiz Academy',
  'Ingénieur du Son & Musicien Augmenté™',
]

export default function Home() {
  const { openPlayer } = useAudio()
  const [roleIndex, setRoleIndex] = useState(0)
  const livePianoMedia = useLiveMedia('med-live-piano', liveScene, 50, 20)
  const adminState = useAdminState()
  const liveArticles: HomeArticleSummary[] =
    adminState.articles && adminState.articles.length > 0
      ? adminState.articles.slice(0, 5)
      : HOME_FEATURED_ARTICLES

  useEffect(() => {
    const timer = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % ROLES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  useSeo({
    title: IDENTITY.seoTitle,
    description: IDENTITY.metaDescription,
    path: '/',
    jsonLd: [
      personSchema,
      websiteSchema,
      organizationSchema,
      musicGroupSchema,
      serviceSchema(
        'Le Pianobariste™ — Prestations piano-bar live & musique événementielle',
        'Prestations musicales live au piano et au chant (solo, duo, live band) pour hôtels de prestige, événements diplomatiques, galas et réceptions au Cameroun et à l’international.',
        'Performance musicale live',
      ),
      courseSchema(
        'A Laiz Academy — Formation musicale, Piano, MAO & Permis de Jouer™',
        'Académie de formation musicale et technologique fondée par Hervé Nanfang : piano, chant, MAO, ingénierie du son et méthode certifiante Permis de Jouer™ (N1 à N4).',
      ),
    ],
  })

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. HERO — QUI EST HERVÉ NANFANG, PROPOSITION DE VALEUR & ACCÈS AUX OFFRES */}
      {/* ========================================================================= */}
      <section className="home-hero relative isolate overflow-hidden bg-ink">
        <img
          src={liveScene}
          alt="Hervé Nanfang au piano lors d’une prestation live Le Pianobariste au Cameroun."
          width={1600}
          height={900}
          loading="eager"
          {...({ fetchpriority: 'high' } as Record<string, string>)}
          decoding="async"
          onError={(e) => {
            if (!e.currentTarget.src.includes('/images/live-scene-piano.jpeg')) {
              e.currentTarget.src = '/images/live-scene-piano.jpeg'
            }
          }}
          className="home-hero__image absolute inset-0 h-full w-full object-cover object-[50%_18%] md:object-[50%_18%]"
        />
        <div aria-hidden className="home-hero__shade absolute inset-0" />
        <div aria-hidden className="home-hero__vignette absolute inset-0" />
        <div aria-hidden className="home-hero__grid absolute inset-0" />

        {/* Onde acoustique cinétique harmonique */}
        <SoundWaveCanvas className="z-[3] opacity-60" />

        <Container className="relative z-10 flex min-h-[min(55rem,100svh)] items-end pb-14 pt-32 md:items-end md:pb-20 md:pt-40">
          <div className="max-w-4xl w-full">
            <Reveal>
              <div className="mb-5 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
                <div className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/15 via-ink-2 to-black p-2 shadow-[0_0_35px_rgba(198,161,91,0.3)] ring-1 ring-gold/25 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-gold sm:h-20 sm:w-20 md:h-24 md:w-24 md:p-3">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.22),transparent_70%)]"
                  />
                  <img
                    src="/hn-initials-mark.webp"
                    alt="Monogramme HN — Hervé Nanfang"
                    width={112}
                    height={112}
                    loading="eager"
                    decoding="async"
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_12px_rgba(198,161,91,0.4)]"
                  />
                </div>
                <span aria-hidden className="hidden h-px w-8 bg-ivory/30 sm:block md:w-12" />
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                    </span>
                    <Eyebrow className="min-h-[1.25rem] text-ivory/95 transition-opacity duration-500">
                      {ROLES[roleIndex]}
                    </Eyebrow>
                  </div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-gold/80">
                    Musicien · Musicologue · Chercheur en innovation musicale · Pédagogue · Ingénieur du son
                  </p>
                </div>
              </div>

              <h1 className="home-hero__title mt-0 max-w-4xl text-5xl leading-[0.92] tracking-[-0.04em] text-ivory sm:text-7xl lg:text-[6.2rem]">
                {MASTER_IDENTITY.identite.nom}
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-5 max-w-3xl font-display text-2xl leading-snug text-ivory sm:text-3xl">
                De la scène piano-bar live à la recherche musicologique, de la pédagogie structurée à l’innovation par l’IA.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/80 md:text-base">
                {MASTER_IDENTITY.positionnement.accrocheAccueil} Trois univers d’intervention —{' '}
                <strong className="text-ivory">Le Pianobariste™</strong>,{' '}
                <strong className="text-ivory">A Laiz Academy</strong> et{' '}
                <strong className="text-ivory">Musicien Augmenté™</strong> — fédérés par le concept culturel{' '}
                <strong className="text-ivory">A Laiz Ô Pays</strong>.
              </p>
            </Reveal>

            <Reveal delay={180}>
              {/* Appels à l'action hiérarchisés dès le premier écran */}
              <div className="mt-7 rounded-2xl border border-gold/35 bg-ink-2/90 p-4 sm:p-5 md:p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3.5">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      Que souhaitez-vous organiser ? · Réponse sous 48 h
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/70">
                      Choisissez votre besoin prioritaire ou démarrez un échange direct sur WhatsApp.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent("Bonjour Hervé Nanfang, je souhaite échanger directement avec vous concernant un projet (prestation, formation, conférence ou accompagnement).")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactMethodClick('whatsapp', 'hero_fast')}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-500/45 bg-emerald-500/15 px-4 py-2 text-[0.7rem] font-bold uppercase tracking-wider text-emerald-300 hover:border-emerald-400 hover:bg-emerald-500/25 transition-all"
                  >
                    <span>💬 WhatsApp Direct · {SITE.phones[0].display}</span>
                  </a>
                </div>

                {/* 1 CTA Principal + 3 CTA Secondaires clairement hiérarchisés */}
                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  <Btn
                    to="/contact?sujet=booking#booking"
                    variant="gold"
                    onClick={() => trackCtaClick('hero_booking', 'booking', 'hero')}
                    className="w-full justify-center text-center !py-3.5 !px-3 !text-xs !tracking-wider font-semibold shadow-[0_0_20px_rgba(198,161,91,0.25)]"
                  >
                    1. Réserver une prestation
                  </Btn>
                  <Btn
                    to="/contact?sujet=formation#formation"
                    variant="ghost"
                    onClick={() => trackCtaClick('hero_formation', 'formation', 'hero')}
                    className="w-full justify-center text-center !py-3.5 !px-3 !text-xs !tracking-wider border-white/25 hover:border-gold hover:text-gold"
                  >
                    2. Organiser une formation
                  </Btn>
                  <Btn
                    to="/contact?sujet=conference#conference"
                    variant="ghost"
                    onClick={() => trackCtaClick('hero_conference', 'conference', 'hero')}
                    className="w-full justify-center text-center !py-3.5 !px-3 !text-xs !tracking-wider border-white/25 hover:border-gold hover:text-gold"
                  >
                    3. Inviter en conférence
                  </Btn>
                  <Btn
                    to="/contact?sujet=conseil#conseil"
                    variant="ghost"
                    onClick={() => trackCtaClick('hero_conseil', 'conseil', 'hero')}
                    className="w-full justify-center text-center !py-3.5 !px-3 !text-xs !tracking-wider border-white/25 hover:border-gold hover:text-gold"
                  >
                    4. Demander un accompagnement
                  </Btn>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openPlayer}
                  aria-label="Écouter les extraits musicaux au piano"
                  className="btn btn-ghost inline-flex items-center gap-2 border-gold/40 text-gold hover:border-gold hover:bg-gold/10 hover:text-gold-2 text-xs"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  <span>Écouter un extrait piano live ♫</span>
                </button>
                <a
                  href="#trois-univers"
                  className="btn btn-ghost text-xs border-white/20 hover:border-gold/50"
                >
                  Explorer les 3 univers ↓
                </a>
                <Btn to="/a-propos" variant="ghost" className="text-xs border-white/20">
                  Parcours & Références
                </Btn>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 2. PREUVES IMMÉDIATES & RÉFÉRENCES VÉRIFIABLES                            */}
      {/* ========================================================================= */}
      <section id="preuves-competence" className="relative border-y border-white/10 bg-ink-2 py-10 md:py-12">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            <Reveal delay={0}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">2007</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/85 sm:text-xs">
                  Expérience professionnelle
                </p>
                <p className="mt-1 text-xs text-ivory/65">+440 titres au répertoire · Scènes de prestige</p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">06</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/85 sm:text-xs">
                  Établissements supérieurs
                </p>
                <p className="mt-1 text-xs text-ivory/65">ESAS Lomé · ISMA · IBA · IFCPA/CRTV · Yaoundé I · Dschang</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">N1–N4</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/85 sm:text-xs">
                  Permis de Jouer™ & LES ZIKOS®
                </p>
                <p className="mt-1 text-xs text-ivory/65">Méthode certifiante & manuel pédagogique (68 p.)</p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">06</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/85 sm:text-xs">
                  Conférences & Masterclasses
                </p>
                <p className="mt-1 text-xs text-ivory/65">Musicien Augmenté™ · IA, MAO & Musicologie</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 border-t border-white/8 pt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold/85">
              Références vérifiables (Scènes & Enseignement supérieur) :
            </span>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium tracking-wider text-ivory/65">
              <span>Hôtel Hilton Yaoundé</span>
              <span className="text-gold/40">•</span>
              <span>Hôtel Mont Fébé</span>
              <span className="text-gold/40">•</span>
              <span>Djeuga Palace</span>
              <span className="text-gold/40">•</span>
              <span>Akwa Palace Douala</span>
              <span className="text-gold/40">•</span>
              <span>ESAS (Lomé)</span>
              <span className="text-gold/40">•</span>
              <span>ISMA (Bénin)</span>
              <span className="text-gold/40">•</span>
              <span>IBA (Nkongsamba)</span>
              <span className="text-gold/40">•</span>
              <span>IFCPA / CRTV</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* 3. LES TROIS UNIVERS & LA DIMENSION TRANSVERSALE MUSICOLOGIQUE            */}
      {/* ========================================================================= */}
      <Section tone="ink" id="trois-univers">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <ChapterMark num="01" label="Architecture d’intervention · Créer · Transmettre · Augmenter · Développer" />
            <Display size="lg" className="mt-6 max-w-3xl">
              Trois univers d’action, nourris par la musicologie et l’expérience du terrain
            </Display>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-md text-sm leading-relaxed text-ivory/70">
              Pas un catalogue de métiers isolés : une trajectoire cohérente où la scène éclaire la
              pédagogie, et où la recherche musicologique guide l’usage de l’intelligence artificielle.
            </p>
          </Reveal>
        </div>

        {/* Cartes des 3 univers */}
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {THREE_UNIVERSES.map((u, i) => (
            <Reveal key={u.brand} delay={i * 80}>
              <Card className="flex h-full flex-col justify-between border-white/12 bg-ink-2 p-7 transition-all duration-300 hover:border-gold/60">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      {u.num} · {u.verb}
                    </span>
                    <a
                      href={u.exploreTo}
                      className="font-mono text-[0.65rem] uppercase tracking-wider text-ivory/55 hover:text-gold"
                    >
                      Détails ↓
                    </a>
                  </div>

                  <h2 className="mt-5 font-display text-3xl text-ivory">{u.brand}</h2>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-gold/85">
                    {u.subtitle}
                  </p>
                  <Rule className="my-4 opacity-35" />
                  <Body className="text-sm">{u.description}</Body>

                  <div className="mt-5 border-l-2 border-gold/45 bg-ink/60 px-3.5 py-2.5">
                    <p className="font-mono text-[0.62rem] uppercase tracking-wider text-gold/80">
                      Preuves & Repères
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/75">{u.proof}</p>
                  </div>
                </div>

                <div className="mt-7 flex flex-col gap-3 border-t border-white/10 pt-5">
                  <Btn
                    to={u.ctaTo}
                    variant={i === 0 ? 'gold' : 'ghost'}
                    onClick={() => trackCtaClick(u.ctaTrack, u.ctaTo, 'three_universes')}
                    className="w-full justify-center text-center !py-3 !text-xs"
                  >
                    {u.ctaLabel}
                  </Btn>
                  <div className="flex items-center justify-between px-1">
                    <ArrowLink to={u.explorePage}>{u.exploreLabel}</ArrowLink>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Socle transversal : Musicologie, Recherche & A Laiz Ô Pays */}
        <Reveal delay={180}>
          <div className="mt-10 grid gap-8 border border-gold/35 bg-gradient-to-r from-ink-2 via-ink-2/95 to-ink p-7 md:p-9 lg:grid-cols-[0.28fr_0.72fr] lg:items-center">
            <figure className="mx-auto w-full max-w-[15rem] lg:max-w-none">
              <div className="overflow-hidden border border-white/15 bg-ink">
                <img
                  src="/images/shooting-pro-officiel.webp"
                  alt="Portrait officiel d'Hervé Nanfang — Artiste-musicien, musicologue, pédagogue et ingénieur du son"
                  width={480}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-[50%_18%]"
                />
              </div>
              <figcaption className="mt-2 flex items-center justify-between text-[0.62rem] uppercase tracking-[0.16em] text-ivory/60">
                <span>{IDENTITY.name}</span>
                <span>{IDENTITY.city}</span>
              </figcaption>
            </figure>

            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="bg-gold px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink">
                  Dimension transversale
                </span>
                <Eyebrow>Musicologie · Recherche · Concept culturel A Laiz Ô Pays</Eyebrow>
              </div>
              <h3 className="mt-4 font-display text-2xl leading-snug text-ivory sm:text-3xl">
                La musicologie et la recherche comme colonne vertébrale des trois univers
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                Titulaire d’une Licence en Arts et Management Culturel (Université de Dschang) et d’un{' '}
                <strong className="text-ivory">Master II en Musicologie appliquée aux médias</strong>{' '}
                (Université de Yaoundé I), Hervé Nanfang n’isole pas la recherche dans une tour d’ivoire :
                elle nourrit directement l’interprétation scénique (<strong className="text-ivory">Le Pianobariste™</strong>),
                la structuration des méthodes d’apprentissage (<strong className="text-ivory">A Laiz Academy</strong>)
                et le cadre doctrinal <strong className="text-ivory">Musicien Augmenté™</strong>, au sein de
                l’univers créatif fédérateur <strong className="text-ivory">A Laiz Ô Pays</strong>.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <ArrowLink to="/culture-recherche">Travaux musicologiques & patrimoine</ArrowLink>
                <ArrowLink to="/a-propos">Biographie complète & parcours académique</ArrowLink>
                <ArrowLink to="/presse">Dossier de presse & EPK</ArrowLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* 4. UNIVERS 1 : CRÉER — LE PIANOBARISTE™ & EXTRAITS VIDÉO LIVE             */}
      {/* ========================================================================= */}
      <Section tone="dark" id="le-pianobariste">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <ChapterMark num="02" label="Créer · Le Pianobariste™ · Prestations Musicales Live" />
            <Display size="lg" className="mt-6">
              Piano-bar live & musique d’atmosphère pour événements de prestige
            </Display>
            <Lead className="mt-5">
              Depuis 2007, Hervé Nanfang façonne sous la signature <strong className="text-ivory">Le Pianobariste™</strong>{' '}
              une présence musicale cousue main pour les grands hôtels, réceptions diplomatiques, soirées
              corporate, mariages et événements privés au Cameroun (Yaoundé, Douala, Kribi) et à l’international.
            </Lead>
            <Body className="mt-3">
              Répertoire transversal de plus de 440 titres — jazz, blues, chanson internationale, rumba,
              afropop, zouk et classiques revisités — avec autonomie technique complète (sonorisation et
              clavier de scène professionnel si le lieu ne dispose pas de piano acoustique).
            </Body>

            <div className="mt-7 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
              <Stat value="2007" label="Scène piano-bar" />
              <Stat value="440+" label="Titres au répertoire" />
              <Stat value="Solo → Band" label="3 formats adaptables" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn
                to="/contact?sujet=booking#booking"
                variant="gold"
                onClick={() => trackCtaClick('section_pianobar_booking', 'booking', 'home_pianobar')}
              >
                Réserver une prestation
              </Btn>
              <button
                type="button"
                onClick={openPlayer}
                className="btn btn-ghost inline-flex items-center gap-2 border-gold/40 text-gold hover:border-gold"
              >
                <span>Écouter les démos audio ♫</span>
              </button>
              <ArrowLink to="/musique">Répertoire & détails scéniques</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative">
              <div className="overflow-hidden border border-white/10 bg-ink">
                <img
                  src={livePianoMedia.url}
                  alt={livePianoMedia.alt || 'Hervé Nanfang — Le Pianobariste en prestation piano-bar live'}
                  width={1280}
                  height={853}
                  loading="lazy"
                  decoding="async"
                  style={livePianoMedia.style}
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('/images/live-scene-piano.jpeg')) {
                      e.currentTarget.src = '/images/live-scene-piano.jpeg'
                    }
                  }}
                  className="aspect-[16/10] w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                <span>Le Pianobariste™ · Piano & Voix</span>
                <span>Hilton · Mont Fébé · Djeuga Palace · Akwa Palace</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Les 3 formules scéniques */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PIANOBAR_FORMATS.map((f, i) => (
            <Reveal key={f.name} delay={i * 80}>
              <Card className="flex h-full flex-col justify-between border-white/10 bg-ink p-7 transition-colors hover:border-gold/50">
                <div>
                  <Eyebrow>{f.tag}</Eyebrow>
                  <h3 className="mt-3 font-display text-2xl text-ivory">{f.name}</h3>
                  <Rule className="opacity-35" />
                  <Body className="mt-3 text-sm">{f.desc}</Body>
                </div>
                <div className="mt-6 pt-3 border-t border-white/8">
                  <ArrowLink to={f.to}>Réserver ce format →</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Preuves vidéo : Extraits de prestations live intégrés */}
        <div className="mt-14">
          <HomeFeaturedVideos />
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 5. UNIVERS 2 : TRANSMETTRE — A LAIZ ACADEMY & PÉDAGOGIE                   */}
      {/* ========================================================================= */}
      <Section tone="ink" id="a-laiz-academy">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <Reveal>
            <ChapterMark num="03" label="Transmettre · A Laiz Academy · Formation & Pédagogie" />
            <Display size="lg" className="mt-6">
              Apprendre la musique, le piano et la MAO avec une progression certifiante
            </Display>
          </Reveal>
          <Reveal delay={100}>
            <Lead>
              Fondée par Hervé Nanfang, <strong className="text-ivory">A Laiz Academy</strong> (anciennement
              Racines Musicales Academy — RMA) forme enfants, adultes, musiciens et formateurs aux pratiques
              instrumentales et aux technologies du son, à Yaoundé, en institution et à distance.
            </Lead>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ACADEMY_TRACKS.map((track, i) => (
            <Reveal key={track.title} delay={i * 80}>
              <Card className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-7 transition-colors hover:border-gold/50">
                <div>
                  <span className="inline-block rounded border border-gold/30 bg-gold/10 px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-gold">
                    {track.level}
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-ivory">{track.title}</h3>
                  <Rule className="opacity-35" />
                  <Body className="mt-3 text-sm">{track.text}</Body>
                </div>
                <div className="mt-6 pt-3 border-t border-white/8">
                  <ArrowLink to={track.link}>{track.linkLabel}</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-10 flex flex-col justify-between gap-6 border border-gold/30 bg-ink-2/90 p-7 sm:flex-row sm:items-center md:p-9">
            <div className="max-w-2xl">
              <Eyebrow>Inscriptions & Interventions en Établissements</Eyebrow>
              <h3 className="mt-2 font-display text-2xl text-ivory">
                Suivre un cursus individuel ou organiser une formation dans votre institution
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ivory/65">
                Expérience vérifiée d’enseignement supérieur et spécialisé :{' '}
                <strong className="text-ivory/85">
                  ESAS (Lomé), ISMA (Bénin), Institut des Beaux-Arts (Nkongsamba), IFCPA / CRTV (Yaoundé)
                </strong>
                . Programmes sur mesure pour écoles, conservatoires, studios et apprenants.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Btn
                to="/contact?sujet=formation#formation"
                variant="gold"
                onClick={() => trackCtaClick('section_academy_formation', 'formation', 'home_academy')}
              >
                Organiser une formation
              </Btn>
              <Btn to="/rma" variant="ghost">
                Découvrir A Laiz Academy
              </Btn>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* 6. UNIVERS 3 : AUGMENTER — MUSICIEN AUGMENTÉ™, IA & CONFÉRENCES           */}
      {/* ========================================================================= */}
      <Section tone="dark" id="musicien-augmente">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <ChapterMark num="04" label="Augmenter · Musicien Augmenté™ · Innovation, IA & Conseil" />
            <Display size="lg" className="mt-6">
              L’intelligence artificielle ne doit pas remplacer le musicien. Elle doit l’augmenter.
            </Display>
            <Lead className="mt-5">
              Formalisé par Hervé Nanfang, le cadre <strong className="text-ivory">Musicien Augmenté™</strong>{' '}
              accompagne les artistes, studios, écoles et organisations culturelles dans l’intégration
              éthique, méthodologique et souveraine des outils génératifs, de la MAO et du digital.
            </Lead>
            <Body className="mt-4">
              Qu’il s’agisse de production sonore, de direction artistique, de récit de marque culturelle ou
              de workflows créatifs assistés par IA, la décision esthétique et la responsabilité d’auteur
              restent intégralement humaines.
            </Body>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn
                to="/contact?sujet=conseil#conseil"
                variant="gold"
                onClick={() => trackCtaClick('section_ia_conseil', 'conseil', 'home_ia')}
              >
                Demander un accompagnement
              </Btn>
              <Btn to="/ia-technologie" variant="ghost">
                Approche Musicien Augmenté™
              </Btn>
              <ArrowLink to="/services">Voir toutes les prestations de conseil</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-5 sm:grid-cols-2">
              {IA_DOMAINS.map((domain) => (
                <div
                  key={domain.title}
                  className="border border-white/10 bg-ink p-6 transition-colors hover:border-gold/40"
                >
                  <h3 className="font-display text-xl text-ivory">{domain.title}</h3>
                  <Rule className="opacity-35" />
                  <ul className="mt-4 space-y-1.5 text-xs text-ivory/65">
                    {domain.items.map((item) => (
                      <li key={item} className="flex items-center gap-2">
                        <span className="h-1 w-1 rounded-full bg-gold" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Sous-ensemble intégré : Les 6 Conférences & Masterclasses institutionnelles */}
        <div id="conferences" className="mt-16 border-t border-white/10 pt-14">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal>
              <Eyebrow>Interventions institutionnelles · Universités, Écoles & Colloques</Eyebrow>
              <h3 className="mt-3 font-display text-3xl text-ivory sm:text-4xl">
                6 conférences et masterclasses avec démonstration musicale en direct
              </h3>
              <p className="mt-2 max-w-2xl text-sm text-ivory/70">
                Des formats de 45 min à une journée complète croisant jeu au piano, analyse musicologique et
                démonstration concrète des outils d’intelligence artificielle.
              </p>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex flex-wrap gap-3 shrink-0">
                <Btn
                  to="/contact?sujet=conference#conference"
                  variant="gold"
                  onClick={() => trackCtaClick('section_conferences_invite', 'conference', 'home_conferences')}
                >
                  Inviter Hervé Nanfang
                </Btn>
                <Btn to="/conferences" variant="ghost">
                  Détail des 6 conférences
                </Btn>
              </div>
            </Reveal>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CONFERENCES.map((conf, i) => (
              <Reveal key={conf.id} delay={i * 60}>
                <Card className="flex h-full flex-col justify-between border-white/10 bg-ink p-6 transition-colors hover:border-gold/50">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <Eyebrow>{conf.theme}</Eyebrow>
                      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-ivory/65">
                        {conf.duration}
                      </span>
                    </div>
                    <h4 className="mt-3 font-display text-xl leading-snug text-ivory">
                      « {conf.title} »
                    </h4>
                    <p className="mt-2.5 text-xs leading-relaxed text-ivory/65 line-clamp-3">
                      {conf.pitch}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-white/8 pt-3">
                    <span className="text-[0.62rem] uppercase tracking-wider text-ivory/60">
                      {conf.formats.join(' · ')}
                    </span>
                    <Link
                      to={`/contact?sujet=conference&theme=${encodeURIComponent(conf.title)}#conference`}
                      className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-2"
                    >
                      Programmer →
                    </Link>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 7. RECHERCHE MUSICOLOGIQUE, PROJETS & RÉALISATIONS (A LAIZ Ô PAYS)        */}
      {/* ========================================================================= */}
      <Section tone="ink" id="recherche-et-projets">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <ChapterMark num="05" label="Développer · Recherche Musicologique & Projets A Laiz Ô Pays" />
            <Display size="lg" className="mt-6 max-w-3xl">
              Travaux musicologiques, documentation patrimoniale et réalisations concrètes
            </Display>
            <Lead className="mt-4 max-w-2xl">
              Au-delà des prestations et des cours, l’univers <strong className="text-ivory">A Laiz Ô Pays</strong>{' '}
              se traduit par des ouvrages, des corpus linguistiques et musicologiques, des créations
              scéniques et des programmes structurés.
            </Lead>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Btn to="/projets" variant="gold">
                Voir toutes les réalisations
              </Btn>
              <Btn to="/culture-recherche" variant="ghost">
                Axes de recherche
              </Btn>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {RESEARCH_AND_PROJECTS.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <Card className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-7 transition-colors hover:border-gold/50">
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Eyebrow>{item.category}</Eyebrow>
                    <Tag>{item.badge}</Tag>
                  </div>
                  <h3 className="mt-4 font-display text-2xl text-ivory">{item.title}</h3>
                  <Rule className="opacity-35" />
                  <Body className="mt-3 text-sm">{item.detail}</Body>
                </div>
                <div className="mt-6 border-t border-white/8 pt-4">
                  <ArrowLink to={item.to}>{item.linkLabel}</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 8. INVITATION À COLLABORER — LES 4 PARCOURS COMMERCIAUX HIÉRARCHISÉS      */}
      {/* ========================================================================= */}
      <Section tone="dark" id="collaborer">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <ChapterMark num="06" label="Collaborer avec Hervé Nanfang · Conversion & Contact direct" />
            <Display size="lg" className="mt-6 max-w-3xl">
              Quatre parcours clairs selon votre besoin
            </Display>
            <Lead className="mt-4 max-w-2xl">
              Sélectionnez le motif correspondant à votre projet : le formulaire de contact s’adapte
              automatiquement à votre demande, ou démarrez la conversation sur WhatsApp avec un message
              prérempli.
            </Lead>
          </Reveal>
          <Reveal delay={90}>
            <div className="rounded-xl border border-emerald-500/35 bg-emerald-500/10 p-4">
              <p className="font-mono text-[0.65rem] uppercase tracking-wider text-emerald-300">
                Canal rapide · Cameroun & International
              </p>
              <p className="mt-1 text-xs text-ivory/80">
                Besoin d’une disponibilité rapide pour une date ou un événement ?
              </p>
              <a
                href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent("Bonjour Hervé Nanfang, je vous contacte depuis hervenanfang.art pour vérifier votre disponibilité.")}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackContactMethodClick('whatsapp', 'home_collaborate_fast')}
                className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-300 hover:text-emerald-200"
              >
                <span>💬 Écrire sur WhatsApp ({SITE.phones[0].display}) →</span>
              </a>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {COMMERCIAL_PATHWAYS.map((item, i) => (
            <Reveal key={item.title} delay={i * 70}>
              <Card
                className={`flex h-full flex-col justify-between p-7 transition-all ${
                  item.primary
                    ? 'border-gold/60 bg-gradient-to-br from-ink-2 via-ink to-ink shadow-[0_10px_30px_rgba(198,161,91,0.12)]'
                    : 'border-white/12 bg-ink hover:border-gold/45'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold">
                      {item.priority}
                    </span>
                    {item.primary && (
                      <span className="bg-gold px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-ink">
                        Demande la plus fréquente
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">{item.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ivory/65">
                    {item.subtitle}
                  </p>
                  <Rule className="my-4 opacity-35" />
                  <Body className="text-sm">{item.desc}</Body>
                </div>

                <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-5">
                  <Btn
                    to={item.to}
                    variant={item.primary ? 'gold' : 'ghost'}
                    onClick={() => trackCtaClick(`collab_${i + 1}`, item.to, 'home_collaborer')}
                    className="!py-2.5 !px-4 !text-xs"
                  >
                    {item.cta}
                  </Btn>
                  <a
                    href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent(item.whatsappText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactMethodClick('whatsapp', `home_collab_${i + 1}`)}
                    className="font-mono text-[0.68rem] uppercase tracking-wider text-emerald-400 hover:text-emerald-300"
                  >
                    WhatsApp prérempli ↗
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={200}>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-ink/70 px-6 py-4 text-xs text-ivory/65">
            <span>
              <strong className="text-ivory">Demandes presse, médias, interviews ou partenariats culturels :</strong>{' '}
              un parcours dédié est également disponible sur la page Contact et dans l’espace Presse.
            </span>
            <div className="flex flex-wrap items-center gap-5">
              <ArrowLink to="/contact?sujet=presse#presse">Contact Presse & Médias</ArrowLink>
              <ArrowLink to="/contact?sujet=collaboration#collaboration">Proposer un partenariat</ArrowLink>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* 9. LE JOURNAL & RESSOURCES — ACCÈS AUX PUBLICATIONS                       */}
      {/* ========================================================================= */}
      <Section tone="ink" id="journal">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <ChapterMark num="07" label="Le Journal & Ressources · Publications & Essais" />
            <Display size="lg" className="mt-6 max-w-3xl">
              Analyses sur la musicologie, le piano-bar, la pédagogie et l’intelligence artificielle
            </Display>
            <Lead className="mt-4 max-w-2xl">
              Essais de fond, analyses de terrain et chroniques signés par Hervé Nanfang pour documenter
              les mutations de la création musicale contemporaine.
            </Lead>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Btn to="/journal" variant="ghost">
                Explorer tout le Journal
              </Btn>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12">
          {/* Article à la une */}
          {liveArticles[0] && (
            <Reveal className="lg:col-span-7">
              <Link
                to={`/journal/${liveArticles[0].slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden border border-gold/40 bg-ink-2 p-7 transition-all duration-500 hover:border-gold sm:p-10"
              >
                <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden border border-white/10 bg-ink">
                  <img
                    src={getArticleCover(liveArticles[0])}
                    alt={liveArticles[0].title}
                    width={800}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
                    <span className="bg-gold px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-ink">
                      À la une
                    </span>
                    <Tag>{liveArticles[0].category}</Tag>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-xs text-ivory/65">
                    Temps de lecture : {liveArticles[0].readingTime}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-[1.15] text-ivory transition-colors group-hover:text-gold sm:text-3xl">
                    {liveArticles[0].title}
                  </h3>
                  <Rule className="my-5 opacity-40" />
                  <p className="text-sm leading-relaxed text-ivory/70 line-clamp-3">
                    {liveArticles[0].excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold group-hover:text-gold-2">
                    Lire l’essai complet →
                  </span>
                  <span className="font-mono text-[0.68rem] uppercase tracking-widest text-ivory/65">
                    Par Hervé Nanfang
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          {/* 4 essais récents */}
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {liveArticles.slice(1, 5).map((a, i) => (
              <Reveal key={a.slug} delay={i * 70}>
                <Link
                  to={`/journal/${a.slug}`}
                  className="group flex flex-col justify-between border border-white/10 bg-ink-2 p-5 transition-all duration-300 hover:border-gold/50 hover:bg-ink-2/90 sm:flex-row sm:items-center gap-4"
                >
                  <div className="h-20 w-full sm:w-28 shrink-0 overflow-hidden border border-white/10 bg-ink">
                    <img
                      src={getArticleCover(a)}
                      alt={a.title}
                      width={224}
                      height={160}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[0.62rem] font-semibold uppercase tracking-wider text-gold">
                        {a.category}
                      </span>
                      <span className="font-mono text-[0.62rem] text-ivory/65">{a.readingTime}</span>
                    </div>
                    <h4 className="mt-1.5 font-display text-lg leading-snug text-ivory transition-colors group-hover:text-gold line-clamp-2">
                      {a.title}
                    </h4>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* BANDEAU FINAL DE CONVERSION                                               */}
      {/* ========================================================================= */}
      <CtaBand
        eyebrow="Prestation Live · Formation · Conférence · Accompagnement IA"
        title="Construisons votre prochain événement, programme de formation ou projet musical."
        text="Le Pianobariste™ (depuis 2007), A Laiz Academy, conférences institutionnelles ou accompagnement Musicien Augmenté™ : réponse personnalisée sous 48 h."
        primary={{ label: 'Prendre contact', to: '/contact' }}
        secondary={{ label: 'Consulter les offres détaillées', to: '/services' }}
      />
    </>
  )
}
