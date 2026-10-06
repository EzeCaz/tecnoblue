import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion, useMotionValue, animate, type PanInfo } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'

/**
 * Touch/narrow-screen carousel with Apple-style physics: 1:1 drag, momentum projection on release
 * (exponential decay, d = 0.998), snap to the nearest panel from the PROJECTED endpoint, spring
 * hand-off that carries the release velocity, and rubber-banding at the ends.
 */
export function DragRail({ children, count, gap = 20 }: { children: ReactNode; count: number; gap?: number }) {
  const reduce = useReducedMotion()
  const viewport = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const [panelW, setPanelW] = useState(0)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const el = viewport.current
    if (!el) return
    const measure = () => setPanelW(el.clientWidth * 0.86)
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const step = panelW + gap
  const minX = -(step * (count - 1))
  const project = (v: number, d = 0.998) => (v / 1000) * d / (1 - d)
  const rubber = (over: number, dim: number, c = 0.55) => (over * dim * c) / (dim + c * Math.abs(over))

  const onDrag = (_: unknown, info: PanInfo) => {
    // 1:1 tracking with progressive resistance past the ends
    const raw = x.get()
    if (raw > 0) x.set(rubber(raw, panelW))
    else if (raw < minX) x.set(minX + rubber(raw - minX, panelW))
    void info
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    const current = x.get()
    const projected = current + project(info.velocity.x)
    const target = Math.round(Math.min(0, Math.max(minX, projected)) / step) * step
    setIndex(Math.round(-target / step))
    animate(x, target, { type: 'spring', bounce: 0.2, duration: 0.4, velocity: info.velocity.x })
  }
  const goTo = (i: number) => { const target = -i * step; setIndex(i); animate(x, target, reduce ? { duration: 0 } : { type: 'spring', bounce: 0, duration: 0.4 }) }

  return (
    <div>
      <div ref={viewport} className="overflow-hidden px-5 sm:px-10">
        <motion.div
          drag={reduce ? false : 'x'}
          dragMomentum={false}
          dragElastic={0}
          onDrag={onDrag}
          onDragEnd={onDragEnd}
          style={{ x, display: 'flex', gap, touchAction: 'pan-y', cursor: reduce ? 'auto' : 'grab' }}
          whileTap={reduce ? undefined : { cursor: 'grabbing' }}
          className="[&>*]:w-[86%] [&>*]:shrink-0"
        >
          {children}
        </motion.div>
      </div>
      <div className="mt-6 flex items-center justify-center gap-2" role="tablist" aria-label="Solutions">
        {Array.from({ length: count }).map((_, i) => (
          <button key={i} type="button" role="tab" aria-selected={i === index} aria-label={`${i + 1} / ${count}`} onClick={() => goTo(i)} className={`h-2.5 cursor-pointer rounded-full transition-[width,background-color] duration-300 ${i === index ? 'w-7 bg-navy' : 'w-2.5 bg-fg/25'}`} />
        ))}
      </div>
    </div>
  )
}
