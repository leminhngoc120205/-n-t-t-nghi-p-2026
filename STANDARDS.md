# Developer Checklist & Standards

## ✅ Code Quality Standards

### Before Committing Code

#### Component Standards
- [ ] Component is under 300 lines
- [ ] Component has a single responsibility
- [ ] Props interface is defined with JSDoc comments
- [ ] Component is exported as default
- [ ] Component name matches filename (PascalCase)
- [ ] Unused imports removed
- [ ] No `any` types used
- [ ] Component tested (at least manually)

#### API Route Standards
- [ ] Route has proper HTTP method handlers (GET, POST, etc.)
- [ ] Input validation is implemented
- [ ] Error handling is consistent
- [ ] Response uses correct status codes
- [ ] Documentation comment above function
- [ ] Database connection checked
- [ ] No hardcoded credentials

#### Hook Standards
- [ ] Hook name starts with `use` prefix
- [ ] Hook logic is isolated and reusable
- [ ] Hook has TypeScript types for return value
- [ ] Dependencies in useEffect are complete
- [ ] Hook tested with component using it
- [ ] No infinite loops

#### TypeScript Standards
- [ ] No `any` type usage
- [ ] All interfaces/types defined
- [ ] Props interface defined
- [ ] Return types specified
- [ ] No implicit `any`
- [ ] Strict mode enabled

#### Styling Standards
- [ ] Using TailwindCSS classes
- [ ] No inline styles
- [ ] Responsive classes used (`md:`, `lg:`, etc.)
- [ ] Color values from tailwind config
- [ ] No hardcoded colors
- [ ] Dark mode considered (if applicable)

---

## 🎯 Architecture Standards

### Folder Organization
- [ ] Related files grouped together
- [ ] Max 10-15 files per folder
- [ ] Subfolder created when exceeds limit
- [ ] Clear naming convention followed
- [ ] No circular dependencies
- [ ] Proper index.ts exports (optional but recommended)

### Import Standards
- [ ] Uses path aliases (@/)
- [ ] No relative imports longer than 3 levels
- [ ] Grouped imports (React → libs → types)
- [ ] Single source of truth for types
- [ ] No default imports (except React components)

### File Naming
- [ ] Components: PascalCase (ArticleCard.tsx)
- [ ] Hooks: camelCase with 'use' prefix (useArticle.ts)
- [ ] Utils: camelCase (formatDate.ts)
- [ ] Tests: .test.ts or .spec.ts suffix
- [ ] No abbreviations (except well-known: API, URL, ID)

### Database
- [ ] Schema validation present
- [ ] Indexes on frequently queried fields
- [ ] Foreign key relationships defined
- [ ] Default values set appropriately
- [ ] Required fields marked
- [ ] Timestamps added (createdAt, updatedAt)

---

## 🔒 Security Standards

- [ ] No hardcoded secrets
- [ ] Environment variables used for config
- [ ] Input sanitization implemented
- [ ] SQL injection prevention (using ORM)
- [ ] XSS prevention (React auto-escapes)
- [ ] CSRF tokens if needed
- [ ] Password fields not logged
- [ ] API rate limiting considered

---

## 🚀 Performance Standards

### Components
- [ ] Large lists use pagination
- [ ] Images use Next.js Image component
- [ ] Code splitting by route
- [ ] Lazy loading for below-fold components
- [ ] useMemo for expensive computations
- [ ] useCallback for event handlers (if used by children)
- [ ] No unnecessary re-renders

### API
- [ ] Responses paginated (if list)
- [ ] Database queries optimized
- [ ] Proper indexes on collections
- [ ] Caching headers set
- [ ] No N+1 queries
- [ ] Batch operations where possible

### Build
- [ ] No console.log in production
- [ ] Source maps configured
- [ ] CSS properly minified
- [ ] JavaScript properly bundled
- [ ] Images optimized
- [ ] Unused code removed

---

## 📝 Testing Standards

### Before Shipping Feature

#### Manual Testing
- [ ] Tested in Chrome
- [ ] Tested in Firefox
- [ ] Tested on mobile (responsive)
- [ ] Tested with slow network (DevTools throttle)
- [ ] Tested with JavaScript disabled (if applicable)
- [ ] Error states tested
- [ ] Loading states tested
- [ ] Success paths tested

#### Automated Testing (When Available)
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] No test warnings

#### Data Flow Testing
- [ ] Create operations work
- [ ] Read operations work
- [ ] Update operations work
- [ ] Delete operations work
- [ ] Validation errors handled
- [ ] Network errors handled

---

## 📋 Code Review Checklist

### Before Requesting Review
- [ ] All standards above met
- [ ] Code is formatted consistently
- [ ] Comments explain WHY, not WHAT
- [ ] No TODO comments left
- [ ] Tested locally with different scenarios
- [ ] TypeScript compilation without errors
- [ ] Linting passes

### During Review
- [ ] Explain intent in PR description
- [ ] Reference related issues/PRs
- [ ] Highlight decisions made
- [ ] Ask for feedback on tricky parts
- [ ] Respond to all comments
- [ ] Request re-review after changes

---

## 🔄 Git Standards

