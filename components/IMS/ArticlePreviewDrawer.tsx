'use client'

import React, { useEffect, useState } from 'react'

type ArticleFull = {
  _id: string
  title: string
  sapo?: string
  content?: string
  source?: string
  status: string
  articleType?: string
  viewCount?: number
  createdAt?: string
  publishedAt?: string
  writerId?: { username: string }
  editorId?: { username: string }
  publisherId?: { username: string }
  categoryId?: { name: string }
}

const STATUS_LABEL: Record<string, { label: string; cls: string }> = {
  published: { label: 'Đã xuất bản', cls: 'bg-green-100 text-green-700' },
  draft:     { label: 'Bản nháp',    cls: 'bg-gray-100  text-gray-600'  },
  pending:   { label: 'Chờ duyệt',   cls: 'bg-yellow-100 text-yellow-700'},
  approved:  { label: 'Đã duyệt',    cls: 'bg-blue-100  text-blue-700'  },
  rejected:  { label: 'Bị từ chối',  cls: 'bg-red-100   text-red-600'   },
}

export function ArticlePreviewDrawer({ articleId, onClose }: { articleId: string; onClose: () => void }) {
  const [article, setArticle] = useState<ArticleFull | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/articles/${articleId}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setArticle(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [articleId])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const a = article
  const status = a ? (STATUS_LABEL[a.status] ?? { label: a.status, cls: 'bg-gray-100 text-gray-600' }) : null

  return (
    <div className="fixed inset-0 z-[200] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-[860px] bg-white flex flex-col shadow-2xl overflow-hidden animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
            <h2 className="text-sm font-bold text-gray-800 truncate">
              {loading ? 'Đang tải...' : (a?.title ?? 'Không tìm thấy bài viết')}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <svg className="w-8 h-8 animate-spin text-[#17a2b8]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
            </svg>
          </div>
        ) : !a ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Không tìm thấy nội dung.</div>
        ) : (
          <div className="flex flex-1 overflow-hidden min-h-0">

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-8 py-6">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {a.categoryId?.name && (
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded uppercase tracking-wide">
                    {a.categoryId.name}
                  </span>
                )}
                {status && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${status.cls}`}>{status.label}</span>
                )}
                {a.articleType && <span className="text-xs text-gray-400">{a.articleType}</span>}
              </div>

              <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4" style={{ fontFamily: 'var(--font-serif), Lora, serif' }}>
                {a.title}
              </h1>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 flex-wrap text-xs">
                {a.writerId?.username    && <span>✍️ Viết bởi <strong>{a.writerId.username}</strong></span>}
                {a.editorId?.username    && <span>✏️ Biên tập bởi <strong>{a.editorId.username}</strong></span>}
                {a.publisherId?.username && <span>📢 Xuất bản bởi <strong>{a.publisherId.username}</strong></span>}
                {a.publishedAt && (
                  <span className="ml-auto text-gray-400">
                    {new Date(a.publishedAt).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
                  </span>
                )}
              </div>

              {a.sapo && (
                <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-5 p-3 bg-gray-50 border-l-4 border-[#17a2b8] rounded-r">
                  {a.sapo}
                </p>
              )}

              <div className="text-sm text-gray-700 leading-relaxed space-y-3">
                {(a.content || '').split('\n').map((p, i) => p.trim() && <p key={i}>{p}</p>)}
              </div>

              {a.source && (
                <p className="mt-6 text-xs text-gray-400 italic border-t border-gray-100 pt-4">Nguồn: {a.source}</p>
              )}
            </div>

            {/* Right sidebar */}
            <div className="w-56 flex-shrink-0 border-l border-gray-100 bg-gray-50 px-4 py-5 overflow-y-auto">
              <p className="text-[10px] font-bold text-[#17a2b8] uppercase tracking-widest mb-3">Thông tin</p>
              <dl className="space-y-3 text-xs">
                {[
                  ['Dạng bài',   a.articleType],
                  ['Tác giả',    a.writerId?.username],
                  ['Biên tập',   a.editorId?.username],
                  ['Xuất bản',   a.publisherId?.username],
                  ['Ngày tạo',   a.createdAt ? new Date(a.createdAt).toLocaleString('vi-VN', {day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'}) : null],
                  ['Nguồn tin',  a.source],
                  ['Lượt xem',   a.viewCount?.toLocaleString()],
                ].map(([label, value]) => value ? (
                  <div key={label as string}>
                    <dt className="text-gray-400 mb-0.5">{label}</dt>
                    <dd className="font-medium text-gray-700 text-right">{value}</dd>
                  </div>
                ) : null)}
              </dl>
            </div>

          </div>
        )}

        {/* Footer */}
        {a && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100 bg-gray-50 flex-shrink-0">
            <div className="flex items-center gap-3">
              {status && <span className={`text-xs font-semibold px-2 py-0.5 rounded ${status.cls}`}>{status.label}</span>}
              {a.viewCount != null && <span className="text-xs text-gray-500">{a.viewCount.toLocaleString()} lượt xem</span>}
            </div>
            <button onClick={onClose} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Đóng</button>
          </div>
        )}
      </div>
    </div>
  )
}
