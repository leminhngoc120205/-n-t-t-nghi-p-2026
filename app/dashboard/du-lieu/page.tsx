'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'

/* ═══════════════════════════════════════════════════════════
   CẤU HÌNH MENU — 3 nhóm × 3 mục = 9 trang con
══════════════════════════════════════════════════════════ */
interface MenuItem { id: string; label: string; type: 'saved'|'indexed'|'deleted'; hash: string }
interface MenuGroup { key: string; label: string; color: string; icon: React.ReactNode; items: MenuItem[] }

const GROUPS: MenuGroup[] = [
  {
    key: 'text', label: 'DỮ LIỆU VĂN BẢN', color: '#17a2b8',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>,
    items: [
      { id:'text-saved',   label:'Dữ liệu đã lưu',   type:'saved',   hash:'text-data/1' },
      { id:'text-indexed', label:'Dữ liệu đã index',  type:'indexed', hash:'text-data/8' },
      { id:'text-deleted', label:'Dữ liệu đã xóa',   type:'deleted', hash:'text-data/9' },
    ],
  },
  {
    key: 'image', label: 'DỮ LIỆU HÌNH ẢNH', color: '#6366f1',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>,
    items: [
      { id:'image-saved',   label:'Dữ liệu đã lưu',   type:'saved',   hash:'image-data/1' },
      { id:'image-indexed', label:'Dữ liệu đã index',  type:'indexed', hash:'image-data/8' },
      { id:'image-deleted', label:'Dữ liệu đã xóa',   type:'deleted', hash:'image-data/9' },
    ],
  },
  {
    key: 'video', label: 'DỮ LIỆU VIDEOS', color: '#ef4444',
    icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.882v6.235a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>,
    items: [
      { id:'video-saved',   label:'Dữ liệu đã lưu',   type:'saved',   hash:'video-data/1' },
      { id:'video-indexed', label:'Dữ liệu đã index',  type:'indexed', hash:'video-data/8' },
      { id:'video-deleted', label:'Dữ liệu đã xóa',   type:'deleted', hash:'video-data/9' },
    ],
  },
]

const ALL_ITEMS = GROUPS.flatMap(g => g.items)

/* ─── Danh sách trợ lý AI ─── */
const AI_ASSISTANTS = [
  'Trợ lý tin thời sự',
  'video-edit',
  'Trợ lý phân tích dữ liệu',
  'Trợ lý viết bài dài',
  'Trợ lý dịch thuật',
  'Trợ lý Hoat',
  'Trợ lý Quang',
]

/* ─── Vùng dữ liệu (per AI) ─── */
const AI_ZONES: Record<string, string[]> = {
  'Trợ lý tin thời sự':       ['Vùng thời sự trong nước', 'Vùng thời sự quốc tế', 'Vùng dữ liệu chung'],
  'video-edit':                ['Vùng script video', 'Vùng caption', 'Vùng tóm tắt video'],
  'Trợ lý phân tích dữ liệu': ['Vùng số liệu kinh tế', 'Vùng thống kê xã hội'],
  'Trợ lý viết bài dài':      ['Vùng phân tích chuyên sâu', 'Vùng phóng sự điều tra'],
  'Trợ lý dịch thuật':        ['Vùng tiếng Anh', 'Vùng tiếng Trung', 'Vùng đa ngôn ngữ'],
  'Trợ lý Hoat':              ['Vùng dữ liệu Hoat', 'Vùng tổng hợp'],
  'Trợ lý Quang':             ['Vùng dữ liệu Quang', 'Vùng biên tập'],
}

/* ─── Danh sách người dùng ─── */
const ALL_USERS = [
  'camvanthanh_vcc', 'tuandat_design', 'canxuantung_vccorp',
  'nguyennhung_vcc', 'NGOCLM_VCC', 'minhvu', 'dinhluong_vcc',
  'hoattv_vcc', 'minhquang914', 'trangnv_vcc',
]

/* ─── Icon helpers ─── */
function IconSaved() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
  </svg>
}
function IconIndexed() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
}
function IconDeleted() {
  return <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
}
const typeIcons: Record<string, React.ReactNode> = {
  saved: <IconSaved/>, indexed: <IconIndexed/>, deleted: <IconDeleted/>,
}