### Commit Messages
```
Type: Brief description (50 chars max)

Body explaining WHY (wrap at 72 chars)
- List key changes if multiple
- Reference issue numbers if applicable

Example:
feat: add article publishing workflow

- Implement publish button in editor
- Add status transitions (draft → published)
- Send notification email to subscribers
Closes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting/styling
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Test additions
- `chore`: Dependencies/tooling

### Branches
```
feature/article-publishing       ← Feature
fix/template-loading-bug         ← Bug fix
docs/update-readme              ← Documentation
refactor/api-client             ← Refactor
```

---

## 🎓 Documentation Standards

### Components
```typescript
/**
 * TemplateCard displays a single template option
 * 
 * @component
 * @param {TemplateCardProps} props
 * @param {ITemplate} props.template - Template data
 * @param {Function} props.onSelect - Callback when selected
 * @returns {JSX.Element}
 * 
 * @example
 * <TemplateCard 
 *   template={template} 
 *   onSelect={(id) => console.log(id)} 
 * />
 */
```

### Functions
```typescript
/**
 * Converts article title to URL slug
 * 
 * @param {string} title - Article title
 * @returns {string} URL-friendly slug
 */
export function generateSlug(title: string): string {
  // Implementation
}
```

### API Routes
```typescript
/**
 * GET /api/articles
 * Fetches list of articles with pagination
 * 
 * Query params:
 * - status: 'draft' | 'published' | 'archived'
 * - page: number (default 1)
 * - limit: number (default 10)
 * 
 * Returns: { success: boolean, data: Article[], pagination: {...} }
 */
export async function GET(request: Request) {
  // Implementation
}
```

---

## 🛠️ Development Setup

### Initial Setup
- [ ] Node.js 18+ installed
- [ ] npm or yarn installed
- [ ] Git configured
- [ ] VS Code extensions installed
  - [ ] ESLint
  - [ ] Prettier
  - [ ] TypeScript Vue Plugin
  - [ ] Tailwind CSS IntelliSense
- [ ] .env.local configured
- [ ] MongoDB running locally or remote connection

### Daily Development
- [ ] Run `npm run dev` to start server
- [ ] Check TypeScript errors: `npx tsc --noEmit`
- [ ] Run linter: `npm run lint`
- [ ] Test functionality manually

---

## 🚨 Common Mistakes to Avoid

### ❌ Don't
- Use `any` type
- Hardcode API URLs
- Pass too many props (>7)
- Create mega-components (>300 lines)
- Skip input validation
- Ignore error handling
- Use relative imports with ../../../
- Forget TypeScript types
- Mix business logic in components
- Use console.log in production
- Create database without schema
- Forget to handle edge cases
- Leave TODO comments
- Skip testing

### ✅ Do
- Use TypeScript everywhere
- Centralize configuration
- Keep components focused
- Extract reusable logic
- Validate all inputs
- Handle errors consistently
- Use path aliases
- Define all types
- Separate concerns
- Use proper logging
- Validate schemas
- Think of all states (loading, error, empty)
- Clean up before commit
- Write tests

---

## 📊 Code Quality Metrics

Target these metrics for production code:

| Metric | Target |
|--------|--------|
| TypeScript coverage | 100% |
| Component file size | < 300 lines |
| Function length | < 50 lines |
| Cyclomatic complexity | < 10 |
| Test coverage | > 80% |
| Bundle size | < 500KB |
| Accessibility score | > 90 |
| Performance score | > 90 |

---

## 🎯 Feature Development Checklist

### Planning Phase
- [ ] Feature requirements clear
- [ ] API design documented
- [ ] Database schema designed
- [ ] UI mockups/wireframes ready
- [ ] No blockers identified
- [ ] Estimated effort realistic

### Development Phase
- [ ] Database models created
- [ ] API routes implemented
- [ ] API tested with Postman/curl
- [ ] React components created
- [ ] Components integrated
- [ ] Styling applied
- [ ] Responsive design checked

### Testing Phase
- [ ] Feature works as specified
- [ ] Edge cases handled
- [ ] Error states handled
- [ ] Performance acceptable
- [ ] Accessibility checked
- [ ] Mobile tested
- [ ] Documentation updated

### Review Phase
- [ ] Code review completed
- [ ] Feedback addressed
- [ ] Approved by reviewer
- [ ] Merged to main/develop
- [ ] Staging deployed successfully
- [ ] Monitored for errors

---

## 🚀 Deployment Checklist

Before Going Live
- [ ] All tests passing
- [ ] TypeScript strict mode
- [ ] No console.log calls
- [ ] No hardcoded credentials
- [ ] Environment variables set
- [ ] Database backups ready
- [ ] Error tracking enabled (Sentry/etc)
- [ ] Performance monitored
- [ ] Logging configured
- [ ] Rollback plan ready
- [ ] Team notified
- [ ] Documentation updated

After Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify all features working
- [ ] Monitor database queries
- [ ] Check user feedback
- [ ] Be ready to rollback

---

## 📚 Resources

- **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org)
- **Next.js**: [nextjs.org](https://nextjs.org)
- **React**: [react.dev](https://react.dev)
- **Tailwind CSS**: [tailwindcss.com](https://tailwindcss.com)
- **MongoDB**: [mongodb.com](https://www.mongodb.com)
- **Mongoose**: [mongoosejs.com](https://mongoosejs.com)

---

## ⚡ Quick Command Reference

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm start                # Start production server

# Linting & Formatting
npm run lint             # Check for linting errors
npm run lint:fix         # Fix linting errors

# TypeScript
npx tsc --noEmit         # Check for type errors
npx tsc --noEmit --watch # Watch for type errors

# Database
npm run seed             # Seed database (if available)

# Testing (when implemented)
npm test                 # Run tests
npm test -- --watch      # Run tests in watch mode
npm test -- --coverage   # Generate coverage report
```

---

**Remember**: Code is read more often than it's written. Write clear, maintainable, well-documented code that other developers (and future you) will appreciate!

✅ **You're ready to code!**
