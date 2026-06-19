import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Author } from '@/models/author'
import { getRequestUser } from '@/lib/api-auth'
import { writeLog } from '@/lib/log.service'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  await connectDB()
  const items = await Author.find({ isActive: true }).sort({ name: 1 }).lean()
  return NextResponse.json({ ok: true, data: items })
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role === 'reporter') return NextResponse.json({ ok: false, error: 'Không có quyền.' }, { status: 403 })

  try {
    const body = await req.json()
    await connectDB()
    const item = await Author.create(body)
    await writeLog({ userId: user.userId, actionType: 'create', objectType: 'author', objectId: item._id.toString(), objectTitle: item.name })
    return NextResponse.json({ ok: true, data: item }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
