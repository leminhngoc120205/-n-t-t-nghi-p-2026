'use client'

import React, { useState, useEffect, useCallback } from 'react'

export interface QuickTaskItem {
  id: string
  title: string
  timeAgo: string
  author: string
  editor?: string
  type?: string
  status: 'editing' | 'publishing' | 'returned'
  category?: string
}

interface Props {
  task: QuickTaskItem
  onClose: () => void
  onRefresh?: () => void
}

/* ── status helpers ──────────────────────────────────── */
const STATUS_MAP = {
  editing:    { label: 'Chờ biên tập', cls: 'bg-yellow-100 text-yellow-700' },
  publishing: { label: 'Chờ xuất bản', cls: 'bg-green-100  text-green-700'  },
  returned:   { label: 'Bị trả lại',   cls: 'bg-red-100    text-red-600'    },
} as const

const ARTICLE_TYPE_MAP: Record<string, string> = {
  size_s:         'Tin ngắn',
  size_m:         'Bài viết thông thường',
  size_l:         'Bài viết dài',
  magazine:       'Magazine',
  big_story:      'Big Story',
  video_autoplay: 'Video tự phát',
  livestream:     'Livestream',
  wiki_how:       'Hướng dẫn',
}

/* ── sub-components ──────────────────────────────────── */
function StatusBadge({ status }: { status: QuickTaskItem['status'] }) {
  const s = STATUS_MAP[status]
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
}

function MetaRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-gray-200 pb-3">
      <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      {children}
    </div>
  )
}

