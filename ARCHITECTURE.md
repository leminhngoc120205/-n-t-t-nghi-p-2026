# Project Architecture & Folder Structure Guide

## Online Journalism Content Templating Platform
### Professional Scalable Next.js App Router Structure

---

## 📁 Complete Folder Structure

```
journalism-cms/
├── 📂 app/                              # Next.js App Router (Pages & API)
│   ├── 📂 (auth)/                      # Auth routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── 📂 (dashboard)/                 # Dashboard routes group
│   │   ├── 📂 dashboard/
│   │   │   └── page.tsx
│   │   ├── 📂 articles/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   └── 📂 templates/
│   │       ├── page.tsx
│   │       └── [id]/
│   │           └── page.tsx
│   ├── 📂 (editor)/                    # Editor routes group
│   │   ├── 📂 editor/
│   │   │   ├── page.tsx
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   ├── 📂 (public)/                    # Public routes group
│   │   ├── 📂 articles/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── 📂 about/
│   │   │   └── page.tsx
│   │   └── 📂 contact/
│   │       └── page.tsx
│   ├── 📂 api/                         # API Routes
│   │   ├── 📂 auth/
│   │   │   ├── route.ts
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── 📂 templates/
│   │   │   ├── route.ts                # GET all, POST new
│   │   │   ├── 📂 [id]/
│   │   │   │   └── route.ts            # GET, PUT, DELETE
│   │   │   └── 📂 bulk/
│   │   │       └── route.ts            # Bulk operations
│   │   ├── 📂 articles/
│   │   │   ├── route.ts                # GET all, POST new
│   │   │   ├── 📂 [id]/
│   │   │   │   └── route.ts            # GET, PUT, DELETE
│   │   │   ├── 📂 publish/
│   │   │   │   └── route.ts
│   │   │   └── 📂 search/
│   │   │       └── route.ts
│   │   ├── 📂 users/
│   │   │   ├── route.ts
│   │   │   └── 📂 [id]/
│   │   │       └── route.ts
│   │   └── 📂 upload/
│   │       └── route.ts
│   ├── layout.tsx                      # Root layout
│   ├── page.tsx                        # Home page
│   └── globals.css                     # Global styles
│
├── 📂 components/                       # Reusable React Components
│   ├── 📂 common/                      # Shared UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Loading.tsx
│   │   └── ErrorBoundary.tsx
│   ├── 📂 ui/                          # Atomic UI components
│   │   ├── 📂 buttons/
│   │   │   ├── Button.tsx
│   │   │   ├── IconButton.tsx
│   │   │   └── ButtonGroup.tsx
│   │   ├── 📂 forms/
│   │   │   ├── Input.tsx
│   │   │   ├── TextArea.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── FormGroup.tsx
│   │   ├── 📂 modal/
│   │   │   ├── Modal.tsx
│   │   │   └── Dialog.tsx
│   │   ├── 📂 cards/
│   │   │   ├── Card.tsx
│   │   │   └── CardContent.tsx
│   │   ├── 📂 alerts/
│   │   │   ├── Alert.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Notification.tsx
│   │   └── 📂 layout/
│   │       ├── Container.tsx
│   │       ├── Grid.tsx
│   │       └── Flex.tsx
│   ├── 📂 templates/                   # Template-related components
│   │   ├── TemplateSelector.tsx
│   │   ├── TemplateCard.tsx
│   │   ├── TemplateGrid.tsx
│   │   ├── TemplatePreview.tsx
│   │   └── TemplateCategoryFilter.tsx
│   ├── 📂 editor/                      # Editor-specific components
│   │   ├── ContentEditor.tsx
│   │   ├── FieldEditor.tsx
│   │   ├── RichTextEditor.tsx
│   │   ├── ImageUploader.tsx
│   │   ├── VideoEmbed.tsx
│   │   └── EditorToolbar.tsx
│   ├── 📂 articles/                    # Article-related components
│   │   ├── ArticleList.tsx
│   │   ├── ArticleCard.tsx
│   │   ├── ArticleRenderer.tsx
│   │   ├── ArticleHeader.tsx
│   │   ├── ArticleMetadata.tsx
│   │   └── ArticleActions.tsx
│   ├── 📂 dashboard/                   # Dashboard components
│   │   ├── DashboardStats.tsx
│   │   ├── RecentArticles.tsx
│   │   ├── ArticleTable.tsx
│   │   ├── ActivityFeed.tsx
│   │   └── DashboardLayout.tsx
│   ├── 📂 forms/                       # Form components
│   │   ├── LoginForm.tsx
│   │   ├── RegisterForm.tsx
│   │   ├── ArticleMetadataForm.tsx
│   │   ├── ProfileForm.tsx
│   │   └── SearchForm.tsx
│   └── 📂 auth/                        # Authentication components
│       ├── ProtectedRoute.tsx
│       ├── AuthProvider.tsx
│       └── UserMenu.tsx
│
├── 📂 lib/                              # Utility functions & helpers
│   ├── 📂 db/
│   │   ├── mongodb.ts                  # Database connection
│   │   └── seed.ts                     # Database seeding
│   ├── 📂 api/
│   │   ├── client.ts                   # Fetch wrapper
│   │   ├── handler.ts                  # Error handling
│   │   └── middleware.ts               # API middleware
│   ├── 📂 utils/
│   │   ├── slug.ts                     # Slug generation
│   │   ├── validation.ts               # Input validation
│   │   ├── formatting.ts               # Data formatting
│   │   ├── constants.ts                # App constants
│   │   ├── types.ts                    # Shared types
│   │   └── helpers.ts                  # General helpers
│   ├── 📂 auth/
│   │   ├── session.ts                  # Session management
│   │   ├── permissions.ts              # Role-based permissions
│   │   └── middleware.ts               # Auth middleware
│   ├── 📂 validators/
│   │   ├── article.ts
│   │   ├── template.ts
│   │   ├── user.ts
│   │   └── auth.ts
│   └── 📂 hooks/                       # Custom React hooks
│       ├── useArticle.ts
│       ├── useTemplate.ts
│       ├── useUser.ts
│       ├── useFetch.ts
│       ├── useForm.ts
│       └── useAuth.ts
│
├── 📂 models/                           # MongoDB Schemas
│   ├── template.ts                     # Template schema
│   ├── article.ts                      # Article schema
│   ├── user.ts                         # User schema
│   ├── settings.ts                     # Settings schema
│   └── activity.ts                     # Activity log schema
│
├── 📂 types/                            # TypeScript type definitions
│   ├── index.ts                        # Exported types
│   ├── api.ts                          # API response types
│   ├── entities.ts                     # Entity types
│   ├── forms.ts                        # Form types
│   └── next-auth.d.ts                  # NextAuth types
│
├── 📂 styles/                           # Global & shared styles
│   ├── globals.css                     # Global styles
│   ├── tailwind.css                    # Tailwind directives
│   ├── 📂 modules/
│   │   ├── editor.module.css
│   │   ├── templates.module.css
│   │   └── articles.module.css
│   └── 📂 themes/
│       ├── light.css
│       └── dark.css
│
├── 📂 public/                           # Static assets
│   ├── 📂 images/
│   │   ├── 📂 templates/
│   │   ├── 📂 icons/
│   │   └── logo.svg
│   ├── 📂 videos/
│   ├── 📂 fonts/
│   └── favicon.ico
│
├── 📂 tests/                            # Testing
│   ├── 📂 unit/
│   │   ├── utils.test.ts
│   │   └── validators.test.ts
│   ├── 📂 integration/
│   │   ├── api.test.ts
│   │   └── database.test.ts
│   ├── 📂 e2e/
│   │   ├── editor.spec.ts
│   │   └── dashboard.spec.ts
│   └── setup.ts                        # Test setup
│
├── 📂 .github/                          # GitHub configuration
│   ├── workflows/
│   │   ├── ci.yml
│   │   └── deploy.yml
│   └── copilot-instructions.md
│
├── .env.local.example                  # Environment template
├── .env.local                           # Environment variables (gitignored)
├── .gitignore                           # Git ignore rules
├── .eslintrc.json                       # ESLint config
├── next.config.js                       # Next.js config
├── tsconfig.json                        # TypeScript config
├── tailwind.config.js                   # Tailwind config
├── postcss.config.js                    # PostCSS config
├── package.json                         # Dependencies
├── package-lock.json                    # Lock file
└── README.md                            # Project documentation

```

