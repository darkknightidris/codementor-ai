import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import Groq from 'groq-sdk'
import { cookies } from 'next/headers'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

const PLAN_LIMITS: Record<string, number> = { free: 10, pro: 100, unlimited: 999999 }

const SYSTEM_PROMPTS: Record<string, string> = {
  beginner: `Kamu adalah mentor coding yang sabar untuk developer pemula Indonesia. Gunakan Bahasa Indonesia yang mudah dipahami. Jelaskan dengan analogi sederhana. Fokus pada 2-3 masalah terpenting. Kembalikan HANYA JSON valid tanpa markdown backticks.`,
  standard: `Kamu adalah senior software engineer yang melakukan code review. Gunakan campuran Bahasa Indonesia dan istilah teknis. Berikan feedback komprehensif dan actionable. Kembalikan HANYA JSON valid tanpa markdown backticks.`,
  senior: `You are a senior engineer doing a strict code review. Be thorough, use proper technical terminology. No sugar coating. Return ONLY valid JSON without markdown backticks.`,
}

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()

  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )

  const { data: profile } = await supabaseAdmin
    .from('profiles').select('*').eq('id', user.id).single()

  if (!profile) {
    await supabaseAdmin.from('profiles').insert({
      id: user.id,
      full_name: user.user_metadata?.full_name || '',
      plan: 'free',
      review_count_this_month: 0,
      review_reset_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString(),
    })
  }

  const currentProfile = profile!

  const resetDate = new Date(currentProfile.review_reset_date)
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  if (resetDate < firstOfMonth) {
    await supabaseAdmin.from('profiles').update({
      review_count_this_month: 0,
      review_reset_date: firstOfMonth.toISOString()
    }).eq('id', user.id)
    currentProfile.review_count_this_month = 0
  }

  const limit = PLAN_LIMITS[currentProfile.plan] ?? 10
  if (currentProfile.plan !== 'unlimited' && currentProfile.review_count_this_month >= limit) {
    return NextResponse.json({ error: 'quota_exceeded', limit, plan: currentProfile.plan }, { status: 429 })
  }

  const body = await req.json()
  const { code, language, mode } = body
  if (!code?.trim() || !language || !mode) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  if (code.length > 10000) return NextResponse.json({ error: 'Code terlalu panjang (max 10.000 karakter)' }, { status: 400 })

  const userPrompt = `Review kode berikut dalam bahasa ${language}:
\`\`\`${language}
${code}
\`\`\`

Kembalikan JSON dengan format PERSIS ini (tanpa backtick, tanpa teks lain):
{"score":<0-100>,"summary":"<ringkasan singkat>","bugs":[{"issue":"<masalah>","fix":"<solusi>"}],"security":[{"issue":"<masalah>","severity":"high|medium|low","fix":"<solusi>"}],"performance":[{"issue":"<masalah>","suggestion":"<saran>"}],"best_practices":[{"issue":"<masalah>","better":"<cara lebih baik>"}],"improved_code":"<kode diperbaiki>","encouragement":"<pesan semangat 1 kalimat>"}`

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2000,
    temperature: 0.3,
    messages: [
      { role: 'system', content: SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.standard },
      { role: 'user', content: userPrompt }
    ],
  })

  const rawText = completion.choices[0]?.message?.content || ''
  
  let reviewResult
  try {
    const cleaned = rawText.replace(/```json|```/g, '').trim()
    reviewResult = JSON.parse(cleaned)
  } catch {
    return NextResponse.json({ error: 'AI returned invalid response', raw: rawText.substring(0, 200) }, { status: 500 })
  }

  const { data: savedReview } = await supabaseAdmin.from('code_reviews').insert({
    user_id: user.id,
    language,
    mode,
    original_code: code,
    review_result: reviewResult,
    score: reviewResult.score,
  }).select().single()

  await supabaseAdmin.from('profiles').update({
    review_count_this_month: currentProfile.review_count_this_month + 1
  }).eq('id', user.id)

  await supabaseAdmin.from('usage_logs').insert({
    user_id: user.id,
    action: 'code_review',
    meta: { language, mode, score: reviewResult.score }
  })

  return NextResponse.json({ review: savedReview })
}

