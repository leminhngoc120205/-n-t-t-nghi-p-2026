import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { RSSFeed } from '@/models/rss-feed'
import { getRequestUser } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  await connectDB()
  const feeds = await RSSFeed.find()
    .populate('categoryId', 'name')
    .sort({ createdAt: -1 })
    .lean()

  return NextResponse.json({ ok: true, data: feeds })
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { name, url, categoryId } = body

  if (!name?.trim()) return NextResponse.json({ ok: false, error: 'Tên feed không được để trống.' }, { status: 400 })
  if (!url?.trim())  return NextResponse.json({ ok: false, error: 'URL RSS không được để trống.' }, { status: 400 })

  try { new URL(url) } catch {
    return NextResponse.json({ ok: false, error: 'URL không hợp lệ.' }, { status: 400 })
  }

  await connectDB()

  const exists = await RSSFeed.exists({ url: url.trim() })
  if (exists) return NextResponse.json({ ok: false, error: 'Feed URL này đã tồn tại.' }, { status: 409 })

  const feed = await RSSFeed.create({
    name: name.trim(),
    url:  url.trim(),
    categoryId: categoryId || null,
  })

  return NextResponse.json({ ok: true, data: feed }, { status: 201 })
}
