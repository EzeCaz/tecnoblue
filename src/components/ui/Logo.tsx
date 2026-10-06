import { Link } from 'react-router-dom'
import { cn } from '@/lib/cn'

export function Logo({ className, inverse = false }: { className?: string; inverse?: boolean }) {
  return (
    <Link to="/" aria-label="Tecno.Blue, home" className={cn('inline-flex items-center gap-2 rounded-lg', className)}>
      <img src="/images/logo-mark.png" alt="" width={30} height={30} className="h-[30px] w-[30px]" />
      <span className={cn('text-[19px] font-extrabold tracking-[-0.03em]', inverse ? 'text-white' : 'text-navy')}>tecno<span className="text-sky">.</span>blue</span>
    </Link>
  )
}
