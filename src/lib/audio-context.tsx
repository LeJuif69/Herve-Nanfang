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

// Grilles d'accords pour la démo acoustique interactive
const ACOUSTIC_CHORDS: Record<string, number[][]> = {
  'pianobariste-live': [
    [146.8, 174.6, 220.0, 261.6, 329.6], // Dm9
    [98.0, 174.6, 246.9, 329.6, 440.0],  // G13
    [130.8, 164.8, 196.0, 246.9, 293.7], // Cmaj9
    [110.0, 196.0, 277.2, 349.2, 493.9], // A7b13
  ],
  'duo-acoustique': [
    [116.5, 174.6, 220.0, 261.6, 329.6], // Bbmaj9
    [146.8, 174.6, 220.0, 293.7, 349.2], // Dm7
    [196.0, 233.1, 293.7, 349.2, 440.0], // Gm9
    [130.8, 164.8, 207.7, 261.6, 311.1], // Ebmaj7/C
  ],
  'afro-jazz-makossa': [
    [130.8, 164.8, 196.0, 246.9, 293.7], // Cmaj9
    [174.6, 220.0, 261.6, 329.6, 392.0], // Fmaj7#11
    [146.8, 174.6, 220.0, 261.6, 329.6], // Dm9
    [98.0, 146.8, 196.0, 246.9, 329.6],  // G7(13)
  ],
  'composition-theme': [
    [174.6, 220.0, 261.6, 329.6, 392.0], // Fmaj9
    [116.5, 146.8, 174.6, 220.0, 261.6], // Bbmaj7
    [196.0, 233.1, 293.7, 349.2, 440.0], // Gm9
    [130.8, 164.8, 196.0, 246.9, 293.7], // C9
  ],
  'mao-sound-design': [
    [155.6, 233.1, 311.1, 392.0],        // Eb
    [103.8, 155.6, 207.7, 261.6, 311.1], // Abmaj7
    [174.6, 207.7, 261.6, 311.1, 392.0], // Fm9
    [116.5, 174.6, 207.7, 293.7],        // Bb7
  ],
  'ia-musique-recherche': [
    [146.8, 220.0, 329.6, 440.0],        // D sus2
    [174.6, 261.6, 329.6, 523.3],        // F6/9
    [196.0, 293.7, 392.0, 493.9],        // G add9
    [110.0, 220.0, 277.2, 440.0],        // A add11
  ],
  'afropop-rumba': [
    [130.8, 164.8, 196.0, 246.9],        // Cmaj7
    [174.6, 220.0, 261.6, 329.6],        // Fmaj7
    [146.8, 174.6, 220.0, 293.7],        // Dm7
    [98.0, 146.8, 196.0, 246.9],         // G7(9)
  ],
  'soul-chanson-poetique': [
    [116.5, 174.6, 220.0, 261.6],        // Bbmaj7
    [146.8, 174.6, 220.0, 293.7],        // Dm7/A
    [196.0, 233.1, 293.7, 349.2],        // Gm7
    [130.8, 164.8, 196.0, 261.6],        // C7
  ],
  'concert-guerisseurs': [
    [146.8, 220.0, 261.6, 329.6],        // Dm9 (apaisant & mystique)
    [110.0, 164.8, 220.0, 261.6],        // Am7
    [174.6, 220.0, 261.6, 329.6],        // Fmaj7
    [164.8, 196.0, 246.9, 329.6],        // Em7
  ],
  'cinema-narration-visuelle': [
    [130.8, 196.0, 233.1, 311.1],        // Cm(add9) (tension dramatique)
    [103.8, 155.6, 207.7, 261.6, 311.1], // Abmaj7
    [174.6, 207.7, 261.6, 349.2],        // Fm9
    [98.0, 146.8, 196.0, 246.9, 311.1],  // G7(b9)
  ],
}

