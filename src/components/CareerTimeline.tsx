import { useState } from 'react'
import { Link } from 'react-router-dom'

export type TimelineCategory = 'all' | 'live' | 'sound' | 'pedagogy' | 'musicology' | 'ai'

export interface TimelineMilestone {
  id: string
  period: string
  year: number
  title: string
  category: TimelineCategory
  categoryLabel: string
  categoryBadge: string
  summary: string
  description: string
  keyMilestones: string[]
  relatedLink?: {
    label: string
    to: string
  }
}

export const TIMELINE_MILESTONES: TimelineMilestone[] = [
  {
    id: 'm-2007',
    period: '2007',
    year: 2007,
    title: 'Genèse du Pianobariste™ & Scène Live',
    category: 'live',
    categoryLabel: 'Scène & Live',
    categoryBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    summary: 'Création du concept live associant piano, chant et répertoires transversaux.',
    description:
      "Dès 2007, Hervé Nanfang fait du piano-bar son laboratoire scénique vivant. Loin du récital figé, il développe un art de l'écoute du public, de la modulation de volume et d'un répertoire encyclopédique couvrant la chanson francophone, les grands standards internationaux et les musiques africaines.",
    keyMilestones: [
      'Lancement de la signature « Le Pianobariste™ »',
      'Résidences dans les grands lounges, clubs de jazz et réceptions de Yaoundé',
      'Constitution d’un répertoire plurilingue de plus de 400 œuvres mémorisées',
    ],
    relatedLink: {
      label: 'Explorer le concept Piano-Bar',
      to: '/musique#pianobariste',
    },
  },
  {
    id: 'm-2008',
    period: '2007 – 2010',
    year: 2010,
    title: 'Formation Technicien Supérieur de Son',
    category: 'sound',
    categoryLabel: 'Son & Studio',
    categoryBadge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    summary: 'Acquisition des fondamentaux de l’ingénierie audio, acoustique et mixage.',
    description:
      'Pour ne pas subir les contraintes techniques du live et du studio, Hervé Nanfang se forme rigoureusement au métier de technicien supérieur de son. Il maîtrise la chaîne audio complète : captation acoustique, microphones, égalisation, dynamique, sommation analogique et premiers séquenceurs MAO.',
    keyMilestones: [
      'Diplôme et pratique de Technicien Supérieur de Son',
      'Maîtrise de la prise de son instrumentale et vocale',
      'Développement d’une oreille critique entre acoustique de salle et fidélité de mixage',
    ],
    relatedLink: {
      label: 'Voir les compétences Studio & Son',
      to: '/musique',
    },
  },
  {
    id: 'm-2013',
    period: '2011 – 2013',
    year: 2013,
    title: 'Licence Arts du Spectacle & Management Culturel',
    category: 'musicology',
    categoryLabel: 'Musicologie & Recherche',
    categoryBadge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    summary: 'Université de Dschang — Rigueur théorique, esthétique et gestion de projets culturels.',
    description:
      'Cursus universitaire combinant histoire de la musique, dramaturgie du spectacle vivant, économie de la culture et sociologie des arts. Cette formation ancre la conviction qu’un artiste contemporain doit maîtriser tant le propos intellectuel que la structuration économique de son écosystème.',
    keyMilestones: [
      'Obtention de la Licence Arts du Spectacle & Management Culturel (Univ. Dschang)',
      'Travaux sur l’économie de la filière musicale en Afrique centrale',
      'Passerelle méthodologique entre tradition orale et analyse musicologique formelle',
    ],
    relatedLink: {
      label: 'Consulter l’axe Recherche',
      to: '/culture-recherche',
    },
  },
  {
    id: 'm-2018',
    period: '2015 – 2018',
    year: 2018,
    title: 'Résidences Hôtelières de Luxe & Certification UVCDI',
    category: 'live',
    categoryLabel: 'Scène & Entrepreneuriat',
    categoryBadge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    summary: 'Consolidation de l’expérience scénique hôtelière et formation Millennium Business Developer.',
    description:
      'Hervé Nanfang devient la référence du piano-bar d’ambiance haut de gamme au Cameroun (grands hôtels internationaux, cercles diplomatiques, soirées d’État). En parallèle, il valide la certification Millennium Business Developer (UVCDI) pour professionnaliser la gestion contractuelle et la valeur de marque.',
    keyMilestones: [
      'Certification « Millennium Business Developer » auprès de UVCDI',
      'Résidences pianistiques de référence à Yaoundé et dans la sous-région',
      'Structuration juridique des futures activités de production sous le pavillon Alaiz Creative System',
    ],
    relatedLink: {
      label: 'Découvrir Alaiz Creative System',
      to: '/projets',
    },
  },
  {
    id: 'm-2020',
    period: '2018 – 2021',
    year: 2021,
    title: 'Fondation de la RMA & Système « Permis de Jouer™ »',
    category: 'pedagogy',
    categoryLabel: 'Pédagogie & RMA',
    categoryBadge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    summary: 'Création de la Racines Musicales Academy® à Yaoundé et modélisation en 4 paliers.',
    description:
      'Face au déficit d’instituts structurés et de méthodes progressives claires pour les pianistes en Afrique francophone, Hervé Nanfang fonde la Racines Musicales Academy® (RMA). Il crée le système déposé « Permis de Jouer™ » (Paliers Blanc, Jaune, Orange, Rouge) pour démocratiser l’excellence pianistique avec un cadre vérifiable.',
    keyMilestones: [
      'Création et direction pédagogique de la Racines Musicales Academy® (RMA)',
      'Dépôt et mise en pratique de la méthode « Permis de Jouer™ »',
      'Formation de dizaines de pianistes amateurs et futurs professionnels de scène',
    ],
    relatedLink: {
      label: 'Découvrir la RMA & le Permis de Jouer™',
      to: '/rma',
    },
  },
  {
    id: 'm-2022',
    period: '2022 – 2024',
    year: 2024,
    title: 'Enseignement Supérieur (ESAS, ISMA) & Master II Musicologie',
    category: 'pedagogy',
    categoryLabel: 'Pédagogie & Recherche',
    categoryBadge: 'bg-purple-500/15 text-purple-400 border-purple-500/30',
    summary: 'Transmission universitaire en MAO, composition et musicologie appliquée aux médias.',
    description:
      'Enseignant titulaire à l’École Supérieure des Arts du Spectacle (ESAS de Lomé) et intervenant régulier à l’Institut Supérieur des Métiers des Arts (ISMA, Bénin), après des expériences d’enseignement en musicologie à l’Institut des Beaux-Arts de Nkongsamba et en audiofréquence à l’IFCPA/CRTV. En parallèle, il valide son Master II en Musicologie appliquée aux médias à l’Université de Yaoundé I.',
    keyMilestones: [
      'Titulaire à l’ESAS de Lomé en MAO, composition et musicologie appliquée aux médias visuels',
      'Enseignement à l’ISMA (Bénin), à l’IBA Nkongsamba et à l’IFCPA / CRTV',
      'Master II de Musicologie spécialisé en analyse de BO, son et convergence numérique',
    ],
    relatedLink: {
      label: 'Consulter le cursus Pédagogie',
      to: '/pedagogie',
    },
  },
  {
    id: 'm-2025',
    period: '2025 – 2026+',
    year: 2026,
    title: 'Le Manifeste du « Musicien Augmenté™ » & Recherches IA',
    category: 'ai',
    categoryLabel: 'IA & Innovation',
    categoryBadge: 'bg-gold/20 text-gold-2 border-gold/40',
    summary: 'Pionnier de l’IA musicale éthique au service de l’humain et conférences internationales.',
    description:
      'Hervé Nanfang formalise le concept « Musicien Augmenté™ » : une méthode et un cadre éthique pour intégrer l’intelligence artificielle générative dans le travail quotidien du compositeur, du pédagogue et du producteur. Lancement de 5 conférences magistrales pour universités et institutions.',
    keyMilestones: [
      'Publication du Manifeste du Musicien Augmenté™',
      'Conception du cycle de 5 conférences et masterclasses internationales',
      'Développement de workflows hybrides IA (synthèse, déchiffrage, assistance d’arrangement)',
      'Déploiement du catalogue d’œuvres et transmission des patrimoines africains augmentés',
    ],
    relatedLink: {
      label: 'Découvrir le Musicien Augmenté™',
      to: '/ia-technologie#musicien-augmente',
    },
  },
]

