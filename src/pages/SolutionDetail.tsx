import { Link, Navigate, useParams } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { solutions } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/fx/Reveal'
import { TiltCard } from '@/components/fx/TiltCard'
import { SplitReveal } from '@/components/fx/SplitReveal'
import { MiniUI } from '@/components/sections/MiniUI'
import { ShaderBackground } from '@/components/fx/ShaderBackground'
import { Contact } from '@/pages/Contact'
import { cn } from '@/lib/cn'

/** One page per platform: hero with the live mini-interface, detail, highlights, proof, contact form. */
export function SolutionDetail() {
  const { id } = useParams()
  const { lang, t } = useLang()
  const s = solutions.find((x) => x.id === id)
  if (!s) return <Navigate to="/solutions" replace />
  const others = solutions.filter((x) => x.id !== s.id)
  const fill = (tpl: string) => tpl.replace('{name}', s.name)

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <ShaderBackground />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ground" />
        <div className="wrap relative z-10 grid gap-12 pb-28 pt-36 lg:grid-cols-[1fr_1fr] lg:items-center lg:pt-44">
          <div>
            <Link to="/solutions" className="inline-flex items-center gap-2 text-[14px] font-semibold text-white/70 transition-colors hover:text-white"><ArrowLeft className="h-4 w-4" strokeWidth={2.5} />{t.detail.back}</Link>
            <div className="mt-8 inline-flex rounded-2xl bg-white px-4 py-3"><img src={s.logo} alt={s.name} width={200} height={48} fetchPriority="high" className={cn('w-auto max-w-[200px] object-contain', s.logoClass)} /></div>
            <p className="mt-6 text-[14px] font-bold text-sky">{s.tag[lang]}</p>
            <SplitReveal as="h1" text={s.name} className="display block text-white" stagger={0.08} />
            <p className="lead mt-6 max-w-[52ch] text-white/75">{s.summary[lang]}</p>
            <div className="mt-9 flex flex-wrap gap-3"><ButtonLink to="#contact" size="lg" icon>{fill(t.detail.askAbout)}</ButtonLink><ButtonLink to={s.url} size="lg" variant="ghost">{fill(t.detail.visit)}</ButtonLink></div>
          </div>
          <TiltCard max={5} className="rounded-[28px]"><div className="rounded-[28px] bg-white/[0.06] p-2 ring-1 ring-white/10 backdrop-blur-sm"><MiniUI id={s.id} /></div></TiltCard>
        </div>
      </section>

      <section className="bg-ground">
        <div className="wrap grid gap-12 py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16 lg:py-28">
          <Reveal>
            <h2 className="text-[12px] font-bold uppercase tracking-wider text-fg-3">{t.detail.whatItDoes}</h2>
            <p className="mt-4 text-[22px] font-semibold leading-snug tracking-[-0.015em] text-fg sm:text-[26px]">{s.detail[lang]}</p>
            <p className="mt-6 text-[14px] font-semibold text-fg-3">{s.proof[lang]}</p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="rounded-[28px] bg-surface p-7 shadow-soft ring-1 ring-line">
              <h2 className="text-[12px] font-bold uppercase tracking-wider text-fg-3">{t.detail.highlights}</h2>
              <ul className="mt-4 space-y-3">{s.bullets[lang].map((b) => <li key={b} className="flex items-start gap-3 text-[16px] leading-snug text-fg"><span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-soft text-green"><Check className="h-3.5 w-3.5" strokeWidth={3} /></span>{b}</li>)}</ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="contact" className="scroll-mt-24 bg-surface">
        <div className="wrap pt-20 lg:pt-28">
          <Reveal className="max-w-[720px]"><h2 className="title text-fg">{fill(t.detail.formTitle)}</h2><p className="lead mt-4">{fill(t.detail.formLead)}</p></Reveal>
        </div>
        <Contact subject={s.name} />
      </section>

      <section aria-label={t.detail.others} className="bg-ground">
        <div className="wrap py-20">
          <h2 className="text-[12px] font-bold uppercase tracking-wider text-fg-3">{t.detail.others}</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((o) => (
              <li key={o.id}><Link to={`/solutions/${o.id}`} className="flex h-full flex-col rounded-[22px] bg-surface p-5 shadow-soft ring-1 ring-line transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:ring-blue/50"><div className="flex h-12 items-center"><img src={o.logo} alt="" className={cn('w-auto max-w-[120px] rounded-md object-contain dark:bg-white dark:px-2 dark:py-1', o.logoClass === 'h-12' ? 'h-9' : 'h-7')} /></div><div className="mt-3 text-[15px] font-extrabold text-fg">{o.name}</div><div className="text-[13px] text-fg-3">{o.tag[lang]}</div></Link></li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
