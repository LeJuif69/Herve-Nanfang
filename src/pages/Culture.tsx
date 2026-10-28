import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import {
  Body,
  Card,
  ChapterMark,
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
import { JOURNAL_SERIES } from '../data/articles'
import { breadcrumbSchema, creativeWorkSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const AXES = [
  {
    t: 'Musicologie',
    d: 'Analyse des répertoires, des formes et des pratiques : comprendre comment une musique fonctionne, socialement et techniquement.',
  },
  {
    t: 'Cultures africaines',
    d: 'Étude des pratiques musicales du continent dans leur contexte — usages, fonctions, interdits, circulations.',
  },
  {
    t: 'Patrimoine',
    d: 'Valorisation des répertoires menacés et des savoir-faire : inventaire, documentation, médiation.',
  },
  {
    t: 'Transmission orale',
    d: 'Comprendre les mécanismes de la transmission de bouche à oreille et ce que le numérique en préserve ou en détruit.',
  },
  {
    t: 'Territoires',
    d: 'Batoufam, Tswefap et autres terrains : la musique comme marqueur d’identité et de mémoire collective.',
  },
  {
    t: 'Recherche & écriture',
    d: 'Articles, communications, documentation et contributions à une pensée sur la musique et ses transformations.',
  },
]

const TERRAINS = [
  {
    place: 'Tswefap — Batoufam',
    text: "Développement d'un système d'écriture et de documentation linguistique et patrimoniale consacré au Batoufam : constitution de corpus, conventions d'écriture et manuel de référence.",
  },
  {
    place: 'Le Concert des Guérisseurs',
    text: "Création musicologique et concert pour percussions et piano inspiré des musiques thérapeutiques pygmées et de l'African Wizarding Music (jalons documentés 2020-2022).",
  },
]

const QUESTIONS = [
  'Que perd une musique quand sa transmission orale s’interrompt ?',
  'Que gagne-t-elle lorsqu’elle est archivée, et à quel prix ?',
  'Qui décide de ce qui devient patrimoine — et pour qui ?',
  'Comment une IA entraînée ailleurs comprend-elle une musique d’ici ?',
  'Comment documenter sans muséifier, transmettre sans figer ?',
]

export default function Culture() {
  useSeo({
    title: 'Culture & Recherche | Hervé Nanfang — musicologie',
    description:
      "Musicologie, cultures africaines, patrimoine et transmission orale : comprendre la musique à travers ceux qui la portent. Recherche d'Hervé Nanfang.",
    path: '/culture-recherche',
    jsonLd: [
      personSchema,
      creativeWorkSchema(
        'Recherche en musicologie et patrimoine musical',
        "Travaux de recherche et de documentation sur les musiques africaines, la transmission orale et le patrimoine musical des territoires.",
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Culture & Recherche', path: '/culture-recherche' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="Culture & Recherche"
        eyebrow="Comprendre"
        title="Comprendre la musique, c’est aussi comprendre ceux qui la portent."
        lead="Une ligne de travail : la culture musicale africaine n’est pas un décor ni une donnée brute — c’est un système de savoir, de mémoire et de transmission."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="6" label="Axes de travail" />
          <Stat value="2" label="Terrains documentés" />
          <Stat value="5" label="Questions ouvertes" />
          <Stat value="4" label="Séries du Journal" />
        </div>
      </PageHero>

      {/* Axes */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="01" label="Axes de recherche" />
          <Display size="md" className="mt-7 max-w-3xl">
            Six axes, un même souci de rigueur
          </Display>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {AXES.map((a, i) => (
            <Reveal key={a.t} delay={i * 70}>
              <Card className="h-full">
                <h3 className="font-display text-2xl text-ivory">{a.t}</h3>
                <Rule className="opacity-40" />
                <Body className="mt-4">{a.d}</Body>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Terrains */}
      <Section tone="ink">
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <Reveal>
            <ChapterMark num="02" label="Terrains" />
            <Display size="md" className="mt-7">
              Des lieux, pas des abstractions
            </Display>
            <Body className="mt-6 max-w-xl">
              La recherche se fait sur le terrain, au contact des détenteurs de savoirs musicaux. Elle
              implique des choix : que documenter, comment, avec l’accord de qui, et pour quel usage
              ensuite.
            </Body>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-8 sm:grid-cols-2">
              {TERRAINS.map((t) => (
                <div key={t.place} className="border border-white/10 bg-ink-2 p-7">
                  <Eyebrow>{t.place}</Eyebrow>
                  <p className="mt-5 text-sm leading-relaxed text-ivory/60">{t.text}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <Tag>Collecte</Tag>
                    <Tag>Documentation</Tag>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Questions */}
      <Section tone="dark" tight>
        <Reveal>
          <ChapterMark num="03" label="Questions de travail" />
          <Display size="md" className="mt-7 max-w-3xl">
            Cinq questions qui structurent la réflexion
          </Display>
        </Reveal>
        <ul className="mt-12 divide-y divide-white/8 border-y border-white/8">
          {QUESTIONS.map((q, i) => (
            <Reveal key={q} delay={i * 60}>
              <li className="py-5">
                <div className="flex items-baseline gap-6">
                  <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-display text-xl text-ivory/90 md:text-2xl">{q}</span>
                </div>
                {i === 3 && (
                  <div className="ml-12 mt-3 max-w-2xl text-sm leading-relaxed text-ivory/60">
                    <p>
                      Cette question de recherche est au cœur du concept doctrinal <strong className="text-gold">Musicien Augmenté™</strong> conceptualisé
                      par Hervé Nanfang, qui étudie les limites des transformateurs audio face aux polyrythmies et répertoires d'Afrique.
                    </p>
                    <div className="mt-2.5 flex flex-wrap gap-4 text-xs font-semibold uppercase tracking-wider">
                      <Link to="/ia-technologie#musicien-augmente" className="text-gold hover:underline">
                        Le manifeste Musicien Augmenté™ →
                      </Link>
                      <Link to="/journal/ai-music-evaluation-human-listening" className="text-ivory/70 hover:text-gold hover:underline">
                        Lire l'article de recherche (Pilier 27) →
                      </Link>
                    </div>
                  </div>
                )}
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Écriture */}
      <Section tone="ink">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <ChapterMark num="04" label="Écriture & publication" />
            <Display size="md" className="mt-7">
              Les réflexions se publient
            </Display>
            <Lead className="mt-6 max-w-xl">
              Cette section alimente le Journal : articles, notes de terrain, méthodes et prises de
              position sur la musique, la culture et la technologie.
            </Lead>
            <div className="mt-9 flex flex-wrap gap-2">
              {['Articles', 'Communications', 'Documentation', 'Notes de terrain'].map((t) => (
                <Tag key={t}>{t}</Tag>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2">
              {JOURNAL_SERIES.map((s) => (
                <div key={s.num} className="bg-ink-2 p-6">
                  <span className="font-display text-xl text-gold/60">Série {s.num}</span>
                  <h3 className="mt-3 font-display text-2xl text-ivory">{s.title}</h3>
                  <p className="mt-2 text-sm text-ivory/55">{s.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      <CtaBand
        eyebrow="Collaboration"
        title="Un projet de recherche, de patrimoine ou de médiation ?"
        text="Institutions, laboratoires, festivals, collectivités : construisons un projet culturel documenté, respectueux des détenteurs de savoirs et utile au public."
        primary={{ label: 'Proposer une collaboration', to: '/contact#collaboration' }}
        secondary={{ label: 'Lire le Journal', to: '/journal' }}
      />
    </>
  )
}
