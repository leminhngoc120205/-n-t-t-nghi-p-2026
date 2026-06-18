# Quick Reference: Folder Structure Visual Guide

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Frontend Layer (app/)                    │   │
│  │                                                        │   │
│  │  Pages    Dashboard → Layout → Components            │   │
│  │  ↓                                                     │   │
│  │  Editor → TemplateSelector → ContentEditor           │   │
│  │  ↓                                                     │   │
│  │  Article View → ArticleRenderer → Preview            │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │            API Layer (app/api/)                       │   │
│  │                                                        │   │
│  │  /api/templates    /api/articles    /api/upload       │   │
│  │         ↓                 ↓               ↓            │   │
│  │  Handlers & Validation  Error Handling              │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Business Logic Layer (lib/)                     │   │
│  │                                                        │   │
│  │  Validators  Hooks  Utils  Auth  API Client          │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │       Data Layer (models/)                            │   │
│  │                                                        │   │
│  │  Article  Template  User  Settings  Activity         │   │
│  └──────────────────────────────────────────────────────┘   │
│                          ↓                                    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Database Layer (MongoDB)                    │   │
│  │                                                        │   │
│  │  Templates Collection                                 │   │
│  │  Articles Collection                                  │   │
│  │  Users Collection                                     │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Folder Dependency Graph

```
Types (types/)
    ↑
    │ imports
    │
Components (components/) ←─────── Hooks (lib/hooks/)
    ↑                              ↑
    │ uses                         │
    │                              │ fetches data
    │                              │
Pages (app/)                   API Routes (app/api/)
    │                              ↑
    │                              │ queries
    │                              │
    ├─────────────────────────────→ Models (models/)
                                    ↑
                                    │ define
                                    │
                                  Database (MongoDB)

Utils (lib/utils/)
    ↑
    │ imported by everything
    │
All modules use validation (lib/validators/)
```

---

## 🎨 Component Hierarchy

```
App Layout (layout.tsx)
    ├── Header (components/common/Header)
    ├── Navigation (components/common/Navigation)
    │
    ├── Dashboard Page
    │   ├── DashboardLayout
    │   ├── DashboardStats
    │   └── ArticleTable
    │
    ├── Editor Page
    │   ├── EditorLayout
    │   ├── TemplateSelector
    │   │   ├── TemplateCard (multiple)
    │   │   └── TemplateCategoryFilter
    │   ├── ContentEditor
    │   │   ├── FieldEditor (multiple)
    │   │   ├── ImageUploader
    │   │   └── RichTextEditor
    │   └── LivePreview
    │
    ├── Article View Page
    │   └── ArticleRenderer
    │       ├── ArticleHeader
    │       ├── ArticleMetadata
    │       └── ArticleContent
    │
    └── Footer (components/common/Footer)
```

---

## 📊 Data Flow Diagram

### Creating an Article

```
1. User navigates to /editor
            ↓
2. TemplateSelector fetches /api/templates
            ↓
3. User selects template (ID: 123)
            ↓
4. ContentEditor loads template schema from /api/templates/123
            ↓
5. User fills form fields (useForm hook)
            ↓
6. LivePreview renders real-time preview
            ↓
7. User clicks Save
            ↓
8. POST /api/articles with:
   - title
   - author
   - templateId
   - content (form data)
   - status
            ↓
9. API handler validates with validateArticle()
            ↓
10. Model creates article in MongoDB
            ↓
11. Response returns {success, data}
            ↓
12. User redirected to /dashboard
```

### Viewing an Article

```
1. URL: /articles/[id]
            ↓
2. ArticleRenderer fetches /api/articles/[id]
            ↓
3. API returns article with content object
            ↓
4. ArticleRenderer maps content to UI
            ↓
5. Display published article with template layout
```

---

## 🗂️ File Organization by Feature

### Template Management Feature

```
App Router
├── app/api/templates/
│   ├── route.ts           # GET all, POST new
│   └── [id]/route.ts      # GET, PUT, DELETE
│
Components
├── components/templates/
│   ├── TemplateSelector.tsx
│   ├── TemplateCard.tsx
│   └── TemplatePreview.tsx
│
Business Logic
├── lib/validators/template.ts
├── lib/hooks/useTemplate.ts
└── lib/api/templateClient.ts
│
Data Layer
└── models/template.ts
```

### Article Management Feature

