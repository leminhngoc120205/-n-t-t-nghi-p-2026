'use client'

import React from 'react'
import Link from 'next/link'

interface QuickAction {
  icon: string
  label: string
  description: string
  href: string
  color: string
}

export const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      icon: '✍️',
      label: 'Write New Article',
      description: 'Start a fresh piece from scratch',
      href: '/editor',
      color: 'from-editorial-blue to-blue-600',
    },
    {
      icon: '🎨',
      label: 'Choose Template',
      description: 'Pick a template to get started',
      href: '/dashboard/templates',
      color: 'from-editorial-gold to-yellow-500',
    },
    {
      icon: '📋',
      label: 'View Drafts',
      description: 'Continue working on drafts',
      href: '/dashboard/drafts',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: '📊',
      label: 'View Analytics',
      description: 'Check article performance',
      href: '/dashboard/analytics',
      color: 'from-green-500 to-emerald-600',
    },
  ]

  return (
    <div className="bg-editorial-white border border-editorial-gray-medium rounded-lg p-6">
      <h3 className="text-lg font-bold text-editorial-dark mb-4 font-serif">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            href={action.href}
            className={`
              group relative p-5 rounded-lg
              bg-gradient-to-br ${action.color}
              text-white overflow-hidden
              hover:shadow-lg transition-all duration-300 hover:scale-105
            `}
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity" />

            {/* Content */}
            <div className="relative">
              <div className="text-3xl mb-3">{action.icon}</div>
              <h4 className="font-bold text-sm mb-1">{action.label}</h4>
              <p className="text-xs opacity-90">{action.description}</p>
            </div>

            {/* Arrow indicator */}
            <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
              →
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
