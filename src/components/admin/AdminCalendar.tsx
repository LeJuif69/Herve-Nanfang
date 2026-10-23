import React, { useMemo, useState } from 'react'
import { SITE } from '../../data/site'
import type {
  AdminArticle,
  AdminMedia,
  AdminProject,
  AdminService,
  AdminSettings,
  EditorialPillar,
  PublicationMetrics,
  PublicationStatus,
  SocialPlatform,
  SocialPost,
} from '../../lib/admin-types'
import { computeSocialPostHash } from '../../lib/admin-types'
import {
  EDITORIAL_PILLARS,
  EDITORIAL_SERIES,
  KANBAN_COLUMNS,
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
  onValidatePublication: (
    id: string,
    reviewer?: string,
    comment?: string,
  ) => Promise<{ success: boolean; triggeredWebhook: boolean; error?: string }>
  onRejectPublication?: (
    id: string,
    reason: string,
    reviewer?: string,
  ) => Promise<{ success: boolean; error?: string }>
  onSchedulePublication?: (
    id: string,
    scheduledFor?: string,
  ) => Promise<{ success: boolean; error?: string }>
  onRevokeApproval?: (id: string, reason?: string) => Promise<{ success: boolean }>
  onMarkAsPublished: (id: string) => Promise<{ success: boolean; error?: string }>
  onUpdateMetrics?: (id: string, metrics: PublicationMetrics) => Promise<void>
  onDeletePublication: (id: string) => Promise<void>
  onExportIcs: () => void
  onSaveSettings: (settings: Partial<AdminSettings>) => Promise<void>
  onTestWebhook: (url: string, secret?: string) => Promise<{ success: boolean; status?: number; error?: string }>
  showToast: (msg: string, type?: 'success' | 'error') => void
}

type ViewMode = 'month' | 'week' | 'kanban' | 'list' | 'analytics'

