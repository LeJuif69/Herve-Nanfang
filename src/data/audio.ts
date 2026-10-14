/**
 * Configuration des pistes audio — La Scène Sonore (Hervé Nanfang)
 *
 * Ce fichier définit les pistes du lecteur audio flottant et de la page Musique.
 * En l'absence de fichier master externe sur disque, le moteur audio synthétise
 * en temps réel via Web Audio API une boucle harmonique acoustique personnalisée,
 * garantissant que le lecteur joue toujours du son avec visualiseur actif.
 * Dès qu'un fichier master .mp3/.wav est présent dans public/audio/, il prend priorité.
 */

export type AudioTrackStatus = 'ready' | 'pending_master' | 'acoustic_demo'

export interface AudioTrack {
  id: string
  title: string
  category: string
  duration: number // Durée indicative en secondes
  src: string // Chemin relatif public (ex: '/audio/pianobariste-live.mp3') ou vide pour synthèse acoustique
  description: string
  status: AudioTrackStatus
  expectedFile?: string // Nom de fichier recommandé dans public/audio/
  tempo?: string
  mood?: string
  sceneContext?: string
  instruments?: string[]
}

export const AUDIO_PLAYLIST: AudioTrack[] = [
  {
    id: 'pianobariste-live',
    title: 'Le Pianobariste — Session Live Lounge & Standards',
    category: 'Piano-bar & Standards Jazz',
    duration: 185,
    src: '',
    description: 'Interprétation acoustique au piano, progression jazz feutrée (Dm9, G13, Cmaj9) et standards intemporels.',
    status: 'acoustic_demo',
    expectedFile: 'pianobariste-live.mp3',
    tempo: '72 BPM',
    mood: 'Feutré, intimiste & élégant',
    sceneContext: 'Extrait capté en direct lors d’un dîner diplomatique de prestige — ambiance acoustique feutrée.',
    instruments: ['Piano de concert 88 touches', 'Pédale douce', 'Ambiance lounge'],
  },
  {
    id: 'duo-acoustique',
    title: 'Duo Signature — Dialogue Piano & Voix Lead',
    category: 'Piano-Voix & Soul Poétique',
    duration: 205,
    src: '',
    description: 'Alchimie intimiste entre les harmonies du piano et la voix de Flavie sur une trame soul et chanson française.',
    status: 'acoustic_demo',
    expectedFile: 'duo-acoustique.mp3',
    tempo: '76 BPM',
    mood: 'Chaleureux, expressif & complice',
    sceneContext: 'Captation live en duo — symbiose harmonique, nuances dynamiques et émotion brute.',
    instruments: ['Piano acoustique', 'Voix lead', 'Harmonies vocales'],
  },
  {
    id: 'afro-jazz-makossa',
    title: 'Makossa Heritage — Pulsation & Afro-Jazz Live',
    category: 'Patrimoine & Afro-Jazz',
    duration: 220,
    src: '',
    description: 'Relecture acoustique des rythmes Makossa au clavier : syncopes vivantes et harmonisations jazz modernes.',
    status: 'acoustic_demo',
    expectedFile: 'afro-jazz-makossa.mp3',
    tempo: '112 BPM',
    mood: 'Solaire, syncopé & percussif',
    sceneContext: 'Session trio avec section rythmique — exploration des polyrythmies côtières camerounaises.',
    instruments: ['Piano percussif', 'Basse syncopée', 'Percussions traditionnelles'],
  },
  {
    id: 'composition-theme',
    title: 'Composition originale — Thème & Arrangement Scénique',
    category: 'Composition & Orchestration',
    duration: 214,
    src: '',
    description: 'Thème original mélodique écrit pour le spectacle vivant et l’émotion de scène.',
    status: 'acoustic_demo',
    expectedFile: 'composition-theme.mp3',
    tempo: '64 BPM',
    mood: 'Cinématique, noble & contemplatif',
    sceneContext: 'Thème original écrit pour le spectacle vivant et l’illustration poétique.',
    instruments: ['Piano à queue', 'Arrangement cordes', 'Textures spatialisées'],
  },
  {
    id: 'mao-sound-design',
    title: 'Production sonore & Ingénierie du son',
    category: 'Ingénierie du son & MAO',
    duration: 168,
    src: '',
    description: 'Textures harmoniques spatialisées, clarté dynamique et traitement acoustique haute fidélité.',
    status: 'acoustic_demo',
    expectedFile: 'mao-sound-design.mp3',
    tempo: '90 BPM',
    mood: 'Précis, immersif & haute fidélité',
    sceneContext: 'Prise de son studio et mixage dynamique avec restitution panoramique.',
    instruments: ['Claviers de scène', 'Traitements analogiques', 'Spatialisation stéréo'],
  },
  {
    id: 'ia-musique-recherche',
    title: 'Musicien Augmenté — Expérimentation sonore & IA',
    category: 'IA & Création assistée',
    duration: 195,
    src: '',
    description: 'Exploration des interactions entre phrasé pianistique vivant et résonance algorithmique.',
    status: 'acoustic_demo',
    expectedFile: 'ia-musique-recherche.mp3',
    tempo: '84 BPM',
    mood: 'Hypnotique, exploratoire & hybride',
    sceneContext: 'Session de recherche interactive combinant improvisation au piano et résonances génératives.',
    instruments: ['Piano acoustique', 'Synthétiseurs génératifs', 'Algorithmes de résonance'],
  },
  {
    id: 'afropop-rumba',
    title: 'Rumba & Afropop Acoustique — Soleil & Élégance Panafricaine',
    category: 'Afropop & Rumba',
    duration: 210,
    src: '',
    description: 'Dialogue entre toucher pianistique percussif, arpèges chantants et pulsation rumba feutrée.',
    status: 'acoustic_demo',
    expectedFile: 'afropop-rumba.mp3',
    tempo: '96 BPM',
    mood: 'Solaire, dansant & raffiné',
    sceneContext: 'Ambiance cocktail de prestige — transition fluide entre contemplation et pulsation festive.',
    instruments: ['Piano rythmique', 'Guitare acoustique', 'Congas & Shakers', 'Basse ronde'],
  },
  {
    id: 'soul-chanson-poetique',
    title: 'Nocturne Poétique — Standards Francophones & Soul Intemporelle',
    category: 'Chanson Poétique & Soul',
    duration: 228,
    src: '',
    description: 'Hommage aux maîtres de l’émotion textuelle : accords veloutés, sensibilité vocale et rubato pianistique.',
    status: 'acoustic_demo',
    expectedFile: 'soul-chanson-poetique.mp3',
    tempo: '68 BPM',
    mood: 'Poétique, feutré & émouvant',
    sceneContext: 'Interprétation intimiste de fin de soirée — silence attentif et émotion partagée.',
    instruments: ['Piano à queue de concert', 'Voix baryton chaleureuse', 'Pédale una corda'],
  },
  {
    id: 'concert-guerisseurs',
    title: 'Le Concert des Guérisseurs — Prélude Thérapeutique & African Wizarding Music',
    category: 'Spectacle & Musique Thérapeutique',
    duration: 245,
    src: '',
    description: 'Ouverture du spectacle immersif Le Concert des Guérisseurs : trames harmoniques apaisantes, polyphonies sacrées et dimension curative du son.',
    status: 'acoustic_demo',
    expectedFile: 'concert-des-guerisseurs.mp3',
    tempo: '60 BPM',
    mood: 'Thérapeutique, mystique & enveloppant',
    sceneContext: 'Théâtre et scène vivante — création originale explorant la musicothérapie traditionnelle et la puissance réparatrice de l’harmonie sonore.',
    instruments: ['Piano céleste', 'Sanzo / Kalimba', 'Nappes chorales sacrées', 'Flûte pastorale'],
  },
  {
    id: 'cinema-narration-visuelle',
    title: 'Cinéma & Narration Visuelle — Bande Originale Dramatique',
    category: 'Musique à l’image & Fiction',
    duration: 215,
    src: '',
    description: 'Score dramatique pour le cinéma africain : tension feutrée au piano, contre-chants de violoncelle et montées orchestrales au service du récit.',
    status: 'acoustic_demo',
    expectedFile: 'cinema-narration-visuelle.mp3',
    tempo: '78 BPM',
    mood: 'Dramatique, narratif & immersif',
    sceneContext: 'Composition pour court et long-métrage de fiction — synchronisation précise de l’émotion harmonique avec la dramaturgie du plan.',
    instruments: ['Piano dramatique', 'Cordes lyriques', 'Percussions telluriques', 'Textures subaquatiques'],
  },
]

/**
 * Vérifie si une piste possède une source audio exploitable ou peut être jouée en démo acoustique.
 */
export function isTrackPlayable(track: AudioTrack | null): boolean {
  if (!track) return false
  if (track.src && track.src.trim().length > 0 && track.status === 'ready') return true
  return track.status === 'acoustic_demo'
}

/**
 * Retourne la liste des pistes disposant d'une source audio ou d'une démo acoustique.
 */
export function getPlayableTracks(): AudioTrack[] {
  return AUDIO_PLAYLIST.filter(isTrackPlayable)
}
