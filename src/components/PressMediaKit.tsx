import { useState } from 'react'
import portraitYaounde from '../assets/about-portrait-yaounde.webp'
import portraitYaoundeJpg from '../assets/about-portrait-yaounde.jpg'
import affichePianobariste from '../assets/affiche-pianobariste.webp'
import liveScenePiano from '../assets/live-scene-piano.jpeg'
import liveBand from '../assets/live-band.webp'
import portraitStudio from '../assets/portrait.webp'
import { MASTER_IDENTITY } from '../data/identity'
import { SITE } from '../data/site'

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
  category: 'portrait' | 'scene' | 'affiche'
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
    id: 'vis-1',
    title: 'Portrait Éditorial Officiel — Yaoundé',
    category: 'portrait',
    categoryLabel: 'Portrait HD',
    dimensions: '760 × 1353 px (300 DPI)',
    weight: '640 Ko (WebP) / 4 Mo (JPG Master)',
    src: portraitYaounde,
    masterSrc: portraitYaoundeJpg,
    credit: '© Hervé Nanfang / A LAIZ PROD — Yaoundé',
    description: 'Portrait studio et lumière naturelle en extérieur. Idéal pour couvertures, interviews et articles de fond.',
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
    credit: '© Le Pianobariste™ — A LAIZ PROD',
    description: 'Affiche officielle de communication piano-bar et résidences d’hôtels de luxe.',
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
    credit: '© A LAIZ PROD Live Capture',
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
    credit: '© A LAIZ PROD Live Sessions',
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

