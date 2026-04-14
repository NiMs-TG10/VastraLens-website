import { useEffect, useRef } from "react"
import type { RefObject } from "react"
import {
  createParticle,
  applyPointerInfluence,
  easeBack,
  connectionOpacity,
  distance,
  EASE_STRENGTH,
} from "@/lib/particleUtils"
import type { Particle, PointerState } from "@/lib/particleUtils"

export function useParticleEffect(
  canvasRef: RefObject<HTMLCanvasElement>,
  options: {
    particleCount: number
    influenceRadius: number
    connectionDistance: number
  }
): void {
  const { particleCount, influenceRadius, connectionDistance } = options

  const particlesRef = useRef<Particle[]>([])
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false })
  const animFrameId = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // SSR guard + reduced motion
    const reducedMotion =
      typeof window !== "undefined"
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false

    // 3.2 — Initialize particles
    const w = canvas.width || canvas.offsetWidth
    const h = canvas.height || canvas.offsetHeight
    particlesRef.current = Array.from({ length: particleCount }, () =>
      createParticle(w, h, reducedMotion)
    )

    // 3.3 — Animation loop
    const tick = () => {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      const canvasWidth = canvas.width
      const canvasHeight = canvas.height

      if (canvasWidth === 0 || canvasHeight === 0) {
        animFrameId.current = requestAnimationFrame(tick)
        return
      }

      ctx.clearRect(0, 0, canvasWidth, canvasHeight)

      const pointer = pointerRef.current
      const particles = particlesRef.current

      for (const p of particles) {
        if (pointer.active) {
          applyPointerInfluence(p, pointer.x, pointer.y, influenceRadius)
        } else {
          easeBack(p, EASE_STRENGTH)
        }

        if (!reducedMotion) {
          p.x += p.vx
          p.y += p.vy
        }

        // Edge wrapping
        if (p.x < -p.radius) p.x = canvasWidth + p.radius
        if (p.x > canvasWidth + p.radius) p.x = -p.radius
        if (p.y < -p.radius) p.y = canvasHeight + p.radius
        if (p.y > canvasHeight + p.radius) p.y = -p.radius
      }

      // Draw connection lines
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = distance(particles[i].x, particles[i].y, particles[j].x, particles[j].y)
          if (dist < connectionDistance) {
            const alpha = connectionOpacity(dist, connectionDistance)
            ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`
            ctx.globalAlpha = alpha
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      // Draw particles
      ctx.globalAlpha = 1
      for (const p of particles) {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.opacity
        ctx.fill()
      }
      ctx.globalAlpha = 1

      animFrameId.current = requestAnimationFrame(tick)
    }

    animFrameId.current = requestAnimationFrame(tick)

    // 3.4 — Pointer event listeners on parent section
    const section = canvas.parentElement
    if (!section) return

    const onMouseMove = (event: Event) => {
      const e = event as MouseEvent
      const rect = canvas.getBoundingClientRect()
      pointerRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      }
    }

    const onMouseLeave = () => {
      pointerRef.current = { ...pointerRef.current, active: false }
    }

    const onTouchMove = (event: Event) => {
      const e = event as TouchEvent
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        pointerRef.current = {
          x: e.touches[0].clientX - rect.left,
          y: e.touches[0].clientY - rect.top,
          active: true,
        }
      }
    }

    const onTouchEnd = () => {
      pointerRef.current = { ...pointerRef.current, active: false }
    }

    section.addEventListener("mousemove", onMouseMove)
    section.addEventListener("mouseleave", onMouseLeave)
    section.addEventListener("touchmove", onTouchMove)
    section.addEventListener("touchend", onTouchEnd)

    // 3.5 — ResizeObserver
    let ro: ResizeObserver | null = null
    let debounceTimer: ReturnType<typeof setTimeout> | null = null

    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect
        canvas.width = width
        canvas.height = height
        particlesRef.current.forEach((p) => {
          p.x = Math.min(p.x, width)
          p.y = Math.min(p.y, height)
        })
      })
      ro.observe(section)
    } else {
      // Fallback: debounced window resize
      const onWindowResize = () => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          const rect = section.getBoundingClientRect()
          canvas.width = rect.width
          canvas.height = rect.height
          particlesRef.current.forEach((p) => {
            p.x = Math.min(p.x, rect.width)
            p.y = Math.min(p.y, rect.height)
          })
        }, 100)
      }
      window.addEventListener("resize", onWindowResize)

      // 3.6 — Cleanup (fallback path)
      return () => {
        cancelAnimationFrame(animFrameId.current)
        if (debounceTimer) clearTimeout(debounceTimer)
        window.removeEventListener("resize", onWindowResize)
        section.removeEventListener("mousemove", onMouseMove)
        section.removeEventListener("mouseleave", onMouseLeave)
        section.removeEventListener("touchmove", onTouchMove)
        section.removeEventListener("touchend", onTouchEnd)
      }
    }

    // 3.6 — Cleanup (ResizeObserver path)
    return () => {
      cancelAnimationFrame(animFrameId.current)
      ro?.disconnect()
      section.removeEventListener("mousemove", onMouseMove)
      section.removeEventListener("mouseleave", onMouseLeave)
      section.removeEventListener("touchmove", onTouchMove)
      section.removeEventListener("touchend", onTouchEnd)
    }
  }, [particleCount, influenceRadius, connectionDistance])
}
