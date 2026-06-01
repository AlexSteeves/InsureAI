import Image from "next/image"
import { Navbar } from "@/components/navbar"
import { Server, Cpu, Globe, Zap, Shield, GitBranch, Lock, Brain } from "lucide-react"

const stack = [
  {
    layer: "Frontend",
    icon: Globe,
    iconBg: "bg-brand-accent/[0.10]",
    iconColor: "text-brand-accent",
    items: [
      { name: "Next.js 16", note: "App Router, server + client components" },
      { name: "TypeScript", note: "End-to-end type safety" },
      { name: "Tailwind CSS v4", note: "CSS-first config, design tokens via @theme" },
      { name: "shadcn/ui + base-ui", note: "Accessible component primitives (Slider, Select, Sheet)" },
      { name: "localStorage", note: "User-submitted claims cached per-browser — no shared state between visitors" },
    ],
  },
  {
    layer: "Backend API",
    icon: Server,
    iconBg: "bg-violet-500/[0.10]",
    iconColor: "text-violet-600",
    items: [
      { name: "FastAPI", note: "Async Python REST API with OpenAPI docs at /docs" },
      { name: "Pydantic v2", note: "Request validation with field-level validators (50–500 char description cap)" },
      { name: "In-memory store", note: "Preset policies and example claims hardcoded in store.py — zero database dependency" },
      { name: "No persistence", note: "User claims processed and returned immediately, never stored server-side" },
    ],
  },
  {
    layer: "AI Layer",
    icon: Cpu,
    iconBg: "bg-emerald-500/[0.10]",
    iconColor: "text-emerald-600",
    items: [
      { name: "Claude Sonnet 4.6", note: "Anthropic's model powering every claim decision" },
      { name: "Structured JSON output", note: "Deterministic decision, fraud_score, fraud_flags, reasoning, payout" },
      { name: "Rich claim context", note: "Policy age, coverage limit, deductible, claim type, incident date, loss amount all fed to Claude" },
      { name: "ClaimAI system prompt", note: "Role-scoped prompt with explicit fraud scoring logic and decision thresholds" },
    ],
  },
  {
    layer: "Data & Privacy",
    icon: Lock,
    iconBg: "bg-amber-500/[0.10]",
    iconColor: "text-amber-600",
    items: [
      { name: "demo-auto-policy", note: "Single hardcoded auto policy (Toyota Camry) — no user accounts" },
      { name: "3 preset claims", note: "One approved, one escalated, one denied — always visible as examples" },
      { name: "Browser-only user claims", note: "Submitted claims stored in localStorage, isolated per visitor" },
      { name: "No PII collected", note: "No sign-up, no email, no tracking — public demo safe by design" },
    ],
  },
]

const flow = [
  {
    step: "01",
    title: "Demo Page Loads",
    desc: "Browser fetches the hardcoded demo policy (demo-auto-policy) from GET /api/policies/demo-auto-policy. Preset example claims load from GET /api/claims/demo-auto-claims.",
  },
  {
    step: "02",
    title: "User Adjusts Policy Variables",
    desc: "Coverage limit, policy age, and deductible sliders let the user dial in scenario conditions. These are sent with the claim — not saved anywhere.",
  },
  {
    step: "03",
    title: "Claim Submitted",
    desc: "Claim type, incident date, estimated loss, and description POST to /api/claims. Pydantic validates the payload — description must be 50–500 characters.",
  },
  {
    step: "04",
    title: "Claude Analyzes the Claim",
    desc: "ai_service.py builds a structured prompt with all policy and claim context, then calls Claude Sonnet 4.6. Claude returns a strict JSON object with decision, fraud_score, fraud_flags, reasoning, and payout.",
  },
  {
    step: "05",
    title: "Result Returned & Cached",
    desc: "The API returns the result immediately — nothing is stored server-side. The frontend saves the claim to localStorage, then navigates to /claims/[id] to render the decision.",
  },
  {
    step: "06",
    title: "Result Rendered",
    desc: "The claim result page reads the preset claims from the API, or falls back to localStorage for user-submitted claims. Fraud score bar, AI reasoning, flags, and payout are all displayed.",
  },
]

