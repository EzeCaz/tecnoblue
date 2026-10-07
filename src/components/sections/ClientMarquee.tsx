import { clients } from '@/i18n/content'
import { useLang } from '@/i18n/LanguageContext'

/** Infinite logo marquee; duplicated track, pauses on hover/focus, static under reduced motion. */
export function ClientMarquee() {
  const { t } = useLang()
  const items = [...clients, ...clients]
  return (
    <section aria-labelledby="clients-title" className="bg-ground">
      <div className="wrap py-14">
        <h2 id="clients-title" className="text-center text-[14px] font-semibold text-fg-3">{t.proof.title}</h2>
        <div className="pause-on-hover mask-fade-x mt-8 flex overflow-hidden [--gap:5rem]">
          <div className="animate-marquee flex w-max shrink-0 items-center gap-[var(--gap)] pr-[var(--gap)] motion-reduce:animate-none">
            {items.map((c, i) => <img key={`${c.name}-${i}`} src={c.logo} alt={i < clients.length ? c.name : ''} aria-hidden={i >= clients.length} className="h-11 w-auto max-w-[170px] rounded-lg object-contain opacity-70 grayscale transition-[opacity,filter] duration-300 hover:opacity-100 hover:grayscale-0 dark:bg-white dark:px-3 dark:py-1.5 dark:opacity-90" />)}
            <span aria-hidden="true" className="contents">{items.map((c, i) => <img key={`d-${c.name}-${i}`} src={c.logo} alt="" className="h-11 w-auto max-w-[170px] rounded-lg object-contain opacity-70 grayscale dark:bg-white dark:px-3 dark:py-1.5" />)}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
