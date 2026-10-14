import { useState } from 'react'
import type { LivePerformance } from '../data/music'
import { LIVE_PERFORMANCES } from '../data/music'
import affiche from '../assets/affiche-pianobariste.webp'
import liveScene from '../assets/live-scene-piano.jpeg'
import liveBand from '../assets/live-band.webp'
import portrait from '../assets/portrait.webp'

interface LiveStageVideoTheaterProps {
  onOpenVideoModal: (performance: LivePerformance) => void
}

const THUMBNAIL_MAP: Record<string, string> = {
  affiche,
  liveScene,
  liveBand,
  portrait,
}

export interface TechRider {
  formatName: string
  pianoRequired: string
  soundSystem: string
  microphones: string
  monitoring: string
  powerAndLines: string
  setupTime: string
}

const TECH_RIDERS: Record<string, TechRider> = {
  solo: {
    formatName: 'Format Solo Prestige (Le Pianobariste™)',
    pianoRequired: 'Piano à queue acoustique accordé le jour même (ou clavier de scène 88 touches toucher marteaux Nord/Yamaha fourni par l’artiste).',
    soundSystem: 'Système sono colonne discret haut de gamme (Bose L1 Pro / RCF Evox) ou raccordement à la sonorisation d’ambiance du lieu.',
    microphones: '1 micro chant dynamique/statique (Shure Beta 58A ou Neumann KMS 105) sur pied noir discret.',
    monitoring: '1 retour de scène ou in-ear monitor autonome.',
    powerAndLines: '2 prises 220V 16A standard à proximité du clavier. Ligne XLR stéréo vers régie.',
    setupTime: '45 minutes (installation silencieuse & balance discrète avant l’arrivée des convives).',
  },
  duo: {
    formatName: 'Format Duo Signature (Hervé & Flavie)',
    pianoRequired: 'Piano acoustique 88 touches ou clavier de scène professionnel + stand double.',
    soundSystem: 'Sonorisation façade stéréo adaptée à une jauge de 50 à 350 personnes.',
    microphones: '2 micros voix (1 voix lead Flavie + 1 micro chant/chœur Hervé Nanfang) avec pieds perches.',
    monitoring: '2 retours de scène indépendants (circuits d’écoute séparés piano et voix).',
    powerAndLines: '4 prises 220V 16A. 2 boîtiers DI stéréo professionnels.',
    setupTime: '60 minutes (balance complète voix et piano).',
  },
  quartet: {
    formatName: 'Format Formation Élargie (Live Band — Trio / Quartet)',
    pianoRequired: 'Claviers de scène (Piano principal + synthétiseur/orgue) avec routing multipaires.',
    soundSystem: 'Système de sonorisation de grande envergure avec caisson de basses et diffusion homogène.',
    microphones: 'Kit micro complet : 2 micros voix, repiquage percussions traditionnelles et batterie complète.',
    monitoring: '3 à 4 retours de scène ou émetteurs in-ear monitors professionnels.',
    powerAndLines: 'Alimentation 32A ou 3 circuits 16A séparés. Boîtier de scène 12 canaux minimum.',
    setupTime: '90 à 120 minutes (balance par section rythmique et balance d’ensemble).',
  },
}

