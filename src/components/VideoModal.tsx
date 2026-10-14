import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import type { LivePerformance } from '../data/music'
import affiche from '../assets/affiche-pianobariste.webp'
import liveScene from '../assets/live-scene-piano.jpeg'
import liveBand from '../assets/live-band.webp'
import portrait from '../assets/portrait.webp'

interface VideoModalProps {
  performance: LivePerformance | null
  isOpen: boolean
  onClose: () => void
}

const THUMBNAIL_MAP = {
  affiche,
  liveScene,
  liveBand,
  portrait,
}

export default function VideoModal({ performance, isOpen, onClose }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSeconds, setPlaybackSeconds] = useState(0)
  const [activeSetlistIndex, setActiveSetlistIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  // Parse duration "MM:SS" into total seconds
  const totalSeconds = (() => {
    if (!performance) return 300
    const parts = performance.duration.split(':')
    if (parts.length === 2) {
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
    }
    return 300
  })()

  // Reset when modal opens or performance changes
  useEffect(() => {
    if (isOpen) {
      setIsPlaying(true)
      setPlaybackSeconds(0)
      setActiveSetlistIndex(0)
    } else {
      setIsPlaying(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isOpen, performance])

  // Playback timer simulation for realistic live showcase
  useEffect(() => {
    if (isPlaying && isOpen) {
      timerRef.current = window.setInterval(() => {
        setPlaybackSeconds((prev) => {
          if (prev >= totalSeconds) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isOpen, totalSeconds])

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      } else if (e.key === ' ' && isOpen) {
        e.preventDefault()
        setIsPlaying((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !performance) return null

  const formatSecs = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleSetlistJump = (timeStr: string, idx: number) => {
    const parts = timeStr.split(':')
    if (parts.length === 2) {
      const s = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
      setPlaybackSeconds(s)
      setActiveSetlistIndex(idx)
      setIsPlaying(true)
    }
  }

  const handleProgressBarClick = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const ratio = Math.max(0, Math.min(1, clickX / rect.width))
    setPlaybackSeconds(Math.floor(ratio * totalSeconds))
  }

  const thumbImg = THUMBNAIL_MAP[performance.thumbnailKey] || affiche

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-ink/90 backdrop-blur-2xl animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-4xl max-h-[92vh] overflow-hidden rounded-xl border border-gold/40 bg-ink-2 shadow-[0_25px_80px_rgba(0,0,0,0.95)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-ink/70">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 rounded-full border border-crimson/50 bg-crimson/20 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-crimson-2">
              <span className="h-2 w-2 rounded-full bg-crimson animate-pulse" />
              Captation Scénique Live
            </span>
            <span className="hidden sm:inline-block text-xs font-mono text-gold/80">
              {performance.location}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer la vidéo"
            className="rounded-full p-2 text-ivory/60 hover:bg-white/10 hover:text-white transition-colors"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Video Player Screen (16:9) */}
        <div className="relative aspect-video w-full overflow-hidden bg-black select-none group">
          <img
            src={thumbImg}
            alt={performance.title}
            className={`h-full w-full object-cover transition-transform duration-1000 ${
              isPlaying ? 'scale-105 filter brightness-90' : 'filter brightness-75'
            }`}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/40" />

          {/* Central Play/Pause button */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="pointer-events-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-ink/80 text-gold shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-ink"
              aria-label={isPlaying ? 'Mettre en pause' : 'Lancer la lecture'}
            >
              {isPlaying ? (
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="h-6 w-6 fill-current translate-x-0.5" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              )}
            </button>
          </div>

          {/* Real-time sound wave bars when playing */}
          {isPlaying && (
            <div className="absolute top-4 right-4 flex items-end gap-1 h-6 rounded bg-black/60 px-2.5 py-1 backdrop-blur-sm border border-gold/30">
              <span className="w-1 bg-gold animate-[pulse_0.4s_ease-in-out_infinite] h-full" />
              <span className="w-1 bg-gold animate-[pulse_0.7s_ease-in-out_infinite] h-3/5" />
              <span className="w-1 bg-gold animate-[pulse_0.5s_ease-in-out_infinite] h-4/5" />
              <span className="w-1 bg-gold animate-[pulse_0.8s_ease-in-out_infinite] h-2/5" />
              <span className="w-1 bg-gold animate-[pulse_0.6s_ease-in-out_infinite] h-full" />
              <span className="ml-2 font-mono text-[0.62rem] uppercase tracking-wider text-gold">Live Audio</span>
            </div>
          )}

          {/* Bottom video controls */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
            {/* Scrubber */}
            <div
              className="relative h-2 w-full cursor-pointer rounded-full bg-white/20 overflow-hidden mb-3 hover:h-2.5 transition-all"
              onClick={handleProgressBarClick}
              title="Cliquer pour naviguer dans l'extrait"
            >
              <div
                className="h-full bg-gold transition-all duration-150"
                style={{ width: `${(playbackSeconds / totalSeconds) * 100}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-ivory/80">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-gold hover:text-white transition-colors"
                >
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <span className="font-mono text-[0.7rem] text-ivory/90">
                  {formatSecs(playbackSeconds)} / {performance.duration}
                </span>
                <span className="hidden sm:inline-block font-mono text-[0.65rem] text-gold/75">
                  · {performance.format}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <a
                  href={performance.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-bold uppercase tracking-wider text-[0.65rem] text-crimson-2 hover:text-white transition-colors"
                >
                  <span>Chaîne YouTube HD ↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Content & Details Scrollable Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-gold">
                {performance.category}
              </span>
              <h2 id="video-modal-title" className="mt-1 font-display text-2xl text-ivory sm:text-3xl">
                {performance.title}
              </h2>
              <p className="mt-1 text-sm font-semibold text-ivory/70">{performance.subtitle}</p>
            </div>

            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <span className="rounded border border-gold/40 bg-gold/10 px-3 py-1 font-mono text-xs text-gold">
                {performance.format}
              </span>
              <span className="text-[0.68rem] text-ivory/50">{performance.location}</span>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-ivory/75 border-l-2 border-gold/40 pl-4 py-1">
            {performance.description}
          </p>

          {/* Musicians & Lineup */}
          <div className="rounded border border-white/8 bg-ink p-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory/50">
              Distribution & Musiciens de scène
            </h4>
            <p className="mt-1.5 text-xs text-gold font-mono">{performance.musicians}</p>
          </div>

          {/* Interactive Setlist & Scene Highlights */}
          {performance.setlist && performance.setlist.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-ivory/60 mb-3">
                Extraits de scène & Points de repère du concert (cliquez pour écouter)
              </h4>
              <div className="grid gap-2 sm:grid-cols-3">
                {performance.setlist.map((item, idx) => {
                  const isActive = activeSetlistIndex === idx
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSetlistJump(item.time, idx)}
                      className={`flex flex-col items-start rounded border p-3 text-left transition-all duration-200 ${
                        isActive
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-white/10 bg-white/5 text-ivory/80 hover:border-gold/40 hover:bg-white/10'
                      }`}
                    >
                      <span className="font-mono text-[0.65rem] font-bold text-gold">
                        ▶ {item.time}
                      </span>
                      <span className="mt-1 text-xs font-medium leading-tight">
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-5">
            <div className="flex items-center gap-3">
              <a
                href={performance.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                <span>Voir sur YouTube (@hervenanfang) ↗</span>
              </a>

              <Link
                to="/contact#booking"
                onClick={onClose}
                className="btn btn-outline inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider"
              >
                Réserver ce format
              </Link>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="text-xs uppercase tracking-wider text-ivory/50 hover:text-ivory"
            >
              Fermer la fenêtre (Esc)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
