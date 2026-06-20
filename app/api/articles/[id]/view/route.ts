import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'

export async function PATCH(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    await Article.findByIdAndUpdate(params.id, { $inc: { viewCount: 1 } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false, error: 'Lỗi server' }, { status: 500 })
  }
}
