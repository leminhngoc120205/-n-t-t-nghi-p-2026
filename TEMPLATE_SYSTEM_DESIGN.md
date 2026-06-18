# Template Rendering System - Architecture & Design

## System Overview

A flexible, modular template system for rendering editorial content dynamically. Supports multiple story formats with reusable blocks that can be composed into different layouts.

```
Template System Architecture
├── Template Definitions (JSON/Config)
├── Block Components (Reusable UI blocks)
├── Template Renderer (Dynamic composition)
├── Layout System (Responsive grids)
└── Data Providers (Content sources)
```

---

## 1. Core Concepts

### Template
A configuration that defines the structure and layout of an article using reusable blocks.

```typescript
interface Template {
  id: string
  name: string
  category: 'feature' | 'news' | 'opinion' | 'visual' | 'data' | 'interview'
  description: string
  blocks: TemplateBlock[]
  metadata: {
    minReadTime: number
    maxReadTime: number
    bestFor: string[]
  }
}
```

### Block
A reusable content unit with a specific purpose (heading, paragraph, image, etc.).

```typescript
interface TemplateBlock {
  id: string
  type: BlockType
  config: BlockConfig
  layout: LayoutOptions
  styling?: StyleOptions
}

type BlockType = 
  | 'hero'           // Full-width hero section
  | 'title'          // Article title
  | 'subtitle'       // Article subtitle
  | 'metadata'       // Author, date, category
  | 'text'           // Paragraph text
  | 'heading'        // Section heading
  | 'image'          // Single image
  | 'gallery'        // Image grid
  | 'quote'          // Pull quote
  | 'video'          // Embedded video
  | 'caption'        // Image caption
  | 'divider'        // Visual separator
  | 'chart'          // Data visualization
  | 'callout'        // Highlighted box
  | 'author-bio'     // Author information
  | 'related'        // Related articles
```

### Article Data
The content that gets rendered into a template.

```typescript
interface ArticleData {
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
  metadata?: Record<string, any>
}

interface ContentBlock {
  type: string
  data: Record<string, any>
  position: number
}
```

---

## 2. Template Categories

### 2.1 Feature Story Template
**Long-form investigative journalism**

```
┌─────────────────────────────────┐
│     HERO IMAGE (Full Width)     │
├─────────────────────────────────┤
│  CATEGORY BADGE                 │
│  [Feature] THE LONG STORY       │
│  Investigating the trends...    │
│  BY JOHN DOE | MAY 28, 2026     │
├─────────────────────────────────┤
│                                 │
│  Body text (2-column)           │
│  Lorem ipsum dolor sit amet...  │
│                                 │
│  SECTION HEADING                │
│  More body text                 │
│                                 │
│  [PULLQUOTE]                    │
│  "Insightful quote from source" │
│  - Source Name                  │
│                                 │
│  Continued body text            │
│  More paragraphs...             │
│                                 │
│  [IMAGE WITH CAPTION]           │
│  Caption text below image       │
│                                 │
│  Related Articles               │
│  [Article 1] [Article 2]        │
│                                 │
│  AUTHOR BIO                     │
│  [Photo] John Doe               │
│  About the author...            │
└─────────────────────────────────┘
```

**Blocks:**
1. Hero section (image + overlay)
2. Article metadata (category, title, subtitle)
3. Author byline
4. Body paragraphs
5. Section headings
6. Pull quotes
7. Images with captions
8. Related articles
9. Author bio

---

### 2.2 News Brief Template
**Quick-format breaking news**

```
┌──────────────────────────┐
│  BREAKING | ⚡ NEWS     │
├──────────────────────────┤
│  HEADLINE: NEW FINDING   │
│  What happened & why     │
├──────────────────────────┤
│  Timeline                │
│  • 3:00 PM - First...    │
│  • 3:15 PM - Then...     │
│  • 3:30 PM - Finally...  │
├──────────────────────────┤
│  Key Facts              │
│  ✓ Fact 1               │
│  ✓ Fact 2               │
│  ✓ Fact 3               │
├──────────────────────────┤
│  Quotes                 │
│  "Statement" - Source   │
├──────────────────────────┤
│  Next Steps / Updates   │
│  Updates coming soon...  │
└──────────────────────────┘
```

**Blocks:**
1. Badge (Breaking/Alert)
2. Title
3. Subtitle (key info)
4. Timeline
5. Key facts list
6. Quotes section
7. Updates callout

---

### 2.3 Opinion Piece Template
**Editorial commentary**

