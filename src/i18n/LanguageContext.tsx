import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { copy, type Copy, type Lang } from './content'

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: Copy }

const LanguageContext = createContext<Ctx | null>(null)

function detectInitial(): Lang {
  try {
    const saved = localStorage.getItem('tb-lang')
    if (saved === 'en' || saved === 'es') return saved
  } catch { /* storage unavailable */ }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('es')) return 'es'
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitial)

  useEffect(() => {
    document.documentElement.lang = lang
    try { localStorage.setItem('tb-lang', lang) } catch { /* ignore */ }
  }, [lang])

  const value = useMemo<Ctx>(() => ({ lang, setLang: setLangState, t: copy[lang] as Copy }), [lang])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used inside LanguageProvider')
  return ctx
}
