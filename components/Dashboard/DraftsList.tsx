'use client'

import React from 'react'
import Link from 'next/link'

interface DraftArticle {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  status: 'draft'
  progress: number
}

interface DraftsListProps {
  articles: DraftArticle[]
}

export const DraftsList: React.FC<DraftsListProps> = ({ articles }) => {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/editor/${article.id}`}
          className="
            block group bg-editorial-white border border-editorial-gray-medium
            rounded-lg p-6 hover:shadow-lg transition-all duration-300
          "
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-bold font-serif text-editorial-dark group-hover:text-editorial-blue transition-colors mb-2">
                {article.title}
              </h3>
              <p className="text-editorial-gray-slate text-sm mb-4 line-clamp-2">
                {article.excerpt}
              </p>
            </div>
            <span className="text-xs font-bold px-3 py-1 rounded whitespace-nowrap bg-amber-50 text-amber-700 ml-4">
              ✏️ Draft
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-editorial-gray-slate font-medium">
                Progress
              </span>
              <span className="text-xs font-bold text-editorial-gray-slate">
                {article.progress}%
              </span>
            </div>
            <div className="w-full h-2 bg-editorial-light rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-editorial-blue to-editorial-gold transition-all duration-500"
                style={{ width: `${article.progress}%` }}
              />
            </div>
          </div>

          {/* Meta and Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-editorial-gray-light">
            <div className="text-xs text-editorial-gray-slate">
              <span>By {article.author}</span>
              <span className="mx-2">•</span>
              <span>Last edited {article.date}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  // Continue editing
                }}
                className="
                  px-4 py-2 text-sm font-medium text-white
                  bg-editorial-blue rounded-lg
                  hover:bg-editorial-blue-dark transition-colors
                "
              >
                Continue
              </button>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
