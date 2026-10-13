import { useLang } from '@/i18n/LanguageContext'
import { site } from '@/config/site'

/**
 * Bilingual drafts of the privacy policy and terms of use. Review with counsel before relying on them;
 * placeholders in [brackets] must be completed.
 */
const privacy = {
  en: [
    ['Who we are', `${site.legalName} (“Tecno.Blue”, “we”) operates tecno.blue. Our office is at ${site.address.line1}, ${site.address.line2}, ${site.address.country.en}.`],
    ['What we collect', 'When you use the contact form we collect the details you enter: name, company, role, email, phone, country, how you heard about us and your message. We also receive standard technical data such as IP address, browser type and the pages you visit, through our hosting provider.'],
    ['Why we use it', 'To answer your enquiry, to prepare a proposal and to keep in touch about the solutions you asked about. We do not sell your data and we do not use it for automated decisions.'],
    ['Who processes it', 'Our website is hosted by Vercel Inc. and form messages are delivered by email through Google; both act as processors under their own terms. We may share your details with the technology partner whose platform you enquired about, only to answer that enquiry.'],
    ['How long we keep it', 'Enquiries are kept for as long as needed to follow up and for a maximum of [24 months] after our last contact, unless a contract follows.'],
    ['Your rights', 'You may ask us to access, correct or delete your personal data, or to stop contacting you, at any time by writing to [privacy email]. If you are in the EU/EEA, UK or a jurisdiction with equivalent rights, you may also lodge a complaint with your supervisory authority.'],
    ['Cookies and third parties', 'The site uses no advertising or tracking cookies and no analytics. Your language preference is stored in your browser only. Fonts are served from our own domain. The office map is loaded from Google Maps only after you press “Show map”; at that point Google receives your IP address under its own privacy policy.'],
    ['Changes', 'We may update this policy; the date below reflects the latest version.'],
  ],
  es: [
    ['Quiénes somos', `${site.legalName} (“Tecno.Blue”, “nosotros”) opera tecno.blue. Nuestra oficina está en ${site.address.line1}, ${site.address.line2}, ${site.address.country.es}.`],
    ['Qué recopilamos', 'Cuando usas el formulario de contacto recopilamos los datos que ingresas: nombre, empresa, cargo, correo, teléfono, país, cómo nos conociste y tu mensaje. También recibimos datos técnicos habituales, como dirección IP, tipo de navegador y páginas visitadas, a través de nuestro proveedor de alojamiento.'],
    ['Para qué los usamos', 'Para responder tu consulta, preparar una propuesta y mantener el contacto sobre las soluciones que solicitaste. No vendemos tus datos ni los usamos para decisiones automatizadas.'],
    ['Quién los procesa', 'El sitio está alojado en Vercel Inc. y los mensajes del formulario se entregan por correo a través de Google; ambos actúan como encargados bajo sus propios términos. Podemos compartir tus datos con el socio tecnológico cuya plataforma consultaste, únicamente para responder esa consulta.'],
    ['Cuánto tiempo los conservamos', 'Las consultas se conservan el tiempo necesario para dar seguimiento y como máximo [24 meses] desde el último contacto, salvo que se formalice un contrato.'],
    ['Tus derechos', 'Puedes solicitar acceso, corrección o eliminación de tus datos personales, o pedir que dejemos de contactarte, escribiendo a [correo de privacidad]. Si estás en la UE/EEE, el Reino Unido o una jurisdicción con derechos equivalentes, también puedes presentar una reclamación ante tu autoridad de control.'],
    ['Cookies y terceros', 'El sitio no usa cookies publicitarias ni de seguimiento, ni analítica. Tu preferencia de idioma se guarda solo en tu navegador. Las fuentes se sirven desde nuestro propio dominio. El mapa de la oficina se carga desde Google Maps solo después de pulsar “Mostrar mapa”; en ese momento Google recibe tu dirección IP bajo su propia política de privacidad.'],
    ['Cambios', 'Podemos actualizar esta política; la fecha indicada abajo corresponde a la versión más reciente.'],
  ],
}
const terms = {
  en: [
    ['Use of the site', 'tecno.blue provides information about Tecno.Blue and the technology platforms we implement. You may browse and share its content for informational purposes. You may not copy the site, scrape it, or use it in a way that harms Tecno.Blue or third parties.'],
    ['Third-party platforms', 'Gazpacho, Directa Group, Callvu, ReaLo and BetterScreenTV are products and trademarks of their respective owners. Descriptions on this site are informational; features, availability and pricing are defined by each provider and by the agreement you sign with us.'],
    ['No warranty', 'The site is provided as is. We make reasonable efforts to keep it accurate but do not guarantee that the information is complete or error-free, nor that the site is always available.'],
    ['Liability', 'To the extent permitted by law, Tecno.Blue is not liable for indirect or consequential damages arising from the use of this site. Nothing here limits liability that cannot be limited by law.'],
    ['Governing law', 'These terms are governed by the laws of the State of Florida, United States, and any dispute will be heard by the courts of Broward County, Florida, unless mandatory law provides otherwise.'],
    ['Contact', `Questions about these terms: ${site.email || '[contact email]'}.`],
  ],
  es: [
    ['Uso del sitio', 'tecno.blue ofrece información sobre Tecno.Blue y las plataformas tecnológicas que implementamos. Puedes navegar y compartir su contenido con fines informativos. No puedes copiar el sitio, extraer su contenido de forma automatizada ni usarlo de forma que perjudique a Tecno.Blue o a terceros.'],
    ['Plataformas de terceros', 'Gazpacho, Directa Group, Callvu, ReaLo y BetterScreenTV son productos y marcas de sus respectivos titulares. Las descripciones de este sitio son informativas; las funciones, disponibilidad y precios los define cada proveedor y el contrato que firmes con nosotros.'],
    ['Sin garantía', 'El sitio se ofrece tal cual. Hacemos esfuerzos razonables por mantenerlo exacto, pero no garantizamos que la información sea completa o libre de errores, ni que el sitio esté siempre disponible.'],
    ['Responsabilidad', 'En la medida permitida por la ley, Tecno.Blue no responde por daños indirectos o consecuentes derivados del uso de este sitio. Nada de lo aquí indicado limita responsabilidades que la ley no permita limitar.'],
    ['Ley aplicable', 'Estos términos se rigen por las leyes del Estado de Florida, Estados Unidos, y cualquier disputa se resolverá ante los tribunales del condado de Broward, Florida, salvo que una norma imperativa disponga otra cosa.'],
    ['Contacto', `Preguntas sobre estos términos: ${site.email || '[correo de contacto]'}.`],
  ],
}

export function Legal({ kind }: { kind: 'privacy' | 'terms' }) {
  const { lang, t } = useLang()
  const sections = (kind === 'privacy' ? privacy : terms)[lang]
  const title = kind === 'privacy' ? t.footer.privacy : t.footer.terms
  return (
    <section className="bg-ground">
      <div className="wrap-text pb-24 pt-36 sm:pt-44">
        <h1 className="title text-fg">{title}</h1>
        <p className="mt-3 text-[14px] text-fg-3">{lang === 'es' ? 'Última actualización' : 'Last updated'}: {new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(new Date(2026, 9, 7))}</p>
        <div className="mt-12 space-y-10">
          {sections.map(([h, body]) => (
            <section key={h}><h2 className="title-sm text-fg">{h}</h2><p className="mt-3 text-[17px] leading-relaxed text-fg-2">{body}</p></section>
          ))}
        </div>
      </div>
    </section>
  )
}
