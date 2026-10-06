import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Contact form endpoint (Vercel serverless). Sends the message by email through Resend.
 * Required env vars in Vercel: RESEND_API_KEY, CONTACT_TO (destination inbox).
 * Optional: CONTACT_FROM (verified sender, default onboarding@resend.dev).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  const body = (typeof req.body === 'string' ? JSON.parse(req.body) : req.body) ?? {}
  const { name = '', email = '', phone = '', country = '', source = '', message = '', lang = 'en', website = '', company = '', role = '', subject = '' } = body as Record<string, string>

  if (website) return res.status(200).json({ ok: true }) // honeypot: bots fill the hidden field
  if (!name.trim() || !email.trim() || !message.trim()) return res.status(400).json({ ok: false, error: 'Missing required fields' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ ok: false, error: 'Invalid email' })

  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO
  if (!key || !to) return res.status(503).json({ ok: false, error: 'Contact service not configured' })

  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] as string)
  const html = `
    <h2>New contact from tecno.blue (${esc(lang)})</h2>
    <p><strong>Name:</strong> ${esc(name)}<br><strong>Company:</strong> ${esc(company)}<br><strong>Role:</strong> ${esc(role)}<br><strong>Email:</strong> ${esc(email)}<br><strong>Phone:</strong> ${esc(phone)}<br><strong>Country:</strong> ${esc(country)}<br><strong>Heard about us:</strong> ${esc(source)}</p>
    <p><strong>Message:</strong></p><p>${esc(message).replace(/\n/g, '<br>')}</p>`

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: process.env.CONTACT_FROM ?? 'Tecno.Blue <onboarding@resend.dev>', to: [to], reply_to: email, subject: subject ? `Website contact about ${subject}: ${name}` : `Website contact: ${name}`, html }),
  })
  if (!r.ok) return res.status(502).json({ ok: false, error: 'Email provider error' })
  return res.status(200).json({ ok: true })
}
