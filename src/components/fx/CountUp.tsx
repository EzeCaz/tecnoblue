import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'

/** Counts from 0 to `to` once the element is in view. */
export function CountUp({ to, suffix = '', prefix = '', decimals = 0, className }: { to: number; suffix?: string; prefix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const reduce = useReducedMotion()
  useEffect(() => {
    const el = ref.current
    if (!el || !inView) return
    if (reduce) { el.textContent = `${prefix}${to.toFixed(decimals)}${suffix}`; return }
    const controls = animate(0, to, { duration: 1.4, ease: [0.25, 0.1, 0.25, 1], onUpdate: (v) => { el.textContent = `${prefix}${v.toFixed(decimals)}${suffix}` } })
    return () => controls.stop()
  }, [inView, to, suffix, prefix, decimals, reduce])
  return <span ref={ref} className={className}>{prefix}0{suffix}</span>
}