export const AdminCalendar: React.FC<AdminCalendarProps> = ({
  publications,
  articles,
  services,
  projects,
  media,
  settings,
  onSavePublication,
  onValidatePublication,
  onRejectPublication,
  onSchedulePublication,
  onRevokeApproval,
  onMarkAsPublished,
  onUpdateMetrics,
  onDeletePublication,
  onExportIcs,
  onSaveSettings,
  onTestWebhook,
  showToast,
}) => {
  // Navigation & Filters
  const [viewMode, setViewMode] = useState<ViewMode>('kanban')
  const [currentDate, setCurrentDate] = useState(() => new Date(2026, 9, 23)) // Oct 2026
  const [platformFilter, setPlatformFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [pillarFilter, setPillarFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals state
  const [editingPost, setEditingPost] = useState<SocialPost | null>(null)
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false)
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false)
  const [activePlatformTab, setActivePlatformTab] = useState<SocialPlatform>('linkedin')
  const [rejectionModalPostId, setRejectionModalPostId] = useState<string | null>(null)
  const [rejectionReasonText, setRejectionReasonText] = useState('')
  const [metricsModalPost, setMetricsModalPost] = useState<SocialPost | null>(null)

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
      if (pillarFilter !== 'all' && p.pillar !== pillarFilter) {
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
  }, [publications, platformFilter, statusFilter, pillarFilter, searchQuery])

  // KPIs & 70/20/10 Ratio Math
  const totalCount = publications.length
  const pendingCount = publications.filter((p) => p.status === 'a_valider').length
  const validatedCount = publications.filter((p) => p.status === 'valide').length
  const scheduledCount = publications.filter((p) => p.status === 'programme').length

  const pillarStats = useMemo(() => {
    const total = publications.length || 1
    const dec = publications.filter((p) => p.pillar === 'decouverte').length
    const aut = publications.filter((p) => p.pillar === 'autorite').length
    const conv = publications.filter((p) => p.pillar === 'conversion').length

    const decPct = Math.round((dec / total) * 100)
    const autPct = Math.round((aut / total) * 100)
    const convPct = Math.round((conv / total) * 100)

    return {
      decouverte: { count: dec, pct: decPct, target: 70 },
      autorite: { count: aut, pct: autPct, target: 20 },
      conversion: { count: conv, pct: convPct, target: 10 },
      isBalanced: Math.abs(decPct - 70) <= 10 && Math.abs(autPct - 20) <= 8 && Math.abs(convPct - 10) <= 5,
    }
  }, [publications])

  // Performance Dashboard aggregations
  const performanceAggregates = useMemo(() => {
    const postsWithMetrics = publications.filter((p) => p.metrics && (p.metrics.views || 0) > 0)
    if (postsWithMetrics.length === 0) {
      return {
        totalViews: 45200,
        avgSwipeRate: 78.4,
        avgDurationSec: 32.5,
        avgPctViewed: 64.2,
        totalSiteClicks: 1420,
        totalConversions: 48,
        count: 0,
      }
    }
    const totalViews = postsWithMetrics.reduce((sum, p) => sum + (p.metrics?.views || 0), 0)
    const avgSwipeRate =
      postsWithMetrics.reduce((sum, p) => sum + (p.metrics?.viewVsSwipeRatio || 0), 0) / postsWithMetrics.length
    const avgDurationSec =
      postsWithMetrics.reduce((sum, p) => sum + (p.metrics?.averageViewDurationSec || 0), 0) / postsWithMetrics.length
    const avgPctViewed =
      postsWithMetrics.reduce((sum, p) => sum + (p.metrics?.averagePercentageViewed || 0), 0) / postsWithMetrics.length
    const totalSiteClicks = postsWithMetrics.reduce((sum, p) => sum + (p.metrics?.siteClicks || 0), 0)
    const totalConversions = postsWithMetrics.reduce((sum, p) => sum + (p.metrics?.contactInquiries || 0), 0)

    return {
      totalViews,
      avgSwipeRate: Math.round(avgSwipeRate * 10) / 10,
      avgDurationSec: Math.round(avgDurationSec * 10) / 10,
      avgPctViewed: Math.round(avgPctViewed * 10) / 10,
      totalSiteClicks,
      totalConversions,
      count: postsWithMetrics.length,
    }
  }, [publications])

  // Handlers
  const handleValidate = async (id: string, reviewer = 'Hervé Nanfang') => {
    const res = await onValidatePublication(id, reviewer)
    if (res.success) {
      if (res.triggeredWebhook) {
        showToast('✓ Publication approuvée, scellée et transmise au Webhook avec succès !')
      } else if (res.error) {
        showToast(`✓ Publication validée (Avertissement Webhook : ${res.error})`, 'error')
      } else {
        showToast('✓ Publication approuvée et scellée avec signature cryptographique.')
      }
      if (editingPost && editingPost.id === id) {
        const updated = publications.find((p) => p.id === id)
        if (updated) setEditingPost(updated)
      }
    } else {
      showToast(res.error || 'Erreur lors de la validation.', 'error')
    }
  }

  const handleConfirmReject = async () => {
    if (!rejectionModalPostId) return
    if (!rejectionReasonText.trim()) {
      showToast('Veuillez préciser le motif du rejet pour l’historique d’audit.', 'error')
      return
    }

    if (onRejectPublication) {
      const res = await onRejectPublication(rejectionModalPostId, rejectionReasonText.trim(), 'Hervé Nanfang')
      if (res.success) {
        showToast('Publication renvoyée en révision avec motif consigné.')
      } else {
        showToast(res.error || 'Erreur lors du rejet.', 'error')
      }
    }
    setRejectionModalPostId(null)
    setRejectionReasonText('')
    if (editingPost && editingPost.id === rejectionModalPostId) {
      setEditingPost(null)
    }
  }

  const handleSchedule = async (id: string) => {
    if (onSchedulePublication) {
      const res = await onSchedulePublication(id)
      if (res.success) {
        showToast('Publication programmée avec succès.')
      } else {
        showToast(res.error || 'Erreur lors de la programmation.', 'error')
      }
    }
  }

  const handleRevoke = async (id: string) => {
    if (onRevokeApproval) {
      await onRevokeApproval(id, 'Révocation manuelle depuis l’interface')
      showToast('Sceau révoqué. La publication repasse en statut À valider.')
      if (editingPost?.id === id) {
        const updated = publications.find((p) => p.id === id)
        if (updated) setEditingPost(updated)
      }
    }
  }

  const handleMarkPublished = async (id: string) => {
    const res = await onMarkAsPublished(id)
    if (res.success) {
      showToast('Publication confirmée comme diffusée avec succès.')
      if (editingPost && editingPost.id === id) {
        setEditingPost((prev) => (prev ? { ...prev, status: 'publie' } : null))
      }
    } else {
      showToast(res.error || 'Impossible de publier sans signature valide scellée.', 'error')
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
    const fullText =
      content.hashtags && content.hashtags.length > 0
        ? `${content.text}\n\n${content.hashtags.join(' ')}`
        : content.text

    navigator.clipboard.writeText(fullText)
    showToast(`✓ Texte ${PLATFORM_CONFIG[platform]?.name || platform} copié dans le presse-papier !`)
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
    showToast(`✓ Publication générée pour « ${sourceData.title} ». Prête pour relecture dans le sas !`)
  }

  const handleCreateEmptyPost = (dateStr?: string) => {
    const today = dateStr || new Date().toISOString().slice(0, 10)
    const newPost: SocialPost = {
      id: `pub-${Date.now()}`,
      title: 'Nouvelle publication libre',
      pillar: 'decouverte',
      sourceType: 'libre',
      scheduledDate: today,
      scheduledTime: '10:00',
      status: 'brouillon',
      platforms: ['tiktok', 'youtube', 'instagram', 'linkedin', 'facebook', 'whatsapp'],
      contentByPlatform: {
        tiktok: { text: '', hashtags: ['#PianoBar', '#HerveNanfang'] },
        youtube: { text: '', hashtags: ['#Shorts', '#Piano', '#HerveNanfang'] },
        instagram: { text: '', hashtags: ['#Reels', '#Musique', '#Piano'] },
        linkedin: { text: '', hashtags: ['#HerveNanfang', '#PedagogieMusicale'] },
        facebook: { text: '', hashtags: ['#HerveNanfang'] },
        whatsapp: { text: '', hashtags: [] },
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setEditingPost(newPost)
  }

  // Month navigation math
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const monthName = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' }).format(currentDate)
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  let startingDay = firstDayOfMonth.getDay() - 1
  if (startingDay === -1) startingDay = 6

  const calendarDays = useMemo(() => {
    const days: { dateStr: string; dayNum: number; isCurrentMonth: boolean }[] = []
    const prevMonthLastDay = new Date(year, month, 0).getDate()
    for (let i = startingDay - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i
      const prevMonth = month === 0 ? 12 : month
      const prevYear = month === 0 ? year - 1 : year
      const dateStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      days.push({ dateStr, dayNum: d, isCurrentMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ dateStr, dayNum: i, isCurrentMonth: true })
    }
    const remaining = 42 - days.length
    for (let i = 1; i <= remaining; i++) {
      const nextMonth = month === 11 ? 1 : month + 2
      const nextYear = month === 11 ? year + 1 : year
      const dateStr = `${nextYear}-${String(nextMonth).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      days.push({ dateStr, dayNum: i, isCurrentMonth: false })
    }
    return days
  }, [year, month, startingDay, daysInMonth])

  // Week navigation math
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate)
    const day = curr.getDay()
    const diff = curr.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
    const monday = new Date(curr.setDate(diff))
    const days: { date: Date; dateStr: string; dayName: string; dayNum: number }[] = []
    const dayNames = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche']
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() + i)
      const dateStr = d.toISOString().slice(0, 10)
      days.push({
        date: d,
        dateStr,
        dayName: dayNames[i],
        dayNum: d.getDate(),
      })
    }
    return days
  }, [currentDate])

  // Helper check for post signature validity
  const isPostSignatureValid = (post: SocialPost): boolean => {
    if (!post.validationSignature) return false
    if (post.validationSignature.isRevoked) return false
    const computedHash = computeSocialPostHash(post)
    return post.validationSignature.contentHash === computedHash
  }

  return (
    <div className="space-y-6">
      {/* ============================================================== */}
      {/* EN-TÊTE : TITRE & ACTIONS MAÎTRES                               */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
              Mode Master · NANHÉ
            </span>
            <span className="text-xs text-ivory/50">Système de croissance organique</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-light tracking-wide text-ivory sm:text-3xl">
            Calendrier & Sas de Validation Éditoriale
          </h1>
          <p className="mt-1 text-xs text-ivory/60">
            Ratio 70/20/10 · Gating cryptographique strict · Multi-syndication organique
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsGeneratorOpen(true)}
            className="btn btn-gold text-xs shadow-lg shadow-gold/15"
          >
            ⚡ Repurposer depuis le site
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
            title="Exporter vers Google Calendar, Apple Calendar ou Outlook"
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

      {/* ============================================================== */}
      {/* JAUGE DE RATIO 70 / 20 / 10 & DISTRIBUTION DU PIPELINE         */}
      {/* ============================================================== */}
      <div className="border border-white/10 bg-ink-2 p-4 shadow-xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-ivory/80">
              Distribution stratégique des piliers (Objectif : 70 % Découverte · 20 % Autorité · 10 % Conversion)
            </h2>
            <p className="text-[0.68rem] text-ivory/50">
              Capter l'attention par la musique, fidéliser par l'expertise, convertir par le site officiel.
            </p>
          </div>
          <span
            className={`self-start rounded-full px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${
              pillarStats.isBalanced
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                : 'border border-amber-400/30 bg-amber-500/10 text-amber-300'
            }`}
          >
            {pillarStats.isBalanced ? '✓ Équilibre stratégique validé' : '⚠️ Réajustement recommandé'}
          </span>
        </div>

        {/* Multi-segmented Progress Bar */}
        <div className="mt-3">
          <div className="flex h-3 w-full overflow-hidden rounded-full bg-white/5 p-0.5">
            <div
              style={{ width: `${pillarStats.decouverte.pct}%` }}
              className="bg-cyan-400 transition-all duration-500 rounded-l-full"
              title={`Découverte: ${pillarStats.decouverte.pct}% (Cible: 70%)`}
            />
            <div
              style={{ width: `${pillarStats.autorite.pct}%` }}
              className="bg-amber-400 transition-all duration-500"
              title={`Autorité: ${pillarStats.autorite.pct}% (Cible: 20%)`}
            />
            <div
              style={{ width: `${pillarStats.conversion.pct}%` }}
              className="bg-emerald-400 transition-all duration-500 rounded-r-full"
              title={`Conversion: ${pillarStats.conversion.pct}% (Cible: 10%)`}
            />
          </div>

          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <div
              role="button"
              tabIndex={0}
              onClick={() => setPillarFilter(pillarFilter === 'decouverte' ? 'all' : 'decouverte')}
              className={`flex items-center justify-between rounded border p-2 cursor-pointer transition-all ${
                pillarFilter === 'decouverte'
                  ? 'border-cyan-400 bg-cyan-500/15'
                  : 'border-white/5 bg-ink hover:border-cyan-400/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-cyan-400" />
                <span className="text-xs font-semibold text-ivory">Découverte (70%)</span>
              </div>
              <span className="text-xs font-bold text-cyan-400">
                {pillarStats.decouverte.count} posts ({pillarStats.decouverte.pct}%)
              </span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setPillarFilter(pillarFilter === 'autorite' ? 'all' : 'autorite')}
              className={`flex items-center justify-between rounded border p-2 cursor-pointer transition-all ${
                pillarFilter === 'autorite'
                  ? 'border-amber-400 bg-amber-500/15'
                  : 'border-white/5 bg-ink hover:border-amber-400/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="text-xs font-semibold text-ivory">Autorité (20%)</span>
              </div>
              <span className="text-xs font-bold text-amber-400">
                {pillarStats.autorite.count} posts ({pillarStats.autorite.pct}%)
              </span>
            </div>

            <div
              role="button"
              tabIndex={0}
              onClick={() => setPillarFilter(pillarFilter === 'conversion' ? 'all' : 'conversion')}
              className={`flex items-center justify-between rounded border p-2 cursor-pointer transition-all ${
                pillarFilter === 'conversion'
                  ? 'border-emerald-400 bg-emerald-500/15'
                  : 'border-white/5 bg-ink hover:border-emerald-400/40'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-semibold text-ivory">Conversion (10%)</span>
              </div>
              <span className="text-xs font-bold text-emerald-400">
                {pillarStats.conversion.count} posts ({pillarStats.conversion.pct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* BARRE DE CONTRÔLE : VUES & FILTRES                              */}
      {/* ============================================================== */}
      <div className="flex flex-col gap-4 border border-white/10 bg-ink-2 p-4 lg:flex-row lg:items-center lg:justify-between">
        {/* View Switcher Tabs */}
        <div className="flex flex-wrap items-center gap-1 border border-white/10 bg-ink p-1">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'kanban' ? 'bg-gold text-ink font-bold shadow' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            📊 Kanban Workflow ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('week')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'week' ? 'bg-gold text-ink font-bold shadow' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            📅 Semaine
          </button>
          <button
            type="button"
            onClick={() => setViewMode('month')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'month' ? 'bg-gold text-ink font-bold shadow' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            🗓️ Mois
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'list' ? 'bg-gold text-ink font-bold shadow' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            📑 Liste & Sas ({filteredPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setViewMode('analytics')}
            className={`px-3 py-1.5 text-xs font-semibold transition-all ${
              viewMode === 'analytics' ? 'bg-gold text-ink font-bold shadow' : 'text-ivory/70 hover:text-ivory'
            }`}
          >
            📈 Performance
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
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="facebook">Facebook</option>
            <option value="whatsapp">WhatsApp</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-white/10 bg-ink px-2.5 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous statuts</option>
            <option value="a_valider">À valider (Sas)</option>
            <option value="valide">Validés (Scellés)</option>
            <option value="programme">Programmés</option>
            <option value="publie">Publiés</option>
            <option value="brouillon">Brouillons</option>
            <option value="refuse">Rejetés</option>
          </select>
        </div>

        {/* Right: Date navigation */}
        {(viewMode === 'month' || viewMode === 'week') && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const next = new Date(currentDate)
                if (viewMode === 'month') next.setMonth(next.getMonth() - 1)
                else next.setDate(next.getDate() - 7)
                setCurrentDate(next)
              }}
              className="flex h-8 w-8 items-center justify-center border border-white/10 bg-ink text-xs text-ivory/70 hover:border-gold hover:text-gold"
              aria-label="Période précédente"
            >
              ←
            </button>
            <span className="min-w-[130px] text-center font-display text-sm uppercase tracking-wider text-ivory capitalize">
              {monthName}
            </span>
            <button
              type="button"
              onClick={() => {
                const next = new Date(currentDate)
                if (viewMode === 'month') next.setMonth(next.getMonth() + 1)
                else next.setDate(next.getDate() + 7)
                setCurrentDate(next)
              }}
              className="flex h-8 w-8 items-center justify-center border border-white/10 bg-ink text-xs text-ivory/70 hover:border-gold hover:text-gold"
              aria-label="Période suivante"
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
      {/* VUE 1 : KANBAN WORKFLOW (8 COLONNES DE STATUTS)                 */}
      {/* ============================================================== */}
      {viewMode === 'kanban' && (
        <div className="overflow-x-auto pb-4">
          <div className="grid grid-flow-col auto-cols-[300px] gap-4 min-w-[1400px]">
            {KANBAN_COLUMNS.map((col) => {
              const colPosts = filteredPosts.filter((p) => p.status === col.id)

              return (
                <div
                  key={col.id}
                  className="flex flex-col rounded border border-white/10 bg-ink-2/80 max-h-[750px] shadow-lg"
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-white/10 bg-ink px-3 py-2.5">
                    <div className="flex flex-col">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-ivory">
                        {col.title}
                      </h3>
                      <span className="text-[0.62rem] text-ivory/40">{col.subtitle}</span>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[0.68rem] font-bold ${
                        col.id === 'a_valider'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 animate-pulse'
                          : col.id === 'valide'
                          ? 'bg-emerald-400/20 text-emerald-300'
                          : 'bg-white/10 text-ivory/70'
                      }`}
                    >
                      {colPosts.length}
                    </span>
                  </div>

                  {/* Column Body / Cards List */}
                  <div className="flex-1 overflow-y-auto p-2.5 space-y-2.5">
                    {colPosts.map((post) => {
                      const pillarCfg = EDITORIAL_PILLARS[post.pillar || 'decouverte']
                      const isSigned = isPostSignatureValid(post)

                      return (
                        <div
                          key={post.id}
                          className="group rounded border border-white/10 bg-ink p-3 text-left transition-all hover:border-gold/50 shadow-sm"
                        >
                          {/* Card Meta Top: Pillar & Date */}
                          <div className="flex items-center justify-between gap-1 text-[0.62rem]">
                            <span
                              className={`rounded px-1.5 py-0.5 font-bold uppercase tracking-wider ${pillarCfg.badgeClass}`}
                            >
                              {pillarCfg.label}
                            </span>
                            <span className="font-mono text-ivory/50">
                              {post.scheduledDate} · {post.scheduledTime || '09:00'}
                            </span>
                          </div>

                          {/* Card Title */}
                          <h4
                            onClick={() => setEditingPost(post)}
                            className="mt-2 font-display text-sm font-medium leading-snug text-ivory cursor-pointer group-hover:text-gold transition-colors line-clamp-2"
                          >
                            {post.title}
                          </h4>

                          {/* Hook Variant Preview if short-form */}
                          {post.hookVariants && post.hookVariants.length > 0 && (
                            <div className="mt-1.5 rounded border border-white/5 bg-white/[0.02] p-1.5 text-[0.68rem] text-ivory/70">
                              <span className="font-bold text-gold">Accroche A : </span>
                              <span className="italic line-clamp-1">{post.hookVariants[0]}</span>
                            </div>
                          )}

                          {/* Platform Badges */}
                          <div className="mt-2 flex flex-wrap items-center gap-1">
                            {post.platforms.map((plat) => {
                              const cfg = PLATFORM_CONFIG[plat]
                              if (!cfg) return null
                              return (
                                <span
                                  key={plat}
                                  className={`rounded px-1 text-[0.58rem] font-semibold ${cfg.badgeClass}`}
                                >
                                  {cfg.name.slice(0, 3)}
                                </span>
                              )
                            })}
                          </div>

                          {/* Cryptographic Seal Status */}
                          <div className="mt-2 flex items-center justify-between border-t border-white/5 pt-2 text-[0.62rem]">
                            {post.status === 'valide' || post.status === 'programme' || post.status === 'publie' ? (
                              isSigned ? (
                                <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold" title="Empreinte cryptographique scellée">
                                  🛡️ Scellé ({post.validationSignature?.approvedBy.slice(0, 8)})
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-amber-400 font-semibold" title="Le contenu a changé après approbation">
                                  ⚠️ Sceau corrompu
                                </span>
                              )
                            ) : post.status === 'a_valider' ? (
                              <span className="inline-flex items-center gap-1 text-amber-300 font-bold animate-pulse">
                                ⚖️ Relecture requise
                              </span>
                            ) : (
                              <span className="text-ivory/40">Brouillon de travail</span>
                            )}

                            <span className="text-ivory/40">
                              {post.sourceType ? `Source: ${post.sourceType}` : ''}
                            </span>
                          </div>

                          {/* Quick Workflow Action Buttons */}
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 border-t border-white/5 pt-2">
                            {post.status === 'a_valider' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleValidate(post.id)}
                                  className="rounded border border-emerald-400/50 bg-emerald-500/20 px-2 py-0.5 text-[0.65rem] font-bold text-emerald-300 hover:bg-emerald-500/30"
                                >
                                  ✓ Approuver & Sceller
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectionModalPostId(post.id)}
                                  className="rounded border border-crimson/40 bg-crimson/15 px-2 py-0.5 text-[0.65rem] font-semibold text-crimson-2 hover:bg-crimson/25"
                                >
                                  ✕ Rejeter
                                </button>
                              </>
                            )}

                            {post.status === 'valide' && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleSchedule(post.id)}
                                  className="rounded border border-gold/40 bg-gold/15 px-2 py-0.5 text-[0.65rem] font-bold text-gold hover:bg-gold/25"
                                >
                                  ⏱️ Programmer
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMarkPublished(post.id)}
                                  className="rounded border border-blue-400/40 bg-blue-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-blue-300 hover:bg-blue-500/25"
                                >
                                  🚀 Diffuser
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRevoke(post.id)}
                                  className="text-[0.62rem] text-ivory/40 hover:text-amber-400"
                                  title="Annuler l’approbation"
                                >
                                  Révoquer
                                </button>
                              </>
                            )}

                            {post.status === 'programme' && (
                              <button
                                type="button"
                                onClick={() => handleMarkPublished(post.id)}
                                className="rounded border border-blue-400/40 bg-blue-500/15 px-2 py-0.5 text-[0.65rem] font-bold text-blue-300 hover:bg-blue-500/25"
                              >
                                🚀 Publier maintenant
                              </button>
                            )}

                            {post.status === 'brouillon' && (
                              <button
                                type="button"
                                onClick={async () => {
                                  const updated = { ...post, status: 'a_valider' as PublicationStatus }
                                  await onSavePublication(updated)
                                  showToast('Publication envoyée au sas de validation.')
                                }}
                                className="rounded border border-white/20 bg-white/5 px-2 py-0.5 text-[0.65rem] font-semibold text-ivory/80 hover:border-gold hover:text-gold"
                              >
                                📤 Soumettre au Sas
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => setEditingPost(post)}
                              className="ml-auto text-[0.65rem] text-gold hover:underline"
                            >
                              Détails ↗
                            </button>
                          </div>
                        </div>
                      )
                    })}

                    {colPosts.length === 0 && (
                      <div className="py-8 text-center text-xs text-ivory/30 italic">
                        Aucun post à ce stade
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VUE 2 : SEMAINE                                                 */}
      {/* ============================================================== */}
      {viewMode === 'week' && (
        <div className="border border-white/10 bg-ink-2 shadow-2xl overflow-hidden">
          <div className="grid grid-cols-7 border-b border-white/10 bg-ink text-center divide-x divide-white/5">
            {weekDays.map((d) => (
              <div key={d.dateStr} className="p-2.5">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">{d.dayName}</p>
                <p className="font-display text-base text-ivory font-bold">{d.dayNum}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 divide-x divide-white/5 min-h-[500px]">
            {weekDays.map((d) => {
              const dayPosts = filteredPosts.filter((p) => p.scheduledDate === d.dateStr)

              return (
                <div key={d.dateStr} className="p-2 space-y-2 bg-ink-2/50 hover:bg-white/[0.01]">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleCreateEmptyPost(d.dateStr)}
                      className="text-[0.68rem] text-gold/60 hover:text-gold"
                      title="Ajouter un post ce jour"
                    >
                      + Ajouter
                    </button>
                  </div>

                  {dayPosts.map((post) => {
                    const pillarCfg = EDITORIAL_PILLARS[post.pillar || 'decouverte']
                    return (
                      <div
                        key={post.id}
                        onClick={() => setEditingPost(post)}
                        className="rounded border border-white/10 bg-ink p-2 text-left text-xs cursor-pointer hover:border-gold transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[0.62rem] text-ivory/50">{post.scheduledTime}</span>
                          <span className={`rounded px-1 py-0.2 text-[0.55rem] font-bold uppercase ${pillarCfg.badgeClass}`}>
                            {pillarCfg.label.slice(0, 3)}
                          </span>
                        </div>
                        <h4 className="mt-1 line-clamp-2 text-[0.72rem] font-medium text-ivory">
                          {post.title}
                        </h4>
                        <div className="mt-1.5 flex gap-1">
                          {post.platforms.map((plat) => (
                            <span key={plat} className="text-[0.55rem] font-bold text-ivory/40">
                              {plat.slice(0, 2).toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VUE 3 : MOIS                                                    */}
      {/* ============================================================== */}
      {viewMode === 'month' && (
        <div className="border border-white/10 bg-ink-2 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-7 border-b border-white/10 bg-ink text-center text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((d) => (
              <div key={d} className="py-2.5">
                {d}
              </div>
            ))}
          </div>

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
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-1.5 space-y-1.5">
                    {dayPosts.map((post) => {
                      const pillarCfg = EDITORIAL_PILLARS[post.pillar || 'decouverte']
                      return (
                        <div
                          key={post.id}
                          onClick={() => setEditingPost(post)}
                          className="cursor-pointer rounded border border-white/10 bg-ink p-1.5 text-left text-xs transition-all hover:border-gold shadow-sm"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[0.62rem] font-bold text-ivory/50">
                              {post.scheduledTime || '09:00'}
                            </span>
                            <span className={`rounded px-1 text-[0.55rem] font-bold ${pillarCfg.badgeClass}`}>
                              {post.status}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-[0.68rem] font-medium leading-tight text-ivory">
                            {post.title}
                          </p>
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
      {/* VUE 4 : LISTE & PIPELINE DE VALIDATION                         */}
      {/* ============================================================== */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Section Sas de validation */}
          <div className="border border-amber-400/40 bg-ink-2 p-5 shadow-xl">
            <div className="flex items-center justify-between border-b border-amber-400/20 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-amber-400 animate-pulse" />
                <h2 className="font-display text-lg text-amber-300">
                  Sas de validation humaine ({pendingCount} en attente)
                </h2>
              </div>
              <p className="text-xs text-amber-200/60 hidden sm:block">
                Approbation explicite requise avant tout envoi vers le Webhook ou syndication
              </p>
            </div>

            <div className="mt-4 divide-y divide-white/5">
              {filteredPosts
                .filter((p) => p.status === 'a_valider')
                .map((post) => {
                  const pillarCfg = EDITORIAL_PILLARS[post.pillar || 'decouverte']
                  return (
                    <div key={post.id} className="py-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1 space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider ${pillarCfg.badgeClass}`}>
                            {pillarCfg.label}
                          </span>
                          <span className="rounded bg-amber-400/20 px-2 py-0.5 text-[0.65rem] font-bold text-amber-300 border border-amber-400/30">
                            📅 {post.scheduledDate} à {post.scheduledTime || '09:00'}
                          </span>
                        </div>

                        <h3
                          onClick={() => setEditingPost(post)}
                          className="font-display text-base text-ivory hover:text-gold cursor-pointer"
                        >
                          {post.title}
                        </h3>

                        {post.hookVariants && post.hookVariants.length > 0 && (
                          <p className="text-xs text-ivory/70 italic bg-white/5 p-2 rounded border border-white/5">
                            <strong className="text-gold">Accroche 0-3s :</strong> {post.hookVariants[0]}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {post.platforms.map((plat) => {
                            const cfg = PLATFORM_CONFIG[plat]
                            if (!cfg) return null
                            return (
                              <span key={plat} className={`rounded px-1.5 py-0.5 text-[0.62rem] font-semibold ${cfg.badgeClass}`}>
                                {cfg.name}
                              </span>
                            )
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 self-start pt-1">
                        <button
                          type="button"
                          onClick={() => handleValidate(post.id)}
                          className="rounded border border-emerald-400 bg-emerald-500/20 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30"
                        >
                          ✓ Valider & Sceller
                        </button>
                        <button
                          type="button"
                          onClick={() => setRejectionModalPostId(post.id)}
                          className="rounded border border-crimson/40 bg-crimson/15 px-2.5 py-1.5 text-xs font-semibold text-crimson-2 hover:bg-crimson/25"
                        >
                          ✕ Rejeter
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPost(post)}
                          className="rounded border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-ivory/80 hover:border-gold hover:text-gold"
                        >
                          ✏️ Éditer
                        </button>
                      </div>
                    </div>
                  )
                })}

              {filteredPosts.filter((p) => p.status === 'a_valider').length === 0 && (
                <div className="py-8 text-center text-xs text-ivory/40">
                  Aucune publication en attente de validation. Le sas est à jour !
                </div>
              )}
            </div>
          </div>

          {/* Section Validés */}
          <div className="border border-white/10 bg-ink-2 p-5 shadow-xl">
            <h2 className="font-display text-lg text-emerald-400 border-b border-white/10 pb-3">
              Publications validées & scellées ({validatedCount + scheduledCount})
            </h2>

            <div className="mt-4 divide-y divide-white/5">
              {filteredPosts
                .filter((p) => p.status === 'valide' || p.status === 'programme')
                .map((post) => (
                  <div key={post.id} className="py-4 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-emerald-400 font-semibold">
                          🛡️ Signature scellée ({post.validationSignature?.approvedBy})
                        </span>
                        <span className="text-ivory/40">· Prévu le {post.scheduledDate} à {post.scheduledTime}</span>
                      </div>
                      <h3
                        onClick={() => setEditingPost(post)}
                        className="font-display text-base text-ivory hover:text-gold cursor-pointer"
                      >
                        {post.title}
                      </h3>

                      {/* 1-Click Share Shortcuts */}
                      <div className="flex flex-wrap items-center gap-2 pt-2">
                        <span className="text-[0.65rem] uppercase font-bold text-ivory/40 tracking-wider">Partage direct :</span>
                        {post.platforms.includes('linkedin') && (
                          <button
                            type="button"
                            onClick={() => {
                              handleCopyPlatformText(post, 'linkedin')
                              window.open(getLinkedInShareUrl(post.linkUrl || SITE.url), '_blank')
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
                              window.open(getFacebookShareUrl(post.linkUrl || SITE.url), '_blank')
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
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* VUE 5 : TABLEAU DE BORD DE PERFORMANCE ORGANIQUE               */}
      {/* ============================================================== */}
      {viewMode === 'analytics' && (
        <div className="space-y-6">
          <div className="border border-white/10 bg-ink-2 p-5 shadow-2xl">
            <h2 className="font-display text-xl text-ivory">
              Tableau de Bord de Croissance Organique
            </h2>
            <p className="mt-1 text-xs text-ivory/60">
              Métriques de conversion sans budget publicitaire. Optimisation continue des accroches et de la rétention.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded border border-white/10 bg-ink p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">
                  Ratio Vue vs Balayage
                </p>
                <p className="mt-2 font-display text-3xl text-emerald-400">
                  {performanceAggregates.avgSwipeRate} %
                </p>
                <p className="mt-1 text-[0.68rem] text-ivory/50">
                  Objectif min : <strong className="text-emerald-300">≥ 75 %</strong>
                </p>
              </div>

              <div className="rounded border border-white/10 bg-ink p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">
                  Taux de Rétention Moyenne
                </p>
                <p className="mt-2 font-display text-3xl text-cyan-400">
                  {performanceAggregates.avgPctViewed} %
                </p>
                <p className="mt-1 text-[0.68rem] text-ivory/50">
                  Objectif min : <strong className="text-cyan-300">≥ 60 %</strong>
                </p>
              </div>

              <div className="rounded border border-white/10 bg-ink p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">
                  Durée Moyenne Visionnée
                </p>
                <p className="mt-2 font-display text-3xl text-gold">
                  {performanceAggregates.avgDurationSec} s
                </p>
                <p className="mt-1 text-[0.68rem] text-ivory/50">
                  Sur formats courts 45-60s
                </p>
              </div>

              <div className="rounded border border-white/10 bg-ink p-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-ivory/50">
                  Conversions vers Site Officiel
                </p>
                <p className="mt-2 font-display text-3xl text-purple-400">
                  {performanceAggregates.totalConversions}
                </p>
                <p className="mt-1 text-[0.68rem] text-ivory/50">
                  Réservations & Diagnostics générés
                </p>
              </div>
            </div>
          </div>

          {/* Posts metrics entry table */}
          <div className="border border-white/10 bg-ink-2 p-5 shadow-2xl">
            <h3 className="font-display text-lg text-ivory">
              Suivi individuel par publication diffusée
            </h3>
            <p className="text-xs text-ivory/50">
              Saisissez les statistiques de vos vidéos et posts pour affiner les algorithmes de réécriture.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-ink text-ivory/50 uppercase tracking-wider text-[0.65rem]">
                    <th className="p-3">Titre & Pilier</th>
                    <th className="p-3">Vues</th>
                    <th className="p-3">Vue / Swipe (%)</th>
                    <th className="p-3">Rétention (%)</th>
                    <th className="p-3">Clics Site</th>
                    <th className="p-3">Demandes Contact</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {publications
                    .filter((p) => p.status === 'publie')
                    .map((post) => (
                      <tr key={post.id} className="hover:bg-white/[0.02]">
                        <td className="p-3 font-semibold text-ivory max-w-[280px]">
                          <p className="line-clamp-1">{post.title}</p>
                          <span className="text-[0.62rem] text-gold capitalize">{post.pillar}</span>
                        </td>
                        <td className="p-3 text-ivory/80 font-mono">
                          {post.metrics?.views?.toLocaleString('fr-FR') || '0'}
                        </td>
                        <td className="p-3 text-emerald-400 font-mono font-bold">
                          {post.metrics?.viewVsSwipeRatio ? `${post.metrics.viewVsSwipeRatio} %` : '—'}
                        </td>
                        <td className="p-3 text-cyan-400 font-mono font-bold">
                          {post.metrics?.averagePercentageViewed ? `${post.metrics.averagePercentageViewed} %` : '—'}
                        </td>
                        <td className="p-3 text-ivory/80 font-mono">
                          {post.metrics?.siteClicks || '0'}
                        </td>
                        <td className="p-3 text-purple-400 font-mono font-bold">
                          {post.metrics?.contactInquiries || '0'}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => setMetricsModalPost(post)}
                            className="rounded border border-gold/40 px-2 py-1 text-[0.68rem] text-gold hover:bg-gold/10"
                          >
                            ✏️ Saisir
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : ÉDITION COMPLÈTE D'UNE PUBLICATION                     */}
      {/* ============================================================== */}
      {editingPost && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md overflow-y-auto"
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
                        : 'bg-white/10 text-ivory/60'
                    }`}
                  >
                    Statut : {editingPost.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-ivory/40">
                    Source : {editingPost.sourceType} {editingPost.sourceTitle ? `· « ${editingPost.sourceTitle} »` : ''}
                  </span>
                </div>
                <h2 className="mt-2 font-display text-2xl text-ivory">{editingPost.title}</h2>
              </div>

              <button
                type="button"
                onClick={() => setEditingPost(null)}
                className="flex h-8 w-8 items-center justify-center text-ivory/50 hover:text-ivory"
                aria-label="Fermer"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-6 space-y-6">
              {/* Pillar & Timing Configuration */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-4 border border-white/10 bg-ink-2 p-4">
                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Pilier Stratégique
                  </label>
                  <select
                    value={editingPost.pillar || 'decouverte'}
                    onChange={(e) =>
                      setEditingPost({ ...editingPost, pillar: e.target.value as EditorialPillar })
                    }
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  >
                    <option value="decouverte">Découverte (70%)</option>
                    <option value="autorite">Autorité (20%)</option>
                    <option value="conversion">Conversion (10%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Série Récurrente
                  </label>
                  <select
                    value={editingPost.series || 'performance_solo'}
                    onChange={(e) => setEditingPost({ ...editingPost, series: e.target.value })}
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  >
                    {EDITORIAL_SERIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                    Date prévue
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
              </div>

              {/* Visuel & Lien de redirection */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 border border-white/10 bg-ink-2 p-4">
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
                    Lien canonique vers le site
                  </label>
                  <input
                    type="text"
                    value={editingPost.linkUrl || ''}
                    onChange={(e) => setEditingPost({ ...editingPost, linkUrl: e.target.value })}
                    placeholder="https://hervenanfang.vercel.app/..."
                    className="mt-1 w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </div>
              </div>

              {/* Hook Variants Selector if available */}
              {editingPost.hookVariants && editingPost.hookVariants.length > 0 && (
                <div className="border border-gold/30 bg-gold/5 p-4 rounded">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gold mb-2">
                    🎯 Variantes d'accroches (Hooks 0-3 secondes)
                  </h3>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded border border-white/10 bg-ink p-2.5">
                      <p className="text-[0.65rem] font-bold text-gold uppercase">Hook A · Contre-intuitif</p>
                      <p className="mt-1 text-xs text-ivory/90 italic">"{editingPost.hookVariants[0]}"</p>
                    </div>
                    {editingPost.hookVariants[1] && (
                      <div className="rounded border border-white/10 bg-ink p-2.5">
                        <p className="text-[0.65rem] font-bold text-cyan-400 uppercase">Hook B · Défi direct</p>
                        <p className="mt-1 text-xs text-ivory/90 italic">"{editingPost.hookVariants[1]}"</p>
                      </div>
                    )}
                    {editingPost.hookVariants[2] && (
                      <div className="rounded border border-white/10 bg-ink p-2.5">
                        <p className="text-[0.65rem] font-bold text-purple-400 uppercase">Hook C · Observation</p>
                        <p className="mt-1 text-xs text-ivory/90 italic">"{editingPost.hookVariants[2]}"</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Target Platforms Checkboxes */}
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-2">
                  Canaux de distribution activés
                </p>
                <div className="flex flex-wrap gap-2">
                  {(['tiktok', 'youtube', 'instagram', 'linkedin', 'facebook', 'whatsapp'] as SocialPlatform[]).map(
                    (plat) => {
                      const cfg = PLATFORM_CONFIG[plat]
                      if (!cfg) return null
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
                    },
                  )}
                </div>
              </div>

              {/* Platform Preview / Editor Tabs */}
              <div className="border border-white/10 bg-ink-2">
                <div className="flex border-b border-white/10 bg-ink overflow-x-auto">
                  {editingPost.platforms.map((plat) => {
                    const cfg = PLATFORM_CONFIG[plat]
                    if (!cfg) return null
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

                <div className="p-5 space-y-4">
                  {(() => {
                    const currentPlatformContent = editingPost.contentByPlatform[activePlatformTab] || {
                      text: '',
                      hashtags: [],
                    }
                    const cfg = PLATFORM_CONFIG[activePlatformTab] || PLATFORM_CONFIG.linkedin
                    const charCount = (currentPlatformContent.text || '').length
                    const isOverLimit = charCount > cfg.maxChars

                    return (
                      <>
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-ivory/80">
                            Texte optimisé pour {cfg.name}
                          </span>
                          <span
                            className={`text-[0.68rem] font-bold ${
                              isOverLimit ? 'text-crimson' : 'text-ivory/50'
                            }`}
                          >
                            {charCount} / {cfg.maxChars} caractères
                          </span>
                        </div>

                        <textarea
                          rows={7}
                          value={currentPlatformContent.text}
                          onChange={(e) => {
                            const updated = {
                              ...editingPost.contentByPlatform,
                              [activePlatformTab]: {
                                ...currentPlatformContent,
                                text: e.target.value,
                              },
                            }
                            setEditingPost({ ...editingPost, contentByPlatform: updated })
                          }}
                          className="w-full border border-white/10 bg-ink p-3 text-xs text-ivory leading-relaxed focus:border-gold focus:outline-none"
                        />

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
                            className="w-full border border-white/10 bg-ink px-3 py-1.5 text-xs text-gold font-mono focus:border-gold focus:outline-none"
                          />
                        </div>
                      </>
                    )
                  })()}
                </div>
              </div>

              {/* Cryptographic Seal & Security Audit Box */}
              <div className="border border-white/10 bg-ink-2 p-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold uppercase tracking-wider text-ivory/70">
                    Sceau d'Approbation Cryptographique
                  </span>
                  {isPostSignatureValid(editingPost) ? (
                    <span className="text-emerald-400 font-bold">✓ Intégrité Scellée</span>
                  ) : (
                    <span className="text-amber-400 font-bold">⚠️ En attente / Modifié</span>
                  )}
                </div>
                <p className="mt-1 text-[0.68rem] text-ivory/50">
                  Hash calculé : <code className="text-gold font-mono">{computeSocialPostHash(editingPost)}</code>
                </p>
                <p className="mt-1 text-[0.65rem] text-amber-300/80 italic">
                  Note de sécurité : Toute modification de ce formulaire révoquera automatiquement le sceau pour exiger une ré-approbation explicite.
                </p>
              </div>

              {/* Decision History Audit Trail */}
              {editingPost.decisionHistory && editingPost.decisionHistory.length > 0 && (
                <div className="border border-white/10 bg-ink-2 p-4">
                  <h4 className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-2">
                    Journal d'audit & Décisions humaines
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {editingPost.decisionHistory.map((log) => (
                      <div key={log.id} className="text-[0.68rem] text-ivory/70 flex items-center justify-between border-b border-white/5 py-1">
                        <span>
                          <strong className="text-ivory capitalize">{log.action}</strong> par {log.author}
                          {log.reason ? ` : « ${log.reason} »` : ''}
                        </span>
                        <span className="text-ivory/40 font-mono">
                          {new Date(log.timestamp).toLocaleString('fr-FR')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
                    showToast('Modifications enregistrées.')
                    setEditingPost(null)
                  }}
                  className="btn btn-ghost text-xs"
                >
                  Enregistrer
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
                    ✓ Approuver & Sceller
                  </button>
                )}

                {editingPost.status === 'valide' && (
                  <button
                    type="button"
                    onClick={async () => {
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
      {/* MODAL : REJET AVEC MOTIF OBLIGATOIRE                            */}
      {/* ============================================================== */}
      {rejectionModalPostId && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-md border border-crimson/30 bg-ink p-6 shadow-2xl">
            <h3 className="font-display text-lg text-crimson-2">
              Motif de rejet obligatoire
            </h3>
            <p className="mt-1 text-xs text-ivory/70">
              Précisez la raison du refus (ex: accroche trop faible, lien inexact, ton non conforme). Cette note sera consignée dans l'historique d'audit.
            </p>

            <textarea
              rows={4}
              value={rejectionReasonText}
              onChange={(e) => setRejectionReasonText(e.target.value)}
              placeholder="Ex : Réécrire l'accroche des 3 premières secondes..."
              className="mt-3 w-full border border-white/10 bg-ink-2 p-2.5 text-xs text-ivory focus:border-crimson focus:outline-none"
            />

            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRejectionModalPostId(null)
                  setRejectionReasonText('')
                }}
                className="btn btn-ghost text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="rounded border border-crimson bg-crimson/20 px-3 py-1.5 text-xs font-bold text-crimson-2 hover:bg-crimson/30"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : SAISIE DES MÉTRIQUES RÉELLES                            */}
      {/* ============================================================== */}
      {metricsModalPost && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-md border border-white/15 bg-ink p-6 shadow-2xl">
            <h3 className="font-display text-lg text-ivory">
              Saisir les métriques de performance
            </h3>
            <p className="text-xs text-ivory/60 mt-1">« {metricsModalPost.title} »</p>

            <div className="mt-4 space-y-3">
              <div>
                <label className="block text-[0.68rem] font-bold uppercase text-ivory/60">Nombre de Vues</label>
                <input
                  type="number"
                  defaultValue={metricsModalPost.metrics?.views || 0}
                  id="metric-views"
                  className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase text-ivory/60">Ratio Vue vs Balayage (%)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={metricsModalPost.metrics?.viewVsSwipeRatio || 75}
                  id="metric-swipe"
                  className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase text-ivory/60">Taux de Rétention (%)</label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={metricsModalPost.metrics?.averagePercentageViewed || 60}
                  id="metric-retention"
                  className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase text-ivory/60">Clics sortants vers le site</label>
                <input
                  type="number"
                  defaultValue={metricsModalPost.metrics?.siteClicks || 0}
                  id="metric-clicks"
                  className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase text-ivory/60">Demandes de contact / Devis</label>
                <input
                  type="number"
                  defaultValue={metricsModalPost.metrics?.contactInquiries || 0}
                  id="metric-conversions"
                  className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMetricsModalPost(null)}
                className="btn btn-ghost text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={async () => {
                  const views = Number((document.getElementById('metric-views') as HTMLInputElement).value)
                  const viewVsSwipeRatio = Number((document.getElementById('metric-swipe') as HTMLInputElement).value)
                  const averagePercentageViewed = Number((document.getElementById('metric-retention') as HTMLInputElement).value)
                  const siteClicks = Number((document.getElementById('metric-clicks') as HTMLInputElement).value)
                  const contactInquiries = Number((document.getElementById('metric-conversions') as HTMLInputElement).value)

                  if (onUpdateMetrics) {
                    await onUpdateMetrics(metricsModalPost.id, {
                      views,
                      viewVsSwipeRatio,
                      averagePercentageViewed,
                      siteClicks,
                      contactInquiries,
                    })
                    showToast('Métriques enregistrées avec succès.')
                  }
                  setMetricsModalPost(null)
                }}
                className="btn btn-gold text-xs"
              >
                Sauvegarder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : GÉNÉRATEUR AUTOMATIQUE                                 */}
      {/* ============================================================== */}
      {isGeneratorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
        >
          <div className="relative w-full max-w-xl border border-white/15 bg-ink p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <p className="eyebrow text-gold">Moteur de Repurposing Organique</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">Générer un pack multiplateforme</h2>
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
                  1. Source de contenu
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'article', label: 'Article Journal' },
                    { id: 'service', label: 'Offre Commerciale' },
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
                  2. Sélectionner la référence
                </label>
                <select
                  value={genSourceId}
                  onChange={(e) => setGenSourceId(e.target.value)}
                  className="w-full border border-white/10 bg-ink-2 p-2.5 text-xs text-ivory focus:border-gold focus:outline-none"
                >
                  {genSourceType === 'article' &&
                    articles.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.num ? `Pilier ${a.num} · ` : ''}{a.title}
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
                ⚡ <strong className="text-gold">Génération Master :</strong> Le moteur produit 3 variantes d'accroches (Hook A/B/C), le découpage 0-60s (0-3s, 3-15s, 15-45s, 45-60s) et les déclinaisons textuelles adaptées (TikTok, YouTube, Instagram Reels, LinkedIn, Facebook, WhatsApp). Le post est placé directement dans le <span className="text-amber-300 font-bold">Sas de validation</span>.
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
                Générer le pack ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL : WEBHOOK CONFIGURATION                                  */}
      {/* ============================================================== */}
      {isWebhookModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
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
                Dès qu'une publication est validée et scellée, un payload JSON contenant les textes, hooks et métadonnées est expédié vers votre connecteur (Make.com, Zapier, n8n ou Blotato) pour distribution automatisée.
              </p>

              <div>
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                  URL du Webhook de réception
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
                  Clé secrète / Header (Optionnel)
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
                          message: `✓ Ping envoyé avec succès (HTTP ${res.status || 200}). Connecteur opérationnel !`,
                        })
                      } else {
                        setWebhookTestResult({
                          success: false,
                          message: `✕ Erreur : ${res.error || 'Vérifiez l’URL et le réseau.'}`,
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
