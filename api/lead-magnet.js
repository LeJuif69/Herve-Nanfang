/**
 * Vercel Serverless Function — /api/lead-magnet (POST)
 * Stack: Vite + React SPA hosted on Vercel.
 *
 * Gère deux opérations distinctes conformément à l'architecture marketing :
 * 1. Inscription Brevo (Création / mise à jour de contact dans une liste dédiée)
 *    - Segment 'journal' -> BREVO_LIST_JOURNAL_ID (tag: JOURNAL_SUBSCRIBER)
 *    - Segment 'booking' -> BREVO_LIST_BOOKING_ID (tag: PRO_BOOKING, uniquement si consentMarketing = true)
 *    - Supporte le Double Opt-In si BREVO_DOI_TEMPLATE_ID est configuré.
 * 2. Envoi transactionnel (remise immédiate du PDF ou accusé de réception).
 */

const BREVO_API_BASE = 'https://api.brevo.com/v3'
const RESEND_API_URL = 'https://api.resend.com/emails'
const FROM_EMAIL = 'contact@hervenanfang.art'
const FROM_NAME = 'Hervé Nanfang'

function corsHeaders(req) {
  const origin = req.headers.origin || 'https://hervenanfang.art'
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  }
}

/**
 * Inscription du contact dans Brevo (/v3/contacts ou /v3/contacts/doubleOptinConfirmation)
 */
async function subscribeBrevoContact({ email, name, phone, segment, source, apiKey, baseUrl }) {
  const isBooking = segment === 'booking'
  const listIdStr = isBooking
    ? process.env.BREVO_LIST_BOOKING_ID
    : process.env.BREVO_LIST_JOURNAL_ID

  const listId = listIdStr ? parseInt(listIdStr, 10) : null
  const doiTemplateIdStr = process.env.BREVO_DOI_TEMPLATE_ID
  const doiTemplateId = doiTemplateIdStr ? parseInt(doiTemplateIdStr, 10) : null

  const parts = name.trim().split(/\s+/)
  const prenom = parts[0] || name.trim()
  const nom = parts.slice(1).join(' ') || ''

  // 1. Si Double Opt-In configuré pour le Journal
  if (!isBooking && doiTemplateId && listId) {
    const doiPayload = {
      email,
      attributes: {
        PRENOM: prenom,
        NOM: nom,
        SOURCE: source || 'journal_lead_magnet',
        OPT_IN: true,
      },
      includeListIds: [listId],
      templateId: doiTemplateId,
      redirectionUrl: `${baseUrl}/thank-you`,
    }

    const doiRes = await fetch(`${BREVO_API_BASE}/contacts/doubleOptinConfirmation`, {
      method: 'POST',
      headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify(doiPayload),
    })

    if (doiRes.ok || doiRes.status === 204) {
      return { success: true, method: 'doi' }
    }
    // Si échec DOI (ex: template inexistant), fallback vers l'ajout direct ci-dessous
    console.warn('[brevo] DOI failed, fallback to standard contact creation')
  }

  // 2. Inscription directe /v3/contacts
  const contactPayload = {
    email,
    attributes: {
      PRENOM: prenom,
      NOM: nom,
      OPT_IN: true,
      SOURCE: source || (isBooking ? 'booking_form' : 'journal_lead_magnet'),
    },
    updateEnabled: true,
  }

  if (phone) {
    contactPayload.attributes.SMS = phone.replace(/[^0-9+]/g, '')
  }

  if (listId && !isNaN(listId)) {
    contactPayload.listIds = [listId]
  }

  const contactRes = await fetch(`${BREVO_API_BASE}/contacts`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(contactPayload),
  })

  // Brevo renvoie 201 Created ou 204 No Content (si updateEnabled), ou 400 si déjà présent
  if (!contactRes.ok && contactRes.status !== 400) {
    const errText = await contactRes.text()
    console.warn('[brevo] Contact creation warning:', contactRes.status, errText)
  }

  return { success: true, method: 'direct' }
}

/**
 * Envoi transactionnel de l'email avec le PDF via Brevo SMTP
 */
