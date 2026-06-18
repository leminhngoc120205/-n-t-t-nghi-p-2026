# Editorial Dashboard - Quick Start Guide

## Get Started in 5 Minutes

### 1. Import the Component
```tsx
import { DashboardLayout } from '@/components/Dashboard'

export default function DashboardPage() {
  return <DashboardLayout />
}
```

That's it! You now have a fully functional dashboard.

---

## 2. What You Get

### Sidebar Navigation
- Dashboard overview
- Articles management
- Drafts tracking (with badge count)
- Published articles (with badge count)
- Templates library
- Analytics
- Collaborators
- Settings

### Top Bar
- Mobile menu toggle
- Search functionality
- New Article quick action
- Notifications center
- User menu

### Main Content
- **Statistics Cards** (4 metrics)
  - Published Articles count
  - Total Views
  - Draft count
  - Average Reading Time

- **Quick Actions** (4 gradient buttons)
  - Write New Article
  - Choose Template
  - View Drafts
  - View Analytics

- **Tabbed Content**
  - Overview: Recent published articles
  - Drafts: In-progress articles with progress bars
  - Templates: 6 story templates to choose from

---

## 3. Customize Navigation

Edit `components/Dashboard/Sidebar.tsx`:

```tsx
const mainNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: '📊', badge: 0 },
  { label: 'Articles', href: '/dashboard/articles', icon: '📰' },
  { label: 'Drafts', href: '/dashboard/drafts', icon: '✏️', badge: 3 },
  { label: 'Published', href: '/dashboard/published', icon: '✓', badge: 24 },
  { label: 'Templates', href: '/dashboard/templates', icon: '🎨' },
  // Add more items here
]
```

---

## 4. Connect Real Data

### Example: Fetch Articles

```tsx
// In DashboardContent.tsx
useEffect(() => {
  const fetchArticles = async () => {
    const response = await fetch('/api/articles?status=published&limit=3')
    const data = await response.json()
    setRecentArticles(data.articles)
  }
  fetchArticles()
}, [])
```

### Expected API Response Format

```json
{
  "articles": [
    {
      "id": "1",
      "title": "Article Title",
      "excerpt": "Brief description...",
      "image": "/images/article-1.jpg",
      "author": "Author Name",
      "date": "Today",
      "status": "published",
      "views": 2400,
      "readTime": 8
    }
  ]
}
```

---

## 5. Update Statistics

Replace mock stats in `DashboardContent.tsx`:

```tsx
// Fetch from API
useEffect(() => {
  const fetchStats = async () => {
    const response = await fetch('/api/dashboard/stats')
    const data = await response.json()
    
    setStats([
      {
        label: 'Published Articles',
        value: String(data.publishedCount),
        change: `+${data.publishedThisWeek} this week`,
        color: 'blue',
        icon: '📰',
      },
      {
        label: 'Draft Articles',
        value: String(data.draftCount),
        change: `+${data.draftToday} today`,
        color: 'amber',
        icon: '✏️',
      },
      // ... more stats
    ])
  }
  fetchStats()
}, [])
```

---

## 6. Implement Search

The search is already connected! Just fetch filtered results:

```tsx
// In DashboardContent.tsx
useEffect(() => {
  if (!searchQuery) {
    setRecentArticles(allArticles)
    return
  }
  
  const filtered = allArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )
  setRecentArticles(filtered)
}, [searchQuery, allArticles])
```

---

## 7. File Structure Reference

```
components/Dashboard/
├── index.ts                 # Exports all components
├── DashboardLayout.tsx      # Main wrapper component
├── Sidebar.tsx              # Left navigation
├── TopBar.tsx               # Header with search
├── DashboardContent.tsx     # Main content area
├── StatCard.tsx             # Statistics card
├── QuickActions.tsx         # Action buttons
├── ArticleList.tsx          # Recent articles list
├── DraftsList.tsx           # Drafts with progress
└── TemplateGrid.tsx         # Template selection
```

---

## 8. Styling Customization

### Change Colors

Find and replace in components:

```tsx
// Default: Editorial blue
className="bg-editorial-blue"

// Change to custom color
className="bg-your-custom-color"
```

### Common Color Classes

```tsx
// Text colors
text-editorial-dark        // Dark text
text-editorial-gray-slate  // Secondary text
text-editorial-blue        // Accent blue
text-editorial-gold        // Warm gold

// Background colors
bg-editorial-white      // White backgrounds
bg-editorial-light      // Light gray backgrounds
bg-editorial-blue       // Blue backgrounds
bg-editorial-gold       // Gold backgrounds

// Border colors
border-editorial-gray-medium  // Medium gray borders
```

---

## 9. Responsive Mobile Testing

Test on different screen sizes:

