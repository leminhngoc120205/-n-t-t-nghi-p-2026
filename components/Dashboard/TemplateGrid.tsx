'use client'

import React from 'react'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  uses: number
}

interface TemplateGridProps {
  templates: Template[]
}

export const TemplateGrid: React.FC<TemplateGridProps> = ({ templates }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Link
          key={template.id}
          href={`/editor?template=${template.id}`}
          className="
            group block bg-editorial-white border border-editorial-gray-medium
            rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300
            hover:border-editorial-blue
          "
        >
          {/* Thumbnail */}
          <div className="aspect-video bg-gradient-to-br from-editorial-light to-editorial-gray-light flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-300">
            {template.thumbnail}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Category Badge */}
            <div className="mb-3">
              <span className="text-xs font-bold px-2 py-1 rounded bg-blue-50 text-editorial-blue uppercase tracking-wide">
                {template.category}
              </span>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold font-serif text-editorial-dark mb-2 group-hover:text-editorial-blue transition-colors line-clamp-2">
              {template.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-editorial-gray-slate mb-4 line-clamp-2">
              {template.description}
            </p>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-editorial-gray-light">
              <span className="text-xs text-editorial-gray-slate">
                📊 Used {template.uses} times
              </span>
              <span className="text-editorial-blue font-semibold text-sm group-hover:translate-x-1 transition-transform">
                Use →
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
