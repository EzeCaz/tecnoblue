import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useLang } from '@/i18n/LanguageContext'

/**
 * Touch / narrow-screen carousel built on native scroll-snap: the platform's own 1:1 drag, momentum
 * and rubber-banding, and every swipe settles exactly on a panel. Dots mirror the current panel and
 * jump to it on tap; keyboard focus inside a panel brings that panel into view.
 */
export function DragRail({ children, count }: { children: ReactNode; count: number }) {
  const { t } = useLang()
  const scroller = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const panels = [...el.children] as HTMLElement[]
        if (!panels.length) return
        const step = panels[1] ? panels[1].offsetLeft - panels[0].offsetLeft : panels[0].offsetWidth
        setIndex(Math.max(0, Math.min(count - 1, Math.round(el.scrollLeft / step))))
      })
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => { el.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [count])

  const goTo = (i: number) => {
    const el = scroller.current
    const panel = el?.children[i] as HTMLElement | undefined
    if (!el || !panel) return
    el.scrollTo({ left: panel.offsetLeft - parseFloat(getComputedStyle(el).paddingLeft || '0'), behavior: 'smooth' })
  }

  return (
    <div>
      <div
        ref={scroller}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 sm:px-10 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>*]:w-[86%] [&>*]:shrink-0 [&>*]:snap-start [&>*]:snap-always after:block after:w-[10%] after:shrink-0 after:content-['']"
        style={{ scrollPaddingLeft: 'var(--rail-pad, 20px)', paddingRight: 0, WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
        onFocus={(e) => { const panels = [...(e.currentTarget.children)]; const i = panels.findIndex((p) => p.contains(e.target as Node)); if (i >= 0 && i !== index) goTo(i) }}
      >
        {children}
      </div>
      <div className="mt-5 flex items-center justify-center gap-2" role="group" aria-label={t.nav.solutions}>
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} type="button" aria-current={i === index} aria-label={`${t.ui.panel} ${i + 1} / ${count}`} onClick={() => goTo(i)} className={`h-2.5 cursor-pointer rounded-full transition-[width,background-color] duration-300 hover:bg-fg/60 ${i === index ? 'w-7 bg-fg' : 'w-2.5 bg-fg/25'}`} />
        ))}
      </div>
    </div>
  )
}
