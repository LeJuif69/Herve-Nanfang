import { Link } from 'react-router-dom'
import { Container } from './ui'

export default function VideoCta() {
  const channelUrl = 'https://www.youtube.com/@hervenanfang'

  return (
    <section className="relative my-16 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-ink-2 via-ink to-black p-8 text-center md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
      {/* Halo lumineux de fond */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(198,161,91,0.15),transparent_70%)]"
      />

      <Container className="relative z-10 max-w-3xl">
        <span className="inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-mono uppercase tracking-widest text-gold mb-4">
          Prestations & Réservations Live
        </span>

        <h2 className="font-serif text-2xl text-ivory sm:text-3xl md:text-4xl leading-tight">
          Vous recherchez une animation musicale live pour votre établissement ou votre événement ?
        </h2>

        <p className="mt-4 text-sm md:text-base text-ivory/75 max-w-xl mx-auto leading-relaxed">
          Prestations sur-mesure au piano : atmosphère Piano-Bar, répertoire éclectique (chanson internationale, rumba, variétés, jazz lounge), en solo ou avec Flavie Nanfang.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/services#piano-bar"
            className="w-full sm:w-auto rounded-xl bg-gold px-7 py-3 text-sm font-semibold text-ink shadow-[0_0_25px_rgba(198,161,91,0.4)] transition-all duration-300 hover:scale-105 hover:bg-gold-2 hover:shadow-[0_0_35px_rgba(198,161,91,0.6)]"
          >
            Découvrir mes prestations
          </Link>
          <Link
            to="/contact#booking"
            className="w-full sm:w-auto rounded-xl border border-gold/50 bg-ink/60 px-7 py-3 text-sm font-semibold text-ivory backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            Me contacter pour une réservation
          </Link>
        </div>

        {/* Bloc direct vers la chaîne YouTube */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left text-xs text-ivory/70">
            <span className="block font-medium text-ivory">Chaîne officielle YouTube</span>
            <span>Retrouvez toutes les vidéos, sessions live et Shorts d'Hervé Nanfang</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-xs font-medium text-ivory transition-colors hover:border-gold hover:text-gold"
            >
              Voir la chaîne YouTube
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <a
              href={`${channelUrl}?sub_confirmation=1`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-crimson px-4 py-2 text-xs font-semibold text-white shadow-md transition-transform hover:scale-105"
            >
              <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                <path d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z" />
              </svg>
              S’abonner à la chaîne
            </a>
          </div>
        </div>
      </Container>
    </section>
  )
}
