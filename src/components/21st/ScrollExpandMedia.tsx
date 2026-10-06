import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Pattern from 21st.dev — "Scroll Media Expansion Hero" (arunachalam): a photo or video sits small
 * in the middle of a pinned section and grows to fill the viewport as you scroll; the title splits
 * apart around it. Rebuilt with framer-motion scroll values; static full frame under reduced motion.
 */
export function ScrollExpandMedia({ src, poster, mediaType = 'image', title, kicker, children, className }: {
  src: string; poster?: string; mediaType?: 'image' | 'video'; title: [string, string]; kicker?: string; children?: ReactNode; className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  const width = useTransform(scrollYProgress, [0, 0.7], ['38%', '100%'])
  const height = useTransform(scrollYProgress, [0, 0.7], ['46vh', '100vh'])
  const radius = useTransform(scrollYProgress, [0, 0.7], ['28px', '0px'])
  const spread = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const leftX = useTransform(spread, [0, 1], ['0%', '-60%'])
  const rightX = useTransform(spread, [0, 1], ['0%', '60%'])
  const titleOpacity = useTransform(scrollYProgress, [0.55, 0.8], [1, 0])
  const bodyOpacity = useTransform(scrollYProgress, [0.75, 0.95], [0, 1])
  const bodyY = useTransform(scrollYProgress, [0.75, 0.95], [40, 0])

  if (reduce) {
    return (
      <section className={cn('relative bg-ink text-white', className)}>
        {mediaType === 'video' ? <video src={src} poster={poster} muted loop playsInline className="h-[70vh] w-full object-cover" /> : <img src={src} alt="" className="h-[70vh] w-full object-cover" />}
        <div className="wrap py-16">{children}</div>
      </section>
    )
  }

  return (
    <section ref={ref} className={cn('relative h-[260vh] bg-ink text-white', className)}>
      <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden">
        <motion.div style={{ width, height, borderRadius: radius }} className="relative z-10 overflow-hidden shadow-float">
          {mediaType === 'video'
            ? <video src={src} poster={poster} muted loop playsInline autoPlay className="h-full w-full object-cover" />
            : <img src={src} alt="" className="h-full w-full object-cover" />}
          <div aria-hidden="true" className="absolute inset-0 bg-ink/20" />
        </motion.div>
        <motion.div style={{ opacity: titleOpacity }} className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center text-center mix-blend-screen">
          {kicker && <span className="mb-4 text-[14px] font-bold text-sky">{kicker}</span>}
          <div className="flex flex-wrap items-center justify-center gap-x-6 text-[44px] font-extrabold leading-none tracking-[-0.035em] sm:text-[72px] lg:text-[96px]">
            <motion.span style={{ x: leftX }}>{title[0]}</motion.span>
            <motion.span style={{ x: rightX }}>{title[1]}</motion.span>
          </div>
        </motion.div>
        <motion.div style={{ opacity: bodyOpacity, y: bodyY }} className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/80 to-transparent pb-16 pt-32">
          <div className="wrap">{children}</div>
        </motion.div>
      </div>
    </section>
  )
}
