from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# ── Quote ────────────────────────────────────────────────────────────────────

class QuoteRequest(BaseModel):
    coverage_type: str
    coverage_amount: float
    coverage_details: Optional[dict] = None


class QuoteResponse(BaseModel):
    monthly_premium: float
    coverage_type: str
    coverage_amount: float
    quote_id: str


# ── Policy ───────────────────────────────────────────────────────────────────

class PolicyCreate(BaseModel):
    holder_name: str
    holder_email: str
    coverage_type: str
    coverage_amount: float
    coverage_details: Optional[dict] = None


class PolicyResponse(BaseModel):
    id: str
    policy_number: str
    holder_name: str
    holder_email: str
    coverage_type: str
    coverage_amount: float
    monthly_premium: float
    coverage_details: Optional[dict]
    created_at: datetime
    claim_free_days: int

    class Config:
        from_attributes = True


# ── Claims ───────────────────────────────────────────────────────────────────

class ClaimCreate(BaseModel):
    policy_id: str
    description: str
    images: list[str] = []


class ClaimResponse(BaseModel):
    id: str
    policy_id: str
    description: str
    status: str
    fraud_score: Optional[float]
    fraud_flags: Optional[list]
    ai_reasoning: Optional[list]
    decision_summary: Optional[str]
    payout_amount: Optional[float]
    created_at: datetime
    processed_at: Optional[datetime]

    class Config:
        from_attributes = True