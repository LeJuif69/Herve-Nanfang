import React, { useState } from 'react'
import type { AdminMessage } from '../../lib/admin-types'

interface AdminMessagesProps {
  messages: AdminMessage[]
  onUpdateStatus: (id: string, status: 'nouveau' | 'en_cours' | 'traite' | 'archive', internalNotes?: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const ROUTE_LABELS: Record<string, string> = {
  booking: 'Booking Live & Concert',
  formation: 'Formation & Pédagogie',
  conference: 'Conférence & Masterclass',
  collaboration: 'Collaboration Artistique',
  presse: 'Presse & Média',
  conseil: 'Conseil & Stratégie',
}

export const AdminMessages: React.FC<AdminMessagesProps> = ({
  messages,
  onUpdateStatus,
  onDelete,
}) => {
  const [statusFilter, setStatusFilter] = useState('Tous')
  const [routeFilter, setRouteFilter] = useState('Toutes')
  const [search, setSearch] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null)
  const [notesInput, setNotesInput] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const filtered = messages.filter((m) => {
    if (statusFilter !== 'Tous' && m.status !== statusFilter) return false
    if (routeFilter !== 'Toutes' && m.route !== routeFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        (m.organization && m.organization.toLowerCase().includes(q)) ||
        m.body.toLowerCase().includes(q)
      )
    }
    return true
  })

  const handleSelectMessage = (msg: AdminMessage) => {
    setSelectedMessage(msg)
    setNotesInput(msg.internalNotes || '')
  }

  const handleSaveNotes = async () => {
    if (!selectedMessage) return
    await onUpdateStatus(selectedMessage.id, selectedMessage.status, notesInput)
    setSelectedMessage({ ...selectedMessage, internalNotes: notesInput })
  }

  const handleStatusChange = async (newStatus: 'nouveau' | 'en_cours' | 'traite' | 'archive') => {
    if (!selectedMessage) return
    await onUpdateStatus(selectedMessage.id, newStatus, notesInput)
    setSelectedMessage({ ...selectedMessage, status: newStatus })
  }

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col justify-between gap-4 border border-white/10 bg-ink-2 p-6 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow text-gold">Messagerie & Opportunités</p>
          <h1 className="mt-1 font-display text-3xl text-ivory">Messages reçus</h1>
          <p className="text-xs text-ivory/60">
            {messages.length} demandes au total ({messages.filter((m) => m.status === 'nouveau').length} non traitées).
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="grid gap-3 border border-white/10 bg-ink-2 p-4 sm:grid-cols-3">
        <div>
          <label htmlFor="msg-search" className="sr-only">Rechercher</label>
          <input
            id="msg-search"
            type="search"
            placeholder="Rechercher par expéditeur, email, texte…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-2 text-xs text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="msg-status-filter" className="sr-only">Statut</label>
          <select
            id="msg-status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          >
            <option value="Tous">Tous les statuts</option>
            <option value="nouveau">Nouveau</option>
            <option value="en_cours">En cours</option>
            <option value="traite">Traité</option>
            <option value="archive">Archivé</option>
          </select>
        </div>

