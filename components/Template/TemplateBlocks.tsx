// Template Block Components

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RenderedBlockProps } from '@/lib/templates/types'

// ============================================================================
// TEXT BLOCKS
// ============================================================================

/**
 * Title Block Component
 */
export const TitleBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
  styling,
}) => {
  const { level = 'h1', alignment = 'left' } = config as any

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
    auto: 'w-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[alignment]

  const headingClasses = {
    h1: 'text-5xl md:text-6xl font-bold font-serif leading-tight text-editorial-dark',
    h2: 'text-4xl md:text-5xl font-bold font-serif leading-tight text-editorial-dark',
    h3: 'text-3xl md:text-4xl font-bold font-serif leading-tight text-editorial-dark',
  }

  const Element = level as keyof JSX.IntrinsicElements
  const className = `${headingClasses[level]} ${alignClass}`

  return (
    <div className={`${widthClass} ${marginClass}`}>
      {React.createElement(Element, { className }, data.title || data.text)}
    </div>
  )
}

/**
 * Text Block Component
 */
export const TextBlock: React.FC<RenderedBlockProps> = ({
  data,
  layout,
  config,
}) => {
  const { columns = 1, dropCap = false } = config as any

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
    auto: 'w-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  const columnClass =
    columns > 1
      ? `md:columns-${columns} md:gap-6 md:space-y-0`
      : 'columns-1'

  return (
    <div className={`${widthClass} ${marginClass}`}>
      <p
        className={`
          text-base md:text-lg leading-8 text-editorial-dark
          font-sans font-normal
          ${columnClass}
        `}
      >
        {dropCap && data.text && (
          <>
            <span className="float-left text-6xl font-bold leading-none pr-2">
              {data.text[0]}
            </span>
          </>
        )}
        {dropCap ? data.text?.substring(1) : data.text}
      </p>
    </div>
  )
}

/**
 * Heading Block Component
 */
export const HeadingBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
}) => {
  const { level = 'h2', divider = 'bottom' } = config as any

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  const headingClasses = {
    h2: 'text-3xl md:text-4xl',
    h3: 'text-2xl md:text-3xl',
    h4: 'text-xl md:text-2xl',
  }

  const Element = level as keyof JSX.IntrinsicElements

  return (
    <div className={`${widthClass} ${marginClass}`}>
      {divider === 'top' || divider === 'both' ? (
        <div className="border-t-2 border-editorial-gold mb-4" />
      ) : null}

      {React.createElement(
        Element,
        {
          className: `${headingClasses[level]} font-bold font-serif text-editorial-dark`,
        },
        data.text || data.heading
      )}

      {divider === 'bottom' || divider === 'both' ? (
        <div className="border-b-2 border-editorial-gold mt-4" />
      ) : null}
    </div>
  )
}

// ============================================================================
// MEDIA BLOCKS
// ============================================================================

/**
 * Image Block Component
 */
export const ImageBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
}) => {
  const { width = 'normal', caption = true, lightbox = false } =
    config as any

  const widthClass = {
    full: 'w-full',
    wide: 'w-11/12 mx-auto',
    normal: 'w-5/6 mx-auto',
    narrow: 'w-2/3 mx-auto',
  }[width]

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  return (
    <figure className={`${widthClass} ${marginClass}`}>
      <div className="relative bg-editorial-light rounded-lg overflow-hidden">
        <Image
          src={data.url || data.src}
          alt={data.alt || 'Article image'}
          width={800}
          height={600}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,..."
          className="w-full h-auto"
        />
      </div>

      {caption && data.caption && (
        <figcaption className="mt-3 text-sm text-editorial-gray-slate italic">
          {data.caption}
          {data.credit && <span className="block mt-1">📷 {data.credit}</span>}
        </figcaption>
      )}
    </figure>
  )
}

/**
 * Gallery Block Component
 */
