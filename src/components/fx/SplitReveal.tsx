import { motion, type Variants } from 'framer-motion'
import { useMemo, type ElementType } from 'react'
import { springs, useReducedMotion } from '@/lib/motion'

/**
 * Word-by-word reveal: each word rises out of a clipped line and un-blurs, staggered.
 * The viewport observer watches the heading itself (not the clipped words, which are
 * translated out of view and would never count as "visible"); one orchestrated entrance,
 * plain text under reduced motion.
 */
const line: Variants = { hidden: {}, show: {} }

export function SplitReveal({ text, as: Tag = 'span', className, delay = 0, stagger = 0.045, id }: { text: string; as?: ElementType; className?: string; delay?: number; stagger?: number; id?: string }) {
  const reduce = useReducedMotion()
  const words = text.split(' ')
  const MotionTag = useMemo(() => motion.create(Tag as ElementType), [Tag])
  if (reduce) return <Tag id={id} className={className}>{text}</Tag>
  return (
    <MotionTag id={id} className={className} aria-label={text} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} variants={line}>
      {words.map((wd, i) => (
        <span key={`${wd}-${i}`} className="inline-block overflow-hidden pt-[0.12em] -mt-[0.12em] pb-[0.2em] -mb-[0.2em] align-bottom" aria-hidden="true">
          <motion.span
            className="inline-block will-change-transform"
            variants={{
              hidden: { y: '110%', opacity: 0, filter: 'blur(6px)' },
              show: { y: 0, opacity: 1, filter: 'blur(0px)', transition: { ...springs.enter, delay: delay + i * stagger } },
            }}
          >
            {wd}
          </motion.span>
        </span>
      )).flatMap((el, i) => (i < words.length - 1 ? [el, ' '] : [el]))}
    </MotionTag>
  )
}
