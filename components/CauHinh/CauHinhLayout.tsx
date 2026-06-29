'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

const sidebarItems = [
  { href: '/cau-hinh/nguoi-dung',   label: 'Quản lý người dùng',       disabled: false },
  { href: '/cau-hinh/dong-su-kien', label: 'Quản lý dòng sự kiện',     disabled: false },
  { href: '/cau-hinh/tac-gia',      label: 'Quản lý profile tác giả',  disabled: false },
  { href: '/cau-hinh/chu-de',       label: 'Quản lý chủ đề',           disabled: false },
]

export default function CauHinhLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />
        <main className="flex-1 flex overflow-hidden">
          {/* Left sidebar QUẢN LÝ */}
          <aside className="w-64 min-w-[256px] bg-white border-r border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">QUẢN LÝ</h2>
            </div>
            <nav className="flex-1 py-1">
              {sidebarItems.map((item, idx) => {
                const isActive = !item.disabled && pathname?.startsWith(item.href)
                return (
                  <Link
                    key={idx}
                    href={item.disabled ? '#' : item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-[13px] transition-colors ${
                      isActive
                        ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-l-[3px] border-[#17a2b8]'
                        : item.disabled
                        ? 'text-gray-350 cursor-not-allowed border-l-[3px] border-transparent opacity-50'
                        : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                    }`}
                    onClick={e => item.disabled && e.preventDefault()}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
