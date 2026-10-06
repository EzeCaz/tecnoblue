import { Link } from 'react-router-dom'
import { solutions } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/fx/Reveal'
import { TiltCard } from '@/components/fx/TiltCard'
import { MiniUI } from '@/components/sections/MiniUI'
import { Cta } from '@/components/sections/Cta'
import { cn } from '@/lib/cn'

/** Overview: one card per platform, each linking to its own page. */
export function Solutions() {
  const { lang, t } = useLang()
  return (
    <>
      <PageHero kicker={t.solutionsPage.kicker} title={t.solutionsPage.title} lead={t.solutionsPage.lead}>
        <ButtonLink to="/contact" size="lg" icon>{t.nav.cta}</ButtonLink>
      </PageHero>
      <section className="bg-ground"><div className="wrap grid gap-6 py-16 md:grid-cols-2 lg:py-20">
        {solutions.map((s, i) => (
          <Reveal key={s.id} delay={(i % 2) * 0.06} className={cn(i === 0 && 'md:col-span-2')}>
            <TiltCard max={3} glare={false} className="h-full rounded-[32px]">
              <Link to={`/solutions/${s.id}`} className={cn('flex h-full flex-col gap-8 rounded-[32px] bg-surface p-7 shadow-soft ring-1 ring-line transition-[box-shadow,ring-color] duration-300 hover:ring-blue/50 sm:p-10', i === 0 && 'lg:grid lg:grid-cols-2 lg:items-center')}>
                <div>
                  <img src={s.logo} alt="" className={cn('w-auto max-w-[180px] rounded-lg object-contain dark:bg-white dark:px-2 dark:py-1', s.logoClass)} />
                  <p className="mt-6 text-[13px] font-bold text-blue">{s.tag[lang]}</p>
                  <h2 className={cn('mt-1 text-fg', i === 0 ? 'title' : 'title-sm')}>{s.name}</h2>
                  <p className="lead mt-3">{s.summary[lang]}</p>
                  <span className="mt-6 inline-flex h-11 items-center rounded-full bg-blue px-5 text-[14px] font-bold text-white">{t.solutions.learn}</span>
                </div>
                <MiniUI id={s.id} />
              </Link>
            </TiltCard>
          </Reveal>
        ))}
      </div></section>
      <Cta />
    </>
  )
}