---

## 📋 Folder Purpose & Structure

### **app/** - Next.js App Router
**Purpose**: All page routes and API endpoints following Next.js 14 App Router conventions.

```
app/
├── (auth)                   # Auth layout group
├── (dashboard)             # Dashboard layout group
├── (editor)                # Editor layout group
├── (public)                # Public layout group
├── api/                    # Backend API routes
├── layout.tsx              # Root layout wrapper
├── page.tsx                # Home page
└── globals.css             # Global styles
```

**Best Practices**:
- Use route groups `(name)` to organize related routes
- Keep API routes near the UI pages they serve
- Separate public and protected routes with layout groups
- Use `layout.tsx` for shared UI per route group

---

### **components/** - Reusable Components
**Purpose**: Modular, reusable React components organized by feature and responsibility.

#### **components/common/**
Generic components used across the entire app:
- `Header.tsx` - Main navigation header
- `Footer.tsx` - Footer component
- `Sidebar.tsx` - Navigation sidebar
- `Navigation.tsx` - Nav bar with links
- `Loading.tsx` - Loading indicators
- `ErrorBoundary.tsx` - Error handling wrapper

#### **components/ui/**
Atomic design components (smallest building blocks):
```
buttons/        # Button variants & states
forms/          # Input fields, selects, checkboxes
modal/          # Modal & dialog components
cards/          # Card containers
alerts/         # Alert & notification UI
layout/         # Layout utilities
```

