import React, { useRef, useState } from 'react'
import type { AdminMedia as MediaItem } from '../../lib/admin-types'
import { ImageEditor, type ImageEditorValue } from './ImageEditor'

interface AdminMediaProps {
  media: MediaItem[]
  usageMap?: Record<string, string[]>
  onUpload: (file: File, metadata: { altText: string; caption?: string; tags?: string[] }) => Promise<MediaItem>
  onUpdate: (id: string, updates: Partial<MediaItem>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export const AdminMedia: React.FC<AdminMediaProps> = ({
  media,
  usageMap = {},
  onUpload,
  onUpdate,
  onDelete,
}) => {
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('Tous')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  // Upload modal / state
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [tagsInput, setTagsInput] = useState('Presse, Live')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  // Edit metadata modal
  const [editingMedia, setEditingMedia] = useState<MediaItem | null>(null)
  const [focalMedia, setFocalMedia] = useState<MediaItem | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [deleteWarning, setDeleteWarning] = useState<string | null>(null)

  // Extract all unique tags
  const allTags = Array.from(new Set(media.flatMap((m) => m.tags || [])))

  const filtered = media.filter((m) => {
    if (tagFilter !== 'Tous' && !(m.tags || []).includes(tagFilter)) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        m.filename.toLowerCase().includes(q) ||
        (m.altText && m.altText.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q))
      )
    }
    return true
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      setAltText(`Photographie de ${file.name.replace(/\.[^/.]+$/, '')}`)
      setIsUploadModalOpen(true)
    }
  }

  const handleConfirmUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return
    setUploading(true)
    setUploadError('')

    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean)
      await onUpload(selectedFile, {
        altText: altText.trim() || selectedFile.name,
        caption: caption.trim() || undefined,
        tags: tags.length ? tags : ['Général'],
      })
      setIsUploadModalOpen(false)
      setSelectedFile(null)
      setPreviewUrl(null)
      setAltText('')
      setCaption('')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Erreur lors de l’upload')
    } finally {
      setUploading(false)
    }
  }

  const handleCopyUrl = (url: string, id: string) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingMedia) return
    await onUpdate(editingMedia.id, {
      altText: editingMedia.altText,
      title: editingMedia.title,
      caption: editingMedia.caption,
      description: editingMedia.description,
      credit: editingMedia.credit,
      tags: editingMedia.tags,
    })
    setEditingMedia(null)
  }

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 Ko'
    const kb = bytes / 1024
    if (kb < 1024) return `${kb.toFixed(1)} Ko`
    return `${(kb / 1024).toFixed(2)} Mo`
  }

  return (
    <div className="space-y-6">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,audio/*,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-gold">Ressources & Visuels</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">Médiathèque</h1>
          <p className="text-xs text-ivory/60">
            {media.length} fichiers (photos HD, affiches, audios et visuels SEO).
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="btn btn-gold text-xs"
        >
          + Uploader un fichier
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-ink-2 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTagFilter('Tous')}
            className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              tagFilter === 'Tous'
                ? 'border-gold bg-gold text-ink'
                : 'border-white/15 text-ivory/60 hover:border-gold hover:text-gold'
            }`}
          >
            Tous ({media.length})
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTagFilter(tag)}
              className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                tagFilter === tag
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/15 text-ivory/60 hover:border-gold hover:text-gold'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <label htmlFor="media-search" className="sr-only">Rechercher</label>
          <input
            id="media-search"
            type="search"
            placeholder="Rechercher par nom, alt..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-1.5 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filtered.length === 0 ? (
          <div className="col-span-full border border-white/10 bg-ink-2 p-12 text-center text-xs text-ivory/40">
            Aucun fichier trouvé.
          </div>
        ) : (
          filtered.map((item) => {
            const isPortrait = (item.height || 1000) > (item.width || 800)
            const defaultPosY = item.defaultPositionY ?? (isPortrait ? 20 : 50)
            const defaultPosX = item.defaultPositionX ?? 50
            const posCss = `${defaultPosX}% ${defaultPosY}%`

            return (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden border border-white/10 bg-ink-2 transition-all hover:border-gold/60"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-ink">
                {item.mimeType.startsWith('image/') ? (
                  <img
                    src={item.url}
                    alt={item.altText || item.filename}
                    style={{ objectPosition: posCss }}
                    onError={(e) => {
                      const target = e.currentTarget
                      const fallback = `/images/${encodeURIComponent(item.filename)}`
                      if (target.src !== fallback && !target.src.endsWith(fallback)) {
                        target.src = fallback
                      } else {
                        target.src = '/og-image.jpg'
                      }
                    }}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold">
                    <span className="font-mono text-sm uppercase">{item.mimeType.split('/')[1] || 'DOC'}</span>
                  </div>
                )}
                <span className="absolute bottom-2 right-2 rounded bg-ink/90 px-1.5 py-0.5 text-[0.6rem] font-mono text-ivory/80">
                  {formatBytes(item.sizeBytes)}
                </span>
              </div>

              <div className="p-4">
                <p className="font-display text-sm text-ivory line-clamp-1" title={item.filename}>
                  {item.filename}
                </p>
                <p className="mt-1 text-[0.68rem] text-ivory/60 line-clamp-2" title={item.altText}>
                  <strong className="text-gold/70">Alt :</strong> {item.altText || 'Non renseigné'}
                </p>

                <div className="mt-2.5 flex flex-wrap gap-1">
                  {item.tags.map((t) => (
                    <span key={t} className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] text-ivory/50">
                      {t}
                    </span>
                  ))}
                </div>

                <p className="mt-2 text-[0.62rem] leading-relaxed text-ivory/45">
                  {(usageMap[item.url] && usageMap[item.url].length > 0)
                    ? `Utilisée dans : ${usageMap[item.url].slice(0, 3).join(', ')}${usageMap[item.url].length > 3 ? ` +${usageMap[item.url].length - 3}` : ''}`
                    : 'Non utilisée dans un contenu'}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-white/10 bg-ink/40 p-3">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item.url, item.id)}
                  className={`px-2 py-1 text-[0.65rem] font-bold uppercase transition-colors ${
                    copiedId === item.id
                      ? 'bg-emerald-500 text-ink'
                      : 'border border-white/15 text-ivory/80 hover:border-gold hover:text-gold'
                  }`}
                >
                  {copiedId === item.id ? '✓ Copié !' : 'Copier URL'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setFocalMedia(item)}
                    className="border border-white/20 bg-ink px-2 py-1 text-[0.65rem] font-semibold text-ivory/75 hover:border-gold hover:text-gold"
                    title="Recadrer / point focal sans détruire l'original"
                  >
                    Recadrer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingMedia(item)}
                    className="border border-gold/40 bg-gold/10 px-2 py-1 text-[0.65rem] font-semibold text-gold hover:bg-gold hover:text-ink"
                  >
                    Éditer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const usedIn = usageMap[item.url] || []
                      setDeleteWarning(usedIn.length > 0 ? `Attention : encore utilisée dans ${usedIn.slice(0, 3).join(', ')}.` : null)
                      setDeleteConfirmId(item.id)
                    }}
                    className="border border-crimson/40 bg-crimson/10 px-2 py-1 text-[0.65rem] font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl text-ivory">Uploader un fichier média</h2>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="text-ivory/60 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmUpload} className="mt-6 space-y-4">
              {previewUrl && selectedFile.type.startsWith('image/') && (
                <div className="aspect-video w-full overflow-hidden border border-white/10 bg-ink">
                  <img src={previewUrl} alt="Prévisualisation" className="h-full w-full object-contain" />
                </div>
              )}

              <div>
                <p className="text-xs text-ivory/60">Fichier sélectionné : <strong className="text-ivory">{selectedFile.name}</strong> ({formatBytes(selectedFile.size)})</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Texte alternatif (Alt text) — Obligatoire pour le SEO *
                  <input
                    required
                    type="text"
                    value={altText}
                    onChange={(e) => setAltText(e.target.value)}
                    placeholder="Description concise pour les moteurs de recherche et l'accessibilité"
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Légende (Caption)
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Légende optionnelle"
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Tags (séparés par des virgules)
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Live, Presse, Portrait, Hero..."
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              {uploadError && <p className="text-xs text-crimson-2">{uploadError}</p>}

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="btn btn-ghost text-xs"
                >
                  Annuler
                </button>
                <button
                  disabled={uploading}
                  type="submit"
                  className="btn btn-gold text-xs"
                >
                  {uploading ? 'Envoi en cours…' : 'Valider l’upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-lg overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl text-ivory">Métadonnées du média</h2>
              <button
                type="button"
                onClick={() => setEditingMedia(null)}
                className="text-ivory/60 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Texte alternatif (Alt text) *
                  <input
                    type="text"
                    value={editingMedia.altText}
                    onChange={(e) => setEditingMedia({ ...editingMedia, altText: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Titre
                  <input
                    type="text"
                    value={editingMedia.title || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, title: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Légende
                  <input
                    type="text"
                    value={editingMedia.caption || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, caption: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Description
                  <input
                    type="text"
                    value={editingMedia.description || ''}
                    onChange={(e) => setEditingMedia({ ...editingMedia, description: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Crédit photo
                    <input
                      type="text"
                      value={editingMedia.credit || ''}
                      onChange={(e) => setEditingMedia({ ...editingMedia, credit: e.target.value })}
                      placeholder="© Hervé Nanfang / ..."
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Tags (séparés par des virgules)
                    <input
                      type="text"
                      value={editingMedia.tags.join(', ')}
                      onChange={(e) =>
                        setEditingMedia({
                          ...editingMedia,
                          tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="btn btn-ghost text-xs"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-gold text-xs">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-md border border-crimson/50 bg-ink-2 p-6 shadow-2xl">
            <p className="eyebrow text-crimson-2">Confirmation</p>
            <h2 className="mt-3 font-display text-2xl text-ivory">Supprimer ce média ?</h2>
            <p className="mt-2 text-xs text-ivory/70">
              Le fichier sera définitivement supprimé du stockage. Les contenus qui l'utilisent garderont leur URL mais l'image sera cassée.
            </p>
            {deleteWarning && (
              <p className="mt-3 border border-amber-400/40 bg-amber-400/10 p-2 text-xs text-amber-300">{deleteWarning}</p>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmId(null)
                  setDeleteWarning(null)
                }}
                className="btn btn-ghost text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteConfirmId)
                  setDeleteConfirmId(null)
                  setDeleteWarning(null)
                }}
                className="border border-crimson bg-crimson px-4 py-2 text-xs font-bold uppercase text-white hover:bg-crimson-2"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {focalMedia && (
        <ImageEditor
          title={`Cadrage — ${focalMedia.filename}`}
          value={{
            url: focalMedia.url,
            positionX: focalMedia.defaultPositionX ?? 50,
            positionY: focalMedia.defaultPositionY ?? 50,
            zoom: 1,
            focalX: focalMedia.focalX,
            focalY: focalMedia.focalY,
            preset: 'original',
            alt: focalMedia.altText,
          }}
          media={media}
          onUpload={onUpload}
          onCancel={() => setFocalMedia(null)}
          onSave={(v: ImageEditorValue) => {
            onUpdate(focalMedia.id, {
              defaultPositionX: v.positionX,
              defaultPositionY: v.positionY,
              focalX: v.focalX,
              focalY: v.focalY,
              altText: v.alt,
            })
            if (v.url !== focalMedia.url) {
              // Remplacement dans la médiathèque = nouveau fichier, l'ancien reste intact
              onUpdate(focalMedia.id, { url: v.url } as Partial<MediaItem>)
            }
            setFocalMedia(null)
          }}
        />
      )}
    </div>
  )
}
