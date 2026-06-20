import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'

export async function GET() {
  try {
    await connectDB()
    const articles = await Article.find({ status: 'published' })
      .sort({ viewCount: -1 })
      .limit(5)
      .select('title publishedAt viewCount')
      .lean()

    return NextResponse.json({ ok: true, data: articles })
  } catch {
    return NextResponse.json({ ok: false, error: 'Lỗi server' }, { status: 500 })
  }
}
