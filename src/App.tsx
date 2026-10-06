import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Intro } from '@/components/fx/Intro'
import { ScrollProgress } from '@/components/fx/ScrollProgress'
import { Home } from '@/pages/Home'
import { useLang } from '@/i18n/LanguageContext'

const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Solutions = lazy(() => import('@/pages/Solutions').then((m) => ({ default: m.Solutions })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))

const meta = {
  en: {
    '/': ['Tecno.Blue — We add value to your business', 'Five specialised technologies for field operations, customer contact, retail and media. One partner who implements and supports them.'],
    '/about': ['About us — Tecno.Blue', 'Innovation, versatility and commitment. Tecno.Blue helps companies solve business challenges with digital services and latest-generation technologies.'],
    '/solutions': ['Solutions — Tecno.Blue', 'Gazpacho, Directa Group, Callvu, ReaLo and BetterScreenTV: five platforms implemented and supported by Tecno.Blue.'],
    '/contact': ['Contact us — Tecno.Blue', 'Tell us about your challenge and a Tecno.Blue representative will contact you.'],
  },
  es: {
    '/': ['Tecno.Blue — Sumamos valor para tu negocio', 'Cinco tecnologías especializadas para operaciones en campo, contacto con clientes, retail y medios. Un solo socio que las implementa y les da soporte.'],
    '/about': ['Nosotros — Tecno.Blue', 'Innovación, versatilidad y compromiso. Tecno.Blue ayuda a las empresas a resolver sus retos con servicios digitales y tecnologías de última generación.'],
    '/solutions': ['Soluciones — Tecno.Blue', 'Gazpacho, Directa Group, Callvu, ReaLo y BetterScreenTV: cinco plataformas implementadas y soportadas por Tecno.Blue.'],
    '/contact': ['Contáctanos — Tecno.Blue', 'Cuéntanos tu reto y un representante de Tecno.Blue se comunicará contigo.'],
  },
} as const

function ScrollAndMeta() {
  const { pathname } = useLocation()
  const { lang } = useLang()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    const map = meta[lang] as Record<string, readonly [string, string]>
    const [title, description] = map[pathname] ?? map['/']
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${window.location.origin}${pathname}`
  }, [pathname, lang])
  return null
}

function PageFallback() {
  return <div className="min-h-[60vh] bg-ground" aria-busy="true" />
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollAndMeta />
      <Intro />
      <ScrollProgress />
      <Navbar />
      <main id="main" className="flex-1">
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  )
}
