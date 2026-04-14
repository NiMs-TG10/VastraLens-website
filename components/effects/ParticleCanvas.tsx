"use client"

import { useRef } from "react"
import type { RefObject } from "react"
import { useParticleEffect } from "@/hooks/useParticleEffect"

interface ParticleCanvasProps {
  particleCount?: number
  influenceRadius?: number
  connectionDistance?: number
}

export default function ParticleCanvas({
  particleCount = 150,
  influenceRadius = 120,
  connectionDistance = 150,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null) as RefObject<HTMLCanvasElement>

  useParticleEffect(canvasRef, { particleCount, influenceRadius, connectionDistance })

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}
    />
  )
}
