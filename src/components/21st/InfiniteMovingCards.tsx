import { cn } from '@/lib/cn'

export type MovingCard = { quote: string; name: string; title: string; logo?: string }

/**
 * Adapted from 21st.dev — "Infinite Moving Cards" by manuarora700 (Aceternity UI).
 * The track is duplicated once and translated by half its width for a seamless loop.
 * Changes: React duplication instead of DOM cloning, light cards, logo slot, reduced-motion static.
 */
export function InfiniteMovingCards({ items, direction = 'left', speed = 'normal', pauseOnHover = true, className }: { items: MovingCard[]; direction?: 'left' | 'right'; speed?: 'fast' | 'normal' | 'slow'; pauseOnHover?: boolean; className?: string }) {
  const duration = speed === 'fast' ? '28s' : speed === 'normal' ? '48s' : '80s'
  const Card = ({ it, hidden }: { it: MovingCard; hidden?: boolean }) => (
    <li aria-hidden={hidden} className="relative w-[340px] max-w-full shrink-0 rounded-[24px] bg-surface p-7 shadow-soft ring-1 ring-line md:w-[420px]">
      <blockquote>
        {it.logo && <img src={it.logo} alt={hidden ? '' : it.name} width={130} height={32} loading="lazy" className="h-8 w-auto max-w-[130px] rounded-md object-contain dark:bg-white dark:px-2 dark:py-1" />}
        <p className="mt-5 text-[15px] leading-relaxed text-fg">“{it.quote}”</p>
        <footer className="mt-5 text-[13px] text-fg-3"><span className="font-bold text-fg">{it.name}</span>, {it.title}</footer>
      </blockquote>
    </li>
  )
  return (
    <div className={cn('mask-fade-x relative w-full overflow-hidden [--gap:1.25rem]', pauseOnHover && 'pause-on-hover', className)}>
      <ul className={cn('animate-marquee flex w-max shrink-0 gap-[var(--gap)] py-2 pr-[var(--gap)] motion-reduce:animate-none', direction === 'right' && '[animation-direction:reverse]')} style={{ ['--marquee-duration' as string]: duration }}>
        {items.map((it, i) => <Card key={`a-${i}`} it={it} />)}
        {items.map((it, i) => <Card key={`b-${i}`} it={it} hidden />)}
      </ul>
    </div>
  )
}
