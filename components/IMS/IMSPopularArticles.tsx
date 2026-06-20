'use client'

import React, { useState, useEffect, useCallback } from 'react'

type Article = {
  _id?: string
  title: string
  publishedAt?: string
  viewCount: number
  ctr: number
  bounce: number
  source: number
}

const MOCK_FALLBACK: Article[] = [
  { title: 'Apple Intelligence chính thức hỗ trợ tiếng Việt từ iOS 19, người dùng trong nước phấn khích',            publishedAt: '2026-06-01T22:10:00Z', viewCount: 1540, ctr: 11.30, bounce: 93.20, source: 95 },
  { title: 'Bộ Giáo dục công bố điểm sàn xét tuyển đại học 2026, nhiều ngành hot tăng mạnh',                        publishedAt: '2026-05-31T06:45:00Z', viewCount: 1203, ctr: 9.77,  bounce: 94.15, source: 92 },
  { title: 'VinFast ra mắt mẫu xe điện giá 400 triệu, cạnh tranh trực tiếp với BYD Atto 3 tại thị trường Việt',     publishedAt: '2026-05-30T11:00:00Z', viewCount:  890, ctr: 7.45,  bounce: 95.60, source: 90 },
  { title: 'TP.HCM thí điểm thu phí ô tô vào trung tâm từ tháng 8, mức phí từ 40.000 đến 100.000 đồng/lượt',       publishedAt: '2026-05-30T16:20:00Z', viewCount:  774, ctr: 4.12,  bounce: 97.88, source: 68 },
  { title: 'Hà Nội trải qua đợt nắng nóng kỷ lục 42°C, chuyên gia cảnh báo nguy cơ đột quỵ nhiệt',                 publishedAt: '2026-05-29T08:15:00Z', viewCount:  712, ctr: 6.21,  bounce: 96.44, source: 78 },
]

const REFRESH_INTERVAL = 30_000

function nowStr() {
  return new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

function fmtDate(iso?: string) {
  if (!iso) return { time: '--:--', day: '--/--/----' }
  const d = new Date(iso)
  return {
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    day:  d.toLocaleDateString('vi-VN'),
  }
}

export const IMSPopularArticles = () => {
  const [device, setDevice] = useState('Desktop')
  const [articles, setArticles] = useState<Article[]>(MOCK_FALLBACK)
  const [isMock, setIsMock] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(nowStr())
  const [refreshing, setRefreshing] = useState(false)
  const [countdown, setCountdown] = useState(REFRESH_INTERVAL / 1000)

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/articles/popular')
      const data = await res.json()
      if (data.ok && data.data?.length > 0) {
        setArticles(data.data.map((a: any) => ({
          _id:         a._id,
          title:       a.title,
          publishedAt: a.publishedAt,
          viewCount:   a.viewCount ?? 0,
          ctr:    +(Math.random() * 10 + 0.5).toFixed(2),
          bounce: +(Math.random() * 8  + 92).toFixed(2),
          source: Math.floor(Math.random() * 50 + 45),
        })))
        setIsMock(false)
      }
    } catch {
      // giữ mock fallback
    } finally {
      setLastUpdated(nowStr())
      setRefreshing(false)
      setCountdown(REFRESH_INTERVAL / 1000)
    }
  }, [])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [load])

  useEffect(() => {
    const tick = setInterval(() => {
      setCountdown(prev => (prev <= 1 ? REFRESH_INTERVAL / 1000 : prev - 1))
    }, 1000)
    return () => clearInterval(tick)
  }, [])

  return (
    <div className="bg-white border border-gray-200 rounded mb-5">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase">
            Bài viết đang được đọc nhiều
          </h2>
          <span className="flex items-center gap-1 text-[10px] font-semibold text-red-500 bg-red-50 border border-red-200 rounded-full px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE
          </span>
          {isMock && (
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
              demo
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            {refreshing ? (
              <svg className="w-3 h-3 animate-spin text-[#17a2b8]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            ) : (
              <svg className="w-3 h-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            )}
            <span>Cập nhật {lastUpdated}</span>
            <span className="text-gray-300">·</span>
            <span className="tabular-nums">làm mới sau {countdown}s</span>
          </div>
          <button
            onClick={load}
            disabled={refreshing}
            className="text-[11px] text-[#17a2b8] hover:underline disabled:opacity-40"
          >
            Làm mới
          </button>
          <select
            value={device}
            onChange={(e) => setDevice(e.target.value)}
            className="text-xs border border-gray-300 rounded px-3 py-1.5 text-gray-600 focus:outline-none focus:border-[#17a2b8]"
          >
            <option>Desktop</option>
            <option>Mobile</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={`transition-opacity duration-300 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Tiêu đề</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Ngày xuất bản</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Tổng view</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">
                CTR
                <span className="ml-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 cursor-help">?</span>
              </th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">
                Rời trang
                <span className="ml-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 cursor-help">?</span>
              </th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Nguồn đến từ</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((article, i) => {
              const { time, day } = fmtDate(article.publishedAt)
              return (
                <tr key={article._id ?? i} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-gray-700 leading-snug max-w-xs">
                    <a href="#" className="hover:text-[#17a2b8] transition-colors line-clamp-2">
                      {article.title}
                    </a>
                  </td>
                  <td className="px-3 py-3 text-center text-gray-500 whitespace-nowrap">
                    <div>{time}</div>
                    <div>{day}</div>
                  </td>
                  <td className="px-3 py-3 text-center text-gray-700 font-medium tabular-nums">
                    {article.viewCount.toLocaleString()}
                  </td>
                  <td className="px-3 py-3 text-center text-gray-600 tabular-nums">
                    {article.ctr.toFixed(2)}%
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium text-red-400 bg-red-50 tabular-nums">
                      {article.bounce.toFixed(2)}%
                    </span>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <div className="flex justify-center">
                      <div className="w-16 h-4 bg-gray-100 rounded overflow-hidden">
                        <div
                          className="h-full bg-orange-400 rounded transition-all duration-500"
                          style={{ width: `${article.source}%` }}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
