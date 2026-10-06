import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Plays a generated clip (for example from Higgsfield, see scripts/higgsfield.ts) above the shader.
 * If the file is missing the layer stays empty and the shader shows through. Paused under reduced
 * motion and when offscreen.
 */
export function VideoBackground({ src, poster, className, opacity = 0.55 }: { src: string; poster?: string; className?: string; opacity?: number }) {
  const ref = useRef<HTMLVideoElement>(null)
  const reduce = useReducedMotion()
  const [ok, setOk] = useState(false)

  useEffect(() => {
    const v = ref.current
    if (!v) return
    const io = new IntersectionObserver(([e]) => { if (reduce) return; if (e.isIntersecting) v.play().catch(() => {}); else v.pause() }, { threshold: 0.05 })
    io.observe(v)
    return () => io.disconnect()
  }, [reduce, ok])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      preload="metadata"
      onLoadedData={() => setOk(true)}
      onError={() => setOk(false)}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-1000', className)}
      style={{ opacity: ok ? opacity : 0, mixBlendMode: 'screen' }}
    />
  )
}