export const GalleryBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
}) => {
  const { layout: galleryLayout = 'grid', columns = 3 } = config as any
  const images = data.images || []

  const widthClass = {
    full: 'w-full',
    content: 'max-w-4xl mx-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  if (galleryLayout === 'grid') {
    return (
      <div className={`${widthClass} ${marginClass}`}>
        <div className={`grid grid-cols-1 md:grid-cols-${columns} gap-4`}>
          {images.map((image: any, idx: number) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.alt || `Gallery item ${idx + 1}`}
                fill
                className="object-cover w-full h-full"
              />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Carousel layout (simplified)
  return (
    <div className={`${widthClass} ${marginClass} overflow-x-auto flex gap-4`}>
      {images.map((image: any, idx: number) => (
        <div key={idx} className="flex-shrink-0 w-96 h-64 rounded-lg overflow-hidden">
          <Image
            src={image.url}
            alt={image.alt || `Gallery item ${idx + 1}`}
            width={400}
            height={300}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  )
}

/**
 * Hero Block Component
 */
export const HeroBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
}) => {
  const { alignment = 'center', overlayOpacity = 0.3, minHeight = 400 } =
    config as any

  const alignClass = {
    center: 'items-center justify-center',
    left: 'items-center justify-start',
    right: 'items-center justify-end',
  }[alignment]

  return (
    <div
      className={`relative w-full ${alignClass} flex`}
      style={{ minHeight: `${minHeight}px` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.image || data.src}
          alt={data.alt || 'Hero image'}
          fill
          className="object-cover w-full h-full"
        />
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{ opacity: overlayOpacity }}
      />

      {/* Content */}
      <div className="relative z-20 text-white text-center px-6 md:px-12 max-w-2xl">
        {data.category && (
          <span className="inline-block px-3 py-1 mb-4 text-xs font-bold bg-editorial-gold text-editorial-dark uppercase rounded">
            {data.category}
          </span>
        )}
        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-4 leading-tight">
          {data.title}
        </h1>
        {data.subtitle && (
          <p className="text-xl md:text-2xl font-light mb-4">{data.subtitle}</p>
        )}
        {data.byline && (
          <p className="text-sm uppercase tracking-wide opacity-90">
            {data.byline}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// CONTENT BLOCKS
// ============================================================================

/**
 * Quote/Pullquote Block Component
 */
export const QuoteBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
}) => {
  const {
    style = 'pullquote',
    alignment = 'center',
    fontSize = 24,
  } = config as any

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
  }[layout?.width || 'narrow']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-8'

  if (style === 'pullquote') {
    return (
      <div className={`${widthClass} ${marginClass}`}>
        <blockquote
          className={`
            text-${Math.round(fontSize / 4)} md:text-${Math.round((fontSize * 1.5) / 4)}
            font-bold font-serif text-editorial-blue
            border-l-4 border-editorial-gold pl-6
            italic py-4
            ${alignment === 'center' ? 'text-center border-l-0 border-t-4' : ''}
          `}
        >
          "{data.text || data.quote}"
        </blockquote>
        {data.source && (
          <p className={`mt-3 text-sm text-editorial-gray-slate ${alignment === 'center' ? 'text-center' : ''}`}>
            — {data.source}
          </p>
        )}
      </div>
    )
  }

  // Blockquote style
  return (
    <div className={`${widthClass} ${marginClass}`}>
      <blockquote className="border-l-4 border-editorial-blue pl-6 italic py-4 text-editorial-dark">
        {data.text || data.quote}
      </blockquote>
      {data.source && <p className="mt-2 text-sm text-editorial-gray-slate">— {data.source}</p>}
    </div>
  )
}

/**
 * Callout Block Component
 */
export const CalloutBlock: React.FC<RenderedBlockProps> = ({
  data,
  config,
  layout,
}) => {
  const { type = 'info', icon = 'ℹ️' } = config as any

  const bgClass = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    success: 'bg-green-50 border-green-200 text-green-900',
    tip: 'bg-purple-50 border-purple-200 text-purple-900',
  }[type]

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  return (
    <div className={`${widthClass} ${marginClass}`}>
      <div className={`border-l-4 border-current p-4 md:p-6 rounded ${bgClass}`}>
        <div className="flex gap-3">
          <span className="text-2xl flex-shrink-0">{icon}</span>
          <div>
            {data.title && <h4 className="font-bold mb-2">{data.title}</h4>}
            <p>{data.text || data.content}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Divider Block Component
 */
export const DividerBlock: React.FC<RenderedBlockProps> = ({
  config,
  layout,
}) => {
  const { style = 'line', text } = config as any

  const marginClass = {
    none: 'm-0',
    small: 'my-2',
    medium: 'my-4 md:my-6',
    large: 'my-6 md:my-8',
  }[layout?.margin as string] || 'my-8'

  if (style === 'dots') {
    return (
      <div className={`${marginClass} text-center text-editorial-gold text-3xl tracking-widest`}>
        • • •
      </div>
    )
  }

  if (style === 'text' && text) {
    return (
      <div className={`${marginClass} flex items-center gap-4`}>
        <div className="flex-1 border-t border-editorial-gray-medium" />
        <span className="text-sm text-editorial-gray-slate uppercase">{text}</span>
        <div className="flex-1 border-t border-editorial-gray-medium" />
      </div>
    )
  }

  return (
    <div className={`${marginClass} border-t border-editorial-gray-medium`} />
  )
}

// ============================================================================
// SPECIAL BLOCKS
// ============================================================================

/**
 * Author Bio Block Component
 */
export const AuthorBioBlock: React.FC<RenderedBlockProps> = ({
  articleData,
  layout,
  config,
}) => {
  const { layout: bioLayout = 'horizontal' } = config as any
  const author = articleData.author

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-6'

  return (
    <div
      className={`${widthClass} ${marginClass} border-t border-editorial-gray-medium pt-6`}
    >
      <div
        className={
          bioLayout === 'horizontal'
            ? 'flex gap-6 items-start'
            : 'flex flex-col items-center text-center'
        }
      >
        {author.photo && (
          <div className="flex-shrink-0">
            <Image
              src={author.photo}
              alt={author.name}
              width={100}
              height={100}
              className="rounded-full"
            />
          </div>
        )}
        <div>
          <h3 className="text-lg font-bold font-serif text-editorial-dark">
            {author.name}
          </h3>
          {author.role && (
            <p className="text-sm text-editorial-gray-slate mb-2">{author.role}</p>
          )}
          {author.bio && (
            <p className="text-sm text-editorial-dark leading-relaxed">
              {author.bio}
            </p>
          )}
          {author.social && (
            <div className="flex gap-3 mt-3">
              {author.social.twitter && (
                <a href={author.social.twitter} className="text-editorial-blue hover:underline text-sm">
                  Twitter
                </a>
              )}
              {author.social.linkedin && (
                <a href={author.social.linkedin} className="text-editorial-blue hover:underline text-sm">
                  LinkedIn
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Related Articles Block Component
 */
export const RelatedArticlesBlock: React.FC<RenderedBlockProps> = ({
  data,
  layout,
}) => {
  const articles = data.articles || []

  const widthClass = {
    full: 'w-full',
    content: 'max-w-4xl mx-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-8'

  return (
    <div className={`${widthClass} ${marginClass}`}>
      <h3 className="text-2xl font-bold font-serif text-editorial-dark mb-6">
        Related Articles
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article: any, idx: number) => (
          <Link
            key={idx}
            href={`/articles/${article.id}`}
            className="group border border-editorial-gray-medium rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            {article.image && (
              <div className="relative h-48 bg-editorial-light overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
            )}
            <div className="p-4">
              <h4 className="font-bold text-editorial-dark group-hover:text-editorial-blue line-clamp-2">
                {article.title}
              </h4>
              <p className="text-xs text-editorial-gray-slate mt-2">
                {article.date} • {article.readTime} min read
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

/**
 * Metadata Block Component
 */
export const MetadataBlock: React.FC<RenderedBlockProps> = ({
  articleData,
  config,
  layout,
}) => {
  const {
    showCategory = true,
    showDate = true,
    showAuthor = true,
    showReadTime = true,
  } = config as any

  const widthClass = {
    full: 'w-full',
    content: 'max-w-3xl mx-auto',
    narrow: 'max-w-2xl mx-auto',
  }[layout?.width || 'content']

  const marginClass = {
    none: 'm-0',
    small: 'm-2',
    medium: 'm-4 md:m-6',
    large: 'm-6 md:m-8',
  }[layout?.margin as string] || 'my-4'

  return (
    <div className={`${widthClass} ${marginClass} text-center`}>
      {showCategory && (
        <span className="inline-block px-3 py-1 text-xs font-bold bg-editorial-gold text-editorial-dark uppercase rounded mb-3">
          {articleData.category}
        </span>
      )}
      <div className="flex flex-wrap justify-center gap-4 text-xs text-editorial-gray-slate uppercase tracking-wide">
        {showAuthor && <span>By {articleData.author.name}</span>}
        {showDate && <span>•</span>}
        {showDate && <span>{new Date(articleData.publishedAt).toLocaleDateString()}</span>}
        {showReadTime && <span>•</span>}
        {showReadTime && <span>{articleData.readTime} min read</span>}
      </div>
    </div>
  )
}
