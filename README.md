# Tecno.Blue — website (v3, product-led)

Rebuild of [tecno.blue](https://tecno.blue/en/) as a fast, bilingual (EN/ES) single-page app with an
interactive WebGL hero, a Remotion product demo, spring-based motion (Apple Design skill) and pinned
scroll sequences. Design notes: `DESIGN.md`.

**Stack:** Vite 8 · React 19 · TypeScript · Tailwind v4 · framer-motion · GSAP ScrollTrigger · OGL · Remotion

## Run

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # production build in dist/
npm run preview      # serve the production build
npm run video:preview   # Remotion Studio for the hero demo
npm run video:render    # export the demo to public/video/field-demo.mp4
```

## Where things live

| Path | What |
|---|---|
| `src/i18n/content.ts` | All copy (EN/ES), the five partners, clients, testimonials |
| `src/index.css` | Tailwind theme tokens, glass materials, marquee/breathe keyframes |
| `src/lib/motion.ts` | Spring presets in Apple's damping/response language, reduced-motion hook |
| `src/components/fx/` | ShaderBackground (OGL), ParticleField (flow field), VideoBackground, Magnetic, TiltCard, CountUp, Reveal, SplitReveal, Intro, ScrollProgress, DemoPlayer |
| `src/video/FieldDemo.tsx` | The Remotion composition played in the hero |
| `src/components/sections/` | Hero, ClientMarquee, KineticBand, SolutionsRail (pinned) + DragRail (touch), MiniUI, FitFinder, WhyBento, Testimonials, Cta |
| `src/components/21st/` | Adapted 21st.dev patterns: ContainerScroll, RotatingWords, InfiniteMovingCards, SpotlightCard, BackgroundPaths, ScrollExpandMedia |
| `src/pages/` | Home, Solutions, About, Contact |

## Generated video with Higgsfield

`scripts/higgsfield.ts` uses the official SDK to create a still with Soul, animate it with DoP and save the
clip under `public/video/`. It needs an API key from console.higgsfield.ai with credit on the balance.

```bash
export HF_CREDENTIALS="KEY_ID:KEY_SECRET"
npm run higgsfield -- hero      # Seedance 2.5 text-to-video; presets: hero, field, contact, retail, screens, all
npm run higgsfield -- hero --dop  # alternative: Soul still + DoP camera motion
npm run seedance                # verified minimal example (sunset clip)
```

Then set `VITE_HERO_VIDEO=/video/hero-bg.mp4` in `.env` and the clip plays over the WebGL hero
(screen-blended, paused offscreen and under reduced motion).

## 21st.dev components

Sources were pulled from cdn.21st.dev and adapted in `src/components/21st/`: Container Scroll Animation and
Infinite Moving Cards (manuarora700 / Aceternity), Animated Hero rotating words (tommyjepsen), plus
Spotlight Card and Background Paths patterns re-implemented for this stack.

## Behaviour notes

- `?motion=off` on any URL disables entrance animations and the shader loop (screenshots, reviews).
- `prefers-reduced-motion` gets cross-fades only, a still demo frame and a stacked (unpinned) solutions list.
- The contact form posts to `VITE_CONTACT_ENDPOINT` (see `.env.example`); without it, it simulates success.

## Deploy

`npm run build` produces a static `dist/`. Configure a SPA fallback so `/about`, `/solutions` and `/contact`
resolve to `index.html`.
