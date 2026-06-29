import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Event } from '@/models/event'
import { Category } from '@/models/category'
import { getRequestUser } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  await connectDB()
  const events = await Event.find({ isActive: true })
    .sort({ displayOrder: 1, createdAt: -1 })
    .lean()
  return NextResponse.json({ ok: true, data: events })
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role === 'reporter') return NextResponse.json({ ok: false, error: 'Không có quyền.' }, { status: 403 })

  try {
    await connectDB()
    const body = await req.json()
    const { name, slug, description, categoryId, articleCount, showOnHome, isFeatured, displayOrder } = body

    if (!name?.trim() || !slug?.trim()) {
      return NextResponse.json({ ok: false, error: 'Tên và slug không được để trống.' }, { status: 400 })
    }

    const exists = await Event.exists({ slug: slug.trim().toLowerCase() })
    if (exists) return NextResponse.json({ ok: false, error: 'Slug đã tồn tại.' }, { status: 409 })

    let categoryName = ''
    if (categoryId) {
      const cat = await Category.findById(categoryId).select('name').lean()
      if (cat) categoryName = (cat as { name: string }).name
    }

    const event = await Event.create({
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: description?.trim() || '',
      categoryId: categoryId || null,
      categoryName,
      articleCount: articleCount ?? 0,
      showOnHome: showOnHome ?? false,
      isFeatured: isFeatured ?? false,
      displayOrder: displayOrder ?? 0,
    })

    return NextResponse.json({ ok: true, data: event }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