const CATEGORIES: { id: TimelineCategory; label: string }[] = [
  { id: 'all', label: 'Toutes les étapes (7)' },
  { id: 'live', label: 'Scène & Live' },
  { id: 'sound', label: 'Son & Studio' },
  { id: 'pedagogy', label: 'Pédagogie & RMA' },
  { id: 'musicology', label: 'Musicologie' },
  { id: 'ai', label: 'IA & Innovation' },
]

export default function CareerTimeline() {
  const [selectedCategory, setSelectedCategory] = useState<TimelineCategory>('all')
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>('m-2025')

  const filteredMilestones =
    selectedCategory === 'all'
      ? TIMELINE_MILESTONES
      : TIMELINE_MILESTONES.filter(
          (m) =>
            m.category === selectedCategory ||
            (selectedCategory === 'musicology' && m.id === 'm-2022') ||
            (selectedCategory === 'pedagogy' && m.id === 'm-2022')
        )

  const activeMilestone =
    TIMELINE_MILESTONES.find((m) => m.id === activeMilestoneId) || TIMELINE_MILESTONES[TIMELINE_MILESTONES.length - 1]

  return (
    <div className="space-y-10">
      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="mr-2 text-[0.7rem] uppercase tracking-wider text-ivory/40">Filtrer par axe :</span>
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-mono transition-all duration-200 ${
                isActive
                  ? 'border border-gold bg-gold/15 text-gold-2 shadow-sm'
                  : 'border border-white/10 bg-white/5 text-ivory/60 hover:border-white/20 hover:text-ivory'
              }`}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Interactive Chronological Bar */}
      <div className="relative border-y border-white/10 bg-white/[0.02] py-4 px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-2 scrollbar-none">
          {TIMELINE_MILESTONES.map((milestone) => {
            const isSelected = activeMilestoneId === milestone.id
            return (
              <button
                key={milestone.id}
                onClick={() => setActiveMilestoneId(milestone.id)}
                className={`group flex flex-col items-center flex-shrink-0 px-3 py-2 transition-all duration-200 ${
                  isSelected ? 'scale-105' : 'opacity-65 hover:opacity-100'
                }`}
              >
                <div
                  className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
                    isSelected
                      ? 'border-gold bg-gold shadow-[0_0_12px_rgba(197,160,89,0.8)]'
                      : 'border-white/30 bg-ink group-hover:border-white/60'
                  }`}
                />
                <span
                  className={`mt-2 font-display text-sm tracking-wide transition-colors ${
                    isSelected ? 'text-gold-2 font-bold' : 'text-ivory/60 group-hover:text-ivory'
                  }`}
                >
                  {milestone.period.includes('–') ? milestone.period.split('–')[0].trim() : milestone.period}
                </span>
                <span className="text-[0.62rem] uppercase tracking-wider text-ivory/40">
                  {milestone.categoryLabel.split('&')[0].trim()}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Featured Milestone Card (Expanded view of selected node) */}
      <div className="relative overflow-hidden border border-gold/40 bg-gradient-to-br from-ink-2 to-ink p-7 md:p-9 shadow-xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-gold/10 blur-3xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-bold text-gold md:text-4xl">
              {activeMilestone.period}
            </span>
            <span
              className={`rounded-full border px-3 py-0.5 text-[0.68rem] font-mono uppercase tracking-wider ${activeMilestone.categoryBadge}`}
            >
              {activeMilestone.categoryLabel}
            </span>
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-ivory/40">
            Jalon n° {TIMELINE_MILESTONES.findIndex((m) => m.id === activeMilestone.id) + 1} / {TIMELINE_MILESTONES.length}
          </span>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.9fr]">
          <div>
            <h3 className="font-display text-2xl text-ivory md:text-3xl leading-snug">
              {activeMilestone.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-ivory/75">
              {activeMilestone.description}
            </p>

            {activeMilestone.relatedLink && (
              <div className="mt-7">
                <Link
                  to={activeMilestone.relatedLink.to}
                  className="inline-flex items-center gap-2 border border-gold/50 bg-gold/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold-2 transition-colors hover:bg-gold hover:text-ink"
                >
                  <span>{activeMilestone.relatedLink.label}</span>
                  <span>→</span>
                </Link>
              </div>
            )}
          </div>

          <div className="border border-white/10 bg-white/[0.03] p-5">
            <p className="text-[0.68rem] font-mono uppercase tracking-widest text-gold/80">
              Réalisations & Acquis Clés
            </p>
            <ul className="mt-4 space-y-3">
              {activeMilestone.keyMilestones.map((km, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs leading-relaxed text-ivory/70">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span>{km}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Full Chronology Timeline List */}
      <div className="relative border-l-2 border-white/15 pl-6 sm:pl-8 ml-3 sm:ml-5 space-y-8 mt-12">
        {filteredMilestones.map((milestone) => {
          const isSelected = activeMilestoneId === milestone.id
          return (
            <div
              key={milestone.id}
              onClick={() => setActiveMilestoneId(milestone.id)}
              className={`group relative cursor-pointer border p-6 transition-all duration-200 ${
                isSelected
                  ? 'border-gold/60 bg-white/[0.04] shadow-md'
                  : 'border-white/8 bg-ink-2/60 hover:border-white/20 hover:bg-white/[0.02]'
              }`}
            >
              {/* Timeline marker on the left line (centered on border-l-2) */}
              <div
                className={`absolute -left-[33px] sm:-left-[41px] top-6 h-4 w-4 rounded-full border-2 transition-all ${
                  isSelected ? 'border-gold bg-gold scale-110 shadow-[0_0_8px_rgba(197,160,89,0.7)]' : 'border-white/30 bg-ink group-hover:border-gold'
                }`}
              />

              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="font-display text-xl text-gold font-bold tabular-nums">
                    {milestone.period}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[0.62rem] font-mono uppercase tracking-wider ${milestone.categoryBadge}`}
                  >
                    {milestone.categoryLabel}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-wider text-ivory/40 group-hover:text-gold transition-colors">
                  {isSelected ? 'Jalon actif ✓' : 'Cliquer pour examiner →'}
                </span>
              </div>

              <h4 className="mt-3 font-display text-xl text-ivory group-hover:text-gold-2 transition-colors">
                {milestone.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ivory/60">
                {milestone.summary}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
