import { useState } from 'react'
import type { Video } from '../data/videos'
import VideoSchema from './VideoSchema'

export default function VideoCard({ video }: { video: Video }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const isVertical = video.orientation === 'vertical'
  const thumbUrl = video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
  const embedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`
  const directLink = `https://www.youtube.com/shorts/${video.youtubeId}`

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gold/25 bg-ink-2/70 backdrop-blur-md transition-all duration-500 hover:-translate-y-1.5 hover:border-gold hover:shadow-[0_15px_40px_rgba(198,161,91,0.2)]">
      <VideoSchema video={video} />

      {/* Zone du lecteur / Miniature */}
      <div
        className={`relative w-full overflow-hidden bg-black ${
          isVertical ? 'aspect-[9/16] max-h-[520px]' : 'aspect-video'
        }`}
      >
        {isPlaying ? (
          <iframe
            src={embedUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : (
          <div
            className="relative h-full w-full cursor-pointer"
            onClick={() => setIsPlaying(true)}
          >
            <img
              src={thumbUrl}
              alt={video.title}
              loading="lazy"
              className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-black/30" />

            {/* Bouton Play central */}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                aria-label={`Lancer la lecture de ${video.title}`}
                className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-gold bg-ink/80 text-gold shadow-2xl backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-gold group-hover:text-ink"
              >
                <svg className="h-6 w-6 translate-x-0.5 fill-current" viewBox="0 0 24 24">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </button>
            </div>

            {/* Badge format / catégorie */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[0.7rem] font-mono">
              <span className="rounded-full bg-ink/80 px-2.5 py-1 text-gold border border-gold/30 backdrop-blur-sm">
                {video.category}
              </span>
              {isVertical && (
                <span className="rounded-full bg-crimson/90 px-2.5 py-1 text-white font-sans font-semibold">
                  YouTube Short
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Contenu éditorial */}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-mono text-gold/80">
          <span>Artiste original :</span>
          <span className="font-semibold text-ivory">{video.originalArtist}</span>
        </div>

        <h3 className="font-serif text-xl font-medium leading-snug text-ivory transition-colors group-hover:text-gold md:text-2xl">
          {video.title}
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-ivory/70 line-clamp-3">
          {video.description}
        </p>

        {video.tags && video.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {video.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-2 py-0.5 text-[0.65rem] text-ivory/60"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto pt-5 flex items-center justify-between border-t border-white/10 text-xs">
          <span className="text-ivory/60">Interprété par {video.performedBy}</span>
          <a
            href={directLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-gold hover:text-gold-2 hover:underline"
          >
            Sur YouTube
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  )
}
