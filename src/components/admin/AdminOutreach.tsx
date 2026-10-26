import React, { useState, useEffect } from 'react'

export interface OutreachTarget {
  id: string
  name: string
  role: string
  organization: string
  city: 'Douala' | 'Yaoundé' | 'Autre'
  phone: string
  status: 'a_contacter' | 'envoye' | 'en_discussion' | 'devis' | 'signe'
  notes?: string
  lastContactedAt?: string
}

const DEFAULT_TARGETS: OutreachTarget[] = [
  {
    id: 'tgt-1',
    name: 'Direction de la Restauration & Banquets',
    role: 'Directeur F&B',
    organization: 'Krystal Palace Douala',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-2',
    name: 'Direction Générale & Événements',
    role: 'Directeur Général',
    organization: 'Hôtel Akwa Palace',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-3',
    name: 'Responsable Événementiel & Banquets',
    role: 'Event Manager',
    organization: 'Star Land Hotel Bonapriso',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-4',
    name: 'Direction Restauration',
    role: 'Directeur F&B',
    organization: 'Pullman Douala Rabingha',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-5',
    name: 'Direction Banquets & Restauration',
    role: 'Directeur Restauration',
    organization: 'Hilton Yaoundé',
    city: 'Yaoundé',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-6',
    name: 'Direction Commerciale & Événements',
    role: 'Directeur Commercial',
    organization: 'Hôtel Mont Fébé',
    city: 'Yaoundé',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-7',
    name: 'Direction de l’Exploitation',
    role: 'Directeur Général',
    organization: 'Djeuga Palace Hôtel',
    city: 'Yaoundé',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-8',
    name: 'Secrétariat Événements & Cocktails',
    role: 'Responsable Protocole & Galas',
    organization: 'Chambre de Commerce / Club d’Affaires',
    city: 'Yaoundé',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-9',
    name: 'Direction Artistique & Événementielle',
    role: 'Wedding & Gala Planner',
    organization: 'Agence Événementielle Prestige (Douala/Ydé)',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
  },
  {
    id: 'tgt-10',
    name: 'Comité d’Organisation Galas Privés',
    role: 'Directeur de Soirée',
    organization: 'Club Élite & Réceptions d’Exception',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
  },
]

const STORAGE_KEY = 'hn_outreach_targets_v1'

interface AdminOutreachProps {
  showToast: (msg: string, type?: 'success' | 'error') => void
}

