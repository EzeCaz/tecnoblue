import { useRef, type ReactNode } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'
import { useMediaQuery } from '@/lib/media'
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
  const narrow = useMediaQuery('(max-width: 639px)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })
  // Phones start wider (a 38% frame is a sliver at 375px) and the title spreads less so it stays on screen.
  const width = useTransform(scrollYProgress, [0, 0.7], [narrow ? '74%' : '38%', '100%'])
  const height = useTransform(scrollYProgress, [0, 0.7], [narrow ? '52dvh' : '46dvh', '100dvh'])
  const radius = useTransform(scrollYProgress, [0, 0.7], ['28px', '0px'])
  const spread = useTransform(scrollYProgress, [0, 0.6], [0, 1])
  const leftX = useTransform(spread, [0, 1], ['0%', narrow ? '-8%' : '-22%'])
  const rightX = useTransform(spread, [0, 1], ['0%', narrow ? '8%' : '22%'])
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
      <div className="sticky top-0 flex h-dvh items-center justify-center overflow-hidden">
        <motion.div style={{ width, height, borderRadius: radius }} className="relative z-10 overflow-hidden shadow-float">
          {mediaType === 'video'
            ? <video src={src} poster={poster} muted loop playsInline autoPlay className="h-full w-full object-cover" />
            : <img src={src} alt="" width={1200} height={667} className="h-full w-full object-cover" />}
          <div aria-hidden="true" className="absolute inset-0 bg-ink/20" />
        </motion.div>
        <motion.div style={{ opacity: titleOpacity }} className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-5 text-center [text-shadow:0_2px_24px_rgb(7_13_26_/_0.6)]">
          {kicker && <span className="mb-5 rounded-full bg-ink/50 px-3 py-1 text-[13px] font-bold text-sky backdrop-blur-sm sm:mb-6 sm:text-[14px]">{kicker}</span>}
          <div className="flex max-w-full flex-wrap items-center justify-center gap-x-6 gap-y-1 text-[40px] font-extrabold leading-none tracking-[-0.035em] sm:text-[72px] lg:text-[96px]">
            <motion.span style={{ x: leftX }}>{title[0]}</motion.span>
            <motion.span style={{ x: rightX }}>{title[1]}</motion.span>
          </div>
        </motion.div>
        <motion.div style={{ opacity: bodyOpacity, y: bodyY }} className="absolute inset-x-0 bottom-0 z-20 bg-gradient-to-t from-ink via-ink/90 to-transparent pb-16 pt-40 [text-shadow:0_1px_12px_rgb(7_13_26_/_0.8)] sm:pt-48">
          <div className="wrap">{children}</div>
        </motion.div>
      </div>
    </section>
  )
}

