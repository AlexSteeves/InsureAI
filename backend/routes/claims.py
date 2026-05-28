from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
from models import Claim, Policy
from schemas import ClaimCreate, ClaimResponse
from services.ai_service import process_claim
from slowapi import Limiter
from slowapi.util import get_remote_address
from datetime import datetime, timezone, timedelta
import uuid

router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

DAILY_CLAIM_LIMIT = 10


@router.post("/", response_model=ClaimResponse)
@limiter.limit("5/hour")
async def submit_claim(request: Request, data: ClaimCreate, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == data.policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")

    # Daily claim cap per policy — protects against Claude cost abuse
    since_midnight = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
    claims_today = db.query(Claim).filter(
        Claim.policy_id == data.policy_id,
        Claim.created_at >= since_midnight,
    ).count()
    if claims_today >= DAILY_CLAIM_LIMIT:
        raise HTTPException(status_code=429, detail=f"Daily claim limit ({DAILY_CLAIM_LIMIT}) reached for this policy.")

    policy_age_days = (
        datetime.now(timezone.utc) - policy.created_at.replace(tzinfo=timezone.utc)
    ).days

    claim = Claim(
        id=str(uuid.uuid4()),
        policy_id=data.policy_id,
        description=data.description,
        images=data.images,
        status="processing",
    )
    db.add(claim)
    db.commit()

    result = await process_claim(
        description=data.description,
        coverage_type=policy.coverage_type,
        coverage_amount=policy.coverage_amount,
        policy_age_days=policy_age_days,
        images=data.images,
    )

    claim.status = result["decision"].lower()
    claim.fraud_score = result["fraud_score"]
    claim.fraud_flags = result.get("fraud_flags", [])
    claim.ai_reasoning = result.get("reasoning", [])
    claim.decision_summary = result.get("summary", "")
    claim.payout_amount = result.get("payout_amount")
    claim.processed_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(claim)
    return claim


@router.get("/by-policy/{policy_id}", response_model=list[ClaimResponse])
def get_claims_by_policy(policy_id: str, db: Session = Depends(get_db)):
    return db.query(Claim).filter(Claim.policy_id == policy_id).all()


@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(claim_id: str, db: Session = Depends(get_db)):
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim