"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "@/components/navbar"
import { Shield, Car, Home, Heart, Trophy, FileText, Clock, Zap } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { getPolicy, getClaimsByPolicy, getCachedClaims, submitClaim, Policy, Claim } from "@/lib/api"

const coverageIcons: Record<string, React.ElementType> = {
  auto: Car,
  home: Home,
  life: Heart,
}

const statusColors: Record<string, string> = {
  approved:   "bg-emerald-500/[0.15] text-emerald-700 border-emerald-500/[0.25]",
  denied:     "bg-red-500/[0.15] text-red-700 border-red-500/[0.25]",
  escalated:  "bg-amber-500/[0.15] text-amber-700 border-amber-500/[0.25]",
  processing: "bg-brand-accent/[0.10] text-brand-accent border-brand-accent/[0.20]",
}

const SCENARIOS = [
  {
    id: "clean",
    label: "Clean",
    color: "border-emerald-500/[0.30] bg-emerald-500/[0.06] hover:bg-emerald-500/[0.10]",
    badge: "bg-emerald-500/[0.15] text-emerald-700",
    description: "I was rear-ended at a red light on King Street downtown this morning around 9:15am. The other driver admitted fault at the scene and we exchanged insurance information. My rear bumper has visible cracks and the trunk no longer closes properly.",
  },
  {
    id: "suspicious",
    label: "Suspicious",
    color: "border-red-500/[0.30] bg-red-500/[0.06] hover:bg-red-500/[0.10]",
    badge: "bg-red-500/[0.15] text-red-700",
    description: "My car was damaged. I need to make a claim for the damage.",
  },
  {
    id: "mismatch",
    label: "Mismatch",
    color: "border-amber-500/[0.30] bg-amber-500/[0.06] hover:bg-amber-500/[0.10]",
    badge: "bg-amber-500/[0.15] text-amber-700",
    description: "I was in a car accident on the highway last Tuesday and my vehicle was totaled. The estimated repair cost is $35,000. I have a police report and witness statements.",
  },
]

