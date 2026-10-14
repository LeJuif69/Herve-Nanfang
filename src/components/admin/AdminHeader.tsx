import React from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '../../lib/supabase'
import type { AuthSession } from '../../lib/admin-types'

interface AdminHeaderProps {
  session: AuthSession
  onSignOut: () => void
  activeTab: string
  onSelectTab: (tab: string) => void
  unreadMessagesCount: number
  onOpenMobileNav: () => void
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  session,
  onSignOut,
  onSelectTab,
  unreadMessagesCount,
  onOpenMobileNav,
}) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-white/10 bg-ink-2/95 px-4 backdrop-blur-md md:px-8">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onOpenMobileNav}
          className="flex h-10 w-10 items-center justify-center border border-white/15 text-ivory lg:hidden"
          aria-label="Ouvrir le menu de navigation"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="flex items-center gap-3">
          <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gold/40 bg-gradient-to-br from-ink-2 to-black p-1 shadow-sm ring-1 ring-gold/20">
            <img src="/hn-initials-mark.png" alt="" className="h-full w-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg tracking-wide text-ivory">Hervé Nanfang</span>
              <span className="rounded bg-gold/15 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-widest text-gold">
                Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        {unreadMessagesCount > 0 && (
          <button
            type="button"
            onClick={() => onSelectTab('messages')}
            className="flex items-center gap-1.5 rounded border border-crimson/40 bg-crimson/15 px-2.5 py-1 text-xs font-bold text-crimson-2 hover:bg-crimson hover:text-white"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-crimson-2" />
            <span>{unreadMessagesCount} message{unreadMessagesCount > 1 ? 's' : ''}</span>
          </button>
        )}
        {/* Environment status */}
        <div className="hidden sm:flex sm:items-center sm:gap-2 border border-white/10 bg-ink/60 px-3 py-1.5 text-xs text-ivory/70">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              isSupabaseConfigured ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'bg-amber-400'
            }`}
          />
          <span>{isSupabaseConfigured ? 'Supabase Connecté' : 'Session Locale Sécurisée'}</span>
        </div>

        {/* View Public Site */}
        <Link
          to="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 border border-white/15 bg-ink/40 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-ivory/80 transition-colors hover:border-gold hover:text-gold"
          title="Ouvrir le site public dans un nouvel onglet"
        >
          <span>Voir le site</span>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </Link>

        {/* User profile & Logout */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="hidden text-right md:block">
            <p className="text-xs font-medium text-ivory">{session.user.fullName || 'Hervé Nanfang'}</p>
            <p className="text-[0.65rem] text-ivory/45">{session.user.email}</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            className="flex items-center gap-1 border border-crimson/40 bg-crimson/10 px-2.5 py-1.5 text-xs font-medium text-crimson-2 transition-colors hover:bg-crimson hover:text-white"
            title="Se déconnecter de l'administration"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="hidden sm:inline">Quitter</span>
          </button>
        </div>
      </div>
    </header>
  )
}
