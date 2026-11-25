import { Link } from 'react-router-dom'

interface ArticleAuthorProps {
  name?: string
  role?: string
  bio?: string
  avatar?: string
}

export default function ArticleAuthor({
  name = 'Hervé Nanfang',
  role = 'Artiste-Musicien, Musicologue & Concepteur du Musicien Augmenté™',
  bio = 'Pianiste live, pédagogue (A Laiz Academy, Permis de Jouer™) et chercheur en technologies musicales, Hervé Nanfang explore l’hybridation entre maîtrise instrumentale, traditions orales africaines et intelligence artificielle.',
  avatar = '/images/herve-nanfang-portrait-officiel.webp',
}: ArticleAuthorProps) {
  return (
    <div
      data-testid="article-author"
      className="my-10 rounded-2xl border border-gold/30 bg-gradient-to-br from-ink-2 via-ink to-ink-3 p-7 shadow-xl"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <img
          src={avatar}
          alt={name}
          width={96}
          height={96}
          loading="lazy"
          className="h-24 w-24 shrink-0 rounded-full border-2 border-gold object-cover shadow-md"
        />
        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
            <div>
              <p className="font-mono text-[0.65rem] font-semibold uppercase tracking-widest text-gold">
                Auteur & Directeur Éditorial
              </p>
              <h3 className="font-display text-2xl font-bold text-ivory">{name}</h3>
            </div>
            <Link
              to="/a-propos"
              className="text-xs font-semibold uppercase tracking-wider text-gold hover:text-gold-2 hover:underline"
            >
              Biographie complète →
            </Link>
          </div>
          <p className="mt-1 text-xs font-medium text-ivory/70">{role}</p>
          <p className="mt-3 text-sm leading-relaxed text-ivory/65">{bio}</p>

          <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3 border-t border-white/10 pt-4 text-xs text-ivory/60">
            <span className="font-mono text-[0.65rem] uppercase tracking-wider text-gold">Profils vérifiés :</span>
            <a
              href="https://www.linkedin.com/in/herve-nanfang-317bb2b1/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              LinkedIn
            </a>
            <span>·</span>
            <a
              href="https://www.youtube.com/@herve_nanfang"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              YouTube
            </a>
            <span>·</span>
            <a
              href="https://www.facebook.com/herve.nanfang.officiel/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Facebook
            </a>
            <span>·</span>
            <a
              href="https://www.instagram.com/alaizopays/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
