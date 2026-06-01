"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Sun, Moon, Menu, X } from "lucide-react"

function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "light" | "dark" | null
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle("dark", stored === "dark")
    }
    setMounted(true)
  }, [])

  if (!mounted) return <div className="w-[52px] h-8" />

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
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/75 dark:bg-brand-bg/80 backdrop-blur-md shadow-[0_1px_16px_rgba(212,145,26,0.06)]">
      <div className="flex items-center justify-between px-6 md:px-12 py-3">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="InsureAI logo" width={26} height={26} />
          <span className="text-xl font-semibold tracking-tight text-brand-text font-serif">
            InsureAI
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/architecture" className="text-sm text-brand-text/60 hover:text-brand-text transition-colors">
            Architecture
          </Link>
          <Link href="/demo" className="text-sm text-brand-text/60 hover:text-brand-text transition-colors">
            Demo
          </Link>
          <ThemeToggle />
          {children}
        </div>

        {/* Mobile: theme toggle + burger */}
        <div className="flex items-center gap-3 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="Toggle menu"
            className="p-1 text-brand-text"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-1 px-6 pb-4 bg-white/95 dark:bg-brand-bg/95 backdrop-blur-md border-t border-border">
          <Link href="/architecture" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-brand-text/60 hover:text-brand-text transition-colors">
            Architecture
          </Link>
          <Link href="/demo" onClick={() => setMenuOpen(false)} className="py-2 text-sm text-brand-text/60 hover:text-brand-text transition-colors">
            Demo
          </Link>
          {children && <div className="pt-2">{children}</div>}
        </div>
      )}
    </nav>
  )
}
