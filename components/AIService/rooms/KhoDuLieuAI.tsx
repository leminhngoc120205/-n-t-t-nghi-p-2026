'use client'

import React, { useState } from 'react'

interface DataZone {
  id: number
  name: string
  assistants: number
  totalData: number
  indexedData: number
  deletedData: number
  status: 'active' | 'inactive'
  createdAt: string
}

const DATA_ZONES: DataZone[] = [
  { id: 1,  name: 'Kho văn bản thời sự',        assistants: 3, totalData: 120, indexedData: 115, deletedData: 5,  status: 'active',   createdAt: '10/01/2025' },
  { id: 2,  name: 'Kho tài liệu pháp luật',     assistants: 2, totalData: 89,  indexedData: 85,  deletedData: 4,  status: 'active',   createdAt: '15/01/2025' },
  { id: 3,  name: 'Kho dữ liệu thể thao',       assistants: 1, totalData: 200, indexedData: 195, deletedData: 5,  status: 'inactive', createdAt: '20/01/2025' },
  { id: 4,  name: 'Kho bài viết kinh tế',       assistants: 4, totalData: 345, indexedData: 340, deletedData: 5,  status: 'active',   createdAt: '25/01/2025' },
  { id: 5,  name: 'Kho audio podcast',          assistants: 1, totalData: 67,  indexedData: 60,  deletedData: 7,  status: 'active',   createdAt: '01/02/2025' },
  { id: 6,  name: 'Kho hình ảnh đã xử lý',      assistants: 2, totalData: 150, indexedData: 148, deletedData: 2,  status: 'inactive', createdAt: '05/02/2025' },
  { id: 7,  name: 'Kho video script',           assistants: 3, totalData: 78,  indexedData: 75,  deletedData: 3,  status: 'active',   createdAt: '10/02/2025' },
  { id: 8,  name: 'Kho dữ liệu tổng hợp',       assistants: 5, totalData: 512, indexedData: 503, deletedData: 9,  status: 'active',   createdAt: '15/02/2025' },
  { id: 9,  name: 'Kho bài dịch thuật',         assistants: 2, totalData: 234, indexedData: 230, deletedData: 4,  status: 'active',   createdAt: '20/02/2025' },
  { id: 10, name: 'Kho social media content',   assistants: 6, totalData: 890, indexedData: 876, deletedData: 14, status: 'active',   createdAt: '01/03/2025' },
  { id: 11, name: 'Kho báo cáo phân tích',      assistants: 2, totalData: 45,  indexedData: 43,  deletedData: 2,  status: 'inactive', createdAt: '05/03/2025' },
  { id: 12, name: 'Kho template HTML',          assistants: 1, totalData: 30,  indexedData: 28,  deletedData: 2,  status: 'active',   createdAt: '10/03/2025' },
  { id: 13, name: 'Kho script video ngắn',      assistants: 3, totalData: 156, indexedData: 150, deletedData: 6,  status: 'active',   createdAt: '12/03/2025' },
  { id: 14, name: 'Kho dữ liệu sức khỏe',       assistants: 1, totalData: 98,  indexedData: 95,  deletedData: 3,  status: 'inactive', createdAt: '15/03/2025' },
  { id: 15, name: 'Kho nội dung du lịch',       assistants: 2, totalData: 67,  indexedData: 65,  deletedData: 2,  status: 'active',   createdAt: '18/03/2025' },
  { id: 16, name: 'Kho tổng hợp quốc tế',       assistants: 4, totalData: 432, indexedData: 410, deletedData: 22, status: 'active',   createdAt: '20/03/2025' },
]

const STATS = [
  { label: 'Số trợ lý AI',              value: 0,    color: 'bg-blue-50',   textColor: 'text-blue-600',   borderColor: 'border-blue-200',   icon: '🤖' },
  { label: 'Tổng vùng dữ liệu đã tạo', value: 16,   color: 'bg-purple-50', textColor: 'text-purple-600', borderColor: 'border-purple-200', icon: '📦' },
  { label: 'Dữ liệu đã tạo',           value: 1,    color: 'bg-yellow-50', textColor: 'text-yellow-600', borderColor: 'border-yellow-200', icon: '📄' },
  { label: 'Dữ liệu đang lưu',         value: 0,    color: 'bg-orange-50', textColor: 'text-orange-500', borderColor: 'border-orange-200', icon: '💾' },
  { label: 'Dữ liệu đã được index',    value: 1376, color: 'bg-green-50',  textColor: 'text-green-600',  borderColor: 'border-green-200',  icon: '✅' },
  { label: 'Dữ liệu đã xoá',           value: 25,   color: 'bg-red-50',    textColor: 'text-red-500',    borderColor: 'border-red-200',    icon: '🗑' },
]

