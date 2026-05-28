"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ShieldCheck, ShieldX, ShieldAlert } from "lucide-react"
import { getClaim, Claim } from "@/lib/api"

function FraudScoreGauge({ score }: { score: number }) {
  const radius = 80
  const stroke = 10
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * Math.PI
  const progress = circumference - (score / 100) * circumference

  const color =
    score <= 20 ? "#10B981" :
    score <= 40 ? "#84CC16" :
    score <= 60 ? "#F59E0B" :
    score <= 80 ? "#F97316" :
                  "#EF4444"

  const label =
    score <= 20 ? "Very Low Risk" :
    score <= 40 ? "Low Risk" :
    score <= 60 ? "Moderate Risk" :
    score <= 80 ? "High Risk" :
                  "Very High Risk"

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width={radius * 2} height={radius + stroke} viewBox={`0 0 ${radius * 2} ${radius + stroke}`}>
        <path
          d={`M ${stroke / 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke / 2} ${radius}`}
          fill="none"
          stroke="rgba(47,39,206,0.12)"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        <path
          d={`M ${stroke / 2} ${radius} A ${normalizedRadius} ${normalizedRadius} 0 0 1 ${radius * 2 - stroke / 2} ${radius}`}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={progress}
          style={{ transition: "stroke-dashoffset 1s ease" }}
        />
        <text x={radius} y={radius - 8} textAnchor="middle" fill="#050315" fontSize="28" fontWeight="bold">
          {score}
        </text>
        <text x={radius} y={radius + 12} textAnchor="middle" fill="rgba(5,3,21,0.45)" fontSize="11">
          FRAUD RISK
        </text>
      </svg>
      <p className="text-sm font-medium" style={{ color }}>{label}</p>
    </div>
  )
}

const decisionConfig = {
  approved: {
    icon: ShieldCheck,
    label: "Approved",
    cardClass: "border-emerald-500/[0.30] bg-emerald-500/[0.06]",
    iconColor: "text-emerald-500",
    badgeClass: "bg-emerald-500/[0.15] text-emerald-700 border-emerald-500/[0.25]",
  },
  denied: {
    icon: ShieldX,
    label: "Denied",
    cardClass: "border-red-500/[0.30] bg-red-500/[0.06]",
    iconColor: "text-red-500",
    badgeClass: "bg-red-500/[0.15] text-red-700 border-red-500/[0.25]",
  },
  escalated: {
    icon: ShieldAlert,
    label: "Escalated to SIU",
    cardClass: "border-amber-500/[0.30] bg-amber-500/[0.06]",
    iconColor: "text-amber-500",
    badgeClass: "bg-amber-500/[0.15] text-amber-700 border-amber-500/[0.25]",
  },
}

export default function ClaimResultPage() {
  const { id } = useParams<{ id: string }>()
  const [claim, setClaim] = useState<Claim | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getClaim(id)
      .then(setClaim)
      .finally(() => setLoading(false))
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

      <Navbar>
        <Link href="/dashboard">
          <Button variant="outline" className="border-border text-brand-text/70 hover:bg-brand-bg hover:text-brand-text">
            <ArrowLeft className="mr-2 w-4 h-4" /> Dashboard
          </Button>
        </Link>
      </Navbar>

      <div className="max-w-2xl mx-auto px-12 py-16 flex flex-col gap-8">

        {/* Decision Banner */}
        {config && (
          <Card className={`border rounded-2xl p-10 flex flex-col items-center gap-4 shadow-[0_2px_20px_rgba(67,59,255,0.07)] ${config.cardClass}`}>
            <Icon className={`w-16 h-16 ${config.iconColor}`} />
            <div className="text-center">
              <Badge className={`text-sm px-4 py-1 ${config.badgeClass}`}>
                {config.label}
              </Badge>
              <p className="text-sm text-brand-text/60 leading-relaxed mt-3 max-w-sm">{claim.decision_summary}</p>
            </div>
            {claim.payout_amount && (
              <div className="mt-2 text-center pt-4 border-t border-border w-full">
                <p className="text-xs text-brand-text/50">Approved Payout</p>
                <p className="text-5xl font-bold text-emerald-600 mt-2">
                  ${claim.payout_amount.toLocaleString()} CAD
                </p>
              </div>
            )}
          </Card>
        )}

        {/* Fraud Score */}
        {claim.fraud_score !== null && (
          <Card className="bg-brand-secondary rounded-2xl p-8 flex flex-col items-center gap-6 shadow-[0_2px_20px_rgba(67,59,255,0.07)]">
            <h2 className="text-xl font-semibold self-start text-brand-text">Fraud Analysis</h2>
            <FraudScoreGauge score={claim.fraud_score} />
            {claim.fraud_flags && claim.fraud_flags.length > 0 && (
              <div className="w-full flex flex-col gap-2">
                <p className="text-xs font-medium text-red-600 uppercase tracking-wide">Flags Detected</p>
                {claim.fraud_flags.map((flag, i) => (
                  <div key={i} className="flex items-start gap-3 text-sm text-brand-text/70 leading-relaxed bg-red-500/[0.06] border border-red-500/[0.20] rounded-2xl px-4 py-3">
                    <span className="text-red-500 shrink-0">⚑</span>
                    {flag}
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        {/* AI Reasoning */}
        {claim.ai_reasoning && claim.ai_reasoning.length > 0 && (
          <Card className="bg-brand-secondary rounded-2xl p-8 flex flex-col gap-4 shadow-[0_2px_20px_rgba(67,59,255,0.07)]">
            <h2 className="text-xl font-semibold text-brand-text">AI Reasoning</h2>
            <div className="flex flex-col gap-3">
              {claim.ai_reasoning.map((point, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-brand-text/60 leading-relaxed">
                  <span className="text-brand-accent font-medium shrink-0 mt-0.5">{i + 1}.</span>
                  {point}
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </main>
  )
}
