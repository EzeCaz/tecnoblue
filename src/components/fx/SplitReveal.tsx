import { motion } from 'framer-motion'
import type { ElementType } from 'react'
import { springs, useReducedMotion } from '@/lib/motion'

/**
 * Word-by-word reveal: each word rises out of a clipped line and un-blurs, staggered.
 * One orchestrated entrance when the heading scrolls into view; plain text under reduced motion.
 */
export function SplitReveal({ text, as: Tag = 'span', className, delay = 0, stagger = 0.045, id }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number; id?: string }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  if (reduce) return <Tag id={id} className={className}>{text}</Tag>
  return (
    <Tag id={id} className={className} aria-label={text}>
      {words.map((wd, i) => (
        <span key={`${wd}-${i}`} className="inline-block overflow-hidden pb-[0.2em] -mb-[0.2em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
            whileInView={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ ...springs.enter, delay: delay + i * stagger }}
          >
            {wd}
          </motion.span>
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
