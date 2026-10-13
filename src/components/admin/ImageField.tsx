import React from 'react'
import { imagePositionCss } from '../../lib/admin-types'

interface ImageFieldProps {
  label: string
  imageUrl?: string
  positionX?: number
  positionY?: number
  zoom?: number
  alt?: string
  onOpenEditor: () => void
}

export const ImageField: React.FC<ImageFieldProps> = ({
  label,
  imageUrl,
  positionX,
  positionY,
  zoom,
  alt,
  onOpenEditor,
}) => {
  const posCss = imagePositionCss({ positionX, positionY })
  return (
    <div className="border border-white/10 bg-ink/50 p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase text-gold">{label} — cliquer pour éditer</p>
        <span className="font-mono text-[0.62rem] text-ivory/45">
          {Math.round(positionX ?? 50)}% / {Math.round(positionY ?? 50)}%{zoom && zoom !== 1 ? ` · ×${zoom}` : ''}
        </span>
      </div>
      <button
        type="button"
        onClick={onOpenEditor}
        className="group relative mt-3 block w-full overflow-hidden border border-white/15 bg-ink text-left hover:border-gold"
        title="Ouvrir l'éditeur visuel : remplacer, repositionner, zoom, point focal"
      >
        {imageUrl ? (
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={imageUrl}
              alt={alt || 'Aperçu'}
              className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
              style={{ objectPosition: posCss, transform: zoom && zoom !== 1 ? `scale(${zoom})` : undefined }}
            />
          </div>
        ) : (
          <div className="flex aspect-video w-full items-center justify-center text-xs text-ivory/40">
            + Ajouter une image (médiathèque ou téléversement)
          </div>
        )}
        <span className="absolute bottom-2 right-2 rounded bg-ink/90 px-2 py-1 text-[0.62rem] font-bold uppercase tracking-wider text-gold opacity-90 group-hover:bg-gold group-hover:text-ink">
          ✎ Éditer l'image
        </span>
      </button>
      {alt && <p className="mt-2 truncate text-[0.68rem] text-ivory/55" title={alt}>Alt : {alt}</p>}
    </div>
  )
}
