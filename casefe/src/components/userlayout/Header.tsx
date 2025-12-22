"use client"

import { Scale } from "lucide-react"
import { Button } from "../ui/button"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Scale className="h-10 w-10 text-primary" />
            <span className="text-xl md:text-2xl lg:text-4xl font-semibold text-foreground">LegalFlow</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 lg:gap-14">
            <a
              href="#features"
              className="text-sm md:text-lg lg:text-2xl font-bold text-black transition-colors"
            >
              Features
            </a>
            <a
              href="#work"
              className="text-sm md:text-lg lg:text-2xl font-bold text-black transition-colors"
            >
              How It Works
            </a>
            
            <a
              href="#contact"
              className="text-sm md:text-lg lg:text-2xl font-bold text-black transition-colors"
            >
              Contact
            </a>
          </nav>

         
        </div>
      </div>
    </header>
  )
}

export default Header;