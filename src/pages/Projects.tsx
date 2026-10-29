import { useState } from 'react'
import PageHero from '../components/PageHero'
import {
  ArrowLink,
  Body,
  Card,
  ChapterMark,
  CtaBand,
  Display,
  Eyebrow,
  Reveal,
  Rule,
  Section,
  Stat,
  Tag,
} from '../components/ui'
import { PROJECT_FAMILIES } from '../data/projects'
import { SITE } from '../data/site'
import {
  breadcrumbSchema,
  creativeWorkSchema,
  organizationSchema,
  personSchema,
} from '../lib/schema'
import { useSeo } from '../lib/seo'

export default function Projects() {
  const [activeFamily, setActiveFamily] = useState<string>('tous')
  const [activeStatus, setActiveStatus] = useState<string>('tous')
  const [searchQuery, setSearchQuery] = useState<string>('')

  useSeo({
    title: 'Projets & Univers Créatif | Hervé Nanfang — A Laiz Ô Pays',
    description:
      'Projets musicaux, pédagogiques et technologiques de Hervé Nanfang : A Laiz Ô Pays, Le Pianobariste™, RMA®, Permis de Jouer™, Musicien Augmenté™ et Tswefap.',
    path: '/projets',
    jsonLd: [
      personSchema,
      organizationSchema,
      creativeWorkSchema(
        'Racines Musicales Academy®',
        'Projet de formation musicale reliant pratiques contemporaines et patrimoine musical africain.',
      ),
      creativeWorkSchema(
        'Permis de Jouer™',
        "Système de progression et de certification pour l'apprentissage musical.",
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Projets', path: '/projets' },
      ]),
    ],
  })

  // Calcul dynamique des projets filtrés
  const q = searchQuery.trim().toLowerCase()
  const filteredFamilies = PROJECT_FAMILIES.map((family) => {
    if (activeFamily !== 'tous' && family.id !== activeFamily) return null

    const matchedProjects = family.projects.filter((p) => {
      const matchStatus = activeStatus === 'tous' || p.status === activeStatus
      if (!matchStatus) return false
      if (!q) return true
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.volume.toLowerCase().includes(q) ||
        (p.discipline && p.discipline.toLowerCase().includes(q)) ||
        p.points.some((pt) => pt.toLowerCase().includes(q))
      )
    })

    if (matchedProjects.length === 0) return null

    return {
      ...family,
      projects: matchedProjects,
    }
  }).filter(Boolean) as typeof PROJECT_FAMILIES

  const totalProjectsCount = PROJECT_FAMILIES.reduce((acc, f) => acc + f.projects.length, 0)
  const visibleProjectsCount = filteredFamilies.reduce((acc, f) => acc + f.projects.length, 0)

  return (
    <>
      <PageHero
        breadcrumb="Projets & Marques"
        eyebrow="Développer"
        title="Des projets pensés comme des structures"
        lead="Cinq familles de projets, une même intention : transformer des compétences en dispositifs capables de produire, de durer et de se transmettre."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="5" label="Familles d'action" />
          <Stat value={String(totalProjectsCount)} label="Projets actifs" />
          <Stat value="2" label="Identités : Hervé Nanfang & A Laiz Ô Pays" />
          <Stat value="1" label="Concept fédérateur : A Laiz Ô Pays" />
        </div>
      </PageHero>

      {/* Barre de Recherche & Filtres Dynamiques */}
      <Section tone="dark" tight bordered={false}>
        <div className="space-y-4">
          {/* Recherche plein-texte */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-md">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un projet, une technologie, un format…"
                aria-label="Rechercher dans les projets"
                className="w-full border border-white/15 bg-ink px-4 py-2.5 pl-10 text-xs text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none"
              />
              <span className="pointer-events-none absolute left-3 top-2.5 text-xs text-gold/70" aria-hidden="true">
                🔍
              </span>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Effacer la recherche"
                  className="absolute right-3 top-2.5 text-xs text-ivory/50 hover:text-gold"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-[0.68rem] text-ivory/60">
              <span className="font-semibold text-gold">{visibleProjectsCount}</span>
              <span>projet{visibleProjectsCount > 1 ? 's' : ''} affiché{visibleProjectsCount > 1 ? 's' : ''} sur {totalProjectsCount}</span>
            </div>
          </div>

          {/* Filtres par famille */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
            <span className="text-[0.62rem] uppercase tracking-widest text-ivory/40 mr-1">Famille :</span>
            <button
              type="button"
              onClick={() => setActiveFamily('tous')}
              className={`border px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                activeFamily === 'tous'
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/15 text-ivory/60 hover:border-gold/60 hover:text-gold'
              }`}
            >
              Toutes
            </button>
            {PROJECT_FAMILIES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFamily(f.id)}
                className={`border px-3 py-1.5 text-[0.63rem] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  activeFamily === f.id
                    ? 'border-gold bg-gold text-ink'
                    : 'border-white/15 text-ivory/60 hover:border-gold/60 hover:text-gold'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Filtres par statut */}
          <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5">
            <span className="text-[0.62rem] uppercase tracking-widest text-ivory/40 mr-1">Statut :</span>
            {[
              { id: 'tous', label: 'Tous statuts' },
              { id: 'Signature', label: 'Signature' },
              { id: 'Actif', label: 'Actif' },
              { id: 'En développement', label: 'En développement' },
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveStatus(s.id)}
                className={`border px-2.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.14em] transition-colors ${
                  activeStatus === s.id
                    ? 'border-gold/80 bg-gold/20 text-gold'
                    : 'border-white/10 text-ivory/50 hover:border-white/30 hover:text-ivory'
                }`}
              >
                {s.label}
              </button>
            ))}
            {(activeFamily !== 'tous' || activeStatus !== 'tous' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setActiveFamily('tous')
                  setActiveStatus('tous')
                  setSearchQuery('')
                }}
                className="ml-auto text-[0.62rem] text-gold/80 hover:text-gold hover:underline"
              >
                Réinitialiser les filtres
              </button>
            )}
          </div>
        </div>
      </Section>

      {/* Liste des Projets Filtrés */}
      {filteredFamilies.length === 0 ? (
        <Section tone="ink">
          <div className="border border-white/10 p-12 text-center">
            <p className="font-display text-2xl text-ivory">Aucun projet ne correspond à vos critères</p>
            <p className="mt-2 text-sm text-ivory/60">
              Modifiez vos mots-clés ou réinitialisez les filtres pour explorer l'ensemble du catalogue.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveFamily('tous')
                setActiveStatus('tous')
                setSearchQuery('')
              }}
              className="mt-6 border border-gold bg-gold px-6 py-2.5 text-xs font-semibold uppercase tracking-widest text-ink transition-opacity hover:opacity-90"
            >
              Afficher tous les projets
            </button>
          </div>
        </Section>
      ) : (
        filteredFamilies.map((family, fi) => (
          <Section key={family.id} id={family.id} tone={fi % 2 === 0 ? 'ink' : 'dark'}>
            <Reveal>
              <ChapterMark num={String(PROJECT_FAMILIES.findIndex((f) => f.id === family.id) + 1).padStart(2, '0')} label={`Projets ${family.label.toLowerCase()}`} />
              <div className="mt-7 grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
                <Display size="md">{family.label}</Display>
                <Body className="lg:pb-2">{family.intro}</Body>
              </div>
            </Reveal>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {family.projects.map((p, i) => (
                <Reveal key={p.title} delay={i * 80}>
                  <Card className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl leading-snug text-ivory">
                          {p.title}
                          {p.mark && <sup className="ml-1 text-sm text-gold">{p.mark}</sup>}
                        </h3>
                        <p className="mt-2 text-[0.66rem] uppercase tracking-[0.18em] text-gold/70">
                          {p.volume}
                        </p>
                      </div>
                      <Tag tone={p.status === 'Signature' ? 'gold' : 'ink'}>{p.status}</Tag>
                    </div>
                    <Rule className="opacity-40" />
                    <Body className="mt-4">{p.description}</Body>
                    {p.synopsis && (
                      <p className="mt-3 text-xs leading-relaxed text-ivory/45 italic border-l border-gold/20 pl-3">
                        {p.synopsis.length > 220 ? p.synopsis.slice(0, 220) + '…' : p.synopsis}
                      </p>
                    )}
                    <ul className="mt-6 space-y-2">
                      {p.points.map((pt) => (
                        <li key={pt} className="flex items-baseline gap-3 text-sm text-ivory/60">
                          <span aria-hidden className="h-1 w-1 shrink-0 translate-y-[-3px] bg-gold/70" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                    {p.discipline && (
                      <div className="mt-4">
                        <span className="rounded border border-gold/20 px-2 py-0.5 text-[0.6rem] uppercase tracking-widest text-gold/60">
                          {p.discipline}
                        </span>
                      </div>
                    )}
                    {p.to && (
                      <div className="mt-6">
                        <ArrowLink to={p.to}>En savoir plus</ArrowLink>
                      </div>
                    )}
                  </Card>
                </Reveal>
              ))}
            </div>
          </Section>
        ))
      )}

      {/* Matrice de Synergie & Incubation */}
      <Section tone="ink">
        <Reveal>
          <ChapterMark num="05" label="Synergies & Modèle d'Incubation" />
          <Display size="md" className="mt-7 max-w-3xl">
            L'interdépendance créative : pourquoi chaque projet renforce les autres
          </Display>
          <Body className="mt-6 max-w-3xl">
            Chez Hervé Nanfang, un projet n’est jamais isolé. La scène nourrit la pédagogie, 
            la pédagogie alimente la recherche technologique, et l’ingénierie créative donne naissance à de nouvelles œuvres.
          </Body>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Card className="border-t-2 border-t-gold/70 bg-ink-2 p-6">
            <span className="eyebrow text-gold">01 · Pôle Live & Performance</span>
            <h4 className="mt-3 font-display text-xl text-ivory">Le Banc d’Essai Réel</h4>
            <p className="mt-3 text-xs leading-relaxed text-ivory/70">
              Le Pianobariste™ et les scènes de prestige testent en direct l'impact émotionnel et la résonance du répertoire auprès de publics exigeants.
            </p>
            <div className="mt-4 border-t border-white/10 pt-3 text-[0.65rem] text-gold/80">
              → Nourrit : RMA®, Alaiz Music
            </div>
          </Card>

          <Card className="border-t-2 border-t-gold/70 bg-ink-2 p-6">
            <span className="eyebrow text-gold">02 · Pôle Transmission & Méthode</span>
            <h4 className="mt-3 font-display text-xl text-ivory">La Modélisation du Savoir</h4>
            <p className="mt-3 text-xs leading-relaxed text-ivory/70">
              RMA® et Permis de Jouer™ codifient 20 ans de pratique pianistique et de rythmes traditionnels pour en faire une méthode d'excellence transmissible.
            </p>
            <div className="mt-4 border-t border-white/10 pt-3 text-[0.65rem] text-gold/80">
              → Nourrit : Tswefap, Conférences
            </div>
          </Card>

          <Card className="border-t-2 border-t-gold/70 bg-ink-2 p-6">
            <span className="eyebrow text-gold">03 · Pôle Technologie & R&D</span>
            <h4 className="mt-3 font-display text-xl text-ivory">L'Augmentation Créative</h4>
            <p className="mt-3 text-xs leading-relaxed text-ivory/70">
              Musicien Augmenté™ et le Sound Design hybride appliquent l'IA et la synthèse numérique au patrimoine pour créer les langages de demain.
            </p>
            <div className="mt-4 border-t border-white/10 pt-3 text-[0.65rem] text-gold/80">
              → Nourrit : Nouvelles œuvres & univers A Laiz Ô Pays
            </div>
          </Card>
        </div>
      </Section>

      {/* Écosystème */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="06" label="Écosystème de marques" />
          <Display size="md" className="mt-7 max-w-3xl">
            Les marques dérivées ne concurrencent pas Hervé Nanfang
          </Display>
          <Body className="mt-6 max-w-3xl">
            Chaque marque est présentée comme « un projet de Hervé Nanfang » ou « une initiative
            développée par Hervé Nanfang », et renvoie vers ce site, source canonique de l’ensemble de
            l’écosystème.
          </Body>
        </Reveal>

        <div className="mt-12 grid gap-px border border-white/8 bg-white/8 sm:grid-cols-2 lg:grid-cols-3">
          {SITE.marks.map((mark) => (
            <div key={mark} className="bg-ink-2 px-7 py-6">
              <p className="font-display text-xl text-ivory">{mark}</p>
              <p className="mt-2 text-[0.62rem] uppercase tracking-[0.18em] text-gold/70">
                Un projet de Hervé Nanfang
              </p>
            </div>
          ))}
        </div>

        <Reveal delay={100}>
          <div className="mt-10 grid gap-8 border border-white/8 p-8 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div>
              <Eyebrow>Concept fondateur & univers créatif</Eyebrow>
              <h3 className="mt-4 font-display text-3xl text-ivory">A Laiz Ô Pays</h3>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-ivory/60">
                A Laiz Ô Pays est le concept artistique et culturel fondateur de Hervé Nanfang.
                Il fédère son univers créatif et les projets qui s’y rattachent, de la musique à la transmission,
                en passant par la production et l’exploration des technologies.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              <Tag>Production</Tag>
              <Tag>Événementiel</Tag>
              <Tag>Conseil</Tag>
              <Tag>Partenariats</Tag>
            </div>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        eyebrow="Vous avez un projet"
        title="Construire ensemble, ou confier une expertise"
        text="Projet artistique, culturel ou numérique : décrivez votre intention, vos contraintes et votre calendrier."
        primary={{ label: 'Proposer un projet', to: '/contact#collaboration' }}
        secondary={{ label: 'Demander un conseil', to: '/contact#conseil' }}
      />
    </>
  )
}
