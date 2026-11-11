import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import liveScene from '../assets/live-scene-piano.webp'
import HomeFeaturedVideos from '../components/HomeFeaturedVideos'
import SoundWaveCanvas from '../components/SoundWaveCanvas'
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
  Tag,
} from '../components/ui'
import { CONFERENCES } from '../data/conferences'
import { IDENTITY, MASTER_IDENTITY } from '../data/identity'
import { SITE } from '../data/site'
import { TESTIMONIALS } from '../data/testimonials'
import { trackContactMethodClick, trackCtaClick } from '../lib/ad-pixels'
import { useAudio } from '../lib/audio-context'
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
      'La MAO n’a pas supprimé le musicien : elle a redistribué les compétences. Analyse, retours d’expérience en studio à Yaoundé et méthode d’auteur pour adopter la technologie sans diluer sa signature culturelle.',
    readingTime: '12 min',
  },
  {
    slug: 'musicien-augmente-definition',
    category: 'Réflexions',
    title: 'Musicien augmenté : définition, enjeux et perspectives',
    excerpt:
      'Un cadre doctrinal et professionnel formalisé par Hervé Nanfang pour utiliser l’IA afin d’étendre les capacités du créateur sans lui retirer son jugement esthétique ni sa responsabilité d’auteur.',
    readingTime: '14 min',
  },
  {
    slug: 'methode-permis-de-jouer-pedagogie-musicale',
    category: 'Pédagogie',
    title: 'La méthode Permis de Jouer™ : comprendre la musique avant de l’exécuter',
    excerpt:
      'Pourquoi l’apprentissage par paliers progressifs (N1 à N4) et l’harmonie appliquée débloquent l’autonomie musicale bien plus vite que le solfège purement descendant.',
    readingTime: '9 min',
  },
  {
    slug: 'ia-et-musique-live',
    category: 'Musique',
    title: 'IA et musique live : ce que la technologie ne doit jamais remplacer',
    excerpt:
      'Le live est une situation où les choix restent adaptés au lieu, au moment et aux personnes présentes. Où placer la limite quand l’IA entre dans le jeu ?',
    readingTime: '7 min',
  },
  {
    slug: '5-facons-ia-carriere-musicien',
    category: 'Entrepreneuriat',
    title: '5 façons dont un musicien peut utiliser l’IA dans sa carrière',
    excerpt:
      'Des usages concrets, immédiatement applicables : création, communication, organisation, facturation et veille, sans gadget ni dépendance.',
    readingTime: '8 min',
  },
]

const THREE_UNIVERSES = [
  {
    num: '01',
    verb: 'CRÉER',
    brand: 'Le Pianobariste™',
    subtitle: 'Scène live, piano-bar, galas & production sonore',
    description:
      'Prestations live sur mesure depuis 2007 (Solo, Duo piano-voix ou Live Band) pour hôtels de prestige, réceptions diplomatiques et événements privés, prolongées par la composition et l’ingénierie du son.',
    proof: '+440 titres · Hilton, Mont Fébé, Djeuga Palace, Akwa Palace',
    exploreTo: '#le-pianobariste',
    explorePage: '/musique',
    exploreLabel: 'Explorer l’univers musical',
    ctaLabel: 'Réserver une prestation',
    ctaTo: '/reservation?type=booking',
    ctaTrack: 'universe_booking',
  },
  {
    num: '02',
    verb: 'TRANSMETTRE',
    brand: 'A Laiz Academy',
    subtitle: 'Pédagogie structurée, Permis de Jouer™ & LES ZIKOS®',
    description:
      'Académie musicale et technologique fondée sur le référentiel Permis de Jouer™ (N1–N4), le manuel LES ZIKOS® (68 p.) et l’enseignement supérieur en musique et son.',
    proof: 'Cursus N1–N4 · ESAS Lomé, ISMA Bénin, IBA, IFCPA/CRTV',
    exploreTo: '#a-laiz-academy',
    explorePage: '/pedagogie',
    exploreLabel: 'Découvrir la pédagogie',
    ctaLabel: 'Organiser une formation',
    ctaTo: '/reservation?type=formation',
    ctaTrack: 'universe_formation',
  },
  {
    num: '03',
    verb: 'AUGMENTER',
    brand: 'Musicien Augmenté™',
    subtitle: 'IA musicale, conférences & accompagnement stratégique',
    description:
      'Méthode d’hybridation entre exigence musicale, outils d’IA, MAO et positionnement culturel pour artistes, enseignants, studios et institutions.',
    proof: '6 conférences · Master II Musicologie · Accompagnement pro',
    exploreTo: '#musicien-augmente',
    explorePage: '/ia-technologie',
    exploreLabel: 'Comprendre Musicien Augmenté™',
    ctaLabel: 'Demander une intervention',
    ctaTo: '/reservation?type=conference',
    ctaTrack: 'universe_conseil',
  },
]

