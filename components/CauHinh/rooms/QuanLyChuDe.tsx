'use client'

import React, { useState, useCallback, useEffect } from 'react'

interface Topic {
  id: string
  name: string
  slug: string
  icon: string
  active: boolean
  showIcon: boolean
  articleCount: number
}

export default function QuanLyChuDe() {
  const [topics,        setTopics]        = useState<Topic[]>([])
  const [loading,       setLoading]       = useState(true)
  const [keyword,       setKeyword]       = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [openMenu,      setOpenMenu]      = useState<string | null>(null)
  const [showModal,     setShowModal]     = useState(false)
  const [editTarget,    setEditTarget]    = useState<Topic | null>(null)
  const [deleteTarget,  setDeleteTarget]  = useState<Topic | null>(null)
  const [nameValue,     setNameValue]     = useState('')
  const [iconValue,     setIconValue]     = useState('')
  const [slugEdited,    setSlugEdited]    = useState(false)
  const [slugValue,     setSlugValue]     = useState('')
  const [saving,        setSaving]        = useState(false)

  const toSlug = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
      .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 100)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/topics')
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          const mapped: Topic[] = d.data.map((t: any) => ({
            id:           t._id,
            name:         t.name,
            slug:         t.slug,
            icon:         t.icon ?? '',
            active:       t.isActive  ?? true,
            showIcon:     t.showIcon  ?? false,
            articleCount: t.articleCount ?? 0,
          }))
          setTopics(mapped)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = topics.filter(t =>
    !searchApplied || t.name.toLowerCase().includes(searchApplied.toLowerCase())
  )

  const toggle = async (id: string, field: 'isActive' | 'showIcon', current: boolean) => {
    await fetch(`/api/topics/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ [field]: !current }),
    })
    load()
  }

  const openAddModal = () => {
    setEditTarget(null); setNameValue(''); setIconValue(''); setSlugValue(''); setSlugEdited(false)
    setShowModal(true)
  }

  const openEditModal = (t: Topic) => {
    setEditTarget(t); setNameValue(t.name); setIconValue(t.icon); setSlugValue(t.slug)
    setSlugEdited(true); setShowModal(true); setOpenMenu(null)
  }

  const handleName = (v: string) => {
    setNameValue(v)
    if (!slugEdited) setSlugValue(toSlug(v))
  }

  const handleSave = async () => {
    if (!nameValue.trim() || saving) return
    setSaving(true)
    try {
      const body = { name: nameValue.trim(), slug: slugValue, icon: iconValue.trim() }
      if (editTarget) {
        await fetch(`/api/topics/${editTarget.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        await fetch('/api/topics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }
      setShowModal(false)
      load()
    } catch {}
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await fetch(`/api/topics/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6" onClick={() => openMenu && setOpenMenu(null)}>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input type="text" placeholder="Tìm kiếm chủ đề..." value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setSearchApplied(keyword)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] w-60"/>
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tên chủ đề</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-48">Slug</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Icon</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-32">Hiển thị icon</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Kích hoạt</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(topic => (
                <tr key={topic.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-gray-800">{topic.name}</div>
                    <div className="text-xs text-gray-400 mt-0.5">Bài viết: {topic.articleCount}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{topic.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{topic.icon || <span className="text-gray-300 italic">—</span>}</td>
                  <td className="px-4 py-3 text-center">
                    <input type="checkbox" checked={topic.showIcon}
                      onChange={() => toggle(topic.id, 'showIcon', topic.showIcon)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer accent-[#17a2b8]"/>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => toggle(topic.id, 'isActive', topic.active)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                        topic.active
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                      }`}>
                      {topic.active ? 'Đang hoạt động' : 'Đã tắt'}
                    </button>
                  </td>
                  <td className="px-4 py-3 relative" onClick={e => e.stopPropagation()}>
                    <button onClick={() => setOpenMenu(openMenu === topic.id ? null : topic.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 text-gray-500 font-bold text-lg">
                      ···
                    </button>
                    {openMenu === topic.id && (
                      <div className="absolute right-3 top-11 z-20 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[160px] py-1">
                        <button onClick={() => openEditModal(topic)} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                          Sửa
                        </button>
                        <button onClick={() => { setDeleteTarget(topic); setOpenMenu(null) }} className="w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 flex items-center gap-2">
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
          <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy chủ đề nào</div>
        )}

        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 text-sm text-gray-500">
          Tổng cộng: <strong>{filtered.length}</strong> / {topics.length} chủ đề
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-base">{editTarget ? 'Sửa chủ đề' : 'Thêm chủ đề mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên chủ đề <span className="text-red-500">*</span></label>
                <input type="text" value={nameValue} onChange={e => handleName(e.target.value)}
                  placeholder="Nhập tên chủ đề..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                <input type="text" value={slugValue}
                  onChange={e => { setSlugValue(e.target.value); setSlugEdited(true) }}
                  placeholder="tu-khoa-url"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8]"/>
                <p className="text-xs text-gray-400 mt-1">Tự điền từ tên. Có thể sửa thủ công.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Icon (CSS class hoặc ký tự)</label>
                <input type="text" value={iconValue} onChange={e => setIconValue(e.target.value)}
                  placeholder="vd: fa-newspaper, 📰..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"/>
              </div>
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
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
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa chủ đề <strong>"{deleteTarget.name}"</strong>?</p>
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
