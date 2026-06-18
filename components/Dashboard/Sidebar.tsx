'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface NavItem {
  label: string
  href: string
  icon: string
  badge?: number
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname()

  const mainNavItems: NavItem[] = [
    { label: 'Dashboard', href: '/dashboard', icon: '📊', badge: 0 },
    { label: 'Articles', href: '/dashboard/articles', icon: '📰' },
    { label: 'Drafts', href: '/dashboard/drafts', icon: '✏️', badge: 3 },
    { label: 'Published', href: '/dashboard/published', icon: '✓', badge: 24 },
    { label: 'Templates', href: '/dashboard/templates', icon: '🎨' },
  ]

  const secondaryNavItems: NavItem[] = [
    { label: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
    { label: 'Collaborators', href: '/dashboard/collaborators', icon: '👥' },
    { label: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static left-0 top-0 h-screen z-50
          w-64 bg-editorial-white border-r border-editorial-gray-medium
          transition-transform duration-300 md:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          overflow-y-auto flex flex-col
        `}
      >
        {/* Logo Section */}
        <div className="p-6 border-b border-editorial-gray-medium">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-editorial-blue to-editorial-gold rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">📰</span>
            </div>
            <div>
              <h1 className="text-lg font-bold font-serif text-editorial-dark">
                Editorial
              </h1>
              <p className="text-xs text-editorial-gray-slate">CMS</p>
            </div>
          </Link>
        </div>

        {/* Primary Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-lg
                  font-medium text-sm transition-all duration-200
                  ${
                    isActive(item.href)
                      ? 'bg-blue-50 text-editorial-blue font-semibold'
                      : 'text-editorial-gray-slate hover:bg-editorial-light text-editorial-dark'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="bg-editorial-gold text-white text-xs font-bold px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* Secondary Navigation */}
        <nav className="px-4 py-4 border-t border-editorial-gray-medium">
          <div className="space-y-1">
            {secondaryNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onClose?.()}
                className="
                  flex items-center gap-3 px-4 py-2 rounded-lg
                  text-sm text-editorial-gray-slate hover:text-editorial-dark
                  hover:bg-editorial-light transition-all duration-200
                "
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-editorial-gray-medium">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-editorial-light transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-editorial-blue to-editorial-gold" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-editorial-dark truncate">
                John Doe
              </p>
              <p className="text-xs text-editorial-gray-slate truncate">
                Editor
              </p>
            </div>
            <button className="text-editorial-gray-slate hover:text-editorial-dark">
              ⋮
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
