'use client'

import React, { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'

type Panel = 'info'|'author'|'comment'|'settings'|'seo'|'ai'|null
const words = (t:string) => t.trim()===''?0:t.trim().split(/\s+/).length

const CATS = [
  {id:'podcast', label:'Podcast',   ch:['Thời sự','Kinh tế','Xã hội','Công nghệ','Thể thao']},
  {id:'thoi-su', label:'Thời Sự',   ch:['Trong nước','Quốc tế','Hà Nội']},
  {id:'kinh-te', label:'Kinh Tế',   ch:['Kinh doanh','Tiêu dùng','Tài chính']},
  {id:'cn',      label:'Công Nghệ', ch:['Điện thoại','Internet','AI']},
]
const AI_REL = [
  {src:'VCC',       t:'Tết Nguyên tiêu ở các nước Á Đông',                tm:'3 phút'},
  {src:'VnExpress', t:'Nguồn gốc ngày rằm tháng giêng trong văn hóa Việt',tm:'15 phút'},
  {src:'Dân Trí',   t:'Phong tục đón rằm tháng giêng trên cả nước',       tm:'1 giờ'},
  {src:'Zing',      t:'Ý nghĩa lễ hội Nguyên tiêu 2024',                  tm:'2 giờ'},
]

export default function TaoPodcastPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen text-gray-400">Đang tải...</div>}>
      <Content/>
    </Suspense>
  )
}

