import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Event } from '@/models/event'
import { Category } from '@/models/category'
import { getRequestUser } from '@/lib/api-auth'

type Ctx = { params: { id: string } }

const ALLOWED = ['name', 'slug', 'description', 'categoryId', 'articleCount', 'showOnHome', 'isFeatured', 'displayOrder', 'isActive']

export async function GET(_req: NextRequest, { params }: Ctx) {
  if (!Types.ObjectId.isValid(params.id))
    return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })
  await connectDB()
  const event = await Event.findById(params.id).lean()
  if (!event) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  return NextResponse.json({ ok: true, data: event })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role === 'reporter') return NextResponse.json({ ok: false, error: 'Không có quyền.' }, { status: 403 })
  if (!Types.ObjectId.isValid(params.id))
    return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  try {
    await connectDB()
    const body = await req.json()
    const update: Record<string, unknown> = {}
    for (const key of ALLOWED) {
      if (key in body) update[key] = body[key]
    }

    if (update.categoryId) {
      const cat = await Category.findById(update.categoryId).select('name').lean()
      if (cat) update.categoryName = (cat as { name: string }).name
    } else if ('categoryId' in body && !body.categoryId) {
      update.categoryName = ''
    }

    const event = await Event.findByIdAndUpdate(params.id, update, { new: true })
    if (!event) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
    return NextResponse.json({ ok: true, data: event })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(_req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })
  if (!Types.ObjectId.isValid(params.id))
    return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  await connectDB()
  const event = await Event.findByIdAndUpdate(params.id, { isActive: false }, { new: true })
  if (!event) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  return NextResponse.json({ ok: true, message: 'Đã vô hiệu hoá dòng sự kiện.' })
}
