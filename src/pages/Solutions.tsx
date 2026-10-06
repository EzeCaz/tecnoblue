import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Check } from 'lucide-react'
import { solutions } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/fx/Reveal'
import { TiltCard } from '@/components/fx/TiltCard'
import { MiniUI } from '@/components/sections/MiniUI'
import { Cta } from '@/components/sections/Cta'
import { cn } from '@/lib/cn'

export function Solutions() {
  const { lang, t } = useLang()
  const { hash } = useLocation()
  useEffect(() => {
    if (!hash) return
    const el = document.getElementById(hash.slice(1))
    if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
  }, [hash])

  return (
    <>
      <PageHero kicker={t.solutionsPage.kicker} title={t.solutionsPage.title} lead={t.solutionsPage.lead}>
        <ButtonLink to="/contact" size="lg" icon>{t.nav.cta}</ButtonLink>
      </PageHero>
      <nav aria-label={t.solutionsPage.kicker} className="bg-ground"><ul className="wrap flex flex-wrap justify-center gap-2 pb-6">{solutions.map((s) => <li key={s.id}><a href={`#${s.id}`} className="inline-flex h-10 items-center rounded-full bg-white px-4 text-[14px] font-bold text-navy shadow-soft ring-1 ring-line transition-colors hover:ring-blue/50">{s.name}</a></li>)}</ul></nav>
      <section className="bg-ground"><div className="wrap space-y-6 py-16">
        {solutions.map((s, i) => (
          <Reveal key={s.id}>
            <article id={s.id} className="grid scroll-mt-28 gap-10 rounded-[32px] bg-white p-7 shadow-soft ring-1 ring-line sm:p-12 lg:grid-cols-2 lg:gap-14">
              <div className={cn(i % 2 === 1 && 'lg:order-2')}><TiltCard max={4} glare={false} className="rounded-[24px]"><MiniUI id={s.id} /></TiltCard></div>
              <div className={cn(i % 2 === 1 && 'lg:order-1')}>
                <img src={s.logo} alt={s.name} className={cn('w-auto max-w-[200px] object-contain', s.logoClass)} />
                <p className="mt-6 text-[13px] font-bold text-blue">{s.tag[lang]}</p>
                <h2 className="title mt-1 text-navy lg:text-[40px]">{s.name}</h2>
                <p className="lead mt-4">{s.summary[lang]}</p>
                <h3 className="mt-7 text-[12px] font-bold uppercase tracking-wider text-muted">{t.solutionsPage.whatItDoes}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-navy">{s.detail[lang]}</p>
                <h3 className="mt-7 text-[12px] font-bold uppercase tracking-wider text-muted">{t.solutionsPage.highlights}</h3>
                <ul className="mt-3 grid gap-2.5 sm:grid-cols-2">{s.bullets[lang].map((b) => <li key={b} className="flex items-start gap-2 text-[14px] leading-snug text-navy"><Check className="mt-[2px] h-4 w-4 shrink-0 text-green" strokeWidth={2.5} />{b}</li>)}</ul>
                <p className="mt-5 text-[13px] font-semibold text-muted">{s.proof[lang]}</p>
                <div className="mt-7 flex flex-wrap gap-3"><ButtonLink to="/contact" icon>{t.nav.cta}</ButtonLink><ButtonLink to={s.url} variant="secondary">{t.solutions.visit}</ButtonLink></div>
              </div>
            </article>
          </Reveal>
        ))}
      </div></section>
      <Cta />
    </>
  )
}
