import { motion, useScroll, useSpring } from 'framer-motion'
import { springPhysics } from '@/lib/motion'

/** Thin page-progress line under the floating nav. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, springPhysics.settle)
  return <motion.div aria-hidden="true" style={{ scaleX }} className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-sky" />
}
