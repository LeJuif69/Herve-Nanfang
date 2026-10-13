import React, { useState } from 'react'
import type { AdminMedia, AdminProject } from '../../lib/admin-types'
import { ImageEditor, type ImageEditorValue } from './ImageEditor'
import { ImageField } from './ImageField'

interface AdminProjectsProps {
  projects: AdminProject[]
  media: AdminMedia[]
  onSave: (project: AdminProject) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onUploadMedia: (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => Promise<AdminMedia>
}

const FAMILIES = [
  { id: 'art', label: 'Art' },
  { id: 'pedagogie', label: 'Pédagogie' },
  { id: 'technologie', label: 'Technologie' },
  { id: 'culture', label: 'Culture' },
  { id: 'entrepreneuriat', label: 'Entrepreneuriat' },
]

const EMPTY_PROJECT: AdminProject = {
  id: '',
  slug: '',
  family: 'art',
  familyLabel: 'Art',
  title: '',
  volume: '',
  description: '',
  points: ['Point clé 1', 'Point clé 2'],
  to: '',
  status: 'Actif',
  mark: '',
  position: 1,
  coverImage: '/images/hero-duo-live.webp',
  updatedAt: '',
}

export const AdminProjects: React.FC<AdminProjectsProps> = ({
  projects,
  media,
  onSave,
  onDelete,
  onUploadMedia,
}) => {
  const [search, setSearch] = useState('')
  const [familyFilter, setFamilyFilter] = useState('tous')
  const [editingProject, setEditingProject] = useState<AdminProject | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const filtered = projects.filter((p) => {
    if (familyFilter !== 'tous' && p.family !== familyFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.volume.toLowerCase().includes(q)
      )
    }
    return true
  }).sort((a, b) => a.position - b.position)

