import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Shield, Zap, Trophy, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">

      <Navbar>
        <Link href="/dashboard">
          <Button className="bg-brand-accent hover:bg-brand-primary text-white shadow-[0_0_20px_rgba(67,59,255,0.20)] hover:shadow-[0_0_28px_rgba(67,59,255,0.35)] transition-all">
            Get Insured
          </Button>
        </Link>
      </Navbar>

      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center px-8 min-h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/Images/clouds.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        {/* Edge blur — transparent center, blurred edges */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            maskImage: "radial-gradient(ellipse 52% 58% at 50% 50%, transparent 0%, transparent 22%, rgba(0,0,0,0.7) 62%, black 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 52% 58% at 50% 50%, transparent 0%, transparent 22%, rgba(0,0,0,0.7) 62%, black 100%)",
          }}
        />

        {/* Fade to page background at the bottom */}

        {/* Hero text — directly on image */}
        <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-4xl w-full">
          <h1 className="text-7xl font-bold tracking-tight leading-[1.05] text-brand-text">
            Insurance That Works at the{" "}
            <span className="text-brand-accent">Speed of Life</span>
          </h1>

          <p className="text-2xl text-brand-text/70 leading-relaxed">
            Instant policies. AI-handled claims. No humans, no waiting.
          </p>

          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-brand-accent hover:bg-brand-primary text-white px-8 shadow-[0_0_20px_rgba(67,59,255,0.25)] hover:shadow-[0_0_28px_rgba(67,59,255,0.40)] transition-all"
              >
                Get Insured in 60 Seconds
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                className="bg-white/60 hover:bg-white/80 backdrop-blur-sm border border-white/70 text-brand-text px-8 transition-all"
              >
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-brand-secondary border-y border-border">
        <div className="max-w-5xl mx-auto px-8 py-8 grid grid-cols-3 divide-x divide-border">
          <div className="text-center px-8">
            <p className="text-3xl font-bold text-brand-accent">60s</p>
            <p className="text-sm text-brand-text/60 leading-relaxed mt-1">Average time to bind a policy</p>
          </div>
          <div className="text-center px-8">
            <p className="text-3xl font-bold text-brand-accent">100%</p>
            <p className="text-sm text-brand-text/60 leading-relaxed mt-1">AI-powered claims decisions</p>
          </div>
          <div className="text-center px-8">
            <p className="text-3xl font-bold text-brand-accent">$0</p>
            <p className="text-sm text-brand-text/60 leading-relaxed mt-1">Agent fees. Now or ever.</p>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-brand-text">Built different</h2>
            <p className="text-brand-text/60 leading-relaxed mt-3 max-w-md mx-auto">
              Traditional insurance is slow, opaque, and built around agents.
              We replaced all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            <div className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(67,59,255,0.07)]">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/[0.10] flex items-center justify-center">
                <Zap className="text-brand-accent w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-brand-text">Instant Bind</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                Get a policy in under 60 seconds. No paperwork, no agents, no waiting rooms.
              </p>
            </div>

            <div className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(67,59,255,0.07)]">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/[0.10] flex items-center justify-center">
                <Shield className="text-brand-accent w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-brand-text">AI Claims</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                File a claim and get a decision in seconds. No adjusters, no delays, no phone calls.
              </p>
            </div>

            <div className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(67,59,255,0.07)]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/[0.12] flex items-center justify-center">
                <Trophy className="text-amber-500 w-5 h-5" />
              </div>
              <h3 className="text-xl font-semibold text-brand-text">Win What You Cover</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                Stay claim-free and earn rewards. Discounts, badges, and bonuses stack over time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-brand-secondary py-24 px-8 border-y border-border">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-brand-text">How it works</h2>
            <p className="text-brand-text/60 leading-relaxed mt-3">Three steps. One minute.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

            <div className="flex flex-col gap-4">
              <span className="text-6xl font-bold text-brand-accent/15 leading-none">01</span>
              <h3 className="text-xl font-semibold text-brand-text">Tell us about yourself</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                Name, email, what you need covered and how much. Takes about 20 seconds.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-6xl font-bold text-brand-accent/15 leading-none">02</span>
              <h3 className="text-xl font-semibold text-brand-text">Get an instant quote</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                Our AI prices your policy in real time. No underwriter review, no waiting days for a callback.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <span className="text-6xl font-bold text-brand-accent/15 leading-none">03</span>
              <h3 className="text-xl font-semibold text-brand-text">Bind and you&apos;re covered</h3>
              <p className="text-sm text-brand-text/60 leading-relaxed">
                One click. Policy issued instantly. Coverage starts the moment you confirm.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 px-8 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl font-bold text-brand-text">Ready in 60 seconds.</h2>
          <p className="text-brand-text/60 leading-relaxed">
            No agents. No paperwork. No surprises. Just coverage that works.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-brand-accent hover:bg-brand-primary text-white px-10 shadow-[0_0_24px_rgba(67,59,255,0.25)] hover:shadow-[0_0_32px_rgba(67,59,255,0.40)] transition-all"
            >
              Get Insured Now <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

    </main>
  )
}