### Mobile (320px)
```
- Sidebar hidden (tap ☰ to open)
- Search hidden
- Stats: 1 column
- Quick Actions: 1 column
```

### Tablet (768px)
```
- Sidebar visible
- Search visible
- Stats: 2 columns
- Quick Actions: 2 columns
```

### Desktop (1024px+)
```
- Full layout
- All features visible
- Stats: 4 columns
- Quick Actions: 4 columns
- Templates: 3 columns
```

---

## 10. Common Customizations

### Change Sidebar Width
Edit `Sidebar.tsx`:
```tsx
className="w-64"  // Default 256px
className="w-80"  // Change to 320px
```

### Add More Quick Actions
Edit `QuickActions.tsx`:
```tsx
const actions: QuickAction[] = [
  {
    icon: '🎯',
    label: 'Your Action',
    description: 'Description',
    href: '/your-route',
    color: 'from-color-1 to-color-2',
  },
  // ... add more
]
```

### Customize Tabs
Edit `DashboardContent.tsx`:
```tsx
const [activeTab, setActiveTab] = useState<
  'overview' | 'drafts' | 'templates' | 'yourTab'
>('overview')

// Add in map:
{['overview', 'drafts', 'templates', 'yourTab'].map((tab) => (...))}

// Add content section:
{activeTab === 'yourTab' && (
  <div>Your content here</div>
)}
```

---

## 11. Troubleshooting

### Issue: Sidebar doesn't appear
**Solution:** Check that `isOpen` state is true and z-index is correct
```tsx
// Should be z-50
className="z-50"
```

### Issue: Search not working
**Solution:** Ensure data is being passed and filtering logic is correct
```tsx
// Check if searchQuery is being passed
<DashboardContent searchQuery={searchQuery} />
```

### Issue: Images not showing
**Solution:** Verify image paths are in public folder
```
public/
├── images/
│   ├── article-1.jpg
│   ├── article-2.jpg
│   └── article-3.jpg
```

### Issue: Layout broken on mobile
**Solution:** Check Tailwind breakpoint prefixes
```tsx
// Should work at different breakpoints
className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
```

---

## 12. Performance Tips

### 1. Lazy Load Components
```tsx
import dynamic from 'next/dynamic'

const DraftsList = dynamic(() => import('./DraftsList'), {
  loading: () => <LoadingSpinner />,
})
```

### 2. Memoize Components
```tsx
import { memo } from 'react'

export const StatCard = memo(({ ...props }) => (
  // Component content
))
```

### 3. Optimize Images
```tsx
import Image from 'next/image'

<Image
  src={article.image}
  alt={article.title}
  width={400}
  height={300}
  placeholder="blur"
/>
```

### 4. Debounce Search
```tsx
const [searchQuery, setSearchQuery] = useState('')

const debouncedSearch = useMemo(
  () => debounce((q: string) => {
    // Perform search
  }, 300),
  []
)
```

---

## 13. Deployment Checklist

Before deploying:

- [ ] Replace mock data with real API calls
- [ ] Test on mobile devices
- [ ] Check all links work correctly
- [ ] Verify images load properly
- [ ] Test search functionality
- [ ] Check accessibility (keyboard navigation)
- [ ] Test in different browsers
- [ ] Optimize bundle size
- [ ] Enable HTTPS
- [ ] Set up error tracking

---

## 14. Next Steps

1. **Connect Backend**: Implement API endpoints for data fetching
2. **Add Authentication**: Integrate user login/logout
3. **Real-time Updates**: Add WebSocket for live notifications
4. **Analytics**: Implement analytics dashboard
5. **Customization**: Allow users to customize dashboard layout
6. **Dark Mode**: Implement theme switcher
7. **Export**: Add article export functionality
8. **Collaboration**: Add multi-user features

---

## 15. Resources

### Design System
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Complete design reference
- [DESIGN_SYSTEM_IMPLEMENTATION.md](./DESIGN_SYSTEM_IMPLEMENTATION.md) - Code examples

### Dashboard Docs
- [DASHBOARD_IMPLEMENTATION.md](./DASHBOARD_IMPLEMENTATION.md) - Detailed documentation
- [DASHBOARD_VISUAL_GUIDE.md](./DASHBOARD_VISUAL_GUIDE.md) - Visual layouts

### External Resources
- [TailwindCSS Docs](https://tailwindcss.com)
- [React Docs](https://react.dev)
- [Next.js Docs](https://nextjs.org/docs)

---

## Support

For questions or issues:
1. Check the detailed documentation files
2. Review component TypeScript interfaces
3. Check the visual guide for layout reference
4. Test in browser DevTools

---

**Last Updated**: May 28, 2026  
**Version**: 1.0  
**Status**: Ready for Production
