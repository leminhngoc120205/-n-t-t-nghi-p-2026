'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

/* ═══════════════════════════════════════════════════════════
   CẤU HÌNH MENU
══════════════════════════════════════════════════════════ */
const MENUS = [
  { id: 'log-action',      label: 'Log Action' },
  { id: 'nguoi-dung',      label: 'Quản lý người dùng' },
  { id: 'phong-ban',       label: 'Quản lý phòng ban' },
  { id: 'menu-chuyen-muc', label: 'Quản lý chuyên mục' },
  { id: 'dong-su-kien',    label: 'Quản lý dòng sự kiện' },
  { id: 'tro-ly-tin',      label: 'Quản lý người dùng trợ lý tin' },
  { id: 'profile-tac-gia', label: 'Quản lý profile tác giả' },
  { id: 'chu-de',          label: 'Quản lý chủ đề' },
  { id: 'chuyen-gia',      label: 'Quản lý chuyên gia' },
  { id: 'brand-content',   label: 'Quản lý brand content' },
  { id: 'so-bao-giay',     label: 'Quản lý số báo giấy' },
  { id: 'magazine',        label: 'Quản lý mẫu bài Magazine' },
  { id: 'mp3',             label: 'Quản lý mp3' },
]

/* ═══════════════════════════════════════════════════════════
   DỮ LIỆU MẪU
══════════════════════════════════════════════════════════ */
const D_DONG_SU_KIEN = [
  { id:1, img:'🌍', name:'Chiến tranh và hợp tác quân sự Mỹ - Ukraine',   cat:'Thế giới',  count:142, showHome:true,  featured:false },
  { id:2, img:'☕', name:'Giá cà phê tăng cao toàn cầu',                 cat:'Kinh tế',   count:38,  showHome:true,  featured:true  },
  { id:3, img:'🤖', name:'Cuộc đua công nghệ AI giữa các cường quốc',     cat:'Công nghệ', count:97,  showHome:false, featured:true  },
  { id:4, img:'🌊', name:'Biến đổi khí hậu và thiên tai 2026',           cat:'Xã hội',    count:54,  showHome:true,  featured:false },
  { id:5, img:'⚽', name:'Hành trình đội tuyển Việt Nam AFF Cup 2026',    cat:'Thể thao',  count:213, showHome:true,  featured:true  },
  { id:6, img:'🏙️', name:'Quy hoạch đô thị Hà Nội 2030',                cat:'Thời sự',   count:67,  showHome:false, featured:false },
  { id:7, img:'💊', name:'Chính sách y tế và dịch bệnh mới nhất',        cat:'Sức khỏe',  count:44,  showHome:true,  featured:false },
  { id:8, img:'📈', name:'Thị trường bất động sản phục hồi sau dịch',    cat:'Kinh tế',   count:89,  showHome:false, featured:false },
  { id:9, img:'🎓', name:'Đổi mới chương trình giáo dục phổ thông',      cat:'Xã hội',    count:31,  showHome:true,  featured:false },
]

const D_TRO_LY_TIN = [
  { id:1, avatar:'🤖', name:'Trợ lý tin thời sự',     users:8,  desc:'Hỗ trợ biên tập tin tức thời sự nhanh' },
  { id:2, avatar:'🎬', name:'video-edit',              users:3,  desc:'Hỗ trợ tạo script và caption video' },
  { id:3, avatar:'📊', name:'Trợ lý phân tích dữ liệu',users:5,  desc:'Phân tích xu hướng và số liệu thị trường' },
  { id:4, avatar:'✍️', name:'Trợ lý viết bài dài',    users:12, desc:'Hỗ trợ viết bài phân tích chuyên sâu' },
  { id:5, avatar:'🌐', name:'Trợ lý dịch thuật',      users:6,  desc:'Dịch tin tức quốc tế sang tiếng Việt' },
]

const D_CHU_DE = [
  { id:1, name:'Xã hội',         articles:1240, order:1,  active:true,  showIcon:true  },
  { id:2, name:'Xe cộ',          articles:342,  order:5,  active:true,  showIcon:false },
  { id:3, name:'Chuyên mục AI',  articles:89,   order:3,  active:true,  showIcon:true  },
  { id:4, name:'Kinh tế số',     articles:567,  order:2,  active:true,  showIcon:true  },
  { id:5, name:'Bất động sản',   articles:445,  order:4,  active:false, showIcon:false },
  { id:6, name:'Du lịch',        articles:298,  order:6,  active:true,  showIcon:true  },
]

const D_CHUYEN_GIA = [
  { id:1, name:'PGS.TS Nguyễn Văn An', role:'Chuyên gia kinh tế vĩ mô', order:1 },
  { id:2, name:'TS. Lê Minh Hương',    role:'Chuyên gia công nghệ AI',   order:2 },
]

const D_BRAND = [
  { id:1, name:'Bảo hiểm nhân thọ Prudential', url:'prudential.com.vn', icon:'🏦', logo:'PRU' },
  { id:2, name:'Vinamilk',                      url:'vinamilk.com.vn',   icon:'🥛', logo:'VNM' },
  { id:3, name:'TechCom Bank',                  url:'techcombank.com.vn',icon:'💳', logo:'TCB' },
]


const D_SO_BAO = [
  { id:1, title:'Tạp chí Doanh nghiệp và Tiếp thị số 116', num:'116', date:'01/05/2026', edited:'15/05/2026', status:'Hiển thị' },
  { id:2, title:'Tạp chí Doanh nghiệp và Tiếp thị số 115', num:'115', date:'01/04/2026', edited:'12/04/2026', status:'Hiển thị' },
  { id:3, title:'Tạp chí Doanh nghiệp và Tiếp thị số 114', num:'114', date:'01/03/2026', edited:'10/03/2026', status:'Ẩn'       },
]

const D_MAGAZINE = [
  { id:1, title:'Magazine Kinh tế Tháng 5',     creator:'admin_vcc',    date:'12/05/2026', g:['from-blue-700','to-blue-500']     },
  { id:2, title:'Phóng sự ảnh Hà Nội cổ',      creator:'trangnv_vcc',  date:'08/04/2026', g:['from-slate-700','to-slate-500']   },
  { id:3, title:'Magazine Công nghệ AI 2026',   creator:'ngoclm_vcc',   date:'20/03/2026', g:['from-violet-700','to-purple-500'] },
  { id:4, title:'Chuyên đề Bất động sản Q1',   creator:'dinhluong_vcc',date:'15/02/2026', g:['from-teal-700','to-cyan-500']     },
  { id:5, title:'Magazine Du lịch Mùa hè',      creator:'hoattv_vcc',   date:'02/02/2026', g:['from-orange-600','to-amber-400'] },
  { id:6, title:'Đặc san Tết Bính Ngọ 2026',   creator:'muaxuan',      date:'20/01/2026', g:['from-rose-600','to-pink-400']     },
]

