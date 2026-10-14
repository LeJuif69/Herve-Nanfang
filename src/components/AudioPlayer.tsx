import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { isTrackPlayable } from '../data/audio'
import { formatTime, useAudio } from '../lib/audio-context'

export default function AudioPlayer() {
  const {
    currentTrack,
    playlist,
    playbackState,
    currentTime,
    duration,
    volume,
    isMuted,
    errorMessage,
    isPlayerOpen,
    frequencyData,
    hasWebAudio,
    togglePlay,
    seek,
    setVolume,
    toggleMute,
    selectTrack,
    nextTrack,
    prevTrack,
    togglePlayerOpen,
    closePlayer,
    openPlayer,
  } = useAudio()

  const [showPlaylist, setShowPlaylist] = useState(false)
  const playerRef = useRef<HTMLDivElement>(null)

  const isPlaying = playbackState === 'playing'
  const isPlayable = isTrackPlayable(currentTrack)

  // Gestion des raccourcis clavier quand le focus est dans le lecteur
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Ne pas intercepter si l'utilisateur tape dans un champ de formulaire
    const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase()
    if (targetTag === 'input' && (e.target as HTMLInputElement).type === 'text') return
    if (targetTag === 'textarea') return

    switch (e.key) {
      case ' ':
      case 'k':
      case 'K':
        e.preventDefault()
        togglePlay()
        break
      case 'm':
      case 'M':
        e.preventDefault()
        toggleMute()
        break
      case 'ArrowLeft':
        e.preventDefault()
        seek(Math.max(0, currentTime - 5))
        break
      case 'ArrowRight':
        e.preventDefault()
        seek(Math.min(duration, currentTime + 5))
        break
      case 'ArrowUp':
        e.preventDefault()
        setVolume(Math.min(1, volume + 0.05))
        break
      case 'ArrowDown':
        e.preventDefault()
        setVolume(Math.max(0, volume - 0.05))
        break
      case 'Escape':
        e.preventDefault()
        if (showPlaylist) {
          setShowPlaylist(false)
        } else if (isPlayerOpen) {
          closePlayer()
        }
        break
    }
  }

  // Fermer la playlist au clic extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (playerRef.current && !playerRef.current.contains(event.target as Node)) {
        setShowPlaylist(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Libellé textuel de l'état
  const getStateBadge = () => {
    switch (playbackState) {
      case 'playing':
        return { label: 'Lecture en cours', color: 'border-gold/60 text-gold bg-gold/10' }
      case 'paused':
        return { label: 'En pause', color: 'border-white/20 text-ivory/70 bg-white/5' }
      case 'loading':
        return { label: 'Chargement...', color: 'border-gold/40 text-gold-2 bg-gold/5' }
      case 'unavailable':
        return { label: 'Master en attente', color: 'border-gold/30 text-gold/80 bg-gold/5' }
      case 'error':
        return { label: 'Erreur source', color: 'border-crimson text-crimson-2 bg-crimson/10' }
      case 'ready':
      default:
        return { label: 'Prêt', color: 'border-white/20 text-ivory/70 bg-white/5' }
    }
  }

  const badge = getStateBadge()

  return (
    <div
      ref={playerRef}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="La Scène Sonore — Lecteur audio d'Hervé Nanfang"
      tabIndex={0}
      className="fixed bottom-4 right-4 z-40 max-w-[calc(100vw-2rem)] outline-none sm:bottom-6 sm:right-6 sm:max-w-md focus-visible:ring-1 focus-visible:ring-gold"
    >
      {/* ============================================================
          1. ÉTAT ÉTENDU DU LECTEUR (EXPANDED DRAWER)
          ============================================================ */}
      {isPlayerOpen ? (
        <div className="relative overflow-hidden rounded-2xl border border-gold/30 bg-ink-2/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 sm:p-6 sm:w-[420px]">
          {/* Lueur d'ambiance dorée supérieure */}
          <div
            aria-hidden
            className="pointer-events-none absolute -top-16 left-1/2 h-32 w-48 -translate-x-1/2 rounded-full bg-gold/10 blur-2xl"
          />

          {/* En-tête du lecteur */}
          <div className="relative flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="inline-block h-2 w-2 rounded-full bg-gold animate-pulse" />
              <span className="font-display text-lg tracking-[0.02em] text-ivory">
                La Scène Sonore
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[0.625rem] font-semibold uppercase tracking-[0.18em] ${badge.color}`}
              >
                {badge.label}
              </span>
              <button
                type="button"
                onClick={closePlayer}
                aria-label="Réduire le lecteur audio"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-ivory/60 transition-colors hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <svg
                  className="h-3.5 w-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* Informations sur le morceau courant */}
          <div className="relative mt-4">
            <p className="eyebrow text-[0.6rem] text-gold/80">{currentTrack?.category}</p>
            <h3 className="mt-1 font-display text-xl leading-tight text-ivory">
              {currentTrack?.title}
            </h3>
            {currentTrack?.description && (
              <p className="mt-1 text-xs leading-relaxed text-ivory/60">
                {currentTrack.description}
              </p>
            )}
          </div>

          {/* Note sur la source acoustique ou master en attente */}
          {currentTrack?.status === 'acoustic_demo' && !currentTrack.src && (
            <div className="mt-3 rounded-lg border border-gold/30 bg-gold/5 p-2.5 text-[0.72rem] text-ivory/80">
              <div className="flex items-start gap-2">
                <span className="text-gold shrink-0">♫</span>
                <div>
                  <p className="font-medium text-gold">Aperçu acoustique interactif</p>
                  <p className="mt-0.5 text-ivory/60 leading-normal">
                    Synthèse harmonique temps réel. Déposez{' '}
                    <code className="text-gold font-mono text-[0.68rem] bg-ink-3 px-1 py-0.5 rounded">
                      public/audio/{currentTrack.expectedFile}
                    </code>{' '}
                    pour activer le master studio.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Message d'erreur éventuel */}
          {errorMessage && isPlayable && (
            <div className="mt-3 rounded-lg border border-crimson/30 bg-crimson/10 p-2.5 text-xs text-crimson-2">
              {errorMessage}
            </div>
          )}

          {/* Visualiseur de spectre sonore */}
          <div className="mt-4 flex h-8 items-end justify-center gap-1.5 px-4" aria-hidden>
            {frequencyData.map((val, idx) => (
              <span
                key={idx}
                className={`w-1 rounded-full transition-all duration-75 ${
                  isPlaying
                    ? hasWebAudio
                      ? 'bg-gradient-to-t from-gold-3 to-gold'
                      : 'bg-gold animate-soundbar'
                    : 'bg-white/15'
                }`}
                style={{
                  height: isPlaying ? (hasWebAudio ? `${val}%` : '60%') : '15%',
                  animationDelay: `${idx * 0.18}s`,
                }}
              />
            ))}
          </div>

          {/* Barre de progression interactive (Seek Bar) */}
          <div className="mt-4">
            <div className="group relative flex items-center">
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={0.1}
                value={currentTime}
                disabled={!isPlayable}
                onChange={(e) => seek(parseFloat(e.target.value))}
                aria-label="Barre de progression du morceau"
                aria-valuetext={`${formatTime(currentTime)} sur ${formatTime(duration)}`}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-gold transition-all hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40"
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[0.6875rem] font-mono text-ivory/50">
              <span>{formatTime(currentTime)}</span>
              <span>{isPlayable ? formatTime(duration) : '--:--'}</span>
            </div>
          </div>

          {/* Contrôles principaux : Morceau précédent / Lecture-Pause / Morceau suivant */}
          <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-2">
              {/* Bouton Piste précédente */}
              <button
                type="button"
                onClick={prevTrack}
                aria-label="Morceau précédent"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ivory/70 transition-all hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="19 20 9 12 19 4 19 20" />
                  <line x1="5" y1="19" x2="5" y2="5" />
                </svg>
              </button>

              {/* Bouton Principal Lecture / Pause */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
                className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink font-semibold transition-all hover:bg-gold-2 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(198,161,91,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-2"
              >
                {isPlaying ? (
                  <svg
                    className="h-5 w-5 fill-current"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg
                    className="ml-0.5 h-5 w-5 fill-current"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <polygon points="6 3 20 12 6 21 6 3" />
                  </svg>
                )}
              </button>

              {/* Bouton Piste suivante */}
              <button
                type="button"
                onClick={nextTrack}
                aria-label="Morceau suivant"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-ivory/70 transition-all hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="5 4 15 12 5 20 5 4" />
                  <line x1="19" y1="5" x2="19" y2="19" />
                </svg>
              </button>
            </div>

            {/* Contrôle du Volume et Mute */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Activer le son' : 'Couper le son'}
                className="flex h-8 w-8 items-center justify-center rounded-full text-ivory/60 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                {isMuted || volume === 0 ? (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <line x1="23" y1="9" x2="17" y2="15" />
                    <line x1="17" y1="9" x2="23" y2="15" />
                  </svg>
                ) : (
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Contrôle du volume"
                aria-valuetext={`${Math.round((isMuted ? 0 : volume) * 100)} %`}
                className="h-1 w-16 cursor-pointer appearance-none rounded-lg bg-white/10 accent-gold hover:bg-white/20"
              />
            </div>
          </div>

          {/* Bouton pour afficher/masquer la liste des pistes */}
          <div className="mt-4 border-t border-white/5 pt-3">
            <button
              type="button"
              onClick={() => setShowPlaylist((prev) => !prev)}
              aria-expanded={showPlaylist}
              className="flex w-full items-center justify-between py-1 text-left text-xs font-semibold uppercase tracking-[0.16em] text-ivory/60 transition-colors hover:text-gold focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold"
            >
              <span className="flex items-center gap-2">
                <span>Playlist & Répertoire ({playlist.length})</span>
              </span>
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${
                  showPlaylist ? 'rotate-180' : ''
                }`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {/* Liste déroulante des pistes */}
            {showPlaylist && (
              <div className="mt-2 max-h-44 space-y-1 overflow-y-auto pr-1">
                {playlist.map((track) => {
                  const isSelected = track.id === currentTrack?.id
                  const trackPlayable = isTrackPlayable(track)
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => selectTrack(track, true)}
                      className={`flex w-full items-center justify-between rounded-lg p-2 text-left text-xs transition-colors ${
                        isSelected
                          ? 'border border-gold/40 bg-gold/10 text-ivory'
                          : 'hover:bg-white/5 text-ivory/70 hover:text-ivory'
                      }`}
                    >
                      <div className="min-w-0 pr-2">
                        <p className="truncate font-medium">{track.title}</p>
                        <p className="truncate text-[0.65rem] text-ivory/45">{track.category}</p>
                      </div>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wider ${
                          trackPlayable
                            ? 'border border-gold/40 text-gold'
                            : 'border border-white/10 text-ivory/40'
                        }`}
                      >
                        {trackPlayable ? 'Prêt' : 'En attente'}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* ============================================================
           2. ÉTAT COMPACT / CAPSULE FLOTTANTE (MINI-PILL)
           ============================================================ */
        <div className="group flex items-center gap-3 rounded-full border border-gold/30 bg-ink-2/90 px-3.5 py-2.5 shadow-[0_12px_32px_rgba(0,0,0,0.7)] backdrop-blur-xl transition-all duration-300 hover:border-gold/60 hover:shadow-[0_12px_36px_rgba(198,161,91,0.2)]">
          {/* Disque vinyle décoratif animé */}
          <button
            type="button"
            onClick={openPlayer}
            aria-label="Ouvrir le lecteur audio La Scène Sonore"
            className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink transition-transform hover:scale-105"
          >
            <div
              className={`h-7 w-7 rounded-full border border-gold/30 flex items-center justify-center ${
                isPlaying ? 'animate-vinyl' : ''
              }`}
            >
              <div className="h-2 w-2 rounded-full bg-gold" />
            </div>
          </button>

          {/* Titre & Catégorie en résumé */}
          <button
            type="button"
            onClick={openPlayer}
            aria-label="Afficher les détails de la piste"
            className="flex flex-col text-left focus-visible:outline-none"
          >
            <span className="truncate max-w-[130px] sm:max-w-[180px] font-display text-sm leading-tight text-ivory group-hover:text-gold transition-colors">
              {currentTrack?.title || 'La Scène Sonore'}
            </span>
            <span className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-gold/75">
              {currentTrack?.category || 'Hervé Nanfang'}
            </span>
          </button>

          {/* Mini-visualiseur */}
          <div
            className="flex h-4 items-end gap-0.5 px-1 cursor-pointer"
            onClick={openPlayer}
            aria-hidden
          >
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`w-0.5 rounded-full transition-all ${
                  isPlaying ? 'bg-gold animate-soundbar' : 'bg-white/20 h-1.5'
                }`}
                style={{
                  height: isPlaying ? '100%' : '20%',
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>

          {/* Bouton rapide Lecture / Pause */}
          <button
            type="button"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold text-ink transition-transform hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            {isPlaying ? (
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" rx="1" />
                <rect x="14" y="4" width="4" height="16" rx="1" />
              </svg>
            ) : (
              <svg className="ml-0.5 h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <polygon points="6 3 20 12 6 21 6 3" />
              </svg>
            )}
          </button>

          {/* Bouton Agrandir */}
          <button
            type="button"
            onClick={togglePlayerOpen}
            aria-label="Agrandir le lecteur audio"
            className="text-ivory/40 transition-colors hover:text-gold focus-visible:outline-none"
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m18 15-6-6-6 6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
