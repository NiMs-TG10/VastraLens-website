// components/Navigation.tsx

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Define props for the Navigation component
interface NavigationProps {
  // NEW PROP: Function to be called when the "Contact Us" button is pressed
  onContactClick: () => void;
}

export default function Navigation({ onContactClick }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (id === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? "bg-surface-dark backdrop-blur-md shadow-lg"
          : "bg-transparent backdrop-blur-sm"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo - MADE INTO A BUTTON TO SCROLL TO HOME */}
        <button
          onClick={() => scrollToSection("home")}
          className="text-2xl font-display font-bold cursor-pointer focus:outline-none bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] hover:drop-shadow-[0_0_18px_rgba(168,85,247,0.9)] transition-all duration-300"
          aria-label="Go to home screen"
        >
          VastraLens
        </button>

        {/* Nav Links */}
        <div
          className={`hidden md:flex gap-8 items-center ${isScrolled ? "text-white" : "text-foreground"}`}
        >
          <NavLink
            id="app"
            label="App"
            scrollToSection={scrollToSection}
          />
          <NavLink
            id="platform"
            label="Platform"
            scrollToSection={scrollToSection}
          />

          <NavLink
            id="final-cta"
            label="Subscribe"
            scrollToSection={scrollToSection}
          />
        </div>

        {/* CTA Button: NOW TRIGGERS THE POPUP */}
        <Button
          onClick={onContactClick} // <-- NEW: Calls the handler passed from the parent
          className="bg-primary hover:bg-primary/90 text-white font-medium px-6 py-2"
        >
          Contact Us
        </Button>
      </div>
    </nav>
  );
}

// --- Reusable Component for Nav Links ---
interface NavLinkProps {
  id: string;
  label: string;
  scrollToSection: (id: string) => void;
}

const NavLink: React.FC<NavLinkProps> = ({ id, label, scrollToSection }) => (
  <button
    onClick={() => scrollToSection(id)}
    // Added 'group' for hover effects
    className="text-sm transition-all duration-200
               relative group
               hover:text-primary
               focus:outline-none"
  >
    {/* The actual text content */}
    <span
      className="inline-block transition-transform duration-200 ease-in-out
                 group-hover:scale-110
                 group-hover:animate-wobble-text
                 "
    >
      {label}
    </span>

    {/* Custom Underline Element */}
    <span
      className="absolute bottom-[-4px] left-0 w-full h-[2px]
                 bg-primary transform origin-left scale-x-0
                 transition-transform duration-300 ease-in-out
                 group-hover:scale-x-100"
    />
  </button>
);
