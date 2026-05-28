"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Shield, Car, Home, Heart, Trophy, FileText, Clock, Zap, Upload, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { getPolicy, getClaimsByPolicy, submitClaim, Policy, Claim } from "@/lib/api"

const DEMO_POLICY_ID = "demo-policy-001"

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
  const fileRef = useRef<HTMLInputElement>(null)
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [claimOpen, setClaimOpen] = useState(false)
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    Promise.all([getPolicy(DEMO_POLICY_ID), getClaimsByPolicy(DEMO_POLICY_ID)])
      .then(([p, c]) => {
        setPolicy(p)
        setClaims(c)
      })
      .catch(() => console.error("Failed to load demo policy"))
      .finally(() => setLoading(false))
  }, [])

  function handleFiles(files: FileList | null) {
    if (!files) return
    Array.from(files).slice(0, 3 - images.length).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => setImages((prev) => [...prev, e.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  async function handleSubmitClaim() {
    if (!description.trim() || !policy) return
    setSubmitting(true)
    try {
      const claim = await submitClaim({ policy_id: policy.id, description, images })
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
    setImages([])
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

      <Navbar>
        <Button
          onClick={() => setClaimOpen(true)}
          className="bg-brand-accent hover:bg-brand-primary text-white shadow-[0_0_20px_rgba(67,59,255,0.20)] hover:shadow-[0_0_28px_rgba(67,59,255,0.35)] transition-all"
        >
          File a Claim
        </Button>
      </Navbar>

      <div className="max-w-7xl mx-auto px-8 py-10 flex flex-col gap-6">

        {/* Top row: Policy (2/3) + Streak (1/3) */}
        <div className="grid grid-cols-3 gap-6">

          {/* Policy Card */}
          <Card className="col-span-2 bg-white rounded-3xl border-0 overflow-hidden shadow-[0_4px_32px_rgba(67,59,255,0.12)] text-brand-text">
            {/* Solid accent header */}
            <div className="bg-brand-accent px-8 pt-6 pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-white/[0.15] flex items-center justify-center">
                    <CoverageIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white/50 uppercase tracking-widest">Policy Number</p>
                    <p className="text-xl font-bold mt-0.5 text-white">{policy.policy_number}</p>
                  </div>
                </div>
                <Badge className="bg-white/[0.15] text-white border-white/[0.20] px-3 py-1 text-xs">
                  ● Active
                </Badge>
              </div>
            </div>
            {/* White body */}
            <div className="px-8 py-6 grid grid-cols-4 gap-6">
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Holder</p>
                <p className="text-base font-semibold">{policy.holder_name}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Coverage</p>
                <p className="text-base font-semibold capitalize">{policy.coverage_type}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Amount</p>
                <p className="text-base font-semibold">${policy.coverage_amount.toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-brand-text/40 uppercase tracking-widest">Premium</p>
                <p className="text-base font-semibold">
                  ${policy.monthly_premium.toFixed(2)}
                  <span className="text-sm font-normal text-brand-text/40">/mo</span>
                </p>
              </div>
            </div>
          </Card>

          {/* Streak Card */}
          <Card className="col-span-1 bg-white rounded-3xl border-0 shadow-[0_4px_32px_rgba(67,59,255,0.10)] p-7 text-brand-text">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/[0.12] flex items-center justify-center">
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
        <Card className="bg-white rounded-3xl border-0 overflow-hidden shadow-[0_4px_32px_rgba(67,59,255,0.10)] text-brand-text">
          <div className="flex items-center justify-between px-8 py-6 border-b border-border">
            <div>
              <h2 className="text-lg font-bold">Claims History</h2>
              <p className="text-xs text-brand-text/40 mt-0.5">
                {claims.length} {claims.length === 1 ? "claim" : "claims"} on file
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => setClaimOpen(true)}
              className="bg-brand-accent hover:bg-brand-primary text-white shadow-[0_0_16px_rgba(67,59,255,0.18)] transition-all"
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
                  <div className="flex items-center justify-between px-8 py-4 hover:bg-brand-bg/60 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-brand-accent/[0.07] flex items-center justify-center shrink-0">
                        <Clock className="w-4 h-4 text-brand-accent/60" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-brand-text">
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
        <SheetContent side="right" className="w-full sm:max-w-md bg-white flex flex-col gap-0 p-0 overflow-y-auto">

          <SheetHeader className="px-8 pt-8 pb-4 border-b border-border">
            <SheetTitle className="text-2xl font-bold text-brand-text">File a Claim</SheetTitle>
            <SheetDescription className="text-sm text-brand-text/60 leading-relaxed">
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

            {/* Description */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-brand-text">What happened?</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the incident in detail..."
                className="bg-brand-bg border border-border rounded-2xl p-4 text-sm text-brand-text placeholder:text-brand-text/40 resize-none focus:outline-none focus:border-brand-accent transition-colors leading-relaxed"
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <label className="text-sm text-brand-text">
                Photos <span className="text-brand-text/40">(optional, max 3)</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className="border border-dashed border-border rounded-2xl p-5 flex items-center gap-3 cursor-pointer hover:border-brand-accent/50 hover:bg-brand-accent/[0.04] transition-all"
              >
                <Upload className="w-4 h-4 text-brand-text/40 shrink-0" />
                <p className="text-sm text-brand-text/40">Click to upload photos</p>
              </div>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              {images.length > 0 && (
                <div className="flex gap-2">
                  {images.map((img, i) => (
                    <div key={i} className="relative">
                      <img src={img} className="w-16 h-16 rounded-xl object-cover" alt="" />
                      <button
                        onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                      >
                        <X className="w-2.5 h-2.5 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Button
              className="bg-brand-accent hover:bg-brand-primary text-white w-full shadow-[0_0_20px_rgba(67,59,255,0.20)] hover:shadow-[0_0_28px_rgba(67,59,255,0.35)] transition-all disabled:shadow-none"
              disabled={!description.trim() || submitting}
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
