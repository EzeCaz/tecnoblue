import { useLang } from '@/i18n/LanguageContext'
import { ButtonLink } from '@/components/ui/Button'
import { ShaderBackground } from '@/components/fx/ShaderBackground'

export function NotFound() {
  const { lang } = useLang()
  const t = lang === 'es'
    ? { title: 'Esta página no existe.', body: 'El enlace puede estar roto o la página se movió.', home: 'Ir al inicio', contact: 'Contáctanos' }
    : { title: 'This page does not exist.', body: 'The link may be broken or the page has moved.', home: 'Go to the home page', contact: 'Contact us' }
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden bg-ink text-white">
      <ShaderBackground />
      <div className="wrap relative py-32 text-center">
        <p className="text-[14px] font-bold text-sky">404</p>
        <h1 className="title mt-3 text-white">{t.title}</h1>
        <p className="lead mx-auto mt-5 max-w-[48ch] text-white/70">{t.body}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3"><ButtonLink to="/" size="lg" icon>{t.home}</ButtonLink><ButtonLink to="/contact" size="lg" variant="ghost">{t.contact}</ButtonLink></div>
      </div>
    </section>
  )
}
