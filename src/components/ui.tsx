import { type ReactNode, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

/* ============================================================
   Primitives d'interface — Editorial Premium
   ============================================================ */

type Tone = 'dark' | 'light' | 'ivory' | 'ink'

export function Section({
  id,
  children,
  tone = 'dark',
  className = '',
  tight = false,
  bordered = true,
}: {
  id?: string
  children: ReactNode
  tone?: Tone
  className?: string
  tight?: boolean
  bordered?: boolean
}) {
  const tones: Record<Tone, string> = {
    dark: 'bg-ink text-ivory',
    'ink': 'bg-ink-2 text-ivory',
    light: 'bg-ivory text-ink',
    ivory: 'bg-ivory-2 text-ink',
  }
  return (
    <section
      id={id}
      className={`relative ${tones[tone]} ${tight ? 'py-16 md:py-20' : 'py-20 md:py-32'} ${
        bordered ? 'border-t border-white/5' : ''
      } ${className}`}
    >
      <div className="mx-auto w-full max-w-[86rem] px-6 md:px-10 lg:px-14">{children}</div>
    </section>
  )
}

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[86rem] px-6 md:px-10 lg:px-14 ${className}`}>{children}</div>
}

export function Eyebrow({
  children,
  tone = 'gold',
  className = '',
}: {
  children: ReactNode
  tone?: 'gold' | 'muted' | 'ink' | 'crimson'
  className?: string
}) {
  const tones = {
    gold: 'text-gold',
    muted: 'text-mineral',
    ink: 'text-ink/60',
    crimson: 'text-crimson',
  }
  return (
    <p className={`eyebrow flex items-center gap-3 ${tones[tone]} ${className}`}>
      <span aria-hidden className="inline-block h-px w-8 bg-current opacity-60" />
      {children}
    </p>
  )
}

export function Display({
  as: Tag = 'h2',
  size = 'lg',
  children,
  className = '',
}: {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p'
  size?: 'xl' | 'lg' | 'md' | 'sm'
  children: ReactNode
  className?: string
}) {
  const sizes = {
    xl: 'text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-7xl xl:text-[5.25rem]',
    lg: 'text-[2.15rem] leading-[1.06] sm:text-5xl lg:text-6xl',
    md: 'text-3xl leading-[1.12] sm:text-4xl lg:text-[2.75rem]',
    sm: 'text-2xl leading-tight sm:text-3xl',
  }
  return <Tag className={`font-display tracking-[-0.015em] ${sizes[size]} ${className}`}>{children}</Tag>
}

export function Lead({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-lg leading-relaxed text-ivory/75 md:text-xl md:leading-[1.7] ${className}`}>
      {children}
    </p>
  )
}

export function Body({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <p className={`text-[15px] leading-[1.85] text-ivory/65 md:text-base ${className}`}>{children}</p>
}

export function Rule({ className = '' }: { className?: string }) {
  return <div aria-hidden className={`hairline-full my-4 ${className}`} />
}

export function Btn({
  to,
  href,
  children,
  variant = 'gold',
  className = '',
  onClick,
}: {
  to?: string
  href?: string
  children: ReactNode
  variant?: 'gold' | 'ghost' | 'dark'
  className?: string
  onClick?: () => void
}) {
  const cls = `btn btn-${variant} ${className}`
  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick}>
        {children}
      </Link>
    )
  }
  if (href) {
    const external = href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')
    return (
      <a
        href={href}
        className={cls}
        target={external && href.startsWith('http') ? '_blank' : undefined}
        rel={external && href.startsWith('http') ? 'noopener noreferrer' : undefined}
        onClick={onClick}
      >
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {children}
    </button>
  )
}

/** Lien éditorial avec flèche */
export function ArrowLink({
  to,
  href,
  children,
  className = '',
}: {
  to?: string
  href?: string
  children: ReactNode
  className?: string
}) {
  const inner = (
    <>
      <span className="link-underline">{children}</span>
      <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  )
  const cls = `group inline-flex items-center gap-2 eyebrow text-gold hover:text-gold-2 ${className}`
  if (to)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    )
  return (
    <a href={href} className={cls}>
      {inner}
    </a>
  )
}

