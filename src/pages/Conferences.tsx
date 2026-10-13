import PageHero from '../components/PageHero'
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
import { CONFERENCES, CONFERENCE_AUDIENCES } from '../data/conferences'
import { breadcrumbSchema, eventSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const PROCESS = [
  { t: 'Prise de contact', d: 'Contexte, public, date, durée, format et objectifs de l’organisateur.' },
  { t: 'Cadrage du propos', d: 'Adaptation du thème au niveau du public et aux enjeux réels de la structure.' },
  { t: 'Intervention', d: 'Conférence, masterclass ou atelier pratique, avec exemples concrets et démonstrations.' },
  { t: 'Suivi', d: 'Support remis aux participants, pistes de mise en œuvre et disponibilité pour les questions.' },
]

export default function Conferences() {
  useSeo({
    title: 'Conférences | Hervé Nanfang — IA, musique & pédagogie',
    description:
      "Cinq conférences pour écoles, universités et institutions : le musicien augmenté, de la MAO à l'IA, enseigner la musique à l'ère de l'IA.",
    path: '/conferences',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Conférences et masterclass',
        "Interventions sur l'IA appliquée à la musique, la pédagogie musicale, la transformation numérique et la carrière artistique.",
        'Formation et conseil',
      ),
      ...CONFERENCES.map((c) =>
        eventSchema(`Conférence — ${c.title}`, c.pitch, undefined),
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
        lead="Des interventions conçues pour des publics réels : écoles de musique, universités, institutions culturelles, entreprises créatives et organisations professionnelles."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="5" label="Thèmes" />
          <Stat value="3" label="Formats" />
          <Stat value="45–180" label="Minutes" />
          <Stat value="FR/EN" label="Langues" />
        </div>
      </PageHero>

      {/* Thèmes */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="01" label="Thèmes" />
          <Display size="md" className="mt-7 max-w-3xl">
            Cinq interventions, un même fil : comprendre avant d’adopter
          </Display>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {CONFERENCES.map((c, i) => (
            <Reveal key={c.title} delay={i * 80}>
              <Card className="flex h-full flex-col">
                <Eyebrow>{c.theme}</Eyebrow>
                <h3 className="mt-5 font-display text-3xl leading-snug text-ivory">« {c.title} »</h3>
                <Rule className="opacity-40" />
                <Body className="mt-4 flex-1">{c.pitch}</Body>
                <div className="mt-7 space-y-3 text-sm">
                  <p className="text-ivory/50">
                    <span className="text-gold/70">Public — </span>
                    {c.audience}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {c.formats.map((f) => (
                      <Tag key={f}>{f}</Tag>
                    ))}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
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
      </Section>

      <CtaBand
        eyebrow="Organisateurs"
        title="Inviter Hervé Nanfang"
        text="Indiquez la structure, le public visé, la date envisagée et le thème pressenti : vous recevrez une proposition adaptée, avec les modalités techniques et financières."
        primary={{ label: 'Ouvrir le parcours conférence', to: '/contact#conference' }}
        secondary={{ label: 'Voir les projets', to: '/projets' }}
      />
    </>
  )
}
