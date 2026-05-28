
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Policy
from schemas import QuoteRequest, QuoteResponse, PolicyCreate, PolicyResponse
import uuid
import random
import string

router = APIRouter()


PREMIUM_RATES = {
    "auto": 0.020,
    "home": 0.005,
    "life": 0.003,
}

#generates polici number of 8, with random uppercase ascii chars and numbers
def generate_policy_number() -> str:
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"TRU-{suffix}"


def calculate_monthly_premium(coverage_type: str, coverage_amount: float) -> float:
    annual_rate = PREMIUM_RATES.get(coverage_type.lower(), 0.010)
    return round((coverage_amount * annual_rate) / 12, 2)

@router.post("/quote", response_model=QuoteResponse)
def get_quote(data: QuoteRequest):
    premium = calculate_monthly_premium(data.coverage_type, data.coverage_amount)
    return QuoteResponse(
        monthly_premium=premium,
        coverage_type=data.coverage_type,
        coverage_amount=data.coverage_amount,
        quote_id=str(uuid.uuid4()),
    )

@router.post("/bind", response_model=PolicyResponse)
def bind_policy(data: PolicyCreate, db: Session = Depends(get_db)):
    premium = calculate_monthly_premium(data.coverage_type, data.coverage_amount)
    policy = Policy(
        id=str(uuid.uuid4()),
        policy_number=generate_policy_number(),
        holder_name=data.holder_name,
        holder_email=data.holder_email,
        coverage_type=data.coverage_type.lower(),
        coverage_amount=data.coverage_amount,
        monthly_premium=premium,
        coverage_details=data.coverage_details or {},
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy


@router.get("/", response_model=list[PolicyResponse])
def get_policies(email: str | None = None, db: Session = Depends(get_db)):
    if email:
        return db.query(Policy).filter(Policy.holder_email == email).all()
    return db.query(Policy).all()

@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy(policy_id: str, db: Session = Depends(get_db)):
    policy = db.query(Policy).filter(Policy.id == policy_id).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return policy