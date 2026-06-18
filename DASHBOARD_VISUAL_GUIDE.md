# Editorial Dashboard - Visual Features & Layout Guide

## Dashboard Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                          TOP BAR (Sticky)                        │
│  ☰  🔍 Search...        ✏️ New Article | 🔔 | ⋮              │
└─────────────────────────────────────────────────────────────────┘
┌───────────────────┬───────────────────────────────────────────────┐
│                   │                                               │
│   SIDEBAR         │         MAIN CONTENT AREA                    │
│                   │                                               │
│  📊 Dashboard     │  Dashboard                                    │
│  📰 Articles      │  Welcome back! Here's what's happening...   │
│  ✏️ Drafts (3)    │                                               │
│  ✓ Published(24)  │  ┌──────────┬──────────┬──────────┬────────┐ │
│  🎨 Templates     │  │ Articles │ Views    │ Drafts   │ Avg.   │ │
│                   │  │ 24       │ 12.5K    │ 3        │ 5.2min │ │
│  ────────────     │  │ +2 week  │ +8%      │ +1 today │ +0.3m  │ │
│  📈 Analytics     │  └──────────┴──────────┴──────────┴────────┘ │
│  👥 Collaborators │                                               │
│  ⚙️ Settings      │  Quick Actions                               │
│                   │  ┌──────────┬──────────┬──────────┬────────┐ │
│                   │  │✍️ Write  │🎨 Choose │📋 Drafts │📊 Data│ │
│  ────────────     │  │Article   │Template  │          │Vis     │ │
│  👤 John Doe      │  └──────────┴──────────┴──────────┴────────┘ │
│  Editor           │                                               │
│  ⋮                │  Overview | Drafts | Templates                │
└───────────────────┼───────────────────────────────────────────────┤
                    │                                               │
                    │  Recent Articles                              │
                    │                                               │
                    │  [📷] The Future of Digital Journalism        │
                    │       Exploring how AI shapes storytelling   │
                    │       By Sarah Johnson • Today • 2.4K views  │
                    │       8 min read                [Edit]        │
                    │                                               │
                    │  [📷] Breaking News: New Media Trends        │
                    │       Analysis of emerging trends             │
                    │       By Michael Chen • Yesterday • 1.8K v...  │
                    │       6 min read                [Edit]        │
                    │                                               │
                    │  [📷] Interview: Industry Leaders Speak      │
                    │       Exclusive conversation with figures     │
                    │       By Emma Wilson • 2 days ago • 3.2K v... │
                    │       12 min read               [Edit]        │
                    │                                               │
└───────────────────┴───────────────────────────────────────────────┘
```

---

## Feature Sections

### 1. TOP BAR (Height: 64px)
**Sticky header with essential controls**

```
Left Side:
├── ☰ Menu toggle (md:hidden)
└── 🔍 Search bar (sm:block)
    "Search articles, templates..."
    Auto-suggest on type