#### **components/templates/**
Template-specific components:
- `TemplateSelector.tsx` - Template selection interface
- `TemplateCard.tsx` - Single template card
- `TemplateGrid.tsx` - Grid display of templates
- `TemplatePreview.tsx` - Template preview
- `TemplateCategoryFilter.tsx` - Filter by category

#### **components/editor/**
Content editor components:
- `ContentEditor.tsx` - Main editor interface
- `FieldEditor.tsx` - Individual field editor
- `RichTextEditor.tsx` - Rich text editing
- `ImageUploader.tsx` - Image upload/management
- `VideoEmbed.tsx` - Video embedding
- `EditorToolbar.tsx` - Editor toolbar

#### **components/articles/**
Article-related components:
- `ArticleList.tsx` - List of articles
- `ArticleCard.tsx` - Article preview card
- `ArticleRenderer.tsx` - Render published article
- `ArticleMetadata.tsx` - Author, date, tags
- `ArticleActions.tsx` - Edit, delete, share buttons

#### **components/dashboard/**
Dashboard-specific components:
- `DashboardStats.tsx` - Stats cards
- `RecentArticles.tsx` - Recent content list
- `ArticleTable.tsx` - Articles table
- `ActivityFeed.tsx` - Recent activity
- `DashboardLayout.tsx` - Dashboard layout wrapper

**Naming Conventions**:
- Use PascalCase for component files: `ArticleCard.tsx`
- Name export same as filename: `export default ArticleCard`
- Use descriptive, domain-specific names
- Suffixes indicate type: `Component`, `Provider`, `Wrapper`

---

### **lib/** - Utilities & Helpers
**Purpose**: Logic layer for API calls, validation, and utilities.

#### **lib/db/**
Database operations:
- `mongodb.ts` - Connection pooling & setup
- `seed.ts` - Seed test data

#### **lib/api/**
API communication:
- `client.ts` - Fetch wrapper with error handling
- `handler.ts` - Centralized API error handler
- `middleware.ts` - Request/response middleware

#### **lib/utils/**
General utilities:
- `slug.ts` - URL slug generation
- `validation.ts` - Input validation helpers
- `formatting.ts` - Date, number, text formatting
- `constants.ts` - App-wide constants
- `types.ts` - Shared type definitions
- `helpers.ts` - Misc utility functions

#### **lib/validators/**
Domain-specific validators:
- `article.ts` - Article validation schemas
- `template.ts` - Template validation schemas
- `user.ts` - User validation schemas
- `auth.ts` - Auth validation schemas

#### **lib/hooks/**
Custom React hooks:
- `useArticle.ts` - Article data fetching
- `useTemplate.ts` - Template data fetching
- `useFetch.ts` - Generic fetch hook
- `useForm.ts` - Form state management
- `useAuth.ts` - Authentication context

---

### **models/** - MongoDB Schemas
**Purpose**: Mongoose schema definitions for database entities.

