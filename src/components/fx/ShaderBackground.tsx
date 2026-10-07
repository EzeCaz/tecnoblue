import { useEffect, useRef } from 'react'
import { Renderer, Program, Mesh, Triangle } from 'ogl'
import { useReducedMotion } from '@/lib/motion'
import { cn } from '@/lib/cn'

const vertex = /* glsl */ `
attribute vec2 uv; attribute vec2 position;
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`

const fragment = /* glsl */ `
precision highp float;
uniform float uTime; uniform vec2 uRes; uniform vec2 uMouse; uniform float uMouseStrength;
varying vec2 vUv;

vec3 hash3(vec2 p){ vec3 q = vec3(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)), dot(p, vec2(419.2, 371.9))); return fract(sin(q) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash3(i).x, hash3(i+vec2(1,0)).x, u.x), mix(hash3(i+vec2(0,1)).x, hash3(i+vec2(1,1)).x, u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0; float a = 0.5; for(int i=0;i<5;i++){ v += a*noise(p); p = p*2.03 + vec2(1.7, 9.2); a *= 0.5; } return v; }

void main(){
  vec2 uv = vUv; vec2 p = uv; p.x *= uRes.x / uRes.y;
  float t = uTime * 0.06;
  vec2 m = uMouse; m.x *= uRes.x / uRes.y;
  float d = distance(p, m);
  float pull = uMouseStrength * 0.55 * exp(-d * 2.2);
  vec2 q = vec2(fbm(p + t), fbm(p - t * 0.7 + 3.1));
  vec2 r = vec2(fbm(p + 1.6*q + vec2(1.7, 9.2) + t*0.4 + (m - p) * pull), fbm(p + 1.6*q + vec2(8.3, 2.8) - t*0.3));
  float f = fbm(p + 1.4*r);
  vec3 ink = vec3(0.027, 0.051, 0.102);
  vec3 navy = vec3(0.043, 0.122, 0.228);
  vec3 blue = vec3(0.035, 0.467, 0.737);
  vec3 sky = vec3(0.267, 0.706, 0.902);
  vec3 col = mix(ink, navy, smoothstep(0.2, 0.75, f));
  col = mix(col, blue, smoothstep(0.55, 0.95, f) * 0.85);
  col = mix(col, sky, smoothstep(0.8, 1.0, f + pull * 0.6) * 0.7);
  col += pull * 0.18 * sky;
  float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
  col *= mix(0.55, 1.0, vig);
  gl_FragColor = vec4(col, 1.0);
}
`

/**
 * Mouse-reactive domain-warped noise on a fullscreen triangle (OGL).
 * Pauses when offscreen; renders a single still frame under reduced motion.
 */
export function ShaderBackground({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    const host = ref.current
    if (!host) return
    let renderer: Renderer
    // Half-resolution render (the noise is soft anyway) at DPR 1: ~4-9x fewer fragment evaluations than full-res retina.
    const SCALE = 0.5
    try { renderer = new Renderer({ dpr: 1, alpha: false, antialias: false }) } catch { return }
    const gl = renderer.gl
    if (!gl) return
    gl.canvas.style.position = 'absolute'
    gl.canvas.style.inset = '0'
    gl.canvas.style.width = '100%'
    gl.canvas.style.height = '100%'
    host.appendChild(gl.canvas)

    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
        uMouseStrength: { value: 0 },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host
      renderer.setSize(Math.max(1, Math.round(w * SCALE)), Math.max(1, Math.round(h * SCALE)))
      gl.canvas.style.width = '100%'; gl.canvas.style.height = '100%'
      program.uniforms.uRes.value = [w, h]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    // pointer: target values, eased in the loop (interruptible, always from the current value)
    const target = { x: 0.5, y: 0.5, s: 0 }
    const current = { x: 0.5, y: 0.5, s: 0 }
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
      target.s = 1
    }
    const onLeave = () => { target.s = 0 }
    host.addEventListener('pointermove', onMove, { passive: true })
    host.addEventListener('pointerleave', onLeave)

    let raf = 0
    let visible = true
    const onVis = () => { if (document.hidden) { cancelAnimationFrame(raf); raf = 0 } else if (visible && !reduce && !window.matchMedia('(max-width: 767px)').matches) loop() }
    document.addEventListener('visibilitychange', onVis)
    let start = performance.now()
    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible && !reduce && !window.matchMedia('(max-width: 767px)').matches) loop() }, { threshold: 0.01 })
    io.observe(host)

    const frame = (now: number) => {
      current.x += (target.x - current.x) * 0.06
      current.y += (target.y - current.y) * 0.06
      current.s += (target.s - current.s) * 0.05
      program.uniforms.uTime.value = (now - start) / 1000
      program.uniforms.uMouse.value = [current.x, current.y]
      program.uniforms.uMouseStrength.value = current.s
      renderer.render({ scene: mesh })
    }
    const loop = () => {
      cancelAnimationFrame(raf)
      const tick = (now: number) => { if (!visible) return; frame(now); raf = requestAnimationFrame(tick) }
      raf = requestAnimationFrame(tick)
    }
    const small = window.matchMedia('(max-width: 767px)').matches
    if (reduce || small) { start = performance.now() - 20000; frame(performance.now()) } else loop()

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('visibilitychange', onVis)
      ro.disconnect(); io.disconnect()
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      gl.canvas.remove()
    }
  }, [reduce])

  return <div ref={ref} aria-hidden="true" className={cn('absolute inset-0 overflow-hidden bg-ink', className)} />
}
