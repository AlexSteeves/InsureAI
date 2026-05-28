"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sun, Moon } from "lucide-react"

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
  }, [])

  function toggle() {
    const next = theme === "light" ? "dark" : "light"
    setTheme(next)
    document.documentElement.classList.toggle("dark", next === "dark")
    localStorage.setItem("theme", next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="flex items-center gap-0.5 border-2 border-brand-accent rounded-full p-1 hover:bg-brand-secondary/40 transition-all"
    >
      <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
        theme === "light" ? "bg-brand-accent text-white" : "text-brand-text/40"
      }`}>
        <Sun className="w-3 h-3" />
      </span>
      <span className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
        theme === "dark" ? "bg-brand-accent text-white" : "text-brand-text/40"
      }`}>
        <Moon className="w-3 h-3" />
      </span>
    </button>
  )
}

interface NavbarProps {
  children?: React.ReactNode
}

export function Navbar({ children }: NavbarProps) {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-12 py-3 bg-white/75 backdrop-blur-md shadow-[0_1px_16px_rgba(67,59,255,0.06)]">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/logo.svg" alt="InsureAI logo" width={26} height={26} />
        <span className="text-xl font-semibold tracking-tight text-brand-text font-serif">
          InsureAI
        </span>
      </Link>

      <div className="flex items-center gap-6">
        <Link
          href="/architecture"
          className="text-sm text-brand-text/60 hover:text-brand-text transition-colors"
        >
          Architecture
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-brand-text/60 hover:text-brand-text transition-colors"
        >
          Demo
        </Link>
        <Link
          href="/dashboard"
          className="text-sm text-brand-text/60 hover:text-brand-text transition-colors"
        >
          Dashboard
        </Link>
        <ThemeToggle />
        {children}
      </div>
    </nav>
  )
}