export const AdminOutreach: React.FC<AdminOutreachProps> = ({ showToast }) => {
  const [targets, setTargets] = useState<OutreachTarget[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : DEFAULT_TARGETS
    } catch {
      return DEFAULT_TARGETS
    }
  })

  const [cityFilter, setCityFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [customPhone, setCustomPhone] = useState<{ [id: string]: string }>({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTarget, setNewTarget] = useState<Omit<OutreachTarget, 'id'>>({
    name: '',
    role: '',
    organization: '',
    city: 'Douala',
    phone: '',
    status: 'a_contacter',
    notes: '',
  })

  // Synchroniser avec localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(targets))
    } catch {
      // ignore
    }
  }, [targets])

  // Contenus des campagnes de diffusion
  const RMA_POST_TEXT = `🎹 Pianistes, claviéristes et instrumentistes : maîtrisez-vous réellement les fondations harmoniques et polyrythmiques des musiques d'Afrique ?

Trop souvent, la pratique musicale reste cantonnée aux automatismes d'oreille ou à des approches théoriques déconnectées de la richesse de nos patrimoines (Makossa, Mangambeu, Bikutsi, Highlife, Jazz...).

À travers le Réseau Musical Africain (RMA) et la méthode Le Permis de Jouer™, nous ouvrons cette semaine 15 créneaux d'évaluation et de diagnostic d'audition gratuits pour :
✔️ Analyser votre aisance au clavier et votre compréhension harmonique.
✔️ Identifier précisément vos points de blocage technique et rythmique.
✔️ Vous orienter vers un parcours structuré adapté à vos ambitions artistiques.

Réservez votre créneau en 2 minutes via le formulaire dédié :
https://hervenanfang.vercel.app/rma?utm_source=social&utm_medium=post&utm_campaign=audition_rma_fev2026#audition

Les candidatures sont traitées par ordre d'arrivée afin de garantir la qualité de chaque échange.`

  const PIANOBARISTE_BROADCAST_TEXT = `Pour vos soirées d'exception, cocktails et réceptions de prestige, découvrez la signature Pianobariste™ par Hervé Nanfang : une scénographie acoustique vivante alliant grands standards de jazz, pop internationale et relectures élégantes des patrimoines africains.

Explorez l'univers et testez notre simulateur interactif :
https://hervenanfang.vercel.app/musique?utm_source=whatsapp&utm_medium=status&utm_campaign=pianobariste_2026`

  const getVipMessage = (t: OutreachTarget) => {
    return `Bonjour ${t.name},

Pour les soirées d'exception, dîners de gala et cocktails de prestige de ${t.organization}, je vous invite à découvrir la signature Pianobariste™ : une scénographie acoustique vivante alliant jazz, standards internationaux et relectures élégantes de nos patrimoines.

Vous pouvez écouter des extraits et configurer une scénographie adaptée à votre espace directement sur mon espace officiel :
👉 https://hervenanfang.vercel.app/musique?utm_source=whatsapp&utm_medium=outreach_vip&utm_campaign=pianobariste_2026

Je reste à votre disposition pour imaginer ensemble une ambiance sonore sur mesure pour vos prochaines réceptions.

Bien à vous,
Hervé Nanfang — Pianobariste™ & Compositeur
Directeur, Alaiz Creative System
Tél/WhatsApp : +237 6 78 57 15 28`
  }

  const handleUpdateStatus = (id: string, status: OutreachTarget['status']) => {
    setTargets((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status,
              lastContactedAt: status === 'envoye' ? new Date().toISOString() : t.lastContactedAt,
            }
          : t,
      ),
    )
    showToast('Statut mis à jour.')
  }

  const handleUpdatePhone = (id: string, phone: string) => {
    setTargets((prev) => prev.map((t) => (t.id === id ? { ...t, phone } : t)))
  }

  const handleOpenWhatsApp = (t: OutreachTarget) => {
    const phoneToUse = customPhone[t.id] ?? t.phone
    const cleanPhone = phoneToUse.replace(/[^0-9]/g, '')
    const msg = getVipMessage(t)
    const encoded = encodeURIComponent(msg)

    let url = ''
    if (cleanPhone) {
      url = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encoded}`
    } else {
      url = `https://api.whatsapp.com/send?text=${encoded}`
    }

    window.open(url, '_blank')
    handleUpdateStatus(t.id, 'envoye')
    showToast(`WhatsApp ouvert pour ${t.organization} (statut passé à "Envoyé")`)
  }

  const handleShareLinkedIn = (text: string, url: string) => {
    navigator.clipboard.writeText(text)
    showToast('Texte copié dans le presse-papiers ! Collez-le dans votre post LinkedIn.')
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank')
  }

  const handleShareFacebook = (text: string, url: string) => {
    navigator.clipboard.writeText(text)
    showToast('Texte copié dans le presse-papiers ! Collez-le dans votre publication Facebook.')
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(shareUrl, '_blank')
  }

  const handleShareWhatsAppBroadcast = (text: string) => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
    window.open(url, '_blank')
    showToast('WhatsApp ouvert pour diffusion.')
  }

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    showToast(`${label} copié dans le presse-papiers !`)
  }

  const handleAddTarget = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTarget.organization.trim()) {
      showToast('Veuillez indiquer le nom de l’établissement.', 'error')
      return
    }
    const created: OutreachTarget = {
      ...newTarget,
      id: `tgt-custom-${Date.now()}`,
    }
    setTargets((prev) => [created, ...prev])
    setShowAddModal(false)
    setNewTarget({
      name: '',
      role: '',
      organization: '',
      city: 'Douala',
      phone: '',
      status: 'a_contacter',
      notes: '',
    })
    showToast('Nouveau contact ajouté à votre carnet.')
  }

  // Filtrage
  const filteredTargets = targets.filter((t) => {
    if (cityFilter !== 'all' && t.city !== cityFilter) return false
    if (statusFilter !== 'all' && t.status !== statusFilter) return false
    return true
  })

  // Statistiques
  const totalCount = targets.length
  const sentCount = targets.filter((t) => t.status === 'envoye').length
  const discussionCount = targets.filter((t) => t.status === 'en_discussion').length
  const devisCount = targets.filter((t) => t.status === 'devis').length
  const signedCount = targets.filter((t) => t.status === 'signe').length

  return (
    <div className="space-y-10">
      {/* Header & KPI Summary */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-white/10 pb-6">
        <div>
          <h2 className="display-sm text-ivory">Centre de Diffusion & Prospection 1-Clic</h2>
          <p className="eyebrow text-gold mt-1">
            Génération immédiate de trafic qualifié — WhatsApp VIP & Réseaux Sociaux
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 rounded border border-gold/40 bg-gold/10 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gold hover:bg-gold hover:text-ink transition"
        >
          <span>＋</span> Ajouter un établissement
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="rounded-lg border border-white/10 bg-ink-2 p-4">
          <p className="text-xs uppercase tracking-wider text-ivory/50">Cibles Totales</p>
          <p className="font-mono text-2xl font-bold text-ivory mt-1">{totalCount}</p>
        </div>
        <div className="rounded-lg border border-gold/30 bg-gold/5 p-4">
          <p className="text-xs uppercase tracking-wider text-gold">Messages Envoyés</p>
          <p className="font-mono text-2xl font-bold text-gold mt-1">{sentCount}</p>
        </div>
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-xs uppercase tracking-wider text-amber-400">En Discussion</p>
          <p className="font-mono text-2xl font-bold text-amber-400 mt-1">{discussionCount}</p>
        </div>
        <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
          <p className="text-xs uppercase tracking-wider text-blue-400">Devis Émis</p>
          <p className="font-mono text-2xl font-bold text-blue-400 mt-1">{devisCount}</p>
        </div>
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs uppercase tracking-wider text-emerald-400">Contrats Signés</p>
          <p className="font-mono text-2xl font-bold text-emerald-400 mt-1">{signedCount}</p>
        </div>
      </div>

      {/* SECTION 1 : DIFFUSION RÉSEAUX SOCIAUX & STATUTS */}
      <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-gold/20 pb-4">
          <div>
            <h3 className="font-serif text-xl font-bold text-gold">
              1. Campagnes Réseaux Sociaux & Statuts WhatsApp (1-Clic)
            </h3>
            <p className="text-xs text-ivory/70 mt-1">
              Partagez instantanément les messages avec liens traqués (UTM) pour enregistrer les sources dans votre boîte de réception.
            </p>
          </div>
          <span className="rounded bg-gold/20 px-2.5 py-1 text-xs font-mono text-gold uppercase tracking-wider">
            Attribution Active
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Campagne RMA */}
          <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-ink p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-mono text-amber-400 uppercase">
                  Pédagogie & Audition RMA
                </span>
                <span className="text-xs text-ivory/50">Cible : Musiciens & Élèves</span>
              </div>
              <h4 className="font-semibold text-ivory mt-2">15 Auditions Gratuites Diagnostic RMA</h4>
              <p className="text-xs text-ivory/70 line-clamp-4 mt-2 font-mono whitespace-pre-wrap bg-ink-2 p-3 rounded border border-white/5">
                {RMA_POST_TEXT}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() =>
                  handleShareLinkedIn(
                    RMA_POST_TEXT,
                    'https://hervenanfang.vercel.app/rma?utm_source=social&utm_medium=post&utm_campaign=audition_rma_fev2026#audition',
                  )
                }
                className="flex-1 rounded border border-[#0A66C2]/50 bg-[#0A66C2]/20 px-3 py-2 text-xs font-medium text-white hover:bg-[#0A66C2] transition"
              >
                LinkedIn 1-Clic
              </button>
              <button
                type="button"
                onClick={() =>
                  handleShareFacebook(
                    RMA_POST_TEXT,
                    'https://hervenanfang.vercel.app/rma?utm_source=social&utm_medium=post&utm_campaign=audition_rma_fev2026#audition',
                  )
                }
                className="flex-1 rounded border border-[#1877F2]/50 bg-[#1877F2]/20 px-3 py-2 text-xs font-medium text-white hover:bg-[#1877F2] transition"
              >
                Facebook 1-Clic
              </button>
              <button
                type="button"
                onClick={() => handleShareWhatsAppBroadcast(RMA_POST_TEXT)}
                className="flex-1 rounded border border-[#25D366]/50 bg-[#25D366]/20 px-3 py-2 text-xs font-medium text-white hover:bg-[#25D366] transition"
              >
                WhatsApp 1-Clic
              </button>
              <button
                type="button"
                onClick={() => handleCopyText(RMA_POST_TEXT, 'Texte RMA')}
                className="rounded border border-white/20 bg-white/5 px-3 py-2 text-xs text-ivory hover:bg-white/10 transition"
              >
                Copier
              </button>
            </div>
          </div>

          {/* Campagne Pianobariste */}
          <div className="flex flex-col justify-between rounded-lg border border-white/10 bg-ink p-5 space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="rounded bg-gold/20 px-2 py-0.5 text-xs font-mono text-gold uppercase">
                  Le Pianobariste™
                </span>
                <span className="text-xs text-ivory/50">Cible : Salons, Hôtels, Cocktails</span>
              </div>
              <h4 className="font-semibold text-ivory mt-2">Signature Live & Simulateur d’Événement</h4>
              <p className="text-xs text-ivory/70 line-clamp-4 mt-2 font-mono whitespace-pre-wrap bg-ink-2 p-3 rounded border border-white/5">
                {PIANOBARISTE_BROADCAST_TEXT}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() =>
                  handleShareLinkedIn(
                    PIANOBARISTE_BROADCAST_TEXT,
                    'https://hervenanfang.vercel.app/musique?utm_source=social&utm_medium=post&utm_campaign=pianobariste_2026',
                  )
                }
                className="flex-1 rounded border border-[#0A66C2]/50 bg-[#0A66C2]/20 px-3 py-2 text-xs font-medium text-white hover:bg-[#0A66C2] transition"
              >
                LinkedIn 1-Clic
              </button>
              <button
                type="button"
                onClick={() =>
                  handleShareFacebook(
                    PIANOBARISTE_BROADCAST_TEXT,
                    'https://hervenanfang.vercel.app/musique?utm_source=social&utm_medium=post&utm_campaign=pianobariste_2026',
                  )
                }
                className="flex-1 rounded border border-[#1877F2]/50 bg-[#1877F2]/20 px-3 py-2 text-xs font-medium text-white hover:bg-[#1877F2] transition"
              >
                Facebook 1-Clic
              </button>
              <button
                type="button"
                onClick={() => handleShareWhatsAppBroadcast(PIANOBARISTE_BROADCAST_TEXT)}
                className="flex-1 rounded border border-[#25D366]/50 bg-[#25D366]/20 px-3 py-2 text-xs font-medium text-white hover:bg-[#25D366] transition"
              >
                WhatsApp 1-Clic
              </button>
              <button
                type="button"
                onClick={() => handleCopyText(PIANOBARISTE_BROADCAST_TEXT, 'Texte Pianobariste')}
                className="rounded border border-white/20 bg-white/5 px-3 py-2 text-xs text-ivory hover:bg-white/10 transition"
              >
                Copier
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2 : PROSPECTION DIRECTE WHATSAPP VIP */}
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-ivory">
              2. Carnet de Prospection WhatsApp VIP (Hôtels, Galas & Décideurs)
            </h3>
            <p className="text-xs text-ivory/60 mt-1">
              Chaque clic ouvre la discussion WhatsApp avec le message personnalisé pré-rempli et passe le statut à "Envoyé".
            </p>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="rounded border border-white/20 bg-ink-2 px-3 py-1.5 text-xs text-ivory"
            >
              <option value="all">Toutes les villes</option>
              <option value="Douala">Douala</option>
              <option value="Yaoundé">Yaoundé</option>
              <option value="Autre">Autres</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded border border-white/20 bg-ink-2 px-3 py-1.5 text-xs text-ivory"
            >
              <option value="all">Tous les statuts</option>
              <option value="a_contacter">À contacter</option>
              <option value="envoye">Message envoyé</option>
              <option value="en_discussion">En discussion</option>
              <option value="devis">Devis émis</option>
              <option value="signe">Contrat signé</option>
            </select>
          </div>
        </div>

        {/* Tableau des contacts */}
        <div className="overflow-x-auto rounded-xl border border-white/10 bg-ink-2 shadow-xl">
          <table className="w-full text-left text-sm text-ivory">
            <thead className="border-b border-white/10 bg-white/[0.03] text-xs uppercase tracking-wider text-ivory/60">
              <tr>
                <th className="px-5 py-4">Établissement & Ville</th>
                <th className="px-5 py-4">Contact & Rôle</th>
                <th className="px-5 py-4">Numéro WhatsApp</th>
                <th className="px-5 py-4">Statut & Étape</th>
                <th className="px-5 py-4 text-right">Action 1-Clic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTargets.map((t) => {
                const phoneVal = customPhone[t.id] ?? t.phone
                return (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ivory">{t.organization}</div>
                      <span className="inline-block mt-0.5 rounded bg-white/10 px-2 py-0.5 text-[11px] font-mono text-ivory/70">
                        {t.city}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-ivory/90">{t.name}</div>
                      <div className="text-xs text-ivory/50">{t.role}</div>
                    </td>
                    <td className="px-5 py-4">
                      <input
                        type="text"
                        placeholder="Ex: 237678571528"
                        value={phoneVal}
                        onChange={(e) => {
                          const val = e.target.value
                          setCustomPhone((prev) => ({ ...prev, [t.id]: val }))
                          handleUpdatePhone(t.id, val)
                        }}
                        className="w-36 rounded border border-white/10 bg-ink px-2.5 py-1.5 font-mono text-xs text-ivory placeholder:text-ivory/30 focus:border-gold/50 focus:outline-none"
                      />
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={t.status}
                        onChange={(e) =>
                          handleUpdateStatus(t.id, e.target.value as OutreachTarget['status'])
                        }
                        className={`rounded px-2.5 py-1.5 text-xs font-medium border focus:outline-none ${
                          t.status === 'signe'
                            ? 'border-emerald-500/50 bg-emerald-500/20 text-emerald-300'
                            : t.status === 'devis'
                            ? 'border-blue-500/50 bg-blue-500/20 text-blue-300'
                            : t.status === 'en_discussion'
                            ? 'border-amber-500/50 bg-amber-500/20 text-amber-300'
                            : t.status === 'envoye'
                            ? 'border-gold/50 bg-gold/20 text-gold'
                            : 'border-white/10 bg-white/5 text-ivory/60'
                        }`}
                      >
                        <option value="a_contacter">À contacter</option>
                        <option value="envoye">Message envoyé</option>
                        <option value="en_discussion">En discussion</option>
                        <option value="devis">Devis émis</option>
                        <option value="signe">Contrat signé</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleCopyText(getVipMessage(t), `Message pour ${t.organization}`)}
                        className="rounded border border-white/20 bg-white/5 px-2.5 py-1.5 text-xs text-ivory/80 hover:bg-white/10 transition"
                        title="Copier le message personnalisé"
                      >
                        Copier
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(t)}
                        className="inline-flex items-center gap-1.5 rounded border border-[#25D366]/50 bg-[#25D366]/20 px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#25D366] transition"
                      >
                        <span>WhatsApp 1-Clic</span>
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ajout Etablissement */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-xl border border-white/20 bg-ink-2 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h4 className="font-serif text-lg font-bold text-ivory">Ajouter un Établissement Cible</h4>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-ivory/60 hover:text-ivory text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddTarget} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">
                  Établissement / Organisation *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Hôtel La Falaise Bonanjo"
                  value={newTarget.organization}
                  onChange={(e) => setNewTarget({ ...newTarget, organization: e.target.value })}
                  className="w-full rounded border border-white/10 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold/50 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">
                    Ville
                  </label>
                  <select
                    value={newTarget.city}
                    onChange={(e) =>
                      setNewTarget({ ...newTarget, city: e.target.value as OutreachTarget['city'] })
                    }
                    className="w-full rounded border border-white/10 bg-ink px-3 py-2 text-sm text-ivory"
                  >
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">
                    Téléphone WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="237..."
                    value={newTarget.phone}
                    onChange={(e) => setNewTarget({ ...newTarget, phone: e.target.value })}
                    className="w-full rounded border border-white/10 bg-ink px-3 py-2 text-sm text-ivory font-mono focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">
                    Contact / Destinataire
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: M. le Directeur F&B"
                    value={newTarget.name}
                    onChange={(e) => setNewTarget({ ...newTarget, name: e.target.value })}
                    className="w-full rounded border border-white/10 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-ivory/70 mb-1">
                    Fonction / Rôle
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Responsable Événements"
                    value={newTarget.role}
                    onChange={(e) => setNewTarget({ ...newTarget, role: e.target.value })}
                    className="w-full rounded border border-white/10 bg-ink px-3 py-2 text-sm text-ivory focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded border border-white/20 bg-white/5 px-4 py-2 text-xs text-ivory hover:bg-white/10 transition"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="rounded border border-gold/40 bg-gold px-4 py-2 text-xs font-semibold text-ink uppercase tracking-wider hover:bg-gold-light transition"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
