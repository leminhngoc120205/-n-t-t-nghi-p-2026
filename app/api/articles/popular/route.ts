import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'

export async function GET() {
  try {
    await connectDB()

    const since7d  = new Date(Date.now() - 7  * 24 * 60 * 60 * 1000)
    const since30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)

    // Ưu tiên bài trong 7 ngày gần nhất
    let articles = await Article.find({
      status: 'published',
      publishedAt: { $gte: since7d },
    })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title publishedAt viewCount slug sourceUrl writerId')
      .populate('writerId', 'fullName username')
      .lean()

    // Nếu chưa đủ 5, mở rộng sang 30 ngày
    if (articles.length < 5) {
      articles = await Article.find({
        status: 'published',
        publishedAt: { $gte: since30d },
      })
        .sort({ viewCount: -1 })
        .limit(5)
        .select('title publishedAt viewCount slug sourceUrl writerId')
        .populate('writerId', 'fullName username')
        .lean()
    }

    // Cuối cùng fallback không giới hạn thời gian
    if (articles.length < 5) {
      articles = await Article.find({ status: 'published' })
        .sort({ viewCount: -1 })
        .limit(5)
        .select('title publishedAt viewCount slug sourceUrl writerId')
        .populate('writerId', 'fullName username')
        .lean()
    }

    return NextResponse.json({ ok: true, data: articles })
  } catch {
    return NextResponse.json({ ok: false, error: 'Lỗi server' }, { status: 500 })
  }
}
