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
  Tag,
} from '../components/ui'

import { courseSchema, creativeWorkSchema, breadcrumbSchema, permisDeJouerProgramSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

const AXES = [
  {
    t: 'Enseignement supérieur',
    d: "ESAS (École Supérieure des Arts et du Spectacle), ISMA (Institut Supérieur de Musique et des Arts) et autres établissements : cours, encadrement de mémoires et de projets artistiques, formation d'étudiants et d'enseignants.",
    tags: ['Musicologie', 'MAO', 'Mémoires', 'Projets artistiques'],
  },
  {
    t: 'Conception de curricula',
    d: "Ingénierie de formation : analyse des besoins, structuration des objectifs, progressions par niveaux, outils d'évaluation et accompagnement des équipes pédagogiques. De la définition du cadre à la mise en œuvre opérationnelle.",
    tags: ['Conception', 'Progression', 'Évaluation', 'Accompagnement'],
  },
  {
    t: 'Musicologie & cultures africaines',
    d: "Histoire de la musique, analyse stylistique, esthétique contemporaine et méthodes de recherche appliquées aux musiques africaines et populaires. Intégration dans les curricula de conservatoires et d'universités.",
    tags: ['Histoire', 'Analyse', 'Patrimoine', 'Recherche'],
  },
]

const INSTITUTIONS = [
  {
    nom: 'ESAS',
    full: 'École Supérieure des Arts du Spectacle',
    ville: 'Lomé, Togo',
    role: 'Enseignant titulaire depuis 2022 : MAO, musicologie appliquée aux médias visuels et technique de composition musicale.',
  },
  {
    nom: 'ISMA',
    full: 'Institut Supérieur des Métiers des Arts',
    ville: 'Bénin',
    role: 'Enseignant (2022–2026) : contribution à la formation supérieure aux métiers des arts et des technologies du son.',
  },
  {
    nom: 'IBA Nkongsamba',
    full: 'Institut des Beaux-Arts de Nkongsamba',
    ville: 'Nkongsamba, Cameroun',
    role: 'Enseignant remplaçant en musicologie (2021–2022) : histoire de la musique, analyse d’œuvres, musiques de film, intermédiarité et politiques musicales.',
  },
  {
    nom: 'IFCPA / CRTV',
    full: 'Institut de Formation et de Conservation du Patrimoine Audiovisuel',
    ville: 'Yaoundé, Cameroun',
    role: 'Enseignant vacataire en audiofréquence (2020–2021) : MAO, prise et traitement du son, formes et genres musicaux, travaux dirigés.',
  },
  {
    nom: 'A Laiz Academy',
    full: 'A Laiz Academy (ex-Racines Musicales Academy)',
    ville: 'Yaoundé, Cameroun',
    role: 'Fondateur — conception de curricula, référentiel Permis de Jouer (N1 à N4), socle ALA-01 (Pulsation & Body) et Programme Vacances Utiles.',
  },
]

const VOCATION = [
  {
    label: 'Enseignement supérieur',
    text: "Cours de musicologie, MAO et composition à l'ESAS, à l'ISMA et auprès d'instituts des beaux-arts et d'écoles d'audiovisuel.",
  },
  {
    label: 'Milieu scolaire & conservatoires',
    text: 'Éducation musicale, initiation instrumentale, chorales et éveil artistique (Lycée Jean-Tabi, EFB Saint-Hubert, Collège L’Excellence, Arbre à Musique).',
  },
  {
    label: 'Professionnels & enseignants',
    text: 'Formation continue pour enseignants, musiciens et structures souhaitant structurer, moderniser et fiabiliser leur approche pédagogique.',
  },
]

type PedagogicalResource = {
  t: string
  group: 'disponible' | 'preparation'
  statusLabel: string
  meta: string
  d: string
  sommaire: string[]
  availability: string
  ctaLabel: string
  ctaTo: string
}

const PUBLICATIONS: PedagogicalResource[] = [
  {
    t: 'Permis de Jouer — Référentiel de progression N1 à N4',
    group: 'disponible',
    statusLabel: 'Actif · A Laiz Academy',
    meta: 'Hervé Nanfang · A Laiz Academy (ex-RMA) · Référentiel interne continu',
    d: "Référentiel pédagogique instrument-agnostique conçu au sein de A Laiz Academy pour rendre lisibles les étapes d'apprentissage, définir des objectifs clairs et valider progressivement les compétences pratiques par soutenance en situation réelle.",
    sommaire: [
      'Palier A / N1 (Ceinture Blanche) — Fondations & Éveil : posture, décontraction, lecture en clés de Sol et de Fa, pulsation et premières pièces de mémoire',
      'Palier B / N2 (Ceinture Jaune) — Autonomie & Méthode : gammes, déchiffrage à vue, indépendance des mains, nuances et jeu collectif',
      'Palier C / N3 (Ceinture Orange) — Expression & Interprétation : accords enrichis, polyrythmie africaine, improvisation modale et répertoire autonome sans partition',
      'Palier D / N4 (Ceinture Rouge) — Scène, Studio & Professionnalisation : répertoire de scène transversal, arrangement, direction musicale et récital devant jury',
    ],
    availability: 'Référentiel interne actif en vigueur au sein des cursus de A Laiz Academy ; détail des 4 paliers consultable sur cette page et sur la page A Laiz Academy (/rma).',
    ctaLabel: 'Consulter les 4 paliers du Permis de Jouer',
    ctaTo: '/rma#permis-de-jouer',
  },
  {
    t: 'ALA-01 — Fondamentaux du Musicien (Unité « Pulsation & Body », ex-RMA-01)',
    group: 'disponible',
    statusLabel: 'Actif · Cursus A Laiz Academy',
    meta: 'Hervé Nanfang · A Laiz Academy (ex-RMA) · Socle d’apprentissage · 2026',
    d: "Socle pédagogique d'initiation et de consolidation : pulsation, coordination corporelle, écoute analytique et repères collectifs (Unité « Pulsation & Body »).",
    sommaire: [
      'Pulsation et repères rythmiques fondamentaux',
      'Coordination corporelle appliquée (Unité « Pulsation & Body »)',
      'Écoute analytique et pratique collective en ensemble',
    ],
    availability: 'Module actif enseigné au sein des parcours de A Laiz Academy (Yaoundé).',
    ctaLabel: 'Candidater à une audition d’orientation',
    ctaTo: '/rma#audition',
  },
  {
    t: 'Recherches, MAO & Musique à l’image — Supports de cours & communications',
    group: 'disponible',
    statusLabel: 'Actif · Enseignement supérieur',
    meta: 'Hervé Nanfang · ESAS (Lomé, depuis 2022), ISMA (Bénin, 2022–2026), IBA Nkongsamba (2021–2022), IFCPA / CRTV (2020–2021)',
    d: "Fiches de cours spécialisées, guides méthodologiques et communications scientifiques sur l'analyse de musiques de films (Harry Potter, cinéma d'horreur africain, transmédiatisation) et les technologies du son.",
    sommaire: [
      'ESAS (Lomé, depuis 2022) : MAO, musicologie appliquée aux médias visuels et technique de composition musicale',
      'ISMA (Bénin, 2022–2026) & IFCPA / CRTV (Yaoundé, 2020–2021) : audiofréquence, prise et traitement du son, formes et genres musicaux',
      'IBA Nkongsamba (2021–2022) & Recherche (Master II, Univ. Yaoundé I, 2024) : analyse d’œuvres, bandes originales (Harry Potter, cinéma d’horreur africain), intermédiarité et politiques musicales',
    ],
    availability: 'Supports destinés aux enseignements universitaires et communications scientifiques ; plans d’intervention transmissibles sur demande institutionnelle.',
    ctaLabel: 'Solliciter une intervention ou un plan de cours',
    ctaTo: '/contact#formation',
  },
  {
    t: 'Les Zikos — Manuel pédagogique (68 pages)',
    group: 'preparation',
    statusLabel: 'En cours de restructuration éditoriale',
    meta: 'Hervé Nanfang · Manifeste A Laiz Ô Pays · Manuel pédagogique de 68 pages · 2026',
    d: "Ouvrage pédagogique de référence de 68 pages en cours de restructuration éditoriale et graphique : progression par unités thématiques, harmonisation des notions et exercices instrumentaux applicables dès le premier cours.",
    sommaire: [
      'Progression méthodologique : de la pulsation corporelle et de l’oreille musicale vers la lecture de partition et les notions harmoniques fondamentales',
      'Structure par unité : plan de cours, exercices pratiques, grille d’évaluation et bibliographie de référence',
    ],
    availability: 'Ouvrage en cours de restructuration éditoriale et graphique pour publication officielle (non commercialisé à ce stade).',
    ctaLabel: 'Être informé de la parution ou demander une présentation',
    ctaTo: '/contact#formation',
  },
  {
    t: 'Tswefap — Système d’écriture & patrimoine Batoufam',
    group: 'preparation',
    statusLabel: 'Recherche & rédaction en cours',
    meta: 'Hervé Nanfang · Projet Batoufam · Recherche linguistique & patrimoniale',
    d: "Projet de documentation linguistique et patrimoniale consacré au Batoufam (Bamiléké, Cameroun) : constitution d'un corpus lexical issu de sources orales, conventions graphiques stables, analyse phonologique et préparation d'un manuel de référence.",
    sommaire: [
      'Système d’écriture original (Tswefap) et conventions graphiques',
      'Corpus lexical issu de sources orales et analyse phonologique comparée',
      'Rédaction d’un manuel de référence destiné aux locuteurs et aux linguistes',
    ],
    availability: 'Travaux de recherche et de documentation en cours ; le manuel de référence n’est pas encore publié.',
    ctaLabel: 'Consulter l’axe Culture & Recherche',
    ctaTo: '/culture-recherche',
  },
  {
    t: 'Music’Arts Thérapie — Projet d’ouvrage scientifique et pédagogique',
    group: 'preparation',
    statusLabel: 'En préparation',
    meta: 'Hervé Nanfang · Recherche & pédagogie · À paraître',
    d: 'Projet d’ouvrage scientifique et pédagogique en préparation articulant recherche musicologique, médiation artistique et applications thérapeutiques.',
    sommaire: [
      'Prolongement des travaux de recherche-création (dont Le Concert des Guérisseurs, 2020–2022, inspiré des musiques thérapeutiques pygmées)',
    ],
    availability: 'Ouvrage en préparation (non publié à ce stade).',
    ctaLabel: 'Prendre contact autour de cet axe de recherche',
    ctaTo: '/contact#collaboration',
  },
]

const DEV_PROGRAMS = [
  {
    num: '01',
    title: 'Laboratoire de musique à l’image',
    desc: 'Analyse de bandes originales, fonctions narratives de la musique, initiation au sound design et exercices de composition appliquée à l’image.',
  },
  {
    num: '02',
    title: 'Atelier MAO et production musicale',
    desc: 'Parcours pratique autour de la création de maquettes, de l’enregistrement, de l’édition audio, de l’arrangement et de la préparation de projets musicaux.',
  },
  {
    num: '03',
    title: 'Laboratoire de documentation patrimoniale',
    desc: 'Méthodes de collecte, de description, de catalogage et de transmission de ressources culturelles (en articulation avec le projet Tswefap).',
  },
  {
    num: '04',
    title: 'Programme Musicien augmenté',
    desc: 'Perfectionnement portant sur les outils numériques, l’intelligence artificielle, l’organisation du travail artistique et la production.',
  },
  {
    num: '05',
    title: 'Ateliers d’écoute et de médiation musicale',
    desc: 'Séances consacrées à l’écoute guidée, à l’analyse d’œuvres, aux musiques de films et à la découverte contextualisée des patrimoines musicaux.',
  },
]

const PERMIS_PALIERS = [
  { palier: 'A', couleur: 'Blanc', desc: 'Prendre ses marques — posture, premières notes, écoute active et pulsation.' },
  { palier: 'B', couleur: 'Jaune', desc: "Progresser avec méthode — gammes, lecture courante, jeu d'une pièce de mémoire." },
  { palier: 'C', couleur: 'Orange', desc: 'Affirmer son identité — improvisation, arrangement personnel, 8 pièces maîtrisées.' },
  { palier: 'D', couleur: 'Rouge', desc: 'Exercer son métier — projet artistique complet, répertoire professionnel, jury.' },
]

export default function Pedagogy() {
  useSeo({
    title: 'Pédagogie & Formation | Hervé Nanfang — A Laiz Academy',
    description:
      "Enseignement supérieur, conception de curricula, musicologie africaine, A Laiz Academy (ex-RMA) et Permis de Jouer™ : la pédagogie musicale d'Hervé Nanfang.",
    path: '/pedagogie',
    jsonLd: [
      personSchema,
      courseSchema(
        'Formation musicale et MAO',
        "Parcours de formation musicale structuré, incluant l'éducation musicale, la MAO et la conception pédagogique.",
        'A Laiz Academy',
      ),
      permisDeJouerProgramSchema(),
      creativeWorkSchema(
        'Manuels et méthodes pédagogiques',
        'Méthodes instrumentales, manuels de formation musicale et ressources pour enseignants.',
        'Book',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Pédagogie', path: '/pedagogie' },
      ]),
    ],
  })

  return (
    <>
      <PageHero
        breadcrumb="Pédagogie"
        eyebrow="Transmettre"
        title="Transmettre autrement : méthode, rigueur et ancrage culturel"
        lead="Enseigner la musique ne se réduit pas à transmettre un contenu : c'est construire un parcours, rendre le savoir accessible, et laisser l'apprenant capable de continuer seul — avec sa propre voix."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="Sup." label="Enseignement" />
          <Stat value="3" label="Axes pédagogiques" />
          <Stat value="2" label="Systèmes signature" />
          <Stat value="4" label="Familles d'ouvrages" />
        </div>
      </PageHero>

      {/* ====================== AXES D'ENSEIGNEMENT ====================== */}
      <Section tone="dark" id="formations">
        <Reveal>
          <ChapterMark num="01" label="Axes d'enseignement" />
          <Display size="md" className="mt-7 max-w-3xl">
            Un enseignement large, relié par une même méthode
          </Display>
          <Lead className="mt-6 max-w-3xl">
            Chaque discipline est enseignée avec la même logique : comprendre avant de reproduire,
            pratiquer avant de théoriser, évaluer pour progresser. La méthode s'adapte au
            niveau et au contexte, jamais aux compromis.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {AXES.map((a, i) => (
            <Reveal key={a.t} delay={i * 70}>
              <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink p-8">
                <h3 className="font-display text-2xl text-ivory leading-snug">{a.t}</h3>
                <Rule className="opacity-30 my-5" />
                <p className="text-sm leading-relaxed text-ivory/60 flex-1">{a.d}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {a.tags.map((tag) => (
                    <Tag key={tag}>{tag}</Tag>
                  ))}
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        {/* Vocations */}
        <Reveal delay={120}>
          <div className="mt-14 grid gap-px border border-white/8 bg-white/5 md:grid-cols-3">
            {VOCATION.map((v) => (
              <div key={v.label} className="bg-ink-2 p-7">
                <p className="eyebrow text-gold">{v.label}</p>
                <p className="mt-4 text-sm leading-relaxed text-ivory/60">{v.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </Section>

      {/* ====================== INSTITUTIONS ====================== */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="02" label="Institutions" />
          <Display size="md" className="mt-7">
            Expériences dans l'enseignement supérieur
          </Display>
          <Body className="mt-6 max-w-2xl">
            Plusieurs années d'enseignement au sein des grandes écoles d'art et de musique du
            Cameroun ont forgé une méthode transposable dans tout contexte institutionnel.
          </Body>
        </Reveal>

        <ol className="mt-14 border-t border-white/10">
          {INSTITUTIONS.map((inst, i) => (
            <Reveal key={inst.nom} delay={i * 60}>
              <li className="grid gap-4 border-b border-white/8 py-7 md:grid-cols-[6rem_16rem_1fr] md:gap-8 md:items-center">
                <span className="font-display text-3xl text-gold/70">{inst.nom}</span>
                <div>
                  <p className="font-display text-lg text-ivory">{inst.full}</p>
                  <p className="mt-1 text-[0.68rem] uppercase tracking-[0.15em] text-ivory/40">{inst.ville}</p>
                </div>
                <p className="text-sm leading-relaxed text-ivory/55">{inst.role}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Section>

      {/* ====================== SYSTÈMES SIGNATURE ====================== */}
      <Section tone="dark" id="systemes">
        <Reveal>
          <ChapterMark num="03" label="Systèmes signature" />
          <Display size="md" className="mt-7">
            Deux innovations pédagogiques propriétaires
          </Display>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-2">
          {/* A Laiz Academy */}
          <Reveal>
            <SpotlightCard className="h-full border-white/10 bg-ink p-8 md:p-10">
              <Eyebrow>A Laiz Academy</Eyebrow>
              <h3 className="mt-6 font-display text-3xl text-ivory">A Laiz Academy</h3>
              <p className="mt-2 text-xs font-mono text-gold/85">Anciennement Racines Musicales Academy (RMA)</p>
              <p className="mt-5 text-[15px] leading-[1.85] text-ivory/65">
                Le pôle signature de formation musicale qui relie les pratiques contemporaines et le
                patrimoine musical africain. L'ambition : offrir un cadre de formation structuré —
                curricula, progression, évaluation — là où l'offre reste souvent informelle ou
                déconnectée des réalités culturelles locales.
              </p>
              <div className="mt-7 flex flex-wrap gap-2">
                {['Curricula structurés', "Formation d'enseignants", 'Patrimoine africain', "Suivi de l'apprenant"].map(
                  (t) => (
                    <Tag key={t}>{t}</Tag>
                  ),
                )}
              </div>
              <p className="mt-8 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/40">
                Développé par Hervé Nanfang · Yaoundé, Cameroun
              </p>
              <div className="mt-5">
                <ArrowLink to="/rma">Découvrir A Laiz Academy en détail</ArrowLink>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Permis de Jouer */}
          <Reveal delay={120}>
            <SpotlightCard className="h-full border-white/10 bg-ink p-8 md:p-10">
              <Eyebrow>Permis de Jouer</Eyebrow>
              <h3 className="mt-6 font-display text-3xl text-ivory">Progression & validation par paliers</h3>
              <p className="mt-5 text-[15px] leading-[1.85] text-ivory/65">
                Un référentiel interne de progression et d'évaluation par compétences qui rend l'apprentissage lisible :
                paliers clairement définis, compétences validées en situation réelle, objectifs explicites pour l'élève,
                ses parents et l'enseignant. Fin de l'évaluation floue, début d'une progression
                visible et motivante.
              </p>

              {/* Paliers visuels */}
              <div className="mt-7 grid grid-cols-4 gap-2.5">
                {PERMIS_PALIERS.map((p) => (
                  <div key={p.palier} className="border border-white/10 bg-ink-2 p-3 text-center rounded-lg">
                    <p className="font-display text-xl text-gold">Permis {p.palier}</p>
                    <p className="mt-1 text-[0.6rem] uppercase tracking-wider text-ivory/50">{p.couleur}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {['Paliers N1–N4', 'Compétences', 'Validation interne ALA', 'Autonomie'].map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <p className="mt-6 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/40">
                Une méthode développée par Hervé Nanfang au sein de A Laiz Academy (RMA)
              </p>
              <div className="mt-5">
                <ArrowLink to="/rma#permis-de-jouer">Découvrir les 4 Paliers & Candidatures</ArrowLink>
              </div>
            </SpotlightCard>
          </Reveal>
        </div>

        {/* Visualiseur interactif des 4 Paliers du Permis de Jouer */}
        <div className="mt-16 border-t border-white/10 pt-14" id="permis-de-jouer">
          <PermisDeJouerVisualizer />
        </div>
      </Section>

      {/* ====================== PUBLICATIONS ====================== */}
      <Section tone="ink" id="publications">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <ChapterMark num="04" label="Publications" />
            <Display size="md" className="mt-7">
              Manuels, méthodes et ressources
            </Display>
            <Body className="mt-6 max-w-xl">
              Les publications prolongent l'enseignement : elles fixent une méthode, permettent à
              d'autres enseignants de l'appliquer et donnent à l'élève un support stable pour
              travailler seul entre les séances.
            </Body>
            <div className="mt-9">
              <div className="flex flex-wrap gap-5">
                <ArrowLink to="/contact#formation">Solliciter un plan de cours ou partenariat</ArrowLink>
                <ArrowLink to="/rma#permis-de-jouer">Consulter les 4 paliers du Permis de Jouer</ArrowLink>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ivory/45">
                Distinction explicite : les dispositifs et supports de cours actifs en formation sont distingués ci-contre des ouvrages et manuels actuellement en cours de restructuration éditoriale ou de rédaction.
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {PUBLICATIONS.map((p) => (
                <div key={p.t} className="py-7 group">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[0.62rem] font-mono uppercase tracking-[0.18em] text-gold/80">
                      {p.group === 'disponible' ? '● Dispositif ou support actif' : '◐ Ouvrage en préparation'}
                    </span>
                    <Tag tone={p.group === 'disponible' ? 'gold' : 'ink'}>{p.statusLabel}</Tag>
                  </div>
                  <h3 className="mt-2 font-display text-xl text-ivory group-hover:text-gold transition-colors">{p.t}</h3>
                  <p className="mt-1 text-xs font-mono text-ivory/45">{p.meta}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/65">{p.d}</p>
                  <div className="mt-4 border-l border-gold/30 pl-4">
                    <p className="text-[0.65rem] font-mono uppercase tracking-[0.16em] text-gold/80">
                      Contenu & structure documentés
                    </p>
                    <ul className="mt-2 space-y-1.5 text-xs leading-relaxed text-ivory/60">
                      {p.sommaire.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="mt-3 text-xs leading-relaxed text-ivory/45">
                    <strong className="font-semibold text-ivory/70">État & accès :</strong> {p.availability}
                  </p>
                  <div className="mt-4">
                    <ArrowLink to={p.ctaTo}>{p.ctaLabel}</ArrowLink>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ====================== PROGRAMMES DE DÉVELOPPEMENT ====================== */}
      <Section tone="dark" id="programmes-developpement">
        <Reveal>
          <ChapterMark num="05" label="Programmes de Développement" />
          <Display size="md" className="mt-7 max-w-3xl">
            Cinq laboratoires et programmes à structurer
          </Display>
          <Lead className="mt-5 max-w-3xl">
            Ces programmes prolongent de façon cohérente les compétences du parcours universitaire et de la scène. Ils constituent des pôles de conception et de formation professionnelle continue en cours de structuration.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {DEV_PROGRAMS.map((prog, i) => (
            <Reveal key={prog.num} delay={i * 60}>
              <SpotlightCard className="flex h-full flex-col border-white/10 bg-ink p-8">
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-gold/70">{prog.num}</span>
                  <Tag tone="gold">Pôle d'innovation</Tag>
                </div>
                <h3 className="mt-4 font-display text-2xl text-ivory leading-snug">{prog.title}</h3>
                <Rule className="opacity-30 my-4" />
                <p className="text-sm leading-relaxed text-ivory/60 flex-1">{prog.desc}</p>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ====================== CANDIDATURE & AUDITION PIANO ====================== */}
      <Section tone="ink" id="audition">
        <Reveal>
          <ChapterMark num="06" label="Candidature & Audition" />
          <Display size="md" className="mt-7">
            Rejoindre les cursus piano & formation musicale
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Du Permis A (initiation et fondations) au Permis D (professionnalisation et scène), transmettez votre candidature pour une audition d'orientation pédagogique personnalisée.
          </Lead>
        </Reveal>

        <div className="mt-12">
          <RMAAuditionForm />
        </div>
      </Section>

      {/* ====================== CONFÉRENCES PÉDAGOGIQUES ====================== */}
      <Section tone="dark" tight>
        <Reveal>
          <div className="grid gap-10 border border-gold/25 bg-ink-2 p-8 md:grid-cols-[1.4fr_1fr] md:items-center md:p-12">
            <div>
              <Eyebrow>Conférences pédagogiques</Eyebrow>
              <h2 className="mt-5 font-display text-3xl leading-snug text-ivory md:text-4xl">
                Intervenir dans votre établissement
              </h2>
              <p className="mt-5 max-w-xl text-[15px] leading-[1.9] text-ivory/65">
                Conférences thématiques, masterclasses et ateliers de formation pour
                conservatoires, universités, lycées spécialisés et centres culturels.
                Chaque format est pensé sur mesure selon le public et les objectifs.
              </p>
            </div>
            <div className="flex flex-col gap-4 md:items-end">
              <Btn to="/conferences" variant="gold">
                Voir les conférences
              </Btn>
              <Btn to="/contact#formation" variant="ghost">
                Demander une intervention
              </Btn>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Écoles, institutions, enseignants"
        title="Structurer une offre de formation musicale"
        text="Conception de curriculum, formation d'équipes pédagogiques, mise en place d'un système de progression ou rédaction de supports : chaque contexte est analysé, chaque dispositif est conçu sur mesure."
        primary={{ label: 'Ouvrir un parcours formation', to: '/contact#formation' }}
        secondary={{ label: 'Voir les conférences', to: '/conferences' }}
      />
    </>
  )
}
