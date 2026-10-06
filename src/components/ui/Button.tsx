import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { springs, useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

type Variant = 'primary' | 'secondary' | 'inverse' | 'ghost'
type Size = 'sm' | 'md' | 'lg'

const base = 'relative inline-flex items-center justify-center gap-3 rounded-full font-bold select-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 will-change-transform'
const variants: Record<Variant, string> = {
  primary: 'bg-blue text-white shadow-glow hover:bg-blue-deep',
  secondary: 'bg-white text-navy ring-1 ring-inset ring-line hover:ring-blue/50 shadow-soft',
  inverse: 'bg-white text-navy hover:bg-ground',
  ghost: 'bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white/15',
}
const sizes: Record<Size, string> = { sm: 'h-10 px-4 text-[14px]', md: 'h-12 px-6 text-[15px]', lg: 'h-14 pl-7 pr-2 text-[16px]' }

type Common = { variant?: Variant; size?: Size; className?: string; icon?: boolean; children?: ReactNode }

/** Trailing icon nested in its own circle (button-in-button). */
function Trail({ dark }: { dark?: boolean }) {
  return (
    <span className={cn('flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-px', dark ? 'bg-navy/10' : 'bg-white/20')}>
      <ArrowUpRight className="h-4 w-4" strokeWidth={2.25} />
    </span>
  )
}

/** Feedback on pointer-down (scale 0.97 via a critically damped spring), never only on release. */
const press = { whileTap: { scale: 0.97 }, transition: springs.quick }

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & Common>(
  ({ variant = 'primary', size = 'md', className, icon, children, ...props }, ref) => {
    const reduce = useReducedMotion()
    return (
      <motion.button ref={ref} {...(reduce ? {} : press)} className={cn('group', base, variants[variant], size === 'lg' && !icon ? 'h-14 px-8 text-[16px]' : sizes[size], className)} {...(props as object)}>
        {children}{icon && <Trail dark={variant !== 'primary'} />}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'

export function ButtonLink({ to, variant = 'primary', size = 'md', className, icon, children, ...props }: { to: string } & Common & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'>) {
  const reduce = useReducedMotion()
  const cls = cn('group', base, variants[variant], size === 'lg' && !icon ? 'h-14 px-8 text-[16px]' : sizes[size], className)
  const inner = <>{children}{icon && <Trail dark={variant !== 'primary'} />}</>
  if (/^https?:/.test(to)) return <motion.a href={to} target="_blank" rel="noreferrer" className={cls} {...(reduce ? {} : press)} {...(props as object)}>{inner}</motion.a>
  return <motion.span {...(reduce ? {} : press)} className="inline-flex"><Link to={to} className={cls} {...props}>{inner}</Link></motion.span>
}
