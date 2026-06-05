// app/api/review/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'
import { PLAN_LIMITS, ReviewMode } from '@/types'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

const SYSTEM_PROMPTS: Record<ReviewMode, string> = {
  beginner: `Kamu adalah mentor coding yang sabar dan supportif untuk developer pemula Indonesia.
Gunakan Bahasa Indonesia yang mudah dipahami. Jelaskan setiap masalah dengan analogi sederhana.
Jangan menghakimi — selalu semangati user. Fokus pada 2-3 masalah terpenting saja, jangan overwhelming.
Kembalikan HANYA JSON valid tanpa markdown fences.`,

  standard: `Kamu adalah senior software engineer yang melakukan code review profesional.
Gunakan campuran Bahasa Indonesia dan istilah teknis yang umum.
Berikan feedback komprehensif tapi tetap actionable.
Kembalikan HANYA JSON valid tanpa markdown fences.`,

  senior: `You are a senior engineer at a top tech company doing a strict code review.
Be thorough, use proper technical terminology in English.
Treat this like a real production code review — no sugar coating.
Return ONLY valid JSON without markdown fences.`,
}

const USER_PROMPT = (language: string, code: string) => `
Review kode berikut dalam bahasa ${language}:

\`\`\`${language}
${code}
\`\`\`

Kembalikan JSON dengan format PERSIS ini:
{
  "score": <0-100>,
  "summary": "<ringkasan 1-2 kalimat>",
  "bugs": [{"line": <nomor|null>, "issue": "<masalah>", "fix": "<solusi>"}],
  "security": [{"issue": "<masalah>", "severity": "<high|medium|low>", "fix": "<solusi>"}],
  "performance": [{"issue": "<masalah>", "suggestion": "<saran>"}],
  "best_practices": [{"issue": "<masalah>", "better": "<cara yang lebih baik>"}],
  "improved_code": "<kode lengkap yang sudah diperbaiki, atau string kosong jika tidak ada masalah kritis>",
  "encouragement": "<pesan semangat 1 kalimat>"
}
`

export async function POST(req: NextRequest) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get profile + check quota
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  // Reset quota if new month
  const resetDate = new Date(profile.review_reset_date)
  const firstOfThisMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  if (resetDate < firstOfThisMonth) {
    await supabase
      .from('profiles')
      .update({ review_count_this_month: 0, review_reset_date: firstOfThisMonth.toISOString() })
      .eq('id', user.id)
    profile.review_count_this_month = 0
  }

  // Check limit
  const limit = PLAN_LIMITS[profile.plan as keyof typeof PLAN_LIMITS] ?? 10
  if (profile.plan !== 'unlimited' && profile.review_count_this_month >= limit) {
    return NextResponse.json(
      { error: 'quota_exceeded', limit, plan: profile.plan },
      { status: 429 }
    )
  }

  const body = await req.json()
  const { code, language, mode } = body as { code: string; language: string; mode: ReviewMode }

  if (!code?.trim() || !language || !mode) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (code.length > 10000) {
    return NextResponse.json({ error: 'Code terlalu panjang (max 10.000 karakter)' }, { status: 400 })
  }

  // Call Anthropic
  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    system: SYSTEM_PROMPTS[mode],
    messages: [{ role: 'user', content: USER_PROMPT(language, code) }],
  })

  const rawText = message.content.map(c => (c.type === 'text' ? c.text : '')).join('')
  let reviewResult
  try {
    reviewResult = JSON.parse(rawText.replace(/```json|```/g, '').trim())
  } catch {
    return NextResponse.json({ error: 'AI returned invalid response' }, { status: 500 })
  }

  // Save to DB
  const { data: savedReview, error: saveError } = await supabase
    .from('code_reviews')
    .insert({
      user_id: user.id,
      language,
      mode,
      original_code: code,
      review_result: reviewResult,
      score: reviewResult.score,
    })
    .select()
    .single()

  if (saveError) {
    return NextResponse.json({ error: 'Failed to save review' }, { status: 500 })
  }

  // Increment usage counter
  await supabase
    .from('profiles')
    .update({ review_count_this_month: profile.review_count_this_month + 1 })
    .eq('id', user.id)

  // Log usage
  await supabase.from('usage_logs').insert({
    user_id: user.id,
    action: 'code_review',
    meta: { language, mode, score: reviewResult.score },
  })

  return NextResponse.json({ review: savedReview })
}
