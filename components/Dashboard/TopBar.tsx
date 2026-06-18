'use client'

import React from 'react'

interface TopBarProps {
  onMenuToggle: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export const TopBar: React.FC<TopBarProps> = ({
  onMenuToggle,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="h-16 bg-editorial-white border-b border-editorial-gray-medium px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left Side - Menu & Search */}
      <div className="flex items-center gap-6 flex-1">
        {/* Menu Button */}
        <button
          onClick={onMenuToggle}
          className="
            md:hidden text-editorial-dark hover:bg-editorial-light
            p-2 rounded-lg transition-colors
          "
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search Bar */}
        <div className="hidden sm:flex items-center flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search articles, templates..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="
                w-full px-4 py-2 text-sm rounded-lg
                border border-editorial-gray-medium bg-editorial-light
                text-editorial-dark placeholder-editorial-gray-slate
                focus:outline-none focus:border-editorial-blue
                focus:ring-2 focus:ring-offset-0 focus:ring-blue-100
                transition-all duration-200
              "
            />
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-editorial-gray-slate"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Side - Actions */}
      <div className="flex items-center gap-4">
        {/* New Article Button */}
        <button
          className="
            hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg
            bg-editorial-blue text-white font-medium text-sm
            hover:bg-editorial-blue-dark transition-colors
          "
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Article
        </button>

        {/* Notifications */}
        <button
          className="
            relative text-editorial-dark hover:bg-editorial-light
            p-2 rounded-lg transition-colors
          "
          aria-label="Notifications"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
            />
          </svg>
          <span className="absolute top-1 right-1 w-2 h-2 bg-editorial-gold rounded-full" />
        </button>

        {/* User Menu */}
        <button
          className="
            text-editorial-dark hover:bg-editorial-light
            p-2 rounded-lg transition-colors
          "
          aria-label="User menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>
      </div>
    </div>
  )
}
