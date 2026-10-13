import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { AUDIO_PLAYLIST, isTrackPlayable, type AudioTrack } from '../data/audio'

export type PlaybackState =
  | 'ready'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'error'
  | 'unavailable'

interface AudioContextType {
  currentTrack: AudioTrack | null
  playlist: AudioTrack[]
  playbackState: PlaybackState
  currentTime: number
  duration: number
  volume: number
  isMuted: boolean
  errorMessage: string | null
  isPlayerOpen: boolean
  hasWebAudio: boolean
  frequencyData: number[]
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => void
  seek: (time: number) => void
  setVolume: (level: number) => void
  toggleMute: () => void
  selectTrack: (track: AudioTrack, shouldPlay?: boolean) => void
  nextTrack: () => void
  prevTrack: () => void
  togglePlayerOpen: () => void
  openPlayer: () => void
  closePlayer: () => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playlist] = useState<AudioTrack[]>(AUDIO_PLAYLIST)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(
    AUDIO_PLAYLIST[0] || null,
  )
  const [playbackState, setPlaybackState] = useState<PlaybackState>(() => {
    return isTrackPlayable(AUDIO_PLAYLIST[0]) ? 'ready' : 'unavailable'
  })
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [volume, setVolumeState] = useState<number>(0.85)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false)
  const [hasWebAudio, setHasWebAudio] = useState<boolean>(false)
  const [frequencyData, setFrequencyData] = useState<number[]>([15, 25, 40, 30, 20])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<any>(null)
  const analyserRef = useRef<any>(null)
  const sourceNodeRef = useRef<any>(null)
  const animFrameRef = useRef<number | null>(null)

  // Initialisation de l'élément Audio sous-jacent
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = volume
    audioRef.current = audio

    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0)
      setErrorMessage(null)
      if (playbackState === 'loading') {
        setPlaybackState('ready')
      }
    }

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const onEnded = () => {
      setPlaybackState('paused')
      setCurrentTime(0)
      // Passer au morceau suivant si disponible
      const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
      if (currentIndex >= 0 && currentIndex < playlist.length - 1) {
        const next = playlist[currentIndex + 1]
        if (isTrackPlayable(next)) {
          selectTrackInternal(next, true)
        }
      }
    }

    const onError = () => {
      if (currentTrack && isTrackPlayable(currentTrack)) {
        setPlaybackState('error')
        setErrorMessage(
          'Impossible de lire le fichier audio (vérifiez le format ou l’accès).',
        )
      } else {
        setPlaybackState('unavailable')
        setErrorMessage('En attente du fichier master audio dans le répertoire public/audio/.')
      }
    }

    const onPlay = () => setPlaybackState('playing')
    const onPause = () => {
      if (playbackState !== 'error' && playbackState !== 'unavailable') {
        setPlaybackState('paused')
      }
    }

    const onWaiting = () => setPlaybackState('loading')
    const onCanPlay = () => {
      if (playbackState === 'loading') {
        setPlaybackState('ready')
      }
    }

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('waiting', onWaiting)
    audio.addEventListener('canplay', onCanPlay)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('waiting', onWaiting)
      audio.removeEventListener('canplay', onCanPlay)
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Web Audio API : analyse fréquentielle pour le visualiseur
  const setupWebAudio = useCallback(() => {
    if (audioCtxRef.current || !audioRef.current || typeof window === 'undefined') return

    try {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (!AudioContextClass) return

      const ctx = new AudioContextClass()
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 64
      analyser.smoothingTimeConstant = 0.8

      if (!sourceNodeRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current)
        source.connect(analyser)
        analyser.connect(ctx.destination)
        sourceNodeRef.current = source
      }

      audioCtxRef.current = ctx
      analyserRef.current = analyser
      setHasWebAudio(true)
    } catch {
      // En cas de politique de sécurité ou de restriction cross-origin, fallback propre
      setHasWebAudio(false)
    }
  }, [])

  // Boucle d'animation pour mettre à jour les barres du visualiseur
  useEffect(() => {
    if (playbackState !== 'playing') {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      setFrequencyData([12, 12, 12, 12, 12])
      return
    }

    const updateBars = () => {
      if (analyserRef.current && hasWebAudio) {
        const buffer = new Uint8Array(analyserRef.current.frequencyBinCount)
        analyserRef.current.getByteFrequencyData(buffer)
        // Prendre 5 points représentatifs du spectre sonore
        const bars = [
          Math.max(12, Math.round((buffer[2] || 0) / 2.55)),
          Math.max(12, Math.round((buffer[5] || 0) / 2.55)),
          Math.max(12, Math.round((buffer[9] || 0) / 2.55)),
          Math.max(12, Math.round((buffer[14] || 0) / 2.55)),
          Math.max(12, Math.round((buffer[20] || 0) / 2.55)),
        ]
        setFrequencyData(bars)
      }
      animFrameRef.current = requestAnimationFrame(updateBars)
    }

    animFrameRef.current = requestAnimationFrame(updateBars)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [playbackState, hasWebAudio])

  // Changement de piste interne
  const selectTrackInternal = useCallback(
    (track: AudioTrack, shouldPlay = false) => {
      setCurrentTrack(track)
      setCurrentTime(0)
      setErrorMessage(null)

      if (!isTrackPlayable(track)) {
        if (audioRef.current) {
          audioRef.current.pause()
          audioRef.current.src = ''
        }
        setDuration(track.duration || 0)
        setPlaybackState('unavailable')
        setErrorMessage(
          `La piste « ${track.title} » est en attente du fichier master (${track.expectedFile || 'audio'}).`,
        )
        return
      }

      if (audioRef.current) {
        audioRef.current.src = track.src
        audioRef.current.load()
        setPlaybackState('ready')
        if (shouldPlay) {
          setupWebAudio()
          if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
          }
          audioRef.current
            .play()
            .then(() => setPlaybackState('playing'))
            .catch(() => {
              setPlaybackState('paused')
            })
        }
      }
    },
    [setupWebAudio],
  )

  const selectTrack = useCallback(
    (track: AudioTrack, shouldPlay = false) => {
      selectTrackInternal(track, shouldPlay)
    },
    [selectTrackInternal],
  )

  const play = useCallback(async () => {
    if (!currentTrack) return

    if (!isTrackPlayable(currentTrack)) {
      setPlaybackState('unavailable')
      setErrorMessage(
        `Fichier audio en attente pour « ${currentTrack.title} ». Déposez le master pour lancer l'écoute.`,
      )
      return
    }

    if (!audioRef.current) return

    try {
      setupWebAudio()
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume()
      }
      await audioRef.current.play()
      setPlaybackState('playing')
      setErrorMessage(null)
    } catch {
      setPlaybackState('paused')
    }
  }, [currentTrack, setupWebAudio])

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      setPlaybackState('paused')
    }
  }, [])

  const togglePlay = useCallback(() => {
    if (playbackState === 'playing') {
      pause()
    } else {
      play()
    }
  }, [playbackState, pause, play])

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return
    const target = Math.max(0, Math.min(time, audioRef.current.duration || 0))
    audioRef.current.currentTime = target
    setCurrentTime(target)
  }, [])

  const setVolume = useCallback((level: number) => {
    const clamped = Math.max(0, Math.min(1, level))
    setVolumeState(clamped)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
    if (clamped === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    if (!audioRef.current) return
    if (isMuted) {
      audioRef.current.muted = false
      setIsMuted(false)
    } else {
      audioRef.current.muted = true
      setIsMuted(true)
    }
  }, [isMuted])

  const nextTrack = useCallback(() => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
    const nextIndex = (currentIndex + 1) % playlist.length
    const next = playlist[nextIndex]
    selectTrackInternal(next, playbackState === 'playing')
  }, [playlist, currentTrack, playbackState, selectTrackInternal])

  const prevTrack = useCallback(() => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length
    const prev = playlist[prevIndex]
    selectTrackInternal(prev, playbackState === 'playing')
  }, [playlist, currentTrack, playbackState, selectTrackInternal])

  const togglePlayerOpen = useCallback(() => {
    setIsPlayerOpen((prev) => !prev)
  }, [])

  const openPlayer = useCallback(() => setIsPlayerOpen(true), [])
  const closePlayer = useCallback(() => setIsPlayerOpen(false), [])

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        playlist,
        playbackState,
        currentTime,
        duration,
        volume,
        isMuted,
        errorMessage,
        isPlayerOpen,
        hasWebAudio,
        frequencyData,
        play,
        pause,
        togglePlay,
        seek,
        setVolume,
        toggleMute,
        selectTrack,
        nextTrack,
        prevTrack,
        togglePlayerOpen,
        openPlayer,
        closePlayer,
      }}
    >
      {children}
    </AudioContext.Provider>
  )
}

export function useAudio() {
  const context = useContext(AudioContext)
  if (!context) {
    throw new Error('useAudio doit être utilisé à l’intérieur d’un AudioProvider')
  }
  return context
}

/** Formate des secondes en mm:ss */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}
