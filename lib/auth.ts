import crypto from 'crypto'

// ─── Constants ───────────────────────────────────────────────────────────────
export const COOKIE_NAME = 'ims_session'
export const AUTH_SECRET = process.env.AUTH_SECRET || 'ims-cnnd-2026-secret-key-change-in-production'

const SESSION_DURATION_DEFAULT = 8 * 60 * 60 * 1000        // 8 hours (ms)
const SESSION_DURATION_REMEMBER = 7 * 24 * 60 * 60 * 1000  // 7 days  (ms)

// ─── Password utilities ──────────────────────────────────────────────────────

/**
 * Hash a plain-text password using PBKDF2 + random salt.
 * Returns a string in format "salt:hash" (both hex-encoded).
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex')
  return `${salt}:${hash}`
}

/**
 * Verify a plain-text password against a stored "salt:hash" string.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, hash] = storedHash.split(':')
    if (!salt || !hash) return false
    const verify = crypto.pbkdf2Sync(password, salt, 10000, 32, 'sha256').toString('hex')
    // timingSafeEqual prevents timing attacks
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(verify, 'hex'))
  } catch {
    return false
  }
}

// ─── Session token utilities (Node.js side) ──────────────────────────────────

export interface SessionPayload {
  userId: string
  username: string
  fullName: string
  role: string
  exp: number
}

/**
 * Create a signed session token.
 * Format: base64url(JSON payload) + "." + base64url(HMAC-SHA256 signature)
 */
export function createToken(
  payload: Omit<SessionPayload, 'exp'>,
  rememberMe = false,
): string {
  const exp = Date.now() + (rememberMe ? SESSION_DURATION_REMEMBER : SESSION_DURATION_DEFAULT)
  const data = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url')
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url')
  return `${data}.${sig}`
}

/**
 * Verify and decode a session token.
 * Returns the payload or null if invalid / expired.
 */
export function verifyToken(token: string): SessionPayload | null {
  try {
    const dotIdx = token.lastIndexOf('.')
    if (dotIdx === -1) return null
    const data = token.slice(0, dotIdx)
    const sig  = token.slice(dotIdx + 1)
    const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(data).digest('base64url')
    if (sig !== expectedSig) return null
    const payload = JSON.parse(Buffer.from(data, 'base64url').toString()) as SessionPayload
    if (payload.exp < Date.now()) return null
    return payload
  } catch {
    return null
  }
}

/**
 * Build the Set-Cookie header string for the session cookie.
 */
export function buildCookieHeader(token: string, rememberMe = false): string {
  const maxAge = rememberMe
    ? SESSION_DURATION_REMEMBER / 1000
    : SESSION_DURATION_DEFAULT / 1000
  const parts = [
    `${COOKIE_NAME}=${token}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Max-Age=${maxAge}`,
  ]
  if (process.env.NODE_ENV === 'production') parts.push('Secure')
  return parts.join('; ')
}

/**
 * Build a cookie header that clears the session (logout).
 */
export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}
