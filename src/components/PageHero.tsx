import { type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Container, Eyebrow, Lead } from './ui'

/**
 * En-tête de page interne : hiérarchie éditoriale + fil d'Ariane.
 * Phase 6 — orbes plus riches, ligne d'accroche animée, accent décoratif clavier.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  breadcrumb,
  children,
}: {
  eyebrow: string
  title: ReactNode
  lead?: string
  breadcrumb: string
  children?: ReactNode
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/8 bg-ink pb-16 pt-32 md:pb-20 md:pt-40">
      {/* Motif clavier — clin d'œil à l'affiche */}
      <div
        aria-hidden
        className="keys-bg pointer-events-none absolute inset-y-0 right-0 hidden w-16 opacity-20 lg:block"
      />

      {/* Orbe principal — or diffus */}
      <div
        aria-hidden
        className="orb-gold pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] opacity-[0.07]"
      />

      {/* Orbe secondaire — plus petit, à droite */}
      <div
        aria-hidden
        className="orb-gold pointer-events-none absolute -right-20 bottom-0 h-48 w-48 opacity-[0.05]"
        style={{ animationDelay: '3s' }}
      />

      {/* Ligne de scan horizontale subtile */}
      <div
        aria-hidden
        className="scan-line pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden"
      />

      {/* Ligne dorée verticale décorative */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[max(2.5rem,5%)] top-0 w-px"
        style={{
          background:
            'linear-gradient(to bottom, transparent, rgba(198,161,91,0.25) 30%, rgba(198,161,91,0.1) 70%, transparent)',
        }}
      />

      <Container className="relative">
        {/* Fil d'Ariane */}
        <nav aria-label="Fil d'Ariane" className="mb-10 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.2em] text-ivory/35">
          <Link to="/" className="transition-colors hover:text-gold">
            Accueil
          </Link>
          <span aria-hidden>/</span>
          <span className="text-ivory/60">{breadcrumb}</span>
        </nav>

        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className="mt-7 max-w-4xl font-display text-[2.6rem] leading-[1.03] tracking-[-0.02em] text-ivory sm:text-5xl lg:text-6xl xl:text-[4.25rem]">
          {title}
        </h1>
        {lead && (
          <Lead className="mt-8 max-w-3xl">
            {lead}
          </Lead>
        )}
        {children && <div className="mt-10">{children}</div>}

        {/* Trait doré bas de hero */}
        <div
          aria-hidden
          className="hairline mt-14 max-w-xs opacity-60"
        />
      </Container>
    </section>
  )
}
