import PageHero from '../components/PageHero'
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
import { breadcrumbSchema, courseSchema, personSchema, serviceSchema } from '../lib/schema'
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

const PERMIS_PALIERS = [
  {
    palier: 'Permis A',
    couleur: 'Blanc',
    objectif: 'Prendre ses marques',
    competences: [
      'Posture et installation correcte',
      'Lecture des premières notes / premiers accords',
      'Reproduction de 3 courtes pièces',
      'Notions de pulsation et de mesure',
    ],
  },
  {
    palier: 'Permis B',
    couleur: 'Jaune',
    objectif: 'Progresser avec méthode',
    competences: [
      "Lecture courante sur l'étendue de l'instrument",
      "Maîtrise d'une gamme pentatonique et diatonique",
      "Jeu d'une pièce de mémoire avec expression",
      'Collaboration musicale basique (duo)',
    ],
  },
  {
    palier: 'Permis C',
    couleur: 'Orange',
    objectif: 'Affirmer son identité',
    competences: [
      'Improvisation libre sur grille harmonique',
      "Création d'un arrangement personnel",
      'Répertoire de 8 pièces maîtrisées',
      'Transmission : expliquer une notion à un débutant',
    ],
  },
  {
    palier: 'Permis D',
    couleur: 'Rouge',
    objectif: 'Exercer son métier',
    competences: [
      'Projet musical complet (live, studio ou pédagogie)',
      'Répertoire professionnel et répertoire de création',
      'Masterclass ou récital validé par un jury',
      'Dossier artistique constitué',
    ],
  },
]

const PROGRAMMES = [
  {
    title: 'Formation musicale individuelle',
    text: 'Cours hebdomadaires adaptés au niveau, aux objectifs et au rythme de chaque apprenant. Suivi continu avec plan de progression individualisé.',
    icon: '♩',
  },
  {
    title: "Formation d'enseignants",
    text: "Conception de curriculum, méthodes de progression, outils d'évaluation, pédagogie active et accompagnement de structures éducatives.",
    icon: '◈',
  },
  {
    title: 'Ateliers & masterclass',
    text: 'Formats intensifs pour conservatoires, écoles, associations et publics professionnels : thématiques ciblées, durée adaptée, restitution publique.',
    icon: '⬡',
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
        <Reveal>
          <ChapterMark num="03" label="Permis de Jouer™" />
          <div className="mt-7 grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <Display size="md">Un système de progression en quatre paliers</Display>
            <Body className="lg:pb-2">
              Le Permis de Jouer™ rend l'apprentissage musical lisible pour l'élève, ses
              parents et l'enseignant. Quatre niveaux, des compétences validées, des objectifs
              explicites — pas de progression invisible ni d'évaluation arbitraire.
            </Body>
          </div>
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {PERMIS_PALIERS.map((p, i) => (
            <Reveal key={p.palier} delay={i * 70}>
              <div className="relative border border-white/10 bg-ink-2 p-7 h-full">
                <div className="flex items-baseline justify-between">
                  <p className="font-display text-2xl text-gold">{p.palier}</p>
                  <span className="text-[0.6rem] uppercase tracking-widest text-ivory/30 border border-white/10 px-2 py-1">
                    {p.couleur}
                  </span>
                </div>
                <p className="mt-2 text-[0.7rem] uppercase tracking-[0.15em] text-ivory/45">
                  {p.objectif}
                </p>
                <Rule className="opacity-20 my-5" />
                <ul className="space-y-3">
                  {p.competences.map((c) => (
                    <li key={c} className="flex items-start gap-2.5 text-sm leading-relaxed text-ivory/60">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/60" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
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
                </div>
                <div className="mt-8 border-t border-white/5 pt-5">
                  <ArrowLink to="/contact#formation">Demander ce programme</ArrowLink>
                </div>
              </SpotlightCard>
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
