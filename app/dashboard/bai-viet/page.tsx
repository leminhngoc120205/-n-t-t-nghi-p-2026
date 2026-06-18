'use client'

import React, { useState, useRef, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'
import { IMSArticleTypeModal } from '@/components/IMS/IMSArticleTypeModal'

/* ═══════════════════════════════════════════════════════════
   TYPES
══════════════════════════════════════════════════════════ */
type ArticleStatus =
  | 'draft' | 'processing' | 'mine_published' | 'approved'
  | 'waiting_edit' | 'waiting_publish' | 'cross_post'
  | 'published' | 'removed' | 'deleted' | 'returned' | 'in_progress'
  | 'magazine'

interface Article {
  id: number
  title: string
  writer: string
  editor: string | null
  publisher: string | null
  date: string
  status: ArticleStatus
  views: number
  category: string
  department: string
  size: string
  showOnHome: boolean
  isFeatured: boolean
  sapo: string
  body: string
  source: string
  notes: string
}

interface Log { time: string; user: string; action: string }

/* ═══════════════════════════════════════════════════════════
   DỮ LIỆU MẪU
══════════════════════════════════════════════════════════ */
const ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Dự báo thời tiết ngày 24/5/2026: Hà Nội nắng nóng gay gắt, nhiệt độ lên tới 39°C',
    writer: 'minhvu', editor: 'minhquang914', publisher: 'hoattv_vcc',
    date: '24/05/2026 06:00', status: 'published', views: 15423,
    category: 'Thời Sự', department: 'Ban Thời sự', size: 'Bài thường (size M)',
    showOnHome: true, isFeatured: true,
    sapo: 'Theo Trung tâm Khí tượng Thủy văn Quốc gia, ngày 24/5/2026 Hà Nội và các tỉnh Bắc Bộ tiếp tục chịu ảnh hưởng của đợt nắng nóng gay gắt, nhiệt độ cao nhất lên tới 39–40°C, chỉ số UV ở mức nguy hiểm.',
    body: `Cơ quan khí tượng cảnh báo người dân hạn chế ra ngoài trong khung giờ 10h–16h. Khu vực Tây Bắc Bộ nắng nóng đặc biệt gay gắt với nhiệt độ phổ biến 37–39°C, có nơi trên 40°C.\n\nMiền Trung: Từ Thanh Hóa đến Thừa Thiên Huế nắng nóng, nhiệt độ 35–38°C. Nam Bộ chiều tối có mưa dông, đề phòng lốc, sét và gió giật mạnh.\n\nDự báo đợt nắng nóng kéo dài đến hết ngày 27/5, sau đó có khả năng xuất hiện không khí lạnh yếu gây mưa cho khu vực Bắc Bộ.`,
    source: 'TTXVN', notes: '',
  },
  {
    id: 2,
    title: 'Quốc hội thông qua Nghị quyết về cơ cấu lại nền kinh tế giai đoạn 2026–2030',
    writer: 'muaxuan', editor: null, publisher: 'minhvu',
    date: '23/05/2026 15:30', status: 'published', views: 9871,
    category: 'Kinh Tế', department: 'Ban Kinh tế', size: 'Bài thường (size L)',
    showOnHome: false, isFeatured: false,
    sapo: 'Với 472/473 đại biểu tán thành, Quốc hội đã chính thức thông qua Nghị quyết về Kế hoạch cơ cấu lại nền kinh tế giai đoạn 2026–2030, đặt mục tiêu tăng trưởng GDP bình quân 7,5%/năm.',
    body: `Nghị quyết xác định 5 lĩnh vực ưu tiên tái cơ cấu gồm: đầu tư công, doanh nghiệp nhà nước, hệ thống tổ chức tín dụng, đơn vị sự nghiệp công lập và ngân sách nhà nước.\n\nMục tiêu đến 2030: kinh tế số đóng góp 30% GDP; xuất khẩu tăng trưởng bình quân 7–8%/năm; nợ công không quá 60% GDP.`,
    source: 'Cổng TTĐT Quốc hội', notes: 'Cần cập nhật số liệu từ báo cáo chính thức',
  },
  {
    id: 3,
    title: 'TP.HCM ra mắt ứng dụng tra cứu ngập lụt thời gian thực cho người dân',
    writer: 'hoattv_vcc', editor: 'minhquang914', publisher: 'hoattv_vcc',
    date: '23/05/2026 09:15', status: 'waiting_edit', views: 0,
    category: 'Xã Hội', department: 'Ban Xã hội', size: 'Bài thường (size S)',
    showOnHome: false, isFeatured: false,
    sapo: 'UBND TP.HCM vừa ra mắt ứng dụng "HCM Flood Alert" cho phép người dân tra cứu điểm ngập lụt theo thời gian thực, cập nhật mỗi 5 phút từ hệ thống 1.200 cảm biến đặt khắp thành phố.',
    body: `Ứng dụng tích hợp bản đồ Google Maps, cảnh báo đẩy (push notification) khi khu vực người dùng có nguy cơ ngập trên 20cm. Đây là bước tiến quan trọng trong chiến lược đô thị thông minh của TP.HCM giai đoạn 2025–2030.`,
    source: 'UBND TP.HCM', notes: '',
  },
  {
    id: 4,
    title: 'VinFast ra mắt mẫu xe điện VF 3 Plus với tầm hoạt động 350 km',
    writer: 'ngoclm_vcc', editor: null, publisher: null,
    date: '22/05/2026 14:00', status: 'draft', views: 0,
    category: 'Kinh Tế', department: 'Ban Kinh tế', size: 'Bài thường (size M)',
    showOnHome: false, isFeatured: false,
    sapo: 'VinFast chính thức giới thiệu phiên bản nâng cấp VF 3 Plus tại triển lãm ô tô Hà Nội 2026, với pin mới cho phép di chuyển tới 350 km mỗi lần sạc đầy, giá bán dự kiến 390 triệu đồng.',
    body: `VF 3 Plus được trang bị pin LFP dung lượng 42 kWh, hỗ trợ sạc nhanh DC 50kW. Xe có thêm tính năng hỗ trợ lái tự động Level 2, camera 360 độ và màn hình trung tâm 10,4 inch.`,
    source: 'VinFast', notes: 'Chờ ảnh chính thức từ PR VinFast',
  },
  {
    id: 5,
    title: 'Đội tuyển Việt Nam triệu tập 28 cầu thủ chuẩn bị cho AFF Cup 2026',
    writer: 'dinhluong_vcc', editor: 'minhquang914', publisher: 'minhvu',
    date: '22/05/2026 11:30', status: 'published', views: 24105,
    category: 'Thể Thao', department: 'Ban Thể thao', size: 'Bài thường (size M)',
    showOnHome: true, isFeatured: true,
    sapo: 'HLV trưởng Kim Sang-sik công bố danh sách 28 cầu thủ được triệu tập vào đội tuyển Việt Nam cho vòng loại AFF Cup 2026, trong đó có 5 cầu thủ đang thi đấu tại nước ngoài.',
    body: `Đáng chú ý có sự trở lại của tiền đạo Nguyễn Tiến Linh sau thời gian điều trị chấn thương. Đội sẽ tập trung từ ngày 1/6 tại Hà Nội trước khi di chuyển sang Thái Lan thi đấu vào ngày 10/6.`,
    source: 'VFF', notes: '',
  },
]

