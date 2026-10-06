import { Hero } from '@/components/sections/Hero'
import { ClientMarquee } from '@/components/sections/ClientMarquee'
import { SolutionsRail } from '@/components/sections/SolutionsRail'
import { WhyBento } from '@/components/sections/WhyBento'
import { Testimonials } from '@/components/sections/Testimonials'
import { Cta } from '@/components/sections/Cta'
import { KineticBand } from '@/components/sections/KineticBand'
import { FitFinder } from '@/components/sections/FitFinder'
import { useLang } from '@/i18n/LanguageContext'

export function Home() {
  const { t } = useLang()
  return (
    <>
      <Hero />
      <ClientMarquee />
      <KineticBand words={t.band} />
      <SolutionsRail />
      <FitFinder />
      <WhyBento />
      <Testimonials />
      <Cta />
    </>
  )
}
