import { useEffect, useRef } from 'react'

/**
 * SoundWaveCanvas — Ondes acoustiques harmoniques cinétiques
 * Dessine des rubans sinusoïdaux dorés fluides évoquant les harmoniques
 * du piano et la résonance acoustique.
 * Respecte prefers-reduced-motion et interrompt le calcul si l'onglet est masqué.
 */
export default function SoundWaveCanvas({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Vérifier les préférences de mouvement réduit
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = canvas.offsetWidth)
    let height = (canvas.height = canvas.offsetHeight)
    let step = 0
    let mouseX = width / 2
    let isHovering = false

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      isHovering = true
    }

    const handleMouseLeave = () => {
      isHovering = false
    }

    window.addEventListener('resize', handleResize)
    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    // Configuration des 3 ondes harmoniques (Fréquences fondamentales et harmoniques)
    const waves = [
      { amplitude: 24, length: 0.007, speed: 0.02, color: 'rgba(198, 161, 91, 0.28)' },
      { amplitude: 16, length: 0.012, speed: 0.028, color: 'rgba(224, 190, 124, 0.20)' },
      { amplitude: 10, length: 0.018, speed: 0.035, color: 'rgba(245, 242, 234, 0.14)' },
    ]

    const render = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(render)
        return
      }

      ctx.clearRect(0, 0, width, height)
      step += 1

      const centerY = height * 0.72

      waves.forEach((w, waveIndex) => {
        ctx.beginPath()
        ctx.lineWidth = waveIndex === 0 ? 1.5 : 1
        ctx.strokeStyle = w.color

        for (let x = 0; x < width; x += 4) {
          // Modulation d'amplitude par la souris si survolée
          const distToMouse = Math.abs(x - mouseX)
          const mouseFactor = isHovering && distToMouse < 220 ? 1 + (1 - distToMouse / 220) * 0.8 : 1

          const y =
            centerY +
            Math.sin(x * w.length + step * w.speed) * w.amplitude * mouseFactor +
            Math.cos((x * 0.5 + step * 0.5) * w.length) * (w.amplitude * 0.3)

          if (x === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.stroke()
      })

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove)
        canvas.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}
