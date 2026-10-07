import { useMemo, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { solutions } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/fx/Reveal'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { springs, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * "Find your fit": pick the situations that describe your operation; the matching platforms rise to
 * the top with layout animations and the best match opens. Interactive, bilingual, keyboard-friendly.
 */
export function FitFinder() {
  const { lang, t } = useLang()
  const reduce = useReducedMotion()
  const [picked, setPicked] = useState<string[]>([])
  const needs = t.fit.needs
  const toggle = (id: string) => setPicked((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]))

  const ranked = useMemo(() => {
    const score = (sid: string) => needs.filter((n) => picked.includes(n.id) && (n.matches as readonly string[]).includes(sid)).length
    return [...solutions].map((s) => ({ s, score: score(s.id) })).sort((a, b) => b.score - a.score)
  }, [picked, needs])
  const anyPicked = picked.length > 0
  const top = anyPicked && ranked[0].score > 0 ? ranked[0].s : null

  return (
    <section aria-labelledby="fit-title" className="bg-surface">
      <div className="wrap py-24 sm:py-32">
        <Reveal className="max-w-[720px]"><SplitReveal id="fit-title" as="h2" text={t.fit.title} className="title block text-fg" /><p className="lead mt-4 text-fg-2">{t.fit.lead}</p></Reveal>
        <div className="mt-12 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wider text-fg-3">{t.fit.pickLabel}</p>
            <div className="mt-4 flex flex-wrap gap-2.5" role="group" aria-label={t.fit.pickLabel}>
              {needs.map((n) => {
                const on = picked.includes(n.id)
                return (
                  <motion.button
                    key={n.id}
                    type="button"
                    onClick={() => toggle(n.id)}
                    aria-pressed={on}
                    whileTap={reduce ? undefined : { scale: 0.96 }}
                    transition={springs.quick}
                    className={cn('inline-flex min-h-11 max-w-full cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-left text-[14px] font-semibold ring-1 transition-colors duration-200', on ? 'bg-navy text-white ring-navy' : 'bg-ground text-fg ring-line hover:ring-blue/50')}
                  >
                    <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors', on ? 'bg-sky text-fg' : 'bg-surface ring-1 ring-line')}>{on && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                    {n.label}
                  </motion.button>
                )
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.p key={top ? top.id : 'none'} initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={reduce ? undefined : { opacity: 0, y: -8 }} transition={springs.default} role="status" aria-live="polite" className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-fg-2">
                {top ? t.fit.result.replace('{name}', top.name) : anyPicked ? t.fit.noMatch : t.fit.empty}
              </motion.p>
            </AnimatePresence>
          </div>

          <LayoutGroup>
            <ul className="space-y-3">
              {ranked.map(({ s, score }) => {
                const best = top?.id === s.id
                return (
                  <motion.li key={s.id} layout transition={springs.default} className={cn('rounded-[22px] bg-ground ring-1 transition-colors duration-300', best ? 'ring-blue shadow-soft' : score > 0 ? 'ring-sky/60' : 'ring-line')}>
                    <div className="flex items-center gap-4 p-4">
                      <div className="flex h-12 w-24 shrink-0 items-center justify-center rounded-xl bg-white"><img src={s.logo} alt="" className={cn('w-auto max-w-[80px] object-contain', s.logoClass === 'h-12' ? 'h-9' : 'h-6')} /></div>
                      <div className="min-w-0 flex-1"><div className="text-[15px] font-extrabold text-fg">{s.name}</div><div className="truncate text-[13px] text-fg-3">{s.tag[lang]}</div></div>
                      <div className="flex items-center gap-1" role="img" aria-label={`${score} ${t.fit.matches}`}>{[0, 1, 2].map((k) => <span key={k} className={cn('h-1.5 w-5 rounded-full transition-colors duration-300', k < score ? 'bg-blue' : 'bg-fg/10')} />)}</div>
                    </div>
                    <AnimatePresence initial={false}>
                      {best && (
                        <motion.div key="detail" initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={reduce ? undefined : { height: 0, opacity: 0 }} transition={springs.default} className="overflow-hidden">
                          <div className="border-t border-line px-5 pb-5 pt-4">
                            <p className="text-[15px] leading-relaxed text-fg-2">{s.summary[lang]}</p>
                            <div className="mt-4 flex flex-wrap gap-3"><ButtonLink to={`/solutions/${s.id}`} size="sm">{t.solutions.learn}</ButtonLink><ButtonLink to="/contact" size="sm" variant="secondary">{t.nav.cta}</ButtonLink></div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })}
            </ul>
          </LayoutGroup>
        </div>
      </div>
    </section>
  )
}
