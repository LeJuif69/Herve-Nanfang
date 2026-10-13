import React, { useState } from 'react'
import type { AdminMedia, AdminTrack } from '../../lib/admin-types'
import { ImageEditor, type ImageEditorValue } from './ImageEditor'
import { ImageField } from './ImageField'

interface AdminMusicProps {
  tracks: AdminTrack[]
  media: AdminMedia[]
  onSaveTrack: (track: AdminTrack) => Promise<void>
  onDeleteTrack: (id: string) => Promise<void>
  onUploadMedia: (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => Promise<AdminMedia>
}

const EMPTY_TRACK: AdminTrack = {
  id: '',
  title: '',
  artist: 'Hervé Nanfang',
  category: 'Live Piano-Bar',
  duration: '3:30',
  coverImage: '/hn-initials-mark.png',
  streaming: { youtube: 'https://www.youtube.com/@hervenanfang' },
  status: 'Actif',
  updatedAt: '',
}

export const AdminMusic: React.FC<AdminMusicProps> = ({
  tracks,
  media,
  onSaveTrack,
  onDeleteTrack,
  onUploadMedia,
}) => {
  const [editingTrack, setEditingTrack] = useState<AdminTrack | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleOpenCreate = () => {
    setEditingTrack({
      ...EMPTY_TRACK,
      id: `trk-${Date.now()}`,
      updatedAt: new Date().toISOString(),
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (track: AdminTrack) => {
    setEditingTrack({ ...track })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingTrack || !editingTrack.title.trim()) return

    setSaving(true)
    try {
      await onSaveTrack(editingTrack)
      setIsModalOpen(false)
      setEditingTrack(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-gold">Univers sonore & Scène</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">Musiques, Pistes & Enregistrements</h1>
          <p className="text-xs text-ivory/60">
            {tracks.length} œuvres, titres live et productions sonores.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-gold text-xs"
        >
          + Ajouter une piste
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex flex-col justify-between border border-white/10 bg-ink-2 p-5 transition-colors hover:border-gold/50"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-white/5 px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-gold">
                  {track.category}
                </span>
                <span className="text-xs text-ivory/50">{track.duration || '—'}</span>
              </div>
              <h3 className="mt-3 font-display text-xl text-ivory">{track.title}</h3>
              <p className="mt-1 text-xs text-ivory/60">{track.artist}</p>

              {track.streaming && Object.keys(track.streaming).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {Object.entries(track.streaming).map(([platform, url]) => (
                    <a
                      key={platform}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border border-white/10 bg-ink px-2 py-0.5 text-[0.65rem] text-gold hover:underline"
                    >
                      {platform} ↗
                    </a>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2 border-t border-white/10 pt-3">
              <button
                type="button"
                onClick={() => handleOpenEdit(track)}
                className="border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold hover:bg-gold hover:text-ink"
              >
                Modifier
              </button>
              <button
                type="button"
                onClick={() => onDeleteTrack(track.id)}
                className="border border-crimson/40 bg-crimson/10 px-2.5 py-1 text-xs font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Track Modal */}
      {isModalOpen && editingTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-xl overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl text-ivory">Éditeur de Piste</h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-ivory/60 hover:text-ivory"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Titre du morceau *
                  <input
                    required
                    type="text"
                    value={editingTrack.title}
                    onChange={(e) => setEditingTrack({ ...editingTrack, title: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Artiste / Interprète
                    <input
                      type="text"
                      value={editingTrack.artist}
                      onChange={(e) => setEditingTrack({ ...editingTrack, artist: e.target.value })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Catégorie
                    <input
                      type="text"
                      value={editingTrack.category}
                      onChange={(e) => setEditingTrack({ ...editingTrack, category: e.target.value })}
                      placeholder="Live Piano-Bar, Composition…"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Durée
                    <input
                      type="text"
                      value={editingTrack.duration || ''}
                      onChange={(e) => setEditingTrack({ ...editingTrack, duration: e.target.value })}
                      placeholder="4:15"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Lien YouTube / Streaming
                    <input
                      type="text"
                      value={editingTrack.streaming?.youtube || ''}
                      onChange={(e) =>
                        setEditingTrack({
                          ...editingTrack,
                          streaming: { ...editingTrack.streaming, youtube: e.target.value },
                        })
                      }
                      placeholder="https://youtube.com/..."
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <ImageField
                label="Pochette / visuel"
                imageUrl={editingTrack.coverImage}
                positionX={editingTrack.coverPositionX}
                positionY={editingTrack.coverPositionY}
                zoom={editingTrack.coverZoom}
                alt={editingTrack.coverAlt || editingTrack.title}
                onOpenEditor={() => setIsImageEditorOpen(true)}
              />

              <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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

      {isImageEditorOpen && editingTrack && (
        <ImageEditor
          title={`Pochette — ${editingTrack.title || 'nouvelle piste'}`}
          value={{
            url: editingTrack.coverImage || '/hn-initials-mark.png',
            positionX: editingTrack.coverPositionX ?? 50,
            positionY: editingTrack.coverPositionY ?? 50,
            zoom: editingTrack.coverZoom ?? 1,
            focalX: editingTrack.coverFocalX,
            focalY: editingTrack.coverFocalY,
            preset: editingTrack.coverPreset || 'original',
            alt: editingTrack.coverAlt || editingTrack.title,
          }}
          media={media}
          onUpload={onUploadMedia}
          onCancel={() => setIsImageEditorOpen(false)}
          onSave={(v: ImageEditorValue) => {
            setEditingTrack({
              ...editingTrack,
              coverImage: v.url,
              coverPositionX: v.positionX,
              coverPositionY: v.positionY,
              coverZoom: v.zoom,
              coverFocalX: v.focalX,
              coverFocalY: v.focalY,
              coverPreset: v.preset,
              coverAlt: v.alt,
            })
            setIsImageEditorOpen(false)
          }}
        />
      )}
    </div>
  )
}
