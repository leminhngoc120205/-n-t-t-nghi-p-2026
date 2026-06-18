'use client'

import React from 'react'

const pendingPublish = [
  {
    image: 'https://via.placeholder.com/60x45/ff9999/ffffff?text=img',
    title: 'Tết của những người lính trẻ',
    author: 'vuvandat',
    editor: 'hoangvanbien',
    date: '17/02/2025 - 20:45',
    category: 'Podcast',
  },
]

const pendingEdit = [
  {
    image: 'https://via.placeholder.com/60x45/cccccc/666666?text=img',
    title: 'Cẩm Fix các vấn đề rà soát Quiz',
    author: 'camnv_vcc',
    editor: null,
    date: '15/05/2026 - 11:54',
    category: 'Tin địa phương',
  },
  {
    image: 'https://via.placeholder.com/60x45/aaaaaa/ffffff?text=img',
    title: 'ĐÁNH GIÁ REDMAGIC: TỔNG QUÁT 4 ĐỜI MÁY - TỪ KHỞI ĐẦU ĐẾN HIỆN TẠI',
    author: 'camnv_vcc',
    editor: null,
    date: '15/05/2026 - 11:09',
    category: 'Tiêu dùng',
  },
]

const ArticleItem = ({
  image,
  title,
  author,
  editor,
  date,
  category,
}: {
  image: string
  title: string
  author: string
  editor: string | null
  date: string
  category: string
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-gray-50 last:border-none hover:bg-gray-50 px-5 transition-colors">
    {/* Eye icon */}
    <button className="flex-shrink-0 text-gray-300 hover:text-[#17a2b8] transition-colors">
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    </button>

    {/* Thumbnail */}
    <img
      src={image}
      alt=""
      className="w-14 h-10 object-cover rounded flex-shrink-0 bg-gray-100"
      onError={(e) => {
        const t = e.target as HTMLImageElement
        t.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="40" viewBox="0 0 56 40"><rect fill="%23e5e7eb" width="56" height="40"/><text x="28" y="24" fill="%239ca3af" font-size="9" text-anchor="middle">IMG</text></svg>'
      }}
    />

    {/* Content */}
    <div className="flex-1 min-w-0">
      <a href="#" className="text-xs font-semibold text-gray-700 hover:text-[#17a2b8] transition-colors leading-snug line-clamp-1">
        {title}
      </a>
      <div className="text-[10px] text-gray-400 mt-0.5">
        Viết bởi: <span className="text-gray-500">{author}</span>
        {editor && (
          <span>, Biên tập bởi: <span className="text-gray-500">{editor}</span></span>
        )}
      </div>
    </div>

    {/* Date */}
    <span className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">{date}</span>

    {/* Category tag */}
    <span className="flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-medium text-[#17a2b8] border border-[#17a2b8] whitespace-nowrap">
      {category}
    </span>
  </div>
)

export const IMSPendingArticles = () => {
  return (
    <div className="space-y-4 mb-5">
      {/* Pending Publish */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-gray-700 tracking-wide uppercase">
            Bài chờ xuất bản
          </h2>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#17a2b8] text-white text-[10px] font-bold">
            {pendingPublish.length}
          </span>
        </div>
        <div>
          {pendingPublish.map((item, i) => (
            <ArticleItem key={i} {...item} />
          ))}
        </div>
      </div>

      {/* Pending Edit */}
      <div className="bg-white border border-gray-200 rounded">
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <h2 className="text-[13px] font-bold text-gray-700 tracking-wide uppercase">
            Bài chờ biên tập
          </h2>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#17a2b8] text-white text-[10px] font-bold">
            {pendingEdit.length}
          </span>
        </div>
        <div>
          {pendingEdit.map((item, i) => (
            <ArticleItem key={i} {...item} />
          ))}
        </div>
      </div>
    </div>
  )
}
