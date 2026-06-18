'use client'

import React, { useState } from 'react'
import { IMSSidebar } from '@/components/IMS/IMSSidebar'
import { IMSTopBar } from '@/components/IMS/IMSTopBar'
import QuanLyTroLyAI from './rooms/QuanLyTroLyAI'
import QuanLyModelAI from './rooms/QuanLyModelAI'
import QuanLyAIService from './rooms/QuanLyAIService'
import QuanLyNguonCrawler from './rooms/QuanLyNguonCrawler'
import QuanLyLuongMXH from './rooms/QuanLyLuongMXH'
import KhoDuLieuAI from './rooms/KhoDuLieuAI'

type RoomId = 'tro-ly' | 'model-ai' | 'ai-service' | 'crawler' | 'luong-mxh' | 'kho-du-lieu'

const sidebarItems = [
  { id: 'tro-ly' as RoomId, label: 'Quản lý trợ lý AI', icon: <RobotIcon /> },
  { id: 'model-ai' as RoomId, label: 'Quản lý Model AI (LLM)', icon: <BrainIcon /> },
  { id: 'ai-service' as RoomId, label: 'Quản lý AI Service', icon: <ServiceIcon /> },
  { id: 'crawler' as RoomId, label: 'Quản lý nguồn dữ liệu crawler', icon: <CrawlerIcon /> },
  { id: 'luong-mxh' as RoomId, label: 'Quản lý luồng đăng mxh', icon: <FlowIcon /> },
  { id: 'kho-du-lieu' as RoomId, label: 'Kho dữ liệu AI', icon: <WarehouseIcon /> },
]

export default function AIServicePage() {
  const [activeRoom, setActiveRoom] = useState<RoomId>('tro-ly')

  const renderRoom = () => {
    switch (activeRoom) {
      case 'tro-ly': return <QuanLyTroLyAI />
      case 'model-ai': return <QuanLyModelAI />
      case 'ai-service': return <QuanLyAIService />
      case 'crawler': return <QuanLyNguonCrawler />
      case 'luong-mxh': return <QuanLyLuongMXH />
      case 'kho-du-lieu': return <KhoDuLieuAI />
    }
  }

  return (
    <div className="flex min-h-screen bg-[#f0f2f5]">
      <IMSSidebar />
      <div className="ml-14 flex-1 flex flex-col min-h-screen">
        <IMSTopBar />
        <main className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Danh sách quản lý */}
          <aside className="w-64 min-w-[256px] bg-white border-r border-gray-200 flex flex-col">
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                DANH SÁCH QUẢN LÝ
              </h2>
            </div>
            <nav className="flex-1 py-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveRoom(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[13px] text-left transition-colors ${
                    activeRoom === item.id
                      ? 'bg-[#e8f7f9] text-[#17a2b8] font-semibold border-l-[3px] border-[#17a2b8]'
                      : 'text-gray-600 hover:bg-gray-50 border-l-[3px] border-transparent'
                  }`}
                >
                  <span className={`flex-shrink-0 ${activeRoom === item.id ? 'text-[#17a2b8]' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span className="leading-tight">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            {renderRoom()}
          </div>
        </main>
      </div>
    </div>
  )
}

function RobotIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H7a2 2 0 00-2 2v11a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2h-2M9 3V1m6 2V1M9 3h6M9 12h.01M15 12h.01M9 16h6" />
    </svg>
  )
}
function BrainIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  )
}
function ServiceIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  )
}
function CrawlerIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  )
}
function FlowIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  )
}
function WarehouseIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
    </svg>
  )
}
