import { useReducedMotion as useFramerReducedMotion, type Transition } from 'framer-motion'

/** True under prefers-reduced-motion or with `?motion=off` in the URL (screenshots, reviews). */
export function useReducedMotion(): boolean {
  const prefers = useFramerReducedMotion()
  if (prefers) return true
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('motion') === 'off'
}

/**
 * Springs in Apple's two-parameter language (damping ratio + response), mapped to framer-motion's
 * bounce + duration. Critically damped by default; bounce only after a momentum gesture.
 */
export const springs = {
  /** damping 1.0, response 0.4 — the house default for anything a user touches */
  default: { type: 'spring', bounce: 0, duration: 0.4 } as Transition,
  /** damping 1.0, response 0.3 — quick UI feedback (press, hover) */
  quick: { type: 'spring', bounce: 0, duration: 0.3 } as Transition,
  /** damping ~0.8, response 0.4 — after a flick or release */
  momentum: { type: 'spring', bounce: 0.2, duration: 0.4 } as Transition,
  /** damping ~0.8, response 0.3 — sheets, drawers */
  sheet: { type: 'spring', bounce: 0.2, duration: 0.3 } as Transition,
  /** entrance: a touch heavier, still no overshoot */
  enter: { type: 'spring', bounce: 0, duration: 0.7 } as Transition,
}

/** Stiffness/damping equivalents for useSpring (continuous values like tilt and magnetism). */
export const springPhysics = {
  tilt: { stiffness: 170, damping: 26, mass: 0.6 },
  magnet: { stiffness: 220, damping: 24, mass: 0.5 },
  settle: { stiffness: 120, damping: 20, mass: 0.8 },
}

export const ease = [0.25, 0.1, 0.25, 1] as const
