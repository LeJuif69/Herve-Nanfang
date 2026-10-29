import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import liveScene from '../assets/live-scene-piano.jpeg'
import monogram from '../assets/hn-monogram-watermark.jpg'
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
  Reveal,
  Rule,
  Section,
  Stat,
  Tag,
} from '../components/ui'
import { PILLARS } from '../data/site'
import { IDENTITY, MASTER_IDENTITY } from '../data/identity'
import { PROJECT_FAMILIES } from '../data/projects'
import { personSchema, websiteSchema, organizationSchema, musicGroupSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import { useLiveArticles, useLiveMedia } from '../lib/useLiveContent'
import type { AdminArticle } from '../lib/admin-types'

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
  { title: 'IA pour la musique', items: ['Composition', 'Arrangement', 'Analyse', 'Idéation', 'Production', 'Recherche'] },
  { title: 'IA pour le pédagogue', items: ['Conception de cours', 'Curricula', 'Supports', 'Évaluation', 'Recherche'] },
  { title: 'IA pour le professionnel', items: ['Automatisation', 'Organisation', 'Recherche', 'Productivité', 'Contenus'] },
  { title: 'IA & communication', items: ['Stratégie éditoriale', 'Storytelling', 'Réseaux sociaux', 'Personal branding', 'Marketing'] },
]

const CREATIVE_CONCEPTS = [
  {
    num: '01',
    name: 'Le Pianobariste',
    trademark: 'Marque artistique & scène live',
    badge: 'Depuis 2007',
    lead: 'Scène de prestige, présence d’atmosphère et répertoires internationaux.',
    description:
      'Identité scénique d’Hervé Nanfang dédiée aux performances live au piano (jazz, blues, variété, musiques africaines). Le piano-bar est son laboratoire de terrain depuis 2007 : réactivité en temps réel, endurance scénique et capacité à faire vibrer une salle entière.',
    link: '/services#piano-bar',
    linkLabel: 'Découvrir Le Pianobariste',
  },
  {
    num: '02',
    name: 'Musicien Augmenté™',
    trademark: 'Concept doctrinal & méthode IA',
    badge: 'Formalisé 2024–2026',
    lead: 'L’intelligence artificielle au service du geste artistique souverain.',
    description:
      'Cadre théorique et méthodologique développé par Hervé Nanfang pour articuler création musicale, MAO et technologies génératives. Fondé sur le manifeste des quatre verbes (Créer · Transmettre · Augmenter · Développer), il affirme la primauté de l’oreille critique et de l’identité culturelle.',
    link: '/ia-technologie#musicien-augmente',
    linkLabel: 'Explorer le manifeste',
  },
  {
    num: '03',
    name: 'Le Permis de Jouer™',
    trademark: 'Système pédagogique propriétaire',
    badge: 'Niveaux N1 à N4',
    lead: 'Autonomie instrumentale immédiate et accompagnement au clavier.',
    description:
      'Méthode structurée conçue pour adultes et apprentis musiciens, articulée en quatre niveaux modulaires. Elle remplace l’abstraction du solfège rébarbatif par une progression pragmatique axée sur les grilles d’accords, l’harmonie pratique et l’accompagnement du chant.',
    link: '/pedagogie#permis-de-jouer',
    linkLabel: 'Consulter la méthode',
  },
  {
    num: '04',
    name: 'Racines Musicales Academy® (RMA)',
    trademark: 'Académie & ingénierie de formation',
    badge: 'Enseignement certifié',
    lead: 'Transmission vivante et valorisation des patrimoines d’Afrique.',
    description:
      'Organisation d’enseignement musical et de formation MAO fondée par Hervé Nanfang. La RMA forme les musiciens et éducateurs aux technologies contemporaines tout en documentant les polyrythmies et répertoires traditionnels oraux d’Afrique centrale.',
    link: '/rma',
    linkLabel: 'Découvrir la RMA',
  },
  {
    num: '05',
    name: 'A Laiz Ô Pays',
    trademark: 'Concept artistique & culturel fondateur',
    badge: 'Univers créatif',
    lead: 'Le concept fondateur qui relie création, transmission, patrimoine et innovation.',
    description:
      'A Laiz Ô Pays est le concept artistique et culturel fondateur de Hervé Nanfang. Il fédère son univers créatif et les projets qui s’y rattachent, de la musique (Alaiz Music) à la transmission, en passant par la valorisation patrimoniale (Alaiz Patrimoine) et l’exploration des technologies.',
    link: '/projets',
    linkLabel: 'Explorer l’univers A Laiz Ô Pays',
  },
]

/**
 * Résolution intelligente de l'image de couverture d'un article
 */
