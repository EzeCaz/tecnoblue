import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { springs, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Adapted from 21st.dev — "Animated Hero" by tommyjepsen: the headline's last phrase cycles through
 * a list, each entering from below and leaving upward (same path both ways). Spring from motion.ts.
 */
export function RotatingWords({ words, interval = 2600, className }: { words: readonly string[]; interval?: number; className?: string }) {
  const reduce = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduce) return
    const id = window.setTimeout(() => setI((n) => (n + 1) % words.length), interval)
    return () => window.clearTimeout(id)
  }, [i, interval, reduce, words.length])
  if (reduce) return <span className={className}>{words[0]}</span>
  return (
    <span className={cn('relative inline-grid overflow-hidden align-bottom', className)} aria-live="polite">
      {/* sizer keeps the line width stable */}
      <span className="invisible col-start-1 row-start-1 whitespace-nowrap">{words.reduce((a, b) => (a.length > b.length ? a : b))}</span>
      <AnimatePresence initial={false}>
        <motion.span
          key={words[i]}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={springs.default}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
