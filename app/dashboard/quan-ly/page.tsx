'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

/* ═══════════════════════════════════════════════════════════
   CẤU HÌNH MENU
══════════════════════════════════════════════════════════ */
const MENUS = [
  { id: 'log-action',      label: 'Log Action' },
  { id: 'phong-ban',       label: 'Quản lý phòng ban' },
  { id: 'menu-chuyen-muc', label: 'Menu chuyên mục' },
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
const D_PHONG_BAN = [
  { id:1, name:'Hà Nội',    desc:'Văn phòng tổng biên tập',     members:45 },
  { id:2, name:'TPHCM',     desc:'Văn phòng phía Nam',          members:32 },
  { id:3, name:'Nha Trang', desc:'Văn phòng miền Trung Nam',    members:12 },
  { id:4, name:'Đà Nẵng',   desc:'Văn phòng miền Trung',       members:18 },
  { id:5, name:'Cần Thơ',   desc:'Văn phòng đồng bằng SCL',    members:10 },
]

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

const D_TAC_GIA = [
  { id:1, name:'Minh Vũ',        desc:'Phóng viên thời sự, 8 năm kinh nghiệm',   articles:342 },
  { id:2, name:'Thanh Hà',       desc:'Biên tập viên kinh tế',                   articles:215 },
  { id:3, name:'Hoàng Anh',      desc:'Phóng viên thể thao',                     articles:488 },
  { id:4, name:'Kim Phụng',      desc:'Biên tập viên văn hóa - xã hội',         articles:176 },
  { id:5, name:'Trần Đức Lương', desc:'Phóng viên công nghệ và đổi mới sáng tạo',articles:134 },
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

const D_LOG = [
  { id:1, user:'minhvu',       action:'xuất bản bài viết', target:'Dự báo thời tiết ngày 24/5/2026',       rel:'19 giờ trước',  abs:'24/05/2026 06:00', type:'publish' },
  { id:2, user:'dinhluong_vcc',action:'sửa bài viết',      target:'Hà Nội sẽ có thêm 2 tuyến metro',       rel:'1 ngày trước',  abs:'23/05/2026 14:20', type:'edit'    },
  { id:3, user:'NGOCLM_VCC',   action:'xóa bài viết',      target:'[Nháp] Bài chưa hoàn thành tháng 4',    rel:'1 ngày trước',  abs:'23/05/2026 09:45', type:'delete'  },
  { id:4, user:'hoattv_vcc',   action:'nhận biên tập',     target:'Công nghệ AI thay đổi ngành báo chí',   rel:'2 ngày trước',  abs:'22/05/2026 16:30', type:'edit'    },
  { id:5, user:'minhquang914', action:'duyệt bài viết',    target:'Quốc hội thông qua Nghị quyết 2026',    rel:'2 ngày trước',  abs:'22/05/2026 10:15', type:'publish' },
  { id:6, user:'muaxuan',      action:'xuất bản bài viết', target:'VinFast ra mắt mẫu xe VF 3 Plus',       rel:'3 ngày trước',  abs:'21/05/2026 08:00', type:'publish' },
  { id:7, user:'trangnv_vcc',  action:'trả lại bài viết',  target:'Phân tích kinh tế quý II',              rel:'3 ngày trước',  abs:'21/05/2026 11:20', type:'return'  },
  { id:8, user:'dinhluong_vcc',action:'sửa bài viết',      target:'TP.HCM ra mắt ứng dụng tra cứu ngập',  rel:'4 ngày trước',  abs:'20/05/2026 15:40', type:'edit'    },
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
  const [active,   setActive]   = useState('log-action')
  const [loading,  setLoading]  = useState(false)
  const [editItem, setEditItem] = useState<any>(null)
  const [search,   setSearch]   = useState('')

  /* Simulate data loading when switching sections */
  const switchMenu = useCallback((id: string) => {
    if (id === active) return
    setLoading(true)
    setSearch('')
    setTimeout(() => {
      setActive(id)
      setLoading(false)
    }, 700)
  }, [active])

  const activeMenu = MENUS.find(m => m.id === active)

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

            {/* Loading pill */}
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#f0f2f5]/60">
                <div className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-full px-5 py-2.5 shadow-lg text-sm text-gray-600">
                  <svg className="w-4 h-4 animate-spin text-[#17a2b8]" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Đang tải thông tin...
                </div>
              </div>
            )}

            {!loading && (
              <div>
                {active === 'log-action'      && <SectionLogAction search={search} setSearch={setSearch}/>}
                {active === 'phong-ban'       && <SectionPhongBan  search={search} setSearch={setSearch} onEdit={setEditItem}/>}
                {active === 'menu-chuyen-muc' && <SectionMenuChuyenMuc/>}
                {active === 'dong-su-kien'    && <SectionDongSuKien search={search} setSearch={setSearch}/>}
                {active === 'tro-ly-tin'      && <SectionTroLyTin  search={search} setSearch={setSearch}/>}
                {active === 'profile-tac-gia' && <SectionTacGia    search={search} setSearch={setSearch} onEdit={setEditItem}/>}
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

      {/* Edit modal */}
      {editItem && <EditModal item={editItem} section={active} onClose={() => setEditItem(null)}/>}
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

/* Log action color */
function actionColor(type: string) {
  const m: Record<string, string> = { publish: 'text-green-600 bg-green-50', edit: 'text-blue-600 bg-blue-50', delete: 'text-red-600 bg-red-50', return: 'text-orange-600 bg-orange-50' }
  return m[type] || 'text-gray-600 bg-gray-50'
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
   1. LOG ACTION (DEFAULT)
══════════════════════════════════════════════════════════ */
function SectionLogAction({ search, setSearch }: any) {
  const [objFilter,  setObjFilter]  = useState('')
  const [actFilter,  setActFilter]  = useState('')
  const [dateFrom,   setDateFrom]   = useState('')
  const [dateTo,     setDateTo]     = useState('')

  const filtered = D_LOG.filter(l =>
    (!search || l.target.toLowerCase().includes(search.toLowerCase()) || l.user.includes(search)) &&
    (!actFilter || l.type === actFilter)
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-base font-bold text-gray-800">Log Action</h1>
      </div>
      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4 grid grid-cols-4 gap-3">
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Đối tượng log</label>
          <select value={objFilter} onChange={e=>setObjFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] bg-white">
            <option value="">Tất cả</option>
            <option>Bài viết</option><option>Podcast</option><option>Người dùng</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Loại hành động</label>
          <select value={actFilter} onChange={e=>setActFilter(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8] bg-white">
            <option value="">Tất cả</option>
            <option value="publish">Xuất bản</option>
            <option value="edit">Sửa bài</option>
            <option value="delete">Xóa bài</option>
            <option value="return">Trả lại</option>
          </select>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Từ ngày</label>
          <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
        </div>
        <div>
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Tới ngày</label>
          <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)}
            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
        </div>
        <div className="col-span-3">
          <label className="block text-[10px] font-semibold text-gray-500 mb-1 uppercase">Tìm kiếm</label>
          <div className="relative">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm theo tên bài viết, user..."
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
            <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
        </div>
        <div className="flex items-end">
          <button className="w-full py-1.5 bg-[#17a2b8] text-white text-xs font-bold rounded hover:bg-[#138496] transition-colors">Lọc</button>
        </div>
      </div>

      <DataTable headers={['User', 'Hành động', 'Đối tượng', 'Thời gian', 'Cụ thể']}>
        {filtered.map(l => (
          <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3">
              <div className="flex items-center gap-2">
                <Av label={l.user} color="bg-slate-500"/>
                <span className="font-medium text-gray-700">{l.user}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${actionColor(l.type)}`}>{l.action}</span>
            </td>
            <td className="px-4 py-3 max-w-xs">
              <p className="text-gray-700 line-clamp-1">{l.target}</p>
            </td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-400">{l.rel}</td>
            <td className="px-4 py-3 whitespace-nowrap text-gray-400 font-mono">{l.abs}</td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={D_LOG.length}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   2. QUẢN LÝ PHÒNG BAN
══════════════════════════════════════════════════════════ */
function SectionPhongBan({ search, setSearch, onEdit }: any) {
  const filtered = D_PHONG_BAN.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
  return (
    <div>
      <Toolbar addLabel="Thêm phòng ban mới" search={search} setSearch={setSearch}/>
      <DataTable headers={['Avatar', 'Tên phòng ban', 'Mô tả', 'Nhân viên', 'Thao tác']}>
        {filtered.map(p => (
          <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3"><Av label={p.name} color="bg-gradient-to-br from-[#17c3d8] to-[#0e7c8a]"/></td>
            <td className="px-4 py-3 font-semibold text-gray-800">{p.name}</td>
            <td className="px-4 py-3 text-gray-500">{p.desc}</td>
            <td className="px-4 py-3 text-center font-mono text-gray-600">{p.members}</td>
            <td className="px-4 py-3 text-center">
              <ThreeDot onEdit={() => onEdit(p)} onDelete={() => alert(`Xóa phòng ban: ${p.name}?`)}/>
            </td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={D_PHONG_BAN.length}/>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   3. MENU CHUYÊN MỤC
══════════════════════════════════════════════════════════ */
function SectionMenuChuyenMuc() {
  const [catFilter,  setCatFilter]  = useState('Thời sự')
  const [posFilter,  setPosFilter]  = useState('Menu top')
  const [showFilter, setShowFilter] = useState('Hiển thị')
  const [tagSearch,  setTagSearch]  = useState('')

  const menus = [
    { id:1, cat:'Thời sự', pos:'Menu top', status:'Hiển thị', order:1 },
    { id:2, cat:'Kinh tế', pos:'Menu top', status:'Hiển thị', order:2 },
    { id:3, cat:'Xã hội',  pos:'Menu footer', status:'Ẩn',    order:3 },
  ]
  const tags = ['thời-sự','kinh-tế','xã-hội','công-nghệ','thể-thao','giải-trí','sức-khỏe']

  return (
    <div>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm menu mới
        </button>
        <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          {['Thời sự','Kinh tế','Xã hội','Công nghệ','Thể thao'].map(c=><option key={c}>{c}</option>)}
        </select>
        <select value={posFilter} onChange={e=>setPosFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          {['Menu top','Menu footer','Menu sidebar'].map(p=><option key={p}>{p}</option>)}
        </select>
        <select value={showFilter} onChange={e=>setShowFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option>Hiển thị</option><option>Ẩn</option>
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Danh sách menu */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200">
            <p className="text-xs font-bold text-gray-600">Danh sách menu</p>
          </div>
          {menus.map(m => (
            <div key={m.id} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
              <div>
                <p className="text-xs font-semibold text-gray-800">{m.cat}</p>
                <p className="text-[10px] text-gray-400">{m.pos} · Thứ tự: {m.order}</p>
              </div>
              <div className="flex items-center gap-2">
                <SPill on={m.status === 'Hiển thị'}/>
                <ThreeDot onEdit={() => {}} onDelete={() => {}}/>
              </div>
            </div>
          ))}
        </div>

        {/* Danh sách tag */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <p className="text-xs font-bold text-gray-600">Danh sách tag</p>
          </div>
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <input value={tagSearch} onChange={e=>setTagSearch(e.target.value)} placeholder="Nhập từ khóa..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
              <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>
          <div className="p-3 flex flex-wrap gap-2">
            {tags.filter(t => !tagSearch || t.includes(tagSearch.toLowerCase())).map(t => (
              <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] rounded-full cursor-pointer hover:bg-[#e8f7f9] hover:text-[#17a2b8] transition-colors">
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>
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
function SectionTacGia({ search, setSearch, onEdit }: any) {
  const filtered = D_TAC_GIA.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()))
  const colors = ['bg-blue-500','bg-teal-500','bg-violet-500','bg-orange-500','bg-rose-500']
  return (
    <div>
      <Toolbar addLabel="Thêm tác giả mới" search={search} setSearch={setSearch}/>
      <DataTable headers={['Avatar', 'Tên tác giả', 'Mô tả', 'Bài viết', 'Thao tác']}>
        {filtered.map((t,i) => (
          <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3"><Av label={t.name} color={colors[i % colors.length]}/></td>
            <td className="px-4 py-3 font-semibold text-gray-800">{t.name}</td>
            <td className="px-4 py-3 text-gray-500">{t.desc}</td>
            <td className="px-4 py-3 text-center font-mono text-gray-600">{t.articles}</td>
            <td className="px-4 py-3 text-center"><ThreeDot onEdit={() => onEdit(t)} onDelete={() => {}}/></td>
          </tr>
        ))}
      </DataTable>
      <PagLabel from={1} to={filtered.length} total={33}/>
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
