'use client'

import React from 'react'

interface StatCardProps {
  label: string
  value: string
  change: string
  color: 'blue' | 'amber' | 'green' | 'gold'
  icon: string
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  color,
  icon,
}) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-editorial-blue',
    amber: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    gold: 'bg-yellow-50 text-editorial-gold',
  }

  const trendColors = {
    blue: 'text-editorial-blue',
    amber: 'text-amber-600',
    green: 'text-green-600',
    gold: 'text-editorial-gold',
  }

  return (
    <div className="bg-editorial-white border border-editorial-gray-medium rounded-lg p-6 hover:shadow-md transition-shadow duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-sm font-medium text-editorial-gray-slate mb-1">
            {label}
          </p>
          <h3 className="text-3xl font-bold font-serif text-editorial-dark">
            {value}
          </h3>
        </div>
        <div className={`text-3xl w-12 h-12 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
      </div>

      {/* Footer - Change indicator */}
      <div className={`text-sm font-medium ${trendColors[color]}`}>
        {change.startsWith('+') || change.includes('+') ? '📈' : '📉'} {change}
      </div>
    </div>
  )
}
