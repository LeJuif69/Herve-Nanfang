import { useMemo } from 'react'
import { videos } from '../data/videos'
import type { VideoCategory } from '../data/videos'

type Props = {
  selected: string
  onSelect: (category: string) => void
}

export default function VideoFilters({ selected, onSelect }: Props) {
  const categories = useMemo(() => {
    const set = new Set<VideoCategory>()
    videos.forEach((v) => set.add(v.category))
    return Array.from(set)
  }, [])

  const allCategories = ['Toutes les vidéos', ...categories]

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {allCategories.map((cat) => {
        const isActive = selected === cat
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelect(cat)}
            className={`rounded-full px-4 py-2 text-xs md:text-sm font-medium tracking-wide transition-all duration-300 ${
              isActive
                ? 'bg-gold text-ink font-semibold shadow-[0_0_20px_rgba(198,161,91,0.4)]'
                : 'border border-white/10 bg-ink-2/80 text-ivory/80 hover:border-gold/40 hover:text-gold'
            }`}
          >
            {cat}
          </button>
        )
      })}
    </div>
  )
}
