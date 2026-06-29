'use client'

import React, { useState, useEffect, useCallback } from 'react'

type Article = {
  _id: string
  title: string
  thumbnail: string
  createdAt: string
  writerId:   { username: string; fullName: string } | null
  editorId:   { username: string; fullName: string } | null
  categoryId: { name: string } | null
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  const dd   = String(d.getDate()).padStart(2, '0')
  const mm   = String(d.getMonth() + 1).padStart(2, '0')
  const yyyy = d.getFullYear()
  const hh   = String(d.getHours()).padStart(2, '0')
  const min  = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm}/${yyyy} - ${hh}:${min}`
}

function ArticleItem({ item }: { item: Article }) {
  const writer = item.writerId?.username || item.writerId?.fullName || '—'
  const editor = item.editorId?.username || null
  const cat    = item.categoryId?.name   || '—'

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50 px-5 transition-colors">
      <button className="flex-shrink-0 text-gray-300 hover:text-[#17a2b8] transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
        </svg>
      </button>

      {item.thumbnail ? (
        <img src={item.thumbnail} alt="" className="w-14 h-10 object-cover rounded flex-shrink-0 bg-gray-100"
          onError={e => { (e.target as HTMLImageElement).src = '' }}/>
      ) : (
        <div className="w-14 h-10 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-[9px] text-gray-400 font-medium">IMG</div>
      )}

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-700 hover:text-[#17a2b8] transition-colors leading-snug line-clamp-1">
          {item.title}
        </p>
        <div className="text-[10px] text-gray-400 mt-0.5">
          Viết bởi: <span className="text-gray-500">{writer}</span>
          {editor && <span>, Biên tập bởi: <span className="text-gray-500">{editor}</span></span>}
        </div>
      </div>

      <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">{fmtDate(item.createdAt)}</span>

      <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-medium text-[#17a2b8] border border-[#17a2b8] whitespace-nowrap">
        {cat}
      </span>
    </div>
  )
}

function PendingSection({
  title, status, emptyText,
}: { title: string; status: string; emptyText: string }) {
  const [items,    setItems]    = useState<Article[]>([])
  const [loading,  setLoading]  = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    fetch(`/api/articles?status=${status}&limit=10`)
      .then(r => r.json())
      .then(d => { if (d.ok) setItems(d.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [status])

  useEffect(() => { load() }, [load])

  return (
    <div className="bg-white border border-gray-200 rounded">
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-gray-700 tracking-wide uppercase">{title}</h2>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#17a2b8] text-white text-[10px] font-bold">
            {loading ? '…' : items.length}
          </span>
        </div>
        <button onClick={load} className="text-[10px] text-gray-400 hover:text-[#17a2b8] transition-colors">↻ Làm mới</button>
      </div>

      {loading ? (
        <div className="px-5 py-4 text-xs text-gray-400">Đang tải...</div>
      ) : items.length === 0 ? (
        <div className="px-5 py-4 text-xs text-gray-400">{emptyText}</div>
      ) : (
        items.map(item => <ArticleItem key={item._id} item={item}/>)
      )}
    </div>
  )
}

export const IMSPendingArticles = () => (
  <div className="space-y-4 mb-5">
    <PendingSection
      title="Bài chờ xuất bản"
      status="waiting_publish"
      emptyText="Không có bài nào chờ xuất bản."
    />
    <PendingSection
      title="Bài chờ biên tập"
      status="waiting_edit"
      emptyText="Không có bài nào chờ biên tập."
    />
  </div>
)