```
┌──────────────────────────┐
│  [OPINION]               │
│  Why This Matters        │
│  By Jane Smith           │
│  May 28, 2026            │
├──────────────────────────┤
│                          │
│  Opening argument        │
│  Strong perspective...   │
│                          │
│  [HIGHLIGHTED CLAIM]     │
│  "Core argument here"    │
│                          │
│  Supporting evidence     │
│  Why I believe this...   │
│                          │
│  Counterargument         │
│  Some might say...       │
│                          │
│  Rebuttal & Conclusion   │
│  Here's why that's wrong │
│                          │
├──────────────────────────┤
│  About the Author        │
│  [Bio section]           │
└──────────────────────────┘
```

**Blocks:**
1. Opinion header
2. Title & byline
3. Body paragraphs
4. Highlighted callouts
5. Sidebars (context boxes)
6. Author bio

---

### 2.4 Visual Story Template
**Photo-first storytelling**

```
┌─────────────────────────┐
│  VISUAL STORY           │
│  Photo Series: Journey  │
├─────────────────────────┤
│                         │
│  [LARGE IMAGE 1]        │
│  Caption & context      │
│                         │
│  Text commentary        │
│  What this shows...     │
│                         │
│  [IMAGE GRID 2-3 photos]│
│  Gallery of moments     │
│                         │
│  Photo essay text       │
│  The narrative...       │
│                         │
│  [FULL WIDTH IMAGE]     │
│  Climactic photo        │
│                         │
│  [SLIDESHOW/CAROUSEL]   │
│  Series of 8 photos     │
│                         │
│  Photo credits          │
│  Photographer: Name     │
│                         │
└─────────────────────────┘
```

**Blocks:**
1. Hero image
2. Title & description
3. Body text
4. Single images with captions
5. Image galleries (2-4 columns)
6. Slideshows/carousels
7. Photo credits

---

### 2.5 Data Visualization Template
**Interactive charts & infographics**

```
┌──────────────────────────┐
│  DATA STORY              │
│  Trends in 2025          │
├──────────────────────────┤
│  Headline with insight   │
│  What the data shows     │
├──────────────────────────┤
│  [INTERACTIVE CHART]     │
│  Line chart of trends    │
│                          │
│  Analysis text           │
│  Interpretation...       │
│                          │
│  [BAR CHART]             │
│  Comparison data         │
│                          │
│  [INFOGRAPHIC]           │
│  Visual explainer        │
│                          │
│  Data source             │
│  Credit & methodology    │
│                          │
├──────────────────────────┤
│  Related Data Stories    │
│  [Previous] [Next]       │
└──────────────────────────┘
```

**Blocks:**
1. Title & subtitle
2. Summary text
3. Charts (line, bar, pie)
4. Infographics
5. Data tables
6. Analysis text
7. Data source/credits

---

### 2.6 Interview Template
**Q&A format**

```
┌──────────────────────────┐
│  INTERVIEW              │
│  Talking with Jane Doe   │
├──────────────────────────┤
│  [SUBJECT PHOTO]         │
│  Jane Doe                │
│  Title/Role              │
├──────────────────────────┤
│                          │
│  Introduction            │
│  Why we're talking...    │
│                          │
│  Q: What's happening?    │
│  A: Long answer from     │
│     the subject...       │
│                          │
│  Q: Why does it matter?  │
│  A: Here's why...        │
│                          │
│  [EMBEDDED QUOTE]        │
│  "Powerful statement"    │
│                          │
│  Q: Next question?       │
│  A: And the response...  │
│                          │
│  Subject bio             │
│  Background & more...    │
│                          │
└──────────────────────────┘
```

**Blocks:**
1. Subject info & photo
2. Introduction
3. Q&A pairs
4. Embedded quotes
5. Subject bio
6. Related interviews

---

## 3. Reusable Block Components

### Text Blocks

#### Title Block
```typescript
interface TitleBlockConfig {
  level: 'h1' | 'h2' | 'h3'
  alignment: 'left' | 'center' | 'right'
  maxWidth?: number
}
```

**Renders:**
```
H1: 3.5rem, serif, bold (#1a1a1a)
H2: 2.5rem, serif, bold (#1a1a1a)
H3: 1.875rem, serif, semi-bold (#1a1a1a)
```

#### Paragraph Block
```typescript
interface TextBlockConfig {
  dropCap?: boolean
  maxWidth?: number
  columns?: 1 | 2 | 3
  hyphenation?: boolean
}
```

**Features:**
- Optional drop cap (large first letter)
- Multi-column support
- Responsive columns (1 col mobile, 2+ desktop)
- Hyphenation for justified text
- Optimal line-length (65-75 chars)

#### Heading Block
```typescript
interface HeadingBlockConfig {
  level: 'h2' | 'h3' | 'h4'
  style: 'serif' | 'sans'
  divider?: 'top' | 'bottom' | 'both' | 'none'
  color?: string
}
```

### Media Blocks

