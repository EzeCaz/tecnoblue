import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ShaderBackground } from '@/components/fx/ShaderBackground'
import { springs, useReducedMotion } from '@/lib/motion'

export function PageHero({ kicker, title, lead, children }: { kicker: string; title: string; lead?: string; children?: ReactNode }) {
  const reduce = useReducedMotion()
  const item = (delay: number) => reduce ? {} : ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0,  }, transition: { ...springs.enter, delay } })
  return (
    <section className="relative overflow-hidden bg-ink text-white">
      <ShaderBackground />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-ground" />
      <div className="wrap relative z-10 pb-36 pt-40 text-center sm:pt-48">
        <motion.p {...item(0)} className="text-[14px] font-bold text-sky">{kicker}</motion.p>
        <motion.h1 {...item(0.06)} className="title mx-auto mt-3 max-w-[20ch] text-white">{title}</motion.h1>
        {lead && <motion.p {...item(0.12)} className="lead mx-auto mt-6 max-w-[60ch] text-white/75">{lead}</motion.p>}
        {children && <motion.div {...item(0.18)} className="mt-9 flex flex-wrap items-center justify-center gap-3">{children}</motion.div>}
      </div>
    </section>
  )
}