function Content() {
  const router = useRouter()
  const sp = useSearchParams()
  const editing = !!sp.get('id')

  const [title,    setTitle]    = useState('')
  const [sapo,     setSapo]     = useState('')
  const [panel,    setPanel]    = useState<Panel>(null)
  const [expCats,  setExpCats]  = useState<string[]>(['podcast'])
  const [chkCats,  setChkCats]  = useState<string[]>([])
  const [hasAudio, setHasAudio] = useState(false)
  const [aiOpen,   setAiOpen]   = useState(false)
  const [aiVoice,  setAiVoice]  = useState<'f'|'m'>('f')
  const [aiSpd,    setAiSpd]    = useState(1)
  const [alert,    setAlert]    = useState(false)
  const seo = 42

  const tw = (id:Panel) => setPanel(p=>p===id?null:id)
  const te = (id:string) => setExpCats(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id])
  const tc = (lb:string) => setChkCats(p=>p.includes(lb)?p.filter(x=>x!==lb):[...p,lb])

  return (
    <div className="flex flex-col h-screen bg-gray-100 overflow-hidden">

      {/* Top bar */}
      <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm">
        <button onClick={()=>router.push('/dashboard/podcast')} className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
          <span className="text-xs font-semibold">PODCAST</span>
        </button>
        <div className="w-px h-5 bg-gray-200"/>
        <svg viewBox="0 0 36 36" className="w-7 h-7" fill="none">
          <path d="M3 28L9 12L14 22L18 14L23 22L28 12L33 28" stroke="#17c3d8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="px-2 py-0.5 text-[10px] font-bold bg-[#17a2b8]/10 text-[#17a2b8] border border-[#17a2b8]/30 rounded-full">{editing?'CHỈNH SỬA':'TẠO MỚI'}</span>
        <span className="text-[10px] text-gray-400">Podcast</span>
        <div className="flex-1"/>

        {/* Toolbar icons */}
        <div className="flex items-center gap-0.5 border border-gray-200 rounded px-1 py-0.5">
          {[{l:'Kiểm tra chính tả',i:<svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/></svg>},
            {l:'Tự động lấy nội dung',i:<svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/></svg>},
            {l:'Chèn link SEO',i:<svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"/></svg>},
            {l:'AI biên tập',teal:true,i:<svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>},
          ].map(t=>(
            <T key={t.l} text={t.l}>
              <button className={`p-1.5 rounded transition-colors ${(t as any).teal?'text-[#17a2b8] hover:bg-[#e8f7f9]':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>{t.i}</button>
            </T>
          ))}
        </div>

        {/* SEO */}
        <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-50 border border-yellow-200 rounded">
          <div className="w-4 h-4 rounded-full border-2 border-yellow-400 flex items-center justify-center">
            <span className="text-[7px] font-bold text-yellow-600">{seo}</span>
          </div>
          <span className="text-[10px] font-semibold text-yellow-700">Điểm SEO</span>
        </div>

        <button className="px-3 py-1.5 text-xs font-semibold border border-gray-300 text-gray-600 rounded hover:bg-gray-50 transition-colors">Lưu nháp</button>
        <button onClick={()=>{if(!title.trim()){setAlert(true);return}alert('Đã lưu: '+title)}}
          className="px-3 py-1.5 text-xs font-semibold bg-[#17a2b8] text-white rounded hover:bg-[#138496] transition-colors">Lưu bài viết</button>
        <button className="px-3 py-1.5 text-xs font-semibold bg-green-600 text-white rounded hover:bg-green-700 transition-colors">Lưu & Gửi lên</button>
      </div>

      {/* Body */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
          <div className="px-3 py-2 border-b border-gray-200">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">CHUYÊN MỤC</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {CATS.map(cat=>(
              <div key={cat.id}>
                <button onClick={()=>te(cat.id)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-semibold text-gray-700">{cat.label}</span>
                  <svg className={`w-3 h-3 text-gray-400 transition-transform ${expCats.includes(cat.id)?'rotate-180':''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/></svg>
                </button>
                {expCats.includes(cat.id) && cat.ch.map(c=>(
                  <label key={c} className="flex items-center gap-2 px-5 py-1.5 hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" checked={chkCats.includes(c)} onChange={()=>tc(c)} className="accent-[#17a2b8] w-3 h-3"/>
                    <span className="text-xs text-gray-600">{c}</span>
                  </label>
                ))}
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 flex-shrink-0">
            <div className="px-3 py-2 flex items-center justify-between">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">TIN LIÊN QUAN</p>
              <span className="text-[9px] text-[#17a2b8] font-semibold">AI gợi ý</span>
            </div>
            <div className="px-3 pb-3">
              <input type="text" placeholder="Tìm bài liên quan..." className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/>
              <div className="mt-2 space-y-1">
                {AI_REL.map((r,i)=>(
                  <button key={i} className="w-full text-left p-1.5 rounded hover:bg-gray-50 transition-colors group">
                    <p className="text-[10px] font-semibold text-gray-700 line-clamp-2 group-hover:text-[#17a2b8] leading-snug">{r.t}</p>
                    <div className="flex gap-1 mt-0.5">
                      <span className="text-[9px] text-gray-400">{r.src}</span>
                      <span className="text-gray-300 text-[9px]">•</span>
                      <span className="text-[9px] text-gray-400">{r.tm} trước</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center py-6 px-4">
          <div className="w-full max-w-2xl space-y-4">

            {/* Tiêu đề */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiêu đề</span>
                <span className={`text-[10px] font-mono ${words(title)>22?'text-red-500':'text-gray-400'}`}>{words(title)}/25</span>
              </div>
              <textarea value={title} onChange={e=>setTitle(e.target.value)} placeholder="Nhập tiêu đề podcast..." rows={2}
                className="w-full text-base font-bold text-gray-800 placeholder-gray-300 resize-none focus:outline-none leading-snug"/>
            </div>

            {/* Sapo */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Mô tả (sapo)</span>
                <span className={`text-[10px] font-mono ${words(sapo)>65?'text-red-500':'text-gray-400'}`}>{words(sapo)}/70</span>
              </div>
              <textarea value={sapo} onChange={e=>setSapo(e.target.value)} placeholder="Viết mô tả ngắn về podcast này..." rows={2}
                className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none leading-relaxed"/>
            </div>

            {/* Audio */}
            {!hasAudio ? (
              <div className="bg-white rounded border-2 border-dashed border-gray-200 p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z"/>
                      <path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/>
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">Chưa có nội dung audio</p>
                  <p className="text-xs text-gray-400">Tải file lên hoặc để AI tạo audio từ nội dung bài viết</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button onClick={()=>setHasAudio(true)}
                    className="flex flex-col items-center gap-2.5 p-5 bg-[#17a2b8] hover:bg-[#138496] text-white rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/></svg>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">Chèn audio</p>
                      <p className="text-[10px] text-white/70 mt-0.5">Tải file MP3 / WAV lên</p>
                    </div>
                  </button>
                  <button onClick={()=>setAiOpen(true)}
                    className="flex flex-col items-center gap-2.5 p-5 bg-gradient-to-br from-violet-600 to-purple-700 hover:from-violet-500 hover:to-purple-600 text-white rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-sm">Tạo audio từ AI</p>
                      <p className="text-[10px] text-white/70 mt-0.5">AI tự đọc thành giọng nói</p>
                    </div>
                  </button>
                </div>
                <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-100 flex-wrap">
                  {['Chèn ảnh','Chèn video','Box nổi bật','Import Word','Nhúng nội dung'].map(t=>(
                    <button key={t} className="text-[10px] text-gray-400 hover:text-[#17a2b8] hover:bg-[#e8f7f9] px-2 py-1 rounded transition-colors">{t}</button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-[#0d1b2a] rounded-lg overflow-hidden border border-gray-700">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
                  <div className="w-8 h-8 rounded-full bg-[#17c3d8] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a3 3 0 013 3v6a3 3 0 01-6 0V5a3 3 0 013-3z"/><path d="M19 10v1a7 7 0 01-14 0v-1a1 1 0 012 0v1a5 5 0 0010 0v-1a1 1 0 012 0z"/></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate">{title||'podcast_audio.mp3'}</p>
                    <p className="text-gray-400 text-[10px]">MP3 · 2:59 · 4.2 MB</p>
                  </div>
                  <button onClick={()=>setHasAudio(false)} className="text-gray-500 hover:text-white transition-colors text-xs">Xóa</button>
                </div>
                <div className="px-4 py-3 flex items-center gap-3">
                  <button className="w-8 h-8 rounded-full bg-[#17c3d8] flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div className="flex-1 h-1 bg-gray-600 rounded-full"><div className="h-full w-0 bg-[#17c3d8] rounded-full"/></div>
                  <span className="text-[10px] text-gray-400 font-mono flex-shrink-0">0:00 / 2:59</span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="bg-white rounded border border-gray-200 p-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Nội dung mô tả chi tiết</p>
              <div className="flex items-center gap-0.5 pb-3 mb-3 border-b border-gray-100 flex-wrap">
                {['B','I','U','—','H2','H3','—','≡','≡','—','"','⊞','</>'].map((t,i)=>(
                  t==='—'
                    ? <div key={i} className="w-px h-5 bg-gray-200 mx-1"/>
                    : <button key={i} className="w-7 h-7 text-xs font-mono text-gray-500 hover:bg-gray-100 hover:text-gray-800 rounded transition-colors flex items-center justify-center">{t}</button>
                ))}
              </div>
              <textarea rows={6} placeholder="Viết nội dung mô tả chi tiết cho podcast... (tóm tắt, khách mời, ghi chú chương trình...)"
                className="w-full text-sm text-gray-700 placeholder-gray-300 resize-none focus:outline-none leading-relaxed"/>
            </div>
          </div>
        </div>

        {/* Right icons */}
        <div className="w-12 bg-white border-l border-gray-200 flex flex-col items-center py-3 gap-1 flex-shrink-0">
          {([
            {id:'info',    label:'Thông tin', icon:<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>},
            {id:'author',  label:'Tác giả',   icon:<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>},
            {id:'comment', label:'Bình luận', icon:<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>},
            {id:'settings',label:'Cấu hình',  icon:<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>},
            {id:'seo',     label:'SEO',        icon:<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>},
            {id:'ai',      label:'AI Bi',      icon:<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>},
          ] as {id:Panel;label:string;icon:React.ReactNode}[]).map(item=>(
            <T key={item.id as string} text={item.label} side="left">
              <button onClick={()=>tw(item.id)}
                className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${panel===item.id?'bg-[#e8f7f9] text-[#17a2b8]':'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}>
                {item.icon}
              </button>
            </T>
          ))}
        </div>

        {/* Right expanded panel */}
        {panel && (
          <div className="w-72 bg-white border-l border-gray-200 flex flex-col overflow-hidden flex-shrink-0">
            <RightPanelContent panel={panel} seo={seo} onClose={()=>setPanel(null)}/>
          </div>
        )}
      </div>

      {/* Alert modal */}
      {alert && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-80">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-800">Thiếu thông tin bắt buộc</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tiêu đề không được để trống</p>
              </div>
            </div>
            <button onClick={()=>setAlert(false)} className="w-full py-2 bg-[#17a2b8] text-white text-sm font-semibold rounded hover:bg-[#138496] transition-colors">Đã hiểu</button>
          </div>
        </div>
      )}

      {/* AI modal */}
      {aiOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-2xl w-[480px] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gradient-to-r from-violet-50 to-purple-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 className="font-bold text-gray-800 text-sm">Tạo audio từ AI</h3>
              </div>
              <button onClick={()=>setAiOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-xs text-gray-500">AI sẽ tự động đọc nội dung tiêu đề và mô tả thành file audio giọng nói.</p>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Giọng đọc</label>
                <div className="grid grid-cols-2 gap-2">
                  {([['f','Nữ · Lan Anh','Giọng Bắc, truyền cảm'],['m','Nam · Minh Khoa','Giọng Nam, rõ ràng']] as const).map(([v,name,desc])=>(
                    <button key={v} onClick={()=>setAiVoice(v)}
                      className={`flex items-center gap-2.5 p-3 rounded-lg border-2 transition-colors ${aiVoice===v?'border-violet-500 bg-violet-50':'border-gray-200 hover:border-gray-300'}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${aiVoice===v?'bg-violet-100':'bg-gray-100'}`}>
                        <svg className={`w-4 h-4 ${aiVoice===v?'text-violet-600':'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12a5 5 0 100-10 5 5 0 000 10z"/><path d="M4 20c0-4 3.582-7 8-7s8 3 8 7"/>
                        </svg>
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-semibold ${aiVoice===v?'text-violet-700':'text-gray-700'}`}>{name}</p>
                        <p className="text-[10px] text-gray-400">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-600">Tốc độ đọc</label>
                  <span className="text-xs font-mono text-violet-600">{aiSpd}x</span>
                </div>
                <input type="range" min={0.5} max={2} step={0.25} value={aiSpd} onChange={e=>setAiSpd(Number(e.target.value))} className="w-full accent-violet-600"/>
                <div className="flex justify-between mt-1">
                  <span className="text-[9px] text-gray-400">0.5x (chậm)</span>
                  <span className="text-[9px] text-gray-400">1.0x</span>
                  <span className="text-[9px] text-gray-400">2.0x (nhanh)</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded p-3 border border-gray-100">
                <p className="text-[10px] font-semibold text-gray-500 mb-1">Nội dung sẽ được đọc:</p>
                <p className="text-xs text-gray-700 italic">{title||'(Chưa có tiêu đề.)'} {sapo||'(Chưa có mô tả.)'}</p>
              </div>
            </div>
            <div className="px-5 pb-5 flex gap-2">
              <button onClick={()=>setAiOpen(false)} className="flex-1 py-2.5 border border-gray-300 text-sm text-gray-600 rounded-lg hover:bg-gray-50 font-semibold">Hủy</button>
              <button onClick={()=>{setAiOpen(false);setHasAudio(true)}}
                className="flex-1 py-2.5 bg-gradient-to-r from-violet-600 to-purple-700 text-white text-sm font-bold rounded-lg hover:from-violet-500 hover:to-purple-600 transition-all">
                Tạo audio ngay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ─── Right panel ────────────────────────────────────────── */
function RightPanelContent({panel,seo,onClose}:{panel:Panel;seo:number;onClose:()=>void}) {
  const titles:Record<string,string> = {info:'Thông tin',author:'Tác giả',comment:'Bình luận nội bộ',settings:'Cấu hình',seo:'SEO',ai:'AI Bi'}
  const [aiTab, setAiTab] = useState('all')
  const [cmt, setCmt] = useState('')
  const aiItems = [
    {src:'BBC',t:'Lễ Nguyên tiêu được tổ chức tại Hà Nội',tm:'2 phút',st:'new'},
    {src:'VnExpress',t:'Tết rằm tháng giêng và phong tục cổ truyền',tm:'8 phút',st:'new'},
    {src:'Dân Trí',t:'Hàng nghìn người đổ về đền Trần dịp rằm',tm:'15 phút',st:'saved'},
    {src:'Zing',t:'Nguồn gốc lễ hội Nguyên tiêu tại Việt Nam',tm:'32 phút',st:'editing'},
  ]
  const color = seo<40?'#ef4444':seo<70?'#f59e0b':'#22c55e'

  return <>
    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 flex-shrink-0">
      <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">{titles[panel as string]}</h3>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
      </button>
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {panel==='info' && <>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ảnh đại diện podcast</label>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[#17a2b8] transition-colors cursor-pointer">
            <svg className="w-8 h-8 text-gray-300 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
            <p className="text-xs text-gray-400">Kéo thả ảnh vào đây</p>
            <button className="mt-1 text-[10px] text-[#17a2b8] font-semibold">hoặc chọn ảnh</button>
          </div>
        </div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Ngày xuất bản</label><input type="datetime-local" className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Ghi chú</label><textarea rows={3} placeholder="Ghi chú nội bộ..." className="w-full px-3 py-2 text-xs border border-gray-200 rounded resize-none focus:outline-none focus:border-[#17a2b8]"/></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Nguồn tin</label><input type="text" placeholder="VCC News" className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/></div>
      </>}
      {panel==='author' && <>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Tác giả</label><input type="text" defaultValue="NGOCLM_VCC" className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Sự kiện / Chương trình</label><input type="text" placeholder="Nhập tên sự kiện..." className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Kiểu hiển thị tên</label>
          <select className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]">
            <option>Hiển thị tên đầy đủ</option><option>Ẩn tên tác giả</option><option>Dùng bút danh</option>
          </select>
        </div>
        <label className="flex items-center gap-2.5 cursor-pointer"><input type="checkbox" className="accent-[#17a2b8]"/><span className="text-xs text-gray-600">Đánh dấu bài nhạy cảm</span></label>
      </>}
      {panel==='comment' && <>
        <div className="flex gap-1">{['B','I','U'].map(t=><button key={t} className="w-6 h-6 text-xs font-bold border border-gray-200 rounded hover:bg-gray-100">{t}</button>)}</div>
        <textarea value={cmt} onChange={e=>setCmt(e.target.value)} rows={5} placeholder="Viết bình luận nội bộ..."
          className="w-full px-3 py-2 text-xs border border-gray-200 rounded resize-none focus:outline-none focus:border-[#17a2b8]"/>
        <button className="w-full py-2 bg-[#17a2b8] text-white text-xs font-semibold rounded hover:bg-[#138496] transition-colors">Gửi bình luận</button>
        <p className="text-[10px] text-gray-400 text-center">Chưa có bình luận nào</p>
      </>}
      {panel==='settings' && [
        {l:'Cho phép bình luận',on:true},{l:'Hiển thị trang chủ',on:true},
        {l:'Tin tiêu điểm',on:false},{l:'Bài AdStore',on:false},{l:'Bài PR',on:false},{l:'Bài nhạy cảm',on:false},
      ].map(s=>(
        <div key={s.l} className="flex items-center justify-between">
          <span className="text-xs text-gray-600">{s.l}</span>
          <div className={`w-8 h-4 rounded-full transition-colors ${s.on?'bg-[#17a2b8]':'bg-gray-300'}`}><div className={`w-3 h-3 bg-white rounded-full mt-0.5 shadow transition-transform ${s.on?'translate-x-4':'translate-x-0.5'}`}/></div>
        </div>
      ))}
      {panel==='seo' && <>
        <div className="text-center py-4">
          <div className="relative w-24 h-24 mx-auto mb-2">
            <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3"/>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke={color} strokeWidth="3" strokeDasharray={`${seo} ${100-seo}`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-bold" style={{color}}>{seo}</span></div>
          </div>
          <p className="text-xs font-semibold text-gray-600">Điểm SEO / 100</p>
        </div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Từ khóa chính</label><input type="text" placeholder="Nhập từ khóa SEO..." className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Tiêu đề Google</label><input type="text" placeholder="Tiêu đề hiển thị trên Google..." className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:border-[#17a2b8]"/></div>
        <div><label className="block text-xs font-semibold text-gray-600 mb-1.5">Mô tả Google</label><textarea rows={3} placeholder="Mô tả snippet trên Google..." className="w-full px-3 py-2 text-xs border border-gray-200 rounded resize-none focus:outline-none focus:border-[#17a2b8]"/></div>
        <button className="w-full py-2 border border-[#17a2b8] text-[#17a2b8] text-xs font-semibold rounded hover:bg-[#e8f7f9] transition-colors flex items-center justify-center gap-1.5">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          AI đề xuất từ khóa
        </button>
      </>}
      {panel==='ai' && <>
        <div className="flex gap-1 flex-wrap">
          {[{id:'all',l:'Tất cả'},{id:'saved',l:'Đã lưu'},{id:'editing',l:'Đang biên tập'},{id:'done',l:'Đã dùng'}].map(t=>(
            <button key={t.id} onClick={()=>setAiTab(t.id)}
              className={`px-2 py-1 text-[10px] font-semibold rounded transition-colors ${aiTab===t.id?'bg-[#17a2b8] text-white':'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{t.l}</button>
          ))}
        </div>
        <div className="space-y-2">
          {aiItems.filter(n=>aiTab==='all'||n.st===aiTab).map((n,i)=>(
            <div key={i} className="p-2.5 border border-gray-100 rounded-lg hover:border-[#17a2b8]/30 transition-colors">
              <p className="text-[10px] font-bold text-[#17a2b8] mb-0.5">{n.src}</p>
              <p className="text-xs text-gray-700 leading-snug mb-1.5">{n.t}</p>
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-gray-400">{n.tm} trước</span>
                <div className="flex gap-1">
                  <button className="text-[9px] px-2 py-0.5 bg-[#e8f7f9] text-[#17a2b8] rounded font-semibold">Biên tập</button>
                  <button className="text-[9px] px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-semibold">Lưu</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5 text-[9px] text-gray-400 pt-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Cập nhật sau 4 phút
        </div>
      </>}
    </div>
  </>
}

/* ─── Tooltip ────────────────────────────────────────────── */
function T({text,children,side='top'}:{text:string;children:React.ReactNode;side?:'top'|'left'}) {
  const pos = side==='left'
    ? 'right-full top-1/2 -translate-y-1/2 mr-2'
    : 'bottom-full left-1/2 -translate-x-1/2 mb-2'
  const arrow = side==='left'
    ? 'top-1/2 -translate-y-1/2 left-full border-l-gray-800'
    : 'top-full left-1/2 -translate-x-1/2 border-t-gray-800'
  return (
    <div className="relative group inline-flex">
      {children}
      <div className={`pointer-events-none absolute ${pos} px-2 py-1 bg-gray-800 text-white text-[10px] rounded whitespace-nowrap z-20 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg`}>
        {text}<div className={`absolute ${arrow} border-4 border-transparent`}/>
      </div>
    </div>
  )
}