#### Image Block
```typescript
interface ImageBlockConfig {
  width: 'full' | 'wide' | 'normal' | 'narrow'
  aspectRatio: '16:9' | '4:3' | '1:1' | '3:4'
  caption?: string
  credit?: string
  position: 'left' | 'center' | 'right'
  lightbox?: boolean
}
```

**Responsive Widths:**
```
full:   100% width, full bleed
wide:   90% width with margins
normal: 80% width, centered
narrow: 60% width, centered
```

#### Gallery Block
```typescript
interface GalleryBlockConfig {
  layout: 'grid' | 'carousel' | 'masonry'
  columns: 2 | 3 | 4
  gap: 'small' | 'medium' | 'large'
  responsiveColumns?: {
    mobile: number
    tablet: number
    desktop: number
  }
}
```

#### Video Block
```typescript
interface VideoBlockConfig {
  provider: 'youtube' | 'vimeo' | 'custom'
  videoId: string
  aspectRatio: '16:9' | '4:3' | '1:1'
  autoplay?: boolean
  controls?: boolean
  caption?: string
}
```

### Content Blocks

#### Quote Block
```typescript
interface QuoteBlockConfig {
  style: 'pullquote' | 'blockquote' | 'callout'
  alignment: 'left' | 'center'
  source?: string
  color?: string
  fontSize?: number
}
```

**Styles:**
```
Pullquote: Large, colored, attention-grabbing
Blockquote: Indented, bordered
Callout: Highlighted box with background
```

#### Divider Block
```typescript
interface DividerBlockConfig {
  style: 'line' | 'dots' | 'text' | 'graphic'
  color?: string
  text?: string
  margin?: 'small' | 'medium' | 'large'
}
```

#### Callout Block
```typescript
interface CalloutBlockConfig {
  type: 'info' | 'warning' | 'success' | 'tip'
  backgroundColor?: string
  borderColor?: string
  icon?: string
}
```

### Special Blocks

#### Author Bio Block
```typescript
interface AuthorBioBlockConfig {
  layout: 'horizontal' | 'vertical'
  photoSize: 'small' | 'medium' | 'large'
  showSocial?: boolean
  borderTop?: boolean
  backgroundColor?: string
}
```

#### Related Articles Block
```typescript
interface RelatedBlockConfig {
  count: number
  layout: 'grid' | 'carousel'
  columns: 2 | 3 | 4
  filter?: {
    category?: string
    tags?: string[]
  }
}
```

#### Timeline Block
```typescript
interface TimelineBlockConfig {
  direction: 'vertical' | 'horizontal'
  items: TimelineItem[]
  style: 'line' | 'dots' | 'solid'
}

interface TimelineItem {
  date: string
  title: string
  description: string
  icon?: string
}
```

#### Facts List Block
```typescript
interface FactsListBlockConfig {
  layout: 'list' | 'grid'
  columns: 1 | 2 | 3
  style: 'bullets' | 'numbers' | 'checkmarks'
  backgroundColor?: string
}
```

---

## 4. Layout System

### Layout Options

```typescript
interface LayoutOptions {
  width: 'full' | 'content' | 'narrow'
  margin: 'none' | 'small' | 'medium' | 'large'
  padding: 'none' | 'small' | 'medium' | 'large'
  spacing: number // margin bottom in px
}
```

### Width Definitions

```
full:    100vw (full viewport width)
content: max-width 900px (article width)
narrow:  max-width 600px
```

### Responsive Spacing

```
Mobile (xs):   margin 16px, padding 12px
Tablet (md):   margin 24px, padding 16px
Desktop (lg+): margin 32px, padding 20px
```

---

## 5. Styling System

### Text Styling

```typescript
interface TextStyle {
  fontSize?: number
  fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold'
  lineHeight?: number
  letterSpacing?: number
  color?: string
  alignment?: 'left' | 'center' | 'right' | 'justify'
  transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none'
}
```

### Box Styling

```typescript
interface BoxStyle {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderRadius?: number
  padding?: number
  margin?: number
  boxShadow?: string
  opacity?: number
}
```

---

## 6. Template Composition Example

### Feature Story Template Definition

