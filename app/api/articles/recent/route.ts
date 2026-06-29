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
      .sort({ viewCount: -1, publishedAt: -1 })
      .limit(5)
      .select('title publishedAt viewCount thumbnail slug sourceUrl')
      .lean()

    if (articles.length < 5) {
      const extra = await Article.find({ status: 'published' })
        .sort({ viewCount: -1, publishedAt: -1 })
        .limit(5)
        .select('title publishedAt viewCount thumbnail slug sourceUrl')
        .lean()
      return NextResponse.json({ ok: true, data: extra })
    }

    return NextResponse.json({ ok: true, data: articles })
  } catch {
    return NextResponse.json({ ok: false, error: 'Lỗi server' }, { status: 500 })
  }
}
