'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

/* ─── Types ─────────────────────────────────────────────── */
type PodcastStatus =
  | 'draft' | 'processing' | 'mine_published' | 'returned'
  | 'waiting_edit' | 'waiting_publish' | 'published' | 'removed' | 'deleted'

interface Podcast {
  id: number; title: string; author: string; date: string
  status: PodcastStatus; duration: string; durationSecs: number
  showOnHome: boolean; isFeatured: boolean; views: number
  description: string; source: string; notes: string; category: string
}
interface Log { time: string; user: string; action: string }

/* ─── Sample data ────────────────────────────────────────── */
const INIT_PODCASTS: Podcast[] = [
  { id:1, title:'Vì sao rằm tháng giêng được gọi là Tết Nguyên tiêu?', author:'NGOCLM_VCC', date:'14/02/2024 08:30', status:'published', duration:'2:59', durationSecs:179, showOnHome:true,  isFeatured:false, views:1203, description:'Tết Nguyên tiêu hay còn gọi là Tết rằm tháng Giêng — lễ tết quan trọng trong văn hóa người Việt. Hãy cùng tìm hiểu nguồn gốc và ý nghĩa của ngày lễ đặc biệt này.', source:'VCC News', notes:'', category:'Podcast' },
  { id:2, title:'Hà Nội sẽ có thêm 2 tuyến metro trong năm 2025', author:'dinhluong_vcc', date:'12/02/2024 14:15', status:'published', duration:'3:45', durationSecs:225, showOnHome:false, isFeatured:true,  views:856,  description:'Hà Nội đang đẩy nhanh tiến độ xây dựng hai tuyến metro mới nhằm giải quyết vấn đề ùn tắc giao thông trong nội đô thành phố.', source:'VCC News', notes:'Cần kiểm tra lại số liệu', category:'Podcast' },
  { id:3, title:'Công nghệ AI thay đổi ngành báo chí như thế nào?', author:'NGOCLM_VCC', date:'10/02/2024 09:00', status:'waiting_publish', duration:'4:12', durationSecs:252, showOnHome:true,  isFeatured:false, views:432,  description:'AI đang dần thay thế nhiều công việc trong ngành báo chí, từ viết tin tự động đến phân tích dữ liệu lớn với tốc độ và độ chính xác vượt trội.', source:'VCC News', notes:'', category:'Podcast' },
]

const LOGS: Log[] = [
  { time:'14/02/2024 09:15:23', user:'dinhluong_vcc', action:'Sửa bài — Cập nhật tiêu đề và mô tả' },
  { time:'14/02/2024 08:45:10', user:'NGOCLM_VCC',   action:'Xuất bản bài viết' },
  { time:'13/02/2024 16:30:05', user:'dinhluong_vcc', action:'Gửi duyệt bài' },
  { time:'13/02/2024 15:20:00', user:'dinhluong_vcc', action:'Tạo bài viết mới' },
]

const GROUPS = [
  { label:'TIN CỦA TÔI', items:[
    { id:'draft',          label:'Podcast lưu tạm',       count:0   },
    { id:'processing',     label:'Podcast nhận xử lý',    count:0   },
    { id:'mine_published', label:'Podcast tôi xuất bản',  count:103 },
    { id:'returned',       label:'Podcast bị trả lại',    count:0   },
  ]},
  { label:'TIN XỬ LÝ', items:[
    { id:'waiting_edit',    label:'Podcast chờ biên tập', count:0   },
    { id:'waiting_publish', label:'Podcast chờ xuất bản', count:1   },
    { id:'published',       label:'Podcast đã xuất bản',  count:103 },
    { id:'removed',         label:'Podcast bị gỡ xuống',  count:0   },
    { id:'deleted',         label:'Podcast bị xóa',       count:0   },
  ]},
]

