from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from database import engine, Base, SessionLocal
from models import Policy
from routes import policies, claims

limiter = Limiter(key_func=get_remote_address, default_limits=["200/hour"])


def seed_demo_policy():
    db = SessionLocal()
    try:
        existing = db.query(Policy).filter(Policy.policy_number == "TRU-DEMO0001").first()
        if not existing:
            policy = Policy(
                id="demo-policy-001",
                policy_number="TRU-DEMO0001",
                holder_name="Alex Steeves",
                holder_email="alex@insureai.ca",
                coverage_type="auto",
                coverage_amount=35000,
                monthly_premium=58.33,
                coverage_details={"year": "2022", "make": "Toyota", "model": "Camry"},
                claim_free_days=142,
            )
            db.add(policy)
            db.commit()
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    seed_demo_policy()
    yield


app = FastAPI(
    title="InsureAI API",
    version="1.0.0",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(policies.router, prefix="/api/policies", tags=["policies"])
app.include_router(claims.router, prefix="/api/claims", tags=["claims"])


@app.get("/health")
def health():
    return {"status": "ok", "service": "insureai-api"}