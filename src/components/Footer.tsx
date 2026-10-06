import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import { useLang } from '@/i18n/LanguageContext'
import { solutions } from '@/i18n/content'
import { site } from '@/config/site'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { Logo } from '@/components/ui/Logo'

const year = new Date().getFullYear()
const socialIcon: Record<string, string> = {
  LinkedIn: 'M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z',
  Instagram: 'M12 7.38A4.62 4.62 0 1 0 12 16.62 4.62 4.62 0 1 0 12 7.38zm0 7.62a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm5.85-7.81a1.08 1.08 0 1 1-2.16 0 1.08 1.08 0 0 1 2.16 0zM21.9 8.5c-.07-1.45-.4-2.73-1.46-3.79S18.1 3.3 16.65 3.23c-1.5-.08-5.99-.08-7.49 0-1.44.07-2.72.4-3.78 1.46S3.99 7.04 3.92 8.49c-.08 1.5-.08 5.99 0 7.49.07 1.45.4 2.73 1.46 3.79s2.34 1.39 3.78 1.46c1.5.08 5.99.08 7.49 0 1.45-.07 2.73-.4 3.79-1.46s1.39-2.34 1.46-3.79c.08-1.5.08-5.98 0-7.48zM19.96 17.6a3.04 3.04 0 0 1-1.71 1.71c-1.18.47-3.99.36-5.3.36s-4.12.11-5.3-.36a3.04 3.04 0 0 1-1.71-1.71c-.47-1.18-.36-3.99-.36-5.3s-.1-4.12.36-5.3a3.04 3.04 0 0 1 1.71-1.71c1.18-.47 3.99-.36 5.3-.36s4.12-.1 5.3.36a3.04 3.04 0 0 1 1.71 1.71c.47 1.18.36 3.99.36 5.3s.11 4.12-.36 5.3z',
  Facebook: 'M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.4V21h3.1z',
  YouTube: 'M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.3-1C16.5 3.7 12 3.7 12 3.7s-4.5 0-7.8.2c-.5.1-1.5.1-2.3 1C1.2 5.6 1 7.2 1 7.2S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.6 1 1.9.2 7.5.2 7.5.2s4.5 0 7.8-.2c.5-.1 1.5-.1 2.3-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.7 15V8.3l6.2 3.4-6.2 3.3z',
}

export function Footer() {
  const { t, lang } = useLang()
  const company = [{ to: '/about', label: t.nav.about }, { to: '/solutions', label: t.nav.solutions }, { to: '/contact', label: t.nav.contact }]
  return (
    <footer className="bg-ink text-white/70">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <Logo inverse />
          <ul className="mt-5 space-y-2 text-[14px]">
            <li className="flex items-start gap-2"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky" strokeWidth={2} /><span>{site.address.line1}<br />{site.address.line2}, {site.address.country[lang]}</span></li>
            {site.email && <li className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-sky" strokeWidth={2} /><a href={`mailto:${site.email}`} className="transition-colors hover:text-white">{site.email}</a></li>}
            {site.phone && <li className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-sky" strokeWidth={2} /><a href={`tel:${site.phone.replace(/[^+\d]/g, '')}`} className="transition-colors hover:text-white">{site.phone}</a></li>}
          </ul>
          {site.socials.length > 0 && (
            <div className="mt-6">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.follow}</h2>
              <ul className="mt-3 flex gap-2">{site.socials.map((s) => <li key={s.name}><a href={s.url} target="_blank" rel="noreferrer" aria-label={s.name} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20 hover:text-white"><svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true"><path d={socialIcon[s.name] ?? ''} /></svg></a></li>)}</ul>
            </div>
          )}
        </div>
        <div><h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.partners}</h2><ul className="mt-4 space-y-2">{solutions.map((s) => <li key={s.id}><Link to={`/solutions/${s.id}`} className="text-[14px] transition-colors hover:text-white">{s.name}</Link></li>)}</ul></div>
        <div><h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.company}</h2><ul className="mt-4 space-y-2">{company.map((l) => <li key={l.to}><Link to={l.to} className="text-[14px] transition-colors hover:text-white">{l.label}</Link></li>)}</ul>
          <h2 className="mt-6 text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.legal}</h2><ul className="mt-3 space-y-2"><li><Link to="/privacy" className="text-[14px] transition-colors hover:text-white">{t.footer.privacy}</Link></li><li><Link to="/terms" className="text-[14px] transition-colors hover:text-white">{t.footer.terms}</Link></li></ul></div>
        <div><h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.language}</h2><LanguageToggle dark className="mt-4" /><h2 className="mt-6 text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.theme}</h2><ThemeToggle dark className="mt-3" /></div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-white/10 py-6 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {year} {site.legalName}. {t.footer.rights}</p><p>Pembroke Pines, Florida</p></div>
    </footer>
  )
}
