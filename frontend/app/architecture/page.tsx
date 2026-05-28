import { Navbar } from "@/components/navbar"
import { Database, Server, Cpu, Globe, ArrowRight, Zap, Shield, GitBranch } from "lucide-react"

const stack = [
  {
    layer: "Frontend",
    icon: Globe,
    color: "bg-brand-accent/[0.08] text-brand-accent",
    iconBg: "bg-brand-accent/[0.10]",
    items: [
      { name: "Next.js 16", note: "App Router, server + client components" },
      { name: "TypeScript", note: "End-to-end type safety" },
      { name: "Tailwind CSS v4", note: "CSS-first config, design tokens via @theme" },
      { name: "shadcn/ui", note: "Accessible, unstyled component primitives" },
    ],
  },
  {
    layer: "Backend API",
    icon: Server,
    color: "bg-violet-500/[0.08] text-violet-600",
    iconBg: "bg-violet-500/[0.10]",
    items: [
      { name: "FastAPI", note: "Async Python REST API with OpenAPI docs" },
      { name: "SQLAlchemy ORM", note: "Model definitions, migrations, query layer" },
      { name: "SQLite → PostgreSQL", note: "SQLite in dev, swappable via DATABASE_URL" },
      { name: "Pydantic schemas", note: "Request/response validation and serialization" },
    ],
  },
  {
    layer: "AI Layer",
    icon: Cpu,
    color: "bg-emerald-500/[0.08] text-emerald-600",
    iconBg: "bg-emerald-500/[0.10]",
    items: [
      { name: "Claude Sonnet 4.6", note: "Anthropic's model powering claims decisions" },
      { name: "Structured JSON output", note: "Deterministic decision, fraud score, reasoning" },
      { name: "Multimodal input", note: "Accepts up to 3 base64-encoded photos per claim" },
      { name: "ClaimAI system prompt", note: "Role-scoped prompt with fraud scoring logic" },
    ],
  },
  {
    layer: "Data Models",
    icon: Database,
    color: "bg-amber-500/[0.08] text-amber-600",
    iconBg: "bg-amber-500/[0.10]",
    items: [
      { name: "Policy", note: "holder, coverage type, amount, premium, claim-free days" },
      { name: "Claim", note: "description, images, status, fraud_score, fraud_flags, payout" },
      { name: "Demo seed", note: "TRU-DEMO0001 auto-seeded on startup for live demos" },
      { name: "UUID primary keys", note: "All IDs are UUIDs — no sequential leakage" },
    ],
  },
]

const flow = [
  { step: "01", title: "Policy Load", desc: "Browser loads the dashboard and fetches the demo policy (TRU-DEMO0001) directly from FastAPI. No sign-up required." },
  { step: "02", title: "Claim Submission", desc: "User opens the claim Sheet on the dashboard. Description + optional photos (base64) POST to /api/claims." },
  { step: "03", title: "Claude Analysis", desc: "ai_service.py builds a multimodal message with policy context and sends it to Claude Sonnet 4.6 with a structured JSON prompt." },
  { step: "04", title: "Decision Stored", desc: "Claude returns decision, fraud_score, fraud_flags, and reasoning. The Claim row is updated and the claim ID is returned to the client." },
  { step: "05", title: "Result Rendered", desc: "Browser navigates to /claims/[id]. The FraudScoreGauge SVG and decision banner render the AI output in real time." },
]

export default function ArchitecturePage() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <Navbar />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-8 pt-16 pb-10">
        <div className="flex items-center gap-2 mb-4">
          <GitBranch className="w-4 h-4 text-brand-accent" />
          <p className="text-xs font-medium text-brand-accent uppercase tracking-widest">System Architecture</p>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-brand-text">How InsureAI is Built</h1>
        <p className="text-brand-text/60 leading-relaxed mt-3 max-w-2xl">
          A full-stack AI insurance demo built to explore what a modern, zero-agent insurance carrier could look like.
          Claude handles every claim decision end-to-end — no human adjusters, no underwriters.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-8 pb-24 flex flex-col gap-12">

        {/* Diagram placeholder */}
        <div className="relative rounded-3xl overflow-hidden border-2 border-dashed border-brand-accent/25 bg-gradient-to-br from-brand-accent/[0.04] via-violet-500/[0.03] to-emerald-500/[0.04]" style={{ minHeight: 340 }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-brand-text/30">
            <Zap className="w-8 h-8" />
            <p className="text-sm font-medium">Architecture Diagram</p>
            <p className="text-xs">Excalidraw — coming soon</p>
          </div>
        </div>

        {/* Stack grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {stack.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.layer} className="bg-white rounded-3xl border-0 shadow-[0_4px_24px_rgba(67,59,255,0.08)] p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                      <Icon className={`w-4 h-4 ${s.color.split(" ")[1]}`} />
                    </div>
                    <p className="text-base font-bold">{s.layer}</p>
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
          <h2 className="text-2xl font-bold mb-2">Claim Processing Flow</h2>
          <p className="text-sm text-brand-text/50 mb-6">What happens from button click to AI decision.</p>
          <div className="flex flex-col gap-0">
            {flow.map((f, i) => (
              <div key={f.step} className="flex gap-6">
                {/* Step line */}
                <div className="flex flex-col items-center">
                  <div className="w-9 h-9 rounded-full bg-brand-accent flex items-center justify-center shrink-0 z-10">
                    <span className="text-xs font-bold text-white">{f.step}</span>
                  </div>
                  {i < flow.length - 1 && <div className="w-px flex-1 bg-brand-accent/20 my-1" />}
                </div>
                {/* Content */}
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
          <h2 className="text-2xl font-bold mb-6">Key Design Decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(67,59,255,0.08)] p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-accent/[0.10] flex items-center justify-center">
                <Zap className="w-4 h-4 text-brand-accent" />
              </div>
              <p className="text-sm font-bold">No claims queue</p>
              <p className="text-sm text-brand-text/55 leading-relaxed">
                Decisions happen synchronously inside the API request. Claude responds in ~2s — fast enough to skip async job queues entirely at demo scale.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(67,59,255,0.08)] p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/[0.10] flex items-center justify-center">
                <Shield className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-sm font-bold">Structured AI output</p>
              <p className="text-sm text-brand-text/55 leading-relaxed">
                The system prompt instructs Claude to return only valid JSON. A strict schema (decision, fraud_score, flags, reasoning) makes the output deterministic and directly storable.
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-[0_4px_24px_rgba(67,59,255,0.08)] p-6 flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/[0.10] flex items-center justify-center">
                <Database className="w-4 h-4 text-amber-600" />
              </div>
              <p className="text-sm font-bold">SQLite → prod-ready</p>
              <p className="text-sm text-brand-text/55 leading-relaxed">
                SQLite keeps local dev zero-config. The DATABASE_URL env var swaps the engine to PostgreSQL for production with no code changes — just an env update.
              </p>
            </div>
          </div>
        </div>

      </div>
    </main>
  )
}
