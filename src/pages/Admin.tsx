import { useEffect, useState } from 'react'
import { adminAuth } from '../lib/admin-auth'
import { adminStore } from '../lib/admin-store'
import { useSeo } from '../lib/seo'
import type { AdminArticle, AdminMedia, AdminProject, AdminService, AdminSettings, AdminState, AdminTalk, AdminTrack, AuthSession, PublicationMetrics, SocialPost } from '../lib/admin-types'
import { AdminHeader } from '../components/admin/AdminHeader'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { AdminOverview } from '../components/admin/AdminOverview'
import { AdminArticles } from '../components/admin/AdminArticles'
import { AdminCalendar } from '../components/admin/AdminCalendar'
import { AdminProjects } from '../components/admin/AdminProjects'
import { AdminServices } from '../components/admin/AdminServices'
import { AdminMusic } from '../components/admin/AdminMusic'
import { AdminMedia as AdminMediaView } from '../components/admin/AdminMedia'
import { AdminMessages } from '../components/admin/AdminMessages'
import { AdminSettingsView } from '../components/admin/AdminSettings'
import { AdminLogin } from '../components/admin/AdminLogin'

export default function Admin() {
  useSeo({
    title: 'Administration | Hervé Nanfang',
    description: 'Espace privé d\u2019administration du site d\u2019Hervé Nanfang : contenus, médiathèque, offres, messages et réglages SEO.',
    path: '/admin',
    robots: 'noindex, nofollow, noarchive',
  })

  const [session, setSession] = useState<AuthSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [state, setState] = useState<AdminState>(adminStore.getState())
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  useEffect(() => {
    let alive = true

    // Subscribe to auth
    const unsubAuth = adminAuth.subscribe((s) => {
      if (!alive) return
      setSession(s)
      setLoading(false)
    })

    // Subscribe to store
    const unsubStore = adminStore.subscribe((next) => {
      if (!alive) return
      setState(next)
    })

    // Initial check
    void adminAuth.getSession().then((s) => {
      if (!alive) return
      setSession(s)
      setLoading(false)
    })

    // Try fetching from Supabase if connected
    void adminStore.fetchFromSupabase()

    return () => {
      alive = false
      unsubAuth()
      unsubStore()
    }
  }, [])

  // Export JSON Backup
  const handleExportBackup = () => {
    const json = adminStore.exportBackup()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `herve-nanfang-backup-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast('Sauvegarde JSON téléchargée avec succès.')
  }

  // Import JSON Backup
  const handleImportBackup = async (jsonStr: string) => {
    const res = adminStore.importBackup(jsonStr)
    if (res.success) {
      showToast('Sauvegarde restaurée avec succès.')
      return true
    } else {
      showToast(res.error || 'Erreur lors de la restauration.', 'error')
      return false
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink text-ivory">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
          <p className="eyebrow text-gold">Chargement de l'espace d'administration…</p>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main>
        <h1 className="sr-only">Administration — Hervé Nanfang</h1>
        <AdminLogin
          onSignIn={async (email, pass) => {
            const res = await adminAuth.signIn(email, pass)
            if (res.success) {
              showToast('Bienvenue dans votre espace d’administration, Maître Nanfang.')
            }
            return res
          }}
        />
      </main>
    )
  }

  const unreadMessagesCount = state.messages.filter((m) => m.status === 'nouveau').length
  const publishedArticlesCount = state.articles.filter((a) => a.status === 'Publié').length
  const pendingPublicationsCount = (state.publications || []).filter((p) => p.status === 'a_valider').length

  return (
    <main className="min-h-screen bg-ink text-ivory">
      {/* Top Header */}
      <AdminHeader
        session={session}
        onSignOut={() => {
          adminAuth.signOut()
          showToast('Vous êtes déconnecté.')
        }}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        unreadMessagesCount={unreadMessagesCount}
        onOpenMobileNav={() => setIsMobileNavOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          unreadMessagesCount={unreadMessagesCount}
          publishedArticlesCount={publishedArticlesCount}
          totalArticlesCount={state.articles.length}
          pendingPublicationsCount={pendingPublicationsCount}
          projectsCount={state.projects.length}
          mediaCount={state.media.length}
          isOpenMobile={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Content View Area */}
        <div className="flex-1 overflow-x-hidden p-4 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {/* Active Tab View Rendering */}
            {activeTab === 'overview' && (
              <AdminOverview
                state={state}
                onSelectTab={setActiveTab}
                onSeedSupabase={async () => {
                  const res = await adminStore.seedToSupabase()
                  if (res.success) {
                    showToast(`Synchronisation Supabase réussie (${res.count} éléments synchronisés).`)
                  } else {
                    showToast(res.error || 'Erreur de synchronisation Supabase', 'error')
                  }
                }}
                onOpenNewArticle={() => setActiveTab('articles')}
                onOpenNewProject={() => setActiveTab('projects')}
              />
            )}

            {activeTab === 'calendar' && (
              <AdminCalendar
                publications={state.publications || []}
                articles={state.articles}
                services={state.services}
                projects={state.projects}
                media={state.media}
                settings={state.settings}
                onSavePublication={async (post: SocialPost) => {
                  return await adminStore.savePublication(post)
                }}
                onValidatePublication={async (id: string, reviewer?: string, comment?: string) => {
                  return await adminStore.approvePublication(id, reviewer, comment)
                }}
                onRejectPublication={async (id: string, reason: string, reviewer?: string) => {
                  return await adminStore.rejectPublication(id, reason, reviewer)
                }}
                onSchedulePublication={async (id: string, scheduledFor?: string) => {
                  return await adminStore.schedulePublication(id, scheduledFor)
                }}
                onRevokeApproval={async (id: string, reason?: string) => {
                  return await adminStore.revokeApproval(id, reason)
                }}
                onMarkAsPublished={async (id: string) => {
                  return await adminStore.markPublicationAsPublished(id)
                }}
                onUpdateMetrics={async (id: string, metrics: PublicationMetrics) => {
                  await adminStore.updatePublicationMetrics(id, metrics)
                }}
                onDeletePublication={async (id: string) => {
                  await adminStore.deletePublication(id)
                }}
                onExportIcs={() => {
                  const ics = adminStore.exportCalendarIcs()
                  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `herve-nanfang-calendrier-editorial-${new Date().toISOString().slice(0, 10)}.ics`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                  showToast('✓ Calendrier iCal (.ics) téléchargé avec succès.')
                }}
                onSaveSettings={async (settingsUpdates: Partial<AdminSettings>) => {
                  await adminStore.updateSettings(settingsUpdates)
                }}
                onTestWebhook={async (url: string, secret?: string) => {
                  return await adminStore.triggerWebhookTest(url, secret)
                }}
                showToast={showToast}
              />
            )}

            {activeTab === 'articles' && (
              <AdminArticles
                articles={state.articles}
                media={state.media}
                onSave={async (art: AdminArticle) => {
                  await adminStore.saveArticle(art)
                  showToast(`Article « ${art.title} » enregistré.`)
                }}
                onDelete={async (id: string) => {
                  await adminStore.deleteArticle(id)
                  showToast('Article supprimé.')
                }}
                onToggleStatus={async (id: string) => {
                  const newStatus = await adminStore.toggleArticleStatus(id)
                  showToast(`Statut mis à jour : ${newStatus}`)
                  return newStatus
                }}
                onUploadMedia={async (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => {
                  const res = await adminStore.uploadMedia(file, meta)
                  showToast(`Fichier « ${res.filename} » uploadé avec succès.`)
                  return res
                }}
                onSyncFromCode={() => {
                  adminStore.syncArticlesFromCode()
                  showToast('Articles resynchronisés depuis src/data/articles.ts.')
                }}
              />
            )}

            {activeTab === 'projects' && (
              <AdminProjects
                projects={state.projects}
                media={state.media}
                onSave={async (prj: AdminProject) => {
                  await adminStore.saveProject(prj)
                  showToast(`Projet « ${prj.title} » enregistré.`)
                }}
                onDelete={async (id: string) => {
                  await adminStore.deleteProject(id)
                  showToast('Projet supprimé.')
                }}
                onUploadMedia={async (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => {
                  const res = await adminStore.uploadMedia(file, meta)
                  showToast(`Fichier « ${res.filename} » uploadé avec succès.`)
                  return res
                }}
              />
            )}

            {activeTab === 'services' && (
              <AdminServices
                services={state.services}
                talks={state.talks}
                media={state.media}
                onSaveService={async (srv: AdminService) => {
                  await adminStore.saveService(srv)
                  showToast(`Service « ${srv.title} » enregistré.`)
                }}
                onDeleteService={async (id: string) => {
                  await adminStore.deleteService(id)
                  showToast('Service supprimé.')
                }}
                onSaveTalk={async (talk: AdminTalk) => {
                  await adminStore.saveTalk(talk)
                  showToast(`Conférence « ${talk.title} » enregistrée.`)
                }}
                onDeleteTalk={async (id: string) => {
                  await adminStore.deleteTalk(id)
                  showToast('Conférence supprimée.')
                }}
                onUploadMedia={async (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => {
                  const res = await adminStore.uploadMedia(file, meta)
                  showToast(`Fichier « ${res.filename} » uploadé avec succès.`)
                  return res
                }}
              />
            )}

            {activeTab === 'music' && (
              <AdminMusic
                tracks={state.tracks}
                media={state.media}
                onSaveTrack={async (trk: AdminTrack) => {
                  await adminStore.saveTrack(trk)
                  showToast(`Piste « ${trk.title} » enregistrée.`)
                }}
                onDeleteTrack={async (id: string) => {
                  await adminStore.deleteTrack(id)
                  showToast('Piste supprimée.')
                }}
                onUploadMedia={async (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => {
                  const res = await adminStore.uploadMedia(file, meta)
                  showToast(`Fichier « ${res.filename} » uploadé avec succès.`)
                  return res
                }}
              />
            )}

            {activeTab === 'media' && (
              <AdminMediaView
                media={state.media}
                usageMap={(() => {
                  const map: Record<string, string[]> = {}
                  const push = (url: string | undefined, label: string) => {
                    if (!url) return
                    if (!map[url]) map[url] = []
                    map[url].push(label)
                  }
                  state.articles.forEach((a) => push(a.coverImage, `Article ${a.num || a.slug}`))
                  state.projects.forEach((p) => push(p.coverImage, `Projet ${p.title}`))
                  state.services.forEach((s) => push(s.coverImage, `Service ${s.title}`))
                  state.talks.forEach((t) => push(t.coverImage, `Conférence ${t.title}`))
                  state.tracks.forEach((t) => push(t.coverImage, `Piste ${t.title}`))
                  return map
                })()}
                onUpload={async (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => {
                  const res = await adminStore.uploadMedia(file, meta)
                  showToast(`Fichier « ${res.filename} » uploadé avec succès.`)
                  return res
                }}
                onUpdate={async (id: string, updates: Partial<AdminMedia>) => {
                  await adminStore.updateMedia(id, updates)
                  showToast('Métadonnées du média mises à jour.')
                }}
                onDelete={async (id: string) => {
                  await adminStore.deleteMedia(id)
                  showToast('Média supprimé.')
                }}
              />
            )}

            {activeTab === 'messages' && (
              <AdminMessages
                messages={state.messages}
                onUpdateStatus={async (id: string, status: 'nouveau' | 'en_cours' | 'traite' | 'archive', internalNotes?: string) => {
                  await adminStore.updateMessageStatus(id, status, internalNotes)
                  showToast('Message mis à jour.')
                }}
                onDelete={async (id: string) => {
                  await adminStore.deleteMessage(id)
                  showToast('Message supprimé.')
                }}
              />
            )}

            {activeTab === 'settings' && (
              <AdminSettingsView
                settings={state.settings}
                onSaveSettings={async (settingsUpdates: Partial<AdminSettings>) => {
                  await adminStore.updateSettings(settingsUpdates)
                  showToast('Paramètres et SEO mis à jour.')
                }}
                onSeedSupabase={async () => {
                  const res = await adminStore.seedToSupabase()
                  if (res.success) {
                    showToast(`Synchronisation Supabase réussie (${res.count} éléments synchronisés).`)
                  } else {
                    showToast(res.error || 'Erreur de synchronisation Supabase', 'error')
                  }
                }}
                onFetchSupabase={async () => {
                  const ok = await adminStore.fetchFromSupabase()
                  if (ok) {
                    showToast('Données rechargées depuis Supabase.')
                  } else {
                    showToast('Rechargement effectué.')
                  }
                }}
                onExportBackup={handleExportBackup}
                onImportBackup={handleImportBackup}
                onResetDefaults={() => {
                  adminStore.resetToDefaults()
                  showToast('Réinitialisation aux données initiales effectuée.')
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Notification Toast */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 border px-4 py-3 text-xs font-semibold shadow-2xl transition-all ${
            toast.type === 'error'
              ? 'border-crimson bg-crimson-2 text-white'
              : 'border-gold bg-ink-2 text-gold'
          }`}
        >
          <span>{toast.type === 'error' ? '✕' : '✓'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </main>
  )
}
