'use client'

import React, { useState } from 'react'

type TabId = 'active' | 'pending' | 'deleted'

interface CrawlerSource {
  id: number
  name: string
  url: string
  category: string
  sourceType: string
  status: 'active' | 'inactive'
  lastCrawled: string
}

const MOCK_SOURCES: CrawlerSource[] = []

const TABS: { id: TabId; label: string }[] = [
  { id: 'active',  label: 'Nguồn dữ liệu theo mục' },
  { id: 'pending', label: 'Nguồn chờ xử lý' },
  { id: 'deleted', label: 'Nguồn đã xoá' },
]

const CATEGORIES = ['Thời sự', 'Thể thao', 'Kinh tế', 'Giải trí', 'Công nghệ', 'Quốc tế']
const SOURCE_TYPES = ['RSS Feed', 'Website', 'API', 'Sitemap']

export default function QuanLyNguonCrawler() {
  const [activeTab, setActiveTab] = useState<TabId>('active')
  const [sources, setSources] = useState<CrawlerSource[]>(MOCK_SOURCES)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [isLoading] = useState(false)
  const [newSource, setNewSource] = useState({ name: '', url: '', category: 'Thời sự', sourceType: 'RSS Feed' })

  const tabCounts: Record<TabId, number> = { active: sources.length, pending: 0, deleted: 0 }

  const filteredSources = sources.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.url.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    const matchCategory = filterCategory === 'all' || s.category === filterCategory
    const matchType = filterType === 'all' || s.sourceType === filterType
    return matchSearch && matchStatus && matchCategory && matchType
  })

  const handleAdd = () => {
    if (!newSource.name.trim() || !newSource.url.trim()) return
    setSources(prev => [...prev, {
      id: Date.now(),
      name: newSource.name,
      url: newSource.url,
      category: newSource.category,
      sourceType: newSource.sourceType,
      status: 'active',
      lastCrawled: 'Chưa crawl',
    }])
    setNewSource({ name: '', url: '', category: 'Thời sự', sourceType: 'RSS Feed' })
    setShowAddModal(false)
  }

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-5">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors relative whitespace-nowrap ${
              activeTab === tab.id
                ? 'text-[#17a2b8] border-b-2 border-[#17a2b8] -mb-px'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${
              activeTab === tab.id ? 'bg-[#17a2b8] text-white' : 'bg-gray-100 text-gray-500'
            }`}>
              {tabCounts[tab.id]}
            </span>
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Đang hoạt động</option>
          <option value="inactive">Dừng hoạt động</option>
        </select>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
        >
          <option value="all">Tất cả chuyên mục</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
        >
          <option value="all">Tất cả loại nguồn</option>
          {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Tìm kiếm nguồn dữ liệu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
          />
          <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#17a2b8] text-white text-sm font-semibold rounded-md hover:bg-[#138496] transition-colors uppercase tracking-wide whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm nguồn dữ liệu
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center gap-3 text-[#17a2b8]">
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <span className="text-sm font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        ) : filteredSources.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg className="w-16 h-16 mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
            </svg>
            <p className="text-sm font-medium mb-1">Chưa có nguồn dữ liệu nào</p>
            <p className="text-xs text-gray-400 mb-4">Bấm "+ Thêm nguồn dữ liệu" để bắt đầu</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-[#17a2b8] text-white text-sm rounded-md hover:bg-[#138496] transition-colors"
            >
              + Thêm nguồn dữ liệu
            </button>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-12">STT</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tên nguồn</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">URL</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Chuyên mục</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Loại</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Trạng thái</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredSources.map((source, idx) => (
                <tr key={source.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{source.name}</td>
                  <td className="px-4 py-3 text-[#17a2b8] text-xs truncate max-w-[200px]">{source.url}</td>
                  <td className="px-4 py-3"><span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">{source.category}</span></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{source.sourceType}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${source.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {source.status === 'active' ? 'Hoạt động' : 'Dừng'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSources(prev => prev.filter(s => s.id !== source.id))}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Source Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[480px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Thêm nguồn dữ liệu mới</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Tên nguồn dữ liệu <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={newSource.name}
                  onChange={e => setNewSource(p => ({ ...p, name: e.target.value }))}
                  placeholder="VD: VnExpress Thời sự"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">URL nguồn <span className="text-red-400">*</span></label>
                <input
                  type="url"
                  value={newSource.url}
                  onChange={e => setNewSource(p => ({ ...p, url: e.target.value }))}
                  placeholder="https://vnexpress.net/rss/tin-moi-nhat.rss"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Chuyên mục</label>
                  <select
                    value={newSource.category}
                    onChange={e => setNewSource(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Loại nguồn</label>
                  <select
                    value={newSource.sourceType}
                    onChange={e => setNewSource(p => ({ ...p, sourceType: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
                  >
                    {SOURCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">Đóng</button>
              <button
                onClick={handleAdd}
                disabled={!newSource.name.trim() || !newSource.url.trim()}
                className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 font-medium"
              >
                Thêm nguồn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