/* ═══════════════════════════════════════════════════════════ PAGE */
export default function PodcastPage() {
  const router = useRouter()
  const [activeStatus, setActiveStatus] = useState('published')
  const [selected,     setSelected]     = useState<Podcast | null>(null)
  const [showHistory,  setShowHistory]  = useState(false)
  const [search,       setSearch]       = useState('')
  const [showAdv,      setShowAdv]      = useState(false)
  const [filterAuthor, setFilterAuthor] = useState('')
  const [podcasts,     setPodcasts]     = useState<Podcast[]>(INIT_PODCASTS)

  const filtered = podcasts.filter(p => {
    const okStatus = activeStatus === 'published' || activeStatus === 'mine_published'
      ? p.status === 'published' || p.status === 'mine_published'
      : p.status === activeStatus
    return okStatus
      && (!search || p.title.toLowerCase().includes(search.toLowerCase()))
      && (!filterAuthor || p.author.toLowerCase().includes(filterAuthor.toLowerCase()))
  })

  const activeLabel = GROUPS.flatMap(g => g.items).find(i => i.id === activeStatus)?.label ?? 'Podcast'
  const toggleHome     = (id: number) => setPodcasts(l => l.map(p => p.id===id ? {...p, showOnHome: !p.showOnHome}  : p))
  const toggleFeatured = (id: number) => setPodcasts(l => l.map(p => p.id===id ? {...p, isFeatured: !p.isFeatured} : p))

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />
        <main className="flex flex-1 overflow-hidden">

          {/* Cột lọc trái */}
          <aside className="w-56 min-h-full bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            {GROUPS.map(g => (
              <div key={g.label} className="py-3">
                <p className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">{g.label}</p>
                {g.items.map(item => (
                  <button key={item.id} onClick={() => setActiveStatus(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors border-l-[3px]
                      ${activeStatus===item.id ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-[#17a2b8]' : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}>
                    <span className="text-xs leading-tight">{item.label}</span>
                    {item.count>0 && (
                      <span className="min-w-[22px] h-[18px] bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                        {item.count}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </aside>

          {/* Vùng nội dung */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-base font-bold text-gray-800">{activeLabel}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {filtered.length > 0 ? `1 đến ${filtered.length} trong ${filtered.length}` : 'Không có kết quả'}
                </p>
              </div>
              <button onClick={() => router.push('/dashboard/podcast/tao-moi')}
                className="flex items-center gap-2 bg-[#17a2b8] hover:bg-[#138496] text-white text-sm font-bold px-4 py-2 rounded transition-colors shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                </svg>
                TẠO PODCAST MỚI
              </button>
            </div>

            {/* Tìm kiếm */}
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1 max-w-md">
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm theo từ khóa..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]"/>
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded hover:bg-[#138496] transition-colors">Tìm kiếm</button>
              <button onClick={() => setShowAdv(!showAdv)}
                className={`flex items-center gap-1.5 px-3 py-2 border text-sm rounded transition-colors
                  ${showAdv ? 'bg-[#e8f7f9] border-[#17a2b8] text-[#17a2b8]' : 'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
                </svg>
                Tìm nâng cao
                <svg className={`w-3 h-3 transition-transform ${showAdv?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
            </div>

            {/* Tìm nâng cao */}
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Tác giả</label>
                  <input type="text" value={filterAuthor} onChange={e=>setFilterAuthor(e.target.value)} placeholder="Nhập tên tác giả..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button onClick={()=>setFilterAuthor('')} className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Đặt lại</button>
                  <button className="px-3 py-1.5 text-xs text-white bg-[#17a2b8] rounded hover:bg-[#138496]">Áp dụng</button>
                </div>
              </div>
            )}

            {/* Bảng danh sách */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              <div className="grid grid-cols-[64px_1fr_88px_80px_80px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                {['Ảnh','Tiêu đề','Thời lượng','Hiển thị','Thao tác'].map((h,i) => (
                  <div key={h} className={`text-[10px] font-bold text-gray-400 uppercase tracking-wide ${i>0?'text-center':''}`}>{h}</div>
                ))}
              </div>
              {filtered.length===0 ? (
                <div className="py-16 text-center">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 016 0v4a3 3 0 01-6 0z"/>
                  </svg>
                  <p className="text-sm text-gray-400">Không có podcast nào trong mục này</p>
                </div>
              ) : filtered.map((p,idx) => (
                <PodcastRow key={p.id} podcast={p} isLast={idx===filtered.length-1}
                  onSelect={()=>{setSelected(p);setShowHistory(false)}}
                  onToggleHome={()=>toggleHome(p.id)}
                  onToggleFeatured={()=>toggleFeatured(p.id)}/>
              ))}
            </div>
          </div>
        </main>
      </div>

      {selected && (
        <DetailModal podcast={selected} logs={LOGS} showHistory={showHistory}
          onToggleHistory={()=>setShowHistory(v=>!v)}
          onClose={()=>setSelected(null)}
          onEdit={()=>router.push(`/dashboard/podcast/tao-moi?id=${selected.id}`)}/>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════ ROW */
function PodcastRow({ podcast:p, isLast, onSelect, onToggleHome, onToggleFeatured }:{
  podcast:Podcast; isLast:boolean; onSelect:()=>void; onToggleHome:()=>void; onToggleFeatured:()=>void
}) {
  return (
    <div className={`grid grid-cols-[64px_1fr_88px_80px_80px] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${!isLast?'border-b border-gray-100':''}`}>
      <div className="w-16 h-11 rounded bg-gradient-to-br from-[#17c3d8] to-[#0e7c8a] flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z"/>
          <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/>
        </svg>
      </div>

      <div className="min-w-0">
        <button onClick={onSelect} className="text-sm font-semibold text-gray-800 hover:text-[#17a2b8] transition-colors text-left leading-snug line-clamp-2 w-full">
          {p.title}
        </button>
        <div className="flex items-center flex-wrap gap-2 mt-1">
          <span className="text-xs text-gray-400">{p.author}</span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-400">{p.date}</span>
          <StatusBadge status={p.status}/>
        </div>
      </div>

      <div className="text-center">
        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded">{p.duration}</span>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        <Tip text={p.showOnHome?'Đang hiển thị trên trang chủ':'Hiển thị trên trang chủ'}>
          <button onClick={onToggleHome}
            className={`p-1.5 rounded transition-colors ${p.showOnHome?'text-[#17a2b8] bg-[#e8f7f9]':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
        </Tip>
        <Tip text={p.isFeatured?'Bài nổi bật':'Đánh dấu nổi bật'}>
          <button onClick={onToggleFeatured}
            className={`p-1.5 rounded transition-colors ${p.isFeatured?'text-yellow-500 bg-yellow-50':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg className="w-4 h-4" fill={p.isFeatured?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24">
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

/* ═══════════════════════════════════════════════════════════ MODAL */
function DetailModal({ podcast:p, logs, showHistory, onToggleHistory, onClose, onEdit }:{
  podcast:Podcast; logs:Log[]; showHistory:boolean
  onToggleHistory:()=>void; onClose:()=>void; onEdit:()=>void
}) {
  const [playing, setPlaying] = useState(false)
  const [cur,     setCur]     = useState(0)
  const [vol,     setVol]     = useState(80)
  const [showVol, setShowVol] = useState(false)
  const [tab,     setTab]     = useState<'basic'|'dist'>('basic')
  const timer = useRef<ReturnType<typeof setInterval>|null>(null)
  const dur = p.durationSecs

  useEffect(()=>(()=>{ if(timer.current) clearInterval(timer.current) }),[])
  useEffect(()=>{ setPlaying(false); setCur(0); if(timer.current) clearInterval(timer.current) },[p.id])

  const togglePlay = () => {
    if(playing){ clearInterval(timer.current!); setPlaying(false) }
    else {
      setPlaying(true)
      timer.current = setInterval(()=>setCur(t=>{ if(t>=dur){clearInterval(timer.current!);setPlaying(false);return 0} return t+1 }),1000)
    }
  }
  const skip = (s:number) => setCur(t=>Math.max(0,Math.min(dur,t+s)))
  const fmt  = (s:number) => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`
  const pct  = dur>0?(cur/dur)*100:0

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="flex-1 bg-black/50" onClick={onClose}/>
      <div className="w-[820px] bg-white flex flex-col shadow-2xl animate-slide-in-right overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 flex-shrink-0 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            </button>
            <h2 className="text-sm font-bold text-gray-800 truncate">{p.title}</h2>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={onToggleHistory}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded border transition-colors
                ${showHistory?'bg-[#17a2b8] text-white border-[#17a2b8]':'border-gray-300 text-gray-600 hover:border-[#17a2b8] hover:text-[#17a2b8]'}`}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              Xem lịch sử
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-600 hover:border-[#17a2b8] hover:text-[#17a2b8] rounded transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              So sánh phiên bản
            </button>
          </div>
        </div>

        {/* Log lịch sử */}
        {showHistory && (
          <div className="border-b border-gray-200 flex-shrink-0 px-5 py-3">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Log hành động</p>
            <table className="w-full text-xs border-collapse">
              <thead><tr className="bg-gray-50">
                {['Thời gian','User','Hành động'].map(h=>(
                  <th key={h} className="text-left px-3 py-2 font-semibold text-gray-500 border border-gray-200">{h}</th>
                ))}
              </tr></thead>
              <tbody>{logs.map((l,i)=>(
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 border border-gray-100 font-mono text-gray-500 whitespace-nowrap">{l.time}</td>
                  <td className="px-3 py-2 border border-gray-100 text-[#17a2b8] font-medium">{l.user}</td>
                  <td className="px-3 py-2 border border-gray-100 text-gray-600">{l.action}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}

        {/* Body */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Player */}
          <div className="flex-1 flex flex-col bg-[#0d1b2a]">
            <div className="flex-1 flex items-center justify-center px-10 py-8 relative overflow-hidden">
              {playing && [0,1,2].map(i=>(
                <div key={i} className="absolute rounded-full border border-[#17c3d8]/25 pulse-wave"
                  style={{width:`${110+i*70}px`,height:`${110+i*70}px`,animationDelay:`${i*0.6}s`}}/>
              ))}
              <div className="relative z-10 text-center max-w-xs">
                <div className="w-24 h-24 mx-auto mb-5 rounded-full flex items-center justify-center transition-all"
                  style={{ background:'linear-gradient(135deg,#17c3d8,#0e7c8a)', boxShadow:playing?'0 0 40px rgba(23,195,216,0.45)':'0 4px 20px rgba(0,0,0,0.4)' }}>
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z"/>
                    <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/>
                  </svg>
                </div>
                <h3 className="text-white font-bold text-sm leading-snug mb-1">{p.title}</h3>
                <p className="text-[#17c3d8] text-xs font-medium mb-3">{p.author}</p>
                <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{p.description}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="bg-[#111827] px-6 py-4 flex-shrink-0">
              <div className="mb-3">
                <div className="relative w-full h-1.5 bg-gray-600 rounded-full cursor-pointer group"
                  onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setCur(Math.floor(((e.clientX-r.left)/r.width)*dur))}}>
                  <div className="h-full bg-[#17c3d8] rounded-full relative" style={{width:`${pct}%`}}>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity -translate-x-1/2"/>
                  </div>
                </div>
                <div className="flex justify-between mt-1.5">
                  <span className="text-[10px] text-gray-400 font-mono">{fmt(cur)}</span>
                  <span className="text-[10px] text-gray-400 font-mono">{p.duration}</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-6">
                <button onClick={()=>skip(-10)} className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z"/>
                  </svg>
                  <span className="text-[9px] mt-0.5">10s</span>
                </button>
                <button onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-[#17c3d8] hover:bg-[#14b0c3] text-white flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95">
                  {playing
                    ? <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
                    : <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>}
                </button>
                <button onClick={()=>skip(10)} className="flex flex-col items-center text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"/>
                  </svg>
                  <span className="text-[9px] mt-0.5">10s</span>
                </button>
                <div className="relative">
                  <button onClick={()=>setShowVol(v=>!v)} className="text-gray-400 hover:text-white transition-colors ml-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {vol===0
                        ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/>
                        : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 6.343A8 8 0 0120 12a8 8 0 01-2.343 5.657M15.536 8.464a5 5 0 010 7.072"/></>}
                    </svg>
                  </button>
                  {showVol && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 bg-[#1e293b] border border-gray-600 rounded-lg p-3 flex flex-col items-center gap-2 z-30 shadow-xl">
                      <span className="text-[10px] text-gray-300 font-mono">{vol}%</span>
                      <input type="range" min={0} max={100} value={vol} onChange={e=>setVol(Number(e.target.value))}
                        className="accent-[#17c3d8] cursor-pointer"
                        style={{writingMode:'vertical-lr',direction:'rtl',height:'80px'}}/>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Info panel */}
          <div className="w-72 border-l border-gray-200 overflow-y-auto flex-shrink-0 bg-white">
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
              {(['basic','dist'] as const).map(t=>(
                <button key={t} onClick={()=>setTab(t)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab===t?'text-[#17a2b8] border-b-2 border-[#17a2b8]':'text-gray-500 hover:text-gray-700'}`}>
                  {t==='basic'?'THÔNG TIN CƠ BẢN':'PHÂN PHỐI'}
                </button>
              ))}
            </div>
            <div className="px-4 py-3 space-y-2.5">
              {tab==='basic' ? <>
                <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#0e7c8a] flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z"/>
                      <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/>
                    </svg>
                  </div>
                  <div><p className="text-xs font-medium text-gray-700">Ảnh đại diện</p><button className="text-[10px] text-[#17a2b8] mt-0.5">Thay đổi ảnh</button></div>
                </div>
                <IR label="Cho hiển thị avatar" value={<Toggle on={p.showOnHome}/>}/>
                <IR label="Dạng bài"       value="Podcast"/>
                <IR label="Tác giả"        value={p.author}/>
                <IR label="Ngày xuất bản"  value={p.date}/>
                <IR label="Nguồn tin"      value={p.source}/>
                <IR label="Thời lượng"     value={p.duration}/>
                <IR label="Lượt xem"       value={p.views.toLocaleString()}/>
                {p.notes && <IR label="Ghi chú" value={p.notes}/>}
              </> : <>
                <IR label="Chuyên mục chính" value="Podcast"/>
                <IR label="Dòng sự kiện"     value="—"/>
                <IR label="Chủ đề"           value="—"/>
                <div className="border-t border-gray-100 pt-2 mt-2 space-y-2.5">
                  <TR label="Bài nhạy cảm"       on={false}/>
                  <TR label="Hiển thị trang chủ" on={p.showOnHome}/>
                  <TR label="Tin tiêu điểm"       on={p.isFeatured}/>
                  <TR label="Bài AdStore"         on={false}/>
                  <TR label="Bài PR"              on={false}/>
                </div>
              </>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={p.status}/>
            <span className="text-xs text-gray-400">{p.views.toLocaleString()} lượt xem</span>
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors">Đóng</button>
            <button onClick={onEdit}  className="px-4 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded hover:bg-[#138496] transition-colors">Sửa</button>
            <button className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded hover:bg-red-600 transition-colors">Gỡ bài</button>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Shared mini-components ─────────────────────────────── */
function StatusBadge({ status }:{ status:PodcastStatus }) {
  const m:Record<PodcastStatus,{label:string;cls:string}> = {
    published:      {label:'Đã xuất bản', cls:'bg-green-100 text-green-700'},
    mine_published: {label:'Đã xuất bản', cls:'bg-green-100 text-green-700'},
    waiting_publish:{label:'Chờ xuất bản',cls:'bg-yellow-100 text-yellow-700'},
    waiting_edit:   {label:'Chờ biên tập',cls:'bg-blue-100 text-blue-700'},
    draft:          {label:'Lưu tạm',     cls:'bg-gray-100 text-gray-600'},
    processing:     {label:'Nhận xử lý',  cls:'bg-purple-100 text-purple-700'},
    returned:       {label:'Bị trả lại',  cls:'bg-red-100 text-red-600'},
    removed:        {label:'Bị gỡ xuống', cls:'bg-orange-100 text-orange-700'},
    deleted:        {label:'Đã xóa',      cls:'bg-red-200 text-red-800'},
  }
  const {label,cls}=m[status]
  return <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${cls}`}>{label}</span>
}
function Tip({text,children}:{text:string;children:React.ReactNode}) {
  return (
    <div className="relative group inline-flex">
      {children}
      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap z-30 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
        {text}<div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"/>
      </div>
    </div>
  )
}
function Toggle({on}:{on:boolean}) {
  return <div className={`w-8 h-4 rounded-full transition-colors ${on?'bg-[#17a2b8]':'bg-gray-300'}`}><div className={`w-3 h-3 bg-white rounded-full mt-0.5 shadow transition-transform ${on?'translate-x-4':'translate-x-0.5'}`}/></div>
}
function IR({label,value}:{label:string;value:React.ReactNode}) {
  return <div className="flex items-center justify-between gap-2 py-0.5"><span className="text-xs text-gray-500 flex-shrink-0">{label}</span><span className="text-xs font-medium text-gray-800 text-right">{value}</span></div>
}
function TR({label,on}:{label:string;on:boolean}) {
  return <div className="flex items-center justify-between"><span className="text-xs text-gray-500">{label}</span><Toggle on={on}/></div>
}
