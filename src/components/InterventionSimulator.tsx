import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CONFERENCES,
  CONFERENCE_AUDIENCES,
  INTERVENTION_FORMATS,
} from '../data/conferences'

export default function InterventionSimulator() {
  const [selectedConferenceId, setSelectedConferenceId] = useState<string>(CONFERENCES[0].id)
  const [selectedFormatId, setSelectedFormatId] = useState<string>(INTERVENTION_FORMATS[0].id)
  const [audienceType, setAudienceType] = useState<string>(CONFERENCE_AUDIENCES[0])
  const [modality, setModality] = useState<'presentiel' | 'hybride' | 'distanciel'>('presentiel')
  const [language, setLanguage] = useState<'fr' | 'en' | 'bilingual'>('fr')
  const [locationCity, setLocationCity] = useState<string>('')
  const [isCopied, setIsCopied] = useState<boolean>(false)

  const selectedConference = CONFERENCES.find((c) => c.id === selectedConferenceId) || CONFERENCES[0]
  const selectedFormat = INTERVENTION_FORMATS.find((f) => f.id === selectedFormatId) || INTERVENTION_FORMATS[0]

  const summaryText = `DEMANDE D'INTERVENTION — HERVÉ NANFANG
--------------------------------------------------
Thème : ${selectedConference.title}
Domaine : ${selectedConference.theme}
Format : ${selectedFormat.label} (${selectedFormat.duration})
Structure : ${audienceType}
Modalité : ${modality === 'presentiel' ? 'Présentiel sur site' : modality === 'hybride' ? 'Format Hybride' : 'Visioconférence / Distanciel'}
Langue : ${language === 'fr' ? 'Français' : language === 'en' ? 'Anglais' : 'Bilingue Français / Anglais'}
Lieu / Ville envisagée : ${locationCity || 'À préciser'}
Objectifs visés :
- ${selectedConference.objectives.join('\n- ')}
Besoins techniques recommandés :
${selectedConference.techRequirements}
--------------------------------------------------`

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  return (
    <div className="rounded-2xl border border-gold/30 bg-ink-2/90 p-6 md:p-10 shadow-2xl backdrop-blur-xl" id="simulateur">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-gold">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Module Interactif · Cadrage & Devis
          </span>
          <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
            Composer votre demande d'intervention
          </h3>
          <p className="mt-2 text-xs text-ivory/70 max-w-xl leading-relaxed">
            Configurez les paramètres de votre conférence ou masterclass pour obtenir une estimation
            des modalités pédagogiques, du temps requis et de la fiche technique adaptée.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[0.68rem] uppercase tracking-wider text-ivory/50 block">Réactivité</span>
          <span className="font-mono text-xs font-semibold text-gold">Réponse sous 48h ouvrées</span>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Colonne Paramètres */}
        <div className="space-y-6">
          {/* 1. Thème de conférence */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              1. Thème d'intervention souhaité
            </label>
            <select
              value={selectedConferenceId}
              onChange={(e) => setSelectedConferenceId(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              {CONFERENCES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.theme} — « {c.title} »
                </option>
              ))}
            </select>
            <p className="mt-2 text-xs text-ivory/50 italic">
              {selectedConference.pitch}
            </p>
          </div>

          {/* 2. Format & Durée */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              2. Format de session
            </label>
            <div className="grid gap-2 sm:grid-cols-2">
              {INTERVENTION_FORMATS.map((f) => {
                const isSelected = selectedFormatId === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFormatId(f.id)}
                    className={`flex flex-col items-start rounded-xl border p-3.5 text-left transition-all ${
                      isSelected
                        ? 'border-gold bg-gold/15 text-gold'
                        : 'border-white/10 bg-white/5 text-ivory/70 hover:border-gold/40 hover:text-ivory'
                    }`}
                  >
                    <span className="text-xs font-semibold">{f.label}</span>
                    <span className="mt-1 font-mono text-[0.68rem] text-gold/80">{f.duration}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* 3. Type d'organisme & Modalité */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
                3. Type d'établissement
              </label>
              <select
                value={audienceType}
                onChange={(e) => setAudienceType(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                {CONFERENCE_AUDIENCES.map((aud) => (
                  <option key={aud} value={aud}>
                    {aud}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
                4. Modalité & Déplacement
              </label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as 'presentiel' | 'hybride' | 'distanciel')}
                className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              >
                <option value="presentiel">Présentiel sur site</option>
                <option value="hybride">Format Hybride (Salle + Stream)</option>
                <option value="distanciel">Visioconférence / Webinaire interactif</option>
              </select>
            </div>
          </div>

          {/* 4. Langue & Ville */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
                5. Langue de travail
              </label>
              <div className="flex gap-2">
                {[
                  { id: 'fr', label: 'Français' },
                  { id: 'en', label: 'English' },
                  { id: 'bilingual', label: 'Bilingue' },
                ].map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLanguage(l.id as 'fr' | 'en' | 'bilingual')}
                    className={`flex-1 rounded-lg border py-2.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                      language === l.id
                        ? 'border-gold bg-gold text-ink'
                        : 'border-white/10 bg-white/5 text-ivory/60 hover:text-ivory'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
                6. Ville / Pays envisagé
              </label>
              <input
                type="text"
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="Ex : Paris, Yaoundé, Genève, Abidjan..."
                className="w-full rounded-xl border border-white/15 bg-ink px-4 py-2.5 text-sm text-ivory placeholder-ivory/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
              />
            </div>
          </div>
        </div>

        {/* Colonne Récapitulatif & Fiche de cadrage */}
        <div className="flex flex-col justify-between rounded-xl border border-white/10 bg-ink p-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-white/8 pb-3">
              <span className="font-mono text-xs uppercase tracking-wider text-gold">
                Fiche de cadrage générée
              </span>
              <span className="rounded bg-white/5 px-2 py-0.5 text-[0.62rem] text-ivory/60">
                {selectedFormat.duration}
              </span>
            </div>

            <div>
              <p className="text-[0.68rem] uppercase tracking-wider text-ivory/40">Thème sélectionné</p>
              <h4 className="font-display text-lg text-ivory leading-snug mt-0.5">
                {selectedConference.title}
              </h4>
              <p className="mt-1 text-xs text-gold/80 font-mono">
                {selectedFormat.label} · {modality === 'presentiel' ? 'Sur site' : modality}
              </p>
            </div>

            {/* Objectifs pédagogiques de la fiche */}
            <div className="border-t border-white/8 pt-3">
              <p className="text-[0.68rem] uppercase tracking-wider text-ivory/40 mb-2">
                3 Objectifs clés assurés :
              </p>
              <ul className="space-y-1.5 text-xs text-ivory/75">
                {selectedConference.objectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-gold font-bold">✓</span>
                    <span className="leading-tight">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Livrables remis aux participants */}
            <div className="border-t border-white/8 pt-3">
              <p className="text-[0.68rem] uppercase tracking-wider text-ivory/40 mb-2">
                Supports & Livrables inclus :
              </p>
              <ul className="space-y-1 text-xs text-ivory/65">
                {selectedConference.deliverables.map((del, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="text-gold/70 font-mono text-[0.65rem]">✦</span>
                    <span>{del}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Fiche technique requise */}
            <div className="rounded border border-white/8 bg-white/5 p-3 text-[0.68rem] text-ivory/60">
              <span className="font-semibold text-gold block mb-1">Régie technique requise :</span>
              {selectedConference.techRequirements}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
            <Link
              to={`/contact?subject=conference&theme=${encodeURIComponent(selectedConference.title)}&format=${encodeURIComponent(selectedFormat.label)}#conference`}
              className="btn btn-gold w-full text-center py-3 text-xs uppercase tracking-wider font-bold block"
            >
              Finaliser la demande de réservation ↗
            </Link>

            <button
              type="button"
              onClick={handleCopy}
              className="w-full text-center text-xs uppercase tracking-wider text-ivory/60 hover:text-gold py-1.5 transition-colors"
            >
              {isCopied ? '✓ Fiche copiée dans le presse-papier !' : 'Copier le descriptif de cadrage'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
