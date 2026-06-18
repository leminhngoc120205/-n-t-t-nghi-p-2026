'use client'

import React, { useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

/* ─── Types ─── */
type Device = 'desktop' | 'tablet' | 'mobile'
type RightPanel = 'info' | 'author' | 'comment' | 'settings' | 'seo' | 'ai' | null

const articleTypeLabels: Record<string, string> = {
  'size-s': 'SIZE S', 'size-m': 'SIZE M', 'size-l': 'SIZE L',
  'magazine': 'Magazine', 'big-story': 'Big Story', 'auto-video': 'Video Tự Chạy',
  'livestream': 'Bài Livestream', 'wiki-how': 'Wiki-How', 'cooking': 'Nấu Ăn', 'qa': 'Giải Đáp Kiến Thức',
}

const categories = [
  { id: 'thoi-su', label: 'Thời Sự', children: ['Đô thị', 'Đời sống', 'Giáo dục', 'Thời tiết'] },
  { id: 'kinh-te', label: 'Kinh Tế', children: ['Kinh doanh', 'Tiêu dùng', 'Tài chính'] },
  { id: 'xa-hoi', label: 'Xã Hội', children: ['Trong nước', 'Quốc tế', 'Giao thông'] },
  { id: 'cong-nghe', label: 'Công Nghệ', children: ['Điện thoại', 'Máy tính', 'Internet'] },
  { id: 'the-thao', label: 'Thể Thao', children: ['Bóng đá', 'Tennis', 'Thể thao khác'] },
  { id: 'giai-tri', label: 'Giải Trí', children: ['Phim ảnh', 'Âm nhạc', 'Nghệ sĩ'] },
  { id: 'suc-khoe', label: 'Sức Khỏe', children: ['Dinh dưỡng', 'Bệnh lý', 'Làm đẹp'] },
]

const aiNewsItems = [
  { source: 'Daily Mail', title: 'Apple announces major iPhone redesign for 2027', time: '2 phút trước', status: 'new' },
  { source: 'BBC News', title: 'Global temperatures hit record highs in May 2026', time: '5 phút trước', status: 'new' },
  { source: 'Reuters', title: 'Samsung reveals Galaxy Z Fold 9 with AI features', time: '12 phút trước', status: 'saved' },
  { source: 'CNN', title: 'Tesla cybertruck faces recall over software issues', time: '20 phút trước', status: 'editing' },
  { source: 'TechCrunch', title: 'OpenAI launches GPT-5 with multimodal capabilities', time: '35 phút trước', status: 'done' },
]

/* ─── Word Counter ─── */
const countWords = (text: string) => text.trim() === '' ? 0 : text.trim().split(/\s+/).length

/* ═══════════════════════════════════════════════════════ */
/*  EDITOR PAGE                                           */
/* ═══════════════════════════════════════════════════════ */
export default function VietBaiMoiPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Đang tải...</div>}>
      <VietBaiMoiContent />
    </Suspense>
  )
}

