import { motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Pattern from 21st.dev — "Background Paths" (kokonutd / KokonutUI): layered SVG curves whose dashes drift
 * continuously. Rebuilt for this stack; static strokes under reduced motion.
 */
export function BackgroundPaths({ className, color = 'rgb(255 255 255)' }: { className?: string; color?: string }) {
  const reduce = useReducedMotion()
  const paths = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 6 * 1} -${189 + i * 7}C-${380 - i * 6} -${189 + i * 7} -${312 - i * 6} ${216 - i * 7} ${152 - i * 6} ${343 - i * 7}C${616 - i * 6} ${470 - i * 7} ${684 - i * 6} ${875 - i * 7} ${684 - i * 6} ${875 - i * 7}`,
    width: 0.5 + i * 0.03,
    opacity: 0.06 + i * 0.02,
    dur: 18 + i * 1.2,
  }))
  return (
    <div aria-hidden="true" className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      <svg className="h-full w-full" viewBox="0 0 696 316" fill="none" preserveAspectRatio="xMidYMid slice">
        {paths.map((p) => (
          <motion.path
            key={p.id}
            d={p.d}
            stroke={color}
            strokeWidth={p.width}
            strokeOpacity={p.opacity}
            initial={{ pathLength: 0.4, pathOffset: 0 }}
            animate={reduce ? undefined : { pathLength: [0.35, 0.65, 0.35], pathOffset: [0, 1, 0] }}
            transition={{ duration: p.dur, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </svg>
    </div>
  )
}