export default function LiveStageVideoTheater({ onOpenVideoModal }: LiveStageVideoTheaterProps) {
  const [activeVideoId, setActiveVideoId] = useState<string>(LIVE_PERFORMANCES[0].id)
  const [selectedRiderFormat, setSelectedRiderFormat] = useState<'solo' | 'duo' | 'quartet'>('solo')

  const activePerformance =
    LIVE_PERFORMANCES.find((p) => p.id === activeVideoId) || LIVE_PERFORMANCES[0]

  const activeRider = TECH_RIDERS[selectedRiderFormat]

  return (
    <div className="space-y-12">
      {/* Featured Video Theater Screen */}
      <div className="relative overflow-hidden border border-gold/40 bg-ink-2 shadow-2xl">
        <div className="grid lg:grid-cols-[1.3fr_0.9fr]">
          {/* Video Preview Screen with Play trigger */}
          <div
            className="group relative aspect-video w-full overflow-hidden bg-black cursor-pointer lg:aspect-auto lg:h-full"
            onClick={() => onOpenVideoModal(activePerformance)}
          >
            <img
              src={THUMBNAIL_MAP[activePerformance.thumbnailKey] || affiche}
              alt={activePerformance.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-85 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

            {/* Glowing Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-ink/80 text-gold shadow-[0_0_30px_rgba(197,160,89,0.6)] backdrop-blur-md transition-transform duration-300 group-hover:scale-115 group-hover:bg-gold group-hover:text-ink">
                <svg className="h-6 w-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </div>
            </div>

            {/* Corner Live Badges */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded bg-crimson px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-white shadow-md">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                Captation 4K
              </span>
              <span className="rounded border border-white/20 bg-ink/80 px-2 py-0.5 text-[0.62rem] font-mono text-ivory backdrop-blur-sm">
                ⏱ {activePerformance.duration}
              </span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-ivory/80">
              <span className="font-mono bg-ink/80 px-2 py-1 rounded backdrop-blur-sm text-gold">
                📍 {activePerformance.location}
              </span>
              <span className="text-[0.68rem] uppercase tracking-wider text-ivory/70 bg-ink/80 px-2 py-1 rounded backdrop-blur-sm">
                Cliquer pour ouvrir le player interactif ↗
              </span>
            </div>
          </div>

          {/* Details & Setlist Cue Selector */}
          <div className="flex flex-col justify-between p-6 sm:p-8 border-t border-white/10 lg:border-t-0 lg:border-l lg:border-white/10 bg-white/[0.01]">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
                  {activePerformance.category}
                </span>
                <span className="rounded border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.65rem] text-ivory/70">
                  {activePerformance.format}
                </span>
              </div>

              <h3 className="mt-3 font-display text-2xl text-ivory sm:text-3xl leading-snug">
                {activePerformance.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-gold/80">
                {activePerformance.subtitle}
              </p>

              <p className="mt-3 text-xs leading-relaxed text-ivory/65">
                {activePerformance.description}
              </p>

              <div className="mt-4 border-l border-gold/40 pl-3 text-xs text-ivory/75">
                <p>
                  <strong className="text-ivory font-mono">Musiciens :</strong> {activePerformance.musicians}
                </p>
              </div>

              {/* Setlist Interactive Repères */}
              {activePerformance.setlist && activePerformance.setlist.length > 0 && (
                <div className="mt-6 border-t border-white/8 pt-4">
                  <span className="text-[0.65rem] font-mono uppercase tracking-wider text-ivory/40 block mb-2">
                    Repères du concert & Pièces interprétées :
                  </span>
                  <div className="space-y-1.5">
                    {activePerformance.setlist.map((cue, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onOpenVideoModal(activePerformance)}
                        className="flex w-full items-center justify-between rounded border border-white/8 bg-white/[0.02] px-3 py-1.5 text-left text-xs transition-colors hover:border-gold/40 hover:bg-gold/10"
                      >
                        <span className="text-ivory/80 line-clamp-1">{cue.label}</span>
                        <span className="font-mono text-[0.68rem] text-gold shrink-0 ml-2">
                          {cue.time}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Action Trigger */}
            <div className="mt-6 border-t border-white/8 pt-4 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => onOpenVideoModal(activePerformance)}
                className="inline-flex items-center gap-2 border border-gold bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-transform hover:scale-105"
              >
                <span>Lancer la captation vidéo</span>
                <span>▶</span>
              </button>

              <a
                href={activePerformance.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-ivory/60 hover:text-gold transition-colors"
              >
                <span>Chaîne YouTube officielle</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Grid of All Available Video Performances */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-white/10 pb-3">
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
            Catalogue de captations live ({LIVE_PERFORMANCES.length} sessions)
          </span>
          <span className="text-xs text-ivory/40">
            Sélectionnez une session pour l’afficher dans le lecteur
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIVE_PERFORMANCES.map((perf) => {
            const isSelected = activeVideoId === perf.id
            return (
              <div
                key={perf.id}
                onClick={() => setActiveVideoId(perf.id)}
                className={`group cursor-pointer border p-4 transition-all duration-200 ${
                  isSelected
                    ? 'border-gold bg-gold/10 shadow-md'
                    : 'border-white/10 bg-ink-2/60 hover:border-white/20 hover:bg-white/[0.02]'
                }`}
              >
                <div className="relative aspect-video w-full overflow-hidden rounded bg-black/40">
                  <img
                    src={THUMBNAIL_MAP[perf.thumbnailKey] || affiche}
                    alt={perf.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[0.62rem] text-ivory/80">
                    <span className="font-mono bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm">
                      {perf.duration}
                    </span>
                    <span className="text-gold font-semibold truncate max-w-[60%]">
                      {perf.format}
                    </span>
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-[0.62rem] font-mono uppercase tracking-wider text-gold/80">
                    {perf.category}
                  </span>
                  <h4 className="mt-1 font-display text-base text-ivory group-hover:text-gold-2 line-clamp-1 transition-colors">
                    {perf.title}
                  </h4>
                  <p className="mt-1 text-xs text-ivory/55 line-clamp-2 leading-relaxed">
                    {perf.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* DISPOSITIF SCÉNIQUE & FICHE TECHNIQUE DE PLATEAU */}
      <div className="rounded-xl border border-gold/30 bg-ink-2 p-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              Pour Programmateurs & Directeurs Techniques
            </span>
            <h4 className="mt-1 font-display text-2xl text-ivory">
              Dispositif Scénique & Fiche Régie Plateau
            </h4>
          </div>

          {/* Format selector buttons */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'solo' as const, label: 'Solo Prestige' },
              { id: 'duo' as const, label: 'Duo Signature' },
              { id: 'quartet' as const, label: 'Live Band / Quartet' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedRiderFormat(f.id)}
                className={`rounded px-3 py-1.5 text-xs font-mono transition-all ${
                  selectedRiderFormat === f.id
                    ? 'border border-gold bg-gold/20 text-gold-2 font-bold'
                    : 'border border-white/10 bg-white/5 text-ivory/60 hover:text-ivory'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="border border-white/8 bg-white/[0.02] p-4">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-gold">
              Piano & Claviers
            </span>
            <p className="mt-1 text-xs leading-relaxed text-ivory/75">
              {activeRider.pianoRequired}
            </p>
          </div>

          <div className="border border-white/8 bg-white/[0.02] p-4">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-gold">
              Diffusion Sonore & Façade
            </span>
            <p className="mt-1 text-xs leading-relaxed text-ivory/75">
              {activeRider.soundSystem}
            </p>
          </div>

          <div className="border border-white/8 bg-white/[0.02] p-4">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-gold">
              Micros Voix & Instruments
            </span>
            <p className="mt-1 text-xs leading-relaxed text-ivory/75">
              {activeRider.microphones}
            </p>
          </div>

          <div className="border border-white/8 bg-white/[0.02] p-4">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-gold">
              Retours Scène & Monitoring
            </span>
            <p className="mt-1 text-xs leading-relaxed text-ivory/75">
              {activeRider.monitoring}
            </p>
          </div>

          <div className="border border-white/8 bg-white/[0.02] p-4">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-gold">
              Alimentation & Lignes Régie
            </span>
            <p className="mt-1 text-xs leading-relaxed text-ivory/75">
              {activeRider.powerAndLines}
            </p>
          </div>

          <div className="border border-white/8 bg-white/[0.02] p-4">
            <span className="text-[0.65rem] font-mono uppercase tracking-wider text-gold">
              Temps d’Installation & Balance
            </span>
            <p className="mt-1 text-xs leading-relaxed text-ivory/75">
              {activeRider.setupTime}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
          <span className="text-xs text-ivory/50">
            Fiche technique indicative modifiable selon les contraintes acoustiques du lieu d’accueil.
          </span>
          <a
            href="mailto:hervenanfang@gmail.com?subject=[Fiche%20R%C3%A9gie%20Sc%C3%A8ne]%20Demande%20de%20d%C3%A9tails%20techniques"
            className="text-xs uppercase tracking-wider text-gold hover:text-gold-2 font-bold"
          >
            Contacter la régie technique d'Hervé Nanfang ↗
          </a>
        </div>
      </div>
    </div>
  )
}
