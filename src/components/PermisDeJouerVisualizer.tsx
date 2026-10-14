import { useState } from 'react'

export interface PalierDetail {
  id: string
  code: string
  couleur: string
  couleurCode: string
  badgeBg: string
  badgeText: string
  titre: string
  dureeMoyenne: string
  profil: string
  objectifs: string[]
  epreuveValidation: string
}

export const PALIERS_DATA: PalierDetail[] = [
  {
    id: 'palier-a',
    code: 'Permis A',
    couleur: 'Blanc',
    couleurCode: '#F8FAFC',
    badgeBg: 'bg-white/10 border-white/30 text-white',
    badgeText: 'Fondations & Éveil',
    titre: 'Prendre ses marques',
    dureeMoyenne: '3 à 6 mois',
    profil: 'Débutant complet, enfant (dès 6 ans) ou adulte débutant',
    objectifs: [
      'Posture corporelle, décontraction des bras et positionnement des mains au clavier',
      'Lecture des premières notes en clé de Sol et clé de Fa / tablature',
      'Intégration de la pulsation régulière, mesure à 4/4 et silences de base',
      'Reproduction fluide de 3 courtes pièces du répertoire débutant de mémoire',
    ],
    epreuveValidation: 'Mini-audition d’étape interne : exécution de deux pièces courtes et exercice rythmique.',
  },
  {
    id: 'palier-b',
    code: 'Permis B',
    couleur: 'Jaune',
    couleurCode: '#EAB308',
    badgeBg: 'bg-yellow-500/15 border-yellow-500/40 text-yellow-400',
    badgeText: 'Autonomie & Méthode',
    titre: 'Progresser avec méthode',
    dureeMoyenne: '6 à 9 mois',
    profil: 'Apprenant ayant validé le Permis A ou 1 à 2 ans de pratique préalable',
    objectifs: [
      'Lecture courante sur deux octaves et déchiffrage à vue de mélodies simples',
      'Maîtrise des gammes majeures/mineures diatoniques et pentatoniques',
      'Indépendance des deux mains et nuances dynamiques (piano, mezzo, forte)',
      'Jeu d’une pièce complète de mémoire avec intention expressive et sens du tempo',
      'Première expérience de jeu collectif (duo piano-voix ou accompagnement)',
    ],
    epreuveValidation: 'Audition trimestrielle RMA : 3 morceaux interprétés devant professeurs et promotion.',
  },
  {
    id: 'palier-c',
    code: 'Permis C',
    couleur: 'Orange',
    couleurCode: '#F97316',
    badgeBg: 'bg-orange-500/15 border-orange-500/40 text-orange-400',
    badgeText: 'Identité & Polyvalence',
    titre: 'Affirmer son identité artistique',
    dureeMoyenne: '9 à 12 mois',
    profil: 'Musicien confirmé, semi-professionnel ou candidat aux classes de conservatoire',
    objectifs: [
      'Improvisation libre et phrasé sur grille harmonique standard (Jazz, Blues, Soul)',
      'Initiation approfondie aux polyrythmies et grooves africains (Makossa, Bikutsi, Mangambeu)',
      'Réalisation d’un arrangement personnel d’une œuvre du grand répertoire',
      'Constitution d’un répertoire autonome de 8 pièces jouées sans partition',
      'Transmission : capacité à expliquer et faire travailler une notion clé à un élève débutant',
    ],
    epreuveValidation: 'Concert public de mi-parcours : set de 20 minutes avec section rythmique ou solo.',
  },
  {
    id: 'palier-d',
    code: 'Permis D',
    couleur: 'Rouge',
    couleurCode: '#EF4444',
    badgeBg: 'bg-red-500/15 border-red-500/40 text-red-400',
    badgeText: 'Excellence & Professionnalisation',
    titre: 'Exercer son métier / Récital diplômant',
    dureeMoyenne: 'Cycle professionnel (1 an)',
    profil: 'Musiciens professionnels, chefs de chœur, futurs enseignants et artistes de scène',
    objectifs: [
      'Direction de répétition, balance régie autonome et maîtrise du protocole de scène',
      'Répertoire professionnel de plus de 20 pièces transversales (standards, musiques africaines, créations)',
      'Direction artistique d’un enregistrement studio ou d’un spectacle vivant complet',
      'Maîtrise des outils technologiques : MAO, enregistrement numérique et hybridation IA raisonnée',
    ],
    epreuveValidation: 'Grand Récital public validé par un jury d’experts et remise officielle du Certificat RMA.',
  },
]

