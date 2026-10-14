import { useAudio } from '../lib/audio-context'

export interface MoodPreset {
  id: string
  label: string
  icon: string
  trackId: string
  mood: string
  tempo: string
  context: string
}

export const MOOD_PRESETS: MoodPreset[] = [
  {
    id: 'lounge',
    label: 'Palace & Lounge Feutré',
    icon: '🍸',
    trackId: 'pianobariste-live',
    mood: 'Intimiste, velouté & feutré',
    tempo: '72 BPM',
    context: 'Dîners diplomatiques, salons d’hôtels 5 étoiles, soirées feutrées',
  },
  {
    id: 'duo',
    label: 'Duo Piano-Voix Signature',
    icon: '🕯️',
    trackId: 'duo-acoustique',
    mood: 'Complice, chaleureux & expressif',
    tempo: '76 BPM',
    context: 'Cocktails raffinés, réceptions privées, mariages de prestige',
  },
  {
    id: 'afrojazz',
    label: 'Makossa & Afro-Jazz',
    icon: '🌴',
    trackId: 'afro-jazz-makossa',
    mood: 'Syncopé, solaire & percussif',
    tempo: '112 BPM',
    context: 'Concerts de gala, festivals, célébrations du patrimoine camerounais',
  },
  {
    id: 'rumba',
    label: 'Rumba & Afropop Acoustique',
    icon: '☀️',
    trackId: 'afropop-rumba',
    mood: 'Dansant, élégant & panafricain',
    tempo: '96 BPM',
    context: 'Soirées internationales, cocktails d’entreprise, atmosphère solaire',
  },
  {
    id: 'poetique',
    label: 'Nocturne Poétique & Soul',
    icon: '🌙',
    trackId: 'soul-chanson-poetique',
    mood: 'Émouvant, rubato & feutré',
    tempo: '68 BPM',
    context: 'Clôture de soirée, hommage aux grands maîtres de la chanson poétique',
  },
  {
    id: 'cinematic',
    label: 'Composition Scénique',
    icon: '🎬',
    trackId: 'composition-theme',
    mood: 'Noble, cinématique & contemplatif',
    tempo: '64 BPM',
    context: 'Spectacle vivant, musique à l’image, créations artistiques originales',
  },
  {
    id: 'ia',
    label: 'Musicien Augmenté & IA',
    icon: '🎛️',
    trackId: 'ia-musique-recherche',
    mood: 'Exploratoire, moderne & hybride',
    tempo: '84 BPM',
    context: 'Recherche sonore, démonstrations technologiques, masterclasses MAO/IA',
  },
]

