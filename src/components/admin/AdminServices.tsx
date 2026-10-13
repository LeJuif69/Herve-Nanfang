import React, { useState } from 'react'
import type { AdminMedia, AdminService, AdminTalk } from '../../lib/admin-types'
import { ImageEditor, type ImageEditorValue } from './ImageEditor'
import { ImageField } from './ImageField'

interface AdminServicesProps {
  services: AdminService[]
  talks: AdminTalk[]
  media: AdminMedia[]
  onSaveService: (service: AdminService) => Promise<void>
  onDeleteService: (id: string) => Promise<void>
  onSaveTalk: (talk: AdminTalk) => Promise<void>
  onDeleteTalk: (id: string) => Promise<void>
  onUploadMedia: (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => Promise<AdminMedia>
}

const EMPTY_SERVICE: AdminService = {
  id: '',
  title: '',
  text: '',
  tags: ['Prestation', 'Musique'],
  to: '/services',
  status: 'Actif',
  position: 1,
  updatedAt: '',
}

const EMPTY_TALK: AdminTalk = {
  id: '',
  theme: 'Musique & IA',
  title: '',
  pitch: '',
  audience: 'Écoles de musique, universités et institutions',
  formats: ['Conférence 45 min', 'Masterclass 2h'],
  status: 'Publié',
  updatedAt: '',
}

export const AdminServices: React.FC<AdminServicesProps> = ({
  services,
  talks,
  media,
  onSaveService,
  onDeleteService,
  onSaveTalk,
  onDeleteTalk,
  onUploadMedia,
}) => {
  const [subTab, setSubTab] = useState<'services' | 'talks'>('services')

  // Service modal
  const [editingService, setEditingService] = useState<AdminService | null>(null)
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false)
  const [isServiceImageOpen, setIsServiceImageOpen] = useState(false)

  // Talk modal
  const [editingTalk, setEditingTalk] = useState<AdminTalk | null>(null)
  const [isTalkModalOpen, setIsTalkModalOpen] = useState(false)
  const [isTalkImageOpen, setIsTalkImageOpen] = useState(false)

  const [saving, setSaving] = useState(false)

  // Service handlers
  const handleOpenCreateService = () => {
    setEditingService({
      ...EMPTY_SERVICE,
      id: `srv-${Date.now()}`,
      position: services.length + 1,
      updatedAt: new Date().toISOString(),
    })
    setIsServiceModalOpen(true)
  }

