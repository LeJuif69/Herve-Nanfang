import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { buildSearchIndex, searchItems, type SearchItem } from '../data/search-index'
import { useAudio } from '../lib/audio-context'
import { useCommandMenu } from '../lib/command-menu-context'

export default function CommandMenu() {
  const { isOpen, closeCommandMenu } = useCommandMenu()
  const { selectTrack, openPlayer } = useAudio()
  const navigate = useNavigate()

  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)

  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  const allItems = useMemo(() => buildSearchIndex(), [])
  const filteredItems = useMemo(() => searchItems(allItems, query), [allItems, query])

  // Focus automatique lors de l'ouverture
  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Réinitialiser la sélection lors d'une nouvelle recherche
  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  // Exécution de l'action sélectionnée
  const handleSelect = (item: SearchItem) => {
    closeCommandMenu()
    if (item.track) {
      selectTrack(item.track, true)
      openPlayer()
    } else if (item.to) {
      navigate(item.to)
    }
  }

  // Navigation clavier dans la liste
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex((prev) => (filteredItems.length > 0 ? (prev + 1) % filteredItems.length : 0))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex((prev) =>
        filteredItems.length > 0 ? (prev - 1 + filteredItems.length) % filteredItems.length : 0,
      )
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex])
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      closeCommandMenu()
    }
  }

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Palette de recherche et commande"
      className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/80 p-4 pt-16 backdrop-blur-md sm:pt-24"
      onClick={closeCommandMenu}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-gold/30 bg-ink-2/95 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Champ de recherche */}
        <div className="relative flex items-center border-b border-white/10 px-4 py-3.5 sm:px-5">
          <svg
            className="h-5 w-5 text-gold/80 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Rechercher une rubrique, un extrait, un article... (⌘K)"
            aria-label="Recherche sur le site"
            className="ml-3 flex-1 bg-transparent text-sm text-ivory placeholder-ivory/40 outline-none sm:text-base font-sans"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              aria-label="Effacer la saisie"
              className="text-xs uppercase tracking-wider text-ivory/40 hover:text-gold"
            >
              Effacer
            </button>
          )}

          <button
            type="button"
            onClick={closeCommandMenu}
            aria-label="Fermer la palette"
            className="ml-3 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 text-xs text-ivory/60 hover:border-gold hover:text-gold"
          >
            ✕
          </button>
        </div>

        {/* Liste des résultats */}
        <div ref={resultsRef} className="max-h-80 overflow-y-auto p-2 sm:max-h-96">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center">
              <p className="font-display text-lg text-ivory/60">Aucun résultat trouvé</p>
              <p className="mt-1 text-xs text-ivory/40">
                Essayez avec un mot-clé comme « piano », « IA », « RMA » ou « live ».
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredItems.map((item, index) => {
                const isSelected = index === selectedIndex
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left transition-all ${
                      isSelected
                        ? 'border-l-2 border-gold bg-gold/15 text-ivory'
                        : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <p className="truncate font-display text-sm text-ivory sm:text-base">
                        {item.title}
                      </p>
                      <p className="truncate text-[0.7rem] text-ivory/50">{item.subtitle}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="rounded border border-gold/30 bg-ink px-2 py-0.5 text-[0.625rem] font-semibold uppercase tracking-wider text-gold/80">
                        {item.categoryLabel}
                      </span>
                      {isSelected && (
                        <span className="text-xs text-gold" aria-hidden>
                          ↵
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Pied de palette avec raccourcis clavier */}
        <div className="flex items-center justify-between border-t border-white/5 bg-ink/60 px-4 py-2.5 text-[0.65rem] text-ivory/45">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="rounded border border-white/10 bg-ink px-1.5 py-0.5 font-mono">↑</kbd>{' '}
              <kbd className="rounded border border-white/10 bg-ink px-1.5 py-0.5 font-mono">↓</kbd>{' '}
              Naviguer
            </span>
            <span>
              <kbd className="rounded border border-white/10 bg-ink px-1.5 py-0.5 font-mono">↵</kbd>{' '}
              Ouvrir
            </span>
          </div>
          <span>
            <kbd className="rounded border border-white/10 bg-ink px-1.5 py-0.5 font-mono">Échap</kbd>{' '}
            Fermer
          </span>
        </div>
      </div>
    </div>
  )
}
