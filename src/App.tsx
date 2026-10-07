import { Component, Suspense, lazy, useEffect, type ReactNode } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import { Intro } from '@/components/fx/Intro'
import { ScrollProgress } from '@/components/fx/ScrollProgress'
import { Home } from '@/pages/Home'
import { useLang } from '@/i18n/LanguageContext'
import { solutions } from '@/i18n/content'
import { WhatsAppButton } from '@/components/fx/WhatsAppButton'

const About = lazy(() => import('@/pages/About').then((m) => ({ default: m.About })))
const Solutions = lazy(() => import('@/pages/Solutions').then((m) => ({ default: m.Solutions })))
const Contact = lazy(() => import('@/pages/Contact').then((m) => ({ default: m.Contact })))
const NotFound = lazy(() => import('@/pages/NotFound').then((m) => ({ default: m.NotFound })))
const SolutionDetail = lazy(() => import('@/pages/SolutionDetail').then((m) => ({ default: m.SolutionDetail })))
const Legal = lazy(() => import('@/pages/Legal').then((m) => ({ default: m.Legal })))

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
  const { pathname, hash } = useLocation()
  const { lang } = useLang()
  useEffect(() => {
    if (hash) { const el = document.getElementById(hash.slice(1)); if (el) { setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80); return } }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    const map = meta[lang] as Record<string, readonly [string, string]>
    const sol = solutions.find((s) => pathname === `/solutions/${s.id}`)
    const known = ['/', '/about', '/solutions', '/contact']
    const [title, description] = sol ? [`${sol.name} — Tecno.Blue`, sol.summary[lang]] : pathname === '/privacy' || pathname === '/terms' ? [`${pathname === '/privacy' ? (lang === 'es' ? 'Privacidad' : 'Privacy') : (lang === 'es' ? 'Términos' : 'Terms')} — Tecno.Blue`, map['/'][1]] : known.includes(pathname) ? map[pathname] : [`${lang === 'es' ? 'Página no encontrada' : 'Page not found'} — Tecno.Blue`, map['/'][1]]
    document.title = title
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', description)
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical) }
    canonical.href = `${window.location.origin}${pathname}`
  }, [pathname, hash, lang])
  return null
}

class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err: unknown) { console.error('[tecno.blue] render error', err) }
  render() {
    if (this.state.failed) return <div className="wrap py-32 text-center"><h1 className="title text-fg">Something went wrong.</h1><p className="lead mt-4 text-fg-2">Reload the page, or write to us if it keeps happening.</p><a href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-blue px-6 font-bold text-white">Reload</a></div>
    return this.props.children
  }
}

function PageFallback() {
  return <div className="min-h-[60vh] bg-ground" aria-busy="true" aria-live="polite"><span className="sr-only">Loading…</span></div>
}

export default function App() {
  return (
    <div className="flex min-h-dvh flex-col">
      <ScrollAndMeta />
      <Intro />
      <ScrollProgress />
      <Navbar />
      <main id="main" className="flex-1">
        <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/solutions/:id" element={<SolutionDetail />} />
            <Route path="/privacy" element={<Legal kind="privacy" />} />
            <Route path="/terms" element={<Legal kind="terms" />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}
