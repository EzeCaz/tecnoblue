import { useRef, type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { springPhysics, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/** 3D tilt that follows the pointer with independent X/Y springs and a moving highlight. */
export function TiltCard({ children, className, max = 8, glare = true }: { children: ReactNode; className?: string; max?: number; glare?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, springPhysics.tilt)
  const sy = useSpring(py, springPhysics.tilt)
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = ref.current!.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { px.set(0.5); py.set(0.5) }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 1000 }}
      className={cn('relative', className)}
    >
      {children}
      {glare && !reduce && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{ background: 'radial-gradient(circle at var(--gx) var(--gy), rgb(255 255 255 / 0.28), transparent 45%)', ['--gx' as string]: glareX, ['--gy' as string]: glareY }}
        />
      )}
    </motion.div>
  )
}
