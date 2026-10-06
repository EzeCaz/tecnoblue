import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { springPhysics, useReducedMotion } from '@/lib/motion'

/** Wraps a control so it is pulled a few pixels toward the pointer. Motion values only, no React state. */
export function Magnetic({ children, strength = 0.35, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, springPhysics.magnet)
  const sy = useSpring(y, springPhysics.magnet)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = ref.current!.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const onLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy, display: 'inline-block' }} onPointerMove={onMove} onPointerLeave={onLeave} className={className}>
      {children}
    </motion.div>
  )
}
