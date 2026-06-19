// Template System Type Definitions

// ============================================================================
// CORE TYPES
// ============================================================================

/**
 * Article content block (raw content)
 */
export interface ArticleData {
  id: string
  title: string
  subtitle?: string
  excerpt: string
  content: ContentBlock[]
  author: AuthorInfo
  category: string
  tags: string[]
  featuredImage: string
  publishedAt: string
  updatedAt?: string
  readTime: number
  status: 'draft' | 'published' | 'archived'
  metadata?: Record<string, any>
  seo?: SEOMetadata
}

/**
 * Individual content block in article
 */
export interface ContentBlock {
  id: string
  type: ContentBlockType
  data: Record<string, any>
  position: number
}

/**
 * Types of content blocks
 */
export type ContentBlockType =
  | 'paragraph'
  | 'heading'
  | 'image'
  | 'gallery'
  | 'video'
  | 'quote'
  | 'code'
  | 'list'
  | 'table'
  | 'embed'
  | 'divider'
  | 'custom'

/**
 * Author information
 */
export interface AuthorInfo {
  id: string
  name: string
  email: string
  bio?: string
  photo?: string
  social?: {
    twitter?: string
    linkedin?: string
    instagram?: string
    website?: string
  }
  role: string
}

/**
 * SEO metadata
 */
export interface SEOMetadata {
  metaDescription?: string
  keywords?: string[]
  ogImage?: string
  ogTitle?: string
  canonicalUrl?: string
}

// ============================================================================
// TEMPLATE TYPES
// ============================================================================

/**
 * Template definition
 */
export interface Template {
  id: string
  name: string
  category: TemplateCategory
  description: string
  thumbnail?: string
  blocks: TemplateBlock[]
  metadata: TemplateMetadata
  createdAt?: string
  updatedAt?: string
  version: string
}

/**
 * Template categories
 */
export type TemplateCategory =
  | 'feature'
  | 'news'
  | 'opinion'
  | 'visual'
  | 'data'
  | 'interview'
  | 'custom'

/**
 * Template block definition
 */
export interface TemplateBlock {
  id: string
  type: BlockType
  config: BlockConfig
  layout: LayoutOptions
  styling?: StyleOptions
  conditions?: BlockCondition[]
}

/**
 * Block types available in templates
 */
export type BlockType =
  // Text blocks
  | 'title'
  | 'subtitle'
  | 'heading'
  | 'text'
  | 'metadata'
  // Media blocks
  | 'hero'
  | 'image'
  | 'gallery'
  | 'video'
  | 'carousel'
  // Content blocks
  | 'quote'
  | 'callout'
  | 'divider'
  | 'timeline'
  | 'facts-list'
  // Special blocks
  | 'author-bio'
  | 'related-articles'
  | 'table'
  | 'chart'
  | 'map'
  | 'custom'

/**
 * Block configuration (type-specific)
 */
export type BlockConfig =
  | TitleBlockConfig
  | TextBlockConfig
  | ImageBlockConfig
  | GalleryBlockConfig
  | QuoteBlockConfig
  | CalloutBlockConfig
  | VideoBlockConfig
  | HeroBlockConfig
  | AuthorBioBlockConfig
  | RelatedBlockConfig
  | TimelineBlockConfig
  | FactsListBlockConfig
  | MetadataBlockConfig
  | DividerBlockConfig
  | CustomBlockConfig

/**
 * Template metadata
 */
export interface TemplateMetadata {
  minReadTime: number
  maxReadTime: number
  bestFor: string[]
  tags?: string[]
  author?: string
  usageCount?: number
}

/**
 * Conditional rendering for blocks
 */
export interface BlockCondition {
  field: string
  operator: 'exists' | 'empty' | 'equals' | 'contains'
  value?: any
}

// ============================================================================
// BLOCK CONFIGS
// ============================================================================

/**
 * Title block config
 */
export interface TitleBlockConfig {
  level: 'h1' | 'h2' | 'h3'
  alignment?: 'left' | 'center' | 'right'
  maxWidth?: number
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
}

/**
 * Text/paragraph block config
 */
export interface TextBlockConfig {
  dropCap?: boolean
  maxWidth?: number
  columns?: 1 | 2 | 3
  hyphenation?: boolean
  justify?: boolean
}

/**
 * Image block config
 */
