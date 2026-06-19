import { NextRequest, NextResponse } from 'next/server'
import { getRequestUser } from '@/lib/api-auth'
import { transitionStatus } from '@/lib/news.service'
import { ArticleStatus } from '@/models/article'

type Ctx = { params: { id: string } }

export async function POST(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  const { to, notes } = await req.json() as { to: ArticleStatus; notes?: string }
  if (!to) return NextResponse.json({ ok: false, error: 'Thiếu trạng thái đích.' }, { status: 400 })

  const result = await transitionStatus(params.id, to, user.userId, user.role, notes)

  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 })

  return NextResponse.json({ ok: true, data: result.data })
}
