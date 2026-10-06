/**
 * Company details shown on the site. Fill these in; empty values hide the related UI.
 * Public values only — never secrets.
 */
export const site = {
  legalName: 'Tecno.Blue LLC',
  /** International format, digits only, e.g. 19545550123 */
  whatsapp: (import.meta.env.VITE_WHATSAPP as string | undefined) || '',
  whatsappGreeting: { en: 'Hello Tecno.Blue, I would like to know more about your solutions.', es: 'Hola Tecno.Blue, me gustaría conocer más sobre sus soluciones.' },
  email: (import.meta.env.VITE_CONTACT_EMAIL as string | undefined) || '',
  phone: (import.meta.env.VITE_CONTACT_PHONE as string | undefined) || '',
  address: { line1: '250 NW 136th Ave, Suite 113', line2: 'Pembroke Pines, FL 33028', country: { en: 'United States', es: 'Estados Unidos' } },
  socials: [
    { name: 'LinkedIn', url: (import.meta.env.VITE_SOCIAL_LINKEDIN as string | undefined) || '' },
    { name: 'Instagram', url: (import.meta.env.VITE_SOCIAL_INSTAGRAM as string | undefined) || '' },
    { name: 'Facebook', url: (import.meta.env.VITE_SOCIAL_FACEBOOK as string | undefined) || '' },
    { name: 'YouTube', url: (import.meta.env.VITE_SOCIAL_YOUTUBE as string | undefined) || '' },
  ].filter((s) => s.url),
  /** Team members for the About page. Add photos under public/images/team/. Empty list hides the section. */
  team: [] as { name: string; role: { en: string; es: string }; photo?: string; linkedin?: string }[],
}
