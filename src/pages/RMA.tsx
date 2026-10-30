import PageHero from '../components/PageHero'
import PermisDeJouerVisualizer from '../components/PermisDeJouerVisualizer'
import RMAAuditionForm from '../components/RMAAuditionForm'
import {
  ArrowLink,
  Body,
  Btn,
  ChapterMark,
  CtaBand,
  Display,
  Eyebrow,
  Lead,
  Reveal,
  Rule,
  Section,
  SpotlightCard,
  Stat,
} from '../components/ui'
import { SITE } from '../data/site'
import { TESTIMONIALS } from '../data/testimonials'
import { breadcrumbSchema, courseSchema, permisDeJouerProgramSchema, personSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const DISCIPLINES = [
  {
    num: '01',
    title: 'Piano',
    desc: 'Technique classique, accompagnement jazz, improvisation, lecture et harmonie appliquée. Du débutant absolu au musicien confirmé qui cherche à structurer sa pratique.',
    levels: ['Éveil', 'Intermédiaire', 'Avancé', 'Professionnel'],
  },
  {
    num: '02',
    title: 'Chant',
    desc: 'Technique vocale, placement, respiration, justesse, phrasé et interprétation. Travail sur les répertoires africains contemporains, jazz, gospel et variété.',
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
  },
  {
    num: '03',
    title: 'Guitare',
    desc: 'Rythmique, arpèges, accords, tablature et lecture de partition. Styles acoustique et électrique, avec une attention particulière aux musiques africaines.',
    levels: ['Débutant', 'Intermédiaire', 'Avancé'],
  },
  {
    num: '04',
    title: 'Basse',
    desc: 'Lecture de ligne de basse, groove, fondamentaux rythmiques, interaction avec la batterie et comping. Contextes pop, afrobeat et studio.',
    levels: ['Débutant', 'Intermédiaire'],
  },
  {
    num: '05',
    title: 'Batterie & Percussions',
    desc: "Coordination, rudiments, polyrythmie, jeu en groupe et indépendance des membres. Intégration des patrons rythmiques d'Afrique centrale.",
    levels: ['Éveil', 'Intermédiaire', 'Avancé'],
  },
  {
    num: '06',
    title: 'Formation musicale',
    desc: 'Solfège, dictée, ear training, harmonie tonale, analyse et culture musicale. Transversal à toutes les disciplines instrumentales de A Laiz Academy.',
    levels: ['Tous niveaux'],
  },
]

const ACADEMY_ARCHITECTURE = [
  {
    num: '01',
    title: 'Permis de Jouer™',
    subtitle: 'Référentiel Paliers N1 à N4',
    desc: 'Cadre méthodologique continu d’évaluation et d’autonomie instrumentale au clavier, guitare, basse et chant.',
    to: '#permis-de-jouer',
  },
  {
    num: '02',
    title: 'Les Zikos®',
    subtitle: 'Éveil & Pratique d’ensemble',
    desc: 'Manuel pédagogique complet (68 pages) et répertoire collectif progressif adapté dès 6 ans.',
    to: '/pedagogie#publications',
  },
  {
    num: '03',
    title: 'Formation musicale',
    subtitle: 'Harmonie, Solfège & Oreille',
    desc: 'Entendre, chanter, nommer et transcrire les structures harmoniques et rythmiques sans théorie bloquante.',
    to: '#disciplines',
  },
  {
    num: '04',
    title: 'MAO & Studio',
    subtitle: 'Production & Enregistrement',
    desc: 'Initiation et perfectionnement aux séquenceurs (DAW), à la prise de son et à la gestion d’un home studio.',
    to: '/services#studio',
  },
  {
    num: '05',
    title: 'Composition & Arrangement',
    subtitle: 'Écriture & Scène',
    desc: 'Techniques d’arrangement, orchestration live band, harmonisation moderne et travail pour la scène.',
    to: '/musique',
  },
  {
    num: '06',
    title: 'Musicologie & Patrimoine',
    subtitle: 'Traditions orales & Polyrythmies',
    desc: 'Analyse des systèmes polyrythmiques d’Afrique centrale (Bikutsi, Batoufam) et documentation vivante.',
    to: '/culture-recherche',
  },
  {
    num: '07',
    title: 'Ressources pédagogiques',
    subtitle: 'Curricula & Masterclasses',
    desc: 'Fiches didactiques, livrets d’exercices, formation continue d’enseignants et masterclasses sur mesure.',
    to: '/pedagogie',
  },
]

const PROGRAMMES = [
  {
    title: 'Cours individuel hebdomadaire',
    text: 'Piano, chant, guitare, basse ou batterie : cours de 45 min à 1 h, plan de progression personnalisé selon le palier Permis de Jouer, suivi trimestriel et accès aux ressources pédagogiques A Laiz Academy.',
    icon: '♩',
    highlights: [
      'Studio A Laiz Academy Yaoundé ou cours à distance (Zoom / WhatsApp)',
      "Entrée possible tout au long de l'année",
      'Séance diagnostique gratuite au premier cours',
    ],
  },
  {
    title: 'Vacances Utiles — 7 semaines',
    text: 'Programme intensif estival pour enfants dès 6 ans et adultes débutants : socle ALA-01 (Pulsation & Body, ex-RMA), clavier, lecture et restitution collective finale Damas–Petits Génies.',
    icon: '☀',
    highlights: [
      'Module 1 : Pulsation & Body (ancrage rythmique corporel)',
      'Module 2 : Clavier & lecture de partition',
      'Module 3 : Culture musicale & répertoire africain',
      'Livret de progression offert à chaque participant',
    ],
  },
  {
    title: 'Formation de formateurs',
    text: "Accompagnement de directions pédagogiques, de conservatoires et d'associations musicales : conception de curricula, outils d'évaluation par compétences, journées pédagogiques et formation continue.",
    icon: '◈',
    highlights: [
      'Livraison de grilles, fiches et plans de cours opérationnels',
      'Disponible en présentiel ou 100 % distanciel',
      'Partenariats institutionnels et conventions sur mesure',
    ],
  },
]

const VALEURS = [
  { v: 'Rigueur sans rigidité', d: "Exigence de fond, méthode progressive, bienveillance dans l'erreur." },
  { v: 'Pratique avant théorie', d: "On joue d'abord. On nomme ce qu'on entend ensuite." },
  { v: 'Patrimoine et modernité', d: 'Musiques africaines et contemporaines dans la même pédagogie.' },
  { v: 'Transmission durable', d: "Former l'élève à continuer sans le professeur." },
]

export default function RMA() {
  useSeo({
    title: 'A Laiz Academy | Hervé Nanfang — Musique & Pédagogie (ex-RMA)',
    description:
      "A Laiz Academy (ex-Racines Musicales Academy — RMA) : formation musicale d'excellence, méthode Permis de Jouer™ et transmission par Hervé Nanfang.",
    path: '/rma',
    jsonLd: [
      personSchema,
      serviceSchema(
        'A Laiz Academy',
        'Formation musicale d’excellence, pédagogie, ateliers, masterclass et accompagnement de structures éducatives (anciennement Racines Musicales Academy).',
        'Formation musicale',
      ),
      courseSchema(
        'A Laiz Academy',
        'Parcours de formation musicale structuré, incluant pratique instrumentale, pédagogie, évolution et patrimoine culturel (anciennement Racines Musicales Academy).',
        'A Laiz Academy',
      ),
      permisDeJouerProgramSchema(),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Formation & Transmission', path: '/pedagogie' },
        { name: 'A Laiz Academy', path: '/rma' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="A Laiz Academy"
        eyebrow="A Laiz Academy · Formation & Transmission"
        title="Former des musiciens capables de créer, comprendre, transmettre et évoluer"
        lead="A Laiz Academy (anciennement Racines Musicales Academy — RMA) est le pôle de formation musicale d’Hervé Nanfang fondé sur une conviction : apprendre la musique ne devrait jamais signifier perdre son identité. Méthode rigoureuse, patrimoine africain vivant, progression lisible."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="7" label="Pôles d'enseignement" />
          <Stat value="4" label="Paliers Permis" />
          <Stat value="6" label="Disciplines" />
          <Stat value="Live" label="& transmission" />
        </div>
      </PageHero>

      {/* ======================== MISSION ======================== */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="01" label="Mission" />
          <Display size="md" className="mt-7 max-w-3xl">
            Rendre le savoir musical profond, lisible et transmissible
          </Display>
          <Lead className="mt-6 max-w-3xl">
            A Laiz Academy ne forme pas des élèves standardisés. Elle construit des musiciens capables
            de comprendre ce qu'ils jouent, de le transmettre, et de s'adapter à un contexte
            en perpétuelle mutation — sans sacrifier leur ancrage culturel.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALEURS.map((val, i) => (
            <Reveal key={val.v} delay={i * 60}>
              <div className="border border-white/10 bg-ink-2 p-6 h-full">
                <p className="eyebrow text-gold">{String(i + 1).padStart(2, '0')}</p>
                <p className="mt-5 font-display text-xl text-ivory leading-snug">{val.v}</p>
                <p className="mt-3 text-sm leading-relaxed text-ivory/55">{val.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== ARCHITECTURE A LAIZ ACADEMY ======================== */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="02" label="Architecture Pédagogique" />
          <Display size="md" className="mt-7 max-w-3xl">
            A Laiz Academy : Les Sept Piliers de Transmission
          </Display>
          <Lead className="mt-6 max-w-3xl">
            L'académie organise l'ensemble de ses parcours autour d'une arborescence complète : de l’éveil à l’autonomie instrumentale, de la production MAO aux polyrythmies patrimoniales.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ACADEMY_ARCHITECTURE.map((p, i) => (
            <Reveal key={p.title} delay={i * 50}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink p-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold font-bold">{p.num}</span>
                    <span className="text-[0.62rem] uppercase tracking-wider text-ivory/40 font-mono">Pôle ALA</span>
                  </div>
                  <h3 className="mt-3 font-display text-xl text-ivory">{p.title}</h3>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-wider text-gold/80 font-mono">{p.subtitle}</p>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/65">{p.desc}</p>
                </div>
                <div className="mt-6 border-t border-white/8 pt-3">
                  <ArrowLink to={p.to}>Explorer</ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== DISCIPLINES ======================== */}
      <Section tone="ink" id="disciplines">
        <Reveal>
          <ChapterMark num="02" label="Disciplines" />
          <div className="mt-7 grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Display size="md">Six disciplines, une même méthode</Display>
            <Body className="lg:pb-2">
              Chaque instrument est enseigné avec la même logique pédagogique : comprendre
              avant de reproduire, pratiquer avant de théoriser, progresser par paliers validés
              et explicites.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {DISCIPLINES.map((disc, i) => (
            <Reveal key={disc.title} delay={i * 60}>
              <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink p-7">
                <div className="flex items-start justify-between">
                  <p className="font-display text-3xl text-gold/60">{disc.num}</p>
                  <p className="mt-1 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">
                    {disc.levels.join(' · ')}
                  </p>
                </div>
                <h3 className="mt-4 font-display text-2xl text-ivory">{disc.title}</h3>
                <Rule className="opacity-30 my-4" />
                <p className="text-sm leading-relaxed text-ivory/60 flex-1">{disc.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== PERMIS DE JOUER ======================== */}
      <Section tone="dark" id="permis-de-jouer">
        <PermisDeJouerVisualizer />
      </Section>

      {/* ======================== PROGRAMMES ======================== */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="04" label="Programmes" />
          <Display size="md" className="mt-7">
            Formations et dispositifs d'accompagnement
          </Display>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {PROGRAMMES.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink p-8">
                <div>
                  <span className="font-display text-4xl text-gold/30">{p.icon}</span>
                  <h3 className="mt-5 font-display text-xl text-ivory leading-snug">{p.title}</h3>
                  <Rule className="opacity-30 my-5" />
                  <p className="text-sm leading-relaxed text-ivory/60">{p.text}</p>
                  {'highlights' in p && (p as { title: string; text: string; icon: string; highlights: string[] }).highlights && (
                    <ul className="mt-5 space-y-2">
                      {(p as { title: string; text: string; icon: string; highlights: string[] }).highlights.map((h) => (
                        <li key={h} className="flex items-start gap-2 text-xs text-ivory/50">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-gold/50" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="mt-8 border-t border-white/5 pt-5">
                  <ArrowLink to="/contact#formation">Demander ce programme</ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== TÉMOIGNAGES ======================== */}
      <Section tone="dark" id="temoignages">
        <Reveal>
          <ChapterMark num="05" label="Témoignages" />
          <Display size="md" className="mt-7 max-w-3xl">
            Ce que disent les élèves et partenaires de A Laiz Academy
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Élèves adultes, enfants, musiciens professionnels et responsables pédagogiques — ils témoignent de leur parcours au sein de A Laiz Academy (anciennement Racines Musicales Academy — RMA).
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.id} delay={i * 70}>
              <div className="flex h-full flex-col border border-white/10 bg-ink-2 p-7">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold/20 font-display text-sm font-semibold text-gold">
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-display text-base text-ivory">{t.name}</p>
                    <p className="mt-0.5 text-[0.66rem] uppercase tracking-[0.15em] text-ivory/50">{t.discipline}</p>
                  </div>
                </div>
                {t.palier && (
                  <span className="mt-4 inline-block self-start rounded border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-widest text-gold">
                    {t.palier}
                  </span>
                )}
                <blockquote className="mt-5 flex-1 border-l-2 border-gold/30 pl-4 text-sm italic leading-relaxed text-ivory/65">
                  « {t.body} »
                </blockquote>
                <div className="mt-5 border-t border-white/8 pt-4">
                  <p className="text-[0.62rem] text-ivory/40">{t.role} · {t.location}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ======================== CONTACT ======================== */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="05" label="Contact & Inscription" />
        </Reveal>
        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <Reveal>
            <div className="border border-white/10 bg-ink-2 p-8 h-full">
              <Eyebrow>Ce que A Laiz Academy apporte</Eyebrow>
              <ul className="mt-8 space-y-5">
                {[
                  'Une progression claire de la pratique à la compréhension',
                  "Des critères d'évaluation compréhensibles pour l'élève et ses encadrants",
                  'Une transmission articulée entre patrimoine, technique et contexte contemporain',
                  "Un cadre accueillant pour l'apprentissage musical comme projet durable",
                  'Des ressources pédagogiques (méthodes, fiches, plans de progression)',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-ivory/65">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="border border-gold/30 bg-ink p-8 h-full flex flex-col justify-between">
              <div>
                <Eyebrow>Prendre contact</Eyebrow>
                <p className="mt-6 font-display text-2xl text-ivory leading-snug">
                  Demander une séance, un programme ou un accompagnement sur mesure.
                </p>
                <p className="mt-5 text-sm leading-relaxed text-ivory/55">
                  Pour une inscription individuelle, un partenariat avec une école ou une
                  institution, ou une demande de formation d'enseignants : chaque situation
                  est analysée et chaque dispositif est conçu sur mesure.
                </p>
              </div>
              <div className="mt-8 space-y-4">
                <Btn to="/contact#formation" variant="gold" className="w-full text-center justify-center">
                  Ouvrir le formulaire
                </Btn>
                <a
                  href={`mailto:${SITE.emailRma}`}
                  className="block text-center text-sm text-gold hover:text-gold-2 transition-colors"
                >
                  {SITE.emailRma}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ======================== CANDIDATURE & AUDITION ======================== */}
      <div id="audition" className="scroll-mt-20">
        <Section tone="dark" id="inscriptions">
          <Reveal>
            <div className="mb-10 overflow-hidden rounded-sm border border-gold/30 bg-gradient-to-br from-gold/15 via-ink-2 to-ink shadow-2xl">
              <div className="grid md:grid-cols-12 items-stretch">
                <div className="md:col-span-4 relative min-h-[220px] overflow-hidden bg-ink-2">
                  <img
                    src="/images/cours-isma-synthese-1241.webp"
                    alt="15 Sessions d’Audition & Diagnostic Gratuit — A Laiz Academy (ex-RMA)"
                    className="h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-ink" />
                  <div className="absolute bottom-3 left-3 z-10">
                    <span className="rounded border border-gold/40 bg-ink/85 px-2.5 py-1 text-[0.62rem] font-mono text-gold uppercase tracking-wider backdrop-blur-sm">
                      ✦ 15 Auditions Gratuites
                    </span>
                  </div>
                </div>
                <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <p className="eyebrow text-gold font-mono">✦ Référentiel Permis de Jouer</p>
                      <h3 className="mt-1 font-display text-2xl md:text-3xl text-ivory">
                        Séance Diagnostique & Positionnement par Paliers — A Laiz Academy
                      </h3>
                    </div>
                    <div className="rounded border border-gold/40 bg-gold/20 px-3 py-1.5 text-xs font-mono text-gold self-start sm:self-auto shrink-0">
                      15 min offertes · Studio Damas ou Visio
                    </div>
                  </div>

                  <p className="mt-4 text-xs md:text-sm leading-relaxed text-ivory/70 max-w-3xl">
                    Avant toute inscription à l'académie, chaque élève (enfant ou adulte) bénéficie d'une séance diagnostique gratuite.
                    Nous évaluons l'oreille musicale, la mémoire mélodique et la pulsation pour recommander le palier adapté :
                  </p>
                </div>
              </div>

              <div className="p-6 md:p-8 pt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  {
                    code: 'N1',
                    label: 'Éveil & Ancrage',
                    focus: 'Pulsation corporelle, frappe, repérage des touches et décontraction.',
                    target: 'Débutant absolu dès 6 ans & adultes',
                  },
                  {
                    code: 'N2',
                    label: 'Autonomie Clavier',
                    focus: 'Lecture de partition, triades fondamentales, jeu à deux mains synchrone.',
                    target: '1 à 2 ans de pratique ou autodidacte',
                  },
                  {
                    code: 'N3',
                    label: 'Harmonie & Comping',
                    focus: 'Accords 7e/9e, voicings jazz, cadences Makossa / Afrobeat, comping vocal.',
                    target: 'Musicien souhaitant jouer en groupe',
                  },
                  {
                    code: 'N4',
                    label: 'Scène & Performance',
                    focus: 'Improvisation, réactivité live, studio, arrangements et identité artistique.',
                    target: 'Objectif semi-pro ou professionnel',
                  },
                ].map((p) => (
                  <div key={p.code} className="rounded border border-white/10 bg-ink p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-bold text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                          Palier {p.code}
                        </span>
                        <span className="text-[0.62rem] text-ivory/40 uppercase tracking-wider font-mono">Permis ALA</span>
                      </div>
                      <h4 className="mt-3 font-display text-lg text-ivory">{p.label}</h4>
                      <p className="mt-2 text-[0.72rem] leading-relaxed text-ivory/65">{p.focus}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5">
                      <p className="text-[0.65rem] italic text-gold/80">Cible : {p.target}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

            <RMAAuditionForm />
          </Reveal>
        </Section>
      </div>

      <CtaBand
        eyebrow="A Laiz Academy • Transmission"
        title="Créer un parcours de formation solide"
        text="Pour une école, un centre culturel, un organisme de formation ou un projet d'accompagnement pédagogique, A Laiz Academy propose des dispositifs sur mesure adaptés à chaque contexte."
        primary={{ label: 'Échanger avec A Laiz Academy', to: '/contact#formation' }}
        secondary={{ label: 'Voir les services', to: '/services' }}
      />
    </>
  )
}
