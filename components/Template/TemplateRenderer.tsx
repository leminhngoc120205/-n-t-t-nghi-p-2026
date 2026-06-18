// Template Renderer - Main orchestration component

'use client'

import React, { useMemo } from 'react'
import {
  Template,
  ArticleData,
  TemplateBlock,
  RenderContext,
  RenderResult,
  BlockComponent,
} from '@/lib/templates/types'
import * as TemplateBlocks from './TemplateBlocks'

// ============================================================================
// BLOCK REGISTRY
// ============================================================================

/**
 * Registry of available block components
 */
const BLOCK_COMPONENTS: Record<string, React.FC<any>> = {
  // Text blocks
  title: TemplateBlocks.TitleBlock,
  subtitle: TemplateBlocks.TitleBlock,
  heading: TemplateBlocks.HeadingBlock,
  text: TemplateBlocks.TextBlock,
  metadata: TemplateBlocks.MetadataBlock,

  // Media blocks
  hero: TemplateBlocks.HeroBlock,
  image: TemplateBlocks.ImageBlock,
  gallery: TemplateBlocks.GalleryBlock,

  // Content blocks
  quote: TemplateBlocks.QuoteBlock,
  callout: TemplateBlocks.CalloutBlock,
  divider: TemplateBlocks.DividerBlock,

  // Special blocks
  'author-bio': TemplateBlocks.AuthorBioBlock,
  'related-articles': TemplateBlocks.RelatedArticlesBlock,
}

// ============================================================================
// TEMPLATE RENDERER
// ============================================================================

interface TemplateRendererProps {
  template: Template
  article: ArticleData
  customBlocks?: Record<string, React.FC<any>>
  theme?: 'light' | 'dark'
  responsive?: boolean
  onError?: (error: Error, block: TemplateBlock) => void
}

/**
 * Main Template Renderer Component
 * Orchestrates rendering of template blocks
 */
export const TemplateRenderer: React.FC<TemplateRendererProps> = ({
  template,
  article,
  customBlocks = {},
  theme = 'light',
  responsive = true,
  onError,
}) => {
  // Merge custom blocks with default blocks
  const allBlocks = useMemo(
    () => ({ ...BLOCK_COMPONENTS, ...customBlocks }),
    [customBlocks]
  )

  // Extract data for blocks
  const blockDataMap = useMemo(() => {
    return new Map(
      template.blocks.map((block) => [
        block.id,
        extractBlockData(article, block),
      ])
    )
  }, [article, template.blocks])

  // Render a single block
  const renderBlock = (block: TemplateBlock) => {
    try {
      const BlockComponent = allBlocks[block.type]

      if (!BlockComponent) {
        console.warn(`Block component not found: ${block.type}`)
        return null
      }

      const blockData = blockDataMap.get(block.id) || {}

      return (
        <BlockComponent
          key={block.id}
          id={block.id}
          type={block.type}
          config={block.config}
          layout={block.layout}
          styling={block.styling}
          data={blockData}
          articleData={article}
        />
      )
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error))
      onError?.(err, block)
      console.error(`Error rendering block ${block.id}:`, err)
      return <BlockErrorFallback blockId={block.id} error={err.message} />
    }
  }

  return (
    <article
      className={`template-renderer ${theme === 'dark' ? 'dark' : 'light'}`}
      data-template={template.id}
    >
      {template.blocks.map(renderBlock)}
    </article>
  )
}

// ============================================================================
// DATA EXTRACTION UTILITIES
// ============================================================================

/**
 * Extract relevant data from article for a specific block
 */
