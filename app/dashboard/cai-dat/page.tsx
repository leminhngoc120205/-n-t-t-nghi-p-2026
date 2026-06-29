'use client'

import React, { useState, useEffect } from 'react'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'
import { useAuth } from '@/components/AuthProvider'

type Tab = 'profile' | 'security'

function UserIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
}
function LockIcon() {
  return <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zM10 11V7a2 2 0 114 0v4"/></svg>
}

const ROLE_LABEL: Record<string, string> = {
  admin: 'Quản trị viên', editor: 'Biên tập viên', reporter: 'Phóng viên',
}
const ROLE_COLOR: Record<string, string> = {
  admin: 'bg-red-100 text-red-700',
  editor: 'bg-blue-100 text-blue-700',
  reporter: 'bg-green-100 text-green-700',
}

export default function CaiDatPage() {
  const { user, refreshUser } = useAuth()
  const [tab, setTab] = useState<Tab>('profile')

  const [fullName,  setFullName]  = useState('')
  const [email,     setEmail]     = useState('')
  const [phone,     setPhone]     = useState('')
  const [address,   setAddress]   = useState('')
  const [saving,    setSaving]    = useState(false)

  const [currentPwd,  setCurrentPwd]  = useState('')
  const [newPwd,      setNewPwd]      = useState('')
  const [confirmPwd,  setConfirmPwd]  = useState('')
  const [showCur,     setShowCur]     = useState(false)
  const [showNew,     setShowNew]     = useState(false)
  const [showCon,     setShowCon]     = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)

  const [toast, setToast] = useState<{ msg: string; type: 'ok' | 'err' } | null>(null)

  useEffect(() => {
    if (user) {
      setFullName(user.fullName ?? '')
      setEmail(user.email ?? '')
      setPhone(user.phone ?? '')
      setAddress(user.address ?? '')
    }
  }, [user])

  const showMsg = (msg: string, type: 'ok' | 'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, address }),
      })
      const d = await res.json()
      if (d.ok) { await refreshUser(); showMsg('Đã lưu thông tin cá nhân', 'ok') }
      else showMsg(d.error || 'Lỗi lưu thông tin', 'err')
    } catch { showMsg('Lỗi kết nối', 'err') }
    finally { setSaving(false) }
  }

  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || newPwd !== confirmPwd || newPwd.length < 6) return
    setChangingPwd(true)
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      const d = await res.json()
      if (d.ok) {
        showMsg('Đổi mật khẩu thành công', 'ok')
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
      } else showMsg(d.error || 'Mật khẩu hiện tại không đúng', 'err')
    } catch { showMsg('Lỗi kết nối', 'err') }
    finally { setChangingPwd(false) }
  }

  const initials = (user?.fullName ?? user?.username ?? 'U')
    .split(' ').map((w: string) => w[0] ?? '').join('').slice(0, 2).toUpperCase()

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'profile',  label: 'Thông tin cá nhân', icon: <UserIcon /> },
    { id: 'security', label: 'Bảo mật',            icon: <LockIcon /> },
  ]

  function PwdInput({ label, value, onChange, show, onToggle }: {
    label: string; value: string; onChange: (v: string) => void; show: boolean; onToggle: () => void
  }) {
    return (
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">{label}</label>
        <div className="relative">
          <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"/>
          <button type="button" onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            {show
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
            }
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-gray-800">Cài đặt</h1>
              <p className="text-sm text-gray-500 mt-0.5">Quản lý tài khoản và tuỳ chỉnh thông tin cá nhân</p>
            </div>

            <div className="flex gap-5">
              {/* ── Left tab list ── */}
              <div className="w-52 flex-shrink-0">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {TABS.map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left border-l-[3px]
                        ${tab === t.id
                          ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-[#17a2b8]'
                          : 'text-gray-600 hover:bg-gray-50 border-transparent'}`}>
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Right content ── */}
              <div className="flex-1 space-y-4">

                {/* ════ TAB: THÔNG TIN CÁ NHÂN ════ */}
                {tab === 'profile' && (
                  <>
                    {/* Profile header */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#138496] flex items-center justify-center shadow">
                            <span className="text-white font-bold text-xl">{initials}</span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm">
                            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-base">{user?.fullName || '—'}</p>
                          <p className="text-sm text-gray-500">{user?.email || '—'}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${ROLE_COLOR[user?.role ?? ''] || 'bg-gray-100 text-gray-500'}`}>
                              {ROLE_LABEL[user?.role ?? ''] || user?.role}
                            </span>
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-green-100 text-green-700">● Hoạt động</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Info cards 2×2 */}
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>, label: 'Email', value: user?.email || '—' },
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>, label: 'Ngày tham gia', value: user?.createdAt ? fmtDate(user.createdAt) : '—' },
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>, label: 'Vai trò', value: ROLE_LABEL[user?.role ?? ''] || '—' },
                        { icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth={2}/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3"/></svg>, label: 'Trạng thái', value: 'Hoạt động', green: true },
                      ].map((card, i) => (
                        <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                          <div className="flex items-center gap-2 text-gray-400 mb-1.5">
                            {card.icon}
                            <span className="text-[10px] font-semibold uppercase tracking-wide">{card.label}</span>
                          </div>
                          <p className={`text-sm font-medium ${card.green ? 'text-green-600' : 'text-gray-700'}`}>{card.value}</p>
                        </div>
                      ))}
                    </div>

                    {/* Edit form */}
                    <div className="bg-white rounded-xl border border-gray-200 p-5">
                      <h3 className="font-bold text-gray-800 mb-4">Chỉnh sửa thông tin</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Họ và tên</label>
                          <input value={fullName} onChange={e => setFullName(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"/>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Email</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"/>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Số điện thoại</label>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Chưa cập nhật"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"/>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Địa chỉ</label>
                            <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Chưa cập nhật"
                              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"/>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 flex justify-end">
                        <button onClick={handleSaveProfile} disabled={saving}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#17a2b8] text-white text-sm font-bold rounded-lg hover:bg-[#138496] transition-colors disabled:opacity-50 shadow-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/></svg>
                          {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* ════ TAB: BẢO MẬT ════ */}
                {tab === 'security' && (
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="font-bold text-gray-800 mb-1">Đổi mật khẩu</h3>
                    <p className="text-sm text-gray-500 mb-5">Mật khẩu mạnh nên có ít nhất 6 ký tự, bao gồm chữ và số.</p>
                    <div className="space-y-4 max-w-md">
                      <PwdInput label="Mật khẩu hiện tại" value={currentPwd} onChange={setCurrentPwd} show={showCur} onToggle={() => setShowCur(p => !p)}/>
                      <PwdInput label="Mật khẩu mới" value={newPwd} onChange={setNewPwd} show={showNew} onToggle={() => setShowNew(p => !p)}/>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Xác nhận mật khẩu mới</label>
                        <div className="relative">
                          <input type={showCon ? 'text' : 'password'} value={confirmPwd} onChange={e => setConfirmPwd(e.target.value)}
                            className={`w-full border rounded-lg px-3 py-2.5 pr-10 text-sm focus:outline-none focus:ring-1
                              ${confirmPwd && newPwd !== confirmPwd
                                ? 'border-red-400 focus:border-red-400 focus:ring-red-400'
                                : 'border-gray-300 focus:border-[#17a2b8] focus:ring-[#17a2b8]'}`}/>
                          <button type="button" onClick={() => setShowCon(p => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {showCon
                                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                : <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></>
                              }
                            </svg>
                          </button>
                        </div>
                        {confirmPwd && newPwd !== confirmPwd && (
                          <p className="text-xs text-red-500 mt-1">Mật khẩu xác nhận không khớp</p>
                        )}
                      </div>
                      {newPwd && newPwd.length < 6 && (
                        <p className="text-xs text-orange-500">Mật khẩu cần ít nhất 6 ký tự</p>
                      )}
                      <button onClick={handleChangePassword}
                        disabled={changingPwd || !currentPwd || !newPwd || newPwd !== confirmPwd || newPwd.length < 6}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#17a2b8] text-white text-sm font-bold rounded-lg hover:bg-[#138496] transition-colors disabled:opacity-50 shadow-sm">
                        <LockIcon />
                        {changingPwd ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </main>
      </div>

      {toast && (
        <div className={`fixed bottom-6 right-6 z-[300] flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium
          ${toast.type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`}>
          {toast.type === 'ok'
            ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
            : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          }
          {toast.msg}
        </div>
      )}
    </div>
  )
}