const PIANOBAR_FORMATS = [
  {
    name: 'Formule Solo Prestige',
    tag: 'Piano & Ambiance Feutrée',
    desc: 'Hôtels 5 étoiles, dîners diplomatiques et lounges exigeant élégance et discrétion acoustique.',
    to: '/reservation?type=booking&formula=lounge',
  },
  {
    name: 'Formule Duo Signature',
    tag: 'Piano & Voix — Hervé & Flavie',
    desc: 'Cocktails de gala, mariages et soirées d’exception portés par le dialogue piano-voix.',
    to: '/reservation?type=booking&formula=prestige',
  },
  {
    name: 'Formule Formation Élargie',
    tag: 'Live Band — Trio / Quartet',
    desc: 'Festivals, clôtures institutionnelles et soirées corporate avec section rythmique complète.',
    to: '/reservation?type=booking&formula=liveband',
  },
]

const ACADEMY_TRACKS = [
  {
    level: 'N1 → N4',
    title: 'Le Permis de Jouer™',
    text: 'Progression en 4 paliers centrée sur l’écoute, les grilles harmoniques et l’autonomie scénique.',
    link: '/pedagogie#permis-de-jouer',
    linkLabel: 'Voir le référentiel',
  },
  {
    level: '5 disciplines',
    title: 'A Laiz Academy (ex-RMA)',
    text: 'Cours individuels, ateliers collectifs et programme « Vacances Utiles » restitué sur scène.',
    link: '/rma',
    linkLabel: 'Voir les programmes',
  },
  {
    level: 'Manuel 68 p.',
    title: 'Collection LES ZIKOS®',
    text: 'Méthodes d’apprentissage ancrées dans les réalités rythmiques africaines et internationales.',
    link: '/pedagogie#publications',
    linkLabel: 'Découvrir l’ouvrage',
  },
]

const RESEARCH_AND_PROJECTS = [
  {
    category: 'Patrimoine & Linguistique',
    title: 'Tswefap — Système d’écriture du Batoufam',
    detail:
      'Corpus et manuel dédiés à la sauvegarde linguistique et à la transmission culturelle au sein de l’univers A Laiz Ô Pays.',
    badge: 'Recherche en cours',
    to: '/culture-recherche',
    linkLabel: 'Explorer l’axe patrimonial',
  },
  {
    category: 'Musicologie & Médias',
    title: 'Musique à l’image & cinéma africain',
    detail:
      'Travaux de Master II (Université de Yaoundé I) et cours supérieurs (ESAS Lomé) sur la dramaturgie sonore.',
    badge: 'Master II & Enseignement',
    to: '/culture-recherche',
    linkLabel: 'Voir les recherches',
  },
  {
    category: 'Création & Ethnomusicologie',
    title: 'Le Concert des Guérisseurs & Music’Arts Thérapie',
    detail:
      'Recherche-création pour percussions et piano inspirée des musiques thérapeutiques pygmées et d’un projet d’ouvrage.',
    badge: 'Création & Recherche',
    to: '/projets',
    linkLabel: 'Voir le projet',
  },
]

const FIELD_PROOFS = [
  {
    image: '/images/04-piano-bar-live.webp',
    badge: 'Scène & Réceptions',
    title: 'Le Pianobariste™ en prestation live',
    caption: 'Interprétation acoustique et présence scénique pour réceptions officielles, galas et hôtellerie de prestige.',
    to: '/musique',
  },
  {
    image: '/images/cours-isma-masterclass-1311.webp',
    badge: 'Enseignement supérieur',
    title: 'Masterclasses & Transmission universitaire',
    caption: 'Interventions académiques en composition musicale et ingénierie sonore (ISMA, ESAS, IBA, IFCPA).',
    to: '/pedagogie',
  },
  {
    image: '/images/13-siac-2025.jpg',
    badge: 'Forums & Institutions',
    title: 'Prises de parole & Colloques (SIAC 2025)',
    caption: 'Conférences et panels sur la création contemporaine, la culture, la structuration de filières et l’IA.',
    to: '/conferences',
  },
  {
    image: '/images/live-band.webp',
    badge: 'Grand Format',
    title: 'Live Band & Direction musicale',
    caption: 'Direction d’ensembles élargis et arrangements scéniques pour concerts, festivals et célébrations d’envergure.',
    to: '/projets',
  },
]