function extractBlockData(article: ArticleData, block: TemplateBlock): Record<string, any> {
  const { type, config } = block

  switch (type) {
    // Text blocks - extract from article
    case 'title':
      return { title: article.title, text: article.title }

    case 'subtitle':
      return { title: article.subtitle, text: article.subtitle }

    case 'text': {
      // Get text content from article content blocks
      const textBlocks = article.content.filter((b) => b.type === 'paragraph')
      const idx = article.content.indexOf(block as any)
      return {
        text: textBlocks[idx]?.data.text || article.excerpt,
      }
    }

    case 'heading': {
      const headingBlocks = article.content.filter((b) => b.type === 'heading')
      return {
        text: headingBlocks[0]?.data.text || '',
        heading: headingBlocks[0]?.data.text || '',
      }
    }

    case 'metadata':
      return {
        category: article.category,
        author: article.author.name,
        date: article.publishedAt,
        readTime: article.readTime,
      }

    // Media blocks
    case 'hero':
      return {
        image: article.featuredImage,
        title: article.title,
        subtitle: article.subtitle,
        category: article.category,
        byline: `By ${article.author.name}`,
      }

    case 'image': {
      const imageBlock = article.content.find((b) => b.type === 'image')
      return {
        url: imageBlock?.data.url || article.featuredImage,
        alt: imageBlock?.data.alt || article.title,
        caption: imageBlock?.data.caption || '',
        credit: imageBlock?.data.credit || article.author.name,
      }
    }

    case 'gallery': {
      const galleryBlock = article.content.find((b) => b.type === 'gallery')
      return {
        images: galleryBlock?.data.images || [
          { url: article.featuredImage, alt: article.title },
        ],
      }
    }

    case 'video': {
      const videoBlock = article.content.find((b) => b.type === 'video')
      return {
        videoId: videoBlock?.data.videoId || '',
        provider: videoBlock?.data.provider || 'youtube',
        caption: videoBlock?.data.caption || '',
      }
    }

    // Content blocks
    case 'quote': {
      const quoteBlock = article.content.find((b) => b.type === 'quote')
      return {
        text: quoteBlock?.data.text || '',
        quote: quoteBlock?.data.quote || '',
        source: quoteBlock?.data.source || article.author.name,
      }
    }

    case 'callout': {
      const calloutBlock = article.content.find((b) => b.type === 'custom')
      return {
        text: calloutBlock?.data.text || '',
        title: calloutBlock?.data.title || 'Important',
        content: calloutBlock?.data.content || '',
      }
    }

    // Special blocks
    case 'author-bio':
      return {
        author: article.author,
      }

    case 'related-articles': {
      // This would normally fetch from API or context
      // For now, return empty - to be populated by parent
      return {
        articles: [],
      }
    }

    default:
      return {}
  }
}

// ============================================================================
// ERROR FALLBACK COMPONENT
// ============================================================================

interface BlockErrorFallbackProps {
  blockId: string
  error: string
}

const BlockErrorFallback: React.FC<BlockErrorFallbackProps> = ({ blockId, error }) => {
  return (
    <div className="max-w-3xl mx-auto my-6 p-4 border-l-4 border-red-500 bg-red-50 rounded">
      <p className="text-sm text-red-700">
        <strong>Error rendering block:</strong> {blockId}
      </p>
      <p className="text-xs text-red-600 mt-1">{error}</p>
    </div>
  )
}

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

/**
 * Default template definitions
 */
