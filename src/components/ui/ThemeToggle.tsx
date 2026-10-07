import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/lib/theme'
import { useLang } from '@/i18n/LanguageContext'
import { springs } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Light/dark switch; the thumb slides with a spring. Follows the system until the visitor chooses. */
export function ThemeToggle({ dark = false, className }: { dark?: boolean; className?: string }) {
  const { resolved, setPref } = useTheme()
  const { t } = useLang()
  const isDark = resolved === 'dark'
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? t.ui.light : t.ui.dark}
      onClick={() => setPref(isDark ? 'light' : 'dark')}
      className={cn('relative inline-flex h-9 w-[64px] cursor-pointer items-center rounded-full p-1 transition-opacity hover:opacity-85', dark ? 'bg-white/10 ring-1 ring-inset ring-white/15' : 'bg-fg/[0.06]', className)}
    >
      <motion.span layout transition={springs.default} className={cn('flex h-7 w-7 items-center justify-center rounded-full bg-white text-navy shadow-[0_1px_3px_rgb(0_0_0/0.15)]', isDark && 'ml-auto')}>
        {isDark ? <Moon className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Sun className="h-3.5 w-3.5" strokeWidth={2.5} />}
      </motion.span>
    </button>
  )
}