Right Side:
├── ✏️ New Article button (sm:block)
├── 🔔 Notifications (with dot indicator)
└── ⋮ User menu
```

**Features:**
- Hamburger menu opens/closes sidebar on mobile
- Search with real-time filtering
- New Article CTA prominent
- Notification badge with indicator
- User profile dropdown

---

### 2. SIDEBAR (Width: 256px)
**Navigation and account management**

```
┌─────────────────────────────┐
│ 📰 Editorial                │
│    CMS                      │
├─────────────────────────────┤
│ PRIMARY NAVIGATION          │
│                             │
│ 📊 Dashboard                │
│ 📰 Articles                 │
│ ✏️ Drafts              (3)  │
│ ✓ Published          (24)   │
│ 🎨 Templates                │
│                             │
├─────────────────────────────┤
│ SECONDARY NAVIGATION        │
│                             │
│ 📈 Analytics                │
│ 👥 Collaborators            │
│ ⚙️ Settings                 │
│                             │
├─────────────────────────────┤
│ USER PROFILE                │
│                             │
│ [👤] John Doe               │
│      Editor              ⋮  │
└─────────────────────────────┘
```

**Features:**
- Active page highlighting (blue background)
- Badge counters for important items
- Logo/branding at top
- User profile with dropdown
- Mobile overlay on xs-sm
- Smooth transitions

---

### 3. STATISTICS SECTION
**4-column dashboard metrics**

```
┌────────────┬────────────┬────────────┬────────────┐
│ 📰 Articles│ 👁️ Views  │ ✏️ Drafts  │ ⏱️ Avg Time│
│    24      │  12.5K     │     3      │   5.2min   │
│ +2 week    │  +8% week  │  +1 today  │  +0.3min   │
└────────────┴────────────┴────────────┴────────────┘
```

**Each Card:**
- Icon in colored box (top-right)
- Large primary metric (main value)
- Secondary metric (change indicator)
- Color-coded by type (blue, amber, green, gold)
- Hover shadow effect

**Responsive:**
- 1 column on xs
- 2 columns on sm-md
- 4 columns on lg+

---

### 4. QUICK ACTIONS SECTION
**Primary tasks as gradient cards**

```
┌────────────────┬────────────────┬────────────────┬────────────────┐
│ ✍️  WRITE      │ 🎨 CHOOSE     │ 📋 VIEW DRAFTS │ 📊 VIEW STATS  │
│ NEW ARTICLE    │ TEMPLATE       │ Continue on    │ Check article  │
│                │ Start quickly  │ in-progress    │ performance    │
│ ────────────→  │ ────────────→  │ ────────────→  │ ────────────→  │
└────────────────┴────────────────┴────────────────┴────────────────┘
```

**Features:**
- Unique gradient per action (blue, gold, amber, green)
- Icon + label + description
- Hover scale (1.05x) and arrow animation
- Links to core features
- Touch-friendly sizing (44px min on mobile)

---

### 5. TABBED CONTENT
**Three main content modes**

#### Tab Navigation
```
Overview | Drafts | Templates
────────────────────────────
```

---

#### TAB 1: OVERVIEW (Recent Articles)
```
ARTICLE CARD LAYOUT:

[Thumbnail]  │ Title & Meta
(128×128)    │ ─────────────────────────
             │ The Future of Digital Journalism
             │ Exploring how AI shapes storytelling
             │
             │ By Sarah Johnson • Today • 2.4K views • 8 min
             │                               [Edit Button]
```

**Multiple cards stacked vertically**

**Features:**
- Thumbnail with hover zoom
- Status badge (Published/Draft)
- Title with hover color change
- Excerpt (2-line clamp)
- Author, date, views, read time
- Edit button for quick access
- Hover shadow effect

---

#### TAB 2: DRAFTS (In-Progress Articles)
```
DRAFT CARD LAYOUT:

Title & Meta
────────────────────────────
The Future of Digital Journalism
A deep dive into AI in journalism

Progress: [═══════════─────] 65%

By John Doe • Today at 2:30 PM    [Continue Button]
```

**Features:**
- Title with category badge
- Excerpt preview
- Progress bar (blue→gold gradient)
- Percentage indicator
- Author and last edit time
- Continue button (prominent CTA)
- Color-coded progress

---

#### TAB 3: TEMPLATES (Story Formats)
```
TEMPLATE GRID (3 COLUMNS):

