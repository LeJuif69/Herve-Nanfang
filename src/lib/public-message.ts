import { isSupabaseConfigured, supabase } from './supabase'
import type { AdminMessage } from './admin-types'

export async function addPublicMessage(
  msg: Omit<AdminMessage, 'id' | 'status' | 'createdAt'>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!isSupabaseConfigured || !supabase) {
    return { ok: false, error: 'Réception en ligne indisponible (base non configurée).' }
  }

  try {
    const { error } = await supabase.from('messages').insert({
      route: msg.route,
      name: msg.name.trim(),
      email: msg.email.trim(),
      organization: msg.organization || null,
      phone: msg.phone || null,
      event_date: msg.eventDate || null,
      place: msg.place || null,
      body: msg.body.trim(),
      status: 'nouveau',
    })
    if (error) {
      console.warn('Supabase message insert error:', error)
      return { ok: false, error: error.message }
    }
    return { ok: true }
  } catch (err) {
    console.warn('Supabase message insert error:', err)
    return { ok: false, error: err instanceof Error ? err.message : 'Erreur réseau.' }
  }
}
