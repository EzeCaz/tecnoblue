import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { springs, useReducedMotion } from '@/lib/motion'

/** One-time entrance as a block enters the viewport (opacity + transform only: compositor-friendly). Plain under reduced motion. */
export function Reveal({ children, className, delay = 0, y = 28 }: { children: ReactNode; className?: string; delay?: number; y?: number; blur?: boolean }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0.25, delay } : { ...springs.enter, delay }}
    >
      {children}
    </motion.div>
  )
}