const COMMERCIAL_PATHWAYS = [
  {
    priority: '01 · Scène & Événementiel',
    title: 'Réserver une prestation musicale',
    subtitle: 'Le Pianobariste™ — Solo, Duo ou Live Band',
    desc: 'Hôtels, réceptions diplomatiques, galas corporate et mariages au Cameroun et à l’international.',
    cta: 'Demander un devis prestation',
    to: '/reservation?type=booking',
    whatsappText:
      'Bonjour Hervé Nanfang, je souhaite réserver une prestation musicale (Le Pianobariste™) et obtenir une proposition adaptée.',
    primary: true,
  },
  {
    priority: '02 · Pédagogie & Écoles',
    title: 'Organiser une formation',
    subtitle: 'A Laiz Academy — Piano, MAO, Permis de Jouer™',
    desc: 'Cursus individuels ou collectifs, ateliers MAO, formation de formateurs et curricula pour établissements.',
    cta: 'Structurer une formation',
    to: '/reservation?type=formation',
    whatsappText:
      'Bonjour Hervé Nanfang, je souhaite organiser une formation ou m’informer sur les cursus A Laiz Academy.',
    primary: false,
  },
  {
    priority: '03 · Institutions & Universités',
    title: 'Inviter en conférence ou masterclass',
    subtitle: '6 thématiques — IA, Musicologie & Création',
    desc: 'Keynotes, masterclasses avec piano en direct et journées pédagogiques pour universités, festivals et colloques.',
    cta: 'Proposer une date',
    to: '/reservation?type=conference',
    whatsappText:
      'Bonjour Hervé Nanfang, nous souhaitons vous inviter pour une conférence ou masterclass au sein de notre institution.',
    primary: false,
  },
  {
    priority: '04 · Conseil & Studio',
    title: 'Demander un accompagnement',
    subtitle: 'Musicien Augmenté™ — IA, Son & Marque culturelle',
    desc: 'Conseil stratégique, intégration éthique de l’IA, production audio, musique à l’image et récit de marque.',
    cta: 'Solliciter un accompagnement',
    to: '/reservation?type=conseil',
    whatsappText:
      'Bonjour Hervé Nanfang, je souhaite solliciter un accompagnement professionnel (Musicien Augmenté™ / Studio / Conseil).',
    primary: false,
  },
]

function getArticleCover(article: HomeArticleSummary): string {
  if (
    article.coverImage &&
    article.coverImage !== '/og-image.jpg' &&
    !article.coverImage.startsWith('blob:')
  ) {
    return article.coverImage
  }
  const cat = (article.category || '').toLowerCase()
  if (cat.includes('ia') || cat.includes('techno') || cat.includes('mao')) {
    return '/images/concept-visuel-piano-futuriste-1.webp'
  }
  if (cat.includes('live') || cat.includes('piano')) {
    return '/images/04-piano-bar-live.webp'
  }
  if (cat.includes('pédagogie') || cat.includes('formation') || cat.includes('musicologie')) {
    return '/images/cours-isma-masterclass-1311.webp'
  }
  return '/images/shooting-pro-officiel.webp'
}

const ROLES = [
  'Musicien & Artiste · Le Pianobariste™',
  'Musicologue & Chercheur indépendant',
  'Pédagogue · A Laiz Academy',
  'Ingénieur du Son & Musicien Augmenté™',
]

const CURATED_TESTIMONIALS = [TESTIMONIALS[0], TESTIMONIALS[2], TESTIMONIALS[3]].filter(Boolean)

