import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion'
import { springPhysics, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Pattern from 21st.dev — "Spotlight Card" (jahed / easemize): a radial highlight follows the pointer.
 * Implemented with motion values (no state), spring-smoothed, disabled under reduced motion.
 */
export function SpotlightCard({ children, className, color = 'rgb(9 119 188 / 0.14)' }: { children: ReactNode; className?: string; color?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(-400)
  const y = useMotionValue(-400)
  const sx = useSpring(x, springPhysics.magnet)
  const sy = useSpring(y, springPhysics.magnet)
  const bg = useMotionTemplate`radial-gradient(360px circle at ${sx}px ${sy}px, ${color}, transparent 70%)`
  const onMove = (e: PointerEvent<HTMLDivElement>) => { const r = ref.current!.getBoundingClientRect(); x.set(e.clientX - r.left); y.set(e.clientY - r.top) }
  const onLeave = () => { x.set(-400); y.set(-400) }
  return (
    <div ref={ref} onPointerMove={reduce ? undefined : onMove} onPointerLeave={onLeave} className={cn('group relative overflow-hidden', className)}>
      {!reduce && <motion.div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: bg }} />}
      <div className="relative">{children}</div>
    </div>
  )
}
