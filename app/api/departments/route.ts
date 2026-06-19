import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Department } from '@/models/department'
import { getRequestUser } from '@/lib/api-auth'
import { writeLog } from '@/lib/log.service'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  await connectDB()
  const items = await Department.find().sort({ name: 1 }).lean()
  return NextResponse.json({ ok: true, data: items })
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })

  try {
    const body = await req.json()
    await connectDB()
    const item = await Department.create(body)
    await writeLog({ userId: user.userId, actionType: 'create', objectType: 'department', objectId: item._id.toString(), objectTitle: item.name })
    return NextResponse.json({ ok: true, data: item }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
