import React, { useMemo, useState } from 'react'
import type { AdminArticle, AdminMedia, AdminProject, AdminService, AdminSettings, SocialPlatform, SocialPost } from '../../lib/admin-types'
import {
  PLATFORM_CONFIG,
  generateSocialPostFromSource,
  getFacebookShareUrl,
  getLinkedInShareUrl,
  getWhatsAppShareUrl,
} from '../../lib/social-generator'

interface AdminCalendarProps {
  publications: SocialPost[]
  articles: AdminArticle[]
  services: AdminService[]
  projects: AdminProject[]
  media: AdminMedia[]
  settings: AdminSettings
  onSavePublication: (post: SocialPost) => Promise<SocialPost>
  onValidatePublication: (id: string) => Promise<{ success: boolean; triggeredWebhook: boolean; error?: string }>
  onMarkAsPublished: (id: string) => Promise<void>
  onDeletePublication: (id: string) => Promise<void>
  onExportIcs: () => void
  onSaveSettings: (settings: Partial<AdminSettings>) => Promise<void>
  onTestWebhook: (url: string, secret?: string) => Promise<{ success: boolean; status?: number; error?: string }>
  showToast: (msg: string, type?: 'success' | 'error') => void
}

type ViewMode = 'month' | 'week' | 'list'

