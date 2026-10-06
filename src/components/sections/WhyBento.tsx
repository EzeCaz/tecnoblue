import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLang } from '@/i18n/LanguageContext'
import { Reveal } from '@/components/fx/Reveal'
import { CountUp } from '@/components/fx/CountUp'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { SpotlightCard } from '@/components/21st/SpotlightCard'
import { springs, useReducedMotion } from '@/lib/motion'

/** Auto-sorting task list: items swap position every few seconds with a layout animation. */
function LiveList() {
  const reduce = useReducedMotion()
  const [items, setItems] = useState([{ id: 'a', t: 'Farmacia Central · shelf audit', s: 'In visit' }, { id: 'b', t: 'Bodega El Prado · delivery', s: '11:30' }, { id: 'c', t: 'Minimarket Sol · order', s: 'Sent' }, { id: 'd', t: 'Supermercado Luna · photos', s: 'Done' }])
  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setItems((xs) => [...xs.slice(1), xs[0]]), 3200)
    return () => window.clearInterval(id)
  }, [reduce])
  return (
    <ul className="mt-4 space-y-2">
      <AnimatePresence initial={false}>
        {items.map((it, i) => (
          <motion.li key={it.id} layout transition={springs.default} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-[13px] font-semibold text-fg ring-1 ring-line">
            <span className="flex items-center gap-2"><span className="flex h-5 w-5 items-center justify-center rounded-full bg-fg/[0.06] text-[10px] font-bold text-fg-2">{i + 1}</span>{it.t}</span>
            <span className={it.s === 'Done' || it.s === 'Sent' ? 'text-green' : 'text-blue'}>{it.s}</span>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

/** Typewriter cycling through the kinds of requests a client brings. */
function Typewriter({ lines }: { lines: readonly string[] }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  const [n, setN] = useState(reduce ? lines[0].length : 0)
  useEffect(() => {
    if (reduce) return
    const line = lines[i]
    if (n < line.length) { const t = setTimeout(() => setN(n + 1), 28); return () => clearTimeout(t) }
    const t = setTimeout(() => { setN(0); setI((i + 1) % lines.length) }, 2200)
    return () => clearTimeout(t)
  }, [n, i, lines, reduce])
  return <span>{lines[i].slice(0, n)}<span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-blue motion-reduce:hidden" /></span>
}

export function WhyBento() {
  const { t } = useLang()
  const tile = 'rounded-[28px] bg-ground p-7 ring-1 ring-line'
  return (
    <section aria-labelledby="why-title" className="bg-surface">
      <div className="wrap py-24 sm:py-32">
        <Reveal className="max-w-[760px]"><SplitReveal id="why-title" as="h2" text={t.why.title} className="title block text-fg" /><p className="lead mt-4">{t.why.lead}</p></Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-6">
          {/* 1: live list */}
          <Reveal className="md:col-span-3"><SpotlightCard className={tile + ' h-full'}><div className="flex items-center justify-between text-[12px] font-bold text-fg-3"><span>{t.why.items[2].title}</span><span className="flex items-center gap-1.5 text-green"><span className="relative flex h-3 w-3 items-center justify-center"><span className="absolute inset-0 rounded-full bg-green animate-breathe motion-reduce:hidden" /><span className="relative h-2 w-2 rounded-full bg-green" /></span>Live</span></div><LiveList /><p className="mt-5 text-[15px] leading-relaxed text-fg-2">{t.why.items[2].body}</p></SpotlightCard></Reveal>
          {/* 2: command input */}
          <Reveal className="md:col-span-3" delay={0.06}><SpotlightCard className={tile + ' h-full'}><div className="text-[12px] font-bold text-fg-3">{t.why.items[0].title}</div><div className="mt-4 flex items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 ring-1 ring-line"><span className="h-2.5 w-2.5 rounded-full bg-blue" /><span className="text-[15px] font-semibold text-fg"><Typewriter lines={t.why.prompts} /></span></div><div className="shimmer mt-3 h-2 w-2/3 rounded-full bg-fg/[0.06]" /><div className="shimmer mt-2 h-2 w-1/2 rounded-full bg-fg/[0.06]" /><p className="mt-6 text-[15px] leading-relaxed text-fg-2">{t.why.items[0].body}</p></SpotlightCard></Reveal>
          {/* 3: stats */}
          <Reveal className="md:col-span-2"><SpotlightCard className={tile + ' h-full'}><div className="text-[12px] font-bold text-fg-3">{t.why.items[3].title}</div><div className="mt-3 text-[52px] font-extrabold leading-none tracking-[-0.04em] text-fg"><CountUp to={5} suffix="%" /></div><div className="mt-1 text-[13px] font-semibold text-fg-2">{t.why.stat1}</div><div className="mt-5 text-[40px] font-extrabold leading-none tracking-[-0.04em] text-blue"><CountUp to={3000} suffix="+" /></div><div className="mt-1 text-[13px] font-semibold text-fg-2">{t.why.stat2}</div></SpotlightCard></Reveal>
          {/* 4: experience */}
          <Reveal className="md:col-span-2" delay={0.06}><SpotlightCard className={tile + ' h-full'}><div className="text-[12px] font-bold text-fg-3">{t.why.items[1].title}</div><div className="mt-4 space-y-2">{['WhatsApp', 'Phone', 'Web chat', 'In store'].map((c, i) => <motion.div key={c} initial={{ opacity: 0.5 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2 text-[13px] font-semibold text-fg ring-1 ring-line"><span>{c}</span><span className="h-1.5 w-16 overflow-hidden rounded-full bg-fg/[0.06]"><motion.span initial={{ width: 0 }} whileInView={{ width: `${[88, 72, 64, 54][i]}%` }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.2 + i * 0.1 }} className="block h-full bg-blue" /></span></motion.div>)}</div><p className="mt-5 text-[15px] leading-relaxed text-fg-2">{t.why.items[1].body}</p></SpotlightCard></Reveal>
          {/* 5: dark promise */}
          <Reveal className="md:col-span-2" delay={0.12}><div className="h-full rounded-[28px] bg-ink p-7 text-white"><div className="text-[12px] font-bold text-white/50">{t.why.promiseLabel}</div><div className="mt-3 text-[24px] font-extrabold leading-tight tracking-[-0.02em]">{t.why.promise}</div><div className="mt-6 flex -space-x-2">{['#0977bc', '#44b4e6', '#1a9b5a', '#ffd60a'].map((c) => <span key={c} className="h-8 w-8 rounded-full ring-2 ring-ink" style={{ background: c }} />)}</div><div className="mt-3 text-[13px] text-white/60">{t.why.promiseNote}</div></div></Reveal>
        </div>
      </div>
    </section>
  )
}
