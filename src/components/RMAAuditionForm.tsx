import { useState, type FormEvent } from 'react'
import { SITE } from '../data/site'
import { adminStore } from '../lib/admin-store'
import { formatAttributionTag } from '../lib/utm-tracker'
import {
  trackContactMethodClick,
  trackFormStart,
  trackFormSubmitError,
  trackFormSubmitSuccess,
  trackLeadConversion,
} from '../lib/ad-pixels'

export default function RMAAuditionForm() {
  const [discipline, setDiscipline] = useState('Piano classique, jazz & musiques actuelles')
  const [profile, setProfile] = useState('Adulte (débutant ou reprise)')
  const [targetPalier, setTargetPalier] = useState('Permis A — Prendre ses marques (Blanc)')
  const [format, setFormat] = useState('Cours individuel régulier (Studio A Laiz Academy Yaoundé)')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [musicalGoals, setMusicalGoals] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendError, setSendError] = useState('')
  const [isCopied, setIsCopied] = useState(false)

  const summary = `CANDIDATURE & AUDITION — A LAIZ ACADEMY (EX-RMA)
--------------------------------------------------
Candidat : ${fullName || 'À préciser'}
Discipline : ${discipline}
Profil : ${profile}
Palier visé : ${targetPalier}
Format souhaité : ${format}
Téléphone / WhatsApp : ${phone || 'À préciser'}
Email : ${email || 'À préciser'}
Objectifs & motivations :
${musicalGoals || 'Non renseigné'}
--------------------------------------------------`

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    setSendError('')

    const tag = formatAttributionTag()
    const headerLines = tag ? [tag, '[CANDIDATURE AUDITION A LAIZ ACADEMY]'] : ['[CANDIDATURE AUDITION A LAIZ ACADEMY]']

    const bodyContent = [
      ...headerLines,
      `Discipline : ${discipline}`,
      `Profil : ${profile}`,
      `Palier visé : ${targetPalier}`,
      `Format : ${format}`,
      `Objectifs : ${musicalGoals || 'Non renseigné'}`,
    ].join('\n')

    const res = await adminStore.addIncomingMessage({
      name: fullName,
      email: email,
      phone: phone,
      route: 'formation',
      place: format,
      body: bodyContent,
    })

    setIsSending(false)
    if (res.ok) {
      trackFormSubmitSuccess('rma_audition_form', discipline)
      trackLeadConversion('rma_audition', { category: 'RMA Audition', route: discipline })
      setIsSuccess(true)
    } else {
      trackFormSubmitError('rma_audition_form', 'submission_failed')
      setSendError(
        "L’envoi direct n’a pas abouti. Votre candidature n'a pas pu être transmise au serveur : réessayez ou envoyez-la directement par WhatsApp."
      )
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 3000)
  }

  const rmaWhatsapp = SITE.phones[0]?.whatsapp || '237694723492'
  const whatsappLink = `https://wa.me/${rmaWhatsapp}?text=${encodeURIComponent(summary)}`

  return (
    <div
      className="rounded-2xl border border-gold/30 bg-ink-2/95 p-6 md:p-10 shadow-2xl backdrop-blur-xl"
      id="candidature-audition"
    >
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
        <div>
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-gold">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
            Inscriptions & Auditions Ouvertes
          </span>
          <h3 className="mt-2 font-display text-2xl text-ivory md:text-3xl">
            Candidature à l'Académie & Cursus Piano
          </h3>
          <p className="mt-2 text-xs text-ivory/70 max-w-xl leading-relaxed">
            Remplissez ce formulaire d'audition pour planifier votre séance d'évaluation diagnostique
            et déterminer votre palier d'entrée au sein du référentiel Permis de Jouer.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[0.68rem] uppercase tracking-wider text-ivory/50 block">Lieu des cours</span>
          <span className="font-mono text-xs font-semibold text-gold">Yaoundé, Cameroun & Distanciel</span>
        </div>
      </div>

      {isSuccess ? (
        <div className="mt-8 rounded-xl border border-gold bg-gold/10 p-8 text-center space-y-4">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink font-display text-2xl">
            ✓
          </span>
          <h4 className="font-display text-2xl text-ivory">Candidature enregistrée avec succès !</h4>
          <p className="text-xs text-ivory/75 max-w-lg mx-auto leading-relaxed">
            Merci <strong>{fullName}</strong>. Votre demande pour le cursus{' '}
            <strong className="text-gold">{discipline}</strong> a bien été transmise à l'équipe pédagogique de A Laiz Academy (RMA). Vous serez contacté sous 48h pour fixer la date de votre audition diagnostique.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              type="button"
              onClick={handleCopy}
              className="btn btn-outline text-xs uppercase tracking-wider px-4 py-2.5"
            >
              {isCopied ? '✓ Fiche copiée !' : 'Copier ma fiche de candidature'}
            </button>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackContactMethodClick('whatsapp', 'rma_audition')}
              className="btn btn-gold text-xs uppercase tracking-wider font-bold px-5 py-2.5 inline-flex items-center gap-2"
            >
              <span>Envoyer sur WhatsApp direct</span>
              <span>↗</span>
            </a>
            <button
              type="button"
              onClick={() => setIsSuccess(false)}
              className="text-xs uppercase tracking-wider text-ivory/50 hover:text-ivory px-3 py-2"
            >
              Modifier la demande
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          onFocus={() => trackFormStart('rma_audition_form', discipline)}
          className="mt-8 grid gap-6 md:grid-cols-2"
        >
          {/* 1. Discipline */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              1. Discipline instrumentale ou vocale
            </label>
            <select
              value={discipline}
              onChange={(e) => setDiscipline(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="Piano classique, jazz & musiques actuelles">Piano classique, jazz & musiques actuelles</option>
              <option value="Chant lead, technique vocale & gospel">Chant lead, technique vocale & gospel</option>
              <option value="Guitare acoustique, électrique & rythmiques africaines">Guitare acoustique, électrique & rythmiques africaines</option>
              <option value="Basse électrique & comping groove">Basse électrique & comping groove</option>
              <option value="Batterie & percussions traditionnelles">Batterie & percussions traditionnelles</option>
              <option value="Formation musicale générale, solfège & harmonie">Formation musicale générale, solfège & harmonie</option>
            </select>
          </div>

          {/* 2. Profil */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              2. Profil du candidat
            </label>
            <select
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="Enfant (6–11 ans) — Éveil et premiers pas">Enfant (6–11 ans) — Éveil et premiers pas</option>
              <option value="Adolescent (12–17 ans) — Pratique structurée">Adolescent (12–17 ans) — Pratique structurée</option>
              <option value="Adulte (débutant ou reprise)">Adulte (débutant ou reprise)</option>
              <option value="Musicien semi-professionnel — Perfectionnement">Musicien semi-professionnel — Perfectionnement</option>
              <option value="Enseignant ou professionnel — Masterclass & Curricula">Enseignant ou professionnel — Masterclass & Curricula</option>
            </select>
          </div>

          {/* 3. Palier Permis de Jouer */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              3. Palier visé au Permis de Jouer™
            </label>
            <select
              value={targetPalier}
              onChange={(e) => setTargetPalier(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="Permis A — Prendre ses marques (Blanc)">Permis A — Prendre ses marques (Blanc)</option>
              <option value="Permis B — Progresser avec méthode (Jaune)">Permis B — Progresser avec méthode (Jaune)</option>
              <option value="Permis C — Affirmer son identité (Orange)">Permis C — Affirmer son identité (Orange)</option>
              <option value="Permis D — Exercer son métier (Rouge)">Permis D — Exercer son métier (Rouge)</option>
              <option value="Évaluation libre lors de l'audition">Évaluation libre lors de l'audition</option>
            </select>
          </div>

          {/* 4. Format d'enseignement */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              4. Format d'apprentissage souhaité
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            >
              <option value="Cours individuel régulier (Studio A Laiz Academy Yaoundé)">Cours individuel régulier (Studio A Laiz Academy Yaoundé)</option>
              <option value="Cours intensif bimensuel (2h consécutives)">Cours intensif bimensuel (2h consécutives)</option>
              <option value="Atelier de groupe / Pratique collective">Atelier de groupe / Pratique collective</option>
              <option value="Accompagnement à distance / Visioconférence">Accompagnement à distance / Visioconférence</option>
            </select>
          </div>

          {/* 5. Coordonnées */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              5. Nom & Prénom de l'élève (ou parent référent)
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex : Samuel Eboa ou Marie Nanfang"
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder-ivory/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              6. Numéro WhatsApp (obligatoire pour confirmation)
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ex : +237 6XX XX XX XX"
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder-ivory/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              7. Adresse email de contact
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex : contact@domaine.com"
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder-ivory/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ivory/70 mb-2">
              8. Objectifs musicaux & Pratique actuelle
            </label>
            <textarea
              rows={3}
              value={musicalGoals}
              onChange={(e) => setMusicalGoals(e.target.value)}
              placeholder="Ex : Débutant souhaitant jouer du jazz et de la pop au piano, ou pianiste intermédiaire voulant apprendre les rythmes camerounais et l'improvisation..."
              className="w-full rounded-xl border border-white/15 bg-ink px-4 py-3 text-sm text-ivory placeholder-ivory/40 focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
            />
          </div>

          {sendError && (
            <div className="md:col-span-2 rounded-xl border border-crimson/50 bg-crimson/10 p-4 text-xs text-crimson-2 space-y-2">
              <p>{sendError}</p>
              <div className="pt-2">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline text-xs uppercase tracking-wider font-bold py-2 px-4 inline-flex items-center gap-2"
                >
                  <span>Envoyer ma fiche par WhatsApp direct</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          )}

          <div className="md:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
            <span className="text-xs text-ivory/50">
              Session d'audition gratuite sans engagement avant inscription.
            </span>

            <button
              type="submit"
              disabled={isSending}
              className="btn btn-gold text-xs uppercase tracking-wider font-bold py-3.5 px-8 w-full sm:w-auto disabled:opacity-50"
            >
              {isSending ? 'Transmission en cours…' : 'Envoyer ma candidature d\'audition ↗'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
