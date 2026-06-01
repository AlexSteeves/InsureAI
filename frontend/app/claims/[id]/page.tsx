"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, ShieldCheck, ShieldX, ShieldAlert, AlertTriangle, Brain, BarChart3 } from "lucide-react"
import { getClaim, getCachedClaims, Claim } from "@/lib/api"

const decisionConfig = {
  approved: {
    icon: ShieldCheck,
    label: "Approved",
    color: "text-emerald-500",
    bg: "bg-emerald-500/[0.08]",
    border: "border-emerald-500/[0.20]",
    badgeClass: "bg-emerald-500/[0.15] text-emerald-700 border-emerald-500/[0.25]",
    bar: "bg-emerald-500",
  },
  denied: {
    icon: ShieldX,
    label: "Denied",
    color: "text-red-500",
    bg: "bg-red-500/[0.08]",
    border: "border-red-500/[0.20]",
    badgeClass: "bg-red-500/[0.15] text-red-700 border-red-500/[0.25]",
    bar: "bg-red-500",
  },
  escalated: {
    icon: ShieldAlert,
    label: "Escalated to SIU",
    color: "text-amber-500",
    bg: "bg-amber-500/[0.08]",
    border: "border-amber-500/[0.20]",
    badgeClass: "bg-amber-500/[0.15] text-amber-700 border-amber-500/[0.25]",
    bar: "bg-amber-500",
  },
}

function FraudBar({ score }: { score: number }) {
  const color =
    score <= 20 ? "bg-emerald-500" :
    score <= 40 ? "bg-lime-500" :
    score <= 60 ? "bg-amber-500" :
    score <= 80 ? "bg-orange-500" :
                  "bg-red-500"

  const label =
    score <= 20 ? "Very Low Risk" :
    score <= 40 ? "Low Risk" :
    score <= 60 ? "Moderate Risk" :
    score <= 80 ? "High Risk" :
                  "Very High Risk"

  const textColor =
    score <= 20 ? "text-emerald-600" :
    score <= 40 ? "text-lime-600" :
    score <= 60 ? "text-amber-600" :
    score <= 80 ? "text-orange-600" :
                  "text-red-600"

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-end justify-between">
        <span className="text-4xl font-bold text-brand-text">{score}</span>
        <span className={`text-sm font-medium ${textColor}`}>{label}</span>
      </div>
      <div className="w-full h-2 rounded-full bg-brand-accent/[0.08]">
        <div
          className={`h-2 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${score}%` }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-brand-text/30">
        <span>0 — Clean</span>
        <span>100 — Fraudulent</span>
      </div>
    </div>
  )
}

export default function ClaimResultPage() {
  const { id } = useParams<{ id: string }>()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)

  const PRESET_CLAIM_IDS = ["demo-auto-claim-approved", "demo-auto-claim-escalated", "demo-auto-claim-denied"]

  useEffect(() => {
    if (PRESET_CLAIM_IDS.includes(id)) {
      getClaim(id).then(setClaim).finally(() => setLoading(false))
    } else {
      const cached = getCachedClaims().find((c) => c.id === id)
      setClaim(cached ?? null)
      setLoading(false)
    }
  }, [id])

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg text-brand-text flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-brand-text/50">ClaimAI is analyzing your claim...</p>
      </main>
    )
  }

  if (!claim) return null

  const config = decisionConfig[claim.status as keyof typeof decisionConfig]
  const Icon = config?.icon ?? ShieldAlert


  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 flex flex-col gap-6">

        <Link href="/demo" className="flex items-center gap-2 text-sm text-brand-text/50 hover:text-brand-text transition-colors w-fit">
          <ArrowLeft className="w-4 h-4" /> Back to Demo
        </Link>

        {/* ── Verdict header ── */}
        {config && (
          <div className={`rounded-3xl border p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 ${config.bg} ${config.border}`}>
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 ${config.bg} border ${config.border}`}>
              <Icon className={`w-8 h-8 ${config.color}`} />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="type-h2 text-brand-text">Claim {config.label}</h1>
                <Badge className={config.badgeClass}>{config.label}</Badge>
              </div>
              <p className="type-body text-brand-text/60 max-w-[60ch]">
                {claim.decision_summary}
              </p>
            </div>
          </div>
        )}

        {/* ── Numbers row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">

          {/* Fraud Score */}
          <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-[0_2px_16px_rgba(212,145,26,0.08)] flex flex-col gap-1 col-span-2 sm:col-span-1">
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="w-4 h-4 text-brand-accent" />
              <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Fraud Score</p>
            </div>
            {claim.fraud_score !== null
              ? <FraudBar score={claim.fraud_score} />
              : <p className="text-sm text-brand-text/40">N/A</p>
            }
          </div>

          {/* Payout */}
          <div className="bg-white dark:bg-card rounded-2xl p-5 shadow-[0_2px_16px_rgba(212,145,26,0.08)] flex flex-col gap-1">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Payout</p>
            </div>
            {claim.payout_amount
              ? <>
                  <p className="text-3xl font-bold text-emerald-600">${claim.payout_amount.toLocaleString()}</p>
                  <p className="text-xs text-brand-text/40">CAD approved</p>
                </>
              : <>
                  <p className="text-2xl font-bold text-brand-text/30">—</p>
                  <p className="text-xs text-brand-text/40">No payout</p>
                </>
            }
          </div>


        </div>

        {/* ── AI Response ── */}
        {claim.ai_reasoning && claim.ai_reasoning.length > 0 && (
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_2px_16px_rgba(212,145,26,0.08)] overflow-hidden">
            <div className="px-7 py-5 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-brand-accent/[0.10] flex items-center justify-center">
                <Brain className="w-4 h-4 text-brand-accent" />
              </div>
              <div>
                <h2 className="type-h3 text-brand-text">AI Reasoning</h2>
                <p className="type-sm text-brand-text/40">How ClaimAI reached this decision</p>
              </div>
            </div>
            <div className="px-7 py-5 flex flex-col gap-0">
              {claim.ai_reasoning.map((point, i) => (
                <div key={i}>
                  <div className="flex items-start gap-4 py-4">
                    <span className="w-6 h-6 rounded-full bg-brand-accent/[0.10] text-brand-accent text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="type-body text-brand-text/70">{point}</p>
                  </div>
                  {i < claim.ai_reasoning!.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Fraud Flags ── */}
        {claim.fraud_flags && claim.fraud_flags.length > 0 && (
          <div className="bg-white dark:bg-card rounded-3xl shadow-[0_2px_16px_rgba(212,145,26,0.08)] overflow-hidden">
            <div className="px-7 py-5 border-b border-border flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-500/[0.10] flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div>
                <h2 className="type-h3 text-brand-text">Fraud Flags</h2>
                <p className="type-sm text-brand-text/40">{claim.fraud_flags.length} {claim.fraud_flags.length === 1 ? "flag" : "flags"} detected</p>
              </div>
            </div>
            <div className="px-7 py-5 flex flex-col gap-3">
              {claim.fraud_flags.map((flag, i) => (
                <div key={i} className="flex items-start gap-3 bg-red-500/[0.05] border border-red-500/[0.15] rounded-xl px-4 py-3">
                  <span className="text-red-500 shrink-0 text-sm">⚑</span>
                  <p className="type-body text-brand-text/70">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}
