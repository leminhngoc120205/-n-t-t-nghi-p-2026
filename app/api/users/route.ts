import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/models/user'
import { Article } from '@/models/article'
import { getRequestUser } from '@/lib/api-auth'
import { hashPassword } from '@/lib/auth'
import { writeLog } from '@/lib/log.service'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })

  await connectDB()

  const [users, articleCounts] = await Promise.all([
    User.find().select('-passwordHash').sort({ createdAt: -1 }).lean(),
    Article.aggregate([{ $group: { _id: '$writerId', count: { $sum: 1 } } }]),
  ])

  const countMap = new Map<string, number>(
    (articleCounts as { _id: Types.ObjectId | null; count: number }[]).map(r => [
      r._id?.toString() ?? '', r.count,
    ])
  )

  const data = users.map(u => ({
    ...u,
    articleCount: countMap.get((u._id as Types.ObjectId).toString()) ?? 0,
  }))

  return NextResponse.json({ ok: true, data })
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền.' }, { status: 403 })

  try {
    const { username, password, fullName, email, role, departmentId } = await req.json() as {
      username: string; password: string; fullName: string; email?: string
      role?: 'admin' | 'editor' | 'reporter'; departmentId?: string
    }

    if (!username || !password || !fullName) {
      return NextResponse.json({ ok: false, error: 'Thiếu username, password hoặc fullName.' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ ok: false, error: 'Mật khẩu tối thiểu 6 ký tự.' }, { status: 400 })
    }

    await connectDB()
    const newUser = await User.create({
      username: username.trim().toLowerCase(),
      passwordHash: hashPassword(password),
      fullName: fullName.trim(),
      email: email ?? '',
      role: role ?? 'reporter',
      departmentId: departmentId ?? null,
    })

    await writeLog({ userId: user.userId, actionType: 'create', objectType: 'user', objectId: newUser._id.toString(), objectTitle: newUser.username })

    const { passwordHash: _, ...safeUser } = newUser.toObject()
    return NextResponse.json({ ok: true, data: safeUser }, { status: 201 })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Lỗi máy chủ.'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