export default function AudioStageConsole() {
  const {
    currentTrack,
    playbackState,
    currentTime,
    duration,
    volume,
    isMuted,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    selectTrack,
    nextTrack,
    prevTrack,
    openPlayer,
    playlist,
  } = useAudio()

  const isPlaying = playbackState === 'playing'

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handlePresetClick = (preset: MoodPreset) => {
    const targetTrack = playlist.find((t) => t.id === preset.trackId)
    if (targetTrack) {
      if (currentTrack?.id === targetTrack.id) {
        togglePlay()
      } else {
        selectTrack(targetTrack, true)
      }
    }
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div className="relative overflow-hidden border border-gold/40 bg-gradient-to-br from-ink-2 via-ink to-ink-2 p-6 md:p-8 shadow-2xl">
      {/* Background Ambient Glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />

      {/* Console Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-3 w-3 items-center justify-center">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                isPlaying ? 'bg-gold animate-ping' : 'bg-gold/40'
              }`}
            />
          </span>
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
            Console de Diffusion Acoustique Live
          </span>
          <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5 text-[0.62rem] font-mono text-ivory/60">
            Web Audio 24-bit
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={openPlayer}
            className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-3.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-gold-2 hover:bg-gold hover:text-ink transition-colors"
          >
            <span>Lecteur immersif plein écran</span>
            <span>↗</span>
          </button>
        </div>
      </div>

      {/* Main Player Display: Track Info & Animated Spectrum */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-gold/30 bg-gold/10 px-2 py-0.5 font-mono text-[0.62rem] text-gold uppercase tracking-wider">
              {currentTrack?.category || 'Piano-bar & Live'}
            </span>
            {currentTrack?.tempo && (
              <span className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[0.62rem] text-ivory/70">
                {currentTrack.tempo}
              </span>
            )}
            {currentTrack?.mood && (
              <span className="hidden sm:inline-block text-[0.68rem] text-gold/75 font-sans italic">
                Ambiance : {currentTrack.mood}
              </span>
            )}
          </div>

          <h3 className="mt-3 font-display text-2xl text-ivory md:text-3xl leading-snug">
            {currentTrack?.title || 'Sélectionnez une ambiance ci-dessous'}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-ivory/65 max-w-xl">
            {currentTrack?.description}
          </p>

          {currentTrack?.sceneContext && (
            <p className="mt-2.5 text-[0.72rem] text-ivory/45 italic border-l border-gold/40 pl-2.5">
              « {currentTrack.sceneContext} »
            </p>
          )}
        </div>

        {/* Dynamic Spectrum Equalizer Animation */}
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/8 bg-white/[0.02] p-5">
          <div className="flex items-end gap-1.5 h-16 w-full max-w-xs justify-center">
            {[45, 75, 90, 60, 30, 85, 100, 70, 50, 80, 95, 65, 40, 85, 60, 90, 75, 55].map(
              (h, i) => {
                const animDuration = (0.5 + (i % 6) * 0.15).toFixed(2)
                const animDelay = ((i * 0.08) % 0.5).toFixed(2)
                return (
                  <span
                    key={i}
                    className="w-1.5 rounded-t transition-all"
                    style={{
                      height: isPlaying ? `${h}%` : '8%',
                      backgroundColor: isPlaying ? '#c5a059' : 'rgba(255, 255, 255, 0.2)',
                      animation: isPlaying
                        ? `pulse ${animDuration}s ease-in-out infinite alternate ${animDelay}s`
                        : 'none',
                    }}
                  />
                )
              }
            )}
          </div>

          <span className="mt-3 font-mono text-[0.65rem] uppercase tracking-wider text-ivory/50">
            {isPlaying ? 'Fréquences harmoniques actives' : 'Diffusion en attente'}
          </span>
        </div>
      </div>

      {/* Scrub Bar & Audio Time Controls */}
      <div className="mt-7 border-t border-white/8 pt-5 space-y-2">
        <div className="flex items-center justify-between text-xs font-mono text-ivory/60">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 mx-4">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={(e) => seek(parseFloat(e.target.value))}
              aria-label="Position de lecture"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/15 accent-gold"
              style={{
                background: `linear-gradient(to right, #c5a059 ${progressPercent}%, rgba(255,255,255,0.15) ${progressPercent}%)`,
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Playback Transport Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={prevTrack}
              aria-label="Morceau précédent"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ivory/70 hover:border-gold hover:text-gold transition-colors"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <polygon points="19 20 9 12 19 4 19 20" />
                <line x1="5" y1="19" x2="5" y2="5" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-gold bg-gold text-ink shadow-[0_0_15px_rgba(197,160,89,0.5)] transition-transform hover:scale-105"
            >
              {isPlaying ? (
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="h-4 w-4 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={nextTrack}
              aria-label="Morceau suivant"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-ivory/70 hover:border-gold hover:text-gold transition-colors"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <polygon points="5 4 15 12 5 20 5 4" />
                <line x1="19" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
              </svg>
            </button>

            <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-ivory/80 hidden sm:inline">
              {isPlaying ? 'Lecture en direct' : 'En pause'}
            </span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={toggleMute}
              aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
              className="text-ivory/60 hover:text-gold transition-colors"
            >
              {isMuted || volume === 0 ? (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : (
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                  />
                </svg>
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              aria-label="Volume audio"
              className="h-1.5 w-16 sm:w-24 cursor-pointer appearance-none rounded-lg bg-white/15 accent-gold"
            />
          </div>
        </div>
      </div>

      {/* Bar à Ambiances Sonores — Mood Presets */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="text-[0.68rem] font-mono uppercase tracking-widest text-gold mb-3">
          Bar à Ambiances Sonores — Choisissez l’atmosphère de votre événement :
        </p>

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {MOOD_PRESETS.map((preset) => {
            const isPresetActive = currentTrack?.id === preset.trackId
            const isPresetPlaying = isPresetActive && isPlaying

            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`flex flex-col items-start rounded-lg border p-3 text-left transition-all duration-200 ${
                  isPresetActive
                    ? 'border-gold bg-gold/15 text-gold-2 shadow-sm'
                    : 'border-white/10 bg-white/[0.02] text-ivory/70 hover:border-gold/40 hover:bg-white/[0.05]'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-base">{preset.icon}</span>
                  <span className="font-mono text-[0.6rem] text-gold/80">{preset.tempo}</span>
                </div>
                <span className="mt-2 text-xs font-bold leading-tight line-clamp-1">
                  {preset.label}
                </span>
                <span className="mt-0.5 text-[0.65rem] text-ivory/50 truncate w-full">
                  {preset.mood}
                </span>
                <span className="mt-2 inline-flex items-center gap-1 text-[0.62rem] font-semibold uppercase tracking-wider text-gold">
                  {isPresetPlaying ? 'Pause ❚❚' : 'Écouter ▶'}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
