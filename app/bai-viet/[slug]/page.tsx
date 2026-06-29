import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { connectDB } from '@/lib/mongodb'
import { Article } from '@/models/article'

type Props = { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await connectDB()
  const a = await Article.findOne({ slug: params.slug, status: 'published' })
    .select('title sapo thumbnail')
    .lean()
  if (!a) return { title: 'Không tìm thấy bài viết | IMS' }
  return {
    title: `${a.title} | IMS`,
    description: a.sapo || undefined,
    openGraph: {
      title: a.title,
      description: a.sapo || undefined,
      images: a.thumbnail ? [{ url: a.thumbnail }] : [],
    },
  }
}

export default async function BaiVietPage({ params }: Props) {
  await connectDB()
  const raw = await Article.findOneAndUpdate(
    { slug: params.slug, status: 'published' },
    { $inc: { viewCount: 1 } },
    { new: true }
  )
    .populate('writerId',  'fullName username')
    .populate('categoryId', 'name slug')
    .lean()

  if (!raw) return notFound()
  const a = raw as any

  const publishedDate = a.publishedAt
    ? new Date(a.publishedAt).toLocaleString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : ''
  const authorName: string = a.writerId?.fullName || a.writerId?.username || 'Tòa soạn'

  return (
    <div className="min-h-screen" style={{ background: '#fff' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 flex items-center gap-3 px-6 py-3 shadow-sm" style={{ background: '#1e2535' }}>
        <a href="/dashboard" className="flex items-center gap-2">
          <svg viewBox="0 0 36 36" className="w-7 h-7 flex-shrink-0" fill="none">
            <path d="M3 28L9 12L14 22L18 14L23 22L28 12L33 28" stroke="#17c3d8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className="font-bold text-sm tracking-wide" style={{ color: '#17c3d8' }}>IMS</span>
        </a>
        <span className="text-gray-400 text-xs">Cổng thông tin điện tử</span>
        {a.categoryId?.name && (
          <>
            <span className="text-gray-600 mx-1">›</span>
            <span className="text-gray-300 text-xs truncate max-w-[200px]">{a.categoryId.name}</span>
          </>
        )}
      </header>

      {/* ── Article body ── */}
      <article className="max-w-3xl mx-auto px-4 py-10">

        {/* Category badge */}
        {a.categoryId?.name && (
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#17a2b8' }}>
            {a.categoryId.name}
          </p>
        )}

        {/* Title */}
        <h1 className="text-[2rem] font-bold leading-tight text-gray-900 mb-4">
          {a.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-500 mb-6 pb-4 border-b border-gray-100">
          <span>✍️ {authorName}</span>
          {publishedDate && <span>📅 {publishedDate}</span>}
          <span className="ml-auto flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {((a.viewCount ?? 0) as number).toLocaleString('vi-VN')} lượt xem
          </span>
        </div>

        {/* Thumbnail */}
        {a.thumbnail && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
            <img src={a.thumbnail as string} alt={a.title as string} className="w-full object-cover max-h-[440px]" />
          </div>
        )}

        {/* Sapo */}
        {a.sapo && (
          <p className="text-base font-semibold text-gray-700 leading-relaxed mb-6 pl-4 py-3 pr-4 rounded-r-lg border-l-4"
            style={{ borderColor: '#17a2b8', background: '#f4fbfc' }}>
            {a.sapo as string}
          </p>
        )}

        {/* Content — HTML from editor */}
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: (a.content ?? '') as string }}
        />

        {/* Source */}
        {(a.source || a.sourceUrl) && (
          <div className="mt-10 border-t border-gray-100 pt-4 flex items-center justify-between flex-wrap gap-3">
            {a.source && (
              <p className="text-xs text-gray-400 italic">Nguồn: {a.source as string}</p>
            )}
            {a.sourceUrl && (
              <a
                href={a.sourceUrl as string}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors"
                style={{ background: '#f0fbfc', color: '#17a2b8', border: '1px solid #b2e8ef' }}
              >
                Đọc bài gốc
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            )}
          </div>
        )}
      </article>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 mt-16 py-8 text-center text-xs text-gray-400" style={{ background: '#f9fafb' }}>
        © 2026 <strong className="text-gray-600">IMS</strong> — Cổng thông tin điện tử. Bảo lưu mọi quyền.
      </footer>

    </div>
  )
}