function getArticleCover(article: AdminArticle): string {
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

/**
 * Fonds d'écran des 4 piliers — un univers par verbe.
 * Photos assombries + motif CSS + chiffre fantôme ; le voile (JSX)
 * garantit la lisibilité. Alternance photo / motif pour le rythme.
 */
const PILLAR_BG: { img?: string; motif?: string; position?: string }[] = [
  { img: '/images/hero-duo-live.webp', position: 'object-center' }, // Créer — duo live, piano & voix
  { motif: 'motif-staff' }, // Transmettre — portée musicale
  { img: monogram, motif: 'motif-circuit', position: 'object-center' }, // Augmenter — monogramme or + circuit
  { motif: 'motif-growth' }, // Développer — constellation & croissance
]

const ROLES = [
  'Artiste-Musicien · Le Pianobariste',
  'Musicologue · Pédagogue',
  'Ingénieur du Son · Producteur',
  'Musicien Augmenté™ · IA & Innovation',
]

export default function Home() {
  const { openPlayer } = useAudio()
  const [roleIndex, setRoleIndex] = useState(0)
  const livePianoMedia = useLiveMedia('med-live-piano', liveScene, 50, 20)
  const liveArticles = useLiveArticles()

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
    jsonLd: [personSchema, websiteSchema, organizationSchema, musicGroupSchema],
  })

  return (
    <>
      {/* ============================ HERO ============================ */}
      <section className="home-hero relative isolate overflow-hidden bg-ink">
        <img
          src={liveScene}
          alt="Hervé Nanfang au piano avec Flavie au chant lors d’une prestation live."
          width={1600}
          height={900}
          loading="eager"
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

        <Container className="relative z-10 flex min-h-[min(54rem,100svh)] items-end pb-16 pt-36 md:items-end md:pb-20 md:pt-40">
          <div className="max-w-4xl">
            <Reveal>
              <div className="mb-6 flex flex-wrap items-center gap-3 sm:gap-4 md:gap-5">
                {/* Écrin de prestige pour le monogramme des initiales HN */}
                <div className="group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-gold/50 bg-gradient-to-br from-gold/15 via-ink-2 to-black p-2.5 shadow-[0_0_35px_rgba(198,161,91,0.3)] ring-1 ring-gold/25 backdrop-blur-md transition-all duration-500 hover:scale-105 hover:border-gold hover:shadow-[0_0_50px_rgba(198,161,91,0.55)] md:h-24 md:w-24 md:p-3">
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.22),transparent_70%)]"
                  />
                  <img
                    src="/hn-initials-mark.png"
                    alt="Monogramme HN — Hervé Nanfang"
                    width={112}
                    height={112}
                    loading="eager"
                    className="relative z-10 h-full w-full object-contain drop-shadow-[0_0_12px_rgba(198,161,91,0.4)] transition-transform duration-500 group-hover:scale-105"
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
              <h1 className="home-hero__title mt-0 max-w-4xl text-5xl leading-[0.9] tracking-[-0.04em] text-ivory sm:text-7xl lg:text-[6.5rem]">
                {MASTER_IDENTITY.identite.nom}
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p className="mt-7 max-w-2xl font-display text-2xl leading-snug text-ivory sm:text-3xl">
                La musique comme création, transmission et transformation.
              </p>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/75 md:text-base">
                {MASTER_IDENTITY.positionnement.accrocheAccueil}
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Btn to="/a-propos" variant="gold">
                  Découvrir mon parcours
                </Btn>
                <Btn to="/projets" variant="ghost">
                  Explorer mes projets
                </Btn>
                <button
                  type="button"
                  onClick={openPlayer}
                  aria-label="Ouvrir la Scène Sonore et écouter les extraits musicaux"
                  className="btn btn-ghost inline-flex items-center gap-2 border-gold/40 text-gold hover:border-gold hover:bg-gold/10 hover:text-gold-2"
                >
                  <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                  <span>La Scène Sonore ♫</span>
                </button>
              </div>
              <a
                href="#socle"
                aria-label="Défiler vers les quatre piliers"
                className="mt-12 inline-flex items-center gap-3 text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-ivory/45 transition-colors hover:text-gold"
              >
                Défiler
                <span aria-hidden className="inline-block h-8 w-px bg-gradient-to-b from-gold/70 to-transparent" />
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <Section tone="ivory" className="home-manifest relative overflow-hidden">
        <div className="home-manifest__backdrop absolute inset-0 opacity-80" aria-hidden />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <Reveal>
            <Eyebrow tone="ink">Signature artistique</Eyebrow>
            <Display size="lg" className="mt-6 text-ink">
              Créer. Transmettre. Augmenter. Développer.
            </Display>
          </Reveal>
          <Reveal delay={120}>
            <Body className="max-w-xl text-ink/75">
              Hervé Nanfang unit la pratique musicale, la musicologie, l’enseignement, la culture numérique et la création d’initiatives durables. Son travail articule la scène, la recherche et l’innovation pour faire de la musique un espace vivant d’identité, de transmission et de transformation.
            </Body>
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" className="home-live">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <figure className="home-live__collage relative overflow-hidden rounded-[1.75rem] border border-white/8 bg-ink-2">
              <img
                src="/images/showcase-herve-nanfang-mikelang.webp"
                alt="Hervé Nanfang au clavier Yamaha Genos 2 en live — Scène et présence artistique"
                width={2048}
                height={1143}
                loading="lazy"
                onError={(e) => {
                  if (!e.currentTarget.src.includes('/images/shooting-septembre-matin-727.webp')) {
                    e.currentTarget.src = '/images/shooting-septembre-matin-727.webp'
                  }
                }}
                className="zoomable h-[540px] w-full object-cover object-[50%_38%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent" />
              <figcaption className="absolute bottom-0 left-0 right-0 flex justify-between gap-4 border-t border-white/10 bg-ink/60 px-5 py-4 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/70 backdrop-blur-sm">
                <span>Hervé Nanfang</span>
                <span>Scène & Présence · Yamaha Genos 2</span>
              </figcaption>
            </figure>
          </Reveal>
          <Reveal delay={120}>
            <Eyebrow>Live · piano-bar · performances</Eyebrow>
            <Display size="lg" className="mt-6 text-ivory">
              Une présence qui prend la salle entière.
            </Display>
            <Body className="mt-6 max-w-xl text-ivory/70">
              Du piano-bar aux événements professionnels, la scène est le laboratoire de sa pratique : répertoire, présence, improvisation, intensité, écoute, et capacité à faire vibrer un public réel.
            </Body>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {['Mariages', 'Restaurants', 'Concerts', 'Événements privés', 'Shows publics', 'Événements pro'].map((item) => (
                <div key={item} className="rounded-full border border-gold/25 bg-gold/5 px-4 py-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold/80">
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ArrowLink to="/musique">Découvrir la scène</ArrowLink>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ====================== BANDEAU DISCIPLINES ====================== */}
      <div className="border-y border-white/8 bg-ink-2">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 py-7">
          {DISCIPLINES.map((d, i) => (
            <span key={d} className="flex items-center gap-8">
              <span className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-ivory/50">
                {d}
              </span>
              {i < DISCIPLINES.length - 1 && <span aria-hidden className="hidden h-1 w-1 bg-gold/60 sm:block" />}
            </span>
          ))}
        </Container>
      </div>

      {/* ======================= QUATRE DIMENSIONS ======================= */}
      <Section id="socle">
        <Reveal>
          <ChapterMark num="01" label="Le socle" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <Display size="lg">
              Quatre dimensions,
              <br />
              une seule trajectoire.
            </Display>
            <Body className="lg:pb-3">
              Quatre mouvements, une même trajectoire. Créer des œuvres et des expériences sonores,
              transmettre des savoirs structurés, augmenter la pratique par l'IA et développer des projets durables : chacune de ces
              étapes découle de la précédente et nourrit la suivante.
            </Body>
          </div>
        </Reveal>

        <div className="mt-16 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {PILLARS.map((p, i) => (
            <Reveal key={p.verb} delay={i * 120}>
              <Link
                to={p.to}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect()
                  e.currentTarget.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`)
                  e.currentTarget.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`)
                }}
                className="pillar-card spotlight-card group flex h-full flex-col bg-ink transition-colors duration-500 hover:bg-ink-2"
              >
                {PILLAR_BG[i].img && (
                  <img
                    src={PILLAR_BG[i].img}
                    alt=""
                    aria-hidden="true"
                    width={800}
                    height={1000}
                    loading="lazy"
                    decoding="async"
                    className={`absolute inset-0 h-full w-full object-cover ${PILLAR_BG[i].position ?? 'object-center'} opacity-25 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-35`}
                  />
                )}
                {PILLAR_BG[i].motif && (
                  <div aria-hidden="true" className={`absolute inset-0 ${PILLAR_BG[i].motif} opacity-70`} />
                )}
                {i === 0 && (
                  <div aria-hidden="true" className="keys-bg absolute inset-x-0 bottom-0 h-20 opacity-25" />
                )}
                <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink via-ink/80 to-ink/40" />
                <span aria-hidden="true" className="pillar-ghost">{p.index}</span>
                <div className="relative flex h-full flex-col px-8 py-12">
                  <span className="font-display text-xl text-gold/70">{p.index}</span>
                  <h3 className="text-gradient-gold mt-6 font-display text-4xl">
                    {p.verb}
                  </h3>
                  <p className="mt-4 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-gold/70">
                    {p.keywords}
                  </p>
                  <p className="mt-6 flex-1 text-[15px] leading-[1.8] text-ivory/60">{p.text}</p>
                  <span className="mt-8 inline-flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory/45 transition-colors group-hover:text-gold">
                    Entrer <span aria-hidden>→</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ==================== TRAJECTOIRE INTELLECTUELLE ==================== */}
      <Section tone="ink" id="trajectoire">
        <Reveal>
          <ChapterMark num="02" label="La trajectoire" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <Display size="lg">
              Une seule trajectoire,
              <br />
              du clavier à l’innovation
            </Display>
            <Body className="lg:pb-3">{MASTER_IDENTITY.positionnement.these}</Body>
          </div>
        </Reveal>

        <ol className="mt-16 border-t border-white/10">
          {MASTER_IDENTITY.trajectoire.map((step, i) => (
            <Reveal key={step.etape} delay={i * 60}>
              <li className="border-b border-white/8">
                <Link
                  to={step.to}
                  className="group grid gap-4 py-7 transition-colors hover:bg-ink-3/60 md:grid-cols-[4rem_13rem_1fr] md:gap-8 md:px-4"
                >
                  <span className="font-display text-2xl text-gold/60">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl leading-snug text-ivory transition-colors group-hover:text-gold-2 md:text-[1.75rem]">
                      {step.etape}
                    </h3>
                    <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-gold/70">
                      {step.resume}
                    </p>
                  </div>
                  <div className="flex items-start justify-between gap-6">
                    <p className="max-w-2xl text-sm leading-relaxed text-ivory/55">{step.apport}</p>
                    <span
                      aria-hidden
                      className="mt-1 shrink-0 text-gold/50 transition-transform group-hover:translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={140}>
          <p className="mt-10 max-w-3xl border-l-2 border-gold/40 pl-6 font-display text-xl leading-snug text-ivory/85 md:text-2xl">
            Chaque étape a été rendue possible par la précédente — et c’est cet enchaînement, non une
            somme de compétences, qui constitue aujourd’hui ma valeur professionnelle.
          </p>
        </Reveal>
      </Section>

      {/* ==================== QUI EST HERVÉ NANFANG ? ==================== */}
      <Section tone="light">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <Reveal>
            <figure className="relative">
              <img
                src="/images/herve-nanfang-portrait-officiel.webp"
                alt="Portrait officiel d’Hervé Nanfang — musicien, musicologue, pédagogue et spécialiste de l’IA appliquée à la musique"
                width={760}
                height={1353}
                loading="lazy"
                onError={(e) => {
                  if (!e.currentTarget.src.includes('/images/portrait.webp')) {
                    e.currentTarget.src = '/images/portrait.webp'
                  }
                }}
                className="zoomable w-full object-cover"
              />
              <div
                aria-hidden
                className="absolute -bottom-4 -right-4 h-24 w-24 border-b border-r border-ink/30"
              />
              <figcaption className="mt-4 text-[0.68rem] uppercase tracking-[0.2em] text-ink/45">
                Portrait officiel · Yaoundé, Cameroun
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow tone="ink">Qui est Hervé Nanfang ?</Eyebrow>
            <Display size="lg" className="mt-6 text-ink">
              Un parcours à la croisée de plusieurs mondes
            </Display>
            <div className="mt-8 space-y-6 text-[15px] leading-[1.9] text-ink/75 md:text-base">
              <p>
                Musicien, musicologue, pédagogue, ingénieur du son et entrepreneur culturel, Hervé
                Nanfang développe depuis plusieurs années une pratique professionnelle située à la
                rencontre de l’art, de la technologie et de la transmission.
              </p>
              <p>
                Son parcours l’a conduit de la scène musicale à la production sonore, de
                l’enseignement à la conception de programmes pédagogiques, puis progressivement vers
                l’intelligence artificielle, la communication digitale et les nouveaux modèles de
                création.
              </p>
              <p className="text-ink">
                Aujourd’hui, il développe une vision dans laquelle la technologie ne remplace pas
                l’humain : elle augmente ses capacités.
              </p>
            </div>
            <div className="mt-10">
              <Link
                to="/a-propos"
                className="group inline-flex items-center gap-3 border-b border-ink pb-1 text-[0.72rem] font-bold uppercase tracking-[0.22em] text-ink transition-colors hover:border-gold hover:text-gold-3"
              >
                Lire mon parcours
                <span aria-hidden className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Triptyque photographique documentaire — Google Images & Présence */}
        <div className="mt-14 border-t border-ink/10 pt-12">
          <Reveal>
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Eyebrow tone="ink">Repères visuels officiels</Eyebrow>
                <h3 className="mt-2 font-display text-2xl text-ink md:text-3xl">
                  L’identité en trois situations réelles
                </h3>
              </div>
              <p className="max-w-md text-xs leading-relaxed text-ink/60">
                Photographies authentiques documentant l’identité professionnelle, la pratique de la scène live et la transmission pédagogique en enseignement supérieur.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Photo 1 — Portrait officiel */}
              <figure className="group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                  <img
                    src="/images/herve-nanfang-portrait-officiel.webp"
                    alt="Hervé Nanfang — Portrait officiel de l’artiste-musicien, musicologue et pédagogue"
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="zoomable h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-4">
                  <p className="font-display text-base text-ink">01 · Portrait officiel</p>
                  <p className="mt-1 text-xs text-ink/65">
                    Identité de référence, direction artistique et recherche.
                  </p>
                </figcaption>
              </figure>

              {/* Photo 2 — Hervé Nanfang au clavier */}
              <figure className="group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                  <img
                    src="/images/herve-nanfang-piano-bar-live.jpeg"
                    alt="Hervé Nanfang au clavier lors d’une prestation piano-bar live"
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="zoomable h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-4">
                  <p className="font-display text-base text-ink">02 · Hervé Nanfang au clavier</p>
                  <p className="mt-1 text-xs text-ink/65">
                    Scène live, répertoires jazz, afropop et piano-bar depuis 2007.
                  </p>
                </figcaption>
              </figure>

              {/* Photo 3 — Studio & transmission */}
              <figure className="group overflow-hidden rounded-xl border border-ink/10 bg-white shadow-sm transition-all hover:shadow-md">
                <div className="relative aspect-[4/5] overflow-hidden bg-ink/5">
                  <img
                    src="/images/herve-nanfang-studio-transmission-isma.webp"
                    alt="Hervé Nanfang en session de transmission pédagogique et atelier MAO à l’ISMA"
                    width={800}
                    height={1000}
                    loading="lazy"
                    className="zoomable h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <figcaption className="p-4">
                  <p className="font-display text-base text-ink">03 · Transmission & Studio</p>
                  <p className="mt-1 text-xs text-ink/65">
                    Ingénierie sonore, masterclasses et formation en enseignement supérieur.
                  </p>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* =========================== MUSIQUE =========================== */}
      <Section tone="dark">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <ChapterMark num="03" label="Créer" />
            <Display size="lg" className="mt-7">
              La musique comme langage, métier et expérience
            </Display>
            <Body className="mt-7 max-w-xl">
              Depuis 2007, la scène — d’abord le piano-bar — est mon laboratoire. C’est là que la
              musique cesse d’être un savoir pour devenir une présence : jazz, blues, variété,
              musiques africaines et standards, joués pour des publics réels.
            </Body>
            <ul className="mt-9 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {['Piano-Bar Live', 'Composition & Arrangement', 'Production musicale', 'Ingénierie du son', 'Musique à l’image', 'Spectacle vivant'].map(
                (item) => (
                  <li key={item} className="flex items-baseline gap-3 text-sm text-ivory/70">
                    <span aria-hidden className="h-1 w-1 shrink-0 translate-y-[-3px] bg-gold" />
                    {item}
                  </li>
                ),
              )}
            </ul>
            <div className="mt-10">
              <ArrowLink to="/musique">Découvrir l’univers musical</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative overflow-hidden">
              <img
                src={livePianoMedia.url || liveScene}
                alt={livePianoMedia.alt || "Hervé Nanfang au clavier en prestation live — visage visible"}
                width={1400}
                height={783}
                loading="lazy"
                style={livePianoMedia.style}
                onError={(e) => {
                  if (!e.currentTarget.src.includes('/images/live-scene-piano.jpeg')) {
                    e.currentTarget.src = '/images/live-scene-piano.jpeg'
                  }
                }}
                className="zoomable w-full object-cover"
              />
              <figcaption className="absolute bottom-0 left-0 bg-ink/85 px-5 py-3 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/70 backdrop-blur">
                Live piano · Live mood · Live experience
              </figcaption>
            </figure>
            <div className="mt-8 grid grid-cols-2 gap-6">
              <Stat value="2007" label="Depuis" />
              <Stat value="∞" label="Répertoire ouvert" />
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ====================== IA & TECHNOLOGIE ====================== */}
      <Section tone="ink" id="ia">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <ChapterMark num="04" label="Augmenter — section stratégique" />
              <Display size="lg" className="mt-7">
                Musicien <span className="text-gold">+</span> IA
              </Display>
              <p className="mt-6 font-display text-2xl leading-snug text-gold md:text-3xl">
                L’intelligence artificielle ne doit pas remplacer le musicien. Elle doit l’augmenter.
              </p>
            </div>
            <Body className="lg:pb-2">
              Après avoir vécu la transformation de la musique par la MAO, j’explore aujourd’hui une
              nouvelle transformation : celle de l’intelligence artificielle. Mon approche consiste à
              créer un pont entre les pratiques musicales humaines et les possibilités offertes par
              les technologies génératives.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-4">
          {IA_DOMAINS.map((domain, i) => (
            <Reveal key={domain.title} delay={i * 90}>
              <div className="h-full bg-ink-2 p-7">
                <h3 className="font-display text-2xl text-ivory">{domain.title}</h3>
                <Rule className="opacity-40" />
                <ul className="mt-4 space-y-2">
                  {domain.items.map((item) => (
                    <li key={item} className="text-sm text-ivory/60">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Btn to="/ia-technologie#musicien-augmente" variant="gold">
              Explorer Musicien Augmenté™
            </Btn>
            <Link
              to="/conferences"
              className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ivory/60 hover:text-gold"
            >
              Conférence « Le musicien augmenté » →
            </Link>
          </div>
        </Reveal>
      </Section>

      {/* ========================== PÉDAGOGIE ========================== */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="05" label="Transmettre" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Display size="lg">Transmettre autrement</Display>
            <Body className="lg:pb-2">
              Enseigner la musique, ce n’est pas transmettre un contenu : c’est construire un
              parcours. J’interviens dans l’enseignement supérieur, je conçois des curricula et des
              méthodes, et je développe des systèmes qui rendent la progression lisible.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              title: 'Enseignement supérieur',
              text: 'ESAS (Lomé) · ISMA (Bénin) · IBA Nkongsamba · IFCPA/CRTV — transmission académique et formation.',
            },
            {
              title: 'Conception pédagogique',
              text: 'MAO, musicologie appliquée, composition pour l’image, ingénierie de curricula et évaluation.',
            },
            {
              title: 'Systèmes & publications',
              text: 'Racines Musicales Academy® (RMA), Permis de Jouer™ (N1 à N4) et manuel LES ZIKOS®.',
            },
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 110}>
              <Card className="h-full">
                <h3 className="font-display text-2xl text-ivory">{item.title}</h3>
                <Body className="mt-4">{item.text}</Body>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={160}>
          <div className="mt-12">
            <ArrowLink to="/pedagogie">Découvrir mon approche pédagogique</ArrowLink>
          </div>
        </Reveal>
      </Section>

      {/* ===================== CULTURE & RECHERCHE ===================== */}
      <Section tone="ink" tight>
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <ChapterMark num="06" label="Culture & Recherche" />
            <Display size="md" className="mt-6">
              Comprendre la musique, c’est aussi comprendre ceux qui la portent.
            </Display>
            <Body className="mt-6">
              Musicologie, cultures africaines, patrimoine, transmission orale : documenter les
              pratiques musicales et les faire dialoguer avec le présent technologique.
            </Body>
            <div className="mt-8">
              <ArrowLink to="/culture-recherche">Explorer la recherche</ArrowLink>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex flex-wrap gap-3">
              {['Musicologie', 'Cultures africaines', 'Patrimoine', 'Transmission orale', 'Batoufam', 'Tswefap', 'Écriture', 'Documentation'].map(
                (tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ),
              )}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* =========================== PROJETS =========================== */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="07" label="Développer" />
          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-end">
            <Display size="lg">
              Des projets pensés
              <br />
              comme des structures
            </Display>
            <Body className="lg:pb-2">
              Chaque initiative est développée comme une entité autonome, capable de produire et de
              durer — artistique, pédagogique, technologique, culturelle ou entrepreneuriale.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {PROJECT_FAMILIES.map((family, i) => (
            <Reveal key={family.id} delay={i * 80}>
              <Card className="h-full">
                <p className="eyebrow text-gold">{family.label}</p>
                <Rule className="opacity-40" />
                <p className="mt-4 text-sm leading-relaxed text-ivory/55">{family.intro}</p>
                <ul className="mt-6 space-y-3">
                  {family.projects.map((p) => (
                    <li key={p.title} className="flex items-baseline justify-between gap-4">
                      <span className="text-[15px] text-ivory/85">{p.title}</span>
                      <span className="shrink-0 text-[0.62rem] uppercase tracking-[0.18em] text-ivory/35">
                        {p.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={140}>
          <div className="mt-12">
            <ArrowLink to="/projets">Voir tous les projets</ArrowLink>
          </div>
        </Reveal>
      </Section>

      {/* ============= CONCEPTS, MÉTHODES ET IDENTITÉS CRÉATIVES ============= */}
      <Section tone="ink" id="concepts-identites" className="border-t border-white/8">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <ChapterMark num="08" label="Paternité intellectuelle & Concepts" />
              <Display size="lg" className="mt-7">
                Concepts, méthodes & identités créatives
              </Display>
              <p className="mt-6 font-display text-xl leading-snug text-gold md:text-2xl">
                Concepts et créations de Hervé Nanfang
              </p>
            </div>
            <Body className="lg:pb-2">
              Mon parcours artistique, musicologique et pédagogique s’articule autour de plusieurs identités,
              méthodes et concepts créatifs fondateurs, notamment Le Pianobariste, Musicien Augmenté™, Permis de Jouer™
              et A Laiz Ô Pays. Cette rubrique documente leur signification, leur antériorité d'usage et les éléments
              disponibles permettant d’en retracer l’évolution.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {CREATIVE_CONCEPTS.map((concept, i) => (
            <Reveal key={concept.name} delay={i * 90} className={i === 4 ? 'md:col-span-2 lg:col-span-1' : ''}>
              <Card className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-display text-lg text-gold/60">{concept.num}</span>
                    <span className="rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.18em] text-gold">
                      {concept.badge}
                    </span>
                  </div>
                  <h3 className="mt-5 font-display text-2xl text-ivory md:text-[1.7rem]">{concept.name}</h3>
                  <p className="mt-1 text-[0.66rem] uppercase tracking-[0.16em] text-gold/75">
                    {concept.trademark}
                  </p>
                  <Rule className="my-5 opacity-30" />
                  <p className="font-medium text-[0.92rem] leading-snug text-ivory/90">{concept.lead}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/60">{concept.description}</p>
                </div>
                <div className="mt-8 border-t border-white/6 pt-5">
                  <ArrowLink to={concept.link}>{concept.linkLabel}</ArrowLink>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={180}>
          <div className="mt-14 rounded-2xl border border-white/10 bg-ink-3/50 p-6 md:p-8 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-gold/80">Protection intellectuelle & Ancrage juridique</p>
                <p className="mt-2 text-xs leading-relaxed text-ivory/65 md:text-sm">
                  Ces concepts doctrinaux, méthodes pédagogiques et marques d'usage sont créés, documentés et déployés
                  par Hervé Nanfang dans le cadre de ses activités professionnelles. Toute exploitation commerciale,
                  reproduction ou reprise non autorisée relève de la législation sur la propriété littéraire, artistique
                  et industrielle (OAPI / MINAC / Accord de Bangui révisé).
                </p>
              </div>
              <div className="shrink-0">
                <Btn to="/mentions-legales" variant="ghost" className="text-xs">
                  Mentions légales
                </Btn>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* =========================== JOURNAL =========================== */}
      <Section tone="ink">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <div>
              <ChapterMark num="09" label="Journal" />
              <Display size="lg" className="mt-7">
                Le Journal du Musicien Augmenté
              </Display>
            </div>
            <Body className="lg:pb-2">
              Série éditoriale sur la musique à l’ère des technologies génératives : analyses,
              méthodes et prises de position. Les piliers sont publiés progressivement après
              validation éditoriale.
            </Body>
          </div>
        </Reveal>

        {/* Grande Carte Visuelle « À la une » */}
        {(() => {
          const publishedArticles = liveArticles.filter((a) => a.status === 'Publié')

          // Tri par priorité éditoriale & récence :
          // 1. Article explicitement marqué isFeatured
          // 2. Date de publication effective (publishedAt)
          // 3. Date de dernière mise à jour (updatedAt)
          // 4. Numéro de pilier décroissant (les piliers récents en premier)
          const sortedArticles = [...publishedArticles].sort((a, b) => {
            if (a.isFeatured && !b.isFeatured) return -1
            if (!a.isFeatured && b.isFeatured) return 1

            const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
            const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
            if (dateA !== dateB) return dateB - dateA

            const updateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
            const updateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
            if (updateA !== updateB) return updateB - updateA

            const numA = parseInt(a.num, 10) || 0
            const numB = parseInt(b.num, 10) || 0
            return numB - numA
          })

          const featuredArticle = sortedArticles[0] || liveArticles[0]
          const recentArticles = sortedArticles.filter((a) => a.slug !== featuredArticle?.slug).slice(0, 4)

          if (!featuredArticle) return null

          return (
            <>
              <Reveal delay={80}>
                <div className="mt-12 group relative overflow-hidden rounded-sm border border-gold/40 bg-gradient-to-br from-ink-2 via-ink to-ink-3 shadow-2xl transition-all duration-500 hover:border-gold hover:shadow-[0_0_50px_rgba(197,168,105,0.18)]">
                  {/* Lueur d'ambiance dorée */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/10 blur-3xl transition-opacity duration-500 group-hover:bg-gold/15"
                  />

                  <div className="grid lg:grid-cols-12 lg:items-stretch">
                    {/* Colonne Média Visuel (5 colonnes) */}
                    <div className="relative isolate min-h-[300px] sm:min-h-[360px] lg:col-span-5 lg:min-h-[440px] overflow-hidden bg-ink-2">
                      <img
                        src={getArticleCover(featuredArticle)}
                        alt={featuredArticle.coverAlt || featuredArticle.title}
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        style={{
                          objectPosition: `${featuredArticle.coverPositionX ?? 50}% ${featuredArticle.coverPositionY ?? 50}%`,
                        }}
                        loading="lazy"
                      />
                      {/* Voile dégradé subtil pour contraste et intégration harmonieuse */}
                      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:via-ink/30 lg:to-ink" />

                      {/* Badge flottant "À la une" */}
                      <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/60 bg-ink/90 backdrop-blur-md px-3.5 py-1 font-mono text-[0.68rem] font-bold text-gold uppercase tracking-widest shadow-lg">
                          <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
                          ✦ À la une · Dernier article paru
                        </span>
                      </div>

                      {/* Badge numéro de pilier en bas de l'image */}
                      <div className="absolute bottom-4 left-4 z-10">
                        <span className="font-mono text-xs uppercase tracking-widest text-gold bg-ink/80 backdrop-blur-sm px-3 py-1 border border-gold/30">
                          Pilier {featuredArticle.num}
                        </span>
                      </div>
                    </div>

                    {/* Colonne Contenu Éditorial (7 colonnes) */}
                    <div className="relative z-10 flex flex-col justify-between p-6 sm:p-8 lg:col-span-7 lg:p-10">
                      <div>
                        {/* Ligne Métadonnées */}
                        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                          <div className="flex items-center gap-2">
                            <Tag tone="gold">{featuredArticle.category}</Tag>
                            <span className="text-[0.7rem] font-mono uppercase tracking-wider text-ivory/50">
                              Lecture {featuredArticle.readingTime}
                            </span>
                          </div>
                          {featuredArticle.publishedAt && (
                            <time className="text-[0.68rem] font-mono text-ivory/40">
                              {new Date(featuredArticle.publishedAt).toLocaleDateString('fr-FR', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </time>
                          )}
                        </div>

                        {/* Titre percutant */}
                        <h3 className="mt-4 font-display text-2xl sm:text-3xl lg:text-[2rem] leading-snug text-ivory">
                          <Link
                            to={`/journal/${featuredArticle.slug}`}
                            className="transition-colors duration-300 hover:text-gold"
                          >
                            {featuredArticle.title}
                          </Link>
                        </h3>

                        {/* Extrait éditorial */}
                        <p className="mt-4 text-sm sm:text-base leading-relaxed text-ivory/70 line-clamp-4">
                          {featuredArticle.excerpt}
                        </p>

                        {/* Public cible */}
                        {featuredArticle.audience && (
                          <div className="mt-5 rounded border border-white/10 bg-white/[0.02] p-3 text-xs text-ivory/60">
                            <span className="font-semibold text-gold/90">Public cible : </span>
                            <span className="line-clamp-2">{featuredArticle.audience}</span>
                          </div>
                        )}
                      </div>

                      {/* Barre d'action basse */}
                      <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                        <Btn to={`/journal/${featuredArticle.slug}`} variant="gold">
                          Lire l’essai complet →
                        </Btn>
                        <span className="text-xs font-mono tracking-wider text-gold/80 italic">
                          Hervé Nanfang · Le Journal du Musicien Augmenté
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Autres articles récents */}
              {recentArticles.length > 0 && (
                <div className="mt-14">
                  <div className="mb-6 flex items-center justify-between">
                    <h4 className="font-mono text-xs uppercase tracking-widest text-ivory/60">
                      Autres piliers & lectures recommandées
                    </h4>
                    <Link
                      to="/journal"
                      className="text-xs font-mono uppercase tracking-wider text-gold hover:underline"
                    >
                      Tous les piliers ({publishedArticles.length}) →
                    </Link>
                  </div>

                  <div className="divide-y divide-white/8 border-y border-white/8">
                    {recentArticles.map((a, i) => (
                      <Reveal key={a.slug} delay={i * 70}>
                        <Link
                          to={`/journal/${a.slug}`}
                          className="group grid gap-4 py-7 md:grid-cols-[6rem_1fr_14rem] md:items-baseline transition-colors hover:bg-white/[0.015] px-2"
                        >
                          <span className="font-display text-lg text-gold/60 group-hover:text-gold transition-colors">
                            Pilier {a.num}
                          </span>
                          <div>
                            <h3 className="font-display text-2xl leading-snug text-ivory transition-colors group-hover:text-gold-2 md:text-[1.7rem]">
                              {a.title}
                            </h3>
                            <p className="mt-2 text-sm text-ivory/50 line-clamp-2">{a.excerpt}</p>
                          </div>
                          <div className="flex flex-col items-start gap-2 md:items-end">
                            <Tag tone={a.status === 'Publié' ? 'gold' : 'ink'}>{a.status}</Tag>
                            <span className="text-[0.65rem] uppercase tracking-[0.2em] text-ivory/40 md:text-right">
                              <span className="text-gold/75 font-medium">Hervé Nanfang</span> · {a.readingTime}
                            </span>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              )}

              <Reveal delay={120}>
                <div className="mt-12 flex flex-wrap items-center gap-6">
                  <Btn to="/journal" variant="ghost">
                    Lire le Journal
                  </Btn>
                  <span className="text-[0.68rem] uppercase tracking-[0.2em] text-ivory/40">
                    {liveArticles.length} piliers éditoriaux · {publishedArticles.length} publiés
                  </span>
                </div>
              </Reveal>
            </>
          )
        })()}
      </Section>

      {/* ========================= CONFÉRENCES ========================= */}
      <Section tone="dark" tight>
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-center">
            <div>
              <Eyebrow>Conférences & Masterclass</Eyebrow>
              <Display size="md" className="mt-6">
                Six thèmes pour les institutions, écoles et organisations
              </Display>
              <Body className="mt-6 max-w-xl">
                « Le musicien augmenté » · « De la MAO à l’IA » · « Enseigner la musique à l’ère de
                l’intelligence artificielle » · « Construire sa carrière musicale à l’ère digitale »
                · « Le musicien comme marque » · « Musique, image et narration (cinéma) ».
              </Body>
            </div>
            <div className="flex flex-wrap gap-4 lg:justify-end">
              <Btn to="/conferences" variant="gold">
                Voir les conférences
              </Btn>
              <Btn to="/contact#conference" variant="ghost">
                Proposer une date
              </Btn>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Parlons de votre projet"
        title="Booking · Formation · Conférence · Collaboration · Presse · Conseil"
        text="Chaque demande mérite un parcours adapté. Choisissez votre motif : je vous réponds avec des éléments concrets, pas une réponse automatique."
        primary={{ label: 'Ouvrir un parcours', to: '/contact' }}
        secondary={{ label: 'Réserver un live', to: '/contact#booking' }}
      />
    </>
  )
}
