import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { videos } from '../data/videos'
import type { Video } from '../data/videos'
import VideoCard from '../components/VideoCard'
import VideoFilters from '../components/VideoFilters'
import VideoCta from '../components/VideoCta'
import PageHero from '../components/PageHero'
import { breadcrumbSchema, creativeWorkSchema, personSchema } from '../lib/schema'
import { useSeo } from '../lib/seo'
import { Container, Reveal, ChapterMark, Display } from '../components/ui'

export default function Videos() {
  const [filter, setFilter] = useState<string>('Toutes les vidéos')

  const filteredVideos = useMemo(() => {
    const list = filter === 'Toutes les vidéos'
      ? [...videos]
      : videos.filter((v: Video) => v.category === filter)

    return list.sort((a, b) => (a.priority || 99) - (b.priority || 99))
  }, [filter])

  useSeo({
    title: 'Vidéos Piano-Bar Live & Concerts | Hervé Nanfang',
    description:
      'Découvrez les performances live, reprises musicales, sessions Piano-Bar et prestations de Hervé Nanfang, pianiste-chanteur et musicien camerounais.',
    path: '/videos',
    image: '/og-videos.jpg',
    jsonLd: [
      personSchema,
      creativeWorkSchema(
        'Performances vidéo live — Le Pianobariste™ (Hervé Nanfang)',
        'Captations piano-bar live, reprises de standards africains et internationaux, sessions studio et concerts en duo ou live band par Hervé Nanfang.',
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
        eyebrow="Performances & Captations Live"
        title="Vidéos & Performances Live"
        lead="Découvrez mon univers musical en direct : reprises de standards africains et internationaux, ambiances Piano-Bar, sessions acoustiques et collaborations scéniques."
        breadcrumb="Vidéos"
      />

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

        {/* Présentation éditoriale des 5 catégories */}
        <Reveal delay={150}>
          <div className="mt-20 rounded-2xl border border-gold/20 bg-ink-2/40 p-8 md:p-12">
            <ChapterMark num="02" label="Architecture Éditoriale" />
            <Display className="mt-3 text-2xl md:text-3xl font-serif text-ivory">
              5 Espaces d’Interprétation Musicale
            </Display>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm text-ivory/70">
              <div className="rounded-xl border border-white/5 bg-black/30 p-5">
                <h4 className="font-serif text-lg text-gold font-medium mb-1">Piano-Bar Live</h4>
                <p>Prestations en direct dans les hôtels, restaurants, cabarets, brunchs, mariages et réceptions privées.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-5">
                <h4 className="font-serif text-lg text-gold font-medium mb-1">Reprises Live</h4>
                <p>Interprétations personnelles de répertoires africains et internationaux (Ferre Gola, Fally Ipupa, rumba congolaise, chanson française, standards, gospel).</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-5">
                <h4 className="font-serif text-lg text-gold font-medium mb-1">Live Sessions</h4>
                <p>Performances filmées en studio et intimistes, piano-voix, sessions acoustiques et réinterprétations travaillées.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-5">
                <h4 className="font-serif text-lg text-gold font-medium mb-1">Duo Hervé & Flavie</h4>
                <p>Performances complices en couple, harmonies vocales, scènes partagées et créations en duo.</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-5 md:col-span-2 lg:col-span-2">
                <h4 className="font-serif text-lg text-gold font-medium mb-1">Scènes & Événements</h4>
                <p>Concerts, festivals, galas, événements culturels et prestations de prestige en formation scénique élargie.</p>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ivory/65">
              <span>Pour approfondir l’esthétique scénique et l’approche piano-bar d’Hervé Nanfang :</span>
              <div className="flex flex-wrap gap-4 font-semibold uppercase tracking-wider">
                <Link to="/musique" className="text-gold hover:underline">
                  Explorer le répertoire & les formules live →
                </Link>
                <Link to="/journal/ia-et-musique-live" className="text-ivory/80 hover:text-gold hover:underline">
                  Lire l’essai « IA et musique live » au Journal →
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
