'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface CardDef {
  statusId: string
  label: string
  icon: React.ReactNode
}

const CARDS: CardDef[] = [
  { statusId: 'waiting_edit',    label: 'Tin chờ biên tập',  icon: <PendingEditIcon /> },
  { statusId: 'waiting_publish', label: 'Tin chờ xuất bản',  icon: <PendingPublishIcon /> },
  { statusId: 'processing',      label: 'Tin nhận xử lý',    icon: <ProcessingIcon /> },
  { statusId: 'published',       label: 'Tin đã xuất bản',   icon: <PublishedIcon /> },
  { statusId: 'deleted',         label: 'Tin bị xóa',        icon: <DeletedIcon /> },
  { statusId: 'removed',         label: 'Tin bị gỡ xuống',   icon: <TakenDownIcon /> },
]

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`
  return String(n)
}

export const IMSStatCards = () => {
  const router = useRouter()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/count-news')
      .then(r => r.json())
      .then(data => { setCounts(data.counts); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="grid grid-cols-6 gap-0 mb-5">
      {CARDS.map((card, i) => {
        const raw = counts[card.statusId] ?? 0
        return (
          <button
            key={card.statusId}
            onClick={() => router.push(`/dashboard/bai-viet?status=${card.statusId}`)}
            className="bg-white border border-gray-200 px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors group text-left"
            style={{ borderRight: i < CARDS.length - 1 ? 'none' : '1px solid #e5e7eb' }}
          >
            <div className="flex-1">
              <div className="text-2xl font-bold text-[#17a2b8] leading-tight tabular-nums">
                {loading ? <span className="w-8 h-6 bg-gray-100 rounded animate-pulse inline-block" /> : formatCount(raw)}
              </div>
              <div className="text-xs text-gray-500 mt-0.5 leading-tight">{card.label}</div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className="text-gray-300">{card.icon}</div>
              <span className="text-gray-400 text-xs group-hover:text-[#17a2b8] transition-colors">›</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function PendingEditIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="20" height="26" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <rect x="15" y="6" width="6" height="3" rx="1" fill="#d1d5db" />
      <rect x="12" y="16" width="12" height="2" rx="1" fill="#d1d5db" />
      <rect x="12" y="21" width="8" height="2" rx="1" fill="#d1d5db" />
      <rect x="26" y="14" width="6" height="2" rx="0.5" fill="#17a2b8" />
      <rect x="26" y="18" width="6" height="2" rx="0.5" fill="#17a2b8" />
    </svg>
  )
}

function PendingPublishIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="20" height="26" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <rect x="15" y="6" width="6" height="3" rx="1" fill="#d1d5db" />
      <rect x="12" y="16" width="12" height="2" rx="1" fill="#d1d5db" />
      <rect x="12" y="21" width="8" height="2" rx="1" fill="#d1d5db" />
      <path d="M26 20l3-3 3 3M29 17v8" stroke="#17a2b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function ProcessingIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="20" height="26" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <rect x="15" y="6" width="6" height="3" rx="1" fill="#d1d5db" />
      <rect x="12" y="16" width="12" height="2" rx="1" fill="#d1d5db" />
      <rect x="12" y="21" width="8" height="2" rx="1" fill="#d1d5db" />
      <path d="M27 16a4 4 0 110 8 4 4 0 010-8z" stroke="#17a2b8" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
    </svg>
  )
}

function PublishedIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="6" y="8" width="18" height="24" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <rect x="9" y="8" width="6" height="2.5" rx="1" fill="#d1d5db" />
      <rect x="9" y="16" width="12" height="1.5" rx="0.75" fill="#d1d5db" />
      <rect x="9" y="20" width="9" height="1.5" rx="0.75" fill="#d1d5db" />
      <rect x="10" y="10" width="18" height="24" rx="2" stroke="#c8d0db" strokeWidth="1.5" fill="white" />
      <rect x="13" y="10" width="6" height="2.5" rx="1" fill="#d1d5db" />
      <rect x="13" y="18" width="12" height="1.5" rx="0.75" fill="#d1d5db" />
      <rect x="13" y="22" width="8" height="1.5" rx="0.75" fill="#d1d5db" />
    </svg>
  )
}

function DeletedIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="20" height="26" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <rect x="15" y="6" width="6" height="3" rx="1" fill="#d1d5db" />
      <rect x="12" y="16" width="12" height="2" rx="1" fill="#d1d5db" />
      <rect x="12" y="21" width="8" height="2" rx="1" fill="#d1d5db" />
      <path d="M24 14l6 6M30 14l-6 6" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function TakenDownIcon() {
  return (
    <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
      <rect x="8" y="6" width="20" height="26" rx="2" stroke="#d1d5db" strokeWidth="1.5" fill="none" />
      <rect x="15" y="6" width="6" height="3" rx="1" fill="#d1d5db" />
      <rect x="12" y="16" width="12" height="2" rx="1" fill="#d1d5db" />
      <rect x="12" y="21" width="8" height="2" rx="1" fill="#d1d5db" />
      <path d="M27 15v8M24 20l3 3 3-3" stroke="#17a2b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
