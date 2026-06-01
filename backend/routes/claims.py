from fastapi import APIRouter, HTTPException
from schemas import ClaimCreate, ClaimResponse
from services.ai_service import process_claim
from store import DEMO_POLICIES, DEMO_CLAIMS
from limiter import check_and_increment, remaining
from datetime import datetime, timezone
import uuid

router = APIRouter()


@router.post("", response_model=ClaimResponse)
async def submit_claim(data: ClaimCreate):
    allowed, left = check_and_increment()
    if not allowed:
        raise HTTPException(
            status_code=429,
            detail="The demo has reached its daily claim limit. Please come back tomorrow.",
        )

    policy = DEMO_POLICIES.get(data.policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    policy_age_days = data.policy_age_days_override if data.policy_age_days_override is not None \
        else (datetime.now(timezone.utc) - policy["created_at"]).days

    coverage_amount = data.coverage_amount_override if data.coverage_amount_override is not None \
        else policy["coverage_amount"]

    result = await process_claim(
        description=data.description,
        coverage_type=policy["coverage_type"],
        coverage_amount=coverage_amount,
        policy_age_days=policy_age_days,
        deductible=data.deductible or 500.0,
        loss_amount=data.loss_amount,
        incident_date=data.incident_date,
        claim_type=data.claim_type,
    )

    now = datetime.now(timezone.utc)
    # Return result directly — not stored server-side, client caches it
    return ClaimResponse(
        id=str(uuid.uuid4()),
        policy_id=data.policy_id,
        description=data.description,
        status=result["decision"].lower(),
        fraud_score=result.get("fraud_score"),
        fraud_flags=result.get("fraud_flags", []),
        ai_reasoning=result.get("reasoning", []),
        decision_summary=result.get("summary", ""),
        payout_amount=result.get("payout_amount"),
        created_at=now,
        processed_at=now,
    )


@router.get("/demo-auto-claims", response_model=list[ClaimResponse])
def get_demo_claims():
    """Returns the preset example claims for the demo auto policy."""
    return [ClaimResponse(**c) for c in DEMO_CLAIMS.values()]


@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(claim_id: str):
    """Returns preset example claims only. User claims are stored client-side."""
    claim = DEMO_CLAIMS.get(claim_id)
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return ClaimResponse(**claim)