export interface ImageBlockConfig {
  width: 'full' | 'wide' | 'normal' | 'narrow'
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:4' | 'auto'
  caption?: boolean
  credit?: boolean
  lightbox?: boolean
  lazy?: boolean
  animation?: 'none' | 'fade' | 'zoom' | 'slide'
}

/**
 * Gallery block config
 */
export interface GalleryBlockConfig {
  layout: 'grid' | 'carousel' | 'masonry' | 'slideshow'
  columns?: number
  gap?: 'small' | 'medium' | 'large'
  responsiveColumns?: {
    mobile: number
    tablet: number
    desktop: number
  }
  lightbox?: boolean
}

/**
 * Quote/pullquote block config
 */
export interface QuoteBlockConfig {
  style: 'pullquote' | 'blockquote' | 'callout'
  alignment?: 'left' | 'center' | 'right'
  fontSize?: number
  source?: boolean
  animation?: boolean
}

/**
 * Callout block config
 */
export interface CalloutBlockConfig {
  type: 'info' | 'warning' | 'success' | 'tip' | 'custom'
  icon?: string
  title?: boolean
  backgroundColor?: string
  borderColor?: string
  borderLeft?: boolean
}

/**
 * Video block config
 */
export interface VideoBlockConfig {
  provider: 'youtube' | 'vimeo' | 'custom'
  videoId?: string
  url?: string
  aspectRatio?: '16:9' | '4:3' | '1:1'
  autoplay?: boolean
  controls?: boolean
  caption?: boolean
  thumbnail?: string
}

/**
 * Hero section config
 */
export interface HeroBlockConfig {
  alignment: 'center' | 'left' | 'right'
  overlayOpacity?: number
  overlayColor?: string
  minHeight?: number
  contentPosition?: 'top' | 'middle' | 'bottom'
  gradient?: boolean
}

/**
 * Author bio block config
 */
export interface AuthorBioBlockConfig {
  layout: 'horizontal' | 'vertical'
  photoSize?: 'small' | 'medium' | 'large'
  showSocial?: boolean
  showRole?: boolean
  borderTop?: boolean
  backgroundColor?: string
}

/**
 * Related articles block config
 */
export interface RelatedBlockConfig {
  count: number
  layout: 'grid' | 'carousel'
  columns?: number
  filter?: {
    category?: string
    tags?: string[]
    excludeCurrentId?: boolean
  }
  cardStyle?: 'minimal' | 'detailed'
}

/**
 * Timeline block config
 */
export interface TimelineBlockConfig {
  direction?: 'vertical' | 'horizontal'
  style?: 'line' | 'dots' | 'solid'
  items: TimelineItem[]
}

/**
 * Timeline item
 */
export interface TimelineItem {
  date: string
  title: string
  description?: string
  icon?: string
  imageUrl?: string
}

/**
 * Facts list block config
 */
export interface FactsListBlockConfig {
  layout?: 'list' | 'grid'
  columns?: 1 | 2 | 3
  style?: 'bullets' | 'numbers' | 'checkmarks' | 'none'
  backgroundColor?: string
  items: FactItem[]
}

/**
 * Fact item
 */
export interface FactItem {
  title: string
  description?: string
  value?: string | number
  icon?: string
}

/**
 * Metadata block config (author, date, etc.)
 */
export interface MetadataBlockConfig {
  showCategory?: boolean
  showDate?: boolean
  showAuthor?: boolean
  showReadTime?: boolean
  showUpdated?: boolean
  dateFormat?: string
}

/**
 * Divider block config
 */
export interface DividerBlockConfig {
  style?: 'line' | 'dots' | 'text' | 'graphic'
  color?: string
  text?: string
  margin?: 'small' | 'medium' | 'large'
}

/**
 * Custom block config (extensible)
 */
export interface CustomBlockConfig {
  component: string
  props?: Record<string, any>
}

// ============================================================================
// LAYOUT & STYLING
// ============================================================================

/**
 * Layout options for blocks
 */
export interface LayoutOptions {
  width?: 'full' | 'content' | 'narrow' | 'auto' | 'wide'
  margin?: 'none' | 'small' | 'medium' | 'large' | number
  padding?: 'none' | 'small' | 'medium' | 'large' | number
  spacing?: number // margin-bottom in px
  alignItems?: 'start' | 'center' | 'end'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between'
  responsive?: {
    mobile?: Partial<LayoutOptions>
    tablet?: Partial<LayoutOptions>
    desktop?: Partial<LayoutOptions>
  }
}

