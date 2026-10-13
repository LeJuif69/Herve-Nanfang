import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/articles'
import type { AdminArticle, AdminMedia, ContentStatus } from '../../lib/admin-types'
import { ImageEditor, type ImageEditorValue } from './ImageEditor'
import { ImageField } from './ImageField'

interface AdminArticlesProps {
  articles: AdminArticle[]
  media: AdminMedia[]
  onSave: (article: AdminArticle) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onToggleStatus: (id: string) => Promise<ContentStatus>
  onUploadMedia: (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => Promise<AdminMedia>
}

const EMPTY_ARTICLE: AdminArticle = {
  id: '',
  slug: '',
  num: '08',
  category: 'IA',
  title: '',
  excerpt: '',
  readingTime: '7 min',
  status: 'Brouillon',
  audience: 'Musiciens professionnels, enseignants et institutions culturelles.',
  outline: ['Contexte et enjeux', 'Analyse pratique', 'Recommandations'],
  keywords: ['musique', 'IA'],
  linkedConcept: { label: 'Musicien Augmenté™', to: '/ia-technologie#musicien-augmente' },
  seoTitle: '',
  seoDescription: '',
  coverImage: '/og-image.jpg',
  updatedAt: '',
}

export const AdminArticles: React.FC<AdminArticlesProps> = ({
  articles,
  media,
  onSave,
  onDelete,
  onToggleStatus,
  onUploadMedia,
}) => {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('Tous')
  const [categoryFilter, setCategoryFilter] = useState<string>('Toutes')

  // Edit / Modal state
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isImageEditorOpen, setIsImageEditorOpen] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Filters
  const filtered = articles.filter((a) => {
    if (statusFilter !== 'Tous' && a.status !== statusFilter) return false
    if (categoryFilter !== 'Toutes' && a.category !== categoryFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleOpenCreate = () => {
    const nextNum = String(articles.length + 1).padStart(2, '0')
    setEditingArticle({
      ...EMPTY_ARTICLE,
      id: `art-${Date.now()}`,
      num: nextNum,
      updatedAt: new Date().toISOString(),
    })
    setIsModalOpen(true)
  }

  const handleOpenEdit = (article: AdminArticle) => {
    setEditingArticle({ ...article })
    setIsModalOpen(true)
  }

  const handleSlugify = () => {
    if (!editingArticle) return
    const autoSlug = editingArticle.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    setEditingArticle({ ...editingArticle, slug: autoSlug })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingArticle) return
    if (!editingArticle.title.trim() || !editingArticle.slug.trim()) return

    setSaving(true)
    try {
      // Auto-fill SEO if empty
      const seoTitle = editingArticle.seoTitle || editingArticle.title
      const seoDescription = editingArticle.seoDescription || editingArticle.excerpt.slice(0, 160)

      await onSave({
        ...editingArticle,
        seoTitle,
        seoDescription,
        updatedAt: new Date().toISOString(),
      })
      setIsModalOpen(false)
      setEditingArticle(null)
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
          <p className="eyebrow text-gold">Journal du Musicien Augmenté</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">Gestion des articles</h1>
          <p className="text-xs text-ivory/60">
            {articles.length} piliers et articles répertoriés ({articles.filter((a) => a.status === 'Publié').length} publiés).
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn btn-gold text-xs"
        >
          + Rédiger un article
        </button>
      </div>

      {/* Filter Controls */}
      <div className="grid gap-3 border border-white/10 bg-ink-2 p-4 sm:grid-cols-3">
        <div>
          <label htmlFor="article-search" className="sr-only">Rechercher</label>
          <input
            id="article-search"
            type="search"
            placeholder="Rechercher par titre, slug, contenu…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-2 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="article-status-filter" className="sr-only">Statut</label>
          <select
            id="article-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="Publié">Publié</option>
            <option value="En cours">En cours</option>
            <option value="Planifié">Planifié</option>
            <option value="Brouillon">Brouillon</option>
            <option value="Archivé">Archivé</option>
          </select>
        </div>

        <div>
          <label htmlFor="article-cat-filter" className="sr-only">Catégorie</label>
          <select
            id="article-cat-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          >
            <option value="Toutes">Toutes les catégories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table / List */}
      <div className="overflow-x-auto border border-white/10 bg-ink-2">
        <table className="w-full text-left text-xs text-ivory/80">
          <thead className="border-b border-white/10 bg-ink/60 text-[0.65rem] uppercase tracking-wider text-ivory/45">
            <tr>
              <th className="px-4 py-3">N°</th>
              <th className="px-4 py-3">Titre & Extrait</th>
              <th className="px-4 py-3">Catégorie</th>
              <th className="px-4 py-3">Lecture</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-ivory/40">
                  Aucun article ne correspond aux filtres sélectionnés.
                </td>
              </tr>
            ) : (
              filtered.map((article) => (
                <tr key={article.id} className="transition-colors hover:bg-white/5">
                  <td className="px-4 py-3.5 font-display text-base text-gold">
                    {article.num}
                  </td>
                  <td className="max-w-md px-4 py-3.5">
                    <p className="font-display text-base text-ivory">{article.title}</p>
                    <p className="mt-0.5 line-clamp-1 text-[0.72rem] text-ivory/55">{article.excerpt}</p>
                    <p className="mt-1 font-mono text-[0.65rem] text-gold/70">/journal/{article.slug}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="border border-white/10 bg-ink px-2 py-0.5 text-[0.65rem]">
                      {article.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-ivory/60">{article.readingTime}</td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(article.id)}
                      className={`cursor-pointer rounded px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wider transition-colors ${
                        article.status === 'Publié'
                          ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                          : article.status === 'En cours'
                          ? 'bg-gold/20 text-gold hover:bg-gold/30'
                          : 'bg-white/10 text-ivory/50 hover:bg-white/20'
                      }`}
                      title="Cliquer pour basculer la publication"
                    >
                      {article.status} ⟳
                    </button>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/journal/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-white/15 px-2 py-1 text-[0.68rem] text-ivory/70 hover:border-gold hover:text-gold"
                        title="Voir l'article sur le site"
                      >
                        Aperçu ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(article)}
                        className="border border-gold/50 bg-gold/10 px-2 py-1 text-[0.68rem] font-semibold text-gold hover:bg-gold hover:text-ink"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(article.id)}
                        className="border border-crimson/40 bg-crimson/10 px-2 py-1 text-[0.68rem] font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-md border border-crimson/50 bg-ink-2 p-6 shadow-2xl">
            <p className="eyebrow text-crimson-2">Confirmation de suppression</p>
            <h2 className="mt-3 font-display text-2xl text-ivory">Supprimer cet article ?</h2>
            <p className="mt-2 text-xs text-ivory/70">
              Cette action est irréversible. L'article sera retiré de la base et du sitemap.
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
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Create Full Modal */}
      {isModalOpen && editingArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 overflow-y-auto">
          <div className="my-8 max-h-[90vh] w-full max-w-4xl overflow-y-auto border border-white/20 bg-ink-2 p-6 shadow-2xl md:p-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="eyebrow text-gold">Éditeur d'article</p>
                <h2 className="mt-1 font-display text-2xl text-ivory">
                  {editingArticle.title ? editingArticle.title : 'Nouvel article'}
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

            <form onSubmit={handleSave} className="mt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ivory/70">
                    Titre de l'article *
                    <input
                      required
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Numéro de pilier / Ordre
                    <input
                      type="text"
                      value={editingArticle.num}
                      onChange={(e) => setEditingArticle({ ...editingArticle, num: e.target.value })}
                      placeholder="01"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-ivory/70">
                    Slug URL *
                    <div className="mt-1.5 flex gap-2">
                      <input
                        required
                        type="text"
                        value={editingArticle.slug}
                        onChange={(e) => setEditingArticle({ ...editingArticle, slug: e.target.value })}
                        className="w-full border border-white/20 bg-ink px-3 py-2 font-mono text-xs text-ivory focus:border-gold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleSlugify}
                        className="shrink-0 border border-white/20 bg-ink px-3 py-1.5 text-xs text-ivory/70 hover:border-gold hover:text-gold"
                      >
                        Générer
                      </button>
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Temps de lecture
                    <input
                      type="text"
                      value={editingArticle.readingTime}
                      onChange={(e) => setEditingArticle({ ...editingArticle, readingTime: e.target.value })}
                      placeholder="7 min"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Catégorie
                    <select
                      value={editingArticle.category}
                      onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Statut de publication
                    <select
                      value={editingArticle.status}
                      onChange={(e) => setEditingArticle({ ...editingArticle, status: e.target.value as ContentStatus })}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                    >
                      <option value="Publié">Publié (visible et indexé)</option>
                      <option value="En cours">En cours (accessible en aperçu)</option>
                      <option value="Planifié">Planifié</option>
                      <option value="Brouillon">Brouillon (privé)</option>
                      <option value="Archivé">Archivé</option>
                    </select>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Audience cible
                  <input
                    type="text"
                    value={editingArticle.audience}
                    onChange={(e) => setEditingArticle({ ...editingArticle, audience: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Résumé / Excerpt *
                  <textarea
                    required
                    rows={3}
                    value={editingArticle.excerpt}
                    onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-sm leading-relaxed text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              <ImageField
                label="Image principale"
                imageUrl={editingArticle.coverImage}
                positionX={editingArticle.coverPositionX}
                positionY={editingArticle.coverPositionY}
                zoom={editingArticle.coverZoom}
                alt={editingArticle.coverAlt || editingArticle.seoTitle}
                onOpenEditor={() => setIsImageEditorOpen(true)}
              />

              {/* Outline / Plan */}
              <div className="border border-white/10 bg-ink/50 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase text-gold">Plan de l'article (Outline)</p>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingArticle({
                        ...editingArticle,
                        outline: [...editingArticle.outline, `Section ${editingArticle.outline.length + 1}`],
                      })
                    }
                    className="text-xs text-gold hover:underline"
                  >
                    + Ajouter une section
                  </button>
                </div>
                <div className="mt-3 space-y-2">
                  {editingArticle.outline.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="font-display text-sm text-gold/60">{index + 1}.</span>
                      <input
                        type="text"
                        value={item}
                        onChange={(e) => {
                          const nextOutline = [...editingArticle.outline]
                          nextOutline[index] = e.target.value
                          setEditingArticle({ ...editingArticle, outline: nextOutline })
                        }}
                        className="flex-1 border border-white/15 bg-ink px-2.5 py-1 text-xs text-ivory focus:border-gold focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const nextOutline = editingArticle.outline.filter((_, i) => i !== index)
                          setEditingArticle({ ...editingArticle, outline: nextOutline })
                        }}
                        className="text-xs text-crimson-2 hover:text-crimson"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-xs font-semibold text-ivory/70">
                  Mots-clés (séparés par des virgules)
                  <input
                    type="text"
                    value={editingArticle.keywords.join(', ')}
                    onChange={(e) =>
                      setEditingArticle({
                        ...editingArticle,
                        keywords: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
                      })
                    }
                    className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                  />
                </label>
              </div>

              {/* SEO Optimizer & SERP Preview */}
              <div className="border border-gold/40 bg-gold/5 p-5">
                <p className="eyebrow text-gold">Optimisation Référencement (SEO)</p>

                <div className="mt-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs text-ivory/80">
                      <span>Titre SEO (balise &lt;title&gt;)</span>
                      <span className={editingArticle.seoTitle?.length > 60 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                        {editingArticle.seoTitle?.length || 0} / 60 car.
                      </span>
                    </div>
                    <input
                      type="text"
                      value={editingArticle.seoTitle}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seoTitle: e.target.value })}
                      placeholder={editingArticle.title}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs text-ivory/80">
                      <span>Meta Description (cible : 120-165 caractères)</span>
                      <span
                        className={
                          (editingArticle.seoDescription?.length || 0) < 120 ||
                          (editingArticle.seoDescription?.length || 0) > 165
                            ? 'text-amber-400 font-bold'
                            : 'text-emerald-400 font-bold'
                        }
                      >
                        {editingArticle.seoDescription?.length || 0} car. (120-165)
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={editingArticle.seoDescription}
                      onChange={(e) => setEditingArticle({ ...editingArticle, seoDescription: e.target.value })}
                      placeholder={editingArticle.excerpt}
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs leading-relaxed text-ivory focus:border-gold focus:outline-none"
                    />
                  </div>

                  {/* Google Preview Snippet */}
                  <div className="mt-4 rounded bg-white p-3 text-left font-sans text-xs text-slate-800 shadow-sm">
                    <p className="text-[0.65rem] text-slate-500">https://hervenanfang.vercel.app &gt; journal &gt; {editingArticle.slug || 'slug'}</p>
                    <p className="text-sm font-medium text-blue-800 line-clamp-1">
                      {editingArticle.seoTitle || editingArticle.title || 'Titre de l’article'}
                    </p>
                    <p className="mt-0.5 text-[0.72rem] text-slate-600 line-clamp-2">
                      {editingArticle.seoDescription || editingArticle.excerpt || 'Description dans les résultats de recherche Google.'}
                    </p>
                  </div>
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
                  {saving ? 'Enregistrement…' : 'Enregistrer l’article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isImageEditorOpen && editingArticle && (
        <ImageEditor
          title={`Image — ${editingArticle.title || 'nouvel article'}`}
          value={{
            url: editingArticle.coverImage || '/og-image.jpg',
            positionX: editingArticle.coverPositionX ?? 50,
            positionY: editingArticle.coverPositionY ?? 50,
            zoom: editingArticle.coverZoom ?? 1,
            focalX: editingArticle.coverFocalX,
            focalY: editingArticle.coverFocalY,
            preset: editingArticle.coverPreset || 'original',
            alt: editingArticle.coverAlt || editingArticle.seoTitle || editingArticle.title,
          }}
          media={media}
          onUpload={onUploadMedia}
          onCancel={() => setIsImageEditorOpen(false)}
          onSave={(v: ImageEditorValue) => {
            setEditingArticle({
              ...editingArticle,
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
