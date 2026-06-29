'use client'

import React, { useState, useEffect, useCallback } from 'react'

const REFRESH_INTERVAL = 30_000

type HotArticle = {
  _id?: string
  title: string
  slug?: string
  sourceUrl?: string
  publishedAt?: string
  viewCount: number
  thumbnail?: string
}

type TrendKeyword = { keyword: string; traffic: string }

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

/* ── traffic string → short display ── */
function fmtTraffic(raw: string): string {
  if (!raw) return ''
  // "200K+" → "200K+", "1M+" → "1M+", "500+" → "500+"
  return raw.replace(/,/g, '').trim()
}

export const IMSHotSection = () => {
  const [news, setNews]               = useState<HotArticle[]>([])
  const [keywords, setKeywords]       = useState<{ left: TrendKeyword; right?: TrendKeyword }[]>([])
  const [loadingNews, setLoadingNews] = useState(false)
  const [loadingKw, setLoadingKw]     = useState(false)
  const [kwError, setKwError]         = useState(false)

  /* ── fetch hot articles ── */
  const loadNews = useCallback(async () => {
    setLoadingNews(true)
    try {
      const res  = await fetch('/api/articles/recent')
      const data = await res.json()
      if (data.ok && data.data?.length > 0) setNews(data.data)
    } catch { /* giữ state cũ */ }
    finally { setLoadingNews(false) }
  }, [])

  /* ── fetch Google Trends ── */
  const loadKeywords = useCallback(async () => {
    setLoadingKw(true)
    setKwError(false)
    try {
      const res  = await fetch('/api/trending')
      const data = await res.json()
      if (data.ok && data.data?.length > 0) {
        const flat: TrendKeyword[] = data.data
        const paired: { left: TrendKeyword; right?: TrendKeyword }[] = []
        for (let i = 0; i < Math.min(flat.length, 20); i += 2) {
          paired.push({ left: flat[i], right: flat[i + 1] })
        }
        setKeywords(paired.slice(0, 10))
      } else {
        setKwError(true)
      }
    } catch {
      setKwError(true)
    } finally {
      setLoadingKw(false)
    }
  }, [])

  useEffect(() => {
    loadNews()
    loadKeywords()
  }, [loadNews, loadKeywords])

  useEffect(() => {
    const i1 = setInterval(loadNews,     REFRESH_INTERVAL)
    const i2 = setInterval(loadKeywords, REFRESH_INTERVAL * 2)  // keywords mỗi 60s
    return () => { clearInterval(i1); clearInterval(i2) }
  }, [loadNews, loadKeywords])

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
          {news.length === 0 && !loadingNews && (
            <p className="text-xs text-gray-400 text-center py-4">Chưa có tin nào.</p>
          )}
          {news.map((item, i) => (
            <a
              key={item._id ?? i}
              href={item.sourceUrl || (item.slug ? `/bai-viet/${item.slug}` : undefined)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex gap-3 pb-4 border-b border-gray-50 last:border-none last:pb-0 rounded-lg transition-colors ${
                (item.sourceUrl || item.slug) ? 'cursor-pointer hover:bg-gray-50 px-2 -mx-2' : 'pointer-events-none'
              }`}
            >
              {item.thumbnail ? (
                <img src={item.thumbnail} alt="" className="w-16 h-12 flex-shrink-0 rounded object-cover bg-gray-100" />
              ) : (
                <div className="w-16 h-12 flex-shrink-0 rounded bg-gray-100 flex items-center justify-center text-[10px] text-gray-400 font-medium">IMG</div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700 font-medium leading-snug transition-colors line-clamp-2">
                  {item.title}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-gray-400">{fmtDate(item.publishedAt)}</span>
                  <span className="text-[10px] text-gray-400">Lượt xem: {item.viewCount.toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* ── Từ khóa hot trên Google ── */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase">Từ khóa hot trên Google</h2>
            {!kwError && <LiveBadge />}
            {kwError && (
              <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">offline</span>
            )}
          </div>
          <ReloadBtn onClick={loadKeywords} spinning={loadingKw} />
        </div>

        <div className={`space-y-2 transition-opacity duration-200 ${loadingKw ? 'opacity-50' : 'opacity-100'}`}>
          {kwError && (
            <p className="text-xs text-gray-400 text-center py-4">
              Không thể kết nối Google Trends.
            </p>
          )}
          {keywords.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {row.left.traffic && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                    {fmtTraffic(row.left.traffic)}
                  </span>
                )}
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(row.left.keyword)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="text-xs text-gray-600 truncate hover:text-[#17a2b8] transition-colors"
                  title={row.left.keyword}
                >
                  {row.left.keyword}
                </a>
              </div>
              {row.right && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {row.right.traffic && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                      {fmtTraffic(row.right.traffic)}
                    </span>
                  )}
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(row.right.keyword)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-xs text-gray-600 truncate hover:text-[#17a2b8] transition-colors"
                    title={row.right.keyword}
                  >
                    {row.right.keyword}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
    </>
  )
}
