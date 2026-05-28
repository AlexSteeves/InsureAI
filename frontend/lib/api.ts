const API = process.env.NEXT_PUBLIC_API_URL;

// ── Types ─────────────────────────────────────────────────────────────────

export interface Policy {
  id: string;
  policy_number: string;
  holder_name: string;
  holder_email: string;
  coverage_type: string;
  coverage_amount: number;
  monthly_premium: number;
  coverage_details: Record<string, unknown> | null;
  created_at: string;
  claim_free_days: number;
}

export interface Claim {
  id: string;
  policy_id: string;
  description: string;
  status: string;
  fraud_score: number | null;
  fraud_flags: string[] | null;
  ai_reasoning: string[] | null;
  decision_summary: string | null;
  payout_amount: number | null;
  created_at: string;
  processed_at: string | null;
}

export interface QuoteResponse {
  monthly_premium: number;
  coverage_type: string;
  coverage_amount: number;
  quote_id: string;
}

// ── Policies ──────────────────────────────────────────────────────────────

export async function getQuote(
  coverage_type: string,
  coverage_amount: number,
  coverage_details?: Record<string, string>,
): Promise<QuoteResponse> {
  const res = await fetch(`${API}/policies/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ coverage_type, coverage_amount, coverage_details }),
  });
  if (!res.ok) throw new Error("Failed to get quote");
  return res.json();
}

export async function bindPolicy(data: {
  holder_name: string;
  holder_email: string;
  coverage_type: string;
  coverage_amount: number;
  coverage_details?: Record<string, unknown>;
}): Promise<Policy> {
  const res = await fetch(`${API}/policies/bind`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to bind policy");
  return res.json();
}

export async function getPolicy(id: string): Promise<Policy> {
  const res = await fetch(`${API}/policies/${id}`);
  if (!res.ok) throw new Error("Policy not found");
  return res.json();
}

export async function getPoliciesByEmail(email: string): Promise<Policy[]> {
  const res = await fetch(`${API}/policies?email=${encodeURIComponent(email)}`);
  if (!res.ok) throw new Error("Failed to fetch policies");
  return res.json();
}

// ── Claims ────────────────────────────────────────────────────────────────

export async function submitClaim(data: {
  policy_id: string;
  description: string;
  images: string[];
}): Promise<Claim> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000) // 60s — Claude can take ~10s

  try {
    const res = await fetch(`${API}/claims`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (!res.ok) throw new Error("Failed to submit claim");
    return res.json();
  } finally {
    clearTimeout(timeout)
  }
}

export async function getClaim(id: string): Promise<Claim> {
  const res = await fetch(`${API}/claims/${id}`);
  if (!res.ok) throw new Error("Claim not found");
  return res.json();
}

export async function getClaimsByPolicy(policy_id: string): Promise<Claim[]> {
  const res = await fetch(`${API}/claims/by-policy/${policy_id}`);
  if (!res.ok) throw new Error("Failed to fetch claims");
  return res.json();
}
