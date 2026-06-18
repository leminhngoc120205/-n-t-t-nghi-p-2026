# Design System Implementation Guide
## React + TailwindCSS Component Examples

---

## 1. COLOR CONFIGURATION

### Tailwind Config Setup
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        editorial: {
          'dark': '#1a1a1a',
          'light': '#f7f7f7',
          'white': '#ffffff',
          'blue': '#0f3a7d',
          'blue-dark': '#0d2e5f',
          'blue-darker': '#0a2450',
          'gold': '#d4a574',
          'gray-slate': '#57606f',
          'gray-medium': '#e8e8e8',
          'gray-light': '#f9f9f9',
          'success': '#06a77d',
          'warning': '#f4a261',
          'error': '#d62828',
          'info': '#457b9d',
        },
      },
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
        mono: ['Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      fontSize: {
        'h1': ['3.5rem', { lineHeight: '1.1', fontWeight: '700' }],
        'h2': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['1.875rem', { lineHeight: '1.3', fontWeight: '600' }],
        'h4': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'h5': ['1.25rem', { lineHeight: '1.4', fontWeight: '600' }],
        'body-lg': ['1.125rem', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.7', fontWeight: '400' }],
        'body-sm': ['0.875rem', { lineHeight: '1.6', fontWeight: '400' }],
        'caption': ['0.75rem', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '48px',
        '3xl': '64px',
        '4xl': '80px',
        '5xl': '96px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.05)',
        'md': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'lg': '0 8px 24px rgba(0, 0, 0, 0.08)',
        'xl': '0 20px 60px rgba(0, 0, 0, 0.15)',
      },
      borderRadius: {
        'sm': '3px',
        'md': '4px',
        'lg': '6px',
        'xl': '8px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
```

---

## 2. BUTTON COMPONENTS

### Primary Button
```tsx
// components/Button/PrimaryButton.tsx
import React from 'react'

interface PrimaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        font-semibold rounded-md
        bg-editorial-blue text-white
        hover:bg-editorial-blue-dark active:bg-editorial-blue-darker
        disabled:bg-gray-300 disabled:cursor-not-allowed
        transition-colors duration-150
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
```

### Secondary Button
```tsx
// components/Button/SecondaryButton.tsx
interface SecondaryButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        px-6 py-3 text-base font-semibold rounded-md
        bg-transparent border-2 border-editorial-blue text-editorial-blue
        hover:bg-blue-50 active:bg-blue-100
        disabled:border-gray-300 disabled:text-gray-300 disabled:cursor-not-allowed
        transition-colors duration-150
        ${className}
      `}
    >
      {children}
    </button>
  )
}
```

### Text Button / Link Button
```tsx
// components/Button/TextButton.tsx
interface TextButtonProps {
  children: React.ReactNode
  onClick?: () => void
  href?: string
  external?: boolean
  className?: string
}

export const TextButton: React.FC<TextButtonProps> = ({
  children,
  onClick,
  href,
  external = false,
  className = '',
}) => {
  const baseClasses = `
    text-editorial-blue font-medium
    border-b border-editorial-blue border-opacity-30
    hover:border-opacity-100 hover:text-editorial-blue-dark
    transition-colors duration-150
    cursor-pointer
  `

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : '_self'}
        rel={external ? 'noopener noreferrer' : ''}
        className={`${baseClasses} ${className}`}
      >
        {children}
      </a>
    )
  }

  return (
    <button onClick={onClick} className={`${baseClasses} ${className}`}>
      {children}
    </button>
  )
}
```

---

## 3. INPUT COMPONENTS

### Text Input
```tsx
// components/Input/TextInput.tsx
import React from 'react'

interface TextInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  type?: 'text' | 'email' | 'password' | 'url'
  disabled?: boolean
}

export const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  type = 'text',
  disabled = false,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-editorial-dark mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-base font-normal rounded-md
          border border-gray-300 bg-white text-editorial-dark
          placeholder-gray-400
          focus:outline-none focus:border-editorial-blue
          focus:ring-2 focus:ring-offset-0 focus:ring-blue-100
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors duration-150
          ${error ? 'border-red-600 focus:ring-red-100' : ''}
        `}
      />
      {error && (
        <p className="text-red-600 text-xs mt-2 font-medium">{error}</p>
      )}
    </div>
  )
}
```

### Textarea
```tsx
// components/Input/Textarea.tsx
interface TextareaProps {
  label: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  error?: string
  required?: boolean
  rows?: number
  disabled?: boolean
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  placeholder,
  value,
  onChange,
  error,
  required = false,
  rows = 4,
  disabled = false,
}) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-semibold text-editorial-dark mb-2">
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-base font-normal rounded-md
          border border-gray-300 bg-white text-editorial-dark
          placeholder-gray-400 resize-vertical
          focus:outline-none focus:border-editorial-blue
          focus:ring-2 focus:ring-offset-0 focus:ring-blue-100
          disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed
          transition-colors duration-150
          ${error ? 'border-red-600 focus:ring-red-100' : ''}
        `}
      />
      {error && (
        <p className="text-red-600 text-xs mt-2 font-medium">{error}</p>
      )}
    </div>
  )
}
```