```
models/
├── template.ts          # Template interface & schema
├── article.ts           # Article interface & schema
├── user.ts              # User interface & schema
├── settings.ts          # App settings schema
└── activity.ts          # Activity logging schema
```

**Pattern**:
```typescript
export interface IArticle extends Document {
  title: string;
  slug: string;
  // ... properties
}

const articleSchema = new Schema<IArticle>({ /* ... */ });
export const Article = mongoose.model<IArticle>('Article', articleSchema);
```

---

### **types/** - TypeScript Definitions
**Purpose**: Centralized type definitions for type safety.

```
types/
├── index.ts             # Main export file
├── api.ts               # API request/response types
├── entities.ts          # Data entity types
├── forms.ts             # Form-related types
└── next-auth.d.ts       # NextAuth augmentation
```

**Pattern**:
```typescript
// types/entities.ts
export interface Template {
  _id: string;
  title: string;
  category: TemplateCategory;
  fields: TemplateField[];
}

// types/api.ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

---

### **styles/** - Stylesheets
**Purpose**: Centralized style management.

```
styles/
├── globals.css                  # Global Tailwind directives
├── modules/
│   ├── editor.module.css        # Editor-specific styles
│   ├── templates.module.css     # Template styles
│   └── articles.module.css      # Article styles
└── themes/
    ├── light.css                # Light theme
    └── dark.css                 # Dark theme
```

---

### **public/** - Static Assets
**Purpose**: Static files served directly.

```
public/
├── images/
│   ├── templates/               # Template thumbnails
│   ├── icons/                   # Icon assets
│   └── logo.svg
├── videos/                      # Video assets
├── fonts/                       # Custom fonts
└── favicon.ico
```

---

### **tests/** - Testing
**Purpose**: Organized test files by type.

```
tests/
├── unit/                        # Component & function tests
├── integration/                 # API & database tests
├── e2e/                         # End-to-end scenarios
└── setup.ts                     # Test configuration
```

---

## 🏗️ Naming Conventions

### **Files & Folders**

| Type | Convention | Example |
|------|-----------|---------|
| Components | PascalCase | `ArticleCard.tsx` |
| Hooks | camelCase, `use` prefix | `useArticle.ts` |
| Utils | camelCase | `formatDate.ts` |
| Types | PascalCase | `Article.ts` |
| API routes | lowercase | `route.ts` |
| Folders | kebab-case or lowercase | `api/articles/` |
| CSS modules | camelCase + `.module.css` | `editor.module.css` |

### **Component Props**

```typescript
interface ArticleCardProps {
  article: Article;
  onSelect: (id: string) => void;
  isLoading?: boolean;
}
```

### **API Endpoints**

```
/api/templates              # GET list, POST create
/api/templates/[id]         # GET, PUT, DELETE
/api/templates/search       # Special operations
/api/articles/publish       # Action-based routes
```

### **Branches & Commits**

```
Branches:  feature/template-editor, fix/article-delete, docs/api-guide
Commits:   feat: add template selector | fix: article rendering bug
```

---

## 🎯 Best Practices

### **1. Component Organization**
✅ **Do**:
- Keep components focused and single-responsibility
- Extract reusable logic into custom hooks
- Use composition over inheritance
- Keep prop drilling minimal with context

❌ **Don't**:
- Create mega-components with multiple features
- Pass too many props (max 5-7)
- Mix business logic with UI logic
- Put everything in one folder

### **2. File Structure**
✅ **Do**:
- Group by feature/domain first, then by type
- Keep related files close together
- Use index files for cleaner imports
- Separate concerns: UI, logic, data

❌ **Don't**:
- Create deeply nested folders (max 4 levels)
- Put unrelated code in same file
- Have duplicate logic across files
- Mix different concerns in same component

### **3. API Routes**
✅ **Do**:
```typescript
// /app/api/articles/route.ts
export async function GET(request: Request) {
  // Validate input
  // Query database
  // Return response
}
```
- Use proper HTTP methods
- Validate inputs
- Handle errors consistently
- Return meaningful status codes

❌ **Don't**:
- Mix multiple operations in one route
- Skip input validation
- Return raw database errors
- Ignore error handling

### **4. TypeScript Usage**
✅ **Do**:
```typescript
interface Article extends BaseEntity {
  title: string;
  content: string;
}

