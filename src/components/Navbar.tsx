import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { useLang } from '@/i18n/LanguageContext'
import { ButtonLink } from '@/components/ui/Button'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { Logo } from '@/components/ui/Logo'
import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { useTheme } from '@/lib/theme'
import { springs, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Floating glass pill. Over the dark hero it is a dark material; after scrolling past it, a light one.
 * The mobile menu materialises (blur + scale) from the pill and dismisses along the same path.
 */
export function Navbar() {
  const { t } = useLang()
  const { pathname } = useLocation()
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [past, setPast] = useState(false)
  const { scrollY } = useScroll()
  const { resolved } = useTheme()
  useMotionValueEvent(scrollY, 'change', (v) => setPast(v > 520))
  const heroPages = pathname === '/' || pathname === '/about' || pathname === '/solutions' || pathname === '/contact' || pathname.startsWith('/solutions/')
  const onDark = resolved === 'dark' || (heroPages && !past)

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [open])

  const links = [
    { to: '/solutions', label: t.nav.solutions },
    { to: '/about', label: t.nav.about },
    { to: '/contact', label: t.nav.contact },
  ]

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-5">
      <a href="#main" className="sr-only focus:not-sr-only focus:pointer-events-auto focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white">{t.nav.skip}</a>
      <motion.header
        layout
        transition={springs.default}
        className={cn('pointer-events-auto flex h-14 w-full max-w-[1120px] items-center justify-between rounded-full pl-4 pr-2 shadow-float', onDark ? 'glass-dark text-white' : 'glass text-fg')}
      >
        <Logo inverse={onDark} />
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={({ isActive }) => cn('relative rounded-full px-4 py-2 text-[14px] font-semibold transition-colors', onDark ? 'text-white/75 hover:text-white' : 'text-fg-2 hover:text-fg', isActive && (onDark ? 'text-white' : 'text-fg'))}>
              {({ isActive }) => (<>{isActive && <motion.span layoutId="nav-pill" transition={springs.default} className={cn('absolute inset-0 rounded-full', onDark ? 'bg-white/12' : 'bg-fg/[0.06]')} />}<span className="relative">{l.label}</span></>)}
            </NavLink>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <span className="hidden lg:inline-flex"><ThemeToggle dark={onDark} /></span>
          <LanguageToggle dark={onDark} />
          <ButtonLink to="/contact" size="sm">{t.nav.cta}</ButtonLink>
        </div>
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t.nav.close : t.nav.menu} className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-full md:hidden">
          <motion.span aria-hidden="true" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -4 }} transition={springs.quick} className={cn('absolute h-[2px] w-5 rounded', onDark ? 'bg-surface' : 'bg-navy')} />
          <motion.span aria-hidden="true" animate={open ? { rotate: -45, y: 0 } : { rotate: 0, y: 4 }} transition={springs.quick} className={cn('absolute h-[2px] w-5 rounded', onDark ? 'bg-surface' : 'bg-navy')} />
        </button>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            key="mobile-nav"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
            transition={springs.sheet}
            style={{ transformOrigin: 'top center' }}
            className="glass pointer-events-auto absolute inset-x-4 top-[88px] max-h-[calc(100dvh-104px)] overflow-y-auto overscroll-contain rounded-[28px] p-4 text-fg shadow-float md:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {[{ to: '/', label: t.nav.home }, ...links].map((l, i) => (
                <motion.div key={l.to} initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ...springs.default, delay: 0.04 + i * 0.05 }}>
                  <NavLink to={l.to} end={l.to === '/'} className={({ isActive }) => cn('block rounded-2xl px-4 py-4 text-[24px] font-extrabold tracking-[-0.02em]', isActive ? 'bg-fg/[0.06]' : '')}>{l.label}</NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mt-3 flex items-center justify-between px-2 pb-1"><div className="flex items-center gap-2"><ThemeToggle /><LanguageToggle /></div><ButtonLink to="/contact">{t.nav.cta}</ButtonLink></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
