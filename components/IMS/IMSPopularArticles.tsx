'use client'

import React, { useState, useEffect, useCallback } from 'react'

type Article = {
  _id?: string
  title: string
  slug?: string
  sourceUrl?: string
  publishedAt?: string
  viewCount: number
  ctr: number
  bounce: number
  source: number
}

type Device = 'Desktop' | 'Mobile' | 'Tablet'

type DeviceProfile = { viewRatio: number; ctrMul: number; bounceMul: number; sourceMul: number; indices: number[] }

const DEVICE_PROFILE: Record<Device, DeviceProfile> = {
  // Desktop: đọc bài chuyên sâu — kinh tế, công nghệ, chính sách
  Desktop: { viewRatio: 0.55, ctrMul: 1.50, bounceMul: 0.97, sourceMul: 1.10, indices: [0, 1, 2, 3, 6]  },
  // Mobile: đọc bài viral, ngắn, nóng — thời tiết, giá cả, đời sống
  Mobile:  { viewRatio: 0.35, ctrMul: 0.65, bounceMul: 1.02, sourceMul: 0.80, indices: [4, 5, 7, 8, 10] },
  // Tablet: mix giữa hai loại trên
  Tablet:  { viewRatio: 0.10, ctrMul: 1.00, bounceMul: 1.00, sourceMul: 0.95, indices: [1, 3, 6, 9, 11] },
}

const ARTICLE_POOL: Article[] = [
  { title: 'Apple Intelligence chính thức hỗ trợ tiếng Việt từ iOS 19, người dùng trong nước phấn khích',              publishedAt: '2026-06-01T22:10:00Z', viewCount: 1540, ctr: 11.30, bounce: 93.20, source: 95 }, // 0
  { title: 'Bộ Giáo dục công bố điểm sàn xét tuyển đại học 2026, nhiều ngành hot tăng mạnh',                          publishedAt: '2026-05-31T06:45:00Z', viewCount: 1203, ctr: 9.77,  bounce: 94.15, source: 92 }, // 1
  { title: 'VinFast ra mắt mẫu xe điện giá 400 triệu, cạnh tranh trực tiếp với BYD Atto 3 tại thị trường Việt',       publishedAt: '2026-05-30T11:00:00Z', viewCount:  890, ctr: 7.45,  bounce: 95.60, source: 90 }, // 2
  { title: 'Ngân hàng Nhà nước hạ lãi suất điều hành lần thứ ba trong năm, tín dụng bất động sản hưởng lợi',          publishedAt: '2026-05-29T14:05:00Z', viewCount:  461, ctr: 2.34,  bounce: 98.71, source: 55 }, // 3
  { title: 'Hà Nội trải qua đợt nắng nóng kỷ lục 42°C, chuyên gia cảnh báo nguy cơ đột quỵ nhiệt',                   publishedAt: '2026-05-29T08:15:00Z', viewCount:  712, ctr: 6.21,  bounce: 96.44, source: 78 }, // 4
  { title: 'Việt Nam lọt top 5 điểm đến du lịch hè được tìm kiếm nhiều nhất Đông Nam Á năm 2026',                     publishedAt: '2026-05-29T09:30:00Z', viewCount:  680, ctr: 5.88,  bounce: 97.02, source: 72 }, // 5
  { title: 'Chứng khoán Việt Nam lập đỉnh lịch sử, VN-Index vượt mốc 1.500 điểm trong phiên sáng',                   publishedAt: '2026-05-31T10:50:00Z', viewCount:  398, ctr: 1.95,  bounce: 99.10, source: 48 }, // 6
  { title: 'TP.HCM thí điểm thu phí ô tô vào trung tâm từ tháng 8, mức phí từ 40.000 đến 100.000 đồng/lượt',         publishedAt: '2026-05-30T16:20:00Z', viewCount:  774, ctr: 4.12,  bounce: 97.88, source: 68 }, // 7
  { title: 'Báo cáo: 68% người Việt dưới 35 tuổi chi hơn 3 triệu đồng/tháng cho đồ ăn ngoài',                        publishedAt: '2026-06-01T08:00:00Z', viewCount:  641, ctr: 5.10,  bounce: 96.90, source: 74 }, // 8
  { title: "Hồ sơ chấn động: Dòng tiền BYD đã kiệt quệ, nợ 'khủng' 45 tỷ USD, từng chiếm dụng vốn nhà cung ứng",    publishedAt: '2026-05-28T07:59:00Z', viewCount:  522, ctr: 3.17,  bounce: 98.08, source: 65 }, // 9
  { title: 'Cục Hàng không cảnh báo tình trạng vé máy bay hè bị "thổi giá", đề nghị các hãng kiểm soát',             publishedAt: '2026-05-31T15:33:00Z', viewCount:  567, ctr: 3.66,  bounce: 98.22, source: 63 }, // 10
  { title: 'Tôi không biết Apple 20 năm nữa ra sao, nhưng Samsung thì tôi biết',                                       publishedAt: '2026-05-28T13:42:00Z', viewCount:  539, ctr: 3.09,  bounce: 99.26, source: 70 }, // 11
]

