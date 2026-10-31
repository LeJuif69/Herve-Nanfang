import { useState } from 'react'
import { Link } from 'react-router-dom'
import affiche from '../assets/affiche-pianobariste.webp'
import liveBand from '../assets/live-scene-piano.jpeg'
import PageHero from '../components/PageHero'
import VideoModal from '../components/VideoModal'
import RepertoireExplorer from '../components/RepertoireExplorer'
import AudioStageConsole from '../components/AudioStageConsole'
import LiveStageVideoTheater from '../components/LiveStageVideoTheater'
import {
  ArrowLink,
  Body,
  Btn,
  Card,
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
import {
  MUSIC_SECTIONS,
  PRESTIGE_VENUES,
  REPERTOIRE_UNIVERSES,
  STAGE_FORMATS,
  TECHNICAL_STANDARDS,
  type LivePerformance,
} from '../data/music'
import { AUDIO_PLAYLIST, type AudioTrack } from '../data/audio'
import { ARTICLES } from '../data/articles'
import { useAudio } from '../lib/audio-context'
import { breadcrumbSchema, creativeWorkSchema, musicGroupSchema, serviceSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'

export default function Music() {
  const {
    currentTrack,
    playbackState,
    togglePlay,
    selectTrack,
    openPlayer,
  } = useAudio()

  const [selectedVideo, setSelectedVideo] = useState<LivePerformance | null>(null)
  const [audioFilter, setAudioFilter] = useState<string>('all')
  const [selectedScenario, setSelectedScenario] = useState<'cocktail' | 'gala' | 'concert'>('cocktail')

  const liveTrack = AUDIO_PLAYLIST.find((t) => t.id === 'pianobariste-live') || AUDIO_PLAYLIST[0]

  const filteredTracks = AUDIO_PLAYLIST.filter((track) => {
    if (audioFilter === 'all') return true
    if (audioFilter === 'piano') return track.id === 'pianobariste-live'
    if (audioFilter === 'duo') return track.id === 'duo-acoustique'
    if (audioFilter === 'patrimoine') return track.id === 'afro-jazz-makossa'
    if (audioFilter === 'afropop') return track.id === 'afropop-rumba'
    if (audioFilter === 'poetique') return track.id === 'soul-chanson-poetique'
    if (audioFilter === 'guerisseurs') return track.id === 'concert-guerisseurs'
    if (audioFilter === 'cinema') return track.id === 'cinema-narration-visuelle'
    if (audioFilter === 'composition') return track.id === 'composition-theme' || track.id === 'cinema-narration-visuelle' || track.id === 'concert-guerisseurs'
    if (audioFilter === 'studio') return track.id === 'mao-sound-design' || track.id === 'ia-musique-recherche'
    return true
  })

  useSeo({
    title: 'Musique | Hervé Nanfang — Piano, Composition & Production',
    description:
      "Piano-bar live depuis 2007, formats solo, duo et live band, composition originale et ingénierie du son : l'univers musical d'Hervé Nanfang.",
    path: '/musique',
    jsonLd: [
      musicGroupSchema,
      creativeWorkSchema(
        'Le Pianobariste',
        'Format de piano live créé par Hervé Nanfang pour hôtels de prestige, lounges et événements.',
      ),
      serviceSchema(
        'Prestation piano-bar live',
        'Piano live pour palaces, hôtels, lounges, cérémonies et événements privés ou institutionnels.',
        'Spectacle vivant',
      ),
      serviceSchema(
        'Production musicale & ingénierie du son',
        'Composition, arrangement, prise de son, mixage et production musicale pour artistes et contenus audiovisuels.',
        'Production musicale',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Musique', path: '/musique' },
      ]),
    ],
  })

  const handleTrackClick = (track: AudioTrack) => {
    if (currentTrack?.id === track.id) {
      togglePlay()
    } else {
      selectTrack(track, true)
    }
  }

  return (
    <>
      <PageHero
        breadcrumb="Musique"
        eyebrow="Créer · Le Pianobariste™"
        title="La musique comme langage, métier et présence"
        lead="De la scène au studio, en passant par l’image et le spectacle : une pratique musicale construite sur la scène depuis 2007, avec une exigence constante de précision acoustique et de justesse émotionnelle."
      >
        <div className="grid max-w-3xl grid-cols-2 gap-6 sm:grid-cols-4">
          <Stat value="2007" label="Piano-bar live" />
          <Stat value="440+" label="Titres au répertoire" />
          <Stat value="10" label="Univers musicaux" />
          <Stat value="03" label="Formats de scène" />
        </div>
      </PageHero>

      {/* Le Pianobariste — Philosophie & Identité */}
      <Section tone="dark" id="pianobariste">
        <div className="grid gap-16 lg:grid-cols-[1fr_1fr] lg:items-center">
          <Reveal>
            <div className="relative mx-auto w-full max-w-md">
              <img
                src={affiche}
                alt="Affiche Le Pianobariste — piano live, hôtels, lounges, événements, concerts privés"
                width={1024}
                height={1536}
                loading="lazy"
                onError={(e) => {
                  if (!e.currentTarget.src.includes('/images/affiche-pianobariste.webp')) {
                    e.currentTarget.src = '/images/affiche-pianobariste.webp'
                  }
                }}
                className="zoomable shadow-2xl rounded-sm object-cover"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-gold/10 blur-3xl"
              />
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Eyebrow>Format signature</Eyebrow>
            <Display size="lg" className="mt-6">
              Le Pianobariste™
            </Display>
            <p className="mt-6 font-display text-2xl leading-snug text-gold md:text-3xl">
              « I don’t perform. I set the mood. »
            </p>
            <Body className="mt-7 max-w-xl">
              Depuis 2007, ce format définit une manière unique d’habiter un lieu : une présence
              musicale continue, capable de porter une salle entière sans jamais devenir un simple fond
              sonore interchangeable. Une virtuosité élégante au service des convives, de
              l’architecture et de l’instant.
            </Body>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Btn to="/contact#booking" variant="gold">
                Réserver une date
              </Btn>
              <button
                type="button"
                onClick={() => {
                  if (liveTrack) selectTrack(liveTrack, true)
                  openPlayer()
                }}
                className="btn btn-ghost inline-flex items-center gap-2 border-gold/40 text-gold hover:border-gold hover:bg-gold/10"
              >
                <svg className="h-4 w-4 fill-current text-gold" viewBox="0 0 24 24">
                  <polygon points="6 3 20 12 6 21 6 3" />
                </svg>
                <span>Écouter l’ambiance live ♫</span>
              </button>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* NOUVEAU MODULE : LA SCÈNE SONORE — ÉCOUTES & ENREGISTREMENTS AUDIO         */}
      {/* ========================================================================= */}
      <Section tone="ink" id="enregistrements">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="♫" label="Enregistrements & Audio" />
              <Display size="md" className="mt-6 max-w-2xl">
                La Scène Sonore — Écoutes & Extraits de scène
              </Display>
              <Lead className="mt-4 max-w-xl">
                Huit univers de captation et de travail sonore. Choisissez une ambiance pour configurer instantanément la console, auditionner les progressions harmoniques et lancer le lecteur acoustique.
              </Lead>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={openPlayer}
                className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-ink transition-colors"
              >
                <span className="h-2 w-2 rounded-full bg-gold animate-ping" />
                <span>Ouvrir le lecteur grand écran</span>
              </button>
            </div>
          </div>
        </Reveal>

        {/* Console Interactive & Bar à Ambiances Sonores */}
        <Reveal delay={40}>
          <div className="mt-10">
            <AudioStageConsole />
          </div>
        </Reveal>

        {/* Filtres de catégories audio */}
        <Reveal delay={60}>
          <div className="mt-12 flex flex-wrap gap-2 border-b border-white/10 pb-4">
            {[
              { id: 'all', label: `Tous les extraits (${AUDIO_PLAYLIST.length})` },
              { id: 'piano', label: 'Piano-bar & Standards' },
              { id: 'duo', label: 'Duo Signature' },
              { id: 'patrimoine', label: 'Afro-Jazz' },
              { id: 'afropop', label: 'Rumba & Afropop' },
              { id: 'poetique', label: 'Nocturne & Soul' },
              { id: 'guerisseurs', label: 'Guérisseurs & Thérapie' },
              { id: 'cinema', label: 'Musique à l’image' },
              { id: 'composition', label: 'Compositions' },
              { id: 'studio', label: 'Studio & IA' },
            ].map((cat) => {
              const isActive = audioFilter === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setAudioFilter(cat.id)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'border border-gold bg-gold text-ink shadow-[0_0_15px_rgba(198,161,91,0.3)]'
                      : 'border border-white/15 bg-white/5 text-ivory/70 hover:border-gold/40 hover:text-ivory'
                  }`}
                >
                  {cat.label}
                </button>
              )
            })}
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {filteredTracks.map((track, idx) => {
            const isThisTrackPlaying = currentTrack?.id === track.id && playbackState === 'playing'
            const isThisTrackSelected = currentTrack?.id === track.id

            return (
              <Reveal key={track.id} delay={idx * 60}>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => handleTrackClick(track)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleTrackClick(track)
                    }
                  }}
                  className={`group relative flex cursor-pointer flex-col justify-between border p-6 transition-all duration-300 md:p-7 ${
                    isThisTrackSelected
                      ? 'border-gold bg-ink-2 shadow-[0_0_25px_rgba(198,161,91,0.22)]'
                      : 'border-white/10 bg-ink-2/70 hover:border-gold/50 hover:bg-ink-2'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs text-gold/80">
                          Piste {String(idx + 1).padStart(2, '0')}
                        </span>
                        {track.tempo && (
                          <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-[0.62rem] text-gold/90 border border-white/10">
                            {track.tempo}
                          </span>
                        )}
                      </div>
                      <span className="rounded border border-white/10 bg-ink px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-ivory/60">
                        {track.category}
                      </span>
                    </div>

                    <h3 className="mt-4 font-display text-2xl text-ivory transition-colors group-hover:text-gold-2">
                      {track.title}
                    </h3>

                    {track.mood && (
                      <p className="mt-1 text-xs font-semibold text-gold/75">
                        Ambiance : {track.mood}
                      </p>
                    )}

                    <p className="mt-2.5 text-xs leading-relaxed text-ivory/65">
                      {track.description}
                    </p>

                    {track.sceneContext && (
                      <div className="mt-3.5 border-l border-gold/30 pl-3">
                        <p className="text-[0.68rem] italic text-ivory/50">
                          « {track.sceneContext} »
                        </p>
                      </div>
                    )}

                    {track.instruments && track.instruments.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {track.instruments.map((inst) => (
                          <span
                            key={inst}
                            className="rounded bg-white/5 px-2 py-0.5 text-[0.62rem] text-ivory/60"
                          >
                            {inst}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-white/8 pt-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-300 group-hover:scale-105 ${
                          isThisTrackPlaying
                            ? 'border-gold bg-gold text-ink'
                            : 'border-gold/50 bg-gold/10 text-gold'
                        }`}
                      >
                        {isThisTrackPlaying ? (
                          <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                            <rect x="6" y="4" width="4" height="16" />
                            <rect x="14" y="4" width="4" height="16" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </div>

                      <span className="text-xs font-semibold uppercase tracking-wider text-ivory/80 group-hover:text-gold">
                        {isThisTrackPlaying ? 'Lecture en cours…' : 'Écouter l’extrait de scène'}
                      </span>
                    </div>

                    {isThisTrackPlaying ? (
                      <div className="flex items-end gap-1 h-4">
                        <span className="w-1 bg-gold animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
                        <span className="w-1 bg-gold animate-[pulse_0.4s_ease-in-out_infinite] h-3/4" />
                        <span className="w-1 bg-gold animate-[pulse_0.8s_ease-in-out_infinite] h-1/2" />
                        <span className="w-1 bg-gold animate-[pulse_0.5s_ease-in-out_infinite] h-full" />
                      </div>
                    ) : (
                      <span className="font-mono text-[0.68rem] text-ivory/40">
                        {Math.floor(track.duration / 60)}:
                        {String(track.duration % 60).padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        {/* Encadré technique : Restitution acoustique & Web Audio API */}
        <Reveal delay={120}>
          <div className="mt-12 rounded-xl border border-gold/20 bg-ink-2/60 p-6 md:p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <span className="font-mono text-[0.65rem] uppercase tracking-wider text-gold">
                  Précision acoustique & Expérience en direct
                </span>
                <h4 className="mt-1 font-display text-xl text-ivory">
                  Clavier de concert 88 touches & Restitution temps réel
                </h4>
                <p className="mt-2 text-xs leading-relaxed text-ivory/70">
                  En studio comme sur scène, chaque extrait reflète l’exigence acoustique d'Hervé Nanfang :
                  toucher lourd à marteaux, harmonisation subtile et diffusion sans distorsion.
                  Le lecteur intègre une synthèse interactive Web Audio garantissant l'écoute immédiate des progressions harmoniques.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (liveTrack) selectTrack(liveTrack, true)
                    openPlayer()
                  }}
                  className="btn btn-gold whitespace-nowrap px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
                >
                  Auditionner le son live ♫
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </Section>

      {/* 3 Formats de Scène */}
      <Section tone="dark" id="formats">
        <Reveal>
          <ChapterMark num="01" label="Formules de scène" />
          <Display size="md" className="mt-7 max-w-3xl">
            Trois formats taillés pour chaque envergure d’événement
          </Display>
          <Lead className="mt-4 max-w-2xl">
            Du salon feutré pour dîner d'État jusqu'à la grande réception festive, chaque formule est
            calibrée pour une adéquation parfaite avec l'espace et l'assistance.
          </Lead>
        </Reveal>

        <div className="mt-14 grid gap-8 lg:grid-cols-3">
          {STAGE_FORMATS.map((format, i) => (
            <Reveal key={format.id} delay={i * 100}>
              <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-8">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-2xl text-gold/80">{format.num}</span>
                    <span className="rounded border border-gold/30 bg-gold/5 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-wider text-gold">
                      Live Mood
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-2xl text-ivory">{format.title}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gold/75">
                    {format.subtitle}
                  </p>

                  <div className="mt-4 border-l border-gold/30 pl-3">
                    <p className="text-[0.6875rem] uppercase tracking-wider text-ivory/50">
                      Idéal pour
                    </p>
                    <p className="mt-0.5 text-xs text-ivory/80 leading-relaxed">{format.audience}</p>
                  </div>

                  <p className="mt-5 text-sm leading-relaxed text-ivory/65">{format.description}</p>

                  <ul className="mt-6 space-y-2 border-t border-white/5 pt-5 text-xs text-ivory/70">
                    {format.highlights.map((h, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-gold font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 border-t border-white/10 pt-4">
                  <ArrowLink to="/contact#booking">Demander les disponibilités</ArrowLink>
                </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>

        {/* ========================================================================= */}
        {/* SIMULATEUR DE FORMULE LIVE & RECOMMANDATION ACOUSTIQUE                    */}
        {/* ========================================================================= */}
        <Reveal delay={120}>
          <div className="mt-14 border border-gold/30 bg-gradient-to-br from-gold/10 via-ink-2 to-ink p-7 md:p-10 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <p className="eyebrow text-gold font-mono">✦ Guide Décisionnel Organisateur</p>
                <h3 className="mt-1 font-display text-2xl md:text-3xl text-ivory">
                  Simulateur de Formule Événementielle
                </h3>
              </div>
              <p className="text-xs text-ivory/60 max-w-sm">
                Sélectionnez la typologie de votre événement pour identifier instantanément le format sonore et le répertoire adaptés.
              </p>
            </div>

            {/* Selectors */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { id: 'cocktail', label: '🍸 Cocktail & Lounge', sub: 'Ambiance feutrée, conversations' },
                { id: 'gala', label: '👑 Dîner de Gala & Cérémonie', sub: 'Montée progressive, prestige' },
                { id: 'concert', label: '🎉 Soirée Festive / Concert', sub: 'Rythmes entraînants, danse' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedScenario(s.id as any)}
                  className={`text-left p-4 rounded border transition-all ${
                    selectedScenario === s.id
                      ? 'border-gold bg-gold/20 shadow-[0_0_20px_rgba(198,161,91,0.25)]'
                      : 'border-white/10 bg-ink hover:border-gold/40'
                  }`}
                >
                  <p className="text-sm font-bold text-ivory">{s.label}</p>
                  <p className="text-xs text-ivory/50 mt-1">{s.sub}</p>
                </button>
              ))}
            </div>

            {/* Recommendation details */}
            <div className="mt-6 border border-white/10 bg-ink/80 p-6">
              {selectedScenario === 'cocktail' && (
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                  <div>
                    <span className="rounded bg-gold/20 text-gold px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider border border-gold/30">
                      Recommandation : Session Lounge Piano Solo (2 h)
                    </span>
                    <h4 className="mt-2 font-display text-xl text-ivory">Élégance acoustique et présence feutrée</h4>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/70">
                      Piano solo intimiste. Plus de 440 titres explorant le jazz feutré, la bossa nova subtile et les ballades francophones & internationales.
                      Garantie acoustique : volume modéré permettant à vos invités d'échanger sans forcer la voix.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <Btn to="/contact?formula=lounge#booking" variant="gold" className="w-full md:w-auto text-center justify-center">
                      Réserver la formule Lounge →
                    </Btn>
                    <span className="text-[0.65rem] text-ivory/40">Piano fourni sur demande si le lieu n'est pas équipé</span>
                  </div>
                </div>
              )}

              {selectedScenario === 'gala' && (
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                  <div>
                    <span className="rounded bg-gold/20 text-gold px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider border border-gold/30">
                      Recommandation : Soirée Prestige (3 à 4 h) · Solo ou Duo Voix-Piano
                    </span>
                    <h4 className="mt-2 font-display text-xl text-ivory">Montée en intensité et grands standards</h4>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/70">
                      Accompagnement dynamique du cocktail d'accueil jusqu'au dessert. Répertoire enrichi de soul poétique, afropop acoustique et reprises personnalisées à la demande des hôtes.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <Btn to="/contact?formula=prestige#booking" variant="gold" className="w-full md:w-auto text-center justify-center">
                      Réserver la formule Prestige →
                    </Btn>
                    <span className="text-[0.65rem] text-ivory/40">Idéal pour mariages d'exception et dîners protocolaires</span>
                  </div>
                </div>
              )}

              {selectedScenario === 'concert' && (
                <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr] md:items-center">
                  <div>
                    <span className="rounded bg-gold/20 text-gold px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider border border-gold/30">
                      Recommandation : Programme Live Band (Set 45 à 90 min)
                    </span>
                    <h4 className="mt-2 font-display text-xl text-ivory">Énergie scénique, Afrobeat & Makossa festif</h4>
                    <p className="mt-2 text-xs leading-relaxed text-ivory/70">
                      Claviers, basse, batterie, voix et cuivres invités. Un show calibré pour clore un festival, une convention d'entreprise ou une grande fête privée avec une énergie communicative.
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 md:items-end">
                    <Btn to="/contact?formula=liveband#booking" variant="gold" className="w-full md:w-auto text-center justify-center">
                      Réserver le Live Band →
                    </Btn>
                    <span className="text-[0.65rem] text-ivory/40">Fiche technique et rider fournis sur mesure</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </Section>

      {/* ========================================================================= */}
      {/* RÉFÉRENCES & LIEUX DE PRESTIGE                                            */}
      {/* ========================================================================= */}
      <Section tone="ink" id="lieux-prestige">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="02" label="Références & Scènes" />
              <Display size="md" className="mt-6 max-w-2xl">
                Lieux & Résidences de prestige
              </Display>
              <Lead className="mt-4 max-w-xl">
                Depuis 2007, Le Pianobariste™ s'est installé dans les adresses hôtelières, les salons diplomatiques et les événements les plus exigeants du Cameroun et d'Afrique centrale.
              </Lead>
            </div>
            <div className="border border-gold/30 bg-gold/5 px-4 py-2.5 rounded text-xs font-mono text-gold">
              <span>✦ Présence scénique vérifiée</span>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PRESTIGE_VENUES.map((v, i) => (
            <Reveal key={v.name} delay={i * 70}>
              <div className="flex h-full flex-col justify-between border border-white/10 bg-ink-2/90 p-7 hover:border-gold/40 transition-colors">
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider text-gold">
                      {v.badge}
                    </span>
                    <span className="text-[0.65rem] text-ivory/40 uppercase tracking-wider font-mono">
                      {v.city}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-xl text-ivory">{v.name}</h3>
                  <p className="mt-1 text-xs text-gold/80 font-medium">{v.category}</p>
                  <Rule className="my-4 opacity-20" />
                  <p className="text-xs leading-relaxed text-ivory/65">{v.context}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* CAPTATIONS & VIDÉOS SCÉNIQUES                                             */}
      {/* ========================================================================= */}
      <Section tone="dark" id="videos-live">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="03" label="Captations & Vidéos" />
              <Display size="md" className="mt-6 max-w-2xl">
                Vidéos live — Scène, Jazz & Piano-bar
              </Display>
              <Lead className="mt-4 max-w-xl">
                Découvrez la présence scénique, l’alchimie acoustique et la réactivité en direct d’Hervé Nanfang
                à travers nos captations de concerts, sessions piano-bar et festivals.
              </Lead>
            </div>

            <a
              href="https://www.youtube.com/@hervenanfang"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 border border-crimson/50 bg-crimson/15 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-crimson-2 hover:bg-crimson hover:text-white transition-colors"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <span>Chaîne YouTube officielle ↗</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={60}>
          <div className="mt-10">
            <LiveStageVideoTheater onOpenVideoModal={setSelectedVideo} />
          </div>
        </Reveal>
      </Section>

      {/* Répertoire Vivant par Univers & Catalogue Complet */}
      <Section tone="dark" id="repertoire">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <Reveal>
            <ChapterMark num="04" label="Répertoire vivant" />
            <Display size="md" className="mt-7">
              Dix univers stylistiques, plus de 440 œuvres maîtrisées
            </Display>
            <Lead className="mt-6 max-w-xl">
              La polyvalence n’est pas un défaut de spécialisation : c’est la noblesse du live.
              Comprendre l'énergie du lieu, lire les regards et choisir la bonne note au bon moment.
            </Lead>

            <div className="mt-10 space-y-6">
              {REPERTOIRE_UNIVERSES.map((u, idx) => (
                <div key={idx} className="border-l-2 border-gold/40 pl-5">
                  <h4 className="font-display text-xl text-ivory">{u.category}</h4>
                  <p className="mt-1 text-xs text-ivory/60 leading-relaxed">{u.description}</p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {u.references.map((ref) => (
                      <span
                        key={ref}
                        className="rounded border border-white/10 bg-ink-2 px-2 py-0.5 text-[0.625rem] font-medium text-ivory/70"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <figure className="relative">
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                <img
                  src={liveBand}
                  alt="Hervé Nanfang au piano avec Flavie au chant lors d’une prestation live"
                  width={1400}
                  height={783}
                  loading="lazy"
                  onError={(e) => {
                    if (!e.currentTarget.src.includes('/images/live-band.webp')) {
                      e.currentTarget.src = '/images/live-band.webp'
                    }
                  }}
                  className="zoomable w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between text-[0.68rem] uppercase tracking-[0.18em] text-ivory/50">
                <span>Hervé & Flavie · Duo Live</span>
                <span>Yaoundé · Douala · International</span>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        {/* Explorateur Interactif de Répertoire (441 titres) */}
        <Reveal delay={150}>
          <RepertoireExplorer />
        </Reveal>
      </Section>

      {/* Fiche Technique & Exigences Professionnelles */}
      <Section tone="ink" id="technique">
        <Reveal>
          <ChapterMark num="05" label="Exigence & Matériel" />
          <Display size="md" className="mt-7">
            Régie autonome & standards professionnels
          </Display>
          <Lead className="mt-4 max-w-2xl">
            La sérénité d'un événement repose sur une logistique invisible et sans faille. Hervé Nanfang
            garantit une installation autonome et un rendu sonore calibré pour les lieux prestigieux.
          </Lead>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TECHNICAL_STANDARDS.map((tech, i) => (
            <Reveal key={tech.title} delay={i * 80}>
              <Card className="h-full border-white/8 bg-ink p-6">
                <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                <h4 className="mt-3 font-display text-xl text-ivory">{tech.title}</h4>
                <p className="mt-3 text-xs leading-relaxed text-ivory/60">{tech.text}</p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Les Trois Pratiques : Scène, Composition, Studio */}
      <Section tone="dark">
        <Reveal>
          <ChapterMark num="06" label="Métiers" />
          <Display size="md" className="mt-7 max-w-3xl">
            Trois pratiques, une même matière : le son
          </Display>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {MUSIC_SECTIONS.map((s, i) => (
            <Reveal key={s.title} delay={i * 80}>
              <Card className="h-full">
                <span className="font-display text-lg text-gold/60">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 font-display text-2xl text-ivory">{s.title}</h3>
                <Rule className="opacity-40" />
                <Body className="mt-4">{s.text}</Body>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* ========================================================================= */}
      {/* LE JOURNAL — ANALYSES DU SCÉNOGRAPHE ET MUSICOLOGUE                       */}
      {/* ========================================================================= */}
      <Section tone="ink" id="journal-musique">
        <Reveal>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <ChapterMark num="07" label="Le Journal • Scène & Musique" />
              <Display size="md" className="mt-6 max-w-2xl">
                Analyses, culture scénique & réflexions musicales
              </Display>
              <Lead className="mt-4 max-w-2xl">
                La pratique du live ne s’arrête pas au dernier accord. Retrouvez les analyses de fond,
                retours d'expérience et perspectives musicologiques publiés dans le Journal.
              </Lead>
            </div>
            <Btn to="/journal" variant="ghost" className="self-start md:self-auto shrink-0">
              Explorer tout le Journal →
            </Btn>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {ARTICLES.filter((a) =>
            [
              'fela-kuti-afrobeat-revolution-musicale-politique',
              'musique-a-l-image-cinema-africain',
              'ia-et-musique-live',
            ].includes(a.slug),
          ).map((article, i) => (
            <Reveal key={article.slug} delay={i * 80}>
              <Link to={`/journal/${article.slug}`} className="group block h-full">
                <SpotlightCard className="flex h-full flex-col justify-between border-white/10 bg-ink-2 p-7 transition-colors group-hover:border-gold/50">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-gold/80 uppercase tracking-wider">
                        {article.category}
                      </span>
                      <span className="text-[0.62rem] uppercase tracking-wider text-ivory/45">
                        {article.readingTime}
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-xl leading-snug text-ivory transition-colors group-hover:text-gold-2">
                      {article.title}
                    </h3>
                    <p className="mt-3 text-xs leading-relaxed text-ivory/60 line-clamp-3">
                      {article.excerpt}
                    </p>
                  </div>
                  <div className="mt-6 border-t border-white/5 pt-3 flex items-center justify-between">
                    <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-gold group-hover:text-gold-2 inline-flex items-center gap-1.5">
                      Lire l’article <span>→</span>
                    </span>
                    <span className="text-[0.6rem] uppercase tracking-wider text-ivory/40">Hervé Nanfang</span>
                  </div>
                </SpotlightCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        eyebrow="Booking Direct"
        title="Réserver une prestation live"
        text="Palaces, lounges, réceptions privées, cocktails de prestige ou galas : formule solo, duo ou formation complète adaptée à votre événement."
        primary={{ label: 'Ouvrir le formulaire de booking', to: '/contact#booking' }}
        secondary={{ label: 'Voir les conférences', to: '/conferences' }}
      />

      <VideoModal
        performance={selectedVideo}
        isOpen={!!selectedVideo}
        onClose={() => setSelectedVideo(null)}
      />
    </>
  )
}
