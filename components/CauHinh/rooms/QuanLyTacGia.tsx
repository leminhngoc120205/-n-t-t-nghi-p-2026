'use client'

import React, { useState, useCallback, useEffect } from 'react'

interface Author {
  id: string
  name: string
  slug: string
  bio: string
  email: string
  avatar: string
}

const PER_PAGE = 20

const COLORS = ['bg-blue-500','bg-red-500','bg-green-600','bg-yellow-500','bg-purple-600','bg-pink-500','bg-indigo-600','bg-teal-500']

export default function QuanLyTacGia() {
  const [authors,      setAuthors]      = useState<Author[]>([])
  const [loading,      setLoading]      = useState(true)
  const [page,         setPage]         = useState(1)
  const [keyword,      setKeyword]      = useState('')
  const [searchApplied, setSearchApplied] = useState('')
  const [showModal,    setShowModal]    = useState(false)
  const [editTarget,   setEditTarget]   = useState<Author | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null)
  const [nameValue,    setNameValue]    = useState('')
  const [slugEdited,   setSlugEdited]   = useState(false)
  const [slugValue,    setSlugValue]    = useState('')
  const [bioValue,     setBioValue]     = useState('')
  const [emailValue,   setEmailValue]   = useState('')
  const [avatarValue,  setAvatarValue]  = useState('')
  const [saving,       setSaving]       = useState(false)
  const [uploading,    setUploading]    = useState(false)

  const toSlug = (s: string) =>
    s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[đĐ]/g, 'd')
      .toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 100)

  const load = useCallback(() => {
    setLoading(true)
    fetch('/api/authors')
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          setAuthors(d.data.map((a: any) => ({
            id:     a._id,
            name:   a.name,
            slug:   a.slug   ?? '',
            bio:    a.bio    ?? '',
            email:  a.email  ?? '',
            avatar: a.avatar ?? '',
          })))
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const filtered = authors.filter(a =>
    !searchApplied ||
    a.name.toLowerCase().includes(searchApplied.toLowerCase()) ||
    a.email.toLowerCase().includes(searchApplied.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE))
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleSearch = () => { setSearchApplied(keyword); setPage(1) }

  const openAddModal = () => {
    setEditTarget(null); setNameValue(''); setSlugValue(''); setBioValue('')
    setEmailValue(''); setAvatarValue(''); setSlugEdited(false); setShowModal(true)
  }

  const openEditModal = (a: Author) => {
    setEditTarget(a); setNameValue(a.name); setSlugValue(a.slug); setBioValue(a.bio)
    setEmailValue(a.email); setAvatarValue(a.avatar); setSlugEdited(true); setShowModal(true)
  }

  const handleName = (v: string) => {
    setNameValue(v)
    if (!slugEdited) setSlugValue(toSlug(v))
  }

  const handleSave = async () => {
    if (!nameValue.trim() || saving) return
    setSaving(true)
    try {
      const body = { name: nameValue.trim(), slug: slugValue, bio: bioValue.trim(), email: emailValue.trim(), avatar: avatarValue.trim() }
      const url    = editTarget ? `/api/authors/${editTarget.id}` : '/api/authors'
      const method = editTarget ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const d = await res.json()
      if (d.ok) { setShowModal(false); load() }
    } catch {}
    setSaving(false)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/media/upload', { method: 'POST', body: fd })
      const d = await res.json()
      if (d.ok) setAvatarValue(d.data.url)
    } catch {}
    setUploading(false)
    e.target.value = ''
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    await fetch(`/api/authors/${deleteTarget.id}`, { method: 'DELETE' })
    setDeleteTarget(null)
    load()
  }

  return (
    <div className="p-6">

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <input type="text" placeholder="Tìm kiếm tác giả..." value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] w-64"/>
        <button onClick={handleSearch}
          className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded-md hover:bg-[#138496] transition-colors">
          Tìm kiếm
        </button>
        {searchApplied && (
          <button onClick={() => { setSearchApplied(''); setKeyword(''); setPage(1) }}
            className="px-3 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-50 text-gray-500">
            Xóa lọc
          </button>
        )}
        <button onClick={openAddModal}
          className="ml-auto px-4 py-2 bg-[#17a2b8] text-white text-sm font-semibold rounded-md hover:bg-[#138496] transition-colors flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
          </svg>
          Thêm tác giả
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
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-12">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tác giả</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-52">Email</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Mô tả</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-32">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((a, i) => (
                <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-400 text-xs">{(page - 1) * PER_PAGE + i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {a.avatar
                        ? <img src={a.avatar} alt={a.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0"/>
                        : <div className={`w-9 h-9 rounded-full ${COLORS[i % COLORS.length]} flex items-center justify-center flex-shrink-0`}>
                            <span className="text-white font-bold text-sm">{a.name[0]?.toUpperCase()}</span>
                          </div>
                      }
                      <div>
                        <div className="font-semibold text-gray-800">{a.name}</div>
                        {a.slug && <div className="text-xs text-gray-400 font-mono">{a.slug}</div>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-sm">{a.email || <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-500 text-sm max-w-xs">
                    <p className="line-clamp-2">{a.bio || <span className="text-gray-300 italic">Chưa có mô tả</span>}</p>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditModal(a)} title="Sửa"
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-blue-50 text-blue-500 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                      </button>
                      <button onClick={() => setDeleteTarget(a)} title="Xóa"
                        className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-red-50 text-red-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Không tìm thấy tác giả nào</div>
        )}

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-sm text-gray-500">
          <span>Tổng: <strong>{filtered.length}</strong> / {authors.length} tác giả</span>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1 rounded border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                ‹
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                .reduce<(number | '…')[]>((acc, p, i, arr) => {
                  if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('…')
                  acc.push(p)
                  return acc
                }, [])
                .map((p, i) =>
                  p === '…'
                    ? <span key={`e${i}`} className="px-1 text-xs text-gray-400">…</span>
                    : <button key={p} onClick={() => setPage(p as number)}
                        className={`px-3 py-1 rounded border text-xs transition-colors ${page === p ? 'bg-[#17a2b8] text-white border-[#17a2b8]' : 'border-gray-300 hover:bg-gray-100'}`}>
                        {p}
                      </button>
                )
              }
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-xs hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800 text-base">{editTarget ? 'Chỉnh sửa tác giả' : 'Thêm tác giả mới'}</h2>
              <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên tác giả <span className="text-red-500">*</span></label>
                <input type="text" value={nameValue} onChange={e => handleName(e.target.value)}
                  placeholder="Nhập tên tác giả..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                <input type="text" value={slugValue}
                  onChange={e => { setSlugValue(e.target.value); setSlugEdited(true) }}
                  placeholder="ten-tac-gia"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                <input type="email" value={emailValue} onChange={e => setEmailValue(e.target.value)}
                  placeholder="tacgia@example.com"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Mô tả</label>
                <textarea value={bioValue} onChange={e => setBioValue(e.target.value)}
                  rows={3} placeholder="Giới thiệu ngắn về tác giả..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] resize-none"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh đại diện</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center bg-gray-50 flex-shrink-0">
                    {avatarValue
                      ? <img src={avatarValue} alt="preview" className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}/>
                      : <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                        </svg>
                    }
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer">
                      <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden"
                        onChange={handleAvatarUpload} disabled={uploading}/>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-sm transition-colors
                        ${uploading
                          ? 'border-gray-200 text-gray-400 bg-gray-50 cursor-not-allowed'
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-[#17a2b8] cursor-pointer'}`}>
                        {uploading
                          ? <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                            </svg>Đang tải ảnh...</>
                          : <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                            </svg>Chọn ảnh</>
                        }
                      </div>
                    </label>
                    <p className="text-xs text-gray-400 mt-1.5">JPG, PNG, WebP, GIF · Tối đa 50MB</p>
                    {avatarValue && (
                      <button onClick={() => setAvatarValue('')}
                        className="text-xs text-red-400 hover:text-red-600 mt-1 transition-colors">
                        Xóa ảnh
                      </button>
                    )}
                  </div>
                </div>
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
            <p className="text-sm text-gray-600 mb-5">Bạn có chắc muốn xóa tác giả <strong>"{deleteTarget.name}"</strong>?</p>
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
