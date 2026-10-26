import React, { useEffect, useRef } from 'react'

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

interface AdSenseUnitProps {
  slot?: string
  format?: 'auto' | 'fluid' | 'rectangle'
  responsive?: boolean
  className?: string
}

export const AdSenseUnit: React.FC<AdSenseUnitProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
}) => {
  const adRef = useRef<HTMLModElement>(null)
  const isPushed = useRef(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (isPushed.current) return

    try {
      if (adRef.current && adRef.current.innerHTML === '') {
        ;(window.adsbygoogle = window.adsbygoogle || []).push({})
        isPushed.current = true
      }
    } catch (err) {
      // Les bloqueurs de pub ou l'attente d'approbation lèvent souvent une exception anodine
      console.debug('AdSense init notice:', err)
    }
  }, [])

  return (
    <div className={`my-8 overflow-hidden rounded border border-white/5 bg-ink-2/40 p-4 text-center ${className}`}>
      <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-ivory/30 mb-2">
        Annonce
      </span>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6623797864465522"
        data-ad-slot={slot || undefined}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  )
}

export default AdSenseUnit
