import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { RSSFeed } from '@/models/rss-feed'
import { Article } from '@/models/article'
import { getRequestUser } from '@/lib/api-auth'
import { fetchRSSFeed } from '@/lib/rss'
import { slugify } from '@/lib/news.service'

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const { feedId } = body

  await connectDB()

  const query = feedId ? { _id: feedId, isActive: true } : { isActive: true }
  const feeds = await RSSFeed.find(query).lean()
  if (!feeds.length) return NextResponse.json({ ok: false, error: 'Không có feed nào đang hoạt động.' }, { status: 404 })

  let totalNew = 0
  let totalSkipped = 0
  const errors: string[] = []
  const imported: { feedName: string; count: number }[] = []

  for (const feed of feeds) {
    try {
      const items = await fetchRSSFeed(feed.url as string)
      let newCount = 0

      for (const item of items.slice(0, 30)) {
        const exists = await Article.exists({ sourceUrl: item.link })
        if (exists) { totalSkipped++; continue }

        const baseSlug = slugify(item.title)
        const slug = `${baseSlug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`

        await Article.create({
          title:       item.title,
          slug,
          sapo:        item.description,
          content:     item.content || item.description,
          thumbnail:   item.imageUrl || '',
          articleType: 'size_m',
          status:      'published',
          categoryId:  feed.categoryId || null,
          sourceUrl:   item.link,
          source:      feed.name,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          viewCount:   0,
          commentCount: 0,
          showOnHome:  false,
          isFeatured:  false,
          tags: [], topics: [],
        })

        newCount++
        totalNew++
      }

      await RSSFeed.findByIdAndUpdate(feed._id, {
        lastImported: new Date(),
        $inc: { importCount: newCount },
      })

      imported.push({ feedName: feed.name as string, count: newCount })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      errors.push(`${feed.name}: ${msg}`)
    }
  }

  return NextResponse.json({
    ok: true,
    data: { totalNew, totalSkipped, imported, errors },
  })
}