function VietBaiMoiContent() {
  const searchParams = useSearchParams()
  const articleType = searchParams.get('type') || 'size-s'

  const [device, setDevice] = useState<Device>('desktop')
  const [rightPanel, setRightPanel] = useState<RightPanel>(null)
  const [title, setTitle] = useState('')
  const [sapo, setSapo] = useState('')
  const [content, setContent] = useState('')
  const [expandedCats, setExpandedCats] = useState<string[]>(['thoi-su'])
  const [checkedCats, setCheckedCats] = useState<string[]>([])
  const [showPreviewAlert, setShowPreviewAlert] = useState(false)

  /* Right panel toggle */
  const togglePanel = (panel: RightPanel) =>
    setRightPanel((prev) => (prev === panel ? null : panel))

  /* Category expand/collapse */
  const toggleCatExpand = (id: string) =>
    setExpandedCats((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  /* Category checkbox */
  const toggleCatCheck = (label: string) =>
    setCheckedCats((prev) => prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label])

  /* Preview validation */
  const handlePreview = () => {
    if (!title.trim()) { setShowPreviewAlert(true); return }
    alert('Đang xem trước bài viết: ' + title)
  }

  const titleWords = countWords(title)
  const sapoWords = countWords(sapo)

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">
      {/* ─── TOP BAR ─── */}
      <EditorTopBar
        articleType={articleTypeLabels[articleType] || 'SIZE S'}
        device={device}
        onDeviceChange={setDevice}
        onPreview={handlePreview}
      />

      {/* ─── MAIN AREA ─── */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT PANEL */}
        <LeftPanel
          categories={categories}
          expandedCats={expandedCats}
          checkedCats={checkedCats}
          onToggleExpand={toggleCatExpand}
          onToggleCheck={toggleCatCheck}
        />

        {/* CENTER EDITOR */}
        <CenterEditor
          device={device}
          title={title}
          sapo={sapo}
          content={content}
          titleWords={titleWords}
          sapoWords={sapoWords}
          onTitleChange={setTitle}
          onSapoChange={setSapo}
          onContentChange={setContent}
        />

        {/* RIGHT PANEL ICONS */}
        <RightPanelIcons activePanel={rightPanel} onToggle={togglePanel} />

        {/* RIGHT PANEL CONTENT */}
        {rightPanel && (
          <RightPanelContent panel={rightPanel} onClose={() => setRightPanel(null)} />
        )}
      </div>

      {/* Preview alert */}
      {showPreviewAlert && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Không thể xem trước</h3>
                <p className="text-sm text-gray-500">Tiêu đề không được để trống</p>
              </div>
            </div>
            <button
              onClick={() => setShowPreviewAlert(false)}
              className="w-full py-2 bg-[#17a2b8] text-white rounded-lg font-medium hover:bg-[#138496] transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  EDITOR TOP BAR                                        */
/* ═══════════════════════════════════════════════════════ */
function EditorTopBar({
  articleType, device, onDeviceChange, onPreview,
}: {
  articleType: string
  device: Device
  onDeviceChange: (d: Device) => void
  onPreview: () => void
}) {
  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 shadow-sm flex-shrink-0 z-30">
      {/* Back + Logo */}
      <Link href="/dashboard" className="flex items-center gap-2 mr-4 hover:opacity-80 transition-opacity">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <TopbarLogoSmall />
      </Link>

      {/* Article type badge */}
      <span className="text-xs font-bold text-[#17a2b8] border border-[#17a2b8] rounded px-2 py-0.5">
        {articleType}
      </span>

      {/* Insert toolbar */}
      <div className="flex items-center gap-1 ml-2 border-l border-gray-200 pl-3">
        {[
          { icon: <ImgIcon />, label: 'Ảnh' },
          { icon: <VideoIcon />, label: 'Video' },
          { icon: <AudioIcon />, label: 'Audio' },
          { icon: <QuoteIcon />, label: 'Trích dẫn' },
          { icon: <TableIcon />, label: 'Bảng' },
          { icon: <HtmlIcon />, label: 'HTML' },
          { icon: <EmbedIcon />, label: 'Nhúng' },
        ].map(({ icon, label }) => (
          <button key={label} title={label} className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors">
            {icon}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Device selector */}
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        {(['desktop', 'tablet', 'mobile'] as Device[]).map((d) => (
          <button
            key={d}
            onClick={() => onDeviceChange(d)}
            title={d}
            className={`w-9 h-8 flex items-center justify-center transition-colors ${
              device === d ? 'bg-[#17a2b8] text-white' : 'bg-white text-gray-400 hover:bg-gray-50'
            }`}
          >
            {d === 'desktop' ? <DesktopIcon /> : d === 'tablet' ? <TabletIcon /> : <MobileIcon />}
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <button className="px-4 h-8 text-xs font-semibold border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
        Lưu nháp
      </button>
      <button
        onClick={onPreview}
        className="px-4 h-8 text-xs font-semibold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors"
      >
        XEM TRƯỚC
      </button>
      <button className="px-4 h-8 text-xs font-semibold bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
        GỬI DUYỆT
      </button>
    </header>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  LEFT PANEL — CATEGORIES                               */
/* ═══════════════════════════════════════════════════════ */
function LeftPanel({ categories, expandedCats, checkedCats, onToggleExpand, onToggleCheck }: {
  categories: typeof import('./page').default extends never ? never : any[]
  expandedCats: string[]
  checkedCats: string[]
  onToggleExpand: (id: string) => void
  onToggleCheck: (label: string) => void
}) {
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
      {/* Categories section */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-3 py-2.5 border-b border-gray-100 bg-gray-50">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            Chuyên Mục Chính
          </span>
        </div>
        <div className="py-1">
          {categories.map((cat: any) => (
            <div key={cat.id}>
              <button
                onClick={() => onToggleExpand(cat.id)}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50 transition-colors group"
              >
                <svg
                  className={`w-3 h-3 text-gray-400 transition-transform flex-shrink-0 ${
                    expandedCats.includes(cat.id) ? 'rotate-90' : ''
                  }`}
                  fill="none" stroke="currentColor" viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-xs font-semibold text-gray-700 flex-1 text-left">{cat.label}</span>
              </button>
              {expandedCats.includes(cat.id) && (
                <div className="ml-5 border-l border-gray-100">
                  {cat.children.map((child: string) => (
                    <label key={child} className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checkedCats.includes(child)}
                        onChange={() => onToggleCheck(child)}
                        className="w-3.5 h-3.5 rounded accent-[#17a2b8] cursor-pointer"
                      />
                      <span className="text-xs text-gray-600">{child}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Related articles section */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="px-3 py-2.5 border-b border-gray-100">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide">
            Chọn Tin Liên Quan
          </span>
        </div>
        <div className="p-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm bài viết..."
              className="w-full text-xs border border-gray-300 rounded-lg px-3 py-2 pr-8 focus:outline-none focus:border-[#17a2b8] bg-white"
            />
            <svg className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">Chưa có tin liên quan nào</p>
        </div>
      </div>
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  CENTER EDITOR                                         */
/* ═══════════════════════════════════════════════════════ */
function CenterEditor({ device, title, sapo, content, titleWords, sapoWords, onTitleChange, onSapoChange, onContentChange }: {
  device: Device
  title: string; sapo: string; content: string
  titleWords: number; sapoWords: number
  onTitleChange: (v: string) => void
  onSapoChange: (v: string) => void
  onContentChange: (v: string) => void
}) {
  const widthClass = device === 'desktop' ? 'max-w-3xl' : device === 'tablet' ? 'max-w-xl' : 'max-w-sm'

  return (
    <main className="flex-1 overflow-y-auto bg-gray-100 py-6 px-4">
      <div className={`mx-auto bg-white shadow-sm rounded-lg overflow-hidden ${widthClass} w-full`}>
        {/* Title */}
        <div className="border-b border-gray-100 px-8 py-5">
          <div className="flex items-start justify-between gap-2">
            <textarea
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tiêu đề bài viết..."
              className="flex-1 text-2xl font-bold text-gray-800 placeholder-gray-300 border-none outline-none resize-none leading-tight"
              rows={2}
            />
            <span className={`text-xs font-mono flex-shrink-0 mt-1.5 ${titleWords > 25 ? 'text-red-500' : 'text-gray-400'}`}>
              {titleWords}/25
            </span>
          </div>
        </div>

        {/* Sapo */}
        <div className="border-b border-gray-100 px-8 py-4">
          <div className="flex items-start justify-between gap-2">
            <textarea
              value={sapo}
              onChange={(e) => onSapoChange(e.target.value)}
              placeholder="Mô tả (sapo)..."
              className="flex-1 text-base text-gray-600 placeholder-gray-300 border-none outline-none resize-none leading-relaxed italic"
              rows={3}
            />
            <span className={`text-xs font-mono flex-shrink-0 mt-1 ${sapoWords > 70 ? 'text-red-500' : 'text-gray-400'}`}>
              {sapoWords}/70
            </span>
          </div>
        </div>

        {/* Content + Insert Toolbar */}
        <div className="px-8 py-4 min-h-[60vh] relative">
          {/* Insert toolbar */}
          <div className="flex items-center gap-1 mb-4 p-2 bg-gray-50 border border-gray-200 rounded-lg flex-wrap">
            {[
              { icon: <ImgIcon />, label: 'Ảnh' },
              { icon: <VideoIcon />, label: 'Video' },
              { icon: <AudioIcon />, label: 'Audio' },
              { icon: <QuoteIcon />, label: 'Trích dẫn' },
              { icon: <TableIcon />, label: 'Bảng' },
              { icon: <HtmlIcon />, label: 'HTML' },
              { icon: <EmbedIcon />, label: 'Nhúng' },
              { icon: <SearchIcon />, label: 'Tìm kiếm' },
            ].map(({ icon, label }) => (
              <button
                key={label}
                title={label}
                className="flex items-center gap-1 px-2 py-1.5 text-[11px] text-gray-500 rounded hover:bg-white hover:text-gray-800 hover:shadow-sm transition-all border border-transparent hover:border-gray-200"
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder="Hãy viết gì đó..."
            className="w-full text-base text-gray-700 placeholder-gray-300 border-none outline-none resize-none leading-relaxed min-h-[50vh]"
          />
        </div>
      </div>
    </main>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  RIGHT PANEL ICONS                                     */
/* ═══════════════════════════════════════════════════════ */
function RightPanelIcons({ activePanel, onToggle }: {
  activePanel: RightPanel
  onToggle: (panel: RightPanel) => void
}) {
  const icons: { panel: RightPanel; icon: React.ReactNode; label: string }[] = [
    { panel: 'info', icon: <InfoIcon />, label: 'Thông tin' },
    { panel: 'author', icon: <AuthorIcon />, label: 'Tác giả' },
    { panel: 'comment', icon: <CommentIcon />, label: 'Bình luận' },
    { panel: 'settings', icon: <SettingsIcon />, label: 'Cài đặt' },
    { panel: 'seo', icon: <SeoIcon />, label: 'SEO' },
    { panel: 'ai', icon: <AIBiIcon />, label: 'AI Bi' },
  ]

  return (
    <aside className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-2 gap-1 flex-shrink-0">
      {icons.map(({ panel, icon, label }) => (
        <button
          key={panel}
          onClick={() => onToggle(panel)}
          title={label}
          className={`w-10 h-10 flex flex-col items-center justify-center rounded-lg transition-all gap-0.5 ${
            activePanel === panel
              ? 'bg-[#17a2b8] text-white shadow-sm'
              : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
          }`}
        >
          {icon}
        </button>
      ))}
    </aside>
  )
}

/* ═══════════════════════════════════════════════════════ */
/*  RIGHT PANEL CONTENT                                   */
/* ═══════════════════════════════════════════════════════ */
function RightPanelContent({ panel, onClose }: { panel: RightPanel; onClose: () => void }) {
  const [seoTab, setSeoTab] = useState<'seo' | 'content' | 'heading'>('seo')
  const [aiTab, setAiTab] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [googleTitle, setGoogleTitle] = useState('')
  const [googleDesc, setGoogleDesc] = useState('')
  const [publishDate, setPublishDate] = useState('')

  const titles: Record<NonNullable<RightPanel>, string> = {
    info: 'Thông Tin Cơ Bản',
    author: 'Tác Giả & Phân Phối',
    comment: 'Thêm Bình Luận',
    settings: 'Cài Đặt',
    seo: 'SEO Chi Tiết',
    ai: 'Bi - Trợ lý tin',
  }

  return (
    <div className="w-72 bg-white border-l border-gray-200 flex flex-col flex-shrink-0 overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
          {panel && titles[panel]}
        </span>
        <button onClick={onClose} className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Panel content */}
      <div className="flex-1 overflow-y-auto">
        {panel === 'info' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-2">Ảnh Đại Diện</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#17a2b8] transition-colors cursor-pointer group">
                <svg className="w-8 h-8 mx-auto text-gray-300 group-hover:text-[#17a2b8] mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs text-gray-400">Click để tải ảnh lên</p>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="flex-1 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Ảnh tĩnh</button>
                <button className="flex-1 py-1.5 text-xs border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50">Ảnh GIF</button>
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Chú Thích Ảnh</label>
              <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8] resize-none" rows={2} placeholder="Nhập chú thích ảnh..." />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Ngày Xuất Bản</label>
              <input type="datetime-local" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 rounded accent-[#17a2b8]" />
                <span className="text-xs text-gray-600">Hiển thị icon chuyên mục</span>
              </label>
            </div>
          </div>
        )}

        {panel === 'author' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Tác Giả</label>
              <input type="text" placeholder="Nhập tên tác giả..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Dòng Sự Kiện</label>
              <input type="text" placeholder="Gắn dòng sự kiện..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Chủ Đề</label>
              <input type="text" placeholder="Thêm chủ đề..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Đề Xuất Hiển Thị</label>
              <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]">
                <option>Tin thông thường</option>
                <option>Tin nổi bật</option>
                <option>Tin hot</option>
                <option>Tin độc quyền</option>
              </select>
            </div>
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-3.5 h-3.5 accent-red-500" />
                <span className="text-xs text-red-500 font-medium">Đánh dấu bài nhạy cảm</span>
              </label>
            </div>
          </div>
        )}

        {panel === 'comment' && (
          <div className="p-4 space-y-3">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Tên Người Gửi</label>
              <input type="text" placeholder="Nhập tên..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Email</label>
              <input type="email" placeholder="email@example.com" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Nội Dung Bình Luận</label>
              <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:border-[#17a2b8]">
                <div className="flex gap-1 p-1.5 border-b border-gray-200 bg-gray-50">
                  {['B', 'I', 'U'].map((fmt) => (
                    <button key={fmt} className={`w-6 h-6 text-xs font-${fmt === 'B' ? 'bold' : fmt === 'I' ? 'normal italic' : 'normal'} text-gray-600 hover:bg-white rounded border border-transparent hover:border-gray-200`}>{fmt}</button>
                  ))}
                </div>
                <textarea className="w-full px-3 py-2 text-xs focus:outline-none resize-none min-h-[80px]" placeholder="Nhập nội dung bình luận nội bộ..." />
              </div>
            </div>
            <button className="w-full py-2 bg-[#17a2b8] text-white text-xs font-semibold rounded-lg hover:bg-[#138496] transition-colors">
              Thêm Bình Luận
            </button>
          </div>
        )}

        {panel === 'settings' && (
          <div className="flex flex-col h-full">
            {/* SEO Score */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
              <div className="relative w-14 h-14 flex-shrink-0">
                <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#f3f4f6" strokeWidth="6" />
                  <circle cx="28" cy="28" r="22" fill="none" stroke="#ef4444" strokeWidth="6" strokeDasharray="0 138.2" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-base font-bold text-red-500">0</span>
                  <span className="text-[8px] text-gray-400">/100</span>
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-700">Điểm SEO</p>
                <p className="text-[11px] text-red-500 font-medium">⚠️ Cần cải thiện</p>
              </div>
            </div>
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              {(['seo', 'content', 'heading'] as const).map((tab) => (
                <button key={tab} onClick={() => setSeoTab(tab)} className={`flex-1 py-2 text-[11px] font-semibold transition-colors ${seoTab === tab ? 'text-[#17a2b8] border-b-2 border-[#17a2b8]' : 'text-gray-400 hover:text-gray-600'}`}>
                  {tab === 'seo' ? 'SEO' : tab === 'content' ? 'Nội Dung' : 'Thẻ Heading'}
                </button>
              ))}
            </div>
            <div className="p-4 flex-1">
              {seoTab === 'seo' && <p className="text-xs text-gray-400">Chưa có từ khóa nào. Thêm từ khóa để cải thiện SEO.</p>}
              {seoTab === 'content' && <p className="text-xs text-gray-400">Bài viết chưa có nội dung. Hãy viết ít nhất 300 từ.</p>}
              {seoTab === 'heading' && <p className="text-xs text-gray-400">Chưa có cấu trúc tiêu đề. Thêm H1, H2, H3 vào bài.</p>}
            </div>
          </div>
        )}

        {panel === 'seo' && (
          <div className="p-4 space-y-4">
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">
                Từ Khóa Chủ Đạo
                <span className="text-[10px] text-gray-400 ml-1 normal-case font-normal">(tối thiểu 5 ký tự)</span>
              </label>
              <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Nhập từ khóa chính..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1.5">Từ Khóa Phụ</label>
              <input type="text" placeholder="Thêm từ khóa phụ..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1">
                Tiêu Đề Google
                <span className={`ml-1 text-[10px] font-mono ${googleTitle.length > 100 ? 'text-red-500' : 'text-gray-400'}`}>{googleTitle.length}/100</span>
              </label>
              <input type="text" value={googleTitle} onChange={(e) => setGoogleTitle(e.target.value)} maxLength={100} placeholder="Tiêu đề hiển thị trên Google..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-600 uppercase tracking-wide block mb-1">
                Mô Tả Google
                <span className={`ml-1 text-[10px] font-mono ${googleDesc.length > 250 ? 'text-red-500' : 'text-gray-400'}`}>{googleDesc.length}/250</span>
              </label>
              <textarea value={googleDesc} onChange={(e) => setGoogleDesc(e.target.value)} maxLength={250} placeholder="Mô tả hiển thị trên Google..." className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8] resize-none" rows={3} />
            </div>
            <button className="w-full py-2 bg-gradient-to-r from-purple-500 to-[#17a2b8] text-white text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <span>✨</span> Gợi ý SEO bằng AI
            </button>
          </div>
        )}

        {panel === 'ai' && (
          <div className="flex flex-col h-full">
            {/* AI Tabs */}
            <div className="overflow-x-auto border-b border-gray-200 flex-shrink-0">
              <div className="flex min-w-max">
                {[
                  { id: 'all', label: 'Tất cả' },
                  { id: 'saved', label: 'Đã lưu' },
                  { id: 'unedited', label: 'Chưa biên tập' },
                  { id: 'editing', label: 'Đang biên tập' },
                  { id: 'edited', label: 'Đã biên tập' },
                  { id: 'used', label: 'Đã sử dụng' },
                ].map(({ id, label }) => (
                  <button key={id} onClick={() => setAiTab(id)} className={`px-3 py-2 text-[11px] font-semibold whitespace-nowrap transition-colors ${aiTab === id ? 'text-[#17a2b8] border-b-2 border-[#17a2b8]' : 'text-gray-400 hover:text-gray-600'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[10px] text-gray-500">Cập nhật mỗi 4 phút</span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
              {aiNewsItems.map((item, i) => (
                <div key={i} className="p-3 hover:bg-gray-50 cursor-pointer transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#17a2b8]">{item.source}</span>
                    <span className="text-[9px] text-gray-400">{item.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-snug">{item.title}</p>
                  <div className="flex gap-1 mt-1.5">
                    <button className="px-2 py-0.5 text-[9px] bg-[#17a2b8] text-white rounded hover:bg-[#138496] transition-colors">Biên tập</button>
                    <button className="px-2 py-0.5 text-[9px] border border-gray-300 text-gray-500 rounded hover:bg-gray-100 transition-colors">Lưu</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Icons ─── */
function TopbarLogoSmall() {
  return (
    <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
      <path d="M3 28L9 12L14 22L18 14L23 22L28 12L33 28" stroke="#17c3d8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function ImgIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg> }
function VideoIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.236a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> }
function AudioIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 016 0v4a3 3 0 01-6 0z" /></svg> }
function QuoteIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> }
function TableIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M3 6a3 3 0 013-3h12a3 3 0 013 3v12a3 3 0 01-3 3H6a3 3 0 01-3-3V6z" /></svg> }
function HtmlIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg> }
function EmbedIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg> }
function SearchIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg> }
function DesktopIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg> }
function TabletIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
function MobileIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg> }
function InfoIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> }
function AuthorIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> }
function CommentIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> }
function SettingsIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> }
function SeoIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> }
function AIBiIcon() { return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg> }
