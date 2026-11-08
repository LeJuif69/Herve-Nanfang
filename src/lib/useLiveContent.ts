import { useEffect, useState } from 'react'
import type {
  AdminMedia,
  AdminSettings,
  AdminState,
} from './admin-types'
import { SITE } from '../data/site'

const DEFAULT_PUBLIC_MEDIA: AdminMedia[] = [
  {
    id: 'med-about-portrait',
    bucket: 'public-media',
    path: 'shooting-pro-officiel.webp',
    url: '/images/shooting-pro-officiel.webp',
    filename: 'shooting-pro-officiel.webp',
    altText: 'Portrait officiel d’Hervé Nanfang en costume d’apparat et chemise dorée',
    caption: 'Portrait éditorial officiel de prestige (Page À propos & Presse)',
    tags: ['Portrait', 'À propos', 'Presse', 'Identité'],
    mimeType: 'image/webp',
    sizeBytes: 137906,
    width: 1280,
    height: 853,
    defaultPositionX: 50,
    defaultPositionY: 30,
    focalX: 50,
    focalY: 30,
    createdAt: '2026-03-01T00:00:00Z',
  },
  {
    id: 'med-live-piano',
    bucket: 'public-media',
    path: 'live-scene-piano.webp',
    url: '',
    filename: 'live-scene-piano.webp',
    altText: 'Hervé Nanfang sur scène en concert live au piano',
    caption: 'Concert live Piano-Bar (Page Musique & Presse)',
    tags: ['Live', 'Piano', 'Concert', 'Scène'],
    mimeType: 'image/webp',
    sizeBytes: 54680,
    width: 1080,
    height: 1080,
    defaultPositionX: 50,
    defaultPositionY: 40,
    focalX: 50,
    focalY: 40,
    createdAt: '2026-03-02T00:00:00Z',
  },
]

function readLightweightPublicState(): Partial<AdminState> {
  try {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem('hn_admin_store_v4')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          return parsed as Partial<AdminState>
        }
      }
    }
  } catch {
    // ignore
  }
  return {
    media: DEFAULT_PUBLIC_MEDIA,
  }
}

/**
 * Hook qui écoute en temps réel les changements du store d'administration
 * (localStorage / Supabase) pour alimenter les pages publiques instantanément,
 * sans alourdir le bundle public initial avec les dépendances d'administration.
 */
export function useAdminState(): Partial<AdminState> {
  const [state, setState] = useState<Partial<AdminState>>(() => readLightweightPublicState())

  useEffect(() => {
    if (typeof localStorage === 'undefined') return
    const hasAdminSessionOrStore =
      Boolean(localStorage.getItem('hn_admin_store_v4')) ||
      Boolean(localStorage.getItem('hn_admin_session_v1'))

    if (!hasAdminSessionOrStore) return

    let unsubscribe: (() => void) | undefined
    let cancelled = false
    import('./admin-store').then(({ adminStore }) => {
      if (cancelled) return
      unsubscribe = adminStore.subscribe((newState) => {
        setState({ ...newState })
      })
    })
    return () => {
      cancelled = true
      unsubscribe?.()
    }
  }, [])

  return state
}

/**
 * Retourne un média d'administration avec son URL et son cadrage / point focal (CSS object-position)
 */
export function useLiveMedia(
  mediaId: string,
  fallbackUrl?: string,
  fallbackX: number = 50,
  fallbackY: number = 50,
): {
  url: string
  alt: string
  positionX: number
  positionY: number
  style: React.CSSProperties
} {
  const state = useAdminState()
  const found = state.media?.find((m) => m.id === mediaId || m.path.includes(mediaId))

  let url = (found?.url && found.url.trim() !== '') ? found.url : (fallbackUrl || '')
  if (url.startsWith('blob:')) {
    url = found?.filename ? `/images/${encodeURIComponent(found.filename)}` : (fallbackUrl || '')
  }
  const alt = found?.altText || ''
  const posX = found?.defaultPositionX ?? found?.focalX ?? fallbackX
  const posY = found?.defaultPositionY ?? found?.focalY ?? fallbackY

  return {
    url,
    alt,
    positionX: posX,
    positionY: posY,
    style: {
      objectPosition: `${posX}% ${posY}%`,
    },
  }
}

/**
 * Retourne les réglages généraux mis à jour depuis la session admin.
 */
export function useLiveSettings(): AdminSettings {
  const state = useAdminState()
  return (
    state.settings || {
      siteName: SITE.name,
      tagline: SITE.tagline,
      city: SITE.city,
      emailContact: SITE.emailContact,
      emailRma: SITE.emailRma,
      phonePrimary: SITE.phones[0]?.display ?? '+237 694 72 34 92',
      phoneSecondary: SITE.phones[1]?.display ?? '+237 682 18 02 66',
      referenceDescription: '',
      positioningLine: '',
      seoTitle: '',
      metaDescription: '',
      socialLinks: [],
      updatedAt: new Date().toISOString(),
    }
  )
}
