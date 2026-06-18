# Modern Editorial UI/UX Design System
## Journalism CMS Platform

---

## 1. DESIGN PHILOSOPHY

### Core Principles
- **Content First**: Content is the hero; design serves the story
- **Elegant Simplicity**: Remove visual clutter; emphasize clarity
- **Readable Typography**: Optimize for long-form reading
- **Generous Whitespace**: Create breathing room around content
- **Subtle Interactions**: Smooth, purposeful micro-interactions
- **Accessibility First**: WCAG AA compliance minimum
- **Performance Focused**: Fast load times, optimized assets

### Inspiration Framework
| Reference | Key Takeaway |
|-----------|-------------|
| **New York Times** | Strong typographic hierarchy, elegant serif/sans mix |
| **Medium** | Generous margins, focused reading experience, minimal UI |
| **Apple Editorial** | Monochromatic sophistication, premium spacing, refined details |
| **Awwwards Editorial** | Modern layouts, creative typography, refined animations |

---

## 2. COLOR PALETTE

### Primary Colors (Editorial Base)
```
Neutral Dark:     #1a1a1a (Deep black for text)
Neutral Light:    #f7f7f7 (Off-white for backgrounds)
White:            #ffffff (Pure white for cards/surfaces)
```

### Secondary Colors (Editorial Accents)
```
Serif Blue:       #0f3a7d (NYT-inspired depth, headlines)
Editorial Gold:   #d4a574 (Premium, subtle warmth)
Signal Red:       #e63946 (Important alerts, featured content)
Slate Gray:       #57606f (Secondary text, meta information)
```

### Functional Colors
```
Success Green:    #06a77d (Confirmations, saved state)
Warning Amber:    #f4a261 (Cautions, drafts)
Error Red:        #d62828 (Errors, deletions)
Info Blue:        #457b9d (Information, help text)
```

### Semantic Backgrounds
```
Light Gray:       #f9f9f9 (Subtle sections, hover states)
Medium Gray:      #e8e8e8 (Borders, dividers)
Overlay Dark:     rgba(0, 0, 0, 0.7) (Modals, overlays)
```

### Opacity Scale
```
Opacity:          100%, 87%, 60%, 38%, 12%
Usage:            Full strength, secondary, tertiary, disabled, subtle
```

### Dark Mode Variant
```
Background:       #0f0f0f
Surface:          #1a1a1a
Text Primary:     #f7f7f7
Text Secondary:   #a0a0a0
Accent:           #d4a574 (Editorial Gold maintains warmth)
```

---

## 3. TYPOGRAPHY SYSTEM

### Font Stack
```css
/* Serif (Headlines, Editorial Content) */
font-family: 'Georgia', 'Times New Roman', serif;

/* Sans-serif (UI, Body, Navigation) */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;

/* Monospace (Code, Data) */
font-family: 'Menlo', 'Monaco', 'Courier New', monospace;
```

### Type Scale (Modern Editorial)

#### Headlines (Serif)
```
H1 - Feature Title:      3.5rem (56px)  | 700 weight | 1.1 line-height
H2 - Article Title:      2.5rem (40px)  | 700 weight | 1.2 line-height
H3 - Section Header:     1.875rem (30px)| 600 weight | 1.3 line-height
H4 - Subsection:         1.5rem (24px)  | 600 weight | 1.4 line-height
H5 - Minor Heading:      1.25rem (20px) | 600 weight | 1.4 line-height
H6 - Label:              1rem (16px)    | 700 weight | 1.5 line-height
```

#### Body & UI (Sans-serif)
```
Large Text:              1.125rem (18px) | 400 weight | 1.6 line-height
Body Text:               1rem (16px)     | 400 weight | 1.7 line-height
Small Text:              0.875rem (14px) | 400 weight | 1.6 line-height
Caption:                 0.75rem (12px)  | 400 weight | 1.5 line-height
Meta/Timestamp:          0.6875rem (11px)| 400 weight | 1.5 line-height
```

