'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { ArticlePreviewDrawer } from './ArticlePreviewDrawer'

const KEYWORD_POOL = [
  { count: '100000+', keyword: 'thời tiết ngày mai' },
  { count: '50000+',  keyword: 'kết quả xổ số hôm nay' },
  { count: '20000+',  keyword: 'tin tức mới nhất' },
  { count: '10000+',  keyword: 'vinfast vf3 2026' },
  { count: '5000+',   keyword: 'roland garros 2026' },
  { count: '5000+',   keyword: 'come my way' },
  { count: '3000+',   keyword: 'bảo hiểm xã hội 2026' },
  { count: '2000+',   keyword: 'giá vàng hôm nay' },
  { count: '2000+',   keyword: 'tỷ giá usd hôm nay' },
  { count: '1000+',   keyword: 'hương giang' },
  { count: '1000+',   keyword: 'mr nhân' },
  { count: '1000+',   keyword: 'cảnh sát quốc gia campuchia' },
  { count: '500+',    keyword: 'carlos alcaraz' },
  { count: '500+',    keyword: 'sinner tennis' },
  { count: '500+',    keyword: 'bão số 3 2026' },
  { count: '300+',    keyword: 'enzo fernandez' },
  { count: '200+',    keyword: 'apple intelligence' },
  { count: '200+',    keyword: 'oreshnik tên lửa' },
  { count: '100+',    keyword: 'lịch nghỉ lễ 2026' },
  { count: '100+',    keyword: 'điểm chuẩn đại học 2026' },
]

function pickKeywords(pool: typeof KEYWORD_POOL) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const ten = shuffled.slice(0, 10)
  return ten.slice(0, 5).map((k, i) => ({ ...k, right: ten[5 + i] }))
}

const REFRESH_INTERVAL = 30_000

type HotArticle = { _id?: string; title: string; publishedAt?: string; viewCount: number }

const MOCK_NEWS: HotArticle[] = [
  { title: 'Dự báo thời tiết ngày 24/5/2026: Nắng nóng gay gắt miền Bắc, mưa rào bắt chợt miền Nam', publishedAt: '2026-05-24T06:00:00Z', viewCount: 4821 },
  { title: 'Hoạt động giỗ tổ và tết khuyến học năm Bình Ngọ 2026', publishedAt: '2026-05-22T10:29:00Z', viewCount: 3105 },
  { title: 'TP.HCM ra mắt tuyến xe buýt điện đầu tiên kết nối sân bay Tân Sơn Nhất', publishedAt: '2026-05-23T08:15:00Z', viewCount: 2890 },
]

function fmtDate(iso?: string) {
  if (!iso) return '--/--/---- - --:--'
  const d = new Date(iso)
  const day  = d.toLocaleDateString('vi-VN')
  const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  return `${day} - ${time}`
}

function ReloadBtn({ onClick, spinning }: { onClick: () => void; spinning: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={spinning}
      title="Làm mới"
      className="flex items-center justify-center w-6 h-6 rounded text-gray-400 hover:text-[#17a2b8] hover:bg-[#e8f7f9] transition-colors disabled:opacity-40"
    >
      <svg className={`w-3.5 h-3.5 ${spinning ? 'animate-spin text-[#17a2b8]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    </button>
  )
}

function LiveBadge() {
  return (
    <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
      LIVE
    </span>
  )
}

export const IMSHotSection = () => {
  const [news, setNews]         = useState<HotArticle[]>(MOCK_NEWS)
  const [keywords, setKeywords] = useState(() => pickKeywords(KEYWORD_POOL))
  const [loadingNews, setLoadingNews] = useState(false)
  const [loadingKw, setLoadingKw]     = useState(false)
  const [previewId, setPreviewId]     = useState<string | null>(null)

  const loadNews = useCallback(async () => {
    setLoadingNews(true)
    try {
      const res  = await fetch('/api/articles/recent')
      const data = await res.json()
      if (data.ok && data.data?.length > 0) setNews(data.data)
    } catch { /* giữ mock */ }
    finally { setLoadingNews(false) }
  }, [])

  const rotateKeywords = useCallback(() => {
    setLoadingKw(true)
    setTimeout(() => { setKeywords(pickKeywords(KEYWORD_POOL)); setLoadingKw(false) }, 300)
  }, [])

  useEffect(() => { loadNews() }, [loadNews])

  useEffect(() => {
    const i1 = setInterval(loadNews,        REFRESH_INTERVAL)
    const i2 = setInterval(rotateKeywords,  REFRESH_INTERVAL)
    return () => { clearInterval(i1); clearInterval(i2) }
  }, [loadNews, rotateKeywords])

  return (
    <>
    <div className="grid grid-cols-2 gap-4 mb-5">

      {/* ── Tin hot ── */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase">Tin hot trong 7 ngày</h2>
            <LiveBadge />
          </div>
          <ReloadBtn onClick={loadNews} spinning={loadingNews} />
        </div>

        <div className={`space-y-4 transition-opacity duration-200 ${loadingNews ? 'opacity-50' : 'opacity-100'}`}>
          {news.map((item, i) => (
            <div
              key={item._id ?? i}
              onClick={() => item._id && setPreviewId(item._id)}
              className={`flex gap-3 pb-4 border-b border-gray-50 last:border-none last:pb-0 rounded-lg transition-colors ${item._id ? 'cursor-pointer hover:bg-gray-50 px-2 -mx-2' : ''}`}
            >
              <div className="w-16 h-12 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">
                IMG
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 font-medium leading-snug hover:text-[#17a2b8] transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-gray-400">{fmtDate(item.publishedAt)}</span>
                  <span className="text-[10px] text-gray-400">Lượt xem: {item.viewCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Từ khóa hot ── */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase">Từ khóa hot trên Google</h2>
            <LiveBadge />
          </div>
          <ReloadBtn onClick={rotateKeywords} spinning={loadingKw} />
        </div>

        <div className={`space-y-2 transition-opacity duration-200 ${loadingKw ? 'opacity-50' : 'opacity-100'}`}>
          {keywords.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                  {row.count}
                </span>
                <span className="text-xs text-gray-600 truncate">{row.keyword}</span>
              </div>
              {row.right && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                    {row.right.count}
                  </span>
                  <span className="text-xs text-gray-600 truncate">{row.right.keyword}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>

    {previewId && (
      <ArticlePreviewDrawer articleId={previewId} onClose={() => setPreviewId(null)} />
    )}
    </>
  )
}
