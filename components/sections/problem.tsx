"use client";

import React from "react";
import { Package, ShoppingCart, Brain } from "lucide-react";

export default function Problem() {
  return (
    // Adjusted vertical padding to be smaller on mobile (py-16) and larger on desktop (md:py-24)
    <section id="problem" className="py-16 md:py-24 px-6 bg-surface-dark">
      <div className="max-w-6xl mx-auto">
        <h2
          // Made the font size responsive: text-4xl on mobile, scaling up to md:text-5xl
          className="font-display text-4xl md:text-5xl font-bold text-center text-surface-dark-foreground mb-4 text-balance"
        >
          Fashion is Personal. Your Recommendations Should Be.
        </h2>

        <p className="text-center text-muted-foreground text-lg mb-12 md:mb-16 text-balance">
          We understand the challenges both consumers and retailers face.
        </p>

        {/* Three Column Grid - Stacks on mobile (default) and becomes 3 columns on tablet/desktop (md:grid-cols-3) */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* Column 1: B2C Problem */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-6 rounded-full">
                <Package className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-display text-2xl font-bold text-surface-dark-foreground">
              B2C Problem
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              A closet full of clothes, but nothing to wear. Generic
              recommendations don&apos;t match your unique style or body.
            </p>
          </div>

          {/* Column 2: B2B Problem */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-6 rounded-full">
                <ShoppingCart className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-display text-2xl font-bold text-surface-dark-foreground">
              B2B Problem
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              High return rates and generic suggestions kill conversions. Your
              platform needs smarter recommendations.
            </p>
          </div>

          {/* Column 3: Our Solution */}
          <div className="text-center space-y-4">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-6 rounded-full">
                <Brain className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h3 className="font-display text-2xl font-bold text-surface-dark-foreground">
              Our Solution
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              We use AI to understand the person, not just the product.
              Hyper-personalized recommendations that convert.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
