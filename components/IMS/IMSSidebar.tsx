'use client'

import React, { useState } from 'react'
import { IMSArticleTypeModal } from './IMSArticleTypeModal'
import QuickTaskPanel from './QuickTaskPanel'

const TASK_COUNT = 4

export const IMSSidebar = () => {
  const [showModal, setShowModal] = useState(false)
  const [showQuickTask, setShowQuickTask] = useState(false)

  return (
    <>
      <aside className="fixed left-0 top-0 w-14 h-screen bg-[#2c3347] flex flex-col items-center py-0 gap-2 z-50 shadow-lg">
        {/* VIẾT BÀI MỚI Button */}
        <button
          onClick={() => setShowModal(true)}
          title="Viết bài mới"
          className="flex flex-col items-center justify-center w-full px-1 py-3 hover:bg-white/15 transition-colors border-b border-white/10 group"
        >
          <svg
            className="w-5 h-5 text-[#17c3d8] group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          <span className="text-[7px] text-[#17c3d8] font-bold text-center leading-tight mt-1 tracking-tight">
            VIẾT<br />BÀI MỚI
          </span>
        </button>

        {/* Bell with notification badge */}
        <button
          onClick={() => setShowQuickTask(prev => !prev)}
          title="Xử lý việc nhanh"
          className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors group ${
            showQuickTask ? 'bg-white/20' : 'hover:bg-white/10'
          }`}
        >
          <svg
            className={`w-5 h-5 transition-colors ${showQuickTask ? 'text-orange-400' : 'text-gray-300 group-hover:text-white'}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {TASK_COUNT > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold px-0.5 leading-none">
              {TASK_COUNT}
            </span>
          )}
        </button>

      </aside>

      {showModal && <IMSArticleTypeModal onClose={() => setShowModal(false)} />}
      {showQuickTask && <QuickTaskPanel onClose={() => setShowQuickTask(false)} />}
    </>
  )
}
