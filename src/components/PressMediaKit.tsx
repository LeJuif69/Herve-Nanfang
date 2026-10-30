import { useState } from 'react'
import portraitYaounde from '../assets/about-portrait-yaounde.webp'
import portraitYaoundeJpg from '../assets/about-portrait-yaounde.jpg'
import affichePianobariste from '../assets/affiche-pianobariste.webp'
import liveScenePiano from '../assets/live-scene-piano.jpeg'
import liveBand from '../assets/live-band.webp'
import portraitStudio from '../assets/portrait.webp'
import { MASTER_IDENTITY } from '../data/identity'
import { SITE } from '../data/site'
import { trackContactMethodClick, trackEpkDownload } from '../lib/ad-pixels'

export type BioFormat = 'express' | 'courte' | 'moyenne' | 'longue' | 'reference'

export interface BioOption {
  id: BioFormat
  label: string
  targetWords: string
  idealFor: string
  text: string
}

export interface PressVisual {
  id: string
  title: string
  category: 'portrait' | 'scene' | 'affiche' | 'logo'
  categoryLabel: string
  dimensions: string
  weight: string
  src: string
  masterSrc?: string
  credit: string
  description: string
  recommendedUsage: string
}

export const PRESS_VISUALS: PressVisual[] = [
  {
    id: 'vis-logo',
    title: 'Monogramme & Logo Officiel HN (Or brossé, Clavier & Étoile)',
    category: 'logo',
    categoryLabel: 'Identité & Logo HD',
    dimensions: '1024 × 1024 px (Format Carré HD)',
    weight: '458 Ko (PNG Transparent)',
    src: '/hn-initials-mark.png',
    masterSrc: '/hn-logo-master.png',
    credit: '© Hervé Nanfang — Identité Visuelle Officielle',
    description: 'Logo officiel de la marque Hervé Nanfang : synthèse du piano acoustique, de l’architecture du son et de l’étoile d’horizon international.',
    recommendedUsage: 'Affiches, programmes de concerts, dossiers de presse, bannières médias et génériques vidéo',
  },
  {
    id: 'vis-1',
    title: 'Portrait Éditorial Officiel — Yaoundé',
    category: 'portrait',
    categoryLabel: 'Portrait HD',
    dimensions: '760 × 1353 px (Haute Définition)',
    weight: '640 Ko (WebP) / 4 Mo (JPG Master)',
    src: portraitYaounde,
    masterSrc: portraitYaoundeJpg,
    credit: '© Hervé Nanfang / A Laiz Ô Pays — Yaoundé',
    description: 'Portrait studio et lumière naturelle en extérieur. Idéal pour couvertures de magazines, interviews et articles de fond.',
    recommendedUsage: 'Presse écrite, magazines culturels, affiches de conférences',
  },
  {
    id: 'vis-2',
    title: 'Affiche de Prestation « Le Pianobariste™ »',
    category: 'affiche',
    categoryLabel: 'Affiche Officielle',
    dimensions: '1024 × 1536 px (Format A2 ready)',
    weight: '113 Ko (WebP)',
    src: affichePianobariste,
    credit: '© Hervé Nanfang — Le Pianobariste™',
    description: 'Affiche officielle de communication piano-bar et résidences d’hôtels de prestige.',
    recommendedUsage: 'Programmation hôtelière, événementiel VIP, affichage de salle',
  },
  {
    id: 'vis-3',
    title: 'Hervé & Flavie en Scène Live',
    category: 'scene',
    categoryLabel: 'Scène Live',
    dimensions: '1600 × 1067 px (16:9 HD)',
    weight: '155 Ko (JPEG)',
    src: liveScenePiano,
    credit: '© Hervé Nanfang — Live Capture',
    description: 'Duo piano et voix en live acoustique. Énergie de scène, complicité et présence organique.',
    recommendedUsage: 'Brochures de festivals, programmes de concerts, bannières web',
  },
  {
    id: 'vis-4',
    title: 'Quartet Live Band — Formation Scène',
    category: 'scene',
    categoryLabel: 'Scène & Groupe',
    dimensions: '1200 × 800 px (HD)',
    weight: '33 Ko (WebP)',
    src: liveBand,
    credit: '© Hervé Nanfang — Live Sessions',
    description: 'Formation en quartet jazz / afropop live. Idéal pour annoncer des prestations grand format.',
    recommendedUsage: 'Dossiers de programmation festivalière, presse musicale',
  },
  {
    id: 'vis-5',
    title: 'Portrait Studio Noir & Blanc / Face',
    category: 'portrait',
    categoryLabel: 'Studio & Trombinoscope',
    dimensions: '800 × 800 px (Carré 1:1)',
    weight: '137 Ko (WebP)',
    src: portraitStudio,
    credit: '© Hervé Nanfang — Studio Shoot',
    description: 'Portrait de face studio, regard direct. Parfait pour les badges intervenant, avatars presse et trombinoscopes.',
    recommendedUsage: 'Badges VIP, programmes de colloques, présentations de speakers',
  },
]

