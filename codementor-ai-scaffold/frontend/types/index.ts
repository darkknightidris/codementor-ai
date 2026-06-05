// types/index.ts

export type Plan = 'free' | 'pro' | 'unlimited'
export type ReviewMode = 'beginner' | 'standard' | 'senior'

export interface Profile {
  id: string
  full_name: string | null
  plan: Plan
  review_count_this_month: number
  review_reset_date: string
  created_at: string
}

export interface ReviewIssue {
  line?: number
  issue: string
  fix?: string
  better?: string
  suggestion?: string
  severity?: 'high' | 'medium' | 'low'
}

export interface ReviewResult {
  score: number
  summary: string
  bugs: ReviewIssue[]
  security: ReviewIssue[]
  performance: ReviewIssue[]
  best_practices: ReviewIssue[]
  improved_code: string
  encouragement: string
}

export interface CodeReview {
  id: string
  user_id: string
  language: string
  mode: ReviewMode
  original_code: string
  review_result: ReviewResult | null
  score: number | null
  is_public: boolean
  share_token: string | null
  created_at: string
}

export const PLAN_LIMITS: Record<Plan, number> = {
  free: 10,
  pro: 100,
  unlimited: 999999,
}

export const PLAN_PRICES: Record<Plan, string> = {
  free: 'Gratis',
  pro: 'Rp 49.000/bln',
  unlimited: 'Rp 99.000/bln',
}

export const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'php', label: 'PHP' },
  { value: 'java', label: 'Java' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'cpp', label: 'C++' },
  { value: 'c', label: 'C' },
] as const

export const REVIEW_MODES = [
  {
    value: 'beginner' as ReviewMode,
    label: 'Beginner',
    desc: 'Penjelasan ramah, pakai analogi sederhana',
  },
  {
    value: 'standard' as ReviewMode,
    label: 'Standard',
    desc: 'Review komprehensif, campuran Indonesia + English',
  },
  {
    value: 'senior' as ReviewMode,
    label: 'Senior',
    desc: 'Strict review seperti production code, full English',
  },
] as const
