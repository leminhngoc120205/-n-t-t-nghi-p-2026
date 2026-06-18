import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, verifyPassword, hashPassword, COOKIE_NAME } from '@/lib/auth'
import { findById, updateUser, updatePassword } from '@/lib/users'

export async function PATCH(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const payload = token ? verifyToken(token) : null
  if (!payload) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })

  const body = await request.json() as {
    fullName?: string; email?: string; phone?: string; address?: string; telegramId?: string
  }

  const ok = await updateUser(payload.userId as string, body)
  if (!ok) return NextResponse.json({ error: 'Không tìm thấy tài khoản.' }, { status: 404 })

  return NextResponse.json({ ok: true })
}

export async function POST(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const payload = token ? verifyToken(token) : null
  if (!payload) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })

  const { currentPassword, newPassword } = await request.json() as {
    currentPassword: string; newPassword: string
  }

  const user = await findById(payload.userId as string)
  if (!user) return NextResponse.json({ error: 'Không tìm thấy tài khoản.' }, { status: 404 })

  if (!verifyPassword(currentPassword, user.passwordHash)) {
    return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng.' }, { status: 400 })
  }

  if (newPassword.length < 6) {
    return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' }, { status: 400 })
  }

  const userId = (user._id as import('mongoose').Types.ObjectId).toString()
  await updatePassword(userId, hashPassword(newPassword))
  return NextResponse.json({ ok: true })
}