export default function PressMediaKit() {
  const [selectedBio, setSelectedBio] = useState<BioFormat>('moyenne')
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null)

  const bioOptions: BioOption[] = [
    {
      id: 'express',
      label: 'Bio Express',
      targetWords: '~20 mots',
      idealFor: 'Réseaux sociaux, cartons d’invitation, signatures de mails',
      text: MASTER_IDENTITY.biographie.signature,
    },
    {
      id: 'courte',
      label: 'Bio Courte (Flyer & Programme)',
      targetWords: '~50 mots',
      idealFor: 'Programmes de salle, livrets de festivals, badges et introductions',
      text: MASTER_IDENTITY.biographie.courte,
    },
    {
      id: 'moyenne',
      label: 'Bio Médium (Dossier Presse & Festival)',
      targetWords: '~90 mots',
      idealFor: 'Articles de presse, dossiers de programmation, présentations de conférences',
      text: MASTER_IDENTITY.biographie.moyenne,
    },
    {
      id: 'longue',
      label: 'Bio Longue (Dossier Institutionnel)',
      targetWords: '~150 mots',
      idealFor: 'Presse écrite, podcasts, colloques académiques et dossiers de subvention',
      text: MASTER_IDENTITY.biographie.longue,
    },
    {
      id: 'reference',
      label: 'Bio Complète (Texte de Référence)',
      targetWords: '~300 mots',
      idealFor: 'Dossier de presse exhaustif, monographies, portraits médias complets',
      text: MASTER_IDENTITY.biographie.aPropos.join('\n\n'),
    },
  ]

  const activeBio = bioOptions.find((b) => b.id === selectedBio) || bioOptions[2]

  const handleCopyBio = async () => {
    try {
      await navigator.clipboard.writeText(activeBio.text)
      setCopyFeedback('Copié dans le presse-papier !')
      setTimeout(() => setCopyFeedback(null), 3500)
    } catch {
      setCopyFeedback('Sélectionnez le texte ci-dessous pour le copier manuellement.')
    }
  }

  const handleDownloadBio = () => {
    const element = document.createElement('a')
    const file = new Blob(
      [
        `HERVÉ NANFANG — DOSSIER DE PRESSE OFFICIEL\n`,
        `Format : ${activeBio.label} (${activeBio.targetWords})\n`,
        `Usage recommandé : ${activeBio.idealFor}\n`,
        `Date d'émission : ${new Date().toLocaleDateString('fr-FR')}\n`,
        `Contact presse : hervenanfang@gmail.com\n`,
        `Site officiel : https://hervenanfang.com\n`,
        `------------------------------------------------------------\n\n`,
        activeBio.text,
        `\n\n------------------------------------------------------------\n`,
        `Mention de désambiguïsation légale : ${MASTER_IDENTITY.positionnement.desambiguisation}\n`,
      ],
      { type: 'text/plain;charset=utf-8' }
    )
    element.href = URL.createObjectURL(file)
    element.download = `Herve-Nanfang-Bio-${activeBio.id}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const countWords = (str: string) => str.trim().split(/\s+/).filter(Boolean).length

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
          <a
            href="mailto:hervenanfang@gmail.com?subject=[Presse%20%2F%20Media]%20Demande%20d%27interview%20ou%20visuels"
            className="inline-flex items-center gap-2 border border-gold bg-gold/15 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold-2 transition-all hover:bg-gold hover:text-ink"
          >
            <span>Contacter le service presse</span>
            <span>→</span>
          </a>
        </div>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ivory/65">
          Cet espace met à disposition des journalistes, programmateurs de festivals, universités et
          médias audiovisuels les ressources textuelles et visuelles officielles validées par Hervé Nanfang
          et la société de production A LAIZ PROD.
        </p>
      </div>

      {/* SECTION 1: BIOGRAPHIES OFFICIELLES MULTI-FORMATS */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs text-gold/80 uppercase tracking-widest">Partie 1</span>
            <h4 className="font-display text-2xl text-ivory">Biographies officielles à copier</h4>
          </div>
          <span className="text-xs text-ivory/40">
            Textes d'autorité — conformes au Master Identity éditorial
          </span>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2">
          {bioOptions.map((opt) => {
            const isSelected = selectedBio === opt.id
            return (
              <button
                key={opt.id}
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
                Usage conseillé : <span className="text-ivory/80 font-sans normal-case">{activeBio.idealFor}</span>
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
            Notice éditoriale légale : {MASTER_IDENTITY.positionnement.desambiguisation}
          </div>
        </div>
      </div>

      {/* SECTION 2: FICHE SYNTHÉTIQUE POUR PROGRAMMATEURS */}
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <span className="font-mono text-xs text-gold/80 uppercase tracking-widest">Partie 2</span>
          <h4 className="font-display text-2xl text-ivory">Fiche d'identité synthétique & mentions officielles</h4>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-white/10 bg-white/[0.02] p-5">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-gold/80">Nom d'artiste / Scène</span>
            <p className="mt-2 font-display text-xl text-ivory">Hervé Nanfang</p>
            <p className="mt-1 text-xs text-ivory/50">Appellations : Le Pianobariste™, Le Musicien Augmenté™</p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-gold/80">Nationalité & Résidence</span>
            <p className="mt-2 font-display text-xl text-ivory">Camerounais</p>
            <p className="mt-1 text-xs text-ivory/50">Basé à Yaoundé (Cameroun) · Mobilité internationale</p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-gold/80">Casquettes d'autorité</span>
            <p className="mt-2 font-display text-lg text-ivory">5 piliers reconnus</p>
            <p className="mt-1 text-xs text-ivory/50">Artiste · Musicologue · Pédagogue · Son · IA appliquée</p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-gold/80">Marques Déposées</span>
            <p className="mt-2 font-display text-lg text-ivory">Propriété intellectuelle</p>
            <p className="mt-1 text-xs text-ivory/50">
              Le Pianobariste™, RMA®, Permis de Jouer™, Musicien Augmenté™, A LAIZ PROD
            </p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-gold/80">Langues de présentation</span>
            <p className="mt-2 font-display text-lg text-ivory">Français & Anglais</p>
            <p className="mt-1 text-xs text-ivory/50">Interventions, conférences et ateliers bilingues possibles</p>
          </div>

          <div className="border border-white/10 bg-white/[0.02] p-5">
            <span className="text-[0.68rem] font-mono uppercase tracking-wider text-gold/80">Instruments & Plateau</span>
            <p className="mt-2 font-display text-lg text-ivory">Piano acoustique & Claviers</p>
            <p className="mt-1 text-xs text-ivory/50">Chant solo, duo, quartet ou conférence-démonstration MAO</p>
          </div>
        </div>
      </div>

      {/* SECTION 3: VISUELS HD & PHOTOS DE PRESSE */}
      <div className="space-y-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-4">
          <div>
            <span className="font-mono text-xs text-gold/80 uppercase tracking-widest">Partie 3</span>
            <h4 className="font-display text-2xl text-ivory">Photothèque de presse & Visuels HD</h4>
          </div>
          <span className="text-xs text-ivory/40">
            Libres de droits pour couverture médiatique avec mention obligatoire du copyright
          </span>
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
                      <strong className="text-ivory/70 font-mono">Crédit :</strong> {vis.credit}
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
                    <span>Ouvrir / Télécharger HD (WebP)</span>
                  </a>

                  {vis.masterSrc && (
                    <a
                      href={vis.masterSrc}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex w-full items-center justify-center gap-2 border border-white/20 bg-white/5 py-2 text-[0.68rem] font-semibold uppercase tracking-wider text-ivory/80 transition-colors hover:border-gold/50 hover:text-gold"
                    >
                      <span>Télécharger Master Print (JPG 4 Mo)</span>
                      <span>↓</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 4: CONTACT PRESSE DÉDIÉ */}
      <div className="border border-gold/40 bg-gradient-to-r from-ink-2 via-ink to-ink-2 p-8 md:p-10">
        <div className="grid gap-8 md:grid-cols-[1.5fr_1fr] md:items-center">
          <div>
            <span className="text-[0.68rem] font-mono uppercase tracking-[0.2em] text-gold">
              Relations Presse & Bookings
            </span>
            <h4 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
              Besoin d'un angle spécifique, d'une interview ou d'un format sur mesure ?
            </h4>
            <p className="mt-3 text-sm leading-relaxed text-ivory/65">
              Hervé Nanfang est disponible pour les rédactions culturelles, podcasts spécialisés,
              reportages télévisés et tables rondes institutionnelles. Réponses assurées sous 24h à 48h.
            </p>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <a
              href="mailto:hervenanfang@gmail.com?subject=[Presse%20%2F%20Media]%20Demande%20d%27interview"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-gold bg-gold px-6 py-3 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105"
            >
              <span>hervenanfang@gmail.com</span>
              <span>✉</span>
            </a>
            <a
              href={`https://wa.me/${SITE.phones[0]?.whatsapp || '237694723492'}?text=Bonjour%20Hervé,%20je%20vous%20contacte%20dans%20le%20cadre%20d'une%20demande%20presse%20/%20média.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full sm:w-auto items-center justify-center gap-2 border border-white/20 bg-white/5 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory transition-colors hover:border-gold/50 hover:text-gold"
            >
              <span>WhatsApp Presse Direct</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