const decisions = [
  {
    icon: Zap,
    iconBg: "bg-brand-accent/[0.10]",
    iconColor: "text-brand-accent",
    title: "No database",
    body: "Removing the DB eliminated SQLAlchemy, migrations, connection pooling, and seeding logic. The demo runs with a single Python file (store.py) as the data layer. Trivially deployable anywhere.",
  },
  {
    icon: Brain,
    iconBg: "bg-emerald-500/[0.10]",
    iconColor: "text-emerald-600",
    title: "Structured AI output",
    body: "Claude is instructed to return only valid JSON. A strict schema (decision, fraud_score, flags, reasoning, payout) makes the output deterministic and directly usable — no parsing, no post-processing.",
  },
  {
    icon: Shield,
    iconBg: "bg-violet-500/[0.10]",
    iconColor: "text-violet-600",
    title: "localStorage for user claims",
    body: "User-submitted claims are cached in the browser, not on the server. 100 visitors each see only their own claims. No shared state, no leakage, no privacy concerns — and no backend storage cost.",
  },
]

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <Navbar />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-16 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-4 h-4 text-brand-accent" />
          <p className="text-xs font-medium text-brand-accent uppercase tracking-widest">System Architecture</p>
        </div>
        <h1 className="type-h1 text-brand-text">How InsureAI is Built</h1>
        <p className="type-body text-brand-text/60 mt-4 max-w-[65ch]">
          A full-stack AI insurance demo exploring what a modern, zero-agent carrier could look like.
          Claude handles every claim decision end-to-end — no human adjusters, no underwriters, no database.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-24 flex flex-col gap-12">

        {/* Architecture Diagram */}
        <div className="rounded-3xl overflow-hidden border border-border bg-white dark:bg-card shadow-[0_4px_24px_rgba(212,145,26,0.08)] p-6">
          <Image
            src="/Images/InsureAI_Architecture.svg"
            alt="InsureAI system architecture diagram"
            width={1200}
            height={600}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Tech stack */}
        <div>
          <h2 className="type-h2 mb-6">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stack.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.layer} className="bg-white dark:bg-card rounded-3xl shadow-[0_4px_24px_rgba(212,145,26,0.08)] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                      <Icon className={`w-4 h-4 ${s.iconColor}`} />
                    </div>
                    <p className="type-h3 text-brand-text">{s.layer}</p>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {s.items.map((item) => (
                      <div key={item.name} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-accent/40 shrink-0" />
                        <div>
                          <span className="text-sm font-semibold text-brand-text">{item.name}</span>
                          <span className="text-sm text-brand-text/50"> — {item.note}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Claim flow */}
        <div>
          <h2 className="type-h2 mb-2">Claim Processing Flow</h2>
          <p className="type-sm text-brand-text/50 mb-8">What happens from page load to AI decision.</p>
          <div className="flex flex-col">
            {flow.map((f, i) => (
              <div key={f.step} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center shrink-0 z-10">
                    <span className="text-xs font-bold text-white">{f.step}</span>
                  </div>
                  {i < flow.length - 1 && <div className="w-px flex-1 bg-brand-accent/20 my-1" />}
                </div>
                <div className={`pb-8 ${i === flow.length - 1 ? "pb-0" : ""}`}>
                  <p className="text-sm font-bold text-brand-text mt-1.5">{f.title}</p>
                  <p className="text-sm text-brand-text/55 leading-relaxed mt-1">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key design decisions */}
        <div>
          <h2 className="type-h2 mb-6">Key Design Decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {decisions.map((d) => {
              const Icon = d.icon
              return (
                <div key={d.title} className="bg-white dark:bg-card rounded-3xl shadow-[0_4px_24px_rgba(212,145,26,0.08)] p-6 flex flex-col gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${d.iconBg}`}>
                    <Icon className={`w-4 h-4 ${d.iconColor}`} />
                  </div>
                  <p className="text-sm font-bold">{d.title}</p>
                  <p className="text-sm text-brand-text/55 leading-relaxed">{d.body}</p>
                </div>
              )
            })}
          </div>
        </div>

      </div>
    </main>
  )
}