function applyDevice(pool: Article[], device: Device, isMock: boolean): Article[] {
  const p = DEVICE_PROFILE[device]
  // Mock: lấy đúng bài theo indices để mỗi thiết bị hiển thị bài khác nhau
  // Real: dùng thẳng data từ API, chỉ điều chỉnh stats theo thiết bị
  const base = isMock
    ? p.indices.filter(i => i < pool.length).map(i => pool[i])
    : pool.slice(0, 5)
  return base.map(a => ({
    ...a,
    viewCount: Math.round(a.viewCount * p.viewRatio),
    ctr:    +Math.min(99,  Math.max(0.1, a.ctr    * p.ctrMul   )).toFixed(2),
    bounce: +Math.min(100, Math.max(50,  a.bounce  * p.bounceMul)).toFixed(2),
    source: Math.min(100, Math.max(5, Math.round(a.source * p.sourceMul))),
  }))
}

const REFRESH_INTERVAL = 30_000

function fmtDate(iso?: string) {
  if (!iso) return { time: '--:--', day: '--/--/----' }
  const d = new Date(iso)
  return {
    time: d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    day:  d.toLocaleDateString('vi-VN'),
  }
}

export const IMSPopularArticles = () => {
  const [device, setDevice] = useState<Device>('Desktop')
  const [pool, setPool] = useState<Article[]>(ARTICLE_POOL)
  const [isMock, setIsMock] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const articles = applyDevice(pool, device, isMock)

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/articles/popular')
      const data = await res.json()
      if (data.ok && data.data?.length > 0) {
        setPool(data.data.map((a: any) => {
          const seed = parseInt((a._id as string)?.slice(-4) ?? '0', 16)
          return {
            _id:         a._id,
            title:       a.title,
            slug:        a.slug ?? '',
            sourceUrl:   a.sourceUrl ?? '',
            publishedAt: a.publishedAt,
            viewCount:   a.viewCount ?? 0,
            ctr:    +((seed % 1000) / 100 + 1).toFixed(2),
            bounce: +((seed % 600)  / 100 + 92).toFixed(2),
            source: (seed % 40) + 55,
          }
        }))
        setIsMock(false)
      }
    } catch {
      // giữ mock fallback
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { load() }, [load])
  useEffect(() => {
    const interval = setInterval(load, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [load])

  return (
    <>
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
            <span className="text-[10px] text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">demo</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={load}
            disabled={refreshing}
            title="Làm mới"
            className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-[#17a2b8] hover:bg-[#e8f7f9] transition-colors disabled:opacity-40"
          >
            <svg className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#17a2b8]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Device tabs */}
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-[11px] font-medium">
            {(['Desktop', 'Mobile', 'Tablet'] as Device[]).map(d => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`px-3 py-1.5 transition-colors ${
                  device === d
                    ? 'bg-[#17a2b8] text-white'
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className={`transition-opacity duration-200 ${refreshing ? 'opacity-50' : 'opacity-100'}`}>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-5 py-2.5 text-gray-500 font-medium">Tiêu đề</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Ngày xuất bản</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">Tổng view</th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">
                CTR <span className="ml-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 cursor-help">?</span>
              </th>
              <th className="text-center px-3 py-2.5 text-gray-500 font-medium whitespace-nowrap">
                Rời trang <span className="ml-0.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full border border-gray-300 text-[9px] text-gray-400 cursor-help">?</span>
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
                    {(article.sourceUrl || article.slug) ? (
                      <a
                        href={article.sourceUrl || `/bai-viet/${article.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#17a2b8] transition-colors line-clamp-2 cursor-pointer"
                      >
                        {article.title}
                      </a>
                    ) : (
                      <span className="line-clamp-2">{article.title}</span>
                    )}
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
                        <div className="h-full bg-orange-400 rounded transition-all duration-500" style={{ width: `${article.source}%` }} />
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

  </>
  )
}
