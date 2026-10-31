import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Body,
  Btn,
  ChapterMark,
  CtaBand,
  Display,
  Lead,
  Reveal,
  Rule,
  Section,
  SpotlightCard,
  Stat,
  Tag,
} from '../components/ui'
import { ARTICLES } from '../data/articles'
import { SERVICE_COMMITMENTS, SERVICE_OFFERINGS } from '../data/services'
import { SITE } from '../data/site'
import { breadcrumbSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const PROCESS = [
  {
    num: '01',
    title: 'Identifier le besoin',
    text: 'Public cible, contexte, date, durée, objectifs et contraintes logistiques.',
  },
  {
    num: '02',
    title: 'Choisir un format',
    text: 'Prestation live, production studio, conférence ou formation sur mesure.',
  },
  {
    num: '03',
    title: 'Valider les livrables',
    text: 'Contrat ou bon de commande, calendrier précis et restitution mesurable.',
  },
  {
    num: '04',
    title: 'Mesurer les résultats',
    text: "À l'aune du public, de la pédagogie et de la qualité artistique effective.",
  },
]

export default function Services() {
  useSeo({
    title: 'Services | Hervé Nanfang — live, production, marque & conseil',
    description:
      "Piano live Le Pianobariste™, production musicale, stratégie de marque culturelle, conférences IA et formations RMA : prestations sur mesure d'Hervé Nanfang.",
    path: '/services',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Le Pianobariste™ — Piano live',
        'Piano live pour palaces, hôtels, lounges, cérémonies et événements diplomatiques depuis 2007.',
        'Musique live',
      ),
      serviceSchema(
        'Production musicale & ingénierie du son',
        "Composition, arrangement, mixage, mastering et musique à l'image pour artistes et audiovisuel.",
        'Production musicale',
      ),
      serviceSchema(
        'Stratégie de marque culturelle & communication digitale',
        "Conseil en positionnement, récit de marque, dossier de presse d'autorité et workflows éditoriaux assistés par IA.",
        'Conseil et communication',
      ),
      serviceSchema(
        'Conférences & Masterclass',
        "Interventions sur l'IA appliquée à la musique, la pédagogie et la transformation numérique culturelle.",
        'Formation et conseil',
      ),
      serviceSchema(
        'A Laiz Academy — Formation & Transmission (ex-RMA)',
        'Cursus piano, chant, guitare, batterie, programme Vacances Utiles et formation de formateurs.',
        'Formation musicale',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Services', path: '/services' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="Services"
        eyebrow="Créer · Transmettre · Augmenter"
        title="Des prestations pensées pour la création, la transmission et la transformation"
        lead="Piano live, production musicale, conseil en stratégie de marque, conférences et formations A Laiz Academy (ex-RMA) : chaque service s'appuie sur le même principe — clarifier le besoin, protéger l'intention artistique et donner du sens au dispositif."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="05" label="Familles de services" />
          <Stat value="2007" label="Piano live depuis" />
          <Stat value="440+" label="Titres répertoire" />
          <Stat value="Sur devis" label="Tarification" />
        </div>
      </PageHero>

      {/* ======================== OFFRES DÉTAILLÉES ======================== */}
      {SERVICE_OFFERINGS.map((offering, oi) => (
        <Section key={offering.id} id={offering.id} tone={oi % 2 === 0 ? 'dark' : 'ink'}>
          <Reveal>
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-display text-4xl text-gold/60">{offering.icon}</span>
              <div>
                <p className="eyebrow text-gold/80">{offering.family}</p>
                <Display size="md" className="mt-1">
                  {offering.title}
                </Display>
              </div>
            </div>
            <Lead className="mt-5 max-w-3xl">{offering.tagline}</Lead>
            <Body className="mt-3 max-w-3xl text-ivory/65">{offering.description}</Body>
          </Reveal>

          {/* Formules */}
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {offering.tiers.map((tier, ti) => (
              <Reveal key={tier.label} delay={ti * 80}>
                <div
                  className={`relative flex h-full flex-col border p-7 transition-all duration-300 ${
                    tier.highlight
                      ? 'border-gold bg-ink-2 shadow-[0_0_30px_rgba(198,161,91,0.18)]'
                      : 'border-white/10 bg-ink-2/70 hover:border-gold/40'
                  }`}
                >
                  {tier.cta && (
                    <div className="absolute -top-3 left-6">
                      <span className="rounded bg-gold px-3 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-ink">
                        {tier.cta}
                      </span>
                    </div>
                  )}

                  <div>
                    <p className="font-display text-xl text-ivory">{tier.label}</p>
                    <p className="mt-1 text-xs text-ivory/50">{tier.subtitle}</p>

                    <Rule className="my-5 opacity-30" />

                    <div className="flex items-baseline justify-between gap-4">
                      <p className="font-display text-2xl text-gold">
                        {tier.price ?? 'Sur devis'}
                      </p>
                      <span className="rounded border border-white/15 px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-ivory/50">
                        {tier.duration}
                      </span>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2.5 text-sm text-ivory/65">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                          {feat}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-8 border-t border-white/8 pt-5">
                    <ArrowLink to={offering.contactTo}>{offering.contactLabel}</ArrowLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Conditions */}
          <Reveal delay={120}>
            <div className="mt-10 border border-white/8 bg-ink-2/40 p-6">
              <p className="eyebrow text-ivory/40">Conditions & modalités</p>
              <ul className="mt-4 grid gap-y-2 sm:grid-cols-2">
                {offering.conditions.map((cond) => (
                  <li key={cond} className="flex items-start gap-2 text-xs leading-relaxed text-ivory/55">
                    <span className="mt-1 text-gold/50">—</span>
                    {cond}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Études de cas et réalisations concrètes si disponibles */}
          {offering.cases && offering.cases.length > 0 && (
            <Reveal delay={140}>
              <div className="mt-10 border border-gold/30 bg-gold/5 p-6 md:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="eyebrow text-gold">Études de cas & Réalisations réelles</p>
                  <span className="text-[0.62rem] uppercase tracking-wider text-ivory/40">
                    Preuves concrètes dans l'écosystème
                  </span>
                </div>
                <div className="mt-6 grid gap-6 md:grid-cols-3">
                  {offering.cases.map((c) => (
                    <div
                      key={c.title}
                      className="flex flex-col justify-between border border-white/10 bg-ink-2/80 p-5 transition-colors hover:border-gold/40"
                    >
                      <div>
                        <p className="font-display text-lg text-ivory">{c.title}</p>
                        <p className="mt-2 text-xs leading-relaxed text-ivory/60">{c.context}</p>
                        <div className="mt-4 border-t border-white/8 pt-3">
                          <p className="text-[0.62rem] font-semibold uppercase tracking-wider text-gold/80">
                            Livrable clé :
                          </p>
                          <p className="mt-1 text-xs text-ivory/75">{c.deliverable}</p>
                        </div>
                      </div>
                      {c.to && (
                        <div className="mt-5 border-t border-white/5 pt-3">
                          <ArrowLink to={c.to}>Consulter la référence</ArrowLink>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </Section>
      ))}

      {/* ======================== MÉTHODE ======================== */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="05" label="Méthode" />
          <Display size="md" className="mt-7">
            Une commande claire vaut mieux qu'un long briefing vague.
          </Display>
          <Lead className="mt-5 max-w-3xl">
            Chaque prestation commence par une conversation directe. Le devis arrive dans les 48 heures.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PROCESS.map((step, index) => (
            <Reveal key={step.num} delay={index * 60}>
              <div className="border border-white/10 bg-ink-2 p-6 h-full">
                <p className="eyebrow text-gold">{step.num}</p>
                <p className="mt-4 font-display text-xl text-ivory">{step.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/65">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== ENGAGEMENTS ======================== */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="06" label="Engagements" />
          <Display size="md" className="mt-7 max-w-3xl">
            Ce que vous pouvez attendre de chaque collaboration
          </Display>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_COMMITMENTS.map((c, i) => (
            <Reveal key={c.title} delay={i * 70}>
              <div className="border border-white/10 bg-ink-2 p-6 h-full">
                <span className="font-display text-3xl text-gold/40">{c.icon}</span>
                <p className="mt-5 font-display text-lg text-ivory">{c.title}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/60">{c.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== A LAIZ ACADEMY FOCUS ======================== */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="07" label="A Laiz Academy" />
          <Display size="md" className="mt-7 max-w-3xl">
            A Laiz Academy : formation musicale d'excellence (ex-RMA)
          </Display>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <div className="border border-white/10 bg-ink-2 p-8 md:p-10">
              <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gold">A Laiz Academy</p>
              <h3 className="mt-6 font-display text-3xl text-ivory">
                Formation musicale, pédagogie et transmission
              </h3>
              <Body className="mt-5">
                A Laiz Academy (anciennement Racines Musicales Academy — RMA) relie les pratiques contemporaines et le patrimoine musical africain. Elle vise à rendre
                l'apprentissage musical plus structuré, plus lisible et plus durable, sans perdre le lien
                avec la culture de départ.
              </Body>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Curricula', 'Progression', 'Évaluation', 'Patrimoine', 'Pédagogie', 'Formateurs'].map((tag) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/rma" className="btn btn-gold">
                  Découvrir A Laiz Academy
                </Link>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-gold/30 bg-ink p-8">
              <p className="eyebrow text-gold">Contact direct</p>
              <p className="mt-5 font-display text-2xl text-ivory">
                Pour un besoin précis : formation, conférence, live ou production.
              </p>
              <a
                href={`mailto:${SITE.emailRma}`}
                className="mt-6 inline-block text-sm text-gold hover:text-gold-2 transition-colors"
              >
                {SITE.emailRma}
              </a>
              <div className="mt-6">
                <ArrowLink to="/contact#formation">Ouvrir le formulaire de demande</ArrowLink>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* LE JOURNAL — ÉTUDES DE CAS, MARQUE & STRATÉGIE                            */}
      {/* ========================================================================= */}
      <Section tone="ink" id="journal-services">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="09" label="Le Journal • Marque, Droit & Stratégie" />
              <Display size="md" className="mt-6 max-w-2xl">
                Doctrine économique & propriété intellectuelle
              </Display>
              <Lead className="mt-4 max-w-2xl">
                Comprendre les logiques de marque, les enjeux de droit d'auteur et les modèles économiques
                hybrides avant d'engager une collaboration professionnelle.
              </Lead>
            </div>
            <Btn to="/journal" variant="ghost" className="self-start md:self-auto shrink-0">
              Explorer les analyses du Journal →
            </Btn>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ARTICLES.filter((a) =>
            [
              'musicien-marque-recit',
              'ia-droits-auteur-musique-africaine',
              'economie-du-musicien-afrique-modele-hybride',
            ].includes(a.slug),
          ).map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <Link to={`/journal/${article.slug}`} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-7 transition-colors group-hover:border-gold/50">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gold/80 uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-wider text-ivory/45">
                        {article.readingTime}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl leading-snug text-ivory transition-colors group-hover:text-gold-2">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-ivory/60 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold group-hover:text-gold-2 inline-flex items-center gap-1.5">
                      Lire l’article <span>→</span>
                    </span>
                    <span className="text-[0.6rem] uppercase tracking-wider text-ivory/40">Hervé Nanfang</span>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow="Parcours sur mesure"
        title="Choisir le bon format pour votre projet"
        text="École, institution, lieu de diffusion, artiste ou entreprise créative : la meilleure réponse commence par une demande précise."
        primary={{ label: 'Demander un devis', to: '/contact#formation' }}
        secondary={{ label: 'Voir les conférences', to: '/conferences' }}
      />
    </>
  )
}
