import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Body,
  Btn,
  Card,
  ChapterMark,
  CtaBand,
  Display,
  Eyebrow,
  Reveal,
  Rule,
  Section,
  SpotlightCard,
  Stat,
  Tag,
} from '../components/ui'
import { IDENTITY, MASTER_IDENTITY } from '../data/identity'
import { ARTICLES } from '../data/articles'
import { AUDIO_PLAYLIST } from '../data/audio'
import { useAudio } from '../lib/audio-context'
import {
  breadcrumbSchema,
  courseSchema,
  creativeWorkSchema,
  faqSchema,
  organizationSchema,
  personSchema,
} from '../lib/schema'
import { useSeo } from '../lib/seo'

/* ------------------------------------------------------------------ */
/* Le constat : ce que personne ne dit franchement                     */
/* ------------------------------------------------------------------ */
const CONSTAT = [
  {
    n: '01',
    t: 'L’IA sait déjà produire',
    d: 'Des modèles génèrent musique, arrangements, analyses et textes en quelques secondes. Nier cette réalité ne protège aucun musicien : cela le laisse sans méthode le jour où le marché bascule.',
  },
  {
    n: '02',
    t: 'Le public ne paie pas un fichier',
    d: 'Personne ne sort de chez soi pour écouter un rendu parfait. On paie une présence, un moment, une interprétation située — la capacité à lire une salle et à décider en direct.',
  },
  {
    n: '03',
    t: 'L’outil ne suffit pas',
    d: 'Savoir utiliser un outil ne suffit pas : il faut aussi évaluer ses résultats, protéger ses droits et garder la décision artistique. L’enjeu est de construire des méthodes, pas seulement d’apprendre des logiciels.',
  },
]

/* ------------------------------------------------------------------ */
/* Le manifeste — sept thèses                                          */
/* ------------------------------------------------------------------ */
const THESES = [
  {
    n: '01',
    t: 'L’IA est un instrument, pas un interprète',
    d: 'Un instrument n’a jamais signé une œuvre. On ne demande pas à une machine de décider ce qui mérite d’exister.',
  },
  {
    n: '02',
    t: 'Ce qui est technique se délègue, ce qui est artistique ne se délègue pas',
    d: 'Déléguer la préparation, l’analyse, le classement, le montage répétitif. Jamais le goût, le choix, la nuance, ni la responsabilité de ce qui est publié.',
  },
  {
    n: '03',
    t: 'On n’augmente que ce qui existe',
    d: 'L’IA amplifie une compétence déjà construite. Elle ne remplace ni le répertoire, ni l’oreille, ni les années de scène.',
  },
  {
    n: '04',
    t: 'Le live est le critère de vérité',
    d: 'Sur scène, sans filet, on voit immédiatement ce qui relève du musicien et ce qui relevait de l’outil. Ce test doit guider chaque adoption.',
  },
  {
    n: '05',
    t: 'La culture n’est pas une donnée',
    d: 'Corpus, patrimoines, voix et répertoires ne sont pas des matières premières gratuites. Consentement, traçabilité, rémunération : trois conditions non négociables.',
  },
  {
    n: '06',
    t: 'L’IA doit rendre du temps, pas de la vitesse',
    d: 'Gagner du temps n’a de valeur que si ce temps retourne à la musique : répéter, écouter, transmettre, rencontrer un public.',
  },
  {
    n: '07',
    t: 'Un musicien augmenté documente ce qu’il fait',
    d: 'Ce qui n’est pas documenté n’est pas transmissible. Chaque usage testé laisse une trace : ce qui marche, ce qui échoue, et pourquoi.',
  },
]

/* ------------------------------------------------------------------ */
/* Ce que le concept est — et n'est pas                                */
/* ------------------------------------------------------------------ */
const EST = [
  'Une méthode de travail : diagnostic, fondations, ateliers, autonomie.',
  'Un cadre éthique explicite sur l’usage des œuvres et des cultures.',
  'Une pratique professionnelle testée sur le terrain, scène et salle de cours.',
  'Un enseignement transmissible à d’autres musiciens et enseignants.',
]

const NEST_PAS = [
  'Un argument commercial pour vendre des abonnements à des outils.',
  'La promesse qu’une machine écrira à votre place ce que vous ne savez pas dire.',
  'Une course à la nouveauté logicielle, sans rapport avec le métier.',
  'Une façon de faire l’économie de la compétence musicale.',
]