        <div>
          <label htmlFor="msg-route-filter" className="sr-only">Parcours</label>
          <select
            id="msg-route-filter"
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
            className="w-full border border-white/15 bg-ink px-3 py-2 text-xs text-ivory focus:border-gold focus:outline-none"
          >
            <option value="Toutes">Tous les parcours</option>
            {Object.entries(ROUTE_LABELS).map(([k, label]) => (
              <option key={k} value={k}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Split layout: List on Left, Detail on Right */}
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        {/* Messages List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="border border-white/10 bg-ink-2 p-12 text-center text-xs text-ivory/40">
              Aucun message correspondant.
            </div>
          ) : (
            filtered.map((msg) => {
              const isSelected = selectedMessage?.id === msg.id
              return (
                <div
                  key={msg.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => handleSelectMessage(msg)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') handleSelectMessage(msg)
                  }}
                  className={`cursor-pointer border p-4 transition-all ${
                    isSelected
                      ? 'border-gold bg-gold/10'
                      : msg.status === 'nouveau'
                      ? 'border-crimson/40 bg-crimson/5 hover:border-crimson/80'
                      : 'border-white/10 bg-ink-2 hover:border-gold/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-base text-ivory">{msg.name}</span>
                    <span
                      className={`rounded px-2 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider ${
                        msg.status === 'nouveau'
                          ? 'bg-crimson/20 text-crimson-2'
                          : msg.status === 'en_cours'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-white/10 text-ivory/60'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-gold/80">
                    {ROUTE_LABELS[msg.route] || msg.route} {msg.organization ? `· ${msg.organization}` : ''}
                  </p>

                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ivory/70">
                    {msg.body}
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[0.68rem] text-ivory/45">
                    <span>{new Date(msg.createdAt).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                    <span>{msg.phone || msg.email}</span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Selected Message Detail View */}
        <div>
          {selectedMessage ? (
            <div className="sticky top-20 space-y-5 border border-white/15 bg-ink-2 p-6 shadow-xl">
              <div className="flex items-start justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="rounded bg-gold/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-gold">
                    {ROUTE_LABELS[selectedMessage.route] || selectedMessage.route}
                  </span>
                  <h2 className="mt-2 font-display text-2xl text-ivory">{selectedMessage.name}</h2>
                  {selectedMessage.organization && (
                    <p className="text-xs text-ivory/60">Structure : {selectedMessage.organization}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(selectedMessage.id)}
                  className="border border-crimson/40 bg-crimson/10 px-2.5 py-1 text-xs font-semibold text-crimson-2 hover:bg-crimson hover:text-white"
                >
                  Supprimer
                </button>
              </div>

              {/* Contact meta */}
              <div className="grid gap-2 border-b border-white/10 pb-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-ivory/50">Email :</span>
                  <a href={`mailto:${selectedMessage.email}`} className="text-gold hover:underline">
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-ivory/50">Téléphone / WhatsApp :</span>
                    <a
                      href={`https://wa.me/${selectedMessage.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Bonjour ${selectedMessage.name}, Hervé Nanfang à l'appareil suite à votre demande concernant ${
                          ROUTE_LABELS[selectedMessage.route] || 'votre projet'
                        }.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-emerald-400 hover:underline"
                    >
                      {selectedMessage.phone} ↗
                    </a>
                  </div>
                )}
                {selectedMessage.eventDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-ivory/50">Date envisagée :</span>
                    <span className="text-ivory">{selectedMessage.eventDate}</span>
                  </div>
                )}
                {selectedMessage.place && (
                  <div className="flex items-center justify-between">
                    <span className="text-ivory/50">Lieu / Ville :</span>
                    <span className="text-ivory">{selectedMessage.place}</span>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div>
                <p className="eyebrow text-gold/70">Message de la demande :</p>
                <div className="mt-2 whitespace-pre-wrap border border-white/10 bg-ink p-4 text-xs leading-relaxed text-ivory/85">
                  {selectedMessage.body}
                </div>
              </div>

              {/* Quick status change */}
              <div>
                <p className="eyebrow text-ivory/50">Changer le statut :</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['nouveau', 'en_cours', 'traite', 'archive'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`px-2.5 py-1 text-xs font-semibold uppercase tracking-wider transition-colors ${
                        selectedMessage.status === st
                          ? 'border border-gold bg-gold text-ink'
                          : 'border border-white/15 bg-ink text-ivory/60 hover:border-gold hover:text-gold'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Internal notes */}
              <div>
                <p className="eyebrow text-gold/70">Notes internes privées :</p>
                <textarea
                  rows={3}
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Notes de suivi, devis proposé, relances..."
                  className="mt-2 w-full border border-white/15 bg-ink px-3 py-2 text-xs leading-relaxed text-ivory focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  className="mt-2 inline-flex border border-white/20 px-3 py-1 text-[0.68rem] font-semibold uppercase text-ivory/80 hover:border-gold hover:text-gold"
                >
                  Enregistrer la note
                </button>
              </div>
            </div>
          ) : (
            <div className="border border-white/10 bg-ink-2 p-12 text-center text-xs text-ivory/40">
              Sélectionnez un message dans la liste pour afficher tous ses détails et y répondre.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-w-md border border-crimson/50 bg-ink-2 p-6 shadow-2xl">
            <p className="eyebrow text-crimson-2">Confirmation</p>
            <h2 className="mt-3 font-display text-2xl text-ivory">Supprimer ce message ?</h2>
            <p className="mt-2 text-xs text-ivory/70">
              Ce message sera définitivement supprimé de votre boîte de réception.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-ghost text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  onDelete(deleteConfirmId)
                  setDeleteConfirmId(null)
                  if (selectedMessage?.id === deleteConfirmId) {
                    setSelectedMessage(null)
                  }
                }}
                className="border border-crimson bg-crimson px-4 py-2 text-xs font-bold uppercase text-white hover:bg-crimson-2"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
