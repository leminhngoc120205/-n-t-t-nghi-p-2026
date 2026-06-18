'use client'

import React, { useState } from 'react'

interface EventFlow {
  id: number
  name: string
  articleCount: number
  avatar: string
  showOnPage: boolean
  featured: boolean
  category: string
}

const MOCK_FLOWS: EventFlow[] = [
  { id: 1,  name: 'Chiến tranh và hợp tác quân sự Mỹ - Ukraine', articleCount: 1,  avatar: 'C', showOnPage: true,  featured: true,  category: 'Quốc tế' },
  { id: 2,  name: 'Xung đột Trung Đông 2025',                    articleCount: 3,  avatar: 'X', showOnPage: true,  featured: false, category: 'Quốc tế' },
  { id: 3,  name: 'Bầu cử Mỹ 2024',                             articleCount: 5,  avatar: 'B', showOnPage: false, featured: false, category: 'Quốc tế' },
  { id: 4,  name: 'Biến đổi khí hậu toàn cầu',                  articleCount: 2,  avatar: 'B', showOnPage: true,  featured: false, category: 'Khoa học' },
  { id: 5,  name: 'AI và công nghệ 2025',                        articleCount: 8,  avatar: 'A', showOnPage: true,  featured: true,  category: 'Công nghệ' },
  { id: 6,  name: 'Kinh tế Việt Nam 2025',                       articleCount: 4,  avatar: 'K', showOnPage: true,  featured: false, category: 'Kinh tế' },
  { id: 7,  name: 'Dịch bệnh toàn cầu',                         articleCount: 1,  avatar: 'D', showOnPage: false, featured: false, category: 'Sức khỏe' },
  { id: 8,  name: 'Thể thao SEA Games 2025',                     articleCount: 7,  avatar: 'T', showOnPage: true,  featured: true,  category: 'Thể thao' },
  { id: 9,  name: 'Bất động sản Việt Nam 2025',                  articleCount: 2,  avatar: 'B', showOnPage: true,  featured: false, category: 'Kinh tế' },
]

const CATEGORIES = ['Quốc tế', 'Khoa học', 'Công nghệ', 'Kinh tế', 'Sức khỏe', 'Thể thao', 'Thời sự']

type ModalTab = 'basic' | 'seo'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
]