export const BIO_OPTIONS: BioOption[] = [
  {
    id: 'express',
    label: 'Bio express',
    targetWords: '~20 mots',
    idealFor: 'Réseaux sociaux, signatures et cartons d’invitation',
    text: MASTER_IDENTITY.biographie.signature,
  },
  {
    id: 'courte',
    label: 'Bio courte',
    targetWords: '~50 mots',
    idealFor: 'Programmes de spectacles, affiches et présentations d’intervenants',
    text: MASTER_IDENTITY.biographie.courte,
  },
  {
    id: 'moyenne',
    label: 'Bio moyenne',
    targetWords: '~90 mots',
    idealFor: 'Articles, festivals, podcasts et dossiers de programmation',
    text: MASTER_IDENTITY.biographie.moyenne,
  },
  {
    id: 'longue',
    label: 'Bio longue',
    targetWords: '~150 mots',
    idealFor: 'Portraits, publications institutionnelles et présentations académiques',
    text: MASTER_IDENTITY.biographie.longue,
  },
  {
    id: 'reference',
    label: 'Biographie de référence',
    targetWords: '~300 mots',
    idealFor: 'Présentation détaillée du parcours, des domaines d’activité et des projets',
    text: MASTER_IDENTITY.biographie.aPropos.join('\n\n'),
  },
]

/* ========================================================================= */
/* COMPOSANT 1 : BIOGRAPHIES OFFICIELLES                                      */
/* ========================================================================= */
export function PressBiographies() {
  const [selectedBio, setSelectedBio] = useState<BioFormat>('moyenne')
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  const activeBio = BIO_OPTIONS.find((b) => b.id === selectedBio) || BIO_OPTIONS[2]

  const handleCopyBio = async () => {
    try {
      await navigator.clipboard.writeText(activeBio.text)
      setCopyFeedback('✓ Copié dans le presse-papier !')
      setTimeout(() => setCopyFeedback(null), 3500)
    } catch {
      setCopyFeedback('Sélectionnez le texte ci-dessous pour le copier manuellement.')
    }
  }

  const handleDownloadBio = () => {
    const element = document.createElement('a')
    const file = new Blob(
      [
        `HERVÉ NANFANG — BIOGRAPHIE OFFICIELLE DE RÉFÉRENCE\n`,
        `Format : ${activeBio.label} (${activeBio.targetWords})\n`,
        `Usage recommandé : ${activeBio.idealFor}\n`,
        `Date d'émission : ${new Date().toLocaleDateString('fr-FR')}\n`,
        `Concept fondateur & univers créatif : A Laiz Ô Pays\n`,
        `Contact presse : ${SITE.emailContact}\n`,
        `Site officiel : https://hervenanfang.vercel.app\n`,
        `------------------------------------------------------------\n\n`,
        activeBio.text,
        `\n\n------------------------------------------------------------\n`,
        `Notice légale & attribution : ${MASTER_IDENTITY.positionnement.desambiguisation}\n`,
        `Pour toute adaptation spécifique, contactez directement le service presse.\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    element.href = URL.createObjectURL(file)
    element.download = `Herve-Nanfang-Bio-${activeBio.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    trackEpkDownload(`bio-${activeBio.id}`)
  }

  const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length

  return (
    <div className="space-y-6">
      <div className="border border-white/10 bg-ink-2/40 p-5 text-xs text-ivory/70 leading-relaxed">
        <p>
          Pour garantir la cohérence des informations publiées, merci de privilégier les versions
          disponibles dans cet espace ou de contacter directement le service presse pour une adaptation
          spécifique.
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex flex-wrap gap-2">
        {BIO_OPTIONS.map((opt) => {
          const isSelected = selectedBio === opt.id
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedBio(opt.id)}
              className={`rounded px-4 py-2 text-xs font-mono transition-all ${
                isSelected
                  ? 'border border-gold bg-gold/20 text-gold-2 font-semibold shadow-sm'
                  : 'border border-white/10 bg-white/5 text-ivory/60 hover:border-white/20 hover:text-ivory'
              }`}
            >
              <span>{opt.label}</span>
              <span className="ml-2 text-[0.68rem] opacity-60">({opt.targetWords})</span>
            </button>
          )
        })}
      </div>

      {/* Bio Reader & Actions */}
      <div className="border border-white/10 bg-white/[0.02] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-wider text-gold">
              Usage recommandé : <span className="text-ivory/80 font-sans normal-case">{activeBio.idealFor}</span>
            </p>
            <p className="mt-1 text-[0.72rem] text-ivory/40">
              Longueur effective : {countWords(activeBio.text)} mots · {activeBio.text.length} caractères
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {copyFeedback && (
              <span className="rounded bg-emerald-500/20 px-3 py-1 font-mono text-xs text-emerald-300 animate-pulse">
                {copyFeedback}
              </span>
            )}
            <button
              type="button"
              onClick={handleCopyBio}
              className="inline-flex items-center gap-2 border border-gold/70 bg-gold/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gold-2 transition-colors hover:bg-gold hover:text-ink"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copier la bio</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadBio}
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 px-3 py-2 text-xs uppercase tracking-wider text-ivory/70 transition-colors hover:border-white/40 hover:text-ivory"
              title="Télécharger le texte en format TXT"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>Format .TXT</span>
            </button>
          </div>
        </div>

        <div className="mt-6 whitespace-pre-line font-sans text-[15px] leading-[1.9] text-ivory/80 md:text-base">
          {activeBio.text}
        </div>

        {/* Legal Notice */}
        <div className="mt-6 border-t border-white/5 pt-4 text-[0.75rem] italic text-ivory/40">
          Notice éditoriale & attribution : {MASTER_IDENTITY.positionnement.desambiguisation}
        </div>
      </div>
    </div>
  )
}

