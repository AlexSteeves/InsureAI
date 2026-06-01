"use client"

import dynamic from "next/dynamic"

const ScrollText = dynamic(() => import("@/components/scroll-text"), { ssr: false })

export default function Manifesto() {
  return (
    <section className="py-24 px-8 bg-brand-secondary border-y border-border overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <p className="type-label text-brand-accent mb-8">Our Belief</p>
        <ScrollText
          phrase="The insurance industry hasn't changed in a hundred years. We replaced the agents, the adjusters, and the waiting rooms with a single AI that decides in seconds. Instant. Transparent. Built for how you actually live."
          className="font-serif font-bold text-brand-text"
          style={{
            fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
          }}
        />
      </div>
    </section>
  )
}