#### Font Weight Scale
```
Light:      300
Normal:     400 (Default)
Medium:     500
Semibold:   600
Bold:       700
```

### Line Height Guidelines
- Headlines: 1.1–1.3 (tight, impactful)
- Body: 1.6–1.8 (readable, airy)
- Labels: 1.4–1.5 (compact)

### Letter Spacing
```
Tight:      -0.02em (Headlines)
Normal:     0em (Body, default)
Loose:      0.04em (Labels, all-caps)
```

### Text Examples
```
Primary Headline:
- Font: Georgia Bold, 56px
- Color: #1a1a1a
- Letter-spacing: -0.02em
- Example: "The Future of Digital Journalism"

Article Body:
- Font: Segoe UI Regular, 16px
- Color: #1a1a1a
- Line-height: 1.7
- Letter-spacing: 0
- Example: Main article content

Meta Information:
- Font: Segoe UI Regular, 11px
- Color: #57606f
- Text-transform: uppercase
- Letter-spacing: 0.04em
- Example: "BY JOHN DOE | MAY 28, 2026"
```

---

## 4. SPACING SYSTEM

### Base Unit: 8px Grid
```
0.5x:   4px    (Tight) - minimal spacing
1x:     8px    (Default base unit)
1.5x:   12px   (Comfortable)
2x:     16px   (Standard)
2.5x:   20px   (Generous)
3x:     24px   (Large)
4x:     32px   (Extra large)
5x:     40px   (Massive)
6x:     48px   (Hero sections)
8x:     64px   (Full sections)
10x:    80px   (Large spacers)
12x:    96px   (Page breaks)
```

### Padding Scale
```
Component Interior Padding:
- Compact:   8px 12px   (Buttons, badges)
- Standard:  16px 20px  (Cards, panels)
- Generous:  24px 32px  (Large cards, sections)
- Luxury:    32px 40px  (Premium modules, editorial boxes)
```

### Margin Scale
```
Element Spacing:
- Tight:     8px   (Between inline elements)
- Normal:    16px  (Between components)
- Generous:  24px  (Between major sections)
- Luxury:    48px  (Between page sections, article spacing)
- Heroic:    80px  (Before/after hero sections)
```

### Container Width Breakpoints
```
xs: 320px   (Mobile)
sm: 640px   (Tablet)
md: 768px   (Small desktop)
lg: 1024px  (Desktop)
xl: 1280px  (Large desktop)
2xl: 1536px (Ultra-wide)

Article Width: 100% width with 
  - Max-width: 800px (optimal reading line length)
  - Margin: 0 auto (centered)
  - Padding: 20px on mobile, 40px on desktop
```

---

## 5. LAYOUT SYSTEM

### Page Structure (Editorial Template)
```
┌─────────────────────────────────────────┐
│            Navigation Bar                │ 24px height, sticky
├─────────────────────────────────────────┤
│                                         │ 80px top margin
│      Hero / Feature Section              │ Full-width image optional
│                                         │ 80px bottom margin
├─────────────────────────────────────────┤
│                                         │ 
│    Content Area (max-width: 800px)       │ Centered, generous margins
│    - Article Title                       │ 56px serif, bold
│    - Meta Information                    │ 11px sans, gray
│    - Article Body                        │ 16px sans, 1.7 line-height
│    - Embedded Media                      │ 16px margin top/bottom
│                                         │
├─────────────────────────────────────────┤
│         Sidebar / Related Articles        │ On lg+, 280px width
├─────────────────────────────────────────┤
│              Footer                      │ 80px top margin
└─────────────────────────────────────────┘
```

### Grid System
```
12-Column Layout
- Desktop (lg+):  12 columns × 80px + 24px gutters
- Tablet (sm-md): 8 columns × 60px + 16px gutters
- Mobile (xs):    4 columns × 40px + 12px gutters

Common Layouts:
- Full: 12 cols
- Content: 8 cols (left)
- Sidebar: 4 cols (right)
- Thirds: 4 cols each
- Halves: 6 cols each
```