const LOGS: Log[] = [
  { time:'24/05/2026 06:30:12', user:'minhquang914', action:'Biên tập — Sửa lỗi chính tả và cập nhật số liệu' },
  { time:'24/05/2026 06:00:05', user:'hoattv_vcc',   action:'Xuất bản bài viết' },
  { time:'23/05/2026 23:45:20', user:'minhvu',        action:'Gửi biên tập bài viết' },
  { time:'23/05/2026 20:10:00', user:'minhvu',        action:'Tạo bài viết mới — nháp lần 1' },
]

/* ─── Nhóm lọc trạng thái ─────────────────────────────────── */
const STATUS_GROUPS = [
  { label: 'TIN CỦA TÔI', items: [
    { id:'draft',          label:'Tin lưu tạm',        count:0    },
    { id:'processing',     label:'Tin nhận xử lý',     count:0    },
    { id:'mine_published', label:'Tin tôi xuất bản',   count:1728 },
    { id:'approved',       label:'Tin bạn đã duyệt',   count:0    },
  ]},
  { label: 'TIN XỬ LÝ', items: [
    { id:'waiting_edit',   label:'Bài chờ biên tập',   count:3    },
    { id:'waiting_publish',label:'Bài chờ xuất bản',   count:0    },
    { id:'cross_post',     label:'Bài đăng chéo',      count:4    },
    { id:'published',      label:'Bài đã xuất bản',    count:1728 },
    { id:'removed',        label:'Bài bị gỡ xuống',    count:40   },
    { id:'deleted',        label:'Bài bị xóa',         count:23   },
    { id:'returned',       label:'Bài trả lại tôi',    count:0    },
    { id:'in_progress',    label:'Bài đang xử lý',     count:36   },
  ]},
  { label: 'DẠNG TIN ĐẶC BIỆT', items: [
    { id:'magazine',       label:'Bài Magazine',        count:0    },
  ]},
]

