import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Category } from '@/models/category'
import { getRequestUser } from '@/lib/api-auth'
import { writeLog } from '@/lib/log.service'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  try {
    await connectDB()
    const items = await Category.find({ isActive: true }).sort({ displayOrder: 1 }).lean()
    return NextResponse.json({ ok: true, data: items })
  } catch {
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })

  try {
    const { name, slug, parentId, displayOrder } = await req.json() as Record<string, unknown>
    if (!name || !slug) return NextResponse.json({ ok: false, error: 'Thiếu name hoặc slug.' }, { status: 400 })

    await connectDB()
    const item = await Category.create({ name, slug, parentId: parentId ?? null, displayOrder: displayOrder ?? 0 })

    await writeLog({ userId: user.userId, actionType: 'create', objectType: 'category', objectId: item._id.toString(), objectTitle: item.name })

    return NextResponse.json({ ok: true, data: item }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
