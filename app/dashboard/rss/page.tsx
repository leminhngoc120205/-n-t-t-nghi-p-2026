'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

/* ─── types ─── */
type Feed = {
  _id: string
  name: string
  url: string
  categoryId?: { _id: string; name: string } | null
  lastImported: string | null
  importCount: number
  isActive: boolean
  createdAt: string
}

type ImportResult = {
  totalNew: number
  totalSkipped: number
  imported: { feedName: string; count: number }[]
  errors: string[]
}

/* ─── RSS feed presets for Vietnamese news ─── */
const PRESETS = [
  { name: 'VnExpress - Tin mới nhất',  url: 'https://vnexpress.net/rss/tin-muc-moi-nhat.rss' },
  { name: 'VnExpress - Thời sự',       url: 'https://vnexpress.net/rss/thoi-su.rss' },
  { name: 'VnExpress - Kinh doanh',    url: 'https://vnexpress.net/rss/kinh-doanh.rss' },
  { name: 'VnExpress - Thế giới',      url: 'https://vnexpress.net/rss/the-gioi.rss' },
  { name: 'VnExpress - Thể thao',      url: 'https://vnexpress.net/rss/the-thao.rss' },
  { name: 'VnExpress - Công nghệ',     url: 'https://vnexpress.net/rss/khoa-hoc-cong-nghe.rss' },
  { name: 'Tuổi Trẻ - Tin mới nhất',  url: 'https://tuoitre.vn/rss/tin-muc-moi-nhat.rss' },
  { name: 'Tuổi Trẻ - Thời sự',       url: 'https://tuoitre.vn/rss/thoi-su.rss' },
  { name: 'Tuổi Trẻ - Kinh tế',       url: 'https://tuoitre.vn/rss/kinh-te.rss' },
  { name: 'Tuổi Trẻ - Thể thao',      url: 'https://tuoitre.vn/rss/the-thao.rss' },
  { name: 'Thanh Niên - Tin mới nhất', url: 'https://thanhnien.vn/rss/home.rss' },
  { name: 'Dân Trí - Tin mới nhất',   url: 'https://dantri.com.vn/rss/home.rss' },
  { name: 'Zing News - Tin mới nhất', url: 'https://zingnews.vn/tin-muc-moi-nhat.rss' },
]

