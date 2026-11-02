import { Link } from 'react-router-dom'
import { videos } from '../data/videos'
import type { Video } from '../data/videos'
import VideoCard from './VideoCard'
import { Container, ChapterMark, Display, Reveal, Btn } from './ui'

export default function HomeFeaturedVideos() {
  const featuredVideos = videos
    .filter((v: Video) => v.featured || (v.priority && v.priority <= 3))
    .slice(0, 3)

  if (featuredVideos.length === 0) return null

  return (
    <section className="relative overflow-hidden bg-ink py-20 border-t border-white/5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 h-96 w-96 rounded-full bg-gold/5 blur-[120px]"
      />

      <Container>
        <Reveal>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <ChapterMark num="01" label="Performances Audiovisuelles" />
              <Display className="mt-2 text-3xl md:text-5xl font-serif text-ivory">
                À découvrir en vidéo
              </Display>
              <p className="mt-3 max-w-xl text-sm md:text-base text-ivory/70">
                Captations scéniques, reprises live et sessions Piano-Bar : découvrez l’univers musical d’Hervé Nanfang en direct.
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <Btn to="/videos" variant="gold">
                Toutes les vidéos live
              </Btn>
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {featuredVideos.map((video: Video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        <div className="mt-12 text-center">
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