export default function Home() {
  const { openPlayer } = useAudio()
  const [roleIndex, setRoleIndex] = useState(0)
  const livePianoMedia = useLiveMedia('med-live-piano', liveScene, 50, 20)
  const adminState = useAdminState()
  const publishedLiveArticles = (adminState.articles ?? []).filter((a) => a.status === 'Publié')
  const liveArticles: HomeArticleSummary[] =
    publishedLiveArticles.length > 0 ? publishedLiveArticles.slice(0, 5) : HOME_FEATURED_ARTICLES

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
      {/* NIVEAU 1 : COMPRÉHENSION IMMÉDIATE (< 5 s) — HERO ÉPURÉ & HIÉRARCHISÉ    */}
      {/* ========================================================================= */}
      <section className="home-hero relative isolate overflow-hidden bg-ink">
        <img
          src={liveScene}
          alt="Hervé Nanfang au piano lors d’une prestation live Le Pianobariste™ au Cameroun."
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
          className="home-hero__image absolute inset-0 h-full w-full object-cover object-[50%_18%]"
        />
        <div aria-hidden="true" className="home-hero__shade absolute inset-0" />
        <div aria-hidden="true" className="home-hero__vignette absolute inset-0" />
        <div aria-hidden="true" className="home-hero__grid absolute inset-0" />

        <SoundWaveCanvas className="z-[3] opacity-55" />

        <Container className="relative z-10 flex min-h-[min(46rem,92svh)] items-end pb-14 pt-32 md:pb-16 md:pt-36">
          <div className="max-w-4xl w-full">
            <Reveal>
              <div className="mb-5 flex flex-wrap items-center gap-4">
                <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/50 bg-gradient-to-br from-gold/15 via-ink-2 to-black p-2 shadow-[0_0_28px_rgba(198,161,91,0.28)] sm:h-16 sm:w-16">
                  <img
                    src="/hn-initials-mark.webp"
                    alt="Monogramme HN — Hervé Nanfang"
                    width={96}
                    height={96}
                    loading="eager"
                    decoding="async"
                    className="relative z-10 h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                    </span>
                    <Eyebrow className="min-h-[1.25rem] text-ivory/95 transition-opacity duration-500">
                      {ROLES[roleIndex]}
                    </Eyebrow>
                  </div>
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-gold/85">
                    Musicien · Musicologue · Pédagogue · Ingénieur du son
                  </p>
                </div>
              </div>

              <h1 className="home-hero__title mt-0 max-w-4xl text-5xl leading-[0.94] tracking-[-0.04em] text-ivory sm:text-7xl lg:text-[5.75rem]">
                {MASTER_IDENTITY.identite.nom}
              </h1>
            </Reveal>

            <Reveal delay={90}>
              <p className="mt-5 max-w-3xl font-display text-2xl leading-snug text-ivory sm:text-3xl">
                De la scène piano-bar live à la recherche musicologique, de la pédagogie structurée à l’innovation musicale par l’IA.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/80 md:text-base">
                {MASTER_IDENTITY.positionnement.accrocheAccueil} Trois pôles d’intervention —{' '}
                <strong className="text-ivory">Le Pianobariste™</strong>,{' '}
                <strong className="text-ivory">A Laiz Academy</strong> et{' '}
                <strong className="text-ivory">Musicien Augmenté™</strong> — fédérés par le concept culturel{' '}
                <strong className="text-ivory">A Laiz Ô Pays</strong>.
              </p>
            </Reveal>

            <Reveal delay={160}>
              {/* 1 CTA Principal + 1 CTA Découverte + 2 raccourcis discrets (charge cognitive réduite) */}
              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Btn
                  to="/reservation"
                  variant="gold"
                  onClick={() => trackCtaClick('hero_reservation', '/reservation', 'hero')}
                  className="shadow-[0_0_24px_rgba(198,161,91,0.28)]"
                >
                  Réserver ou demander un devis
                </Btn>
                <a
                  href="#trois-univers"
                  className="btn btn-ghost border-white/25 hover:border-gold/60"
                >
                  Explorer l’écosystème ↓
                </a>
                <button
                  type="button"
                  onClick={openPlayer}
                  aria-label="Écouter les extraits musicaux au piano"
                  className="inline-flex items-center gap-2 border border-gold/35 bg-ink-2/80 px-4 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-gold backdrop-blur-sm transition-colors hover:border-gold hover:bg-gold/10"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  <span>Écouter ♫</span>
                </button>
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ivory/70">
                <a
                  href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent(
                    'Bonjour Hervé Nanfang, je souhaite vous contacter pour un projet (prestation, formation, conférence ou conseil).',
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackContactMethodClick('whatsapp', 'hero_direct')}
                  className="inline-flex items-center gap-1.5 font-medium text-emerald-300 hover:text-emerald-200 hover:underline"
                >
                  <span>WhatsApp direct · {SITE.phones[0].display} ↗</span>
                </a>
                <span className="hidden text-ivory/30 sm:inline">•</span>
                <span>Réponse chiffrée sous 48h ouvrées · Yaoundé, Afrique & International</span>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* PREUVES IMMÉDIATES — REPÈRES CHIFFRÉS & RÉFÉRENCES VÉRIFIABLES            */}
      {/* ========================================================================= */}
      <section
        id="preuves-competence"
        aria-label="Repères et références vérifiables"
        className="relative border-y border-white/10 bg-ink-2 py-9 md:py-11"
      >
        <Container>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-10">
            <Reveal delay={0}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-5">
                <p className="font-display text-3xl text-gold sm:text-4xl">2007</p>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-ivory/85">
                  Expérience scénique
                </p>
                <p className="mt-1 text-xs text-ivory/65">+440 titres au répertoire · Piano-bar & galas</p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-5">
                <p className="font-display text-3xl text-gold sm:text-4xl">06</p>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-ivory/85">
                  Institutions supérieures
                </p>
                <p className="mt-1 text-xs text-ivory/65">ESAS Lomé · ISMA · IBA · IFCPA/CRTV · Yaoundé I</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-5">
                <p className="font-display text-3xl text-gold sm:text-4xl">N1–N4</p>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-ivory/85">
                  Permis de Jouer™ & LES ZIKOS®
                </p>
                <p className="mt-1 text-xs text-ivory/65">Référentiel progressif & manuel 68 pages</p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-5">
                <p className="font-display text-3xl text-gold sm:text-4xl">06</p>
                <p className="mt-1 font-mono text-[0.65rem] uppercase tracking-wider text-ivory/85">
                  Conférences & Masterclasses
                </p>
                <p className="mt-1 text-xs text-ivory/65">Musicien Augmenté™ · IA, MAO & Musicologie</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-7 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-5">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold/85">
              Scènes & institutions de référence :
            </span>
            <p className="text-xs tracking-wide text-ivory/70">
              Hôtel Hilton Yaoundé · Hôtel Mont Fébé · Djeuga Palace · Akwa Palace Douala · ESAS (Lomé) · ISMA (Bénin) · IBA · IFCPA / CRTV
            </p>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* NIVEAU 2 : DÉCOUVERTE — TROIS UNIVERS + SOCLE MUSICOLOGIQUE               */}
      {/* ========================================================================= */}
      <Section tone="ink" id="trois-univers">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <ChapterMark num="01" label="Créer · Transmettre · Augmenter · Développer" />
            <Display size="lg" className="mt-5 max-w-3xl">
              Trois univers complémentaires, reliés par la recherche et le terrain
            </Display>
          </Reveal>
          <Reveal delay={80}>
            <p className="max-w-md text-sm leading-relaxed text-ivory/70">
              La scène éclaire la pédagogie, la musicologie nourrit l’analyse, et la maîtrise technologique
              augmente le créateur sans diluer son identité.
            </p>
          </Reveal>
        </div>

        <div className="mt-11 grid gap-6 lg:grid-cols-3">
          {THREE_UNIVERSES.map((u, i) => (
            <Reveal key={u.brand} delay={i * 75}>
              <Card className="flex h-full flex-col justify-between border-white/12 bg-ink-2 p-7 transition-colors hover:border-gold/55">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded border border-gold/40 bg-gold/10 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      {u.num} · {u.verb}
                    </span>
                    <a
                      href={u.exploreTo}
                      className="font-mono text-[0.65rem] uppercase tracking-wider text-ivory/55 hover:text-gold"
                    >
                      Aperçu ↓
                    </a>
                  </div>

                  <h3 className="mt-5 font-display text-3xl text-ivory">{u.brand}</h3>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-gold/85">
                    {u.subtitle}
                  </p>
                  <Rule className="my-4 opacity-35" />
                  <Body className="text-sm">{u.description}</Body>

                  <p className="mt-5 border-l-2 border-gold/45 bg-ink/60 px-3.5 py-2.5 text-xs text-ivory/75">
                    {u.proof}
                  </p>
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
                  <ArrowLink to={u.explorePage}>{u.exploreLabel}</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Socle transversal : Musicologie, Recherche & A Laiz Ô Pays */}
        <Reveal delay={150}>
          <div className="mt-10 grid gap-8 border border-gold/35 bg-gradient-to-r from-ink-2 via-ink-2/95 to-ink p-7 md:p-9 lg:grid-cols-[0.26fr_0.74fr] lg:items-center">
            <figure className="mx-auto w-full max-w-[14rem] lg:max-w-none">
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
                  Socle transversal
                </span>
                <Eyebrow>Musicologie · Recherche · A Laiz Ô Pays</Eyebrow>
              </div>
              <h3 className="mt-3 font-display text-2xl leading-snug text-ivory sm:text-3xl">
                La musicologie et la sauvegarde patrimoniale comme colonne vertébrale
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/75">
                Titulaire d’une Licence en Arts et Management Culturel (Université de Dschang) et d’un{' '}
                <strong className="text-ivory">Master II en Musicologie appliquée aux médias</strong>{' '}
                (Université de Yaoundé I), Hervé Nanfang relie l’analyse scientifique à la création scénique,
                aux méthodes d’apprentissage et à l’univers culturel <strong className="text-ivory">A Laiz Ô Pays</strong>.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-5">
                <ArrowLink to="/culture-recherche">Musicologie, Tswefap & patrimoine</ArrowLink>
                <ArrowLink to="/a-propos">Parcours complet</ArrowLink>
                <ArrowLink to="/presse">Presse & EPK</ArrowLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* FOCUSES MÉTIERS SYNTHÉTIQUES — SCANNABLES SANS SURCHARGE                  */}
      {/* ========================================================================= */}
      <Section tone="dark" id="le-pianobariste">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
          <Reveal>
            <div className="overflow-hidden border border-gold/25 bg-ink">
              <img
                src={livePianoMedia.url}
                alt={livePianoMedia.alt}
                width={800}
                height={560}
                loading="lazy"
                decoding="async"
                className="aspect-[16/11] w-full object-cover"
                style={livePianoMedia.style}
              />
            </div>
          </Reveal>

          <Reveal delay={90}>
            <ChapterMark num="02" label="Créer · Le Pianobariste™ & Production Audio" />
            <Display size="md" className="mt-4">
              Présence musicale sur mesure pour hôtels, galas et événements
            </Display>
            <Body className="mt-4">
              Plus de 440 titres arrangés en direct — standards jazz, chanson française, variété internationale,
              musiques camerounaises et gospel — avec régie acoustique autonome ou piano à queue.
            </Body>

            <div className="mt-6 grid gap-3.5 sm:grid-cols-3">
              {PIANOBAR_FORMATS.map((f) => (
                <Link
                  key={f.name}
                  to={f.to}
                  className="group border border-white/10 bg-ink/80 p-4 transition-colors hover:border-gold/55"
                >
                  <p className="font-mono text-[0.6rem] uppercase tracking-wider text-gold">
                    {f.tag}
                  </p>
                  <h3 className="mt-1.5 font-display text-lg text-ivory group-hover:text-gold">
                    {f.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-ivory/65">{f.desc}</p>
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Btn to="/reservation?type=booking" variant="gold">
                Vérifier une disponibilité
              </Btn>
              <ArrowLink to="/musique">Répertoire complet (+440 titres) & extraits</ArrowLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* TRANSMISSION & INNOVATION — A LAIZ ACADEMY + MUSICIEN AUGMENTÉ™           */}
      {/* ========================================================================= */}
      <Section tone="ink" id="a-laiz-academy">
        <Reveal>
          <ChapterMark num="03" label="Transmettre & Augmenter · Académie, IA & Recherche" />
          <div className="mt-5 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <Display size="md">
              De la pédagogie musicale structurée à l’hybridation responsable avec l’IA
            </Display>
            <Lead className="text-base">
              Une double dynamique reliant l’apprentissage musical par paliers (<strong className="text-ivory">Permis de Jouer™</strong>,{' '}
              <strong className="text-ivory">LES ZIKOS®</strong>), les conférences académiques et les travaux de recherche.
            </Lead>
          </div>
        </Reveal>

        {/* Pédagogie */}
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {ACADEMY_TRACKS.map((track, i) => (
            <Reveal key={track.title} delay={i * 70}>
              <Card className="flex h-full flex-col justify-between bg-ink-2 p-6">
                <div>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-gold">
                    {track.level}
                  </span>
                  <h3 className="mt-2 font-display text-2xl text-ivory">{track.title}</h3>
                  <p className="mt-2.5 text-xs leading-relaxed text-ivory/70">{track.text}</p>
                </div>
                <div className="mt-5 pt-4 border-t border-white/10">
                  <ArrowLink to={track.link}>{track.linkLabel}</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Musicien Augmenté™ & Recherche/Projets en bloc équilibré */}
        <div id="musicien-augmente" className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal>
            <Card className="h-full border-gold/30 bg-ink-2 p-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Eyebrow>Musicien Augmenté™ · IA & Conférences</Eyebrow>
                <span className="font-mono text-[0.62rem] uppercase tracking-wider text-gold/80">
                  {CONFERENCES.length} interventions cataloguées
                </span>
              </div>
              <h3 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">
                Conférences, masterclasses & accompagnement IA
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/70">
                Former les musiciens, enseignants et institutions à tirer parti des outils numériques et de
                l’intelligence artificielle tout en préservant l’intention humaine et le droit d’auteur.
              </p>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4 text-xs text-ivory/75">
                {CONFERENCES.slice(0, 3).map((conf) => (
                  <li key={conf.id} className="flex items-start gap-2">
                    <span className="text-gold">·</span>
                    <span>{conf.title}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Btn to="/reservation?type=conference" variant="gold" className="!py-2.5 !px-4 !text-xs">
                  Inviter une conférence
                </Btn>
                <ArrowLink to="/conferences">Voir les 6 conférences</ArrowLink>
                <ArrowLink to="/ia-technologie">Cadre Musicien Augmenté™</ArrowLink>
              </div>
            </Card>
          </Reveal>

          <Reveal delay={90}>
            <div id="recherche-et-projets" className="h-full">
              <Card className="h-full border-white/12 bg-ink-2 p-7">
              <Eyebrow>Musicologie · Patrimoine · Réalisations</Eyebrow>
              <h3 className="mt-3 font-display text-2xl text-ivory sm:text-3xl">
                Travaux de recherche & projets structurants
              </h3>
              <div className="mt-4 space-y-4">
                {RESEARCH_AND_PROJECTS.map((item) => (
                  <div
                    key={item.title}
                    className="border-l-2 border-gold/45 pl-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-[0.6rem] uppercase tracking-wider text-gold">
                        {item.category}
                      </span>
                      <span className="text-[0.6rem] uppercase tracking-wider text-ivory/50">
                        {item.badge}
                      </span>
                    </div>
                    <h4 className="mt-1 font-display text-lg text-ivory">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-ivory/65">{item.detail}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4">
                <ArrowLink to="/culture-recherche">Culture & Recherche</ArrowLink>
                <ArrowLink to="/projets">Toutes les réalisations</ArrowLink>
              </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* PRIORITÉ 3 : PREUVES VISUELLES SUR LE TERRAIN & RETOURS VÉRIFIÉS          */}
      {/* ========================================================================= */}
      <Section tone="dark" id="preuves">
        <Reveal>
          <ChapterMark num="04" label="Preuves terrain · Scène, Université & Institutions" />
          <div className="mt-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <Display size="md">En scène, en amphithéâtre et en forum professionnel</Display>
              <Lead className="mt-3 max-w-2xl text-base">
                Captations photographiques issues d’interventions réelles : galas, cours supérieurs (ISMA),
                forums culturels (SIAC) et formations orchestrales.
              </Lead>
            </div>
            <Btn to="/a-propos" variant="ghost" className="shrink-0">
              Parcours & références
            </Btn>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FIELD_PROOFS.map((proof, i) => (
            <Reveal key={proof.title} delay={i * 65}>
              <Link
                to={proof.to}
                className="group flex h-full flex-col overflow-hidden border border-white/10 bg-ink transition-colors hover:border-gold/55"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-ink">
                  <img
                    src={proof.image}
                    alt={proof.title}
                    width={640}
                    height={480}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 border border-gold/40 bg-ink/85 px-2.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-gold backdrop-blur-sm">
                    {proof.badge}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="font-display text-lg leading-snug text-ivory group-hover:text-gold transition-colors">
                      {proof.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/65">{proof.caption}</p>
                  </div>
                  <span className="mt-4 font-mono text-[0.62rem] uppercase tracking-wider text-gold">
                    Explorer →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* Extraits vérifiés de témoignages (source: src/data/testimonials.ts) */}
        <div className="mt-12 border-t border-white/10 pt-10">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow>Retours d’expérience documentés</Eyebrow>
                <h3 className="mt-2 font-display text-2xl text-ivory sm:text-3xl">
                  Ce qu’en disent élèves, artistes et responsables pédagogiques
                </h3>
              </div>
              <ArrowLink to="/rma#temoignages">Tous les témoignages A Laiz Academy</ArrowLink>
            </div>
          </Reveal>

          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {CURATED_TESTIMONIALS.map((t, i) => (
              <Reveal key={t.id} delay={i * 70}>
                <Card className="flex h-full flex-col justify-between border-white/10 bg-ink p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[0.62rem] uppercase tracking-wider text-gold">
                        {t.discipline}
                      </span>
                      {t.palier && (
                        <span className="text-[0.6rem] uppercase tracking-wider text-ivory/50">
                          {t.palier}
                        </span>
                      )}
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-ivory/80 line-clamp-5">
                      « {t.body} »
                    </p>
                  </div>
                  <div className="mt-5 border-t border-white/10 pt-3 flex items-center justify-between text-xs">
                    <span className="font-semibold text-ivory">{t.name}</span>
                    <span className="text-ivory/55">{t.role} · {t.location}</span>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* VIDÉO LIVE & FORMATS SCÉNIQUES (EQUILIBRÉ)                               */}
      {/* ========================================================================= */}
      <HomeFeaturedVideos chapterNum="05" />

      {/* ========================================================================= */}
      {/* NIVEAU 3 : CONVERSION DIRECTE — 4 PARCOURS SUR /reservation              */}
      {/* ========================================================================= */}
      <Section tone="dark" id="collaborer">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <Reveal>
            <ChapterMark num="06" label="Passer à l’action · Réservation & Devis" />
            <Display size="lg" className="mt-5 max-w-3xl">
              Quatre parcours clairs selon votre besoin
            </Display>
            <Lead className="mt-3 max-w-2xl">
              Sélectionnez le motif correspondant à votre projet sur la page de réservation dédiée, ou démarrez
              directement sur WhatsApp avec un récapitulatif prérempli.
            </Lead>
          </Reveal>
          <Reveal delay={80}>
            <Btn to="/reservation" variant="gold" className="shrink-0">
              Ouvrir le configurateur de réservation →
            </Btn>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {COMMERCIAL_PATHWAYS.map((item, i) => (
            <Reveal key={item.title} delay={i * 65}>
              <Card
                className={`flex h-full flex-col justify-between p-6 transition-colors ${
                  item.primary
                    ? 'border-gold/55 bg-gradient-to-br from-ink-2 via-ink to-ink shadow-[0_10px_28px_rgba(198,161,91,0.12)]'
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
                        Le plus demandé
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-2xl text-ivory">{item.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-ivory/65">
                    {item.subtitle}
                  </p>
                  <Rule className="my-4 opacity-35" />
                  <Body className="text-sm">{item.desc}</Body>
                </div>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
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
                    className="font-mono text-[0.65rem] uppercase tracking-wider text-emerald-400 hover:text-emerald-300"
                  >
                    WhatsApp prérempli ↗
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-ink/70 px-6 py-4 text-xs text-ivory/65">
            <span>
              <strong className="text-ivory">Demandes presse, interviews ou partenariats :</strong>{' '}
              accédez au formulaire général et au dossier de presse (EPK).
            </span>
            <div className="flex flex-wrap items-center gap-5">
              <ArrowLink to="/contact?sujet=presse#presse">Contact Presse & Médias</ArrowLink>
              <ArrowLink to="/contact?sujet=collaboration#collaboration">Proposer un partenariat</ArrowLink>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* LE JOURNAL — ESSAIS DE FOND & MAILLAGE VERS LES MÉTIERS                   */}
      {/* ========================================================================= */}
      <Section tone="ink" id="journal">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <ChapterMark num="07" label="Le Journal · Essais & Analyses de terrain" />
            <Display size="lg" className="mt-5 max-w-3xl">
              Musicologie, piano-bar, pédagogie et intelligence artificielle
            </Display>
          </Reveal>
          <Reveal delay={90}>
            <Btn to="/journal" variant="ghost" className="shrink-0">
              Explorer tout le Journal
            </Btn>
          </Reveal>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          {liveArticles[0] && (
            <Reveal className="lg:col-span-7">
              <Link
                to={`/journal/${liveArticles[0].slug}`}
                className="group relative flex h-full flex-col justify-between overflow-hidden border border-gold/40 bg-ink-2 p-7 transition-colors hover:border-gold sm:p-9"
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
                    Lecture : {liveArticles[0].readingTime}
                  </span>
                  <h3 className="mt-3 font-display text-2xl leading-[1.15] text-ivory transition-colors group-hover:text-gold sm:text-3xl">
                    {liveArticles[0].title}
                  </h3>
                  <Rule className="my-4 opacity-40" />
                  <p className="text-sm leading-relaxed text-ivory/70 line-clamp-3">
                    {liveArticles[0].excerpt}
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold group-hover:text-gold-2">
                    Lire l’essai complet →
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-ivory/65">
                    Par Hervé Nanfang
                  </span>
                </div>
              </Link>
            </Reveal>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
            {liveArticles.slice(1, 5).map((a, i) => (
              <Reveal key={a.slug} delay={i * 60}>
                <Link
                  to={`/journal/${a.slug}`}
                  className="group flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-4 transition-colors hover:border-gold/50 sm:flex-row sm:items-center"
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
        text="Le Pianobariste™ (depuis 2007), A Laiz Academy, conférences institutionnelles ou accompagnement Musicien Augmenté™ : réponse chiffrée sous 48 h."
        primary={{ label: 'Réserver ou demander un devis', to: '/reservation' }}
        secondary={{ label: 'Consulter les offres détaillées', to: '/services' }}
      />
    </>
  )
}
