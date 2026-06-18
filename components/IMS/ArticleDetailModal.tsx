'use client'

import React, { useState } from 'react'

export interface QuickTaskItem {
  id: number
  title: string
  timeAgo: string
  author: string
  editor?: string
  type: 'quiz' | 'review' | 'article' | 'analysis'
  status: 'editing' | 'publishing' | 'returned'
  category?: string
  source?: string
}

interface Props {
  task: QuickTaskItem
  onClose: () => void
}

const HISTORY = [
  { time: '20 ngày trước', user: 'camnv_vcc',    action: 'Tạo bài viết' },
  { time: '19 ngày trước', user: 'editor_vcc',   action: 'Nhận biên tập' },
  { time: '18 ngày trước', user: 'editor_vcc',   action: 'Trả lại tác giả' },
  { time: '17 ngày trước', user: 'camnv_vcc',    action: 'Gửi lại biên tập' },
]

export default function ArticleDetailModal({ task, onClose }: Props) {
  const [showHistory, setShowHistory] = useState(false)
  const [showCompare, setShowCompare] = useState(false)
  const [confirmed, setConfirmed] = useState<'received' | 'returned' | null>(null)

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Modal panel */}
      <div className="relative z-10 flex flex-col bg-white w-[95vw] max-w-[1100px] mx-auto my-4 rounded-xl shadow-2xl overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2">
            <StatusBadge status={task.status} />
            <h2 className="font-bold text-gray-800 text-sm truncate max-w-lg">{task.title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setShowHistory(p => !p); setShowCompare(false) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors ${showHistory ? 'bg-[#17a2b8] text-white border-[#17a2b8]' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Xem lịch sử
            </button>
            <button
              onClick={() => { setShowCompare(p => !p); setShowHistory(false) }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors ${showCompare ? 'bg-[#17a2b8] text-white border-[#17a2b8]' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              So sánh phiên bản
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 text-lg transition-colors ml-1">×</button>
          </div>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="border-b border-gray-200 bg-yellow-50 px-5 py-3 flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Lịch sử chỉnh sửa</h3>
            <div className="flex gap-6 overflow-x-auto pb-1">
              {HISTORY.map((h, i) => (
                <div key={i} className="flex items-center gap-2 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-[#17a2b8] flex items-center justify-center text-white text-[10px] font-bold">{i + 1}</div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{h.action}</p>
                    <p className="text-[10px] text-gray-400">{h.user} · {h.time}</p>
                  </div>
                  {i < HISTORY.length - 1 && <div className="w-8 h-px bg-gray-300 ml-1" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare panel */}
        {showCompare && (
          <div className="border-b border-gray-200 bg-blue-50 px-5 py-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide">So sánh phiên bản</h3>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
                <option>Phiên bản hiện tại</option>
                <option>Phiên bản trước (19 ngày)</option>
                <option>Phiên bản gốc (20 ngày)</option>
              </select>
              <span className="text-xs text-gray-400">←→</span>
              <select className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none">
                <option>Phiên bản trước (19 ngày)</option>
                <option>Phiên bản gốc (20 ngày)</option>
              </select>
              <button className="px-3 py-1 bg-[#17a2b8] text-white text-xs rounded hover:bg-[#138496] transition-colors">So sánh</button>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Article preview */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200">
            <ArticlePreview task={task} />
          </div>

          {/* Right: Metadata */}
          <div className="w-72 flex-shrink-0 overflow-y-auto p-5 bg-gray-50">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <MetaRow label="Ảnh đại diện">
                <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              </MetaRow>
              <MetaRow label="Dạng bài"><span className="text-sm text-gray-700 capitalize">{task.type === 'quiz' ? 'Quiz / Bài kiểm tra' : task.type === 'review' ? 'Đánh giá sản phẩm' : task.type === 'analysis' ? 'Bài phân tích' : 'Bài viết thông thường'}</span></MetaRow>
              <MetaRow label="Tác giả"><span className="text-sm font-medium text-[#17a2b8]">@{task.author}</span></MetaRow>
              <MetaRow label="Biên tập viên">{task.editor ? <span className="text-sm font-medium text-[#17a2b8]">@{task.editor}</span> : <span className="text-sm text-gray-400 italic">Không có dữ liệu</span>}</MetaRow>
              <MetaRow label="Chuyên mục"><span className="text-sm text-gray-700">{task.category || <span className="text-gray-400 italic">Không có dữ liệu</span>}</span></MetaRow>
              <MetaRow label="Nguồn tin"><span className="text-sm text-gray-400 italic">Không có dữ liệu</span></MetaRow>
              <MetaRow label="Link bài gốc"><span className="text-sm text-gray-400 italic">Không có dữ liệu</span></MetaRow>
              <MetaRow label="Ngày tạo"><span className="text-sm text-gray-700">{task.timeAgo}</span></MetaRow>
              <MetaRow label="Trạng thái"><StatusBadge status={task.status} /></MetaRow>
            </div>
          </div>
        </div>

        {/* Bottom action buttons */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-xs text-gray-400">Lần cập nhật cuối: {task.timeAgo}</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition-colors tracking-wide">ĐÓNG</button>
            <button className="px-4 py-2 text-sm font-semibold border border-[#17a2b8] text-[#17a2b8] rounded-md hover:bg-[#e8f7f9] transition-colors tracking-wide">SỬA</button>
            {confirmed !== 'received'
              ? <button onClick={() => setConfirmed('received')} className="px-4 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] transition-colors tracking-wide">NHẬN</button>
              : <button className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-md cursor-default tracking-wide flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  ĐÃ NHẬN
                </button>
            }
            {confirmed !== 'returned'
              ? <button onClick={() => setConfirmed('returned')} className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors tracking-wide">TRẢ LẠI</button>
              : <button className="px-4 py-2 text-sm font-semibold bg-orange-400 text-white rounded-md cursor-default tracking-wide flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
                  ĐÃ TRẢ LẠI
                </button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 pb-3">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      {children}
    </div>
  )
}

function StatusBadge({ status }: { status: QuickTaskItem['status'] }) {
  const map = {
    editing:    { label: 'Chờ biên tập',    cls: 'bg-yellow-100 text-yellow-700' },
    publishing: { label: 'Chờ xuất bản',    cls: 'bg-green-100  text-green-700'  },
    returned:   { label: 'Bị trả lại',      cls: 'bg-red-100    text-red-600'    },
  }
  const s = map[status]
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
}

function ArticlePreview({ task }: { task: QuickTaskItem }) {
  if (task.type === 'quiz') {
    return (
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h1>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
          <span>@{task.author}</span><span>·</span><span>{task.timeAgo}</span>
        </div>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
          Bài viết này chứa một biểu mẫu kiểm tra kiến thức dành cho độc giả. Người dùng điền thông tin cá nhân để tham gia quiz và nhận kết quả đánh giá.
        </p>
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
          <h3 className="font-bold text-gray-700 text-sm mb-4">📋 Biểu mẫu tham gia Quiz</h3>
          {[
            { label: 'Họ và tên',    type: 'text',  placeholder: 'Nhập họ và tên đầy đủ...' },
            { label: 'Lớp / Trường', type: 'text',  placeholder: 'VD: 12A1 - THPT Nguyễn Trãi' },
            { label: 'Địa chỉ nhà',  type: 'text',  placeholder: 'Số nhà, đường, phường/xã, tỉnh/thành...' },
            { label: 'Điện thoại',   type: 'tel',   placeholder: '0xxx xxx xxx' },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input type={f.type} placeholder={f.placeholder} disabled className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-400 bg-white cursor-not-allowed" />
            </div>
          ))}
          <button disabled className="w-full py-2.5 bg-[#17a2b8] text-white text-sm font-semibold rounded-lg opacity-60 cursor-not-allowed">Gửi kết quả</button>
        </div>
      </div>
    )
  }

  if (task.type === 'review') {
    return (
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h1>
        <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
          <span>@{task.author}</span><span>·</span><span>{task.timeAgo}</span>
        </div>
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl p-6 mb-5 flex items-center gap-5">
          <div className="w-24 h-32 bg-gray-600 rounded-lg flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <div className="text-white">
            <p className="font-bold text-lg">RedMagic 10 Pro</p>
            <p className="text-gray-300 text-sm mb-2">Gaming Smartphone 2025</p>
            <div className="flex items-center gap-1">{'★★★★☆'.split('').map((s, i) => <span key={i} className="text-yellow-400">{s}</span>)}</div>
            <p className="text-gray-300 text-xs mt-1">Điểm: 8.5/10</p>
          </div>
        </div>
        <div className="prose prose-sm max-w-none text-gray-600 space-y-3 text-sm leading-relaxed">
          <p>RedMagic 10 Pro là chiếc điện thoại gaming mới nhất từ Nubia, mang đến hiệu suất vượt trội với chip Snapdragon 8 Gen 4 và hệ thống tản nhiệt tiên tiến.</p>
          <p><strong className="text-gray-800">Thiết kế:</strong> Máy có thiết kế táo bạo với đèn RGB ở mặt lưng, cảm giác cầm chắc tay dù trọng lượng khá nặng (229g).</p>
          <p><strong className="text-gray-800">Hiệu năng:</strong> Chip Snapdragon 8 Gen 4 kết hợp 16GB RAM cho trải nghiệm gaming mượt mà không giật lag. Điểm Antutu vượt mốc 2.5 triệu.</p>
          <p><strong className="text-gray-800">Pin:</strong> 6.500mAh với sạc nhanh 120W, đầy pin chỉ trong 35 phút — một con số ấn tượng.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h1>
      <div className="flex items-center gap-3 text-xs text-gray-400 mb-6">
        <span>@{task.author}</span>
        {task.editor && <><span>·</span><span>Biên tập: @{task.editor}</span></>}
        <span>·</span><span>{task.timeAgo}</span>
      </div>
      <div className="w-full h-40 bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-300">
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
      </div>
      <div className="space-y-3 text-sm text-gray-600 leading-relaxed">
        <p>Đây là nội dung chi tiết của bài viết. Biên tập viên cần đọc kỹ và kiểm tra các thông tin trước khi phê duyệt.</p>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.</p>
        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
      </div>
    </div>
  )
}
