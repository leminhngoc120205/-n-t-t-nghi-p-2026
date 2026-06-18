'use client'

import React, { useState, useEffect } from 'react'
import ArticleDetailModal, { type QuickTaskItem } from './ArticleDetailModal'

const TASKS: QuickTaskItem[] = [
  {
    id: 1,
    title: 'Cẩm Fix các vấn đề rà soát Quiz',
    timeAgo: '20 ngày trước',
    author: 'camnv_vcc',
    type: 'quiz',
    status: 'editing',
    category: 'Công nghệ',
  },
  {
    id: 2,
    title: 'Đánh giá điện thoại RedMagic 10 Pro Max Gaming',
    timeAgo: '20 ngày trước',
    author: 'techwriter_vcc',
    type: 'review',
    status: 'editing',
    category: 'Công nghệ',
  },
  {
    id: 3,
    title: 'Xu hướng AI trong báo chí số năm 2025',
    timeAgo: '3 ngày trước',
    author: 'aingoc_vcc',
    editor: 'chiefed_vcc',
    type: 'article',
    status: 'publishing',
    category: 'Công nghệ',
  },
  {
    id: 4,
    title: 'Phân tích thị trường bất động sản Q1/2025',
    timeAgo: '5 ngày trước',
    author: 'reporter_vcc',
    editor: 'editor_vcc',
    type: 'analysis',
    status: 'returned',
    category: 'Kinh tế',
  },
]

const GROUPS = [
  { key: 'editing'    as const, label: 'Bài chờ biên tập',          color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { key: 'publishing' as const, label: 'Bài chờ xuất bản',          color: 'text-green-600  bg-green-50  border-green-200'  },
  { key: 'returned'   as const, label: 'Bài bị trả lại biên tập',   color: 'text-red-600    bg-red-50    border-red-200'    },
]

interface Props {
  onClose: () => void
}

export default function QuickTaskPanel({ onClose }: Props) {
  const [visible, setVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<QuickTaskItem | null>(null)

  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const grouped = {
    editing:    TASKS.filter(t => t.status === 'editing'),
    publishing: TASKS.filter(t => t.status === 'publishing'),
    returned:   TASKS.filter(t => t.status === 'returned'),
  }

  const totalCount = TASKS.length

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        style={{ left: 56 }}
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className="fixed top-0 z-40 h-screen bg-white shadow-2xl flex flex-col"
        style={{
          left: 56,
          width: 360,
          transform: visible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#2c3347] text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <span className="text-sm font-bold tracking-wide uppercase">Xử lý việc nhanh</span>
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{totalCount}</span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-gray-300 hover:text-white text-lg transition-colors"
          >
            ×
          </button>
        </div>

        {/* Task groups */}
        <div className="flex-1 overflow-y-auto">
          {GROUPS.map(group => {
            const tasks = grouped[group.key]
            if (tasks.length === 0) return null
            return (
              <div key={group.key} className="border-b border-gray-100">
                {/* Group header */}
                <div className={`flex items-center gap-2 px-4 py-2.5 border-b ${group.color.split(' ').filter(c => c.includes('border')).join(' ')} bg-gray-50`}>
                  <span className={`text-xs font-bold uppercase tracking-wide ${group.color.split(' ').filter(c => c.includes('text')).join(' ')}`}>
                    {group.label}
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${group.color}`}>
                    {tasks.length}
                  </span>
                </div>

                {/* Task items */}
                {tasks.map(task => (
                  <button
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="w-full text-left px-4 py-3 hover:bg-[#e8f7f9] transition-colors border-b border-gray-50 group"
                  >
                    <div className="flex items-start gap-2.5">
                      {/* Avatar */}
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#138496] flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{task.author[0].toUpperCase()}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-[#17a2b8] transition-colors line-clamp-2 mb-1">
                          {task.title}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-400">
                          <span className="flex items-center gap-0.5">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            {task.timeAgo}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5 text-[#17a2b8] font-medium">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            {task.author}
                          </span>
                          {task.editor && (
                            <>
                              <span>·</span>
                              <span className="flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                {task.editor}
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Chevron */}
                      <svg className="w-4 h-4 text-gray-300 group-hover:text-[#17a2b8] flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </button>
                ))}
              </div>
            )
          })}

          {/* Empty state */}
          {totalCount === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-gray-300">
              <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm font-medium">Không có việc cần xử lý</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2.5 bg-gray-50 flex-shrink-0 text-center">
          <p className="text-[11px] text-gray-400">Tổng cộng <strong className="text-gray-600">{totalCount}</strong> công việc cần xử lý</p>
        </div>
      </div>

      {/* Article detail modal */}
      {selectedTask && (
        <ArticleDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </>
  )
}
