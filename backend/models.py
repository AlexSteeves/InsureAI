from sqlalchemy import Column, String, Float, DateTime, Integer, JSON
from sqlalchemy.sql import func
from database import Base
import uuid


def new_uuid() -> str:
    return str(uuid.uuid4())

class Policy(Base):
    __tablename__ = "policies"

    id = Column(String, primary_key=True, default=new_uuid)
    policy_number = Column(String, unique=True, nullable=False)
    holder_name = Column(String, nullable=False)
    holder_email = Column(String, nullable=False)
    coverage_type = Column(String, nullable=False)
    coverage_amount = Column(Float, nullable=False)
    monthly_premium = Column(Float, nullable=False)
    coverage_details = Column(JSON, default=dict)
    created_at = Column(DateTime, server_default=func.now())
    claim_free_days = Column(Integer, default=0)


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, default=new_uuid)
    policy_id = Column(String, nullable=False)
    description = Column(String, nullable=False)
    images = Column(JSON, default=list)
    status = Column(String, default="processing")
    fraud_score = Column(Float, nullable=True)
    fraud_flags = Column(JSON, default=list)
    ai_reasoning = Column(JSON, default=list)
    decision_summary = Column(String, nullable=True)
    payout_amount = Column(Float, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    processed_at = Column(DateTime, nullable=True)