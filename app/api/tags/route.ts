import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Tag } from '@/models/tag'
import { getRequestUser } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  const search = req.nextUrl.searchParams.get('search')
  const query = search ? { name: { $regex: search, $options: 'i' } } : {}

  await connectDB()
  const items = await Tag.find(query).sort({ articleCount: -1 }).limit(50).lean()
  return NextResponse.json({ ok: true, data: items })
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  try {
    const { name, slug } = await req.json() as { name: string; slug: string }
    if (!name || !slug) return NextResponse.json({ ok: false, error: 'Thiếu name hoặc slug.' }, { status: 400 })
    await connectDB()
    const item = await Tag.create({ name, slug })
    return NextResponse.json({ ok: true, data: item }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
