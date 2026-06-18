'use client'

import React, { useState } from 'react'

interface FlowCategory {
  id: number
  name: string
}

interface Flow {
  id: number
  name: string
  creator: string
  createdAt: string
  dataZones: number
  trends: number
  createdPosts: number
  publishedPosts: number
  active: boolean
  categories: FlowCategory[]
}

const FLOWS_DATA: Flow[] = [
  { id: 1,  name: 'test flow demo',             creator: 'NGOCLM',    createdAt: '12/01/2025', dataZones: 3,  trends: 5,  createdPosts: 120, publishedPosts: 98,  active: true,  categories: [{ id: 1, name: 'Crawler data' }, { id: 2, name: 'Demo' }] },
  { id: 2,  name: 'Luồng tin tức thời sự',       creator: 'ADMIN',     createdAt: '15/01/2025', dataZones: 5,  trends: 12, createdPosts: 340, publishedPosts: 280, active: true,  categories: [{ id: 3, name: 'Thời sự' }, { id: 4, name: 'Tin nóng' }] },
  { id: 3,  name: 'Chiến sự Mỹ-Iran flow',       creator: 'EDITOR1',   createdAt: '20/01/2025', dataZones: 2,  trends: 8,  createdPosts: 210, publishedPosts: 190, active: true,  categories: [{ id: 5, name: 'Chiến sự Mỹ-Iran' }, { id: 6, name: 'Quốc tế' }] },
  { id: 4,  name: 'Thể thao tổng hợp',           creator: 'SPORT_ED',  createdAt: '22/01/2025', dataZones: 4,  trends: 7,  createdPosts: 456, publishedPosts: 400, active: false, categories: [{ id: 7, name: 'Thể thao' }, { id: 8, name: 'Bóng đá' }] },
  { id: 5,  name: 'Kinh tế tài chính daily',     creator: 'FINANCE',   createdAt: '25/01/2025', dataZones: 3,  trends: 6,  createdPosts: 189, publishedPosts: 150, active: true,  categories: [{ id: 9, name: 'Kinh tế' }, { id: 10, name: 'Tài chính' }] },
  { id: 6,  name: 'Giải trí showbiz',            creator: 'ENTERTAIN', createdAt: '28/01/2025', dataZones: 2,  trends: 15, createdPosts: 520, publishedPosts: 480, active: true,  categories: [{ id: 11, name: 'Showbiz' }, { id: 12, name: 'Giải trí' }] },
  { id: 7,  name: 'Công nghệ AI hàng ngày',      creator: 'TECH_ED',   createdAt: '02/02/2025', dataZones: 4,  trends: 10, createdPosts: 230, publishedPosts: 200, active: true,  categories: [{ id: 13, name: 'AI & Tech' }] },
  { id: 8,  name: 'Sức khỏe đời sống',           creator: 'HEALTH',    createdAt: '05/02/2025', dataZones: 3,  trends: 4,  createdPosts: 145, publishedPosts: 120, active: false, categories: [{ id: 14, name: 'Sức khỏe' }, { id: 15, name: 'Đời sống' }] },
  { id: 9,  name: 'Du lịch khám phá',            creator: 'TRAVEL',    createdAt: '08/02/2025', dataZones: 2,  trends: 6,  createdPosts: 98,  publishedPosts: 80,  active: true,  categories: [{ id: 16, name: 'Du lịch' }] },
  { id: 10, name: 'Pháp luật xã hội',            creator: 'LAW_ED',    createdAt: '10/02/2025', dataZones: 3,  trends: 5,  createdPosts: 176, publishedPosts: 140, active: true,  categories: [{ id: 17, name: 'Pháp luật' }] },
  { id: 11, name: 'Bất động sản tổng hợp',       creator: 'RE_EDITOR', createdAt: '12/02/2025', dataZones: 5,  trends: 9,  createdPosts: 267, publishedPosts: 230, active: true,  categories: [{ id: 18, name: 'Bất động sản' }] },
  { id: 12, name: 'Xe cộ giao thông',            creator: 'AUTO_ED',   createdAt: '15/02/2025', dataZones: 2,  trends: 3,  createdPosts: 89,  publishedPosts: 70,  active: false, categories: [{ id: 19, name: 'Xe cộ' }] },
  { id: 13, name: 'Ẩm thực food content',        creator: 'FOOD_ED',   createdAt: '18/02/2025', dataZones: 2,  trends: 8,  createdPosts: 310, publishedPosts: 290, active: true,  categories: [{ id: 20, name: 'Ẩm thực' }] },
  { id: 14, name: 'Học thuật giáo dục',          creator: 'EDU_EDITOR', createdAt: '20/02/2025', dataZones: 3, trends: 5,  createdPosts: 134, publishedPosts: 110, active: true,  categories: [{ id: 21, name: 'Giáo dục' }] },
  { id: 15, name: 'Môi trường khí hậu',          creator: 'ENV_ED',    createdAt: '22/02/2025', dataZones: 2,  trends: 4,  createdPosts: 78,  publishedPosts: 60,  active: false, categories: [{ id: 22, name: 'Môi trường' }] },
  { id: 16, name: 'Chính trị trong nước',        creator: 'POL_ED',    createdAt: '25/02/2025', dataZones: 4,  trends: 7,  createdPosts: 234, publishedPosts: 210, active: true,  categories: [{ id: 23, name: 'Chính trị' }] },
  { id: 17, name: 'Thời trang lifestyle',        creator: 'FASHION',   createdAt: '28/02/2025', dataZones: 2,  trends: 11, createdPosts: 189, publishedPosts: 170, active: true,  categories: [{ id: 24, name: 'Thời trang' }] },
  { id: 18, name: 'Khoa học vũ trụ',            creator: 'SCI_ED',    createdAt: '02/03/2025', dataZones: 2,  trends: 3,  createdPosts: 56,  publishedPosts: 45,  active: true,  categories: [{ id: 25, name: 'Khoa học' }] },
  { id: 19, name: 'Chứng khoán crypto',          creator: 'CRYPTO',    createdAt: '05/03/2025', dataZones: 3,  trends: 13, createdPosts: 412, publishedPosts: 380, active: true,  categories: [{ id: 26, name: 'Crypto' }, { id: 27, name: 'Chứng khoán' }] },
  { id: 20, name: 'Phụ nữ gia đình',            creator: 'FAMILY',    createdAt: '08/03/2025', dataZones: 3,  trends: 6,  createdPosts: 198, publishedPosts: 170, active: false, categories: [{ id: 28, name: 'Gia đình' }] },
  { id: 21, name: 'Gaming esports',             creator: 'GAME_ED',   createdAt: '10/03/2025', dataZones: 2,  trends: 9,  createdPosts: 321, publishedPosts: 290, active: true,  categories: [{ id: 29, name: 'Gaming' }] },
  { id: 22, name: 'Y tế dịch bệnh',             creator: 'MEDICAL',   createdAt: '12/03/2025', dataZones: 3,  trends: 7,  createdPosts: 167, publishedPosts: 140, active: true,  categories: [{ id: 30, name: 'Y tế' }] },
  { id: 23, name: 'Nông nghiệp nông thôn',       creator: 'AGRI_ED',   createdAt: '15/03/2025', dataZones: 2,  trends: 4,  createdPosts: 89,  publishedPosts: 70,  active: false, categories: [{ id: 31, name: 'Nông nghiệp' }] },
  { id: 24, name: 'Phim ảnh điện ảnh',          creator: 'CINEMA',    createdAt: '18/03/2025', dataZones: 2,  trends: 8,  createdPosts: 245, publishedPosts: 220, active: true,  categories: [{ id: 32, name: 'Điện ảnh' }] },
  { id: 25, name: 'Startup khởi nghiệp',        creator: 'STARTUP',   createdAt: '20/03/2025', dataZones: 3,  trends: 6,  createdPosts: 134, publishedPosts: 110, active: true,  categories: [{ id: 33, name: 'Startup' }] },
]

