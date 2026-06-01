from pydantic import BaseModel, Field, field_validator
from typing import Optional
from datetime import datetime
import re


# ── Policy ───────────────────────────────────────────────────────────────────

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

    @field_validator("description")
    @classmethod
    def description_length(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 50:
            raise ValueError("Description must be at least 50 characters.")
        if len(v) > 500:
            raise ValueError("Description must be at most 500 characters.")
        return v
    # Editable policy variables — override defaults for demo purposes
    policy_age_days_override: Optional[int] = Field(default=None, ge=0, le=3650)
    coverage_amount_override: Optional[float] = Field(default=None, ge=1000, le=500_000)
    deductible: Optional[float] = Field(default=500.0, ge=0, le=50_000)
    # New claim fields
    loss_amount: Optional[float] = Field(default=None, ge=0, le=500_000)
    incident_date: Optional[str] = None
    claim_type: Optional[str] = None

    @field_validator("incident_date")
    @classmethod
    def validate_incident_date(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        if not re.fullmatch(r"\d{4}-\d{2}-\d{2}", v):
            raise ValueError("incident_date must be in YYYY-MM-DD format.")
        return v

    @field_validator("claim_type")
    @classmethod
    def validate_claim_type(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        allowed = {"collision", "theft", "vandalism", "weather", "fire", "other"}
        if v.lower() not in allowed:
            raise ValueError(f"claim_type must be one of: {', '.join(sorted(allowed))}")
        return v.lower()


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