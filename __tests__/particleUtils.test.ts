import { describe, it, expect } from "vitest"
import * as fc from "fast-check"
import {
  createParticle,
  applyPointerInfluence,
  connectionOpacity,
  BRAND_COLORS,
  OPACITY_MIN,
  OPACITY_MAX,
  type Particle,
} from "../lib/particleUtils"

// Feature: interactive-hero-effect, Property 1: Particles always use brand colors
describe("Property 1: Particles always use brand colors", () => {
  it("particle.color is always a member of BRAND_COLORS", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 2000 }),
        fc.integer({ min: 1, max: 2000 }),
        fc.boolean(),
        (width, height, reducedMotion) => {
          const particle = createParticle(width, height, reducedMotion)
          return (BRAND_COLORS as readonly string[]).includes(particle.color)
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: interactive-hero-effect, Property 2: Pointer influence is radius-bounded
describe("Property 2: Pointer influence is radius-bounded", () => {
  const particleArb = fc.record({
    x: fc.double({ min: 0, max: 500, noNaN: true }),
    y: fc.double({ min: 0, max: 500, noNaN: true }),
    vx: fc.double({ min: -1, max: 1, noNaN: true }),
    vy: fc.double({ min: -1, max: 1, noNaN: true }),
    baseVx: fc.double({ min: -1, max: 1, noNaN: true }),
    baseVy: fc.double({ min: -1, max: 1, noNaN: true }),
    radius: fc.double({ min: 1.5, max: 3.5, noNaN: true }),
    opacity: fc.double({ min: 0.15, max: 0.45, noNaN: true }),
    color: fc.constantFrom(...BRAND_COLORS),
  })

  it("velocity is unchanged when particle is outside influence radius", () => {
    fc.assert(
      fc.property(
        particleArb,
        fc.double({ min: 0, max: 500, noNaN: true }),
        fc.double({ min: 0, max: 500, noNaN: true }),
        fc.double({ min: 50, max: 200, noNaN: true }),
        (particleBase, px, py, influenceRadius) => {
          const dx = particleBase.x - px
          const dy = particleBase.y - py
          const dist = Math.sqrt(dx * dx + dy * dy)

          const particle: Particle = { ...particleBase }
          const prevVx = particle.vx
          const prevVy = particle.vy

          applyPointerInfluence(particle, px, py, influenceRadius)

          if (dist >= influenceRadius) {
            // Velocity must be unchanged
            return particle.vx === prevVx && particle.vy === prevVy
          } else {
            // Just verify it runs without error (no assertion on direction)
            return true
          }
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: interactive-hero-effect, Property 7: Particle opacity is within the legibility range
describe("Property 7: Particle opacity is within the legibility range", () => {
  it("particle.opacity is always within [OPACITY_MIN, OPACITY_MAX]", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 2000 }),
        fc.integer({ min: 1, max: 2000 }),
        fc.boolean(),
        (width, height, reducedMotion) => {
          const particle = createParticle(width, height, reducedMotion)
          return particle.opacity >= OPACITY_MIN && particle.opacity <= OPACITY_MAX
        }
      ),
      { numRuns: 100 }
    )
  })
})

// Feature: interactive-hero-effect, Property 8: Connection line opacity falls off with distance
describe("Property 8: Connection line opacity falls off with distance", () => {
  it("connectionOpacity is strictly decreasing with distance", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50, max: 200, noNaN: true }),
        // Generate d1 and d2 as distinct fractions of connectionDistance
        fc.integer({ min: 0, max: 98 }),
        fc.integer({ min: 1, max: 99 }),
        (connectionDistance, i1, i2) => {
          // Ensure d1 < d2 strictly, both in [0, connectionDistance)
          const lo = Math.min(i1, i2)
          const hi = Math.max(i1, i2)
          if (lo === hi) return true // skip equal case

          const d1 = (lo / 100) * connectionDistance
          const d2 = (hi / 100) * connectionDistance

          return connectionOpacity(d1, connectionDistance) > connectionOpacity(d2, connectionDistance)
        }
      ),
      { numRuns: 100 }
    )
  })

  it("connectionOpacity is 0 at exactly connectionDistance", () => {
    fc.assert(
      fc.property(
        fc.double({ min: 50, max: 200, noNaN: true }),
        (connectionDistance) => {
          return connectionOpacity(connectionDistance, connectionDistance) === 0
        }
      ),
      { numRuns: 100 }
    )
  })
})