export default function KhoDuLieuAI() {
  const [zones, setZones] = useState(DATA_ZONES)
  const [search, setSearch] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newZoneName, setNewZoneName] = useState('')
  const [selectedZone, setSelectedZone] = useState<DataZone | null>(null)

  const filteredZones = zones.filter(z =>
    z.name.toLowerCase().includes(search.toLowerCase())
  )

  const addZone = () => {
    if (!newZoneName.trim()) return
    setZones(prev => [...prev, {
      id: Date.now(),
      name: newZoneName,
      assistants: 0,
      totalData: 0,
      indexedData: 0,
      deletedData: 0,
      status: 'active',
      createdAt: new Date().toLocaleDateString('vi-VN'),
    }])
    setNewZoneName('')
    setShowAddModal(false)
  }

  if (selectedZone) {
    return (
      <div className="p-6">
        {/* Back header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setSelectedZone(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#17a2b8] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>
          <span className="text-gray-300">/</span>
          <h2 className="font-bold text-gray-800">{selectedZone.name}</h2>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Tổng dữ liệu',    value: selectedZone.totalData,   color: 'text-blue-600',  bg: 'bg-blue-50' },
            { label: 'Đã index',         value: selectedZone.indexedData, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Đã xoá',           value: selectedZone.deletedData, color: 'text-red-500',   bg: 'bg-red-50' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-lg p-4 text-center border border-gray-200`}>
              <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
          <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-sm">Chi tiết dữ liệu trong vùng "{selectedZone.name}"</p>
          <p className="text-xs mt-1">Tính năng xem chi tiết đang được phát triển</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Dashboard stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {STATS.map(stat => (
          <div key={stat.label} className={`${stat.color} border ${stat.borderColor} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-600">{stat.label}</span>
              <span className="text-base">{stat.icon}</span>
            </div>
            <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value.toLocaleString()}</div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#17a2b8] text-white text-sm font-medium rounded-md hover:bg-[#138496] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Thêm vùng dữ liệu
        </button>
        <div className="relative flex-1 max-w-xs">
          <input
            type="text"
            placeholder="Tìm kiếm vùng dữ liệu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
          />
          <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <span className="text-sm text-gray-500">{filteredZones.length} vùng</span>
      </div>

      {/* Zones table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-12">STT</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Tên vùng dữ liệu</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Trợ lý AI</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Tổng DL</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Đã index</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-24">Đã xoá</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Trạng thái</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-28">Ngày tạo</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredZones.map((zone, idx) => (
              <tr key={zone.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedZone(zone)}>
                <td className="px-4 py-3 text-gray-500">{idx + 1}</td>
                <td className="px-4 py-3 font-medium text-[#17a2b8] hover:underline">{zone.name}</td>
                <td className="px-4 py-3 text-gray-600">{zone.assistants} trợ lý</td>
                <td className="px-4 py-3 text-gray-700 font-medium">{zone.totalData}</td>
                <td className="px-4 py-3">
                  <span className="text-green-600 font-medium">{zone.indexedData}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-red-400">{zone.deletedData}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${zone.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {zone.status === 'active' ? 'Hoạt động' : 'Dừng'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{zone.createdAt}</td>
                <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setZones(prev => prev.filter(z => z.id !== zone.id))}
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

        {filteredZones.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="text-sm">Không tìm thấy vùng dữ liệu phù hợp</p>
          </div>
        )}
      </div>

      {/* Add Zone Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[420px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Thêm vùng dữ liệu mới</h2>
              <button onClick={() => setShowAddModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên vùng dữ liệu <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={newZoneName}
                onChange={e => setNewZoneName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addZone()}
                placeholder="VD: Kho văn bản thể thao"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">Đóng</button>
              <button onClick={addZone} disabled={!newZoneName.trim()} className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 font-medium">Tạo vùng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