/**
 * Styling options for blocks
 */
export interface StyleOptions {
  text?: TextStyle
  box?: BoxStyle
  responsive?: {
    mobile?: Partial<StyleOptions>
    tablet?: Partial<StyleOptions>
    desktop?: Partial<StyleOptions>
  }
}

/**
 * Text styling
 */
export interface TextStyle {
  fontSize?: number | string
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold' | number
  lineHeight?: number | string
  letterSpacing?: number
  color?: string
  fontFamily?: 'serif' | 'sans-serif' | 'monospace' | string
  alignment?: 'left' | 'center' | 'right' | 'justify'
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
  textDecoration?: 'none' | 'underline' | 'line-through'
  fontStyle?: 'normal' | 'italic'
}

/**
 * Box styling
 */
export interface BoxStyle {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderStyle?: 'solid' | 'dashed' | 'dotted' | 'double'
  borderRadius?: number | string
  padding?: number | string
  margin?: number | string
  boxShadow?: string
  opacity?: number
  display?: 'block' | 'inline-block' | 'flex' | 'grid'
  gap?: number | string
}

// ============================================================================
// RENDERED OUTPUT
// ============================================================================

/**
 * Block props for rendering
 */
export interface RenderedBlockProps {
  id: string
  type: BlockType
  config: BlockConfig
  layout: LayoutOptions
  styling?: StyleOptions
  data: Record<string, any>
  articleData: ArticleData
}

/**
 * Renderer output
 */
export interface RendererOutput {
  html: string
  blocks: RenderedBlock[]
  metadata: Record<string, any>
}

/**
 * Rendered block
 */
export interface RenderedBlock {
  id: string
  type: BlockType
  html: string
  errors?: string[]
}

// ============================================================================
// TEMPLATE REGISTRY
// ============================================================================

/**
 * Template registry for managing templates
 */
export interface TemplateRegistry {
  templates: Map<string, Template>
  blocks: Map<string, BlockComponent>
  register: (template: Template) => void
  unregister: (templateId: string) => void
  get: (templateId: string) => Template | undefined
  list: (category?: TemplateCategory) => Template[]
  validate: (template: Template) => ValidationResult
}

/**
 * Block component for rendering
 */
export interface BlockComponent {
  type: BlockType
  render: (props: RenderedBlockProps) => React.ReactNode
  validate?: (config: BlockConfig) => ValidationResult
  schema?: Record<string, any>
}

/**
 * Validation result
 */
export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationWarning[]
}

/**
 * Validation error
 */
export interface ValidationError {
  field: string
  message: string
  code: string
}

/**
 * Validation warning
 */
export interface ValidationWarning {
  field: string
  message: string
}

// ============================================================================
// RENDERER CONTEXT
// ============================================================================

/**
 * Context for template rendering
 */
export interface RenderContext {
  template: Template
  articleData: ArticleData
  blocks: Map<string, BlockComponent>
  config?: RenderConfig
  options?: RenderOptions
}

/**
 * Render configuration
 */
export interface RenderConfig {
  theme?: 'light' | 'dark'
  breakpoint?: 'mobile' | 'tablet' | 'desktop'
  preloadImages?: boolean
  lazyLoadImages?: boolean
  responsive?: boolean
}

/**
 * Render options
 */
export interface RenderOptions {
  debug?: boolean
  validateSchema?: boolean
  sanitizeHtml?: boolean
  includeMetadata?: boolean
  customBlocks?: Map<string, BlockComponent>
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Extract data from article for a specific block
 */
export interface BlockDataExtractor {
  (articleData: ArticleData, config: BlockConfig): Record<string, any>
}

/**
 * Template options for rendering
 */
export interface TemplateRenderOptions {
  template: Template | string // template ID or object
  article: ArticleData
  customBlocks?: Map<string, BlockComponent>
  theme?: 'light' | 'dark'
  responsive?: boolean
  onError?: (error: Error, block: TemplateBlock) => void
}

/**
 * Response from renderer
 */
export interface RenderResult {
  success: boolean
  html?: string
  error?: string
  blocks?: RenderedBlock[]
  metadata?: {
    renderTime: number
    blockCount: number
    errors: number
    warnings: number
  }
}
