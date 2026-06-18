'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

type ViewMode = 'all' | 'desktop' | 'mobile'

interface HourlyPoint { time: string; View: number; User: number }
interface SourceItem { label: string; percent: number; color: string }
interface PanelData { userOnline: number; userOldTime: number; sources: SourceItem[] }

const MOCK: Record<ViewMode, { chart: HourlyPoint[]; panel: PanelData }> = {
  all: {
    chart: [
      { time: '0h',  View: 2829, User: 1951 },
      { time: '1h',  View: 2420, User: 1710 },
      { time: '2h',  View: 1980, User: 1405 },
      { time: '3h',  View: 1650, User: 1180 },
      { time: '4h',  View: 1420, User: 1010 },
      { time: '5h',  View: 1280, User:  920 },
      { time: '6h',  View: 1490, User: 1060 },
      { time: '7h',  View: 2100, User: 1520 },
      { time: '8h',  View: 3200, User: 2340 },
      { time: '9h',  View: 4100, User: 3010 },
      { time: '10h', View: 4580, User: 3350 },
      { time: '11h', View: 4820, User: 3520 },
      { time: '12h', View: 4200, User: 3080 },
      { time: '13h', View: 4650, User: 3410 },
      { time: '14h', View: 4300, User: 3150 },
    ],
    panel: {
      userOnline: 539,
      userOldTime: 520,
      sources: [
        { label: 'Trực tiếp',  percent: 45.50, color: '#6b7280' },
        { label: 'Google',     percent: 41.23, color: '#f97316' },
        { label: 'Facebook',   percent:  8.15, color: '#3b82f6' },
        { label: 'Bing',       percent:  2.35, color: '#8b5cf6' },
        { label: 'Nguồn khác', percent:  2.77, color: '#10b981' },
      ],
    },
  },
  desktop: {
    chart: [
      { time: '0h',  View: 547, User: 303 },
      { time: '1h',  View: 480, User: 268 },
      { time: '2h',  View: 390, User: 215 },
      { time: '3h',  View: 320, User: 178 },
      { time: '4h',  View: 275, User: 152 },
      { time: '5h',  View: 248, User: 138 },
      { time: '6h',  View: 290, User: 162 },
      { time: '7h',  View: 410, User: 228 },
      { time: '8h',  View: 620, User: 345 },
      { time: '9h',  View: 780, User: 435 },
      { time: '10h', View: 860, User: 480 },
      { time: '11h', View: 910, User: 510 },
      { time: '12h', View: 790, User: 442 },
      { time: '13h', View: 870, User: 487 },
      { time: '14h', View: 820, User: 459 },
    ],
    panel: {
      userOnline: 139,
      userOldTime: 129,
      sources: [
        { label: 'Trực tiếp',  percent: 77.21, color: '#6b7280' },
        { label: 'Google',     percent: 21.46, color: '#f97316' },
        { label: 'Facebook',   percent:  0.22, color: '#3b82f6' },
        { label: 'Bing',       percent:  0.00, color: '#8b5cf6' },
        { label: 'Nguồn khác', percent:  1.11, color: '#10b981' },
      ],
    },
  },
  mobile: {
    chart: [
      { time: '0h',  View: 2282, User: 1648 },
      { time: '1h',  View: 1940, User: 1442 },
      { time: '2h',  View: 1590, User: 1190 },
      { time: '3h',  View: 1330, User: 1002 },
      { time: '4h',  View: 1145, User:  858 },
      { time: '5h',  View: 1032, User:  782 },
      { time: '6h',  View: 1200, User:  898 },
      { time: '7h',  View: 1690, User: 1292 },
      { time: '8h',  View: 2580, User: 1995 },
      { time: '9h',  View: 3320, User: 2575 },
      { time: '10h', View: 3720, User: 2870 },
      { time: '11h', View: 3910, User: 3010 },
      { time: '12h', View: 3410, User: 2638 },
      { time: '13h', View: 3780, User: 2923 },
      { time: '14h', View: 3480, User: 2691 },
    ],
    panel: {
      userOnline: 400,
      userOldTime: 391,
      sources: [
        { label: 'Trực tiếp',  percent: 32.40, color: '#6b7280' },
        { label: 'Google',     percent: 54.82, color: '#f97316' },
        { label: 'Facebook',   percent: 10.55, color: '#3b82f6' },
        { label: 'Bing',       percent:  0.85, color: '#8b5cf6' },
        { label: 'Nguồn khác', percent:  1.38, color: '#10b981' },
      ],
    },
  },
}

