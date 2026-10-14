import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ALL_REPERTOIRE_SONGS,
  REPERTOIRE_CATEGORIES,
  REPERTOIRE_TOTAL_COUNT,
  type RepertoireSong,
} from '../data/repertoire'

export default function RepertoireExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [visibleCount, setVisibleCount] = useState<number>(36)

  // Filtrage combiné : catégorie + recherche temps réel (titre, artiste, tonalité, genre)
  const filteredSongs = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    return ALL_REPERTOIRE_SONGS.filter((song: RepertoireSong) => {
      // Filtre catégorie
      if (selectedCategory !== 'all' && song.category !== selectedCategory) {
        return false
      }
      // Filtre recherche
      if (!q) return true
      const matchTitle = song.title.toLowerCase().includes(q)
      const matchArtist = song.artist?.toLowerCase().includes(q)
      const matchKey = song.key?.toLowerCase().includes(q)
      const matchCat = song.categoryLabel.toLowerCase().includes(q)
      return matchTitle || matchArtist || matchKey || matchCat
    })
  }, [selectedCategory, searchQuery])

  const visibleSongs = useMemo(() => {
    return filteredSongs.slice(0, visibleCount)
  }, [filteredSongs, visibleCount])

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId)
    setVisibleCount(36)
  }

  const handleSearchChange = (val: string) => {
    setSearchQuery(val)
    setVisibleCount(36)
  }

  return (
    <div className="mt-14 space-y-8" id="catalogue-complet">
      {/* En-tête manifeste du répertoire */}
      <div className="rounded-2xl border border-gold/30 bg-ink-2/80 p-6 md:p-8 backdrop-blur-md">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
              <span className="font-mono text-xs uppercase tracking-wider text-gold">
                Corpus Officiel · Le PianoBariste™
              </span>
            </div>
            <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
              Catalogue Documenté — 441 Titres au Répertoire
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-ivory/70 md:text-sm">
              Hervé Nanfang dispose d’un répertoire musical acquis, vaste et évolutif de plus de{' '}
              <strong className="text-gold font-semibold">440 titres consignés</strong>. Il traverse
              10 univers : chanson francophone, pop et classiques anglophones, soul, R&amp;B, rock,
              musiques camerounaises et africaines, afropop, rumba, zouk, reggae, standards de jazz,
              gospel et rap populaire. Cette diversité constitue la base documentée de son activité,
              attestant l’étendue des œuvres maîtrisées sans jamais réduire son identité à un genre unique.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-ink p-3 text-center">
              <span className="font-display text-2xl text-gold">{REPERTOIRE_TOTAL_COUNT}</span>
              <p className="text-[0.62rem] uppercase tracking-wider text-ivory/60 mt-0.5">
                Titres consignés
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink p-3 text-center">
              <span className="font-display text-2xl text-gold">10</span>
              <p className="text-[0.62rem] uppercase tracking-wider text-ivory/60 mt-0.5">
                Univers musicaux
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink p-3 text-center">
              <span className="font-display text-2xl text-gold">350+</span>
              <p className="text-[0.62rem] uppercase tracking-wider text-ivory/60 mt-0.5">
                Compositeurs
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-ink p-3 text-center">
              <span className="font-display text-2xl text-gold">100%</span>
              <p className="text-[0.62rem] uppercase tracking-wider text-ivory/60 mt-0.5">
                Live & Acoustique
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de recherche et filtres de catégories */}
      <div className="space-y-4">
        {/* Barre de recherche */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Rechercher un titre, un artiste (ex: Aznavour, Richard Bona, Michael Jackson, Eboa Lotin, Céline Dion...) ou une tonalité..."
            className="w-full rounded-xl border border-white/15 bg-ink-2/90 px-4 py-3 pl-11 text-sm text-ivory placeholder-ivory/40 transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
          />
          <svg
            className="absolute left-3.5 top-3.5 h-4 w-4 text-ivory/40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => handleSearchChange('')}
              className="absolute right-3.5 top-3 text-xs uppercase tracking-wider text-ivory/50 hover:text-gold"
            >
              Effacer
            </button>
          )}
        </div>

        {/* Filtres par Univers (Tabs) */}
        <div className="flex flex-wrap gap-1.5 pb-2">
          <button
            type="button"
            onClick={() => handleCategoryChange('all')}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'border border-gold bg-gold text-ink shadow-[0_0_15px_rgba(198,161,91,0.25)]'
                : 'border border-white/10 bg-white/5 text-ivory/70 hover:border-gold/40 hover:text-ivory'
            }`}
          >
            Tous les titres ({REPERTOIRE_TOTAL_COUNT})
          </button>

          {REPERTOIRE_CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'border border-gold bg-gold text-ink shadow-[0_0_15px_rgba(198,161,91,0.25)]'
                    : 'border border-white/10 bg-white/5 text-ivory/70 hover:border-gold/40 hover:text-ivory'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Résumé des résultats */}
      <div className="flex items-center justify-between text-xs text-ivory/60 border-b border-white/8 pb-3">
        <span>
          <strong className="text-gold font-mono">{filteredSongs.length}</strong> morceau(x) affiché(s)
          {selectedCategory !== 'all' && (
            <span> dans {REPERTOIRE_CATEGORIES.find((c) => c.id === selectedCategory)?.label}</span>
          )}
          {searchQuery && <span> pour la recherche « {searchQuery} »</span>}
        </span>

        {visibleCount < filteredSongs.length && (
          <span className="text-[0.68rem] text-ivory/40">
            Affichage de 1 à {Math.min(visibleCount, filteredSongs.length)}
          </span>
        )}
      </div>

      {/* Grille des morceaux */}
      {filteredSongs.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-ink-2 p-10 text-center">
          <p className="font-display text-xl text-ivory">Aucun morceau ne correspond à votre recherche.</p>
          <p className="mt-2 text-xs text-ivory/60">
            Le répertoire live d'Hervé Nanfang s'adapte en permanence : n'hésitez pas à proposer votre titre.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('all')
            }}
            className="mt-5 btn btn-outline text-xs px-4 py-2"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleSongs.map((song) => (
            <div
              key={song.id}
              className="group flex flex-col justify-between rounded-lg border border-white/8 bg-ink-2/70 p-4 transition-all duration-200 hover:border-gold/40 hover:bg-ink-2 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-display text-base text-ivory leading-snug group-hover:text-gold transition-colors">
                    {song.title}
                  </h4>
                  {song.key && (
                    <span
                      title={`Tonalité : ${song.key}`}
                      className="shrink-0 rounded bg-gold/10 border border-gold/30 px-1.5 py-0.5 font-mono text-[0.62rem] font-bold text-gold"
                    >
                      {song.key}
                    </span>
                  )}
                </div>

                <p className="mt-1.5 text-xs text-ivory/60 truncate">
                  {song.artist ? (
                    <span className="text-ivory/80 font-medium">{song.artist}</span>
                  ) : (
                    <span className="italic text-ivory/40">Interprétation Piano-bar</span>
                  )}
                </p>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2 text-[0.65rem] text-ivory/45">
                <span className="truncate">{song.categoryLabel}</span>
                <span className="font-mono text-[0.6rem] text-gold/60">♫ Live</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bouton Charger Plus */}
      {visibleCount < filteredSongs.length && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 48)}
            className="btn btn-gold px-6 py-2.5 text-xs uppercase tracking-wider font-bold"
          >
            Afficher plus de morceaux (+48)
          </button>
          <button
            type="button"
            onClick={() => setVisibleCount(filteredSongs.length)}
            className="text-xs uppercase tracking-wider text-ivory/60 hover:text-gold transition-colors"
          >
            Voir l'intégralité du catalogue ({filteredSongs.length})
          </button>
        </div>
      )}

      {/* Bannière Demande Spécifique & Booking */}
      <div className="rounded-xl border border-white/10 bg-gradient-to-r from-ink to-ink-2 p-6 md:p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span className="font-mono text-xs text-gold uppercase tracking-wider">
            Sur-mesure & Programmation
          </span>
          <h4 className="mt-1 font-display text-xl text-ivory md:text-2xl">
            Une chanson fétiche ou une œuvre clé pour votre événement ?
          </h4>
          <p className="mt-2 text-xs text-ivory/70 max-w-xl leading-relaxed">
            Pour une ouverture de bal, un cocktail diplomatique ou une soirée corporate, Hervé Nanfang
            adapte sa programmation et prépare les arrangements spécifiques de vos titres favoris.
          </p>
        </div>

        <Link
          to="/contact#booking"
          className="btn btn-gold whitespace-nowrap px-6 py-3 text-xs uppercase tracking-wider font-bold shrink-0"
        >
          Demander une programmation sur mesure
        </Link>
      </div>
    </div>
  )
}
