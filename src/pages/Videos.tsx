import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { videos, CONVERSION_CATEGORIES } from '../data/videos'
import type { Video } from '../data/videos'
import VideoCard from '../components/VideoCard'
import VideoFilters from '../components/VideoFilters'
import VideoCta from '../components/VideoCta'
import PageHero from '../components/PageHero'
import { breadcrumbSchema, creativeWorkSchema, localBusinessSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import { Container, Reveal, ChapterMark, Display, Btn } from '../components/ui'

export default function Videos() {
  const [filter, setFilter] = useState<string>('Toutes les vidéos')

  const filteredVideos = useMemo(() => {
    const list = filter === 'Toutes les vidéos'
      ? [...videos]
      : videos.filter((v: Video) => v.category === filter)

    return list.sort((a, b) => (a.priority || 99) - (b.priority || 99))
  }, [filter])

  useSeo({
    title: 'Vidéos & Captations Live — Piano-Bar, Galas & Concerts | Hervé Nanfang',
    description:
      'Découvrez en vidéo les prestations live de prestige d’Hervé Nanfang (Le Pianobariste™) : hôtels, mariages, soirées d’entreprises, concerts et masterclasses.',
    path: '/videos',
    image: '/og-videos.jpg',
    jsonLd: [
      personSchema,
      localBusinessSchema,
      creativeWorkSchema(
        'Vidéothèque Officielle — Le Pianobariste™ (Hervé Nanfang)',
        'Captations live, répertoires piano-bar feutré, duo piano-voix, galas d’entreprises et transmission pédagogique par Hervé Nanfang.',
      ),
      breadcrumbSchema([
        { name: 'Accueil', path: '/' },
        { name: 'Vidéos Live', path: '/videos' },
      ]),
    ],
  })

  return (
    <div className="bg-ink min-h-screen text-ivory pb-20">
      <PageHero
        eyebrow="Captations Réelles & Prestations Live"
        title="Vidéos & Formats Scéniques"
        lead="Plongez dans l’atmosphère de mes prestations en conditions réelles : salons d'hôtels, mariages d'exception, galas institutionnels, concerts et masterclasses pédagogiques."
        breadcrumb="Vidéos"
      >
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono uppercase tracking-widest text-gold/80 pt-2">
          <span>5 Univers Clés</span>
          <span>·</span>
          <span>Lecteur Intégré</span>
          <span>·</span>
          <span>Réservation Directe</span>
        </div>
      </PageHero>

      <Container className="mt-12 md:mt-16">
        <Reveal>
          <div className="mb-10">
            <VideoFilters selected={filter} onSelect={setFilter} />
          </div>
        </Reveal>

        {/* Grille des vidéos */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {filteredVideos.map((video: Video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-ivory/60">
            <p>Aucune vidéo dans cette catégorie pour le moment.</p>
          </div>
        )}

        {/* Présentation stratégique des 5 catégories de conversion */}
        <Reveal delay={150}>
          <div className="mt-20 rounded-2xl border border-gold/30 bg-ink-2/60 p-8 md:p-12 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
              <div>
                <ChapterMark num="02" label="Formats & Réservation" />
                <Display className="mt-3 text-2xl md:text-4xl font-serif text-ivory">
                  Cinq Cadres d’Intervention sur Mesure
                </Display>
                <p className="mt-3 text-sm text-ivory/70 max-w-xl">
                  Chaque contexte événementiel répond à un cahier des charges précis d’acoustique, d’intensité et de protocole.
                </p>
              </div>
              <Btn to="/reservation" variant="gold" className="shrink-0">
                Ouvrir le configurateur de devis →
              </Btn>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-ivory/70">
              {CONVERSION_CATEGORIES.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-xl border border-white/10 bg-black/40 p-6 flex flex-col justify-between transition-colors hover:border-gold/40"
                >
                  <div>
                    <h4 className="font-serif text-xl text-gold font-medium mb-2">{cat.label}</h4>
                    <p className="text-xs leading-relaxed text-ivory/75">{cat.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setFilter(cat.id)}
                      className="font-medium text-gold hover:underline"
                    >
                      Voir les vidéos ({videos.filter((v) => v.category === cat.id).length})
                    </button>
                    <Link
                      to={`/reservation?type=${cat.id === 'Formation' ? 'formation' : 'booking'}`}
                      className="text-ivory/50 hover:text-gold"
                    >
                      Réserver →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ivory/65">
              <span>Besoin d'un format spécifique (Solo, Duo ou Live Band) ?</span>
              <div className="flex flex-wrap gap-4 font-semibold uppercase tracking-wider">
                <Link to="/musique" className="text-gold hover:underline">
                  Découvrir le répertoire live (440+ titres) →
                </Link>
                <Link to="/contact" className="text-ivory/80 hover:text-gold hover:underline">
                  Poser une question directe →
                </Link>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Bloc Conversion & YouTube */}
        <Reveal delay={200}>
          <VideoCta />
        </Reveal>
      </Container>
    </div>
  )
}
