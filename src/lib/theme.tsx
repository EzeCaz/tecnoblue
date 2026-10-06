import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type ThemePref = 'system' | 'light' | 'dark'
type Ctx = { pref: ThemePref; resolved: 'light' | 'dark'; setPref: (p: ThemePref) => void }
const ThemeContext = createContext<Ctx | null>(null)

function systemDark() { return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [pref, setPrefState] = useState<ThemePref>(() => { try { return (localStorage.getItem('tb-theme') as ThemePref) || 'system' } catch { return 'system' } })
  const [sys, setSys] = useState(systemDark)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const on = () => setSys(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  const resolved = pref === 'system' ? (sys ? 'dark' : 'light') : pref
  useEffect(() => {
    document.documentElement.dataset.theme = resolved
    document.documentElement.style.colorScheme = resolved
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', resolved === 'dark' ? '#070d1a' : '#ffffff')
  }, [resolved])
  const setPref = (p: ThemePref) => { setPrefState(p); try { localStorage.setItem('tb-theme', p) } catch { /* ignore */ } }
  const value = useMemo<Ctx>(() => ({ pref, resolved, setPref }), [pref, resolved])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider')
  return ctx
}
