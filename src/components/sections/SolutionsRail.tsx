import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { solutions } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/fx/Reveal'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { DragRail } from '@/components/sections/DragRail'
import { MiniUI } from '@/components/sections/MiniUI'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

gsap.registerPlugin(ScrollTrigger)

/**
 * Pinned horizontal scroll across the five platforms (GSAP ScrollTrigger, scrubbed).
 * Below 1024px, or under reduced motion, the panels simply stack vertically.
 */
export function SolutionsRail() {
  const { lang, t } = useLang()
  const reduce = useReducedMotion()
  const section = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const pinned = wide && !reduce

  useLayoutEffect(() => {
    if (!pinned) return
    const mm = gsap.matchMedia()
    mm.add('(min-width: 1024px)', () => {
      const s = section.current!, tr = track.current!
      const distance = () => tr.scrollWidth - window.innerWidth
      const tween = gsap.to(tr, {
        x: () => -distance(), ease: 'none',
        scrollTrigger: { trigger: s, pin: true, scrub: 0.6, start: 'top top', end: () => `+=${distance()}`, invalidateOnRefresh: true, anticipatePin: 1 },
      })
      const progress = s.querySelector<HTMLElement>('[data-progress]')
      const st = ScrollTrigger.create({ trigger: s, start: 'top top', end: () => `+=${distance()}`, onUpdate: (self) => { if (progress) progress.style.transform = `scaleX(${self.progress})` } })
      return () => { tween.scrollTrigger?.kill(); tween.kill(); st.kill() }
    })
    return () => mm.revert()
  }, [pinned])

  return (
    <section ref={section} aria-labelledby="solutions-title" className="relative overflow-hidden bg-ground">
      <div className="wrap pt-24 lg:pt-20">
        <Reveal className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div><SplitReveal id="solutions-title" as="h2" text={t.solutions.title} className="title block text-fg" /><p className="lead mt-4 max-w-[52ch]">{t.solutions.lead}</p></div>
          <ButtonLink to="/solutions" variant="secondary" icon>{t.solutions.all}</ButtonLink>
        </Reveal>
        <div className="mt-8 hidden h-1 w-full overflow-hidden rounded-full bg-fg/10 lg:block"><div data-progress className="h-full w-full origin-left bg-blue" style={{ transform: 'scaleX(0)' }} /></div>
      </div>
      {pinned ? (
        <div ref={track} className="mt-8 flex w-max flex-row gap-6 pb-24 pl-[max(1.25rem,calc((100vw-1280px)/2+2.5rem))] pr-24">
          {solutions.map((s, i) => (
          <article key={s.id} id={`rail-${s.id}`} className={cn('grid shrink-0 gap-8 rounded-[32px] bg-surface p-7 shadow-soft ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center', pinned && 'lg:w-[920px]')}>
            <div>
              <div className="flex items-center justify-between"><img src={s.logo} alt={s.name} className={cn('w-auto max-w-[180px] rounded-lg object-contain dark:bg-white dark:px-2 dark:py-1', s.logoClass)} /><span className="rounded-full bg-fg/[0.06] px-3 py-1 text-[12px] font-bold text-fg-2">{String(i + 1).padStart(2, '0')} / {String(solutions.length).padStart(2, '0')}</span></div>
              <p className="mt-8 text-[13px] font-bold text-accent">{s.tag[lang]}</p>
              <h3 className="title-sm mt-1 text-fg">{s.name}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-fg-2">{s.summary[lang]}</p>
              <ul className="mt-5 grid gap-2 text-[14px] text-fg sm:grid-cols-2">{s.bullets[lang].slice(0, 4).map((b) => <li key={b} className="flex items-start gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{b}</li>)}</ul>
              <div className="mt-7 flex flex-wrap gap-3"><ButtonLink to={`/solutions/${s.id}`} size="sm">{t.solutions.learn}</ButtonLink><ButtonLink to={s.url} size="sm" variant="secondary">{t.solutions.visit}</ButtonLink></div>
            </div>
            <MiniUI id={s.id} />
          </article>
        ))}
        </div>
      ) : (
        <div className="mt-10 pb-24">
          <DragRail count={solutions.length}>
            {solutions.map((s, i) => (
          <article key={s.id} id={`rail-${s.id}`} className={cn('grid shrink-0 gap-8 rounded-[32px] bg-surface p-7 shadow-soft ring-1 ring-line sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:items-center', pinned && 'lg:w-[920px]')}>
            <div>
              <div className="flex items-center justify-between"><img src={s.logo} alt={s.name} className={cn('w-auto max-w-[180px] rounded-lg object-contain dark:bg-white dark:px-2 dark:py-1', s.logoClass)} /><span className="rounded-full bg-fg/[0.06] px-3 py-1 text-[12px] font-bold text-fg-2">{String(i + 1).padStart(2, '0')} / {String(solutions.length).padStart(2, '0')}</span></div>
              <p className="mt-8 text-[13px] font-bold text-accent">{s.tag[lang]}</p>
              <h3 className="title-sm mt-1 text-fg">{s.name}</h3>
              <p className="mt-3 text-[16px] leading-relaxed text-fg-2">{s.summary[lang]}</p>
              <ul className="mt-5 grid gap-2 text-[14px] text-fg sm:grid-cols-2">{s.bullets[lang].slice(0, 4).map((b) => <li key={b} className="flex items-start gap-2"><span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-blue" />{b}</li>)}</ul>
              <div className="mt-7 flex flex-wrap gap-3"><ButtonLink to={`/solutions/${s.id}`} size="sm">{t.solutions.learn}</ButtonLink><ButtonLink to={s.url} size="sm" variant="secondary">{t.solutions.visit}</ButtonLink></div>
            </div>
            <MiniUI id={s.id} />
          </article>
        ))}
          </DragRail>
        </div>
      )}
    </section>
  )
}