/* ========================================================================= */
/* COMPOSANT 2 : PHOTOTHÈQUE & IDENTITÉ VISUELLE                              */
/* ========================================================================= */
export function PressVisualsGallery() {
  return (
    <div className="space-y-6">
      <div className="border border-white/10 bg-ink-2/40 p-5 text-xs text-ivory/70 leading-relaxed space-y-2">
        <p>
          Les portraits, photographies de scène et éléments d’identité visuelle disponibles dans cet
          espace sont destinés à illustrer les publications éditoriales, programmes, annonces
          d’événements et présentations professionnelles autorisées.
        </p>
        <p>
          Pour chaque visuel, les informations de crédit et les conditions d’utilisation doivent être
          respectées. Pour une publication imprimée, une campagne commerciale ou un usage nécessitant
          une très haute résolution spécifique, il est recommandé de demander le fichier adapté avant
          diffusion auprès du service presse.
        </p>
        <p className="font-mono text-gold pt-1">
          Crédit photographique obligatoire : utiliser le crédit indiqué sur chaque fichier ou confirmé par le service presse.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PRESS_VISUALS.map((vis) => (
          <div
            key={vis.id}
            className="flex flex-col border border-white/10 bg-ink-2 overflow-hidden transition-all duration-200 hover:border-gold/40"
          >
            {/* Thumbnail Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-black/40">
              <img
                src={vis.src}
                alt={vis.title}
                loading="lazy"
                onError={(e) => {
                  const fallbackMap: Record<string, string> = {
                    'vis-logo': '/hn-initials-mark.png',
                    'vis-1': '/images/about-portrait-yaounde.webp',
                    'vis-2': '/images/affiche-pianobariste.webp',
                    'vis-3': '/images/live-scene-piano.jpeg',
                    'vis-4': '/images/live-band.webp',
                    'vis-5': '/images/portrait.webp',
                  }
                  const fb = fallbackMap[vis.id]
                  if (fb && e.currentTarget.src !== fb && !e.currentTarget.src.endsWith(fb)) {
                    e.currentTarget.src = fb
                  }
                }}
                className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <span className="absolute top-3 left-3 rounded-full border border-white/20 bg-ink/80 px-2.5 py-0.5 text-[0.62rem] font-mono uppercase tracking-wider text-ivory backdrop-blur-sm">
                {vis.categoryLabel}
              </span>
            </div>

            {/* Info Details */}
            <div className="flex flex-1 flex-col justify-between p-5">
              <div>
                <h5 className="font-display text-lg text-ivory leading-snug">{vis.title}</h5>
                <p className="mt-2 text-xs leading-relaxed text-ivory/60">{vis.description}</p>

                <div className="mt-4 space-y-1.5 border-t border-white/8 pt-3 text-[0.72rem] text-ivory/45">
                  <p>
                    <strong className="text-ivory/70 font-mono">Format :</strong> {vis.dimensions}
                  </p>
                  <p>
                    <strong className="text-ivory/70 font-mono">Poids :</strong> {vis.weight}
                  </p>
                  <p>
                    <strong className="text-ivory/70 font-mono">Crédit obligatoire :</strong> {vis.credit}
                  </p>
                  <p>
                    <strong className="text-ivory/70 font-mono">Usage conseillé :</strong> {vis.recommendedUsage}
                  </p>
                </div>
              </div>

              <div className="mt-5 border-t border-white/8 pt-4 space-y-2">
                <a
                  href={vis.src}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="inline-flex w-full items-center justify-center gap-2 border border-gold/60 bg-gold/10 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-2 transition-colors hover:bg-gold hover:text-ink"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                  <span>{vis.category === 'logo' ? 'Télécharger Logo PNG' : 'Télécharger Image Web / HD'}</span>
                </a>

                {vis.masterSrc && (
                  <a
                    href={vis.masterSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex w-full items-center justify-center gap-2 border border-white/20 bg-white/5 py-2 text-[0.68rem] font-semibold uppercase tracking-wider text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
                  >
                    <span>{vis.category === 'logo' ? 'Master PNG HD (1024 px)' : 'Master Print Haute Définition (JPG 4 Mo)'}</span>
                    <span>↓</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border border-white/5 bg-ink p-4 text-center text-xs text-ivory/50">
        <span>Autorisation d’utilisation éditoriale et presse avec mention obligatoire du copyright. Tout usage commercial, publicitaire ou merchandising est soumis à accord écrit préalable.</span>
      </div>
    </div>
  )
}

/* ========================================================================= */
/* COMPOSANT PAR DÉFAUT (POUR ABOUT.TSX ET RÉUTILISATIONS GLOBALES)          */
/* ========================================================================= */
export default function PressMediaKit() {
  return (
    <div id="media-kit" className="space-y-16">
      {/* Intro Header */}
      <div className="border border-gold/30 bg-ink-2 p-8 md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[0.68rem] font-mono uppercase tracking-[0.2em] text-gold">
              Espace Médias & Journalistes
            </span>
            <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
              Dossier de Presse & Kit Média Officiel
            </h3>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://canva.link/2l6atbuzkax2k6g"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackEpkDownload('portfolio-canva')}
              className="inline-flex items-center gap-2 border border-gold bg-gold px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-all hover:bg-gold-2 hover:shadow-lg hover:shadow-gold/20"
            >
              <span>Portfolio & CV Interactif (Canva)</span>
              <span>↗</span>
            </a>
            <a
              href={`mailto:${SITE.emailContact}?subject=[Presse%20%2F%20Media]%20Demande%20d%27interview%20ou%20visuels`}
              onClick={() => trackContactMethodClick('email', 'presse')}
              className="inline-flex items-center gap-2 border border-gold/50 bg-gold/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-2 transition-all hover:bg-gold hover:text-ink"
            >
              <span>Contacter le service presse</span>
              <span>→</span>
            </a>
          </div>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ivory/65">
          Cet espace rassemble les ressources textuelles, photographiques et techniques officielles
          validées par Hervé Nanfang et rattachées à son univers créatif A Laiz Ô Pays.
        </p>
      </div>

      {/* Partie 1 : Biographies */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="font-mono text-xs text-gold/80 uppercase tracking-widest">Partie 1</span>
          <h4 className="font-display text-2xl text-ivory">Biographies officielles à copier</h4>
        </div>
        <PressBiographies />
      </div>

      {/* Partie 2 : Photothèque */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="font-mono text-xs text-gold/80 uppercase tracking-widest">Partie 2</span>
          <h4 className="font-display text-2xl text-ivory">Photothèque de presse & Visuels HD</h4>
        </div>
        <PressVisualsGallery />
      </div>
    </div>
  )
}