const ALL_CATEGORIES = ['Tất cả chuyên mục','Thời Sự','Kinh Tế','Xã Hội','Công Nghệ','Thể Thao','Giải Trí','Sức Khỏe']
const ALL_DEPARTMENTS = ['Tất cả phòng ban','Ban Thời sự','Ban Kinh tế','Ban Xã hội','Ban Thể thao','Ban Công nghệ','Ban Giải trí']

/* ═══════════════════════════════════════════════════════════
   PAGE CHÍNH
══════════════════════════════════════════════════════════ */
function BaiVietContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [activeStatus,  setActiveStatus]  = useState(() => searchParams.get('status') ?? 'published')
  const [selected,      setSelected]      = useState<Article | null>(null)
  const [showHistory,   setShowHistory]   = useState(false)
  const [search,        setSearch]        = useState('')
  const [showAdv,       setShowAdv]       = useState(false)
  const [catFilter,     setCatFilter]     = useState('Tất cả chuyên mục')
  const [deptFilter,    setDeptFilter]    = useState('Tất cả phòng ban')
  const [filterAuthor,  setFilterAuthor]  = useState('')
  const [showTypeModal, setShowTypeModal] = useState(false)
  const [articles,      setArticles]      = useState<Article[]>(ARTICLES)

  const filtered = articles.filter(a => {
    const okStatus =
      activeStatus === 'published' || activeStatus === 'mine_published'
        ? a.status === 'published' || a.status === 'mine_published'
        : a.status === activeStatus
    const okSearch  = !search      || a.title.toLowerCase().includes(search.toLowerCase())
    const okCat     = catFilter  === 'Tất cả chuyên mục' || a.category  === catFilter
    const okDept    = deptFilter === 'Tất cả phòng ban'  || a.department === deptFilter
    const okAuthor  = !filterAuthor || a.writer.toLowerCase().includes(filterAuthor.toLowerCase())
    return okStatus && okSearch && okCat && okDept && okAuthor
  })

  const activeLabel = STATUS_GROUPS.flatMap(g => g.items).find(i => i.id === activeStatus)?.label ?? 'Bài viết'
  const toggleHome     = (id: number) => setArticles(l => l.map(a => a.id===id ? {...a, showOnHome: !a.showOnHome}  : a))
  const toggleFeatured = (id: number) => setArticles(l => l.map(a => a.id===id ? {...a, isFeatured: !a.isFeatured} : a))

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
                {g.items.map(item => (
                  <button key={item.id} onClick={() => setActiveStatus(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-2 text-left transition-colors border-l-[3px]
                      ${activeStatus===item.id
                        ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-[#17a2b8]'
                        : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}>
                    <span className="text-xs leading-tight">{item.label}</span>
                    {item.count>0 && (
                      <span className="min-w-[22px] h-[18px] bg-yellow-400 text-yellow-900 text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0">
                        {item.count.toLocaleString()}
                      </span>
                    )}
                  </button>
                ))}
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
                  {filtered.length>0 ? `1 đến ${filtered.length} trong ${filtered.length}` : 'Không có kết quả'}
                </p>
              </div>

              {/* Dropdown lọc chuyên mục */}
              <select value={catFilter} onChange={e=>setCatFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-600 focus:outline-none focus:border-[#17a2b8] cursor-pointer">
                {ALL_CATEGORIES.map(c=><option key={c}>{c}</option>)}
              </select>

              {/* Dropdown lọc phòng ban */}
              <select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}
                className="px-3 py-2 text-xs border border-gray-300 rounded bg-white text-gray-600 focus:outline-none focus:border-[#17a2b8] cursor-pointer">
                {ALL_DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
              </select>

              {/* VIẾT BÀI MỚI → hiện modal chọn dạng bài */}
              <button onClick={()=>setShowTypeModal(true)}
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
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Tìm kiếm theo từ khóa..."
                  className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]"/>
                <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
              <button className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded hover:bg-[#138496] transition-colors">Tìm kiếm</button>
              <button onClick={()=>setShowAdv(!showAdv)}
                className={`flex items-center gap-1.5 px-3 py-2 border text-sm rounded transition-colors
                  ${showAdv?'bg-[#e8f7f9] border-[#17a2b8] text-[#17a2b8]':'border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}`}>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Người viết</label>
                  <input type="text" value={filterAuthor} onChange={e=>setFilterAuthor(e.target.value)}
                    placeholder="Nhập tên người viết..."
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-[#17a2b8]"/>
                </div>
                <div className="col-span-3 flex justify-end gap-2">
                  <button onClick={()=>{setFilterAuthor('')}}
                    className="px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50">Đặt lại</button>
                  <button className="px-3 py-1.5 text-xs text-white bg-[#17a2b8] rounded hover:bg-[#138496]">Áp dụng</button>
                </div>
              </div>
            )}

            {/* Danh sách bài viết */}
            <div className="bg-white rounded border border-gray-200 overflow-hidden">
              {/* Table header */}
              <div className="grid grid-cols-[72px_1fr_100px_80px_80px] gap-3 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
                {['Ảnh','Tiêu đề & Tác giả','Lượt xem','Hiển thị','Thao tác'].map((h,i)=>(
                  <div key={h} className={`text-[10px] font-bold text-gray-400 uppercase tracking-wide ${i>0?'text-center':''} ${i===1?'text-left':''}`}>{h}</div>
                ))}
              </div>

              {filtered.length===0 ? (
                <div className="py-16 text-center">
                  <svg className="w-10 h-10 mx-auto mb-2 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                  </svg>
                  <p className="text-sm text-gray-400">Không có bài viết nào trong mục này</p>
                </div>
              ) : filtered.map((a,idx)=>(
                <ArticleRow key={a.id} article={a} isLast={idx===filtered.length-1}
                  onSelect={()=>{setSelected(a);setShowHistory(false)}}
                  onToggleHome={()=>toggleHome(a.id)}
                  onToggleFeatured={()=>toggleFeatured(a.id)}/>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Modal chi tiết bài viết */}
      {selected && (
        <ArticleDetailModal article={selected} logs={LOGS} showHistory={showHistory}
          onToggleHistory={()=>setShowHistory(v=>!v)}
          onClose={()=>setSelected(null)}
          onEdit={()=>router.push(`/dashboard/viet-bai-moi?type=size-m&id=${selected.id}`)}/>
      )}

      {/* Modal chọn dạng bài → dùng lại IMSArticleTypeModal đã có */}
      {showTypeModal && (
        <IMSArticleTypeModal onClose={()=>setShowTypeModal(false)}/>
      )}
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
function ArticleRow({ article:a, isLast, onSelect, onToggleHome, onToggleFeatured }:{
  article:Article; isLast:boolean; onSelect:()=>void; onToggleHome:()=>void; onToggleFeatured:()=>void
}) {
  /* Tạo chuỗi quy trình làm việc */
  const workflow = (() => {
    const parts: string[] = []
    if (a.writer)    parts.push(`Viết bởi ${a.writer}`)
    if (a.editor)    parts.push(`Biên tập bởi ${a.editor}`)
    if (a.publisher) parts.push(`Xuất bản bởi ${a.publisher}`)
    return parts.join(' · ')
  })()

  return (
    <div className={`grid grid-cols-[72px_1fr_100px_80px_80px] gap-3 px-4 py-3 items-center hover:bg-gray-50 transition-colors ${!isLast?'border-b border-gray-100':''}`}>

      {/* Thumbnail */}
      <div className={`w-[68px] h-12 rounded flex items-center justify-center flex-shrink-0 text-white/80
        ${a.isFeatured ? 'bg-gradient-to-br from-orange-400 to-rose-500' : 'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
        </svg>
      </div>

      {/* Tiêu đề + meta */}
      <div className="min-w-0">
        <button onClick={onSelect}
          className="text-sm font-semibold text-gray-800 hover:text-[#17a2b8] transition-colors text-left leading-snug line-clamp-2 w-full">
          {a.title}
        </button>
        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 mt-1">
          <span className="text-xs text-gray-400">{a.date}</span>
          <span className="text-gray-300">•</span>
          {/* Chuyên mục */}
          <span className="px-1.5 py-0.5 text-[10px] bg-blue-50 text-blue-600 rounded font-medium">{a.category}</span>
          <StatusBadge status={a.status}/>
        </div>
        {/* Chuỗi quy trình vai trò */}
        <p className="text-[10px] text-gray-400 mt-1 truncate">{workflow}</p>
      </div>

      {/* Lượt xem */}
      <div className="text-center">
        <span className="text-xs text-gray-600 font-medium">{a.views>0 ? a.views.toLocaleString() : '—'}</span>
      </div>

      {/* Icon mắt + sao */}
      <div className="flex items-center justify-center gap-1.5">
        <Tip text={a.showOnHome?'Đang hiển thị trên trang chủ':'Hiển thị trên trang chủ'}>
          <button onClick={onToggleHome}
            className={`p-1.5 rounded transition-colors ${a.showOnHome?'text-[#17a2b8] bg-[#e8f7f9]':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
          </button>
        </Tip>
        <Tip text={a.isFeatured?'Bài nổi bật':'Đánh dấu nổi bật'}>
          <button onClick={onToggleFeatured}
            className={`p-1.5 rounded transition-colors ${a.isFeatured?'text-yellow-500 bg-yellow-50':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
            <svg className="w-4 h-4" fill={a.isFeatured?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
            </svg>
          </button>
        </Tip>
      </div>

      {/* Thao tác */}
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
   MODAL CHI TIẾT BÀI VIẾT
══════════════════════════════════════════════════════════ */
function ArticleDetailModal({ article:a, logs, showHistory, onToggleHistory, onClose, onEdit }:{
  article:Article; logs:Log[]; showHistory:boolean
  onToggleHistory:()=>void; onClose:()=>void; onEdit:()=>void
}) {
  const [infoTab, setInfoTab] = useState<'basic'|'dist'>('basic')

  return (
    <div className="fixed inset-0 z-[200] flex">
      <div className="flex-1 bg-black/50" onClick={onClose}/>
      <div className="w-[860px] bg-white flex flex-col shadow-2xl animate-slide-in-right overflow-hidden">

        {/* Header */}
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

        {/* Body: nội dung trái + info phải */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Nội dung bài viết (text) */}
          <div className="flex-1 overflow-y-auto px-8 py-6 bg-white">
            {/* Chuyên mục + trạng thái */}
            <div className="flex items-center gap-2 mb-3">
              <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded uppercase tracking-wide">{a.category}</span>
              <StatusBadge status={a.status}/>
              <span className="text-xs text-gray-400">{a.size}</span>
            </div>

            {/* Tiêu đề */}
            <h1 className="text-xl font-bold text-gray-900 leading-snug mb-4" style={{fontFamily:'Georgia, serif'}}>
              {a.title}
            </h1>

            {/* Chuỗi quy trình */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-100 flex-wrap">
              {a.writer    && <WorkflowTag icon="✍️" label="Viết bởi"     name={a.writer}/>}
              {a.editor    && <WorkflowTag icon="✏️" label="Biên tập bởi" name={a.editor}/>}
              {a.publisher && <WorkflowTag icon="📢" label="Xuất bản bởi" name={a.publisher}/>}
              <span className="text-xs text-gray-400 ml-auto">{a.date}</span>
            </div>

            {/* Sapo */}
            <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-5 p-3 bg-gray-50 border-l-4 border-[#17a2b8] rounded-r">
              {a.sapo}
            </p>

            {/* Thân bài */}
            <div className="text-sm text-gray-700 leading-relaxed space-y-3">
              {a.body.split('\n').map((para, i) => para.trim() && (
                <p key={i}>{para}</p>
              ))}
            </div>

            {/* Source */}
            {a.source && (
              <p className="mt-6 text-xs text-gray-400 italic border-t border-gray-100 pt-4">Nguồn: {a.source}</p>
            )}
          </div>

          {/* Panel thông tin phải */}
          <div className="w-72 border-l border-gray-200 overflow-y-auto flex-shrink-0 bg-white">
            <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
              {(['basic','dist'] as const).map(t=>(
                <button key={t} onClick={()=>setInfoTab(t)}
                  className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${infoTab===t?'text-[#17a2b8] border-b-2 border-[#17a2b8]':'text-gray-500 hover:text-gray-700'}`}>
                  {t==='basic'?'THÔNG TIN CƠ BẢN':'PHÂN PHỐI'}
                </button>
              ))}
            </div>

            <div className="px-4 py-3 space-y-2.5">
              {infoTab==='basic' ? <>
                {/* Ảnh đại diện */}
                <div className="flex items-center gap-3 mb-3 p-2 bg-gray-50 rounded border border-gray-100">
                  <div className={`w-12 h-12 rounded flex items-center justify-center flex-shrink-0 ${a.isFeatured?'bg-gradient-to-br from-orange-400 to-rose-500':'bg-gradient-to-br from-slate-400 to-slate-500'}`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div><p className="text-xs font-medium text-gray-700">Ảnh đại diện</p><button className="text-[10px] text-[#17a2b8] mt-0.5">Thay đổi ảnh</button></div>
                </div>
                <IR label="Cho hiển thị avatar" value={<Tog on={a.showOnHome}/>}/>
                <IR label="Dạng bài"        value={a.size}/>
                <IR label="Tác giả"         value={a.writer}/>
                {a.editor    && <IR label="Biên tập"  value={a.editor}/>}
                {a.publisher && <IR label="Xuất bản"  value={a.publisher}/>}
                <IR label="Ngày xuất bản"   value={a.date}/>
                <IR label="Nguồn tin"       value={a.source||'—'}/>
                <IR label="Lượt xem"        value={a.views>0?a.views.toLocaleString():'0'}/>
                {a.notes && <IR label="Ghi chú" value={a.notes}/>}
              </> : <>
                <IR label="Chuyên mục chính"  value={a.category}/>
                <IR label="Phòng ban"         value={a.department}/>
                <IR label="Dòng sự kiện"      value="—"/>
                <IR label="Chủ đề"            value="—"/>
                <div className="border-t border-gray-100 pt-2 mt-2 space-y-2.5">
                  <TR label="Bài nhạy cảm"        on={false}/>
                  <TR label="Hiển thị trang chủ"  on={a.showOnHome}/>
                  <TR label="Tin tiêu điểm"        on={a.isFeatured}/>
                  <TR label="Bài đăng chéo"        on={a.status==='cross_post'}/>
                  <TR label="Bài AdStore"          on={false}/>
                  <TR label="Bài PR"               on={false}/>
                </div>
              </>}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={a.status}/>
            {a.views>0 && <span className="text-xs text-gray-400">{a.views.toLocaleString()} lượt xem</span>}
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

/* ─── Workflow tag ────────────────────────────────────────── */
function WorkflowTag({ icon, label, name }:{ icon:string; label:string; name:string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-500">
      <span>{icon}</span>
      <span>{label}</span>
      <span className="font-semibold text-gray-700">{name}</span>
    </div>
  )
}

/* ─── Status badge ────────────────────────────────────────── */
function StatusBadge({ status }:{ status:ArticleStatus }) {
  const m:Record<ArticleStatus,{label:string;cls:string}> = {
    published:      {label:'Đã xuất bản',  cls:'bg-green-100 text-green-700'},
    mine_published: {label:'Đã xuất bản',  cls:'bg-green-100 text-green-700'},
    waiting_publish:{label:'Chờ xuất bản', cls:'bg-yellow-100 text-yellow-700'},
    waiting_edit:   {label:'Chờ biên tập', cls:'bg-blue-100 text-blue-700'},
    draft:          {label:'Lưu tạm',      cls:'bg-gray-100 text-gray-600'},
    processing:     {label:'Nhận xử lý',   cls:'bg-purple-100 text-purple-700'},
    approved:       {label:'Đã duyệt',     cls:'bg-teal-100 text-teal-700'},
    cross_post:     {label:'Đăng chéo',    cls:'bg-indigo-100 text-indigo-700'},
    removed:        {label:'Bị gỡ xuống',  cls:'bg-orange-100 text-orange-700'},
    deleted:        {label:'Đã xóa',       cls:'bg-red-200 text-red-800'},
    returned:       {label:'Bị trả lại',   cls:'bg-red-100 text-red-600'},
    in_progress:    {label:'Đang xử lý',   cls:'bg-cyan-100 text-cyan-700'},
    magazine:       {label:'Magazine',     cls:'bg-pink-100 text-pink-700'},
  }
  const {label,cls}=m[status]||{label:status,cls:'bg-gray-100 text-gray-600'}
  return <span className={`px-1.5 py-0.5 text-[10px] font-semibold rounded ${cls}`}>{label}</span>
}

/* ─── Shared mini helpers ─────────────────────────────────── */
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
function Tog({on}:{on:boolean}) {
  return <div className={`w-8 h-4 rounded-full transition-colors ${on?'bg-[#17a2b8]':'bg-gray-300'}`}><div className={`w-3 h-3 bg-white rounded-full mt-0.5 shadow transition-transform ${on?'translate-x-4':'translate-x-0.5'}`}/></div>
}
function IR({label,value}:{label:string;value:React.ReactNode}) {
  return <div className="flex items-center justify-between gap-2 py-0.5"><span className="text-xs text-gray-500 flex-shrink-0">{label}</span><span className="text-xs font-medium text-gray-800 text-right max-w-[150px] truncate">{value}</span></div>
}
function TR({label,on}:{label:string;on:boolean}) {
  return <div className="flex items-center justify-between"><span className="text-xs text-gray-500">{label}</span><Tog on={on}/></div>
}
