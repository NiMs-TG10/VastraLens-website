"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown } from "lucide-react"
import ParticleCanvas from "@/components/effects/ParticleCanvas"

export default function Hero() {
  const scrollToSection = (id: string) => {
    if (typeof document !== "undefined") {
      const element = document.getElementById(id)
      element?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Particle canvas — z-index: 1, sits below bg image and overlay */}
      <ParticleCanvas />
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/blue_bg.jpg')" }}
        aria-hidden="true"
      />
      {/* Dark overlay for text contrast */}
      <div className="absolute inset-0 bg-black/40" aria-hidden="true" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-6 leading-tight text-balance">
          Your Style.
          <br />
          <span className="text-purple-400">Perfected</span> by AI.
        </h1>

        <p className="font-sans text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed text-balance">
          Stop guessing. Get personalized, AI-driven style recommendations that match your unique body, budget, and
          existing wardrobe.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            onClick={() => scrollToSection("app")}
            className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-lg font-medium"
          >
            <ArrowDown className="w-4 h-4 mr-2" />
            See how it works
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce z-10">
        <ArrowDown className="w-6 h-6 text-primary" />
      </div>
    </section>
  )
}
