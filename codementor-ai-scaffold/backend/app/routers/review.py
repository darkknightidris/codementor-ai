# backend/app/routers/review.py
import os
import json
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Literal

import anthropic
from supabase import create_client, Client

router = APIRouter()

SUPABASE_URL = os.environ["SUPABASE_URL"]
SUPABASE_SERVICE_KEY = os.environ["SUPABASE_SERVICE_KEY"]
ANTHROPIC_API_KEY = os.environ["ANTHROPIC_API_KEY"]

anthropic_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

PLAN_LIMITS = {"free": 10, "pro": 100, "unlimited": 999_999}

ReviewMode = Literal["beginner", "standard", "senior"]

SYSTEM_PROMPTS = {
    "beginner": (
        "Kamu adalah mentor coding yang sabar dan supportif untuk developer pemula Indonesia. "
        "Gunakan Bahasa Indonesia yang mudah dipahami. Jelaskan setiap masalah dengan analogi sederhana. "
        "Jangan menghakimi — selalu semangati user. Fokus pada 2-3 masalah terpenting saja. "
        "Kembalikan HANYA JSON valid tanpa markdown fences."
    ),
    "standard": (
        "Kamu adalah senior software engineer yang melakukan code review profesional. "
        "Gunakan campuran Bahasa Indonesia dan istilah teknis yang umum. "
        "Berikan feedback komprehensif tapi tetap actionable. "
        "Kembalikan HANYA JSON valid tanpa markdown fences."
    ),
    "senior": (
        "You are a senior engineer at a top tech company doing a strict code review. "
        "Be thorough, use proper technical terminology in English. "
        "Treat this like a real production code review — no sugar coating. "
        "Return ONLY valid JSON without markdown fences."
    ),
}


class ReviewRequest(BaseModel):
    code: str
    language: str
    mode: ReviewMode


def get_supabase() -> Client:
    return create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)


def get_user_from_token(token: str) -> dict:
    """Validate Supabase JWT and return user."""
    supabase = get_supabase()
    result = supabase.auth.get_user(token)
    if not result or not result.user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return result.user


def first_of_month() -> str:
    now = datetime.now(timezone.utc)
    return datetime(now.year, now.month, 1, tzinfo=timezone.utc).isoformat()


@router.post("/review")
async def create_review(
    body: ReviewRequest,
    authorization: str = Header(...),
):
    token = authorization.removeprefix("Bearer ").strip()
    user = get_user_from_token(token)
    supabase = get_supabase()

    # Get profile
    profile_resp = (
        supabase.table("profiles").select("*").eq("id", user.id).single().execute()
    )
    if not profile_resp.data:
        raise HTTPException(status_code=404, detail="Profile not found")
    profile = profile_resp.data

    # Reset quota if new month
    reset_date = datetime.fromisoformat(profile["review_reset_date"])
    now = datetime.now(timezone.utc)
    first_month = datetime(now.year, now.month, 1, tzinfo=timezone.utc)
    if reset_date.replace(tzinfo=timezone.utc) < first_month:
        supabase.table("profiles").update(
            {"review_count_this_month": 0, "review_reset_date": first_of_month()}
        ).eq("id", user.id).execute()
        profile["review_count_this_month"] = 0

    # Check quota
    plan = profile.get("plan", "free")
    limit = PLAN_LIMITS.get(plan, 10)
    if plan != "unlimited" and profile["review_count_this_month"] >= limit:
        raise HTTPException(
            status_code=429,
            detail={"error": "quota_exceeded", "limit": limit, "plan": plan},
        )

    if not body.code.strip():
        raise HTTPException(status_code=400, detail="Code tidak boleh kosong")
    if len(body.code) > 10_000:
        raise HTTPException(status_code=400, detail="Code terlalu panjang (max 10.000 karakter)")

    # Call Anthropic
    user_prompt = f"""
Review kode berikut dalam bahasa {body.language}:

```{body.language}
{body.code}
```

Kembalikan JSON dengan format PERSIS ini:
{{
  "score": <0-100>,
  "summary": "<ringkasan 1-2 kalimat>",
  "bugs": [{{"line": <nomor|null>, "issue": "<masalah>", "fix": "<solusi>"}}],
  "security": [{{"issue": "<masalah>", "severity": "<high|medium|low>", "fix": "<solusi>"}}],
  "performance": [{{"issue": "<masalah>", "suggestion": "<saran>"}}],
  "best_practices": [{{"issue": "<masalah>", "better": "<cara yang lebih baik>"}}],
  "improved_code": "<kode lengkap yang sudah diperbaiki, atau string kosong>",
  "encouragement": "<pesan semangat 1 kalimat>"
}}
"""

    message = anthropic_client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=2000,
        system=SYSTEM_PROMPTS[body.mode],
        messages=[{"role": "user", "content": user_prompt}],
    )

    raw = "".join(c.text for c in message.content if hasattr(c, "text"))
    try:
        review_result = json.loads(raw.replace("```json", "").replace("```", "").strip())
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON")

    # Save review
    save_resp = (
        supabase.table("code_reviews")
        .insert(
            {
                "user_id": user.id,
                "language": body.language,
                "mode": body.mode,
                "original_code": body.code,
                "review_result": review_result,
                "score": review_result.get("score"),
            }
        )
        .select()
        .single()
        .execute()
    )

    # Increment counter
    supabase.table("profiles").update(
        {"review_count_this_month": profile["review_count_this_month"] + 1}
    ).eq("id", user.id).execute()

    # Log usage
    supabase.table("usage_logs").insert(
        {
            "user_id": user.id,
            "action": "code_review",
            "meta": {
                "language": body.language,
                "mode": body.mode,
                "score": review_result.get("score"),
            },
        }
    ).execute()

    return {"review": save_resp.data}
