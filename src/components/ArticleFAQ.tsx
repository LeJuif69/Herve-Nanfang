import { useState } from 'react'

export type FaqItem = {
  q: string
  a: string
}

interface ArticleFAQProps {
  items: FaqItem[]
  title?: string
}

export default function ArticleFAQ({
  items,
  title = 'Questions fréquentes & Réponses de l’auteur',
}: ArticleFAQProps) {
  const [openIndices, setOpenIndices] = useState<number[]>([0])

  if (!items || items.length === 0) return null

  const toggle = (idx: number) => {
    setOpenIndices((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    )
  }

  return (
    <section
      data-testid="article-faq"
      className="my-12 rounded-2xl border border-white/10 bg-ink-2/60 p-7 md:p-9 backdrop-blur-sm"
      aria-label="Foire aux questions"
    >
      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gold mb-3">
        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
        <span>FAQ de l’article</span>
      </div>
      <h3 className="font-display text-2xl font-bold text-ivory md:text-3xl mb-6">
        {title}
      </h3>

      <div className="divide-y divide-white/10">
        {items.map((item, idx) => {
          const isOpen = openIndices.includes(idx)
          return (
            <div key={item.q} className="py-4">
              <button
                type="button"
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between text-left font-display text-lg text-ivory hover:text-gold transition-colors gap-4"
              >
                <span>{item.q}</span>
                <span className="font-mono text-xl text-gold shrink-0 transition-transform duration-200">
                  {isOpen ? '−' : '+'}
                </span>
              </button>
              {isOpen && (
                <div className="mt-3 text-sm leading-relaxed text-ivory/70 pr-6">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}
