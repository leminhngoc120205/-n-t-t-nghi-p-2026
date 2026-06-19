import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Tag } from '@/models/tag'
import { getRequestUser } from '@/lib/api-auth'

type Ctx = { params: { id: string } }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })
  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  await connectDB()
  const body = await req.json()
  const item = await Tag.findByIdAndUpdate(params.id, body, { new: true })
  if (!item) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  return NextResponse.json({ ok: true, data: item })
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(_req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })
  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  await connectDB()
  const item = await Tag.findByIdAndDelete(params.id)
  if (!item) return NextResponse.json({ ok: false, error: 'Không tìm thấy.' }, { status: 404 })
  return NextResponse.json({ ok: true, message: 'Đã xóa tag.' })
}
