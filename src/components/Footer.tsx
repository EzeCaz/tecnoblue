import { Link } from 'react-router-dom'
import { useLang } from '@/i18n/LanguageContext'
import { solutions } from '@/i18n/content'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { Logo } from '@/components/ui/Logo'

const year = new Date().getFullYear()

export function Footer() {
  const { t } = useLang()
  const company = [{ to: '/about', label: t.nav.about }, { to: '/solutions', label: t.nav.solutions }, { to: '/contact', label: t.nav.contact }]
  return (
    <footer className="bg-ink text-white/70">
      <div className="wrap grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1fr_auto]">
        <div><Logo inverse /><p className="mt-4 max-w-[30ch] text-[14px] leading-relaxed">{t.footer.address}</p></div>
        <div><h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.partners}</h2><ul className="mt-4 space-y-2">{solutions.map((s) => <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer" className="text-[14px] transition-colors hover:text-white">{s.name}</a></li>)}</ul></div>
        <div><h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.company}</h2><ul className="mt-4 space-y-2">{company.map((l) => <li key={l.to}><Link to={l.to} className="text-[14px] transition-colors hover:text-white">{l.label}</Link></li>)}</ul></div>
        <div><h2 className="text-[12px] font-bold uppercase tracking-wider text-white/50">{t.footer.language}</h2><LanguageToggle dark className="mt-4" /></div>
      </div>
      <div className="wrap flex flex-col gap-2 border-t border-white/10 py-6 text-[12px] text-white/45 sm:flex-row sm:items-center sm:justify-between"><p>© {year} Tecno.Blue. {t.footer.rights}</p><p>Pembroke Pines, Florida</p></div>
    </footer>
  )
}
