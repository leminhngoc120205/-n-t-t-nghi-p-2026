// Example Template Page Implementation

'use client'

import React, { useState, useEffect } from 'react'
import { TemplateRenderer, DEFAULT_TEMPLATES } from '@/components/Template/TemplateRenderer'
import { ArticleData, Template } from '@/lib/templates/types'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface TemplatePageProps {
  articleId: string
  templateId?: string
}

/**
 * Example page component using the template system
 */
export default function TemplateArticlePage({ articleId, templateId = 'feature-story-v1' }: TemplatePageProps) {
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Load article from API
        const articleRes = await fetch(`/api/articles/${articleId}`)
        if (!articleRes.ok) throw new Error('Failed to load article')
        const articleData = await articleRes.json()
        setArticle(articleData)

        // Load template
        const selectedTemplate = DEFAULT_TEMPLATES[templateId]
        if (!selectedTemplate) {
          throw new Error(`Template not found: ${templateId}`)
        }
        setTemplate(selectedTemplate)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load content')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [articleId, templateId])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorDisplay message={error} />
  if (!article || !template) return <div>Content not found</div>

  return (
    <div className="bg-editorial-light min-h-screen">
      <TemplateRenderer
        template={template}
        article={article}
        responsive={true}
      />
    </div>
  )
}

// Simple loading spinner component
const ErrorDisplay = ({ message }: { message: string }) => (
  <div className="max-w-3xl mx-auto p-6 mt-10 bg-red-50 border border-red-200 rounded-lg">
    <p className="text-red-700">{message}</p>
  </div>
)