  const handleOpenEditService = (service: AdminService) => {
    setEditingService({ ...service })
    setIsServiceModalOpen(true)
  }

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService || !editingService.title.trim()) return
    setSaving(true)
    try {
      await onSaveService(editingService)
      setIsServiceModalOpen(false)
      setEditingService(null)
    } finally {
      setSaving(false)
    }
  }

  // Talk handlers
  const handleOpenCreateTalk = () => {
    setEditingTalk({
      ...EMPTY_TALK,
      id: `talk-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    })
    setIsTalkModalOpen(true)
  }

  const handleOpenEditTalk = (talk: AdminTalk) => {
    setEditingTalk({ ...talk })
    setIsTalkModalOpen(true)
  }

  const handleSaveTalk = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTalk || !editingTalk.title.trim()) return
    setSaving(true)
    try {
      await onSaveTalk(editingTalk)
      setIsTalkModalOpen(false)
      setEditingTalk(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-gold">Offres & Transmission</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">Services & Conférences</h1>
          <p className="text-xs text-ivory/60">
            {services.length} services de prestations et {talks.length} conférences/masterclasses répertoriées.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {subTab === 'services' ? (
            <button
              type="button"
              onClick={handleOpenCreateService}
              className="btn btn-gold text-xs"
            >
              + Nouveau service
            </button>
          ) : (
            <button
              type="button"
              onClick={handleOpenCreateTalk}
              className="btn btn-gold text-xs"
            >
              + Nouvelle conférence
            </button>
          )}
        </div>
      </div>

      {/* Sub tabs */}
      <div className="flex border-b border-white/10">
        <button
          type="button"
          onClick={() => setSubTab('services')}
          className={`border-b-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
            subTab === 'services'
              ? 'border-gold text-gold'
              : 'border-transparent text-ivory/60 hover:text-ivory'
          }`}
        >
          Services & Prestations ({services.length})
        </button>
        <button
          type="button"
          onClick={() => setSubTab('talks')}
          className={`border-b-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider transition-colors ${
            subTab === 'talks'
              ? 'border-gold text-gold'
              : 'border-transparent text-ivory/60 hover:text-ivory'
          }`}
        >
          Conférences & Masterclasses ({talks.length})
        </button>
      </div>

      {/* Services List */}
      {subTab === 'services' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="flex flex-col justify-between border border-white/10 bg-ink-2 p-5 transition-colors hover:border-gold/50"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xl text-ivory">{srv.title}</span>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[0.62rem] font-bold uppercase text-emerald-400">
                    {srv.status}
                  </span>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-ivory/70">{srv.text}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {srv.tags.map((tag) => (
                    <span key={tag} className="border border-white/10 bg-ink px-2 py-0.5 text-[0.65rem] text-ivory/60">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[0.68rem] text-ivory/40">Lien : {srv.to}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEditService(srv)}
                    className="border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold hover:bg-gold hover:text-ink"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteService(srv.id)}
                    className="border border-crimson/40 bg-crimson/10 px-2.5 py-1 text-xs font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Talks List */}
      {subTab === 'talks' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {talks.map((talk) => (
            <div
              key={talk.id}
              className="flex flex-col justify-between border border-white/10 bg-ink-2 p-5 transition-colors hover:border-gold/50"
            >
              <div>
                <span className="text-[0.65rem] uppercase tracking-wider text-gold">{talk.theme}</span>
                <h3 className="mt-1 font-display text-xl text-ivory">{talk.title}</h3>
                <p className="mt-3 text-xs leading-relaxed text-ivory/70">{talk.pitch}</p>
                <p className="mt-3 text-[0.72rem] text-ivory/55">
                  <strong className="text-ivory/75">Audience :</strong> {talk.audience}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {talk.formats.map((fmt) => (
                    <span key={fmt} className="border border-white/10 bg-ink px-2 py-0.5 text-[0.65rem] text-ivory/60">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
                <button
                  type="button"
                  onClick={() => handleOpenEditTalk(talk)}
                  className="border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold hover:bg-gold hover:text-ink"
                >
                  Modifier
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTalk(talk.id)}
                  className="border border-crimson/40 bg-crimson/10 px-2.5 py-1 text-xs font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Service Modal */}
      {isServiceModalOpen && editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-xl overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl text-ivory">Éditeur de Service</h2>
              <button
                type="button"
                onClick={() => setIsServiceModalOpen(false)}
                className="text-ivory/60 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Intitulé du service *
                  <input
                    required
                    type="text"
                    value={editingService.title}
                    onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Description *
                  <textarea
                    required
                    rows={4}
                    value={editingService.text}
                    onChange={(e) => setEditingService({ ...editingService, text: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm leading-relaxed text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Tags (séparés par des virgules)
                  <input
                    type="text"
                    value={editingService.tags.join(', ')}
                    onChange={(e) =>
                      setEditingService({
                        ...editingService,
                        tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                      })
                    }
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Lien associé (to)
                  <input
                    type="text"
                    value={editingService.to}
                    onChange={(e) => setEditingService({ ...editingService, to: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <ImageField
                label="Image du service (optionnel)"
                imageUrl={editingService.coverImage}
                positionX={editingService.coverPositionX}
                positionY={editingService.coverPositionY}
                zoom={editingService.coverZoom}
                alt={editingService.coverAlt || editingService.title}
                onOpenEditor={() => setIsServiceImageOpen(true)}
              />

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsServiceModalOpen(false)}
                  className="btn btn-ghost text-xs"
                >
                  Annuler
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="btn btn-gold text-xs"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Talk Modal */}
      {isTalkModalOpen && editingTalk && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-xl overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl text-ivory">Éditeur de Conférence</h2>
              <button
                type="button"
                onClick={() => setIsTalkModalOpen(false)}
                className="text-ivory/60 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTalk} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Thème *
                  <input
                    required
                    type="text"
                    value={editingTalk.theme}
                    onChange={(e) => setEditingTalk({ ...editingTalk, theme: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Titre de la conférence *
                  <input
                    required
                    type="text"
                    value={editingTalk.title}
                    onChange={(e) => setEditingTalk({ ...editingTalk, title: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Pitch / Résumé *
                  <textarea
                    required
                    rows={3}
                    value={editingTalk.pitch}
                    onChange={(e) => setEditingTalk({ ...editingTalk, pitch: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm leading-relaxed text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Audience cible
                  <input
                    type="text"
                    value={editingTalk.audience}
                    onChange={(e) => setEditingTalk({ ...editingTalk, audience: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Formats proposés (séparés par des virgules)
                  <input
                    type="text"
                    value={editingTalk.formats.join(', ')}
                    onChange={(e) =>
                      setEditingTalk({
                        ...editingTalk,
                        formats: e.target.value.split(',').map((f) => f.trim()).filter(Boolean),
                      })
                    }
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <ImageField
                label="Visuel de la conférence (optionnel)"
                imageUrl={editingTalk.coverImage}
                positionX={editingTalk.coverPositionX}
                positionY={editingTalk.coverPositionY}
                zoom={editingTalk.coverZoom}
                alt={editingTalk.coverAlt || editingTalk.title}
                onOpenEditor={() => setIsTalkImageOpen(true)}
              />

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsTalkModalOpen(false)}
                  className="btn btn-ghost text-xs"
                >
                  Annuler
                </button>
                <button
                  disabled={saving}
                  type="submit"
                  className="btn btn-gold text-xs"
                >
                  {saving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isServiceImageOpen && editingService && (
        <ImageEditor
          title={`Image — ${editingService.title || 'nouveau service'}`}
          value={{
            url: editingService.coverImage || '/og-image.jpg',
            positionX: editingService.coverPositionX ?? 50,
            positionY: editingService.coverPositionY ?? 50,
            zoom: editingService.coverZoom ?? 1,
            focalX: editingService.coverFocalX,
            focalY: editingService.coverFocalY,
            preset: editingService.coverPreset || 'original',
            alt: editingService.coverAlt || editingService.title,
          }}
          media={media}
          onUpload={onUploadMedia}
          onCancel={() => setIsServiceImageOpen(false)}
          onSave={(v: ImageEditorValue) => {
            setEditingService({
              ...editingService,
              coverImage: v.url,
              coverPositionX: v.positionX,
              coverPositionY: v.positionY,
              coverZoom: v.zoom,
              coverFocalX: v.focalX,
              coverFocalY: v.focalY,
              coverPreset: v.preset,
              coverAlt: v.alt,
            })
            setIsServiceImageOpen(false)
          }}
        />
      )}

      {isTalkImageOpen && editingTalk && (
        <ImageEditor
          title={`Image — ${editingTalk.title || 'nouvelle conférence'}`}
          value={{
            url: editingTalk.coverImage || '/og-image.jpg',
            positionX: editingTalk.coverPositionX ?? 50,
            positionY: editingTalk.coverPositionY ?? 50,
            zoom: editingTalk.coverZoom ?? 1,
            focalX: editingTalk.coverFocalX,
            focalY: editingTalk.coverFocalY,
            preset: editingTalk.coverPreset || 'original',
            alt: editingTalk.coverAlt || editingTalk.title,
          }}
          media={media}
          onUpload={onUploadMedia}
          onCancel={() => setIsTalkImageOpen(false)}
          onSave={(v: ImageEditorValue) => {
            setEditingTalk({
              ...editingTalk,
              coverImage: v.url,
              coverPositionX: v.positionX,
              coverPositionY: v.positionY,
              coverZoom: v.zoom,
              coverFocalX: v.focalX,
              coverFocalY: v.focalY,
              coverPreset: v.preset,
              coverAlt: v.alt,
            })
            setIsTalkImageOpen(false)
          }}
        />
      )}
    </div>
  )
}
