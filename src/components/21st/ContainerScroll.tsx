import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { springPhysics, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Adapted from 21st.dev — "Container Scroll Animation" by manuarora700 (Aceternity UI).
 * The stage lies back in 3D and stands up as it scrolls into view. Changes from the original:
 * progress is tied to the element's own entry (no 80rem spacer), values pass through a spring,
 * and reduced motion renders the resting state.
 */
export function ContainerScroll({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 95%', 'start 35%'] })
  const rotateRaw = useTransform(scrollYProgress, [0, 1], [18, 0])
  const scaleRaw = useTransform(scrollYProgress, [0, 1], [1.06, 1])
  const yRaw = useTransform(scrollYProgress, [0, 1], [40, 0])
  const rotateX = useSpring(rotateRaw, springPhysics.settle)
  const scale = useSpring(scaleRaw, springPhysics.settle)
  const y = useSpring(yRaw, springPhysics.settle)
  return (
    <div ref={ref} className={cn('relative', className)} style={{ perspective: 1100 }}>
      <motion.div style={reduce ? undefined : { rotateX, scale, y, transformStyle: 'preserve-3d' }}>{children}</motion.div>
    </div>
  )
}
