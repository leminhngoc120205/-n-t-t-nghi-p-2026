'use client'

import React, { useState } from 'react'

interface Topic {
  id: number
  name: string
  avatar: string
  articleCount: number
  displayOrder: number
  active: boolean
  showIcon: boolean
  category: string
  createdAt: string
}

const MOCK_TOPICS: Topic[] = [
  { id: 1,  name: 'Thời sự trong nước',    avatar: 'T', articleCount: 45, displayOrder: 1,  active: true,  showIcon: true,  category: 'Thời sự',    createdAt: '2024-10-01' },
  { id: 2,  name: 'Xã hội',               avatar: 'X', articleCount: 32, displayOrder: 2,  active: true,  showIcon: true,  category: 'Xã hội',     createdAt: '2024-10-02' },
  { id: 3,  name: 'Bất động sản 2026',    avatar: 'B', articleCount: 18, displayOrder: 3,  active: true,  showIcon: false, category: 'Kinh tế',    createdAt: '2024-10-05' },
  { id: 4,  name: 'Xe cộ',               avatar: 'X', articleCount: 27, displayOrder: 4,  active: true,  showIcon: true,  category: 'Xe cộ',      createdAt: '2024-10-06' },
  { id: 5,  name: 'Công nghệ',           avatar: 'C', articleCount: 56, displayOrder: 5,  active: true,  showIcon: true,  category: 'Công nghệ',  createdAt: '2024-10-08' },
  { id: 6,  name: 'Sức khỏe & Đời sống', avatar: 'S', articleCount: 41, displayOrder: 6,  active: true,  showIcon: false, category: 'Sức khỏe',  createdAt: '2024-10-10' },
  { id: 7,  name: 'Du lịch',             avatar: 'D', articleCount: 23, displayOrder: 7,  active: false, showIcon: true,  category: 'Du lịch',   createdAt: '2024-10-12' },
  { id: 8,  name: 'Ẩm thực',            avatar: 'Ẩ', articleCount: 19, displayOrder: 8,  active: true,  showIcon: true,  category: 'Ẩm thực',   createdAt: '2024-10-14' },
  { id: 9,  name: 'Giáo dục',           avatar: 'G', articleCount: 38, displayOrder: 9,  active: true,  showIcon: false, category: 'Giáo dục',  createdAt: '2024-10-15' },
  { id: 10, name: 'Thể thao',           avatar: 'T', articleCount: 61, displayOrder: 10, active: true,  showIcon: true,  category: 'Thể thao',  createdAt: '2024-10-17' },
  { id: 11, name: 'av213',              avatar: 'A', articleCount: 5,  displayOrder: 11, active: false, showIcon: false, category: 'Thử nghiệm', createdAt: '2024-10-20' },
  { id: 12, name: 'Kinh tế thị trường', avatar: 'K', articleCount: 34, displayOrder: 12, active: true,  showIcon: true,  category: 'Kinh tế',   createdAt: '2024-10-22' },
  { id: 13, name: 'Pháp luật',          avatar: 'P', articleCount: 29, displayOrder: 13, active: true,  showIcon: false, category: 'Pháp luật', createdAt: '2024-10-24' },
  { id: 14, name: 'Khoa học',           avatar: 'K', articleCount: 16, displayOrder: 14, active: true,  showIcon: true,  category: 'Khoa học',  createdAt: '2024-10-26' },
  { id: 15, name: 'Môi trường',         avatar: 'M', articleCount: 12, displayOrder: 15, active: false, showIcon: false, category: 'Khoa học',  createdAt: '2024-10-28' },
  { id: 16, name: 'Giải trí',           avatar: 'G', articleCount: 48, displayOrder: 16, active: true,  showIcon: true,  category: 'Giải trí',  createdAt: '2024-11-01' },
  { id: 17, name: 'Crypto & Chứng khoán', avatar: 'C', articleCount: 22, displayOrder: 17, active: true, showIcon: false, category: 'Kinh tế',  createdAt: '2024-11-05' },
  { id: 18, name: 'Quốc tế',           avatar: 'Q', articleCount: 54, displayOrder: 18, active: true,  showIcon: true,  category: 'Quốc tế',  createdAt: '2024-11-10' },
]

const CATEGORIES = ['Thời sự', 'Xã hội', 'Kinh tế', 'Công nghệ', 'Xe cộ', 'Sức khỏe', 'Du lịch', 'Ẩm thực', 'Giáo dục', 'Thể thao', 'Pháp luật', 'Khoa học', 'Giải trí', 'Quốc tế', 'Thử nghiệm']

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
  'bg-orange-500', 'bg-cyan-500',
]

