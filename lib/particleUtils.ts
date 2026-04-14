// Interfaces

export interface Particle {
  x: number
  y: number
  baseVx: number
  baseVy: number
  vx: number
  vy: number
  radius: number
  color: string
  opacity: number
}

export interface PointerState {
  x: number
  y: number
  active: boolean
}

// Constants

export const BRAND_COLORS = [
  "#7C3AED",
  "#6D28D9",
  "#8B5CF6",
  "#A78BFA",
  "#3B82F6",
  "#60A5FA",
  "#93C5FD",
] as const

export const OPACITY_MIN = 0.5
export const OPACITY_MAX = 0.85
export const MAX_LINE_OPACITY = 0.5
export const REPEL_STRENGTH = 2.5
export const EASE_STRENGTH = 0.05

// Pure utility functions

export function distance(ax: number, ay: number, bx: number, by: number): number {
  const dx = bx - ax
  const dy = by - ay
  return Math.sqrt(dx * dx + dy * dy)
}

export function createParticle(
  canvasWidth: number,
  canvasHeight: number,
  reducedMotion: boolean
): Particle {
  const color = BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]
  const opacity = OPACITY_MIN + Math.random() * (OPACITY_MAX - OPACITY_MIN)
  const radius = 2 + Math.random() * 3.0 // [2, 5]
  const x = Math.random() * canvasWidth
  const y = Math.random() * canvasHeight

  const baseVx = reducedMotion ? 0 : (Math.random() - 0.5)
  const baseVy = reducedMotion ? 0 : (Math.random() - 0.5)

  return {
    x,
    y,
    baseVx,
    baseVy,
    vx: baseVx,
    vy: baseVy,
    radius,
    color,
    opacity,
  }
}

export function applyPointerInfluence(
  particle: Particle,
  px: number,
  py: number,
  radius: number
): void {
  const dx = particle.x - px
  const dy = particle.y - py
  const dist = Math.sqrt(dx * dx + dy * dy)

  if (dist < radius && dist > 0) {
    const force = (1 - dist / radius) * REPEL_STRENGTH
    particle.vx += (dx / dist) * force
    particle.vy += (dy / dist) * force
  }
}

export function easeBack(particle: Particle, easeStrength: number): void {
  particle.vx += (particle.baseVx - particle.vx) * easeStrength
  particle.vy += (particle.baseVy - particle.vy) * easeStrength
}

export function connectionOpacity(dist: number, maxDist: number): number {
  return Math.max(0, (1 - dist / maxDist)) * MAX_LINE_OPACITY
}
