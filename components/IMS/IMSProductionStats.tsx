'use client'

import React, { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const emptyData = [
  { day: '1', value: 0 },
  { day: '5', value: 0 },
  { day: '10', value: 0 },
  { day: '15', value: 0 },
  { day: '20', value: 0 },
  { day: '25', value: 0 },
  { day: '30', value: 0 },
]

const StatPanel = ({
  title,
  todayCount,
  monthCount,
  color,
  label,
}: {
  title: string
  todayCount: number
  monthCount: number
  color: string
  label: string
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'month'>('today')

  return (
    <div className="flex-1 border border-gray-200 rounded bg-white">
      {/* Header row */}
      <div className="flex items-stretch border-b border-gray-200">
        <div className="px-4 py-2.5 bg-gray-100 border-r border-gray-200 flex items-center">
          <span className="text-[11px] font-bold text-gray-600 uppercase tracking-wide whitespace-nowrap">
            {title}
          </span>
        </div>
        <button
          onClick={() => setActiveTab('today')}
          className={`flex-1 px-3 py-2.5 text-center text-[11px] border-r border-gray-200 transition-colors ${
            activeTab === 'today' ? 'bg-white font-semibold text-gray-700' : 'bg-gray-50 text-gray-400'
          }`}
        >
          Hôm nay
          <div className={`text-lg font-bold mt-0.5 ${activeTab === 'today' ? 'text-gray-700' : 'text-gray-300'}`}>
            {todayCount}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('month')}
          className={`flex-1 px-3 py-2.5 text-center text-[11px] transition-colors ${
            activeTab === 'month' ? 'bg-white font-semibold text-gray-700' : 'bg-gray-50 text-gray-400'
          }`}
        >
          30 ngày gần đây
          <div className={`text-lg font-bold mt-0.5 ${activeTab === 'month' ? 'text-gray-700' : 'text-gray-300'}`}>
            {monthCount}
          </div>
        </button>
      </div>

      {/* Chart */}
      <div className="p-4">
        <ResponsiveContainer width="100%" height={130}>
          <BarChart data={emptyData} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} />
            <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} domain={[0, 1]} label={{ value: 'Bài viết', angle: -90, position: 'insideLeft', fontSize: 10, fill: '#9ca3af', dx: -5 }} />
            <Tooltip contentStyle={{ fontSize: 11, borderRadius: 4 }} />
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
          <span className="text-[10px] text-gray-500">{label}</span>
        </div>
      </div>
    </div>
  )
}

export const IMSProductionStats = () => {
  return (
    <div className="mb-5">
      <div className="px-5 py-3 mb-3">
        <h2 className="text-[13px] font-bold text-[#17a2b8] tracking-wide uppercase">
          Sản lượng tin bài
        </h2>
      </div>
      <div className="flex gap-4">
        <StatPanel
          title="Bài viết mới"
          todayCount={0}
          monthCount={0}
          color="#10b981"
          label="Sản lượng bài viết"
        />
        <StatPanel
          title="Bài xuất bản"
          todayCount={0}
          monthCount={0}
          color="#10b981"
          label="Sản lượng bài đã xuất bản"
        />
      </div>
    </div>
  )
}
