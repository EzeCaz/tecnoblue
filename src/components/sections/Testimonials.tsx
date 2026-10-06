import { testimonials } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'
import { Reveal } from '@/components/fx/Reveal'
import { InfiniteMovingCards } from '@/components/21st/InfiniteMovingCards'

export function Testimonials() {
  const { lang, t } = useLang()
  const items = testimonials.map((x) => ({ quote: x.quote[lang], name: x.author, title: `${x.role[lang]}${x.role[lang] !== x.company ? `, ${x.company}` : ''}`, logo: x.logo }))
  return (
    <section aria-labelledby="testimonials-title" className="bg-ground">
      <div className="wrap py-24 sm:py-32">
        <Reveal className="text-center"><h2 id="testimonials-title" className="title text-fg">{t.testimonials.title}</h2></Reveal>
      </div>
      <Reveal className="-mt-12 pb-24 sm:-mt-16"><InfiniteMovingCards items={[...items, ...items]} speed="normal" /></Reveal>
    </section>
  )
}
