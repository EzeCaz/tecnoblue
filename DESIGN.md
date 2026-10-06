# Tecno.Blue v3 — product-led, fluid, interactive

Seed: direction 05 (product-led) from the five mockups, rebuilt with far more depth.

## Concept
"Show the software working." The site demonstrates what Tecno.Blue implements instead of describing it:
a Remotion-rendered product demo plays in the hero, the five platforms are explored in a pinned horizontal
scroll sequence with live mini-interfaces, and the proof section is a bento of perpetual micro-interactions.

## Tokens
| Token | Value | Use |
|---|---|---|
| ink | #070d1a | hero and dark bands (WebGL background lives here) |
| navy | #0b1f3a | headings, text on light |
| blue | #0977bc | brand accent, CTAs |
| sky | #44b4e6 | highlights on dark, focus ring |
| ground | #f3f6fb | page background |
| line | #dfe6ef | hairlines |
| slate / muted | #4a5a75 / #7b879a | body / captions |
| green | #1a9b5a | positive status |

Type: Plus Jakarta Sans 400–800. Tracking tightens with size (-0.035em display, -0.02em titles, 0 body).

## Motion (from the Apple Design skill)
- Springs everywhere a user can touch: critically damped by default (`bounce 0, duration 0.4`),
  a little bounce only after momentum (`bounce 0.2`). Feedback on pointer-down. Interruptible: framer
  springs re-target from the live value and carry velocity.
- Magnetic buttons and tilt cards run on `useMotionValue` + `useSpring`, never React state.
- One orchestrated hero entrance; scroll-driven sequences use GSAP ScrollTrigger (scrub, pin).
- `prefers-reduced-motion`: cross-fades only, static shader frame, demo shows a still, no pinning.
- `?motion=off` reproduces reduced motion for screenshots.

## Interactive layers
- `ShaderBackground` (OGL): domain-warped noise in navy/blue that follows the pointer.
- `DemoPlayer` (@remotion/player): "A day in the field" composition, 12 s loop, can be rendered to MP4 with
  the Remotion CLI for social use.
- `SolutionsRail`: pinned horizontal scroll across five platform panels (vertical stack under 1024px).
- `WhyBento`: breathing status dots, auto-sorting task list (layout animations), count-up metrics.
