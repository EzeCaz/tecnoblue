import { MapPin } from 'lucide-react'
import { solutions } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { PageHero } from '@/components/ui/PageHero'
import { ButtonLink } from '@/components/ui/Button'
import { Reveal } from '@/components/fx/Reveal'
import { TiltCard } from '@/components/fx/TiltCard'
import { WhyBento } from '@/components/sections/WhyBento'
import { Cta } from '@/components/sections/Cta'
import { cn } from '@/lib/cn'
import { site } from '@/config/site'
import { ScrollExpandMedia } from '@/components/21st/ScrollExpandMedia'

const ABOUT_VIDEO = (import.meta.env.VITE_ABOUT_VIDEO as string | undefined) || ''

export function About() {
  const { t, lang } = useLang()
  return (
    <>
      <PageHero kicker={t.about.kicker} title={t.about.title} lead={t.about.lead}><ButtonLink to="/contact" size="lg" icon>{t.nav.cta}</ButtonLink></PageHero>
      <ScrollExpandMedia
        src={ABOUT_VIDEO || '/images/photo-tech.jpg'}
        poster="/images/photo-tech.jpg"
        mediaType={ABOUT_VIDEO ? 'video' : 'image'}
        kicker={t.about.kicker}
        title={[t.about.values[0].title, t.about.values[2].title]}
      >
        <p className="mx-auto max-w-[60ch] text-center text-[19px] leading-relaxed text-white/80 sm:text-[22px]">{t.about.p1}</p>
      </ScrollExpandMedia>
      <section className="bg-ground"><div className="wrap grid gap-10 py-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <Reveal><p className="text-[26px] font-bold leading-snug tracking-[-0.02em] text-fg sm:text-[32px]">{t.about.p1}</p><p className="lead mt-6">{t.about.p2}</p></Reveal>
        <Reveal delay={0.08}><div className="rounded-[28px] bg-surface p-7 shadow-soft ring-1 ring-line"><h2 className="title-sm text-fg">{t.about.valuesTitle}</h2><ul className="mt-5 divide-y divide-line">{t.about.values.map((v) => <li key={v.title} className="py-4 first:pt-0 last:pb-0"><div className="text-[15px] font-extrabold text-blue">{v.title}</div><p className="mt-1 text-[15px] leading-relaxed text-fg-2">{v.body}</p></li>)}</ul></div></Reveal>
      </div></section>
      {site.team.length > 0 && (
        <section aria-labelledby="team-title" className="bg-surface"><div className="wrap py-20 lg:py-28">
          <Reveal className="max-w-[720px]"><h2 id="team-title" className="title text-fg">{t.team.title}</h2><p className="lead mt-4">{t.team.lead}</p></Reveal>
          <ul className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
            {site.team.map((m, i) => (
              <Reveal key={m.name} delay={i * 0.05}><li className="group">
                <div className="aspect-[4/5] overflow-hidden rounded-[22px] bg-ground ring-1 ring-line">{m.photo ? <img src={m.photo} alt={m.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" /> : <div className="flex h-full items-center justify-center text-[40px] font-extrabold text-fg-3">{m.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</div>}</div>
                <div className="mt-3 text-[16px] font-extrabold text-fg">{m.name}</div><div className="text-[14px] text-fg-3">{m.role[lang]}</div>
                {m.linkedin && <a href={m.linkedin} target="_blank" rel="noreferrer" className="mt-1 inline-block text-[13px] font-semibold text-blue">LinkedIn</a>}
              </li></Reveal>
            ))}
          </ul>
        </div></section>
      )}
      <WhyBento />
      <section aria-labelledby="partners-title" className="bg-ground"><div className="wrap py-20">
        <Reveal className="text-center"><h2 id="partners-title" className="title text-fg">{t.about.partnersTitle}</h2></Reveal>
        <ul className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{solutions.map((s, i) => <Reveal key={s.id} delay={i * 0.05}><TiltCard className="flex h-[130px] items-center justify-center rounded-[22px] bg-surface shadow-soft ring-1 ring-line"><img src={s.logo} alt={s.name} className={cn('w-auto max-w-[130px] rounded-lg object-contain dark:bg-white dark:px-2 dark:py-1', s.logoClass)} /></TiltCard></Reveal>)}</ul>
        <Reveal className="mt-14 text-center"><MapPin aria-hidden="true" className="mx-auto h-9 w-9 text-blue" strokeWidth={1.5} /><h2 className="title-sm mt-4 text-fg">{t.about.locationTitle}</h2><p className="mt-3 text-[17px] text-fg">{t.about.location}</p><p className="mt-1 text-[15px] text-fg-2">{t.about.locationBody}</p></Reveal>
      </div></section>
      <Cta />
    </>
  )
}
