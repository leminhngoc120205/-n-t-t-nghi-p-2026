'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface ArticleType {
  id: string
  name: string
  description: string
  preview: React.ReactNode
}

const sizeTypes: ArticleType[] = [
  {
    id: 'size-s',
    name: 'SIZE S',
    description: 'Bài ngắn, ít ảnh',
    preview: <PreviewSizeS />,
  },
  {
    id: 'size-m',
    name: 'SIZE M',
    description: 'Bài trung bình',
    preview: <PreviewSizeM />,
  },
  {
    id: 'size-l',
    name: 'SIZE L',
    description: 'Bài dài, nhiều nội dung',
    preview: <PreviewSizeL />,
  },
]

const specialTypes: ArticleType[] = [
  {
    id: 'magazine',
    name: 'Magazine',
    description: 'Kiểu tạp chí sang chảnh',
    preview: <PreviewMagazine />,
  },
  {
    id: 'big-story',
    name: 'Big Story',
    description: 'Bài điều tra / phóng sự lớn',
    preview: <PreviewBigStory />,
  },
  {
    id: 'auto-video',
    name: 'Video Tự Chạy',
    description: 'Bài có video tự phát',
    preview: <PreviewAutoVideo />,
  },
  {
    id: 'livestream',
    name: 'Bài Livestream',
    description: 'Dành cho bài live',
    preview: <PreviewLivestream />,
  },
  {
    id: 'wiki-how',
    name: 'Wiki-How',
    description: 'Bài hướng dẫn từng bước',
    preview: <PreviewWikiHow />,
  },
  {
    id: 'cooking',
    name: 'Nấu Ăn',
    description: 'Bài công thức món ăn',
    preview: <PreviewCooking />,
  },
  {
    id: 'qa',
    name: 'Giải Đáp Kiến Thức',
    description: 'Dạng hỏi đáp',
    preview: <PreviewQA />,
  },
]

interface Props {
  onClose: () => void
}

export const IMSArticleTypeModal: React.FC<Props> = ({ onClose }) => {
  const router = useRouter()

  const handleSelect = (typeId: string) => {
    onClose()
    router.push(`/dashboard/viet-bai-moi?type=${typeId}`)
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-800">Chọn dạng bài viết</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Group 1: Standard sizes */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-[#17a2b8] rounded-full block" />
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Dạng bài chuẩn theo size
              </h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {sizeTypes.map((type) => (
                <TypeCard key={type.id} type={type} onSelect={handleSelect} />
              ))}
            </div>
          </section>

          {/* Group 2: Special types */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-1 h-5 bg-orange-400 rounded-full block" />
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                Dạng bài đặc biệt
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {specialTypes.map((type) => (
                <TypeCard key={type.id} type={type} onSelect={handleSelect} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

const TypeCard: React.FC<{ type: ArticleType; onSelect: (id: string) => void }> = ({ type, onSelect }) => (
  <button
    onClick={() => onSelect(type.id)}
    className="group flex flex-col border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#17a2b8] hover:shadow-lg transition-all text-left"
  >
    {/* Preview thumbnail */}
    <div className="bg-gray-50 p-3 flex items-center justify-center h-36 border-b border-gray-200 group-hover:bg-blue-50 transition-colors">
      {type.preview}
    </div>
    {/* Info */}
    <div className="p-3">
      <p className="text-sm font-bold text-gray-800 group-hover:text-[#17a2b8] transition-colors">
        {type.name}
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{type.description}</p>
    </div>
  </button>
)

/* ─── SVG Layout Previews ─── */

function PreviewSizeS() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="25" rx="2" fill="#e5e7eb" />
      <rect x="5" y="35" width="90" height="5" rx="1" fill="#d1d5db" />
      <rect x="5" y="43" width="70" height="4" rx="1" fill="#d1d5db" />
      <rect x="5" y="50" width="80" height="4" rx="1" fill="#d1d5db" />
      <rect x="5" y="57" width="60" height="4" rx="1" fill="#d1d5db" />
      <rect x="5" y="66" width="40" height="3" rx="1" fill="#e5e7eb" />
    </svg>
  )
}

function PreviewSizeM() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="20" rx="2" fill="#e5e7eb" />
      <rect x="5" y="28" width="90" height="4" rx="1" fill="#d1d5db" />
      <rect x="5" y="35" width="42" height="20" rx="2" fill="#e5e7eb" />
      <rect x="53" y="35" width="42" height="20" rx="2" fill="#e5e7eb" />
      <rect x="5" y="58" width="90" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="64" width="70" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="70" width="50" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function PreviewSizeL() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="18" rx="2" fill="#e5e7eb" />
      <rect x="5" y="26" width="90" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="32" width="90" height="14" rx="2" fill="#e5e7eb" />
      <rect x="5" y="49" width="90" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="55" width="90" height="3" rx="1" fill="#d1d5db" />
      {/* ADS label */}
      <rect x="25" y="61" width="50" height="12" rx="2" fill="#fef3c7" stroke="#f59e0b" strokeWidth="0.5" />
      <text x="50" y="70" textAnchor="middle" fontSize="6" fill="#d97706" fontWeight="bold">ADS</text>
    </svg>
  )
}

function PreviewMagazine() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="#1f2937" />
      <rect x="0" y="0" width="100" height="45" rx="3" fill="#374151" />
      <rect x="5" y="48" width="90" height="6" rx="1" fill="#f9fafb" />
      <rect x="5" y="57" width="60" height="3" rx="1" fill="#6b7280" />
      <rect x="5" y="63" width="75" height="3" rx="1" fill="#6b7280" />
      <text x="50" y="30" textAnchor="middle" fontSize="7" fill="#f9fafb" fontWeight="bold">MAGAZINE</text>
    </svg>
  )
}

