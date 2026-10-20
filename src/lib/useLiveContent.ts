import { useEffect, useState } from 'react'
import { adminStore } from './admin-store'
import type {
  AdminArticle,
  AdminSettings,
  AdminState,
} from './admin-types'
import { ARTICLES } from '../data/articles'
import { SITE } from '../data/site'

/**
 * Hook qui écoute en temps réel les changements du store d'administration
 * (localStorage / Supabase) pour alimenter les pages publiques instantanément.
 */
export function useAdminState(): AdminState {
  const [state, setState] = useState<AdminState>(() => adminStore.getState())

  useEffect(() => {
    const unsubscribe = adminStore.subscribe((newState) => {
      setState({ ...newState })
    })
    return unsubscribe
  }, [])

  return state
}

/**
 * Retourne la liste des articles à jour avec les modifications faites en session admin.
 */
export function useLiveArticles(): AdminArticle[] {
  const state = useAdminState()
  return state.articles && state.articles.length > 0
    ? state.articles
    : (ARTICLES as unknown as AdminArticle[])
}

/**
 * Retourne un article précis selon son slug, en tenant compte des modifications de l'admin.
 */
export function useLiveArticle(slug: string | undefined): AdminArticle | undefined {
  const articles = useLiveArticles()
  if (!slug) return undefined
  return articles.find((a) => a.slug === slug)
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

  let url = found?.url || fallbackUrl || ''
  if (url.startsWith('blob:')) {
    url = found?.filename ? `/images/${encodeURIComponent(found.filename)}` : fallbackUrl || ''
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
