'use client'

import React, { useState, useMemo } from 'react'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'
import { INTERACTIVE1_HTML, makeSimpleHTML } from './previewContent'

/* ═══════════════════════════════════════════════════════════
   TYPES & DATA
══════════════════════════════════════════════════════════ */
interface Template {
  id: number
  name: string
  uploader: string
  uploadTime: string
  gradient: [string, string]   // tailwind from/to classes
  htmlContent: string
  deleted: boolean
}

const ALL_TEMPLATES: Template[] = [
  {
    id: 1, name: 'Interactive1', uploader: 'trangnv_vcc', uploadTime: '14:55 12/02/2026',
    gradient: ['from-blue-800', 'to-blue-600'], deleted: false,
    htmlContent: INTERACTIVE1_HTML,
  },
  {
    id: 2, name: 'Timeline2026', uploader: 'ngoclm_vcc', uploadTime: '09:30 15/03/2026',
    gradient: ['from-teal-700', 'to-cyan-500'], deleted: false,
    htmlContent: makeSimpleHTML('Timeline2026', 'Mẫu dòng thời gian tương tác', '#0f766e', '#0891b2'),
  },
  {
    id: 3, name: 'MagazineLayout', uploader: 'dinhluong_vcc', uploadTime: '16:20 08/01/2026',
    gradient: ['from-slate-700', 'to-slate-500'], deleted: false,
    htmlContent: makeSimpleHTML('Magazine Layout', 'Bố cục tạp chí sang trọng', '#334155', '#475569'),
  },
  {
    id: 4, name: 'ScrollyTelling', uploader: 'minhvu', uploadTime: '11:45 20/04/2026',
    gradient: ['from-violet-700', 'to-purple-500'], deleted: false,
    htmlContent: makeSimpleHTML('Scrollytelling', 'Kể chuyện bằng cuộn trang', '#6d28d9', '#7c3aed'),
  },
  {
    id: 5, name: 'DataVizChart', uploader: 'hoattv_vcc', uploadTime: '08:15 02/05/2026',
    gradient: ['from-orange-600', 'to-amber-400'], deleted: false,
    htmlContent: makeSimpleHTML('DataViz Chart', 'Biểu đồ dữ liệu tương tác', '#ea580c', '#f59e0b'),
  },
  {
    id: 6, name: 'QuizTemplate', uploader: 'muaxuan', uploadTime: '13:30 28/01/2026',
    gradient: ['from-rose-600', 'to-pink-400'], deleted: false,
    htmlContent: makeSimpleHTML('Quiz Template', 'Mẫu câu hỏi trắc nghiệm tương tác', '#e11d48', '#ec4899'),
  },
]

const SORT_OPTIONS = ['Duyệt gần đây nhất', 'Tên A → Z', 'Tên Z → A', 'Cũ nhất']