/* ═══════════════════════════════════════════════════════════
   PAGE CHÍNH
══════════════════════════════════════════════════════════ */
export default function DuLieuPage() {
  const [activeId,    setActiveId]    = useState('text-saved')
  const [selectedAI,  setSelectedAI]  = useState('')
  const [selectedZone,setSelectedZone]= useState('')
  const [sortOrder,   setSortOrder]   = useState<'newest'|'oldest'>('newest')
  const [selectedUser,setSelectedUser]= useState('')
  const [search,      setSearch]      = useState('')
  const [showAddModal,setShowAddModal] = useState(false)
  const [toast,       setToast]       = useState('')

  const activeItem = ALL_ITEMS.find(i => i.id === activeId)!
  const activeGroup = GROUPS.find(g => g.items.some(i => i.id === activeId))!

  /* Update hash in URL */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.location.hash = activeItem.hash
    }
  }, [activeId, activeItem.hash])

  /* Read hash on mount */
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      const found = ALL_ITEMS.find(i => i.hash === hash)
      if (found) setActiveId(found.id)
    }
  }, [])

  const handleSwitch = useCallback((id: string) => {
    setActiveId(id)
    setSearch('')
  }, [])

  const handleAddData = () => {
    if (!selectedAI) {
      setToast('Vui lòng chọn trợ lý AI trước khi thêm dữ liệu!')
      setTimeout(() => setToast(''), 3000)
      return
    }
    setShowAddModal(true)
  }

  const zones = selectedAI ? (AI_ZONES[selectedAI] || []) : []

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />

      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />

        <main className="flex flex-1 overflow-hidden">

          {/* ── Sidebar trái ── */}
          <aside className="w-60 min-h-full bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            {GROUPS.map((group, gi) => (
              <div key={group.key} className={gi > 0 ? 'border-t border-gray-100' : ''}>
                {/* Group header */}
                <div className="flex items-center gap-2 px-4 py-2.5 mt-1">
                  <span style={{ color: group.color }}>{group.icon}</span>
                  <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: group.color }}>
                    {group.label}
                  </p>
                </div>

                {/* Sub-items */}
                {group.items.map(item => (
                  <button
                    key={item.id}
                    onClick={() => handleSwitch(item.id)}
                    className={`w-full flex items-center gap-2.5 px-4 py-2 text-left transition-colors border-l-[3px]
                      ${activeId === item.id
                        ? 'bg-[#e8f7f9] border-[#17a2b8]'
                        : 'border-transparent hover:bg-gray-50'}`}
                  >
                    <span className={`flex-shrink-0 ${activeId === item.id ? 'text-[#17a2b8]' : 'text-gray-400'}`}>
                      {typeIcons[item.type]}
                    </span>
                    <span className={`text-xs ${activeId === item.id ? 'text-[#17a2b8] font-semibold' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                    {/* Hash badge for dev reference */}
                    <span className="ml-auto text-[9px] text-gray-300 font-mono hidden group-hover:block">
                      #{item.hash.split('/')[1]}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </aside>

          {/* ── Vùng nội dung ── */}
          <div className="flex-1 overflow-y-auto p-5">

            {/* Breadcrumb / title */}
            <div className="flex items-center gap-2 mb-4">
              <span style={{ color: activeGroup.color }}>{activeGroup.icon}</span>
              <h1 className="text-base font-bold text-gray-800">{activeGroup.label}</h1>
              <span className="text-gray-300">›</span>
              <span className="text-sm text-gray-500">{activeItem.label}</span>
              <span className="ml-2 text-[10px] font-mono text-gray-300 bg-gray-100 px-1.5 py-0.5 rounded">
                #{activeItem.hash}
              </span>
            </div>

            {/* Toolbar */}
            <div className="bg-white border border-gray-200 rounded-lg p-3.5 mb-4">
              <div className="flex items-center gap-2.5 flex-wrap">

                {/* THÊM DỮ LIỆU */}
                <button
                  onClick={handleAddData}
                  className="flex items-center gap-1.5 bg-[#17a2b8] hover:bg-[#138496] text-white text-xs font-bold px-3.5 py-2 rounded transition-colors shadow-sm whitespace-nowrap flex-shrink-0"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                  </svg>
                  THÊM DỮ LIỆU
                </button>

                <div className="w-px h-6 bg-gray-200 flex-shrink-0"/>

                {/* Filter 1: Trợ lý AI */}
                <FilterDropdown
                  label="Tất cả trợ lý AI"
                  selected={selectedAI}
                  onSelect={v => { setSelectedAI(v); setSelectedZone('') }}
                  options={AI_ASSISTANTS}
                  icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>}
                />

                {/* Filter 2: Vùng dữ liệu (phụ thuộc AI) */}
                <FilterDropdown
                  label="Chọn vùng dữ liệu"
                  selected={selectedZone}
                  onSelect={setSelectedZone}
                  options={zones}
                  disabled={!selectedAI}
                  noOptionsText="No options available"
                  icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"/></svg>}
                />

                {/* Filter 3: Sắp xếp thời gian */}
                <FilterDropdown
                  label={sortOrder === 'newest' ? 'Thời gian tạo gần nhất' : 'Thời gian tạo xa nhất'}
                  selected={sortOrder === 'newest' ? 'Thời gian tạo gần nhất' : 'Thời gian tạo xa nhất'}
                  onSelect={v => setSortOrder(v === 'Thời gian tạo gần nhất' ? 'newest' : 'oldest')}
                  options={['Thời gian tạo gần nhất', 'Thời gian tạo xa nhất']}
                  icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"/></svg>}
                />

                {/* Filter 4: Người dùng */}
                <FilterDropdown
                  label="Tất cả mọi người"
                  selected={selectedUser}
                  onSelect={setSelectedUser}
                  options={ALL_USERS}
                  icon={<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg>}
                />

                {/* Search */}
                <div className="relative flex-1 min-w-[160px]">
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Tìm kiếm tài liệu"
                    className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded bg-white focus:outline-none focus:border-[#17a2b8]"
                  />
                  <svg className="absolute left-2.5 top-2 w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                </div>

                {/* Pagination */}
                <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
                  <span className="text-xs text-gray-500 whitespace-nowrap">1-0 trong tổng số 0</span>
                  <button disabled className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/></svg>
                  </button>
                  <button disabled className="p-1 rounded hover:bg-gray-100 disabled:opacity-30 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
                  </button>
                </div>
              </div>

              {/* Active filters display */}
              {(selectedAI || selectedZone || selectedUser) && (
                <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-100 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase">Đang lọc:</span>
                  {selectedAI && (
                    <FilterPill label={selectedAI} onRemove={() => { setSelectedAI(''); setSelectedZone('') }}/>
                  )}
                  {selectedZone && (
                    <FilterPill label={selectedZone} onRemove={() => setSelectedZone('')}/>
                  )}
                  {selectedUser && (
                    <FilterPill label={selectedUser} onRemove={() => setSelectedUser('')}/>
                  )}
                  <button
                    onClick={() => { setSelectedAI(''); setSelectedZone(''); setSelectedUser('') }}
                    className="text-[10px] text-red-500 hover:text-red-700 ml-1"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>

            {/* Content area — empty state */}
            <EmptyDataArea type={activeGroup.key} subType={activeItem.type} groupColor={activeGroup.color}/>
          </div>
        </main>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[400] animate-slide-in-right">
          <div className="flex items-center gap-2.5 bg-gray-800 text-white px-5 py-2.5 rounded-full shadow-xl text-sm">
            <svg className="w-4 h-4 text-yellow-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            {toast}
          </div>
        </div>
      )}

      {/* Add Data Modal */}
      {showAddModal && (
        <AddDataModal
          groupKey={activeGroup.key}
          groupLabel={activeGroup.label}
          selectedAI={selectedAI}
          zones={zones}
          selectedZone={selectedZone}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   FILTER DROPDOWN COMPONENT
══════════════════════════════════════════════════════════ */
function FilterDropdown({ label, selected, onSelect, options, disabled, noOptionsText, icon }: {
  label: string
  selected: string
  onSelect: (v: string) => void
  options: string[]
  disabled?: boolean
  noOptionsText?: string
  icon?: React.ReactNode
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const displayLabel = selected || label

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs border rounded transition-colors whitespace-nowrap
          ${disabled
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : open
              ? 'border-[#17a2b8] text-[#17a2b8] bg-[#e8f7f9]'
              : selected
                ? 'border-[#17a2b8] text-[#17a2b8] bg-[#e8f7f9]'
                : 'border-gray-300 text-gray-600 bg-white hover:border-[#17a2b8] hover:text-[#17a2b8]'}`}
      >
        {icon && <span className={disabled ? 'text-gray-300' : selected ? 'text-[#17a2b8]' : 'text-gray-400'}>{icon}</span>}
        <span className="max-w-[140px] truncate">{displayLabel}</span>
        <svg className={`w-3 h-3 transition-transform flex-shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-40 w-56 overflow-hidden">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-xs text-gray-400 italic text-center">
              {noOptionsText || 'Không có lựa chọn nào'}
            </div>
          ) : (
            <>
              {/* Clear option */}
              {selected && (
                <button
                  onClick={() => { onSelect(''); setOpen(false) }}
                  className="w-full text-left px-3 py-2 text-xs text-red-500 hover:bg-red-50 transition-colors border-b border-gray-100 flex items-center gap-1.5"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                  Bỏ lọc
                </button>
              )}
              {/* Scrollable list */}
              <div className="max-h-48 overflow-y-auto">
                {options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { onSelect(opt); setOpen(false) }}
                    className={`w-full text-left px-3 py-2.5 text-xs transition-colors flex items-center gap-2
                      ${selected === opt
                        ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold'
                        : 'text-gray-700 hover:bg-gray-50'}`}
                  >
                    {selected === opt && (
                      <svg className="w-3 h-3 text-[#17a2b8] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    )}
                    <span className={selected === opt ? '' : 'ml-5'}>{opt}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Filter pill badge ─── */
function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="flex items-center gap-1 bg-[#17a2b8] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
      {label}
      <button onClick={onRemove} className="ml-0.5 hover:text-white/70 transition-colors">
        <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>
    </span>
  )
}

/* ═══════════════════════════════════════════════════════════
   EMPTY DATA AREA
══════════════════════════════════════════════════════════ */
function EmptyDataArea({ type, subType, groupColor }: {
  type: string; subType: string; groupColor: string
}) {
  const typeConfig = {
    text:  { icon: '📄', label: 'văn bản', cols: ['Tiêu đề tài liệu', 'Nội dung tóm tắt', 'Trợ lý AI', 'Vùng dữ liệu', 'Người tạo', 'Ngày tạo', 'Trạng thái'] },
    image: { icon: '🖼️', label: 'hình ảnh', cols: ['Ảnh thu nhỏ', 'Tên file', 'Kích thước', 'Trợ lý AI', 'Người tạo', 'Ngày tạo', 'Trạng thái'] },
    video: { icon: '🎬', label: 'video', cols: ['Thumbnail', 'Tên video', 'Thời lượng', 'Trợ lý AI', 'Người tạo', 'Ngày tạo', 'Trạng thái'] },
  }

  const subConfig = {
    saved:   { badge: 'Đã lưu',   color: 'bg-blue-100 text-blue-700',   desc: 'chưa có dữ liệu nào được lưu' },
    indexed: { badge: 'Đã index', color: 'bg-green-100 text-green-700', desc: 'chưa có dữ liệu nào được đánh chỉ mục' },
    deleted: { badge: 'Đã xóa',  color: 'bg-red-100 text-red-600',     desc: 'thùng rác đang trống' },
  }

  const cfg    = typeConfig[type as keyof typeof typeConfig]
  const subCfg = subConfig[subType as keyof typeof subConfig]

  return (
    <div className="bg-white rounded border border-gray-200 overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-base">{cfg.icon}</span>
          <span className="text-xs font-semibold text-gray-600">Danh sách dữ liệu {cfg.label}</span>
          <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${subCfg.color}`}>{subCfg.badge}</span>
        </div>
        <span className="text-xs text-gray-400">1-0 trong tổng số 0</span>
      </div>

      {/* Column headers */}
      <div className="grid border-b border-gray-200 bg-gray-50/50"
        style={{ gridTemplateColumns: `repeat(${cfg.cols.length}, 1fr)` }}>
        {cfg.cols.map(col => (
          <div key={col} className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wide">
            {col}
          </div>
        ))}
      </div>

      {/* Empty state */}
      <div className="py-20 flex flex-col items-center gap-4 text-center">
        {/* Animated empty illustration */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
            style={{ background: `${groupColor}15` }}>
            {cfg.icon}
          </div>
          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center text-sm">
            {subType === 'saved' ? '📥' : subType === 'indexed' ? '🔍' : '🗑️'}
          </div>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-600 mb-1">Kho dữ liệu đang trống</p>
          <p className="text-xs text-gray-400">{subCfg.desc}</p>
          <p className="text-[11px] text-gray-300 mt-1">Phần đếm hiển thị: 1-0 trong tổng số 0</p>
        </div>

        {subType !== 'deleted' && (
          <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200 text-xs text-gray-500">
            <svg className="w-4 h-4 text-[#17a2b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            Chọn trợ lý AI rồi bấm <strong className="text-[#17a2b8] mx-1">THÊM DỮ LIỆU</strong> để nạp nguyên liệu mới
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════
   ADD DATA MODAL
══════════════════════════════════════════════════════════ */
function AddDataModal({ groupKey, groupLabel, selectedAI, zones, selectedZone, onClose }: {
  groupKey: string; groupLabel: string; selectedAI: string
  zones: string[]; selectedZone: string; onClose: () => void
}) {
  const [tab,      setTab]      = useState<'url'|'file'|'text'>('url')
  const [zone,     setZone]     = useState(selectedZone)
  const [title,    setTitle]    = useState('')
  const [content,  setContent]  = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [dragging, setDragging] = useState(false)

  const typeLabels = { text: 'Văn bản', image: 'Hình ảnh', video: 'Video' }
  const acceptMap  = { text: '.txt,.doc,.docx,.pdf', image: 'image/*', video: 'video/*' }

  return (
    <div className="fixed inset-0 z-[300] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden" style={{ maxHeight:'90vh' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-800">Thêm dữ liệu mới</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">{groupLabel} · Trợ lý: <span className="text-[#17a2b8] font-medium">{selectedAI}</span></p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* Chọn vùng dữ liệu */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Vùng dữ liệu <span className="text-red-500">*</span>
            </label>
            <select value={zone} onChange={e => setZone(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] bg-white">
              <option value="">-- Chọn vùng dữ liệu --</option>
              {zones.map(z => <option key={z}>{z}</option>)}
            </select>
          </div>

          {/* Tiêu đề */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tiêu đề tài liệu</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8]"/>
          </div>

          {/* Input type tabs */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-2">Nguồn dữ liệu</label>
            <div className="flex rounded-lg border border-gray-200 overflow-hidden">
              {([
                ['url',  'URL / Đường dẫn'],
                ['file', 'Tải file lên'],
                ['text', 'Nhập thủ công'],
              ] as const).map(([id, label]) => (
                <button key={id} onClick={() => setTab(id)}
                  className={`flex-1 py-2 text-xs font-semibold transition-colors border-r last:border-r-0 border-gray-200
                    ${tab === id ? 'bg-[#17a2b8] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
                  {label}
                </button>
              ))}
            </div>

            <div className="mt-3">
              {tab === 'url' && (
                <div>
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    placeholder="https://example.com/article..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#17a2b8] font-mono"/>
                  <p className="text-[10px] text-gray-400 mt-1">Nhập URL của bài viết hoặc tài liệu cần thêm vào kho dữ liệu</p>
                </div>
              )}

              {tab === 'file' && (
                <div
                  onDragOver={e => { e.preventDefault(); setDragging(true) }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={e => { e.preventDefault(); setDragging(false) }}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
                    ${dragging ? 'border-[#17a2b8] bg-[#e8f7f9]' : 'border-gray-200 hover:border-[#17a2b8]'}`}>
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center transition-colors ${dragging ? 'bg-[#17a2b8]' : 'bg-gray-100'}`}>
                    <svg className={`w-6 h-6 transition-colors ${dragging ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    {dragging ? 'Thả file vào đây...' : 'Kéo thả file vào đây'}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">hoặc</p>
                  <button className="px-4 py-1.5 bg-[#17a2b8] text-white text-xs font-bold rounded-lg">Chọn file</button>
                  <p className="text-[10px] text-gray-300 mt-2">
                    {typeLabels[groupKey as keyof typeof typeLabels]} · {acceptMap[groupKey as keyof typeof acceptMap]}
                  </p>
                </div>
              )}

              {tab === 'text' && (
                <textarea value={content} onChange={e => setContent(e.target.value)} rows={5}
                  placeholder="Nhập nội dung văn bản vào đây..."
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-[#17a2b8]"/>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-5 py-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
          <button onClick={onClose}
            className="px-5 py-2 text-sm font-semibold border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
            Hủy
          </button>
          <button
            disabled={!zone || (!urlInput && !content && tab !== 'file')}
            className="px-5 py-2 text-sm font-semibold bg-[#17a2b8] text-white rounded-lg hover:bg-[#138496] transition-colors disabled:opacity-50"
          >
            Thêm vào kho dữ liệu
          </button>
        </div>
      </div>
    </div>
  )
}
