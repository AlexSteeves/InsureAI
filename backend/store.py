from datetime import datetime, timezone
from typing import Any

DEMO_POLICIES: dict[str, dict[str, Any]] = {
    "demo-auto-policy": {
        "id": "demo-auto-policy",
        "policy_number": "TRU-AUTO0001",
        "holder_name": "Alex Steeves",
        "holder_email": "alex@insureai.ca",
        "coverage_type": "auto",
        "coverage_amount": 35000.0,
        "monthly_premium": 58.33,
        "coverage_details": {"year": "2022", "make": "Toyota", "model": "Camry"},
        "claim_free_days": 142,
        "created_at": datetime(2024, 1, 15, tzinfo=timezone.utc),
    },
}

# Preset example claims — always visible, one of each decision outcome
DEMO_CLAIMS: dict[str, dict[str, Any]] = {
    "demo-auto-claim-approved": {
        "id": "demo-auto-claim-approved",
        "policy_id": "demo-auto-policy",
        "description": "I was rear-ended at a red light on King Street downtown at 9:15am. The other driver admitted fault and we exchanged insurance details. My rear bumper is cracked and the trunk no longer closes properly.",
        "status": "approved",
        "fraud_score": 6,
        "fraud_flags": [],
        "ai_reasoning": [
            "Incident description is specific: exact time, location, and party details provided.",
            "Damage is consistent with a rear-end collision at low speed.",
            "Other driver's fault admission aligns with described mechanics.",
            "Claim amount is well within policy coverage limits.",
        ],
        "decision_summary": "Claim approved — clear liability, credible description, and low fraud risk.",
        "payout_amount": 3200.0,
        "created_at": datetime(2024, 3, 12, 9, 30, tzinfo=timezone.utc),
        "processed_at": datetime(2024, 3, 12, 9, 30, 4, tzinfo=timezone.utc),
    },
    "demo-auto-claim-escalated": {
        "id": "demo-auto-claim-escalated",
        "policy_id": "demo-auto-policy",
        "description": "My car was totaled in a highway accident last Tuesday. Repair estimate is $34,800. I have a police report and witness statements.",
        "status": "escalated",
        "fraud_score": 58,
        "fraud_flags": [
            "Claim amount ($34,800) is 99.4% of total coverage limit — unusually high.",
            "Incident date is vague ('last Tuesday') with no specific location.",
        ],
        "ai_reasoning": [
            "Claim amount is within $200 of the full coverage limit, which is statistically anomalous.",
            "No specific highway or city mentioned — reduces verifiability.",
            "Policy was active long enough to rule out new-policy fraud, but amount warrants review.",
            "Referred to SIU for verification of police report and witness statements.",
        ],
        "decision_summary": "Escalated to SIU — claim amount nearly equals coverage limit and location details are vague.",
        "payout_amount": None,
        "created_at": datetime(2024, 5, 7, 14, 12, tzinfo=timezone.utc),
        "processed_at": datetime(2024, 5, 7, 14, 12, 8, tzinfo=timezone.utc),
    },
    "demo-auto-claim-denied": {
        "id": "demo-auto-claim-denied",
        "policy_id": "demo-auto-policy",
        "description": "My basement flooded after heavy rain last night. Water damage to flooring, drywall, and furniture. Estimate is around $18,000.",
        "status": "denied",
        "fraud_score": 72,
        "fraud_flags": [
            "Coverage type mismatch: flood/water damage claimed against an auto policy.",
            "No vehicle mentioned anywhere in the description.",
        ],
        "ai_reasoning": [
            "This policy covers auto — specifically a 2022 Toyota Camry.",
            "Basement flooding is a home insurance peril, not covered under auto.",
            "There is no vehicle involved in the described loss.",
            "Claim denied due to coverage type mismatch.",
        ],
        "decision_summary": "Claim denied — water damage to a home is not covered under this auto policy.",
        "payout_amount": None,
        "created_at": datetime(2024, 6, 21, 7, 55, tzinfo=timezone.utc),
        "processed_at": datetime(2024, 6, 21, 7, 55, 3, tzinfo=timezone.utc),
    },
}
