import { NextRequest, NextResponse } from 'next/server'
import { Types } from 'mongoose'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'
import { getRequestUser } from '@/lib/api-auth'
import { slugify } from '@/lib/news.service'
import { writeLog } from '@/lib/log.service'

export async function GET(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  try {
    await connectDB()

    const p = req.nextUrl.searchParams
    const status     = p.get('status')
    const writerId   = p.get('writerId')
    const editorId   = p.get('editorId')
    const categoryId = p.get('categoryId')
    const search     = p.get('search')
    const page       = Math.max(1, parseInt(p.get('page') ?? '1'))
    const limit      = Math.min(100, Math.max(1, parseInt(p.get('limit') ?? '20')))

    const query: Record<string, unknown> = {}
    if (status)     query.status = status
    if (writerId   && Types.ObjectId.isValid(writerId))   query.writerId   = new Types.ObjectId(writerId)
    if (editorId   && Types.ObjectId.isValid(editorId))   query.editorId   = new Types.ObjectId(editorId)
    if (categoryId && Types.ObjectId.isValid(categoryId)) query.categoryId = categoryId
    if (search)     query.title = { $regex: search, $options: 'i' }
    if (user.role === 'reporter') query.writerId = new Types.ObjectId(user.userId)

    const [items, total] = await Promise.all([
      Article.find(query)
        .populate('writerId',    'username fullName')
        .populate('editorId',    'username fullName')
        .populate('publisherId', 'username fullName')
        .populate('categoryId',  'name slug')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Article.countDocuments(query),
    ])

    return NextResponse.json({ ok: true, data: items, pagination: { total, page, limit, pages: Math.ceil(total / limit) } })
  } catch (err) {
    console.error('[GET /api/articles]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  try {
    const body = await req.json() as Record<string, unknown>
    const { title, sapo, content, thumbnail, articleType, categoryId, authorId, tags, topics, source, sourceUrl, publishedAt,
            videoUrl, streamUrl, scheduledAt, steps, qaItems, ingredients, cookingTime, servings } = body

    if (!title || typeof title !== 'string' || !title.trim()) {
      return NextResponse.json({ ok: false, error: 'Tiêu đề không được để trống.' }, { status: 400 })
    }

    await connectDB()
    const slug = `${slugify(title as string)}-${Date.now()}`

    const article = await Article.create({
      title: (title as string).trim(),
      slug,
      sapo:        sapo        ?? '',
      content:     content     ?? '',
      thumbnail:   thumbnail   ?? '',
      articleType: articleType ?? 'size_m',
      status: 'draft',
      categoryId:  categoryId && Types.ObjectId.isValid(categoryId as string) ? categoryId : null,
      writerId:    new Types.ObjectId(user.userId),
      authorId:    authorId   && Types.ObjectId.isValid(authorId   as string) ? authorId  : null,
      tags:    Array.isArray(tags)   ? (tags   as string[]).filter(t => Types.ObjectId.isValid(t)) : [],
      topics:  Array.isArray(topics) ? (topics as string[]).filter(t => Types.ObjectId.isValid(t)) : [],
      source:      source    ?? '',
      sourceUrl:   sourceUrl ?? '',
      publishedAt: publishedAt ? new Date(publishedAt as string) : null,
      videoUrl:    videoUrl    ?? '',
      streamUrl:   streamUrl   ?? '',
      scheduledAt: scheduledAt ? new Date(scheduledAt as string) : null,
      steps:       Array.isArray(steps)    ? steps    : [],
      qaItems:     Array.isArray(qaItems)  ? qaItems  : [],
      ingredients: ingredients ?? '',
      cookingTime: cookingTime ?? '',
      servings:    servings    ?? '',
    })

    await writeLog({ userId: user.userId, actionType: 'create', objectType: 'article', objectId: article._id.toString(), objectTitle: article.title })

    return NextResponse.json({ ok: true, data: article }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/articles]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}
