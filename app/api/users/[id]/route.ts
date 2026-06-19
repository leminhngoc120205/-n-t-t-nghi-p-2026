import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/user'
import { getRequestUser } from '@/lib/api-auth'
import { hashPassword } from '@/lib/auth'
import { writeLog } from '@/lib/log.service'

type Ctx = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(_req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin' && user.userId !== params.id) {
    return NextResponse.json({ ok: false, error: 'Không có quyền.' }, { status: 403 })
  }
  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  await connectDB()
  const item = await User.findById(params.id).select('-passwordHash').lean()
  if (!item) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  return NextResponse.json({ ok: true, data: item })
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })
  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  await connectDB()
  const body = await req.json() as Record<string, unknown>

  if (body.password && typeof body.password === 'string') {
    body.passwordHash = hashPassword(body.password)
    delete body.password
  }
  delete body.username

  const item = await User.findByIdAndUpdate(params.id, body, { new: true }).select('-passwordHash')
  if (!item) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  await writeLog({ userId: user.userId, actionType: 'update', objectType: 'user', objectId: params.id, objectTitle: item.username })
  return NextResponse.json({ ok: true, data: item })
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(_req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })
  if (user.userId === params.id) return NextResponse.json({ ok: false, error: 'Không thể xóa chính mình.' }, { status: 400 })
  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  await connectDB()
  const item = await User.findByIdAndDelete(params.id)
  if (!item) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  await writeLog({ userId: user.userId, actionType: 'delete', objectType: 'user', objectId: params.id, objectTitle: item.username })
  return NextResponse.json({ ok: true, message: 'Đã xóa tài khoản.' })
}
