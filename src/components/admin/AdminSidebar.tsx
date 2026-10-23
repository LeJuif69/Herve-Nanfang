import React from 'react'

export interface NavTabItem {
  id: string
  label: string
  icon: string
  badge?: number | string
  badgeColor?: 'gold' | 'crimson' | 'emerald'
}

interface AdminSidebarProps {
  activeTab: string
  onSelectTab: (tabId: string) => void
  unreadMessagesCount: number
  publishedArticlesCount: number
  totalArticlesCount: number
  pendingPublicationsCount?: number
  projectsCount: number
  mediaCount: number
  isOpenMobile: boolean
  onCloseMobile: () => void
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  unreadMessagesCount,
  publishedArticlesCount,
  totalArticlesCount,
  pendingPublicationsCount = 0,
  projectsCount,
  mediaCount,
  isOpenMobile,
  onCloseMobile,
}) => {
  const tabs: NavTabItem[] = [
    { id: 'overview', label: 'Tableau de bord', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'calendar', label: 'Calendrier & Réseaux', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z', badge: pendingPublicationsCount > 0 ? `${pendingPublicationsCount} sas` : undefined, badgeColor: 'gold' },
    { id: 'articles', label: 'Articles & Journal', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z', badge: `${publishedArticlesCount}/${totalArticlesCount}`, badgeColor: 'gold' },
    { id: 'projects', label: 'Projets & Marques', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', badge: projectsCount },
    { id: 'services', label: 'Services & Offres', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'music', label: 'Musiques & Pistes', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
    { id: 'media', label: 'Médiathèque', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', badge: mediaCount },
    { id: 'messages', label: 'Messages & Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', badge: unreadMessagesCount > 0 ? `${unreadMessagesCount} nouv.` : undefined, badgeColor: 'crimson' },
    { id: 'settings', label: 'SEO & Réglages', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
  ]

  const handleSelect = (tabId: string) => {
    onSelectTab(tabId)
    onCloseMobile()
  }

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpenMobile && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Fermer le menu"
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
              onCloseMobile()
            }
          }}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-white/10 bg-ink-2 pt-16 transition-transform duration-300 lg:static lg:w-64 lg:pt-0 lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-5 lg:hidden">
          <span className="eyebrow text-gold">Navigation Admin</span>
          <button
            type="button"
            onClick={onCloseMobile}
            className="flex h-8 w-8 items-center justify-center text-ivory/60 hover:text-ivory"
            aria-label="Fermer le panneau latéral"
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" aria-label="Sections d'administration">
          <p className="px-3 pb-2 text-[0.6rem] font-bold uppercase tracking-[0.25em] text-ivory/35">
            Espaces de gestion
          </p>

          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleSelect(tab.id)}
                className={`group flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? 'border-l-2 border-gold bg-gold/10 text-gold'
                    : 'border-l-2 border-transparent text-ivory/70 hover:bg-white/5 hover:text-ivory'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-gold' : 'text-ivory/40 group-hover:text-ivory/70'
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={tab.icon} />
                  </svg>
                  <span>{tab.label}</span>
                </div>

                {tab.badge !== undefined && (
                  <span
                    className={`rounded px-1.5 py-0.5 text-[0.62rem] font-bold ${
                      tab.badgeColor === 'crimson'
                        ? 'bg-crimson/20 text-crimson-2'
                        : tab.badgeColor === 'gold'
                        ? 'bg-gold/20 text-gold'
                        : 'bg-white/10 text-ivory/70'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Footer brand info */}
        <div className="border-t border-white/10 p-4">
          <div className="flex items-center gap-2 text-[0.68rem] text-ivory/45">
            <span className="font-display text-gold">HN</span>
            <span>Édition Plateforme v2.0</span>
          </div>
        </div>
      </aside>
    </>
  )
}
