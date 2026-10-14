import { Link } from 'react-router-dom'
import portrait from '../assets/portrait.webp'
import { Eyebrow } from './ui'

export default function AuthorSignature() {
  return (
    <div className="relative isolate my-12 overflow-hidden border border-gold/30 bg-ink-2/90 p-8 shadow-2xl backdrop-blur-md md:p-10">
      {/* Halo subtil en arrière-plan */}
      <div
        aria-hidden="true"
        className="orb-gold pointer-events-none absolute -right-16 -top-16 h-56 w-56 opacity-10"
      />

      <div className="flex flex-col gap-8 md:flex-row md:items-center">
        {/* Médaillon Portrait */}
        <div className="relative shrink-0">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-gold/60 p-1 shadow-[0_0_20px_rgba(198,161,91,0.25)] md:h-28 md:w-28">
            <img
              src={portrait}
              alt="Hervé Nanfang"
              className="h-full w-full rounded-full object-cover object-top filter grayscale contrast-125 transition-all duration-500 hover:filter-none"
              loading="lazy"
            />
          </div>
          <div
            aria-hidden="true"
            className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-gold/60 bg-gradient-to-br from-ink-2 to-black p-1 shadow-md ring-1 ring-gold/30"
          >
            <img src="/hn-initials-mark.png" alt="" className="h-full w-full object-contain" />
          </div>
        </div>

        {/* Contenu et Présentation */}
        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Eyebrow tone="gold">Signature de l’auteur</Eyebrow>
            <span className="font-mono text-[0.62rem] uppercase tracking-widest text-ivory/40">
              Yaoundé, Cameroun
            </span>
          </div>

          <div>
            <h3 className="font-display text-2xl tracking-tight text-ivory md:text-3xl">
              Hervé Nanfang
            </h3>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gold/80">
              Artiste-musicien · Musicologue · Pédagogue · Créateur de Musicien Augmenté™
            </p>
          </div>

          <p className="font-serif italic text-gold/90 text-sm">
            « Créer. Transmettre. Augmenter. Développer. »
          </p>

          <p className="text-sm leading-relaxed text-ivory/70">
            Pianiste live depuis 2007, formateur et chercheur, Hervé Nanfang relie la scène au
            studio, l’héritage des musiques africaines et l’intelligence artificielle appliquée.
            Fondateur de Racines Musicales Academy® et concepteur du Permis de Jouer™, il œuvre
            pour une technologie qui augmente l’artiste sans remplacer le jugement humain.
          </p>

          <div className="flex flex-wrap items-center gap-5 pt-3">
            <Link
              to="/a-propos"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-gold transition-colors hover:text-gold-2"
            >
              <span className="link-underline">Découvrir le parcours</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>

            <span aria-hidden className="text-white/20">·</span>

            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-ivory/60 transition-colors hover:text-gold"
            >
              <span className="link-underline">Contacter l’auteur</span>
              <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
