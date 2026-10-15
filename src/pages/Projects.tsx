import { useState } from 'react'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Body,
  Card,
  ChapterMark,
  CtaBand,
  Display,
  Eyebrow,
  Reveal,
  Rule,
  Section,
  Stat,
  Tag,
} from '../components/ui'
import { PROJECT_FAMILIES } from '../data/projects'
import { SITE } from '../data/site'
import {
  breadcrumbSchema,
  creativeWorkSchema,
  organizationSchema,
  personSchema,
} from '../lib/schema'
import { useSeo } from '../lib/seo'

export default function Projects() {
  const [active, setActive] = useState<string>('tous')

  useSeo({
    title: 'Projets & Marques | Hervé Nanfang — A LAIZ PROD',
    description:
      'Projets musicaux, pédagogiques, numériques et culturels d’Hervé Nanfang : Le Pianobariste, A LAIZ PROD, RMA®, Permis de Jouer™, Musicien Augmenté™ et Tswefap.',
    path: '/projets',
    jsonLd: [
      personSchema,
      organizationSchema,
      creativeWorkSchema(
        'Racines Musicales Academy®',
        'Projet de formation musicale reliant pratiques contemporaines et patrimoine musical africain.',
      ),
      creativeWorkSchema(
        'Permis de Jouer™',
        "Système de progression et de certification pour l'apprentissage musical.",
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Projets', path: '/projets' },
      ]),
    ],
  })

  const families =
    active === 'tous' ? PROJECT_FAMILIES : PROJECT_FAMILIES.filter((f) => f.id === active)

  return (
    <>
      <PageHero
        breadcrumb="Projets & Marques"
        eyebrow="Développer"
        title="Des projets pensés comme des structures"
        lead="Quatre familles de projets, une même intention : transformer des compétences en dispositifs capables de produire, de durer et de se transmettre."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="4" label="Familles" />
          <Stat value="13" label="Projets" />
          <Stat value="6" label="Marques dérivées" />
          <Stat value="1" label="Structure : A LAIZ PROD" />
        </div>
      </PageHero>

      {/* Filtres */}
      <Section tone="dark" tight bordered={false}>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActive('tous')}
            className={`border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
              active === 'tous'
                ? 'border-gold bg-gold text-ink'
                : 'border-white/15 text-ivory/60 hover:border-gold/60 hover:text-gold'
            }`}
          >
            Tous les projets
          </button>
          {PROJECT_FAMILIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={`border px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition-colors ${
                active === f.id
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/15 text-ivory/60 hover:border-gold/60 hover:text-gold'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </Section>

      {families.map((family, fi) => (
        <Section key={family.id} id={family.id} tone={fi % 2 === 0 ? 'ink' : 'dark'}>
          <Reveal>
            <ChapterMark num={String(PROJECT_FAMILIES.indexOf(family) + 1).padStart(2, '0')} label={`Projets ${family.label.toLowerCase()}`} />
            <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
              <Display size="md">{family.label}</Display>
              <Body className="lg:pb-2">{family.intro}</Body>
            </div>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {family.projects.map((p, i) => (
              <Reveal key={p.title} delay={i * 80}>
                <Card className="flex h-full flex-col">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-display text-2xl leading-snug text-ivory">
                        {p.title}
                        {p.mark && <sup className="ml-1 text-sm text-gold">{p.mark}</sup>}
                      </h3>
                      <p className="mt-2 text-[0.66rem] uppercase tracking-[0.18em] text-gold/70">
                        {p.volume}
                      </p>
                    </div>
                    <Tag tone={p.status === 'Signature' ? 'gold' : 'ink'}>{p.status}</Tag>
                  </div>
                  <Rule className="opacity-40" />
                  <Body className="mt-4">{p.description}</Body>
                  {p.synopsis && (
                    <p className="mt-3 text-xs leading-relaxed text-ivory/45 italic border-l border-gold/20 pl-3">
                      {p.synopsis.length > 220 ? p.synopsis.slice(0, 220) + '…' : p.synopsis}
                    </p>
                  )}
                  <ul className="mt-6 space-y-2">
                    {p.points.map((pt) => (
                      <li key={pt} className="flex items-baseline gap-3 text-sm text-ivory/60">
                        <span aria-hidden className="h-1 w-1 shrink-0 translate-y-[-3px] bg-gold/70" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                  {p.discipline && (
                    <div className="mt-4">
                      <span className="rounded border border-gold/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-gold/60">
                        {p.discipline}
                      </span>
                    </div>
                  )}
                  {p.to && (
                    <div className="mt-6">
                      <ArrowLink to={p.to}>En savoir plus</ArrowLink>
                    </div>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
        </Section>
      ))}

      {/* Écosystème */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="06" label="Écosystème de marques" />
          <Display size="md" className="mt-7 max-w-3xl">
            Les marques dérivées ne concurrencent pas Hervé Nanfang
          </Display>
          <Body className="mt-6 max-w-3xl">
            Chaque marque est présentée comme « un projet de Hervé Nanfang » ou « une initiative
            développée par Hervé Nanfang », et renvoie vers ce site, source canonique de l’ensemble de
            l’écosystème.
          </Body>
        </Reveal>

        <div className="mt-12 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {SITE.marks.map((mark) => (
            <div key={mark} className="bg-ink-2 px-7 py-6">
              <p className="font-display text-xl text-ivory">{mark}</p>
              <p className="mt-2 text-[0.62rem] uppercase tracking-[0.18em] text-gold/70">
                Un projet de Hervé Nanfang
              </p>
            </div>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-8 border border-white/8 p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <Eyebrow>Structure porteuse</Eyebrow>
              <h3 className="mt-4 font-display text-3xl text-ivory">A LAIZ PROD</h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/60">
                Structure de production artistique et culturelle : production musicale, événementiel,
                développement de projets et conseil en technologies créatives. C’est le socle
                entrepreneurial qui rend possibles les autres familles de projets.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Tag>Production</Tag>
              <Tag>Événementiel</Tag>
              <Tag>Conseil</Tag>
              <Tag>Partenariats</Tag>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Vous avez un projet"
        title="Construire ensemble, ou confier une expertise"
        text="Projet artistique, culturel ou numérique : décrivez votre intention, vos contraintes et votre calendrier."
        primary={{ label: 'Proposer un projet', to: '/contact#collaboration' }}
        secondary={{ label: 'Demander un conseil', to: '/contact#conseil' }}
      />
    </>
  )
}