export default function QuanLyChuDe() {
  const [topics, setTopics] = useState(MOCK_TOPICS)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [keyword, setKeyword] = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<Topic | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Topic | null>(null)
  const [nameValue, setNameValue] = useState('')
  const [orderValue, setOrderValue] = useState(1)
  const [selCategory, setSelCategory] = useState(CATEGORIES[0])
  const [isActive, setIsActive] = useState(true)
  const [showIconVal, setShowIconVal] = useState(false)

  const filtered = topics.filter(t => {
    const matchCat = filterCategory === 'all' || t.category === filterCategory
    const matchStatus = filterStatus === 'all'
      || (filterStatus === 'active' ? t.active : !t.active)
    const matchDate = !filterDate || t.createdAt >= filterDate
    const matchKw = !searchApplied || t.name.toLowerCase().includes(searchApplied.toLowerCase())
    return matchCat && matchStatus && matchDate && matchKw
  })

  const toggleActive = (id: number) =>
    setTopics(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t))

  const toggleShowIcon = (id: number) =>
    setTopics(prev => prev.map(t => t.id === id ? { ...t, showIcon: !t.showIcon } : t))

  const openAddModal = () => {
    setEditTarget(null)
    setNameValue('')
    setOrderValue(topics.length + 1)
    setSelCategory(CATEGORIES[0])
    setIsActive(true)
    setShowIconVal(false)
    setShowModal(true)
  }

  const openEditModal = (t: Topic) => {
    setEditTarget(t)
    setNameValue(t.name)
    setOrderValue(t.displayOrder)
    setSelCategory(t.category)
    setIsActive(t.active)
    setShowIconVal(t.showIcon)
    setShowModal(true)
    setOpenMenu(null)
  }

  const handleSave = () => {
    if (!nameValue.trim()) return
    if (editTarget) {
      setTopics(prev => prev.map(t => t.id === editTarget.id
        ? { ...t, name: nameValue, displayOrder: orderValue, category: selCategory, active: isActive, showIcon: showIconVal }
        : t
      ))
    } else {
      setTopics(prev => [...prev, {
        id: Date.now(), name: nameValue, avatar: nameValue[0]?.toUpperCase() ?? 'N',
        articleCount: 0, displayOrder: orderValue, active: isActive,
        showIcon: showIconVal, category: selCategory,
        createdAt: new Date().toISOString().slice(0, 10),
      }])
    }
    setShowModal(false)
  }

  return (
    <div className="p-6" onClick={() => openMenu && setOpenMenu(null)}>
      {/* Add button */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] text-white text-sm font-medium rounded-md hover:bg-[#138496] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Thêm chủ đề mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
          <option value="all">Tất cả chuyên mục</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Không hoạt động</option>
        </select>
        <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] text-gray-600" />
        <input
          type="text" placeholder="Từ khóa" value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchApplied(keyword)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] w-40"
        />
        <button onClick={() => setSearchApplied(keyword)}
          className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded-md hover:bg-[#138496] transition-colors">
          Tìm kiếm
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-14">Avatar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Chủ đề</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-36">Thứ tự hiển thị</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Hoạt động</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-36">Hiển thị icon</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, idx) => (
              <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{t.avatar}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{t.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Bài viết: {t.articleCount} · {t.category}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block bg-gray-100 text-gray-700 text-xs font-mono px-2.5 py-1 rounded">{t.displayOrder}</span>
                </td>
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" checked={t.active} onChange={() => toggleActive(t.id)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#17a2b8]" />
                </td>
                <td className="px-4 py-3 text-center">
                  <input type="checkbox" checked={t.showIcon} onChange={() => toggleShowIcon(t.id)}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#17a2b8]" />
                </td>
                <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                  <button onClick={() => setOpenMenu(openMenu === t.id ? null : t.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 font-bold text-lg">
                    ···
                  </button>
                  {openMenu === t.id && (
                    <div className="absolute right-3 top-11 z-20 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[180px] py-1">
                      <button onClick={() => openEditModal(t)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Sửa
                      </button>
                      <button onClick={() => setOpenMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Thêm bài viết
                      </button>
                      <button onClick={() => setOpenMenu(null)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        Bài viết nổi bật
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy chủ đề nào</div>
        )}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Tổng cộng: <strong>{filtered.length}</strong> / {topics.length} chủ đề
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-12 px-4 pb-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-800 text-base">{editTarget ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6 space-y-5">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#17a2b8] cursor-pointer transition-colors">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <p className="text-xs text-gray-400">Kéo thả hoặc click để tải ảnh</p>
                </div>
              </div>
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tên chủ đề</label>
                <input type="text" value={nameValue} onChange={e => setNameValue(e.target.value)} placeholder="Nhập tên chủ đề..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]" />
              </div>
              {/* Category + Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên mục</label>
                  <select value={selCategory} onChange={e => setSelCategory(e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự hiển thị</label>
                  <input type="number" min={1} value={orderValue} onChange={e => setOrderValue(Number(e.target.value))} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]" />
                </div>
              </div>
              {/* Checkboxes */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={isActive} onChange={() => setIsActive(p => !p)} className="w-4 h-4 rounded accent-[#17a2b8]" />
                  <span className="text-sm text-gray-700">Hoạt động</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input type="checkbox" checked={showIconVal} onChange={() => setShowIconVal(p => !p)} className="w-4 h-4 rounded accent-[#17a2b8]" />
                  <span className="text-sm text-gray-700">Hiển thị icon chủ đề</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 tracking-wide">ĐÓNG</button>
              <button onClick={handleSave} disabled={!nameValue.trim()} className="px-5 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 tracking-wide">LƯU</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteTarget && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[400px] p-6" onClick={e => e.stopPropagation()}>
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa chủ đề <strong>"{deleteTarget.name}"</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Huỷ</button>
              <button onClick={() => { setTopics(p => p.filter(t => t.id !== deleteTarget.id)); setDeleteTarget(null) }} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 font-medium">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