```typescript
const featureStoryTemplate: Template = {
  id: 'feature-story-v1',
  name: 'Feature Story',
  category: 'feature',
  description: 'Long-form investigative journalism with rich media',
  blocks: [
    // Hero Section
    {
      id: 'hero',
      type: 'hero',
      config: {
        alignment: 'center',
        overlayOpacity: 0.3,
      },
      layout: {
        width: 'full',
        margin: 'none',
        spacing: 40,
      },
    },
    // Metadata
    {
      id: 'metadata',
      type: 'metadata',
      config: {
        showCategory: true,
        showDate: true,
        showAuthor: true,
        showReadTime: true,
      },
      layout: {
        width: 'content',
        margin: 'medium',
        spacing: 24,
      },
    },
    // Title
    {
      id: 'title',
      type: 'title',
      config: {
        level: 'h1',
        alignment: 'left',
      },
      layout: {
        width: 'content',
        margin: 'medium',
        spacing: 16,
      },
    },
    // Subtitle
    {
      id: 'subtitle',
      type: 'subtitle',
      config: {
        alignment: 'left',
      },
      layout: {
        width: 'content',
        margin: 'medium',
        spacing: 24,
      },
    },
    // Body Text
    {
      id: 'body',
      type: 'text',
      config: {
        columns: 1,
        dropCap: true,
      },
      layout: {
        width: 'content',
        margin: 'medium',
        spacing: 24,
      },
    },
    // Pull Quote
    {
      id: 'quote-1',
      type: 'quote',
      config: {
        style: 'pullquote',
        alignment: 'center',
      },
      layout: {
        width: 'narrow',
        margin: 'large',
        spacing: 32,
      },
    },
    // More body text
    {
      id: 'body-2',
      type: 'text',
      config: {
        columns: 1,
      },
      layout: {
        width: 'content',
        margin: 'medium',
        spacing: 24,
      },
    },
    // Image with Caption
    {
      id: 'image-1',
      type: 'image',
      config: {
        width: 'wide',
        aspectRatio: '16:9',
        caption: true,
        lightbox: true,
      },
      layout: {
        width: 'wide',
        margin: 'large',
        spacing: 32,
      },
    },
    // Related Articles
    {
      id: 'related',
      type: 'related',
      config: {
        count: 3,
        layout: 'grid',
      },
      layout: {
        width: 'content',
        margin: 'large',
        spacing: 32,
      },
    },
    // Author Bio
    {
      id: 'author-bio',
      type: 'author-bio',
      config: {
        layout: 'horizontal',
        photoSize: 'medium',
        showSocial: true,
        borderTop: true,
      },
      layout: {
        width: 'content',
        margin: 'large',
        spacing: 0,
      },
    },
  ],
  metadata: {
    minReadTime: 5,
    maxReadTime: 20,
    bestFor: [
      'investigative reporting',
      'long-form journalism',
      'narratives',
    ],
  },
}
```

---

## 7. Data Flow

```
Article Data
    ↓
Template Selection
    ↓
Template Renderer
    ├── Maps article data to blocks
    ├── Renders each block component
    ├── Applies styling & layout
    └── Composes into page
    ↓
HTML Output
    ↓
Browser Rendering
```

---

## 8. Rendering Pipeline

```typescript
// 1. Select Template
const template = getTemplate('feature-story-v1')

// 2. Load Article Data
const articleData = fetchArticle(articleId)

// 3. Create Block Props
const blockProps = template.blocks.map(block => ({
  ...block,
  data: extractDataForBlock(block.type, articleData),
}))

// 4. Render Blocks
const rendered = blockProps.map(props =>
  renderBlock(props.type, props)
)

// 5. Output HTML
const html = composed.join('')
```

---

## 9. Benefits of This System

### Reusability
- Blocks can be used across templates
- Consistent styling and behavior
- Easy to create new combinations

### Flexibility
- Mix and match blocks
- Override styling per template
- Custom data mapping

### Maintainability
- Single source of truth for each block
- Easy to update block styles globally
- Version control for templates

### Performance
- Lazy load blocks if needed
- Minimal CSS/JS per block
- Efficient rendering

### Extensibility
- Add new block types easily
- Create new templates from existing blocks
- Plugin architecture possible

---

## 10. Implementation Roadmap

### Phase 1: Foundation
- [ ] Core types and interfaces
- [ ] Template definitions (6 templates)
- [ ] Basic block components

### Phase 2: Renderer
- [ ] Template renderer engine
- [ ] Block composition system
- [ ] Layout system implementation

### Phase 3: Features
- [ ] Styling system
- [ ] Responsive handling
- [ ] Data mapping

### Phase 4: Polish
- [ ] Accessibility
- [ ] Performance optimization
- [ ] Documentation & examples

### Phase 5: Advanced
- [ ] Template editor UI
- [ ] Custom block types
- [ ] Template versioning

---

## 11. Styling Integration

### Design System Colors
```
Editorial Dark:  #1a1a1a (text)
Editorial Light: #f7f7f7 (background)
Editorial Blue:  #0f3a7d (accents)
Editorial Gold:  #d4a574 (highlights)
```

### Typography
```
Headlines: Georgia serif
Body: System fonts sans-serif
Code: Monospace (if applicable)
```

### Spacing
```
Base unit: 8px
Standard margins: 16px, 24px, 32px
```

---

**Version**: 1.0  
**Last Updated**: May 28, 2026  
**Status**: Design Complete - Ready for Implementation
