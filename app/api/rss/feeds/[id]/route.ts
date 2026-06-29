import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { RSSFeed } from '@/models/rss-feed'
import { getRequestUser } from '@/lib/api-auth'

type Ctx = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const allowed = ['name', 'url', 'categoryId', 'isActive']
  const update: Record<string, unknown> = {}
  for (const k of allowed) if (k in body) update[k] = body[k]

  await connectDB()
  const feed = await RSSFeed.findByIdAndUpdate(params.id, update, { new: true })
  if (!feed) return NextResponse.json({ ok: false, error: 'Feed không tồn tại.' }, { status: 404 })

  return NextResponse.json({ ok: true, data: feed })
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  await connectDB()
  const feed = await RSSFeed.findByIdAndDelete(params.id)
  if (!feed) return NextResponse.json({ ok: false, error: 'Feed không tồn tại.' }, { status: 404 })

  return NextResponse.json({ ok: true })
}
