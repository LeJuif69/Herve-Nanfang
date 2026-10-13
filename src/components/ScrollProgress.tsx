import { useEffect, useState } from 'react'

/**
 * Barre de défilement dorée ultra-fine (Scroll Progress)
 * Affiche discrètement la progression de la lecture le long de la page
 * avec un dégradé or chaud haute fidélité.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let ticking = false

    const updateScrollProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      if (scrollHeight > 0) {
        const currentProgress = (window.scrollY / scrollHeight) * 100
        setProgress(Math.min(100, Math.max(0, currentProgress)))
      }
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollProgress)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    updateScrollProgress()

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-gold-3 via-gold to-gold-2 shadow-[0_0_8px_rgba(198,161,91,0.5)] transition-transform duration-75 ease-out"
        style={{
          transform: `scaleX(${progress / 100})`,
          transformOrigin: 'left',
          opacity: progress > 0.5 ? 1 : 0,
        }}
      />
    </div>
  )
}
