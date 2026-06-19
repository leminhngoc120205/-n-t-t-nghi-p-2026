import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'
import { getRequestUser } from '@/lib/api-auth'
import { writeLog } from '@/lib/log.service'

type Ctx = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(_req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  try {
    await connectDB()
    const article = await Article.findById(params.id).lean()
    if (!article) return NextResponse.json({ ok: false, error: 'Không tìm thấy bài viết.' }, { status: 404 })
    return NextResponse.json({ ok: true, data: article })
  } catch (err) {
    console.error('[GET /api/articles/[id]]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  try {
    await connectDB()
    const article = await Article.findById(params.id)
    if (!article) return NextResponse.json({ ok: false, error: 'Không tìm thấy bài viết.' }, { status: 404 })

    // reporter chỉ sửa bài của chính mình và chỉ khi đang draft/returned
    if (user.role === 'reporter') {
      if (article.writerId?.toString() !== user.userId) {
        return NextResponse.json({ ok: false, error: 'Không có quyền sửa bài viết này.' }, { status: 403 })
      }
      if (!['draft', 'returned'].includes(article.status)) {
        return NextResponse.json({ ok: false, error: 'Bài đã nộp không thể sửa trực tiếp.' }, { status: 403 })
      }
    }

    const body = await req.json() as Record<string, unknown>
    // không cho phép đổi status qua PATCH — dùng endpoint /status
    delete body.status
    delete body.writerId
    delete body.publishedAt

    const updated = await Article.findByIdAndUpdate(params.id, body, { new: true, runValidators: true })

    await writeLog({ userId: user.userId, actionType: 'update', objectType: 'article', objectId: params.id, objectTitle: article.title })

    return NextResponse.json({ ok: true, data: updated })
  } catch (err) {
    console.error('[PATCH /api/articles/[id]]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const user = getRequestUser(_req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })
  if (user.role !== 'admin') return NextResponse.json({ ok: false, error: 'Chỉ admin mới có quyền xóa.' }, { status: 403 })

  if (!Types.ObjectId.isValid(params.id)) return NextResponse.json({ ok: false, error: 'ID không hợp lệ.' }, { status: 400 })

  try {
    await connectDB()
    const article = await Article.findByIdAndUpdate(params.id, { status: 'deleted' }, { new: true })
    if (!article) return NextResponse.json({ ok: false, error: 'Không tìm thấy bài viết.' }, { status: 404 })

    await writeLog({ userId: user.userId, actionType: 'delete', objectType: 'article', objectId: params.id, objectTitle: article.title })

    return NextResponse.json({ ok: true, message: 'Đã xóa bài viết.' })
  } catch (err) {
    console.error('[DELETE /api/articles/[id]]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}
