# backend/app/routers/profile.py
import os
from fastapi import APIRouter, HTTPException, Header
from .review import get_supabase, get_user_from_token, PLAN_LIMITS

router = APIRouter()


@router.get("/profile/quota")
async def get_quota(authorization: str = Header(...)):
    token = authorization.removeprefix("Bearer ").strip()
    user = get_user_from_token(token)
    supabase = get_supabase()

    profile_resp = (
        supabase.table("profiles").select("*").eq("id", user.id).single().execute()
    )
    if not profile_resp.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    profile = profile_resp.data
    plan = profile.get("plan", "free")
    limit = PLAN_LIMITS.get(plan, 10)
    used = profile.get("review_count_this_month", 0)
    remaining = max(0, limit - used) if plan != "unlimited" else 999_999

    return {
        "plan": plan,
        "limit": limit,
        "used": used,
        "remaining": remaining,
        "is_unlimited": plan == "unlimited",
        "has_quota": plan == "unlimited" or remaining > 0,
        "percent_used": 0 if plan == "unlimited" else min(100, round((used / limit) * 100)),
        "reset_date": profile.get("review_reset_date"),
    }
