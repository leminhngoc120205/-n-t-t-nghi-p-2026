'use client'

import React, { useState, useCallback, useEffect } from 'react'

interface EventFlow {
  id: string
  name: string
  articleCount: number
  avatar: string
  showOnPage: boolean
  featured: boolean
  category: string
}

type ModalTab = 'basic' | 'seo'

const AVATAR_COLORS = [
  'bg-blue-500', 'bg-red-500', 'bg-green-500', 'bg-yellow-500',
  'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500',
]

function slugify(text: string) {
  return text
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[đĐ]/g, 'd').toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '').trim()
    .replace(/\s+/g, '-').slice(0, 100)
}

export default function QuanLyDongSuKien() {
  const [flows,          setFlows]          = useState<EventFlow[]>([])
  const [loading,        setLoading]        = useState(true)
  const [cats,           setCats]           = useState<string[]>([])
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus,   setFilterStatus]   = useState('all')
  const [keyword,        setKeyword]        = useState('')
  const [searchApplied,  setSearchApplied]  = useState('')
  const [openMenu,       setOpenMenu]       = useState<string | null>(null)
  const [showModal,      setShowModal]      = useState(false)
  const [editTarget,     setEditTarget]     = useState<EventFlow | null>(null)
  const [deleteTarget,   setDeleteTarget]   = useState<EventFlow | null>(null)
  const [modalTab,       setModalTab]       = useState<ModalTab>('basic')
  const [nameValue,      setNameValue]      = useState('')
  const [descValue,      setDescValue]      = useState('')
  const [mainCat,        setMainCat]        = useState('')
  const [showOnPage,     setShowOnPage]     = useState(true)
  const [isFeatured,     setIsFeatured]     = useState(false)
  const [saving,         setSaving]         = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/events')
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          const mapped: EventFlow[] = d.data.map((e: any) => ({
            id:          e._id,
            name:        e.name,
            articleCount: e.articleCount ?? 0,
            avatar:      (e.name as string)[0]?.toUpperCase() ?? 'N',
            showOnPage:  e.showOnHome  ?? false,
            featured:    e.isFeatured  ?? false,
            category:    e.categoryName ?? '',
          }))
          setFlows(mapped)
          setCats([...new Set(mapped.map(f => f.category).filter(Boolean))])
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = flows.filter(f => {
    const matchCat    = filterCategory === 'all' || f.category === filterCategory
    const matchStatus = filterStatus   === 'all'
      || (filterStatus === 'show' ? f.showOnPage : !f.showOnPage)
    const matchKw     = !searchApplied || f.name.toLowerCase().includes(searchApplied.toLowerCase())
    return matchCat && matchStatus && matchKw
  })

  const toggle = async (id: string, field: 'showOnHome' | 'isFeatured', current: boolean) => {
    await fetch(`/api/events/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
    load()
  }

  const openAddModal = () => {
    setEditTarget(null); setNameValue(''); setDescValue('')
    setMainCat(cats[0] ?? ''); setShowOnPage(true); setIsFeatured(false)
    setModalTab('basic'); setShowModal(true)
  }

  const openEditModal = (flow: EventFlow) => {
    setEditTarget(flow); setNameValue(flow.name); setDescValue('')
    setMainCat(flow.category); setShowOnPage(flow.showOnPage)
    setIsFeatured(flow.featured); setModalTab('basic')
    setShowModal(true); setOpenMenu(null)
  }

  const handleSave = async () => {
    if (!nameValue.trim() || saving) return
    setSaving(true)
    try {
      if (editTarget) {
        await fetch(`/api/events/${editTarget.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: nameValue.trim(), description: descValue, categoryName: mainCat, showOnHome: showOnPage, isFeatured }),
        })
      } else {
        await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameValue.trim(),
            slug: slugify(nameValue) + '-' + Date.now().toString(36),
            description: descValue,
            categoryName: mainCat,
            showOnHome: showOnPage,
            isFeatured,
          }),
        })
      }
      setShowModal(false)
      load()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await fetch(`/api/events/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6" onClick={() => openMenu && setOpenMenu(null)}>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
          <option value="all">Tất cả chuyên mục</option>
          {cats.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
          <option value="all">Tất cả</option>
          <option value="show">Hiển thị</option>
          <option value="hide">Ẩn</option>
        </select>
        <input type="text" placeholder="Từ khóa" value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchApplied(keyword)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] w-48"/>
        <button onClick={() => setSearchApplied(keyword)}
          className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded-md hover:bg-[#138496] transition-colors">
          Tìm kiếm
        </button>
        {searchApplied && (
          <button onClick={() => { setSearchApplied(''); setKeyword('') }}
            className="px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 text-gray-500">
            Xóa lọc
          </button>
        )}
        <button onClick={openAddModal}
          className="ml-auto px-4 py-2 bg-[#17a2b8] text-white text-sm font-semibold rounded-md hover:bg-[#138496] transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Thêm mới
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3 text-[#17a2b8]">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
            </svg>
            <span className="text-sm font-medium">Đang tải...</span>
          </div>
        ) : (
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
                    <input type="checkbox" checked={flow.showOnPage}
                      onChange={() => toggle(flow.id, 'showOnHome', flow.showOnPage)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#17a2b8]"/>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" checked={flow.featured}
                      onChange={() => toggle(flow.id, 'isFeatured', flow.featured)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#17a2b8]"/>
                  </td>
                  <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setOpenMenu(openMenu === flow.id ? null : flow.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 font-bold text-lg">
                      ···
                    </button>
                    {openMenu === flow.id && (
                      <div className="absolute right-3 top-11 z-20 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[160px] py-1">
                        <button onClick={() => openEditModal(flow)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          Sửa
                        </button>
                        <button onClick={() => { setDeleteTarget(flow); setOpenMenu(null) }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                          Xóa
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
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
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <h2 className="font-bold text-gray-800 text-base">{editTarget ? 'Sửa dòng sự kiện' : 'Thêm dòng sự kiện mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>

            <div className="flex border-b border-gray-200 px-6">
              {([['basic', 'Thông tin cơ bản'], ['seo', 'Thông tin SEO']] as [ModalTab, string][]).map(([tab, label]) => (
                <button key={tab} onClick={() => setModalTab(tab)}
                  className={`px-4 py-3 text-sm font-medium transition-colors ${modalTab === tab ? 'text-[#17a2b8] border-b-2 border-[#17a2b8] -mb-px' : 'text-gray-500 hover:text-gray-700'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="p-6 space-y-5">
              {modalTab === 'basic' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tên dòng sự kiện</label>
                    <textarea value={nameValue}
                      onChange={e => setNameValue(e.target.value.slice(0, 250))}
                      rows={2} placeholder="Nhập tên dòng sự kiện..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none"/>
                    <div className="text-right text-xs text-gray-400 mt-1">{nameValue.length}/250</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chuyên mục</label>
                    <select value={mainCat} onChange={e => setMainCat(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]">
                      <option value="">-- Chọn chuyên mục --</option>
                      {cats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
                    <textarea value={descValue} onChange={e => setDescValue(e.target.value)}
                      rows={3} placeholder="Mô tả ngắn về dòng sự kiện..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none"/>
                  </div>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={showOnPage} onChange={() => setShowOnPage(p => !p)} className="w-4 h-4 rounded accent-[#17a2b8]"/>
                      <span className="text-sm text-gray-700">Hiển thị trên trang</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" checked={isFeatured} onChange={() => setIsFeatured(p => !p)} className="w-4 h-4 rounded accent-[#17a2b8]"/>
                      <span className="text-sm text-gray-700">Sự kiện nổi bật</span>
                    </label>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Slug (URL)</label>
                    <input type="text" readOnly value={slugify(nameValue)}
                      className="w-full border border-gray-200 bg-gray-50 rounded-md px-3 py-2 text-sm font-mono text-gray-500"/>
                    <p className="text-xs text-gray-400 mt-1">Tự tạo từ tên sự kiện</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                    <input type="text" defaultValue={nameValue} placeholder="Tiêu đề SEO..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                    <textarea rows={3} placeholder="Mô tả SEO..."
                      className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none"/>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 sticky bottom-0">
              <button onClick={() => setShowModal(false)} className="px-5 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 tracking-wide">ĐÓNG</button>
              <button onClick={handleSave} disabled={!nameValue.trim() || saving}
                className="px-5 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 tracking-wide">
                {saving ? 'Đang lưu...' : 'LƯU'}
              </button>
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
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
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
