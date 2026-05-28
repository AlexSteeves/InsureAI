import anthropic
import json
import os
from dotenv import load_dotenv

load_dotenv()

_client: anthropic.AsyncAnthropic | None = None


def get_client() -> anthropic.AsyncAnthropic:
    global _client
    if _client is None:
        _client = anthropic.AsyncAnthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
    return _client


SYSTEM_PROMPT = """You are ClaimAI, the automated claims processor for InsureAI — \
Canada's first fully AI-driven insurance carrier.

Your responsibilities:
1. Analyze insurance claims from policyholder descriptions and uploaded photos
2. Make an instant binding decision: APPROVED, DENIED, or ESCALATED
3. Assign a fraud risk score from 0 to 100
4. Provide specific, evidence-based reasoning bullets

Fraud Score Reference:
  0–20   Very low risk  — clean claim, approve
  21–40  Low risk       — approve with notation
  41–60  Moderate risk  — approve cautiously or escalate
  61–80  High risk      — escalate to SIU
  81–100 Very high risk — likely fraudulent, escalate immediately

Key fraud signals to evaluate:
- Policy age at time of claim (< 30 days is a major red flag)
- Claim amount relative to total coverage limit (> 80% is suspicious)
- Vague, generic, or internally inconsistent description
- Photos that contradict or do not match the described incident
- Coverage type mismatch (e.g. vehicle damage claimed on a home policy)
- Missing specifics: no time, no location, no other parties mentioned

Decision logic:
- APPROVED  → coverage applies, damage is plausible, fraud score <= 40
- DENIED    → coverage clearly does not apply to this loss type, OR fraud score > 80
- ESCALATED → fraud score 41–80, ambiguous coverage, or any factor requiring human review

Always respond with ONLY valid JSON. No markdown, no explanation outside the JSON object."""


CLAIM_TEMPLATE = """Analyze this insurance claim and return a JSON decision.

Policy Details:
  Coverage Type:   {coverage_type}
  Coverage Amount: ${coverage_amount:,.0f} CAD
  Policy Age:      {policy_age_days} days old at time of claim

Claimant Description:
  \"{description}\"

Respond with ONLY this exact JSON — no other text:
{{
  "decision":      "APPROVED" | "DENIED" | "ESCALATED",
  "payout_amount": <float in CAD, or null if denied or escalated>,
  "fraud_score":   <integer 0-100>,
  "fraud_flags":   ["specific flag", "specific flag"],
  "reasoning":     ["bullet 1", "bullet 2", "bullet 3"],
  "summary":       "One plain-English sentence summarising the decision."
}}"""


async def process_claim(
    description: str,
    coverage_type: str,
    coverage_amount: float,
    policy_age_days: int,
    images: list[str] | None = None,
) -> dict:
    client = get_client()
    content: list[dict] = []

    for img_b64 in (images or [])[:3]:
        raw = img_b64.split(",", 1)[1] if "," in img_b64 else img_b64
        content.append({
            "type": "image",
            "source": {
                "type": "base64",
                "media_type": "image/jpeg",
                "data": raw,
            },
        })

    content.append({
        "type": "text",
        "text": CLAIM_TEMPLATE.format(
            coverage_type=coverage_type.upper(),
            coverage_amount=coverage_amount,
            policy_age_days=policy_age_days,
            description=description,
        ),
    })

    response = await client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": content}],
    )

    raw_text = response.content[0].text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.split("\n", 1)[1].rsplit("```", 1)[0].strip()

    try:
        return json.loads(raw_text)
    except json.JSONDecodeError as e:
        raise ValueError(f"Claude returned invalid JSON: {e}\nRaw: {raw_text}")