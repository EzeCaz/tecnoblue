import { useEffect, useRef } from 'react'
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useVelocity, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'

/**
 * Kinetic text band: a huge line of the five categories drifts sideways and accelerates with the
 * user's scroll velocity, reversing direction when they scroll up. Static under reduced motion.
 */
export function KineticBand({ words }: { words: readonly string[] }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 })
  const factor = useTransform(smooth, [-3000, 0, 3000], [-6, 1, 6], { clamp: true })
  const dir = useRef(1)
  const ref = useRef<HTMLDivElement>(null)
  const half = useRef(0)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => { half.current = el.scrollWidth / 2 }
    measure()
    const ro = new ResizeObserver(measure); ro.observe(el)
    return () => ro.disconnect()
  }, [words])

  useAnimationFrame((_, delta) => {
    if (reduce) return
    const f = factor.get()
    if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1
    const base = 60 // px per second at rest
    const moveBy = dir.current * base * Math.max(1, Math.abs(f)) * (delta / 1000)
    const h = half.current
    let next = x.get() - moveBy
    if (h > 0) { if (next <= -h) next += h; if (next > 0) next -= h }
    x.set(next)
  })

  const line = words.map((w, i) => <span key={`${w}-${i}`} className="flex items-center gap-10"><span>{w}</span><span className="h-3 w-3 rounded-full bg-sky" /></span>)
  return (
    <div className="overflow-hidden bg-ink py-7 text-white" aria-label={words.join(', ')} role="marquee">
      <motion.div ref={ref} style={{ x }} className="flex w-max gap-10 whitespace-nowrap will-change-transform text-[40px] font-extrabold tracking-[-0.03em] sm:text-[56px]">
        {line}<span aria-hidden="true" className="contents">{line}</span>
      </motion.div>
    </div>
  )
}
