"use client"

import Lenis from "lenis"
import "lenis/dist/lenis.css"
import { useEffect } from "react"

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true })
    return () => lenis.destroy()
  }, [])

  return <>{children}</>
}
