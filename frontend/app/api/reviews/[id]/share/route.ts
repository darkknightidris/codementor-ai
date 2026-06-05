// app/api/reviews/[id]/share/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { randomBytes } from 'crypto'

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  // Verify ownership
  const { data: review } = await supabase
    .from('code_reviews')
    .select('id, user_id, share_token')
    .eq('id', id)
    .single()

  if (!review || review.user_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Reuse existing token or generate new
  const token = review.share_token ?? randomBytes(8).toString('hex')

  await supabase
    .from('code_reviews')
    .update({ is_public: true, share_token: token })
    .eq('id', id)

  return NextResponse.json({ share_token: token, share_url: `/r/${token}` })
}