---

## 4. CARD COMPONENTS

### Basic Card
```tsx
// components/Card/Card.tsx
interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'minimal' | 'elevated' | 'editorial'
  hoverable?: boolean
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'minimal',
  hoverable = false,
}) => {
  const variantClasses = {
    minimal: 'p-5 border border-editorial-gray-medium bg-white shadow-sm',
    elevated: 'p-8 border-0 bg-white shadow-lg',
    editorial: 'p-10 border border-editorial-gray-medium bg-white',
  }

  return (
    <div
      className={`
        rounded-lg
        ${variantClasses[variant]}
        ${hoverable ? 'hover:shadow-lg transition-shadow duration-300' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
```

### Article Card
```tsx
// components/Card/ArticleCard.tsx
interface ArticleCardProps {
  id: string
  title: string
  excerpt: string
  image: string
  author: string
  date: string
  category: string
  readTime: number
  onRead?: (id: string) => void
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  id,
  title,
  excerpt,
  image,
  author,
  date,
  category,
  readTime,
  onRead,
}) => {
  return (
    <div
      className="
        grid grid-cols-1 md:grid-cols-2 gap-6 p-8
        border border-editorial-gray-medium bg-white rounded-lg
        hover:shadow-lg transition-shadow duration-300
      "
    >
      {/* Image */}
      <div className="overflow-hidden rounded-md h-60 md:h-auto">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between">
        {/* Category Tag */}
        <div className="mb-4">
          <span className="
            inline-block px-3 py-2 text-xs font-bold rounded
            bg-yellow-100 text-editorial-gold uppercase tracking-wide
          ">
            {category}
          </span>
        </div>

        {/* Title */}
        <h3 className="
          text-2xl md:text-3xl font-bold font-serif text-editorial-dark
          mb-3 leading-tight hover:text-editorial-blue transition-colors
        ">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="
          text-editorial-gray-slate text-base leading-relaxed mb-6
          line-clamp-2
        ">
          {excerpt}
        </p>

        {/* Meta Information */}
        <div className="flex items-center justify-between pt-6 border-t border-editorial-gray-medium">
          <div className="text-xs text-editorial-gray-slate uppercase tracking-wide">
            <span>By {author}</span>
            <span className="mx-2">•</span>
            <span>{date}</span>
            <span className="mx-2">•</span>
            <span>{readTime} min read</span>
          </div>
          <a
            href={`/articles/${id}`}
            onClick={() => onRead?.(id)}
            className="
              text-editorial-blue font-semibold text-sm
              border-b border-editorial-blue border-opacity-50
              hover:border-opacity-100 transition-colors
            "
          >
            Read More →
          </a>
        </div>
      </div>
    </div>
  )
}
```

---

## 5. BADGE / TAG COMPONENTS

### Badge
```tsx
// components/Badge/Badge.tsx
interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'category' | 'success' | 'warning' | 'error'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const variantClasses = {
    default: 'bg-gray-100 text-editorial-dark border border-gray-300',
    category: 'bg-yellow-50 text-editorial-gold border border-yellow-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    warning: 'bg-amber-50 text-amber-700 border border-amber-200',
    error: 'bg-red-50 text-red-700 border border-red-200',
  }

  return (
    <span
      className={`
        inline-block px-3 py-2 text-xs font-semibold rounded
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  )
}
```

---

## 6. MODAL COMPONENT

```tsx
// components/Modal/Modal.tsx
import React from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}) => {
  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-70 z-50 transition-opacity"
        onClick={onClose}
        role="button"
        tabIndex={-1}
      />

      {/* Modal Box */}
      <div className="fixed inset-0 z-51 flex items-center justify-center p-4">
        <div
          className={`
            bg-white rounded-lg shadow-2xl max-w-full
            ${sizeClasses[size]}
          `}
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-8 border-b border-gray-200">
            <h2
              id="modal-title"
              className="text-2xl font-bold font-serif text-editorial-dark"
            >
              {title}
            </h2>
            <button
              onClick={onClose}
              className="
                text-editorial-gray-slate hover:text-editorial-dark
                transition-colors text-2xl leading-none
              "
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-8 max-h-96 overflow-y-auto">
            {children}
          </div>

          {/* Footer */}
          {footer && (
            <div className="flex justify-end gap-3 p-8 border-t border-gray-200">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
```

---

## 7. ALERT / NOTIFICATION COMPONENTS

```tsx
// components/Alert/Alert.tsx
interface AlertProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  onClose?: () => void
  dismissible?: boolean
}

export const Alert: React.FC<AlertProps> = ({
  message,
  type = 'info',
  onClose,
  dismissible = true,
}) => {
  const typeClasses = {
    success: 'border-l-4 border-green-600 bg-green-50 text-green-800',
    error: 'border-l-4 border-red-600 bg-red-50 text-red-800',
    warning: 'border-l-4 border-amber-600 bg-amber-50 text-amber-800',
    info: 'border-l-4 border-blue-600 bg-blue-50 text-blue-800',
  }

  return (
    <div
      className={`
        p-4 rounded-r-md flex items-center justify-between
        ${typeClasses[type]}
      `}
      role="alert"
    >
      <p className="text-sm font-medium">{message}</p>
      {dismissible && onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-xl leading-none opacity-70 hover:opacity-100"
          aria-label="Dismiss alert"
        >
          ✕
        </button>
      )}
    </div>
  )
}
```

---

## 8. HERO SECTION

```tsx
// components/Hero/HeroSection.tsx
interface HeroSectionProps {
  title: string
  subtitle?: string
  image: string
  author?: string
  date?: string
  category?: string
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  image,
  author,
  date,
  category,
}) => {
  return (
    <div className="relative h-96 md:h-[28rem] w-full overflow-hidden rounded-lg">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/10" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center items-center text-center px-6 md:px-12">
        {category && (
          <span className="
            inline-block mb-6 px-3 py-2 text-xs font-bold rounded
            bg-yellow-100 text-editorial-gold uppercase tracking-wide
          ">
            {category}
          </span>
        )}

        <h1 className="
          text-4xl md:text-5xl lg:text-6xl font-bold font-serif
          text-white mb-6 max-w-4xl leading-tight
        ">
          {title}
        </h1>

        {subtitle && (
          <p className="text-xl md:text-2xl text-white/90 max-w-2xl mb-8 font-light">
            {subtitle}
          </p>
        )}

        {(author || date) && (
          <p className="text-sm text-white/80 uppercase tracking-wide">
            {author && <span>By {author}</span>}
            {author && date && <span className="mx-3">•</span>}
            {date && <span>{date}</span>}
          </p>
        )}
      </div>
    </div>
  )
}
```

---

## 9. NAVIGATION BAR

```tsx
// components/Navigation/Navbar.tsx
import Link from 'next/link'

interface NavItem {
  label: string
  href: string
}

interface NavbarProps {
  logo: string
  items: NavItem[]
  onAuth?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({
  logo,
  items,
  onAuth,
}) => {
  return (
    <nav className="
      sticky top-0 z-40 bg-white border-b border-editorial-gray-medium
      shadow-sm
    ">
      <div className="max-w-7xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <img src={logo} alt="Logo" className="h-8 w-auto" />
        </Link>

        {/* Nav Items */}
        <div className="hidden md:flex gap-8">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="
                text-base text-editorial-dark font-medium
                hover:text-editorial-blue
                border-b-2 border-b-transparent hover:border-b-editorial-blue
                transition-colors duration-150
                pb-1
              "
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search"
            className="
              hidden md:block px-4 py-2 text-sm rounded-md
              border border-editorial-gray-medium bg-white
              focus:outline-none focus:border-editorial-blue
              focus:ring-2 focus:ring-blue-100
              w-48
            "
          />
          <button
            onClick={onAuth}
            className="
              px-4 py-2 text-sm font-semibold rounded-md
              bg-editorial-blue text-white
              hover:bg-editorial-blue-dark transition-colors
            "
          >
            Sign In
          </button>
        </div>
      </div>
    </nav>
  )
}
```

---

## 10. FOOTER

```tsx
// components/Footer/Footer.tsx
export const Footer: React.FC = () => {
  return (
    <footer className="
      mt-20 pt-12 border-t border-editorial-gray-medium
      bg-editorial-light
    ">
      <div className="max-w-7xl mx-auto px-6 md:px-8 pb-12">
        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h4 className="text-lg font-bold text-editorial-dark mb-4">
              About
            </h4>
            <p className="text-sm text-editorial-gray-slate leading-relaxed">
              Premium journalism storytelling platform for modern editors.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-lg font-bold text-editorial-dark mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              {['Home', 'Articles', 'Topics', 'About'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                      text-sm text-editorial-gray-slate
                      hover:text-editorial-blue transition-colors
                    "
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-bold text-editorial-dark mb-4">
              Legal
            </h4>
            <ul className="space-y-2">
              {['Privacy', 'Terms', 'Cookies', 'Contact'].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="
                      text-sm text-editorial-gray-slate
                      hover:text-editorial-blue transition-colors
                    "
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-bold text-editorial-dark mb-4">
              Follow Us
            </h4>
            <div className="flex gap-4">
              {['Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="
                    text-sm text-editorial-gray-slate
                    hover:text-editorial-blue transition-colors
                  "
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-editorial-gray-medium flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-editorial-gray-slate">
            © 2026 Journalism CMS. All rights reserved.
          </p>
          <p className="text-xs text-editorial-gray-slate mt-4 md:mt-0">
            Made with care for storytellers
          </p>
        </div>
      </div>
    </footer>
  )
}
```

---

## 11. CUSTOM HOOKS

### useMediaQuery (Responsive)
```tsx
// hooks/useMediaQuery.ts
import { useEffect, useState } from 'react'

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

// Usage:
const isMobile = useMediaQuery('(max-width: 640px)')
```

### usePrefersReducedMotion (Accessibility)
```tsx
// hooks/usePrefersReducedMotion.ts
export const usePrefersReducedMotion = (): boolean => {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
```

---

## 12. UTILITY CLASSES (globals.css)

```css
/* globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom base styles */
@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply bg-editorial-white text-editorial-dark font-sans;
  }

  h1 {
    @apply font-serif text-h1 font-bold;
  }

  h2 {
    @apply font-serif text-h2 font-bold;
  }

  h3 {
    @apply font-serif text-h3 font-semibold;
  }

  h4 {
    @apply font-serif text-h4 font-semibold;
  }

  h5 {
    @apply font-serif text-h5 font-semibold;
  }

  p {
    @apply font-sans text-body leading-relaxed;
  }

  a {
    @apply transition-colors duration-150;
  }

  /* Focus visible for accessibility */
  :focus-visible {
    @apply outline-2 outline-offset-2 outline-editorial-blue;
  }
}

/* Custom components */
@layer components {
  .article-container {
    @apply max-w-3xl mx-auto px-6 md:px-8 py-12;
  }

  .prose-article {
    @apply space-y-6;
  }

  .prose-article p {
    @apply text-lg leading-8 text-editorial-dark;
  }

  .prose-article blockquote {
    @apply border-l-4 border-editorial-gold pl-6 italic text-editorial-gray-slate py-2;
  }

  .prose-article img {
    @apply w-full rounded-lg my-8;
  }
}

/* Animations */
@layer utilities {
  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes slide-in {
    from {
      transform: translateY(10px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }

  .animate-slide-in {
    animation: slide-in 0.3s ease-out;
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
  }

  /* Utility for text truncation */
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}

/* Dark mode variant (optional) */
@media (prefers-color-scheme: dark) {
  :root {
    color-scheme: dark;
  }

  body {
    @apply bg-gray-900 text-gray-100;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 13. EXAMPLE PAGE IMPLEMENTATION

### Article View Page
```tsx
// app/articles/[id]/page.tsx
'use client'

import { useState } from 'react'
import { Navbar } from '@/components/Navigation/Navbar'
import { HeroSection } from '@/components/Hero/HeroSection'
import { Footer } from '@/components/Footer/Footer'
import { Badge } from '@/components/Badge/Badge'
import { Alert } from '@/components/Alert/Alert'

export default function ArticlePage({ params }: { params: { id: string } }) {
  const [bookmark, setBookmark] = useState(false)

  // Mock data - replace with actual API call
  const article = {
    id: params.id,
    title: 'The Future of Digital Journalism',
    subtitle: 'Exploring how AI and data visualization are reshaping storytelling',
    image: '/images/hero-article.jpg',
    author: 'Sarah Johnson',
    date: 'May 28, 2026',
    category: 'Technology',
    readTime: 8,
    content: `
      <p>Digital journalism is undergoing a profound transformation...</p>
      <p>The integration of AI tools is not meant to replace journalists...</p>
    `,
  }

  return (
    <>
      <Navbar
        logo="/logo.svg"
        items={[
          { label: 'Home', href: '/' },
          { label: 'Articles', href: '/articles' },
          { label: 'Categories', href: '/categories' },
        ]}
      />

      <main className="article-container">
        {/* Hero */}
        <HeroSection
          title={article.title}
          subtitle={article.subtitle}
          image={article.image}
          author={article.author}
          date={article.date}
          category={article.category}
        />

        {/* Article Meta */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-12 pb-8 border-b border-editorial-gray-medium">
          <div>
            <Badge variant="category">{article.category}</Badge>
            <p className="text-sm text-editorial-gray-slate mt-4 uppercase tracking-wide">
              By {article.author} • {article.date} • {article.readTime} min read
            </p>
          </div>
          <button
            onClick={() => setBookmark(!bookmark)}
            className={`
              mt-6 md:mt-0 px-6 py-3 rounded-md font-semibold
              transition-colors
              ${
                bookmark
                  ? 'bg-editorial-blue text-white'
                  : 'border-2 border-editorial-blue text-editorial-blue hover:bg-blue-50'
              }
            `}
          >
            {bookmark ? '📑 Bookmarked' : '🔖 Bookmark'}
          </button>
        </div>

        {/* Article Content */}
        <article className="prose-article max-w-2xl">
          <p>Digital journalism is undergoing a profound transformation as newsrooms adopt new technologies...</p>
          {/* More content */}
        </article>
      </main>

      <Footer />
    </>
  )
}
```

---

## 14. TESTING & QA

### Component Testing Example
```tsx
// __tests__/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { PrimaryButton } from '@/components/Button/PrimaryButton'

describe('PrimaryButton', () => {
  it('renders button with text', () => {
    render(<PrimaryButton>Click me</PrimaryButton>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<PrimaryButton onClick={handleClick}>Click</PrimaryButton>)
    screen.getByText('Click').click()
    expect(handleClick).toHaveBeenCalled()
  })

  it('disables button when disabled prop is true', () => {
    render(<PrimaryButton disabled>Disabled</PrimaryButton>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})
```

---

## 15. PERFORMANCE OPTIMIZATION

### Image Optimization
```tsx
import Image from 'next/image'

export const OptimizedImage: React.FC<{ src: string; alt: string }> = ({
  src,
  alt,
}) => (
  <Image
    src={src}
    alt={alt}
    width={800}
    height={450}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,..." // Generate with plaiceholder
    priority={false}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1000px"
  />
)
```

### Code Splitting
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
})
```

---

**Implementation Version**: 1.0  
**Last Updated**: May 28, 2026  
**Next Review**: August 28, 2026
