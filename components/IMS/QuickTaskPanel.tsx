'use client'

import React, { useState, useEffect, useCallback } from 'react'
import ArticleDetailModal, { type QuickTaskItem } from './ArticleDetailModal'

/* ── helpers ─────────────────────────────────────────── */
function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)  return 'vừa xong'
  if (hours < 1)  return `${mins} phút trước`
  if (days  < 1)  return `${hours} giờ trước`
  if (days  < 30) return `${days} ngày trước`
  return `${Math.floor(days / 30)} tháng trước`
}

function toTask(art: any, status: QuickTaskItem['status']): QuickTaskItem {
  return {
    id:       art._id,
    title:    art.title,
    timeAgo:  timeAgo(art.updatedAt ?? art.createdAt),
    author:   art.writerId?.username ?? art.writerId?.fullName ?? '—',
    editor:   art.editorId?.username ?? undefined,
    type:     'article',
    status,
    category: art.categoryId?.name ?? undefined,
  }
}

const GROUPS: { key: QuickTaskItem['status']; label: string; color: string }[] = [
  { key: 'editing',    label: 'Bài chờ biên tập',        color: 'text-yellow-600 bg-yellow-50 border-yellow-200' },
  { key: 'publishing', label: 'Bài chờ xuất bản',        color: 'text-green-600  bg-green-50  border-green-200'  },
  { key: 'returned',   label: 'Bài bị trả lại biên tập', color: 'text-red-600    bg-red-50    border-red-200'    },
]

/* ── component ───────────────────────────────────────── */
export default function QuickTaskPanel({ onClose }: { onClose: () => void }) {
  const [visible,      setVisible]      = useState(false)
  const [tasks,        setTasks]        = useState<QuickTaskItem[]>([])
  const [loading,      setLoading]      = useState(true)
  const [selectedTask, setSelectedTask] = useState<QuickTaskItem | null>(null)

  /* slide-in animation */
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(id)
  }, [])

  /* fetch tasks based on user role */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [r1, r2, r3] = await Promise.all([
        fetch('/api/articles?status=waiting_edit&limit=20').then(r => r.json()),
        fetch('/api/articles?status=waiting_publish&limit=20').then(r => r.json()),
        fetch('/api/articles?status=returned&limit=20').then(r => r.json()),
      ])
      const all: QuickTaskItem[] = [
        ...(r1.ok ? (r1.data as any[]).map(a => toTask(a, 'editing'))    : []),
        ...(r2.ok ? (r2.data as any[]).map(a => toTask(a, 'publishing')) : []),
        ...(r3.ok ? (r3.data as any[]).map(a => toTask(a, 'returned'))   : []),
      ]
      setTasks(all)
    } catch { /* giữ state rỗng */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  const grouped = {
    editing:    tasks.filter(t => t.status === 'editing'),
    publishing: tasks.filter(t => t.status === 'publishing'),
    returned:   tasks.filter(t => t.status === 'returned'),
  }
  const totalCount = tasks.length

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/30" style={{ left: 56 }} onClick={onClose}/>

      {/* Slide-in panel */}
      <div
        className="fixed top-0 z-40 h-screen bg-white shadow-2xl flex flex-col"
        style={{
          left: 56, width: 360,
          transform: visible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#2c3347] text-white flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span className="text-sm font-bold tracking-wide uppercase">Xử lý việc nhanh</span>
            <span className="bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {loading ? '…' : totalCount}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <button onClick={load} title="Làm mới"
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-gray-300 hover:text-white transition-colors text-sm">
              ↻
            </button>
            <button onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 text-gray-300 hover:text-white text-lg transition-colors">
              ×
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32 text-sm text-gray-400">Đang tải...</div>
          ) : (
            <>
              {GROUPS.map(group => {
                const items = grouped[group.key]
                if (items.length === 0) return null
                return (
                  <div key={group.key} className="border-b border-gray-100">
                    <div className={`flex items-center gap-2 px-4 py-2.5 border-b bg-gray-50 ${group.color.split(' ').filter(c => c.startsWith('border')).join(' ')}`}>
                      <span className={`text-xs font-bold uppercase tracking-wide ${group.color.split(' ').filter(c => c.startsWith('text')).join(' ')}`}>
                        {group.label}
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${group.color}`}>
                        {items.length}
                      </span>
                    </div>

                    {items.map(task => (
                      <button key={String(task.id)} onClick={() => setSelectedTask(task)}
                        className="w-full text-left px-4 py-3 hover:bg-[#e8f7f9] transition-colors border-b border-gray-50 group">
                        <div className="flex items-start gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#17c3d8] to-[#138496] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">{task.author[0].toUpperCase()}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 leading-snug group-hover:text-[#17a2b8] transition-colors line-clamp-2 mb-1">
                              {task.title}
                            </p>
                            <div className="flex items-center flex-wrap gap-x-2 gap-y-0.5 text-[11px] text-gray-400">
                              <span className="flex items-center gap-0.5">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                </svg>
                                {task.timeAgo}
                              </span>
                              <span>·</span>
                              <span className="flex items-center gap-0.5 text-[#17a2b8] font-medium">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                {task.author}
                              </span>
                              {task.editor && (
                                <>
                                  <span>·</span>
                                  <span className="flex items-center gap-0.5">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                    </svg>
                                    {task.editor}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-gray-300 group-hover:text-[#17a2b8] flex-shrink-0 mt-1 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })}

              {totalCount === 0 && (
                <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                  <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <p className="text-sm font-medium">Không có việc cần xử lý</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-4 py-2.5 bg-gray-50 flex-shrink-0 text-center">
          <p className="text-[11px] text-gray-400">
            Tổng cộng <strong className="text-gray-600">{loading ? '…' : totalCount}</strong> công việc cần xử lý
          </p>
        </div>
      </div>

      {selectedTask && (
        <ArticleDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onRefresh={load}
        />
      )}
    </>
  )
}