const TABS: { label: string; mode: ViewMode }[] = [
  { label: 'LƯU LƯỢNG TRUY CẬP',   mode: 'all' },
  { label: 'TRUY CẬP TRÊN DESKTOP', mode: 'desktop' },
  { label: 'TRUY CẬP TRÊN MOBILE',  mode: 'mobile' },
]

export const IMSTrafficSection = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('all')
  const [liveCount, setLiveCount] = useState(MOCK.all.panel.userOnline)
  const baseRef = useRef(MOCK.all.panel.userOnline)

  const data = MOCK[viewMode]

  useEffect(() => {
    baseRef.current = data.panel.userOnline
    setLiveCount(data.panel.userOnline)
  }, [viewMode, data.panel.userOnline])

  useEffect(() => {
    const id = setInterval(() => {
      const delta = Math.floor(Math.random() * 11) - 5
      setLiveCount(prev => Math.max(0, prev + delta))
    }, 3000)
    return () => clearInterval(id)
  }, [viewMode])

  const growth = ((data.panel.userOnline - data.panel.userOldTime) / data.panel.userOldTime * 100).toFixed(2)
  const isPositive = data.panel.userOnline >= data.panel.userOldTime

  const maxVal = Math.max(...data.chart.map(d => d.View))
  const yMax = Math.ceil(maxVal / 1000) * 1000
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((yMax / 4) * i))

  return (
    <div className="bg-white border border-gray-200 rounded mb-5 flex" style={{ minHeight: 280 }}>
      {/* Left — Realtime panel */}
      <div className="w-72 border-r border-gray-200 p-5 flex-shrink-0">
        <h3 className="font-bold text-gray-700 text-sm mb-3 text-center tracking-wide">
          NGAY BÂY GIỜ !
        </h3>

        <div className="flex justify-center mb-2">
          <div className="bg-[#2c3347] text-white text-3xl font-bold px-6 py-3 rounded min-w-[80px] text-center tabular-nums transition-all">
            {liveCount.toLocaleString('vi-VN')}
          </div>
        </div>
        <p className="text-center text-gray-500 text-xs mb-4">người đang truy cập</p>

        <div className="space-y-2">
          {data.panel.sources.map((src) => (
            <div key={src.label}>
              <div className="flex justify-between text-xs text-gray-600 mb-0.5">
                <span>{src.label}</span>
                <span>{src.percent.toFixed(2)}%</span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${src.percent}%`, backgroundColor: src.color }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-center">
          <p className="text-gray-500">Lượt truy cập cũ {data.panel.userOldTime.toLocaleString('vi-VN')}</p>
          <p className={`font-semibold mt-1 ${isPositive ? 'text-[#17a2b8]' : 'text-red-500'}`}>
            {isPositive ? 'Tăng' : 'Giảm'} {isPositive ? '+' : ''}{growth}% so với lượt truy cập cũ
          </p>
        </div>
      </div>

      {/* Right — Chart panel */}
      <div className="flex-1 p-5">
        <div className="flex gap-0 border-b border-gray-200 mb-4">
          {TABS.map((tab) => (
            <button
              key={tab.mode}
              onClick={() => setViewMode(tab.mode)}
              className={`px-4 pb-3 text-xs font-semibold tracking-wide transition-colors ${
                viewMode === tab.mode
                  ? 'text-gray-800 border-b-2 border-orange-400 -mb-px'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={data.chart} margin={{ top: 5, right: 30, left: 10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              label={{ value: '(Giờ)', position: 'insideBottom', offset: -10, fontSize: 10, fill: '#9ca3af' }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              label={{ value: 'Số người đọc', angle: -90, position: 'insideLeft', offset: 10, fontSize: 10, fill: '#9ca3af' }}
              domain={[0, yMax]}
              ticks={yTicks}
              tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)}
            />
            <Tooltip
              formatter={(value) => [Number(value).toLocaleString('vi-VN')]}
              contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid #e5e7eb' }}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
            <Line
              type="monotone"
              dataKey="View"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
              animationDuration={400}
            />
            <Line
              type="monotone"
              dataKey="User"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f97316' }}
              activeDot={{ r: 5 }}
              animationDuration={400}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
