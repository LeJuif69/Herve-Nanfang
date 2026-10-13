import React, { useRef, useState } from 'react'
import { IMAGE_PRESETS, imagePositionCss } from '../../lib/admin-types'
import type { AdminMedia } from '../../lib/admin-types'

export interface ImageEditorValue {
  url: string
  positionX: number
  positionY: number
  zoom: number
  focalX?: number
  focalY?: number
  preset: string
  alt: string
}

interface ImageEditorProps {
  title: string
  value: ImageEditorValue
  media: AdminMedia[]
  onSave: (v: ImageEditorValue) => void
  onCancel: () => void
  onUpload: (file: File, meta: { altText: string; caption?: string; tags?: string[] }) => Promise<AdminMedia>
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
  title,
  value,
  media,
  onSave,
  onCancel,
  onUpload,
}) => {
  const [url, setUrl] = useState(value.url)
  const [posX, setPosX] = useState(value.positionX ?? 50)
  const [posY, setPosY] = useState(value.positionY ?? 50)
  const [zoom, setZoom] = useState(value.zoom ?? 1)
  const [focalX, setFocalX] = useState<number | undefined>(value.focalX)
  const [focalY, setFocalY] = useState<number | undefined>(value.focalY)
  const [preset, setPreset] = useState(value.preset || 'original')
  const [alt, setAlt] = useState(value.alt || '')
  const [tab, setTab] = useState<'regler' | 'mediatheque' | 'upload'>('regler')
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadAlt, setUploadAlt] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const activePreset = IMAGE_PRESETS.find((p) => p.id === preset) ?? IMAGE_PRESETS[0]
  const positionCss = imagePositionCss({ positionX: posX, positionY: posY })

  const handlePreviewClick = (e: React.MouseEvent) => {
    const el = previewRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100, 0, 100)
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100, 0, 100)
    setFocalX(Math.round(x * 10) / 10)
    setFocalY(Math.round(y * 10) / 10)
    setPosX(Math.round(x))
    setPosY(Math.round(y))
  }

  const handleReset = () => {
    setPosX(50)
    setPosY(50)
    setZoom(1)
    setFocalX(undefined)
    setFocalY(undefined)
    setPreset('original')
  }

  const handlePickMedia = (m: AdminMedia) => {
    setUrl(m.url)
    if (!alt.trim()) setAlt(m.altText || '')
    // Ne pas écraser le cadrage en cours : l'usage garde son X/Y.
    // L'original MEDIA n'est jamais modifié ici.
  }

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    const files = fileRef.current?.files
    if (!files || !files[0]) return
    if (!uploadAlt.trim()) {
      setUploadError('Le texte alternatif est obligatoire pour téléverser.')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const created = await onUpload(files[0], {
        altText: uploadAlt.trim(),
        tags: ['Admin', 'Éditeur'],
      })
      setUrl(created.url)
      setAlt(created.altText)
      setTab('regler')
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Échec du téléversement.')
    } finally {
      setUploading(false)
    }
  }

  const canSave = url.trim().length > 0 && alt.trim().length > 2

  const renderPreviewImg = (extraClass = '', withFocal = false) => (
    <div className={`relative w-full overflow-hidden bg-ink ${extraClass}`}>
      {url ? (
        <img
          src={url}
          alt={alt || 'Aperçu'}
          draggable={false}
          className="h-full w-full object-cover"
          style={{ objectPosition: positionCss, transform: `scale(${zoom})` }}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs text-ivory/40">
          Aucune image sélectionnée
        </div>
      )}
      {withFocal && typeof focalX === 'number' && typeof focalY === 'number' && (
        <span
          className="pointer-events-none absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-gold/30 shadow-[0_0_12px_rgba(198,161,91,0.8)]"
          style={{ left: `${focalX}%`, top: `${focalY}%` }}
        >
          <span className="absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold" />
        </span>
      )}
    </div>
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 p-3 overflow-y-auto sm:p-4">
      <div className="my-6 max-h-[92vh] w-full max-w-5xl overflow-y-auto border border-white/20 bg-ink-2 shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-ink-2 px-5 py-4 md:px-7">
          <div>
            <p className="eyebrow text-gold">Éditeur visuel — cliquez sur l'image pour placer le sujet</p>
            <h2 className="mt-1 font-display text-xl text-ivory md:text-2xl">{title}</h2>
          </div>
          <button type="button" onClick={onCancel} className="border border-white/20 px-3 py-1.5 text-xs text-ivory/70 hover:border-gold hover:text-gold">
            ✕ Fermer
          </button>
        </div>

        <div className="border-b border-white/10">
          <div className="flex">
            {([
              ['regler', 'Régler'],
              ['mediatheque', `Remplacer (${media.length})`],
              ['upload', 'Téléverser'],
            ] as const).map(([id, label]) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={`border-b-2 px-4 py-3 text-xs font-semibold uppercase tracking-wider md:px-6 ${
                  tab === id ? 'border-gold text-gold' : 'border-transparent text-ivory/55 hover:text-ivory'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-[1.15fr_0.85fr] md:p-7">
          {/* Colonne aperçu */}
          <div>
            {tab === 'regler' && (
              <>
                <div
                  ref={previewRef}
                  role="button"
                  tabIndex={0}
                  aria-label="Cliquer pour placer le point focal sur le visage ou le sujet"
                  onClick={handlePreviewClick}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      setFocalX(50)
                      setFocalY(35)
                      setPosX(50)
                      setPosY(35)
                    }
                  }}
                  className={`relative w-full cursor-crosshair overflow-hidden border border-gold/40 bg-ink ${activePreset.aspect}`}
                  title="Cliquez sur le visage / sujet pour le garder visible"
                >
                  {url ? (
                    <img
                      src={url}
                      alt={alt || 'Aperçu'}
                      draggable={false}
                      className="h-full w-full select-none object-cover"
                      style={{ objectPosition: positionCss, transform: `scale(${zoom})` }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-ivory/40">
                      Allez dans Remplacer / Téléverser pour choisir une image
                    </div>
                  )}
                  {typeof focalX === 'number' && typeof focalY === 'number' && (
                    <span
                      className="pointer-events-none absolute z-10 flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                      style={{ left: `${focalX}%`, top: `${focalY}%` }}
                    >
                      <span className="absolute h-7 w-7 rounded-full border-2 border-gold bg-gold/25" />
                      <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_rgba(198,161,91,0.9)]" />
                    </span>
                  )}
                  <span className="pointer-events-none absolute left-2 top-2 rounded bg-ink/85 px-2 py-0.5 text-[0.62rem] uppercase tracking-wider text-gold">
                    ↓ cliquez le sujet · {Math.round(posX)}% / {Math.round(posY)}% · ×{zoom.toFixed(2)}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {IMAGE_PRESETS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPreset(p.id)}
                      className={`border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-wider ${
                        preset === p.id ? 'border-gold bg-gold text-ink' : 'border-white/15 text-ivory/60 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Aperçus contexte */}
                <p className="eyebrow mt-6 text-ivory/45">Aperçu selon le contexte du site</p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <div>
                    <p className="mb-1 text-[0.6rem] uppercase tracking-wider text-ivory/45">Carte</p>
                    {renderPreviewImg('aspect-[4/3] border border-white/10')}
                  </div>
                  <div>
                    <p className="mb-1 text-[0.6rem] uppercase tracking-wider text-ivory/45">Article 16:9</p>
                    {renderPreviewImg('aspect-video border border-white/10')}
                  </div>
                  <div>
                    <p className="mb-1 text-[0.6rem] uppercase tracking-wider text-ivory/45">Hero 21:9</p>
                    {renderPreviewImg('aspect-[21/9] border border-white/10')}
                  </div>
                  <div>
                    <p className="mb-1 text-[0.6rem] uppercase tracking-wider text-ivory/45">Mobile 4:5</p>
                    {renderPreviewImg('aspect-[4/5] border border-white/10')}
                  </div>
                </div>
              </>
            )}

            {tab === 'mediatheque' && (
              <div>
                <p className="text-xs text-ivory/60">
                  Sélectionnez une image existante. L'ancien fichier n'est jamais supprimé : seul le contenu pointe vers la nouvelle URL.
                </p>
                <div className="mt-4 grid max-h-[50vh] grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3">
                  {media.filter((m) => m.mimeType.startsWith('image/')).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handlePickMedia(m)}
                      className={`group overflow-hidden border text-left transition-colors ${
                        url === m.url ? 'border-gold' : 'border-white/10 hover:border-gold/60'
                      }`}
                    >
                      <div className="aspect-[4/3] w-full overflow-hidden bg-ink">
                        <img src={m.url} alt={m.altText} className="h-full w-full object-cover" loading="lazy" />
                      </div>
                      <div className="bg-ink p-2">
                        <p className="truncate text-[0.65rem] text-ivory/75">{m.filename}</p>
                        <p className="truncate text-[0.6rem] text-ivory/40">{m.altText}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {tab === 'upload' && (
              <form onSubmit={handleFileUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Nouveau fichier image
                    <input ref={fileRef} type="file" accept="image/*" className="mt-2 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory" />
                  </label>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-ivory/70">
                    Texte alternatif obligatoire *
                    <input
                      type="text"
                      value={uploadAlt}
                      onChange={(e) => setUploadAlt(e.target.value)}
                      placeholder="Visage, lieu, action visible sur la photo"
                      className="mt-1.5 w-full border border-white/20 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                    />
                  </label>
                </div>
                {uploadError && <p className="text-xs text-crimson-2">{uploadError}</p>}
                <button disabled={uploading} type="submit" className="btn btn-gold text-xs disabled:opacity-60">
                  {uploading ? 'Envoi…' : 'Téléverser et utiliser'}
                </button>
                <p className="text-[0.68rem] text-ivory/45">
                  Le fichier original est conservé tel quel dans le Storage. Le cadrage se règle ensuite dans l'onglet Régler.
                </p>
              </form>
            )}
          </div>

          {/* Colonne réglages */}
          <div className="space-y-5">
            <div className="border border-white/10 bg-ink p-4">
              <p className="eyebrow text-gold">Position du sujet</p>
              <label className="mt-3 block text-xs text-ivory/70">
                Horizontal X : {Math.round(posX)}%
                <input type="range" min={0} max={100} value={posX} onChange={(e) => setPosX(Number(e.target.value))} className="mt-1 w-full accent-[#c6a15b]" />
              </label>
              <label className="mt-3 block text-xs text-ivory/70">
                Vertical Y : {Math.round(posY)}%
                <input type="range" min={0} max={100} value={posY} onChange={(e) => setPosY(Number(e.target.value))} className="mt-1 w-full accent-[#c6a15b]" />
              </label>
              <label className="mt-3 block text-xs text-ivory/70">
                Zoom : ×{zoom.toFixed(2)}
                <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className="mt-1 w-full accent-[#c6a15b]" />
              </label>
              <div className="mt-3 flex flex-wrap gap-2 text-[0.65rem]">
                {[
                  ['Gauche', 20, posY],
                  ['Centre', 50, 50],
                  ['Droite', 80, posY],
                  ['Haut', posX, 20],
                  ['Bas', posX, 80],
                ].map(([label, x, y]) => (
                  <button
                    key={label as string}
                    type="button"
                    onClick={() => {
                      setPosX(x as number)
                      setPosY(y as number)
                    }}
                    className="border border-white/15 px-2 py-1 text-ivory/65 hover:border-gold hover:text-gold"
                  >
                    {label as string}
                  </button>
                ))}
              </div>
              <p className="mt-3 font-mono text-[0.65rem] text-ivory/45">
                CSS : object-position: {Math.round(posX)}% {Math.round(posY)}%;{zoom !== 1 ? ` zoom ×${zoom.toFixed(2)}` : ''}
              </p>
            </div>

            <div className="border border-white/10 bg-ink p-4">
              <p className="eyebrow text-gold">Métadonnées d'usage</p>
              <label className="mt-3 block text-xs font-semibold text-ivory/70">
                Texte alternatif (obligatoire) *
                <input
                  type="text"
                  value={alt}
                  onChange={(e) => setAlt(e.target.value)}
                  placeholder="Décrivez visage, lieu et action"
                  className="mt-1.5 w-full border border-white/20 bg-ink-2 px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
                />
              </label>
              {!alt.trim() || alt.trim().length < 3 ? (
                <p className="mt-1 text-[0.68rem] text-amber-400">Alt requis (3 caractères min) pour publier.</p>
              ) : (
                <p className="mt-1 text-[0.68rem] text-emerald-400">✓ Alt valide pour le SEO et l'accessibilité.</p>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={handleReset} className="border border-white/20 px-3 py-2 text-xs font-semibold uppercase text-ivory/70 hover:border-gold hover:text-gold">
                Réinitialiser
              </button>
              <button type="button" onClick={onCancel} className="btn btn-ghost text-xs">
                Annuler
              </button>
              <button
                type="button"
                disabled={!canSave}
                onClick={() => onSave({ url, positionX: Math.round(posX), positionY: Math.round(posY), zoom: Math.round(zoom * 100) / 100, focalX, focalY, preset, alt: alt.trim() })}
                className="btn btn-gold flex-1 justify-center text-xs disabled:opacity-50"
              >
                Enregistrer l'image
              </button>
            </div>
            <p className="text-[0.68rem] leading-relaxed text-ivory/45">
              Enregistré au niveau du contenu uniquement. Le fichier MEDIA d'origine n'est ni recadré ni supprimé et reste réutilisable ailleurs.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