```
App Router
├── app/dashboard/
│   └── articles/page.tsx  # Article list
├── app/editor/
│   └── [id]/page.tsx      # Article editor
├── app/articles/
│   └── [slug]/page.tsx    # Public article view
└── app/api/articles/
    ├── route.ts           # GET all, POST new
    └── [id]/route.ts      # GET, PUT, DELETE
│
Components
├── components/articles/
│   ├── ArticleRenderer.tsx
│   ├── ArticleList.tsx
│   └── ArticleCard.tsx
├── components/editor/
│   ├── ContentEditor.tsx
│   └── LivePreview.tsx
└── components/dashboard/
    └── Dashboard.tsx
│
Business Logic
├── lib/validators/article.ts
├── lib/hooks/useArticle.ts
└── lib/api/articleClient.ts
│
Data Layer
└── models/article.ts
```

---

## 🔄 Request/Response Cycle

### API Request Pattern

```
Client Component
    ↓
    fetch('/api/articles') or useArticle hook
    ↓
Next.js Handler (app/api/articles/route.ts)
    ↓
    validateInput() ← from lib/validators/
    ↓
    connectDB() ← from lib/db/
    ↓
    Article.find() ← from models/article.ts
    ↓
    Query MongoDB
    ↓
    handleApiError() ← from lib/api/handler.ts
    ↓
Response.json({ success, data })
    ↓
Client receives JSON
    ↓
Update component state
    ↓
Re-render with new data
```

---

## 📋 Common File Imports Pattern

### In a Page Component

```typescript
// app/dashboard/page.tsx
import React from 'react';
import type { Metadata } from 'next';

// Components
import { Dashboard } from '@/components/dashboard';
import { Header } from '@/components/common';
import { Loading } from '@/components/utils';

// Types
import type { IArticle } from '@/types/entities';

// Utils
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { /* ... */ };

export default function DashboardPage() {
  return (
    <div>
      <Header />
      <Dashboard />
    </div>
  );
}
```

### In a Component with Hooks

```typescript
// components/dashboard/Dashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';

// Hooks
import { useArticle } from '@/lib/hooks';
import { useForm } from '@/lib/hooks';

// Components
import { ArticleTable } from '@/components/articles';
import { Error Display } from '@/components/utils';

// Types
import type { IArticle } from '@/types/entities';

export default function Dashboard() {
  const { articles, loading, error } = useArticle();
  const { form, handleChange } = useForm({ /* ... */ });

  return (
    <>
      {error && <ErrorDisplay error={error} />}
      {loading ? <Loading /> : <ArticleTable articles={articles} />}
    </>
  );
}
```

### In an API Route

```typescript
// app/api/articles/route.ts
import { connectDB } from '@/lib/db';
import { Article } from '@/models/article';
import { validateArticle } from '@/lib/validators';
import { handleApiError } from '@/lib/api/handler';
import type { IArticle } from '@/types';

export async function GET(req: Request) {
  try {
    await connectDB();
    const articles = await Article.find();
    return Response.json({ success: true, data: articles });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    
    const validation = validateArticle(body);
    if (!validation.valid) {
      return Response.json({ errors: validation.errors }, { status: 400 });
    }

    const article = await Article.create(body);
    return Response.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

---

## 🎯 When to Create a New File

| Situation | Action | Location |
|-----------|--------|----------|
| Reused in 2+ components | Extract component | `components/feature/` |
| Logic used by multiple pages | Create hook | `lib/hooks/` |
| Repeated validation | Create validator | `lib/validators/` |
| Utility function | Create helper | `lib/utils/` |
| New page route | Create folder | `app/(group)/feature/` |
| API endpoint | Create route | `app/api/resource/` |
| Data schema | Create model | `models/` |
| Type definition | Update types | `types/` |

---

## ⚡ Performance Optimization Points

```
Components/
    ├── Use React.memo() for expensive renders
    ├── Split large components
    └── Lazy load routes

lib/
    ├── Cache API responses
    ├── Debounce search queries
    └── Batch database queries

app/api/
    ├── Use pagination for lists
    ├── Add database indexes
    └── Implement caching headers

Images/
    ├── Use Next.js Image component
    ├── Optimize sizes
    └── Use WebP format
```

---

## 🚀 Deployment Structure

```
Development (npm run dev)
    ↓
Production Build (npm run build)
    ↓
.next/ (built app)
└── Optimized & minified code
│
Deployment (npm start)
    ↓
Server running on port 3000
```

---

## 🔍 Debugging & Monitoring Points

```
Component Issues
    ↑
components/
    ├── Check props
    ├── Verify renders
    └── Test interactions
│
Data Flow Issues
    ↑
lib/hooks/
    ├── Check data fetching
    ├── Verify state updates
    └── Test error handling
│
API Issues
    ↑
app/api/
    ├── Check request validation
    ├── Verify database queries
    └── Test error responses
│
Database Issues
    ↑
models/
    ├── Check schema
    ├── Verify indexes
    └── Test queries
```

This visual reference helps you:
- ✅ Understand project flow
- ✅ Find relevant files quickly
- ✅ Plan new features
- ✅ Optimize performance
- ✅ Debug issues systematically