export default function QuanLyDongSuKien() {
  const [flows, setFlows] = useState(MOCK_FLOWS)
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [openMenu, setOpenMenu] = useState<number | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<EventFlow | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EventFlow | null>(null)
  const [modalTab, setModalTab] = useState<ModalTab>('basic')
  const [nameValue, setNameValue] = useState('')
  const [descValue, setDescValue] = useState('')
  const [mainCat, setMainCat] = useState(CATEGORIES[0])
  const [subCat, setSubCat] = useState('')
  const [showOnPage, setShowOnPage] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)

  const filtered = flows.filter(f => {
    const matchCat = filterCategory === 'all' || f.category === filterCategory
    const matchStatus = filterStatus === 'all'
      || (filterStatus === 'show' ? f.showOnPage : !f.showOnPage)
    const matchKw = !searchApplied || f.name.toLowerCase().includes(searchApplied.toLowerCase())
    return matchCat && matchStatus && matchKw
  })

  const toggleShowOnPage = (id: number) =>
    setFlows(prev => prev.map(f => f.id === id ? { ...f, showOnPage: !f.showOnPage } : f))

  const toggleFeatured = (id: number) =>
    setFlows(prev => prev.map(f => f.id === id ? { ...f, featured: !f.featured } : f))

  const openAddModal = () => {
    setEditTarget(null)
    setNameValue('')
    setDescValue('')
    setMainCat(CATEGORIES[0])
    setSubCat('')
    setShowOnPage(true)
    setIsFeatured(false)
    setModalTab('basic')
    setShowModal(true)
  }

  const openEditModal = (flow: EventFlow) => {
    setEditTarget(flow)
    setNameValue(flow.name)
    setDescValue('')
    setMainCat(flow.category)
    setSubCat('')
    setShowOnPage(flow.showOnPage)
    setIsFeatured(flow.featured)
    setModalTab('basic')
    setShowModal(true)
    setOpenMenu(null)
  }

  const handleSave = () => {
    if (!nameValue.trim()) return
    if (editTarget) {
      setFlows(prev => prev.map(f => f.id === editTarget.id
        ? { ...f, name: nameValue, category: mainCat, showOnPage, featured: isFeatured }
        : f
      ))
    } else {
      setFlows(prev => [...prev, {
        id: Date.now(),
        name: nameValue,
        articleCount: 0,
        avatar: nameValue[0]?.toUpperCase() ?? 'N',
        showOnPage,
        featured: isFeatured,
        category: mainCat,
      }])
    }
    setShowModal(false)
  }

  const handleDelete = () => {
    if (deleteTarget) {
      setFlows(prev => prev.filter(f => f.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  return (
    <div className="p-6" onClick={() => openMenu && setOpenMenu(null)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={openAddModal}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] text-white text-sm font-medium rounded-md hover:bg-[#138496] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm dòng sự kiện mới
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
        >
          <option value="all">Tất cả chuyên mục</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
        >
          <option value="all">Tất cả</option>
          <option value="show">Hiển thị</option>
          <option value="hide">Ẩn</option>
        </select>
        <input
          type="text"
          placeholder="Từ khóa"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchApplied(keyword)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] w-48"
        />
        <button
          onClick={() => setSearchApplied(keyword)}
          className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded-md hover:bg-[#138496] transition-colors"
        >
          Tìm kiếm
        </button>
        {searchApplied && (
          <button
            onClick={() => { setSearchApplied(''); setKeyword('') }}
            className="px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 text-gray-500"
          >
            Xóa lọc
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-14">Avatar</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Dòng sự kiện</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-40">Hiển thị trên trang</th>
              <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Nổi bật</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((flow, idx) => (
              <tr key={flow.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">{flow.avatar}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium text-gray-800">{flow.name}</div>
                  <div className="text-xs text-gray-400 mt-0.5">Bài viết: {flow.articleCount} · {flow.category}</div>
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={flow.showOnPage}
                    onChange={() => toggleShowOnPage(flow.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#17a2b8] cursor-pointer accent-[#17a2b8]"
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={flow.featured}
                    onChange={() => toggleFeatured(flow.id)}
                    className="w-4 h-4 rounded border-gray-300 text-[#17a2b8] cursor-pointer accent-[#17a2b8]"
                  />
                </td>
                <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setOpenMenu(openMenu === flow.id ? null : flow.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 font-bold text-lg"
                  >
                    ···
                  </button>
                  {openMenu === flow.id && (
                    <div className="absolute right-3 top-11 z-20 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[160px] py-1">
                      <button onClick={() => openEditModal(flow)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Sửa
                      </button>
                      <button onClick={() => { setDeleteTarget(flow); setOpenMenu(null) }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        Xóa
                      </button>
                      <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Thêm bài viết
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy dòng sự kiện nào</div>
        )}

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Tổng cộng: <strong>{filtered.length}</strong> / {flows.length} dòng sự kiện
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-12 px-4 pb-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-800 text-base">
                {editTarget ? 'Sửa dòng sự kiện' : 'Thêm dòng sự kiện mới'}
              </h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 px-6">
              {([['basic', 'Thông tin cơ bản'], ['seo', 'Thông tin SEO']] as [ModalTab, string][]).map(([tab, label]) => (
                <button
                  key={tab}
                  onClick={() => setModalTab(tab)}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${
                    modalTab === tab
                      ? 'text-[#17a2b8] border-b-2 border-[#17a2b8] -mb-px'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {modalTab === 'basic' ? (
                <>
                  {/* Avatar */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Avatar</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#17a2b8] cursor-pointer transition-colors group">
                      <svg className="w-8 h-8 mx-auto mb-2 text-gray-300 group-hover:text-[#17a2b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-gray-400">Kéo thả hoặc click để tải ảnh</p>
                    </div>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên dòng sự kiện</label>
                    <textarea
                      value={nameValue}
                      onChange={e => nameValue.length < 250 || e.target.value.length < nameValue.length
                        ? setNameValue(e.target.value.slice(0, 250)) : undefined}
                      rows={2}
                      placeholder="Nhập tên dòng sự kiện..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8] resize-none"
                    />
                    <div className="text-right text-xs text-gray-400 mt-1">{nameValue.length}/250</div>
                  </div>

                  {/* Categories */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên mục chính</label>
                      <select
                        value={mainCat}
                        onChange={e => setMainCat(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
                      >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên mục phụ</label>
                      <select
                        value={subCat}
                        onChange={e => setSubCat(e.target.value)}
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
                      >
                        <option value="">-- Không có --</option>
                        {CATEGORIES.filter(c => c !== mainCat).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea
                      value={descValue}
                      onChange={e => setDescValue(e.target.value)}
                      rows={3}
                      placeholder="Mô tả ngắn về dòng sự kiện..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none"
                    />
                  </div>

                  {/* Checkboxes */}
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={showOnPage} onChange={() => setShowOnPage(p => !p)} className="w-4 h-4 rounded accent-[#17a2b8]" />
                      <span className="text-sm text-gray-700">Hiển thị trên trang</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(p => !p)} className="w-4 h-4 rounded accent-[#17a2b8]" />
                      <span className="text-sm text-gray-700">Sự kiện nổi bật</span>
                    </label>
                  </div>
                </>
              ) : (
                /* SEO Tab */
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input type="text" placeholder="Tiêu đề SEO..." defaultValue={nameValue} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea rows={3} placeholder="Mô tả SEO..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input
                      type="text"
                      placeholder="ten-dong-su-kien"
                      defaultValue={nameValue.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Từ khóa SEO</label>
                    <input type="text" placeholder="từ khóa 1, từ khóa 2..." className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]" />
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
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
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">Xác nhận xóa</h3>
                <p className="text-xs text-gray-500">Hành động này không thể hoàn tác</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa dòng sự kiện <strong>"{deleteTarget.name}"</strong>?</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteTarget(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50">Huỷ</button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 font-medium">Xóa</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
