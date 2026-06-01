from fastapi import APIRouter, HTTPException
from schemas import PolicyResponse
from store import DEMO_POLICIES

router = APIRouter()


@router.get("", response_model=list[PolicyResponse])
def get_policies():
    return [PolicyResponse(**p) for p in DEMO_POLICIES.values()]


@router.get("/{policy_id}", response_model=PolicyResponse)
def get_policy(policy_id: str):
    policy = DEMO_POLICIES.get(policy_id)
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found")
    return PolicyResponse(**policy)