export function AudioProvider({ children }: { children: ReactNode }) {
  const [playlist] = useState<AudioTrack[]>(AUDIO_PLAYLIST)
  const [currentTrack, setCurrentTrack] = useState<AudioTrack | null>(AUDIO_PLAYLIST[0] || null)
  const [playbackState, setPlaybackState] = useState<PlaybackState>(() => {
    return isTrackPlayable(AUDIO_PLAYLIST[0]) ? 'ready' : 'unavailable'
  })
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(AUDIO_PLAYLIST[0]?.duration || 180)
  const [volume, setVolumeState] = useState<number>(0.85)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false)
  const [hasWebAudio, setHasWebAudio] = useState<boolean>(false)
  const [frequencyData, setFrequencyData] = useState<number[]>([15, 25, 40, 30, 20])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null)
  const synthMasterGainRef = useRef<GainNode | null>(null)
  const synthTimerRef = useRef<number | null>(null)
  const synthProgressIntervalRef = useRef<number | null>(null)
  const animFrameRef = useRef<number | null>(null)
  const chordStepRef = useRef<number>(0)

  // Initialisation de l'élément Audio sous-jacent pour fichiers réels
  useEffect(() => {
    const audio = new Audio()
    audio.preload = 'metadata'
    audio.volume = volume
    audioRef.current = audio

    const onLoadedMetadata = () => {
      if (audio.duration && !isNaN(audio.duration)) {
        setDuration(audio.duration)
      }
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
      nextTrack()
    }

    const onError = () => {
      if (currentTrack?.src) {
        setPlaybackState('error')
        setErrorMessage('Impossible de lire le fichier master distant.')
      }
    }

    const onPlay = () => setPlaybackState('playing')
    const onPause = () => {
      if (playbackState !== 'error' && playbackState !== 'unavailable') {
        setPlaybackState('paused')
      }
    }

    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.pause()
      audio.src = ''
    }
  }, [playbackState, currentTrack])

  // Web Audio API : Configuration du contexte et de l'analyseur
  const setupWebAudio = useCallback(() => {
    if (typeof window === 'undefined') return
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        if (!AudioContextClass) return
        const ctx = new AudioContextClass()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 64
        analyser.smoothingTimeConstant = 0.8

        const masterGain = ctx.createGain()
        masterGain.gain.setValueAtTime(isMuted ? 0 : volume, ctx.currentTime)
        masterGain.connect(analyser)
        analyser.connect(ctx.destination)

        audioCtxRef.current = ctx
        analyserRef.current = analyser
        synthMasterGainRef.current = masterGain

        if (audioRef.current && !sourceNodeRef.current) {
          try {
            const source = ctx.createMediaElementSource(audioRef.current)
            source.connect(masterGain)
            sourceNodeRef.current = source
          } catch {
            // Pas de source media element connectée
          }
        }
      }
      setHasWebAudio(true)
    } catch {
      setHasWebAudio(false)
    }
  }, [volume, isMuted])

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
        const bars = [
          Math.max(14, Math.round((buffer[2] || 0) / 2.55)),
          Math.max(14, Math.round((buffer[5] || 0) / 2.55)),
          Math.max(14, Math.round((buffer[8] || 0) / 2.55)),
          Math.max(14, Math.round((buffer[12] || 0) / 2.55)),
          Math.max(14, Math.round((buffer[18] || 0) / 2.55)),
        ]
        setFrequencyData(bars)
      } else {
        // Fallback animation élégante si analyser pas encore actif
        const t = Date.now() / 200
        setFrequencyData([
          Math.round(25 + 15 * Math.sin(t)),
          Math.round(45 + 25 * Math.cos(t * 1.3)),
          Math.round(60 + 30 * Math.sin(t * 0.9)),
          Math.round(35 + 20 * Math.cos(t * 1.1)),
          Math.round(20 + 10 * Math.sin(t * 1.5)),
        ])
      }
      animFrameRef.current = requestAnimationFrame(updateBars)
    }

    animFrameRef.current = requestAnimationFrame(updateBars)

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
    }
  }, [playbackState, hasWebAudio])

  // Jouer un accord acoustique synthétisé (piano Rhodes feutré)
  const triggerAcousticChord = useCallback((notes: number[]) => {
    const ctx = audioCtxRef.current
    const master = synthMasterGainRef.current
    if (!ctx || !master || ctx.state === 'suspended') return

    const now = ctx.currentTime
    notes.forEach((freq, i) => {
      // Retard subtil pour arpège humain naturel (strum)
      const noteTime = now + (i * 0.04)

      // Oscillateur principal (triangle pour corps chaud)
      const osc = ctx.createOscillator()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime(freq, noteTime)

      // Oscillateur secondaire (sinus pour rondeur de fondamentale)
      const sub = ctx.createOscillator()
      sub.type = 'sine'
      sub.frequency.setValueAtTime(freq, noteTime)

      // Filtre passe-bas dynamique (simulation frappe de marteau acoustique)
      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1600, noteTime)
      filter.frequency.exponentialRampToValueAtTime(500, noteTime + 2.5)

      // Enveloppe de gain
      const noteGain = ctx.createGain()
      noteGain.gain.setValueAtTime(0.0001, noteTime)
      noteGain.gain.linearRampToValueAtTime(0.22 / Math.sqrt(notes.length), noteTime + 0.02)
      noteGain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 3.2)

      osc.connect(filter)
      sub.connect(filter)
      filter.connect(noteGain)
      noteGain.connect(master)

      osc.start(noteTime)
      sub.start(noteTime)
      osc.stop(noteTime + 3.3)
      sub.stop(noteTime + 3.3)
    })
  }, [])

  // Démarrer la boucle de démo acoustique
  const startAcousticLoop = useCallback((trackId: string) => {
    stopAcousticLoop()
    const chords = ACOUSTIC_CHORDS[trackId] || ACOUSTIC_CHORDS['pianobariste-live']
    chordStepRef.current = 0

    // Déclencher le premier accord immédiatement
    triggerAcousticChord(chords[0])

    // Boucle d'accords toutes les 2.8 secondes
    synthTimerRef.current = window.setInterval(() => {
      chordStepRef.current = (chordStepRef.current + 1) % chords.length
      triggerAcousticChord(chords[chordStepRef.current])
    }, 2800)

    // Progression temporelle de la barre
    synthProgressIntervalRef.current = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + 1
        if (next >= duration) {
          stopAcousticLoop()
          setPlaybackState('paused')
          return 0
        }
        return next
      })
    }, 1000)
  }, [triggerAcousticChord, duration])

  const stopAcousticLoop = useCallback(() => {
    if (synthTimerRef.current) {
      clearInterval(synthTimerRef.current)
      synthTimerRef.current = null
    }
    if (synthProgressIntervalRef.current) {
      clearInterval(synthProgressIntervalRef.current)
      synthProgressIntervalRef.current = null
    }
  }, [])

  // Changement de piste
  const selectTrackInternal = useCallback(
    (track: AudioTrack, shouldPlay = false) => {
      stopAcousticLoop()
      setCurrentTrack(track)
      setCurrentTime(0)
      setDuration(track.duration || 180)
      setErrorMessage(null)

      if (track.src && audioRef.current) {
        audioRef.current.src = track.src
        audioRef.current.load()
        setPlaybackState('ready')
        if (shouldPlay) {
          setupWebAudio()
          if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
          }
          audioRef.current.play().then(() => setPlaybackState('playing')).catch(() => setPlaybackState('paused'))
        }
      } else {
        // Mode démo acoustique synthétisée
        setPlaybackState('ready')
        if (shouldPlay) {
          setupWebAudio()
          if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume()
          }
          startAcousticLoop(track.id)
          setPlaybackState('playing')
        }
      }
    },
    [setupWebAudio, startAcousticLoop, stopAcousticLoop],
  )

  const selectTrack = useCallback(
    (track: AudioTrack, shouldPlay = false) => {
      selectTrackInternal(track, shouldPlay)
    },
    [selectTrackInternal],
  )

  const play = useCallback(async () => {
    if (!currentTrack) return
    setupWebAudio()
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      await audioCtxRef.current.resume()
    }

    if (currentTrack.src && audioRef.current) {
      try {
        await audioRef.current.play()
        setPlaybackState('playing')
        setErrorMessage(null)
      } catch {
        setPlaybackState('paused')
      }
    } else {
      // Démo acoustique temps réel
      startAcousticLoop(currentTrack.id)
      setPlaybackState('playing')
      setErrorMessage(null)
    }
  }, [currentTrack, setupWebAudio, startAcousticLoop])

  const pause = useCallback(() => {
    stopAcousticLoop()
    if (audioRef.current) {
      audioRef.current.pause()
    }
    setPlaybackState('paused')
  }, [stopAcousticLoop])

  const togglePlay = useCallback(() => {
    if (playbackState === 'playing') {
      pause()
    } else {
      void play()
    }
  }, [playbackState, pause, play])

  const seek = useCallback((time: number) => {
    const target = Math.max(0, Math.min(time, duration || 180))
    setCurrentTime(target)
    if (currentTrack?.src && audioRef.current) {
      audioRef.current.currentTime = target
    }
  }, [duration, currentTrack])

  const setVolume = useCallback((level: number) => {
    const clamped = Math.max(0, Math.min(1, level))
    setVolumeState(clamped)
    if (audioRef.current) {
      audioRef.current.volume = clamped
    }
    if (synthMasterGainRef.current && audioCtxRef.current) {
      synthMasterGainRef.current.gain.setValueAtTime(isMuted ? 0 : clamped, audioCtxRef.current.currentTime)
    }
    if (clamped === 0) {
      setIsMuted(true)
    } else if (isMuted) {
      setIsMuted(false)
    }
  }, [isMuted])

  const toggleMute = useCallback(() => {
    if (isMuted) {
      if (audioRef.current) audioRef.current.muted = false
      if (synthMasterGainRef.current && audioCtxRef.current) {
        synthMasterGainRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime)
      }
      setIsMuted(false)
    } else {
      if (audioRef.current) audioRef.current.muted = true
      if (synthMasterGainRef.current && audioCtxRef.current) {
        synthMasterGainRef.current.gain.setValueAtTime(0, audioCtxRef.current.currentTime)
      }
      setIsMuted(true)
    }
  }, [isMuted, volume])

  const nextTrack = useCallback(() => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
    const nextIdx = (currentIndex + 1) % playlist.length
    selectTrackInternal(playlist[nextIdx], playbackState === 'playing')
  }, [currentTrack, playlist, playbackState, selectTrackInternal])

  const prevTrack = useCallback(() => {
    const currentIndex = playlist.findIndex((t) => t.id === currentTrack?.id)
    const prevIdx = (currentIndex - 1 + playlist.length) % playlist.length
    selectTrackInternal(playlist[prevIdx], playbackState === 'playing')
  }, [currentTrack, playlist, playbackState, selectTrackInternal])

  const togglePlayerOpen = useCallback(() => {
    setIsPlayerOpen((prev) => !prev)
  }, [])

  const openPlayer = useCallback(() => {
    setIsPlayerOpen(true)
  }, [])

  const closePlayer = useCallback(() => {
    setIsPlayerOpen(false)
  }, [])

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

export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '0:00'
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`
}
