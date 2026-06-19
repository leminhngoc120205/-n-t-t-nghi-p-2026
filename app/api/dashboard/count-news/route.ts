import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'
import { getRequestUser } from '@/lib/api-auth'

const STATUSES = ['draft','processing','waiting_edit','waiting_publish','approved',
                  'published','cross_post','returned','in_progress','removed','deleted','magazine']

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ error: 'Chưa đăng nhập.' }, { status: 401 })

  await connectDB()

  const results = await Article.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ])

  const counts: Record<string, number> = Object.fromEntries(STATUSES.map(s => [s, 0]))
  for (const r of results) {
    if (r._id) counts[r._id] = r.count
  }

  return NextResponse.json({ counts })
}
