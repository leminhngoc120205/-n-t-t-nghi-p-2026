import { NextRequest, NextResponse } from 'next/server'
import { COOKIE_NAME, AUTH_SECRET } from '@/lib/auth'

// Paths that don't require authentication
const PUBLIC_PREFIXES = [
  '/login',
  '/api/auth/login',
  '/_next',
  '/favicon',
  '/images',
  '/icons',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow public paths through
  if (PUBLIC_PREFIXES.some(p => pathname.startsWith(p))) {
    return NextResponse.next()
  }

  // Redirect bare "/" to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const token = request.cookies.get(COOKIE_NAME)?.value

  if (!token) {
    return redirectToLogin(request, pathname)
  }

  // Verify token using Web Crypto API (Edge-runtime compatible)
  const valid = await verifyTokenEdge(token, AUTH_SECRET)
  if (!valid) {
    const res = redirectToLogin(request, pathname)
    res.cookies.delete(COOKIE_NAME)
    return res
  }

  return NextResponse.next()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function redirectToLogin(request: NextRequest, returnUrl: string): NextResponse {
  const url = new URL('/login', request.url)
  if (returnUrl !== '/' && !returnUrl.startsWith('/login') && !returnUrl.startsWith('/api')) {
    url.searchParams.set('returnUrl', returnUrl)
  }
  return NextResponse.redirect(url)
}

/**
 * Edge-compatible token verifier using the Web Crypto API.
 * Must replicate the same signing logic as lib/auth.ts createToken().
 *
 * Token format: base64url(JSON.stringify(payload)) + "." + base64url(HMAC-SHA256)
 */
async function verifyTokenEdge(token: string, secret: string): Promise<boolean> {
  try {
    const dotIdx = token.lastIndexOf('.')
    if (dotIdx === -1) return false

    const data = token.slice(0, dotIdx)
    const sig  = token.slice(dotIdx + 1)

    // Import HMAC key
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    // Compute expected signature
    const sigBuffer = await crypto.subtle.sign(
      'HMAC',
      key,
      new TextEncoder().encode(data),
    )
    const expectedSig = arrayBufferToBase64Url(sigBuffer)

    if (sig !== expectedSig) return false

    // Decode payload and check expiry
    const payload = JSON.parse(base64UrlDecode(data)) as { exp?: number }
    return typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4)
  return atob(padded)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
