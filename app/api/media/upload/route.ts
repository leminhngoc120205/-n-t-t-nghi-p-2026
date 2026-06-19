import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { connectDB } from '@/lib/mongodb'
import { Media, MediaType } from '@/models/media'
import { getRequestUser } from '@/lib/api-auth'

const ALLOWED: Record<string, MediaType> = {
  'image/jpeg': 'image', 'image/png': 'image', 'image/gif': 'image', 'image/webp': 'image',
  'video/mp4': 'video', 'video/webm': 'video',
  'audio/mpeg': 'audio', 'audio/mp3': 'audio', 'audio/wav': 'audio', 'audio/ogg': 'audio',
}
const MAX_BYTES = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  const user = getRequestUser(req)
  if (!user) return NextResponse.json({ ok: false, error: 'Chưa đăng nhập.' }, { status: 401 })

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ ok: false, error: 'Không có file.' }, { status: 400 })

    if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: 'File quá lớn (tối đa 50MB).' }, { status: 400 })

    const mediaType = ALLOWED[file.type]
    if (!mediaType) return NextResponse.json({ ok: false, error: 'Định dạng file không được hỗ trợ.' }, { status: 400 })

    const ext  = file.name.split('.').pop() ?? 'bin'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', mediaType)

    await mkdir(uploadDir, { recursive: true })
    await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()))

    const url = `/uploads/${mediaType}/${filename}`

    await connectDB()
    const media = await Media.create({
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      mediaType,
      url,
      uploadedBy: user.userId,
    })

    return NextResponse.json({ ok: true, data: media }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/media/upload]', err)
    return NextResponse.json({ ok: false, error: 'Lỗi máy chủ.' }, { status: 500 })
  }
}