  const handleOpenCreate = () => {
    const nextPos = projects.length + 1
    setEditingProject({
      ...EMPTY_PROJECT,
      id: `prj-${Date.now()}`,
      position: nextPos,
      updatedAt: new Date().toISOString(),
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (project: AdminProject) => {
    setEditingProject({ ...project })
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProject || !editingProject.title.trim()) return

    setSaving(true)
    try {
      const autoSlug =
        editingProject.slug ||
        editingProject.title
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

      const familyObj = FAMILIES.find((f) => f.id === editingProject.family)
      const familyLabel = familyObj ? familyObj.label : editingProject.family

      await onSave({
        ...editingProject,
        slug: autoSlug,
        familyLabel,
        updatedAt: new Date().toISOString(),
      })
      setIsModalOpen(false)
      setEditingProject(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    await onDelete(id)
    setDeleteConfirmId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-gold">Écosystème & Initiatives</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">Gestion des projets & marques</h1>
          <p className="text-xs text-ivory/60">
            {projects.length} projets répartis sur les 5 familles de l'écosystème.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-gold text-xs"
        >
          + Ajouter un projet
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border border-white/10 bg-ink-2 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setFamilyFilter('tous')}
            className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
              familyFilter === 'tous'
                ? 'border-gold bg-gold text-ink'
                : 'border-white/15 text-ivory/60 hover:border-gold hover:text-gold'
            }`}
          >
            Toutes les familles
          </button>
          {FAMILIES.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFamilyFilter(f.id)}
              className={`border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${
                familyFilter === f.id
                  ? 'border-gold bg-gold text-ink'
                  : 'border-white/15 text-ivory/60 hover:border-gold hover:text-gold'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <label htmlFor="project-search" className="sr-only">Rechercher</label>
          <input
            id="project-search"
            type="search"
            placeholder="Filtrer par mot-clé…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-1.5 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
        </div>
      </div>

      {/* Project Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full border border-white/10 bg-ink-2 p-8 text-center text-xs text-ivory/40">
            Aucun projet ne correspond aux critères sélectionnés.
          </div>
        ) : (
          filtered.map((project) => (
            <div
              key={project.id}
              className="flex flex-col justify-between border border-white/10 bg-ink-2 p-5 transition-colors hover:border-gold/50"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[0.65rem] uppercase tracking-wider text-gold">
                    {project.familyLabel || project.family}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[0.62rem] font-bold uppercase tracking-wider ${
                      project.status === 'Signature'
                        ? 'bg-gold/20 text-gold'
                        : project.status === 'Actif'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-white/10 text-ivory/60'
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <h3 className="mt-3 font-display text-xl text-ivory">
                  {project.title}
                  {project.mark && <sup className="ml-1 text-sm text-gold">{project.mark}</sup>}
                </h3>
                <p className="mt-1 text-xs text-gold/80">{project.volume}</p>
                <p className="mt-3 text-xs leading-relaxed text-ivory/70 line-clamp-3">
                  {project.description}
                </p>

                {project.points && project.points.length > 0 && (
                  <ul className="mt-3 space-y-1 text-[0.72rem] text-ivory/55">
                    {project.points.slice(0, 3).map((pt, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <span className="h-1 w-1 bg-gold/70" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[0.68rem] text-ivory/40">Pos. #{project.position}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(project)}
                    className="border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-semibold text-gold hover:bg-gold hover:text-ink"
                  >
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(project.id)}
                    className="border border-crimson/40 bg-crimson/10 px-2.5 py-1 text-xs font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
                  >
                    Suppr.
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-md border border-crimson/50 bg-ink-2 p-6 shadow-2xl">
            <p className="eyebrow text-crimson-2">Confirmation</p>
            <h2 className="mt-3 font-display text-2xl text-ivory">Supprimer ce projet ?</h2>
            <p className="mt-2 text-xs text-ivory/70">
              Ce projet sera définitivement retiré de la liste publique.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-ghost text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                className="border border-crimson bg-crimson px-4 py-2 text-xs font-bold uppercase text-white hover:bg-crimson-2"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Project Modal */}
      {isModalOpen && editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow text-gold">Éditeur de projet</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">
                  {editingProject.title ? editingProject.title : 'Nouveau projet'}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-ivory/60 hover:text-ivory"
              >
                ✕ Fermer
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-6 space-y-5">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ivory/70">
                    Titre du projet *
                    <input
                      required
                      type="text"
                      value={editingProject.title}
                      onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Marque (symbole)
                    <select
                      value={editingProject.mark || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, mark: e.target.value as any })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      <option value="">Aucun</option>
                      <option value="™">™ (Trade Mark)</option>
                      <option value="®">® (Registered)</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Famille
                    <select
                      value={editingProject.family}
                      onChange={(e) => setEditingProject({ ...editingProject, family: e.target.value })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      {FAMILIES.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.label}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Sous-titre / Volume
                    <input
                      type="text"
                      value={editingProject.volume}
                      onChange={(e) => setEditingProject({ ...editingProject, volume: e.target.value })}
                      placeholder="Piano-Bar Live · depuis 2007"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Description *
                  <textarea
                    required
                    rows={3}
                    value={editingProject.description}
                    onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm leading-relaxed text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <ImageField
                label="Image du projet"
                imageUrl={editingProject.coverImage}
                positionX={editingProject.coverPositionX}
                positionY={editingProject.coverPositionY}
                zoom={editingProject.coverZoom}
                alt={editingProject.coverAlt || editingProject.title}
                onOpenEditor={() => setIsImageEditorOpen(true)}
              />

              {/* Points clés */}
              <div className="border border-white/10 bg-ink/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase text-gold">Points clés / Piliers</p>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingProject({
                        ...editingProject,
                        points: [...editingProject.points, 'Nouveau point clé'],
                      })
                    }
                    className="text-xs text-gold hover:underline"
                  >
                    + Ajouter un point
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {editingProject.points.map((pt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={pt}
                        onChange={(e) => {
                          const next = [...editingProject.points]
                          next[idx] = e.target.value
                          setEditingProject({ ...editingProject, points: next })
                        }}
                        className="flex-1 border border-white/15 bg-ink px-2.5 py-1 text-xs text-ivory focus:border-gold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = editingProject.points.filter((_, i) => i !== idx)
                          setEditingProject({ ...editingProject, points: next })
                        }}
                        className="text-xs text-crimson-2 hover:text-crimson"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Statut
                    <select
                      value={editingProject.status}
                      onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      <option value="Actif">Actif</option>
                      <option value="Signature">Signature</option>
                      <option value="En développement">En développement</option>
                      <option value="Archivé">Archivé</option>
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Position d'ordre
                    <input
                      type="number"
                      value={editingProject.position}
                      onChange={(e) => setEditingProject({ ...editingProject, position: parseInt(e.target.value, 10) || 1 })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Lien interne / externe (to)
                    <input
                      type="text"
                      value={editingProject.to || ''}
                      onChange={(e) => setEditingProject({ ...editingProject, to: e.target.value })}
                      placeholder="/musique#pianobariste"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 border-t border-white/10 pt-5">
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
                  {saving ? 'Enregistrement…' : 'Enregistrer le projet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImageEditorOpen && editingProject && (
        <ImageEditor
          title={`Image — ${editingProject.title || 'nouveau projet'}`}
          value={{
            url: editingProject.coverImage || '/images/hero-duo-live.webp',
            positionX: editingProject.coverPositionX ?? 50,
            positionY: editingProject.coverPositionY ?? 50,
            zoom: editingProject.coverZoom ?? 1,
            focalX: editingProject.coverFocalX,
            focalY: editingProject.coverFocalY,
            preset: editingProject.coverPreset || 'original',
            alt: editingProject.coverAlt || editingProject.title,
          }}
          media={media}
          onUpload={onUploadMedia}
          onCancel={() => setIsImageEditorOpen(false)}
          onSave={(v: ImageEditorValue) => {
            setEditingProject({
              ...editingProject,
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