/* ------------------------------------------------------------------ */
/* Quatre terrains d'augmentation                                      */
/* ------------------------------------------------------------------ */
const DOMAINS = [
  {
    title: 'L’IA dans la création',
    intro: 'Assister la création sans décider à la place du créateur.',
    items: ['Composition', 'Arrangement', 'Analyse', 'Idéation', 'Production', 'Recherche'],
  },
  {
    title: 'L’IA dans la transmission',
    intro: 'Concevoir des parcours plus clairs et mieux documentés.',
    items: ['Conception de cours', 'Curricula', 'Supports', 'Évaluation', 'Recherche'],
  },
  {
    title: 'Workflows culturels',
    intro: 'Libérer du temps pour ce qui exige du jugement.',
    items: ['Automatisation', 'Organisation', 'Recherche', 'Productivité', 'Création de contenus'],
  },
  {
    title: 'IA & communication',
    intro: 'Faire circuler un propos sans le diluer dans le bruit.',
    items: [
      'Stratégie éditoriale',
      'Storytelling',
      'Réseaux sociaux',
      'Personal branding',
      'Marketing de contenu',
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Parcours de mise en œuvre                                           */
/* ------------------------------------------------------------------ */
const PARCOURS = [
  {
    t: 'Diagnostic',
    d: 'Cartographier la pratique réelle : répertoire, revenus, contraintes, temps disponible. On n’augmente que ce que l’on connaît.',
  },
  {
    t: 'Fondations',
    d: 'Établir les règles d’usage : ce qui peut être assisté, ce qui reste strictement humain, ce qui doit être déclaré au client ou au public.',
  },
  {
    t: 'Ateliers appliqués',
    d: 'Travailler sur des cas concrets du musicien ou de l’équipe : une œuvre en cours, un cours à préparer, un projet à structurer.',
  },
  {
    t: 'Autonomie documentée',
    d: 'Laisser un mode d’emploi écrit, propre à la structure, pour que la pratique survive au départ du formateur.',
  },
]

/* ------------------------------------------------------------------ */
/* Formats commercialisables                                           */
/* ------------------------------------------------------------------ */
const FORMATS = [
  {
    t: 'Conférence « Le musicien augmenté »',
    d: '45 à 60 minutes. Poser le cadre, montrer des cas concrets, ouvrir le débat.',
    audience: 'Écoles, conservatoires, universités, festivals, institutions culturelles',
    to: '/contact#conference',
  },
  {
    t: 'Masterclass pratique',
    d: '2 à 3 heures. Les participants travaillent sur leurs propres matériaux musicaux.',
    audience: 'Musiciens, étudiants avancés, ensembles, collectifs',
    to: '/contact#formation',
  },
  {
    t: 'Formation longue Musicien Augmenté™',
    d: 'Plusieurs sessions, avec progression structurée et évaluation.',
    audience: 'Écoles de musique, centres de formation, équipes pédagogiques',
    to: '/contact#formation',
  },
  {
    t: 'Accompagnement de structure',
    d: 'Diagnostic, feuille de route, mise en œuvre et transfert de compétences.',
    audience: 'Institutions, entreprises créatives, organisations culturelles',
    to: '/contact#conseil',
  },
]

const FAQ = [
  {
    q: 'L’IA peut-elle remplacer un musicien de piano-bar ?',
    a: 'Techniquement, une machine sait reproduire un répertoire. Elle ne sait pas lire une salle, ajuster une nuance après un regard, ni tenir la durée d’une soirée. Le métier se déplace : il se concentre sur la direction d’atmosphère, la sélection, l’interprétation et la relation.',
  },
  {
    q: 'Que signifie exactement « augmenté » ?',
    a: 'Étendre ce qu’un professionnel peut accomplir seul, sans lui retirer la décision. Concrètement : analyser plus vite, explorer davantage de pistes, produire des variantes, documenter, diffuser. Le jugement reste au musicien.',
  },
  {
    q: 'Faut-il craindre l’IA dans l’enseignement musical ?',
    a: 'Ce qu’il faut craindre, c’est de l’utiliser comme un correcteur automatique sans intention pédagogique. Bien employée, elle libère du temps pour l’accompagnement individuel, qui est précisément ce qu’un professeur apporte et qu’une machine ne remplace pas.',
  },
  {
    q: 'Par où commencer quand on n’a aucune base technique ?',
    a: 'Par ce qui ne dépend pas de l’outil : définir sa pratique, son répertoire, son positionnement, ses contraintes de temps. Ensuite seulement, un usage à la fois, évalué et documenté. C’est l’objet du parcours en quatre étapes présenté sur cette page.',
  },
]

/* ------------------------------------------------------------------ */

export default function AI() {
  useSeo({
    title: MASTER_IDENTITY.ia.seoTitle,
    description: MASTER_IDENTITY.ia.seoDescription,
    path: '/ia-technologie',
    jsonLd: [
      personSchema,
      organizationSchema,
      creativeWorkSchema(
        IDENTITY.concept.name,
        IDENTITY.concept.definition,
        'CreativeWork',
      ),
      courseSchema(
        'Musicien Augmenté™ — formation',
        IDENTITY.concept.promesse,
      ),
      faqSchema(FAQ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'IA & Technologie', path: '/ia-technologie' },
      ]),
    ],
  })

  const { selectTrack, openPlayer } = useAudio()
  const iaTrack = AUDIO_PLAYLIST.find((t) => t.id === 'ia-musique-recherche') || AUDIO_PLAYLIST[3]

  const piliers = ARTICLES

  return (
    <>
      {/* ============================ MANIFESTE ============================ */}
      <PageHero
        breadcrumb="IA & Technologie"
        eyebrow="Manifeste · Territoire d’autorité"
        title={IDENTITY.concept.name}
        lead="À la croisée de l’IA, de la musique, de la MAO, de la pédagogie et de la communication digitale : élargir les capacités du musicien sans lui céder le jugement artistique."
      >
        <div className="max-w-3xl border-l-2 border-gold/50 pl-6">
          <p className="font-display text-2xl leading-snug text-gold md:text-3xl">
            {IDENTITY.concept.principe}
          </p>
        </div>

        <div className="mt-12 grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="07" label="Thèses" />
          <Stat value="04" label="Terrains" />
          <Stat value="04" label="Étapes de méthode" />
          <Stat value="04" label="Formats d’intervention" />
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Btn to="/contact#formation" variant="gold">
            Demander une formation
          </Btn>
          <Btn to="/conferences" variant="ghost">
            Voir la conférence
          </Btn>
          <button
            type="button"
            onClick={() => {
              if (iaTrack) selectTrack(iaTrack, true)
              openPlayer()
            }}
            className="btn btn-ghost inline-flex items-center gap-2 border-gold/40 text-gold hover:border-gold hover:bg-gold/10 hover:text-gold-2"
          >
            <svg className="h-4 w-4 fill-current text-gold" viewBox="0 0 24 24">
              <polygon points="6 3 20 12 6 21 6 3" />
            </svg>
            <span>Écouter l'étude sonore IA ♫</span>
          </button>
        </div>
      </PageHero>

      {/* ====================== TRAJECTOIRE DU MÉTIER ====================== */}
      <Section tone="ink" id="trajectoire">
        <Reveal>
          <ChapterMark num="01" label="Trajectoire du métier" />
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <Display size="md" className="max-w-3xl">
              {MASTER_IDENTITY.ia.trajectoire.titre}
            </Display>
            <Body className="lg:pb-2">{MASTER_IDENTITY.ia.trajectoire.introduction}</Body>
          </div>
          <p className="mt-6 max-w-4xl border-l border-gold/40 pl-5 text-sm leading-relaxed text-ivory/50">
            {MASTER_IDENTITY.ia.trajectoire.precision}
          </p>
        </Reveal>

        <ol className="mt-12 border-y border-white/10 md:grid md:grid-cols-3">
          {MASTER_IDENTITY.ia.trajectoire.etapes.map((etape, i) => (
            <Reveal key={etape.titre} delay={i * 80}>
              <li className="border-b border-white/10 py-8 last:border-b-0 md:h-full md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0 md:last:pr-0">
                <span className="font-display text-2xl text-gold/65">0{i + 1}</span>
                <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-gold/70">
                  {etape.axe}
                </p>
                <h3 className="mt-3 font-display text-2xl leading-snug text-ivory md:text-3xl">
                  {etape.titre}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ivory/60">{etape.detail}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={160}>
          <p className="mt-9 max-w-4xl border-l-2 border-gold/50 pl-6 font-display text-xl leading-relaxed text-ivory md:text-2xl">
            {MASTER_IDENTITY.ia.trajectoire.conclusion}
          </p>
        </Reveal>
      </Section>

      {/* ============================= LE CONSTAT ============================= */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="02" label="Le constat" />
          <Display size="md" className="mt-7 max-w-3xl">
            Trois faits qu’il vaut mieux regarder en face
          </Display>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {CONSTAT.map((c, i) => (
            <Reveal key={c.n} delay={i * 90}>
              <Card className="h-full">
                <span className="font-display text-xl text-gold/60">{c.n}</span>
                <h3 className="mt-5 font-display text-2xl leading-snug text-ivory">{c.t}</h3>
                <Rule className="opacity-40" />
                <Body className="mt-4">{c.d}</Body>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============================ LE MANIFESTE ============================ */}
      <Section tone="ink" id="manifeste">
        <Reveal>
          <ChapterMark num="03" label="Le manifeste" />
          <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <Display size="lg">
              Sept thèses
              <br />
              sur l’IA et le métier
            </Display>
            <Body className="lg:pb-3">
              Ces règles ne décrivent pas ce que la technologie permet, mais ce qu’un professionnel
              de la musique s’autorise à lui confier. Elles sont volontairement courtes : elles
              doivent pouvoir être opposées à un argument commercial.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {THESES.map((t, i) => (
            <Reveal key={t.n} delay={i * 60}>
              <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink-2 p-7">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-gold/80">{t.n}</span>
                  <span className="text-[0.625rem] font-semibold uppercase tracking-wider text-gold/60">
                    Thèse {t.n}
                  </span>
                </div>
                <h3 className="mt-4 font-display text-xl leading-snug text-ivory">{t.t}</h3>
                <Rule className="my-3 opacity-30" />
                <p className="mt-2 text-sm leading-relaxed text-ivory/60 flex-1">{t.d}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================= CE QUE C'EST / N'EST PAS ======================= */}
      <Section tone="dark" id="musicien-augmente">
        <Reveal>
          <ChapterMark num="04" label="Le concept" />
          <Display size="md" className="mt-7 max-w-3xl">
            Musicien Augmenté™, précisément
          </Display>
        </Reveal>

        <Body className="mt-6 max-w-4xl">{IDENTITY.concept.definition}</Body>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Reveal>
            <Card tone="dark" className="h-full border-l-2 border-l-gold">
              <p className="eyebrow text-gold">Ce que c’est</p>
              <ul className="mt-6 space-y-4">
                {EST.map((item) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-ivory/75">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-gold" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          <Reveal delay={120}>
            <Card tone="dark" className="h-full border-l-2 border-l-crimson">
              <p className="eyebrow text-crimson">Ce que ce n’est pas</p>
              <ul className="mt-6 space-y-4">
                {NEST_PAS.map((item) => (
                  <li key={item} className="flex gap-4 text-sm leading-relaxed text-ivory/75">
                    <span aria-hidden className="mt-2 h-1 w-1 shrink-0 bg-crimson" />
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        </div>

      </Section>

      {/* ============================ TERRAINS ============================ */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="05" label="Terrains d’augmentation" />
          <Display size="md" className="mt-7 max-w-3xl">
            Où l’IA augmente réellement un professionnel
          </Display>
        </Reveal>
        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((d, i) => (
            <Reveal key={d.title} delay={i * 80}>
              <Card className="flex h-full flex-col">
                <h3 className="font-display text-2xl text-ivory">{d.title}</h3>
                <Rule className="opacity-40" />
                <p className="mt-4 text-sm italic text-gold/80">{d.intro}</p>
                <ul className="mt-6 space-y-2">
                  {d.items.map((item) => (
                    <li key={item} className="flex items-baseline gap-3 text-sm text-ivory/65">
                      <span aria-hidden className="h-1 w-1 shrink-0 translate-y-[-3px] bg-gold/70" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================= PARCOURS DE MISE EN ŒUVRE ======================= */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="06" label="Méthode" />
          <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
            <Display size="lg">
              De l’intention
              <br />
              à l’autonomie
            </Display>
            <Body className="lg:pb-3">
              La méthode est la même pour un musicien seul, une école ou une institution : comprendre
              la pratique, fixer les règles, travailler sur des cas réels, puis rendre la structure
              capable de continuer sans le formateur.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-px border border-white/8 bg-white/8 md:grid-cols-4">
          {PARCOURS.map((p, i) => (
            <Reveal key={p.t} delay={i * 90}>
              <div className="h-full bg-ink p-7">
                <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-2xl text-ivory">{p.t}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ivory/55">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============================ FORMATS ============================ */}
      <Section tone="ink" id="formats">
        <Reveal>
          <ChapterMark num="07" label="Formats" />
          <Display size="md" className="mt-7 max-w-3xl">
            Quatre façons de travailler ensemble
          </Display>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {FORMATS.map((f, i) => (
            <Reveal key={f.t} delay={i * 80}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-8">
                <div>
                  <h3 className="font-display text-2xl leading-snug text-ivory">{f.t}</h3>
                  <Rule className="opacity-40 my-4" />
                  <p className="text-sm leading-relaxed text-ivory/70">{f.d}</p>
                  <p className="mt-5 text-xs text-ivory/50">
                    <span className="text-gold font-semibold uppercase tracking-wider">Public cible — </span>
                    {f.audience}
                  </p>
                </div>
                <div className="mt-7 border-t border-white/5 pt-4">
                  <ArrowLink to={f.to}>Ouvrir ce parcours</ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ============================== FAQ ============================== */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="08" label="Questions fréquentes" />
          <Display size="md" className="mt-7 max-w-3xl">
            Les objections légitimes, traitées directement
          </Display>
        </Reveal>
        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {FAQ.map((item, i) => (
            <Reveal key={item.q} delay={i * 60}>
              <details className="group py-6">
                <summary className="flex cursor-pointer items-baseline justify-between gap-6 font-display text-xl text-ivory marker:content-none md:text-2xl">
                  {item.q}
                  <span
                    aria-hidden
                    className="shrink-0 text-gold transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-4 max-w-3xl text-[15px] leading-[1.85] text-ivory/60">{item.a}</p>
              </details>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================= PARCOURS DE LECTURE ========================= */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="09" label="Parcours de lecture" />
          <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Display size="md">Approfondir la position</Display>
            <Body className="lg:pb-2">
              Ces sept articles développent, point par point, les fondements du Musicien Augmenté™.
              Ils constituent la série fondatrice du Journal et renvoient chacun vers une mise en
              pratique professionnelle.
            </Body>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {piliers.map((a, i) => (
            <Reveal key={a.slug} delay={i * 60}>
              <Link to={`/journal/${a.slug}`} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-7 transition-colors group-hover:border-gold/50">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg text-gold/80">Pilier {a.num}</span>
                      <span className="text-[0.62rem] uppercase tracking-wider text-ivory/45">
                        {a.readingTime}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl leading-snug text-ivory transition-colors group-hover:text-gold-2">
                      {a.title}
                    </h3>
                    <div className="mt-3">
                      <Tag tone={a.status === 'Publié' ? 'gold' : 'ink'}>{a.category}</Tag>
                    </div>
                    <p className="mt-4 text-xs leading-relaxed text-ivory/60 line-clamp-3">
                      {a.excerpt}
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

        <Reveal delay={140}>
          <div className="mt-12 flex flex-wrap items-center gap-6">
            <Btn to="/journal" variant="ghost">
              Lire les sept piliers
            </Btn>
            <span className="text-[0.68rem] uppercase tracking-[0.2em] text-ivory/40">
              Série « Après la MAO, l’IA »
            </span>
          </div>
        </Reveal>
      </Section>

      {/* ================== RENVOI MANIFESTE → FORMATION / CONTACT ================== */}
      <Section tone="dark" tight>
        <Reveal>
          <div className="grid gap-10 border border-gold/25 bg-ink-2 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <Eyebrow>Passer à la pratique</Eyebrow>
              <h2 className="mt-5 font-display text-3xl leading-snug text-ivory md:text-4xl">
                Un manifeste ne vaut que s’il change une pratique.
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.9] text-ivory/65">
                Dites-moi où vous en êtes — musicien, école, institution — et nous définirons le
                format le plus utile : une conférence pour ouvrir le sujet, une masterclass pour
                travailler, une formation longue pour installer la méthode.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <Btn to="/contact#formation" variant="gold">
                Demander une formation
              </Btn>
              <Btn to="/contact#conference" variant="ghost">
                Inviter une conférence
              </Btn>
              <Link
                to="/a-propos"
                className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-ivory/50 hover:text-gold"
              >
                Qui est Hervé Nanfang →
              </Link>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="IA · Musique · Pédagogie · Culture"
        title="Parlons de votre réalité avant de parler d’outils"
        text="Chaque intervention commence par une question : quel est votre métier, et qu’est-ce qui vous coûte du temps aujourd’hui ?"
        primary={{ label: 'Ouvrir un parcours', to: '/contact#formation' }}
        secondary={{ label: 'Voir toutes les conférences', to: '/conferences' }}
      />
    </>
  )
}
