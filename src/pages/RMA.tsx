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
    desc: 'Solfège, dictée, ear training, harmonie tonale, analyse et culture musicale. Transversal à toutes les disciplines instrumentales de la RMA.',
    levels: ['Tous niveaux'],
  },
]

const PROGRAMMES = [
  {
    title: 'Cours individuel hebdomadaire',
    text: 'Piano, chant, guitare, basse ou batterie : cours de 45 min à 1 h, plan de progression personnalisé selon le palier Permis de Jouer™, suivi trimestriel et accès aux ressources pédagogiques RMA.',
    icon: '♩',
    highlights: [
      'Studio RMA Yaoundé ou cours à distance (Zoom / WhatsApp)',
      "Entrée possible tout au long de l'année",
      'Séance diagnostique gratuite au premier cours',
    ],
  },
  {
    title: 'Vacances Utiles — 7 semaines',
    text: 'Programme intensif estival pour enfants dès 6 ans et adultes débutants : socle RMA-01 (Pulsation & Body), clavier, lecture et restitution collective finale Damas–Petits Génies.',
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
    title: 'RMA — Racines Musicales Academy® | Hervé Nanfang',
    description:
      'Racines Musicales Academy® : formation musicale, pédagogie, Permis de Jouer™, transmission et conception de curricula. Piano, chant, guitare, batterie à Yaoundé.',
    path: '/rma',
    jsonLd: [
      personSchema,
      serviceSchema(
        'Racines Musicales Academy®',
        'Formation musicale, pédagogie, ateliers, masterclass et accompagnement de structures culturelles et éducatives.',
        'Formation musicale',
      ),
      courseSchema(
        'Racines Musicales Academy®',
        'Parcours de formation musicale structuré, incluant pratique instrumentale, pédagogie, évolution et patrimoine culturel.',
        'Racines Musicales Academy®',
      ),
      permisDeJouerProgramSchema(),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'RMA', path: '/rma' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="RMA"
        eyebrow="Racines Musicales Academy®"
        title="Former des musiciens capables de jouer, comprendre, transmettre et évoluer"
        lead="La RMA est un dispositif de formation musicale fondé sur une conviction : apprendre la musique ne devrait jamais signifier perdre son identité. Méthode rigoureuse, patrimoine africain vivant, progression lisible."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="6" label="Disciplines" />
          <Stat value="4" label="Paliers Permis" />
          <Stat value="3" label="Programmes" />
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
            La RMA ne forme pas des élèves standardisés. Elle construit des musiciens capables
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
            Ce que disent les élèves et partenaires de la RMA
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Élèves adultes, enfants, musiciens professionnels et responsables pédagogiques — ils témoignent de leur parcours au sein de la Racines Musicales Academy®.
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
              <Eyebrow>Ce que la RMA apporte</Eyebrow>
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
      <Section tone="dark" id="inscriptions">
        <Reveal>
          <RMAAuditionForm />
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="RMA • Transmission"
        title="Créer un parcours de formation solide"
        text="Pour une école, un centre culturel, un organisme de formation ou un projet d'accompagnement pédagogique, la RMA propose des dispositifs sur mesure adaptés à chaque contexte."
        primary={{ label: 'Parler de la RMA', to: '/contact#formation' }}
        secondary={{ label: 'Voir les services', to: '/services' }}
      />
    </>
  )
}