function PreviewBigStory() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="30" rx="2" fill="#374151" />
      <text x="50" y="24" textAnchor="middle" fontSize="8" fill="white" fontWeight="bold">BIG STORY</text>
      <rect x="5" y="39" width="90" height="5" rx="1" fill="#1f2937" />
      <rect x="5" y="47" width="90" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="53" width="70" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="59" width="80" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="65" width="60" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function PreviewAutoVideo() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="45" rx="2" fill="#1f2937" />
      <circle cx="50" cy="27" r="10" fill="white" fillOpacity="0.2" />
      <path d="M47 22 L55 27 L47 32 Z" fill="white" />
      <rect x="5" y="55" width="90" height="4" rx="1" fill="#d1d5db" />
      <rect x="5" y="62" width="60" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function PreviewLivestream() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="40" rx="2" fill="#ef4444" />
      <rect x="8" y="8" width="20" height="8" rx="2" fill="white" />
      <text x="18" y="15" textAnchor="middle" fontSize="5" fill="#ef4444" fontWeight="bold">LIVE</text>
      <rect x="5" y="50" width="90" height="4" rx="1" fill="#d1d5db" />
      <rect x="5" y="57" width="70" height="3" rx="1" fill="#d1d5db" />
      <rect x="5" y="63" width="80" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function PreviewWikiHow() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="10" rx="2" fill="#e5e7eb" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <circle cx="12" cy={22 + i * 15} r="5" fill="#17a2b8" />
          <text x="12" y={25 + i * 15} textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">{i + 1}</text>
          <rect x="22" y={18 + i * 15} width="70" height="4" rx="1" fill="#d1d5db" />
          <rect x="22" y={25 + i * 15} width="50" height="3" rx="1" fill="#e5e7eb" />
        </g>
      ))}
    </svg>
  )
}

function PreviewCooking() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      <rect x="5" y="5" width="90" height="25" rx="2" fill="#fef3c7" />
      <text x="50" y="20" textAnchor="middle" fontSize="7" fill="#d97706" fontWeight="bold">🍳 Nấu Ăn</text>
      <rect x="5" y="33" width="40" height="30" rx="2" fill="#e5e7eb" />
      <rect x="50" y="33" width="45" height="5" rx="1" fill="#d1d5db" />
      <rect x="50" y="41" width="35" height="3" rx="1" fill="#e5e7eb" />
      <rect x="50" y="47" width="40" height="3" rx="1" fill="#e5e7eb" />
      <rect x="50" y="53" width="30" height="3" rx="1" fill="#e5e7eb" />
      <rect x="5" y="68" width="90" height="3" rx="1" fill="#d1d5db" />
    </svg>
  )
}

function PreviewQA() {
  return (
    <svg viewBox="0 0 100 80" className="w-24 h-20">
      <rect width="100" height="80" rx="3" fill="white" stroke="#e5e7eb" strokeWidth="1" />
      {[0, 1].map((i) => (
        <g key={i}>
          <rect x="5" y={5 + i * 37} width="90" height="14" rx="3" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="0.5" />
          <text x="11" y={15 + i * 37} fontSize="7" fill="#3b82f6" fontWeight="bold">Q</text>
          <rect x="20" y={9 + i * 37} width="70" height="3" rx="1" fill="#bfdbfe" />
          <rect x="20" y={14 + i * 37} width="50" height="3" rx="1" fill="#bfdbfe" />
          <rect x="5" y={22 + i * 37} width="90" height="10" rx="3" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="0.5" />
          <text x="11" y={30 + i * 37} fontSize="7" fill="#16a34a" fontWeight="bold">A</text>
          <rect x="20" y={24 + i * 37} width="65" height="3" rx="1" fill="#bbf7d0" />
        </g>
      ))}
    </svg>
  )
}
