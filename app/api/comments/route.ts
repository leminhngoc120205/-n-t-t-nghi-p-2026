import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Comment } from '@/models/comment'
import { Article } from '@/models/article'
import { getRequestUser } from '@/lib/api-auth'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  const articleId = req.nextUrl.searchParams.get('articleId')
  const status    = req.nextUrl.searchParams.get('status') ?? 'pending'

  const query: Record<string, unknown> = { status }
  if (articleId && Types.ObjectId.isValid(articleId)) query.articleId = articleId

  await connectDB()
  const items = await Comment.find(query).sort({ createdAt: -1 }).limit(100).lean()
  return NextResponse.json({ ok: true, data: items })
}

export async function POST(req: NextRequest) {
  try {
    const { articleId, authorName, authorEmail, content } = await req.json() as {
      articleId: string; authorName: string; authorEmail?: string; content: string
    }

    if (!articleId || !authorName || !content) {
      return NextResponse.json({ ok: false, error: 'Thiếu thông tin bình luận.' }, { status: 400 })
    }
    if (!Types.ObjectId.isValid(articleId)) {
      return NextResponse.json({ ok: false, error: 'articleId không hợp lệ.' }, { status: 400 })
    }

    await connectDB()
    const article = await Article.findById(articleId)
    if (!article || article.status !== 'published') {
      return NextResponse.json({ ok: false, error: 'Bài viết không tồn tại hoặc chưa xuất bản.' }, { status: 404 })
    }

    const comment = await Comment.create({ articleId, authorName, authorEmail: authorEmail ?? '', content })
    await Article.findByIdAndUpdate(articleId, { $inc: { commentCount: 1 } })

    return NextResponse.json({ ok: true, data: comment }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/comments]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}
