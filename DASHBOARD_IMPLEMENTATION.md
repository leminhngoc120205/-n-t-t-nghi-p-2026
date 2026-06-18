# Editorial Dashboard - Implementation Guide

## Overview

The Editorial Dashboard is a modern, clean, minimal newsroom interface built with React, TypeScript, and TailwindCSS. It provides a comprehensive overview of editorial operations with quick access to key features and content management tools.

---

## Component Architecture

### Main Components

```
DashboardLayout
├── Sidebar (Navigation)
├── TopBar (Search, Actions, Notifications)
└── DashboardContent
    ├── StatCard (x4)
    ├── QuickActions
    └── Tabs:
        ├── Overview → ArticleList
        ├── Drafts → DraftsList
        └── Templates → TemplateGrid
```

### File Structure

```
components/
└── Dashboard/
    ├── index.ts                 # Main exports
    ├── DashboardLayout.tsx      # Root component
    ├── Sidebar.tsx              # Navigation sidebar
    ├── TopBar.tsx               # Header bar with search
    ├── DashboardContent.tsx     # Main content area
    ├── StatCard.tsx             # Statistics cards
    ├── QuickActions.tsx         # Action buttons
    ├── ArticleList.tsx          # Recent articles
    ├── DraftsList.tsx           # Draft articles
    └── TemplateGrid.tsx         # Template selection
```

---

## Component Documentation

### 1. DashboardLayout
**Root component that manages the overall dashboard structure.**

```tsx
import { DashboardLayout } from '@/components/Dashboard'

export default function Page() {
  return <DashboardLayout />
}
```

**Features:**
- Manages sidebar open/close state
- Handles search query state
- Responsive layout (sidebar collapses on mobile)
- Maintains scroll context

---

### 2. Sidebar
**Navigation sidebar with editorial-focused menu items.**

**Props:**
```tsx
interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}
```

**Features:**
- Primary navigation (Dashboard, Articles, Drafts, Published, Templates)
- Secondary navigation (Analytics, Collaborators, Settings)
- Badge indicators for draft/published counts
- User profile section
- Smooth animations
- Mobile-friendly with overlay

**Navigation Structure:**
```
📊 Dashboard
📰 Articles
✏️ Drafts (badge: count)
✓ Published (badge: count)
🎨 Templates

---

📈 Analytics
👥 Collaborators
⚙️ Settings
```

---

### 3. TopBar
**Fixed header with search, notifications, and actions.**

**Props:**
```tsx
interface TopBarProps {
  onMenuToggle: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}
```

**Features:**
- Hamburger menu toggle (mobile)
- Search bar (hidden on mobile, visible on sm+)
- "New Article" button (hidden on mobile)
- Notification bell with indicator
- User menu dropdown
- Sticky positioning
- Responsive layout

---

### 4. DashboardContent
**Main content area with tabbed interface.**

**Features:**
- Statistics grid (4 cards)
- Quick actions section
- Tabbed content:
  - **Overview**: Recent published articles
  - **Drafts**: In-progress articles with progress bars
  - **Templates**: Template selection grid

**Tab Content:**
- Overview: 3-4 recent articles with full details
- Drafts: Draft articles with edit progress indicator
- Templates: 6 template cards with usage stats

---

### 5. StatCard
**Statistics display card.**

**Props:**
```tsx
interface StatCardProps {
  label: string          // "Published Articles"
  value: string          // "24"
  change: string         // "+2 this week"
  color: 'blue' | 'amber' | 'green' | 'gold'
  icon: string           // emoji or SVG
}
```

**Example:**
```tsx
<StatCard
  label="Published Articles"
  value="24"
  change="+2 this week"
  color="blue"
  icon="📰"
/>
```

**Styling:**
- Gradient icon backgrounds
- Color-coded by metric type
- Hover shadow effect
- Responsive grid layout (1-4 columns)

---