┌──────────────┬──────────────┬──────────────┐
│ 📝           │ ⚡           │ 💭           │
│              │              │              │
│ Feature      │ News Brief   │ Opinion      │
│ Story        │              │ Piece        │
│              │              │              │
│ Long-form    │ Quick-format │ Editorial    │
│ journalism   │ breaking     │ commentary   │
│              │ news         │              │
│ Used 128x    │ Used 256x    │ Used 84x     │
│        [Use]│        [Use]│        [Use]│
└──────────────┴──────────────┴──────────────┘
```

**Each Template Card:**
- Large emoji/icon (128px)
- Template name (serif headline)
- Description (subtitle)
- Category badge (blue)
- Usage counter (📊 Used Nx)
- Use button (blue link)
- Hover border change

**Features:**
- 3-column responsive grid
- Visual template preview
- Usage popularity indicator
- Direct editor launch with preset
- Hover effects (border, shadow)

---

## Design System Integration

### Color Usage

**Navigation & Accents:**
- Primary blue (#0f3a7d): Active states, CTAs
- Warm gold (#d4a574): Status badges, highlights
- Slate gray (#57606f): Secondary text, meta

**Status Indicators:**
- Green: Published, successful
- Amber: Draft, warning
- Blue: Information, CTA
- Gold: Premium, featured

**Backgrounds:**
- White: Cards, inputs
- Light gray (#f9f9f9): Sections, hover
- Light off-white (#f7f7f7): Page background

### Typography

**Headlines:**
- Serif (Georgia) for section headers
- Font-size: 32px (h2), 24px (h3)
- Bold weight (700)

**Body:**
- Sans-serif for content
- 16px for primary text
- 14px for metadata
- 1.7 line-height for readability

**Labels:**
- Uppercase with letter-spacing
- 12px for badges
- Font-weight: 600

---

## Interactive States

### Hover Effects

**Navigation Items:**
```
Default: Gray text
Hover:   Light blue background + darker text
Active:  Blue background + blue text + bold
```

**Article Cards:**
```
Default: Normal shadow
Hover:   Larger shadow + image zoom + title color change
```

**Buttons:**
```
Default: Blue background
Hover:   Darker blue
Active:  Even darker blue
```

**Input Fields:**
```
Default: Gray border
Focus:   Blue border + blue ring
Error:   Red border + red ring
```

---

## Responsive Breakpoints

### Mobile (xs: 320px)
- Sidebar hidden, hamburger menu visible
- Search hidden
- New Article button hidden
- Stats: 1 column
- Quick Actions: 1 column
- Template Grid: 1 column

### Tablet (md: 768px)
- Sidebar visible
- Search visible
- Stats: 2 columns
- Quick Actions: 2 columns
- Article cards: Vertical layout

### Desktop (lg: 1024px)
- Sidebar fixed
- Stats: 4 columns
- Quick Actions: 4 columns
- Templates: 3 columns
- Article cards: Horizontal with image

---

## Motion & Animations

### Transitions
```
Color transitions:     150ms ease-out
Shadow transitions:    300ms ease-out
Scale animations:      300ms ease-out
Opacity transitions:   200ms ease-out
```

### Effects
```
Hover scale:      1.02x - 1.05x
Sidebar overlay:  Smooth slide-in
Tab changes:      Fade transition
Progress bar:     Smooth fill animation
```

---

## Accessibility Features

### Keyboard Navigation
- Tab: Move focus forward
- Shift+Tab: Move focus backward
- Enter: Activate buttons
- Escape: Close menus/modals

### Screen Readers
```
<nav aria-label="Main navigation">
<button aria-label="Toggle menu">
<article aria-label="Featured article">
<span role="status" aria-live="polite">
```

### Focus Indicators
```
All interactive elements have visible focus outline
Outline: 2px solid #0f3a7d
Offset: 2px
```

### Color Contrast
```
Text: 4.5:1 minimum (WCAG AA)
Large text: 3:1 minimum
All badges meet contrast requirements
```

---

## Performance Considerations

### Code Splitting
- Dashboard components lazy-loaded
- Large lists virtualized
- Images lazy-loaded with blur placeholder

### Optimization
- StatCard uses React.memo
- ArticleList items memoized
- Search debounced (300ms)
- Image placeholders for perceived performance

---

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

---

**Version**: 1.0  
**Last Updated**: May 28, 2026  
**Design System**: Modern Editorial
