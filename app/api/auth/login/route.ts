import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, createToken, buildCookieHeader } from '@/lib/auth'
import { findByUsername, toPublic, seedUsersIfEmpty } from '@/lib/users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { username?: string; password?: string; rememberMe?: boolean }
    const { username, password, rememberMe = false } = body

    if (!username?.trim() || !password) {
      return NextResponse.json({ error: 'Tên đăng nhập và mật khẩu không được để trống.' }, { status: 400 })
    }

    await seedUsersIfEmpty()

    const user = await findByUsername(username.trim())
    if (!user) {
      return NextResponse.json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' }, { status: 401 })
    }

    if (!verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Tên đăng nhập hoặc mật khẩu không đúng.' }, { status: 401 })
    }

    const publicUser = toPublic(user)
    const token = createToken(
      { userId: publicUser.id, username: publicUser.username, fullName: publicUser.fullName, role: publicUser.role },
      rememberMe,
    )

    const response = NextResponse.json({ ok: true, user: publicUser })
    response.headers.set('Set-Cookie', buildCookieHeader(token, rememberMe))
    return response
  } catch (err) {
    console.error('[/api/auth/login]', err)
    return NextResponse.json(
      { error: `Lỗi máy chủ: ${err instanceof Error ? err.message : String(err)}` },
      { status: 500 },
    )
  }
}