### Whitespace & Breathing Room
```
Around Headlines:
- Top: 48px
- Bottom: 24px

Around Paragraphs:
- Between paragraphs: 16px (no extra margin on p tag)
- Before/after media: 32px

Card Layouts:
- Padding: 32px (desktop), 20px (mobile)
- Margin between cards: 24px (desktop), 16px (mobile)
```

---

## 6. COMPONENT DESIGN LANGUAGE

### 6.1 Navigation Bar
```
Height: 56px (desktop), 48px (mobile)
Sticky: Yes, z-index: 40
Background: #ffffff with subtle shadow

Layout:
┌──────────────────────────────────────┐
│ Logo  Nav Items            Search Auth │
└──────────────────────────────────────┘

Logo:
- Height: 32px
- Margin-right: 40px

Nav Items:
- Font: 16px sans-serif, 400 weight
- Color: #1a1a1a
- Spacing: 24px between items
- Hover: Text color to #0f3a7d
- Active: Underline 2px #0f3a7d

Search Input:
- Width: 280px
- Height: 36px
- Padding: 8px 12px
- Border: 1px #e8e8e8
- Border-radius: 4px
- Placeholder color: #57606f
- Focus: Border color #0f3a7d, shadow: 0 0 0 3px rgba(15, 58, 125, 0.1)

Auth Button:
- Padding: 8px 16px
- Font-size: 14px
- Border-radius: 4px
- Background: #0f3a7d
- Color: white
- Margin-left: 16px
```

### 6.2 Hero Section
```
Height: 420px (desktop), 280px (mobile)
Background: Gradient overlay + background image
Layout: Center aligned

Components:
┌─────────────────────────────────────┐
│                                     │
│    Category Tag                      │ 
│    Main Headline                     │ 3.5rem, serif, bold
│    Subtitle                          │ 1.125rem, sans, secondary
│    Author & Date                     │ 0.875rem, sans, meta gray
│                                     │
└─────────────────────────────────────┘

Category Tag:
- Padding: 8px 12px
- Font-size: 0.75rem
- Background: rgba(212, 165, 116, 0.15)
- Color: #d4a574
- Border-radius: 3px
- Text-transform: uppercase
- Letter-spacing: 0.04em
- Margin-bottom: 16px

Gradient Overlay:
- Linear gradient: rgba(0,0,0,0.3) → rgba(0,0,0,0.1)
- Direction: to bottom

Image Requirements:
- Aspect ratio: 16:9 or full-height
- Min-height: 420px desktop
- Object-fit: cover
- Performance: Lazy load, WebP format
```

### 6.3 Article Card
```
Layout: Horizontal on desktop, vertical on mobile

┌─────────────────────┐
│   Image 50%   │ Content 50% │
│               │              │
│               │ Title        │
│               │ Excerpt      │
│               │ Meta + CTA   │
└─────────────────────┘

Container:
- Padding: 32px
- Border-radius: 8px
- Background: #ffffff
- Border: 1px #e8e8e8
- Hover: Shadow 0 8px 24px rgba(0,0,0,0.08)
- Transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1)

Image:
- Width: 50% desktop, 100% mobile
- Height: 240px
- Border-radius: 4px
- Object-fit: cover

Title:
- Font: 24px serif, 700 weight
- Color: #1a1a1a
- Margin-bottom: 12px
- Line-height: 1.3

Excerpt:
- Font: 14px sans, 400 weight
- Color: #57606f
- Line-height: 1.6
- Margin-bottom: 20px
- Display: -webkit-line-clamp: 2

Meta + CTA:
- Display: flex, space-between, align-center
- Font: 12px sans, secondary gray
- CTA Button: "Read More" link style
```

