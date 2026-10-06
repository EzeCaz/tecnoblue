import { motion } from 'framer-motion'
import { useLang } from '@/i18n/LanguageContext'
import { springs } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Segmented control; the white thumb slides with a shared layout animation. */
export function LanguageToggle({ className, dark = false }: { className?: string; dark?: boolean }) {
  const { lang, setLang, t } = useLang()
  return (
    <div role="group" aria-label={t.footer.language} className={cn('inline-flex h-9 items-center rounded-full p-1', dark ? 'bg-white/10 ring-1 ring-inset ring-white/15' : 'bg-navy/[0.06]', className)}>
      {(['en', 'es'] as const).map((l) => (
        <button key={l} type="button" onClick={() => setLang(l)} aria-pressed={lang === l} lang={l} className={cn('relative h-7 min-w-[42px] cursor-pointer rounded-full px-2.5 text-[12px] font-bold tracking-wide', lang === l ? (dark ? 'text-navy' : 'text-navy') : dark ? 'text-white/70' : 'text-muted')}>
          {lang === l && <motion.span layoutId={`lang-thumb-${dark ? 'd' : 'l'}`} transition={springs.default} className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.15)]" />}
          <span className="relative">{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  )
}
