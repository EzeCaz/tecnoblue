import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useReducedMotion } from '@/lib/motion'

/**
 * One-time brand intro per browser session: the mark draws in, then the curtain lifts and the hero
 * takes over. Skipped under reduced motion and on return visits in the same session.
 */
export function Intro() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(() => {
    if (reduce) return false
    try { return sessionStorage.getItem('tb-intro') !== '1' } catch { return false }
  })
  useEffect(() => {
    if (!show) return
    try { sessionStorage.setItem('tb-intro', '1') } catch { /* ignore */ }
    const t = setTimeout(() => setShow(false), 1500)
    return () => clearTimeout(t)
  }, [show])
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[70] flex items-center justify-center bg-ink"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }}
          aria-hidden="true"
        >
          <motion.div initial={{ scale: 0.6, opacity: 0, filter: 'blur(10px)' }} animate={{ scale: 1, opacity: 1, filter: 'blur(0px)' }} transition={{ type: 'spring', bounce: 0, duration: 0.9 }} className="flex items-center gap-3">
            <img src="/images/logo-mark.png" alt="" width={56} height={56} className="h-14 w-14" />
            <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35, duration: 0.5 }} className="text-[34px] font-extrabold tracking-[-0.03em] text-white">tecno<span className="text-sky">.</span>blue</motion.span>
          </motion.div>
          <motion.div className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-sky" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.3, ease: 'linear' }} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