export default function DashboardPage() {
  const router = useRouter()
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [claimOpen, setClaimOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // Editable policy variables
  const [policyAgeDays, setPolicyAgeDays] = useState(142)
  const [coverageAmount, setCoverageAmount] = useState(35000)
  const [deductible, setDeductible] = useState(500)

  // New claim fields
  const [lossAmount, setLossAmount] = useState("")
  const [incidentDate, setIncidentDate] = useState("")
  const [claimType, setClaimType] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const errors = {
    claimType:   !claimType ? "Please select a claim type." : null,
    incidentDate: !incidentDate ? "Please enter the incident date." : null,
    lossAmount:  !lossAmount || parseFloat(lossAmount) <= 0 ? "Please enter an estimated loss amount." : null,
    description: description.trim().length < 50 ? `At least 50 characters (${description.trim().length}/50).` : description.trim().length > 500 ? "Maximum 500 characters." : null,
  }
  const isValid = Object.values(errors).every((e) => e === null)

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  const POLICY_ID = "demo-auto-policy"

  useEffect(() => {
    getPolicy(POLICY_ID)
      .then((p) => {
        setPolicy(p)
        getClaimsByPolicy(POLICY_ID)
          .then((preset) => {
            const cached = getCachedClaims().filter((c) => c.policy_id === POLICY_ID)
            const seen = new Set<string>()
            const merged = [...cached, ...preset].filter((c) => {
              if (seen.has(c.id)) return false
              seen.add(c.id)
              return true
            })
            setClaims(merged)
          })
          .catch(() => {})
      })
      .catch(() => console.error("Failed to load policy"))
      .finally(() => setLoading(false))
  }, [])

  async function handleSubmitClaim() {
    // Touch all fields to show errors on submit attempt
    setTouched({ claimType: true, incidentDate: true, lossAmount: true, description: true })
    if (!isValid || !policy) return
    setSubmitting(true)
    try {
      const claim = await submitClaim({
        policy_id: policy.id,
        description,
        images: [],
        policy_age_days_override: policyAgeDays,
        coverage_amount_override: coverageAmount,
        deductible,
        loss_amount: lossAmount ? parseFloat(lossAmount) : undefined,
        incident_date: incidentDate || undefined,
        claim_type: claimType ?? undefined,
      })
      router.push(`/claims/${claim.id}`)
    } catch {
      alert("Failed to submit claim. Is the backend running?")
    } finally {
      setSubmitting(false)
    }
  }

  function closeModal() {
    setClaimOpen(false)
    setDescription("")
    setLossAmount("")
    setIncidentDate("")
    setClaimType(null)
    setTouched({})
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-bg text-brand-text flex items-center justify-center">
        <p className="text-sm text-brand-text/50">Loading...</p>
      </main>
    )
  }

  if (!policy) return null

  const CoverageIcon = coverageIcons[policy.coverage_type] ?? Shield

  const streakTier =
    policy.claim_free_days >= 180 ? "Gold" :
    policy.claim_free_days >= 90  ? "Silver" :
    policy.claim_free_days >= 30  ? "Bronze" : null

  return (
    <main className="min-h-screen bg-brand-bg text-brand-text">

      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-8 flex flex-col gap-6">

        {/* Top row: Policy + Streak */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Policy Card */}
          <Card className="md:col-span-2 bg-white dark:bg-card rounded-3xl border-0 overflow-hidden shadow-[0_4px_32px_rgba(212,145,26,0.12)] text-brand-text">
            <div className="bg-brand-accent px-6 sm:px-8 pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.15] flex items-center justify-center shrink-0">
                    <CoverageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/50 uppercase tracking-widest">Policy Number</p>
                    <p className="text-lg sm:text-xl font-bold mt-0.5 text-white">{policy.policy_number}</p>
                  </div>
                </div>
                <Badge className="bg-white/[0.15] text-white border-white/[0.20] px-3 py-1 text-xs shrink-0">● Active</Badge>
              </div>
            </div>

            {/* Static fields */}
            <div className="px-6 sm:px-8 pt-6 grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Holder</p>
                <p className="text-sm sm:text-base font-semibold">{policy.holder_name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Coverage Type</p>
                <p className="text-sm sm:text-base font-semibold capitalize">{policy.coverage_type} — {(policy.coverage_details as Record<string,string>)?.year} {(policy.coverage_details as Record<string,string>)?.make} {(policy.coverage_details as Record<string,string>)?.model}</p>
              </div>
            </div>

            {/* Editable variables */}
            <div className="px-6 sm:px-8 py-5 grid grid-cols-1 sm:grid-cols-3 gap-5 border-t border-border mt-4">
              {/* Coverage Amount */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Coverage Limit</Label>
                  <span className="text-xs font-semibold text-brand-text">${coverageAmount.toLocaleString()}</span>
                </div>
                <Slider
                  defaultValue={[35000]}
                  min={5000} max={100000} step={5000}
                  onValueCommitted={(v) => setCoverageAmount(Array.isArray(v) ? v[0] : v)}
                />
                <div className="flex justify-between text-[10px] text-brand-text/30">
                  <span>$5k</span><span>$100k</span>
                </div>
              </div>

              {/* Policy Age */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Policy Age</Label>
                  <span className={`text-xs font-semibold ${policyAgeDays < 30 ? "text-amber-500" : "text-brand-text"}`}>
                    {policyAgeDays}d {policyAgeDays < 30 && "⚠"}
                  </span>
                </div>
                <Slider
                  defaultValue={[142]}
                  min={1} max={365} step={1}
                  onValueCommitted={(v) => setPolicyAgeDays(Array.isArray(v) ? v[0] : v)}
                />
                <div className="flex justify-between text-[10px] text-brand-text/30">
                  <span>1d</span><span>1yr</span>
                </div>
              </div>

              {/* Deductible */}
              <div className="flex flex-col gap-2">
                <Label className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Deductible</Label>
                <Select
                  value={String(deductible)}
                  
                  onValueChange={(v) => setDeductible(Number(v))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="250">$250</SelectItem>
                    <SelectItem value="500">$500</SelectItem>
                    <SelectItem value="1000">$1,000</SelectItem>
                    <SelectItem value="2500">$2,500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Streak Card */}
          <Card className="bg-white dark:bg-card rounded-3xl border-0 shadow-[0_4px_32px_rgba(212,145,26,0.10)] p-6 sm:p-7 text-brand-text">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/[0.12] flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-amber-500" />
                </div>
                <p className="text-sm font-medium text-brand-text/60">Claim-Free Streak</p>
              </div>
              {streakTier && (
                <Badge className="bg-amber-500/[0.15] text-amber-700 border-amber-500/[0.25] text-xs">
                  {streakTier}
                </Badge>
              )}
            </div>
            <p className="text-5xl font-bold leading-none tracking-tight">{policy.claim_free_days}</p>
            <p className="text-sm text-brand-text/40 mt-2">days without a claim</p>
            <div className="mt-5">
              <div className="w-full bg-brand-accent/[0.08] rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-brand-accent to-brand-primary h-2 rounded-full transition-all"
                  style={{ width: `${Math.min((policy.claim_free_days / 180) * 100, 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-brand-text/30 mt-2">
                <span>Bronze 30d</span>
                <span>Silver 90d</span>
                <span>Gold 180d</span>
              </div>
            </div>
          </Card>

        </div>

        {/* Claims History */}
        <Card className="bg-white dark:bg-card rounded-3xl border-0 overflow-hidden shadow-[0_4px_32px_rgba(212,145,26,0.10)] text-brand-text">
          <div className="flex items-center justify-between px-4 sm:px-8 py-5 sm:py-6 border-b border-border">
            <div>
              <h2 className="type-h3 text-brand-text">Claims History</h2>
              <p className="type-sm text-brand-text/40 mt-1">
                {claims.length} {claims.length === 1 ? "claim" : "claims"} on file
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setClaimOpen(true)}
              className="bg-brand-accent hover:bg-brand-primary text-white shadow-[0_0_16px_rgba(212,145,26,0.18)] transition-all shrink-0"
            >
              + New Claim
            </Button>
          </div>

          {claims.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-brand-text/30">
              <div className="w-14 h-14 rounded-2xl bg-brand-accent/[0.06] flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium">No claims filed yet</p>
              <p className="text-xs">Your claim history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {claims.map((claim) => (
                <Link key={claim.id} href={`/claims/${claim.id}`}>
                  <div className="flex items-center justify-between px-4 sm:px-8 py-4 hover:bg-brand-bg/60 transition-all gap-3">
                    <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-brand-accent/[0.07] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-brand-accent/60" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-brand-text truncate">
                          {claim.description.slice(0, 72)}...
                        </p>
                        <p className="text-xs text-brand-text/40 mt-0.5">
                          {new Date(claim.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${statusColors[claim.status] ?? "bg-brand-primary/[0.08] text-brand-primary"} shrink-0`}>
                      {claim.status}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

      </div>

      {/* ── Claim Sheet ── */}
      <Sheet open={claimOpen} onOpenChange={(open) => { if (!open) closeModal() }}>
        <SheetContent side="right" className="w-full sm:max-w-md bg-white dark:bg-card flex flex-col gap-0 p-0 overflow-y-auto">

          <SheetHeader className="px-8 pt-8 pb-4 border-b border-border">
            <SheetTitle className="type-h2 text-brand-text">File a Claim</SheetTitle>
            <SheetDescription className="type-body text-brand-text/60 mt-1">
              AI decision in seconds.
            </SheetDescription>
          </SheetHeader>

          <div className="px-8 py-6 flex flex-col gap-5">

            {/* Demo Scenarios */}
            <div>
              <div className="flex items-center gap-1.5 mb-3">
                <Zap className="w-3.5 h-3.5 text-brand-accent" />
                <p className="text-xs text-brand-accent uppercase tracking-wide">Demo Scenarios</p>
              </div>
              <div className="flex flex-col gap-2">
                {SCENARIOS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setDescription(s.description)}
                    className={`text-left px-4 py-3 rounded-2xl border transition-all ${s.color}`}
                  >
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${s.badge}`}>{s.label}</span>
                    <p className="text-xs text-brand-text/60 leading-relaxed mt-1.5 line-clamp-1">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Claim details */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="claim-type">Claim Type</Label>
                <Select
                  value={claimType}
                  onValueChange={(v) => { setClaimType(v); touch("claimType") }}
                >
                  <SelectTrigger
                    id="claim-type"
                    className={`w-full ${touched.claimType && errors.claimType ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
                  >
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="collision">Collision</SelectItem>
                    <SelectItem value="theft">Theft</SelectItem>
                    <SelectItem value="weather">Weather damage</SelectItem>
                    <SelectItem value="vandalism">Vandalism</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {touched.claimType && errors.claimType && (
                  <p className="text-xs text-red-500">{errors.claimType}</p>
                )}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="incident-date">Incident Date</Label>
                <Input
                  id="incident-date"
                  type="date"
                  value={incidentDate}
                  max={new Date().toISOString().split("T")[0]}
                  onChange={(e) => { setIncidentDate(e.target.value); touch("incidentDate") }}
                  className={touched.incidentDate && errors.incidentDate ? "border-red-500 focus-visible:ring-red-500/30" : ""}
                />
                {touched.incidentDate && errors.incidentDate && (
                  <p className="text-xs text-red-500">{errors.incidentDate}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="loss-amount">
                Estimated Loss <span className="text-brand-text/40 font-normal">(CAD)</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">$</span>
                <Input
                  id="loss-amount"
                  type="number"
                  min={0}
                  value={lossAmount}
                  onChange={(e) => { setLossAmount(e.target.value); touch("lossAmount") }}
                  onBlur={() => touch("lossAmount")}
                  placeholder="e.g. 4500"
                  className={`pl-7 ${touched.lossAmount && errors.lossAmount ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
                />
              </div>
              {touched.lossAmount && errors.lossAmount && (
                <p className="text-xs text-red-500">{errors.lossAmount}</p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">What happened?</Label>
                <span className={`text-xs ${
                  description.trim().length > 500 ? "text-red-500" :
                  description.trim().length >= 50 ? "text-emerald-500" :
                  "text-brand-text/30"
                }`}>
                  {description.trim().length}/500
                </span>
              </div>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => { setDescription(e.target.value.slice(0, 500)); touch("description") }}
                onBlur={() => touch("description")}
                placeholder="Describe the incident in detail..."
                className={`resize-none leading-relaxed ${touched.description && errors.description ? "border-red-500 focus-visible:ring-red-500/30" : ""}`}
              />
              {touched.description && errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
            </div>

            <Button
              className="bg-brand-accent hover:bg-brand-primary text-white w-full shadow-[0_0_20px_rgba(212,145,26,0.20)] hover:shadow-[0_0_28px_rgba(212,145,26,0.35)] transition-all disabled:shadow-none"
              disabled={submitting}
              onClick={handleSubmitClaim}
            >
              {submitting ? "Analyzing claim..." : "Submit — Get AI Decision"}
            </Button>

          </div>
        </SheetContent>
      </Sheet>

    </main>
  )
}
