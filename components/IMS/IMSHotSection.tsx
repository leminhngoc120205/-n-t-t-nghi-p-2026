'use client'

import React from 'react'

const hotNews = [
  {
    image: 'https://via.placeholder.com/60x45/87ceeb/ffffff?text=news',
    title: 'Dự báo thời tiết ngày 24/5/2026: Nắng nóng gay gắt miền Bắc, mưa rào bắt chợt miền Nam',
    date: '24/05/2026 - 06:00',
    views: 0,
  },
  {
    image: 'https://via.placeholder.com/60x45/d4a5a5/ffffff?text=news',
    title: 'Hoạt động giỗ tổ và tết khuyến học năm Bình Ngọ 2026',
    date: '22/05/2026 - 10:29',
    views: 0,
  },
]

const hotKeywords = [
  { count: '100000+', keyword: 'thời tiết ngày mai', countRight: '5000+', keywordRight: 'come my way' },
  { count: '1000+', keyword: 'roland garros 2026', countRight: '1000+', keywordRight: 'mr nhân' },
  { count: '500+', keyword: 'bảo hiểm xã hội', countRight: '500+', keywordRight: 'sinner' },
  { count: '200+', keyword: 'hương giang', countRight: '200+', keywordRight: 'enzo fernandez' },
  { count: '200+', keyword: 'cảnh sát quốc gia campuchia', countRight: '100+', keywordRight: 'oreshnik' },
]

export const IMSHotSection = () => {
  return (
    <div className="grid grid-cols-2 gap-4 mb-5">
      {/* Hot News */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase mb-4">
          Tin hot trong 7 ngày
        </h2>
        <div className="space-y-4">
          {hotNews.map((item, i) => (
            <div key={i} className="flex gap-3 pb-4 border-b border-gray-50 last:border-none last:pb-0">
              <img
                src={item.image}
                alt=""
                className="w-16 h-12 object-cover rounded flex-shrink-0 bg-gray-100"
                onError={(e) => {
                  const t = e.target as HTMLImageElement
                  t.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="45" viewBox="0 0 60 45"><rect fill="%23e5e7eb" width="60" height="45"/><text x="30" y="27" fill="%239ca3af" font-size="10" text-anchor="middle">IMG</text></svg>'
                }}
              />
              <div className="flex-1 min-w-0">
                <a href="#" className="text-xs text-gray-700 font-medium leading-snug hover:text-[#17a2b8] transition-colors line-clamp-2">
                  {item.title}
                </a>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-[10px] text-gray-400">{item.date}</span>
                  <span className="text-[10px] text-gray-400">Lượt xem: {item.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Hot Keywords */}
      <div className="bg-white border border-gray-200 rounded p-5">
        <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase mb-4">
          Từ khóa hot trên Google
        </h2>
        <div className="space-y-2">
          {hotKeywords.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              {/* Left keyword */}
              <div className="flex items-center gap-2 flex-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                  {row.count}
                </span>
                <span className="text-xs text-gray-600 truncate">{row.keyword}</span>
              </div>
              {/* Right keyword */}
              <div className="flex items-center gap-2 flex-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                  {row.countRight}
                </span>
                <span className="text-xs text-gray-600 truncate">{row.keywordRight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