export const AdminCalendar: React.FC<AdminCalendarProps> = ({
  publications,
  articles,
  services,
  projects,
  media,
  settings,
  onSavePublication,
  onValidatePublication,
  onMarkAsPublished,
  onDeletePublication,
  onExportIcs,
  onSaveSettings,
  onTestWebhook,
  showToast,
}) => {
  // Navigation & Filters
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 23)) // Oct 2026
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false)
  const [activePlatformTab, setActivePlatformTab] = useState<SocialPlatform>('linkedin')

  // Generator form
  const [genSourceType, setGenSourceType] = useState<'article' | 'service' | 'projet'>('article')
  const [genSourceId, setGenSourceId] = useState<string>('')
  const [genDate, setGenDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [genTime, setGenTime] = useState<string>('09:00')

  // Webhook settings modal form
  const [webhookUrl, setWebhookUrl] = useState(settings.webhookUrl || '')
  const [webhookSecret, setWebhookSecret] = useState(settings.webhookSecret || '')
  const [webhookTesting, setWebhookTesting] = useState(false)
  const [webhookTestResult, setWebhookTestResult] = useState<{ success: boolean; message: string } | null>(null)

  // Filtered publications
  const filteredPosts = useMemo(() => {
    return publications.filter((p) => {
      if (platformFilter !== 'all' && !p.platforms.includes(platformFilter as SocialPlatform)) {
        return false
      }
      if (statusFilter !== 'all' && p.status !== statusFilter) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchTitle = p.title.toLowerCase().includes(q)
        const matchSource = (p.sourceTitle || '').toLowerCase().includes(q)
        const matchText = Object.values(p.contentByPlatform).some((c) =>
          c?.text.toLowerCase().includes(q) || c?.hashtags.some((h) => h.toLowerCase().includes(q)),
        )
        if (!matchTitle && !matchSource && !matchText) return false
      }
      return true
    })
  }, [publications, platformFilter, statusFilter, searchQuery])

  // KPIs
  const totalCount = publications.length
  const pendingCount = publications.filter((p) => p.status === 'a_valider').length
  const validatedCount = publications.filter((p) => p.status === 'valide').length
  const publishedCount = publications.filter((p) => p.status === 'publie').length
  const draftCount = publications.filter((p) => p.status === 'brouillon').length

  // Handlers
  const handleValidate = async (id: string) => {
    const res = await onValidatePublication(id)
    if (res.success) {
      if (res.triggeredWebhook) {
        showToast('✓ Publication validée et transmise au Webhook avec succès !')
      } else if (res.error) {
        showToast(`✓ Publication validée (Avertissement Webhook : ${res.error})`, 'error')
      } else {
        showToast('✓ Publication validée et prête pour diffusion.')
      }
      if (editingPost && editingPost.id === id) {
        setEditingPost((prev) => (prev ? { ...prev, status: 'valide' } : null))
      }
    }
  }

  const handleMarkPublished = async (id: string) => {
    await onMarkAsPublished(id)
    showToast('Publication marquée comme publiée.')
    if (editingPost && editingPost.id === id) {
      setEditingPost((prev) => (prev ? { ...prev, status: 'publie' } : null))
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette publication du calendrier ?')) {
      await onDeletePublication(id)
      showToast('Publication retirée du calendrier.')
      if (editingPost?.id === id) setEditingPost(null)
    }
  }

  const handleCopyPlatformText = (post: SocialPost, platform: SocialPlatform) => {
    const content = post.contentByPlatform[platform]
    if (!content || !content.text) {
      showToast('Aucun texte défini pour cette plateforme.', 'error')
      return
    }
    const fullText = content.hashtags && content.hashtags.length > 0
      ? `${content.text}\n\n${content.hashtags.join(' ')}`
      : content.text

    navigator.clipboard.writeText(fullText)
    showToast(`✓ Texte ${PLATFORM_CONFIG[platform].name} copié dans le presse-papier !`)
  }

  const handleGenerate = () => {
    let sourceData: any = null
    if (genSourceType === 'article') {
      const art = articles.find((a) => a.id === genSourceId || a.slug === genSourceId) || articles[0]
      if (art) {
        sourceData = {
          title: art.title,
          slug: art.slug,
          excerpt: art.excerpt,
          coverImage: art.coverImage,
          url: `/journal/${art.slug}`,
          points: art.outline,
        }
      }
    } else if (genSourceType === 'service') {
      const srv = services.find((s) => s.id === genSourceId) || services[0]
      if (srv) {
        sourceData = {
          title: srv.title,
          description: srv.text,
          coverImage: srv.coverImage,
          url: srv.to,
          points: srv.tags,
        }
      }
    } else if (genSourceType === 'projet') {
      const prj = projects.find((p) => p.id === genSourceId || p.slug === genSourceId) || projects[0]
      if (prj) {
        sourceData = {
          title: prj.title,
          slug: prj.slug,
          description: prj.description,
          coverImage: prj.coverImage,
          url: prj.to || '/projets',
          points: prj.points,
        }
      }
    }

    if (!sourceData) {
      showToast('Sélectionnez un contenu valide.', 'error')
      return
    }

    const newPost = generateSocialPostFromSource(genSourceType, sourceData, genDate, genTime)
    onSavePublication(newPost)
    setIsGeneratorOpen(false)
    setEditingPost(newPost)
    showToast(`✓ Publication générée pour « ${sourceData.title} ». Prête pour relecture !`)
  }

  const handleCreateEmptyPost = (dateStr?: string) => {
    const today = dateStr || new Date().toISOString().slice(0, 10)
    const newPost: SocialPost = {
      id: `pub-${Date.now()}`,
      title: 'Nouvelle publication',
      sourceType: 'libre',
      scheduledDate: today,
      scheduledTime: '10:00',
      status: 'brouillon',
      platforms: ['linkedin', 'facebook', 'whatsapp'],
      contentByPlatform: {
        linkedin: { text: '', hashtags: ['#HerveNanfang'] },
        facebook: { text: '', hashtags: ['#HerveNanfang'] },
        whatsapp: { text: '', hashtags: [] },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingPost(newPost)
  }

  // Calendar month math
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // French week starts on Monday (1 = Monday, 0 = Sunday)
  let startingDay = firstDayOfMonth.getDay() - 1
  if (startingDay === -1) startingDay = 6

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = []

    // Previous month filler days
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i
      const prevMonth = month === 0 ? 12 : month
      const prevYear = month === 0 ? year - 1 : year
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ dateStr, dayNum: d, isCurrentMonth: false })
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ dateStr, dayNum: i, isCurrentMonth: true })
    }

    // Next month filler days to complete rows of 7
    const remaining = 7 - (days.length % 7)
    if (remaining < 7) {
      for (let i = 1; i <= remaining; i++) {
        const nextMonth = month === 11 ? 1 : month + 2
        const nextYear = month === 11 ? year + 1 : year
        const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        days.push({ dateStr, dayNum: i, isCurrentMonth: false })
      }
    }

    return days
  }, [year, month, daysInMonth, startingDay])

  return (
    <div className="space-y-8">
      {/* Top Banner & Title */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 md:flex-row md:items-center md:p-8">
        <div>
          <div className="flex items-center gap-3">
            <span className="eyebrow text-gold">Stratégie Organique & Réseaux Sociaux</span>
            <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.62rem] font-bold text-emerald-400 border border-emerald-500/30">
              0 F CFA de Budget Publicitaire
            </span>
          </div>
          <h1 className="mt-2 font-display text-3xl text-ivory md:text-4xl">
            Calendrier de Publication & Validation Multiplateformes
          </h1>
          <p className="mt-2 max-w-3xl text-xs text-ivory/60 sm:text-sm">
            Générez des contenus percutants depuis le site (articles, offres, projets, citations). Validez chaque format (LinkedIn, Facebook, WhatsApp, Instagram) avant diffusion automatique via Webhook ou partage direct en 1 clic.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => {
              if (articles.length > 0) setGenSourceId(articles[0].id)
              setIsGeneratorOpen(true)
            }}
            className="btn btn-gold text-xs shadow-lg shadow-gold/10"
          >
            ⚡ Générer depuis le site
          </button>
          <button
            type="button"
            onClick={() => handleCreateEmptyPost()}
            className="btn btn-ghost text-xs"
          >
            + Post personnalisé
          </button>
          <button
            type="button"
            onClick={onExportIcs}
            className="border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-ivory/80 transition-all hover:border-gold hover:text-gold"
            title="Télécharger le fichier .ics pour Google Calendar, Apple Calendar ou Outlook"
          >
            📅 Exporter iCal (.ics)
          </button>
          <button
            type="button"
            onClick={() => setIsWebhookModalOpen(true)}
            className="border border-white/15 bg-white/5 px-3 py-2 text-xs font-semibold text-ivory/80 transition-all hover:border-gold hover:text-gold"
            title="Configurer l'automatisation Webhook (Make, Zapier, n8n)"
          >
            ⚙️ Webhook
          </button>
        </div>
      </div>

      {/* KPI Pipeline Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('all')}
          className={`cursor-pointer border p-4 transition-all ${
            statusFilter === 'all'
              ? 'border-gold bg-gold/10 shadow-lg shadow-gold/5'
              : 'border-white/10 bg-ink-2 hover:border-white/20'
          }`}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">Total Planifiés</p>
          <p className="mt-2 font-display text-2xl text-ivory">{totalCount}</p>
          <p className="mt-1 text-[0.68rem] text-ivory/40">Sur 4 semaines</p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('a_valider')}
          className={`cursor-pointer border p-4 transition-all ${
            statusFilter === 'a_valider'
              ? 'border-amber-400 bg-amber-500/10 shadow-lg shadow-amber-500/5'
              : 'border-white/10 bg-ink-2 hover:border-amber-400/50'
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider text-amber-400">À Valider (Sas)</p>
            {pendingCount > 0 && <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />}
          </div>
          <p className="mt-2 font-display text-2xl text-amber-400">{pendingCount}</p>
          <p className="mt-1 text-[0.68rem] text-amber-400/80">Relecture humaine requise</p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('valide')}
          className={`cursor-pointer border p-4 transition-all ${
            statusFilter === 'valide'
              ? 'border-emerald-400 bg-emerald-500/10 shadow-lg shadow-emerald-500/5'
              : 'border-white/10 bg-ink-2 hover:border-emerald-400/50'
          }`}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-400">Validés / Prêts</p>
          <p className="mt-2 font-display text-2xl text-emerald-400">{validatedCount}</p>
          <p className="mt-1 text-[0.68rem] text-emerald-400/80">Prêts pour diffusion</p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('publie')}
          className={`cursor-pointer border p-4 transition-all ${
            statusFilter === 'publie'
              ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/5'
              : 'border-white/10 bg-ink-2 hover:border-blue-400/50'
          }`}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-blue-400">Déjà Publiés</p>
          <p className="mt-2 font-display text-2xl text-blue-400">{publishedCount}</p>
          <p className="mt-1 text-[0.68rem] text-blue-400/80">Diffusés sur réseaux</p>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={() => setStatusFilter('brouillon')}
          className={`cursor-pointer border p-4 transition-all ${
            statusFilter === 'brouillon'
              ? 'border-white/40 bg-white/10'
              : 'border-white/10 bg-ink-2 hover:border-white/20'
          }`}
        >
          <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">Brouillons</p>
          <p className="mt-2 font-display text-2xl text-ivory/70">{draftCount}</p>
          <p className="mt-1 text-[0.68rem] text-ivory/40">En cours d'écriture</p>
        </div>
      </div>

      {/* Control Bar: View Switcher & Filters */}
      <div className="flex flex-col gap-4 border border-white/10 bg-ink-2 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: View Switcher */}
        <div className="flex items-center gap-1 border border-white/10 bg-ink p-1">
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'month' ? 'bg-gold text-ink' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            Vue Mois
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-gold text-ink' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            Vue Pipeline & Liste ({filteredPosts.length})
          </button>
        </div>

        {/* Center: Search & Platform filter */}
        <div className="flex flex-1 flex-wrap items-center gap-2 lg:max-w-xl">
          <div className="relative flex-1 min-w-[200px]">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par mot-clé, hashtag, titre..."
              className="w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory placeholder-ivory/30 focus:border-gold focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-ivory/40 hover:text-ivory"
              >
                ✕
              </button>
            )}
          </div>

          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="border border-white/10 bg-ink px-2.5 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
            aria-label="Filtrer par plateforme"
          >
            <option value="all">Toutes plateformes</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="instagram">Instagram</option>
            <option value="youtube">YouTube</option>
            <option value="site">Site Web</option>
          </select>
        </div>

        {/* Right: Month Navigation (when in month view) */}
        {viewMode === 'month' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="flex h-8 w-8 items-center justify-center border border-white/10 bg-ink text-xs text-ivory/70 hover:border-gold hover:text-gold"
              aria-label="Mois précédent"
            >
              ←
            </button>
            <span className="min-w-[130px] text-center font-display text-sm uppercase tracking-wider text-ivory capitalize">
              {monthName}
            </span>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="flex h-8 w-8 items-center justify-center border border-white/10 bg-ink text-xs text-ivory/70 hover:border-gold hover:text-gold"
              aria-label="Mois suivant"
            >
              →
            </button>
            <button
              type="button"
              onClick={() => setCurrentDate(new Date())}
              className="border border-white/10 bg-ink px-2 py-1 text-[0.68rem] font-bold text-ivory/60 hover:text-gold"
            >
              Aujourd'hui
            </button>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* VUE 1 : CALENDRIER MENSUEL                                     */}
      {/* ============================================================== */}
      {viewMode === 'month' && (
        <div className="border border-white/10 bg-ink-2 overflow-hidden shadow-2xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-white/10 bg-ink text-center text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="py-2.5">
                {d}
              </div>
            ))}
          </div>

          {/* Month Cells Grid */}
          <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-white/5">
            {calendarDays.map((cell, idx) => {
              const dayPosts = filteredPosts.filter((p) => p.scheduledDate === cell.dateStr)
              const isToday = cell.dateStr === new Date().toISOString().slice(0, 10)

              return (
                <div
                  key={`${cell.dateStr}-${idx}`}
                  className={`group relative min-h-[125px] p-2 transition-colors ${
                    !cell.isCurrentMonth
                      ? 'bg-black/40 opacity-35'
                      : isToday
                      ? 'bg-gold/5'
                      : 'bg-ink-2 hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Day header & quick add */}
                  <div className="flex items-center justify-between">
                    <span
                      className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${
                        isToday ? 'bg-gold text-ink font-bold' : 'text-ivory/60'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleCreateEmptyPost(cell.dateStr)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-[0.65rem] text-gold hover:underline"
                      title="Ajouter une publication ce jour"
                    >
                      +
                    </button>
                  </div>

                  {/* Day Posts List */}
                  <div className="mt-1.5 space-y-1.5">
                    {dayPosts.map((post) => {
                      const isPending = post.status === 'a_valider'
                      const isValidated = post.status === 'valide'
                      const isPublished = post.status === 'publie'

                      return (
                        <div
                          key={post.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => setEditingPost(post)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setEditingPost(post)
                          }}
                          className={`cursor-pointer rounded border p-1.5 text-left text-xs transition-all shadow-sm ${
                            isPending
                              ? 'border-amber-400/50 bg-amber-500/10 hover:border-amber-400 hover:bg-amber-500/20'
                              : isValidated
                              ? 'border-emerald-400/50 bg-emerald-500/10 hover:border-emerald-400 hover:bg-emerald-500/20'
                              : isPublished
                              ? 'border-blue-400/40 bg-blue-500/10 opacity-75 hover:opacity-100'
                              : 'border-white/10 bg-ink hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[0.62rem] font-bold text-ivory/50">
                              {post.scheduledTime || '09:00'}
                            </span>
                            <span
                              className={`rounded px-1 py-0.2 text-[0.58rem] font-bold uppercase tracking-wider ${
                                isPending
                                  ? 'bg-amber-400/20 text-amber-300'
                                  : isValidated
                                  ? 'bg-emerald-400/20 text-emerald-300'
                                  : isPublished
                                  ? 'bg-blue-400/20 text-blue-300'
                                  : 'bg-white/10 text-ivory/60'
                              }`}
                            >
                              {isPending ? 'À valider' : isValidated ? 'Prêt' : isPublished ? 'Publié' : 'Brouillon'}
                            </span>
                          </div>

                          <p className="mt-1 line-clamp-2 text-[0.68rem] font-medium leading-tight text-ivory">
                            {post.title}
                          </p>

                          {/* Mini Platform Badges */}
                          <div className="mt-1.5 flex flex-wrap items-center gap-1">
                            {post.platforms.map((plat) => {
                              const cfg = PLATFORM_CONFIG[plat]
                              if (!cfg) return null
                              return (
                                <span
                                  key={plat}
                                  className={`rounded px-1 text-[0.55rem] font-semibold ${cfg.badgeClass}`}
                                >
                                  {cfg.name.slice(0, 2)}
                                </span>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VUE 2 : LISTE & PIPELINE DE VALIDATION                         */}
      {/* ============================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Section 1 : En attente de validation humaine (Sas prioritaire) */}
          <div className="border border-amber-400/40 bg-ink-2 p-5">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="font-display text-lg text-amber-300">
                  Sas de validation humaine ({pendingCount} en attente)
                </h2>
              </div>
              <p className="text-xs text-amber-200/60 hidden sm:block">
                Ces contenus sont rédigés et programmés : relisez puis cliquez sur « Valider » pour autoriser la diffusion.
              </p>
            </div>

            <div className="mt-4 divide-y divide-white/5">
              {filteredPosts
                .filter((p) => p.status === 'a_valider')
                .map((post) => (
                  <div key={post.id} className="py-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300 border border-amber-400/30">
                          📅 {post.scheduledDate} à {post.scheduledTime || '09:00'}
                        </span>
                        {post.sourceType && (
                          <span className="text-[0.68rem] text-ivory/50 uppercase tracking-wider font-semibold">
                            Source : {post.sourceType} {post.sourceTitle ? `(« ${post.sourceTitle} »)` : ''}
                          </span>
                        )}
                      </div>

                      <h3 className="font-display text-base text-ivory hover:text-gold cursor-pointer" onClick={() => setEditingPost(post)}>
                        {post.title}
                      </h3>

                      <p className="line-clamp-2 text-xs text-ivory/70">
                        {post.contentByPlatform.linkedin?.text ||
                          post.contentByPlatform.facebook?.text ||
                          post.contentByPlatform.whatsapp?.text}
                      </p>

                      {/* Targeted platforms tags */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {post.platforms.map((plat) => {
                          const cfg = PLATFORM_CONFIG[plat]
                          return (
                            <span key={plat} className={`rounded px-1.5 py-0.5 text-[0.62rem] font-semibold ${cfg.badgeClass}`}>
                              {cfg.name}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* Quick actions for pending posts */}
                    <div className="flex flex-wrap items-center gap-2 self-start pt-1">
                      <button
                        type="button"
                        onClick={() => handleValidate(post.id)}
                        className="rounded border border-emerald-400 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-all hover:bg-emerald-500/30"
                      >
                        ✓ Valider pour diffusion
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPost(post)}
                        className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-ivory/80 hover:border-gold hover:text-gold"
                      >
                        ✏️ Relire & Éditer
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(post.id)}
                        className="rounded border border-white/10 px-2 py-1.5 text-xs text-ivory/40 hover:text-crimson hover:border-crimson"
                        title="Supprimer"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}

              {filteredPosts.filter((p) => p.status === 'a_valider').length === 0 && (
                <div className="py-8 text-center text-xs text-ivory/40">
                  Aucune publication en attente de validation. Tout le pipeline est à jour !
                </div>
              )}
            </div>
          </div>

          {/* Section 2 : Validés / Prêts à diffuser */}
          <div className="border border-white/10 bg-ink-2 p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h2 className="font-display text-lg text-emerald-400">
                Publications validées & Prêtes pour diffusion ({validatedCount})
              </h2>
              <span className="text-xs text-ivory/50">
                Prêtes pour Webhook automatique ou diffusion manuelle 1-click
              </span>
            </div>

            <div className="mt-4 divide-y divide-white/5">
              {filteredPosts
                .filter((p) => p.status === 'valide')
                .map((post) => (
                  <div key={post.id} className="py-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300 border border-emerald-500/30">
                          📅 Prêt pour le {post.scheduledDate} à {post.scheduledTime || '09:00'}
                        </span>
                        <span className="text-[0.62rem] text-ivory/40">
                          Validé le {new Date(post.validatedAt || post.updatedAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      <h3 className="font-display text-base text-ivory cursor-pointer hover:text-gold" onClick={() => setEditingPost(post)}>
                        {post.title}
                      </h3>

                      <p className="line-clamp-2 text-xs text-ivory/70">
                        {post.contentByPlatform.linkedin?.text || post.contentByPlatform.facebook?.text}
                      </p>

                      {/* 1-Click Share & Copy Shortcuts */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-[0.65rem] uppercase font-bold text-ivory/40 tracking-wider">Partage direct :</span>
                        {post.platforms.includes('linkedin') && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCopyPlatformText(post, 'linkedin')
                              window.open(getLinkedInShareUrl(post.linkUrl || 'https://herve-nanfang.com'), '_blank')
                            }}
                            className="rounded border border-[#0A66C2]/40 bg-[#0A66C2]/15 px-2 py-1 text-[0.68rem] font-semibold text-[#60a5fa] hover:bg-[#0A66C2]/30"
                          >
                            LinkedIn ↗
                          </button>
                        )}
                        {post.platforms.includes('facebook') && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCopyPlatformText(post, 'facebook')
                              window.open(getFacebookShareUrl(post.linkUrl || 'https://herve-nanfang.com'), '_blank')
                            }}
                            className="rounded border border-[#1877F2]/40 bg-[#1877F2]/15 px-2 py-1 text-[0.68rem] font-semibold text-[#93c5fd] hover:bg-[#1877F2]/30"
                          >
                            Facebook ↗
                          </button>
                        )}
                        {post.platforms.includes('whatsapp') && (
                          <button
                            type="button"
                            onClick={() => {
                              const txt = post.contentByPlatform.whatsapp?.text || post.title
                              window.open(getWhatsAppShareUrl(txt), '_blank')
                            }}
                            className="rounded border border-[#25D366]/40 bg-[#25D366]/15 px-2 py-1 text-[0.68rem] font-semibold text-[#86efac] hover:bg-[#25D366]/30"
                          >
                            WhatsApp ↗
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start pt-1">
                      <button
                        type="button"
                        onClick={() => handleMarkPublished(post.id)}
                        className="rounded border border-blue-400 bg-blue-500/20 px-3 py-1.5 text-xs font-bold text-blue-300 hover:bg-blue-500/30"
                      >
                        Marquer comme publié ✓
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingPost(post)}
                        className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-ivory/80 hover:border-gold"
                      >
                        Détails
                      </button>
                    </div>
                  </div>
                ))}

              {filteredPosts.filter((p) => p.status === 'valide').length === 0 && (
                <div className="py-6 text-center text-xs text-ivory/40">
                  Aucune publication validée en attente de mise en ligne.
                </div>
              )}
            </div>
          </div>

          {/* Section 3 : Historique des publications diffusées */}
          <div className="border border-white/10 bg-ink-2 p-5">
            <h2 className="font-display text-lg text-blue-400 border-b border-white/10 pb-3">
              Historique des publications déjà diffusées ({publishedCount})
            </h2>

            <div className="mt-4 divide-y divide-white/5">
              {filteredPosts
                .filter((p) => p.status === 'publie')
                .map((post) => (
                  <div key={post.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[0.65rem] text-ivory/40">
                          Diffusé le {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('fr-FR') : post.scheduledDate}
                        </span>
                        <span className="text-xs font-semibold text-ivory">{post.title}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEditingPost(post)}
                      className="text-xs text-gold hover:underline"
                    >
                      Consulter
                    </button>
                  </div>
                ))}

              {filteredPosts.filter((p) => p.status === 'publie').length === 0 && (
                <div className="py-4 text-center text-xs text-ivory/40">
                  Aucun historique de publication diffusée pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : ÉDITION & VALIDATION D'UNE PUBLICATION                 */}
      {/* ============================================================== */}
      {editingPost && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md overflow-y-auto"
        >
          <div className="relative my-8 w-full max-w-4xl border border-white/15 bg-ink p-6 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
                      editingPost.status === 'a_valider'
                        ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                        : editingPost.status === 'valide'
                        ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/40'
                        : editingPost.status === 'publie'
                        ? 'bg-blue-400/20 text-blue-300 border border-blue-400/40'
                        : 'bg-white/10 text-ivory/60'
                    }`}
                  >
                    Statut : {editingPost.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-ivory/40">
                    Source : {editingPost.sourceType} {editingPost.sourceTitle ? `· « ${editingPost.sourceTitle} »` : ''}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl text-ivory">
                  {editingPost.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="flex h-8 w-8 items-center justify-center text-ivory/50 hover:text-ivory"
                aria-label="Fermer la modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-6">
              {/* Timing & Target Settings */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 border border-white/10 bg-ink-2 p-4">
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Date de diffusion
                  </label>
                  <input
                    type="date"
                    value={editingPost.scheduledDate}
                    onChange={(e) => setEditingPost({ ...editingPost, scheduledDate: e.target.value })}
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Heure optimale
                  </label>
                  <input
                    type="time"
                    value={editingPost.scheduledTime || '09:00'}
                    onChange={(e) => setEditingPost({ ...editingPost, scheduledTime: e.target.value })}
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Visuel / Média associé
                  </label>
                  <select
                    value={editingPost.mediaUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, mediaUrl: e.target.value })}
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  >
                    <option value="">Aucun média</option>
                    {media.map((m) => (
                      <option key={m.id} value={m.url}>
                        {m.caption || m.title || m.filename}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Lien canonique de renvoi
                  </label>
                  <input
                    type="text"
                    value={editingPost.linkUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, linkUrl: e.target.value })}
                    placeholder="https://herve-nanfang.com/..."
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Target Platforms Checkboxes */}
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-2">
                  Canaux de distribution activés
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['linkedin', 'facebook', 'whatsapp', 'instagram', 'youtube'] as SocialPlatform[]).map((plat) => {
                    const cfg = PLATFORM_CONFIG[plat]
                    const isActive = editingPost.platforms.includes(plat)
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => {
                          const nextPlats = isActive
                            ? editingPost.platforms.filter((p) => p !== plat)
                            : [...editingPost.platforms, plat]
                          setEditingPost({ ...editingPost, platforms: nextPlats })
                        }}
                        className={`rounded px-3 py-1.5 text-xs font-semibold transition-all border ${
                          isActive
                            ? `${cfg.badgeClass} ring-1 ring-gold/40`
                            : 'border-white/10 bg-ink-2 text-ivory/40 opacity-60'
                        }`}
                      >
                        {isActive ? '✓ ' : '+ '} {cfg.name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Platform Preview / Editor Tabs */}
              <div className="border border-white/10 bg-ink-2">
                {/* Platform Switcher Tabs */}
                <div className="flex border-b border-white/10 bg-ink overflow-x-auto">
                  {editingPost.platforms.map((plat) => {
                    const cfg = PLATFORM_CONFIG[plat]
                    const isTabActive = activePlatformTab === plat
                    return (
                      <button
                        key={plat}
                        type="button"
                        onClick={() => setActivePlatformTab(plat)}
                        className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                          isTabActive
                            ? 'border-gold text-gold bg-gold/5'
                            : 'border-transparent text-ivory/60 hover:text-ivory'
                        }`}
                      >
                        {cfg.name}
                      </button>
                    )
                  })}
                </div>

                {/* Platform Content Editor */}
                <div className="p-5 space-y-4">
                  {(() => {
                    const currentPlatformContent = editingPost.contentByPlatform[activePlatformTab] || {
                      text: '',
                      hashtags: [],
                    }
                    const cfg = PLATFORM_CONFIG[activePlatformTab]
                    const charCount = (currentPlatformContent.text || '').length
                    const isOverLimit = charCount > cfg.maxChars

                    return (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ivory/80">
                            Format spécifique pour {cfg.name}
                          </span>
                          <span className={`text-[0.68rem] font-bold ${isOverLimit ? 'text-crimson' : 'text-ivory/50'}`}>
                            {charCount} / {cfg.maxChars} caractères
                          </span>
                        </div>

                        <div>
                          <textarea
                            rows={8}
                            value={currentPlatformContent.text}
                            onChange={(e) => {
                              const updated = {
                                ...editingPost.contentByPlatform,
                                [activePlatformTab]: {
                                  ...currentPlatformContent,
                                  text: e.target.value,
                                  charCount: e.target.value.length,
                                },
                              }
                              setEditingPost({ ...editingPost, contentByPlatform: updated })
                            }}
                            placeholder={`Rédigez le texte calibré pour ${cfg.name}...`}
                            className="w-full border border-white/10 bg-ink p-3 font-sans text-xs text-ivory leading-relaxed focus:border-gold focus:outline-none"
                          />
                        </div>

                        {/* Hashtags editor */}
                        <div>
                          <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                            Hashtags recommandés
                          </label>
                          <input
                            type="text"
                            value={(currentPlatformContent.hashtags || []).join(' ')}
                            onChange={(e) => {
                              const tags = e.target.value
                                .split(' ')
                                .map((t) => t.trim())
                                .filter(Boolean)
                              const updated = {
                                ...editingPost.contentByPlatform,
                                [activePlatformTab]: {
                                  ...currentPlatformContent,
                                  hashtags: tags,
                                },
                              }
                              setEditingPost({ ...editingPost, contentByPlatform: updated })
                            }}
                            placeholder="#Musique #StrategieDeMarque #HerveNanfang"
                            className="w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-gold focus:border-gold focus:outline-none font-mono"
                          />
                        </div>

                        {/* Direct Share / Copy Action Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                          <button
                            type="button"
                            onClick={() => handleCopyPlatformText(editingPost, activePlatformTab)}
                            className="btn btn-ghost text-xs"
                          >
                            📋 Copier le texte {cfg.name}
                          </button>

                          <div className="flex items-center gap-2">
                            {activePlatformTab === 'linkedin' && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleCopyPlatformText(editingPost, 'linkedin')
                                  window.open(getLinkedInShareUrl(editingPost.linkUrl || 'https://herve-nanfang.com'), '_blank')
                                }}
                                className="rounded border border-[#0A66C2]/40 bg-[#0A66C2]/20 px-3 py-1.5 text-xs font-semibold text-[#60a5fa] hover:bg-[#0A66C2]/30"
                              >
                                Ouvrir LinkedIn ↗
                              </button>
                            )}

                            {activePlatformTab === 'facebook' && (
                              <button
                                type="button"
                                onClick={() => {
                                  handleCopyPlatformText(editingPost, 'facebook')
                                  window.open(getFacebookShareUrl(editingPost.linkUrl || 'https://herve-nanfang.com'), '_blank')
                                }}
                                className="rounded border border-[#1877F2]/40 bg-[#1877F2]/20 px-3 py-1.5 text-xs font-semibold text-[#93c5fd] hover:bg-[#1877F2]/30"
                              >
                                Ouvrir Facebook ↗
                              </button>
                            )}

                            {activePlatformTab === 'whatsapp' && (
                              <button
                                type="button"
                                onClick={() => {
                                  const txt = currentPlatformContent.text || editingPost.title
                                  window.open(getWhatsAppShareUrl(txt), '_blank')
                                }}
                                className="rounded border border-[#25D366]/40 bg-[#25D366]/20 px-3 py-1.5 text-xs font-semibold text-[#86efac] hover:bg-[#25D366]/30"
                              >
                                Envoyer sur WhatsApp ↗
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => handleDelete(editingPost.id)}
                className="text-xs text-crimson hover:underline"
              >
                Supprimer cette publication
              </button>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    await onSavePublication(editingPost)
                    showToast('Publication enregistrée.')
                    setEditingPost(null)
                  }}
                  className="btn btn-ghost text-xs"
                >
                  Enregistrer les modifications
                </button>

                {editingPost.status !== 'valide' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onSavePublication(editingPost)
                      await handleValidate(editingPost.id)
                      setEditingPost(null)
                    }}
                    className="btn btn-gold text-xs shadow-lg shadow-gold/15"
                  >
                    ✓ Valider pour diffusion
                  </button>
                )}

                {editingPost.status === 'valide' && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onSavePublication(editingPost)
                      await handleMarkPublished(editingPost.id)
                      setEditingPost(null)
                    }}
                    className="rounded border border-blue-400 bg-blue-500/20 px-4 py-2 text-xs font-bold text-blue-300 hover:bg-blue-500/30"
                  >
                    Marquer comme publié ✓
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : GÉNÉRATEUR AUTOMATIQUE DEPUIS LE SITE                 */}
      {/* ============================================================== */}
      {isGeneratorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-xl border border-white/15 bg-ink p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="eyebrow text-gold">Moteur de repurposing</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">Générer un post depuis le site</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="text-ivory/40 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                  1. Type de contenu source
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'article', label: 'Article du Journal' },
                    { id: 'service', label: 'Offre / Service' },
                    { id: 'projet', label: 'Projet Signature' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setGenSourceType(t.id as any)
                        if (t.id === 'article' && articles.length > 0) setGenSourceId(articles[0].id)
                        if (t.id === 'service' && services.length > 0) setGenSourceId(services[0].id)
                        if (t.id === 'projet' && projects.length > 0) setGenSourceId(projects[0].id)
                      }}
                      className={`border p-2.5 text-center text-xs font-semibold transition-all ${
                        genSourceType === t.id
                          ? 'border-gold bg-gold/15 text-gold'
                          : 'border-white/10 bg-ink-2 text-ivory/60 hover:text-ivory'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                  2. Sélectionner l'élément source
                </label>
                <select
                  value={genSourceId}
                  onChange={(e) => setGenSourceId(e.target.value)}
                  className="w-full border border-white/10 bg-ink-2 p-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                >
                  {genSourceType === 'article' &&
                    articles.map((a) => (
                      <option key={a.id} value={a.id}>
                        Pilier {a.num} · {a.title}
                      </option>
                    ))}
                  {genSourceType === 'service' &&
                    services.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  {genSourceType === 'projet' &&
                    projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title}
                      </option>
                    ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                    Date prévue
                  </label>
                  <input
                    type="date"
                    value={genDate}
                    onChange={(e) => setGenDate(e.target.value)}
                    className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                    Heure prévue
                  </label>
                  <input
                    type="time"
                    value={genTime}
                    onChange={(e) => setGenTime(e.target.value)}
                    className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="border border-gold/20 bg-gold/5 p-3 text-xs text-ivory/70">
                💡 <span className="font-semibold text-gold">Automatisme :</span> Le moteur rédigera automatiquement 4 variantes sur mesure (LinkedIn autorité, Facebook communauté, WhatsApp broadcast, Instagram punchlines). Le post sera généré en statut <strong className="text-amber-300">« À valider »</strong> pour que vous puissiez le relire avant diffusion.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={() => setIsGeneratorOpen(false)}
                className="btn btn-ghost text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="btn btn-gold text-xs shadow-lg shadow-gold/20"
              >
                Générer les 4 formats ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : WEBHOOK & AUTOMATISATION                               */}
      {/* ============================================================== */}
      {isWebhookModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-xl border border-white/15 bg-ink p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="eyebrow text-gold">Automatisation & Syndication</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">Configuration du Webhook</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsWebhookModalOpen(false)}
                className="text-ivory/40 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <p className="text-xs text-ivory/70">
                Dès que vous validez une publication dans le calendrier, un payload JSON contenant tous les textes, visuels et hashtags est expédié automatiquement vers votre scénario d'automatisation (Make.com, Zapier, n8n ou Blotato) pour programmation directe sur vos comptes sociaux.
              </p>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                  URL du Webhook de réception (Make / Zapier / n8n)
                </label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://hook.eu1.make.com/xxxxxx ou https://n8n.votredomaine.com/..."
                  className="w-full border border-white/10 bg-ink-2 p-2.5 text-xs text-ivory focus:border-gold focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                  Clé secrète / Header d'authentification (Optionnel)
                </label>
                <input
                  type="password"
                  value={webhookSecret}
                  onChange={(e) => setWebhookSecret(e.target.value)}
                  placeholder="X-HN-Webhook-Secret..."
                  className="w-full border border-white/10 bg-ink-2 p-2.5 text-xs text-ivory focus:border-gold focus:outline-none font-mono"
                />
              </div>

              {webhookTestResult && (
                <div
                  className={`border p-3 text-xs font-medium ${
                    webhookTestResult.success
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-crimson/40 bg-crimson/10 text-crimson-2'
                  }`}
                >
                  {webhookTestResult.message}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <button
                  type="button"
                  disabled={webhookTesting || !webhookUrl}
                  onClick={async () => {
                    setWebhookTesting(true)
                    setWebhookTestResult(null)
                    try {
                      const res = await onTestWebhook(webhookUrl, webhookSecret)
                      if (res.success) {
                        setWebhookTestResult({
                          success: true,
                          message: `✓ Ping de test envoyé avec succès (Code HTTP ${res.status || 200}). Votre Webhook fonctionne parfaitement !`,
                        })
                      } else {
                        setWebhookTestResult({
                          success: false,
                          message: `✕ Erreur lors de l'appel au Webhook : ${res.error || 'Vérifiez l’URL et les autorisations CORS.'}`,
                        })
                      }
                    } finally {
                      setWebhookTesting(false)
                    }
                  }}
                  className="border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-semibold text-ivory/80 hover:border-gold hover:text-gold disabled:opacity-40"
                >
                  {webhookTesting ? 'Envoi en cours…' : '🧪 Tester le Webhook'}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWebhookModalOpen(false)}
                    className="btn btn-ghost text-xs"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await onSaveSettings({
                        webhookUrl: webhookUrl.trim(),
                        webhookSecret: webhookSecret.trim(),
                      })
                      showToast('Paramètres Webhook enregistrés.')
                      setIsWebhookModalOpen(false)
                    }}
                    className="btn btn-gold text-xs"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
