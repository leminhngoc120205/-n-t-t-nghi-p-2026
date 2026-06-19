import { NextRequest } from 'next/server'
import { verifyToken, COOKIE_NAME } from '@/lib/auth'

export interface AuthPayload {
  userId: string
  username: string
  fullName: string
  role: 'admin' | 'editor' | 'reporter'
}

export function getRequestUser(req: NextRequest): AuthPayload | null {
  const token = req.cookies.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token) as AuthPayload | null
}
