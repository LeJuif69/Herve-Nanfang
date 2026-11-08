import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import InterventionSimulator from '../components/InterventionSimulator'
import {
  Body,
  Btn,
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
import { ARTICLES } from '../data/articles'
import { CONFERENCES, CONFERENCE_AUDIENCES } from '../data/conferences'
import { breadcrumbSchema, conferenceEducationEventSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const PROCESS = [
  { t: 'Prise de contact', d: 'Contexte, public, date, durée, format et objectifs de l’organisateur.' },
  { t: 'Cadrage du propos', d: 'Adaptation du thème au niveau du public et aux enjeux réels de la structure.' },
  { t: 'Intervention', d: 'Conférence, masterclass ou atelier pratique, avec exemples concrets et démonstrations.' },
  { t: 'Suivi', d: 'Support remis aux participants, pistes de mise en œuvre et disponibilité pour les questions.' },
]

export default function Conferences() {
  useSeo({
    title: 'Conférences IA, Musique & Culture | Hervé Nanfang',
    description:
      'Six conférences et masterclasses pour universités, écoles et institutions : Le Musicien Augmenté™, de la MAO à l’IA, musique à l’image et pédagogie musicale.',
    path: '/conferences',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Conférences et masterclass',
        "Interventions sur l'IA appliquée à la musique, la musique à l'image, la pédagogie musicale, la transformation numérique et la carrière artistique.",
        'Formation et conseil',
      ),
      ...CONFERENCES.map((c) =>
        conferenceEducationEventSchema({
          title: c.title,
          pitch: c.pitch,
          duration: c.duration,
          audience: c.audience,
          objectives: c.objectives,
          deliverables: c.deliverables,
          theme: c.theme,
        }),
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Conférences', path: '/conferences' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="Conférences"
        eyebrow="Interventions"
        title="Conférences & Masterclass"
        lead="Des interventions conçues pour des publics réels : écoles de musique, universités, écoles de cinéma, institutions culturelles et entreprises créatives."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="06" label="Thèmes majeurs" />
          <Stat value="03" label="Formats" />
          <Stat value="45–180" label="Minutes" />
          <Stat value="FR/EN" label="Langues" />
        </div>
      </PageHero>

      {/* Thèmes & Fiches détaillées */}
      <Section tone="dark" id="themes">
        <Reveal>
          <ChapterMark num="01" label="Fiches d'intervention" />
          <Display size="md" className="mt-7 max-w-3xl">
            Six interventions de référence, un même fil : comprendre avant d’adopter
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Chaque conférence associe rigueur musicologique, démonstrations en direct et méthodologie concrète
            pour outiller durablement vos équipes, enseignants et étudiants.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          {CONFERENCES.map((c, i) => (
            <Reveal key={c.id} delay={i * 80}>
              <Card className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-8 transition-all hover:border-gold/50">
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <Eyebrow>{c.theme}</Eyebrow>
                    <span className="rounded bg-gold/10 border border-gold/30 px-2.5 py-0.5 font-mono text-[0.62rem] text-gold uppercase tracking-wider">
                      {c.duration}
                    </span>
                  </div>

                  <h3 className="mt-4 font-display text-2xl leading-snug text-ivory lg:text-3xl">
                    « {c.title} »
                  </h3>
                  <Rule className="opacity-40" />
                  <Body className="mt-4 text-xs leading-relaxed text-ivory/70">{c.pitch}</Body>

                  {/* 3 Objectifs pédagogiques */}
                  <div className="mt-6 border-t border-white/5 pt-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-gold/80 mb-2">
                      Objectifs & Compétences visées :
                    </p>
                    <ul className="space-y-2 text-xs text-ivory/75">
                      {c.objectives.map((obj, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-gold font-bold">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Supports & Livrables */}
                  <div className="mt-5 border-t border-white/5 pt-4">
                    <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-ivory/40 mb-2">
                      Livrables & Supports remis :
                    </p>
                    <ul className="space-y-1 text-xs text-ivory/60">
                      {c.deliverables.map((del, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <span className="text-gold/60 text-[0.65rem]">✦</span>
                          <span>{del}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Régie technique */}
                  <div className="mt-5 rounded-lg border border-white/8 bg-ink p-3 text-[0.68rem] text-ivory/55">
                    <span className="text-gold font-medium">Besoins régie :</span> {c.techRequirements}
                  </div>
                </div>

                <div className="mt-7 border-t border-white/10 pt-4 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {c.formats.map((f) => (
                      <Tag key={f}>{f}</Tag>
                    ))}
                  </div>

                  <a
                    href="#simulateur"
                    className="text-xs uppercase tracking-wider text-gold hover:text-gold-2 font-bold shrink-0 ml-3"
                  >
                    Demander ↗
                  </a>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        {/* Simulateur & Cadrage interactif */}
        <div className="mt-16">
          <Reveal delay={100}>
            <InterventionSimulator />
          </Reveal>
        </div>
      </Section>

      {/* Déroulé */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="02" label="Déroulé" />
          <Display size="md" className="mt-7 max-w-3xl">
            Comment se construit une intervention
          </Display>
        </Reveal>
        <div className="mt-14 grid gap-px border border-white/8 bg-white/8 md:grid-cols-4">
          {PROCESS.map((p, i) => (
            <Reveal key={p.t} delay={i * 80}>
              <div className="h-full bg-ink-2 p-7">
                <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-2xl text-ivory">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/55">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120}>
          <div className="mt-14 grid gap-10 border border-white/8 p-8 md:grid-cols-[1.3fr_1fr] md:items-center md:p-10">
            <div>
              <Eyebrow>Publics concernés</Eyebrow>
              <div className="mt-5 flex flex-wrap gap-3">
                {CONFERENCE_AUDIENCES.map((a) => (
                  <Tag key={a}>{a}</Tag>
                ))}
              </div>
              <Lead className="mt-7 max-w-xl">
                Chaque intervention est contextualisée : les exemples, les outils cités et le niveau
                de technicité sont adaptés au public présent dans la salle.
              </Lead>
            </div>
            <div className="flex flex-wrap gap-4 md:justify-end">
              <Btn to="/contact#conference" variant="gold">
                Proposer une date
              </Btn>
              <Btn to="/contact#formation" variant="ghost">
                Demander une masterclass
              </Btn>
            </div>
          </div>
        </Reveal>

        {/* Publications associées dans le Journal */}
        <div className="mt-14 border-t border-white/10 pt-12">
          <Reveal>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>Supports écrits & Recherche</Eyebrow>
                <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
                  Les essais du Journal qui prolongent ces conférences
                </h3>
              </div>
              <Btn to="/journal" variant="ghost">
                Tout le Journal →
              </Btn>
            </div>
          </Reveal>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {ARTICLES.filter((a) =>
              [
                'le-musicien-augmente',
                'apres-la-mao-l-ia',
                'enseigner-la-musique-a-l-ere-de-l-ia',
              ].includes(a.slug),
            ).map((article, i) => (
              <Reveal key={article.slug} delay={i * 70}>
                <Link
                  to={`/journal/${article.slug}`}
                  className="group flex h-full flex-col justify-between border border-white/10 bg-ink-2 p-6 transition-colors hover:border-gold/50"
                >
                  <div>
                    <span className="font-mono text-[0.65rem] uppercase tracking-wider text-gold/80">
                      {article.category} · {article.readingTime}
                    </span>
                    <h4 className="mt-3 font-display text-xl leading-snug text-ivory group-hover:text-gold transition-colors">
                      {article.title}
                    </h4>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/60 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-wider text-gold">
                    Lire l’essai →
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <CtaBand
        eyebrow="Organisateurs"
        title="Inviter Hervé Nanfang"
        text="Indiquez la structure, le public visé, la date envisagée et le thème pressenti : vous recevrez une proposition adaptée, avec les modalités techniques et financières."
        primary={{ label: 'Inviter Hervé Nanfang à intervenir', to: '/contact#conference' }}
        secondary={{ label: 'Voir les projets', to: '/projets' }}
      />
    </>
  )
}
