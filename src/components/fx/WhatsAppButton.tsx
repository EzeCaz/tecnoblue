import { motion } from 'framer-motion'
import { site } from '@/config/site'
import { useLang } from '@/i18n/LanguageContext'
import { springs, useReducedMotion } from '@/lib/motion'

/** Floating WhatsApp chat button (bottom right). Hidden until VITE_WHATSAPP is set. */
export function WhatsAppButton() {
  const { lang } = useLang()
  const reduce = useReducedMotion()
  if (!site.whatsapp) return null
  const href = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappGreeting[lang])}`
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="WhatsApp"
      initial={reduce ? false : { opacity: 0, scale: 0.6, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ ...springs.enter, delay: 1.8 }}
      whileHover={reduce ? undefined : { scale: 1.06 }}
      whileTap={reduce ? undefined : { scale: 0.95 }}
      className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-10px_rgb(37_211_102/0.8)]"
    >
      <span aria-hidden="true" className="absolute inset-0 rounded-full bg-[#25D366] animate-breathe motion-reduce:hidden" />
      <svg viewBox="0 0 24 24" className="relative h-7 w-7" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2m0 18.15c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24 4.54 0 8.24 3.7 8.24 8.24 0 4.55-3.7 8.24-8.24 8.24m4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.84-.86 2.05s.88 2.37 1 2.54c.12.16 1.74 2.65 4.2 3.72.59.25 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28" /></svg>
    </motion.a>
  )
}
