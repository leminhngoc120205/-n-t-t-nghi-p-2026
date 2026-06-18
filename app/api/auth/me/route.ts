import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'
import { findById, toPublic } from '@/lib/users'

export async function GET(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ user: null }, { status: 401 })

  const payload = verifyToken(token)
  if (!payload) return NextResponse.json({ user: null }, { status: 401 })

  const user = await findById(payload.userId as string)
  if (!user) return NextResponse.json({ user: null }, { status: 401 })

  return NextResponse.json({ user: toPublic(user) })
}
