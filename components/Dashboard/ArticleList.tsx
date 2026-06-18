'use client'

import React from 'react'
import Link from 'next/link'

interface Article {
  id: string
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  status: 'published' | 'draft'
  views: number
  readTime: number
}

interface ArticleListProps {
  articles: Article[]
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  return (
    <div className="space-y-4">
      {articles.map((article) => (
        <Link
          key={article.id}
          href={`/articles/${article.id}`}
          className="
            block group bg-editorial-white border border-editorial-gray-medium
            rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300
          "
        >
          <div className="flex gap-6 p-6">
            {/* Thumbnail */}
            <div className="w-32 h-32 rounded-lg overflow-hidden bg-editorial-light flex-shrink-0">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold font-serif text-editorial-dark group-hover:text-editorial-blue transition-colors flex-1 pr-4">
                    {article.title}
                  </h3>
                  <span
                    className={`
                      text-xs font-bold px-2 py-1 rounded whitespace-nowrap
                      ${
                        article.status === 'published'
                          ? 'bg-green-50 text-green-700'
                          : 'bg-amber-50 text-amber-700'
                      }
                    `}
                  >
                    {article.status === 'published' ? '✓ Published' : '✏️ Draft'}
                  </span>
                </div>
                <p className="text-editorial-gray-slate text-sm line-clamp-2">
                  {article.excerpt}
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-editorial-gray-light">
                <div className="flex items-center gap-6 text-xs text-editorial-gray-slate">
                  <span>By {article.author}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>👁️ {article.views.toLocaleString()} views</span>
                  <span>•</span>
                  <span>⏱️ {article.readTime} min read</span>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    // Edit action
                  }}
                  className="
                    px-4 py-2 text-sm font-medium text-editorial-blue
                    border border-editorial-blue rounded-lg
                    hover:bg-blue-50 transition-colors
                  "
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
