# Project Structure Implementation Guide

## Quick Reference: Actual Folder Setup

This guide maps the theoretical architecture to your actual Journalism CMS project structure.

---

## 📂 Your Current Project Structure

```
journalism-cms/
├── app/
│   ├── api/
│   │   ├── articles/           ✅ Article API endpoints
│   │   └── templates/          ✅ Template API endpoints
│   ├── articles/
│   │   └── [id]/
│   │       └── page.tsx        ✅ Article view page
│   ├── dashboard/
│   │   └── page.tsx            ✅ Dashboard page
│   ├── editor/
│   │   ├── page.tsx            ✅ Editor page
│   │   └── [id]/
│   │       └── page.tsx        ✅ Edit existing article
│   ├── layout.tsx              ✅ Root layout
│   ├── page.tsx                ✅ Home page
│   └── globals.css             ✅ Global styles
│
├── components/
│   ├── ArticleRenderer.tsx     ✅ Render articles
│   ├── ContentEditor.tsx        ✅ Content editing
│   ├── Dashboard.tsx            ✅ Dashboard view
│   ├── ErrorDisplay.tsx         ✅ Error handling
│   ├── LivePreview.tsx          ✅ Live preview
│   ├── LoadingSpinner.tsx       ✅ Loading state
│   ├── TemplateCard.tsx         ✅ Template card
│   ├── TemplateSelector.tsx     ✅ Template selection
│   └── (others)
│
├── lib/
│   └── mongodb.ts              ✅ DB connection
│
├── models/
│   ├── article.ts              ✅ Article schema
│   ├── template.ts             ✅ Template schema
│   └── user.ts                 ✅ User schema
│
├── public/                      ✅ Static assets
├── .env.local                   ✅ Environment config
├── package.json                 ✅ Dependencies
├── tsconfig.json                ✅ TypeScript config
├── next.config.js               ✅ Next.js config
├── tailwind.config.js           ✅ Tailwind config
├── postcss.config.js            ✅ PostCSS config
└── README.md                    ✅ Documentation
```

---

## 🚀 Recommended Restructuring (Optional but Beneficial)

If you want to scale up, reorganize as follows:

### Phase 1: Improve Component Organization

```
components/
├── common/                      # NEW: Shared UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Navigation.tsx
│   └── Sidebar.tsx
│
├── ui/                          # NEW: Atomic UI components
│   ├── buttons/
│   │   └── Button.tsx
│   ├── forms/
│   │   └── Input.tsx
│   ├── cards/
│   │   └── Card.tsx
│   └── alerts/
│       └── Alert.tsx
│
├── templates/                   # REORGANIZE: Template components
│   ├── TemplateSelector.tsx
│   ├── TemplateCard.tsx
│   └── TemplatePreview.tsx
│
├── editor/                      # REORGANIZE: Editor components
│   ├── ContentEditor.tsx
│   └── LivePreview.tsx
│
├── articles/                    # REORGANIZE: Article components
│   ├── ArticleRenderer.tsx
│   └── ArticleList.tsx
│
├── dashboard/                   # NEW: Dashboard components
│   └── Dashboard.tsx
│
└── utils/                       # REORGANIZE: Utility components
    ├── LoadingSpinner.tsx
    ├── ErrorDisplay.tsx
    └── ErrorBoundary.tsx
```

### Phase 2: Expand Library Utilities

```
lib/
├── db/
│   ├── mongodb.ts              # MOVE: Database connection
│   └── seed.ts                 # NEW: Seed data
│
├── api/
│   ├── client.ts               # NEW: Fetch wrapper
│   ├── handler.ts              # NEW: Error handler
│   └── middleware.ts           # NEW: Middleware
│
├── utils/                      # NEW: General utilities
│   ├── slug.ts
│   ├── validation.ts
│   ├── formatting.ts
│   ├── constants.ts
│   └── helpers.ts
│
├── validators/                 # NEW: Domain validators
│   ├── article.ts
│   ├── template.ts
│   └── user.ts
│
├── auth/                       # NEW: Auth utilities
│   ├── session.ts
│   ├── permissions.ts
│   └── middleware.ts
│
└── hooks/                      # NEW: Custom React hooks
    ├── useArticle.ts
    ├── useTemplate.ts
    ├── useFetch.ts
    └── useForm.ts
```

### Phase 3: Expand Type Definitions

```
types/                          # NEW: Centralized types
├── index.ts                    # Export all types
├── entities.ts                 # Data models
├── api.ts                      # API types
└── forms.ts                    # Form types
```

### Phase 4: Add Tests Structure

```
tests/                          # NEW: Test suite
├── unit/
│   ├── utils.test.ts
│   └── validators.test.ts
├── integration/
│   └── api.test.ts
└── e2e/
    └── editor.spec.ts
```

---

## 🛠️ Migration Steps (From Current to Recommended)

### Step 1: Create New Folder Structure

```bash
# Create new directories
mkdir -p components/{common,ui/{buttons,forms,cards,alerts},templates,editor,articles,dashboard}
mkdir -p lib/{db,api,utils,validators,auth,hooks}
mkdir -p types
mkdir -p tests/{unit,integration,e2e}
```

### Step 2: Move Components

```bash
# Move existing components to organized folders
mv components/LoadingSpinner.tsx components/utils/
mv components/ErrorDisplay.tsx components/utils/
mv components/TemplateSelector.tsx components/templates/
mv components/TemplateCard.tsx components/templates/
mv components/ContentEditor.tsx components/editor/
mv components/LivePreview.tsx components/editor/
mv components/ArticleRenderer.tsx components/articles/
mv components/Dashboard.tsx components/dashboard/
```

### Step 3: Create Shared UI Components

