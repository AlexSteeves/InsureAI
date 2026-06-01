from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import policies, claims
from limiter import remaining

app = FastAPI(title="InsureAI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://alexsteeves.com",
        "https://www.alexsteeves.com",
        "http://localhost:3000",   # local dev
        "http://127.0.0.1:3000",  # local dev
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

app.include_router(policies.router, prefix="/api/policies", tags=["policies"])
app.include_router(claims.router, prefix="/api/claims", tags=["claims"])


@app.get("/health")
def health():
    return {
        "status": "ok",
        "service": "insureai-api",
        "claims_remaining_today": remaining(),
    }
