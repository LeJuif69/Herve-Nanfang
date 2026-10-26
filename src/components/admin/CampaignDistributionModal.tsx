import React, { useState, useMemo } from 'react'
import {
  AdminArticle,
  CampaignAsset,
  SocialPost,
} from '../../lib/admin-types'
import {
  generateArticleCampaignDistribution,
  PLATFORM_CONFIG,
} from '../../lib/social-generator'

interface CampaignDistributionModalProps {
  isOpen: boolean
  onClose: () => void
  articles: AdminArticle[]
  initialArticleId?: string
  onSchedulePosts: (posts: SocialPost[]) => Promise<void>
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export const CampaignDistributionModal: React.FC<CampaignDistributionModalProps> = ({
  isOpen,
  onClose,
  articles,
  initialArticleId,
  onSchedulePosts,
  showToast,
}) => {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(() => {
    return initialArticleId || (articles.length > 0 ? articles[0].id : '')
  })

  const [baseDate, setBaseDate] = useState<string>(() => {
    return new Date().toISOString().slice(0, 10)
  })

  const currentArticle = useMemo(() => {
    return articles.find((a) => a.id === selectedArticleId || a.slug === selectedArticleId) || articles[0]
  }, [articles, selectedArticleId])

  // Génération du plan de campagne complet (10 formats)
  const campaignPlan = useMemo(() => {
    if (!currentArticle) return null
    return generateArticleCampaignDistribution(currentArticle, baseDate)
  }, [currentArticle, baseDate])

  // États éditables pour chaque asset
  const [editedAssets, setEditedAssets] = useState<Record<string, string>>({})
  const [selectedAssetsForScheduling, setSelectedAssetsForScheduling] = useState<Record<string, boolean>>({
    editorial_summary: false, // Ne pas planifier le résumé interne comme post social
    linkedin: true,
    facebook: true,
    whatsapp_status: true,
    video_script: true,
    pedagogical_carousel: true,
    newsletter: true,
    medium_syndication: true,
    press_pitch: true,
  })

  const [activeAssetIndex, setActiveAssetIndex] = useState<number>(1) // LinkedIn par défaut
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen || !currentArticle || !campaignPlan) return null

  const activeAsset: CampaignAsset = campaignPlan.assets[activeAssetIndex] || campaignPlan.assets[0]
  const currentContent = editedAssets[activeAsset.type] !== undefined
    ? editedAssets[activeAsset.type]
    : activeAsset.content

