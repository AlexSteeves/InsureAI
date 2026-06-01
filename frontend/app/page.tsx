import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/navbar";
import { Shield, Zap, Trophy, ArrowRight, CheckCircle2, Clock, Cpu } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">
      <Navbar />

      {/* ── Hero ── */}
      <section
        className="relative flex items-center px-8 sm:px-16 min-h-screen overflow-hidden"
        style={{
          backgroundImage: "url('/Images/grasslands.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="relative z-10 flex flex-col items-start gap-7 max-w-3xl w-full">
          <h1 className="type-h1 text-[#f5f0e8]">
            Insurance That Works at the{" "}
            <span className="text-brand-accent">Speed of Life</span>
          </h1>

          <p className="type-body text-[#f5f0e8]/75 max-w-[58ch]">
            Instant policies. AI-handled claims. No humans, no waiting.
          </p>

          <div className="flex flex-col items-start gap-3">
            <Link href="/demo">
              <Button
                size="lg"
                className="relative group bg-brand-accent hover:bg-brand-primary text-white px-10 py-6 text-base font-semibold rounded-full shadow-[0_0_32px_rgba(212,145,26,0.45)] hover:shadow-[0_0_52px_rgba(212,145,26,0.65)] hover:scale-105 active:scale-100 transition-all duration-200"
              >
                <span className="flex items-center gap-2">
                  See It in Action
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
                <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-brand-accent pointer-events-none" />
              </Button>
            </Link>
            <p className="type-label text-[#f5f0e8]/45">
              No signup needed · Live AI demo
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <div className="bg-brand-secondary border-y border-border">
        <div className="max-w-5xl mx-auto px-8 py-8 grid grid-cols-3 divide-x divide-border">
          <div className="text-center px-8">
            <p className="text-3xl font-bold text-brand-accent">60s</p>
            <p className="type-sm text-brand-text/60 mt-1">Average time to bind a policy</p>
          </div>
          <div className="text-center px-8">
            <p className="text-3xl font-bold text-brand-accent">100%</p>
            <p className="type-sm text-brand-text/60 mt-1">AI-powered claims decisions</p>
          </div>
          <div className="text-center px-8">
            <p className="text-3xl font-bold text-brand-accent">$0</p>
            <p className="type-sm text-brand-text/60 mt-1">Agent fees. Now or ever.</p>
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <h2 className="type-h2 text-brand-text">Built different</h2>
            <p className="type-body text-brand-text/60 mt-4 max-w-[60ch]">
              Traditional insurance is slow, opaque, and built around agents. We
              replaced all of it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(212,145,26,0.07)]">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/[0.10] flex items-center justify-center">
                <Zap className="text-brand-accent w-5 h-5" />
              </div>
              <h3 className="type-h3 text-brand-text">Instant Bind</h3>
              <p className="type-body text-brand-text/60">
                Get a policy in under 60 seconds. No paperwork, no agents, no
                waiting rooms.
              </p>
            </div>

            <div className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(212,145,26,0.07)]">
              <div className="w-10 h-10 rounded-xl bg-brand-accent/[0.10] flex items-center justify-center">
                <Shield className="text-brand-accent w-5 h-5" />
              </div>
              <h3 className="type-h3 text-brand-text">AI Claims</h3>
              <p className="type-body text-brand-text/60">
                File a claim and get a decision in seconds. No adjusters, no
                delays, no phone calls.
              </p>
            </div>

            <div className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(212,145,26,0.07)]">
              <div className="w-10 h-10 rounded-xl bg-amber-500/[0.12] flex items-center justify-center">
                <Trophy className="text-amber-500 w-5 h-5" />
              </div>
              <h3 className="type-h3 text-brand-text">Win What You Cover</h3>
              <p className="type-body text-brand-text/60">
                Stay claim-free and earn rewards. Discounts, badges, and bonuses
                stack over time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-brand-secondary py-24 px-8 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <h2 className="type-h2 text-brand-text">How it works</h2>
            <p className="type-body text-brand-text/60 mt-4">Three steps. One minute.</p>
          </div>

          <div className="flex flex-col divide-y divide-border">
            {/* Step 01 */}
            <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr_1fr] gap-6 py-10 first:pt-0">
              <div className="flex items-start gap-4 md:flex-col md:gap-0">
                <span className="text-5xl font-bold text-brand-accent/20 leading-none tracking-tight">01</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/[0.10] flex items-center justify-center shrink-0">
                    <Clock className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="type-h3 text-brand-text">Tell us about yourself</h3>
                </div>
                <p className="type-body text-brand-text/60">
                  Name, email, what you need covered and how much. Takes about 20 seconds — no calls, no agents, no forms in triplicate.
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                {["Name & contact", "Coverage type", "Vehicle or property details"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                    <span className="type-sm text-brand-text/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 02 */}
            <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr_1fr] gap-6 py-10">
              <div className="flex items-start gap-4 md:flex-col md:gap-0">
                <span className="text-5xl font-bold text-brand-accent/20 leading-none tracking-tight">02</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/[0.10] flex items-center justify-center shrink-0">
                    <Cpu className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="type-h3 text-brand-text">Get an instant quote</h3>
                </div>
                <p className="type-body text-brand-text/60">
                  Our AI prices your policy in real time using live risk models. No underwriter review, no waiting days for a callback.
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                {["Risk scored in milliseconds", "Transparent pricing breakdown", "Compare coverage tiers"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                    <span className="type-sm text-brand-text/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step 03 */}
            <div className="grid grid-cols-1 md:grid-cols-[6rem_1fr_1fr] gap-6 py-10 last:pb-0">
              <div className="flex items-start gap-4 md:flex-col md:gap-0">
                <span className="text-5xl font-bold text-brand-accent/20 leading-none tracking-tight">03</span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-brand-accent/[0.10] flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 text-brand-accent" />
                  </div>
                  <h3 className="type-h3 text-brand-text">Bind and you&apos;re covered</h3>
                </div>
                <p className="type-body text-brand-text/60">
                  One click. Policy issued instantly. Coverage starts the moment you confirm — no waiting for documents in the mail.
                </p>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                {["Digital policy certificate", "Coverage active immediately", "Claims filed from your phone"].map((item) => (
                  <div key={item} className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-brand-accent shrink-0" />
                    <span className="type-sm text-brand-text/70">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="rounded-3xl bg-brand-secondary border border-border p-10 md:p-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center shadow-[0_4px_32px_rgba(212,145,26,0.08)]">

            {/* Left — copy */}
            <div className="flex flex-col gap-5">
              <p className="type-label text-brand-accent">Ready when you are</p>
              <h2 className="type-h2 text-brand-text">Coverage that starts in 60 seconds.</h2>
              <p className="type-body text-brand-text/60 max-w-[52ch]">
                No agents. No paperwork. No surprises. File a claim and get an AI decision in seconds — not days.
              </p>
              <div className="flex items-center gap-4 pt-2">
                <Link href="/demo">
                  <Button
                    size="lg"
                    className="bg-brand-accent hover:bg-brand-primary text-white px-8 shadow-[0_0_24px_rgba(212,145,26,0.25)] hover:shadow-[0_0_32px_rgba(212,145,26,0.40)] transition-all"
                  >
                    Try the Demo <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — trust signals */}
            <div className="flex flex-col divide-y divide-border">
              {[
                { label: "Policy issued", value: "Instantly" },
                { label: "Claims decided", value: "In seconds" },
                { label: "Agent fees", value: "$0 forever" },
                { label: "Human adjusters", value: "None needed" },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                  <span className="type-body text-brand-text/55">{label}</span>
                  <span className="type-sm font-semibold text-brand-text">{value}</span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
