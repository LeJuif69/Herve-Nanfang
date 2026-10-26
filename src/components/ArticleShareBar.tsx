import { useState } from 'react'

interface ArticleShareBarProps {
  title: string
  excerpt?: string
  url?: string
  slug?: string
  variant?: 'inline' | 'card' | 'sidebar'
  className?: string
}

export default function ArticleShareBar({
  title,
  excerpt = '',
  url,
  slug,
  variant = 'card',
  className = '',
}: ArticleShareBarProps) {
  const [copied, setCopied] = useState(false)

  const shareUrl =
    url ||
    (typeof window !== 'undefined'
      ? window.location.href
      : `https://hervenanfang.vercel.app/journal/${slug || ''}`)

  const shareText = `*${title}*\n\n${excerpt ? `${excerpt}\n\n` : ''}👉 Lire l’analyse sur le site officiel :\n${shareUrl}`

  const handleCopyLink = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // Fallback
    }
  }

  const handleNativeShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title,
          text: excerpt || title,
          url: shareUrl,
        })
      } catch {
        // Ignorer l'annulation de l'utilisateur
      }
    } else {
      handleCopyLink()
    }
  }

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${title} — par Hervé Nanfang`)}&url=${encodeURIComponent(shareUrl)}`

  // -------------------------------------------------------------
  // VARIANT: SIDEBAR (Compact vertical)
  // -------------------------------------------------------------
  if (variant === 'sidebar') {
    return (
      <div className={`border border-white/10 bg-ink-2 p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <p className="eyebrow text-gold">Partager l’article</p>
          <span className="text-[0.62rem] uppercase tracking-wider text-ivory/40">1-clic</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-ivory/60">
          Diffusez cette analyse auprès de vos confrères et sur vos réseaux vérifiés.
        </p>

        <div className="mt-4 flex flex-col gap-2.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur WhatsApp"
            className="group flex items-center justify-between rounded border border-emerald-500/30 bg-emerald-950/20 px-3.5 py-2.5 text-xs text-emerald-400 transition-all hover:border-emerald-500 hover:bg-emerald-900/40 hover:text-emerald-300"
          >
            <span className="flex items-center gap-2.5 font-medium">
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp
            </span>
            <span className="text-[0.62rem] uppercase tracking-wider text-emerald-400/70 group-hover:text-emerald-300">
              Direct →
            </span>
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur LinkedIn"
            className="group flex items-center justify-between rounded border border-sky-500/30 bg-sky-950/20 px-3.5 py-2.5 text-xs text-sky-400 transition-all hover:border-sky-500 hover:bg-sky-900/40 hover:text-sky-300"
          >
            <span className="flex items-center gap-2.5 font-medium">
              <LinkedInIcon className="h-4 w-4" />
              LinkedIn
            </span>
            <span className="text-[0.62rem] uppercase tracking-wider text-sky-400/70 group-hover:text-sky-300">
              Pro →
            </span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur Facebook"
            className="group flex items-center justify-between rounded border border-blue-500/30 bg-blue-950/20 px-3.5 py-2.5 text-xs text-blue-400 transition-all hover:border-blue-500 hover:bg-blue-900/40 hover:text-blue-300"
          >
            <span className="flex items-center gap-2.5 font-medium">
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </span>
            <span className="text-[0.62rem] uppercase tracking-wider text-blue-400/70 group-hover:text-blue-300">
              Page →
            </span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Partager sur X"
            className="group flex items-center justify-between rounded border border-white/20 bg-white/5 px-3.5 py-2.5 text-xs text-ivory transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            <span className="flex items-center gap-2.5 font-medium">
              <XIcon className="h-3.5 w-3.5" />
              X (Twitter)
            </span>
            <span className="text-[0.62rem] uppercase tracking-wider text-ivory/50 group-hover:text-gold">
              Post →
            </span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            aria-label="Copier le lien"
            className="flex items-center justify-between rounded border border-gold/30 bg-gold/5 px-3.5 py-2.5 text-xs text-gold transition-all hover:border-gold hover:bg-gold/15 hover:text-gold-2 active:scale-[0.98]"
          >
            <span className="flex items-center gap-2.5 font-medium">
              {copied ? <CheckIcon className="h-4 w-4 text-emerald-400" /> : <LinkIcon className="h-4 w-4" />}
              {copied ? 'Lien copié dans le presse-papier !' : 'Copier l’adresse directe'}
            </span>
            <span className="text-[0.62rem] uppercase tracking-wider opacity-70">
              {copied ? '✓' : 'URL'}
            </span>
          </button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VARIANT: INLINE (En-tête discret)
  // -------------------------------------------------------------
  if (variant === 'inline') {
    return (
      <div
        className={`flex flex-wrap items-center justify-between gap-4 border-y border-white/10 py-4 ${className}`}
      >
        <span className="flex items-center gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold">
          <ShareIcon className="h-3.5 w-3.5" />
          Partager l’analyse :
        </span>

        <div className="flex flex-wrap items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Partager sur WhatsApp"
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-400 transition-all hover:border-emerald-400 hover:bg-emerald-900/50 hover:text-emerald-300"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" />
            <span>WhatsApp</span>
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Partager sur LinkedIn"
            className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-950/30 px-3 py-1 text-xs font-medium text-sky-400 transition-all hover:border-sky-400 hover:bg-sky-900/50 hover:text-sky-300"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
            <span>LinkedIn</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Partager sur Facebook"
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/40 bg-blue-950/30 px-3 py-1 text-xs font-medium text-blue-400 transition-all hover:border-blue-400 hover:bg-blue-900/50 hover:text-blue-300"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
            <span>Facebook</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Partager sur X"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs font-medium text-ivory/80 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold"
          >
            <XIcon className="h-3 w-3" />
            <span>X</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            title="Copier le lien direct"
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold transition-all hover:border-gold hover:bg-gold/20 hover:text-gold-2 active:scale-95"
          >
            {copied ? <CheckIcon className="h-3.5 w-3.5 text-emerald-400" /> : <LinkIcon className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copié !' : 'Copier'}</span>
          </button>
        </div>
      </div>
    )
  }

  // -------------------------------------------------------------
  // VARIANT: CARD (Grande boîte de fin d'article)
  // -------------------------------------------------------------
  return (
    <div
      className={`relative my-12 overflow-hidden rounded-xl border border-gold/35 bg-gradient-to-br from-ink-2 via-ink to-ink-2 p-7 shadow-2xl md:p-9 ${className}`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-block h-2 w-2 rounded-full bg-gold" />
            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-gold">
              Diffusion & Réseaux Vérifiés
            </span>
          </div>
          <h3 className="mt-3 font-display text-2xl leading-snug text-ivory md:text-3xl">
            Cette analyse vous a été utile ? Partagez-la.
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ivory/70">
            Aidez vos confrères artistes, arrangeurs et entrepreneurs culturels à s'approprier le
            cadre légal de l'IA et la protection de nos patrimoines musicaux.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-emerald-400 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-400 hover:bg-emerald-900/60 hover:text-emerald-300 active:translate-y-0"
          >
            <WhatsAppIcon className="h-4 w-4" />
            <span>WhatsApp</span>
          </a>

          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-lg border border-sky-500/40 bg-sky-950/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-sky-400 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-sky-400 hover:bg-sky-900/60 hover:text-sky-300 active:translate-y-0"
          >
            <LinkedInIcon className="h-4 w-4" />
            <span>LinkedIn</span>
          </a>

          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-lg border border-blue-500/40 bg-blue-950/40 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-blue-400 shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-400 hover:bg-blue-900/60 hover:text-blue-300 active:translate-y-0"
          >
            <FacebookIcon className="h-4 w-4" />
            <span>Facebook</span>
          </a>

          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 rounded-lg border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-ivory shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/15 hover:text-gold active:translate-y-0"
          >
            <XIcon className="h-3.5 w-3.5" />
            <span>X</span>
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-2.5 rounded-lg border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold/20 hover:text-gold-2 active:translate-y-0"
          >
            {copied ? <CheckIcon className="h-4 w-4 text-emerald-400" /> : <LinkIcon className="h-4 w-4" />}
            <span>{copied ? 'Lien copié !' : 'Copier le lien'}</span>
          </button>

          {typeof navigator !== 'undefined' && 'share' in navigator && (
            <button
              type="button"
              onClick={handleNativeShare}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-ink-3 px-3 py-2.5 text-xs font-medium text-ivory/70 transition-colors hover:border-gold hover:text-gold"
              title="Plus d'options de partage"
            >
              <ShareIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------
   ICÔNES OFFICIELLES SVG DES PLATES-FORMES
   ------------------------------------------------------------- */
function WhatsAppIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.476-.15-.677.15-.2.301-.777.978-.952 1.179-.175.2-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.894-.799-1.498-1.786-1.674-2.087-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.15-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.63-.928-2.232-.244-.587-.492-.507-.677-.517-.175-.01-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.029-1.053 2.509s1.078 2.91 1.228 3.111c.15.2 2.122 3.24 5.14 4.544.718.31 1.278.496 1.716.635.722.23 1.378.197 1.897.12.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.175-1.43-.075-.125-.276-.201-.577-.351z" />
      <path d="M12.004 2C6.48 2 2 6.478 2 12.002c0 1.905.534 3.688 1.464 5.215L2 22l4.931-1.432a9.96 9.96 0 0 0 5.073 1.434c5.524 0 10.004-4.478 10.004-10.002C22.008 6.478 17.528 2 12.004 2zm0 18.238c-1.634 0-3.14-.52-4.382-1.408l-.314-.225-2.923.85.867-2.846-.24-.334A8.214 8.214 0 0 1 3.766 12C3.766 7.46 7.464 3.762 12.004 3.762c4.54 0 8.238 3.698 8.238 8.24 0 4.54-3.698 8.236-8.238 8.236z" />
    </svg>
  )
}

function LinkedInIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9h2.76v8.37H6.46v-8.37M7.84 6.81a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24Z" />
    </svg>
  )
}

function FacebookIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
    </svg>
  )
}

function XIcon({ className = 'h-3.5 w-3.5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function CheckIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function ShareIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}