  const handleTextChange = (text: string) => {
    setEditedAssets((prev) => ({
      ...prev,
      [activeAsset.type]: text,
    }))
  }

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentContent)
    showToast(`✓ Contenu « ${activeAsset.title} » copié dans le presse-papier !`)
  }

  const handleCopyFullDossier = () => {
    const fullDossier = [
      `# DOSSIER DE DISTRIBUTION MULTICANAL : « ${currentArticle.title} »`,
      `Date de lancement : ${baseDate} | URL Canonique : ${campaignPlan.canonicalUrl}`,
      `Signature de marque : Créer · Transmettre · Augmenter · Développer`,
      '\n' + '='.repeat(80) + '\n',
      campaignPlan.assets.map((a) => {
        const text = editedAssets[a.type] !== undefined ? editedAssets[a.type] : a.content
        return `## [${a.dayLabel} · +${a.dayOffset}j] ${a.title}\nPlateforme : ${PLATFORM_CONFIG[a.platform]?.name || a.platform}\nDate cible : ${a.targetDate} à ${a.targetTime}\nURL Trackée (UTM) : ${a.utmUrl}\n\n${text}`
      }).join('\n\n' + '-'.repeat(80) + '\n\n'),
    ].join('\n')

    navigator.clipboard.writeText(fullDossier)
    showToast('✓ Dossier complet de distribution (10 formats) copié en Markdown !')
  }

  const handleScheduleCampaign = async () => {
    setIsSubmitting(true)
    try {
      // Filtrer les posts sélectionnés par l'utilisateur
      const postsToSchedule = campaignPlan.posts.filter((p) => {
        const assetType = p.title.includes('LinkedIn') ? 'linkedin'
          : p.title.includes('Facebook') ? 'facebook'
          : p.title.includes('WhatsApp Séquence 1') ? 'whatsapp_status'
          : p.title.includes('Vidéo') ? 'video_script'
          : p.title.includes('Carrousel') ? 'pedagogical_carousel'
          : p.title.includes('Newsletter') ? 'newsletter'
          : p.title.includes('WhatsApp Séquence 2') ? 'whatsapp_status'
          : p.title.includes('Medium') ? 'medium_syndication'
          : p.title.includes('Tribune') ? 'press_pitch'
          : 'editorial_summary'

        return selectedAssetsForScheduling[assetType] !== false
      }).map((post) => {
        // Appliquer les textes modifiés par l'utilisateur s'il y en a
        const updated = { ...post }
        for (const plat of post.platforms) {
          const contentObj = updated.contentByPlatform[plat]
          if (contentObj) {
            // Trouver l'asset correspondant
            const matchedAsset = campaignPlan.assets.find((a) => a.platform === plat && post.title.includes(a.dayLabel))
            if (matchedAsset && editedAssets[matchedAsset.type] !== undefined) {
              contentObj.text = editedAssets[matchedAsset.type]
              contentObj.charCount = contentObj.text.length
            }
          }
        }
        return updated
      })

      if (postsToSchedule.length === 0) {
        showToast('Aucun format sélectionné pour la programmation.', 'error')
        setIsSubmitting(false)
        return
      }

      await onSchedulePosts(postsToSchedule)
      showToast(`✓ ${postsToSchedule.length} contenus planifiés avec succès dans le calendrier (Sas À Valider) !`)
      onClose()
    } catch {
      showToast('Erreur lors de la programmation de la campagne.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-3 sm:p-6 backdrop-blur-md overflow-hidden"
    >
      <div className="relative flex flex-col w-full max-w-6xl h-[94vh] border border-white/15 bg-ink shadow-2xl overflow-hidden">
        {/* En-tête Modal */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-ink-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[0.68rem] font-bold uppercase tracking-wider text-gold border border-gold/40">
                Générateur de Distribution Multicanal
              </span>
              <span className="text-xs text-ivory/50">
                Signature : <strong className="text-ivory">Créer · Transmettre · Augmenter · Développer</strong>
              </span>
            </div>
            <h2 className="mt-1 font-display text-xl sm:text-2xl text-ivory">
              Campagne Échelonnée J0 → J14 · {currentArticle.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-2 text-ivory/40 hover:bg-white/5 hover:text-ivory transition-colors"
            title="Fermer"
          >
            ✕
          </button>
        </div>

        {/* Barre de configuration : Choix Article & Date J0 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 border-b border-white/10 p-4 bg-ink text-xs">
          <div className="md:col-span-2">
            <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
              Article du Journal à distribuer (Source Originale Canonique)
            </label>
            <select
              value={selectedArticleId}
              onChange={(e) => {
                setSelectedArticleId(e.target.value)
                setEditedAssets({})
              }}
              className="w-full border border-white/15 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
            >
              {articles.map((art) => (
                <option key={art.id} value={art.id}>
                  {art.num ? `Pilier ${art.num} · ` : ''}{art.title} ({art.category})
                </option>
              ))}
            </select>
            <div className="mt-1 flex items-center gap-2 text-[0.68rem] text-ivory/50">
              <span>URL Canonique :</span>
              <a
                href={campaignPlan.canonicalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold underline hover:text-gold-2 font-mono"
              >
                {campaignPlan.canonicalUrl} ↗
              </a>
            </div>
          </div>

          <div>
            <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
              Date de départ J0 (Publication originale)
            </label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full border border-white/15 bg-ink-2 p-2 text-xs text-ivory focus:border-gold focus:outline-none"
            />
            <p className="mt-1 text-[0.65rem] text-ivory/50">
              Le calendrier calculera automatiquement J1, J3, J5, J7, J10 et J14.
            </p>
          </div>
        </div>

        {/* Frise chronologique visuelle J0 -> J14 */}
        <div className="border-b border-white/10 bg-ink-2/60 px-4 py-2.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max text-[0.68rem]">
            {campaignPlan.assets.map((asset, idx) => {
              const isActive = activeAssetIndex === idx
              const isIncluded = selectedAssetsForScheduling[asset.type] !== false
              return (
                <button
                  key={`${asset.type}-${idx}`}
                  type="button"
                  onClick={() => setActiveAssetIndex(idx)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all text-left ${
                    isActive
                      ? 'border-gold bg-gold/20 text-gold font-bold shadow-sm'
                      : 'border-white/10 bg-ink/70 text-ivory/70 hover:border-white/30 hover:text-ivory'
                  }`}
                >
                  <span className={`px-1.5 py-0.2 rounded text-[0.6rem] font-bold ${
                    asset.dayLabel === 'J0' ? 'bg-cyan-500/20 text-cyan-300' :
                    asset.dayLabel === 'J1' ? 'bg-emerald-500/20 text-emerald-300' :
                    asset.dayLabel === 'J3' ? 'bg-pink-500/20 text-pink-300' :
                    asset.dayLabel === 'J5' ? 'bg-purple-500/20 text-purple-300' :
                    asset.dayLabel === 'J7' ? 'bg-amber-500/20 text-amber-300' :
                    asset.dayLabel === 'J10' ? 'bg-sky-500/20 text-sky-300' :
                    'bg-indigo-500/20 text-indigo-300'
                  }`}>
                    {asset.dayLabel}
                  </span>
                  <span>{PLATFORM_CONFIG[asset.platform]?.name.split(' ')[0] || asset.platform}</span>
                  {asset.type !== 'editorial_summary' && (
                    <span className={`h-1.5 w-1.5 rounded-full ${isIncluded ? 'bg-emerald-400' : 'bg-ivory/20'}`} />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Corps central de travail (2 colonnes ou pleine largeur) */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-ink">
          {/* Colonne latérale : Liste détaillée des formats avec cases à cocher */}
          <div className="w-full md:w-80 border-r border-white/10 bg-ink-2/30 p-3 overflow-y-auto space-y-2">
            <h3 className="text-[0.68rem] font-bold uppercase tracking-wider text-ivory/50 px-1 mb-1">
              Les 10 Formats Éditoriaux
            </h3>

            {campaignPlan.assets.map((asset, idx) => {
              const isActive = activeAssetIndex === idx
              const isIncluded = selectedAssetsForScheduling[asset.type] !== false

              return (
                <div
                  key={`${asset.type}-${idx}-card`}
                  onClick={() => setActiveAssetIndex(idx)}
                  className={`border p-2.5 rounded transition-all cursor-pointer ${
                    isActive
                      ? 'border-gold bg-gold/10 shadow-sm'
                      : 'border-white/5 bg-ink hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-gold">{asset.dayLabel}</span>
                      <span className="text-xs font-semibold text-ivory">
                        {PLATFORM_CONFIG[asset.platform]?.name || asset.platform}
                      </span>
                    </div>

                    {asset.type !== 'editorial_summary' ? (
                      <label
                        className="flex items-center gap-1 text-[0.62rem] text-ivory/60 cursor-pointer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isIncluded}
                          onChange={(e) => {
                            setSelectedAssetsForScheduling((prev) => ({
                              ...prev,
                              [asset.type]: e.target.checked,
                            }))
                          }}
                          className="accent-gold h-3 w-3"
                        />
                        <span>Planifier</span>
                      </label>
                    ) : (
                      <span className="text-[0.6rem] text-ivory/40 italic">Interne</span>
                    )}
                  </div>

                  <p className="mt-1 text-[0.68rem] text-ivory/60 line-clamp-1">
                    {asset.title.replace(/\[.*?\]\s*/, '')}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[0.62rem] text-ivory/40">
                    <span>{asset.targetDate}</span>
                    <span>{asset.characterCount} car.</span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Espace d'édition & aperçu du format actif */}
          <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gold uppercase tracking-wider">
                    {activeAsset.dayLabel} · +{activeAsset.dayOffset} jours ({activeAsset.targetDate} à {activeAsset.targetTime})
                  </span>
                  <span className={`rounded px-2 py-0.5 text-[0.65rem] font-bold ${PLATFORM_CONFIG[activeAsset.platform]?.badgeClass || 'bg-white/10 text-ivory'}`}>
                    {PLATFORM_CONFIG[activeAsset.platform]?.name || activeAsset.platform}
                  </span>
                </div>
                <h3 className="font-display text-lg text-ivory mt-0.5">{activeAsset.title}</h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyCurrent}
                  className="border border-gold/40 bg-gold/15 px-3 py-1.5 text-xs font-bold text-gold hover:bg-gold hover:text-ink transition-all shadow-sm"
                  title="Copier le texte de ce format"
                >
                  📋 Copier ce format
                </button>
              </div>
            </div>

            {/* Avertissement / Notice spécifique par canal */}
            {activeAsset.type === 'medium_syndication' && (
              <div className="mb-4 border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
                ⚠️ <strong className="text-white">Syndication sélective sur Medium :</strong> Une balise canonique explicite (<code className="text-gold font-mono">&lt;link rel="canonical" href="{campaignPlan.canonicalUrl}" /&gt;</code>) doit être paramétrée dans les options avancées de Medium pour certifier que le site officiel d'Hervé Nanfang demeure la source originale.
              </div>
            )}

            {activeAsset.type === 'press_pitch' && (
              <div className="mb-4 border border-purple-500/30 bg-purple-500/10 p-3 text-xs text-purple-300">
                🎙️ <strong className="text-white">Proposition de tribune média :</strong> À adresser directement aux rédactions (ex. Jeune Afrique, Music In Africa, RFI Musique, Le Point Afrique). L'email officiel de contact est configuré sur <strong className="text-gold">hervenanfang@gmail.com</strong>.
              </div>
            )}

            {activeAsset.subject && (
              <div className="mb-3">
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60 mb-1">
                  Objet du message / Email
                </label>
                <input
                  type="text"
                  value={activeAsset.subject}
                  readOnly
                  className="w-full border border-white/10 bg-ink-2 p-2 text-xs text-gold font-mono focus:outline-none"
                />
              </div>
            )}

            {/* Zone de texte éditable en direct */}
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[0.68rem] font-bold uppercase tracking-wider text-ivory/60">
                  Contenu éditorial adapté (Modifiable en temps réel)
                </label>
                <span className="text-[0.68rem] font-mono text-ivory/40">
                  {currentContent.length} caractères
                  {PLATFORM_CONFIG[activeAsset.platform]?.maxChars
                    ? ` / max ${PLATFORM_CONFIG[activeAsset.platform].maxChars}`
                    : ''}
                </span>
              </div>
              <textarea
                value={currentContent}
                onChange={(e) => handleTextChange(e.target.value)}
                rows={14}
                className="w-full flex-1 border border-white/10 bg-ink-2 p-3 text-xs text-ivory font-mono focus:border-gold focus:outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Lien avec paramètres UTM */}
            <div className="mt-3 border border-white/10 bg-ink-2/60 p-2.5 text-xs">
              <span className="text-[0.68rem] font-bold text-ivory/60 uppercase tracking-wider block mb-1">
                Lien traqué avec paramètres UTM normalisés (URL canonique intacte) :
              </span>
              <div className="flex items-center justify-between gap-2">
                <code className="text-gold font-mono text-[0.7rem] break-all">{activeAsset.utmUrl}</code>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(activeAsset.utmUrl)
                    showToast('✓ URL UTM copiée !')
                  }}
                  className="border border-white/15 px-2 py-1 text-[0.65rem] text-ivory/70 hover:border-gold hover:text-gold shrink-0"
                >
                  Copier l’URL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pied de modal : Actions globales */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-6 py-4 bg-ink-2">
          <button
            type="button"
            onClick={handleCopyFullDossier}
            className="border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-ivory/80 transition-all hover:border-gold hover:text-gold"
            title="Copie tous les 10 formats dans un seul document Markdown prêt à l'emploi"
          >
            📋 Copier tout le dossier de campagne (Markdown)
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-xs"
            >
              Annuler
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleScheduleCampaign}
              className="btn btn-gold text-xs shadow-lg shadow-gold/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? 'Programmation en cours…' : '🚀 Planifier les contenus dans le Calendrier'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
