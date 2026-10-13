
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
  Tag,
} from '../components/ui'

import { courseSchema, creativeWorkSchema, breadcrumbSchema, personSchema } from '../lib/schema'
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
    full: 'École Supérieure des Arts et du Spectacle',
    ville: 'Yaoundé, Cameroun',
    role: 'Intervenant en musicologie, MAO et projets artistiques',
  },
  {
    nom: 'ISMA',
    full: 'Institut Supérieur de Musique et des Arts',
    ville: 'Cameroun',
    role: 'Formation instrumentale et direction pédagogique',
  },
  {
    nom: 'RMA',
    full: 'Racines Musicales Academy®',
    ville: 'Yaoundé, Cameroun',
    role: 'Fondateur — formation musicale, Permis de Jouer™, curricula',
  },
]

const VOCATION = [
  {
    label: 'Enseignement supérieur',
    text: "Cours de musicologie et de MAO, encadrement de projets d'étudiants et accompagnement de mémoires de fin de cycle dans les grandes écoles d'art.",
  },
  {
    label: 'Milieu scolaire',
    text: 'Éducation musicale, initiation instrumentale, pratiques chorales et éveil artistique destinés aux établissements primaires et secondaires.',
  },
  {
    label: 'Professionnels',
    text: 'Formation continue pour enseignants, musiciens et structures souhaitant structurer, moderniser ou faire évoluer leur approche pédagogique.',
  },
]

const PUBLICATIONS = [
  {
    t: 'Méthodes instrumentales',
    d: "Progression pas à pas, exercices contextualisés, répertoire africain et international choisi pour motiver sans sacrifier l'exigence technique. Format adapté à l'auto-apprentissage encadré.",
  },
  {
    t: 'Manuels de formation musicale',
    d: 'Lecture, rythme, ear-training et théorie articulés dans une même pédagogie de la compréhension — pas de solfège déconnecté de la pratique instrumentale.',
  },
  {
    t: 'Ressources pour enseignants',
    d: "Fiches de cours détaillées, grilles d'évaluation critériées, plans de progression trimestriels et supports numériques prêts à l'emploi.",
  },
  {
    t: 'Guides MAO & IA',
    d: "Documents de travail accompagnant l'adoption raisonnée des outils numériques et de l'intelligence artificielle dans l'enseignement musical — positionnement et pratique.",
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
    title: 'Pédagogie & Recherche | Hervé Nanfang',
    description:
      "Enseignement supérieur, conception de curricula, musicologie africaine, Racines Musicales Academy® et Permis de Jouer™ : la pédagogie musicale d'Hervé Nanfang.",
    path: '/pedagogie',
    jsonLd: [
      personSchema,
      courseSchema(
        'Formation musicale et MAO',
        "Parcours de formation musicale structuré, incluant l'éducation musicale, la MAO et la conception pédagogique.",
        'Racines Musicales Academy®',
      ),
      courseSchema(
        'Permis de Jouer™ — progression et certification',
        "Système de progression et de certification rendant l'apprentissage musical lisible : paliers, objectifs, validation.",
        'Racines Musicales Academy®',
      ),
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
          {/* RMA */}
          <Reveal>
            <SpotlightCard className="h-full border-white/10 bg-ink p-8 md:p-10">
              <Eyebrow>Racines Musicales Academy®</Eyebrow>
              <h3 className="mt-6 font-display text-3xl text-ivory">RMA</h3>
              <p className="mt-5 text-[15px] leading-[1.85] text-ivory/65">
                Un projet de formation musicale qui relie les pratiques contemporaines et le
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
                <ArrowLink to="/rma">Découvrir la RMA en détail</ArrowLink>
              </div>
            </SpotlightCard>
          </Reveal>

          {/* Permis de Jouer */}
          <Reveal delay={120}>
            <SpotlightCard className="h-full border-white/10 bg-ink p-8 md:p-10">
              <Eyebrow>Permis de Jouer™</Eyebrow>
              <h3 className="mt-6 font-display text-3xl text-ivory">Progression & certification</h3>
              <p className="mt-5 text-[15px] leading-[1.85] text-ivory/65">
                Un système de progression et de certification qui rend l'apprentissage lisible :
                paliers clairement définis, compétences validées, objectifs explicites pour l'élève,
                ses parents et l'enseignant. Fin de l'évaluation floue, début d'une progression
                visible et motivante.
              </p>

              {/* Paliers visuels */}
              <div className="mt-7 grid grid-cols-4 gap-3">
                {PERMIS_PALIERS.map((p) => (
                  <div key={p.palier} className="border border-white/10 bg-ink-2 p-3 text-center">
                    <p className="font-display text-xl text-gold">A{p.palier}</p>
                    <p className="mt-1 text-[0.6rem] uppercase tracking-wider text-ivory/35">{p.couleur}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {['Paliers', 'Compétences', 'Certification', 'Autonomie'].map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <p className="mt-8 text-[0.68rem] uppercase tracking-[0.2em] text-ivory/40">
                Une initiative développée par Hervé Nanfang
              </p>
            </SpotlightCard>
          </Reveal>
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
              <ArrowLink to="/contact#formation">Demander la liste des publications</ArrowLink>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {PUBLICATIONS.map((p) => (
                <div key={p.t} className="py-7 group">
                  <h3 className="font-display text-xl text-ivory group-hover:text-gold transition-colors">{p.t}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-ivory/55">{p.d}</p>
                </div>
              ))}
            </div>
          </Reveal>
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
