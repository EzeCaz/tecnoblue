import { useLang } from '@/i18n/LanguageContext'
import { ButtonLink } from '@/components/ui/Button'
import { Magnetic } from '@/components/fx/Magnetic'
import { Reveal } from '@/components/fx/Reveal'
import { BackgroundPaths } from '@/components/21st/BackgroundPaths'

export function Cta() {
  const { t } = useLang()
  return (
    <section className="bg-ground pb-24">
      <div className="wrap">
        <Reveal>
          <div className="relative overflow-hidden rounded-[36px] bg-ink px-8 py-20 text-center text-white sm:px-16 sm:py-28">
            <div aria-hidden="true" className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-blue/50 blur-[120px]" />
            <BackgroundPaths className="opacity-80" />
            <h2 className="title relative mx-auto max-w-[18ch] text-white">{t.cta.title}</h2>
            <p className="lead relative mx-auto mt-5 max-w-[46ch] text-white/70">{t.cta.body}</p>
            <div className="relative mt-10 flex justify-center"><Magnetic><ButtonLink to="/contact" size="lg" icon variant="inverse">{t.cta.button}</ButtonLink></Magnetic></div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