export default function PermisDeJouerVisualizer() {
  const [activePalierId, setActivePalierId] = useState<string>('palier-a')

  const activePalier = PALIERS_DATA.find((p) => p.id === activePalierId) || PALIERS_DATA[0]

  return (
    <div className="rounded-2xl border border-gold/30 bg-ink-2/90 p-6 md:p-10 shadow-2xl backdrop-blur-md">
      {/* En-tête du visualiseur */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-wider text-gold">
              Dispositif Exclusif · Méthode Déposée RMA®
            </span>
          </div>
          <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
            Le Permis de Jouer™ : Quatre Paliers d'Excellence
          </h3>
          <p className="mt-2 text-xs text-ivory/70 max-w-2xl leading-relaxed">
            Inspiré de la progression par ceintures et permis de compétences, ce cadre breveté rend
            l'apprentissage musical transparent, motivant et rigoureux. Aucun flou : chaque étape valide des acquis techniques et artistiques mesurables.
          </p>
        </div>

        <a
          href="#candidature-audition"
          className="btn btn-gold text-xs font-bold uppercase tracking-wider py-2.5 px-5 shrink-0"
        >
          Postuler pour un palier ↗
        </a>
      </div>

      {/* Barre de navigation des Paliers (Boutons Paliers) */}
      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {PALIERS_DATA.map((p) => {
          const isActive = activePalierId === p.id
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePalierId(p.id)}
              className={`relative flex flex-col items-start rounded-xl border p-4 text-left transition-all duration-300 ${
                isActive
                  ? 'border-gold bg-ink shadow-[0_0_25px_rgba(198,161,91,0.25)]'
                  : 'border-white/10 bg-ink/50 hover:border-gold/40 hover:bg-ink'
              }`}
            >
              <div
                className="absolute top-0 left-0 bottom-0 w-1.5 rounded-l-xl transition-all"
                style={{ backgroundColor: p.couleurCode }}
              />
              <div className="pl-2 w-full">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xl text-ivory">{p.code}</span>
                  <span className={`rounded border px-2 py-0.5 text-[0.62rem] font-bold uppercase ${p.badgeBg}`}>
                    {p.couleur}
                  </span>
                </div>
                <p className="mt-2 text-xs font-semibold text-gold/90 truncate">{p.titre}</p>
                <p className="mt-0.5 font-mono text-[0.65rem] text-ivory/50">{p.dureeMoyenne}</p>
              </div>
            </button>
          )
        })}
      </div>

      {/* Fiche détaillée du palier actif */}
      <div className="mt-8 rounded-xl border border-white/10 bg-ink p-6 md:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/8 pb-5">
          <div className="flex items-center gap-3">
            <span
              className="h-4 w-4 rounded-full shadow-lg"
              style={{ backgroundColor: activePalier.couleurCode }}
            />
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gold">
                {activePalier.code} · Palier {activePalier.couleur}
              </span>
              <h4 className="font-display text-2xl text-ivory sm:text-3xl">
                « {activePalier.titre} »
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs text-ivory/80">
              Durée indicative : {activePalier.dureeMoyenne}
            </span>
            <span className={`rounded border px-3 py-1 text-xs font-semibold uppercase ${activePalier.badgeBg}`}>
              {activePalier.badgeText}
            </span>
          </div>
        </div>

        {/* Profil cible */}
        <div className="border-l-2 border-gold/40 pl-4 py-1">
          <span className="text-[0.68rem] uppercase tracking-wider text-ivory/50 block">Profil concerné</span>
          <p className="text-sm font-medium text-ivory/90 mt-0.5">{activePalier.profil}</p>
        </div>

        {/* Compétences & Objectifs validés */}
        <div>
          <h5 className="text-xs font-semibold uppercase tracking-wider text-gold mb-3">
            Compétences techniques et musicales à valider :
          </h5>
          <div className="grid gap-3 sm:grid-cols-2">
            {activePalier.objectifs.map((obj, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 rounded-lg border border-white/5 bg-white/[0.02] p-3 text-xs leading-relaxed text-ivory/80"
              >
                <span className="text-gold font-bold text-sm shrink-0">✓</span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Épreuve de validation officielle */}
        <div className="rounded-xl border border-gold/25 bg-gold/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="font-mono text-[0.68rem] uppercase tracking-wider text-gold block">
              Modalité d'évaluation certifiante
            </span>
            <p className="mt-1 text-xs text-ivory/90 font-medium">
              {activePalier.epreuveValidation}
            </p>
          </div>

          <a
            href="#candidature-audition"
            className="btn btn-outline text-xs uppercase tracking-wider font-bold py-2 px-4 whitespace-nowrap shrink-0"
          >
            S'inscrire à ce palier
          </a>
        </div>
      </div>
    </div>
  )
}