### 6. QuickActions
**Colorful action cards for common tasks.**

**Default Actions:**
1. **Write New Article** (Blue gradient) → `/editor`
2. **Choose Template** (Gold gradient) → `/dashboard/templates`
3. **View Drafts** (Amber gradient) → `/dashboard/drafts`
4. **View Analytics** (Green gradient) → `/dashboard/analytics`

**Features:**
- Gradient backgrounds (unique per action)
- Hover scale effect
- Icon + label + description
- Smart routing
- Responsive grid (1-4 columns)

---

### 7. ArticleList
**Display recent published articles.**

**Props:**
```tsx
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
```

**Display:**
- Thumbnail image (left side)
- Title + badge + excerpt (center)
- Meta info: author, date, views, read time (footer)
- Edit button (right)

**Features:**
- Hover image zoom effect
- Status badge (Published/Draft)
- Line clamping on excerpt
- Responsive layout (horizontal on desktop, stacked on mobile)

---

### 8. DraftsList
**Display draft articles with edit progress.**

**Props:**
```tsx
interface DraftArticle {
  id: string
  title: string
  excerpt: string
  author: string
  date: string
  status: 'draft'
  progress: number  // 0-100
}

interface DraftsListProps {
  articles: DraftArticle[]
}
```

**Display:**
- Title + excerpt + badge (top)
- Progress bar (middle)
- Author, edit date, Continue button (bottom)

**Features:**
- Animated progress bar (blue to gold gradient)
- Status badge
- Last edited timestamp
- Continue button for quick edit

---

### 9. TemplateGrid
**Template selection grid.**

**Props:**
```tsx
interface Template {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string  // emoji or image
  uses: number
}

interface TemplateGridProps {
  templates: Template[]
}
```

**Display:**
- Thumbnail area (emoji or image)
- Category badge
- Template name
- Description
- Usage counter
- Use button

**Features:**
- 3-column grid (responsive)
- Hover border color change
- Usage statistics
- Link to editor with template preset

---

## Responsive Behavior

### Breakpoints
```
xs: 320px   (Mobile base)
sm: 640px   (Mobile landscape)
md: 768px   (Tablet)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
2xl: 1536px (Extra wide)
```

### Mobile Adjustments

**Sidebar:**
- Hidden by default on mobile
- Overlays content
- Hamburger toggle in header
- Shows on md+ screens

**Search:**
- Hidden on xs-sm
- Visible on sm+ screens

**New Article Button:**
- Hidden on xs-sm
- Visible on sm+ screens

**Grid Layouts:**
- StatCard: 1 column (xs), 2 columns (sm-md), 4 columns (lg+)
- QuickActions: 1 column (xs-sm), 2 columns (md), 4 columns (lg+)
- TemplateGrid: 1 column (xs), 2 columns (md), 3 columns (lg+)

---

## Styling & Design Tokens

### Color Scheme
```
Editorial Dark:    #1a1a1a
Editorial Light:   #f7f7f7
Editorial Blue:    #0f3a7d
Editorial Gold:    #d4a574
Gray Slate:        #57606f
Gray Medium:       #e8e8e8
```

### Typography
```
Headlines:  Georgia/serif, bold
Body:       System fonts/sans-serif
Accents:    Uppercase, letter-spacing
```

### Spacing
```
Base unit: 8px
Padding cards: 16-32px
Gap between items: 16-24px
```

---

## Usage Examples

### Basic Implementation
```tsx
import { DashboardLayout } from '@/components/Dashboard'

export default function DashboardPage() {
  return <DashboardLayout />
}
```

### With Custom Data
```tsx
'use client'

import { DashboardContent } from '@/components/Dashboard'
import { useState, useEffect } from 'react'

export default function Page() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch your data
    fetchArticles().then(setArticles)
    setLoading(false)
  }, [])

  if (loading) return <LoadingSpinner />

  return <DashboardContent searchQuery="" />
}
```