/* ═══════════════════════════════════════════════════════════
   PAGE CHÍNH
══════════════════════════════════════════════════════════ */
export default function MauHtmlPage() {
  const [activeTab,    setActiveTab]    = useState<'uploaded' | 'deleted'>('uploaded')
  const [search,       setSearch]       = useState('')
  const [sort,         setSort]         = useState(SORT_OPTIONS[0])
  const [page,         setPage]         = useState(1)
  const [templates,    setTemplates]    = useState<Template[]>(ALL_TEMPLATES)
  const [selected,     setSelected]     = useState<Template | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  const PER_PAGE = 6

  const visible = useMemo(() => {
    let list = templates.filter(t =>
      (activeTab === 'uploaded' ? !t.deleted : t.deleted) &&
      (!search || t.name.toLowerCase().includes(search.toLowerCase()))
    )
    if (sort === 'Tên A → Z') list = [...list].sort((a, b) => a.name.localeCompare(b.name))
    else if (sort === 'Tên Z → A') list = [...list].sort((a, b) => b.name.localeCompare(a.name))
    else if (sort === 'Cũ nhất') list = [...list].reverse()
    return list
  }, [templates, activeTab, search, sort])

  const totalPages = Math.ceil(visible.length / PER_PAGE)
  const pageItems  = visible.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const from = visible.length === 0 ? 0 : (page - 1) * PER_PAGE + 1
  const to   = Math.min(page * PER_PAGE, visible.length)

  const handleDelete = (id: number) => {
    setTemplates(l => l.map(t => t.id === id ? { ...t, deleted: true } : t))
  }
  const handleRestore = (id: number) => {
    setTemplates(l => l.map(t => t.id === id ? { ...t, deleted: false } : t))
  }

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />

      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />

        <main className="flex flex-1 overflow-hidden">

          {/* ── Cột trái ── */}
          <aside className="w-48 min-h-full bg-white border-r border-gray-200 flex-shrink-0 pt-4">
            {[
              { id: 'uploaded', label: 'Mẫu đã upload', icon: '📄' },
              { id: 'deleted',  label: 'Đã xoá',         icon: '🗑️' },
            ].map(item => (
              <button key={item.id} onClick={() => { setActiveTab(item.id as any); setPage(1) }}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm text-left transition-colors border-l-[3px]
                  ${activeTab === item.id
                    ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-[#17a2b8]'
                    : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </aside>

          {/* ── Vùng nội dung chính ── */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* Toolbar */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {/* THÊM MẪU HTML */}
              <button onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 bg-[#17a2b8] hover:bg-[#138496] text-white text-sm font-bold px-4 py-2 rounded transition-colors shadow-sm whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                THÊM MẪU HTML
              </button>

              {/* Sort */}
              <select value={sort} onChange={e => setSort(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded bg-white text-gray-600 focus:outline-none focus:border-[#17a2b8] cursor-pointer">
                {SORT_OPTIONS.map(o => <option key={o}>{o}</option>)}
              </select>

              {/* Search */}
              <div className="relative flex-1 max-w-xs">
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                  placeholder="Tìm kiếm tài liệu"
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]"/>
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>

              <div className="flex-1"/>

              {/* Pagination info + arrows */}
              <div className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                <span>Hiển thị {from}–{to} trên tổng {visible.length}</span>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}
                  className="p-1.5 rounded hover:bg-gray-100 disabled:opacity-40 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                </button>
              </div>
            </div>

            {/* Grid cards */}
            {pageItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <svg className="w-12 h-12 mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                </svg>
                <p className="text-sm">Không có mẫu HTML nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {pageItems.map(t => (
                  <TemplateCard
                    key={t.id}
                    template={t}
                    isDeleted={activeTab === 'deleted'}
                    onClick={() => setSelected(t)}
                    onDelete={() => handleDelete(t.id)}
                    onRestore={() => handleRestore(t.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal chi tiết / xem trước */}
      {selected && (
        <PreviewModal
          template={selected}
          onClose={() => setSelected(null)}
        />
      )}

      {/* Modal thêm mẫu mới */}
      {showAddModal && (
        <AddModal onClose={() => setShowAddModal(false)}/>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   TEMPLATE CARD
══════════════════════════════════════════════════════════ */
function TemplateCard({ template: t, isDeleted, onClick, onDelete, onRestore }: {
  template: Template
  isDeleted: boolean
  onClick: () => void
  onDelete: () => void
  onRestore: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Thumbnail */}
      <div className={`relative h-44 bg-gradient-to-br ${t.gradient[0]} ${t.gradient[1]} flex items-center justify-center`}>
        {/* Fake preview lines */}
        <div className="w-4/5 space-y-2 opacity-30">
          <div className="h-2 bg-white rounded-full"/>
          <div className="h-2 bg-white rounded-full w-3/4"/>
          <div className="h-8 bg-white/40 rounded mt-3"/>
          <div className="h-2 bg-white rounded-full"/>
          <div className="h-2 bg-white rounded-full w-1/2"/>
        </div>

        {/* HTML badge */}
        <div className="absolute top-3 left-3 bg-black/30 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
          &lt;/&gt; HTML
        </div>

        {/* Trash icon — only visible on hover */}
        {!isDeleted && (
          <button
            onClick={e => { e.stopPropagation(); onDelete() }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all shadow-lg
              ${hovered ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            title="Xóa mẫu"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
          </button>
        )}

        {/* Restore button if deleted */}
        {isDeleted && hovered && (
          <button
            onClick={e => { e.stopPropagation(); onRestore() }}
            className="absolute top-2.5 right-2.5 bg-green-500 hover:bg-green-600 text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg shadow-lg transition-colors"
          >
            Khôi phục
          </button>
        )}
      </div>

      {/* Card info */}
      <div className="p-3.5">
        <p className="text-sm font-bold text-gray-800 mb-1 group-hover:text-[#17a2b8] transition-colors truncate">
          {t.name}
        </p>
        <p className="text-[11px] text-gray-400">
          Up bởi: <span className="text-gray-600 font-medium">{t.uploader}</span>
          &nbsp;·&nbsp;{t.uploadTime}
        </p>
        {isDeleted && (
          <span className="inline-block mt-1.5 px-1.5 py-0.5 text-[10px] bg-red-100 text-red-600 rounded font-semibold">Đã xoá</span>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PREVIEW MODAL
══════════════════════════════════════════════════════════ */
function PreviewModal({ template: t, onClose }: { template: Template; onClose: () => void }) {
  const [activeTab,    setActiveTab]    = useState<'upload' | 'preview'>('preview')
  const [previewMode,  setPreviewMode]  = useState<'desktop' | 'mobile'>('desktop')
  const [title,        setTitle]        = useState(t.name)

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl flex flex-col overflow-hidden" style={{ height: '90vh' }}>

        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <h2 className="text-sm font-bold text-gray-800">Thêm mẫu HTML</h2>
          {/* Tabs */}
          <div className="flex bg-gray-200 rounded-lg p-0.5 gap-0.5">
            {([['upload', 'Upload file'], ['preview', 'Previews và nhập thông tin']] as const).map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors
                  ${activeTab === id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {label}
              </button>
            ))}
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {activeTab === 'upload' ? (
            /* ── Upload tab ── */
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="w-full max-w-md text-center">
                <div className="border-2 border-dashed border-gray-300 hover:border-[#17a2b8] rounded-xl p-10 transition-colors cursor-pointer group">
                  <div className="w-16 h-16 bg-gray-100 group-hover:bg-[#e8f7f9] rounded-full flex items-center justify-center mx-auto mb-4 transition-colors">
                    <svg className="w-8 h-8 text-gray-400 group-hover:text-[#17a2b8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">Kéo thả file HTML vào đây</p>
                  <p className="text-xs text-gray-400 mb-3">hoặc bấm để chọn file</p>
                  <p className="text-[10px] text-gray-300">Hỗ trợ: .html, .htm · Tối đa 10MB</p>
                </div>
                <p className="text-xs text-gray-400 mt-4">File HTML sẽ được kiểm tra và hiển thị ở tab "Previews và nhập thông tin" sau khi tải lên.</p>
              </div>
            </div>
          ) : (
            /* ── Preview tab ── */
            <>
              {/* Left info column */}
              <div className="w-52 border-r border-gray-200 flex flex-col flex-shrink-0 bg-gray-50">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Thông tin</p>
                </div>
                <div className="p-4 space-y-4">
                  {/* Thumbnail */}
                  <div className={`w-full aspect-video rounded-lg bg-gradient-to-br ${t.gradient[0]} ${t.gradient[1]} flex items-center justify-center`}>
                    <div className="w-3/4 space-y-1.5 opacity-30">
                      <div className="h-1.5 bg-white rounded-full"/>
                      <div className="h-1.5 bg-white rounded-full w-3/4"/>
                      <div className="h-5 bg-white/40 rounded mt-1.5"/>
                    </div>
                  </div>

                  {/* Title input */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tiêu đề mẫu</label>
                    <input
                      type="text"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] bg-white"
                    />
                  </div>

                  {/* Meta info */}
                  <div className="space-y-1.5 border-t border-gray-200 pt-3">
                    <p className="text-[10px] text-gray-500">Người upload</p>
                    <p className="text-xs font-medium text-gray-700">{t.uploader}</p>
                    <p className="text-[10px] text-gray-500 mt-2">Thời gian</p>
                    <p className="text-xs font-medium text-gray-700">{t.uploadTime}</p>
                  </div>
                </div>
              </div>

              {/* Preview area */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Desktop/Mobile switcher */}
                <div className="flex items-center justify-center gap-1 px-4 py-2.5 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                  <span className="text-xs text-gray-500 mr-2">Xem trước:</span>
                  <button
                    onClick={() => setPreviewMode('desktop')}
                    title="Chế độ Desktop"
                    className={`p-2 rounded-lg transition-colors ${previewMode === 'desktop' ? 'bg-[#17a2b8] text-white' : 'text-gray-400 hover:bg-gray-200'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  <button
                    onClick={() => setPreviewMode('mobile')}
                    title="Chế độ Mobile"
                    className={`p-2 rounded-lg transition-colors ${previewMode === 'mobile' ? 'bg-[#17a2b8] text-white' : 'text-gray-400 hover:bg-gray-200'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                    </svg>
                  </button>
                  <span className="ml-2 text-xs text-gray-400 font-mono">
                    {previewMode === 'desktop' ? 'Desktop' : 'Mobile (375px)'}
                  </span>
                </div>

                {/* Iframe container */}
                <div className="flex-1 overflow-auto bg-gray-200 flex items-start justify-center py-4 px-4">
                  <div
                    className="bg-white shadow-xl overflow-hidden transition-all duration-300 rounded-sm"
                    style={{
                      width: previewMode === 'mobile' ? '375px' : '100%',
                      minHeight: '100%',
                    }}
                  >
                    {/* Mobile frame border */}
                    {previewMode === 'mobile' && (
                      <div className="h-6 bg-gray-800 flex items-center justify-center rounded-t">
                        <div className="w-20 h-1.5 bg-gray-600 rounded-full"/>
                      </div>
                    )}
                    <iframe
                      srcDoc={t.htmlContent}
                      className="w-full border-0"
                      style={{ height: previewMode === 'mobile' ? 'calc(100vh - 240px)' : 'calc(90vh - 180px)' }}
                      title={`Preview: ${t.name}`}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-3.5 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            Đóng
          </button>
          <button className="px-5 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors">
            Cập nhật
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ADD NEW TEMPLATE MODAL
══════════════════════════════════════════════════════════ */
function AddModal({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState('')
  const [dragging, setDragging] = useState(false)

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">Thêm mẫu HTML mới</h2>
          <div className="flex bg-gray-200 rounded-lg p-0.5">
            <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-white text-gray-800 shadow-sm">Upload file</button>
            <button className="px-3 py-1.5 text-xs font-semibold rounded-md text-gray-400">Previews và nhập thông tin</button>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Tiêu đề */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tiêu đề mẫu</label>
            <input type="text" value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Nhập tên mẫu HTML..."
              className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] focus:ring-2 focus:ring-[#17a2b8]/10"/>
          </div>

          {/* Upload area */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false) }}
            className={`border-2 border-dashed rounded-xl p-10 text-center transition-all cursor-pointer
              ${dragging ? 'border-[#17a2b8] bg-[#e8f7f9]' : 'border-gray-300 hover:border-[#17a2b8] hover:bg-[#e8f7f9]/50'}`}>
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors
              ${dragging ? 'bg-[#17a2b8]' : 'bg-gray-100'}`}>
              <svg className={`w-7 h-7 transition-colors ${dragging ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              {dragging ? 'Thả file vào đây...' : 'Kéo thả file HTML vào đây'}
            </p>
            <p className="text-xs text-gray-400 mb-4">hoặc</p>
            <button className="px-5 py-2 bg-[#17a2b8] text-white text-sm font-semibold rounded-lg hover:bg-[#138496] transition-colors">
              Chọn file từ máy tính
            </button>
            <p className="text-[11px] text-gray-300 mt-3">Hỗ trợ: .html, .htm · Tối đa 10MB</p>
          </div>

          {/* Tips */}
          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-xs text-amber-700 font-semibold mb-1">💡 Lưu ý khi upload mẫu HTML</p>
            <ul className="text-[11px] text-amber-600 space-y-0.5 list-disc ml-4">
              <li>File HTML phải self-contained (CSS và JS nhúng trực tiếp)</li>
              <li>Ảnh nên dùng URL tuyệt đối hoặc base64</li>
              <li>Tránh dùng thư viện ngoài không có CDN</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            Đóng
          </button>
          <button disabled={!title.trim()}
            className="px-5 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            Tiếp tục
          </button>
        </div>
      </div>
    </div>
  )
}