export const DEFAULT_TEMPLATES: Record<string, Template> = {
  'feature-story-v1': {
    id: 'feature-story-v1',
    name: 'Feature Story',
    category: 'feature',
    description: 'Long-form investigative journalism with rich media',
    version: '1.0',
    blocks: [
      {
        id: 'hero',
        type: 'hero',
        config: { alignment: 'center', overlayOpacity: 0.3 },
        layout: { width: 'full', margin: 'none', spacing: 40 },
      },
      {
        id: 'metadata',
        type: 'metadata',
        config: { showCategory: true, showDate: true, showAuthor: true },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'title',
        type: 'title',
        config: { level: 'h1', alignment: 'left' },
        layout: { width: 'content', margin: 'medium', spacing: 16 },
      },
      {
        id: 'subtitle',
        type: 'subtitle',
        config: { level: 'h2', alignment: 'left' },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'body-1',
        type: 'text',
        config: { columns: 1, dropCap: true },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'quote-1',
        type: 'quote',
        config: { style: 'pullquote', alignment: 'center' },
        layout: { width: 'narrow', margin: 'large', spacing: 32 },
      },
      {
        id: 'body-2',
        type: 'text',
        config: { columns: 1 },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'image-1',
        type: 'image',
        config: { width: 'wide', aspectRatio: '16:9', caption: true },
        layout: { width: 'wide', margin: 'large', spacing: 32 },
      },
      {
        id: 'related',
        type: 'related-articles',
        config: { count: 3, layout: 'grid', columns: 3 },
        layout: { width: 'content', margin: 'large', spacing: 32 },
      },
      {
        id: 'author-bio',
        type: 'author-bio',
        config: { layout: 'horizontal', photoSize: 'medium' },
        layout: { width: 'content', margin: 'large', spacing: 0 },
      },
    ],
    metadata: {
      minReadTime: 5,
      maxReadTime: 20,
      bestFor: ['investigative reporting', 'long-form journalism'],
    },
  },

  'news-brief-v1': {
    id: 'news-brief-v1',
    name: 'News Brief',
    category: 'news',
    description: 'Quick-format breaking news',
    version: '1.0',
    blocks: [
      {
        id: 'metadata',
        type: 'metadata',
        config: { showCategory: true, showDate: true, showAuthor: true },
        layout: { width: 'content', margin: 'medium', spacing: 16 },
      },
      {
        id: 'title',
        type: 'title',
        config: { level: 'h1', alignment: 'center' },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'body',
        type: 'text',
        config: { columns: 1 },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'image',
        type: 'image',
        config: { width: 'normal', caption: true },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'related',
        type: 'related-articles',
        config: { count: 2, layout: 'grid', columns: 2 },
        layout: { width: 'content', margin: 'large', spacing: 0 },
      },
    ],
    metadata: {
      minReadTime: 1,
      maxReadTime: 5,
      bestFor: ['breaking news', 'quick updates'],
    },
  },

  'opinion-v1': {
    id: 'opinion-v1',
    name: 'Opinion Piece',
    category: 'opinion',
    description: 'Editorial commentary and perspective',
    version: '1.0',
    blocks: [
      {
        id: 'metadata',
        type: 'metadata',
        config: { showCategory: true, showDate: true, showAuthor: true },
        layout: { width: 'content', margin: 'medium', spacing: 16 },
      },
      {
        id: 'title',
        type: 'title',
        config: { level: 'h1', alignment: 'left' },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'body-1',
        type: 'text',
        config: { columns: 1, dropCap: true },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'callout-1',
        type: 'callout',
        config: { type: 'info' },
        layout: { width: 'narrow', margin: 'medium', spacing: 24 },
      },
      {
        id: 'body-2',
        type: 'text',
        config: { columns: 1 },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'author-bio',
        type: 'author-bio',
        config: { layout: 'horizontal' },
        layout: { width: 'content', margin: 'large', spacing: 0 },
      },
    ],
    metadata: {
      minReadTime: 3,
      maxReadTime: 10,
      bestFor: ['opinion', 'commentary', 'editorial'],
    },
  },

  'visual-story-v1': {
    id: 'visual-story-v1',
    name: 'Visual Story',
    category: 'visual',
    description: 'Photo-first storytelling',
    version: '1.0',
    blocks: [
      {
        id: 'hero',
        type: 'hero',
        config: { alignment: 'center', minHeight: 500 },
        layout: { width: 'full', margin: 'none', spacing: 32 },
      },
      {
        id: 'title',
        type: 'title',
        config: { level: 'h1', alignment: 'center' },
        layout: { width: 'content', margin: 'large', spacing: 24 },
      },
      {
        id: 'body',
        type: 'text',
        config: { columns: 1 },
        layout: { width: 'content', margin: 'medium', spacing: 24 },
      },
      {
        id: 'gallery-1',
        type: 'gallery',
        config: { layout: 'grid', columns: 3 },
        layout: { width: 'content', margin: 'large', spacing: 32 },
      },
      {
        id: 'author-bio',
        type: 'author-bio',
        config: { layout: 'horizontal' },
        layout: { width: 'content', margin: 'large', spacing: 0 },
      },
    ],
    metadata: {
      minReadTime: 2,
      maxReadTime: 8,
      bestFor: ['photo essays', 'visual storytelling', 'galleries'],
    },
  },
}

// ============================================================================
// TEMPLATE HOOK
// ============================================================================

/**
 * Hook for using templates in components
 */
export const useTemplate = (templateId: string) => {
  return useMemo(() => {
    return DEFAULT_TEMPLATES[templateId] || null
  }, [templateId])
}

/**
 * Get all available templates
 */
export const getAvailableTemplates = () => {
  return Object.values(DEFAULT_TEMPLATES)
}

/**
 * Get templates by category
 */
export const getTemplatesByCategory = (
  category: string
) => {
  return Object.values(DEFAULT_TEMPLATES).filter(
    (t) => t.category === category
  )
}
