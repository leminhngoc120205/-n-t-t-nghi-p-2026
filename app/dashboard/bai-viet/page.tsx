'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'
import { IMSArticleTypeModal } from '@/components/IMS/IMSArticleTypeModal'

/* ─── Kiểu từ API (sau populate) ──────────────────────────── */
interface UserRef { _id: string; username: string; fullName: string }
interface CategoryRef { _id: string; name: string; slug: string }

interface Article {
  _id: string
  title: string
  sapo: string
  content: string
  thumbnail: string
  slug: string
  articleType: string
  status: string
  writerId:    UserRef | null
  editorId:    UserRef | null
  publisherId: UserRef | null
  categoryId:  CategoryRef | null
  source: string
  notes: string
  showOnHome: boolean
  isFeatured: boolean
  viewCount: number
  createdAt: string
  updatedAt: string
}

interface Log { time: string; user: string; action: string }

const TRANSITIONS: Record<string, { to: string; label: string; cls: string; roles: string[] }[]> = {
  draft:           [{ to: 'processing',      label: 'Nộp bài',      cls: 'bg-orange-500 hover:bg-orange-600 text-white',          roles: ['reporter','editor','admin'] }],
  processing:      [{ to: 'waiting_edit',    label: 'Gửi biên tập', cls: 'bg-blue-600 hover:bg-blue-700 text-white',               roles: ['editor','admin'] },
                    { to: 'returned',        label: 'Trả lại',      cls: 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200', roles: ['editor','admin'] }],
  waiting_edit:    [{ to: 'waiting_publish', label: 'Chuyển duyệt', cls: 'bg-purple-600 hover:bg-purple-700 text-white',          roles: ['editor','admin'] },
                    { to: 'returned',        label: 'Trả lại',      cls: 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200', roles: ['editor','admin'] }],
  waiting_publish: [{ to: 'published',       label: 'Xuất bản',     cls: 'bg-green-600 hover:bg-green-700 text-white',            roles: ['admin'] },
                    { to: 'returned',        label: 'Trả lại',      cls: 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-200', roles: ['admin','editor'] }],
  returned:        [{ to: 'processing',      label: 'Nộp lại',      cls: 'bg-orange-500 hover:bg-orange-600 text-white',          roles: ['reporter','editor','admin'] }],
  published:       [{ to: 'removed',         label: 'Gỡ xuống',     cls: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border border-orange-200', roles: ['admin'] }],
  removed:         [{ to: 'published',       label: 'Đăng lại',     cls: 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-200', roles: ['admin'] },
                    { to: 'deleted',         label: 'Xóa hẳn',      cls: 'bg-red-600 hover:bg-red-700 text-white',                roles: ['admin'] }],
}

const STATUS_GROUPS = [
  { label: 'TIN CỦA TÔI', items: [
    { id: 'draft',          label: 'Tin lưu tạm'       },
    { id: 'processing',     label: 'Tin nhận xử lý'    },
    { id: 'mine_published', label: 'Tin tôi xuất bản'  },
    { id: 'approved',       label: 'Tin bạn đã duyệt'  },
  ]},
  { label: 'TIN XỬ LÝ', items: [
    { id: 'waiting_edit',    label: 'Bài chờ biên tập'  },
    { id: 'waiting_publish', label: 'Bài chờ xuất bản'  },
    { id: 'published',       label: 'Bài đã xuất bản'   },
    { id: 'removed',         label: 'Bài bị gỡ xuống'   },
    { id: 'deleted',         label: 'Bài bị xóa'        },
    { id: 'returned',        label: 'Bài trả lại tôi'   },
  ]},
]

function BaiVietContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeStatus,  setActiveStatus]  = useState(() => searchParams.get('status') ?? 'published')
  const [articles,      setArticles]      = useState<Article[]>([])
  const [counts,        setCounts]        = useState<Record<string, number>>({})
  const [categories,    setCategories]    = useState<CategoryRef[]>([])
  const [loading,       setLoading]       = useState(true)
  const [selected,      setSelected]      = useState<Article | null>(null)
  const [showHistory,   setShowHistory]   = useState(false)
  const [search,        setSearch]        = useState('')
  const [showAdv,       setShowAdv]       = useState(false)
  const [catFilter,     setCatFilter]     = useState('')
  const [filterAuthor,  setFilterAuthor]  = useState('')
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [pagination,    setPagination]    = useState({ total: 0, page: 1, pages: 1 })
  const [userRole,      setUserRole]      = useState<string>('reporter')
  const [userId,        setUserId]        = useState<string>('')

  /* ── Fetch counts + categories + current user ── */
  useEffect(() => {
    fetch('/api/dashboard/count-news')
      .then(r => r.json())
      .then(d => { if (d.counts) setCounts(d.counts) })
      .catch(() => {})

    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { if (d.ok) setCategories(d.data) })
      .catch(() => {})

    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (d.user?.role) setUserRole(d.user.role)
        if (d.user?.id)   setUserId(d.user.id)
      })
      .catch(() => {})
  }, [])

  /* ── Fetch articles khi thay đổi filter ── */
  const fetchArticles = useCallback(async (status: string, cat: string, page = 1) => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: '20' })

      if (status === 'mine_published') {
        params.set('status', 'published')
        if (userId) params.set('writerId', userId)
      } else if (status === 'approved') {
        if (userId) params.set('editorId', userId)
      } else {
        params.set('status', status)
      }

      if (cat)          params.set('categoryId', cat)
      if (search)       params.set('search', search)
      if (filterAuthor) params.set('search', filterAuthor)

      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      if (data.ok) {
        setArticles(data.data)
        setPagination(data.pagination)
      }
    } catch { /* network error */ }
    setLoading(false)
  }, [search, filterAuthor])

  useEffect(() => {
    fetchArticles(activeStatus, catFilter)
  }, [activeStatus, catFilter, fetchArticles])

  /* ── Sau khi đổi trạng thái → refresh danh sách + counts ── */
  const handleStatusChange = useCallback((updated: Article) => {
    setArticles(list => list.map(a => a._id === updated._id ? updated : a))
    setSelected(updated)
    fetch('/api/dashboard/count-news')
      .then(r => r.json())
      .then(d => { if (d.counts) setCounts(d.counts) })
      .catch(() => {})
  }, [])

  /* ── Toggle helpers (optimistic, gọi API thật) ── */
  const toggleField = async (id: string, field: 'showOnHome' | 'isFeatured', current: boolean) => {
    setArticles(l => l.map(a => a._id === id ? { ...a, [field]: !current } : a))
    await fetch(`/api/articles/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
  }

  const activeLabel = STATUS_GROUPS.flatMap(g => g.items).find(i => i.id === activeStatus)?.label ?? 'Bài viết'

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />

      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />

        <main className="flex flex-1 overflow-hidden">

          {/* ── Cột lọc trái ── */}
          <aside className="w-56 min-h-full bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            {STATUS_GROUPS.map(g => (
              <div key={g.label} className="py-2">
                <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{g.label}</p>
                {g.items.map(item => {
                  const cnt = item.id === 'mine_published' ? (counts['published'] ?? 0) : (counts[item.id] ?? 0)
                  return (
                    <button key={item.id} onClick={() => setActiveStatus(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors border-l-[3px]
                        ${activeStatus === item.id
                          ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-[#17a2b8]'
                          : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}>
                      <span className="text-xs leading-tight">{item.label}</span>
                      {cnt > 0 && (
                        <span className="min-w-[22px] h-[18px] bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                          {cnt.toLocaleString('vi-VN')}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            ))}
          </aside>

          {/* ── Vùng nội dung ── */}
          <div className="flex-1 overflow-y-auto p-4">

            {/* Header */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <h1 className="text-base font-bold text-gray-800">{activeLabel}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {loading ? 'Đang tải...' : `${pagination.total.toLocaleString('vi-VN')} bài viết`}
                </p>
              </div>

              <select value={catFilter} onChange={e => setCatFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-600 focus:outline-none focus:border-[#17a2b8] cursor-pointer">
                <option value="">Tất cả chuyên mục</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <button onClick={() => setShowTypeModal(true)}
                className="flex items-center gap-2 bg-[#17a2b8] hover:bg-[#138496] text-white text-sm font-bold px-4 py-2 rounded transition-colors shadow-sm whitespace-nowrap">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                VIẾT BÀI MỚI
              </button>
            </div>

            {/* Tìm kiếm */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1 max-w-md">
                <input value={search} onChange={e => setSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && fetchArticles(activeStatus, catFilter)}
                  placeholder="Tìm kiếm theo từ khóa..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]"/>
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button onClick={() => fetchArticles(activeStatus, catFilter)}
                className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded hover:bg-[#138496] transition-colors">Tìm kiếm</button>
              <button onClick={() => setShowAdv(!showAdv)}
                className={`flex items-center gap-1.5 px-3 py-2 border text-sm rounded transition-colors
                  ${showAdv ? 'bg-[#e8f7f9] border-[#17a2b8] text-[#17a2b8]' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                Tìm nâng cao
              </button>
            </div>

            {showAdv && (
              <div className="bg-white border border-gray-200 rounded p-4 mb-3 grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Từ ngày</label>
                  <input type="date" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Đến ngày</label>
                  <input type="date" className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Người viết</label>
                  <input type="text" value={filterAuthor} onChange={e => setFilterAuthor(e.target.value)}
                    placeholder="Nhập tên người viết..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button onClick={() => { setFilterAuthor(''); setSearch('') }}
                    className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Đặt lại</button>
                  <button onClick={() => fetchArticles(activeStatus, catFilter)}
                    className="px-3 py-1.5 text-xs text-white bg-[#17a2b8] rounded hover:bg-[#138496]">Áp dụng</button>
                </div>
              </div>
            )}

            {/* Danh sách */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-[72px_1fr_100px_80px_80px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                {['Ảnh','Tiêu đề & Tác giả','Lượt xem','Hiển thị','Thao tác'].map((h, i) => (
                  <div key={h} className={`text-[10px] font-bold text-gray-400 uppercase tracking-wide ${i === 1 ? 'text-left' : 'text-center'}`}>{h}</div>
                ))}
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#17a2b8] border-t-transparent rounded-full animate-spin"/>
                  <p className="text-sm text-gray-400">Đang tải dữ liệu...</p>
                </div>
              ) : articles.length === 0 ? (
                <div className="py-16 text-center">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p className="text-sm text-gray-400">Không có bài viết nào trong mục này</p>
                </div>
              ) : articles.map((a, idx) => (
                <ArticleRow key={a._id} article={a} isLast={idx === articles.length - 1}
                  onSelect={() => { setSelected(a); setShowHistory(false) }}
                  onToggleHome={() => toggleField(a._id, 'showOnHome', a.showOnHome)}
                  onToggleFeatured={() => toggleField(a._id, 'isFeatured', a.isFeatured)}/>
              ))}
            </div>

            {/* Phân trang */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => fetchArticles(activeStatus, catFilter, p)}
                    className={`w-8 h-8 text-xs rounded transition-colors ${pagination.page === p ? 'bg-[#17a2b8] text-white' : 'bg-white border border-gray-300 text-gray-600 hover:border-[#17a2b8]'}`}>
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {selected && (
        <ArticleDetailPanel article={selected} showHistory={showHistory} userRole={userRole}
          onToggleHistory={() => setShowHistory(v => !v)}
          onClose={() => setSelected(null)}
          onEdit={() => router.push(`/dashboard/viet-bai-moi?id=${selected._id}`)}
          onStatusChange={handleStatusChange}/>
      )}

      {showTypeModal && <IMSArticleTypeModal onClose={() => setShowTypeModal(false)}/>}
    </div>
  )
}

export default function BaiVietPage() {
  return (
    <Suspense fallback={null}>
      <BaiVietContent />
    </Suspense>
  )
}

/* ═══════════════════════════════════════════════════════════
   HÀNG BÀI VIẾT
══════════════════════════════════════════════════════════ */
const CAT_PALETTES = [
  'from-red-500 to-rose-600',
  'from-orange-500 to-amber-600',
  'from-green-500 to-emerald-700',
  'from-teal-500 to-cyan-600',
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-violet-600',
  'from-pink-500 to-rose-500',
  'from-yellow-500 to-orange-500',
  'from-cyan-500 to-blue-600',
  'from-lime-500 to-green-600',
]

function catGradient(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0x7fffffff
  return CAT_PALETTES[h % CAT_PALETTES.length]
}

function catInitials(name: string) {
  return name.split(/\s+/).map(w => w[0] ?? '').join('').slice(0, 2).toUpperCase() || 'BV'
}

function ArticleRow({ article: a, isLast, onSelect, onToggleHome, onToggleFeatured }: {
  article: Article; isLast: boolean
  onSelect: () => void; onToggleHome: () => void; onToggleFeatured: () => void
}) {
  const writer    = a.writerId?.username    ?? '—'
  const editor    = a.editorId?.username    ?? null
  const publisher = a.publisherId?.username ?? null
  const category  = a.categoryId?.name     ?? '—'
  const date      = new Date(a.createdAt).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })

  const workflow = [
    `Viết bởi ${writer}`,
    editor    && `Biên tập bởi ${editor}`,
    publisher && `Xuất bản bởi ${publisher}`,
  ].filter(Boolean).join(' · ')

  return (
    <div className={`grid grid-cols-[72px_1fr_100px_80px_80px] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${!isLast ? 'border-b border-gray-100' : ''}`}>

      <div className="w-[68px] h-12 rounded overflow-hidden flex-shrink-0 relative">
        {a.thumbnail
          ? <img src={a.thumbnail} alt="" className="w-full h-full object-cover"
              onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}/>
          : <div className={`w-full h-full bg-gradient-to-br ${catGradient(category)} flex flex-col items-center justify-center gap-0.5`}>
              <span className="text-white font-bold text-sm leading-none tracking-wider drop-shadow">{catInitials(category)}</span>
              {a.isFeatured && <span className="text-yellow-200 text-[9px] leading-none">★</span>}
            </div>
        }
        {a.isFeatured && a.thumbnail && (
          <div className="absolute top-0.5 right-0.5 bg-yellow-400 rounded-sm px-0.5 leading-none">
            <span className="text-yellow-900 text-[8px] font-bold">★</span>
          </div>
        )}
      </div>

      <div className="min-w-0">
        <button onClick={onSelect}
          className="text-sm font-semibold text-gray-800 hover:text-[#17a2b8] transition-colors text-left leading-snug line-clamp-2 w-full">
          {a.title}
        </button>
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1">
          <span className="text-xs text-gray-400">{date}</span>
          <span className="text-gray-300">•</span>
          <span className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded font-medium">{category}</span>
          <StatusBadge status={a.status}/>
        </div>
        <p className="text-[10px] text-gray-400 mt-1 truncate">{workflow}</p>
      </div>

      <div className="text-center">
        <span className="text-xs text-gray-600 font-medium">{a.viewCount > 0 ? a.viewCount.toLocaleString('vi-VN') : '—'}</span>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <Tip text={a.showOnHome ? 'Đang hiển thị trang chủ' : 'Hiển thị trang chủ'}>
          <button onClick={onToggleHome}
            className={`p-1.5 rounded transition-colors ${a.showOnHome ? 'text-[#17a2b8] bg-[#e8f7f9]' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
        </Tip>
        <Tip text={a.isFeatured ? 'Bài nổi bật' : 'Đánh dấu nổi bật'}>
          <button onClick={onToggleFeatured}
            className={`p-1.5 rounded transition-colors ${a.isFeatured ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg className="w-4 h-4" fill={a.isFeatured ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </button>
        </Tip>
      </div>

      <div className="flex items-center justify-center gap-1">
        <Tip text="Xem chi tiết">
          <button onClick={onSelect} className="p-1.5 text-gray-400 hover:text-[#17a2b8] hover:bg-[#e8f7f9] rounded transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
        </Tip>
        <Tip text="Sửa bài">
          <button className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
        </Tip>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   PANEL CHI TIẾT BÀI VIẾT
══════════════════════════════════════════════════════════ */
function ArticleDetailPanel({ article: a, showHistory, userRole, onToggleHistory, onClose, onEdit, onStatusChange }: {
  article: Article; showHistory: boolean; userRole: string
  onToggleHistory: () => void; onClose: () => void; onEdit: () => void
  onStatusChange: (updated: Article) => void
}) {
  const [infoTab,       setInfoTab]       = useState<'basic' | 'dist'>('basic')
  const [logs,          setLogs]          = useState<Log[]>([])
  const [transitioning, setTransitioning] = useState(false)
  const [statusToast,   setStatusToast]   = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showStatusToast = (msg: string, type: 'ok' | 'err') => {
    setStatusToast({ msg, type })
    setTimeout(() => setStatusToast(null), 3000)
  }

  const handleTransition = async (to: string) => {
    setTransitioning(true)
    try {
      const res = await fetch(`/api/articles/${a._id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to }),
      })
      const data = await res.json()
      if (!data.ok) { showStatusToast(data.error || 'Lỗi khi đổi trạng thái', 'err'); return }
      showStatusToast('Đã cập nhật trạng thái!', 'ok')
      onStatusChange({ ...a, status: to })
    } catch {
      showStatusToast('Lỗi kết nối máy chủ', 'err')
    } finally {
      setTransitioning(false)
    }
  }

  const availableTransitions = (TRANSITIONS[a.status] ?? []).filter(t => t.roles.includes(userRole))

  useEffect(() => {
    if (!showHistory) return
    fetch(`/api/logs?objectType=article`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          const filtered = d.data.filter((l: { objectId: string }) => l.objectId === a._id)
          setLogs(filtered.map((l: { createdAt: string; userId: string; actionType: string }) => ({
            time: new Date(l.createdAt).toLocaleString('vi-VN'),
            user: l.userId,
            action: l.actionType,
          })))
        }
      })
      .catch(() => {})
  }, [showHistory, a._id])

  const writer    = a.writerId?.username    ?? '—'
  const editor    = a.editorId?.username    ?? null
  const publisher = a.publisherId?.username ?? null
  const category  = a.categoryId?.name     ?? '—'
  const date      = new Date(a.createdAt).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="flex-1 bg-black/50" onClick={onClose}/>
      <div className="w-[860px] bg-white flex flex-col shadow-2xl overflow-hidden">

        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 flex-shrink-0 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h2 className="text-sm font-bold text-gray-800 truncate">{a.title}</h2>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onToggleHistory}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors
                ${showHistory ? 'bg-[#17a2b8] text-white border-[#17a2b8]' : 'border-gray-300 text-gray-600 hover:border-[#17a2b8] hover:text-[#17a2b8]'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Xem lịch sử
            </button>
          </div>
        </div>

        {showHistory && (
          <div className="border-b border-gray-200 flex-shrink-0 px-5 py-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Log hành động</p>
            {logs.length === 0 ? <p className="text-xs text-gray-400">Chưa có log.</p> : (
              <table className="w-full text-xs border-collapse">
                <thead><tr className="bg-gray-50">
                  {['Thời gian','User','Hành động'].map(h => <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500 border border-gray-200">{h}</th>)}
                </tr></thead>
                <tbody>{logs.map((l, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-3 py-2 border border-gray-100 font-mono text-gray-500 whitespace-nowrap">{l.time}</td>
                    <td className="px-3 py-2 border border-gray-100 text-[#17a2b8] font-medium">{l.user}</td>
                    <td className="px-3 py-2 border border-gray-100 text-gray-600">{l.action}</td>
                  </tr>
                ))}</tbody>
              </table>
            )}
          </div>
        )}

        <div className="flex flex-1 overflow-hidden min-h-0">
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded uppercase tracking-wide">{category}</span>
              <StatusBadge status={a.status}/>
              <span className="text-xs text-gray-400">{a.articleType}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4" style={{ fontFamily: 'var(--font-serif), Lora, serif' }}>{a.title}</h1>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 flex-wrap">
              <WorkflowTag icon="✍️" label="Viết bởi" name={writer}/>
              {editor    && <WorkflowTag icon="✏️" label="Biên tập bởi" name={editor}/>}
              {publisher && <WorkflowTag icon="📢" label="Xuất bản bởi" name={publisher}/>}
              <span className="text-xs text-gray-400 ml-auto">{date}</span>
            </div>
            {a.sapo && <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-5 p-3 bg-gray-50 border-l-4 border-[#17a2b8] rounded-r">{a.sapo}</p>}
            <div
              className="text-sm text-gray-700 leading-relaxed article-content"
              dangerouslySetInnerHTML={{ __html: a.content || '' }}
            />
            {a.source && <p className="mt-6 text-xs text-gray-400 italic border-t border-gray-100 pt-4">Nguồn: {a.source}</p>}
          </div>

          <div className="w-72 border-l border-gray-200 overflow-y-auto flex-shrink-0 bg-white">
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
              {(['basic','dist'] as const).map(t => (
                <button key={t} onClick={() => setInfoTab(t)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${infoTab === t ? 'text-[#17a2b8] border-b-2 border-[#17a2b8]' : 'text-gray-500 hover:text-gray-700'}`}>
                  {t === 'basic' ? 'THÔNG TIN CƠ BẢN' : 'PHÂN PHỐI'}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 space-y-2.5">
              {infoTab === 'basic' ? <>
                <IR label="Dạng bài"      value={a.articleType}/>
                <IR label="Tác giả"       value={writer}/>
                {editor    && <IR label="Biên tập"  value={editor}/>}
                {publisher && <IR label="Xuất bản"  value={publisher}/>}
                <IR label="Ngày tạo"      value={date}/>
                <IR label="Nguồn tin"     value={a.source || '—'}/>
                <IR label="Lượt xem"      value={a.viewCount > 0 ? a.viewCount.toLocaleString('vi-VN') : '0'}/>
                {a.notes && <IR label="Ghi chú" value={a.notes}/>}
              </> : <>
                <IR label="Chuyên mục"    value={category}/>
                <div className="border-t border-gray-100 pt-2 mt-2 space-y-2.5">
                  <TR label="Hiển thị trang chủ" on={a.showOnHome}/>
                  <TR label="Tin tiêu điểm"       on={a.isFeatured}/>
                  <TR label="Bài đăng chéo"       on={a.status === 'cross_post'}/>
                </div>
              </>}
            </div>
          </div>
        </div>

        {/* ── Footer: status badge + transition buttons + actions ── */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0 gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={a.status}/>
            {a.viewCount > 0 && <span className="text-xs text-gray-400">{a.viewCount.toLocaleString('vi-VN')} lượt xem</span>}

            {/* Nút chuyển trạng thái */}
            {availableTransitions.map(t => (
              <button
                key={t.to}
                onClick={() => handleTransition(t.to)}
                disabled={transitioning}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${t.cls}`}
              >
                {transitioning && (
                  <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                )}
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors">Đóng</button>
            {a.status === 'published' && a.slug && (
              <a
                href={`/bai-viet/${a.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 text-sm font-semibold border border-[#17a2b8] text-[#17a2b8] rounded hover:bg-[#e8f7f9] transition-colors"
              >
                Xem trang bài viết ↗
              </a>
            )}
            {['draft','returned','processing','waiting_edit','waiting_publish'].includes(a.status) && (
              <button onClick={onEdit} className="px-4 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded hover:bg-[#138496] transition-colors">Sửa bài</button>
            )}
          </div>
        </div>

        {/* Toast trạng thái */}
        {statusToast && (
          <div className={`absolute bottom-16 right-4 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-white text-xs font-semibold z-50 transition-all ${
            statusToast.type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'
          }`}>
            {statusToast.type === 'ok'
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            }
            {statusToast.msg}
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Helpers ─────────────────────────────────────────────── */
function WorkflowTag({ icon, label, name }: { icon: string; label: string; name: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <span>{icon}</span><span>{label}</span>
      <span className="font-semibold text-gray-700">{name}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const m: Record<string, { label: string; cls: string }> = {
    published:       { label: 'Đã xuất bản',  cls: 'bg-green-100 text-green-700' },
    mine_published:  { label: 'Đã xuất bản',  cls: 'bg-green-100 text-green-700' },
    waiting_publish: { label: 'Chờ xuất bản', cls: 'bg-yellow-100 text-yellow-700' },
    waiting_edit:    { label: 'Chờ biên tập', cls: 'bg-blue-100 text-blue-700' },
    draft:           { label: 'Lưu tạm',      cls: 'bg-gray-100 text-gray-600' },
    processing:      { label: 'Nhận xử lý',   cls: 'bg-purple-100 text-purple-700' },
    approved:        { label: 'Đã duyệt',     cls: 'bg-teal-100 text-teal-700' },
    cross_post:      { label: 'Đăng chéo',    cls: 'bg-indigo-100 text-indigo-700' },
    removed:         { label: 'Bị gỡ xuống',  cls: 'bg-orange-100 text-orange-700' },
    deleted:         { label: 'Đã xóa',       cls: 'bg-red-200 text-red-800' },
    returned:        { label: 'Bị trả lại',   cls: 'bg-red-100 text-red-600' },
    in_progress:     { label: 'Đang xử lý',   cls: 'bg-cyan-100 text-cyan-700' },
    magazine:        { label: 'Magazine',      cls: 'bg-pink-100 text-pink-700' },
  }
  const { label, cls } = m[status] ?? { label: status, cls: 'bg-gray-100 text-gray-600' }
  return <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${cls}`}>{label}</span>
}

function Tip({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap z-30 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        {text}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"/>
      </div>
    </div>
  )
}
function Tog({ on }: { on: boolean }) {
  return <div className={`w-8 h-4 rounded-full transition-colors ${on ? 'bg-[#17a2b8]' : 'bg-gray-300'}`}><div className={`w-3 h-3 bg-white rounded-full mt-0.5 shadow transition-transform ${on ? 'translate-x-4' : 'translate-x-0.5'}`}/></div>
}
function IR({ label, value }: { label: string; value: React.ReactNode }) {
  return <div className="flex items-center justify-between gap-2 py-0.5"><span className="text-xs text-gray-500 flex-shrink-0">{label}</span><span className="text-xs font-medium text-gray-800 text-right max-w-[150px] truncate">{value}</span></div>
}
function TR({ label, on }: { label: string; on: boolean }) {
  return <div className="flex items-center justify-between"><span className="text-xs text-gray-500">{label}</span><Tog on={on}/></div>
}