type TabId = 'danh-sach' | 'chuyen-muc'

export default function QuanLyLuongMXH() {
  const [flows, setFlows] = useState(FLOWS_DATA)
  const [activeTab, setActiveTab] = useState<TabId>('danh-sach')
  const [search, setSearch] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newFlowName, setNewFlowName] = useState('')
  const [addCatModal, setAddCatModal] = useState<number | null>(null)
  const [newCatName, setNewCatName] = useState('')

  const toggleFlow = (id: number) => {
    setFlows(prev => prev.map(f => f.id === id ? { ...f, active: !f.active } : f))
  }

  const addCategory = (flowId: number) => {
    if (!newCatName.trim()) return
    setFlows(prev => prev.map(f =>
      f.id === flowId
        ? { ...f, categories: [...f.categories, { id: Date.now(), name: newCatName }] }
        : f
    ))
    setNewCatName('')
    setAddCatModal(null)
  }

  const createFlow = () => {
    if (!newFlowName.trim()) return
    setFlows(prev => [...prev, {
      id: Date.now(),
      name: newFlowName,
      creator: 'NGOCLM',
      createdAt: new Date().toLocaleDateString('vi-VN'),
      dataZones: 0,
      trends: 0,
      createdPosts: 0,
      publishedPosts: 0,
      active: false,
      categories: [],
    }])
    setNewFlowName('')
    setShowCreateModal(false)
  }

  const filteredFlows = flows.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.creator.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6">
      {/* Tabs + Create button */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex border-b border-gray-200 flex-1">
          {[
            { id: 'danh-sach' as TabId, label: 'Danh sách luồng' },
            { id: 'chuyen-muc' as TabId, label: 'Chuyên mục mẫu bài đăng' },
          ].map(tab => (
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
              {tab.id === 'danh-sach' && (
                <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full font-medium ${activeTab === tab.id ? 'bg-[#17a2b8] text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {flows.length}
                </span>
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="ml-4 flex items-center gap-1.5 px-4 py-2 bg-[#17a2b8] text-white text-sm font-medium rounded-md hover:bg-[#138496] transition-colors whitespace-nowrap"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tạo luồng mới
        </button>
      </div>

      {activeTab === 'danh-sach' && (
        <>
          {/* Search */}
          <div className="relative max-w-xs mb-5">
            <input
              type="text"
              placeholder="Tìm kiếm luồng..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8]"
            />
            <svg className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Flows list */}
          <div className="space-y-3">
            {filteredFlows.map(flow => (
              <div key={flow.id} className="bg-white rounded-lg border border-gray-200 shadow-sm p-4">
                {/* Flow header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 text-sm truncate">{flow.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Tạo bởi <span className="font-medium text-gray-500">{flow.creator}</span> · {flow.createdAt}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className="text-xs text-gray-500">Đang hoạt động</span>
                    <button
                      onClick={() => toggleFlow(flow.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${flow.active ? 'bg-[#17a2b8]' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${flow.active ? 'translate-x-[18px]' : 'translate-x-[2px]'}`} />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-3 mb-3">
                  {[
                    { label: 'Vùng dữ liệu', value: flow.dataZones },
                    { label: 'Trends',        value: flow.trends },
                    { label: 'Bài đã tạo',    value: flow.createdPosts },
                    { label: 'Đã xuất bản',   value: flow.publishedPosts },
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 rounded-md px-3 py-2 text-center">
                      <div className="text-lg font-bold text-[#17a2b8]">{stat.value}</div>
                      <div className="text-xs text-gray-500">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Categories */}
                <div className="flex items-center flex-wrap gap-1.5">
                  {flow.categories.map(cat => (
                    <span key={cat.id} className="flex items-center gap-1 bg-[#e8f7f9] text-[#17a2b8] text-xs px-2.5 py-1 rounded-md font-medium">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                      </svg>
                      {cat.name}
                    </span>
                  ))}
                  <button
                    onClick={() => { setAddCatModal(flow.id); setNewCatName('') }}
                    className="flex items-center gap-1 border border-dashed border-gray-300 text-gray-400 hover:border-[#17a2b8] hover:text-[#17a2b8] text-xs px-2.5 py-1 rounded-md transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Thêm chuyên mục
                  </button>
                </div>
              </div>
            ))}

            {filteredFlows.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-lg border border-gray-200">
                <p className="text-sm">Không tìm thấy luồng phù hợp</p>
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'chuyen-muc' && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          <p className="text-sm text-gray-500">Quản lý chuyên mục mẫu bài đăng</p>
          <p className="text-xs text-gray-400 mt-1">Tính năng đang được phát triển</p>
        </div>
      )}

      {/* Add Category Modal */}
      {addCatModal !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setAddCatModal(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-[380px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Thêm chuyên mục vào luồng</h2>
              <button onClick={() => setAddCatModal(null)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên chuyên mục</label>
              <input
                type="text"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addCategory(addCatModal)}
                placeholder="VD: Thời sự trong nước"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setAddCatModal(null)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">Đóng</button>
              <button onClick={() => addCategory(addCatModal)} disabled={!newCatName.trim()} className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 font-medium">Thêm</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Flow Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-[420px]" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="font-bold text-gray-800">Tạo luồng mới</h2>
              <button onClick={() => setShowCreateModal(false)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 text-xl">×</button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên luồng <span className="text-red-400">*</span></label>
              <input
                type="text"
                value={newFlowName}
                onChange={e => setNewFlowName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createFlow()}
                placeholder="VD: Luồng tin tức hàng ngày"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[#17a2b8] focus:ring-1 focus:ring-[#17a2b8]"
                autoFocus
              />
            </div>
            <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100">Đóng</button>
              <button onClick={createFlow} disabled={!newFlowName.trim()} className="px-4 py-2 text-sm bg-[#17a2b8] text-white rounded-md hover:bg-[#138496] disabled:opacity-50 font-medium">Tạo luồng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
