import { motion } from 'framer-motion'
import { Check, MapPin, Phone, Tv, Store } from 'lucide-react'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** Small, living interface mock for each platform. Perpetual micro-motion, isolated here. */
export function MiniUI({ id }: { id: string }) {
  const reduce = useReducedMotion()
  const loop = (delay = 0) => reduce ? {} : { animate: { opacity: [0.4, 1, 0.4] }, transition: { duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' as const } }
  const shell = 'relative overflow-hidden rounded-[24px] bg-ground p-5 ring-1 ring-line min-h-[320px] text-fg'

  if (id === 'gazpacho') return (
    <div className={shell}>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'radial-gradient(#cfd9e8 1.2px, transparent 1.2px)', backgroundSize: '22px 22px' }} />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full"><motion.path d="M40 240 C 100 190, 130 120, 180 110 S 270 200, 300 170 S 350 90, 370 60" fill="none" stroke="#0977bc" strokeWidth="4" strokeLinecap="round" strokeDasharray="1 1" pathLength={1} initial={reduce ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }} whileInView={{ strokeDashoffset: 0 }} viewport={{ once: true }} transition={{ duration: 1.6, ease: 'easeInOut' }} /></svg>
      {[{ x: '6%', y: '74%', n: 'Supermercado Luna', s: 'Done' }, { x: '34%', y: '28%', n: 'Minimarket Sol', s: 'Done' }, { x: '48%', y: '52%', n: 'Farmacia Central', s: 'In visit' }].map((p, i) => (
        <div key={p.n} className="absolute flex max-w-[76%] items-center gap-1.5 rounded-xl bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-fg shadow-soft sm:gap-2 sm:px-3 sm:py-2 sm:text-[12px]" style={{ left: p.x, top: p.y }}><MapPin className="h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={2.5} /><span className="truncate">{p.n}</span><motion.span {...loop(i * 0.4)} className={cn('shrink-0', p.s === 'Done' ? 'text-green' : 'text-accent')}>{p.s}</motion.span></div>
      ))}
    </div>
  )
  if (id === 'directa') return (
    <div className={shell}>
      <div className="flex items-center justify-between text-[12px] font-bold text-fg-3"><span>Operations centre</span><span className="flex items-center gap-1.5 text-green"><motion.span {...loop()} className="h-2 w-2 rounded-full bg-green" />Live</span></div>
      <div className="mt-4 grid grid-cols-3 gap-3">{[['Calls in queue', '7'], ['Avg answer', '18 s'], ['Uptime', '99.9%']].map(([l, v]) => <div key={l} className="rounded-xl bg-surface p-3"><div className="text-[11px] font-semibold text-fg-3">{l}</div><div className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-fg">{v}</div></div>)}</div>
      <div className="mt-3 space-y-2">{[['Inbound · billing', 'Agent Rosa M.', 'green'], ['Telemetry · well 14', 'Auto-resolved', 'blue'], ['Outbound · renewal', 'RPA bot', 'blue']].map(([a, b, c]) => <div key={a} className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5 text-[12px] font-semibold text-fg"><span className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-accent" strokeWidth={2.5} />{a}</span><span className={c === 'green' ? 'text-green' : 'text-accent'}>{b}</span></div>)}</div>
    </div>
  )
  if (id === 'callvu') return (
    <div className={shell}>
      <div className="text-[12px] font-bold text-fg-3">Verified transaction</div>
      <div className="mt-4 max-w-[80%] rounded-2xl rounded-bl-md bg-surface px-4 py-3 text-[13px] text-fg">I'd like to update my billing address.</div>
      <div className="ml-auto mt-3 max-w-[85%] rounded-2xl rounded-br-md bg-blue px-4 py-3 text-[13px] text-white">Done. Identity verified, consent recorded, CRM updated.</div>
      <div className="mt-4 flex flex-wrap gap-2">{['SOC 2', 'PCI DSS', 'HIPAA', 'GDPR'].map((x, i) => <motion.span key={x} initial={reduce ? false : { opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-1 rounded-full bg-green-soft px-2.5 py-1 text-[11px] font-extrabold text-green"><Check className="h-3 w-3" strokeWidth={3} />{x}</motion.span>)}</div>
    </div>
  )
  if (id === 'realo') return (
    <div className={shell}>
      <div className="flex items-center justify-between text-[12px] font-bold text-fg-3"><span className="flex items-center gap-1.5"><Store className="h-3.5 w-3.5" strokeWidth={2.5} />eShelf · Aisle 4</span><span>3,000+ stores</span></div>
      <div className="mt-4 grid grid-cols-4 gap-2">{Array.from({ length: 8 }).map((_, i) => <motion.div key={i} {...(reduce ? {} : { animate: { opacity: [0.7, 1, 0.7] }, transition: { duration: 3, repeat: Infinity, delay: i * 0.25 } })} className="aspect-[3/4] rounded-lg bg-surface ring-1 ring-line" style={{ background: i % 3 === 0 ? '#dbeeff' : '#ffffff' }} />)}</div>
      <div className="mt-4 rounded-xl bg-surface p-3 text-[12px] font-semibold text-fg"><div className="flex justify-between"><span>Shopper dwell</span><span className="text-accent">+5% sales lift</span></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-ground"><motion.div initial={reduce ? { width: '72%' } : { width: 0 }} whileInView={{ width: '72%' }} viewport={{ once: true }} transition={{ duration: 1.2 }} className="h-full bg-blue" /></div></div>
    </div>
  )
  return (
    <div className={shell}>
      <div className="flex items-center justify-between text-[12px] font-bold text-fg-3"><span className="flex items-center gap-1.5"><Tv className="h-3.5 w-3.5" strokeWidth={2.5} />Gym screens + CTV</span><span>Campaign · Week 3</span></div>
      <div className="mt-4 grid grid-cols-2 gap-3">{[['Gym impressions', '1.2M'], ['CTV reach', '418K'], ['Verified', '100%'], ['Cross-screen lift', '+23%']].map(([l, v]) => <div key={l} className="rounded-xl bg-surface p-3"><div className="text-[11px] font-semibold text-fg-3">{l}</div><div className="mt-1 text-[22px] font-extrabold tracking-[-0.02em] text-fg">{v}</div></div>)}</div>
      <div className="mt-3 flex h-16 items-end gap-1.5">{[30, 45, 40, 60, 55, 75, 70, 90, 85, 100].map((h, i) => <motion.div key={i} initial={reduce ? { height: `${h}%` } : { height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.05, duration: 0.6 }} className="flex-1 rounded-t-md" style={{ background: i >= 7 ? '#0977bc' : '#cfe4f4' }} />)}</div>
    </div>
  )
}