async function sendLeadMagnetEmailBrevo(email, name, pdfUrl, apiKey) {
  const payload = {
    sender: { name: FROM_NAME, email: FROM_EMAIL },
    to: [{ email, name }],
    subject: '🎁 Votre Guide du Musicien Augmenté™ — Hervé Nanfang',
    htmlContent: `
      <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
        <p>Bonjour ${name},</p>
        <p>Merci pour votre intérêt pour <strong>Les Carnets du Musicien Augmenté™</strong>.</p>
        <p>Vous pouvez télécharger votre guide complet immédiatement en cliquant sur le lien ci-dessous :</p>
        <p style="margin: 24px 0;">
          <a href="${pdfUrl}" style="background-color: #c6a15b; color: #08080a; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 6px;">
            Télécharger le Guide PDF →
          </a>
        </p>
        <p style="font-size: 13px; color: #666;">
          Ce livrable expose ma démarche méthodologique entre scène, studio et transmission pédagogique (A Laiz Academy / Permis de Jouer™).
        </p>
        <p>À très bientôt,<br/><strong>Hervé Nanfang</strong></p>
      </div>
    `,
  }
  const res = await fetch(`${BREVO_API_BASE}/smtp/email`, {
    method: 'POST',
    headers: { 'api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Brevo SMTP error ${res.status}: ${txt}`)
  }
}

/**
 * Fallback Resend si Brevo n'est pas configuré
 */
async function sendViaResend(email, name, pdfUrl, apiKey) {
  const payload = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: [email],
    subject: '🎁 Votre Guide du Musicien Augmenté™ — Hervé Nanfang',
    html: `
      <p>Bonjour ${name},</p>
      <p>Voici le lien pour télécharger votre guide :<br/>
        <a href="${pdfUrl}" style="color:#c6a15b;font-weight:bold;">Télécharger le PDF</a>
      </p>
      <p>À très bientôt,<br/>Hervé Nanfang</p>
    `,
  }
  const res = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Resend error ${res.status}: ${txt}`)
  }
}

export default async function handler(req, res) {
  const headers = corsHeaders(req)

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).set(headers).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).set(headers).json({ error: 'Method Not Allowed' })
  }

  const {
    email,
    name,
    phone,
    segment = 'journal', // 'journal' ou 'booking'
    source = 'journal_lead_magnet',
    consentMarketing = true,
  } = req.body ?? {}

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).set(headers).json({ error: 'Email invalide' })
  }
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).set(headers).json({ error: 'Nom invalide' })
  }

  const baseUrl = process.env.VITE_SITE_URL || 'https://hervenanfang.art'
  const pdfUrl = `${baseUrl}/lead-magnet.pdf`
  const brevoKey = process.env.BREVO_API_KEY
  const resendKey = process.env.RESEND_API_KEY

  let subscribed = false

  // 1. Inscription à la liste Brevo correspondante
  // Pour Booking : uniquement si consentement marketing explicite accordé
  const shouldSubscribe = segment === 'journal' || (segment === 'booking' && consentMarketing === true)

  if (brevoKey && shouldSubscribe) {
    try {
      await subscribeBrevoContact({
        email: email.trim().toLowerCase(),
        name: name.trim(),
        phone: phone ? phone.trim() : undefined,
        segment,
        source,
        apiKey: brevoKey,
        baseUrl,
      })
      subscribed = true
    } catch (err) {
      console.warn('[lead-magnet] Brevo subscribe warning:', err.message)
    }
  }

  // 2. Envoi transactionnel (remise du PDF pour le Journal)
  if (segment === 'journal') {
    try {
      if (brevoKey) {
        await sendLeadMagnetEmailBrevo(email.trim(), name.trim(), pdfUrl, brevoKey)
      } else if (resendKey) {
        await sendViaResend(email.trim(), name.trim(), pdfUrl, resendKey)
      } else {
        console.warn('[lead-magnet] Aucun fournisseur email configuré.')
      }
    } catch (err) {
      console.error('[lead-magnet] Email delivery error:', err.message)
    }
  }

  // 3. Sauvegarde de traçabilité Supabase (optionnelle)
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY
    if (supabaseUrl && supabaseKey) {
      await fetch(`${supabaseUrl}/rest/v1/leads`, {
        method: 'POST',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
          Prefer: 'return=minimal',
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name.trim(),
          phone: phone ? phone.trim() : null,
          segment,
          source,
          consent_marketing: consentMarketing,
          subscribed_brevo: subscribed,
          created_at: new Date().toISOString(),
        }),
      })
    }
  } catch (err) {
    console.warn('[lead-magnet] Supabase save warning:', err.message)
  }

  return res.status(200).set(headers).json({
    success: true,
    segment,
    subscribed,
  })
}
