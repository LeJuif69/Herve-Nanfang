import { useState } from 'react'
import { IDENTITY } from '../data/identity'
import { Body, Card, ChapterMark, Display, Eyebrow, Reveal, Rule, Section } from './ui'

/**
 * Kit presse — biographies de référence en trois longueurs.
 * Permet à un journaliste, un programmateur ou un partenaire de copier un texte
 * exact, identique à celui du site : c'est ce qui construit la cohérence
 * de l'identité numérique (voir docs/IDENTITE-VISUELLE.md).
 */

const BIOS = [
  {
    id: 'mini',
    label: 'Signature',
    usage: 'Bio de profil, réseaux sociaux, pied de lettre, carte de visite.',
    longueur: `${IDENTITY.bios.mini.split(' ').length} mots`,
    texte: IDENTITY.bios.mini,
  },
  {
    id: 'court',
    label: 'Biographie courte',
    usage: 'Présentation d’intervenant, dossier de presse, page partenaire.',
    longueur: `${IDENTITY.bios.court.split(' ').length} mots`,
    texte: IDENTITY.bios.court,
  },
  {
    id: 'moyenne',
    label: 'Biographie moyenne',
    usage: 'Dossier de presse, programme de festival, présentation de concert.',
    longueur: `${IDENTITY.bios.moyenne.split(' ').length} mots`,
    texte: IDENTITY.bios.moyenne,
  },
  {
    id: 'long',
    label: 'Biographie longue',
    usage: 'Presse écrite, podcast, programme de festival, dossier institutionnel.',
    longueur: `${IDENTITY.bios.long.split(' ').length} mots`,
    texte: IDENTITY.bios.long,
  },
]

export default function PressKit() {
  const [copie, setCopie] = useState<string | null>(null)

  async function copier(id: string, texte: string) {
    try {
      await navigator.clipboard.writeText(texte)
      setCopie(id)
      window.setTimeout(() => setCopie(null), 2200)
    } catch {
      setCopie(null)
    }
  }

  return (
    <Section tone="dark" id="presse">
      <Reveal>
        <ChapterMark num="03" label="Presse & références" />
        <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-end">
          <Display size="md">
            Éléments de référence
            <br />
            pour la presse et les partenaires
          </Display>
          <Body className="lg:pb-3">
            Trois biographies, une description de référence et les coordonnées professionnelles.
            Ces textes sont ceux utilisés sur le site : les reprendre à l’identique garantit la
            cohérence de l’identité numérique d’Hervé Nanfang sur tous les supports.
          </Body>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <div className="mt-12 border border-gold/30 bg-ink-2 p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Eyebrow>Description de référence</Eyebrow>
            <button
              type="button"
              onClick={() => copier('ref', IDENTITY.referenceDescription)}
              className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-gold hover:text-gold-2"
            >
              {copie === 'ref' ? '✓ Copié' : 'Copier'}
            </button>
          </div>
          <p className="mt-5 font-display text-xl leading-snug text-ivory md:text-2xl">
            {IDENTITY.referenceDescription}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.18em] text-ivory/35">
            À utiliser telle quelle sur Facebook, YouTube, LinkedIn, Threads et tout dossier presse.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
        {BIOS.map((b, i) => (
          <Reveal key={b.id} delay={i * 90}>
            <Card className="flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-2xl text-ivory">{b.label}</h3>
                  <p className="mt-2 text-[0.62rem] uppercase tracking-[0.18em] text-gold/70">
                    {b.longueur}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => copier(b.id, b.texte)}
                  className="shrink-0 border border-white/15 px-3 py-2 text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-ivory/60 hover:border-gold/60 hover:text-gold"
                >
                  {copie === b.id ? '✓ Copié' : 'Copier'}
                </button>
              </div>
              <Rule className="opacity-40" />
              <p className="mt-4 flex-1 text-sm leading-[1.85] text-ivory/70">{b.texte}</p>
              <p className="mt-5 text-[0.68rem] uppercase tracking-[0.16em] text-ivory/35">
                {b.usage}
              </p>
            </Card>
          </Reveal>
        ))}
      </div>

      <Reveal delay={140}>
        <div className="mt-10 grid gap-px border border-white/8 bg-white/8 md:grid-cols-4">
          {[
            { t: 'Nom', d: 'Toujours « Hervé Nanfang », sans variante.' },
            { t: 'Portrait', d: 'Une seule photo de référence, identique partout.' },
            { t: 'Lien', d: 'hervenanfang.vercel.app vers lequel pointent toutes les plateformes.' },
            { t: 'Marques', d: 'Toujours rattachées : « un projet de Hervé Nanfang ».' },
          ].map((item) => (
            <div key={item.t} className="bg-ink-2 p-7">
              <p className="eyebrow text-gold">{item.t}</p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/60">{item.d}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
