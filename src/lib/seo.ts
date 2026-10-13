import { createContext, useContext, useEffect } from 'react'
import { SITE } from '../data/site'

/** Code de vérification Google Search Console — défini dans .env.local / Vercel. */
export const GOOGLE_SITE_VERIFICATION = (import.meta.env.VITE_GOOGLE_SITE_VERIFICATION ?? '').trim()
/** Code de vérification Bing Webmaster Tools (balise meta `msvalidate.01`). */
export const BING_SITE_VERIFICATION = (import.meta.env.VITE_BING_SITE_VERIFICATION ?? '').trim()
/** Identifiant de mesure d'audience (optionnel). */
export const ANALYTICS_ID = (import.meta.env.VITE_ANALYTICS_ID ?? '').trim()

export type SeoInput = {
  title: string
  description: string
  /** Chemin canonique, ex. '/musique' */
  path: string
  /** Données structurées additionnelles rattachées à la page */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  type?: 'website' | 'article'
  image?: string
  robots?: string
}

export const SeoContext = createContext<((input: SeoInput) => void) | null>(null)

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/**
 * Applique titre, description, canonical, Open Graph, Twitter Card
 * et données structurées pour la page courante.
 */
export function useSeo({
  title,
  description,
  path,
  jsonLd,
  type = 'website',
  image = '/og-image.jpg',
  robots = 'index, follow, max-image-preview:large',
}: SeoInput) {
  const captureSeo = useContext(SeoContext)
  captureSeo?.({ title, description, path, jsonLd, type, image, robots })

  useEffect(() => {
    const url = `${SITE.url}${path === '/' ? '/' : path}`
    const imageUrl = image.startsWith('http') ? image : `${SITE.url}${image}`

    document.title = title

    setMeta('name', 'description', description)
    setMeta('name', 'robots', robots)
    if (GOOGLE_SITE_VERIFICATION) {
      setMeta('name', 'google-site-verification', GOOGLE_SITE_VERIFICATION)
    }
    if (BING_SITE_VERIFICATION) {
      setMeta('name', 'msvalidate.01', BING_SITE_VERIFICATION)
    }

    setLink('canonical', url)

    setMeta('property', 'og:type', type)
    setMeta('property', 'og:site_name', SITE.name)
    setMeta('property', 'og:locale', 'fr_FR')
    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', imageUrl)
    setMeta('property', 'og:image:width', '1200')
    setMeta('property', 'og:image:height', '630')

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', imageUrl)

    // Données structurées dynamiques de la page
    document.querySelectorAll('script[data-page-ld]').forEach((n) => n.remove())
    if (jsonLd) {
      const payload = Array.isArray(jsonLd) ? jsonLd : [jsonLd]
      payload.forEach((item) => {
        const script = document.createElement('script')
        script.type = 'application/ld+json'
        script.setAttribute('data-page-ld', 'true')
        script.textContent = JSON.stringify(item)
        document.head.appendChild(script)
      })
    }
  }, [title, description, path, type, image, jsonLd, robots])
}

export function pageTitle(page?: string) {
  return page ? `${page} | ${SITE.name}` : `${SITE.name} | Musicien, Musicologue, Pédagogue & IA`
}
