import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { springs, useReducedMotion } from '@/lib/motion'

/** One-time entrance as a block enters the viewport. Cross-fade only under reduced motion. */
export function Reveal({ children, className, delay = 0, y = 28, blur = true }: { children: ReactNode; className?: string; delay?: number; y?: number; blur?: boolean }) {
  const reduce = useReducedMotion()
  if (reduce) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={className}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y, filter: blur ? 'blur(6px)' : 'none' }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.2 }}
      transition={reduce ? { duration: 0.25, delay } : { ...springs.enter, delay }}
    >
      {children}
    </motion.div>
  )
}