### 6.4 Buttons
```
Primary Button (CTA):
- Padding: 12px 24px
- Font: 16px sans, 600 weight
- Color: white
- Background: #0f3a7d
- Border-radius: 4px
- Cursor: pointer
- Hover: Background #0d2e5f (darker)
- Active: Background #0a2450
- Disabled: Background #ccc, cursor: not-allowed
- Transition: background 0.2s

Secondary Button:
- Padding: 12px 24px
- Font: 16px sans, 600 weight
- Color: #0f3a7d
- Background: transparent
- Border: 2px solid #0f3a7d
- Border-radius: 4px
- Hover: Background rgba(15, 58, 125, 0.05)

Text Button (Link):
- Color: #0f3a7d
- Text-decoration: none
- Border-bottom: 1px solid rgba(15, 58, 125, 0.3)
- Hover: Border-color #0f3a7d
- Transition: border 0.2s

Icon Button:
- Width/Height: 40px
- Display: flex, center
- Border-radius: 4px
- Hover: Background #f9f9f9
```

### 6.5 Input Fields
```
Text Input / Textarea:
- Padding: 12px 16px
- Font: 16px sans, 400 weight
- Border: 1px #e8e8e8
- Border-radius: 4px
- Background: white
- Color: #1a1a1a
- Placeholder: #a0a0a0

Focus State:
- Border-color: #0f3a7d
- Box-shadow: 0 0 0 3px rgba(15, 58, 125, 0.1)
- Outline: none

Error State:
- Border-color: #d62828
- Box-shadow: 0 0 0 3px rgba(214, 40, 40, 0.1)
- Error text: 12px sans, #d62828, margin-top 4px

Disabled State:
- Background: #f9f9f9
- Color: #a0a0a0
- Cursor: not-allowed
```

### 6.6 Form Labels
```
Label:
- Font: 14px sans, 600 weight
- Color: #1a1a1a
- Margin-bottom: 8px
- Display: block

Required Indicator:
- Color: #e63946
- Margin-left: 4px
```

### 6.7 Badges & Tags
```
Default Badge:
- Padding: 6px 12px
- Font: 12px sans, 600 weight
- Color: #1a1a1a
- Background: #f9f9f9
- Border-radius: 12px
- Border: 1px #e8e8e8

Category Badge:
- Padding: 8px 12px
- Font: 12px sans, 600 weight
- Color: #d4a574
- Background: rgba(212, 165, 116, 0.1)
- Border-radius: 3px
- Text-transform: uppercase

Status Badges:
- Draft: Gray (#a0a0a0) on #f9f9f9
- Published: Green (#06a77d) on rgba(6, 167, 125, 0.1)
- Scheduled: Amber (#f4a261) on rgba(244, 162, 97, 0.1)
```

### 6.8 Cards
```
Minimal Card:
- Padding: 20px
- Border: none
- Background: #ffffff
- Box-shadow: 0 1px 3px rgba(0,0,0,0.05)
- Border-radius: 6px

Elevated Card:
- Padding: 32px
- Border: none
- Background: #ffffff
- Box-shadow: 0 8px 24px rgba(0,0,0,0.08)
- Border-radius: 8px

Editorial Card (Premium):
- Padding: 40px
- Border: 1px #e8e8e8
- Background: #ffffff
- Box-shadow: none
- Border-radius: 4px
```

### 6.9 Modals & Dialogs
```
Modal Overlay:
- Background: rgba(0, 0, 0, 0.7)
- Z-index: 50
- Backdrop-filter: blur(0px) or simple overlay

Modal Box:
- Width: 90% max on mobile, 600px on desktop
- Background: white
- Border-radius: 8px
- Padding: 40px
- Box-shadow: 0 20px 60px rgba(0,0,0,0.15)
- Z-index: 51

Close Button:
- Position: top-right
- Padding: 8px
- Background: transparent
- Border: none
- Cursor: pointer
- Icon: ✕ (18px)
- Color: #57606f
- Hover: Color #1a1a1a

Modal Title:
- Font: 28px serif, 700 weight
- Color: #1a1a1a
- Margin-bottom: 16px

Modal Content:
- Font: 16px sans, 400 weight
- Color: #1a1a1a
- Line-height: 1.6
- Margin-bottom: 32px

Modal Actions:
- Display: flex, gap: 12px
- Justify-content: flex-end
- Margin-top: 32px
```