/* ── main component ──────────────────────────────────── */
export default function ArticleDetailModal({ task, onClose, onRefresh }: Props) {
  const [showHistory, setShowHistory] = useState(false)
  const [article,     setArticle]     = useState<any>(null)
  const [logs,        setLogs]        = useState<any[]>([])
  const [loadingArt,  setLoadingArt]  = useState(true)
  const [loadingLog,  setLoadingLog]  = useState(false)
  const [acting,      setActing]      = useState(false)
  const [toast,       setToast]       = useState<{ msg: string; type: 'ok'|'err' } | null>(null)
  const [done,        setDone]        = useState<'received'|'returned'|null>(null)

  /* fetch article content */
  useEffect(() => {
    setLoadingArt(true)
    fetch(`/api/articles/${task.id}`)
      .then(r => r.json())
      .then(d => { if (d.ok) setArticle(d.data) })
      .catch(() => {})
      .finally(() => setLoadingArt(false))
  }, [task.id])

  /* fetch logs when history panel opens */
  useEffect(() => {
    if (!showHistory) return
    setLoadingLog(true)
    fetch(`/api/logs?objectType=article`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          const filtered = d.data.filter((l: any) => l.objectId === task.id)
          setLogs(filtered)
        }
      })
      .catch(() => {})
      .finally(() => setLoadingLog(false))
  }, [showHistory, task.id])

  const showToast = (msg: string, type: 'ok'|'err') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  /* transition action */
  const doTransition = useCallback(async (to: string, label: string) => {
    setActing(true)
    try {
      const res = await fetch(`/api/articles/${task.id}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to }),
      })
      const d = await res.json()
      if (d.ok) {
        setDone(to === 'returned' ? 'returned' : 'received')
        showToast(`${label} thành công!`, 'ok')
        onRefresh?.()
        setTimeout(onClose, 1800)
      } else {
        showToast(d.error || 'Lỗi thao tác', 'err')
      }
    } catch {
      showToast('Lỗi kết nối', 'err')
    } finally {
      setActing(false)
    }
  }, [task.id, onClose, onRefresh])

  const a = article
  const artTypeLabel = a?.articleType ? (ARTICLE_TYPE_MAP[a.articleType] ?? a.articleType) : (task.type ?? '—')
  const writer    = a?.writerId?.username    ?? task.author
  const editor    = a?.editorId?.username    ?? task.editor ?? null
  const publisher = a?.publisherId?.username ?? null
  const category  = a?.categoryId?.name     ?? task.category ?? '—'
  const createdAt = a?.createdAt ? new Date(a.createdAt).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  }) : task.timeAgo

  /* next-state mapping */
  const nextStatus = task.status === 'editing' ? 'waiting_publish' : task.status === 'publishing' ? 'published' : null
  const nextLabel  = task.status === 'editing' ? 'Chuyển xuất bản' : 'Xuất bản'

  return (
    <div className="fixed inset-0 z-[200] flex items-stretch">
      <div className="absolute inset-0 bg-black/60" onClick={onClose}/>

      <div className="relative z-10 flex flex-col bg-white w-[95vw] max-w-[1100px] mx-auto my-4 rounded-xl shadow-2xl overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <StatusBadge status={task.status}/>
            <h2 className="font-bold text-gray-800 text-sm truncate max-w-lg">{task.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHistory(p => !p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md border transition-colors
                ${showHistory ? 'bg-[#17a2b8] text-white border-[#17a2b8]' : 'border-gray-300 text-gray-600 hover:bg-gray-100'}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Xem lịch sử
            </button>
            <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-200 text-gray-500 text-lg transition-colors ml-1">×</button>
          </div>
        </div>

        {/* History panel */}
        {showHistory && (
          <div className="border-b border-gray-200 bg-yellow-50 px-5 py-3 flex-shrink-0">
            <h3 className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-2">Lịch sử hành động</h3>
            {loadingLog ? (
              <p className="text-xs text-gray-400">Đang tải...</p>
            ) : logs.length === 0 ? (
              <p className="text-xs text-gray-400">Chưa có log hành động.</p>
            ) : (
              <div className="flex gap-5 overflow-x-auto pb-1">
                {logs.map((l, i) => (
                  <div key={i} className="flex items-center gap-2 flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-[#17a2b8] flex items-center justify-center text-white text-[10px] font-bold">{i + 1}</div>
                    <div>
                      <p className="text-xs font-semibold text-gray-700">{l.actionType}</p>
                      <p className="text-[10px] text-gray-400">
                        {l.userId} · {new Date(l.createdAt).toLocaleString('vi-VN', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'})}
                      </p>
                    </div>
                    {i < logs.length - 1 && <div className="w-8 h-px bg-gray-300 ml-1"/>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-1 overflow-hidden min-h-0">

          {/* Article content */}
          <div className="flex-1 overflow-y-auto p-6 border-r border-gray-200">
            {loadingArt ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Đang tải bài viết...</div>
            ) : !a ? (
              <div className="flex items-center justify-center h-48 text-gray-400 text-sm">Không tải được nội dung.</div>
            ) : (
              <>
                <h1 className="text-xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Lora, serif' }}>{a.title}</h1>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
                  <span className="text-[#17a2b8] font-medium">@{writer}</span>
                  {editor && <><span>·</span><span>Biên tập: @{editor}</span></>}
                  <span>·</span><span>{createdAt}</span>
                </div>
                {a.thumbnail ? (
                  <img src={a.thumbnail} alt="" className="w-full max-h-56 object-cover rounded-lg mb-5 bg-gray-100"/>
                ) : (
                  <div className="w-full h-40 bg-gray-100 rounded-xl mb-5 flex items-center justify-center text-gray-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
                {a.sapo && (
                  <p className="text-sm font-semibold text-gray-700 leading-relaxed mb-4 p-3 bg-gray-50 border-l-4 border-[#17a2b8] rounded-r">
                    {a.sapo}
                  </p>
                )}
                <div
                  className="text-sm text-gray-700 leading-relaxed article-content"
                  dangerouslySetInnerHTML={{ __html: a.content || '<p class="text-gray-400 italic">Bài viết chưa có nội dung.</p>' }}
                />
                {a.source && <p className="mt-5 text-xs text-gray-400 italic border-t border-gray-100 pt-3">Nguồn: {a.source}</p>}
              </>
            )}
          </div>

          {/* Sidebar metadata */}
          <div className="w-72 flex-shrink-0 overflow-y-auto p-5 bg-gray-50">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <MetaRow label="Ảnh đại diện">
                {a?.thumbnail ? (
                  <img src={a.thumbnail} alt="" className="w-16 h-11 object-cover rounded-lg bg-gray-200"/>
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                )}
              </MetaRow>
              <MetaRow label="Dạng bài">
                <span className="text-sm text-gray-700">{artTypeLabel}</span>
              </MetaRow>
              <MetaRow label="Tác giả">
                <span className="text-sm font-medium text-[#17a2b8]">@{writer}</span>
              </MetaRow>
              <MetaRow label="Biên tập viên">
                {editor
                  ? <span className="text-sm font-medium text-[#17a2b8]">@{editor}</span>
                  : <span className="text-sm text-gray-400 italic">Không có dữ liệu</span>}
              </MetaRow>
              {publisher && (
                <MetaRow label="Xuất bản bởi">
                  <span className="text-sm font-medium text-[#17a2b8]">@{publisher}</span>
                </MetaRow>
              )}
              <MetaRow label="Chuyên mục">
                <span className="text-sm text-gray-700">{category}</span>
              </MetaRow>
              <MetaRow label="Nguồn tin">
                {a?.source
                  ? <span className="text-sm text-gray-700">{a.source}</span>
                  : <span className="text-sm text-gray-400 italic">Không có dữ liệu</span>}
              </MetaRow>
              <MetaRow label="Ngày tạo">
                <span className="text-sm text-gray-700">{createdAt}</span>
              </MetaRow>
              <MetaRow label="Trạng thái">
                <StatusBadge status={task.status}/>
              </MetaRow>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <div className="text-xs text-gray-400">Lần cập nhật cuối: {createdAt}</div>
          <div className="flex items-center gap-2">
            <button onClick={onClose}
              className="px-4 py-2 text-sm font-semibold border border-gray-300 rounded-md hover:bg-gray-100 transition-colors tracking-wide">
              ĐÓNG
            </button>

            {/* SỬA — mở editor */}
            <button
              onClick={() => { window.open(`/dashboard/viet-bai-moi?id=${task.id}`, '_self') }}
              className="px-4 py-2 text-sm font-semibold border border-[#17a2b8] text-[#17a2b8] rounded-md hover:bg-[#e8f7f9] transition-colors tracking-wide"
            >
              SỬA
            </button>

            {/* NHẬN — chuyển trạng thái tiếp theo */}
            {nextStatus && task.status !== 'returned' && (
              done === 'received'
                ? <button className="px-4 py-2 text-sm font-semibold bg-green-500 text-white rounded-md cursor-default tracking-wide flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                    ĐÃ NHẬN
                  </button>
                : <button
                    onClick={() => doTransition(nextStatus, nextLabel)}
                    disabled={acting}
                    className="px-4 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] transition-colors tracking-wide disabled:opacity-50"
                  >
                    {acting ? '...' : 'NHẬN'}
                  </button>
            )}

            {/* TRẢ LẠI */}
            {task.status !== 'returned' && (
              done === 'returned'
                ? <button className="px-4 py-2 text-sm font-semibold bg-orange-400 text-white rounded-md cursor-default tracking-wide flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/></svg>
                    ĐÃ TRẢ LẠI
                  </button>
                : <button
                    onClick={() => doTransition('returned', 'Trả lại')}
                    disabled={acting}
                    className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors tracking-wide disabled:opacity-50"
                  >
                    TRẢ LẠI
                  </button>
            )}
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className={`absolute bottom-16 right-4 flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-xl text-white text-xs font-semibold z-50 transition-all
            ${toast.type === 'ok' ? 'bg-emerald-500' : 'bg-red-500'}`}>
            {toast.type === 'ok'
              ? <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
              : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
            }
            {toast.msg}
          </div>
        )}
      </div>
    </div>
  )
}
