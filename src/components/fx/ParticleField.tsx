import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

/**
 * Flow-field particle layer. Particles drift along a curl-noise field, are pulled into a swirl around
 * the pointer, and pick up speed with scroll velocity. Canvas 2D, ~700 particles, pauses offscreen.
 * Reduced motion: one static frame.
 */
export function ParticleField({ className, count = 700, color = '68, 180, 230' }: { className?: string; count?: number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
    let w = 0, h = 0
    const P = new Float32Array(count * 4) // x, y, vx, vy
    const life = new Float32Array(count)
    const seed = () => { for (let i = 0; i < count; i++) { P[i * 4] = Math.random() * w; P[i * 4 + 1] = Math.random() * h; P[i * 4 + 2] = 0; P[i * 4 + 3] = 0; life[i] = Math.random() * 400 } }
    const resize = () => {
      const r = canvas.parentElement!.getBoundingClientRect()
      w = r.width; h = r.height
      canvas.width = w * dpr; canvas.height = h * dpr
      canvas.style.width = `${w}px`; canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    resize()
    const ro = new ResizeObserver(resize); ro.observe(canvas.parentElement!)

    // pointer + scroll energy (eased each frame: interruptible, starts from the current value)
    const target = { x: -9999, y: -9999, on: 0 }
    const cur = { x: -9999, y: -9999, on: 0 }
    let scrollEnergy = 0, lastY = window.scrollY
    const onMove = (e: PointerEvent) => { const r = canvas.getBoundingClientRect(); target.x = e.clientX - r.left; target.y = e.clientY - r.top; target.on = 1; if (cur.on === 0) { cur.x = target.x; cur.y = target.y } }
    const onLeave = () => { target.on = 0 }
    const onScroll = () => { const y = window.scrollY; scrollEnergy = Math.min(1, scrollEnergy + Math.abs(y - lastY) / 600); lastY = y }
    const host = canvas.parentElement!
    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerleave', onLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    // cheap 2D value noise for the flow field
    const perm = new Uint8Array(512); for (let i = 0; i < 256; i++) perm[i] = i; for (let i = 255; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = perm[i]; perm[i] = perm[j]; perm[j] = t } for (let i = 0; i < 256; i++) perm[256 + i] = perm[i]
    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10)
    const grad = (hash: number, x: number, y: number) => { const g = hash & 3; return (g & 1 ? -x : x) + (g & 2 ? -y : y) }
    const noise = (x: number, y: number) => {
      const X = Math.floor(x) & 255, Y = Math.floor(y) & 255; x -= Math.floor(x); y -= Math.floor(y)
      const u = fade(x), v = fade(y), A = perm[X] + Y, B = perm[X + 1] + Y
      const l = (a: number, b: number, t: number) => a + t * (b - a)
      return l(l(grad(perm[A], x, y), grad(perm[B], x - 1, y), u), l(grad(perm[A + 1], x, y - 1), grad(perm[B + 1], x - 1, y - 1), u), v)
    }

    let raf = 0, visible = true, t = 0
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduce) loop() }, { threshold: 0.01 })
    io.observe(canvas)

    const step = () => {
      t += 0.0035
      cur.x += (target.x - cur.x) * 0.12; cur.y += (target.y - cur.y) * 0.12; cur.on += (target.on - cur.on) * 0.08
      scrollEnergy *= 0.94
      ctx.clearRect(0, 0, w, h)
      const speed = 0.55 + scrollEnergy * 2.2
      for (let i = 0; i < count; i++) {
        const o = i * 4
        let x = P[o], y = P[o + 1]
        const a = noise(x * 0.0022 + t, y * 0.0022 - t * 0.7) * Math.PI * 2
        let vx = Math.cos(a) * speed, vy = Math.sin(a) * speed
        if (cur.on > 0.01) {
          const dx = x - cur.x, dy = y - cur.y, d2 = dx * dx + dy * dy, r = 260
          if (d2 < r * r) {
            const d = Math.sqrt(d2) + 0.001, k = (1 - d / r) * cur.on
            // swirl around the pointer with a gentle pull inward
            vx += (-dy / d) * k * 2.6 - (dx / d) * k * 0.5
            vy += (dx / d) * k * 2.6 - (dy / d) * k * 0.5
          }
        }
        P[o + 2] = P[o + 2] * 0.9 + vx * 0.1; P[o + 3] = P[o + 3] * 0.9 + vy * 0.1
        x += P[o + 2]; y += P[o + 3]
        life[i] += 1
        if (x < -4 || x > w + 4 || y < -4 || y > h + 4 || life[i] > 520) { x = Math.random() * w; y = Math.random() * h; life[i] = 0; P[o + 2] = 0; P[o + 3] = 0 }
        P[o] = x; P[o + 1] = y
        const fadeIn = Math.min(1, life[i] / 40), fadeOut = Math.min(1, (520 - life[i]) / 60)
        const alpha = 0.16 * fadeIn * fadeOut + (cur.on > 0.01 ? 0.25 * Math.max(0, 1 - Math.hypot(x - cur.x, y - cur.y) / 260) : 0)
        ctx.fillStyle = `rgba(${color}, ${alpha})`
        const s = 1 + (scrollEnergy * 1.2)
        ctx.fillRect(x, y, s, s)
      }
    }
    const loop = () => { cancelAnimationFrame(raf); const tick = () => { if (!visible) return; step(); raf = requestAnimationFrame(tick) }; raf = requestAnimationFrame(tick) }
    if (reduce) { for (let i = 0; i < 90; i++) step() } else loop()

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); host.removeEventListener('pointermove', onMove); host.removeEventListener('pointerleave', onLeave); window.removeEventListener('scroll', onScroll) }
  }, [count, color, reduce])

  return <canvas ref={ref} aria-hidden="true" className={cn('pointer-events-none absolute inset-0', className)} />
}
