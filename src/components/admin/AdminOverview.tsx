import React from 'react'
import { Link } from 'react-router-dom'
import { isSupabaseConfigured } from '../../lib/supabase'
import type { AdminState } from '../../lib/admin-types'

interface AdminOverviewProps {
  state: AdminState
  onSelectTab: (tabId: string) => void
  onSeedSupabase: () => void
  onOpenNewArticle: () => void
  onOpenNewProject: () => void
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  state,
  onSelectTab,
  onSeedSupabase,
  onOpenNewArticle,
  onOpenNewProject,
}) => {
  const publishedArticles = state.articles.filter((a) => a.status === 'Publié').length
  const totalArticles = state.articles.length
  const activeProjects = state.projects.filter((p) => p.status === 'Actif' || p.status === 'Signature').length
  const newMessages = state.messages.filter((m) => m.status === 'nouveau').length
  const totalMedia = state.media.length
  const totalServices = state.services.length

  const recentMessages = state.messages.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Top Banner & Welcome */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <p className="eyebrow text-gold">Centre de contrôle</p>
          <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">
            Tableau de bord de pilotage
          </h1>
          <p className="mt-2 max-w-2xl text-xs text-ivory/60 sm:text-sm">
            Plateforme éditoriale et commerciale canonique de Hervé Nanfang. Gérez les publications, les projets, les médias et les opportunités d'affaires.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onOpenNewArticle}
            className="btn btn-gold text-xs"
          >
            + Nouvel article
          </button>
          <button
            type="button"
            onClick={onOpenNewProject}
            className="btn btn-ghost text-xs"
          >
            + Nouveau projet
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {/* Articles */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab('articles')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectTab('articles')
          }}
          className="group cursor-pointer border border-white/10 bg-ink-2 p-5 transition-all hover:border-gold/60 hover:bg-ink-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">Journal / Piliers</span>
            <span className="text-xs text-gold">→</span>
          </div>
          <p className="mt-3 font-display text-3xl text-ivory">
            {publishedArticles} <span className="text-base text-ivory/40">/ {totalArticles}</span>
          </p>
          <p className="mt-1 text-xs text-emerald-400">
            {publishedArticles} publiés en ligne
          </p>
        </div>

        {/* Projects */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab('projects')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectTab('projects')
          }}
          className="group cursor-pointer border border-white/10 bg-ink-2 p-5 transition-all hover:border-gold/60 hover:bg-ink-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">Projets & Marques</span>
            <span className="text-xs text-gold">→</span>
          </div>
          <p className="mt-3 font-display text-3xl text-ivory">{state.projects.length}</p>
          <p className="mt-1 text-xs text-gold">
            {activeProjects} actifs & signature
          </p>
        </div>

        {/* Services */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab('services')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectTab('services')
          }}
          className="group cursor-pointer border border-white/10 bg-ink-2 p-5 transition-all hover:border-gold/60 hover:bg-ink-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">Offres & Services</span>
            <span className="text-xs text-gold">→</span>
          </div>
          <p className="mt-3 font-display text-3xl text-ivory">{totalServices}</p>
          <p className="mt-1 text-xs text-ivory/50">
            {state.talks.length} conférences
          </p>
        </div>

        {/* Media */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab('media')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectTab('media')
          }}
          className="group cursor-pointer border border-white/10 bg-ink-2 p-5 transition-all hover:border-gold/60 hover:bg-ink-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">Médiathèque</span>
            <span className="text-xs text-gold">→</span>
          </div>
          <p className="mt-3 font-display text-3xl text-ivory">{totalMedia}</p>
          <p className="mt-1 text-xs text-ivory/50">
            Photos & documents
          </p>
        </div>

        {/* Messages */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => onSelectTab('messages')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') onSelectTab('messages')
          }}
          className={`group cursor-pointer border p-5 transition-all col-span-2 sm:col-span-1 ${
            newMessages > 0
              ? 'border-crimson/50 bg-crimson/10 hover:border-crimson'
              : 'border-white/10 bg-ink-2 hover:border-gold/60 hover:bg-ink-3'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">Messages reçus</span>
            <span className="text-xs text-gold">→</span>
          </div>
          <p className="mt-3 font-display text-3xl text-ivory">{state.messages.length}</p>
          <p className={`mt-1 text-xs ${newMessages > 0 ? 'text-crimson-2 font-bold' : 'text-ivory/50'}`}>
            {newMessages > 0 ? `${newMessages} non traité(s)` : 'Tous traités'}
          </p>
        </div>
      </div>

      {/* Main Split: Site Health & Supabase Sync | Recent Messages */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column: Diagnostics & Actions */}
        <div className="space-y-6">
          <div className="border border-white/10 bg-ink-2 p-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow text-gold">État du système</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">Infrastructure & Données</h2>
              </div>
              <span
                className={`rounded px-2.5 py-1 text-xs font-bold uppercase ${
                  isSupabaseConfigured
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'bg-amber-500/20 text-amber-400'
                }`}
              >
                {isSupabaseConfigured ? 'Supabase Activé' : 'Mode Local Persistant'}
              </span>
            </div>

            <div className="mt-5 space-y-4 text-xs">
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-ivory/65">Base de données PostgreSQL</span>
                <span className="font-semibold text-ivory">
                  {isSupabaseConfigured ? 'Connectée via Supabase RLS' : 'Stockage Local Storage'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-ivory/65">Stockage Médias (Storage Bucket)</span>
                <span className="font-semibold text-ivory">
                  {isSupabaseConfigured ? 'Bucket public-media' : 'Assets intégrés & local'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <span className="text-ivory/65">Protection Route /admin</span>
                <span className="font-semibold text-emerald-400">
                  noindex, nofollow, auth requise
                </span>
              </div>
              <div className="flex items-center justify-between pb-1">
                <span className="text-ivory/65">Indexation sitemap.xml</span>
                <span className="font-semibold text-ivory">
                  {publishedArticles + 14} URL canoniques
                </span>
              </div>
            </div>

            {isSupabaseConfigured && (
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs text-ivory/60">
                  Besoin d'injecter ou rafraîchir toutes les données de référence dans vos tables Supabase ?
                </p>
                <button
                  type="button"
                  onClick={onSeedSupabase}
                  className="mt-3 inline-flex items-center gap-2 border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-ink"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Synchroniser / Seed initial vers Supabase
                </button>
              </div>
            )}
          </div>

          {/* Quick links & Public site shortcuts */}
          <div className="border border-white/10 bg-ink-2 p-6">
            <p className="eyebrow text-ivory/40">Accès directs aux pages publiques</p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
              {[
                { label: 'Accueil', to: '/' },
                { label: 'À propos', to: '/a-propos' },
                { label: 'Musique', to: '/musique' },
                { label: 'IA & Tech', to: '/ia-technologie' },
                { label: 'Pédagogie', to: '/pedagogie' },
                { label: 'Services', to: '/services' },
                { label: 'RMA', to: '/rma' },
                { label: 'Projets', to: '/projets' },
                { label: 'Journal', to: '/journal' },
                { label: 'Conférences', to: '/conferences' },
                { label: 'Contact', to: '/contact' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/10 bg-ink px-3 py-2 text-ivory/70 transition-colors hover:border-gold hover:text-gold"
                >
                  {link.label} ↗
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Messages & Inquiries */}
        <div className="border border-white/10 bg-ink-2 p-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="eyebrow text-gold">Messagerie & Booking</p>
              <h2 className="mt-1 font-display text-2xl text-ivory">Dernières demandes</h2>
            </div>
            <button
              type="button"
              onClick={() => onSelectTab('messages')}
              className="text-xs font-semibold uppercase tracking-wider text-gold hover:underline"
            >
              Voir tout ({state.messages.length}) →
            </button>
          </div>

          <div className="mt-5 space-y-4">
            {recentMessages.length === 0 ? (
              <p className="py-8 text-center text-xs text-ivory/45">
                Aucun message reçu pour le moment.
              </p>
            ) : (
              recentMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`border p-4 transition-colors ${
                    msg.status === 'nouveau'
                      ? 'border-crimson/40 bg-crimson/5'
                      : 'border-white/10 bg-ink/50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-display text-base text-ivory">{msg.name}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${
                        msg.status === 'nouveau'
                          ? 'bg-crimson/20 text-crimson-2'
                          : msg.status === 'en_cours'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-white/10 text-ivory/60'
                      }`}
                    >
                      {msg.route} · {msg.status}
                    </span>
                  </div>

                  {msg.organization && (
                    <p className="mt-1 text-xs text-ivory/60">
                      Structure : {msg.organization}
                    </p>
                  )}

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ivory/75">
                    {msg.body}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-2 text-[0.68rem] text-ivory/45">
                    <span>
                      {new Date(msg.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex items-center gap-3">
                      {msg.phone && (
                        <a
                          href={`https://wa.me/${msg.phone.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-semibold text-gold hover:underline"
                        >
                          WhatsApp ↗
                        </a>
                      )}
                      <a
                        href={`mailto:${msg.email}`}
                        className="font-semibold text-ivory/70 hover:text-ivory"
                      >
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
