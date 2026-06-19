'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'

const DOTS_MENU = [
  { label: 'QUẢN LÝ DÒNG SỰ KIỆN', href: '/cau-hinh/dong-su-kien' },
  { label: 'QUẢN LÝ CHỦ ĐỀ',       href: '/cau-hinh/chu-de' },
  { label: 'QUẢN LÝ TÁC GIẢ',      href: '/cau-hinh/tac-gia' },
]

const leftNavItems = [
  { label: 'BÀI VIẾT', href: '/dashboard/bai-viet', icon: <DocIcon /> },
  { label: 'PODCAST', href: '/dashboard/podcast', icon: <MicIcon /> },
  { label: 'MẪU HTML', href: '/dashboard/mau-html', icon: <CodeIcon /> },
]

const rightNavItems = [
  { label: 'DỮ LIỆU', href: '/dashboard/du-lieu', icon: <DataIcon /> },
  { label: 'DỊCH VỤ AI', href: '/dich-vu-ai', prefix: 'AI', icon: <AIIcon /> },
]

export const IMSTopBar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const displayName = user?.username?.toUpperCase() ?? 'NGOCLM_VCC'
  const [showDotsMenu, setShowDotsMenu] = useState(false)
  const dotsRef = useRef<HTMLDivElement>(null)

  // User menu state
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  // Profile modal — values seeded from auth context when user loads
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [profileFullName, setProfileFullName] = useState('')
  const [profileEmail, setProfileEmail] = useState('')
  const [profileAddress, setProfileAddress] = useState('')
  const [profilePhone, setProfilePhone] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)

  // Password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [showCurrentPwd, setShowCurrentPwd] = useState(false)
  const [showNewPwd, setShowNewPwd] = useState(false)
  const [showConfirmPwd, setShowConfirmPwd] = useState(false)

  // Telegram modal
  const [showTelegramModal, setShowTelegramModal] = useState(false)
  const [telegramId, setTelegramId] = useState('')

  // Sync profile form fields when user data loads
  useEffect(() => {
    if (user) {
      setProfileFullName(user.fullName ?? '')
      setProfileEmail(user.email ?? '')
      setProfileAddress(user.address ?? '')
      setProfilePhone(user.phone ?? '')
      setTelegramId(user.telegramId ?? '')
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dotsRef.current && !dotsRef.current.contains(e.target as Node)) {
        setShowDotsMenu(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Save profile changes to API
  const handleSaveProfile = async () => {
    setProfileSaving(true)
    try {
      await fetch('/api/auth/update-profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: profileFullName,
          email: profileEmail,
          address: profileAddress,
          phone: profilePhone,
        }),
      })
    } finally {
      setProfileSaving(false)
      setShowProfileModal(false)
    }
  }

  // Change password via API
  const handleChangePassword = async () => {
    if (!currentPwd || !newPwd || newPwd !== confirmPwd) return
    try {
      const res = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      })
      if (res.ok) {
        setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
        setShowPasswordModal(false)
      }
    } catch { /* noop */ }
  }

  return (
    <header className="h-12 bg-white border-b border-gray-200 flex items-center px-4 sticky top-0 z-40 shadow-sm">
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center mr-4">
        <TopbarLogo />
      </Link>

      {/* Left Nav */}
      <nav className="flex items-center">
        {leftNavItems.map((item, i) => {
          const isActive = pathname === item.href
          return (
            <React.Fragment key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-colors whitespace-nowrap tracking-wide ${
                  isActive
                    ? 'text-[#17a2b8] border-b-2 border-[#17a2b8]'
                    : 'text-gray-600 hover:text-[#17a2b8]'
                }`}
              >
                <span className={isActive ? 'text-[#17a2b8]' : 'text-gray-400'}>{item.icon}</span>
                {item.label}
              </Link>
              {i < leftNavItems.length - 1 && (
                <span className="text-gray-200 select-none">|</span>
              )}
            </React.Fragment>
          )
        })}
        <span className="text-gray-200 mx-1 select-none">|</span>
        <div className="relative" ref={dotsRef}>
          <button
            onClick={() => {
              setShowDotsMenu(prev => !prev)
              router.push('/cau-hinh/dong-su-kien')
            }}
            className={`px-2 py-2 text-sm font-bold tracking-widest transition-colors ${
              pathname?.startsWith('/cau-hinh')
                ? 'text-[#17a2b8]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ···
          </button>
          {showDotsMenu && (
            <div className="absolute left-0 top-full mt-1 z-50 bg-white border border-gray-200 rounded-lg shadow-xl min-w-[220px] py-1">
              {DOTS_MENU.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowDotsMenu(false)}
                  className={`block px-4 py-2.5 text-[11px] font-semibold tracking-wide transition-colors ${
                    pathname === item.href
                      ? 'text-[#17a2b8] bg-[#e8f7f9]'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-[#17a2b8]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <div className="flex-1" />

      {/* Right Nav */}
      <nav className="flex items-center">
        {rightNavItems.map((item, i) => {
          const isActive = pathname?.startsWith(item.href) && item.href !== '#'
          return (
            <React.Fragment key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-1.5 px-3 py-2 text-[11px] font-semibold transition-colors whitespace-nowrap tracking-wide ${
                  isActive
                    ? 'text-[#17a2b8] border-b-2 border-[#17a2b8]'
                    : 'text-gray-600 hover:text-[#17a2b8]'
                }`}
              >
                <span className={isActive ? 'text-[#17a2b8]' : 'text-gray-400'}>{item.icon}</span>
                {item.prefix && (
                  <span className={`font-bold mr-0.5 ${isActive ? 'text-[#17a2b8]' : 'text-[#17a2b8]'}`}>{item.prefix}</span>
                )}
                {item.label}
              </Link>
              {i < rightNavItems.length - 1 && (
                <span className="text-gray-200 select-none">|</span>
              )}
            </React.Fragment>
          )
        })}
      </nav>

      {/* User area */}
      <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
        <span className="text-[13px] font-semibold text-gray-700 tracking-wide">{displayName}</span>

        {/* Smiley face button */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setShowUserMenu(prev => !prev)}
            className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${
              showUserMenu ? 'bg-[#e8f7f9] text-[#17a2b8]' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <SmileIcon />
          </button>

          {/* Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-50 bg-white border border-gray-200 rounded-xl shadow-2xl w-52 py-1">
              {/* Arrow */}
              <div className="absolute -top-2 right-3 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-white" />
              <div className="absolute -top-[9px] right-3 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-200" />

              {/* Username header */}
              <div className="px-4 py-3 border-b border-gray-100 text-center">
                <span className="text-sm font-bold text-gray-800">{displayName}</span>
              </div>

              {/* Menu items */}
              <button
                onClick={() => { setShowUserMenu(false); setShowProfileModal(true) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <UserCircleIcon />
                Sửa profile
              </button>
              <button
                onClick={() => { setShowUserMenu(false); setShowPasswordModal(true) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <KeyIcon />
                Đổi mật khẩu
              </button>
              <button
                onClick={() => { setShowUserMenu(false); setShowTelegramModal(true) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <TelegramIcon />
                Cập nhật telegramId
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => { setShowUserMenu(false); logout() }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <LogoutIcon />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────────────── */}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={() => setShowProfileModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[440px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Sửa profile cho tài khoản <span className="text-[#17a2b8]">{user?.username ?? displayName.toLowerCase()}</span></h2>
              <button onClick={() => setShowProfileModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6">
              {/* Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="relative cursor-pointer group">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#138496] flex items-center justify-center shadow-md">
                    <span className="text-white font-bold text-2xl">
                      {(user?.fullName ?? user?.username ?? 'U')[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm group-hover:bg-[#e8f7f9] transition-colors">
                    <svg className="w-3 h-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </div>
                </div>
                <span className="mt-2 text-sm font-semibold text-[#17a2b8]">{user?.username ?? displayName.toLowerCase()}</span>
              </div>
              {/* Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Họ tên</label>
                  <input type="text" value={profileFullName} onChange={e => setProfileFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                  <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Địa chỉ</label>
                  <input type="text" value={profileAddress} onChange={e => setProfileAddress(e.target.value)}
                    placeholder="Chưa cập nhật"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Điện thoại</label>
                  <input type="tel" value={profilePhone} onChange={e => setProfilePhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowProfileModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Đóng</button>
              <button onClick={handleSaveProfile} disabled={profileSaving} className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] transition-colors font-medium disabled:opacity-60">
                {profileSaving ? 'Đang lưu...' : 'Lưu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={() => setShowPasswordModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[420px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Đổi mật khẩu cho tài khoản <span className="text-[#17a2b8]">{user?.username ?? displayName.toLowerCase()}</span></h2>
              <button onClick={() => setShowPasswordModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Mật khẩu hiện tại', value: currentPwd,  setter: setCurrentPwd,  show: showCurrentPwd, toggleShow: () => setShowCurrentPwd(p => !p) },
                { label: 'Mật khẩu mới',      value: newPwd,      setter: setNewPwd,      show: showNewPwd,     toggleShow: () => setShowNewPwd(p => !p) },
                { label: 'Xác nhận mật khẩu', value: confirmPwd,  setter: setConfirmPwd,  show: showConfirmPwd, toggleShow: () => setShowConfirmPwd(p => !p) },
              ].map(field => (
                <div key={field.label}>
                  <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">{field.label}</label>
                  <div className="relative">
                    <input
                      type={field.show ? 'text' : 'password'}
                      value={field.value}
                      onChange={e => field.setter(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={field.toggleShow} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                      {field.show
                        ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                        : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                      }
                    </button>
                  </div>
                  {field.label === 'Xác nhận mật khẩu' && confirmPwd && newPwd !== confirmPwd && (
                    <p className="text-xs text-red-400 mt-1">Mật khẩu xác nhận không khớp</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => { setShowPasswordModal(false); setCurrentPwd(''); setNewPwd(''); setConfirmPwd('') }} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Đóng</button>
              <button
                onClick={handleChangePassword}
                disabled={!currentPwd || !newPwd || newPwd !== confirmPwd}
                className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-40 transition-colors font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Telegram Modal */}
      {showTelegramModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" onClick={() => setShowTelegramModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[400px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-[#0088cc] rounded-full flex items-center justify-center">
                  <TelegramIcon white />
                </div>
                <h2 className="font-bold text-gray-800">Cập nhật Telegram ID</h2>
              </div>
              <button onClick={() => setShowTelegramModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">Nhập Telegram ID để nhận thông báo từ hệ thống qua Telegram Bot.</p>
              <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Telegram ID</label>
              <input
                type="text"
                value={telegramId}
                onChange={e => setTelegramId(e.target.value)}
                placeholder="VD: 123456789"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
              />
              <p className="text-xs text-gray-400 mt-2">
                Tìm Telegram ID của bạn bằng cách nhắn tin cho <span className="text-[#0088cc] font-medium">@userinfobot</span> trên Telegram.
              </p>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowTelegramModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100 transition-colors">Đóng</button>
              <button
                onClick={() => setShowTelegramModal(false)}
                disabled={!telegramId.trim()}
                className="px-4 py-2 text-sm bg-[#0088cc] text-white rounded-md hover:bg-[#006699] disabled:opacity-40 transition-colors font-medium"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

    </header>
  )
}

const TopbarLogo = () => (
  <svg viewBox="0 0 36 36" className="w-8 h-8" fill="none">
    <path
      d="M3 28L9 12L14 22L18 14L23 22L28 12L33 28"
      stroke="#17c3d8"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

function DocIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
}
function MicIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4M9 11V7a3 3 0 016 0v4a3 3 0 01-6 0z" />
    </svg>
  )
}
function CodeIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  )
}
function DataIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
    </svg>
  )
}
function AIIcon() {
  return (
    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function SmileIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function UserCircleIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
}
function KeyIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
    </svg>
  )
}
function TelegramIcon({ white }: { white?: boolean }) {
  return (
    <svg className={`w-4 h-4 flex-shrink-0 ${white ? 'text-white' : 'text-gray-400'}`} fill="currentColor" viewBox="0 0 24 24">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
    </svg>
  )
}
function LogoutIcon() {
  return (
    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  )
}