### 6.10 Loading States & Spinners
```
Spinner (Minimal):
- Size: 24px (small), 40px (default), 56px (large)
- Border-width: 2px
- Border-color: #e8e8e8
- Border-top-color: #0f3a7d
- Border-radius: 50%
- Animation: spin 1s linear infinite

Skeleton Loader:
- Background: linear-gradient(
    90deg,
    #f9f9f9 0%,
    #ffffff 50%,
    #f9f9f9 100%
  )
- Background-size: 200% 100%
- Animation: shimmer 2s infinite
```

### 6.11 Notifications / Alerts
```
Alert Box:
- Padding: 16px 20px
- Border-radius: 4px
- Font: 14px sans, 400 weight
- Border-left: 4px solid

Success:
- Border-color: #06a77d
- Background: rgba(6, 167, 125, 0.05)
- Color: #06a77d

Error:
- Border-color: #d62828
- Background: rgba(214, 40, 40, 0.05)
- Color: #d62828

Warning:
- Border-color: #f4a261
- Background: rgba(244, 162, 97, 0.05)
- Color: #d4a574

Info:
- Border-color: #457b9d
- Background: rgba(69, 123, 157, 0.05)
- Color: #457b9d

Close Button:
- Float: right
- Cursor: pointer
- Color: inherit
- Font-size: 20px
- Line-height: 1
```

### 6.12 Pagination
```
Container:
- Display: flex, align-center, justify-center
- Gap: 8px
- Margin-top: 48px

Page Button:
- Width: 40px
- Height: 40px
- Display: flex, center
- Border: 1px #e8e8e8
- Border-radius: 4px
- Font: 14px sans, 500 weight
- Cursor: pointer
- Background: #ffffff
- Color: #1a1a1a
- Hover: Background #f9f9f9

Active Page:
- Background: #0f3a7d
- Color: white
- Border-color: #0f3a7d

Disabled:
- Color: #a0a0a0
- Cursor: not-allowed
- Border-color: #e8e8e8
```

### 6.13 Divider / Separator
```
Horizontal Line:
- Height: 1px
- Background: #e8e8e8
- Margin: 32px 0 (desktop), 24px 0 (mobile)

With Text:
- Display: flex, align-center, gap: 12px
- Font: 12px sans, secondary gray
- Text-transform: uppercase
- Letter-spacing: 0.04em
```

---

## 7. RESPONSIVE BEHAVIOR

### Mobile-First Approach
```
xs (320px):  Base styles, single column
sm (640px):  Two columns, larger touch targets
md (768px):  Three columns, grid layouts start
lg (1024px): Four+ columns, sidebars appear
xl (1280px): Full desktop experience
```

### Breakpoint Usage in TailwindCSS
```javascript
// In Tailwind config:
theme: {
  screens: {
    'xs': '320px',
    'sm': '640px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1536px',
  },
}

// Usage in components:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Responsive Typography
```
H1:        56px → 48px → 40px → 32px
H2:        40px → 36px → 32px → 28px
H3:        30px → 28px → 24px → 20px
Body:      16px → 16px → 16px → 16px (never smaller)
Caption:   12px → 12px → 11px → 11px (min 11px for readability)
```

### Responsive Spacing
```
Padding (Cards, Sections):
- Desktop: 40px  → Tablet: 32px → Mobile: 20px

Margin (Between Sections):
- Desktop: 80px  → Tablet: 48px → Mobile: 32px

Gap (Grid/Flex):
- Desktop: 24px  → Tablet: 20px → Mobile: 16px

Line-height (Increases on larger screens):
- Body: 1.6 → 1.7 → 1.8
```

### Responsive Images
```
Hero Image:
- Desktop: 16:9 @ 1200px wide
- Tablet:  16:9 @ 800px wide
- Mobile:  9:16 @ 100% width