```bash
# Create atomic UI components
touch components/ui/buttons/Button.tsx
touch components/ui/forms/Input.tsx
touch components/ui/cards/Card.tsx
touch components/ui/alerts/Alert.tsx
```

### Step 4: Move and Expand Utilities

```bash
# Move and expand lib
mv lib/mongodb.ts lib/db/
mkdir -p lib/{api,utils,validators,auth,hooks}
touch lib/api/client.ts
touch lib/utils/validation.ts
touch lib/hooks/useArticle.ts
```

### Step 5: Create Type Definitions

```bash
# Create centralized types
mkdir -p types
touch types/index.ts
touch types/entities.ts
touch types/api.ts
```

---

## 📋 File Organization Patterns

### Pattern 1: Component with Props

```typescript
// components/templates/TemplateCard.tsx

import React from 'react';
import { ITemplate } from '@/types/entities';

interface TemplateCardProps {
  template: ITemplate;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onSelect,
  isLoading = false,
}) => {
  return (
    <div onClick={() => onSelect(template._id)}>
      {/* Component JSX */}
    </div>
  );
};

export default TemplateCard;
```

### Pattern 2: Custom Hook

```typescript
// lib/hooks/useArticle.ts

import { useState, useEffect } from 'react';
import { IArticle } from '@/types/entities';

export function useArticle(id: string) {
  const [article, setArticle] = useState<IArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`/api/articles/${id}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setArticle(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error');
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  return { article, loading, error };
}
```

### Pattern 3: API Route with Handlers

```typescript
// app/api/articles/route.ts

import { connectDB } from '@/lib/db/mongodb';
import { Article } from '@/models/article';
import { validateArticle } from '@/lib/validators/article';
import { handleApiError } from '@/lib/api/handler';

export async function GET(request: Request) {
  try {
    await connectDB();
    const articles = await Article.find();
    return Response.json({ success: true, data: articles });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate
    const validation = validateArticle(body);
    if (!validation.valid) {
      return Response.json({ success: false, errors: validation.errors }, { status: 400 });
    }

    // Create
    const article = await Article.create(body);
    return Response.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
```

### Pattern 4: Validator Module

```typescript
// lib/validators/article.ts

import * as z from 'zod';

const ArticleSchema = z.object({
  title: z.string().min(1).max(200),
  author: z.string().min(1),
  content: z.object({}),
  templateId: z.string(),
  status: z.enum(['draft', 'published']),
});

export function validateArticle(data: unknown) {
  const result = ArticleSchema.safeParse(data);
  return {
    valid: result.success,
    data: result.data,
    errors: result.error?.flatten() || null,
  };
}
```

### Pattern 5: Type Definition

```typescript
// types/entities.ts

export interface ITemplate {
  _id: string;
  title: string;
  description: string;
  category: 'news' | 'magazine' | 'longform' | 'interactive';
  fields: ITemplateField[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IArticle {
  _id: string;
  title: string;
  slug: string;
  templateId: string;
  author: string;
  content: Record<string, any>;
  status: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

// Export all types from one place
export * from './api';
export * from './forms';
```

---

## ✅ Checklist for Organization

### Before Starting

- [ ] Review current project structure
- [ ] Plan component hierarchy
- [ ] Identify shared logic
- [ ] List new utilities needed
- [ ] Define type interfaces

### Implementation

- [ ] Create folder structure
- [ ] Move files to new locations
- [ ] Update import paths
- [ ] Fix TypeScript errors
- [ ] Create index files for exports
- [ ] Test all routes
- [ ] Update relative imports to path aliases

### After Completion

- [ ] All imports use path aliases
- [ ] No broken imports
- [ ] Components are co-located
- [ ] Types are centralized
- [ ] Utilities are reusable
- [ ] No duplicate code
- [ ] All tests pass
- [ ] Documentation updated

---

## 🔗 Import Path Updates

### Before (Relative Imports)

```typescript
import { Button } from '../../../components/ui/Button';
import { useArticle } from '../../../lib/hooks/useArticle';
import type { IArticle } from '../../../types/entities';
```

### After (Path Aliases)

```typescript
import { Button } from '@/components/ui/buttons';
import { useArticle } from '@/lib/hooks';
import type { IArticle } from '@/types';
```

### Configure Path Aliases in tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/models/*": ["models/*"],
      "@/types/*": ["types/*"],
      "@/public/*": ["public/*"]
    }
  }
}
```

---

## 📈 Scaling Checklist

As your project grows:

### 200-500 Lines per Feature
- [ ] Use current structure
- [ ] Add more components as needed
- [ ] Create domain-specific folders

### 500-2000 Lines per Feature
- [ ] Reorganize with Phase 1 structure
- [ ] Create feature-based folders
- [ ] Add custom hooks

### 2000+ Lines per Feature
- [ ] Implement full architecture
- [ ] Create API client patterns
- [ ] Add middleware layer
- [ ] Implement cache strategy

---

## 🎯 Quick Decision Tree

**Should I create a new folder?**
1. Are there 5+ related files? → YES
2. Will other features use these? → YES
3. Different responsibility from existing? → YES
4. **If YES to all: Create folder**
5. **Otherwise: Add to existing folder**

**Should I extract a component?**
1. Is it used in 2+ places? → YES
2. Does it have isolated logic? → YES
3. Can it be described in one sentence? → YES
4. **If YES to all: Extract component**
5. **Otherwise: Keep inline**

**Should I create a hook?**
1. Is there repeated logic? → YES
2. Is it related to data/state? → YES
3. Can it be isolated? → YES
4. **If YES to all: Create hook**
5. **Otherwise: Use helper function**

---

This structure balances **simplicity** with **scalability**, keeping your project organized as it grows while maintaining developer productivity.
