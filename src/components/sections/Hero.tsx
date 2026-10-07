import { motion, useScroll, useTransform } from 'framer-motion'
import { useLang } from '@/i18n/LanguageContext'
import { ShaderBackground } from '@/components/fx/ShaderBackground'
import { Suspense, lazy } from 'react'
const DemoPlayer = lazy(() => import('@/components/fx/DemoPlayer').then((m) => ({ default: m.DemoPlayer })))
import { ContainerScroll } from '@/components/21st/ContainerScroll'
import { RotatingWords } from '@/components/21st/RotatingWords'
import { VideoBackground } from '@/components/fx/VideoBackground'
import { ParticleField } from '@/components/fx/ParticleField'
import { Magnetic } from '@/components/fx/Magnetic'
import { ButtonLink } from '@/components/ui/Button'
import { springs, useReducedMotion } from '@/lib/motion'

const HERO_VIDEO = (import.meta.env.VITE_HERO_VIDEO as string | undefined) || ''

export function Hero() {
  const { t } = useLang()
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const copyY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : 120])
  const copyOpacity = useTransform(scrollY, [0, 500], [1, reduce ? 1 : 0.15])
  const item = (delay: number) => reduce ? {} : ({
    initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { ...springs.enter, delay },
  })
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <ShaderBackground />
      {HERO_VIDEO && <VideoBackground src={HERO_VIDEO} opacity={0.5} />}
      <div className="absolute inset-0 hidden md:block"><ParticleField /></div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ground" />
      <div className="wrap relative pb-24 pt-36 sm:pt-44">
        <motion.div style={{ y: copyY, opacity: copyOpacity }} className="mx-auto max-w-[880px] text-center">
          <motion.div {...item(0)} className="glass-dark inline-flex items-center gap-2 rounded-full py-1.5 pl-2 pr-4 text-[13px] font-semibold text-white/85">
            <span className="relative flex h-5 w-5 items-center justify-center"><span className="absolute inset-0 rounded-full bg-sky animate-breathe motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-sky" /></span>
            {t.hero.badge}
          </motion.div>
          <motion.h1 {...item(0.08)} className="display mt-7 text-white">
            {t.hero.titleLead}<br />
            <RotatingWords words={t.hero.rotating} className="text-sky" />
          </motion.h1>
          <motion.p {...item(0.16)} className="lead mx-auto mt-6 max-w-[58ch] text-white/75">{t.hero.lead}</motion.p>
          <motion.div {...item(0.24)} className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Magnetic><ButtonLink to="/contact" size="lg" icon>{t.hero.primary}</ButtonLink></Magnetic>
            <ButtonLink to="/solutions" size="lg" variant="ghost">{t.hero.secondary}</ButtonLink>
          </motion.div>
        </motion.div>

        <motion.div {...item(0.4)} className="relative mx-auto mt-16 max-w-[1080px]">
          <ContainerScroll>
            <div className="rounded-[30px] bg-white/[0.06] p-2 ring-1 ring-white/10 backdrop-blur-sm">
              <Suspense fallback={<div className="aspect-[1200/760] w-full rounded-[26px] bg-ink/60" aria-hidden="true" />}><DemoPlayer label={t.hero.demoLabel} /></Suspense>
            </div>
          </ContainerScroll>
          {/* floating chips */}
          <motion.div initial={reduce ? false : { opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springs.enter, delay: 0.7 }} className="glass-dark absolute -left-16 top-16 hidden rounded-2xl p-4 text-white xl:block">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/75">{t.hero.chip1Label}</div>
            <div className="mt-1 text-[26px] font-extrabold tracking-[-0.03em]">247 <span className="text-[13px] font-semibold text-green">+12%</span></div>
          </motion.div>
          <motion.div initial={reduce ? false : { opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ ...springs.enter, delay: 0.8 }} className="glass-dark absolute -right-16 bottom-20 hidden rounded-2xl p-4 text-white xl:block">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/75"><span className="h-2 w-2 rounded-full bg-green" />{t.hero.chip2Label}</div>
            <div className="mt-1 text-[15px] font-bold">{t.hero.chip2Value}</div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