Article Images:
- Desktop: 100% width, max-width 800px
- Tablet:  100% width, max-width 600px
- Mobile:  100% width, max-width 320px

Lazy Loading: Yes, with placeholder
Format: WebP for modern browsers, JPEG fallback
```

### Touch-Friendly UI (Mobile)
```
Button Size:        Min 44×44px (accessibility)
Link Tap Target:    Min 44×44px
Input Height:       Min 44px
Spacing Around CTA: 16px min

Navigation:
- Mobile: Hamburger menu (32px icon)
- Tablet: Partial nav + hamburger
- Desktop: Full horizontal nav
```

### Container Queries (Optional for components)
```css
@container (min-width: 400px) {
  .article-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

---

## 8. INTERACTION & ANIMATION

### Timing Functions
```
Instant:     0ms
Quick:       150ms (hover effects)
Standard:    300ms (transitions, modals)
Slow:        500ms (page transitions)
Leisurely:   1000ms+ (entrances)

Easing Functions:
- ease-in:   cubic-bezier(0.4, 0, 1, 1) (Start fast)
- ease-out:  cubic-bezier(0, 0, 0.2, 1) (End slow - PREFERRED)
- ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) (Smooth)
```

### Micro-interactions
```
Button Hover:
- Transition: background 150ms ease-out
- Subtle scale: 1.02 on hover (optional)

Link Underline:
- Transition: border-color 150ms ease-out
- Border-bottom animates on hover

Card Hover:
- Transition: box-shadow 300ms ease-out, transform 300ms ease-out
- Shadow: 0 8px 24px rgba(0,0,0,0.08)
- Optional: translateY(-2px)

Input Focus:
- Transition: border-color 150ms ease-out, box-shadow 150ms ease-out
- Box-shadow: 0 0 0 3px rgba(15, 58, 125, 0.1)
```

### Page Transitions
```
Enter Animation (Fade + Slide):
- Opacity: 0 → 1
- Transform: translateY(10px) → translateY(0)
- Duration: 300ms
- Easing: ease-out

Exit Animation:
- Opacity: 1 → 0
- Duration: 200ms
- Easing: ease-in
```

### No Motion / Accessibility
```
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 9. ACCESSIBILITY (A11Y)

### Color Contrast
```
WCAG AA (minimum):
- Normal text: 4.5:1 contrast ratio
- Large text: 3:1 contrast ratio

WCAG AAA (optimal):
- Normal text: 7:1 contrast ratio
- Large text: 4.5:1 contrast ratio

All accent colors must meet AA minimum against backgrounds.
```

### Semantic HTML
```html
<header> - Navigation, branding
<nav> - Primary navigation
<main> - Primary content
<article> - Standalone content
<section> - Thematic grouping
<aside> - Related content
<footer> - Site footer
```

### Focus Management
```css
/* Visible focus indicator */
:focus-visible {
  outline: 2px solid #0f3a7d;
  outline-offset: 2px;
}

/* Remove default outline only if custom focus shown */
:focus {
  outline: none;
}
```

### ARIA Labels
```html
<button aria-label="Close dialog">✕</button>
<img alt="Article featured image" src="...">
<input aria-label="Search articles" placeholder="...">
<span aria-live="polite" aria-atomic="true">Saved</span>
```

### Keyboard Navigation
- Tab: Move focus forward
- Shift+Tab: Move focus backward
- Enter: Activate button/link
- Space: Toggle checkbox/radio
- Escape: Close modal/dropdown
- Arrow Keys: Navigate within components

### Screen Reader Testing
- Use NVDA (Windows) or VoiceOver (Mac)
- Test with TalkBack (Android)
- Verify heading hierarchy (h1 > h2 > h3)
- Check form labels are associated with inputs
- Verify images have alt text

---

## 10. UX RECOMMENDATIONS

### Article Editor Experience
```
Layout:
- Left sidebar: Document outline, editing tools (20% width)
- Center: Full-screen editor with generous margins (max-width: 800px)
- Right sidebar: Properties, publishing options (20% width)

Auto-save:
- Save every keystroke (debounced 1000ms)
- Show save indicator: "Saving..." → "Saved"
- Display last saved time: "Last saved 2 minutes ago"

Draft Management:
- Auto-save to drafts every 30 seconds
- Version history available (show last 10 versions)
- Warn before losing unsaved changes
- Clear autosave on successful publish
```

### Reading Experience
```
Focus Mode:
- Remove distractions: Hide sidebar, minimize header
- Distraction-free: Full-screen reading mode
- Font size adjustment: 14px → 18px → 22px
- Line height toggle: Compact, Normal, Relaxed
- Theme toggle: Light, Dark, Sepia

Content Highlighting:
- Support text selection highlighting
- Show reading time: "5 min read"
- Progress indicator: Subtle line at top of viewport
- Scroll depth indicator on right margin
```

### Navigation & Discovery
```
Breadcrumb Navigation:
Home > Category > Article

Related Content:
- Show 3-4 related articles below main content
- Use tags to determine relatedness
- Include thumbnail, headline, date
- "More in Category" section before footer

Search:
- Auto-suggest articles as user types
- Search by title, content, author
- Filter by date range, category, author
- Save search queries
```

### Content Hierarchy
```
Visual Hierarchy (In order of importance):
1. Main headline (largest, boldest)
2. Hero image / featured content
3. Article metadata (author, date)
4. Body text
5. Subheadings
6. Block quotes (styled distinctly)
7. Images with captions
8. Related articles section
```

### Performance Optimization
```
Loading Strategy:
- Hero image: Priority loading
- Body text: Render first
- Images in article: Lazy load
- Related articles: Lazy load below fold
- Comments: Lazy load (if applicable)

Image Optimization:
- Use WebP with JPEG fallback
- Implement responsive images (srcset)
- Lazy load images below fold
- Compress images to < 500KB per image

Code Splitting:
- Separate editor from reader experience
- Lazy load heavy components
- Defer non-critical scripts
```

### Error Handling
```
HTTP Errors:
- 404: Show "Article not found" with search
- 500: Show "Server error" with retry button
- Network: Show "Connection lost" with offline message

Validation Errors:
- Inline errors next to inputs
- Error icon + text in red
- Clear action to resolve: "Required field"

Success Messages:
- "Article published successfully"
- "Changes saved"
- Auto-dismiss after 4 seconds (unless dismissible)
```

---

## 11. DESIGN TOKENS (For Implementation)

### CSS Variables
```css
:root {
  /* Colors */
  --color-primary: #1a1a1a;
  --color-secondary: #57606f;
  --color-accent: #0f3a7d;
  --color-accent-warm: #d4a574;
  --color-success: #06a77d;
  --color-error: #d62828;
  --color-warning: #f4a261;
  --color-info: #457b9d;
  
  /* Backgrounds */
  --color-bg-light: #f7f7f7;
  --color-bg-white: #ffffff;
  --color-bg-gray: #f9f9f9;
  
  /* Typography */
  --font-serif: 'Georgia', 'Times New Roman', serif;
  --font-sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  --font-mono: 'Menlo', 'Monaco', 'Courier New', monospace;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  
  /* Border Radius */
  --radius-sm: 3px;
  --radius-md: 4px;
  --radius-lg: 6px;
  --radius-xl: 8px;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
  --shadow-xl: 0 20px 60px rgba(0, 0, 0, 0.15);
  
  /* Transitions */
  --transition-quick: 150ms ease-out;
  --transition-standard: 300ms ease-out;
  --transition-slow: 500ms ease-out;
  
  /* Z-index */
  --z-base: 0;
  --z-dropdown: 10;
  --z-sticky: 20;
  --z-fixed: 30;
  --z-modal-bg: 50;
  --z-modal: 51;
  --z-tooltip: 60;
}
```

### Tailwind Configuration Example
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        editorial: {
          dark: '#1a1a1a',
          light: '#f7f7f7',
          white: '#ffffff',
          blue: '#0f3a7d',
          gold: '#d4a574',
          gray: '#57606f',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0, 0, 0, 0.05)',
        md: '0 4px 12px rgba(0, 0, 0, 0.08)',
        lg: '0 8px 24px rgba(0, 0, 0, 0.08)',
        xl: '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        sm: '3px',
        md: '4px',
        lg: '6px',
        xl: '8px',
      },
    },
  },
}
```

---

## 12. IMPLEMENTATION CHECKLIST

### Phase 1: Foundation
- [ ] Implement color palette in TailwindCSS
- [ ] Set up typography scale
- [ ] Configure spacing system
- [ ] Create CSS variables
- [ ] Set up globals.css with base styles

### Phase 2: Core Components
- [ ] Navigation component
- [ ] Button variants (primary, secondary, text)
- [ ] Input fields with validation
- [ ] Card components
- [ ] Badge/Tag components
- [ ] Modal/Dialog component

### Phase 3: Feature Components
- [ ] Article card layout
- [ ] Hero section
- [ ] Article viewer
- [ ] Editor interface
- [ ] Article list view
- [ ] Pagination

### Phase 4: Refinement
- [ ] Add animation/transition effects
- [ ] Implement responsive breakpoints
- [ ] Accessibility audit (WCAG AA)
- [ ] Dark mode variant
- [ ] Performance optimization

### Phase 5: Documentation
- [ ] Component storybook (optional)
- [ ] Design system documentation site
- [ ] Developer guidelines
- [ ] QA testing checklist

---

## 13. DESIGN RESOURCES & TOOLS

### Recommended Tools
- **Design**: Figma, Adobe XD
- **Prototyping**: Framer, Webflow
- **Component Library**: Storybook
- **Accessibility Testing**: axe DevTools, Wave
- **Color Tools**: Colorbox.io, Accessible Colors
- **Typography**: Google Fonts, Typography.com

### Asset Optimization
- ImageOptim (Mac) / PNGQuant (Windows)
- TinyPNG/JPEGOptim for compression
- Figma export settings: SVG for icons, WebP for photos

### Useful Links
- [Web Content Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Material Design](https://material.io/design)
- [Smashing Magazine Typography Guide](https://www.smashingmagazine.com/)
- [System Design Resources](https://www.designsystems.com/)

---

## 14. BRAND VOICE & TONE

### Writing Guidelines
```
Headlines:
- Authoritative yet approachable
- Active voice preferred
- Avoid clickbait
- Example: "The Future of Digital Journalism" vs "You Won't Believe What Journalism Becomes"

Body Copy:
- Conversational, not academic
- Clear, concise sentences
- Short paragraphs (3-4 sentences max)
- Avoid jargon unless necessary

Meta/Labels:
- Consistent terminology
- Professional tone
- Consistent date formats: "May 28, 2026" or "28 May 2026"
- Author: "By [Author Name]"
- Reading time: "[X] min read"

Error Messages:
- Friendly, not robotic
- Explain what went wrong
- Suggest next steps
- Example: "Unable to save. Please check your connection and try again."
```

---

## 15. FINAL NOTES

### Design System Maintenance
- Review quarterly and update with new components
- Maintain consistent versioning
- Document breaking changes
- Keep all stakeholders informed of updates

### Design Handoff to Development
- Provide high-fidelity mockups in Figma
- Include responsive specifications
- Add interaction annotations
- Specify spacing, colors, shadows explicitly
- Include light and dark mode variants

### Continuous Improvement
- Collect user feedback through analytics
- Monitor page load times and performance
- Test with real users monthly
- Adjust based on usage patterns
- Keep abreast of design trends

---

**Design System Version**: 1.0  
**Last Updated**: May 28, 2026  
**Maintained By**: Design Team  
**Next Review**: August 28, 2026
