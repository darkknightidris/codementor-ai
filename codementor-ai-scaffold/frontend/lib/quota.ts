// lib/quota.ts
import { Plan, PLAN_LIMITS, Profile } from '@/types'

export function getQuotaInfo(profile: Profile) {
  const limit = PLAN_LIMITS[profile.plan as Plan]
  const used = profile.review_count_this_month
  const remaining = Math.max(0, limit - used)
  const isUnlimited = profile.plan === 'unlimited'
  const hasQuota = isUnlimited || remaining > 0

  const resetDate = new Date(profile.review_reset_date)
  resetDate.setMonth(resetDate.getMonth() + 1)

  return {
    plan: profile.plan as Plan,
    limit,
    used,
    remaining,
    isUnlimited,
    hasQuota,
    percentUsed: isUnlimited ? 0 : Math.min(100, Math.round((used / limit) * 100)),
    resetDate,
  }
}

export function formatResetDate(date: Date): string {
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}
