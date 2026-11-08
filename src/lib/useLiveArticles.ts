import type { AdminArticle } from './admin-types'
import { ARTICLES } from '../data/articles'
import { useAdminState } from './useLiveContent'

/**
 * Retourne la liste des articles à jour avec les modifications faites en session admin.
 */
export function useLiveArticles(): AdminArticle[] {
  const state = useAdminState()
  const sourceArticles = ARTICLES as unknown as AdminArticle[]
  const liveArticles = state.articles ?? []
  if (liveArticles.length === 0) return sourceArticles

  const liveBySlug = new Map<string, AdminArticle>(
    liveArticles.map((article) => [article.slug, article] as const),
  )
  const sourceSlugs = new Set(sourceArticles.map((article) => article.slug))

  const mergedSourceArticles = sourceArticles.map((source) => {
    const live = liveBySlug.get(source.slug)
    if (!live) return source

    const hasSourceBody = Boolean(source.body && source.body.length > 0)
    return {
      ...live,
      ...source,
      coverImage: (live.coverImage && live.coverImage !== '/og-image.jpg' ? live.coverImage : source.coverImage) || '/og-image.jpg',
      coverPositionX: live.coverPositionX ?? source.coverPositionX,
      coverPositionY: live.coverPositionY ?? source.coverPositionY,
      status: live.status || source.status,
      isFeatured: live.isFeatured ?? (source as any).isFeatured,
      publishedAt: live.publishedAt ?? (source as any).publishedAt,
      updatedAt: live.updatedAt ?? (source as any).updatedAt,
      readingTime: hasSourceBody ? source.readingTime : (live.readingTime || source.readingTime),
      audience: source.audience || live.audience,
      outline: source.outline?.length ? source.outline : (live.outline || []),
      body: hasSourceBody ? source.body : live.body,
      keywords: source.keywords?.length ? source.keywords : (live.keywords || []),
      linkedConcept: source.linkedConcept || live.linkedConcept,
    }
  })

  const additionalLiveArticles = liveArticles.filter((article) => !sourceSlugs.has(article.slug))
  return [...mergedSourceArticles, ...additionalLiveArticles]
}

/**
 * Retourne un article précis selon son slug, en tenant compte des modifications de l'admin.
 */
export function useLiveArticle(slug: string | undefined): AdminArticle | undefined {
  const articles = useLiveArticles()
  if (!slug) return undefined
  return articles.find((a) => a.slug === slug)
}