/* ═══════════════════════════════════════════════════════════
   PAGE CHÍNH
══════════════════════════════════════════════════════════ */
export default function QuanLyPage() {
  const router = useRouter()
  const [active,        setActive]        = useState('log-action')
  const [sectionLoading,setSectionLoading]= useState(false)
  const [editItem,      setEditItem]      = useState<any>(null)
  const [search,        setSearch]        = useState('')
  const [checkingRole,  setCheckingRole]  = useState(true)
  const [toast,         setToast]         = useState<{msg:string; type:'ok'|'err'}|null>(null)

  const showToast = useCallback((msg: string, type: 'ok'|'err' = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const switchMenu = useCallback((id: string) => {
    if (id === active) return
    setSectionLoading(true)
    setSearch('')
    setTimeout(() => { setActive(id); setSectionLoading(false) }, 300)
  }, [active])

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(d => {
        if (!d.ok || d.user?.role !== 'admin') router.replace('/dashboard')
        else setCheckingRole(false)
      })
      .catch(() => router.replace('/dashboard'))
  }, [router])

  if (checkingRole) return (
    <div className="flex min-h-screen items-center justify-center bg-[#f0f2f5]">
      <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow text-sm text-gray-600">
        <svg className="w-4 h-4 animate-spin text-[#17a2b8]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        Đang kiểm tra quyền...
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />

      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />

        <main className="flex flex-1 overflow-hidden">

          {/* ── Sidebar CẤU HÌNH ── */}
          <aside className="w-56 min-h-full bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-200">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CẤU HÌNH</p>
            </div>
            {MENUS.map(m => (
              <button key={m.id} onClick={() => switchMenu(m.id)}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors border-l-[3px]
                  ${active === m.id
                    ? 'text-gray-900 font-bold border-[#17a2b8] bg-[#e8f7f9]'
                    : 'text-gray-400 font-normal border-transparent hover:bg-gray-50 hover:text-gray-700'}`}>
                {m.label}
              </button>
            ))}
          </aside>

          {/* ── Vùng nội dung ── */}
          <div className="flex-1 overflow-y-auto p-5 relative">
            {sectionLoading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#f0f2f5]/60">
                <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-lg text-sm text-gray-600">
                  <svg className="w-4 h-4 animate-spin text-[#17a2b8]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Đang tải...
                </div>
              </div>
            )}

            {!sectionLoading && (
              <div>
                {active === 'log-action'      && <SectionLogAction search={search} setSearch={setSearch}/>}
                {active === 'nguoi-dung'      && <SectionNguoiDung showToast={showToast}/>}
                {active === 'phong-ban'       && <SectionPhongBan  showToast={showToast}/>}
                {active === 'menu-chuyen-muc' && <SectionMenuChuyenMuc showToast={showToast}/>}
                {active === 'dong-su-kien'    && <SectionDongSuKien search={search} setSearch={setSearch}/>}
                {active === 'tro-ly-tin'      && <SectionTroLyTin  search={search} setSearch={setSearch}/>}
                {active === 'profile-tac-gia' && <SectionTacGia    showToast={showToast}/>}
                {active === 'chu-de'          && <SectionChuDe     search={search} setSearch={setSearch} onEdit={setEditItem}/>}
                {active === 'chuyen-gia'      && <SectionChuyenGia search={search} setSearch={setSearch} onEdit={setEditItem}/>}
                {active === 'brand-content'   && <SectionBrandContent search={search} setSearch={setSearch} onEdit={setEditItem}/>}
                {active === 'so-bao-giay'     && <SectionSoBaoGiay search={search} setSearch={setSearch} onEdit={setEditItem}/>}
                {active === 'magazine'        && <SectionMagazine  search={search} setSearch={setSearch}/>}
                {active === 'mp3'             && <SectionMp3       search={search} setSearch={setSearch}/>}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Edit modal (dùng cho phong-ban, tac-gia, v.v.) */}
      {editItem && <EditModal item={editItem} section={active} onClose={() => setEditItem(null)}/>}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium
          ${toast.type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.type === 'ok'
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   SHARED COMPONENTS
══════════════════════════════════════════════════════════ */

/* Toolbar row */
function Toolbar({ title, addLabel, onAdd, search, setSearch, children }: {
  title?: string; addLabel: string; onAdd?: () => void
  search?: string; setSearch?: (v: string) => void; children?: React.ReactNode
}) {
  return (
    <div className="flex items-center gap-3 mb-4 flex-wrap">
      {title && <h1 className="text-base font-bold text-gray-800 mr-2">{title}</h1>}
      <button onClick={onAdd}
        className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors shadow-sm whitespace-nowrap">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
        </svg>
        {addLabel}
      </button>
      {children}
      {setSearch !== undefined && (
        <div className="relative ml-auto">
          <input value={search||''} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8] w-44"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      )}
    </div>
  )
}

/* Pagination label */
function PagLabel({ from, to, total }: { from:number; to:number; total:number }) {
  return <p className="text-xs text-gray-500 mt-3">{from} đến {to} trong {total}</p>
}

/* Table wrapper */
function DataTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      <table className="w-full text-xs">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            {headers.map((h, i) => (
              <th key={i} className={`px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide ${i === headers.length - 1 ? 'text-center' : ''}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

/* Three-dot menu (⋮) */
function ThreeDot({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])
  return (
    <div ref={ref} className="relative inline-block">
      <button onClick={() => setOpen(v => !v)}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors font-bold text-base leading-none">⋮</button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 w-32 overflow-hidden">
          <button onClick={() => { onEdit(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition-colors">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
            Sửa
          </button>
          <button onClick={() => { onDelete(); setOpen(false) }}
            className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-600 hover:bg-red-50 transition-colors">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Xóa
          </button>
        </div>
      )}
    </div>
  )
}

/* Avatar circle */
function Av({ label, color = 'bg-[#17c3d8]' }: { label: string; color?: string }) {
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {label.charAt(0).toUpperCase()}
    </div>
  )
}

/* Status pill */
function SPill({ on }: { on: boolean }) {
  return (
    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${on ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
      {on ? 'Hiển thị' : 'Ẩn'}
    </span>
  )
}

/* Checkbox display */
function CBDisplay({ checked }: { checked: boolean }) {
  return (
    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center mx-auto
      ${checked ? 'bg-[#17a2b8] border-[#17a2b8]' : 'border-gray-300'}`}>
      {checked && <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
      </svg>}
    </div>
  )
}


/* ═══════════════════════════════════════════════════════════
   EDIT MODAL
══════════════════════════════════════════════════════════ */
function EditModal({ item, section, onClose }: { item: any; section: string; onClose: () => void }) {
  const [name, setName] = useState<string>(item?.name || item?.title || '')
  const [desc, setDesc] = useState<string>(item?.desc || item?.role || '')
  const MAX = 250

  const sectionTitles: Record<string, string> = {
    'phong-ban': 'Chỉnh sửa phòng ban',
    'profile-tac-gia': 'Chỉnh sửa tác giả',
    'chu-de': 'Chỉnh sửa chủ đề',
    'chuyen-gia': 'Chỉnh sửa chuyên gia',
    'brand-content': 'Chỉnh sửa brand content',
    'so-bao-giay': 'Chỉnh sửa số báo giấy',
  }
  const namePlaceholders: Record<string, string> = {
    'phong-ban': 'Tên phòng ban',
    'profile-tac-gia': 'Tên tác giả',
    'chu-de': 'Tên chủ đề',
    'chuyen-gia': 'Tên chuyên gia',
    'brand-content': 'Tên thương hiệu',
    'so-bao-giay': 'Tiêu đề số báo',
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">{sectionTitles[section] || 'Chỉnh sửa'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Avatar upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Ảnh đại diện (Avatar)</label>
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-5 flex items-center gap-4 hover:border-[#17a2b8] transition-colors cursor-pointer">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#0e7c8a] flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {name.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">Tải ảnh lên</p>
                <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP · Tối đa 2MB</p>
                <button className="mt-1.5 text-[10px] text-[#17a2b8] font-semibold hover:underline">Chọn ảnh</button>
              </div>
            </div>
          </div>

          {/* Name field with char counter */}
          <div>
            <label className="flex items-center gap-1 text-xs font-semibold text-gray-600 mb-1.5">
              {namePlaceholders[section] || 'Tên'}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value.slice(0, MAX))}
                placeholder={`Nhập ${(namePlaceholders[section] || 'tên').toLowerCase()}...`}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] focus:ring-2 focus:ring-[#17a2b8]/10 pr-20"
              />
              <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-mono
                ${name.length > MAX * 0.85 ? 'text-red-500' : 'text-gray-400'}`}>
                {name.length}/{MAX}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Mô tả</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="Nhập mô tả..."
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#17a2b8] focus:ring-2 focus:ring-[#17a2b8]/10"
            />
          </div>

          {/* Extra fields for specific sections */}
          {section === 'phong-ban' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Số lượng nhân viên</label>
              <input type="number" defaultValue={item?.members || 0}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"/>
            </div>
          )}
          {section === 'chuyen-gia' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Thứ tự hiển thị</label>
              <input type="number" defaultValue={item?.order || 1}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"/>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors tracking-wide">
            ĐÓNG
          </button>
          <button
            disabled={!name.trim()}
            className="px-5 py-2 text-sm font-bold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors tracking-wide disabled:opacity-50">
            LƯU
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   1. LOG ACTION
══════════════════════════════════════════════════════════ */
function SectionLogAction({ search, setSearch }: any) {
  const [logs,      setLogs]      = useState<any[]>([])
  const [fetching,  setFetching]  = useState(true)
  const [objFilter, setObjFilter] = useState('')
  const [actFilter, setActFilter] = useState('')
  const [dateFrom,  setDateFrom]  = useState('')
  const [dateTo,    setDateTo]    = useState('')

  const load = useCallback(() => {
    setFetching(true)
    const p = new URLSearchParams({ limit: '50' })
    if (objFilter) p.set('objectType', objFilter)
    fetch(`/api/logs?${p}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setLogs(d.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [objFilter])

  useEffect(() => { load() }, [load])

  const filtered = logs.filter((l: any) =>
    (!search || l.objectTitle?.toLowerCase().includes(search.toLowerCase())) &&
    (!actFilter || l.actionType === actFilter)
  )

  const ACTION_LABEL: Record<string, string> = {
    create: 'tạo mới', update: 'cập nhật', delete: 'xóa',
    publish: 'xuất bản', unpublish: 'gỡ xuống', return: 'trả lại',
    submit_edit: 'gửi biên tập', submit_publish: 'gửi xuất bản',
    approve: 'duyệt', remove: 'loại bỏ', restore: 'khôi phục',
  }
  const ACTION_COLOR: Record<string, string> = {
    publish: 'text-green-600 bg-green-50', create: 'text-blue-600 bg-blue-50',
    delete: 'text-red-600 bg-red-50', return: 'text-orange-600 bg-orange-50',
    update: 'text-indigo-600 bg-indigo-50', remove: 'text-red-600 bg-red-50',
    unpublish: 'text-gray-600 bg-gray-100',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base font-bold text-gray-800">Log Action</h1>
        <button onClick={load} className="text-xs text-[#17a2b8] hover:underline">↻ Làm mới</button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 grid grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Đối tượng</label>
          <select value={objFilter} onChange={e => setObjFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] bg-white">
            <option value="">Tất cả</option>
            <option value="article">Bài viết</option>
            <option value="user">Người dùng</option>
            <option value="category">Chuyên mục</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Hành động</label>
          <select value={actFilter} onChange={e => setActFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] bg-white">
            <option value="">Tất cả</option>
            <option value="publish">Xuất bản</option>
            <option value="create">Tạo mới</option>
            <option value="update">Cập nhật</option>
            <option value="delete">Xóa</option>
            <option value="return">Trả lại</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Từ ngày</label>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Tới ngày</label>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
        </div>
        <div className="col-span-3">
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Tìm kiếm</label>
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm theo tiêu đề bài viết..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
            <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div className="flex items-end">
          <button onClick={load} className="w-full py-1.5 bg-[#17a2b8] text-white text-xs font-bold rounded hover:bg-[#138496] transition-colors">Lọc</button>
        </div>
      </div>

      {fetching ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Đang tải logs...</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Không có dữ liệu</div>
      ) : (
        <DataTable headers={['Người dùng', 'Hành động', 'Loại', 'Đối tượng', 'Thời gian']}>
          {filtered.map((l: any) => (
            <tr key={l._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Av label={l.userId?.username || '?'} color="bg-slate-500"/>
                  <span className="font-medium text-gray-700 font-mono text-xs">
                    {l.userId?.username || String(l.userId).slice(-8)}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${ACTION_COLOR[l.actionType] || 'text-gray-600 bg-gray-50'}`}>
                  {ACTION_LABEL[l.actionType] || l.actionType}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded text-[10px]">{l.objectType}</span>
              </td>
              <td className="px-4 py-3 max-w-xs">
                <p className="text-gray-700 line-clamp-1">{l.objectTitle || '—'}</p>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-gray-400 text-xs">
                {new Date(l.createdAt).toLocaleString('vi-VN', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })}
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      <PagLabel from={1} to={filtered.length} total={logs.length}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   2. QUẢN LÝ PHÒNG BAN
══════════════════════════════════════════════════════════ */
function SectionPhongBan({ showToast }: { showToast: (m: string, t: 'ok'|'err') => void }) {
  const [depts,    setDepts]    = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState<'add'|'edit'|null>(null)
  const [target,   setTarget]   = useState<any>(null)
  const [confirm,  setConfirm]  = useState<any>(null)

  const load = useCallback(() => {
    setFetching(true)
    fetch('/api/departments')
      .then(r => r.json())
      .then(d => { if (d.ok) setDepts(d.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])
  useEffect(() => { load() }, [load])

  const handleDelete = async (dept: any) => {
    const res = await fetch(`/api/departments/${dept._id}`, { method: 'DELETE' })
    const d   = await res.json()
    if (d.ok) { showToast('Đã xóa phòng ban', 'ok'); load() }
    else showToast(d.error || 'Lỗi', 'err')
    setConfirm(null)
  }

  const filtered = depts.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <Toolbar addLabel="Thêm phòng ban" onAdd={() => { setTarget(null); setModal('add') }} search={search} setSearch={setSearch}/>

      {fetching ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Đang tải...</div>
      ) : (
        <DataTable headers={['Avatar', 'Tên phòng ban', 'Slug', 'Địa điểm', 'Thao tác']}>
          {filtered.map((d: any) => (
            <tr key={d._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3"><Av label={d.name} color="bg-gradient-to-br from-[#17c3d8] to-[#0e7c8a]"/></td>
              <td className="px-4 py-3 font-semibold text-gray-800">{d.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">{d.slug}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{d.location || '—'}</td>
              <td className="px-4 py-3 text-center">
                <ThreeDot onEdit={() => { setTarget(d); setModal('edit') }} onDelete={() => setConfirm(d)}/>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      <PagLabel from={1} to={filtered.length} total={depts.length}/>

      {modal && (
        <DeptModal mode={modal} initial={target}
          onClose={() => setModal(null)}
          onSaved={() => { load(); setModal(null) }}
          showToast={showToast}/>
      )}

      {confirm && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Xóa phòng ban?</h3>
            <p className="text-sm text-gray-500 mb-5">Phòng ban <strong>{confirm.name}</strong> sẽ bị xóa vĩnh viễn.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Huỷ</button>
              <button onClick={() => handleDelete(confirm)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. QUẢN LÝ CHUYÊN MỤC (fetch từ /api/categories)
══════════════════════════════════════════════════════════ */
function SectionMenuChuyenMuc({ showToast }: { showToast: (m: string, t: 'ok'|'err') => void }) {
  const [cats,     setCats]     = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState<'add'|'edit'|null>(null)
  const [target,   setTarget]   = useState<any>(null)
  const [confirm,  setConfirm]  = useState<any>(null)

  const load = useCallback(() => {
    setFetching(true)
    fetch('/api/categories')
      .then(r => r.json())
      .then(d => { if (d.ok) setCats(d.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])
  useEffect(() => { load() }, [load])

  const parentName = (pid: string | null) => pid ? (cats.find(c => c._id === pid)?.name ?? '—') : '—'

  const handleDelete = async (cat: any) => {
    const res = await fetch(`/api/categories/${cat._id}`, { method: 'DELETE' })
    const d   = await res.json()
    if (d.ok) { showToast('Đã vô hiệu hoá chuyên mục', 'ok'); load() }
    else showToast(d.error || 'Lỗi', 'err')
    setConfirm(null)
  }

  const filtered = cats.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.includes(search)
  )

  return (
    <div>
      <Toolbar addLabel="Thêm chuyên mục" onAdd={() => { setTarget(null); setModal('add') }} search={search} setSearch={setSearch}/>

      {fetching ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Đang tải...</div>
      ) : (
        <DataTable headers={['Tên chuyên mục', 'Slug', 'Chuyên mục cha', 'Thứ tự', 'Thao tác']}>
          {filtered.map((c: any) => (
            <tr key={c._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Av label={c.name} color="bg-[#17a2b8]"/>
                  <span className="font-semibold text-gray-800">{c.name}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs text-gray-400">{c.slug}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">{parentName(c.parentId)}</td>
              <td className="px-4 py-3 text-center font-mono text-gray-600">{c.displayOrder}</td>
              <td className="px-4 py-3 text-center">
                <ThreeDot onEdit={() => { setTarget(c); setModal('edit') }} onDelete={() => setConfirm(c)}/>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      <PagLabel from={1} to={filtered.length} total={cats.length}/>

      {modal && (
        <CatModal mode={modal} cats={cats} initial={target}
          onClose={() => setModal(null)}
          onSaved={() => { load(); setModal(null) }}
          showToast={showToast}/>
      )}

      {confirm && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Vô hiệu hoá chuyên mục?</h3>
            <p className="text-sm text-gray-500 mb-5">
              <strong>{confirm.name}</strong> sẽ bị ẩn. Bài viết hiện có không bị xóa.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Huỷ</button>
              <button onClick={() => handleDelete(confirm)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold">Vô hiệu hoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   4. DÒNG SỰ KIỆN
══════════════════════════════════════════════════════════ */
function SectionDongSuKien({ search, setSearch }: any) {
  const [catFilter, setCatFilter] = useState('')
  const [data, setData] = useState(D_DONG_SU_KIEN)

  const filtered = data.filter(d =>
    (!search || d.name.toLowerCase().includes(search.toLowerCase())) &&
    (!catFilter || d.cat === catFilter)
  )

  const toggle = (id: number, field: 'showHome'|'featured') =>
    setData(l => l.map(d => d.id === id ? {...d, [field]: !d[field as keyof typeof d]} : d))

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm dòng sự kiện
        </button>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option value="">Tất cả chuyên mục</option>
          {['Thế giới','Kinh tế','Công nghệ','Xã hội','Thể thao','Thời sự','Sức khỏe'].map(c=><option key={c}>{c}</option>)}
        </select>
        <div className="relative ml-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm từ khóa..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8] w-48"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <DataTable headers={['', 'Tên dòng sự kiện', 'Chuyên mục', 'Bài viết', 'Trang chủ', 'Nổi bật', 'Thao tác']}>
        {filtered.map(d => (
          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-lg">{d.img}</td>
            <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
              <p className="line-clamp-1">{d.name}</p>
            </td>
            <td className="px-4 py-3"><span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-[10px] font-semibold">{d.cat}</span></td>
            <td className="px-4 py-3 text-center font-mono text-gray-600">{d.count}</td>
            <td className="px-4 py-3 text-center cursor-pointer" onClick={() => toggle(d.id,'showHome')}><CBDisplay checked={d.showHome}/></td>
            <td className="px-4 py-3 text-center cursor-pointer" onClick={() => toggle(d.id,'featured')}><CBDisplay checked={d.featured}/></td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => {}} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={D_DONG_SU_KIEN.length}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   5. TRỢ LÝ TIN
══════════════════════════════════════════════════════════ */
function SectionTroLyTin({ search, setSearch }: any) {
  const filtered = D_TRO_LY_TIN.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <div className="relative ml-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm theo tiêu đề tin..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8] w-56"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
      <DataTable headers={['STT', 'Avatar', 'Tên trợ lý', 'Mô tả', 'Người dùng', 'Thao tác']}>
        {filtered.map((t,i) => (
          <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-gray-400 font-mono">{String(i+1).padStart(2,'0')}</td>
            <td className="px-4 py-3 text-2xl">{t.avatar}</td>
            <td className="px-4 py-3 font-semibold text-gray-800">{t.name}</td>
            <td className="px-4 py-3 text-gray-500 max-w-xs"><p className="line-clamp-1">{t.desc}</p></td>
            <td className="px-4 py-3 text-center">
              <span className="px-2 py-0.5 bg-[#e8f7f9] text-[#17a2b8] rounded-full text-[10px] font-bold">{t.users}</span>
            </td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => {}} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={20}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   6. PROFILE TÁC GIẢ
══════════════════════════════════════════════════════════ */
function SectionTacGia({ showToast }: { showToast: (m: string, t: 'ok'|'err') => void }) {
  const [authors,  setAuthors]  = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState<'add'|'edit'|null>(null)
  const [target,   setTarget]   = useState<any>(null)
  const [confirm,  setConfirm]  = useState<any>(null)

  const load = useCallback(() => {
    setFetching(true)
    fetch('/api/authors')
      .then(r => r.json())
      .then(d => { if (d.ok) setAuthors(d.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])
  useEffect(() => { load() }, [load])

  const handleDelete = async (a: any) => {
    const res = await fetch(`/api/authors/${a._id}`, { method: 'DELETE' })
    const d   = await res.json()
    if (d.ok) { showToast('Đã vô hiệu hoá tác giả', 'ok'); load() }
    else showToast(d.error || 'Lỗi', 'err')
    setConfirm(null)
  }

  const filtered = authors.filter(a =>
    !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.email?.toLowerCase().includes(search.toLowerCase())
  )
  const COLORS = ['bg-blue-500','bg-teal-500','bg-violet-500','bg-orange-500','bg-rose-500']

  return (
    <div>
      <Toolbar addLabel="Thêm tác giả mới" onAdd={() => { setTarget(null); setModal('add') }} search={search} setSearch={setSearch}/>

      {fetching ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Đang tải...</div>
      ) : (
        <DataTable headers={['Avatar', 'Tên tác giả', 'Bio', 'Email', 'Thao tác']}>
          {filtered.map((a: any, i: number) => (
            <tr key={a._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3">
                {a.avatar
                  ? <img src={a.avatar} alt={a.name} className="w-8 h-8 rounded-full object-cover"/>
                  : <Av label={a.name} color={COLORS[i % COLORS.length]}/>}
              </td>
              <td className="px-4 py-3 font-semibold text-gray-800">{a.name}</td>
              <td className="px-4 py-3 text-gray-500 text-xs max-w-xs"><p className="line-clamp-1">{a.bio || '—'}</p></td>
              <td className="px-4 py-3 text-gray-400 text-xs">{a.email || '—'}</td>
              <td className="px-4 py-3 text-center">
                <ThreeDot onEdit={() => { setTarget(a); setModal('edit') }} onDelete={() => setConfirm(a)}/>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      <PagLabel from={1} to={filtered.length} total={authors.length}/>

      {modal && (
        <AuthorModal mode={modal} initial={target}
          onClose={() => setModal(null)}
          onSaved={() => { load(); setModal(null) }}
          showToast={showToast}/>
      )}

      {confirm && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Vô hiệu hoá tác giả?</h3>
            <p className="text-sm text-gray-500 mb-5">Tác giả <strong>{confirm.name}</strong> sẽ bị ẩn khỏi hệ thống.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Huỷ</button>
              <button onClick={() => handleDelete(confirm)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold">Vô hiệu hoá</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   7. CHỦ ĐỀ
══════════════════════════════════════════════════════════ */
function SectionChuDe({ search, setSearch, onEdit }: any) {
  const [data, setData] = useState(D_CHU_DE)
  const filtered = data.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))
  const toggle = (id:number, field: 'active'|'showIcon') =>
    setData(l => l.map(d => d.id===id ? {...d,[field]:!d[field as keyof typeof d]} : d))

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm chủ đề mới
        </button>
        <select className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option>Tất cả trạng thái</option><option>Hoạt động</option><option>Ẩn</option>
        </select>
        <select className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option>Tất cả chuyên mục</option>
        </select>
        <div className="relative ml-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm chủ đề..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] w-44"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
      <DataTable headers={['Avatar','Chủ đề / Bài viết','Thứ tự','Hoạt động','Hiển thị icon','Thao tác']}>
        {filtered.map((d,i) => (
          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3"><Av label={d.name} color={['bg-blue-500','bg-teal-500','bg-violet-500','bg-orange-500','bg-rose-500','bg-green-500'][i%6]}/></td>
            <td className="px-4 py-3">
              <p className="font-semibold text-gray-800">{d.name}</p>
              <p className="text-[10px] text-gray-400">{d.articles.toLocaleString()} bài viết</p>
            </td>
            <td className="px-4 py-3 text-center">
              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">{d.order}</span>
            </td>
            <td className="px-4 py-3 text-center cursor-pointer" onClick={() => toggle(d.id,'active')}><CBDisplay checked={d.active}/></td>
            <td className="px-4 py-3 text-center cursor-pointer" onClick={() => toggle(d.id,'showIcon')}><CBDisplay checked={d.showIcon}/></td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => onEdit(d)} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={18}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   8. CHUYÊN GIA
══════════════════════════════════════════════════════════ */
function SectionChuyenGia({ search, setSearch, onEdit }: any) {
  const filtered = D_CHUYEN_GIA.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <Toolbar addLabel="Thêm mới" search={search} setSearch={setSearch}/>
      <DataTable headers={['Avatar','Tên chuyên gia','Chức vụ / Nghề nghiệp','Thứ tự','Thao tác']}>
        {filtered.map(d => (
          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3"><Av label={d.name} color="bg-amber-500"/></td>
            <td className="px-4 py-3 font-semibold text-gray-800">{d.name}</td>
            <td className="px-4 py-3 text-gray-500">{d.role}</td>
            <td className="px-4 py-3 text-center font-mono text-gray-600">{d.order}</td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => onEdit(d)} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={2}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   9. BRAND CONTENT
══════════════════════════════════════════════════════════ */
function SectionBrandContent({ search, setSearch, onEdit }: any) {
  const filtered = D_BRAND.filter(d => !search || d.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <Toolbar addLabel="Thêm mới" search={search} setSearch={setSearch}/>
      <DataTable headers={['Icon','Logo','Tên thương hiệu','URL','Thao tác']}>
        {filtered.map(d => (
          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-2xl">{d.icon}</td>
            <td className="px-4 py-3">
              <span className="px-2 py-1 bg-gray-800 text-white text-xs font-bold rounded font-mono">{d.logo}</span>
            </td>
            <td className="px-4 py-3 font-semibold text-gray-800">{d.name}</td>
            <td className="px-4 py-3 text-[#17a2b8] text-xs">{d.url}</td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => onEdit({name:d.name,desc:d.url})} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={D_BRAND.length}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   10. SỐ BÁO GIẤY
══════════════════════════════════════════════════════════ */
function SectionSoBaoGiay({ search, setSearch, onEdit }: any) {
  const filtered = D_SO_BAO.filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <Toolbar addLabel="Thêm mới" search={search} setSearch={setSearch}/>
      <DataTable headers={['Ảnh bìa','Tiêu đề','Số báo','Ngày phát hành','Sửa lần cuối','Trạng thái','Thao tác']}>
        {filtered.map(d => (
          <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
              <div className="w-10 h-14 bg-gradient-to-br from-slate-600 to-slate-400 rounded flex items-center justify-center text-white text-[10px] font-bold">
                {d.num}
              </div>
            </td>
            <td className="px-4 py-3 font-medium text-gray-800 max-w-xs"><p className="line-clamp-2">{d.title}</p></td>
            <td className="px-4 py-3 text-center font-mono font-bold text-gray-600">{d.num}</td>
            <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{d.date}</td>
            <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{d.edited}</td>
            <td className="px-4 py-3"><SPill on={d.status === 'Hiển thị'}/></td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => onEdit({title:d.title,name:d.title,desc:`Số ${d.num}`})} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={D_SO_BAO.length}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   11. MAGAZINE (GRID)
══════════════════════════════════════════════════════════ */
function SectionMagazine({ search, setSearch }: any) {
  const filtered = D_MAGAZINE.filter(d => !search || d.title.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <button className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
          </svg>
          Upload mẫu bài Zip mới
        </button>
        <select className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option>Tất cả</option><option>Mới nhất</option><option>Cũ nhất</option>
        </select>
        <div className="relative ml-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm mẫu bài..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] w-44"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      {/* Grid layout */}
      <div className="grid grid-cols-3 gap-4">
        {filtered.map(m => (
          <div key={m.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all group cursor-pointer">
            <div className={`h-48 bg-gradient-to-br ${m.g[0]} ${m.g[1]} flex items-center justify-center relative`}>
              {/* fake magazine cover */}
              <div className="w-3/4 space-y-2 opacity-30 p-2">
                <div className="h-2 bg-white rounded-full"/>
                <div className="h-2 bg-white rounded-full w-3/4"/>
                <div className="h-10 bg-white/40 rounded mt-2"/>
                <div className="h-2 bg-white rounded-full"/>
                <div className="h-2 bg-white rounded-full w-1/2"/>
              </div>
              <div className="absolute top-2 right-2 bg-black/30 text-white text-[10px] font-bold px-2 py-0.5 rounded font-mono">
                MAGAZINE
              </div>
            </div>
            <div className="p-3.5">
              <p className="text-sm font-bold text-gray-800 mb-1 group-hover:text-[#17a2b8] transition-colors line-clamp-1">{m.title}</p>
              <p className="text-[11px] text-gray-400">
                Bởi <span className="text-gray-600 font-medium">{m.creator}</span> · {m.date}
              </p>
            </div>
          </div>
        ))}
      </div>
      <PagLabel from={1} to={filtered.length} total={6}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   QUẢN LÝ NGƯỜI DÙNG (fetch từ /api/users)
══════════════════════════════════════════════════════════ */
function SectionNguoiDung({ showToast }: { showToast: (m: string, t: 'ok'|'err') => void }) {
  const [users,    setUsers]    = useState<any[]>([])
  const [fetching, setFetching] = useState(true)
  const [search,   setSearch]   = useState('')
  const [modal,    setModal]    = useState<'add'|'edit'|null>(null)
  const [target,   setTarget]   = useState<any>(null)
  const [confirm,  setConfirm]  = useState<any>(null)

  const load = useCallback(() => {
    setFetching(true)
    fetch('/api/users')
      .then(r => r.json())
      .then(d => { if (d.ok) setUsers(d.data) })
      .catch(() => {})
      .finally(() => setFetching(false))
  }, [])
  useEffect(() => { load() }, [load])

  const handleDelete = async (u: any) => {
    const res = await fetch(`/api/users/${u._id}`, { method: 'DELETE' })
    const d   = await res.json()
    if (d.ok) { showToast('Đã xóa tài khoản', 'ok'); load() }
    else showToast(d.error || 'Lỗi', 'err')
    setConfirm(null)
  }

  const roleBadge = (role: string) => {
    const cls: Record<string, string> = {
      admin:    'bg-red-100 text-red-700',
      editor:   'bg-blue-100 text-blue-700',
      reporter: 'bg-green-100 text-green-700',
    }
    const lbl: Record<string, string> = {
      admin: 'Admin', editor: 'Biên tập', reporter: 'Phóng viên',
    }
    return <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${cls[role] || 'bg-gray-100 text-gray-500'}`}>{lbl[role] || role}</span>
  }

  const filtered = users.filter(u =>
    !search ||
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )
  const COLORS = ['bg-blue-500','bg-teal-500','bg-violet-500','bg-orange-500','bg-rose-500','bg-indigo-500']

  return (
    <div>
      <Toolbar addLabel="Thêm tài khoản" onAdd={() => { setTarget(null); setModal('add') }} search={search} setSearch={setSearch}/>

      {fetching ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Đang tải...</div>
      ) : (
        <DataTable headers={['Avatar', 'Tài khoản', 'Họ và tên', 'Email', 'Vai trò', 'Thao tác']}>
          {filtered.map((u: any, i: number) => (
            <tr key={u._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
              <td className="px-4 py-3"><Av label={u.fullName || u.username} color={COLORS[i % COLORS.length]}/></td>
              <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{u.username}</td>
              <td className="px-4 py-3 text-gray-700">{u.fullName}</td>
              <td className="px-4 py-3 text-gray-400 text-xs">{u.email || '—'}</td>
              <td className="px-4 py-3">{roleBadge(u.role)}</td>
              <td className="px-4 py-3 text-center">
                <ThreeDot onEdit={() => { setTarget(u); setModal('edit') }} onDelete={() => setConfirm(u)}/>
              </td>
            </tr>
          ))}
        </DataTable>
      )}
      <PagLabel from={1} to={filtered.length} total={users.length}/>

      {modal && (
        <UserModal mode={modal} initial={target}
          onClose={() => setModal(null)}
          onSaved={() => { load(); setModal(null) }}
          showToast={showToast}/>
      )}

      {confirm && (
        <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-800 mb-2">Xóa tài khoản?</h3>
            <p className="text-sm text-gray-500 mb-5">
              Tài khoản <strong>{confirm.username}</strong> ({confirm.fullName}) sẽ bị xóa vĩnh viễn.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)}
                className="px-4 py-2 text-sm border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50">Huỷ</button>
              <button onClick={() => handleDelete(confirm)}
                className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 font-bold">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MODAL: NGƯỜI DÙNG
══════════════════════════════════════════════════════════ */
function UserModal({ mode, initial, onClose, onSaved, showToast }: {
  mode: 'add'|'edit'
  initial: any
  onClose: () => void
  onSaved: () => void
  showToast: (m: string, t: 'ok'|'err') => void
}) {
  const [username, setUsername] = useState(initial?.username || '')
  const [fullName, setFullName] = useState(initial?.fullName || '')
  const [email,    setEmail]    = useState(initial?.email    || '')
  const [role,     setRole]     = useState<'reporter'|'editor'|'admin'>(initial?.role || 'reporter')
  const [password, setPassword] = useState('')
  const [saving,   setSaving]   = useState(false)

  const handleSubmit = async () => {
    if (mode === 'add' && (!username.trim() || !password || !fullName.trim())) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'err'); return
    }
    if (mode === 'add' && password.length < 6) {
      showToast('Mật khẩu tối thiểu 6 ký tự', 'err'); return
    }
    setSaving(true)
    try {
      const body: Record<string, unknown> = { fullName: fullName.trim(), email: email.trim(), role }
      if (mode === 'add') { body.username = username.trim().toLowerCase(); body.password = password }
      else if (password) body.password = password

      const url = mode === 'edit' ? `/api/users/${initial._id}` : '/api/users'
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.ok) { showToast(mode === 'edit' ? 'Đã cập nhật tài khoản' : 'Đã tạo tài khoản mới', 'ok'); onSaved() }
      else showToast(d.error || 'Lỗi', 'err')
    } catch { showToast('Lỗi kết nối', 'err') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">{mode === 'edit' ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản mới'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          {mode === 'add' ? (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tên đăng nhập <span className="text-red-500">*</span></label>
              <input value={username} onChange={e => setUsername(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] font-mono"
                placeholder="vd: ngoclm_vcc"/>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <span className="text-xs text-gray-400">Tài khoản:</span>
              <span className="text-xs font-mono font-bold text-gray-700">{initial?.username}</span>
            </div>
          )}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
            <input value={fullName} onChange={e => setFullName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="Nguyễn Văn A"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="email@example.com"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Vai trò</label>
            <select value={role} onChange={e => setRole(e.target.value as typeof role)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] bg-white">
              <option value="reporter">Phóng viên</option>
              <option value="editor">Biên tập viên</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              {mode === 'add' ? <><span>Mật khẩu</span> <span className="text-red-500">*</span></> : 'Đổi mật khẩu (để trống nếu không đổi)'}
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder={mode === 'add' ? 'Tối thiểu 6 ký tự' : '••••••'}/>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">ĐÓNG</button>
          <button onClick={handleSubmit} disabled={saving}
            className="px-5 py-2 text-sm font-bold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] disabled:opacity-50 transition-colors">
            {saving ? 'Đang lưu...' : 'LƯU'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   MODAL: CHUYÊN MỤC
══════════════════════════════════════════════════════════ */
function CatModal({ mode, cats, initial, onClose, onSaved, showToast }: {
  mode: 'add'|'edit'
  cats: any[]
  initial: any
  onClose: () => void
  onSaved: () => void
  showToast: (m: string, t: 'ok'|'err') => void
}) {
  const toSlug = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const [name,         setName]         = useState(initial?.name         || '')
  const [slug,         setSlug]         = useState(initial?.slug         || '')
  const [parentId,     setParentId]     = useState(initial?.parentId     || '')
  const [displayOrder, setDisplayOrder] = useState(initial?.displayOrder ?? 0)
  const [slugEdited,   setSlugEdited]   = useState(false)
  const [saving,       setSaving]       = useState(false)

  const handleName = (v: string) => {
    setName(v)
    if (!slugEdited) setSlug(toSlug(v))
  }

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) { showToast('Tên và slug không được để trống', 'err'); return }
    setSaving(true)
    try {
      const body = { name: name.trim(), slug: slug.trim(), parentId: parentId || null, displayOrder }
      const url  = mode === 'edit' ? `/api/categories/${initial._id}` : '/api/categories'
      const res  = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const d = await res.json()
      if (d.ok) { showToast(mode === 'edit' ? 'Đã cập nhật chuyên mục' : 'Đã tạo chuyên mục mới', 'ok'); onSaved() }
      else showToast(d.error || 'Lỗi', 'err')
    } catch { showToast('Lỗi kết nối', 'err') }
    finally { setSaving(false) }
  }

  const parentOptions = cats.filter(c => mode === 'add' || c._id !== initial?._id)

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">{mode === 'edit' ? 'Chỉnh sửa chuyên mục' : 'Thêm chuyên mục mới'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tên chuyên mục <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => handleName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="Ví dụ: Thời sự"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug <span className="text-red-500">*</span></label>
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] font-mono"
              placeholder="thoi-su"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Chuyên mục cha</label>
            <select value={parentId} onChange={e => setParentId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] bg-white">
              <option value="">— Chuyên mục gốc —</option>
              {parentOptions.map((c: any) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Thứ tự hiển thị</label>
            <input type="number" value={displayOrder} onChange={e => setDisplayOrder(+e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"/>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">ĐÓNG</button>
          <button onClick={handleSubmit} disabled={saving || !name.trim() || !slug.trim()}
            className="px-5 py-2 text-sm font-bold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] disabled:opacity-50 transition-colors">
            {saving ? 'Đang lưu...' : 'LƯU'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   12. MP3 (EMPTY STATE)
══════════════════════════════════════════════════════════ */
function SectionMp3({ search, setSearch }: any) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm audio mới
        </button>
        <select className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option>Tất cả loại mp3</option><option>Podcast</option><option>Nhạc nền</option>
        </select>
        <input type="date" className="px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
        <div className="relative ml-auto">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm theo từ khóa..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] w-48"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <div className="bg-white rounded border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {['Avatar','Chuyên mục','Tên file','Tải lên bởi','Định dạng','Dung lượng','Thời gian tải lên'].map((h,i) => (
                <th key={i} className="px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={7} className="px-4 py-16 text-center">
                <div className="flex flex-col items-center gap-3">
                  <svg className="w-12 h-12 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
                  </svg>
                  <p className="text-sm font-bold text-gray-400">Không có dữ liệu !!!</p>
                  <p className="text-xs text-gray-300">Bấm "Thêm audio mới" để tải file âm thanh lên hệ thống</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   DEPT MODAL
══════════════════════════════════════════════════════════ */
function DeptModal({ mode, initial, onClose, onSaved, showToast }: {
  mode: 'add'|'edit'; initial: any; onClose: () => void; onSaved: () => void
  showToast: (m: string, t: 'ok'|'err') => void
}) {
  const toSlug = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const [name,       setName]       = useState(initial?.name     || '')
  const [slug,       setSlug]       = useState(initial?.slug     || '')
  const [location,   setLocation]   = useState(initial?.location || '')
  const [slugEdited, setSlugEdited] = useState(false)
  const [saving,     setSaving]     = useState(false)

  const handleName = (v: string) => { setName(v); if (!slugEdited) setSlug(toSlug(v)) }

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) { showToast('Tên và slug không được để trống', 'err'); return }
    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/departments/${initial._id}` : '/api/departments'
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), location: location.trim() }),
      })
      const d = await res.json()
      if (d.ok) { showToast(mode === 'edit' ? 'Đã cập nhật phòng ban' : 'Đã tạo phòng ban mới', 'ok'); onSaved() }
      else showToast(d.error || 'Lỗi', 'err')
    } catch { showToast('Lỗi kết nối', 'err') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">{mode === 'edit' ? 'Chỉnh sửa phòng ban' : 'Thêm phòng ban mới'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tên phòng ban <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => handleName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="Văn phòng Hà Nội"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug <span className="text-red-500">*</span></label>
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] font-mono"
              placeholder="van-phong-ha-noi"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Địa điểm</label>
            <input value={location} onChange={e => setLocation(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="Hà Nội"/>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">ĐÓNG</button>
          <button onClick={handleSubmit} disabled={saving || !name.trim() || !slug.trim()}
            className="px-5 py-2 text-sm font-bold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] disabled:opacity-50 transition-colors">
            {saving ? 'Đang lưu...' : 'LƯU'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   AUTHOR MODAL
══════════════════════════════════════════════════════════ */
function AuthorModal({ mode, initial, onClose, onSaved, showToast }: {
  mode: 'add'|'edit'; initial: any; onClose: () => void; onSaved: () => void
  showToast: (m: string, t: 'ok'|'err') => void
}) {
  const toSlug = (s: string) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const [name,       setName]       = useState(initial?.name   || '')
  const [slug,       setSlug]       = useState(initial?.slug   || '')
  const [bio,        setBio]        = useState(initial?.bio    || '')
  const [email,      setEmail]      = useState(initial?.email  || '')
  const [avatar,     setAvatar]     = useState(initial?.avatar || '')
  const [slugEdited, setSlugEdited] = useState(false)
  const [saving,     setSaving]     = useState(false)

  const handleName = (v: string) => { setName(v); if (!slugEdited) setSlug(toSlug(v)) }

  const handleSubmit = async () => {
    if (!name.trim() || !slug.trim()) { showToast('Tên và slug không được để trống', 'err'); return }
    setSaving(true)
    try {
      const url = mode === 'edit' ? `/api/authors/${initial._id}` : '/api/authors'
      const res = await fetch(url, {
        method: mode === 'edit' ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), slug: slug.trim(), bio: bio.trim(), email: email.trim(), avatar }),
      })
      const d = await res.json()
      if (d.ok) { showToast(mode === 'edit' ? 'Đã cập nhật tác giả' : 'Đã tạo tác giả mới', 'ok'); onSaved() }
      else showToast(d.error || 'Lỗi', 'err')
    } catch { showToast('Lỗi kết nối', 'err') }
    finally { setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-sm font-bold text-gray-800">{mode === 'edit' ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tên tác giả <span className="text-red-500">*</span></label>
            <input value={name} onChange={e => handleName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="Nguyễn Văn A"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Slug <span className="text-red-500">*</span></label>
            <input value={slug} onChange={e => { setSlug(e.target.value); setSlugEdited(true) }}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] font-mono"
              placeholder="nguyen-van-a"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="tacgia@example.com"/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Giới thiệu (Bio)</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#17a2b8]"
              placeholder="Phóng viên kỳ cựu với 10 năm kinh nghiệm..."/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">URL ảnh đại diện</label>
            <input value={avatar} onChange={e => setAvatar(e.target.value)}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"
              placeholder="https://..."/>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-bold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">ĐÓNG</button>
          <button onClick={handleSubmit} disabled={saving || !name.trim() || !slug.trim()}
            className="px-5 py-2 text-sm font-bold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] disabled:opacity-50 transition-colors">
            {saving ? 'Đang lưu...' : 'LƯU'}
          </button>
        </div>
      </div>
    </div>
  )
}
