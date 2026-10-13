/**
 * Tecno.Blue contact form -> email, via Google Apps Script.
 *
 * Lives in the sending Google account (script.google.com). The website posts each submission here,
 * and this script emails it to TO from that account. The visitor's address is set as reply-to,
 * so hitting Reply answers the visitor directly.
 *
 * Deploy: Deploy > New deployment > Web app > Execute as: Me > Who has access: Anyone.
 * Copy the web app URL into src/config/site.ts (formEndpoint).
 */
const TO = 'roberto@directagroup.com';
const SENDER_NAME = 'Tecno.Blue website';
const DAILY_CAP = 60; // stop runaway abuse well below Gmail's daily sending quota
const LIMITS = { name: 120, email: 160, phone: 40, country: 80, source: 80, company: 120, role: 120, subject: 60, message: 4000, lang: 2 };

function doPost(e) {
  try {
    const data = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    if (data.website) return reply({ ok: true }); // honeypot: bots fill the hidden field

    const f = {};
    Object.keys(LIMITS).forEach(function (k) { f[k] = clip(data[k], LIMITS[k]); });
    if (!f.name || !f.email || !f.message) return reply({ ok: false, error: 'missing' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return reply({ ok: false, error: 'email' });

    // Simple abuse limits: 5 messages per sender address per 10 minutes, and a daily cap.
    const cache = CacheService.getScriptCache();
    const perKey = 'rl_' + f.email.toLowerCase();
    const per = Number(cache.get(perKey) || 0);
    if (per >= 5) return reply({ ok: false, error: 'rate' });
    const dayKey = 'day_' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd');
    const day = Number(cache.get(dayKey) || 0);
    if (day >= DAILY_CAP) return reply({ ok: false, error: 'cap' });
    cache.put(perKey, String(per + 1), 600);
    cache.put(dayKey, String(day + 1), 21600);

    const rows = [
      ['Name', f.name], ['Company', f.company], ['Role', f.role], ['Email', f.email], ['Phone', f.phone],
      ['Country', f.country], ['How they heard about us', f.source], ['Platform', f.subject], ['Language', f.lang.toUpperCase()],
    ].filter(function (r) { return r[1]; });

    const subject = (f.subject ? 'Website contact about ' + f.subject + ': ' : 'Website contact: ') + f.name;
    const html = '<h2 style="font-family:sans-serif">New message from tecno.blue</h2>' +
      '<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">' +
      rows.map(function (r) { return '<tr><td style="padding:4px 12px 4px 0;color:#555"><b>' + esc(r[0]) + '</b></td><td style="padding:4px 0">' + esc(r[1]) + '</td></tr>'; }).join('') +
      '</table><p style="font-family:sans-serif;font-size:14px"><b>Message</b></p>' +
      '<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap">' + esc(f.message) + '</p>';
    const text = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n') + '\n\nMessage:\n' + f.message;

    MailApp.sendEmail({ to: TO, subject: subject.replace(/[\r\n]+/g, ' '), replyTo: f.email, name: SENDER_NAME, htmlBody: html, body: text });
    return reply({ ok: true });
  } catch (err) {
    console.error(err);
    return reply({ ok: false, error: 'server' });
  }
}

/** Visiting the URL in a browser shows this, so it is easy to check the deployment is live. */
function doGet() { return reply({ ok: true, service: 'tecno.blue contact form' }); }

function clip(v, n) { return typeof v === 'string' ? v.trim().slice(0, n) : ''; }
function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function reply(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