function useArticle(id: string): Article | null {
  // ...
}
```
- Define interfaces for all entities
- Use strict type checking
- Export types from central location
- Use generics for reusable patterns

❌ **Don't**:
- Use `any` type
- Skip type definitions
- Mix types across files
- Use loose typing

### **5. Imports & Exports**
✅ **Do**:
```typescript
// Use path aliases
import { useArticle } from '@/lib/hooks';
import { Button } from '@/components/ui/buttons';

// Named exports
export function validateArticle() {}
export const ARTICLE_STATUS = { ... };

// Index files
// components/ui/buttons/index.ts
export { Button } from './Button';
export { IconButton } from './IconButton';
```

❌ **Don't**:
```typescript
import ../../components/article/ArticleCard
import { default as Something } from '...'
export default functionName
```

### **6. Error Handling**
✅ **Do**:
```typescript
try {
  const response = await fetch('/api/articles');
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.json();
} catch (error) {
  console.error('Failed to fetch articles:', error);
  throw new APIError('Failed to fetch articles', 'FETCH_ERROR');
}
```

❌ **Don't**:
- Ignore errors
- Use generic error messages
- Catch and ignore silently
- Mix error types

### **7. Database Access**
✅ **Do**:
- Use connection pooling
- Validate schema with Mongoose
- Use transactions for critical operations
- Index frequently queried fields

❌ **Don't**:
- Query without validation
- Create new connection per request
- Skip database constraints
- Use `any` for schema fields

### **8. Performance**
✅ **Do**:
- Use Next.js Image component
- Implement pagination
- Cache API responses
- Code split by route
- Use lazy loading for components

❌ **Don't**:
- Load all data at once
- Use unoptimized images
- Fetch on every render
- Load all JavaScript upfront

---

## 📈 Scalability Tips

### **Adding New Features**

1. **Create feature folder** in components
2. **Add API routes** for backend
3. **Create database schema** if needed
4. **Write types** in `/types`
5. **Add validation** in `/lib/validators`
6. **Create hooks** for logic
7. **Build UI components**
8. **Add tests**

### **Example: Adding Comments Feature**

```
Add comment route:        app/api/articles/[id]/comments/route.ts
Add comment model:        models/comment.ts
Add comment types:        types/entities.ts
Add comment hook:         lib/hooks/useComment.ts
Add components:           components/articles/Comment*.tsx
Add pages:                app/api/comments/route.ts
Add validation:           lib/validators/comment.ts
```

### **Handling Growth**

- **Small project**: Keep structure flat, add folders as needed
- **Growing project**: Implement suggested structure
- **Large project**: Create subdirectories for major features
- **Enterprise**: Use monorepo structure

---

## 📦 Import Path Aliases

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/app/*": ["app/*"],
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"],
      "@/types/*": ["types/*"],
      "@/public/*": ["public/*"]
    }
  }
}
```

**Usage**:
```typescript
import { Button } from '@/components/ui/buttons';
import { useArticle } from '@/lib/hooks';
import type { Article } from '@/types/entities';
```

---

## 🚀 Development Workflow

### **Creating a New Component**

1. Create file: `components/feature/ComponentName.tsx`
2. Define props interface
3. Import dependencies
4. Implement component
5. Export as default
6. Add to `components/index.ts` (optional)

### **Creating a New Page**

1. Create folder: `app/(group)/feature/`
2. Add `page.tsx`
3. Add `layout.tsx` if needed
4. Add metadata

### **Creating a New API Route**

1. Create folder: `app/api/resource/`
2. Add `route.ts`
3. Implement handlers
4. Add error handling
5. Test endpoints

---

## ✅ Quality Checklist

- [ ] Components are under 300 lines
- [ ] Folders have max 10-15 files
- [ ] Import paths use aliases
- [ ] All functions are typed
- [ ] Error handling is consistent
- [ ] Tests exist for critical paths
- [ ] README documents structure
- [ ] No `any` types used
- [ ] API routes validate input
- [ ] Database queries use indexes

---

This structure supports:
- ✅ Small to enterprise-scale projects
- ✅ Easy onboarding for new developers
- ✅ Clear separation of concerns
- ✅ Reusable components & utilities
- ✅ Scalable API architecture
- ✅ Type-safe codebase
- ✅ Performance optimization
- ✅ Testing at all levels
