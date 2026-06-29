'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'

/* ── Avatar ── */
function Av({ label, color = 'bg-[#17c3d8]' }: { label: string; color?: string }) {
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
      {label.charAt(0).toUpperCase()}
    </div>
  )
}

/* ── 3-dot menu ── */
function ThreeDot({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false)
  const [pos,  setPos]  = useState({ top: 0, left: 0 })
  const btnRef  = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const h = (e: MouseEvent) => {
      if (
        btnRef.current  && !btnRef.current.contains(e.target as Node) &&
        menuRef.current && !menuRef.current.contains(e.target as Node)
      ) setOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const handleToggle = () => {
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setPos({ top: r.bottom + 4, left: r.right - 128 })
    }
    setOpen(v => !v)
  }

  return (
    <>
      <button ref={btnRef} onClick={handleToggle}
        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors font-bold text-base leading-none">⋮</button>
      {open && (
        <div ref={menuRef} className="fixed z-[500] bg-white border border-gray-200 rounded-lg shadow-lg w-32 overflow-hidden"
          style={{ top: pos.top, left: pos.left }}>
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
    </>
  )
}

/* ── User modal ── */
function UserModal({ mode, initial, onClose, onSaved, showToast }: {
  mode: 'add' | 'edit'
  initial: any
  onClose: () => void
  onSaved: () => void
  showToast: (m: string, t: 'ok' | 'err') => void
}) {
  const [username, setUsername] = useState(initial?.username || '')
  const [fullName, setFullName] = useState(initial?.fullName || '')
  const [email,    setEmail]    = useState(initial?.email    || '')
  const [role,     setRole]     = useState<'reporter' | 'editor' | 'admin'>(initial?.role || 'reporter')
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

/* ══════════════════════════════════════════════════════════ */

const COLORS = ['bg-blue-500','bg-teal-500','bg-violet-500','bg-orange-500','bg-rose-500','bg-indigo-500']

export default function NguoiDungPage() {
  const [users,        setUsers]        = useState<any[]>([])
  const [fetching,     setFetching]     = useState(true)
  const [search,       setSearch]       = useState('')
  const [roleFilter,   setRoleFilter]   = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [modal,        setModal]        = useState<'add' | 'edit' | null>(null)
  const [target,       setTarget]       = useState<any>(null)
  const [confirm,      setConfirm]      = useState<any>(null)
  const [toast,        setToast]        = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  const showToast = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

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

  const handleToggleLock = async (u: any) => {
    const next = !u.isActive
    const res = await fetch(`/api/users/${u._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: next }),
    })
    const d = await res.json()
    if (d.ok) { showToast(next ? 'Đã mở khóa tài khoản' : 'Đã khóa tài khoản', 'ok'); load() }
    else showToast(d.error || 'Lỗi', 'err')
  }

  const roleBadge = (role: string) => {
    const cls: Record<string, string> = { admin: 'bg-red-100 text-red-700', editor: 'bg-blue-100 text-blue-700', reporter: 'bg-green-100 text-green-700' }
    const lbl: Record<string, string> = { admin: 'Quản trị viên', editor: 'Biên tập viên', reporter: 'Phóng viên' }
    return <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${cls[role] || 'bg-gray-100 text-gray-500'}`}>{lbl[role] || role}</span>
  }

  const fmtLogin = (d: string | null) => {
    if (!d) return '—'
    return new Date(d).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const adminCount    = users.filter(u => u.role === 'admin').length
  const editorCount   = users.filter(u => u.role === 'editor').length
  const reporterCount = users.filter(u => u.role === 'reporter').length

  const filtered = users.filter(u => {
    const matchSearch = !search ||
      u.username?.toLowerCase().includes(search.toLowerCase()) ||
      u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase())
    const matchRole   = !roleFilter   || u.role === roleFilter
    const matchStatus = !statusFilter || (statusFilter === 'active' ? u.isActive !== false : u.isActive === false)
    return matchSearch && matchRole && matchStatus
  })

  const STAT_CARDS = [
    { role: 'admin',    label: 'Quản trị viên', count: adminCount,    bg: 'bg-red-50',   border: 'border-red-200',   countCls: 'text-red-600',   labelCls: 'text-red-500',
      icon: <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg> },
    { role: 'editor',   label: 'Biên tập viên', count: editorCount,   bg: 'bg-blue-50',  border: 'border-blue-200',  countCls: 'text-blue-600',  labelCls: 'text-blue-500',
      icon: <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg> },
    { role: 'reporter', label: 'Phóng viên',    count: reporterCount, bg: 'bg-green-50', border: 'border-green-200', countCls: 'text-green-600', labelCls: 'text-green-500',
      icon: <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg> },
  ]

  return (
    <div className="p-5">
      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {STAT_CARDS.map(c => (
          <button key={c.role}
            onClick={() => setRoleFilter(roleFilter === c.role ? '' : c.role)}
            className={`flex items-center justify-between px-5 py-4 rounded-xl border transition-all text-left
              ${roleFilter === c.role
                ? `${c.bg} ${c.border} ring-2 ring-offset-1 ${c.border.replace('border-', 'ring-')}`
                : `bg-white border-gray-200 hover:${c.bg} hover:${c.border}`}`}>
            <div>
              <p className={`text-[11px] font-semibold uppercase tracking-widest mb-1 ${roleFilter === c.role ? c.labelCls : 'text-gray-400'}`}>{c.label}</p>
              <p className={`text-3xl font-bold ${roleFilter === c.role ? c.countCls : 'text-gray-700'}`}>{fetching ? '—' : c.count}</p>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${c.bg} border ${c.border}`}>{c.icon}</div>
          </button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={() => { setTarget(null); setModal('add') }}
          className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors shadow-sm whitespace-nowrap">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Thêm tài khoản
        </button>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-2.5 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]">
          <option value="">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
        {(roleFilter || statusFilter) && (
          <button onClick={() => { setRoleFilter(''); setStatusFilter('') }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-500 whitespace-nowrap">
            Xóa lọc <span className="font-bold">×</span>
          </button>
        )}
        <div className="relative ml-auto">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Tìm kiếm..."
            className="pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8] w-44"/>
          <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>

      <p className="text-[11px] text-gray-400 mb-2">{filtered.length} kết quả</p>

      {fetching ? (
        <div className="bg-white rounded border border-gray-200 p-10 text-center text-gray-400 text-sm">Đang tải...</div>
      ) : (
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {['Avatar','Tài khoản','Email','Vai trò','Bài viết','Đăng nhập gần đây','Trạng thái','Thao tác'].map((h, i, arr) => (
                  <th key={h} className={`px-4 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide ${i === arr.length - 1 ? 'text-center' : ''}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u: any, i: number) => (
                <tr key={u._id} className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${u.isActive === false ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3"><Av label={u.fullName || u.username} color={u.isActive === false ? 'bg-gray-400' : COLORS[i % COLORS.length]}/></td>
                  <td className="px-4 py-3">
                    <p className="font-mono text-xs font-semibold text-gray-800">{u.username}</p>
                    <p className="text-[11px] text-gray-400">{u.fullName}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.email || '—'}</td>
                  <td className="px-4 py-3">{roleBadge(u.role)}</td>
                  <td className="px-4 py-3 text-center"><span className="font-mono text-xs font-semibold text-gray-700">{u.articleCount ?? 0}</span></td>
                  <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{fmtLogin(u.lastLoginAt)}</td>
                  <td className="px-4 py-3">
                    {u.isActive === false
                      ? <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-500">Đã khóa</span>
                      : <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">● Hoạt động</span>}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => handleToggleLock(u)}
                        title={u.isActive === false ? 'Mở khóa' : 'Khóa tài khoản'}
                        className={`p-1.5 rounded transition-colors ${u.isActive === false ? 'text-green-600 hover:bg-green-50' : 'text-orange-500 hover:bg-orange-50'}`}>
                        {u.isActive === false
                          ? <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
                          : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 11V7a2 2 0 114 0v4"/></svg>}
                      </button>
                      <ThreeDot onEdit={() => { setTarget(u); setModal('edit') }} onDelete={() => setConfirm(u)}/>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-xs text-gray-500 mt-3">1 đến {filtered.length} trong {users.length}</p>

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

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium
          ${toast.type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.type === 'ok'
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>}
          {toast.msg}
        </div>
      )}
    </div>
  )
}
