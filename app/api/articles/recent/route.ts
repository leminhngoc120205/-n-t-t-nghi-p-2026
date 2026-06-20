import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'

export async function GET() {
  try {
    await connectDB()
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const articles = await Article.find({
      status: 'published',
      publishedAt: { $gte: since },
    })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('title publishedAt viewCount')
      .lean()

    // Nếu 7 ngày không đủ 5 bài thì lấy thêm bài cũ hơn
    if (articles.length < 5) {
      const extra = await Article.find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .limit(5)
        .select('title publishedAt viewCount')
        .lean()
      return NextResponse.json({ ok: true, data: extra })
    }

    return NextResponse.json({ ok: true, data: articles })
  } catch {
    return NextResponse.json({ ok: false, error: 'Lỗi server' }, { status: 500 })
  }
}
