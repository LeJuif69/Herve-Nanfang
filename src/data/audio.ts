/**
 * Configuration des pistes audio — La Scène Sonore (Hervé Nanfang)
 *
 * Ce fichier définit les pistes du lecteur audio flottant.
 * Conformément aux directives éditoriales, aucun titre fictif n'est inventé.
 * Les catégories et contextes correspondent aux domaines musicaux réels
 * documentés dans le projet (Le Pianobariste, Composition, MAO & Ingénierie du son).
 *
 * Lorsque les fichiers masters définitifs (.mp3 ou .wav) sont déposés dans
 * le répertoire public/audio/, il suffit de renseigner leur chemin dans 'src'
 * et de basculer 'status' sur 'ready'.
 */

export type AudioTrackStatus = 'ready' | 'pending_master'

export interface AudioTrack {
  id: string
  title: string
  category: string
  duration: number // Durée indicative en secondes (0 si en attente du fichier)
  src: string // Chemin relatif public (ex: '/audio/pianobariste-live.mp3') ou URL directe
  description: string
  status: AudioTrackStatus
  expectedFile?: string // Nom de fichier recommandé dans public/audio/
}

export const AUDIO_PLAYLIST: AudioTrack[] = [
  {
    id: 'pianobariste-live',
    title: 'Le Pianobariste — Session Live',
    category: 'Piano-bar Live',
    duration: 0,
    src: '',
    description: 'Interprétation live au piano, ambiance jazz et standards.',
    status: 'pending_master',
    expectedFile: 'pianobariste-live.mp3',
  },
  {
    id: 'composition-theme',
    title: 'Composition originale — Thème & Arrangement',
    category: 'Composition & Orchestration',
    duration: 0,
    src: '',
    description: 'Thème original écrit pour le spectacle vivant et l’image.',
    status: 'pending_master',
    expectedFile: 'composition-theme.mp3',
  },
  {
    id: 'mao-sound-design',
    title: 'Production sonore & Ingénierie du son',
    category: 'Ingénierie du son & MAO',
    duration: 0,
    src: '',
    description: 'Mixage, travail des textures sonores et traitement acoustique.',
    status: 'pending_master',
    expectedFile: 'mao-sound-design.mp3',
  },
  {
    id: 'ia-musique-recherche',
    title: 'Musicien Augmenté — Expérimentation sonore',
    category: 'IA & Création assistée',
    duration: 0,
    src: '',
    description: 'Exploration des interactions entre jeu pianistique et modèles d’IA.',
    status: 'pending_master',
    expectedFile: 'ia-musique-recherche.mp3',
  },
]

/**
 * Vérifie si une piste possède une source audio exploitable.
 */
export function isTrackPlayable(track: AudioTrack | null): boolean {
  if (!track) return false
  return Boolean(track.src && track.src.trim().length > 0 && track.status === 'ready')
}

/**
 * Retourne la liste des pistes disposant d'un fichier audio effectif.
 */
export function getPlayableTracks(): AudioTrack[] {
  return AUDIO_PLAYLIST.filter(isTrackPlayable)
}
