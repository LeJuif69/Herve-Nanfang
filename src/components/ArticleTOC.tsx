import { useEffect, useState } from 'react'

export type TocItem = {
  id: string
  text: string
  level?: number
}

interface ArticleTOCProps {
  items?: TocItem[]
  html?: string
}

export default function ArticleTOC({ items, html }: ArticleTOCProps) {
  const [headings, setHeadings] = useState<TocItem[]>(items || [])

  useEffect(() => {
    if (items && items.length > 0) {
      setHeadings(items)
      return
    }

    if (html && typeof document !== 'undefined') {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, 'text/html')
      const nodes = Array.from(doc.querySelectorAll('h2, h3'))
      const list = nodes.map((node) => ({
        id: node.id || (node.textContent || '').trim().replace(/\s+/g, '-').toLowerCase(),
        text: node.textContent || '',
        level: node.tagName === 'H2' ? 2 : 3,
      }))
      setHeadings(list)
    }
  }, [items, html])

  if (!headings.length) return null

  return (
    <nav
      aria-label="Sommaire de l'article"
      className="my-8 rounded-xl border border-gold/25 bg-ink-2/60 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-gold mb-4">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span>Sommaire & Navigation</span>
      </div>
      <ol className="space-y-2 text-sm text-ivory/80">
        {headings.map((h, i) => (
          <li
            key={`${h.id}-${i}`}
            className={`flex items-baseline gap-3 transition-colors hover:text-gold ${
              h.level === 3 ? 'ml-5 text-xs text-ivory/60' : ''
            }`}
          >
            <span className="font-mono text-xs text-gold/60">{String(i + 1).padStart(2, '0')}.</span>
            <a href={`#${h.id}`} className="hover:underline underline-offset-4">
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