/** Apparition douce au défilement (respecte prefers-reduced-motion) */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(true)
      return
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          obs.disconnect()
        }
      },
      { threshold: 0.08, rootMargin: '0px 0px -6% 0px' },
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1000ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        shown
          ? 'translate-y-0 opacity-100 [filter:blur(0px)]'
          : 'translate-y-8 opacity-0 [filter:blur(4px)]'
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

/** Carte sombre bordée, avec halo lumineux réactif (Spotlight style Apple/Linear) et micro-lift */
export function Card({
  children,
  className = '',
  hover = true,
  tone = 'dark',
  spotlight = true,
}: {
  children: ReactNode
  className?: string
  hover?: boolean
  tone?: 'dark' | 'ivory'
  spotlight?: boolean
}) {
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!spotlight || !hover) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--spotlight-x', `${x}px`)
    e.currentTarget.style.setProperty('--spotlight-y', `${y}px`)
  }

  const base = tone === 'dark' ? 'border-white/10 bg-ink-2 text-ivory' : 'border-ink/10 bg-ivory text-ink'
  return (
    <div
      onMouseMove={handleMouseMove}
      className={`relative border ${base} p-7 md:p-8 ${
        hover
          ? 'transition-all duration-500 hover:border-gold/50 hover:-translate-y-[2px] hover:shadow-[0_8px_32px_-8px_rgba(212,175,55,0.15)]'
          : ''
      } ${spotlight && hover ? 'spotlight-card' : ''} ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}

/** Alias explicite pour les cartes immersives à projecteur lumineux */
export const SpotlightCard = Card

export function Tag({ children, tone = 'gold' }: { children: ReactNode; tone?: 'gold' | 'ink' | 'crimson' }) {
  const tones = {
    gold: 'border-gold/40 text-gold',
    ink: 'border-ink/25 text-ink/70',
    crimson: 'border-crimson/40 text-crimson',
  }
  return (
    <span
      className={`inline-block border px-3 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.2em] ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="border-t border-gold/30 pt-5">
      <p className="font-display text-4xl leading-none text-ivory md:text-5xl">{value}</p>
      <p className="mt-2 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-ivory/50">{label}</p>
    </div>
  )
}

/** Étiquette de section numérotée (01 — CRÉER) */
export function ChapterMark({ num, label }: { num: string; label: string }) {
  return (
    <div className="group flex items-baseline gap-4">
      <span className="font-display text-2xl text-gold/70">{num}</span>
      <span className="relative eyebrow text-ivory/45">
        <span
          aria-hidden
          className="absolute -bottom-1 left-0 h-px w-0 bg-gold/40 transition-all duration-700 group-hover:w-full"
        />
        {label}
      </span>
    </div>
  )
}

/** Bandeau d'appel à l'action pleine largeur */
export function CtaBand({
  eyebrow,
  title,
  text,
  primary,
  secondary,
}: {
  eyebrow: string
  title: string
  text: string
  primary: { label: string; to?: string; href?: string }
  secondary?: { label: string; to?: string; href?: string }
}) {
  return (
    <section className="relative overflow-hidden border-t border-gold/20 bg-ink-2">
      {/* Orbe principal */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-gold/8 blur-3xl"
      />
      {/* Orbe secondaire animé */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 animate-pulse rounded-full bg-gold/5 blur-2xl"
        style={{ animationDuration: '6s' }}
      />
      <Container className="relative py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div>
            <Eyebrow>{eyebrow}</Eyebrow>
            <Display size="md" className="mt-5 text-ivory">
              {title}
            </Display>
            <Lead className="mt-5 max-w-2xl">{text}</Lead>
          </div>
          <div className="flex flex-wrap gap-4 lg:justify-end">
            <Btn to={primary.to} href={primary.href} variant="gold">
              {primary.label}
            </Btn>
            {secondary && (
              <Btn to={secondary.to} href={secondary.href} variant="ghost">
                {secondary.label}
              </Btn>
            )}
          </div>
        </div>
      </Container>
    </section>
  )
}