function fmtDate(iso: string | null) {
  if (!iso) return 'Chưa import'
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/* ─── main page ─── */
export default function RSSPage() {
  const [feeds, setFeeds]             = useState<Feed[]>([])
  const [loading, setLoading]         = useState(true)
  const [importing, setImporting]     = useState<string | null>(null)
  const [importAll, setImportAll]     = useState(false)
  const [result, setResult]           = useState<ImportResult | null>(null)
  const [showForm, setShowForm]       = useState(false)

  /* form state */
  const [formName, setFormName]       = useState('')
  const [formUrl, setFormUrl]         = useState('')
  const [formPreset, setFormPreset]   = useState('')
  const [saving, setSaving]           = useState(false)
  const [formErr, setFormErr]         = useState('')

  /* ── fetch feeds ── */
  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/rss/feeds')
      const data = await res.json()
      if (data.ok) setFeeds(data.data)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { load() }, [load])

  /* ── add feed ── */
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setFormErr('')
    if (!formName.trim()) return setFormErr('Tên không được để trống.')
    if (!formUrl.trim())  return setFormErr('URL không được để trống.')

    setSaving(true)
    try {
      const res  = await fetch('/api/rss/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, url: formUrl }),
      })
      const data = await res.json()
      if (!data.ok) { setFormErr(data.error ?? 'Lỗi không xác định.'); return }
      setFormName(''); setFormUrl(''); setFormPreset(''); setShowForm(false)
      await load()
    } finally { setSaving(false) }
  }

  /* ── toggle active ── */
  async function toggleActive(feed: Feed) {
    await fetch(`/api/rss/feeds/${feed._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !feed.isActive }),
    })
    await load()
  }

  /* ── delete ── */
  async function handleDelete(feed: Feed) {
    if (!confirm(`Xóa feed "${feed.name}"?`)) return
    await fetch(`/api/rss/feeds/${feed._id}`, { method: 'DELETE' })
    await load()
  }

  /* ── import one ── */
  async function handleImport(feedId: string) {
    setImporting(feedId)
    setResult(null)
    try {
      const res  = await fetch('/api/rss/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedId }),
      })
      const data = await res.json()
      if (data.ok) setResult(data.data)
      await load()
    } finally { setImporting(null) }
  }

  /* ── import all ── */
  async function handleImportAll() {
    setImportAll(true)
    setResult(null)
    try {
      const res  = await fetch('/api/rss/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      const data = await res.json()
      if (data.ok) setResult(data.data)
      await load()
    } finally { setImportAll(false) }
  }

  /* ── preset picker ── */
  function applyPreset(val: string) {
    setFormPreset(val)
    const p = PRESETS.find(x => x.url === val)
    if (p) { setFormName(p.name); setFormUrl(p.url) }
  }

  const activeCount = feeds.filter(f => f.isActive).length

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <IMSSidebar />
      <div className="ml-14 flex flex-col flex-1 overflow-hidden">
        <IMSTopBar />
        <main className="flex-1 overflow-y-auto p-6">

          {/* ── header ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-lg font-bold text-gray-800">Quản lý RSS Feed</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Tự động kéo bài viết từ báo ngoài về hệ thống
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleImportAll}
                disabled={importAll || activeCount === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-white transition-colors disabled:opacity-40"
                style={{ background: '#17a2b8' }}
              >
                {importAll ? (
                  <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                )}
                Import tất cả ({activeCount} feed)
              </button>
              <button
                onClick={() => { setShowForm(v => !v); setFormErr('') }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Thêm feed
              </button>
            </div>
          </div>

          {/* ── add form ── */}
          {showForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 mb-5 shadow-sm">
              <h2 className="text-sm font-bold text-gray-700 mb-4">Thêm RSS Feed mới</h2>
              <form onSubmit={handleAdd} className="space-y-3">
                {/* preset picker */}
                <div>
                  <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Chọn nhanh từ báo phổ biến (tuỳ chọn)
                  </label>
                  <select
                    value={formPreset}
                    onChange={e => applyPreset(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]"
                  >
                    <option value="">-- Chọn preset hoặc tự điền --</option>
                    {PRESETS.map(p => (
                      <option key={p.url} value={p.url}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      Tên hiển thị <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={e => setFormName(e.target.value)}
                      placeholder="VnExpress - Thời sự"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 uppercase tracking-wide mb-1">
                      URL RSS Feed <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="url"
                      value={formUrl}
                      onChange={e => setFormUrl(e.target.value)}
                      placeholder="https://vnexpress.net/rss/thoi-su.rss"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#17a2b8]"
                    />
                  </div>
                </div>

                {formErr && <p className="text-xs text-red-500">{formErr}</p>}

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-40"
                    style={{ background: '#17a2b8' }}
                  >
                    {saving ? 'Đang lưu...' : 'Lưu feed'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowForm(false); setFormErr('') }}
                    className="px-4 py-2 rounded-lg text-xs font-semibold border border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Huỷ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── import result ── */}
          {result && (
            <div className="mb-5 rounded-lg border px-5 py-4 text-xs"
              style={{ background: result.errors.length ? '#fff7ed' : '#f0fbfc', borderColor: result.errors.length ? '#fed7aa' : '#b2e8ef' }}>
              <div className="flex items-center gap-4 font-semibold mb-2" style={{ color: result.errors.length ? '#c2410c' : '#0e7490' }}>
                <span>✅ Bài mới: {result.totalNew}</span>
                <span>⏭ Đã có sẵn: {result.totalSkipped}</span>
                {result.errors.length > 0 && <span>❌ Lỗi: {result.errors.length} feed</span>}
              </div>
              {result.imported.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {result.imported.map((r, i) => (
                    <span key={i} className="bg-white border border-[#b2e8ef] rounded px-2 py-0.5 text-[#0e7490]">
                      {r.feedName}: +{r.count}
                    </span>
                  ))}
                </div>
              )}
              {result.errors.map((e, i) => (
                <p key={i} className="text-red-600 mt-1">{e}</p>
              ))}
            </div>
          )}

          {/* ── feeds table ── */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {loading ? (
              <div className="py-12 text-center text-xs text-gray-400">Đang tải...</div>
            ) : feeds.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-gray-500 mb-1">Chưa có RSS feed nào.</p>
                <p className="text-xs text-gray-400">Nhấn "Thêm feed" để bắt đầu kéo tin từ các báo.</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left px-5 py-3 text-gray-500 font-semibold">Tên feed</th>
                    <th className="text-left px-4 py-3 text-gray-500 font-semibold">URL</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold whitespace-nowrap">Lần cuối import</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold whitespace-nowrap">Tổng bài</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold">Trạng thái</th>
                    <th className="text-center px-4 py-3 text-gray-500 font-semibold">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {feeds.map(feed => (
                    <tr key={feed._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-800">{feed.name}</td>
                      <td className="px-4 py-3 text-gray-400 max-w-[240px]">
                        <a href={feed.url} target="_blank" rel="noopener noreferrer"
                          className="hover:text-[#17a2b8] truncate block" title={feed.url}>
                          {feed.url}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500 whitespace-nowrap">
                        {fmtDate(feed.lastImported)}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold text-gray-700 tabular-nums">
                        {feed.importCount.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button onClick={() => toggleActive(feed)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${feed.isActive ? 'bg-[#17a2b8]' : 'bg-gray-300'}`}>
                          <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${feed.isActive ? 'translate-x-4' : 'translate-x-0.5'}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleImport(feed._id)}
                            disabled={importing === feed._id || importAll}
                            title="Import bài từ feed này"
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded text-[11px] font-semibold text-white disabled:opacity-40 transition-opacity"
                            style={{ background: '#17a2b8' }}
                          >
                            {importing === feed._id ? (
                              <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="30 70" />
                              </svg>
                            ) : (
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                              </svg>
                            )}
                            Import
                          </button>
                          <button
                            onClick={() => handleDelete(feed)}
                            title="Xóa feed"
                            className="flex items-center justify-center w-7 h-7 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── info box ── */}
          <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 px-5 py-4 text-xs text-blue-700">
            <p className="font-semibold mb-1">Cách hoạt động</p>
            <ul className="space-y-1 text-blue-600 list-disc list-inside">
              <li>Nhấn <strong>Import</strong> để kéo tối đa 30 bài mới nhất từ feed đó vào hệ thống.</li>
              <li>Bài đã tồn tại (trùng URL nguồn) sẽ được bỏ qua, không tạo bản trùng.</li>
              <li>Bài được import có trạng thái <strong>Đã xuất bản</strong> và link "Đọc bài gốc" trỏ về báo nguồn.</li>
              <li>Tắt toggle để tạm dừng feed mà không cần xóa.</li>
            </ul>
          </div>

        </main>
      </div>
    </div>
  )
}