### Custom Stats
```tsx
import { StatCard } from '@/components/Dashboard'

const stats = [
  {
    label: 'Published Articles',
    value: '24',
    change: '+2 this week',
    color: 'blue',
    icon: '📰',
  },
  // ... more stats
]

{stats.map((stat, i) => <StatCard key={i} {...stat} />)}
```

---

## Customization Guide

### 1. Change Navigation Items
Edit `Sidebar.tsx`:
```tsx
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊' },
  // Add your items here
]
```

### 2. Add Custom Quick Actions
Edit `DashboardContent.tsx`:
```tsx
const actions: QuickAction[] = [
  {
    icon: '🎯',
    label: 'Your Action',
    description: 'Description here',
    href: '/your-route',
    color: 'from-custom-color to-custom-color',
  },
  // ...
]
```

### 3. Change Color Scheme
Update TailwindCSS config or individual component styles:
```tsx
// Example: Change blue accent
<div className="bg-your-custom-blue text-your-custom-white">
```

### 4. Add Search Filtering
```tsx
const filteredArticles = articles.filter(a =>
  a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
  a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
)
```

---

## API Integration

### Fetching Articles
```tsx
useEffect(() => {
  const fetchArticles = async () => {
    const response = await fetch('/api/articles?status=published')
    const data = await response.json()
    setRecentArticles(data.articles)
  }
  fetchArticles()
}, [])
```

### Fetching Templates
```tsx
useEffect(() => {
  const fetchTemplates = async () => {
    const response = await fetch('/api/templates')
    const data = await response.json()
    setTemplates(data.templates)
  }
  fetchTemplates()
}, [])
```

### Fetching Stats
```tsx
useEffect(() => {
  const fetchStats = async () => {
    const response = await fetch('/api/dashboard/stats')
    const data = await response.json()
    setStats([
      { label: 'Published', value: data.publishedCount, ... },
      // ...
    ])
  }
  fetchStats()
}, [])
```

---

## Performance Optimization

### 1. Lazy Loading
```tsx
import dynamic from 'next/dynamic'

const DraftsList = dynamic(() => import('./DraftsList'), {
  loading: () => <LoadingSpinner />,
})
```

### 2. Memoization
```tsx
import { memo } from 'react'

export const ArticleCard = memo(({ article }) => (
  // Component content
))
```

### 3. Image Optimization
```tsx
import Image from 'next/image'

<Image
  src={article.image}
  alt={article.title}
  width={400}
  height={300}
  placeholder="blur"
  blurDataURL={blurhash}
/>
```

---

## Accessibility

### Screen Readers
```tsx
<nav aria-label="Main navigation">
  {/* Navigation items */}
</nav>

<button aria-label="Open menu">☰</button>
```

### Keyboard Navigation
- Tab: Navigate between elements
- Enter: Activate buttons/links
- Escape: Close modals/dropdowns

### Focus States
```tsx
:focus-visible {
  outline: 2px solid #0f3a7d;
  outline-offset: 2px;
}
```

---

## Troubleshooting

### Sidebar Not Appearing
- Check if `isOpen` state is managed correctly
- Verify z-index values (should be z-50 for sidebar)

### Search Not Working
- Ensure `searchQuery` state is properly passed
- Check if API returns filtered results

### Images Not Loading
- Verify image paths are correct
- Check public folder contains images
- Use Next.js Image component for optimization

### Responsive Issues
- Test on real devices/browser devtools
- Check Tailwind breakpoint prefixes
- Verify CSS media queries are loaded

---

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Custom dashboard layouts
- [ ] Widget drag-and-drop
- [ ] Advanced filtering options
- [ ] Real-time notifications
- [ ] Collaboration features
- [ ] Export analytics data
- [ ] Custom branding options

---

**Last Updated**: May 28, 2026  
**Version**: 1.0  
**Maintained By**: Editorial Team
