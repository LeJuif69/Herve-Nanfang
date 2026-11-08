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
import { PILLARS, SITE } from '../data/site'
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

const DISCIPLINES = [
  'Musique',
  'Musicologie',
  'Pédagogie',
  'Technologie',
  'Intelligence artificielle',
  'Communication digitale',
  'Culture',
  'Entrepreneuriat',
]

const IA_DOMAINS = [
  {
    title: 'IA pour la musique & la MAO',
    items: ['Composition', 'Arrangement', 'Analyse harmonique', 'Idéation', 'Production', 'Sound design'],
  },
  {
    title: 'IA pour le pédagogue',
    items: ['Conception de cours', 'Curricula', 'Supports interactifs', 'Évaluation', 'Progression N1–N4'],
  },
  {
    title: 'IA pour le professionnel',
    items: ['Automatisation', 'Workflows créatifs', 'Documentation', 'Productivité', 'Veille stratégique'],
  },
  {
    title: 'IA & communication culturelle',
    items: ['Stratégie éditoriale', 'Storytelling', 'Direction de marque', 'Médiation', 'Rayonnement'],
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
    text: 'Cours particuliers et collectifs à Yaoundé et à distance : piano, accompagnement, chant, arrangement, MAO et ingénierie du son.',
    link: '/rma',
    linkLabel: 'Explorer les programmes',
  },
  {
    level: 'Manuel déposé',
    title: 'Collection LES ZIKOS®',
    text: 'Supports pédagogiques structurés et méthodes d’apprentissage ancrées dans les réalités rythmiques et harmoniques africaines et internationales.',
    link: '/pedagogie',
    linkLabel: 'Découvrir les ouvrages',
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
  'Artiste-Musicien · Le Pianobariste™',
  'Musicologue · Pédagogue & Formateur',
  'Ingénieur du Son · Producteur MAO',
  'Musicien Augmenté™ · IA & Innovation',
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
      {/* 1. HERO — HERVÉ NANFANG, PROPOSITION DE VALEUR & 4 CTA PRIORITAIRES       */}
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

        <Container className="relative z-10 flex min-h-[min(54rem,100svh)] items-end pb-14 pt-32 md:items-end md:pb-20 md:pt-40">
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
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
                  </span>
                  <Eyebrow className="min-h-[1.25rem] text-ivory/90 transition-opacity duration-500">
                    {ROLES[roleIndex]}
                  </Eyebrow>
                </div>
              </div>

              <h1 className="home-hero__title mt-0 max-w-4xl text-5xl leading-[0.92] tracking-[-0.04em] text-ivory sm:text-7xl lg:text-[6.2rem]">
                {MASTER_IDENTITY.identite.nom}
              </h1>
            </Reveal>

            <Reveal delay={100}>
              <p className="mt-5 max-w-2xl font-display text-2xl leading-snug text-ivory sm:text-3xl">
                Créer. Transmettre. Augmenter. Développer.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ivory/80 md:text-base">
                {MASTER_IDENTITY.positionnement.accrocheAccueil}
              </p>
            </Reveal>

            <Reveal delay={180}>
              {/* Appels à l'action prioritaires dès le premier écran */}
              <div className="mt-7 rounded-2xl border border-gold/35 bg-ink-2/85 p-4 sm:p-5 md:p-6 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.55)]">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold">
                      Accès direct · Cameroun & International
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/70">
                      Sélectionnez votre besoin pour obtenir une proposition sur mesure sous 48 h.
                    </p>
                  </div>
                  <a
                    href={`https://wa.me/${SITE.phones[0].whatsapp}?text=${encodeURIComponent("Bonjour Hervé Nanfang, je souhaite échanger directement avec vous concernant un projet.")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackContactMethodClick('whatsapp', 'hero_fast')}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-emerald-400 hover:border-emerald-400 hover:bg-emerald-500/20 transition-all"
                  >
                    <span>💬 WhatsApp Direct</span>
                  </a>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  <Btn
                    to="/contact?sujet=booking#booking"
                    variant="gold"
                    onClick={() => trackCtaClick('hero_booking', 'booking', 'hero')}
                    className="w-full justify-center text-center !py-3 !px-3 !text-xs !tracking-wider font-semibold"
                  >
                    Réserver une prestation
                  </Btn>
                  <Btn
                    to="/contact?sujet=formation#formation"
                    variant="ghost"
                    onClick={() => trackCtaClick('hero_formation', 'formation', 'hero')}
                    className="w-full justify-center text-center !py-3 !px-3 !text-xs !tracking-wider border-white/25 hover:border-gold hover:text-gold"
                  >
                    Organiser une formation
                  </Btn>
                  <Btn
                    to="/contact?sujet=conference#conference"
                    variant="ghost"
                    onClick={() => trackCtaClick('hero_conference', 'conference', 'hero')}
                    className="w-full justify-center text-center !py-3 !px-3 !text-xs !tracking-wider border-white/25 hover:border-gold hover:text-gold"
                  >
                    Inviter Hervé Nanfang
                  </Btn>
                  <Btn
                    to="/contact?sujet=conseil#conseil"
                    variant="ghost"
                    onClick={() => trackCtaClick('hero_conseil', 'conseil', 'hero')}
                    className="w-full justify-center text-center !py-3 !px-3 !text-xs !tracking-wider border-white/25 hover:border-gold hover:text-gold"
                  >
                    Demander un accompagnement
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
                  <span>Écouter Le Pianobariste™ ♫</span>
                </button>
                <Btn to="/a-propos" variant="ghost" className="text-xs border-white/20">
                  Biographie & Parcours
                </Btn>
                <Btn to="/journal" variant="ghost" className="text-xs border-white/20">
                  Lire le Journal
                </Btn>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* BANDEAU D’AUTORITÉ & PROPOSITIONS DE VALEUR                               */}
      {/* ========================================================================= */}
      <section id="chiffres-autorite" className="relative border-y border-white/10 bg-ink-2 py-10 md:py-14">
        <Container>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
            <Reveal delay={0}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">2007</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/80 sm:text-xs">
                  Le Pianobariste™ live
                </p>
                <p className="mt-1 text-xs text-ivory/65">+440 titres au répertoire · Scènes de prestige</p>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">4</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/80 sm:text-xs">
                  Institutions supérieures
                </p>
                <p className="mt-1 text-xs text-ivory/65">ESAS Lomé · ISMA · IBA · IFCPA/CRTV</p>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">N1–N4</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/80 sm:text-xs">
                  Permis de Jouer™
                </p>
                <p className="mt-1 text-xs text-ivory/65">4 paliers de compétences à A Laiz Academy</p>
              </div>
            </Reveal>
            <Reveal delay={180}>
              <div className="border-l-2 border-gold/60 pl-4 md:pl-6">
                <p className="font-display text-3xl text-gold sm:text-4xl lg:text-5xl">06</p>
                <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-wider text-ivory/80 sm:text-xs">
                  Conférences majeures
                </p>
                <p className="mt-1 text-xs text-ivory/65">Musicien Augmenté™ · IA, MAO & Culture</p>
              </div>
            </Reveal>
          </div>

          <div className="mt-8 border-t border-white/8 pt-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-gold/80">
              Références académiques & scènes de prestige :
            </span>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium tracking-wider text-ivory/60">
              <span>ESAS (Lomé)</span>
              <span className="text-gold/40">•</span>
              <span>ISMA (Bénin)</span>
              <span className="text-gold/40">•</span>
              <span>Institut des Beaux-Arts (Nkongsamba)</span>
              <span className="text-gold/40">•</span>
              <span>IFCPA / CRTV (Yaoundé)</span>
              <span className="text-gold/40">•</span>
              <span>Hôtel Hilton · Mont Fébé · Djeuga Palace · Akwa Palace</span>
            </div>
          </div>
        </Container>
      </section>

      {/* ========================================================================= */}
      {/* SYNTHÈSE IDENTITAIRE — CRÉER · TRANSMETTRE · AUGMENTER · DÉVELOPPER       */}
      {/* ========================================================================= */}
      <Section tone="ink" id="proposition-de-valeur">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <figure className="relative mx-auto max-w-md lg:max-w-none">
              <div className="overflow-hidden border border-white/10 bg-ink-2">
                <img
                  src="/images/shooting-pro-officiel.webp"
                  alt="Portrait officiel d'Hervé Nanfang — Artiste-musicien, musicologue, pédagogue et ingénieur du son"
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-[50%_18%]"
                />
              </div>
              <figcaption className="mt-3 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.18em] text-ivory/65">
                <span>{IDENTITY.name}</span>
                <span>{IDENTITY.city}</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={120}>
            <ChapterMark num="00" label="Identité & Architecture" />
            <Display size="md" className="mt-6">
              Créer. Transmettre. Augmenter. Développer.
            </Display>
            <Lead className="mt-5">
              {IDENTITY.referenceDescription}
            </Lead>
            <Body className="mt-4">
              {IDENTITY.bios.court} Fondateur de l’univers créatif et culturel{' '}
              <strong className="text-ivory">A Laiz Ô Pays</strong>, il relie la scène piano-bar live,
              l’enseignement musical structuré et l’innovation technologique appliquée au son.
            </Body>

            <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PILLARS.map((p) => (
                <Link
                  key={p.index}
                  to={p.to}
                  className="group border border-white/10 bg-ink-2/70 p-3.5 transition-colors hover:border-gold/50"
                >
                  <span className="font-mono text-[0.65rem] text-gold/80">{p.index}</span>
                  <p className="mt-1 font-display text-lg text-ivory group-hover:text-gold transition-colors">
                    {p.verb}
                  </p>
                  <p className="mt-0.5 text-[0.68rem] text-ivory/55">{p.keywords}</p>
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">
              {DISCIPLINES.map((d) => (
                <Tag key={d}>{d}</Tag>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-5">
              <Btn to="/a-propos" variant="ghost">
                Découvrir le parcours complet
              </Btn>
              <ArrowLink to="/presse">Dossier de presse & EPK officiel</ArrowLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 2. LE PIANOBARISTE™ — PRESTATIONS MUSICALES LIVE                          */}
      {/* ========================================================================= */}
      <Section tone="dark" id="le-pianobariste">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Reveal>
            <ChapterMark num="01" label="Le Pianobariste™ · Prestations Musicales" />
            <Display size="lg" className="mt-6">
              Piano-bar live & musique d’atmosphère pour événements de prestige
            </Display>
            <Lead className="mt-5">
              Depuis 2007, Hervé Nanfang façonne sous la signature <strong className="text-ivory">Le Pianobariste™</strong>{' '}
              une présence musicale cousue main pour les grands hôtels, réceptions diplomatiques, soirées
              corporate, mariages et événements privés au Cameroun (Yaoundé, Douala) et à l’international.
            </Lead>

            <div className="mt-8 grid grid-cols-3 gap-4 border-y border-white/10 py-5">
              <Stat value="2007" label="Scène piano-bar" />
              <Stat value="440+" label="Titres au répertoire" />
              <Stat value="Solo → Band" label="Formules sur mesure" />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn
                to="/contact?sujet=booking#booking"
                variant="gold"
                onClick={() => trackCtaClick('section_pianobar_booking', 'booking', 'home_pianobar')}
              >
                Réserver une prestation
              </Btn>
              <Btn to="/musique" variant="ghost">
                Explorer l’univers musical & répertoire
              </Btn>
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
                  <ArrowLink to={f.to}>Demander un devis pour ce format</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Extraits vidéo live intégrés */}
        <div className="mt-14">
          <HomeFeaturedVideos />
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 3. A LAIZ ACADEMY — FORMATION MUSICALE, PIANO & MAO                       */}
      {/* ========================================================================= */}
      <Section tone="ink" id="a-laiz-academy">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <Reveal>
            <ChapterMark num="02" label="A Laiz Academy · Formation & Pédagogie" />
            <Display size="lg" className="mt-6">
              Apprendre la musique, le piano et la MAO avec une méthode structurée
            </Display>
          </Reveal>
          <Reveal delay={100}>
            <Lead>
              Fondée par Hervé Nanfang, <strong className="text-ivory">A Laiz Academy</strong> (anciennement
              Racines Musicales Academy — RMA) forme les enfants, adultes, musiciens et professionnels aux
              pratiques instrumentales et aux technologies du son, à Yaoundé et à distance.
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
              <Eyebrow>Inscriptions & Partenariats Académiques</Eyebrow>
              <h3 className="mt-2 font-display text-2xl text-ivory">
                Vous souhaitez suivre un cursus ou organiser une formation dans votre établissement ?
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-ivory/65">
                Cours individuels, ateliers collectifs, séminaires MAO ou conception de curricula pour écoles
                supérieures et conservatoires.
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
      {/* 4. CONFÉRENCES & INTERVENTIONS INSTITUTIONNELLES                          */}
      {/* ========================================================================= */}
      <Section tone="dark" id="conferences">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <ChapterMark num="03" label="Conférences · Masterclasses · Séminaires" />
            <Display size="lg" className="mt-6 max-w-3xl">
              Des interventions de référence pour universités, écoles et institutions
            </Display>
            <Lead className="mt-4 max-w-2xl">
              Six conférences et masterclasses alliant démonstrations musicales en direct, musicologie
              africaine et décryptage méthodologique de l’intelligence artificielle.
            </Lead>
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
                Voir les 6 fiches détaillées
              </Btn>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CONFERENCES.map((conf, i) => (
            <Reveal key={conf.id} delay={i * 70}>
              <Card className="flex h-full flex-col justify-between border-white/10 bg-ink p-7 transition-colors hover:border-gold/50">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <Eyebrow>{conf.theme}</Eyebrow>
                    <span className="font-mono text-[0.62rem] uppercase tracking-wider text-ivory/65">
                      {conf.duration}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-xl leading-snug text-ivory">
                    « {conf.title} »
                  </h3>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/65 line-clamp-3">
                    {conf.pitch}
                  </p>
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-3">
                  <span className="text-[0.65rem] uppercase tracking-wider text-ivory/65">
                    {conf.formats.join(' · ')}
                  </span>
                  <Link
                    to="/conferences#themes"
                    className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-2"
                  >
                    Fiche →
                  </Link>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* 5. MUSICIEN AUGMENTÉ™ — INNOVATION, IA & CONSEIL STRATÉGIQUE              */}
      {/* ========================================================================= */}
      <Section tone="ink" id="musicien-augmente">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <ChapterMark num="04" label="Musicien Augmenté™ · Innovation, IA & Conseil" />
            <Display size="lg" className="mt-6">
              L’intelligence artificielle ne doit pas remplacer le musicien. Elle doit l’augmenter.
            </Display>
            <Lead className="mt-5">
              Formalisé par Hervé Nanfang, le cadre <strong className="text-ivory">Musicien Augmenté™</strong>{' '}
              accompagne les artistes, studios, écoles et organisations culturelles dans l’intégration
              éthique, lucide et souveraine des outils génératifs et de la MAO.
            </Lead>
            <Body className="mt-4">
              Qu’il s’agisse d’ingénierie sonore, de direction artistique, d’architecture de marque culturelle
              ou d’automatisation éditoriale, la technologie reste au service de l’écoute humaine et de
              l’identité du créateur.
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
                Découvrir Musicien Augmenté™
              </Btn>
              <ArrowLink to="/services">Tous les services & conseil</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-5 sm:grid-cols-2">
              {IA_DOMAINS.map((domain) => (
                <div
                  key={domain.title}
                  className="border border-white/10 bg-ink-2 p-6 transition-colors hover:border-gold/40"
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
      </Section>

      {/* ========================================================================= */}
      {/* 6. LE JOURNAL — CENTRE D'AUTORITÉ MUSICOLOGIQUE & ÉDITORIALE              */}
      {/* ========================================================================= */}
      <Section tone="dark" id="journal">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal>
            <ChapterMark num="05" label="Le Journal · Recherche & Pensée" />
            <Display size="lg" className="mt-6 max-w-3xl">
              Musicologie africaine, piano-bar, pédagogie et intelligence artificielle
            </Display>
            <Lead className="mt-4 max-w-2xl">
              Essais de fond, analyses de terrain et chroniques publiés par Hervé Nanfang pour documenter
              les mutations de la création musicale contemporaine.
            </Lead>
          </Reveal>
          <Reveal delay={100}>
            <div className="flex flex-wrap gap-3 shrink-0">
              <Btn to="/journal" variant="gold">
                Explorer tout le Journal
              </Btn>
              <Btn to="/culture-recherche" variant="ghost">
                Axes de recherche
              </Btn>
              <Btn to="/projets" variant="ghost">
                Projets A Laiz Ô Pays
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
                className="group relative flex h-full flex-col justify-between overflow-hidden border border-gold/40 bg-ink p-7 transition-all duration-500 hover:border-gold sm:p-10"
              >
                <div className="relative mb-6 aspect-[16/9] w-full overflow-hidden border border-white/10 bg-ink-2">
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
                  className="group flex flex-col justify-between border border-white/10 bg-ink p-5 transition-all duration-300 hover:border-gold/50 hover:bg-ink-2/90 sm:flex-row sm:items-center gap-4"
                >
                  <div className="h-20 w-full sm:w-28 shrink-0 overflow-hidden border border-white/10 bg-ink-2">
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
        eyebrow="Booking · Formation · Conférences · Conseil IA"
        title="Construisons votre prochain événement, programme de formation ou projet musical."
        text="Prestation piano-bar live Le Pianobariste™, formation A Laiz Academy, conférence institutionnelle ou accompagnement Musicien Augmenté™ : réponse détaillée sous 48 h."
        primary={{ label: 'Prendre contact', to: '/contact' }}
        secondary={{ label: 'Découvrir les services', to: '/services' }}
      />
    </>
  )
}
