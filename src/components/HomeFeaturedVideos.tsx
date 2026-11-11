import { Link } from 'react-router-dom'
import { LIVE_PERFORMANCES, PRESTIGE_VENUES } from '../data/music'
import { videos } from '../data/videos'
import type { Video } from '../data/videos'
import VideoCard from './VideoCard'
import { Container, ChapterMark, Display, Reveal, Btn } from './ui'

interface HomeFeaturedVideosProps {
  chapterNum?: string
}

export default function HomeFeaturedVideos({ chapterNum = '05' }: HomeFeaturedVideosProps) {
  const featuredVideos = videos
    .filter((v: Video) => v.featured || (v.priority && v.priority <= 3))
    .slice(0, 3)

  if (featuredVideos.length === 0) return null

  const gridClass =
    featuredVideos.length >= 3
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      : featuredVideos.length === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : 'grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] items-start'

  return (
    <section className="relative overflow-hidden bg-ink py-20 border-t border-white/5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px]"
      />

      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
            <div>
              <ChapterMark num={chapterNum} label="Captations & Scène" />
              <Display className="mt-2 text-3xl md:text-5xl font-serif text-ivory">
                À découvrir en vidéo
              </Display>
              <p className="mt-3 max-w-xl text-sm md:text-base text-ivory/70">
                Captations scéniques, reprises live et sessions Piano-Bar : découvrez l’univers musical d’Hervé Nanfang en conditions réelles.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Btn to="/videos" variant="gold">
                Toutes les vidéos live
              </Btn>
              <Btn to="/reservation?type=booking" variant="ghost">
                Réserver une scène
              </Btn>
            </div>
          </div>
        </Reveal>

        <div className={`grid gap-8 ${gridClass}`}>
          {featuredVideos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}

          {featuredVideos.length === 1 && (
            <div className="flex flex-col justify-between gap-6 border border-white/10 bg-ink-2/70 p-7 md:p-8">
              <div>
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-gold">
                  Formats documentés en live
                </p>
                <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
                  Du piano solo feutré aux grands galas institutionnels
                </h3>
                <div className="mt-6 space-y-4">
                  {LIVE_PERFORMANCES.slice(0, 3).map((perf) => (
                    <div
                      key={perf.id}
                      className="border-l-2 border-gold/40 pl-4 transition-colors hover:border-gold"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="font-display text-lg text-ivory">{perf.title}</p>
                        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-gold/80">
                          {perf.format}
                        </span>
                      </div>
                      <p className="mt-1 text-xs leading-relaxed text-ivory/65">{perf.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-ivory/50">
                  Lieux de référence confirmés
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {PRESTIGE_VENUES.slice(0, 4).map((v) => (
                    <span
                      key={v.name}
                      className="border border-white/10 bg-ink px-3 py-1 text-xs text-ivory/75"
                    >
                      {v.name}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    to="/reservation?type=booking"
                    className="btn btn-gold"
                  >
                    Demander une disponibilité →
                  </Link>
                  <Link
                    to="/musique#pianobariste"
                    className="text-xs font-semibold uppercase tracking-[0.16em] text-gold hover:underline"
                  >
                    Écouter le répertoire (+440 titres) →
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/videos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-2 hover:underline"
          >
            Explorer l’espace complet Vidéos & Performances Live →
          </Link>
        </div>
      </Container>
    </section>
  )
}
